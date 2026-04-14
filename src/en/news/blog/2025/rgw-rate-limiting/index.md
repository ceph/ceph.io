---
title: "Ceph RGW Rate Limiting"
date: "2025-12-16"
author: "Daniel Alexander Parkes, Anthony D'Atri"
categories: "rgw"
image: "images/0c174a90-6fbe-45e9-8cd1-2725feed7fee.png"
tags:
  - "ceph"
  - "rgw"
  - "s3"
---

## Introduction

The Tentacle release introduces significant enhancements to Object Gateway (RGW)
rate limiting, addressing a critical gap that has long challenged administrators
managing multi-tenant object storage environments. With the addition of rate
limiting for `LIST` and `DELETE` operations, along with improved STS integration,
administrators now have more granular control over resource consumption across
their storage infrastructure.

## Understanding Rate Limiting in the Ceph Object Gatway (RGW)

Rate limiting in the Ceph Object Gateway has been a powerful tool for controlling
resource consumption and preventing individual users or applications from
monopolizing cluster resources. Before this enhancement, RGW supported rate
limiting for:

* Read operations (`max-read-ops`): Controlling GET request frequency
* Write operations (`max-write-ops`): Limiting PUT request rates
* Read bandwidth (`max-read-bytes`): Throttling data egress
* Write bandwidth (`max-write-bytes`): Controlling data ingress

These limits operate within configurable time windows (controlled by
the `rgw_ratelimit_interval` option), traditionally defaulting to 60
seconds. The system uses a token bucket algorithm to track resource
consumption, and when limits are exceeded, RGW returns `HTTP 503`
responses to throttle clients.

### The Scope of Rate Limiting

Rate limits can be applied at multiple scopes:

* User scope: Limits apply to a specific user across all buckets
* Bucket scope: Limits apply to operations in a particular bucket
* Global scope: Limits apply cluster-wide across all users and buckets
* Anonymous scope: Limits for unauthenticated requests
    
### Important Architectural Considerations

The Ceph Object Gateway's rate-limiting feature is not a complete QoS system. Key points:

* Per-RGW enforcement: Limits are enforced per RGW instance, not cluster-wide.
  With 2 RGWs and a desired 10 ops/minute limit, configure each RGW for 5 ops/minute.
  If the client request load isn't evenly distributed across the endpoints, the required
  limits may be lower than expected.
    
* Limit intersection: Both user-level AND bucket-level limits must be satisfied.
  Requests are rejected if either limit is exceeded.
    
* No traffic shaping: Throttled requests are immediately rejected (503) rather than queued.
    
* No mid-request throttling: Bandwidth is counted after a request completes, not
  during. Users who exceed limits go into "debt" (max: 2x the limit) and are
  blocked from new requests until the next interval(s) repay the debt.
    
## The Problem: Missing Control for List and Delete Operations

While read and write operation limits provided good coverage for data transfer
operations, two critical operation types remained uncontrolled:

### List Operations

Bucket listing operations, particularly against buckets with millions of objects,
can place a significant load on the cluster. These operations:

* Scan bucket indexes extensively
* Consume RADOS read IOPS on index pools
* Can impact overall cluster performance when executed at high frequency
* Are costly when using prefixes and delimiters that require filtering
    
Previous limitation: `LIST` operations (which use `GET`/`HEAD` HTTP methods) were counted
as read operations under the `max-read-ops` limit, making it impossible to control
listing separately from regular `GET` operations. This meant administrators couldn't
prevent list-heavy workloads from consuming the entire read operation budget while
still allowing standard data retrieval.

Consider a workload performing checkpoint validation by repeatedly listing with prefixes like:

`$ aws s3api list-objects-v2 --bucket data --prefix checkpoint-flag --max-items 1`

Even though this returns minimal data, each request triggers index scanning
operations that consume cluster resources.

As an example, Apache Iceberg tables in data lakehouse environments have been
particularly challenging to maintain metadata for Iceberg's `deleteOrphanFiles`
procedure, which cleans up unreferenced data files, requiring complete table
listings that can overwhelm object storage systems.

![](images/f06a38ed-1eb5-4457-a13e-45a0eba48684.png align="center")

### Delete Operations

Single-object and multi-object delete operations were also uncontrolled, creating challenges for:

* Preventing abuse during bulk deletion scenarios
* Managing garbage collection workload
* Controlling the rate at which storage capacity is reclaimed
* Protecting against accidental or malicious mass deletion events
    
Previous limitation: DELETE operations were classified as write
operations (non-GET/HEAD HTTP methods) and counted against `max-write-ops`,
making it impossible to limit deletion rates from PUT operations separately.
Workloads that combined uploads and deletions had to balance their write-ops
budget across both operation types.

Without dedicated controls for these operations, administrators had limited
options for managing workloads that mixed listing, reading, writing, and
deleting operations in different proportions.

## The Solution: Enhanced Rate Limiting in Tentacle

![](images/a0ea6524-e006-496b-b2bf-855834372d56.jpeg align="center")

Tentacle introduces two new rate-limiting parameters that address these gaps.

### New Configuration Options

* Max-list-ops: Specifies the maximum number of bucket listing requests per
  accumulation interval. A value of 0 (default) disables this limit, maintaining
  backward compatibility.
* Max-delete-ops: Specifies the maximum number of delete operations per accumulation
  interval. A value of 0 (default) disables this limit.

### Critical: Backward Compatibility Behavior

Important: The new limits work *in conjunction with* existing read/write operation limits:

* `LIST` operations: Count against both `max-read-ops` AND `max-list-ops`
* `DELETE` operations: Count against both `max-write-ops` AND `max-delete-ops`

Both limits must be satisfied for a request to proceed. Administrators upgrading
from earlier versions will see no behavior change unless they explicitly configure
the new parameters.

![](images/36e1a637-6316-40de-90d6-df76a8fcb97f.png align="center")

### Configurable Time Windows

The `rgw_ratelimit_interval` configuration option allows administrators to adjust
the interval for rate limit accumulation. This is particularly important for
workloads that exhibit bursty behavior:

```bash
$ ceph config set client.rgw.rgw.1 rgw_ratelimit_interval 10
```

The default 60-second interval may not be optimal for all workloads. Bursty
workloads, such as Apache Iceberg's metadata maintenance operations (snapshot
expiration, orphan file cleanup), can exhaust their LIST operation budget in
the first few seconds of a time window. Since Iceberg's `deleteOrphanFiles`
procedure performs complete table listings across potentially thousands of
partitions in rapid succession, the accumulated operations can quickly exceed
the rate limit, resulting in extended throttling periods during which subsequent
maintenance tasks are blocked. Shorter intervals (1-10 seconds) can provide more
consistent behavior by allowing the operation budget to replenish more frequently,
preventing long stalls in critical table maintenance workflows.

### STS Integration

A new enhancement to the STS/IAM feature ensures that rate limits now apply
correctly when users authenticate with temporary credentials obtained via the
Security Token Service (STS):

* User rate limits configured on an account continue to be enforced when
  that user assumes an IAM role and operates with temporary credentials.
* Bucket rate limits are enforced adequately for operations performed using
  STS credentials, regardless of how the user authenticated.
* Global rate limits now work seamlessly with federated authentication flows,
  such as AssumeRoleWithWebIdentity.

This closes a previous gap where rate limiting enforcement may not have worked
correctly with STS sessions, ensuring consistent rate limit policies across all
authentication methods.

## Rate Limiting Configuration Examples

### Example 1: Configuring LIST Operation Rate Limits

Set up a user with list operation limits to control the frequency of bucket listings.

Create a test user:

```bash
$ radosgw-admin user create --uid=testuser --display-name="Test User"
{
    "user_id": "testuser",
    "display_name": "Test User",
    "email": "",
    "suspended": 0,
    "max_buckets": 1000,
    "subusers": [],
    "keys": [
        {
            "user": "testuser",
            "access_key": "TESTUSER_ACCESS_KEY",
            "secret_key": "TESTUSER_SECRET_KEY"
        }
    ],
    "caps": [],
    "op_mask": "read, write, delete",
    "type": "rgw"
}
```

Set rate limits for list operations. We have two RGW services deployed in our
cluster, so if we want to limit the operations to 10, we need to divide the
ops limit by the number of RGWs running in the cluster:

```bash
$ radosgw-admin ratelimit set --ratelimit-scope=user --uid=testuser \
    --max-list-ops=5 \
    --max-read-ops=100
```

Enable rate limiting for this user:

```bash
$ radosgw-admin ratelimit enable --ratelimit-scope=user --uid=testuser
```

Verify the configuration:

```bash
$ radosgw-admin ratelimit get --ratelimit-scope=user --uid=testuser
{
    "user_ratelimit": {
        "max_read_ops": 100,
        "max_write_ops": 0,
        "max_list_ops": 5,
        "max_delete_ops": 0,
        "max_read_bytes": 0,
        "max_write_bytes": 0,
        "enabled": true
    }
}
```

### Example 2: Configuring DELETE Operation Rate Limits

Set up delete operation limits to control the rate of deletions.
Set rate limits for delete operations on the same user:

```bash
$ radosgw-admin ratelimit set --ratelimit-scope=user --uid=testuser \
    --max-delete-ops=10 \
    --max-write-ops=100
```

Verify the updated configuration:

```bash
$ radosgw-admin ratelimit get --ratelimit-scope=user --uid=testuser
{
    "user_ratelimit": {
        "max_read_ops": 100,
        "max_write_ops": 100,
        "max_list_ops": 5,
        "max_delete_ops": 10,
        "max_read_bytes": 0,
        "max_write_bytes": 0,
        "enabled": true
    }
}
```

## Observing Rate Limiting in Action

Let's see what happens when a user exceeds their configured limits.

### Test Scenario: Exceeding List Operation Limits

With the configuration from Example 2 (5 list ops per RGW, 10 list
ops total per minute), configure AWS CLI with test credentials:

```bash
$ aws configure set aws_access_key_id TESTUSER_ACCESS_KEY
$ aws configure set aws_secret_access_key TESTUSER_SECRET_KEY
```

Create a test bucket:

```bash
$ aws --endpoint-url http://rgw.example.com s3 mb s3://test-bucket
make_bucket: test-bucket
```

Populate the bucket with test objects:

```bash
$ for i in {1..100}; do
    echo "Test object $i" | aws --endpoint-url http://rgw.example.com s3 cp - s3://test-bucket/object-$i
done
```

Rapidly execute list operations to exceed the limit. I will use a script that
uses `curl` to list the contents of the bucket `test-bucket` repeatedly:

```bash
bash script.sh
Testing Rate Limit with list-objects-v2...
------------------------------------------------
Attempt 1: ✅ SUCCESS (200)
Attempt 2: ✅ SUCCESS (200)
Attempt 3: ✅ SUCCESS (200)
...
Attempt 10: ✅ SUCCESS (200)
Attempt 11: 🛑 BLOCKED (503) - Limit Reached
Attempt 12: 🛑 BLOCKED (503) - Limit Reached
Attempt 13: 🛑 BLOCKED (503) - Limit Reached
```

### Testing Delete Rate Limits

Attempt to delete objects beyond the configured limit (20 deletes per minute) with the AWS CLI client:

```bash
$ for i in {1..25}; do
    echo "Delete attempt $i"
    aws --endpoint-url http://rgw.example.com s3 rm s3://test-bucket/object-$i 2>&1 | grep -E "delete:|error"
done
Delete attempt 1
delete: s3://test-bucket/object-1
Delete attempt 2
delete: s3://test-bucket/object-2
Delete attempt 3
delete: s3://test-bucket/object-3
...
Delete attempt 19
delete: s3://test-bucket/object-19
Delete attempt 20
delete: s3://test-bucket/object-20
Delete attempt 21
delete failed: s3://limits-bucket/object-21 argument of type 'NoneType' is not iterable
Delete attempt 22
delete failed: s3://limits-bucket/object-22 argument of type 'NoneType' is not iterable
```

## Known Limitations and Future Enhancements

### Current Limitations

1. *Backward Compatibility Constraint**: LIST operations still count against
   max-read-ops, and DELETE operations count against max-write-ops. The
   new  `max-list-ops` and `max-delete-ops` limits provide additional
   constraints but do not replace the legacy limits. Both limits must be
   satisfied for a request to proceed. This design choice maintains backward
   compatibility but means you cannot completely isolate LIST/DELETE operations
   from general read/write operation budgets.
    
2. *Multi-Object Delete*: The S3 DeleteObjects API (bulk delete) is not
   currently rate-limited but is tracked for future
   enhancement: [RFE](https://bugzilla.redhat.com/show_bug.cgi?id=2393080)
    
3. *IAM Account Limitation*: Rate limits on IAM accounts (as opposed to
   users) do not currently work. This is tracked as an RFE for a future
   release. [RFE](https://bugzilla.redhat.com/show_bug.cgi?id=2394369)
    
4. *Multipart Upload Accounting*: During multipart uploads with limited
   write ops, the `CreateMultipartUpload`, `UploadPart`,
   and `CompleteMultipartUpload operations` each count against the write-ops
   limit. For large files split into many parts, this can quickly consume the
   operation budget. [RFE](https://bugzilla.redhat.com/show_bug.cgi?id=2396664)
    
5. *Improved Logging Output*. Currently, when hitting a rate limit, we see only
   the following opaque errors in the RGW log, which don’t specify which rate
   limit we have reached. [RFE](https://bugzilla.redhat.com/show_bug.cgi?id=2396664)
    

```bash
2025-11-20T16:39:40.030+0000 7f9e6423a640  2 req 15365199512736087891 0.001000024s s3:delete_obj check rate limiting
2025-11-20T16:39:40.030+0000 7f9e6423a640 20 req 15365199512736087891 0.001000024s op->ERRORHANDLER: err_no=-2218 new_err_no=-2218
2025-11-20T16:39:40.030+0000 7f9e6423a640  2 req 15365199512736087891 0.001000024s s3:delete_obj http status=503
```

## Conclusion

The addition of `LIST` and `DELETE` operation rate limiting in Tentacle represents
a significant maturity improvement for the Object Gateway. Combined with the new
STS integration and configurable time intervals, administrators now have
comprehensive tools for managing multi-tenant object storage workloads.

These enhancements are particularly valuable for:

* *Enterprises* implementing department-level chargebacks and resource governance
   
* *Cloud-native applications* using federated identity with OIDC
    
* *Data analytics platforms* with mixed read-heavy and metadata-intensive operations
    

While some limitations remain (particularly around multi-object delete and IAM
accounts), the current implementation provides production-ready capabilities
that have been extensively tested with workloads ranging from small-object writes
to multi-million object listings.

## Get Involved

We encourage you to test these new capabilities in your environment and share
your experiences with [the community](https://docs.ceph.com/en/latest/start/get-involved).


The authors would like to thank IBM for supporting the community with our time to create these posts.

Special thanks to the Ceph community and the IBM Storage Ceph QE team for their
extensive testing and validation of these features, covering functional, scale,
and regression scenarios with millions of objects and hundreds of gigabytes of
test data.
