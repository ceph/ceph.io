---
title: "Breaking the Static Key Habit: Modernizing Ceph RGW S3 Security with STS"
date: "2025-12-18"
author: "Daniel Alexander Parkes, Anthony D'Atri"
categories: "rgw"
image: "images/be4215b8-cbd0-48f0-9f21-5bd3e4fffd6d.png"

tags:
  - "ceph"
  - "rgw"
  - "s3"
---

## Introduction: The USD 148 Million Lesson

In late 2016, [Uber](https://www.uber.com/en-CH/newsroom/2016-data-incident)
learned that intruders had accessed a trove of personal data stored in an
Amazon S3 bucket. The entry point was painfully mundane: attackers accessed
Uber's source code on GitHub using stolen credentials, found an AWS credential,
and used it to access Uber’s data. That single, long-lived credential exposed
data on roughly 57 million users and 600,000 drivers.

The breach was bad; the duration risk was worse. Static access keys do not expire.
Once leaked, they remain active until someone notices, locates every instance in
use, and rotates them. That makes credential theft uniquely dangerous in cloud
and S3-style storage, because an attacker can repeatedly return, automate access,
and quietly expand their footprint.

Uber ultimately agreed to a $148 million multistate settlement related to how
the incident was handled and disclosed. The exact dollar figure is not the
main lesson, though. The lesson is this: a single static key can turn a small
mistake into a durable breach.

If you are running the Ceph Object Gateway (RGW), you face the same dynamic:
S3 credentials in an application configuration file `config.yaml`, embedded
in scripts, or stored in CI/CD variables. Each one is a long-lived credential
that, once copied, can be used from anywhere the S3 endpoint is reachable.

This post shows you how to eliminate static credentials using Security Token
Service (STS) with temporary credentials that expire automatically. By the end,
you'll understand how to implement the same security model that prevented these
breaches from being even worse, and how to adapt it for Ceph RGW.

## The Static Credential Problem

Let's take a look at some examples of how most applications access S3 storage today:

```yaml
# app-config.yaml (application config file)
s3:
  endpoint: https://s3.example.com
  access_key: AKIA1234567890ABCDEF
  secret_key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
  bucket: production-data
```

Or with the credentials embedded directly in code:

```python
# backup.py
import boto3

s3 = boto3.client(
    's3',
    endpoint_url='https://s3.example.com',
    aws_access_key_id='AKIA1234567890ABCDEF',
    aws_secret_access_key='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
)
```

Or in environment variables (slightly better, but not by much):

```bash
export AWS_ACCESS_KEY_ID=AKIA1234567890ABCDEF
export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

## Why This Is Dangerous?

### The Permanence Problem

The fundamental issue with static credentials is that they never expire. Once
created, these keys authenticate requests indefinitely, working the same on
day one as they do five years later. This creates a dangerous organizational
memory gap. Keys made in 2020 still work in 2025, but no one remembers which
application uses them, what permissions they have, or whether they're even
still needed. When rotation finally becomes necessary, it requires coordinated
updates across all applications simultaneously, often in the middle of an
incident when coordination is most difficult.

### Key Proliferation

Static credentials spread like a virus through an organization's infrastructure.
They start in a configuration file for a single application, then get copied
into container images where they're baked into immutable layers. They're added
to CI/CD pipelines where they're shared across multiple projects. Developers
copy them to their laptops for testing, where they sync to cloud backup services.
They end up in documentation and internal wikis, pasted as "helpful examples" for
other teams. Each copy represents another attack vector, another place where the
credentials might leak.

### The Revocation Nightmare

When credentials are eventually stolen, and with this level of exposure, it's
*when*" not *if*. The response options are replete with shortcomings. The
credentials work from anywhere where the S3 endpoint is accessible, so there's
no easy way to distinguish legitimate requests from attacker activity. Revoking
them immediately breaks every application that depends on those keys, forcing
an emergency deployment across potentially dozens of services. The alternative
is to leave them active while attackers maintain access, then race to update
applications before further damage occurs. Organizations need to coordinate
emergency updates during an active security incident, precisely when
coordination is hardest.

### The Permission Accumulation Problem

Static keys tend to accumulate permissions over time. They start with minimal
access, but as requirements evolve, it's easier to grant permissions than to
audit what's truly necessary carefully. _This key needs to read and write,
just to be safe._ _Let's give it access to all buckets; we might expand to
new ones later._ No one wants to risk disrupting production by restricting
access, mainly when credentials are spread across so many systems that tracking
down every usage point seems impossible.

### The Real Cost

The Uber incident shows the real cost of a leaked static key. A single exposed
AWS access key pai9r exposed sensitive data to roughly 57 million users and
600,000 drivers, and Uber later agreed to a USD 148 million multistate settlement
related to the incident and its handling.

The uncomfortable truth is that static keys turn small mistakes into persistent
breaches because credentials do not naturally "die”. Without expiration,
containment depends entirely on detection and coordinated rotation across
every place that the key has spread.

## The Solution: Temporary Credentials via STS

Security Token Service (STS) fundamentally reimagines how applications
authenticate with S3. Instead of using permanent credentials that live
forever, applications request temporary credentials that expire automatically
after a defined window, typically between fifteen minutes and twelve hours.
This simple shift transforms the entire security model.

The mechanics work like this: Applications maintain a minimal service account
that is authorized to assume a role. When the application needs to access S3,
it calls the STS service using those service account credentials to request
temporary credentials for a specific role. STS validates that the service
account is authorized to assume that role, then issues time-limited credentials.
The application uses these temporary credentials for actual S3 operations. When
they expire, the application requests fresh credentials. The entire process is
transparent to the application's business logic.

![](images/sequence.png align="center")

### The Security Transformation

With static keys, credentials remain valid indefinitely. Once stolen, they persist
indefinitely. STS eliminates these problems through automatic expiration. When an
application calls `AssumeRole`, it specifies a `DurationSeconds` parameter that
defaults to 3600 seconds (one hour). The temporary credentials returned include
an expiration timestamp that cannot be modified or extended. If an attacker steals
temporary credentials from a compromised server or intercepts them in transit, those
credentials become worthless the moment they expire.

The audit trail improves dramatically as well. Instead of seeing generic access
key IDs that could be used by any application anywhere, the RGW logs now show
which specific role was assumed (`role_name`) and the session name provided when
the role was assumed (`role_session_name`). When applications use descriptive
session names that include the application name and a timestamp, security teams
can immediately identify which application and which specific execution generated
each request. This attribution becomes critical during incident response, when
distinguishing legitimate traffic from attacker activity can mean the difference
between containing a breach and suffering a complete data exfiltration.

Consider the compromise scenario: An attacker gains access to a production server
and dumps memory, capturing the application's current S3 credentials. With static
keys, this can represent full, ongoing access to your data, potentially for months
before detection. With STS, the attacker has at most one hour before those credentials
expire and become useless. STS is not a silver bullet: it will not stop an attacker
already on the host. It does put every stolen credential on a timer, which sharply
limits persistence and reduces the “evergreen access key” problem. The application
continues to operate normally, automatically refreshing its credentials; incident
response can focus on evicting the attacker and preventing further refreshes rather
than racing to replace long-lived keys everywhere.

#### "Wait, aren't we still using a static key to assume the role?"

Yes, but with a critical difference. The service account (e.g., `backup-service`)
possesses static Access and Secret Keys, but this user has zero permissions to
access S3 data. It cannot list buckets, read objects, or delete data.

Its only capability is to call the STS API to assume a specific Role. If these
credentials are leaked, an attacker cannot directly steal data. They would have
to know which Role to assume and how to use it, which would add significant
friction. Furthermore, you have traces in the audit logs, and you can rotate
these service keys without disrupting the application's active S3 sessions.

## Quick Primer: Understanding Roles (Just What You Need for STS)

Roles are part of the IAM (Identity and Access Management) API, which the Ceph
Object Gateway (RGW) implements to provide AWS-compatible identity management.
In this post, we focus on how roles enable STS-based authentication. We'll dive
deeper into the full IAM capabilities, including users, groups, policies, and
account-level governance, in a specific IAM security post coming soon.

### The Role Structure

Every role has two policies:

* Trust Policy - Defines who can assume the role

* Permission Policy - Defines what the role can do once assumed

Here's the complete flow: Your application holds a minimal service account that
is authorized to assume a role (via the role trust policy, an identity policy,
or both). When it needs to work (e.g., access S3 resources), it calls STS to
assume a role (e.g., `backup-reader`). STS checks the role's trust policy,
validates the request, and issues temporary credentials (access key, secret
key, session token) that inherit the role's permissions. Those credentials
expire after one hour. The application uses them for S3 operations and
automatically requests new credentials as needed.

Here is an example Trust Policy (who can assume the role) allowing the
user `backup-service` to assume the role:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"AWS": "arn:aws:iam::123456:user/backup-service"},
    "Action": "sts:AssumeRole"
  }]
}
```

Here is an example Permission Policy (what the role can do),
allowing read-only access to the bucket `backups`:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": [
      "arn:aws:s3:::backups",
      "arn:aws:s3:::backups/*"
    ]
  }]
}
```

In this post, we'll use inline policies (policies embedded directly in the role).
There are other canned policy types available in the IAM API, which we'll cover
in a future IAM post.

### Beyond Service Accounts: Single Sign-on Authentication with OIDC Integration

The pattern we'll implement uses a service account with static credentials to
assume roles. However, RGW also supports `AssumeRoleWithWebIdentity`, which
allows applications to assume roles using tokens from an enterprise identity
provider (such as RHSSO (Keycloak), IBM Security Verify, etc.) via OpenID
Connect (OIDC). This eliminates the need for static credentials: applications
authenticate via your existing SSO system to obtain a JWT, which they then use
to request a temporary credential directly from the STS API. This is the most
secure option for organizations with mature identity infrastructure, though it
requires additional OIDC provider configuration in RGW. We'll cover this
advanced pattern in a future post on identity federation.

## Implementing STS in Ceph RGW: Step by Step

This implementation builds on the IAM foundation covered
in [Enhancing Ceph Multitenancy with IAM Accounts.](https://ceph.io/en/news/blog/2025/enhancing-ceph-multitenancy-with-iam-accounts)
If you're new to Ceph IAM accounts, that post covers account creation, user
management, and policy basics. Here, we focus specifically on enabling STS
and using roles for temporary credentials.

Let's build on an example use case. We'll create a role for a backup service
that needs read-only access to a specific bucket.

To follow this guide, you will need:

Admin access to the Ceph cluster: SSH access to a node where you can
run `ceph` and `radosgw-admin` commands.

AWS CLI: Installed on your workstation to interact with the RGW S3 endpoint.

Python 3 and Boto3: For running the automation scripts (`pip install boto3`).

Ceph Squid or later: While basic STS works on older versions, the IAM Accounts
feature used in this guide requires Ceph Squid (19.2.0) or newer.

### Step 1: Enable STS in RGW Configuration

STS must be explicitly enabled in your RGW configuration. The configuration
uses the Ceph config database and requires two settings.

Generate a secure STS key (must be exactly 16 characters):

```bash
# Generate a 16-character random key
$ openssl rand -hex 8
# Example output: 0a1b2c3d4e5f6789
```

Configure RGW to use STS:

Most deployments use client.rgw.default as the RGW client identifier. If your
deployment uses a custom service name, replace default with your service name.

```bash
# Set the STS encryption key (MUST be exactly 16 characters)
$ ceph config set client.rgw.default rgw_sts_key 0a1b2c3d4e5f6789

# Enable STS authentication
$ ceph config set client.rgw.default rgw_s3_auth_use_sts true
```

*Ceph-Specific Configuration Note*

_Unlike AWS, where STS is a global service enabled by default, Ceph requires you
to explicitly configure the encryption key used to sign the session tokens._

*Critical Requirement*: The `rgw_sts_key` must be exactly 16 characters long.
If it is 15 or 17 characters, the STS handshake will fail silently or with
opaque 500 errors.

Restart all RGW instances to apply changes:

```bash
# For default service
$ ceph orch restart client.rgw
```

Verify the configuration:


```bash
$ ceph config get client.rgw.default rgw_s3_auth_use_sts
$ ceph config get client.rgw.default rgw_sts_key
```

### Step 2: Create IAM Account, Root User, and Service User

IAM accounts provide multi-tenancy and resource organization. We'll create an
account, a root user for administrative tasks, and a restricted service user
for applications.

#### Create the IAM account:

```bash
$ radosgw-admin account create  --account-name=backup-team 
{
    "id": "RGW89761398048153888",
    "tenant": "",
    "name": "backup-team",
    "email": "",
    "quota": {
        "enabled": false,
        "check_on_raw": false,
        "max_size": -1,
        "max_size_kb": 0,
        "max_objects": -1
    },
    "bucket_quota": {
        "enabled": false,
        "check_on_raw": false,
        "max_size": -1,
        "max_size_kb": 0,
        "max_objects": -1
    },
    "max_users": 1000,
    "max_roles": 1000,
    "max_groups": 1000,
    "max_buckets": 1000,
    "max_access_keys": 4
}
```

#### Create the Account Root User (for administrative tasks)

The account root user has full permissions on all resources within the account
by default, including the ability to use the IAM API to create roles and manage
policies. This is built into the account system; no additional capabilities are
needed.

#### Create the root user for the account:

```bash
$ radosgw-admin user create   --account-id=RGW89761398048153888 \
  --uid=backup-admin   --display-name="Backup-Team-Admin" \
  --account-root   --gen-access-key   --gen-secret
```

The `--account-root` flag is critical: it designates this user as the account's
root user, granting full administrative permissions within the account's scope.

The Ceph documentation stats that: _Account owners are encouraged to use this
account root user for management only, and create users and roles with fine-grained
permissions for specific applications._

For this tutorial, we'll use the root user for setup tasks to keep things simple.
In production, you would typically use the root user to set up IAM users with
specific permissions, then remove or restrict the root user's credentials.

### Create the Backup Service User (for applications)

This user will have minimal permissions, only the ability to assume roles.
No direct access to S3 resources.

```bash
$ radosgw-admin user create \
  --account-id=RGW89761398048153888 \
  --uid=backup-service \
  --display-name="backup-service" \
  --gen-access-key \
  --gen-secret
```

_The service account has no S3 permissions and no IAM capabilities. It can only
assume roles that explicitly trust it._

### Configure AWS CLI Profiles

Configure two AWS CLI profiles, one for each user. Each profile contains the user's
credentials and the RGW/STS endpoint URL, so we don’t need to specify the endpoint
on each `AWS CLI` command. See
the [AWS CLI configuration documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
for details.

### AWS Profile summary for this setup:

* `backup-admin` profile: Uses root user credentials, S3/IAM/STS endpoint https://s3.cephlabs.com
* `backup-service` profile: Uses service account credentials, S3/IAM/STS endpoint https://s3.cephlabs.com

Here is an example `.aws/config` file:

```ini
[profile backup-admin]
region = default
output = json
services = ceph-rgw

[profile backup-service]
region = default
output = json
services = ceph-rgw

[services ceph-rgw]
s3 =
  endpoint_url = https://s3.cephlabs.com
s3api =
  endpoint_url = https://s3.cephlabs.com
iam =
  endpoint_url = https://s3.cephlabs.com
sts =
  endpoint_url = https://s3.cephlabs.com
```

Verify both profiles:

```bash
# Test root user (should work - has full permissions)
$ aws s3 ls --profile backup-admin

# Test service user (should fail - has no S3 permissions yet)
$ aws s3 ls --profile backup-service
# Expect: AccessDenied in RGW logs
argument of type 'NoneType' is not iterable
```

### Identity Summary

At this point, you have two users in the IAM account:

||User||Type||Permissions||Used For||
|`backup-admin`|Account root user (`--account-root`)|Full permissions on all account resources + IAM API access	Creating buckets, creating/managing roles via AWS CLI|
|`backup-service`|Regular user|None (can only assume roles)|Running backup applications with temporary credentials|

### Step 3: Create the Backup Bucket

Run this as the backup admin user (who has S3 permissions):

```bash
$ aws s3 mb s3://backups --profile backup-admin
```

Why the admin user? The service account (`backup-service`) has no S3 permissions
yet; it can only assume roles. The admin user creates the infrastructure (buckets),
then creates roles that grant specific permissions to those buckets.

Verify the bucket exists:

```bash
$ aws s3 ls --profile backup-admin
2025-12-12 17:09:25 backups
```

### Step 4: Create the Role

Run these commands as the account root user (`backup-admin`),
who has full IAM API permissions.

Create a role trust policy (who can assume this role):

```bash
cat > trust-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"AWS": "arn:aws:iam::RGW89761398048153888:user/backup-service"},
    "Action": "sts:AssumeRole"
  }]
}
EOF
```

_ARNs in IAM Accounts (Ceph Object Gateway): In the IAM Accounts model, the user
ARN is built from the account ID plus the user name; in Ceph this “name” corresponds
to the user’s display-name (not the `--uid`). If your `--uid` and `--display-name`
differ, ensure that your trust policy Principal ARN uses the display-name value,
or the AssumeRole request will not match.

Authorization to assume a role can be granted in two ways. In this tutorial we grant
it via the role trust policy by naming the service user as the `Principal`. In
same-account setups, this is sufficient; no user policy is required. If you instead
trust the whole account or you are doing cross-account access, attach an identity
policy to the user or group allowing sts:AssumeRole on the specific role ARN._

Create the role:

```bash
$ aws iam create-role \
  --profile backup-admin \
  --role-name backup-reader \
  --assume-role-policy-document file://trust-policy.json
```

Create permission policy (what the role can do):

```bash
cat > permissions-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "s3:GetObject",
      "s3:ListBucket"
    ],
    "Resource": [
      "arn:aws:s3:::backups",
      "arn:aws:s3:::backups/*"
    ]
  }]
}
EOF
```

Attach permissions to role:

```bash
$ aws iam put-role-policy \
  --profile backup-admin \
  --role-name backup-reader \
  --policy-name backup-read-policy \
  --policy-document file://permissions-policy.json
```

Verify that the role was created:

```bash
$ aws iam get-role \
  --profile backup-admin \
  --role-name backup-reader
{
    "Role": {
        "Path": "/",
        "RoleName": "backup-reader",
        "RoleId": "8c8eec8c-c647-42bb-8a53-36c6d2fc747a",
        "Arn": "arn:aws:iam::RGW89761398048153888:role/backup-reader",
        "CreateDate": "2025-12-12T22:10:18.644Z",
        "AssumeRolePolicyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "AWS": "arn:aws:iam::RGW89761398048153888:user/backup-service"
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        },
        "Description": "",
        "MaxSessionDuration": 3600
    }
}

$ aws --profile backup-service sts assume-role --role-arn "arn:aws:iam::RGW89761398048153888:role/backup-reader" --output json --role-session-name testbr
{
    "Credentials": {
        "AccessKeyId": "reUwxxxxxxn",
        "SecretAccessKey": "CQGxxxxxxx",
        "SessionToken": "nADwRdQ5xxxx90qMZlDPl4ozBjcQKF1tceytgNVGD5D4h2FpoMvjybl31cXI9uh/nUrQePW+Ob3TmpMa4QXdXfml/gQYSYeQLJEzNncQPUQB9+QUl5TShDy4RYYziRulTMWrkYokL6kI0uN0LksQ56/qOyd59A1qbWtsBNYBdvxUUi7r3lhrifn4MNWQbErJKCVNdVOBSzN1L34JDMvjEqN2QyKWLQI16D+XhCq8V05OnQFMHsf128BealrX+KkWS6+74G960WzoHzWDwHF1uO08VlFYCdHO0A==",
        "Expiration": "2025-12-12T23:34:00.247844317Z"
    },
    "AssumedRoleUser": {
        "Arn": "arn:aws:sts::RGW89761398048153888:assumed-role/backup-reader/testbr"
    },
    "PackedPolicySize": 0
}
```

### Step 5: Write Application Code (Python Example)

This code runs with the service account credentials (`backup-service`), which have
no direct S3 access. The application calls STS to assume the `backup-reader`
role and receives temporary credentials for S3 operations.

Identity flow:

* The application starts with `backup-service` credentials (long-term, minimal permissions)
* Calls `AssumeRole` using those credentials to request the `backup-reader` role
* Receives temporary credentials (access key + secret + session token)
* Uses temporary credentials for all S3 operations
* Temporary credentials expire after 1 hour (or configured duration)
* Application manually checks expiration before each operation and refreshes if needed

Upload test file (as admin user who has write permissions):

```bash
$ echo "test backup data" > test-backup.txt
$ aws s3 cp test-backup.txt s3://backups/ --profile backup-admin
```

Running the script: download the script from GitHub Gist, and export the
variables of the `backup-service` user:

```bash
# Download script
$ wget -O backup_service.py https://gist.githubusercontent.com/likid0/f7c40c4851bf32c595c7a5e63cf21f35/raw/137bfeea46c20d46d37fa026e29f1b5193c3e281/gistfile1.txt
# Make it executable
$ chmod +x backup_service.py
# Export Vars
$ export AWS_ACCESS_KEY_ID='AKIAIOSFODNN7EXAMPLE'
$ export AWS_SECRET_ACCESS_KEY='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
$ export S3_ENDPOINT_URL='https://s3.example.com'
```
Run the example `backup_service.py` cript:

```bash
$ python backup_service.py

================================================================================
 Backup Service - STS Temporary Credentials Demo
================================================================================

Configuration:
  Endpoint: https://s3.cephlabs.com
  User:     backup-service
  Key:      VQQPNR4XOW...

Note: These are the service account's PERMANENT credentials
      They have NO direct S3 permissions (can only assume roles)

================================================================================
Calling AssumeRole API to get temporary credentials...
================================================================================

AssumeRole Parameters:
  RoleArn:         arn:aws:iam::RGW89761398048153888:role/backup-reader
  RoleSessionName: backup-job-1765579042
  DurationSeconds: 3600 (1 hour)

Authentication:  Using service account credentials (backup-service)
                 AccessKey: VQQPNR4XOW...

Calling STS endpoint: https://s3.cephlabs.com

SUCCESS! Received temporary credentials:
  AccessKeyId:     YAhacPIIT4BcUWiyPC0M...
  SecretAccessKey: S4VSWFTM2U... (redacted)
  SessionToken:    Yn3A4Mt4VGQoIvloer2ByH3aecQAeP... (redacted)
  Expiration:      2025-12-12 23:37:22.878813+00:00
================================================================================


 Listing backups in bucket 'backups'...
   Found 1 object(s):

    test-backup.txt
      Size: 0.00 MB (17 bytes)
      Modified: 2025-12-12 22:11:23.474000+00:00


================================================================================
Demo completed successfully!
================================================================================
```

This example script uses manual credential checking: the `_check_credentials()`
method checks expiration time before each operation and calls `_refresh_credentials()`
when needed. This is simple and works well for most use cases.

For long-running jobs (hours or days), see the "Handling Long-Running Jobs:
Credential Refresh Strategies" section later in this post, which covers
automatic credential refresh using Boto3's `RefreshableCredentials`. With
automatic refresh, Boto3 handles the timing and renewal for you so you never
have to think about expiration.


## Handling Long-Running Jobs: Credential Refresh Strategies

A critical consideration for production deployments is handling jobs that run
longer than the credential lifetime.

### The Challenge

The DurationSeconds Parameter controls how long the temporary credentials remain valid:

Minimum: 900 seconds (15 minutes) configurable via `rgw_sts_min_session_duration`
Default: 3600 seconds (1 hour)
Maximum: Limited by the role's `max_session_duration` attribute (defaults to 3600)

When a role is created, it has a `max_session_duration` of 3600 seconds by default.
This means even if you request `DurationSeconds=7200` (2 hours), the request
will be limited to the role's maximum. To allow longer sessions, you would
need to modify the role's max_session_duration when creating it (though for
security, shorter durations are recommended).

Here, we share three example strategies for handling this.

### Strategy 1: Increase Token Duration (Up to 12 Hours)

The most straightforward approach is to request longer-lived credentials and
configure the role to allow them.

#### Configure maximum session duration on the role:

When creating the role, you can set a maximum session duration:

```bash
$ aws iam create-role \
  --profile backup-admin \
  --role-name backup-reader \
  --assume-role-policy-document file://trust-policy.json \
  --max-session-duration 43200  # 12 hours
```

Or modify an existing role:

```bash
$ aws iam update-role \
  --profile backup-admin \
  --role-name backup-reader \
  --max-session-duration 43200  # 12 hours
```

Verify the setting:


```bash
$ aws iam get-role \
  --profile backup-admin \
  --role-name backup-reader \
  --query 'Role.MaxSessionDuration'
```

RGW Configuration: the following config option controls the global maximum:

```bash
ceph config set client.rgw.default rgw_sts_max_session_duration 43200
```

Limitations:

* Maximum duration in Ceph RGW: 12 hours (43,200 seconds)
* Not an ideal solution, as it extends the duration of the tokens to twelve hours
* Suitable for jobs that can be completed within 12 hours

### Strategy 2: Automatic Credential Refresh with RefreshableCredentials

For jobs longer than 12 hours, or to avoid managing token duration,
implement automatic refresh using botocore's `RefreshableCredentials`.
This pattern continuously calls `AssumeRole` to get fresh credentials
before expiration.

An enhanced `BackupService` example script with STS token Auto-Refresh
is available [here](https://gist.github.com/likid0/25519b2f46b63de89f7fe0d2dc9ff283).

How it works:

* `RefreshableCredentials` wraps your credential fetching logic
* Before each AWS API call, Boto3 checks if credentials are expired or expiring soon
* If needed, `boto3` automatically calls `_refresh_credentials()` to get fresh credentials
* Your application never sees authentication errors due to expiration
* Each refresh calls `AssumeRole` using the original service account credentials

Key Advantages:

* Works for jobs of any length (days, weeks)
* No manual credential management needed
* Boto3 handles refresh timing automatically
* Original service account credentials remain secure (never exposed to S3 operations)

Important Notes:

* The service account's long-term credentials must remain valid for the entire job
* Each refresh makes a new `AssumeRole` call to STS
* Credentials are cached in memory only (not written to disk)

### Strategy 3: Use Third-Party Libraries

If you prefer not to work with botocore internals, use a well-maintained library:

Install the library `aws-assume-role-lib`:

```bash
$ pip install aws-assume-role-lib
```

Reference the library in code:

```python
import boto3
import aws_assume_role_lib

# Create session with automatic refresh
parent_session = boto3.Session(
    aws_access_key_id='BACKUP_SERVICE_KEY',
    aws_secret_access_key='your-secret-key'
)

# This session automatically refreshes expired credentials
assumed_role_session = aws_assume_role_lib.assume_role(
    parent_session, 
    'arn:aws:iam::RGW12345678901234567:role/backup-reader'
)

# Use it like any boto3 session
s3 = assumed_role_session.client('s3', endpoint_url='https://s3.example.com')
s3.list_buckets()  # Credentials auto-refresh as needed
```

## Static Key Rotation: Completing the Security Model

You've now implemented STS for temporary credentials, but there's one
final layer to complete the security architecture: rotating the service
account's static keys.

### Background: The create_date Field

Starting with Tentacle, Ceph RGW now includes a `create_date` timestamp for
each access key in the user metadata. This addition enables programmatic key
age tracking and automated rotation: a critical capability for eliminating
static credential risk.

Example output from `radosgw-admin user info`:

```json
{
    "user_id": "backup-service",
    "keys": [{
        "user": "backup-service",
        "access_key": "XXXXXXXX",
        "secret_key": "XtDhTWsb6vkNOsAnWBXSIhDhqdRBYXXXXXXX",
        "active": true,
        "create_date": "2025-12-12T22:02:16.628205Z"  ← Key creation timestamp
    }]
}
```
### Recommended Approach: Use a Secrets Manager
The best way to implement key rotation is with a secrets manager such as
HashiCorp Vault, IBM GKLM, AWS Secrets Manager, Google Secret Manager,
or Azure Key Vault. This approach enables zero-downtime rotation
without code changes.

How it works:

* Application queries secrets manager (no hardcoded credentials):
    * Application starts up and queries Vault/secrets manager for credentials
    * Gets current `access_key` and `secret_key`
    * Uses these to call `AssumeRole` and get temporary STS credentials

* When keys rotate (automated monthly rotation using the `create_date` field time stamp):
    * Generate a new Ceph access key with `radosgw-admin key create`
    * Update the secret in Vault/secrets manager with new credentials
    * Keep both old and new keys active in Ceph for a 7-day transition period
    * After 7 days, remove the old key from Ceph

* Application automatically gets new keys:
    * The next time the application restarts or refreshes credentials, it queries the secrets manager
    * Gets the new credentials automatically
    * No code changes required: the application doesn't know rotation happened
    * No downtime: the old key still works during the transition

## Migration Strategy: From Static to Temporary

You can't flip a switch and convert all applications overnight. The transition
requires methodical planning, careful testing, and phased rollout. Organizations
that rush this process end up with broken applications, emergency rollbacks, and
frustrated teams. The ones that succeed treat it as a deliberate migration project
with clear phases and success criteria.

The challenge isn't technical; the STS implementation is straightforward once
one understands roles. The challenge is organizational: identifying where
static credentials exist, understanding what each application actually needs,
and coordinating updates across teams that may not even realize they're using
S3. This is why the first phase isn't about changing anything; it's about
understanding what you have.

## Coming in the Next Post

You now have STS working in your Ceph environment. Your applications use temporary
credentials that expire automatically, dramatically reducing the blast radius of
credential theft. The permanent credentials your applications hold can't access
S3 directly; they can only assume specific roles with limited permissions. Each
role follows least privilege. Every access is logged with full attribution.

We kept the IAM explanation minimal in this post, just enough to implement STS.
In the next post, we'll dive into IAM architecture and access control patterns.
We'll cover the new IAM Accounts model introduced in Ceph Squid, how it creates
proper multi-tenancy, and why the distinction between root account and IAM users
matters for security. We'll explore advanced least privilege patterns, trust policy
design for cross-account access, and how to test policies before deployment. We'll
also examine organizational mandates, such as blocking ACLs entirely and using the
new S3Control API for account-level governance.


The authors would like to thank IBM for supporting the community with our time to create these posts.
