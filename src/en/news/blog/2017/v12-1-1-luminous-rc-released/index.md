---
title: "v12.1.1 Luminous RC released"
date: "2017-07-18"
author: "TheAnalyst"
tags:
  - "release"
  - "luminous"
---

This is the second release candidate for Luminous, the next long term stable release. Please note that this is still a Release Candidate and not the final Luminous release.

Ceph Luminous (v12.2.0) will be the foundation for the next long-term stable release series. There have been major changes since Kraken (v11.2.z) and Jewel (v10.2.z), and the upgrade process is non-trivial. Please read these release notes carefully.

### MAJOR CHANGES FROM KRAKEN

- _General_:
    
    - Ceph now has a simple, built-in web-based dashboard for monitoring cluster status.
- _RADOS_:
    
    - _BlueStore_:
        
        - The new _BlueStore_ backend for _ceph-osd_ is now stable and the new default for newly created OSDs. BlueStore manages data stored by each OSD by directly managing the physical HDDs or SSDs without the use of an intervening file system like XFS. This provides greater performance and features.
        - BlueStore supports _full data and metadata checksums_ of all data stored by Ceph.
        - BlueStore supports inline compression using zlib, snappy, or LZ4. (Ceph also supports zstd for RGW compression but zstd is not recommended for BlueStore for performance reasons.)
    - _Erasure coded_ pools now have full support for _overwrites_, allowing them to be used with RBD and CephFS. [Read more about EC overwrites](http://localhost:8080/rados/operations/erasure-code/#erasure-coding-with-overwrites).
        
    - The configuration option “osd pool erasure code stripe width” has been replaced by “osd pool erasure code stripe unit”, and given the ability to be overridden by the erasure code profile setting “stripe\_unit”. For more details see “Erasure Code Profiles” in the documentation.
        
    - rbd and cephfs can use erasure coding with bluestore. This may be enabled by setting ‘allow\_ec\_overwrites’ to ‘true’ for a pool. Since this relies on bluestore’s checksumming to do deep scrubbing, enabling this on a pool stored on filestore is not allowed.
        
    - The ‘rados df’ JSON output now prints numeric values as numbers instead of strings.
        
    - The mon\_osd\_max\_op\_age option has been renamed to mon\_osd\_warn\_op\_age(default: 32 seconds), to indicate we generate a warning at this age. There is also a newmon\_osd\_err\_op\_age\_ratio that is a expressed as a multitple ofmon\_osd\_warn\_op\_age (default: 128, for roughly 60 minutes) to control when an error is generated.
        
    - The default maximum size for a single RADOS object has been reduced from 100GB to 128MB. The 100GB limit was completely impractical in practice while the 128MB limit is a bit high but not unreasonable. If you have an application written directly to librados that is using objects larger than 128MB you may need to adjust osd\_max\_object\_size.
        
    - The semantics of the ‘rados ls’ and librados object listing operations have always been a bit confusing in that “whiteout” objects (which logically don’t exist and will return ENOENT if you try to access them) are included in the results. Previously whiteouts only occurred in cache tier pools. In luminous, logically deleted but snapshotted objects now result in a whiteout object, and as a result they will appear in ‘rados ls’ results, even though trying to read such an object will result in ENOENT. The ‘rados listsnaps’ operation can be used in such a case to enumerate which snapshots are present.
        
        This may seem a bit strange, but is less strange than having a deleted-but-snapshotted object not appear at all and be completely hidden from librados’s ability to enumerate objects. Future versions of Ceph will likely include an alternative object enumeration interface that makes it more natural and efficient to enumerate all objects along with their snapshot and clone metadata.
    - _ceph-mgr_:
        
        - There is a new daemon, _ceph-mgr_, which is a required part of any Ceph deployment. Although IO can continue when _ceph-mgr_ is down, metrics will not refresh and some metrics-related calls (e.g., ceph df) may block. We recommend deploying several instances of _ceph-mgr_ for reliability. See the notes on upgrading below.
        - The _ceph-mgr_ daemon includes a REST-based management API. The API is still experimental and somewhat limited but will form the basis for API-based management of Ceph going forward. FIXME DOCS
        - The status ceph-mgr module is enabled by default, and initially provides two commands: ceph tell mgr osd status and ceph tell mgr fs status. These are high level colorized views to complement the existing CLI.
    - The overall _scalability_ of the cluster has improved. We have successfully tested clusters with up to 10,000 OSDs.
        
    - Each OSD can now have a _device class_ associated with it (e.g., hdd or ssd), allowing CRUSH rules to trivially map data to a subset of devices in the system. Manually writing CRUSH rules or manual editing of the CRUSH is normally not required. FIXME DOCS
        
    - You can now _optimize CRUSH weights_ can now be optimized to maintain a _near-perfect distribution of data_ across OSDs. FIXME DOCS
        
    - There is also a new upmap exception mechanism that allows individual PGs to be moved around to achieve a _perfect distribution_ (this requires luminous clients). FIXME DOCS
        
    - Each OSD now adjusts its default configuration based on whether the backing device is an HDD or SSD. Manual tuning generally not required.
        
    - The prototype _mclock QoS queueing algorithm_ is now available. FIXME DOCS
        
    - There is now a _backoff_ mechanism that prevents OSDs from being overloaded by requests to objects or PGs that are not currently able to process IO.
        
    - There is a _simplified OSD replacement process_ that is more robust. FIXME DOCS
        
    - You can query the supported features and (apparent) releases of all connected daemons and clients with ceph features. FIXME DOCS
        
    - You can configure the oldest Ceph client version you wish to allow to connect to the cluster via ceph osd set-require-min-compat-client and Ceph will prevent you from enabling features that will break compatibility with those clients. FIXME DOCS
        
    - Several sleep settings, include osd\_recovery\_sleep, osd\_snap\_trim\_sleep, and osd\_scrub\_sleep have been reimplemented to work efficiently. (These are used in some cases to work around issues throttling background work.)
        
    - The deprecated ‘crush\_ruleset’ property has finally been removed; please use ‘crush\_rule’ instead for the ‘osd pool get ...’ and ‘osd pool set ..’ commands.
        
    
    > - The ‘osd pool default crush replicated ruleset’ option has been removed and replaced by the ‘osd pool default crush rule’ option. By default it is -1, which means the mon will pick the first type replicated rule in the CRUSH map for replicated pools. Erasure coded pools have rules that are automatically created for them if they are not specified at pool creation time.
    
- _RGW_:
    
    - RGW _metadata search_ backed by ElasticSearch now supports end user requests service via RGW itself, and also supports custom metadata fields. A query language a set of RESTful APIs were created for users to be able to search objects by their metadata. New APIs that allow control of custom metadata fields were also added.
    - RGW now supports _dynamic bucket index sharding_. As the number of objects in a bucket grows, RGW will automatically reshard the bucket index in response. No user intervention or bucket size capacity planning is required.
    - RGW introduces _server side encryption_ of uploaded objects with three options for the management of encryption keys: automatic encryption (only recommended for test setups), customer provided keys similar to Amazon SSE-C specification, and through the use of an external key management service (Openstack Barbican) similar to Amazon SSE-KMS specification.
    - RGW now has preliminary AWS-like bucket policy API support. For now, policy is a means to express a range of new authorization concepts. In the future it will be the foundation for additional auth capabilities such as STS and group policy.
    - RGW has consolidated the several metadata index pools via the use of rados namespaces.
- _RBD_:
    
    - RBD now has full, stable support for _erasure coded pools_ via the new \--data-pool option to rbd create.
    - RBD mirroring’s rbd-mirror daemon is now highly available. We recommend deploying several instances of rbd-mirror for reliability.
    - The default ‘rbd’ pool is no longer created automatically during cluster creation. Additionally, the name of the default pool used by the rbd CLI when no pool is specified can be overridden via a new rbd default pool \= <pool name> configuration option.
    - Initial support for deferred image deletion via new rbd trash CLI commands. Images, even ones actively in-use by clones, can be moved to the trash and deleted at a later time.
    - New pool-level rbd mirror pool promote and rbd mirror pool demotecommands to batch promote/demote all mirrored images within a pool.
    - Mirroring now optionally supports a configurable replication delay via the rbd mirroringreplay delay \= <seconds> configuration option.
    - Improved discard handling when the object map feature is enabled.
    - rbd CLI import and copy commands now detect sparse and preserve sparse regions.
    - Images and Snapshots will now include a creation timestamp
- _CephFS_:
    
    - _Multiple active MDS daemons_ is now considered stable. The number of active MDS servers may be adjusted up or down on an active CephFS file system.
    - CephFS _directory fragmentation_ is now stable and enabled by default on new filesystems. To enable it on existing filesystems use “ceph fs set <fs\_name> allow\_dirfrags”. Large or very busy directories are sharded and (potentially) distributed across multiple MDS daemons automatically.
    - Directory subtrees can be explicitly pinned to specific MDS daemons in cases where the automatic load balancing is not desired or effective.
- _Miscellaneous_:
    
    - Release packages are now being built for _Debian Stretch_. The distributions we build for now includes:
        
        - CentOS 7 (x86\_64 and aarch64)
        - Debian 8 Jessie (x86\_64)
        - Debian 9 Stretch (x86\_64)
        - Ubuntu 16.04 Xenial (x86\_64 and aarch64)
        - Ubuntu 14.04 Trusty (x86\_64)Note that QA is limited to CentOS and Ubuntu (xenial and trusty).
    - _CLI changes_:
        
        - The ceph \-s or ceph status command has a fresh look.
        - ceph {osd,mds,mon} versions summarizes versions of running daemons.
        - ceph {osd,mds,mon} count-metadata <property> similarly tabulates any other daemon metadata visible via the ceph {osd,mds,mon} metadatacommands.
        - ceph features summarizes features and releases of connected clients and daemons.
        - ceph osd require-osd-release <release> replaces the oldrequire\_RELEASE\_osds flags.
        - ceph osd pg-upmap, ceph osd rm-pg-upmap, ceph osd pg-upmap-items, ceph osd rm-pg-upmap-items can explicitly manage upmap items (FIXME DOCS).
        - ceph osd getcrushmap returns a crush map version number on stderr, and ceph osd setcrushmap \[version\] will only inject an updated crush map if the version matches. This allows crush maps to be updated offline and then reinjected into the cluster without fear of clobbering racing changes (e.g., by newly added osds or changes by other administrators).
        - ceph osd create has been replaced by ceph osd new. This should be hidden from most users by user-facing tools like ceph-disk.
        - ceph osd destroy will mark an OSD destroyed and remove its cephx and lockbox keys. However, the OSD id and CRUSH map entry will remain in place, allowing the id to be reused by a replacement device with minimal data rebalancing.
        - ceph osd purge will remove all traces of an OSD from the cluster, including its cephx encryption keys, dm-crypt lockbox keys, OSD id, and crush map entry.
        - ceph osd ls-tree <name> will output a list of OSD ids under the given CRUSH name (like a host or rack name). This is useful for applying changes to entire subtrees. For example, ceph osd down \`ceph osd ls-tree rack1\`.
        - ceph osd {add,rm}-{noout,noin,nodown,noup} allow the noout, nodown, noin, and noup flags to be applied to specific OSDs.
        - ceph log last \[n\] will output the last _n_ lines of the cluster log.
        - ceph mgr dump will dump the MgrMap, including the currently active ceph-mgr daemon and any standbys.
        - ceph mgr module ls will list active ceph-mgr modules.
        - ceph mgr module {enable,disable} <name> will enable or disable the named mgr module. The module must be present in the configured mgr\_module\_path on the host(s) where ceph-mgr is running.
        - ceph osd crush swap-bucket <src> <dest> will swap the contents of two CRUSH buckets in the hierarchy while preserving the buckets’ ids. This allows an entire subtree of devices to be replaced (e.g., to replace an entire host of FileStore OSDs with newly-imaged BlueStore OSDs) without disrupting the distribution of data across neighboring devices.
        - ceph osd set-require-min-compat-client <release> configures the oldest client release the cluster is required to support. Other changes, like CRUSH tunables, will fail with an error if they would violate this setting. Changing this setting also fails if clients older than the specified release are currently connected to the cluster.
        - ceph config-key dump dumps config-key entries and their contents. (The existing ceph config-key list only dumps the key names, not the values.)
        - ceph osd set-{full,nearfull,backfillfull}-ratio sets the cluster-wide ratio for various full thresholds (when the cluster refuses IO, when the cluster warns about being close to full, when an OSD will defer rebalancing a PG to itself, respectively).
        - ceph osd reweightn will specify the reweight values for multiple OSDs in a single command. This is equivalent to a series of ceph osd reweight commands.
        - ceph osd crush class {create,rm,ls,rename} manage the new CRUSH _device class_ feature. ceph crush set-device-class <class> <osd>\[<osd>...\] will set the class for particular devices.
        - ceph osd crush rule create-replicated replaces the old ceph osdcrush rule create-simple command to create a CRUSH rule for a replicated pool. Notably it takes a class argument for the _device class_ the rule should target (e.g., ssd or hdd).
        - ceph mon feature ls will list monitor features recorded in the MonMap. cephmon feature set will set an optional feature (none of these exist yet).
        - ceph tell <daemon> help will now return a usage summary.

### MAJOR CHANGES FROM JEWEL

- _RADOS_:
    - We now default to the AsyncMessenger (ms type \= async) instead of the legacy SimpleMessenger.  The most noticeable difference is that we now use a fixed sized thread pool for network connections (instead of two threads per socket with SimpleMessenger).
    - Some OSD failures are now detected almost immediately, whereas previously the heartbeat timeout (which defaults to 20 seconds) had to expire.  This prevents IO from blocking for an extended period for failures where the host remains up but the ceph-osd process is no longer running.
    - The size of encoded OSDMaps has been reduced.
    - The OSDs now quiesce scrubbing when recovery or rebalancing is in progress.
- _RGW_:
    - RGW now supports the S3 multipart object copy-part API.
    - It is possible now to reshard an existing bucket offline. Offline bucket resharding currently requires that all IO (especially writes) to the specific bucket is quiesced. (For automatic online resharding, see the new feature in Luminous above.)
    - RGW now supports data compression for objects.
    - Civetweb version has been upgraded to 1.8
    - The Swift static website API is now supported (S3 support has been added previously).
    - S3 bucket lifecycle API has been added. Note that currently it only supports object expiration.
    - Support for custom search filters has been added to the LDAP auth implementation.
    - Support for NFS version 3 has been added to the RGW NFS gateway.
    - A Python binding has been created for librgw.
- _RBD_:
    - The rbd-mirror daemon now supports replicating dynamic image feature updates and image metadata key/value pairs from the primary image to the non-primary image.
    - The number of image snapshots can be optionally restricted to a configurable maximum.
    - The rbd Python API now supports asynchronous IO operations.
- _CephFS_:
    - libcephfs function definitions have been changed to enable proper uid/gid control. The library version has been increased to reflect the interface change.
    - Standby replay MDS daemons now consume less memory on workloads doing deletions.
    - Scrub now repairs backtrace, and populates damage ls with discovered errors.
    - A new pg\_files subcommand to cephfs-data-scan can identify files affected by a damaged or lost RADOS PG.
    - The false-positive “failing to respond to cache pressure” warnings have been fixed.

### UPGRADE FROM JEWEL OR KRAKEN

1. Ensure that the sortbitwise flag is enabled:
    
    \# ceph osd set sortbitwise
    
2. Make sure your cluster is stable and healthy (no down or recoverying OSDs). (Optional, but recommended.)
    
3. Do not create any new erasure-code pools while upgrading the monitors.
    
4. Set the noout flag for the duration of the upgrade. (Optional but recommended.):
    
    \# ceph osd set noout
    
5. Upgrade monitors by installing the new packages and restarting the monitor daemons. Note that, unlike prior releases, the ceph-mon daemons _must_ be upgraded first.:
    
    \# systemctl restart ceph-mon.target
    
    Verify the monitor upgrade is complete once all monitors are up by looking for the luminousfeature string in the mon map. For example:
    
    \# ceph mon feature ls
    
    should include luminous under persistent features:
    
    on current monmap (epoch NNN)
       persistent: \[kraken,luminous\]
       required: \[kraken,luminous\]
    
6. Add or restart ceph-mgr daemons. If you are upgrading from kraken, upgrade packages and restart ceph-mgr daemons with:
    
    \# systemctl restart ceph-mgr.target
    
    If you are upgrading from kraken, you may already have ceph-mgr daemons deployed. If not, or if you are upgrading from jewel, you can deploy new daemons with tools like ceph-deploy or ceph-ansible. For example,:
    
    \# ceph-deploy mgr create HOST
    
    Verify the ceph-mgr daemons are running by checking ceph \-s:
    
    \# ceph -s
    
    ...
      services:
       mon: 3 daemons, quorum foo,bar,baz
       mgr: foo(active), standbys: bar, baz
    ...
    
7. Upgrade all OSDs by installing the new packages and restarting the ceph-osd daemons on all hosts.:
    
    \# systemctl restart ceph-osd.target
    
    You can monitor the progress of the OSD upgrades with the new ceph osd versionscommand.:
    
    \# ceph osd versions
    {
       "ceph version 12.2.0 (...) luminous (stable)": 12,
       "ceph version 10.2.6 (...)": 3,
    }
    
8. Upgrade all CephFS daemons by upgrading packages and restarting daemons on all hosts.:
    
    \# systemctl restart ceph-mds.target
    
9. Upgrade all radosgw daemons by upgrading packages and restarting daemons on all hosts.:
    
    \# systemctl restart radosgw.target
    
10. Complete the upgrade by disallowing pre-luminous OSDs:
    
    \# ceph osd require-osd-release luminous
    
    If you set noout at the beginning, be sure to clear it with:
    
    \# ceph osd unset noout
    
11. Verify the cluster is healthy with ceph health.
    

### UPGRADING FROM PRE-JEWEL RELEASES (LIKE HAMMER)

You _must_ first upgrade to Jewel (10.2.z) before attempting an upgrade to Luminous.

### UPGRADE COMPATIBILITY NOTES, KRAKEN TO LUMINOUS

- We no longer test the FileStore ceph-osd backend in combination with btrfs. We recommend against using btrfs. If you are using btrfs-based OSDs and want to upgrade to luminous you will need to add the follwing to your ceph.conf:
    
    enable experimental unrecoverable data corrupting features = btrfs
    
    The code is mature and unlikely to change, but we are only continuing to test the Jewel stable branch against btrfs. We recommend moving these OSDs to FileStore with XFS or BlueStore.
- The ruleset-\* properties for the erasure code profiles have been renamed to crush-\* to (1) move away from the obsolete ‘ruleset’ term and to be more clear about their purpose. There is also a new optional crush-device-class property to specify a CRUSH device class to use for the erasure coded pool. Existing erasure code profiles will be converted automatically when upgrade completes (when the ceph osd require-osd-release luminous command is run) but any provisioning tools that create erasure coded pools may need to be updated.
    
- When assigning a network to the public network and not to the cluster network the network specification of the public network will be used for the cluster network as well. In older versions this would lead to cluster services being bound to 0.0.0.0:<port>, thus making the cluster service even more publicly available than the public services. When only specifying a cluster network it will still result in the public services binding to 0.0.0.0.
    
- In previous versions, if a client sent an op to the wrong OSD, the OSD would reply with ENXIO. The rationale here is that the client or OSD is clearly buggy and we want to surface the error as clearly as possible. We now only send the ENXIO reply if the osd\_enxio\_on\_misdirected\_op option is enabled (it’s off by default). This means that a VM using librbd that previously would have gotten an EIO and gone read-only will now see a blocked/hung IO instead.
    
- The “journaler allow split entries” config setting has been removed.
    

- _librados_:
    
    - Some variants of the omap\_get\_keys and omap\_get\_vals librados functions have been deprecated in favor of omap\_get\_vals2 and omap\_get\_keys2. The new methods include an output argument indicating whether there are additional keys left to fetch. Previously this had to be inferred from the requested key count vs the number of keys returned, but this breaks with new OSD-side limits on the number of keys or bytes that can be returned by a single omap request. These limits were introduced by kraken but are effectively disabled by default (by setting a very large limit of 1 GB) because users of the newly deprecated interface cannot tell whether they should fetch more keys or not. In the case of the standalone calls in the C++ interface (IoCtx::get\_omap\_{keys,vals}), librados has been updated to loop on the client side to provide a correct result via multiple calls to the OSD. In the case of the methods used for building multi-operation transactions, however, client-side looping is not practical, and the methods have been deprecated. Note that use of either the IoCtx methods on older librados versions or the deprecated methods on any version of librados will lead to incomplete results if/when the new OSD limits are enabled.
        
    - The original librados rados\_objects\_list\_open (C) and objects\_begin (C++) object listing API, deprecated in Hammer, has finally been removed. Users of this interface must update their software to use either the rados\_nobjects\_list\_open (C) and nobjects\_begin (C++) API or the new rados\_object\_list\_begin (C) and object\_list\_begin (C++) API before updating the client-side librados library to Luminous. Object enumeration (via any API) with the latest librados version and pre-Hammer OSDs is no longer supported. Note that no in-tree Ceph services rely on object enumeration via the deprecated APIs, so only external librados users might be affected.
        
        The newest (and recommended) rados\_object\_list\_begin (C) and object\_list\_begin (C++) API is only usable on clusters with the SORTBITWISE flag enabled (Jewel and later). (Note that this flag is required to be set before upgrading beyond Jewel.)
- _CephFS_:
    
    - When configuring ceph-fuse mounts in /etc/fstab, a new syntax is available that uses “ceph.<arg>=<val>” in the options column, instead of putting configuration in the device column. The old style syntax still works. See the documentation page “Mount CephFS in your file systems table” for details.
    - CephFS clients without the ‘p’ flag in their authentication capability string will no longer be able to set quotas or any layout fields. This flag previously only restricted modification of the pool and namespace fields in layouts.
    - CephFS will generate a health warning if you have fewer standby daemons than it thinks you wanted. By default this will be 1 if you ever had a standby, and 0 if you did not. You can customize this using ceph fs set <fs> standby\_count\_wanted <number>. Setting it to zero will effectively disable the health check.
    - The “ceph mds tell ...” command has been removed. It is superceded by “ceph tell mds.<id> ...”

### NOTABLE CHANGES SINCE V12.1.1 (RC1)

- choose\_args encoding has been changed to make it architecture-independent. If you deployed Luminous dev releases or 12.1.0 rc release and made use of the CRUSH choose\_args feature, you need to remove all choose\_args mappings from your CRUSH map before starting the upgrade.
- The ‘ceph health’ structured output (JSON or XML) no longer contains a ‘timechecks’ section describing the time sync status. This information is now available via the ‘ceph time-sync-status’ command.
- Certain extra fields in the ‘ceph health’ structured output that used to appear if the mons were low on disk space (which duplicated the information in the normal health warning messages) are now gone.
- The “ceph -w” output no longer contains audit log entries by default. Add a “–watch-channel=audit” or “–watch-channel=\*” to see them.
- The ‘apply’ mode of cephfs-journal-tool has been removed
- Added new configuration “public bind addr” to support dynamic environments like Kubernetes. When set the Ceph MON daemon could bind locally to an IP address and advertise a different IP address “public addr” on the network.

### OTHER NOTABLE CHANGES

- bluestore,common,performance: isa-l: update isa-l to v2.18 ([pr#15895](https://github.com/ceph/ceph/pull/15895), Ganesh Mahalingam, Tushar Gohad)
- bluestore: os/bluestore/BlueFS: clean up log\_writer aios from compaction ([issue#20454](http://tracker.ceph.com/issues/20454), [pr#16017](https://github.com/ceph/ceph/pull/16017), Sage Weil)
- bluestore: os/bluestore/BlueFS: clear current log entrys before dump all fnode ([pr#15973](https://github.com/ceph/ceph/pull/15973), Jianpeng Ma)
- bluestore: os/bluestore: cleanup min\_alloc\_size; some formatting nits ([pr#15826](https://github.com/ceph/ceph/pull/15826), xie xingguo)
- bluestore: os/bluestore: clear up redundant size assignment in KerenelDevice ([pr#16121](https://github.com/ceph/ceph/pull/16121), Shasha Lu)
- bluestore: os/blueStore: Failure retry for opening file ([pr#16237](https://github.com/ceph/ceph/pull/16237), Yankun Li)
- bluestore: os/bluestore: fix deferred\_aio deadlock ([pr#16051](https://github.com/ceph/ceph/pull/16051), Sage Weil)
- bluestore: os/bluestore: Make BitmapFreelistManager kv itereator short lived ([pr#16243](https://github.com/ceph/ceph/pull/16243), Mark Nelson)
- bluestore: os/bluestore: misc fix and cleanups ([pr#16315](https://github.com/ceph/ceph/pull/16315), Jianpeng Ma)
- bluestore: os/bluestore: move object exist in assign nid ([pr#16117](https://github.com/ceph/ceph/pull/16117), Jianpeng Ma)
- bluestore: os/bluestore: narrow cache lock range; make sure min\_alloc\_size p2 aligned ([pr#15911](https://github.com/ceph/ceph/pull/15911), xie xingguo)
- bluestore: os/bluestore: only submit deferred if there is any ([pr#16269](https://github.com/ceph/ceph/pull/16269), Sage Weil)
- bluestore: os/bluestore: reduce some overhead for \_do\_clone\_range() and \_do\_remove() ([pr#15944](https://github.com/ceph/ceph/pull/15944), xie xingguo)
- bluestore: os/bluestore: slightly refactor Blob::try\_reuse\_blob ([pr#15836](https://github.com/ceph/ceph/pull/15836), xie xingguo)
- bluestore: os/bluestore: use bufferlist functions whenever possible ([pr#16158](https://github.com/ceph/ceph/pull/16158), Jianpeng Ma)
- bluestore,performance: os/bluestore: cap rocksdb cache size ([pr#15786](https://github.com/ceph/ceph/pull/15786), Mark Nelson)
- bluestore,performance: os/bluestore: default cache size of 3gb ([pr#15976](https://github.com/ceph/ceph/pull/15976), Sage Weil)
- bluestore,performance: os/bluestore: differ default cache size for hdd/ssd backends ([pr#16157](https://github.com/ceph/ceph/pull/16157), xie xingguo)
- bluestore,performance: os/bluestore/KernelDevice: batch aio submit ([pr#16032](https://github.com/ceph/ceph/pull/16032), Haodong Tang)
- bluestore,performance: os/bluestore: optimized (encode|decode)\_escaped ([pr#15759](https://github.com/ceph/ceph/pull/15759), Piotr Dałek)
- build/ops: build: build erasure-code isa lib without versions ([pr#16205](https://github.com/ceph/ceph/pull/16205), James Page)
- build/ops: build: execute dh\_systemd\_{enable,start} after dh\_install ([issue#19585](http://tracker.ceph.com/issues/19585), [pr#16218](https://github.com/ceph/ceph/pull/16218), James Page)
- build/ops: ceph.in: allow developer mode from outside build tree ([issue#20472](http://tracker.ceph.com/issues/20472), [pr#16055](https://github.com/ceph/ceph/pull/16055), Dan Mick)
- build/ops: ceph\_release: we are in the ‘rc’ phase (12.1.z) ([pr#15957](https://github.com/ceph/ceph/pull/15957), Sage Weil)
- build/ops,core: osd/OSD: auto class on osd start up ([pr#16014](https://github.com/ceph/ceph/pull/16014), xie xingguo)
- build/ops: debian: workaround the bug in dpkg-maintscript-helper ([issue#20453](http://tracker.ceph.com/issues/20453), [pr#16072](https://github.com/ceph/ceph/pull/16072), Kefu Chai)
- build/ops: debian: wrap-and-sort all files ([pr#16110](https://github.com/ceph/ceph/pull/16110), James Page)
- build/ops: os/bluestore: fix build errors when spdk is on ([pr#16118](https://github.com/ceph/ceph/pull/16118), Ilsoo Byun)
- build/ops,rbd,tests: test/librbd: re-enable internal tests in ceph\_test\_librbd ([pr#16255](https://github.com/ceph/ceph/pull/16255), Mykola Golub)
- build/ops,rgw,tests,tools: vstart: allow to start multiple radosgw when RGW=x ([pr#15632](https://github.com/ceph/ceph/pull/15632), Adam Kupczyk)
- build/ops,rgw,tools: vstart: add –rgw\_compression to set rgw compression plugin ([pr#15929](https://github.com/ceph/ceph/pull/15929), Casey Bodley)
- build/ops: rpm: bump epoch ahead of RHEL base ([issue#20508](http://tracker.ceph.com/issues/20508), [pr#16126](https://github.com/ceph/ceph/pull/16126), Ken Dreyer)
- build/ops: rpm: Fix undefined FIRST\_ARG ([issue#20077](http://tracker.ceph.com/issues/20077), [pr#16208](https://github.com/ceph/ceph/pull/16208), Boris Ranto)
- build/ops: rpm: obsolete libcephfs1 ([pr#16074](https://github.com/ceph/ceph/pull/16074), Nathan Cutler)
- build/ops: rpm: sane packaging of %{\_docdir}/ceph directory ([pr#15900](https://github.com/ceph/ceph/pull/15900), Nathan Cutler)
- build/ops: systemd: Add explicit Before=ceph.target ([pr#15835](https://github.com/ceph/ceph/pull/15835), Tim Serong)
- build/ops: systemd/ceph-mgr: remove automagic mgr creation hack ([issue#19994](http://tracker.ceph.com/issues/19994), [pr#16023](https://github.com/ceph/ceph/pull/16023), Sage Weil)
- build/ops,tests,tools: vstart.sh: Work around mgr restfull not available ([pr#15877](https://github.com/ceph/ceph/pull/15877), Willem Jan Withagen)
- cephfs: Remove “experimental” warnings from multimds ([pr#15154](https://github.com/ceph/ceph/pull/15154), John Spray, “Yan, Zheng”)
- cleanup: test,mon,msg: kill clang analyzer warnings ([pr#16320](https://github.com/ceph/ceph/pull/16320), Kefu Chai)
- cmake: fix the build with -DWITH\_ZFS=ON ([pr#15907](https://github.com/ceph/ceph/pull/15907), Kefu Chai)
- cmake: Rewrite HAVE\_BABELTRACE option to [WITH\_](http://localhost:8080/release-notes/#id2793) ([pr#15305](https://github.com/ceph/ceph/pull/15305), Willem Jan Withagen)
- common: auth/RotatingKeyRing: use std::move() to set secrets ([pr#15866](https://github.com/ceph/ceph/pull/15866), Kefu Chai)
- common: ceph.in, mgr: misc cleanups ([pr#16229](https://github.com/ceph/ceph/pull/16229), liuchang0812)
- common: common,config: OPT\_FLOAT and OPT\_DOUBLE output format in config show ([issue#20104](http://tracker.ceph.com/issues/20104), [pr#15647](https://github.com/ceph/ceph/pull/15647), Yanhu Cao)
- common: common/config\_opt: remove unused config ([pr#15874](https://github.com/ceph/ceph/pull/15874), alex.wu)
- common: common/config\_opts: drop unused opt ([pr#15876](https://github.com/ceph/ceph/pull/15876), Yanhu Cao)
- common: common/Mutex.cc: fixed the error in comment ([pr#16214](https://github.com/ceph/ceph/pull/16214), Pan Liu)
- common: common/Timer: do not add event if already shutdown ([issue#20432](http://tracker.ceph.com/issues/20432), [pr#16201](https://github.com/ceph/ceph/pull/16201), Kefu Chai)
- common: compressor/zlib: remove g\_ceph\_context/g\_conf from compressor plugin ([pr#16245](https://github.com/ceph/ceph/pull/16245), Casey Bodley)
- common,core: osd/osd\_types: add flag name (IGNORE\_REDIRECT) ([pr#15795](https://github.com/ceph/ceph/pull/15795), Myoungwon Oh)
- common: fix log warnings ([pr#16056](https://github.com/ceph/ceph/pull/16056), xie xingguo)
- common: initialize array in struct BackTrace ([pr#15864](https://github.com/ceph/ceph/pull/15864), Jos Collin)
- common: libradosstriper: fix format injection vulnerability ([issue#20240](http://tracker.ceph.com/issues/20240), [pr#15674](https://github.com/ceph/ceph/pull/15674), Stan K)
- common: misc cleanups in common, global, os, osd submodules ([pr#16321](https://github.com/ceph/ceph/pull/16321), Yan Jun)
- common: msg/async: make recv\_stamp more precise ([pr#15810](https://github.com/ceph/ceph/pull/15810), Pan Liu)
- common: osdc/Objecter: release message if it’s not handled ([issue#19741](http://tracker.ceph.com/issues/19741), [pr#15890](https://github.com/ceph/ceph/pull/15890), Kefu Chai)
- common: osd/OSDMap: print require\_osd\_release ([pr#15974](https://github.com/ceph/ceph/pull/15974), Sage Weil)
- common: Passing null pointer option\_name to operator << in md\_config\_t::parse\_option() ([pr#15881](https://github.com/ceph/ceph/pull/15881), Jos Collin)
- common,rdma: msg/async/rdma: use lists properly ([pr#15908](https://github.com/ceph/ceph/pull/15908), Adir lev, Adir Lev)
- common,tests: ceph\_test\_rados\_api\_c\_read\_operations: do not assert per-op rval is correct ([issue#19518](http://tracker.ceph.com/issues/19518), [pr#16196](https://github.com/ceph/ceph/pull/16196), Sage Weil)
- common: Update the error string when res\_nsearch() or res\_search() fails ([pr#15878](https://github.com/ceph/ceph/pull/15878), huanwen ren)
- core: ceph-disk/ceph\_disk/main.py: Replace ST\_ISBLK() test by is\_diskdevice() ([pr#15587](https://github.com/ceph/ceph/pull/15587), Willem Jan Withagen)
- core: ceph\_disk/main.py: Allow FreeBSD zap a OSD disk ([pr#15642](https://github.com/ceph/ceph/pull/15642), Willem Jan Withagen)
- core: ceph-disk: set the default systemd unit timeout to 3h ([issue#20229](http://tracker.ceph.com/issues/20229), [pr#15585](https://github.com/ceph/ceph/pull/15585), Loic Dachary)
- core: Context: C\_ContextsBase: delete enclosed contexts in dtor ([issue#20432](http://tracker.ceph.com/issues/20432), [pr#16159](https://github.com/ceph/ceph/pull/16159), Kefu Chai)
- core: crush/CrushWrapper: chooseargs encoding fix ([pr#15984](https://github.com/ceph/ceph/pull/15984), Ilya Dryomov)
- core: crush/CrushWrapper: make get\_immediate\_parent\[\_id\] ignore per-class shadow hierarchy ([issue#20546](http://tracker.ceph.com/issues/20546), [pr#16221](https://github.com/ceph/ceph/pull/16221), Sage Weil)
- core: kv/RocksDBStore: abort if rocksdb EIO, don’t return incorrect result ([pr#15862](https://github.com/ceph/ceph/pull/15862), Haomai Wang)
- core: make the conversion from wire error to host OS work ([pr#15780](https://github.com/ceph/ceph/pull/15780), Willem Jan Withagen)
- core: messages/MOSDPing.h: drop unused fields ([pr#15843](https://github.com/ceph/ceph/pull/15843), Piotr Dałek)
- core,mgr: mgr,librados: service map ([pr#15858](https://github.com/ceph/ceph/pull/15858), Yehuda Sadeh, John Spray, Sage Weil)
- core,mgr,mon: mgr,mon: enable/disable mgr modules via ‘ceph mgr module ...’ commands ([pr#15958](https://github.com/ceph/ceph/pull/15958), Sage Weil)
- core,mgr: mon/PGMap: slightly better debugging around pgmap updates ([pr#15820](https://github.com/ceph/ceph/pull/15820), Sage Weil)
- core: mon/MonClient: respect the priority in SRV RR ([issue#5249](http://tracker.ceph.com/issues/5249), [pr#15964](https://github.com/ceph/ceph/pull/15964), Kefu Chai)
- core: mon/MonmapMonitor: use \_\_func\_\_ instead of hard code function name ([pr#16037](https://github.com/ceph/ceph/pull/16037), Yanhu Cao)
- core,mon: mon/MDSMonitor: fix segv when multiple MDSs raise same alert ([pr#16302](https://github.com/ceph/ceph/pull/16302), Sage Weil)
- core,mon: mon/MgrStatMonitor: avoid dup health warnings during luminous upgrade ([issue#20435](http://tracker.ceph.com/issues/20435), [pr#15986](https://github.com/ceph/ceph/pull/15986), Sage Weil)
- core,mon: mon, osd: misc fixes ([pr#16078](https://github.com/ceph/ceph/pull/16078), xie xingguo)
- core: mon, osd: misc fixes and cleanups ([pr#16160](https://github.com/ceph/ceph/pull/16160), xie xingguo)
- core: mon/OSDMonitor: \_apply\_remap -> \_apply\_upmap; less code redundancy ([pr#15846](https://github.com/ceph/ceph/pull/15846), xie xingguo)
- core: mon/OSDMonitor: do not allow crush device classes until luminous ([pr#16188](https://github.com/ceph/ceph/pull/16188), Sage Weil)
- core: osd/ECTransaction: cleanup the redundant check which works in overwrite IO context ([pr#15765](https://github.com/ceph/ceph/pull/15765), tang.jin)
- core: osd/filestore: Revert “os/filestore: move ondisk in front ([issue#20524](http://tracker.ceph.com/issues/20524), [pr#16156](https://github.com/ceph/ceph/pull/16156), Kefu Chai)
- core: osd/PG: Add two new mClock implementations of the PG sharded operator queue ([pr#14997](https://github.com/ceph/ceph/pull/14997), J. Eric Ivancich)
- core: osd/PG: set clean when last\_epoch\_clean is updated ([issue#19023](http://tracker.ceph.com/issues/19023), [pr#15555](https://github.com/ceph/ceph/pull/15555), Samuel Just)
- core: osd/PrimaryLogPG solve cache tier osd high memory consumption ([issue#20464](http://tracker.ceph.com/issues/20464), [pr#16011](https://github.com/ceph/ceph/pull/16011), Peng Xie)
- core: osd/ReplicatedBackend: reset thread heartbeat after every omap entry … ([issue#20375](http://tracker.ceph.com/issues/20375), [pr#15823](https://github.com/ceph/ceph/pull/15823), Josh Durgin)
- core: os/filestore: call committed\_thru when no journal entries are replayed ([pr#15781](https://github.com/ceph/ceph/pull/15781), Kuan-Kai Chiu)
- core: os/filestore: do not free event if not added ([pr#16235](https://github.com/ceph/ceph/pull/16235), Kefu Chai)
- core: os/filestore: Exclude BTRFS on FreeBSD ([pr#16171](https://github.com/ceph/ceph/pull/16171), Willem Jan Withagen)
- core: os/filestore/FileJournal: FileJournal::open() close journal file before return error ([issue#20504](http://tracker.ceph.com/issues/20504), [pr#16120](https://github.com/ceph/ceph/pull/16120), Yang Honggang)
- core: os/filestore/FileStore.cc: remove a redundant judgement when get max latency ([pr#15961](https://github.com/ceph/ceph/pull/15961), Jianpeng Ma)
- core: os/filestore: require experimental flag for btrfs ([pr#16086](https://github.com/ceph/ceph/pull/16086), Sage Weil)
- core,performance: os/filestore/HashIndex: randomize split threshold by a configurable amount ([issue#15835](http://tracker.ceph.com/issues/15835), [pr#15689](https://github.com/ceph/ceph/pull/15689), Josh Durgin)
- core,performance: os/filestore: queue ondisk completion before apply work ([pr#13918](https://github.com/ceph/ceph/pull/13918), Pan Liu)
- core,performance: src/OSD: add more useful perf counters for performance tuning ([pr#15915](https://github.com/ceph/ceph/pull/15915), Pan Liu)
- core,rbd: mon,osd: do not create rbd pool by default ([pr#15894](https://github.com/ceph/ceph/pull/15894), Greg Farnum, Sage Weil, David Zafman)
- core: src/vstart.sh: kill dead upmap option ([pr#15848](https://github.com/ceph/ceph/pull/15848), xie xingguo)
- core:” Stringify needs access to << before reference” src/include/stringify.h ([pr#16334](https://github.com/ceph/ceph/pull/16334), Willem Jan Withagen)
- core,tests: do all valgrind runs on centos ([issue#20360](http://tracker.ceph.com/issues/20360), [issue#18126](http://tracker.ceph.com/issues/18126), [pr#16046](https://github.com/ceph/ceph/pull/16046), Sage Weil)
- core,tests: qa/objectstore/filestore-btrfs: test btrfs on trusty only ([issue#20169](http://tracker.ceph.com/issues/20169), [pr#15814](https://github.com/ceph/ceph/pull/15814), Sage Weil)
- core,tests: qa: stop testing btrfs ([issue#20169](http://tracker.ceph.com/issues/20169), [pr#16044](https://github.com/ceph/ceph/pull/16044), Sage Weil)
- core,tests: qa/suites/powercycle/osd/tasks/radosbench: consume less space ([issue#20302](http://tracker.ceph.com/issues/20302), [pr#15821](https://github.com/ceph/ceph/pull/15821), Sage Weil)
- core,tests: qa/suites/rados/singleton/all/reg11184: whitelist health warnings ([pr#16306](https://github.com/ceph/ceph/pull/16306), Sage Weil)
- core,tests: qa/suites/rados/thrash/workload/\*: enable rados.py cache tiering ops ([issue#11793](http://tracker.ceph.com/issues/11793), [pr#16244](https://github.com/ceph/ceph/pull/16244), Sage Weil)
- core,tests: qa/tasks/ceph\_manager: wait longer for pg stats to flush ([pr#16322](https://github.com/ceph/ceph/pull/16322), Sage Weil)
- core,tests: qa/tasks/ceph.py: no osd id to ‘osd create’ command ([issue#20548](http://tracker.ceph.com/issues/20548), [pr#16233](https://github.com/ceph/ceph/pull/16233), Sage Weil)
- core,tests: qa/tasks/ceph: simplify ceph deployment slightly ([pr#15853](https://github.com/ceph/ceph/pull/15853), Sage Weil)
- core,tests: qa/tasks/dump\_stuck: fix for active+clean+remapped ([issue#20431](http://tracker.ceph.com/issues/20431), [pr#15955](https://github.com/ceph/ceph/pull/15955), Sage Weil)
- core,tests: qa/tasks/radosbench: longer timeout ([pr#16213](https://github.com/ceph/ceph/pull/16213), Sage Weil)
- crush: silence warning from -Woverflow ([pr#16329](https://github.com/ceph/ceph/pull/16329), Jos Collin)
- doc: dev: add notes on PR make check validation test ([pr#16079](https://github.com/ceph/ceph/pull/16079), Nathan Cutler)
- doc: doc/mgr/dashboard: update dashboard docs to reflect new defaults ([pr#16241](https://github.com/ceph/ceph/pull/16241), Sage Weil)
- doc: doc/rados.8: add offset option for put command ([pr#16155](https://github.com/ceph/ceph/pull/16155), Jianpeng Ma)
- doc: doc/release-notes: add Images creation timestamp note ([pr#15963](https://github.com/ceph/ceph/pull/15963), clove)
- doc: doc/release-notes: fix ceph-deploy command ([pr#15987](https://github.com/ceph/ceph/pull/15987), Sage Weil)
- doc: doc/release-notes: Luminous release notes typo fixes “ceph config-key ls”->”ceph config-key list” ([pr#16330](https://github.com/ceph/ceph/pull/16330), scienceluo)
- doc: doc/release-notes: Luminous release notes typo fixes ([pr#16338](https://github.com/ceph/ceph/pull/16338), Luo Kexue)
- doc: doc/release-notes: update luminous notes ([pr#15851](https://github.com/ceph/ceph/pull/15851), Sage Weil)
- doc: doc/releases: Update releases from Feb 2017 to July 2017 ([pr#16303](https://github.com/ceph/ceph/pull/16303), Bryan Stillwell)
- doc: docs: mgr dashboard ([pr#15920](https://github.com/ceph/ceph/pull/15920), Wido den Hollander)
- doc: fix link for ceph-mgr cephx authorization ([pr#16246](https://github.com/ceph/ceph/pull/16246), Greg Farnum)
- doc: Jewel v10.2.8 release notes ([pr#16274](https://github.com/ceph/ceph/pull/16274), Nathan Cutler)
- doc: Jewel v10.2.9 release notes ([pr#16318](https://github.com/ceph/ceph/pull/16318), Nathan Cutler)
- doc: kill sphinx warnings ([pr#16198](https://github.com/ceph/ceph/pull/16198), Kefu Chai)
- doc: Luminous release notes typo fixes ([pr#15899](https://github.com/ceph/ceph/pull/15899), Abhishek Lekshmanan)
- doc: mailmap: add Myoungwon Oh’s mailmap and affiliation ([pr#15934](https://github.com/ceph/ceph/pull/15934), Myoungwon Oh)
- doc: mailmap, organizationmap: add affiliation for Tushar Gohad ([pr#16081](https://github.com/ceph/ceph/pull/16081), Tushar Gohad)
- doc: .mailmap, .organizationmap: Update Fan Yang information and affiliation ([pr#16067](https://github.com/ceph/ceph/pull/16067), Fan Yang)
- doc: .mailmap, .organizationmap: Update Song Weibin information and affiliation ([pr#16311](https://github.com/ceph/ceph/pull/16311), songweibin)
- doc: mgr/restful: bind to :: and update docs ([pr#16267](https://github.com/ceph/ceph/pull/16267), Sage Weil)
- doc: update intro, quick start docs ([pr#16224](https://github.com/ceph/ceph/pull/16224), Sage Weil)
- doc: v12.1.0 release notes notable changes addition again ([pr#15857](https://github.com/ceph/ceph/pull/15857), Abhishek Lekshmanan)
- librados: add log channel to rados\_monitor\_log2 callback ([pr#15926](https://github.com/ceph/ceph/pull/15926), Sage Weil)
- librados: redirect balanced reads to acting primary when targeting object isn’t recovered ([issue#17968](http://tracker.ceph.com/issues/17968), [pr#15489](https://github.com/ceph/ceph/pull/15489), Xuehan Xu)
- librbd: fail IO request when exclusive lock cannot be obtained ([pr#15860](https://github.com/ceph/ceph/pull/15860), Jason Dillaman)
- mgr: clean up daemon start process ([issue#20383](http://tracker.ceph.com/issues/20383), [pr#16020](https://github.com/ceph/ceph/pull/16020), John Spray)
- mgr: clean up fsstatus module ([pr#15925](https://github.com/ceph/ceph/pull/15925), John Spray)
- mgr: cluster log message on plugin load error ([pr#15927](https://github.com/ceph/ceph/pull/15927), John Spray)
- mgr: dashboard improvements ([pr#16043](https://github.com/ceph/ceph/pull/16043), John Spray)
- mgr: drop repeated log info. and unnecessary write permission ([pr#15896](https://github.com/ceph/ceph/pull/15896), Yan Jun)
- mgr: enable ceph\_send\_command() to send pg command ([pr#15865](https://github.com/ceph/ceph/pull/15865), Kefu Chai)
- mgr: increase debug level for ticks 0 -> 10 ([pr#16301](https://github.com/ceph/ceph/pull/16301), Dan Mick)
- mgr: mgr/ClusterState: do not mangle PGMap outside of Incremental ([issue#20208](http://tracker.ceph.com/issues/20208), [pr#16262](https://github.com/ceph/ceph/pull/16262), Sage Weil)
- mgr: mgr/dashboard: add OSD list view ([pr#16373](https://github.com/ceph/ceph/pull/16373), John Spray)
- mgr: mon/mgr: add detail error infomation ([pr#16048](https://github.com/ceph/ceph/pull/16048), Yan Jun)
- mgr,mon: mgr,mon: debug init and mgrdigest subscriptions ([issue#20633](http://tracker.ceph.com/issues/20633), [pr#16351](https://github.com/ceph/ceph/pull/16351), Sage Weil)
- mgr: pybind/mgr/dashboard: bind to :: by default ([pr#16223](https://github.com/ceph/ceph/pull/16223), Sage Weil)
- mgr,rbd: pybind/mgr/dashboard: initial block integration ([pr#15521](https://github.com/ceph/ceph/pull/15521), Jason Dillaman)
- mgr: Zabbix monitoring module ([pr#16019](https://github.com/ceph/ceph/pull/16019), Wido den Hollander)
- mon: add support public\_bind\_addr option ([pr#16189](https://github.com/ceph/ceph/pull/16189), Bassam Tabbara)
- mon: a few more upmap (and other) fixes ([pr#16239](https://github.com/ceph/ceph/pull/16239), xie xingguo)
- mon: clean up in ceph\_mon.cc ([pr#14102](https://github.com/ceph/ceph/pull/14102), huanwen ren)
- mon: collect mon metdata as part of the election ([issue#20434](http://tracker.ceph.com/issues/20434), [pr#16148](https://github.com/ceph/ceph/pull/16148), Sage Weil)
- mon: debug session feature tracking ([issue#20475](http://tracker.ceph.com/issues/20475), [pr#16128](https://github.com/ceph/ceph/pull/16128), Sage Weil)
- mon: Division by zero in PGMapDigest::dump\_pool\_stats\_full() ([pr#15901](https://github.com/ceph/ceph/pull/15901), Jos Collin)
- mon: do crushtool test with fork and timeout, but w/o exec of crushtool ([issue#19964](http://tracker.ceph.com/issues/19964), [pr#16025](https://github.com/ceph/ceph/pull/16025), Sage Weil)
- mon: Filter log last output by severity and channel ([pr#15924](https://github.com/ceph/ceph/pull/15924), John Spray)
- mon: fix hang on deprecated/removed ‘pg [set\_](http://localhost:8080/release-notes/#id2795)\*full\_ratio’ commands ([issue#20600](http://tracker.ceph.com/issues/20600), [pr#16300](https://github.com/ceph/ceph/pull/16300), Sage Weil)
- mon: fix kvstore type in mon compact command ([pr#15954](https://github.com/ceph/ceph/pull/15954), liuchang0812)
- mon: Fix status output warning for mon\_warn\_osd\_usage\_min\_max\_delta ([issue#20544](http://tracker.ceph.com/issues/20544), [pr#16220](https://github.com/ceph/ceph/pull/16220), David Zafman)
- mon: handle cases where store->get() may return error ([issue#19601](http://tracker.ceph.com/issues/19601), [pr#14678](https://github.com/ceph/ceph/pull/14678), Jos Collin)
- mon: include device class in tree view; hide shadow hierarchy ([pr#16016](https://github.com/ceph/ceph/pull/16016), Sage Weil)
- mon: maintain the “cluster” PerfCounters when using ceph-mgr ([issue#20562](http://tracker.ceph.com/issues/20562), [pr#16249](https://github.com/ceph/ceph/pull/16249), Greg Farnum)
- mon: mon,crush: create crush rules using device classes for replicated and ec pools via cli ([pr#16027](https://github.com/ceph/ceph/pull/16027), Sage Weil)
- mon: mon/MgrStatMonitor: do not crash on luminous dev version upgrades ([pr#16287](https://github.com/ceph/ceph/pull/16287), Sage Weil)
- mon: mon/Monitor: recreate mon session if features changed ([issue#20433](http://tracker.ceph.com/issues/20433), [pr#16230](https://github.com/ceph/ceph/pull/16230), Joao Eduardo Luis)
- mon: mon/OSDMonitor: a couple of upmap and other fixes ([pr#15917](https://github.com/ceph/ceph/pull/15917), xie xingguo)
- mon: mon/OSDMonitor: guard ‘osd crush set-device-class’ ([pr#16217](https://github.com/ceph/ceph/pull/16217), Sage Weil)
- mon: mon/OSDMonitor: “osd crush class rename” support ([pr#15875](https://github.com/ceph/ceph/pull/15875), xie xingguo)
- mon: mon/OSDMonitor: two pool opts related fix ([pr#15968](https://github.com/ceph/ceph/pull/15968), xie xingguo)
- mon: mon/PaxosService: use \_\_func\_\_ instead of hard code function name ([pr#15863](https://github.com/ceph/ceph/pull/15863), Yanhu Cao)
- mon: revamp health check/warning system ([pr#15643](https://github.com/ceph/ceph/pull/15643), John Spray, Sage Weil)
- mon: show the leader info on mon stat command ([pr#14178](https://github.com/ceph/ceph/pull/14178), song baisen)
- mon: skip crush smoke test when running under valgrind ([issue#20602](http://tracker.ceph.com/issues/20602), [pr#16346](https://github.com/ceph/ceph/pull/16346), Sage Weil)
- mon,tests: qa/suites: add test exercising workunits/mon/auth\_caps.sh ([pr#15754](https://github.com/ceph/ceph/pull/15754), Kefu Chai)
- msg: make listen backlog an option, increase from 128 to 512 ([issue#20330](http://tracker.ceph.com/issues/20330), [pr#15743](https://github.com/ceph/ceph/pull/15743), Haomai Wang)
- msg: msg/async: increase worker reference with local listen table enabled backend ([issue#20390](http://tracker.ceph.com/issues/20390), [pr#15897](https://github.com/ceph/ceph/pull/15897), Haomai Wang)
- msg: msg/async/rdma: Data path fixes ([pr#15903](https://github.com/ceph/ceph/pull/15903), Adir lev)
- msg: msg/async/rdma: register buffer as continuous ([pr#15967](https://github.com/ceph/ceph/pull/15967), Adir Lev)
- msg: msg/async/rdma: remove assert from ibv\_dealloc\_pd in ProtectionDomain ([pr#15832](https://github.com/ceph/ceph/pull/15832), DanielBar-On)
- msg: msg/MOSDOpReply: fix missing trace decode ([pr#15999](https://github.com/ceph/ceph/pull/15999), Yan Jun)
- msg: QueueStrategy::wait() joins all threads ([issue#20534](http://tracker.ceph.com/issues/20534), [pr#16194](https://github.com/ceph/ceph/pull/16194), Casey Bodley)
- msg: Revert “msg/async: increase worker reference with local listen table enabled backend” ([issue#20603](http://tracker.ceph.com/issues/20603), [pr#16323](https://github.com/ceph/ceph/pull/16323), Haomai Wang)
- osd: Check for and automatically repair object info soid during scrub ([issue#20471](http://tracker.ceph.com/issues/20471), [pr#16052](https://github.com/ceph/ceph/pull/16052), David Zafman)
- osd: check queue\_transaction return value ([pr#15873](https://github.com/ceph/ceph/pull/15873), zhanglei)
- osd: clear\_queued\_recovery() in on\_shutdown() ([issue#20432](http://tracker.ceph.com/issues/20432), [pr#16093](https://github.com/ceph/ceph/pull/16093), Kefu Chai)
- osd: compact osd feature ([issue#19592](http://tracker.ceph.com/issues/19592), [pr#16045](https://github.com/ceph/ceph/pull/16045), liuchang0812)
- osd: Corrupt objects stop snaptrim and mark pg snaptrim\_error ([issue#13837](http://tracker.ceph.com/issues/13837), [pr#15635](https://github.com/ceph/ceph/pull/15635), David Zafman)
- osd: dump the field name of object watchers and cleanups ([pr#15946](https://github.com/ceph/ceph/pull/15946), Yan Jun)
- osd: Execute crush\_location\_hook when configured in ceph.conf ([pr#15951](https://github.com/ceph/ceph/pull/15951), Wido den Hollander)
- osd: On EIO from read recover the primary replica from another copy ([issue#18165](http://tracker.ceph.com/issues/18165), [pr#14760](https://github.com/ceph/ceph/pull/14760), David Zafman)
- osd: osd does not using MPing Messages,do not include unused include ([pr#15833](https://github.com/ceph/ceph/pull/15833), linbing)
- osd: Preserve OSDOp information for historic ops ([pr#15265](https://github.com/ceph/ceph/pull/15265), Guo-Fu Tseng)
- osd: restart boot process if waiting for luminous mons ([issue#20631](http://tracker.ceph.com/issues/20631), [pr#16341](https://github.com/ceph/ceph/pull/16341), Sage Weil)
- osd: unlock sdata\_op\_ordering\_lock with sdata\_lock hold to avoid miss… ([pr#15891](https://github.com/ceph/ceph/pull/15891), Ming Lin)
- pybind: ceph.in: Check return value when connecting ([pr#16130](https://github.com/ceph/ceph/pull/16130), Douglas Fuller)
- pybind: ceph-rest-api: Various REST API fixes ([pr#15910](https://github.com/ceph/ceph/pull/15910), Wido den Hollander)
- pybind: pybind/mgr/dashboard: fix get kernel\_version error ([pr#16094](https://github.com/ceph/ceph/pull/16094), Peng Zhang)
- pybind: restore original API for backwards compatibility ([issue#20421](http://tracker.ceph.com/issues/20421), [pr#15932](https://github.com/ceph/ceph/pull/15932), Jason Dillaman)
- rbd: do not attempt to load key if auth is disabled ([issue#19035](http://tracker.ceph.com/issues/19035), [pr#16024](https://github.com/ceph/ceph/pull/16024), Jason Dillaman)
- rbd-mirror: ignore permission errors on rbd\_mirroring object ([issue#20571](http://tracker.ceph.com/issues/20571), [pr#16264](https://github.com/ceph/ceph/pull/16264), Jason Dillaman)
- rbd,tests: qa/suites/rbd: restrict python memcheck validation to CentOS ([pr#15923](https://github.com/ceph/ceph/pull/15923), Jason Dillaman)
- rbd,tests: qa/tasks: rbd-mirror daemon not properly run in foreground mode ([issue#20630](http://tracker.ceph.com/issues/20630), [pr#16340](https://github.com/ceph/ceph/pull/16340), Jason Dillaman)
- rbd,tests: test: fix compile warning in ceph\_test\_cls\_rbd ([pr#15919](https://github.com/ceph/ceph/pull/15919), Jason Dillaman)
- rbd,tests: test: fix failing rbd devstack teuthology test ([pr#15956](https://github.com/ceph/ceph/pull/15956), Jason Dillaman)
- rbd,tools: tools/rbd\_mirror: initialize non-static class member m\_do\_resync in ImageReplayer ([pr#15889](https://github.com/ceph/ceph/pull/15889), Jos Collin)
- rbd,tools: tools/rbd\_nbd: add –version show support ([pr#16254](https://github.com/ceph/ceph/pull/16254), Jin Cai)
- rgw: add a new error code for non-existed subuser ([pr#16095](https://github.com/ceph/ceph/pull/16095), Zhao Chao)
- rgw: add a new error code for non-existed user ([issue#20468](http://tracker.ceph.com/issues/20468), [pr#16033](https://github.com/ceph/ceph/pull/16033), Zhao Chao)
- rgw: add missing RGWPeriod::reflect() based on new atomic update\_latest\_epoch() ([issue#19816](http://tracker.ceph.com/issues/19816), [issue#19817](http://tracker.ceph.com/issues/19817), [pr#14915](https://github.com/ceph/ceph/pull/14915), Casey Bodley)
- rgw: auto reshard old buckets ([pr#15665](https://github.com/ceph/ceph/pull/15665), Orit Wasserman)
- rgw: cleanup rgw-admin duplicated judge during OLH GET/READLOG ([pr#15700](https://github.com/ceph/ceph/pull/15700), Jiaying Ren)
- rgw: cls: ceph::timespan tag\_timeout wrong units ([issue#20380](http://tracker.ceph.com/issues/20380), [pr#16026](https://github.com/ceph/ceph/pull/16026), Matt Benjamin)
- rgw: Compress crash bug refactor ([issue#20098](http://tracker.ceph.com/issues/20098), [pr#15569](https://github.com/ceph/ceph/pull/15569), Adam Kupczyk)
- rgw: Correcting the condition in ceph\_assert while parsing an AWS Principal ([pr#15997](https://github.com/ceph/ceph/pull/15997), Pritha Srivastava)
- rgw: Do not fetch bucket stats by default upon bucket listing ([issue#20377](http://tracker.ceph.com/issues/20377), [pr#15834](https://github.com/ceph/ceph/pull/15834), Pavan Rallabhandi)
- rgw: drop unused function RGWRemoteDataLog::get\_shard\_info() ([pr#16236](https://github.com/ceph/ceph/pull/16236), Shasha Lu)
- rgw: drop unused rgw\_pool parameter, local variables and member variable ([pr#16154](https://github.com/ceph/ceph/pull/16154), Jiaying Ren)
- rgw: external auth engines of S3 honor rgw\_keystone\_implicit\_tenants ([issue#17779](http://tracker.ceph.com/issues/17779), [pr#15572](https://github.com/ceph/ceph/pull/15572), Radoslaw Zarzynski)
- rgw: Fix a bug that multipart upload may exceed the quota ([issue#19602](http://tracker.ceph.com/issues/19602), [pr#12010](https://github.com/ceph/ceph/pull/12010), Zhang Shaowen)
- rgw: Fix duplicate tag removal during GC ([issue#20107](http://tracker.ceph.com/issues/20107), [pr#15912](https://github.com/ceph/ceph/pull/15912), Jens Rosenboom)
- rgw: fix error handling in get\_params() of RGWPostObj\_ObjStore\_S3 ([pr#15670](https://github.com/ceph/ceph/pull/15670), Radoslaw Zarzynski)
- rgw: fix error handling in the link() method of RGWBucket ([issue#20279](http://tracker.ceph.com/issues/20279), [pr#15669](https://github.com/ceph/ceph/pull/15669), Radoslaw Zarzynski)
- rgw: fixes for AWSBrowserUploadAbstractor auth ([issue#20372](http://tracker.ceph.com/issues/20372), [pr#15882](https://github.com/ceph/ceph/pull/15882), Radoslaw Zarzynski, Casey Bodley)
- rgw: fix infinite loop in rest api for log list ([issue#20386](http://tracker.ceph.com/issues/20386), [pr#15983](https://github.com/ceph/ceph/pull/15983), xierui, Casey Bodley)
- rgw: fix leaks with incomplete multiparts ([issue#17164](http://tracker.ceph.com/issues/17164), [pr#15630](https://github.com/ceph/ceph/pull/15630), Abhishek Varshney)
- rgw: fix marker encoding problem ([issue#20463](http://tracker.ceph.com/issues/20463), [pr#15998](https://github.com/ceph/ceph/pull/15998), Marcus Watts)
- rgw: fix memory leak in copy\_obj\_to\_remote\_dest ([pr#9974](https://github.com/ceph/ceph/pull/9974), weiqiaomiao)
- rgw: fix not initialized vars which cause rgw crash with ec data pool ([issue#20542](http://tracker.ceph.com/issues/20542), [pr#16177](https://github.com/ceph/ceph/pull/16177), Aleksei Gutikov)
- rgw: fix potential null pointer dereference in rgw\_admin ([pr#15667](https://github.com/ceph/ceph/pull/15667), Radoslaw Zarzynski)
- rgw: fix radosgw-admin data sync run crash ([issue#20423](http://tracker.ceph.com/issues/20423), [pr#15938](https://github.com/ceph/ceph/pull/15938), Shasha Lu)
- rgw: fix s3 object uploads with chunked transfers and v4 signatures ([issue#20447](http://tracker.ceph.com/issues/20447), [pr#15965](https://github.com/ceph/ceph/pull/15965), Marcus Watts)
- rgw: fix wrong error code for expired Swift TempURL’s links ([issue#20384](http://tracker.ceph.com/issues/20384), [pr#15850](https://github.com/ceph/ceph/pull/15850), Radoslaw Zarzynski)
- rgw: fix zone did’t update realm\_id when added to zonegroup ([issue#17995](http://tracker.ceph.com/issues/17995), [pr#12139](https://github.com/ceph/ceph/pull/12139), Tianshan Qu)
- rgw: implement get/put object tags for S3 ([pr#13753](https://github.com/ceph/ceph/pull/13753), Abhishek Lekshmanan)
- rgw: /info claims we do support Swift’s accounts ACLs ([issue#20394](http://tracker.ceph.com/issues/20394), [pr#15887](https://github.com/ceph/ceph/pull/15887), Radoslaw Zarzynski)
- rgw: initialize non-static class members in ESQueryCompiler ([pr#15884](https://github.com/ceph/ceph/pull/15884), Jos Collin)
- rgw: initialize Non-static class member val in ESQueryNodeLeafVal\_Int ([pr#15888](https://github.com/ceph/ceph/pull/15888), Jos Collin)
- rgw: initialize Non-static class member worker in RGWReshard ([pr#15886](https://github.com/ceph/ceph/pull/15886), Jos Collin)
- rgw: Initialize pointer fields ([pr#16021](https://github.com/ceph/ceph/pull/16021), Jos Collin)
- rgw: lease\_stack: use reset method instead of assignment ([pr#16185](https://github.com/ceph/ceph/pull/16185), Nathan Cutler)
- rgw: lock is not released when set sync marker is failed ([issue#18077](http://tracker.ceph.com/issues/18077), [pr#12197](https://github.com/ceph/ceph/pull/12197), Zhang Shaowen)
- rgw: log\_meta only for more than one zone ([issue#20357](http://tracker.ceph.com/issues/20357), [pr#15777](https://github.com/ceph/ceph/pull/15777), Orit Wasserman, Leo Zhang)
- rgw: multipart copy-part remove ‘/’ for s3 java sdk request header ([issue#20075](http://tracker.ceph.com/issues/20075), [pr#15283](https://github.com/ceph/ceph/pull/15283), root)
- rgw:multisite: fix RGWRadosRemoveOmapKeysCR and change cn to intrusive\_ptr ([issue#20539](http://tracker.ceph.com/issues/20539), [pr#16197](https://github.com/ceph/ceph/pull/16197), Shasha Lu)
- rgw: omit X-Account-Access-Control if there is no grant to serialize ([issue#20395](http://tracker.ceph.com/issues/20395), [pr#15883](https://github.com/ceph/ceph/pull/15883), Radoslaw Zarzynski)
- rgw: radosgw: fix compilation with cryptopp ([pr#15960](https://github.com/ceph/ceph/pull/15960), Adam Kupczyk)
- rgw: reject request if decoded URI contains 0 in the middle ([issue#20418](http://tracker.ceph.com/issues/20418), [pr#15953](https://github.com/ceph/ceph/pull/15953), Radoslaw Zarzynski)
- rgw: remove a redundant judgement in rgw\_rados.cc:delete\_obj ([pr#11124](https://github.com/ceph/ceph/pull/11124), Zhang Shaowen)
- rgw: remove the useless output when listing zonegroups ([pr#16331](https://github.com/ceph/ceph/pull/16331), Zhang Shaowen)
- rgw: Replace get\_zonegroup().is\_master\_zonegroup() with is\_meta\_master() in RGWBulkDelete::Deleter::delete\_single() ([pr#16062](https://github.com/ceph/ceph/pull/16062), Fan Yang)
- rgw: rgw\_file: add compression interop to RGW NFS ([issue#20462](http://tracker.ceph.com/issues/20462), [pr#15989](https://github.com/ceph/ceph/pull/15989), Matt Benjamin)
- rgw: rgw\_file: add service map registration ([pr#16251](https://github.com/ceph/ceph/pull/16251), Matt Benjamin)
- rgw: rgw\_file: avoid a recursive lane lock in LRU drain ([issue#20374](http://tracker.ceph.com/issues/20374), [pr#15819](https://github.com/ceph/ceph/pull/15819), Matt Benjamin)
- rgw: rgw\_file: fix misuse of make\_key\_name before make\_fhk ([pr#15108](https://github.com/ceph/ceph/pull/15108), Gui Hecheng)
- rgw: rgw\_file skip policy read for virtual components ([pr#16034](https://github.com/ceph/ceph/pull/16034), Gui Hecheng)
- rgw: rgw：fix s3 aws v2 signature priority between header\[‘X-Amz-Date’\] and header\[‘Date’\] ([issue#20176](http://tracker.ceph.com/issues/20176), [pr#15467](https://github.com/ceph/ceph/pull/15467), yuliyang)
- rgw: rgw: fix the subdir without slash of s3 website url ([issue#20307](http://tracker.ceph.com/issues/20307), [pr#15703](https://github.com/ceph/ceph/pull/15703), liuhong)
- rgw: rgw/rgw\_frontend.h: Return negative value for empty uid in RGWLoadGenFrontend::init() ([pr#16204](https://github.com/ceph/ceph/pull/16204), jimifm)
- rgw: rgw/rgw\_op: fix whitespace and indentation warning ([pr#15928](https://github.com/ceph/ceph/pull/15928), Sage Weil)
- rgw: rgw/rgw\_rados: Remove duplicate calls in RGWRados::finalize() ([pr#15281](https://github.com/ceph/ceph/pull/15281), jimifm)
- rgw: rgw,test: fix rgw placement rule pool config option ([pr#16084](https://github.com/ceph/ceph/pull/16084), Jiaying Ren)
- rgw: S3 lifecycle now supports expiration date ([pr#15807](https://github.com/ceph/ceph/pull/15807), Zhang Shaowen)
- rgw: silence compile warning from -Wmaybe-uninitialized ([pr#15996](https://github.com/ceph/ceph/pull/15996), Jiaying Ren)
- rgw: silence warning from -Wmaybe-uninitialized ([pr#15949](https://github.com/ceph/ceph/pull/15949), Jos Collin)
- rgw,tests: qa/tasks: S3A hadoop task to test s3a with Ceph ([pr#14624](https://github.com/ceph/ceph/pull/14624), Vasu Kulkarni)
- rgw,tests: vstart: remove rgw\_enable\_static\_website ([pr#15856](https://github.com/ceph/ceph/pull/15856), Casey Bodley)
- rgw: Uninitialized member in LCRule ([pr#15827](https://github.com/ceph/ceph/pull/15827), Jos Collin)
- rgw: use 64-bit offsets for compression ([issue#20231](http://tracker.ceph.com/issues/20231), [pr#15656](https://github.com/ceph/ceph/pull/15656), Adam Kupczyk, fang yuxiang)
- rgw: use uncompressed size for range\_to\_ofs() in slo/dlo ([pr#15931](https://github.com/ceph/ceph/pull/15931), Casey Bodley)
- rgw: using RGW\_OBJ\_NS\_MULTIPART in check\_bad\_index\_multipart ([pr#15774](https://github.com/ceph/ceph/pull/15774), Shasha Lu)
- rgw: verify md5 in post obj ([issue#19739](http://tracker.ceph.com/issues/19739), [pr#14961](https://github.com/ceph/ceph/pull/14961), Yehuda Sadeh)
- rgw: Wip rgw fix prefix list ([issue#19432](http://tracker.ceph.com/issues/19432), [pr#15916](https://github.com/ceph/ceph/pull/15916), Giovani Rinaldi, Orit Wasserman)
- tests: ceph-disk: use communicate() instead of wait() for output ([pr#16347](https://github.com/ceph/ceph/pull/16347), Kefu Chai)
- tests: cls\_lock: move lock\_info\_t definition to cls\_lock\_types.h ([pr#16091](https://github.com/ceph/ceph/pull/16091), runsisi)
- tests: fix rados/upgrade/jewel-x-singleton and make workunit task handle repo URLs not ending in ”.git” ([issue#20554](http://tracker.ceph.com/issues/20554), [issue#20368](http://tracker.ceph.com/issues/20368), [pr#16228](https://github.com/ceph/ceph/pull/16228), Nathan Cutler, Sage Weil)
- tests: mgr,os,test: kill clang analyzer warnings ([pr#16227](https://github.com/ceph/ceph/pull/16227), Kefu Chai)
- tests: move swift.py task from teuthology to ceph, phase one (master) ([issue#20392](http://tracker.ceph.com/issues/20392), [pr#15859](https://github.com/ceph/ceph/pull/15859), Nathan Cutler, Sage Weil, Warren Usui, Greg Farnum, Ali Maredia, Tommi Virtanen, Zack Cerza, Sam Lang, Yehuda Sadeh, Joe Buck, Josh Durgin)
- tests: \[qa/ceph-deploy\]: run create mgr nodes as well ([pr#16216](https://github.com/ceph/ceph/pull/16216), Vasu Kulkarni)
- tests: qa: do not restrict valgrind runs to centos ([issue#18126](http://tracker.ceph.com/issues/18126), [pr#15893](https://github.com/ceph/ceph/pull/15893), Greg Farnum)
- tests: qa/suites/rados/singleton/all/mon-auth-caps: more osds so we can go clean ([pr#16225](https://github.com/ceph/ceph/pull/16225), Sage Weil)
- tests: qa/suites/upgrade/hammer-jewel-x: add luminous.yaml ([issue#20342](http://tracker.ceph.com/issues/20342), [pr#15764](https://github.com/ceph/ceph/pull/15764), Kefu Chai)
- tests: qa/tasks/ceph: don’t hard-code cluster name when copying fsid ([pr#16212](https://github.com/ceph/ceph/pull/16212), Jason Dillaman)
- tests: qa/tasks/ceph: should be “Waiting for all PGs”, not “all osds” ([pr#16122](https://github.com/ceph/ceph/pull/16122), Kefu Chai)
- tests: qa/tasks/radosbench: increase timeout ([pr#15885](https://github.com/ceph/ceph/pull/15885), Sage Weil)
- tests: qa/workunits/ceph-helpers: enable experimental features for osd ([pr#16319](https://github.com/ceph/ceph/pull/16319), Kefu Chai)
- tests: qa/workunits/ceph-helpers: test wait\_for\_health\_ok differently ([pr#16317](https://github.com/ceph/ceph/pull/16317), Kefu Chai)
- tests: rgw.py: put client roles in a separate list ([issue#20417](http://tracker.ceph.com/issues/20417), [pr#15913](https://github.com/ceph/ceph/pull/15913), Nathan Cutler)
- tests: rgw/singleton: drop duplicate filestore-xfs.yaml ([pr#15959](https://github.com/ceph/ceph/pull/15959), Nathan Cutler)
- tests: test: Division by zero in Legacy::encode\_n() ([pr#15902](https://github.com/ceph/ceph/pull/15902), Jos Collin)
- tests: test/fio: print all perfcounters rather than objectstore itself ([pr#16339](https://github.com/ceph/ceph/pull/16339), Jianpeng Ma)
- tests: test/fio: remove experimental option for bluestore & rocksdb ([pr#16263](https://github.com/ceph/ceph/pull/16263), Pan Liu)
- tests: test: Fix reg11184 test to remove extraneous pg ([pr#16265](https://github.com/ceph/ceph/pull/16265), David Zafman)
- tests: test/msgr: fixed the hang issue for perf\_msg\_client ([pr#16358](https://github.com/ceph/ceph/pull/16358), Pan Liu)
- tests: test/osd/osd-scrub-repair.sh: disable ec\_overwrite tests on FreeBSD ([pr#15445](https://github.com/ceph/ceph/pull/15445), Willem Jan Withagen)
- tests: test/osd/osd-scrub-repair.sh: Fix diff options on FreeBSD ([pr#15914](https://github.com/ceph/ceph/pull/15914), Willem Jan Withagen)
- tests,tools: test, ceph-osdomap-tool: kill clang warnings ([pr#15905](https://github.com/ceph/ceph/pull/15905), Kefu Chai)
- tools: ceph-conf: fix typo in usage: ‘mon add’ should be ‘mon addr’ ([pr#15935](https://github.com/ceph/ceph/pull/15935), Peng Zhang)
- tools: ceph-create-keys: add an argument to override default 10-minute timeout ([pr#16049](https://github.com/ceph/ceph/pull/16049), Douglas Fuller)
- tools: ceph.in: filter out audit from ceph -w ([pr#16345](https://github.com/ceph/ceph/pull/16345), John Spray)
- tools: ceph-release-notes: escape asterisks not for inline emphasis ([pr#16199](https://github.com/ceph/ceph/pull/16199), Kefu Chai)
- tools: ceph-release-notes: handle an edge case ([pr#16277](https://github.com/ceph/ceph/pull/16277), Nathan Cutler)
- tools: Cleanup dead code in ceph-objectstore-tool ([pr#15812](https://github.com/ceph/ceph/pull/15812), David Zafman)
- tools: libradosstriper: fix MultiAioCompletion leaks on failure ([pr#15471](https://github.com/ceph/ceph/pull/15471), Kefu Chai)
- tools: tools/rados: some cleanups ([pr#16147](https://github.com/ceph/ceph/pull/16147), Yan Jun)
- tools: vstart.sh: bind restful, dashboard to ::, not 127.0.0.1 ([pr#16349](https://github.com/ceph/ceph/pull/16349), Sage Weil)
