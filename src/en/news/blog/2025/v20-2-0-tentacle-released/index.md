---
title: "v20.2.0 Tentacle released"
date: "2025-11-18"
author: "Laura Flores"
tags:
  - "release"
  - "tentacle"
---

Tentacle is the 20th stable release of Ceph.

This is the first stable release of Ceph Tentacle.

Contents:

- [Major Changes from Squid](#changes)
- [Upgrading from Reef or Squid](#upgrade)
- [Upgrading from pre-Reef releases (like Quincy)](#upgrade-from-older-release)
- [Thank You to Our Contributors](#contributors)


## <a id="changes"></a>Major Changes from Squid

### Highlights

*See the sections below for more details on these items.*

CephFS

* Directories may now be configured with case-insensitive or normalized
  directory entry names.
* Modifying the FS setting variable ``max_mds`` when a cluster is unhealthy
  now requires users to pass the confirmation flag (``--yes-i-really-mean-it``).
* ``EOPNOTSUPP`` (Operation not supported) is now returned by the CephFS FUSE
  client for ``fallocate`` for the default case (i.e. ``mode == 0``).

Crimson

* SeaStore Tech Preview: SeaStore object store is now deployable
  alongside Crimson-OSD, mainly for early testing and experimentation.
  Community feedback is encouraged to help with future improvements.

Dashboard

* Support has been added for NVMe/TCP gateway groups and multiple
  namespaces, multi-cluster management, OAuth 2.0 integration, and enhanced
  RGW/SMB features including multi-site automation, tiering, policies,
  lifecycles, notifications, and granular replication.

Integrated SMB support

* Ceph clusters now offer an SMB Manager module that works like the existing
  NFS subsystem. The new SMB support allows the Ceph cluster to automatically
  create Samba-backed SMB file shares connected to CephFS. The ``smb`` module
  can configure both basic Active Directory domain or standalone user
  authentication. The Ceph cluster can host one or more virtual SMB clusters
  which can be truly clustered using Samba's CTDB technology. The ``smb``
  module requires a cephadm-enabled Ceph cluster and deploys container images
  provided by the ``samba-container`` project. The Ceph dashboard can be used
  to configure SMB clusters and shares. A new ``cephfs-proxy`` daemon is
  automatically deployed to improve scalability and memory usage when connecting
  Samba to CephFS.

MGR

* Users now have the ability to force-disable always-on modules.
* The ``restful`` and ``zabbix`` modules (deprecated since 2020) have been
  officially removed.

RADOS

* FastEC: Long-anticipated performance and space amplification
  optimizations are added for erasure-coded pools.
* BlueStore: Improved compression and a new, faster WAL (write-ahead-log).
* Data Availability Score: Users can now track a data availability score
  for each pool in their cluster.
* OMAP: All components have been switched to the faster OMAP iteration
  interface, which improves RGW bucket listing and scrub operations.

RBD

* New live migration features: RBD images can now be instantly imported
  from another Ceph cluster (native format) or from a wide variety of
  external sources/formats.
* There is now support for RBD namespace remapping while mirroring between
  Ceph clusters.
* Several commands related to group and group snap info were added or
  improved, and ``rbd device map`` command now defaults to ``msgr2``.

RGW

* Added support for S3 ``GetObjectAttributes``.
* For compatibility with AWS S3, ``LastModified`` timestamps are now truncated
  to the second. Note that during upgrade, users may observe these timestamps
  moving backwards as a result.
* Bucket resharding now does most of its processing before it starts to block
  write operations. This should significantly reduce the client-visible impact
  of resharding on large buckets.
* The User Account feature introduced in Squid provides first-class support for
  IAM APIs and policy. Our preliminary STS support was based on tenants, and
  exposed some IAM APIs to admins only. This tenant-level IAM functionality is now
  deprecated in favor of accounts. While we'll continue to support the tenant feature
  itself for namespace isolation, the following features will be removed no sooner
  than the V release:
  
  - Tenant-level IAM APIs including CreateRole, PutRolePolicy and PutUserPolicy,
  - Use of tenant names instead of accounts in IAM policy documents,
  - Interpretation of IAM policy without cross-account policy evaluation,
  - S3 API support for cross-tenant names such as `Bucket='tenant:bucketname'`
  - STS Lite and `sts:GetSessionToken`.

### Cephadm

* A new cephadm-managed ``mgmt-gateway`` service provides a single, TLS-terminated
  entry point for Ceph management endpoints such as the Dashboard and the monitoring
  stack. The gateway is implemented as an nginx-based reverse proxy that fronts Prometheus,
  Grafana, and Alertmanager, so users no longer need to connect to those daemons directly or
  know which hosts they run on. When combined with the new ``oauth2-proxy`` service, which
  integrates with external identity providers using the OpenID Connect (OIDC) / OAuth 2.0
  protocols, the gateway can enforce centralized authentication and single sign-on (SSO) for
  both the Ceph Dashboard and the rest of the monitoring stack.

* High availability for the Ceph Dashboard and the Prometheus-based monitoring stack is now
  provided via the cephadm-managed ``mgmt-gateway``. nginx high-availability mechanisms allow
  the mgmt-gateway to detect healthy instances of the Dashboard, Prometheus, Grafana, and Alertmanager,
  route traffic accordingly, and handle manager failover transparently. When deployed with a virtual
  IP and multiple ``mgmt-gateway`` instances, this architecture keeps management access available
  even during daemon or host failures.

* A new ``certmgr`` cephadm subsystem centralizes certificate lifecycle management for cephadm-managed
  services. certmgr acts as a cluster-internal root CA for cephadm-signed certificates, it can also
  consume user-provided certificates, and tracks how each certificate was provisioned. It standardizes
  HTTPS configuration for services such as RGW and the mgmt-gateway, automates renewal and rotation of
  cephadm-signed certificates, and raises health warnings when certificates are invalid, expiring or misconfigured.
  With certmgr, cephadm-signed certificates are available across all cephadm-managed services, providing
  secure defaults out of the box.

### CephFS

* Directories may now be configured with case-insensitive or
  normalized directory entry names. This is an inheritable configuration,
  making it apply to an entire directory tree.

  For more information, see https://docs.ceph.com/en/tentacle/cephfs/charmap/.

* It is now possible to pause the threads that asynchronously purge
  deleted subvolumes by using the config option
  ``mgr/volumes/pause_purging``.

* It is now possible to pause the threads that asynchronously clone
  subvolume snapshots by using the config option
  ``mgr/volumes/pause_cloning``.

* Modifying the setting ``max_mds`` when a cluster is
  unhealthy now requires users to pass the confirmation flag
  (``--yes-i-really-mean-it``). This has been added as a precaution to inform
  users that modifying ``max_mds`` may not help with troubleshooting or recovery
  efforts. Instead, it might further destabilize the cluster.

* ``EOPNOTSUPP`` (Operation not supported) is now returned by the CephFS
  FUSE client for ``fallocate`` in the default case (i.e., ``mode == 0``) since
  CephFS does not support disk space reservation. The only flags supported are
  ``FALLOC_FL_KEEP_SIZE`` and ``FALLOC_FL_PUNCH_HOLE``.

* The ``ceph fs subvolume snapshot getpath`` command now allows users
  to get the path of a snapshot of a subvolume. If the snapshot is not present,
  ``ENOENT`` is returned.

* The ``ceph fs volume create`` command now allows users to pass
  metadata and data pool names to be used for creating the volume. If either
  is not passed, or if either is a non-empty pool, the command will abort.

* The format of the pool namespace name for CephFS volumes has been changed
  from ``fsvolumens__<subvol-name>`` to
  ``fsvolumens__<subvol-grp-name>_<subvol-name>`` to avoid namespace collisions
  when two subvolumes located in different subvolume groups have the same name.
  Even with namespace collisions, there were no security issues, since the MDS
  auth cap is restricted to the subvolume path. Now, with this change, the
  namespaces are completely isolated.

* If the subvolume name passed to the command ``ceph fs subvolume info``
  is a clone, the output will now also contain a "source" field that tells the
  user the name of the source snapshot along with the name of the volume,
  subvolume group, and subvolume in which the source snapshot is located.
  For clones created with Tentacle or an earlier release, the value of this
  field will be ``N/A``. Regular subvolumes do not have a source subvolume and
  therefore the output for them will not contain a "source" field regardless of
  the release.

### Crimson / SeaStore

The Crimson project continues to progress, with the Squid release marking the
first technical preview available for Crimson.
The Tentacle release introduces a host of improvements and new functionalities
that enhance the robustness, performance, and usability
of both Crimson-OSD and the SeaStore object store.
In this release, SeaStore can now be deployed alongside the Crimson-OSD!
Early testing and experimentation are highly encouraged and we’d greatly
appreciate any initial feedback rounds from the community to help guide future
improvements.
Check out the Crimson project updates blog post for Tentacle
where we highlight some of the work included in the latest release, moving us
closer to fully replacing the existing Classical OSD in the future:
https://ceph.io/en/news/blog/2025/crimson-T-release/

If you're new to the Crimson project, please visit the project
page for more information and resources: https://ceph.io/en/news/crimson

### Dashboard

* There is now added support for NVMe/TCP gateway groups and multiple
  namespaces, multi-cluster management, OAuth 2.0 integration, and enhanced
  RGW/SMB features including multi-site automation, tiering, policies,
  lifecycles, notifications, and granular replication.

### MGR

* The Ceph Manager's always-on modulues/plugins can now be force-disabled.
  This can be necessary in cases where we wish to prevent the manager from being
  flooded by module commands when Ceph services are down or degraded.

* ``mgr/restful``, ``mgr/zabbix``: both modules, already deprecated since 2020, have been
  finally removed. They have not been actively maintained in the last years,
  and started suffering from vulnerabilities in their dependency chain (e.g.:
  CVE-2023-46136). An alternative for the ``restful`` module is the ``dashboard`` module,
  which provides a richer and better maintained RESTful API. Regarding the ``zabbix`` module,
  there are alternative monitoring solutions, like ``prometheus``, which is the most
  widely adopted among the Ceph user community.

### RADOS

* Long-anticipated performance and space amplification optimizations (FastEC)
  are added for erasure-coded pools, including partial reads and partial writes.

* A new implementation of the Erasure Coding I/O code provides substantial
  performance improvements and some capacity improvements. The new code is
  designed to optimize performance when using Erasure Coding with block storage
  (RBD) and file storage (CephFS) but will have benefits for object storage
  (RGW), in particular when using smaller sized objects. A new flag
  ``allow_ec_optimizations`` must be set on each pool to switch to using the
  new code. Existing pools can be upgraded once the OSD and Monitor daemons
  have been updated. There is no need to update the clients.

* The default plugin for erasure coded pools has been changed from Jerasure to
  ISA-L. Clusters created on Tentacle or later releases will use ISA-L as the
  default plugin when creating a new pool. Clusters that upgrade to the T release
  will continue to use their existing default values. The default values can be
  overridden by creating a new erasure code profile and selecting it when
  creating a new pool. ISA-L is recommended for new pools because the Jerasure
  library is no longer maintained.

* BlueStore now has better compression and a new, faster WAL (write-ahead-log).

* All components have been switched to the faster OMAP iteration interface, which
  improves RGW bucket listing and scrub operations.

* It is now possible to bypass ``ceph_assert()`` in extreme cases to help with
  disaster recovery.

* Testing improvements for dencoding verification were added.

* A new command, `ceph osd pool availability-status`, has been added that
  allows users to view the availability score for each pool in a cluster. A pool
  is considered unavailable if any PG in the pool is not `active` or if
  there are unfound objects. Otherwise the pool is considered available. The
  score is updated every one second by default. This interval can be changed
  using the new config option `pool_availability_update_interval`. The feature
  is off by default. A new config option `enable_availability_tracking` can be
  used to turn on the feature if required. Another command is added to clear the
  availability status for a specific pool:

  ```
  $ ceph osd pool clear-availability-status <pool-name>
  ```

  This feature is in tech preview.

  Related links:

  - Feature ticket: https://tracker.ceph.com/issues/67777
  - Documentation: https://docs.ceph.com/en/tentacle/rados/operations/monitoring/

* Leader monitor and stretch mode status are now included in the ``ceph status``
  output.

  Related tracker: https://tracker.ceph.com/issues/70406

* The ``ceph df`` command reports incorrect ``MAX AVAIL`` for stretch mode pools
  when CRUSH rules use multiple take steps for datacenters. ``PGMap::get_rule_avail``
  incorrectly calculates available space from only one datacenter. As a workaround,
  define CRUSH rules with ``take default`` and ``choose firstn 0 type datacenter``.
  See https://tracker.ceph.com/issues/56650#note-6 for details.

  Upgrading a cluster configured with a CRUSH rule with multiple take steps can
  lead to data shuffling, as the new CRUSH changes may necessitate data
  redistribution. In contrast, a stretch rule with a single-take configuration
  will not cause any data movement during the upgrade process.

* Added convenience function ``librados::AioCompletion::cancel()`` with the same
  behavior as ``librados::IoCtx::aio_cancel()``.

* The configuration parameter ``osd_repair_during_recovery`` has been removed.
  That configuration flag used to control whether an operator-initiated "repair
  scrub" would be allowed to start on an OSD that is performing a recovery. In
  this Ceph version, operator-initiated scrubs and repair scrubs are never blocked
  by a repair being performed.

* Fixed issue of recovery/backfill hang due to improper handling of items in the
  dmclock's background clean-up thread.

  Related tracker: https://tracker.ceph.com/issues/61594

* The OSD's IOPS capacity used by the mClock scheduler is now also checked to
  determine if it's below a configured threshold value defined by:

  - ``osd_mclock_iops_capacity_low_threshold_hdd`` – set to 50 IOPS
  - ``osd_mclock_iops_capacity_low_threshold_ssd`` – set to 1000 IOPS

  The check is intended to handle cases where the measured IOPS is unrealistically
  low. If such a case is detected, the IOPS capacity is either set to the last
  valid value or the configured default to avoid affecting cluster performance
  (slow or stalled ops).

* Documentation has been updated with steps to override OSD IOPS capacity
  configuration.

  Related links:

  - Tracker ticket: https://tracker.ceph.com/issues/70774
  - Documentation: https://docs.ceph.com/en/tentacle/rados/configuration/mclock-config-ref/

* pybind/rados: Fixes ``WriteOp.zero()`` in the original reversed order of arguments
  ``offset`` and ``length``. When pybind calls ``WriteOp.zero()``, the argument passed
  does not match ``rados_write_op_zero``, and offset and length are swapped, which
  results in an unexpected response.

### RBD

* RBD images can now be instantly imported from another Ceph cluster. The
  migration source spec for ``native`` format has grown ``cluster_name`` and
  ``client_name`` optional fields for connecting to the source cluster after
  parsing the respective ``ceph.conf``-like configuration file.

* With the help of the new NBD stream (``"type": "nbd"``), RBD images can now
  be instantly imported from a wide variety of external sources/formats. The
  exact set of supported formats and their features depends on the capabilities
  of the NBD server.

* While mirroring between Ceph clusters, the local and remote RBD namespaces
  don't need to be the same anymore (but the pool names still do). Using the
  new ``--remote-namespace`` option of ``rbd mirror pool enable`` command, it's
  now possible to pair a local namespace with an arbitrary remote namespace in
  the respective pool, including mapping a default namespace to a non-default
  namespace and vice versa, at the time mirroring is configured.

* All Python APIs that produce timestamps now return "aware" ``datetime``
  objects instead of "naive" ones (i.e., those including time zone information
  instead of those not including it). All timestamps remain in UTC, but
  including ``timezone.utc`` makes it explicit and avoids the potential of the
  returned timestamp getting misinterpreted. In Python 3, many ``datetime``
  methods treat "naive" ``datetime`` objects as local times.

* ``rbd group info`` and ``rbd group snap info`` commands are introduced to
  show information about a group and a group snapshot respectively.

* ``rbd group snap ls`` output now includes the group snapshot IDs. The header
  of the column showing the state of a group snapshot in the unformatted CLI
  output is changed from ``STATUS`` to ``STATE``. The state of a group snapshot
  that was shown as ``ok`` is now shown as ``complete``, which is more
  descriptive.

* In ``rbd mirror image status`` and ``rbd mirror pool status --verbose``
  outputs, ``mirror_uuids`` field has been renamed to ``mirror_uuid`` to
  highlight that the value is always a single UUID and never a list of any
  kind.

* Moving an image that is a member of a group to trash is no longer
  allowed. The ``rbd trash mv`` command now behaves the same way as ``rbd rm``
  in this scenario.

* ``rbd device map`` command now defaults to ``msgr2`` for all device types.
  ``-o ms_mode=legacy`` can be passed to continue using ``msgr1`` with krbd.

* The family of diff-iterate APIs has been extended to allow diffing from or
  between non-user type snapshots which can only be referred to by their IDs.

* Fetching the mirroring mode of an image is invalid if the image is
  disabled for mirroring. The public APIs -- C++ ``mirror_image_get_mode()``,
  C ``rbd_mirror_image_get_mode()``, and Python ``Image.mirror_image_get_mode()``
  -- will return ``EINVAL`` when mirroring is disabled.

* Promoting an image is invalid if the image is not enabled for mirroring.
  The public APIs -- C++ ``mirror_image_promote()``,
  C ``rbd_mirror_image_promote()``, and Python ``Image.mirror_image_promote()``
  -- will return EINVAL instead of ENOENT when mirroring is not enabled.

* Requesting a resync on an image is invalid if the image is not enabled
  for mirroring. The public APIs -- C++ ``mirror_image_resync()``,
  C ``rbd_mirror_image_resync()``, and Python ``Image.mirror_image_resync()``
  -- will return EINVAL instead of ENOENT when mirroring is not enabled.

### RGW

* Multiple fixes: Lua scripts will no longer run uselessly against health checks,
  properly quoted ``ETag`` values returned by S3 ``CopyPart``, ``PostObject``, and
  ``CompleteMultipartUpload`` responses.

* IAM policy evaluation now supports conditions ``ArnEquals`` and ``ArnLike``,
  along with their ``Not`` and ``IfExists`` variants.

* Added BEAST frontend option ``so_reuseport`` which facilitates running multiple
  RGW instances on the same host by sharing a single TCP port.

* Replication policies now validate permissions using
  ``s3:ReplicateObject``, ``s3:ReplicateDelete``, and ``s3:ReplicateTags`` for
  destination buckets. For source buckets, both
  ``s3:GetObjectVersionForReplication`` and ``s3:GetObject(Version)`` are
  supported. Actions like ``s3:GetObjectAcl``, ``s3:GetObjectLegalHold``, and
  ``s3:GetObjectRetention`` are also considered when fetching the source object.
  Replication of tags is controlled by the
  ``s3:GetObject(Version)Tagging`` permission.

* Adding missing quotes to the ``ETag`` values returned by S3 ``CopyPart``,
  ``PostObject``, and ``CompleteMultipartUpload`` responses.

* ``PutObjectLockConfiguration`` can now be used to enable S3 Object Lock on an
  existing versioning-enabled bucket that was not created with Object Lock enabled.

* The ``x-amz-confirm-remove-self-bucket-access`` header is now supported by
  ``PutBucketPolicy``. Additionally, the root user will always have access to
  modify the bucket policy, even if the current policy explicitly denies access.

* Added support for the ``RestrictPublicBuckets`` property of the S3
  ``PublicAccessBlock`` configuration.

* The HeadBucket API now reports the ``X-RGW-Bytes-Used`` and ``X-RGW-Object-Count``
  headers only when the ``read-stats`` querystring is explicitly included in the
  API request.

### Telemetry

* The ``basic`` channel in telemetry now captures the ``ec_optimizations``
  flag, which will allow us to gauge feature adoption for the new
  FastEC improvements.
  To opt into telemetry, run ``ceph telemetry on``.

## <a id="upgrade"></a>Upgrading from Reef or Squid

Before starting, ensure that your cluster is stable and healthy with no
`down`, `recovering`, `incomplete`, `undersized` or `backfilling` PGs.
You can temporarily disable the PG autoscaler for all pools during the upgrade
by running `ceph osd pool set noautoscale` before beginning, and if the
autoscaler is desired after completion, running `ceph osd pool unset noautoscale`
after upgrade success is confirmed.

> **Note:**
>
> You can monitor the progress of your upgrade at each stage with the
> `ceph versions` command, which will tell you what Ceph version(s) are running
> for each type of daemon.

### Upgrading Cephadm Clusters

If your cluster is deployed with cephadm (first introduced in Octopus), then the upgrade process is entirely automated. To initiate the upgrade,

```
$ ceph orch upgrade start --image quay.io/ceph/ceph:v20.2.0
```

The same process is used to upgrade to future minor releases.

Upgrade progress can be monitored with

```
$ ceph orch upgrade status
```

Upgrade progress can also be monitored with `ceph -s` (which provides a simple progress bar) or more verbosely with

```
$ ceph -W cephadm
```

The upgrade can be paused or resumed with

```
$ ceph orch upgrade pause  # to pause
$ ceph orch upgrade resume # to resume
```

or canceled with

```
$ ceph orch upgrade stop
```

Note that canceling the upgrade simply stops the process. There is no ability to downgrade back to Reef or Squid.

### Upgrading Non-cephadm Clusters

> **Note:**
>
> 1. If your cluster is running Reef (18.2.x) or later, you might choose
>    to first convert it to use cephadm so that the upgrade to Tentacle is automated (see above).
>    For more information, see https://docs.ceph.com/en/tentacle/cephadm/adoption/.
>
> 2. If your cluster is running Reef (18.2.x) or later, systemd unit file
>    names have changed to include the cluster fsid. To find the correct
>    systemd unit file name for your cluster, run the following command:
>    
>    ```
>    $ systemctl -l | grep <daemon type>
>    ```
>
>    Example:
>
>    ```
>    $ systemctl -l | grep mon | grep active
>
>    ceph-6ce0347c-314a-11ee-9b52-000af7995d6c@mon.f28-h21-000-r630.service loaded active running Ceph mon.f28-h21-000-r630 for 6ce0347c-314a-11ee-9b52-000af7995d6c
>    ```

1. Set the `noout` flag for the duration of the upgrade. (Optional, but recommended.)

   ```    
   $ ceph osd set noout
   ```

2. Upgrade Monitors by installing the new packages and restarting the Monitor daemons. For example, on each Monitor host:

   ```
   $ systemctl restart ceph-mon.target
   ```

   Once all Monitors are up, verify that the Monitor upgrade is complete by looking for the `tentacle` string in the mon map. The command:

   ```
   $ ceph mon dump | grep min_mon_release
   ```

   should report:

   ```
   min_mon_release 20 (tentacle)
   ```

   If it does not, that implies that one or more Monitors haven't been upgraded and restarted and/or the quorum does not include all Monitors.

3. Upgrade `ceph-mgr` daemons by installing the new packages and restarting all Manager daemons. For example, on each Manager host:

   ``` 
   $ systemctl restart ceph-mgr.target
   ```

   Verify the `ceph-mgr` daemons are running by checking `ceph -s`:

   ```
   $ ceph -s

   ...
     services:
      mon: 3 daemons, quorum foo,bar,baz
      mgr: foo(active), standbys: bar, baz
   ...
   ```

4. Upgrade all OSDs by installing the new packages and restarting the `ceph-osd` daemons on all OSD hosts:

   ```
   $ systemctl restart ceph-osd.target
   ```

5. Upgrade all CephFS MDS daemons. For each CephFS file system:

   5.1. Disable standby_replay:
        
        ```
        $ ceph fs set <fs_name> allow_standby_replay false
        ```

   5.2. Reduce the number of ranks to 1. (Make note of the original number of MDS daemons first if you plan to restore it later.)

        ```
        $ ceph status # ceph fs set <fs_name> max_mds 1
        ```

   5.3. Wait for the cluster to deactivate any non-zero ranks by periodically checking the status:

        ```
        $ ceph status
        ```

   5.4. Take all standby MDS daemons offline on the appropriate hosts with:

        ```
        $ systemctl stop ceph-mds@<daemon_name>
        ```

   5.5. Confirm that only one MDS is online and is rank 0 for your FS:

        ```
        $ ceph status
        ```

   5.6. Upgrade the last remaining MDS daemon by installing the new packages and restarting the daemon:

        ```
        $ systemctl restart ceph-mds.target
        ```

   5.7. Restart all standby MDS daemons that were taken offline:

        ```
        $ systemctl start ceph-mds.target
        ```

   5.8. Restore the original value of `max_mds` for the volume:

        ```
        $ ceph fs set <fs_name> max_mds <original_max_mds>
        ```

6. Upgrade all `radosgw` daemons by upgrading packages and restarting daemons on all hosts:

   ```
   $ systemctl restart ceph-radosgw.target
   ```

7. Complete the upgrade by disallowing pre-Tentacle OSDs and enabling all new Tentacle-only functionality:

   ```
   $ ceph osd require-osd-release tentacle
   ```

8. If you set `noout` at the beginning, be sure to clear it with:

   ```
   $ ceph osd unset noout
   ```

9. Consider transitioning your cluster to use the cephadm deployment and orchestration framework to simplify
   cluster management and future upgrades. For more information on converting an existing cluster to cephadm,
   see https://docs.ceph.com/en/tentacle/cephadm/adoption/.

### Post-upgrade

1. Verify the cluster is healthy with `ceph health`.

2. Consider enabling telemetry to send anonymized usage statistics
   and crash information to Ceph upstream developers. To see what would
   be reported without actually sending any information to anyone:

   ```
   $ ceph telemetry preview-all
   ```

   If you are comfortable with the data that is reported, you can opt-in to automatically report high-level cluster metadata with:

   ```
   $ ceph telemetry on
   ```

   The public dashboard that aggregates Ceph telemetry can be found at https://telemetry-public.ceph.com/.

## <a id="upgrade-from-older-release"></a>Upgrading from Pre-Reef Releases (like Quincy)

You **must** first upgrade to Reef (18.2.z) or Squid (19.2.z) before upgrading to Tentacle.

## <a id="contributors"></a>Thank You to Our Contributors

We express our gratitude to all members of the Ceph community who contributed by proposing pull requests, testing this release,
providing feedback, and offering valuable suggestions.

If you are interested in helping test the next release, Umbrella, please join us at the
[#ceph-at-scale](https://ceph-storage.slack.com/archives/C04Q3D7HV1T) Slack channel.

The Tentacle release would not be possible without the contributions of the
community:

Aashish Sharma &squf;
Abhishek Desai &squf;
Abhishek Kane &squf;
Abhishek Lekshmanan &squf;
Achint Kaur &squf;
Achintk1491 &squf;
Adam C. Emerson &squf;
Adam King &squf;
Adam Kupczyk &squf;
Adam Lyon-Jones &squf;
Adarsh Ashokan &squf;
Afreen Misbah &squf;
Aishwarya Mathuria &squf;
Alex Ainscow &squf;
Alex Kershaw &squf;
Alex Wojno &squf;
Alexander Indenbaum &squf;
Alexey Odinokov &squf;
Alexon Oliveira &squf;
Ali Maredia &squf;
Ali Masarwa &squf;
Aliaksei Makarau &squf;
Anatoly Scheglov &squf;
Andrei Ivashchenko &squf;
Ankit Kumar &squf;
Ankush Behl &squf;
Anmol Babu &squf;
Anoop C S &squf;
Anthony D Atri &squf;
Anuradha Gadge &squf;
Anushruti Sharma &squf;
arm7star &squf;
Artem Vasilev &squf;
Avan Thakkar &squf;
Aviv Caro &squf;
Benedikt Heine &squf;
Bernard Landon &squf;
Bill Scales &squf;
Brad Hubbard &squf;
Brian P &squf;
bugwz &squf;
cailianchun &squf;
Casey Bodley &squf;
Chanyoung Park &squf;
Chen Yuanrun &squf;
Chengen Du &squf;
Christian Rohmann &squf;
Christopher Hoffman &squf;
chungfengz &squf;
Chunmei Liu &squf;
Connor Fawcett &squf;
Cory Snyder &squf;
Cybertinus &squf;
daijufang &squf;
Dan Mick &squf;
Dan van der Ster &squf;
Daniel Gryniewicz &squf;
Danny Al-Gaaf &squf;
DanWritesCode &squf;
David Galloway &squf;
Deepika Upadhyay &squf;
Dhairya Parmar &squf;
Divyansh Kamboj &squf;
Dnyaneshwari &squf;
Dominique Leuenberger &squf;
Dongdong Tao &squf;
Doug Whitfield &squf;
Drunkard Zhang &squf;
Effi Ofer &squf;
Emin &squf;
Emin Mert Sunacoglu &squf;
Enrico Bocchi &squf;
Enrico De Fent &squf;
er0k &squf;
Erik Sjölund &squf;
Ernesto Puerta &squf;
Ethan Wu &squf;
Feng, Hualong &squf;
Florent Carli &squf;
Gabriel BenHanokh &squf;
Gal Salomon &squf;
Garry Drankovich &squf;
Gil Bregman &squf;
Gilad Sid &squf;
gitkenan &squf;
Gregory O'Neill &squf;
Guillaume Abrioux &squf;
gukaifeng &squf;
Hannes Baum &squf;
haoyixing &squf;
hejindong &squf;
Hezko &squf;
Hoai-Thu Vuong &squf;
Hualong Feng &squf;
Hyun Jin Kim &squf;
igomon &squf;
Igor Fedotov &squf;
Igor Golikov &squf;
Ilya Dryomov &squf;
imtzw &squf;
Indira Sawant &squf;
Ivo Almeida &squf;
J. Eric Ivancich &squf;
Jakob Haufe &squf;
James Oakley &squf;
Jamie Pryde &squf;
Jane Zhu &squf;
Janne Heß &squf;
Jannis Speer &squf;
Jared Yu &squf;
Jaya Prakash &squf;
Jayaprakash-ibm &squf;
Jesse F. Williamson &squf;
Jesse Williamson &squf;
Jianwei Zhang &squf;
Jianxin Li &squf;
jiawd &squf;
Jiffin Tony Thottan &squf;
Joao Eduardo Luis &squf;
Joel Davidow &squf;
John Agombar &squf;
John Mulligan &squf;
Jon Bailey &squf;
Jos Collin &squf;
Jose J Palacios-Perez &squf;
Joshua Baergen &squf;
Joshua Blanch &squf;
Juan Ferrer Toribio &squf;
Juan Miguel Olmo Martínez &squf;
julpark &squf;
junxiang Mu &squf;
Kalpesh Pandya &squf;
Kamoltat Sirivadhna &squf;
kchheda3 &squf;
Kefu Chai &squf;
Ken Dreyer &squf;
Kevin Niederwanger &squf;
Kevin Zhao &squf;
Kotresh Hiremath Ravishankar &squf;
Kritik Sachdeva &squf;
Kushal Deb &squf;
Kushal Jyoti Deb &squf;
Kyrylo Shatskyy &squf;
Laimis Juzeliūnas &squf;
Laura Flores &squf;
Lee Sanders &squf;
Leo Mylonas &squf;
Leonid Chernin &squf;
Leonid Usov &squf;
lightmelodies &squf;
Linjing Li &squf;
liubingrun &squf;
lizhipeng &squf;
Lorenz Bausch &squf;
Luc Ritchie &squf;
Lucian Petrut &squf;
Luo Rixin &squf;
Ma Jianpeng &squf;
Marc Singer &squf;
Marcel Lauhoff &squf;
Mark Kogan &squf;
Mark Nelson &squf;
Martin Nowak &squf;
Matan Breizman &squf;
Matt Benjamin &squf;
Matt Vandermeulen &squf;
Matteo Paramatti &squf;
Matthew Vernon &squf;
Max Carrara &squf;
Max Kellermann &squf;
Md Mahamudur Rahaman Sajib &squf;
Michael J. Kidd &squf;
Michal Nasiadka &squf;
Mike Perez &squf;
Miki Patel &squf;
Milind Changire &squf;
Mindy Preston &squf;
Mingyuan Liang &squf;
Mohit Agrawal &squf;
molpako &squf;
mosayyebzadeh &squf;
Mouratidis Theofilos &squf;
Mykola Golub &squf;
Myoungwon Oh &squf;
N Balachandran &squf;
Naman Munet &squf;
Naveen Naidu &squf;
nbalacha &squf;
Neeraj Pratap Singh &squf;
Neha Ojha &squf;
Niklas Hambüchen &squf;
Nithya Balachandran &squf;
Nitzan Mordechai &squf;
Nizamudeen A &squf;
Oguzhan Ozmen &squf;
Omid Yoosefi &squf;
Omri Zeneva &squf;
Or Ozeri &squf;
Orit Wasserman &squf;
Oshrey Avraham &squf;
Patrick Donnelly &squf;
Paul Cuzner &squf;
Paul Stemmet &squf;
Paulo E. Castro &squf;
Pedro Gonzalez Gomez &squf;
Pere Diaz Bou &squf;
Peter Sabaini &squf;
Pierre Riteau &squf;
Piotr Parczewski &squf;
Piyush Agarwal &squf;
Ponnuvel Palaniyappan &squf;
Prachi Goel &squf;
Prashant D &squf;
prik73 &squf;
Pritha Srivastava &squf;
Puja Shahu &squf;
pujashahu &squf;
qn2060 &squf;
Radoslaw Zarzynski &squf;
Raja Sharma &squf;
Ramana Raja &squf;
Redouane Kachach &squf;
rhkelson &squf;
Richard Poole &squf;
Rishabh Dave &squf;
Robin Geuze &squf;
Ronen Friedman &squf;
Rongqi Sun &squf;
Rostyslav Khudov &squf;
Roy Sahar &squf;
Ryotaro Banno &squf;
Sachin Prabhu &squf;
Sachin Punadikar &squf;
Sam Goyal &squf;
Samarah Uriarte &squf;
Samuel Just &squf;
Satoru Takeuchi &squf;
Seena Fallah &squf;
Shachar Sharon &squf;
Shasha Lu &squf;
Shawn Edwards &squf;
Shen Jiatong &squf;
Shilpa Jagannath &squf;
shimin &squf;
Shinya Hayashi &squf;
Shraddha Agrawal &squf;
Shreya Sapale &squf;
Shreyansh Sancheti &squf;
Shrish0098 &squf;
Shua Lv &squf;
Shweta Bhosale &squf;
Shweta Sodani &squf;
Shwetha K Acharya &squf;
Sidharth Anupkrishnan &squf;
Silent &squf;
Simon Jürgensmeyer &squf;
Soumya Koduri &squf;
Sridhar Seshasayee &squf;
Stellios Williams &squf;
Steven Chien &squf;
Sun Lan &squf;
Sungjoon Koh &squf;
Sungmin Lee &squf;
Sunil Angadi &squf;
Sunnat Samadov &squf;
Surya Kumari Jangala &squf;
Suyash Dongre &squf;
T K Chandra Hasan &squf;
Taha Jahangir &squf;
Tan Changzhi &squf;
Teng Jie &squf;
Teoman Onay &squf;
Thomas Lamprecht &squf;
Tobias Fischer &squf;
Tobias Urdin &squf;
Tod Chen &squf;
Tomer Haskalovitch &squf;
TomNewChao &squf;
Toshikuni Fukaya &squf;
Trang Tran &squf;
TruongSinh Tran-Nguyen &squf;
Tyler Brekke &squf;
Tyler Stachecki &squf;
Umesh Muthuvara &squf;
Vallari Agrawal &squf;
Venky Shankar &squf;
Victoria Mackie &squf;
Ville Ojamo &squf;
Vinay Bhaskar Varada &squf;
Wang Chao &squf;
wanglinke &squf;
Xavi Hernandez &squf;
Xiubo Li &squf;
Xuehan Xu &squf;
XueYu Bai &squf;
Yaarit Hatuka &squf;
Yan, Zheng &squf;
Yantao Xue &squf;
Yao guotao &squf;
Yehuda Sadeh &squf;
Yingxin Cheng &squf;
Yite Gu &squf;
Yonatan Zaken &squf;
Yuri Weinstein &squf;
Yuval Lifshitz &squf;
Zac Dover &squf;
Zack Cerza &squf;
Zaken &squf;
Zhang Song &squf;
zhangjianwei2 &squf;
Zhansong Gao &squf;
Zhipeng Li &squf;
胡玮文
