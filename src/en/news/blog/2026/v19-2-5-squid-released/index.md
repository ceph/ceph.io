---
title: "v19.2.5 Squid released"
date: "2026-07-14"
author: "Yuri Weinstein"
tags:
  - "release"
  - "squid"
---

This is the fifth backport release in the Squid series.
We recommend all users update to this release.

## Notable Changes

MDS (Metadata Server)
---------------------

- Fixed a segmentation fault relating to MDSContext completion and request queuing.

OSD (Object Storage Daemon)
---------------------------

- Rollback & Vector Fixes: Corrected rollback logic for partial write object information (OI) and optimized Erasure Coding (EC) by ensuring Twiddle creates a full-sized vector.

RGW (RADOS Gateway)
-------------------

- TLS 1.3 Ciphersuites: Introduced the ssl_ciphersuites configuration option for the Beast front-end to support TLS 1.3 cipher customizations.
- S3 PutObject ACLs Fix: Fixed a bug where PutObject requests were erroneously rejected under BlockPublicAcls due to an incorrect comparison return value from canned_acl.compare().
- Multisite Sync Robustness: Resolved an infinite loop scenario in RGWBucketFullSyncCR when a source bucket was deleted mid-sync by introducing a mechanism to clear stateful data in reused bucket_list_result objects.
- SNS Policy Evaluation: Updated ListTopics to use the account root ARN for policy evaluation when invoked by a non-root account user, preventing unexpected implicit denies from identity-based policies.
- Presigned URLs: Fixed an internal server error occurring during the authentication process of presigned URLs.
- Prerequest Hook: Restructured the order of execution so that the prerequest hook now runs after the authorization process has completed.
- Object Tagging: Added handling for plain-text object tags during execution of RGWObjTags::decode().
- Beast Frontend Stability: Applied a strand executor to the Beast timeout timer to avoid concurrent socket access and potential race conditions.
- Bucket Statistics: Added a fix for bucket stats execution when the underlying bucket index does not exist.

## Changelog

- [Stretch Mode] mon: restrict changing mon election strategy post stretch mode ([pr#65458](https://github.com/ceph/ceph/pull/65458), Kamoltat Sirivadhna)

- Check if `HTTP\_X\_AMZ\_COPY\_SOURCE` header is empty ([pr#66028](https://github.com/ceph/ceph/pull/66028), Suyash Dongre)

- Fix multifs auth caps check ([pr#65359](https://github.com/ceph/ceph/pull/65359), Kotresh HR)

- librbd/migration/QCOWFormat: avoid use-after-free in execute\_request() ([pr#68187](https://github.com/ceph/ceph/pull/68187), Ilya Dryomov)

- librbd: avoid losing sparseness in read\_parent() ([pr#68462](https://github.com/ceph/ceph/pull/68462), Ilya Dryomov)

- mds: add ref counting to LogSegment ([pr#68443](https://github.com/ceph/ceph/pull/68443), Milind Changire)

- mds: use SimpleLock::WAIT\_ALL for wait mask ([pr#68320](https://github.com/ceph/ceph/pull/68320), Patrick Donnelly)

- mgr/snap\_schedule: restrict retention period multipliers set ([pr#67267](https://github.com/ceph/ceph/pull/67267), Milind Changire)

- mgr/vol: don't delete user-created pool in "volume create" command ([pr#63068](https://github.com/ceph/ceph/pull/63068), Rishabh Dave)

- mgr/volumes: allow disabling async job thread ([pr#62433](https://github.com/ceph/ceph/pull/62433), Rishabh Dave)

- mgr: ensure that all modules have started before advertising active mgr ([pr#68248](https://github.com/ceph/ceph/pull/68248), Laura Flores)

- mon/AuthMonitor: add osd w cap for superuser client ([pr#68318](https://github.com/ceph/ceph/pull/68318), Venky Shankar, Patrick Donnelly)

- os/bluestore: introduce allocator lookup policy ([pr#66840](https://github.com/ceph/ceph/pull/66840), Igor Fedotov)

- pybind/mgr/volumes: fix typo in casesensitive vxattr ([pr#63023](https://github.com/ceph/ceph/pull/63023), Patrick Donnelly, Xavi Hernandez)

- python-common/cryptotools: stop using the removed X509Req API ([pr#69752](https://github.com/ceph/ceph/pull/69752), Kefu Chai)

- qa/multisite: switch to boto3 ([pr#68919](https://github.com/ceph/ceph/pull/68919), Shilpa Jagannath)

- qa/radosgw\_admin: replace boto2 with boto3 ([pr#68849](https://github.com/ceph/ceph/pull/68849), Adam C. Emerson, Casey Bodley)

- qa/rgw/upgrade: symlinks are explicit about distro versions ([pr#68058](https://github.com/ceph/ceph/pull/68058), Casey Bodley)

- qa/rgw: remove ragweed from verify subsuite ([pr#69114](https://github.com/ceph/ceph/pull/69114), Casey Bodley)

- qa/rgw: Revive crypt kmip ([pr#68372](https://github.com/ceph/ceph/pull/68372), Kyr Shatskyy)

- qa/suites/rados: temporarily disable ceph-post-file test ([pr#68611](https://github.com/ceph/ceph/pull/68611), Laura Flores)

- qa/tasks/keystone: restart mariadb for rocky and alma linux too ([pr#67543](https://github.com/ceph/ceph/pull/67543), Kyr Shatskyy)

- qa/tasks/keystone: upgrade keystone to 2025<span></span>.2 ([pr#67756](https://github.com/ceph/ceph/pull/67756), Kyr Shatskyy)

- qa/workunits/rbd: drop racy assert in test\_tasks\_recovery() ([pr#68189](https://github.com/ceph/ceph/pull/68189), Ilya Dryomov)

- qa: allow multiple mgr sessions during eviction test ([pr#68321](https://github.com/ceph/ceph/pull/68321), Patrick Donnelly)

- qa: fix setting rbd\_sparse\_read\_threshold\_bytes in test\_migration\_clone() ([pr#68616](https://github.com/ceph/ceph/pull/68616), Ilya Dryomov)

- qa: Remove cephadm e2e tests from teuthology ([pr#68819](https://github.com/ceph/ceph/pull/68819), Afreen Misbah)

- qa: resolve py3<span></span>.12 regression for random<span></span>.sample ([pr#68319](https://github.com/ceph/ceph/pull/68319), Patrick Donnelly)

- rgw/auth: fix internal server error for presigned urls ([pr#69049](https://github.com/ceph/ceph/pull/69049), Tobias Urdin)

- rgw/beast: add ssl\_ciphersuites option for tls 1<span></span>.3 ([pr#69179](https://github.com/ceph/ceph/pull/69179), Casey Bodley)

- rgw/beast: use strand executor for timeout timer to prevent concurrent socket access ([pr#68507](https://github.com/ceph/ceph/pull/68507), Oguzhan Ozmen)

- RGW/multisite: fix bucket-full-sync infinite loop caused by stale bucket\_list\_result reuse ([pr#67921](https://github.com/ceph/ceph/pull/67921), Oguzhan Ozmen)

- rgw/s3: fix PutObject's canned\_acl comparisons for BlockPublicAcls ([pr#69481](https://github.com/ceph/ceph/pull/69481), Casey Bodley)

- rgw/sns: ListTopics uses account root arn for policy evaluation ([pr#69274](https://github.com/ceph/ceph/pull/69274), Casey Bodley)

- rgw: `account rm --purge-data` can delete users/roles/groups/oidcs too ([pr#68060](https://github.com/ceph/ceph/pull/68060), Casey Bodley)

- RGW: Change prerequest hook to run after authorization process ([pr#67711](https://github.com/ceph/ceph/pull/67711), Emin Sunacoglu)

- rgw: fix 'bucket stats' when bucket index doesn't exist ([pr#68504](https://github.com/ceph/ceph/pull/68504), Casey Bodley)

- RGW: handle plain-text object tags in RGWObjTags::decode() ([pr#67926](https://github.com/ceph/ceph/pull/67926), Oguzhan Ozmen)

- rgw: read\_obj\_policy() consults s3:prefix when deciding between 403/404 ([pr#68652](https://github.com/ceph/ceph/pull/68652), Casey Bodley)

- suites/rados/cephadm: add still running warning to the ignore list ([pr#62532](https://github.com/ceph/ceph/pull/62532), Nitzan Mordechai)

- test/rgw: remove depracated boto dependency ([pr#68470](https://github.com/ceph/ceph/pull/68470), Yuval Lifshitz)
