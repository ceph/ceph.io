---
title: "Mastering IAM in Ceph: Multi-Tenancy, Access Control, and Why ACLs Must Die"
date: "2026-01-24"
author: "Daniel Alexander Parkes, Anthony D'Atri"
categories: "rgw"
image: "images/5e07de10-5b83-4de3-a013-fd9c3f77427a.png"
tags:
  - "ceph"
  - "rgw"
  - "s3"
---

## Introduction

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1767549864482/5e07de10-5b83-4de3-a013-fd9c3f77427a.png)

## Introduction: When Security Theater Becomes a Real Disaster

In March 2017, a misconfigured S3 bucket at Verizon exposed the personal
information of 14 million customers. The root cause wasn't a sophisticated
attack; it was a simple oversight in access permissions. The bucket was
set to be publicly accessible due to S3 permission misconfiguration, and no one
noticed because ACLs were managed separately from the company's centralized IAM
policies. The security team had implemented careful, identity-based access controls,
but a resource-level ACL silently bypassed them by granting access to "All Users."

This scenario repeats constantly across the industry: ACLs creating invisible
access paths that security teams don't know exist, buckets accidentally exposed
to the public internet, and contractors uploading data that the bucket owner
cannot reliably read or administer, while still consuming capacity.

Between 2017 and 2019, major companies exposed hundreds of millions of records
via misconfigured S3 permissions (ACLs and/or bucket policies):

* **Verizon (2017)**: [14 million customers](https://www.techtarget.com/searchsecurity/news/450422709/Misconfigured-AWS-S3-bucket-exposes-millions-of-Verizon-customers-data) - An AWS S3 bucket configured for public access exposed names, addresses, account PINs
    
* **Facebook (2019)**: [540 million records](https://www.upguard.com/breaches/facebook-user-data-leak) - Third-party apps stored user data in publicly accessible S3 buckets
    
* **Instagram (2019)**: [49 million records](https://www.cpomagazine.com/cyber-security/instagram-breach-exposes-personal-data-of-49-million-users/) - Marketing firm left influencer database unprotected in AWS S3
    

The AWS response was clear: [since April 2023](https://aws.amazon.com/about-aws/whats-new/2023/04/amazon-s3-security-best-practices-buckets-default/),
**all new S3 buckets default to "ACLs disabled"** (BucketOwnerEnforced) and **Block Public Access enabled**.
AWS strongly recommends disabling ACLs on existing buckets and migrating to a pure
policy-based model with IAM Accounts architecture.

If you're running the Ceph Object Gateway (RGW), you have access to the same IAM
Accounts model introduced in Ceph Squid 19.2.0. This post explains why ACLs must
be disabled immediately and how to implement modern, secure access control with IAM policies.

> **Do This First (Quick Security Wins)**
> 
> Before reading further, take these two actions on all production buckets:
> 
> 1. **Enable Block Public Access** - Prevents public exposure via ACLs or bucket policies
>     
> 2. **Deny ACL operations** - Add explicit deny for `s3:PutObjectAcl` and `s3:PutBucketAcl` as defense-in-depth
>     
> 
> These changes prevent the attack patterns described in this post. Continue reading to understand why and how.

---

## Why ACLs Failed?

Access Control Lists (ACLs) were S3's original permission system. They failed
for several critical reasons that made them fundamentally unsafe for production use.

### Public Access Disasters

The most dangerous ACL failure was a silent public exposure. A single misconfigured
ACL could grant the entire internet access to your data, and your security team would
never know because ACLs weren't visible in centralized IAM policies.

How it happened:

```bash
$ export RGW_ENDPOINT="https://rgw.example.com"

# Developer accidentally makes object public during testing
$ aws --profile developer --endpoint-url "$RGW_ENDPOINT" s3api put-object-acl \
  --bucket bucketacl \
  --key hosts \
  --grant-read uri=http://acs.amazonaws.com/groups/global/AllUsers
$ aws --profile developer --endpoint-url "$RGW_ENDPOINT" s3api get-object-acl \
  --bucket bucketacl \ 
  --key hosts
{
    "Owner": {
        "DisplayName": "developer",
        "ID": "developer"
    },
    "Grants": [
        {
            "Grantee": {
                "Type": "Group",
                "URI": "http://acs.amazonaws.com/groups/global/AllUsers"
            },
            "Permission": "READ"
        }
    ]
}

# Security team checks IAM policies - looks fine (against the same RGW endpoint)

$ aws --profile account-root --endpoint-url "$RGW_ENDPOINT" iam get-user-policy \
  --user-name developer \
  --policy-name S3Access

# ✓ Least privilege, no issues detected

# Meanwhile, the object is public to anyone who can reach the RGW endpoint:

$ curl "$RGW_ENDPOINT/bucketacl/hosts" 
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
10.2XX.0.X   ceph01 

# Full access, no authentication required
# The same risk exists at bucket scope; a public bucket ACL enables unauthenticated listing
# which can leak keys and metadata

$ aws --profile developer --endpoint-url "$RGW_ENDPOINT" s3api put-bucket-acl \
--bucket bucketacl --acl public-read

# Unauthenticated Access to list bucket contents

$ curl -s "$RGW_ENDPOINT/bucketacl" | xmllint --format -
<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <Name>bucketacl</Name>
 ...
  <Contents>
    <Key>hosts</Key>
    <LastModified>2025-12-31T08:58:21.346Z</LastModified>
    <ETag>"71ae31ad9b6e7fda9cb5a8628b2e152a"</ETag>
    <Size>415</Size>
    <StorageClass>STANDARD</StorageClass>
    <Owner>
      <ID>developer</ID>
      <DisplayName>developer</DisplayName>
 ...
</ListBucketResult>
```

**Why was it catastrophic**?

1. **Decentralized control**: ACLs could be set per-bucket and per-object, creating millions of potential exposure points
2. **No visibility**: ACLs didn't appear in the IAM console - security teams had no way to audit them centrally
3. **Silent bypasses**: Even perfect IAM policies couldn't prevent an ACL from granting public access
4. **Object-level chaos**: With millions of objects, each having its own ACL, comprehensive auditing was impossible
    
**Real-world impact**: The three breaches in our introduction (Verizon, Facebook, Instagram) all involved publicly
accessible S3 data caused by permission misconfiguration (ACLs, bucket policies, or both), combined with weak central
visibility and auditing; exactly the problems that policy-based access control solves.

### The Object Ownership Problem

Beyond public access, ACLs created an ownership nightmare. When external accounts uploaded objects to your bucket, they owned those objects, not you.

```bash
# Contractor uploads data to your bucket
$ aws --endpoint-url "$RGW_ENDPOINT" s3 cp sensitive.pdf s3://company-bucket/contractor-data/ --profile contractor
upload: ./sensitive.pdf to s3://company-bucket/contractor-data/sensitive.pdf

# Who owns this object?
$ aws --endpoint-url "$RGW_ENDPOINT" s3api get-object-acl \
  --bucket company-bucket \
  --key contractor-data/sensitive.pdf \
  --profile contractor
{
    "Owner": {
        "DisplayName": "Contractor Account",
        "ID": "contractor"  ← Contractor owns it, not you!
    }
}

# You (bucket owner) can't READ the object
$ aws --endpoint-url "$RGW_ENDPOINT" s3 cp \
  s3://company-bucket/contractor-data/sensitive.pdf \
  ./test.pdf --profile company-admin
fatal error: An error occurred (403) when calling the HeadObject operation: Forbidden

# You can't even GET the ACL to see permissions
$ aws --endpoint-url "$RGW_ENDPOINT" s3api get-object-acl \
  --bucket company-bucket --key contractor-data/sensitive.pdf \
  --profile company-admin
fatal error: An error occurred (AccessDenied) when calling the GetObjectAcl operation: Access Denied


# You can't MODIFY the ACL
$ aws --endpoint-url "$RGW_ENDPOINT" s3api put-object-acl \
  --bucket company-bucket --key contractor-data/sensitive.pdf \
  --acl private --profile company-admin
fatal error: An error occurred (AccessDenied) when calling the PutObjectAcl operation: Access Denied
```

For on-premises Ceph deployments, while there's no per-GB billing surprise,
the **operational and compliance problems are identical**: you can't read,
audit, or manage data in your own infrastructure.

> In Ceph RGW, bucket owners CAN delete objects they don't own. However, they
> still can't read, view ACLs, or manage those objects, creating operational
> blind spots and compliance risks.

### The authenticated-read trap (over-sharing inside the cluster)

ACLs include grants that *appear* safer than "public" but remain dangerously broad.
In S3, `authenticated-read` grants read access to the `AuthenticatedUsers` group;
in Ceph RGW terms, that can translate to "any identity that can authenticate to
this RGW endpoint/cluster," not "only my team." On a shared on-premises
platform (multiple accounts, tenants, service accounts, CI users, integrations),
this can lead to accidental cross-team or cross-tenant data exposure.

```bash
# Finance team uploads "internal" data with authenticated-read
# (thinking it's safer than public)
$ aws --endpoint-url "$RGW_ENDPOINT" s3 cp finance-report.pdf \
  s3://company-bucket/finance-report.pdf \
  --acl authenticated-read --profile finance-team
 upload: ./finance-report.pdf to s3://company-bucket/finance-report.pdf

# Check the ACL - looks reasonable?
$ aws --endpoint-url "$RGW_ENDPOINT" s3api get-object-acl \
  --bucket company-bucket \
  --key finance-report.pdf --profile finance-team
{
    "Owner": {
        "DisplayName": "Finance Team",
        "ID": "finance-team"
    },
    "Grants": [
        {
            "Grantee": {
                "Type": "Group",
                "URI": "http://acs.amazonaws.com/groups/global/AuthenticatedUsers"
            },
            "Permission": "READ"  ← ANY authenticated user on the cluster!
        }
    ]
}

# DevOps team (completely different department) can read it!
$ aws --profile devops --endpoint-url "$RGW_ENDPOINT" s3 cp \
  s3://company-bucket/finance-report.pdf ./leaked.pdf
download: s3://company-bucket/finance-report.pdf to ./leaked.pdf

# Contractor user (or any other authenticated user) can also access it
$ aws --profile contractor --endpoint-url "$RGW_ENDPOINT" s3 cp \
  s3://company-bucket/finance-report.pdf ./contractor-copy.pdf
download: s3://company-bucket/finance-report.pdf to ./contractor-copy.pdf

# Anonymous users are still blocked
$ aws s3 cp s3://company-bucket/finance-report.pdf ./anon.pdf \
  --endpoint-url "$RGW_ENDPOINT" --no-sign-request
fatal error: An error occurred (403) when calling the HeadObject operation: Forbidden
```

### Public write is an integrity disaster, not just a leak

ACL errors are not solely about "read" exposure. With bucket ACLs, `public-read-write`
(or broad write grants) can enable untrusted PUT requests to a bucket. That turns into
an integrity incident: poisoned datasets, overwritten "golden" artifacts, malware
hosting, or backup tampering. Even on-prem "internal-only" does not save you; it
just changes the attacker's vector, but the threat still exists.

### WRITE_ACP is the "permission to rewrite permissions."

ACLs don’t just control data-plane actions; they can delegate control-plane authority
over the ACL itself. In Ceph RGW S3 semantics, `WRITE_ACP` the permission that allows
changing a bucket's ACL (required `WRITE_ACP` for `PUT Bucket ACL`). If the wrong
principal has it, they can escalate later by granting broader access (including
public exposure), and this delegation is distributed across buckets and objects.
This is a governance anti-pattern because the system contains a hidden "permission to change permissions."

```bash
# Step 1: Bucket owner grants contractor WRITE + WRITE_ACP
$ aws --endpoint-url "$RGW_ENDPOINT" s3api put-bucket-acl \
  --bucket company-bucket \
  --grant-write id=contractor \
  --grant-write-acp id=contractor \
  --profile developer

# Verify the ACL
$ aws --endpoint-url "$RGW_ENDPOINT" s3api get-bucket-acl \
  --bucket company-bucket --profile developer
{
    "Owner": {
        "DisplayName": "developer",
        "ID": "developer"
    },
    "Grants": [
        {
            "Grantee": {
                "DisplayName": "Contractor Account",
                "ID": "contractor",
                "Type": "CanonicalUser"
            },
            "Permission": "WRITE"
        },
        {
            "Grantee": {
                "DisplayName": "Contractor Account",
                "ID": "contractor",
                "Type": "CanonicalUser"
            },
            "Permission": "WRITE_ACP"  ← Contractor can modify ACLs!
        },
        {
            "Grantee": {
                "DisplayName": "developer",
                "ID": "developer",
                "Type": "CanonicalUser"
            },
            "Permission": "FULL_CONTROL"
        }
    ]
}

# Step 2: Contractor abuses WRITE_ACP to make bucket PUBLIC
$ aws --endpoint-url "$RGW_ENDPOINT" s3api put-bucket-acl \
  --bucket company-bucket \
  --acl public-read --profile contractor
# Success! Contractor just made the bucket public

# Step 3: Verify the escalation
$ aws --endpoint-url "$RGW_ENDPOINT" s3api get-bucket-acl \
  --bucket company-bucket --profile developer
{
    "Owner": {
        "DisplayName": "developer",
        "ID": "developer"
    },
    "Grants": [
        {
            "Grantee": {
                "Type": "Group",
                "URI": "http://acs.amazonaws.com/groups/global/AllUsers"
            },
            "Permission": "READ"  ← NOW PUBLIC! Anyone can list contents
        },
        {
            "Grantee": {
                "DisplayName": "developer",
                "ID": "developer",
                "Type": "CanonicalUser"
            },
            "Permission": "FULL_CONTROL"
        }
    ]
}

# Step 4: Anonymous users can now list the bucket
$ aws s3 ls s3://company-bucket/ \
  --endpoint-url "$RGW_ENDPOINT" --no-sign-request
2025-12-31 05:00:00         27 finance-report.pdf
# Public exposure complete
```

## The Solution: Stop using ACLs immediately

AWS and the Ceph Object Gateway (RGW) provide controls to disable ACLs
entirely. This should be your first action on any production bucket.

### Step 1: Block Public Access

Enforce public access blocks to prevent bucket ACLs from granting public access.

> **Ceph AWS CLI Configuration Note**
> 
> All `aws` CLI commands in this guide assume your AWS CLI profile is configured: See the [Ceph documentation on AWS CLI configuration](https://docs.ceph.com/en/latest/radosgw/s3/commons/#aws-cli-setup) and [AWS CLI endpoint configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) for details.

Bucket-level (Granularity per individual bucket):

```bash
# Anon access is enabled on bucket from previous example

$ aws s3 ls s3://company-bucket/ \
  --endpoint-url "$RGW_ENDPOINT" --no-sign-request
                           PRE contractor-data/
2025-12-31 07:13:55         26 finance-report.pdf

# We use public-access-block on our bucket

$ aws s3api put-public-access-block \
  --bucket company-bucket \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true \
  --endpoint-url "$RGW_ENDPOINT" \
  --profile developer

# Public access has been removed from the bucket,
# a non-authorized request fails after the put-public-access-block

$ aws s3 ls s3://company-bucket/ --endpoint-url "$RGW_ENDPOINT" --no-sign-request
fatal error: An error occurred (AccessDenied) when\
  calling the ListObjectsV2 operation: Access Denied
# Some AWS CLI versions surface certain error responses
# poorly; if you see a Python exception, re-run with
# --debug to confirm the underlying HTTP 403/AccessDenied.
```

What each setting does:

* **BlockPublicAcls**: Prevents new public ACLs from being applied (redundant if BucketOwnerEnforced, but adds defense in depth)
* **IgnorePublicAcls**: Ignores existing public ACLs (treats them as private)
* **BlockPublicPolicy**: Prevents bucket policies that grant public access
* **RestrictPublicBuckets**: Blocks public access to buckets even if policies exist

### Step 2: Deny ACL Operations via IAM Policy

As the root account administrator, you should establish a security baseline that
prevents ACL usage **by default** for all users and groups. This way, even if a
developer tries to use ACLs in the future, they'll get an immediate `Access Denied`
error, preventing accidents before they happen.

The governance pattern creates a standard "DenyACLs" policy that you attach to every
new user or group you create. This establishes ACL blocking as your organization's security baseline.

Create the standard policy:

```bash
$ cat > deny-acl-operations.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyACLOperations",
      "Effect": "Deny",
      "Action": [
        "s3:PutObjectAcl",
        "s3:PutObjectVersionAcl",
        "s3:PutBucketAcl"
      ],
      "Resource": [
        "arn:aws:s3:::*",
        "arn:aws:s3:::*/*"
      ]
    }
  ]
}
EOF
```

Here is an example of how to apply the policy to new users as you create them:

```bash
# Create a new developer
$ aws iam create-user --user-name alice
{
    "User": {
        "Path": "/",
        "UserName": "alice",
        "UserId": "4abb3a59-7991-4644-8863-347b02adc48f",
        "Arn": "arn:aws:iam::RGW89761398048153XXX:user/alice",
        "CreateDate": "2025-01-03T15:44:06.920034Z"
    }
}
$ aws iam create-access-key --user-name alice

# Immediately apply the ACL deny policy (before giving any other permissions)
$ aws iam put-user-policy \
  --user-name alice \
  --policy-name DenyACLs \
  --policy-document file://deny-acl-operations.json

# Now grant the user their actual S3 permissions
$ aws iam attach-user-policy --user-name alice --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
```

If Alice later tries to configure ACLs on any bucket, she will get `Access Denied`:

```bash
# Create a bucket as Alice, upload an Object and try to apply a public ACL on the Object
$ aws --profile alice --endpoint-url="$RGW_ENDPOINT" \
  s3 mb s3://alicebucket
$ aws --profile alice --endpoint-url "$RGW_ENDPOINT" \
  s3 cp finance-report.pdf s3://alicebucket
$ aws --profile alice --endpoint-url "$RGW_ENDPOINT" \
  s3api put-object-acl --bucket alicebucket --key \
  finance-report.pdf --acl public-read
#  Error: Access Denied
fatal error: An error occurred (AccessDenied) when calling the PutObjectAcl operation: Access Denied
# Some AWS CLI versions surface certain error responses poorly; if you see a Python exception, re-run with --debug to confirm the underlying HTTP 403/AccessDenied.
```

## "Wait, How Do I Share Data Now?"

With ACLs disabled, you might be wondering: How do I grant cross-account access
to share my datasets?

Previously, you might have used ACLs to grant a contractor account read access
to specific objects or allowed a partner account to upload files. With ACLs gone,
how do you securely share data between accounts?

**Two modern approaches exist**:

| Approach | How It Works | Access Pattern | Best For |
| --- | --- | --- | --- |
| **Bucket policies** | Resource owner adds bucket policy; requesting account adds identity policy | Direct, always-on access | Static, permanent sharing |
| **IAM Role assumption** | Resource owner creates an assumable role; requesting account assumes it | Temporary session (1-12h) | Dynamic, auditable access |

**We'll focus on IAM role assumption** because it provides:

* **Temporary credentials** that auto-expire (vs. permanent keys)
    
* **Detailed audit trails** showing who assumed what role and when (vs. static access logs)
    
* **Instant revocation** by deleting the role (vs. updating multiple policies)
    
* **Least privilege** with time-bound access (vs. always-on permissions)
    

This is also AWS's recommended pattern and follows zero-trust principles. Let's see how.

## IAM Accounts: The Modern Solution

The Ceph Object Gateway (RGW) implements AWS-compatible IAM Accounts, introduced in
Squid/19.2.0. This provides proper multi-tenancy with policy-based access control instead of ACLs.

### What is an IAM Account?

An **IAM Account** provides isolation for identities and access control:

```ini
Account: finance-team (ID: RGW12345678901234567)
├── Users & Groups (isolated per account)
├── Roles (isolated per account)  
├── Policies (fine-grained permissions)
└── S3 Buckets (owned by account)
```

> S3 bucket **names** are globally unique across ALL accounts in a flat namespace
> (just like AWS S3). If Finance creates a bucket called `financial-reports` no
> other account can use that name. However, bucket ownership and access control
> are account-specific, only Finance can manage their `financial-reports` bucket.

> *Ceph accounts can optionally belong to a tenant for namespace isolation. Within
> a tenant, bucket names are unique to that tenant; they are not globally unique across all tenants.*

Key distinction:

* **Account Root User**: Emergency admin access only, created with `--account-root` flag
* **IAM Users**: Day-to-day access, follows the least privilege principle

For this post, we'll assume you have two accounts already set up:

* **Finance Account** (ID: `RGW00893359550361292`)
* **DevOps Account** (ID: `RGW89761398048153888`)
    

> For a complete guide on creating IAM Accounts, users, and basic configuration,
> see our previous post: [Enhancing Ceph Multitenancy with IAM Accounts](https://ceph.io/en/news/blog/2025/enhancing-ceph-multitenancy-with-iam-accounts/).

## Cross-Account Sharing: The Modern Way

**Scenario**: Finance needs to give DevOps read-only access to backup data for
disaster recovery testing. Previously, this might have been done with ACLs. Now, we use cross-account role assumption.

**Requirements**:

* DevOps can read backups, but cannot modify or delete them
* Access uses temporary credentials (not long-term keys)
* Finance can revoke access instantly
* Fully auditable (who accessed what, when)
    

### How It Works

The key insight: Create a role in the Finance account (same account as the bucket).
When DevOps assumes this role, they temporarily "become" a Finance account principal with Finance credentials.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1765907670163/8b060b2d-6f10-4761-82b7-75717606b121.png)

This is the same STS pattern we covered in our [previous post on temporary credentials](https://ceph.io/en/news/blog/2025/rgw-modernizing-sts/),
but now applied to cross-account access.

### Implementation

#### 1. Finance Creates a Cross-Account Role for the Devops Team

Finance creates a role called `devops-backup-reader` in their account with two policies:

The Trust Policy (who can assume this role):

```bash
$ cat > trust-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "AWS": "arn:aws:iam::RGW89761398048153888:user/dave-backup-ops"
    },
    "Action": "sts:AssumeRole"
  }]
}
EOF
```

This says: ***"DevOps account user ‘dave’ can assume this role."***

> You can use in the trust policy the `RGWXXXX:root` formatting for the Principal.
> This gives access to all users in the devops account to assume the role. Then we
> could configure in the devops account to allow users from a specific IAM group to
> be able to assume the finance `devops-backup-reader` role.

And the Permission Policy (what the role can do):

```bash
$ cat > role-permissions.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": [
      "arn:aws:s3:::finance-backups",
      "arn:aws:s3:::finance-backups/*"
    ]
  }]
}
EOF
```

This says: **"*This role can list & read the finance-backups bucket.*"**

Once we have the policy files created, we can go ahead and create the IAM role `devops-backup-reader` :

```bash
$ aws --profile finance-admin s3 mb s3://finance-backups 
$ aws iam create-role \
  --profile finance-admin \
  --role-name devops-backup-reader \
  --assume-role-policy-document file://trust-policy.json

$ aws iam put-role-policy \
  --profile finance-admin \
  --role-name devops-backup-reader \
  --policy-name ReadBackups \
  --policy-document file://role-permissions.json
```

#### 2. DevOps User Accesses the Finance Account Dataset

Dave from the DevOps team assumes the role and gets temporary Finance credentials:

```bash
# Assume Finance role
$ aws --endpoint-url "$RGW_ENDPOINT" sts assume-role \
  --profile dave-backup-ops \
  --role-arn "arn:aws:iam::RGW00893359550361292:role/devops-backup-reader" \
  --role-session-name david-devops-backup-finance \
  --region default

{
    "Credentials": {
        "AccessKeyId": "ASIA****************",
        "SecretAccessKey": "REDACTED",
        "SessionToken": "REDACTED",
        "Expiration": "2025-0X-15TXX:00:00Z"
    }
}

# Use temporary credentials
$ export AWS_ACCESS_KEY_ID=ASIA****************
$ export AWS_SECRET_ACCESS_KEY=REDACTED
$ export AWS_SESSION_TOKEN=REDACTED

# Access Finance backups (using Finance account credentials!)
$ aws --endpoint-url "$RGW_ENDPOINT" s3 ls s3://finance-backups/
2025-01-14 02:00:00  daily-backup-2025-01-14.tar.gz

$ aws --endpoint-url "$RGW_ENDPOINT" s3 cp s3://finance-backups/daily-backup-2025-01-14.tar.gz .
download: s3://finance-backups/daily-backup-2025-01-14.tar.gz to ./daily-backup-2025-01-14.tar.gz
```

### Why This Works (And Why No Bucket Policy Is Needed)

The role `devops-backup-reader` is in the Finance account (same account as the
bucket). When Dave assumes this role, he receives temporary Finance account
credentials. From the bucket's perspective, this is same-account access:
only the role's policy is required; no bucket policy is needed.

The cross-account part: Only the AssumeRole action crosses accounts. The actual
bucket access is the same account (role and bucket), both in Finance.

### Security Benefits of This Approach

* **Temporary credentials**: Expire after 1 hour (configurable up to 12 hours)
* **No shared secrets**: DevOps never sees Finance's long-term keys
* **Instant revocation**: Finance deletes the role → all access stops immediately
* **Audit trail**: Logs show role name, session name, and requesting account
* **Least privilege**: Role has only read permissions, nothing more
* **Better than ACLs**: Centralized control, no object-level chaos

### What the Audit Logs Show

The Ceph Object Gateway (RGW) audit logs capture the
complete cross-account access pattern. Here's what you will see:

> **Note**: Ensure RGW audit logging is enabled. See the [Ceph documentation on bucket and object audit logging](https://docs.ceph.com/en/latest/radosgw/config-ref/#bucket-and-object-audit-logging) (OPS logs) for configuration details.

Example audit log extract when DevOps assumes the Finance role:

```json
$ tail -f /var/log/ceph/ops-log-ceph-client.rgw.default.ceph02.fvqogr.log | jq .
{
...
  "time": "2025-01-04T17:34:07.711570Z",
  "time_local": "2025-01-04T17:34:07.711570+0000",
  "remote_addr": "10.251.0.21",
  "user": "98b5e284-bd74-4a54-922e-cf1ee1d460c2",
  "operation": "assume_role",
  "uri": "POST / HTTP/1.1",
  "http_status": "200",
  "bytes_sent": 999,
  "user_agent": "aws-cli/1.38.34 md/Botocore#1.37.34 ua/2.1 os/linux#5.14.0-496.el9.x86_64 md/arch#x86_64 lang/python#3.9.19 md/pyimpl#CPython m/N cfg/retry-mode#legacy botocore/1.37.34",
  "referrer": "",
  "trans_id": "tx000001bb92497c13eba06-00695aa48f-494246-default",
  "access_key_id": "MPUWRVKZFH9XXXXXXX",
  "temp_url": false
}

# We can then get any specific details on this user
$ radosgw-admin user info --access-key=MPUWRVKZFH9XXXXXXX
{
    "user_id": "98b5e284-bd74-4a54-922e-cf1ee1d460c2",
    "display_name": "dave-backup-ops",
    "email": "",
    "suspended": 0,
    "max_buckets": 1000,
    ...
}
```

Example audit log extract when Dave from the DevOps Account accesses the Finance bucket:

```json
{
  "bucket": "finance-backups",
  "object": "daily-backup-2025-01-14.tar.gz",
  "time": "2026-01-04T17:42:35.956711Z",
  "time_local": "2026-01-04T17:42:35.956711+0000",
  "remote_addr": "10.251.0.21",
  "object_owner": "RGW00893359550361292",
  "user": "98b5e284-bd74-4a54-922e-cf1ee1d460c2",
  "operation": "get_obj",
  "uri": "GET /finance-backups/daily-backup-2025-01-14.tar.gz HTTP/1.1",
  "http_status": "200",
  "bytes_sent": 26,
  "bytes_received": 0,
  "object_size": 26,
  "total_time": 3,
  "user_agent": "aws-cli/1.38.34 md/Botocore#1.37.34 ua/2.1 os/linux#5.14.0-496.el9.x86_64 md/arch#x86_64 lang/python#3.9.19 md/pyimpl#CPython m/N cfg/retry-mode#legacy botocore/1.37.34",
  "trans_id": "tx00000a13eeac4ce551ce2-00695aa68b-494246-default",
  "authentication_type": "STS",
  "sts_info": {
    "role_name": "$devops-backup-reader",
    "role_session": "david-devops-backup-finance"
  },
  "temp_url": false
}
```

What this tells you:

* **Who**: Dave from DevOps (identified by role session name and the user uid)
* **When**: `2026-01-04T17:42:35.956711Z` (exact UTC timestamp)
* **What**: Downloaded `daily-backup-2025-01-14.tar.gz` from `finance-backups` bucket
* **How**: Via STS temporary credentials (`authentication_type: "STS"`)
    * Assumed role: `devops-backup-reader`
    * Session: `david-devops-backup-finance`
* **From where**: IP address `10.251.0.21`
* **Bucket owner**: Finance account `RGW00893359550361292`
* **Status**: Success (`http_status: 200`, 26 bytes transferred)
    
Key security insights from this log:

1. **Authentication type is explicitly marked as "STS"** - You can easily filter all temporary credential access
2. **User who assumed the role is identified** - (`98b5e284-bd74-4a54-922e-cf1ee1d460c2`)
3. **Role name is captured** - You know which role was used (`devops-backup-reader`)
4. **Session name is captured** - You can trace back to who initiated the session (Dave via `david-devops-backup-finance`)
5. **Object owner is logged** - Confirms the bucket belongs to the Finance account, not the accessor
6. **Full HTTP details** - User agent shows it was AWS CLI, complete with version
    
> Compared to ACLs: With ACLs, you had no audit trail showing who from which
> account accessed what. The logs only showed "someone accessed the object"
> with no attribution to the originating account or session context.

Comparison of IAM Roles Versus ACLs:

* ACLs: Decentralized, object-level, permanent, no audit trail of cross-account access
* IAM Roles: Centralized, temporary, revocable, full audit trail with account attribution
    
## Understanding Policy Evaluation

To use IAM effectively, you need to understand how permissions are evaluated.

### The Basic Rule

When a user requests access to an S3 resource, it follows the following workflow,
taking into account that any `DENY` always wins over `ALLOW`

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1765908590713/83e2782a-fffe-4b8b-a03c-8017778ba232.png)

> Explicit `DENY` always wins, even if there are multiple `ALLOW` statements.

### Same-Account vs Cross-Account

**Same-Account Access** (user and bucket in the same account):
* Permission needed in either the bucket policy or the identity policy
* One `ALLOW` is sufficient
    
**Cross-Account Access** (using role assumption):

* Permission needed for AssumeRole (on both sides - trust policy + identity policy)
* Role's identity policy grants bucket access (same-account from bucket's perspective)
* No bucket policy needed

## The Security Roadmap: Enterprise S3 Security Coming to Ceph

The Ceph community is making a significant investment in enterprise S3 security.
Several critical features are under active development to bring Ceph RGW to full
feature parity with AWS S3's modern security model. Here's what's coming and why it matters.

### BucketOwnerEnforced: Disabling ACLs (Coming in a Tentacle update)

Status: Merged into Ceph v20.3.0 (Tentacle) ([Issue #63323)](https://tracker.ceph.com/issues/63323)

What it does: The `PutBucketOwnershipControls` API with `BucketOwnerEnforced`
setting disables ACLs entirely and forces all objects to be owned by the bucket
owner regardless of who uploaded them.

The problem it solves:

Before (with ACLs):

* Contractor uploads → contractor owns object → you, as the owner of the bucket, can't delete it
* Developer sets ACL to public → bucket exposed to the internet
* Objects disappear from inventory (owned by other accounts)
    
After (BucketOwnerEnforced):

* Anyone uploads → you own the object → you control it completely
* ACLs are ignored → impossible to make the bucket public accidentally via ACLs
* All objects visible in your inventory reports
    

How it will work:

```bash
# Enable BucketOwnerEnforced on a bucket
$ aws s3api put-bucket-ownership-controls \
  --bucket company-data \
  --ownership-controls 'Rules=[{ObjectOwnership=BucketOwnerEnforced}]'
```

> Once enabled, any requests that include ACL headers (e.g., `--acl public-read`) will
> fail. Applications must be audited before enabling this feature on their buckets
> because if the application **is using ACLs** in their workflow the application
> requests using the ACL headers will start failing.

### S3Control API Block Public Access (Coming Soon)

Status: Active development, [PR #64293](https://github.com/ceph/ceph/pull/64293) under review

You've disabled ACLs in your Finance account. You've enabled Block Public Access.
Your security team is confident the Finance buckets are locked down. Then someone
in the Marketing account creates a new IAM user, spins up a bucket, and accidentally
makes it public during a website deployment test. Your Finance settings didn't apply
to Marketing's account because each account manages its own configuration independently.

This is where account-level controls become critical. While individual buckets can
have their own Block Public Access settings, managing hundreds or thousands of
buckets individually is error-prone. The S3Control API allows you to set
account-level defaults that apply automatically to all buckets in that
account, both existing and any new bucket created in the future.

Account-level enforcement prevents all public access:

```bash
# Block all public access for entire account
$ aws s3control put-public-access-block \
  --account-id RGW11111111111111111 \
  --public-access-block-configuration \
    BlockPublicAcls=true,\
    IgnorePublicAcls=true,\
    BlockPublicPolicy=true,\
    RestrictPublicBuckets=true
```

> Once the account administrator sets this policy using S3Control, regular account
> users cannot override it. If a user later tries to disable Block Public Access
> on a specific bucket, make a bucket public via ACL, or add a public bucket policy,
> all those attempts will fail with "Access Denied." The account-level setting takes
> precedence and cannot be bypassed by bucket-level operations. This creates a
> secure-by-default environment in which enabling public access using ACLs at
> the bucket-level is impossible.

What each setting will do:

* **BlockPublicAcls**: Prevents new public ACLs from being applied to buckets/objects
* **IgnorePublicAcls**: Ignores existing public ACLs (treats them as private)
* **BlockPublicPolicy**: Prevents bucket policies that grant public access
* **RestrictPublicBuckets**: Blocks public access even if policies exist
    
> Account-level Block Public Access is enforced by the account administrator on
> regular users within that account, but the account administrator themselves
> can still modify or disable it. For enforcement from a **higher authority**,
> you need organization-level controls. See the next section on Organizational
> Units and SCPs, which enable Ceph/RGW cluster administrators to enforce
> immutable policies across all accounts.

### Organizational Units and Service Control Policies (Future)

**Status**: Roadmap item for future Ceph releases

**What it will do**: Enable cluster administrators to enforce immutable security
policies across multiple accounts—policies that even account administrators cannot disable or modify.

**The problem it solves**: Account-level controls rely on administrator discipline.
A determined (or compromised) account administrator can disable Block Public Access
or re-enable ACLs. Organization-level controls provide actual enforcement from a
higher authority that cannot be bypassed.

**Example use cases** (when available):

* **Immutable Block Public Access**: Cluster admin sets organization-wide "no public buckets"
  policy: account admins cannot disable it
* **Required encryption**: Force all objects to use encryption → accounts cannot opt out
* **Cross-account access policies**: Restrict which accounts can share data with external accounts
* **Audit requirements**: Enforce logging and monitoring so that accounts cannot be disabled
    

This will provide enterprise multi-tenant governance that scales to thousands
of accounts with immutable top-down policy enforcement.

## Conclusion: Ceph's Enterprise Security Transformation

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1767550127997/3f2532cb-2bac-45d2-b99c-b69ff3f7fec6.png)

The migration from ACLs to IAM represents a fundamental shift in S3 security
philosophy: from decentralized, object-level chaos to centralized, policy-based control.

Available today in Ceph Squid and later:

1. IAM Accounts: Multi-tenant isolation with proper account boundaries
2. Cross-account role assumption: Secure data sharing with temporary credentials
3. Comprehensive audit logging: Full visibility into who accessed what, when, and how

Coming soon (active development):

4. BucketOwnerEnforced (Upcoming Tentacle update): Disable ACLs, fix ownership chaos
5. S3Control Block Public Access (Tentacle/Umbrella): Account-level public access prevention
6. Organizational Units & SCPs (future): Immutable cluster-wide security policies
    
The Ceph community is making a substantial investment to bring Ceph Object
Gateway (RGW) to full feature parity with AWS S3's modern security model.
The roadmap is clear, and the commitment is real.

The modern S3 security model is simpler, safer, and more auditable than ACLs ever
were. ACLs created invisible access paths that security teams couldn't see. IAM
policies are explicit, centralized, and visible in one place.

**Disable ACLs today**. Your future self will thank you.


Daniel would like to thank IBM for supporting the community with his time to create these posts.
