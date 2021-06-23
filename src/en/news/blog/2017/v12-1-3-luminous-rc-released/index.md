---
title: "v12.1.3 Luminous (RC) released"
date: "2017-08-11"
author: "TheAnalyst"
---

This is the final release candidate for Luminous, the next long term stable release.

Ceph Luminous (v12.2.0) will be the foundation for the next long-term stable release series. There have been major changes since Kraken (v11.2.z) and Jewel (v10.2.z), and the upgrade process is non-trivial. Please read these release notes carefully.

### Major Changes from Kraken

- _General_:
    
    - Ceph now has a simple, [built-in web-based dashboard](http://docs.ceph.com/docs/master/mgr/dashboard) for monitoring cluster status.
- _RADOS_:
    
    - _BlueStore_:
        
        - The new _BlueStore_ backend for _ceph-osd_ is now stable and the new default for newly created OSDs. BlueStore manages data stored by each OSD by directly managing the physical HDDs or SSDs without the use of an intervening file system like XFS. This provides greater performance and features. See [_Storage Devices_](http://docs.ceph.com/docs/master/rados/configuration/storage-devices/) and [_BlueStore Config Reference_](http://docs.ceph.com/docs/master/rados/configuration/bluestore-config-ref/).
        - BlueStore supports [full data and metadata checksums](../rados/configuration/bluestore-config-ref/#checksums) of all data stored by Ceph.
        - BlueStore supports [inline compression](http://docs.ceph.com/rados/configuration/bluestore-config-ref/#inline-compression) using zlib, snappy, or LZ4. (Ceph also supports zstd for [RGW compression](http://docs.ceph.com/man/8/radosgw-admin/#options) but zstd is not recommended for BlueStore for performance reasons.)
    - _Erasure coded_ pools now have [full support for overwrites](http://docs.ceph.com/rados/operations/erasure-code/#erasure-coding-with-overwrites), allowing them to be used with RBD and CephFS.
        
    - _ceph-mgr_:
        
        - There is a new daemon, _ceph-mgr_, which is a required part of any Ceph deployment. Although IO can continue when _ceph-mgr_ is down, metrics will not refresh and some metrics-related calls (e.g., ceph df) may block. We recommend deploying several instances of _ceph-mgr_ for reliability. See the notes on [Upgrading](#upgrading) below.
        - The _ceph-mgr_ daemon includes a [REST-based management API](http://docs.ceph.com/mgr/restful). The API is still experimental and somewhat limited but will form the basis for API-based management of Ceph going forward.
        - _ceph-mgr_ also includes a [Prometheus exporter](http://docs.ceph.com/mgr/prometheus) plugin, which can provide Ceph perfcounters to Prometheus.
        - ceph-mgr now has a [Zabbix](http://docs.ceph.com/mgr/zabbix) plugin. Using zabbix\_sender it sends trapper events to a Zabbix server containing high-level information of the Ceph cluster. This makes it easy to monitor a Ceph cluster’s status and send out notifications in case of a malfunction.
    - The overall _scalability_ of the cluster has improved. We have successfully tested clusters with up to 10,000 OSDs.
        
    - Each OSD can now have a [device class](http://docs.ceph.com/rados/operations/crush-map/#device-classes) associated with it (e.g., hdd or ssd), allowing CRUSH rules to trivially map data to a subset of devices in the system. Manually writing CRUSH rules or manual editing of the CRUSH is normally not required.
        
    - There is also a new [upmap](http://docs.ceph.com/rados/operations/upmap) exception mechanism that allows individual PGs to be moved around to achieve a _perfect distribution_ (this requires luminous clients).
        
    - Each OSD now adjusts its default configuration based on whether the backing device is an HDD or SSD. Manual tuning generally not required.
        
    - The prototype [mClock QoS queueing algorithm](http://docs.ceph.com/rados/configuration/osd-config-ref/#qos-based-on-mclock) is now available.
        
    - There is now a _backoff_ mechanism that prevents OSDs from being overloaded by requests to objects or PGs that are not currently able to process IO.
        
    - There is a simplified [OSD replacement process](http://docs.ceph.com/rados/operations/add-or-rm-osds/#replacing-an-osd) that is more robust.
        
    - You can query the supported features and (apparent) releases of all connected daemons and clients with [ceph features](http://docs.ceph.com/man/8/ceph#features).
        
    - You can configure the oldest Ceph client version you wish to allow to connect to the cluster via ceph osd set-require-min-compat-client and Ceph will prevent you from enabling features that will break compatibility with those clients.
        
    - Several sleep settings, include osd\_recovery\_sleep, osd\_snap\_trim\_sleep, and osd\_scrub\_sleep have been reimplemented to work efficiently. (These are used in some cases to work around issues throttling background work.)
        
    - The crush choose\_args encoding has been changed to make it architecture-independent.
        
    - Pools are now expected to be associated with the application using them. Upon completing the upgrade to Luminous, the cluster will attempt to associate existing pools to known applications (i.e. CephFS, RBD, and RGW). In-use pools that are not associated to an application will generate a health warning. Any unassociated pools can be manually associated using the new ceph osd pool application enable command. For more details see [associate pool to application](http://docs.ceph.com/rados/operations/pools/#associate-pool-to-application) in the documentation.
        
    - Added new commands pg force-recovery and pg-force-backfill. Use them to boost recovery or backfill priority of specified pgs, so they’re recovered/backfilled before any other. Note that these commands don’t interrupt ongoing recovery/backfill, but merely queue specified pgs before others so they’re recovered/backfilled as soon as possible. New commands pg cancel-force-recovery and pg cancel-force-backfill restore default recovery/backfill priority of previously forced pgs.
        
- _ceph-mon_:
    
    - Added new configuration “public bind addr” to support dynamic environments like Kubernetes. When set the Ceph MON daemon could bind locally to an IP address and advertise a different IP address public addr on the network.
- _RGW_:
    
    - RGW _metadata search_ backed by ElasticSearch now supports end user requests service via RGW itself, and also supports custom metadata fields. A query language a set of RESTful APIs were created for users to be able to search objects by their metadata. New APIs that allow control of custom metadata fields were also added.
    - RGW now supports _dynamic bucket index sharding_. As the number of objects in a bucket grows, RGW will automatically reshard the bucket index in response. No user intervention or bucket size capacity planning is required. This feature needs to be enabled by setting _rgw dynamic resharding_ to true in ceph.conf
    - RGW introduces _server side encryption_ of uploaded objects with three options for the management of encryption keys: automatic encryption (only recommended for test setups), customer provided keys similar to Amazon SSE-C specification, and through the use of an external key management service (Openstack Barbican) similar to Amazon SSE-KMS specification. [_Encryption_](http://docs.ceph.com/radosgw/encryption/)
    - RGW now has preliminary AWS-like bucket policy API support. For now, policy is a means to express a range of new authorization concepts. In the future it will be the foundation for additional auth capabilities such as STS and group policy. [_Bucket Policies_](http://docs.ceph.com/radosgw/bucketpolicy/)
    - RGW has consolidated the several metadata index pools via the use of rados namespaces. [_Pools_](http://docs.ceph.com/radosgw/pools/)
    - S3 Object Tagging API has been added; while APIs are supported for GET/PUT/DELETE object tags and in PUT object API, there is no support for tags on Policies & Lifecycle yet
    - RGW multisite now supports for enabling or disabling sync at a bucket level.
- _RBD_:
    
    - RBD now has full, stable support for _erasure coded pools_ via the new \--data-pool option to rbd create.
    - RBD mirroring’s rbd-mirror daemon is now highly available. We recommend deploying several instances of rbd-mirror for reliability.
    - RBD mirroring’s rbd-mirror daemon should utilize unique Ceph user IDs per instance to support the new mirroring dashboard.
    - The default ‘rbd’ pool is no longer created automatically during cluster creation. Additionally, the name of the default pool used by the rbd CLI when no pool is specified can be overridden via a new rbd default pool \= <pool name> configuration option.
    - Initial support for deferred image deletion via new rbd trash CLI commands. Images, even ones actively in-use by clones, can be moved to the trash and deleted at a later time.
    - New pool-level rbd mirror pool promote and rbd mirror pool demote commands to batch promote/demote all mirrored images within a pool.
    - Mirroring now optionally supports a configurable replication delay via the rbd mirroring replay delay \= <seconds> configuration option.
    - Improved discard handling when the object map feature is enabled.
    - rbd CLI import and copy commands now detect sparse and preserve sparse regions.
    - Images and Snapshots will now include a creation timestamp.
    - Specifying user authorization capabilities for RBD clients has been simplified. The general syntax for using RBD capability profiles is “mon ‘profile rbd’ osd ‘profile rbd\[-read-only\]\[ pool={pool-name}\[, ...\]\]’”. For more details see “User Management” in the documentation.
- _CephFS_:
    
    - _Multiple active MDS daemons_ is now considered stable. The number of active MDS servers may be adjusted up or down on an active CephFS file system.
    - CephFS _directory fragmentation_ is now stable and enabled by default on new filesystems. To enable it on existing filesystems use “ceph fs set <fs\_name> allow\_dirfrags”. Large or very busy directories are sharded and (potentially) distributed across multiple MDS daemons automatically.
    - Directory subtrees can be explicitly pinned to specific MDS daemons in cases where the automatic load balancing is not desired or effective.
    - Client keys can now be created using the new ceph fs authorize command to create keys with access to the given CephFS file system and all of its data pools.
    - The ‘apply’ mode of cephfs-journal-tool has been removed
    - When running ‘df’ on a CephFS filesystem comprising exactly one data pool, the result now reflects the file storage space used and available in that data pool (fuse client only).
- _Miscellaneous_:
    
    - Release packages are now being built for _Debian Stretch_. Note that QA is limited to CentOS and Ubuntu (xenial and trusty). The distributions we build for now includes:
        
        - CentOS 7 (x86\_64 and aarch64)
        - Debian 8 Jessie (x86\_64)
        - Debian 9 Stretch (x86\_64)
        - Ubuntu 16.04 Xenial (x86\_64 and aarch64)
        - Ubuntu 14.04 Trusty (x86\_64)
    - A first release of Ceph for FreeBSD is available which contains a full set of features, other than Bluestore. It will run everything needed to build a storage cluster. For clients, all access methods are available, albeit CephFS is only accessible through a Fuse implementation. RBD images can be mounted on FreeBSD systems through rbd-ggate
        
        Ceph versions are released through the regular FreeBSD ports and packages system. The most current version is available as: net/ceph-devel. Once Luminous goes into official release, this version will be available as net/ceph. Future development releases will be available via net/ceph-devel
        
        More details about this port are in: [README.FreeBSD](https://github.com/ceph/ceph/blob/master/README.FreeBSD)
    - _CLI changes_:
        
        - The ceph \-s or ceph status command has a fresh look.
        - ceph mgr metadata will dump metadata associated with each mgr daemon.
        - ceph versions or ceph {osd,mds,mon,mgr} versions summarize versions of running daemons.
        - ceph {osd,mds,mon,mgr} count-metadata <property> similarly tabulates any other daemon metadata visible via the ceph {osd,mds,mon,mgr} metadata commands.
        - ceph features summarizes features and releases of connected clients and daemons.
        - ceph osd require-osd-release <release> replaces the old require\_RELEASE\_osds flags.
        - ceph osd pg-upmap, ceph osd rm-pg-upmap, ceph osd pg-upmap-items, ceph osd rm-pg-upmap-items can explicitly manage upmap items (see [_Using the pg-upmap_](http://docs.ceph.com/rados/operations/upmap/)).
        - ceph osd getcrushmap returns a crush map version number on stderr, and ceph osd setcrushmap \[version\] will only inject an updated crush map if the version matches. This allows crush maps to be updated offline and then reinjected into the cluster without fear of clobbering racing changes (e.g., by newly added osds or changes by other administrators).
        - ceph osd create has been replaced by ceph osd new. This should be hidden from most users by user-facing tools like ceph-disk.
        - ceph osd destroy will mark an OSD destroyed and remove its cephx and lockbox keys. However, the OSD id and CRUSH map entry will remain in place, allowing the id to be reused by a replacement device with minimal data rebalancing.
        - ceph osd purge will remove all traces of an OSD from the cluster, including its cephx encryption keys, dm-crypt lockbox keys, OSD id, and crush map entry.
        - ceph osd ls-tree <name> will output a list of OSD ids under the given CRUSH name (like a host or rack name). This is useful for applying changes to entire subtrees. For example, ceph osd down \`ceph osd ls-tree rack1\`.
        - ceph osd {add,rm}-{noout,noin,nodown,noup} allow the noout, noin, nodown, and noup flags to be applied to specific OSDs.
        - ceph log last \[n\] will output the last _n_ lines of the cluster log.
        - ceph mgr dump will dump the MgrMap, including the currently active ceph-mgr daemon and any standbys.
        - ceph mgr module ls will list active ceph-mgr modules.
        - ceph mgr module {enable,disable} <name> will enable or disable the named mgr module. The module must be present in the configured mgr\_module\_path on the host(s) where ceph-mgr is running.
        - ceph osd crush swap-bucket <src> <dest> will swap the contents of two CRUSH buckets in the hierarchy while preserving the buckets’ ids. This allows an entire subtree of devices to be replaced (e.g., to replace an entire host of FileStore OSDs with newly-imaged BlueStore OSDs) without disrupting the distribution of data across neighboring devices.
        - ceph osd set-require-min-compat-client <release> configures the oldest client release the cluster is required to support. Other changes, like CRUSH tunables, will fail with an error if they would violate this setting. Changing this setting also fails if clients older than the specified release are currently connected to the cluster.
        - ceph config-key dump dumps config-key entries and their contents. (The existing ceph config-key list only dumps the key names, not the values.)
        - ceph config-key list is deprecated in favor of ceph config-key ls.
        - ceph config-key put is deprecated in favor of ceph config-key set.
        - ceph auth list is deprecated in favor of ceph auth ls.
        - ceph osd crush rule list is deprecated in favor of ceph osd crush rule ls.
        - ceph osd set-{full,nearfull,backfillfull}-ratio sets the cluster-wide ratio for various full thresholds (when the cluster refuses IO, when the cluster warns about being close to full, when an OSD will defer rebalancing a PG to itself, respectively).
        - ceph osd reweightn will specify the reweight values for multiple OSDs in a single command. This is equivalent to a series of ceph osd reweight commands.
        - ceph osd crush {set,rm}-device-class manage the new CRUSH _device class_ feature. Note that manually creating or deleting a device class name is generally not necessary as it will be smart enough to be self-managed. ceph osd crush class ls and ceph osd crush class ls-osd will output all existing device classes and a list of OSD ids under the given device class respectively.
        - ceph osd crush rule create-replicated replaces the old ceph osd crush rule create-simple command to create a CRUSH rule for a replicated pool. Notably it takes a class argument for the _device class_ the rule should target (e.g., ssd or hdd).
        - ceph mon feature ls will list monitor features recorded in the MonMap. ceph mon feature set will set an optional feature (none of these exist yet).
        - ceph tell <daemon> help will now return a usage summary.
        - ceph fs authorize creates a new client key with caps automatically set to access the given CephFS file system.
        - The ceph health structured output (JSON or XML) no longer contains ‘timechecks’ section describing the time sync status. This information is now available via the ‘ceph time-sync-status’ command.
        - Certain extra fields in the ceph health structured output that used to appear if the mons were low on disk space (which duplicated the information in the normal health warning messages) are now gone.
        - The ceph \-w output no longer contains audit log entries by default. Add a \--watch-channel=audit or \--watch-channel=\* to see them.
        - New “ceph -w” behavior - the “ceph -w” output no longer contains I/O rates, available space, pg info, etc. because these are no longer logged to the central log (which is what ceph \-w shows). The same information can be obtained by running ceph pg stat; alternatively, I/O rates per pool can be determined using ceph osd pool stats. Although these commands do not self-update like ceph \-w did, they do have the ability to return formatted output by providing a \--format=<format> option.

### Major Changes from Jewel

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

### Upgrade from Jewel or Kraken

1. Ensure that the sortbitwise flag is enabled:
    
    \# ceph osd set sortbitwise
    
2. Make sure your cluster is stable and healthy (no down or recoverying OSDs). (Optional, but recommended.)
    
3. Do not create any new erasure-code pools while upgrading the monitors.
    
4. You can monitor the progress of your upgrade at each stage with the ceph versions command, which will tell you what ceph version is running for each type of daemon.
    
5. Set the noout flag for the duration of the upgrade. (Optional but recommended.):
    
    \# ceph osd set noout
    
6. Upgrade monitors by installing the new packages and restarting the monitor daemons. Note that, unlike prior releases, the ceph-mon daemons _must_ be upgraded first:
    
    \# systemctl restart ceph-mon.target
    
    Verify the monitor upgrade is complete once all monitors are up by looking for the luminous feature string in the mon map. For example:
    
    \# ceph mon feature ls
    
    should include luminous under persistent features:
    
    on current monmap (epoch NNN)
       persistent: \[kraken,luminous\]
       required: \[kraken,luminous\]
    
7. Add or restart ceph-mgr daemons. If you are upgrading from kraken, upgrade packages and restart ceph-mgr daemons with:
    
    \# systemctl restart ceph-mgr.target
    
    If you are upgrading from kraken, you may already have ceph-mgr daemons deployed. If not, or if you are upgrading from jewel, you can deploy new daemons with tools like ceph-deploy or ceph-ansible. For example:
    
    \# ceph-deploy mgr create HOST
    
    Verify the ceph-mgr daemons are running by checking ceph \-s:
    
    \# ceph -s
    
    ...
      services:
       mon: 3 daemons, quorum foo,bar,baz
       mgr: foo(active), standbys: bar, baz
    ...
    
8. Upgrade all OSDs by installing the new packages and restarting the ceph-osd daemons on all hosts:
    
    \# systemctl restart ceph-osd.target
    
    You can monitor the progress of the OSD upgrades with the new ceph versions or ceph osd versions command:
    
    \# ceph osd versions
    {
       "ceph version 12.2.0 (...) luminous (stable)": 12,
       "ceph version 10.2.6 (...)": 3,
    }
    
9. Upgrade all CephFS daemons by upgrading packages and restarting daemons on all hosts:
    
    \# systemctl restart ceph-mds.target
    
10. Upgrade all radosgw daemons by upgrading packages and restarting daemons on all hosts:
    
    \# systemctl restart radosgw.target
    
11. Complete the upgrade by disallowing pre-luminous OSDs:
    
    \# ceph osd require-osd-release luminous
    
    If you set noout at the beginning, be sure to clear it with:
    
    \# ceph osd unset noout
    
12. Verify the cluster is healthy with ceph health.
    

### Upgrading from pre-Jewel releases (like Hammer)

You _must_ first upgrade to Jewel (10.2.z) before attempting an upgrade to Luminous.

### Upgrade compatibility notes, Kraken to Luminous

- The configuration option osd pool erasure code stripe width has been replaced by osd pool erasure code stripe unit, and given the ability to be overridden by the erasure code profile setting stripe\_unit. For more details see /rados/operations/erasure-code#erasure-code-profiles.
    
- rbd and cephfs can use erasure coding with bluestore. This may be enabled by setting allow\_ec\_overwrites to true for a pool. Since this relies on bluestore’s checksumming to do deep scrubbing, enabling this on a pool stored on filestore is not allowed.
    
- The rados df JSON output now prints numeric values as numbers instead of strings.
    
- The mon\_osd\_max\_op\_age option has been renamed to mon\_osd\_warn\_op\_age (default: 32 seconds), to indicate we generate a warning at this age. There is also a new mon\_osd\_err\_op\_age\_ratio that is a expressed as a multitple of mon\_osd\_warn\_op\_age (default: 128, for roughly 60 minutes) to control when an error is generated.
    
- The default maximum size for a single RADOS object has been reduced from 100GB to 128MB. The 100GB limit was completely impractical in practice while the 128MB limit is a bit high but not unreasonable. If you have an application written directly to librados that is using objects larger than 128MB you may need to adjust osd\_max\_object\_size.
    
- The semantics of the rados ls and librados object listing operations have always been a bit confusing in that “whiteout” objects (which logically don’t exist and will return ENOENT if you try to access them) are included in the results. Previously whiteouts only occurred in cache tier pools. In luminous, logically deleted but snapshotted objects now result in a whiteout object, and as a result they will appear in rados ls results, even though trying to read such an object will result in ENOENT. The rados listsnaps operation can be used in such a case to enumerate which snapshots are present.
    
    This may seem a bit strange, but is less strange than having a deleted-but-snapshotted object not appear at all and be completely hidden from librados’s ability to enumerate objects. Future versions of Ceph will likely include an alternative object enumeration interface that makes it more natural and efficient to enumerate all objects along with their snapshot and clone metadata.
- The deprecated crush\_ruleset property has finally been removed; please use crush\_rule instead for the osd pool get ... and osd pool set ... commands.
    
- The osd pool default crush replicated ruleset option has been removed and replaced by the psd pool default crush rule option. By default it is -1, which means the mon will pick the first type replicated rule in the CRUSH map for replicated pools. Erasure coded pools have rules that are automatically created for them if they are not specified at pool creation time.
    
- We no longer test the FileStore ceph-osd backend in combination with btrfs. We recommend against using btrfs. If you are using btrfs-based OSDs and want to upgrade to luminous you will need to add the follwing to your ceph.conf:
    
    enable experimental unrecoverable data corrupting features = btrfs
    
    The code is mature and unlikely to change, but we are only continuing to test the Jewel stable branch against btrfs. We recommend moving these OSDs to FileStore with XFS or BlueStore.
- The ruleset-\* properties for the erasure code profiles have been renamed to crush-\* to (1) move away from the obsolete ‘ruleset’ term and to be more clear about their purpose. There is also a new optional crush-device-class property to specify a CRUSH device class to use for the erasure coded pool. Existing erasure code profiles will be converted automatically when upgrade completes (when the ceph osd require-osd-release luminous command is run) but any provisioning tools that create erasure coded pools may need to be updated.
    
- The structure of the XML output for osd crush tree has changed slightly to better match the osd tree output. The top level structure is now nodes instead of crush\_map\_roots.
    
- When assigning a network to the public network and not to the cluster network the network specification of the public network will be used for the cluster network as well. In older versions this would lead to cluster services being bound to 0.0.0.0:<port>, thus making the cluster service even more publicly available than the public services. When only specifying a cluster network it will still result in the public services binding to 0.0.0.0.
    
- In previous versions, if a client sent an op to the wrong OSD, the OSD would reply with ENXIO. The rationale here is that the client or OSD is clearly buggy and we want to surface the error as clearly as possible. We now only send the ENXIO reply if the osd\_enxio\_on\_misdirected\_op option is enabled (it’s off by default). This means that a VM using librbd that previously would have gotten an EIO and gone read-only will now see a blocked/hung IO instead.
    
- The “journaler allow split entries” config setting has been removed.
    
- The ‘mon\_warn\_osd\_usage\_min\_max\_delta’ config option has been removed and the associated health warning has been disabled because it does not address clusters undergoing recovery or CRUSH rules that do not target all devices in the cluster.
    

- _librados_:
    
    - Some variants of the omap\_get\_keys and omap\_get\_vals librados functions have been deprecated in favor of omap\_get\_vals2 and omap\_get\_keys2. The new methods include an output argument indicating whether there are additional keys left to fetch. Previously this had to be inferred from the requested key count vs the number of keys returned, but this breaks with new OSD-side limits on the number of keys or bytes that can be returned by a single omap request. These limits were introduced by kraken but are effectively disabled by default (by setting a very large limit of 1 GB) because users of the newly deprecated interface cannot tell whether they should fetch more keys or not. In the case of the standalone calls in the C++ interface (IoCtx::get\_omap\_{keys,vals}), librados has been updated to loop on the client side to provide a correct result via multiple calls to the OSD. In the case of the methods used for building multi-operation transactions, however, client-side looping is not practical, and the methods have been deprecated. Note that use of either the IoCtx methods on older librados versions or the deprecated methods on any version of librados will lead to incomplete results if/when the new OSD limits are enabled.
        
    - The original librados rados\_objects\_list\_open (C) and objects\_begin (C++) object listing API, deprecated in Hammer, has finally been removed. Users of this interface must update their software to use either the rados\_nobjects\_list\_open (C) and nobjects\_begin (C++) API or the new rados\_object\_list\_begin (C) and object\_list\_begin (C++) API before updating the client-side librados library to Luminous.
        
        Object enumeration (via any API) with the latest librados version and pre-Hammer OSDs is no longer supported. Note that no in-tree Ceph services rely on object enumeration via the deprecated APIs, so only external librados users might be affected.
        
        The newest (and recommended) rados\_object\_list\_begin (C) and object\_list\_begin (C++) API is only usable on clusters with the SORTBITWISE flag enabled (Jewel and later). (Note that this flag is required to be set before upgrading beyond Jewel.)
- _CephFS_:
    
    - When configuring ceph-fuse mounts in /etc/fstab, a new syntax is available that uses “ceph.<arg>=<val>” in the options column, instead of putting configuration in the device column. The old style syntax still works. See the documentation page “Mount CephFS in your file systems table” for details.
    - CephFS clients without the ‘p’ flag in their authentication capability string will no longer be able to set quotas or any layout fields. This flag previously only restricted modification of the pool and namespace fields in layouts.
    - CephFS will generate a health warning if you have fewer standby daemons than it thinks you wanted. By default this will be 1 if you ever had a standby, and 0 if you did not. You can customize this using ceph fs set <fs> standby\_count\_wanted <number>. Setting it to zero will effectively disable the health check.
    - The “ceph mds tell ...” command has been removed. It is superceded by “ceph tell mds.<id> ...”

### Other Notable Changes

- bluestore: os/bluestore: allow multiple DeferredBatches in flight at once ([issue#20295](http://tracker.ceph.com/issues/20295), [pr#16769](https://github.com/ceph/ceph/pull/16769), Nathan Cutler, Sage Weil)
- bluestore: os/bluestore: clear result in BlueRocksEnv::getChildren ([issue#20857](http://tracker.ceph.com/issues/20857), [pr#16683](https://github.com/ceph/ceph/pull/16683), liuchang0812)
- bluestore: os/bluestore: default journal media to store media if bluefs is disabled ([pr#16844](https://github.com/ceph/ceph/pull/16844), xie xingguo)
- bluestore: os/bluestore: \_do\_remove: dirty shard individually as each blob is unshared ([issue#20849](http://tracker.ceph.com/issues/20849), [pr#16822](https://github.com/ceph/ceph/pull/16822), Sage Weil)
- bluestore: os/bluestore: fix dirty\_range on \_do\_clone\_range ([issue#20810](http://tracker.ceph.com/issues/20810), [pr#16738](https://github.com/ceph/ceph/pull/16738), Sage Weil)
- bluestore: os/bluestore: space between func and contents ([pr#16804](https://github.com/ceph/ceph/pull/16804), xie xingguo)
- build/ops: Clean up make check for persistent test nodes (like arm64) ([pr#16773](https://github.com/ceph/ceph/pull/16773), Dan Mick)
- build/ops: rpm,deb: fix ceph-volume ([issue#20915](http://tracker.ceph.com/issues/20915), [pr#16832](https://github.com/ceph/ceph/pull/16832), Sage Weil)
- build/ops: sync luminous tag back to master ([pr#16758](https://github.com/ceph/ceph/pull/16758), Jenkins Build Slave User)
- common: avoid statically allocating configuration options ([issue#20869](http://tracker.ceph.com/issues/20869), [pr#16735](https://github.com/ceph/ceph/pull/16735), Jason Dillaman)
- common: ceph: wait for maps before doing ‘ceph tell ... help’ ([issue#20113](http://tracker.ceph.com/issues/20113), [pr#16756](https://github.com/ceph/ceph/pull/16756), Sage Weil)
- common: common/buffer: off-by-one error in max iov length blocking ([issue#20907](http://tracker.ceph.com/issues/20907), [pr#16803](https://github.com/ceph/ceph/pull/16803), Dan Mick)
- common: common/cmdparse.cc: remove unused variable ‘argnum’ in dump\_cmd\_to\_json() ([pr#16862](https://github.com/ceph/ceph/pull/16862), Luo Kexue)
- common,rbd,rgw: common/rgw/rbd: remove some unused variables ([pr#16690](https://github.com/ceph/ceph/pull/16690), Luo Kexue)
- core: ceph-disk: dmcrypt cluster must default to ceph ([issue#20893](http://tracker.ceph.com/issues/20893), [pr#16776](https://github.com/ceph/ceph/pull/16776), Loic Dachary)
- core: ceph-osd: fix auto detect which objectstore is currently running ([issue#20865](http://tracker.ceph.com/issues/20865), [pr#16717](https://github.com/ceph/ceph/pull/16717), Yanhu Cao)
- core: libradosstriper: Initialize member variable m\_writeRc in WriteCompletionData ([pr#16780](https://github.com/ceph/ceph/pull/16780), amitkuma)
- core: Merge pull request #16755 from ivancich/wip-pull-new-dmclock ([pr#16922](https://github.com/ceph/ceph/pull/16922), Gregory Farnum)
- core: messages: Initialize members in MMDSTableRequest ([pr#16810](https://github.com/ceph/ceph/pull/16810), amitkuma)
- core: messages: Initialize member variables ([pr#16819](https://github.com/ceph/ceph/pull/16819), amitkuma)
- core: messages: Initialize member variables ([pr#16839](https://github.com/ceph/ceph/pull/16839), amitkuma)
- core: messages: Initializing member variable in MMDSCacheRejoin ([pr#16791](https://github.com/ceph/ceph/pull/16791), amitkuma)
- core: osd/mon/mds: fix config set tell command ([issue#20803](http://tracker.ceph.com/issues/20803), [pr#16700](https://github.com/ceph/ceph/pull/16700), John Spray)
- core: osd/OSD: tolerate any ‘set-device-class’ error on OSD startup ([pr#16812](https://github.com/ceph/ceph/pull/16812), xie xingguo)
- core: osd/PG: fix lost unfound + delete when there are no missing objects ([issue#20904](http://tracker.ceph.com/issues/20904), [pr#16809](https://github.com/ceph/ceph/pull/16809), Josh Durgin)
- core: osd/PGLog: avoid infinite loop if missing version is corrupted ([pr#16798](https://github.com/ceph/ceph/pull/16798), Josh Durgin)
- core: osd/PGLog: skip ERROR entires in \_merge\_object\_divergent\_entries ([issue#20843](http://tracker.ceph.com/issues/20843), [pr#16675](https://github.com/ceph/ceph/pull/16675), Jeegn Chen)
- core: osd/PG: reset the missing set when restarting backfill ([issue#19191](http://tracker.ceph.com/issues/19191), [pr#14053](https://github.com/ceph/ceph/pull/14053), Josh Durgin)
- core: print more information when run ceph-osd cmd with ‘check options’ ([pr#16678](https://github.com/ceph/ceph/pull/16678), mychoxin)
- core,tests: qa: avoid map-gap tests for k=2 m=1 ([issue#20844](http://tracker.ceph.com/issues/20844), [pr#16789](https://github.com/ceph/ceph/pull/16789), Sage Weil)
- core,tests: qa/suites/rados/basic/tasks/rados\_python: POOL\_APP\_NOT\_ENABLED ([pr#16827](https://github.com/ceph/ceph/pull/16827), Sage Weil)
- core,tests: qa/suites/rados/mgr/tasks/failover: whitelist ([pr#16795](https://github.com/ceph/ceph/pull/16795), Sage Weil)
- core,tests: qa/tasks/ceph: enable rbd on rbd pool ([pr#16794](https://github.com/ceph/ceph/pull/16794), Sage Weil)
- core,tests: upgrade/jewel-x: a few fixes ([pr#16830](https://github.com/ceph/ceph/pull/16830), Sage Weil)
- crush: misc changes/fixes for device classes ([issue#20845](http://tracker.ceph.com/issues/20845), [pr#16805](https://github.com/ceph/ceph/pull/16805), Kefu Chai, xie xingguo, Sage Weil)
- crush: more class fixes ([pr#16837](https://github.com/ceph/ceph/pull/16837), xie xingguo)
- doc: 12.1.1 & 12.1.2 release notes ([pr#16377](https://github.com/ceph/ceph/pull/16377), Abhishek Lekshmanan)
- doc: doc/rados/configuration: document bluestore ([pr#16765](https://github.com/ceph/ceph/pull/16765), Sage Weil)
- doc: doc/release-notes: fix bluestore links ([pr#16787](https://github.com/ceph/ceph/pull/16787), Sage Weil)
- doc: doc/release-notes: fix links, formatting; add crush device class docs ([pr#16741](https://github.com/ceph/ceph/pull/16741), Sage Weil)
- doc: doc/release-notes: sort release note changes into the right section ([pr#16764](https://github.com/ceph/ceph/pull/16764), Sage Weil)
- doc: doc/release-notes: update device class cli ([pr#16851](https://github.com/ceph/ceph/pull/16851), xie xingguo)
- doc: document bluestore compression settings ([pr#16747](https://github.com/ceph/ceph/pull/16747), Kefu Chai)
- doc: document “rados cleanup” in rados manpage ([issue#20894](http://tracker.ceph.com/issues/20894), [pr#16777](https://github.com/ceph/ceph/pull/16777), Nathan Cutler)
- doc: luminous: doc: update rbd-mirroring documentation ([issue#20701](http://tracker.ceph.com/issues/20701), [pr#16912](https://github.com/ceph/ceph/pull/16912), Jason Dillaman)
- doc: op queue and mclock related options ([pr#16662](https://github.com/ceph/ceph/pull/16662), J. Eric Ivancich)
- doc: PendingReleaseNotes: mention forced recovery ([pr#16775](https://github.com/ceph/ceph/pull/16775), Piotr Dałek)
- librbd: Uninitialized variable used handle\_refresh() ([pr#16724](https://github.com/ceph/ceph/pull/16724), amitkuma)
- mgr: handle “module.set\_config(.., None)” correctly ([pr#16749](https://github.com/ceph/ceph/pull/16749), Kefu Chai)
- mon: added bootstrap-rbd auth profile ([pr#16633](https://github.com/ceph/ceph/pull/16633), Jason Dillaman)
- mon: extensible output format for health checks ([pr#16701](https://github.com/ceph/ceph/pull/16701), John Spray)
- mon: mon/OSDMonitor: sanity check osd before performing ‘osd purge’ ([pr#16838](https://github.com/ceph/ceph/pull/16838), xie xingguo)
- mon: show class in ‘osd crush tree’ output; sort output ([pr#16740](https://github.com/ceph/ceph/pull/16740), Sage Weil)
- mon,tests: test: Initialize pointer msg in MonClientHelper ([pr#16784](https://github.com/ceph/ceph/pull/16784), amitkuma)
- msg: Initialize member variables in Infiniband ([pr#16781](https://github.com/ceph/ceph/pull/16781), amitkuma)
- msg: Remove unused variable perf\_counter in RDMAStack ([pr#16783](https://github.com/ceph/ceph/pull/16783), amitkuma)
- msgr: messages: Initializing uninitialized members MMonGetVersion ([pr#16811](https://github.com/ceph/ceph/pull/16811), amitkuma)
- msgr: messages: Initializing uninitialized members MMonGetVersionReply ([pr#16813](https://github.com/ceph/ceph/pull/16813), amitkuma)
- msgr: messages: Initializing uninitialized members MMonPaxos ([pr#16814](https://github.com/ceph/ceph/pull/16814), amitkuma)
- msgr: messages: Initializing uninitialized members MMonProbe ([pr#16815](https://github.com/ceph/ceph/pull/16815), amitkuma)
- msgr: messages: Initializing uninitialized members module messages ([pr#16817](https://github.com/ceph/ceph/pull/16817), amitkuma)
- msgr: messages: Initializing uninitialized members MOSDAlive ([pr#16816](https://github.com/ceph/ceph/pull/16816), amitkuma)
- osd: Check whether journal is rotational or not ([pr#16614](https://github.com/ceph/ceph/pull/16614), Neha Ojha)
- osd: do not try to set device class before luminous ([issue#20850](http://tracker.ceph.com/issues/20850), [pr#16706](https://github.com/ceph/ceph/pull/16706), Josh Durgin)
- osd: initialize waiting\_for\_pg\_osdmap on startup ([issue#20748](http://tracker.ceph.com/issues/20748), [pr#16535](https://github.com/ceph/ceph/pull/16535), Sage Weil)
- osd: pg: be more careful with locking around forced pg recovery ([issue#20808](http://tracker.ceph.com/issues/20808), [pr#16712](https://github.com/ceph/ceph/pull/16712), Greg Farnum)
- osd: silence warning from -Wint-in-bool-context ([pr#16744](https://github.com/ceph/ceph/pull/16744), Jos Collin)
- pybind: pybind/rados: use new APIs instead of deprecated ones ([pr#16684](https://github.com/ceph/ceph/pull/16684), Kefu Chai)
- rbd: Drop unused member variable reopen in C\_OpenComplete ([pr#16729](https://github.com/ceph/ceph/pull/16729), amitkuma)
- rbd: ‘image-meta remove’ for missing key does not return error ([issue#16990](http://tracker.ceph.com/issues/16990), [pr#16393](https://github.com/ceph/ceph/pull/16393), PCzhangPC)
- rbd: luminous: librbd: default localize parent reads to false ([issue#20941](http://tracker.ceph.com/issues/20941), [pr#16899](https://github.com/ceph/ceph/pull/16899), Jason Dillaman)
- rbd: luminous: librbd: remove consistency group rbd cli and API support ([pr#16875](https://github.com/ceph/ceph/pull/16875), Jason Dillaman)
- rbd: luminous: rbd-ggate: tool to map images on FreeBSD via GEOM Gate ([pr#16895](https://github.com/ceph/ceph/pull/16895), Mykola Golub)
- rbd: luminous: rbd-mirror: align use of uint64\_t in service\_daemon::AttributeType ([pr#16948](https://github.com/ceph/ceph/pull/16948), James Page)
- rbd: luminous: rbd-mirror: simplify notifications for image assignment ([issue#15764](http://tracker.ceph.com/issues/15764), [pr#16878](https://github.com/ceph/ceph/pull/16878), Jason Dillaman)
- rbd: luminous: rbd: parallelize rbd ls -l ([pr#16921](https://github.com/ceph/ceph/pull/16921), Piotr Dałek)
- rbd-mirror: assertion failure during pool replayer shut down ([issue#20644](http://tracker.ceph.com/issues/20644), [pr#16704](https://github.com/ceph/ceph/pull/16704), Jason Dillaman)
- rbd,rgw,tools: tools/rbd, rgw: Removed unreachable returns ([pr#16308](https://github.com/ceph/ceph/pull/16308), Jos Collin)
- rbd,tests: luminous: qa/workunits/rbd: use command line option to specify watcher asok ([issue#20954](http://tracker.ceph.com/issues/20954), [pr#16946](https://github.com/ceph/ceph/pull/16946), Mykola Golub)
- rbd,tests: luminous: test/librbd: fix race condition with OSD map refresh ([issue#20918](http://tracker.ceph.com/issues/20918), [pr#16903](https://github.com/ceph/ceph/pull/16903), Jason Dillaman)
- rbd,tests: test/librbd/fsx: Add break in case OP\_WRITESAME and OP\_COMPARE\_AND\_WRITE ([pr#16742](https://github.com/ceph/ceph/pull/16742), Luo Kexue)
- rgw: add a separate configuration for data notify interval ([pr#16551](https://github.com/ceph/ceph/pull/16551), fang yuxiang)
- rgw: add support for Swift’s TempURLs with prefix-based scope ([issue#20398](http://tracker.ceph.com/issues/20398), [pr#16370](https://github.com/ceph/ceph/pull/16370), Radoslaw Zarzynski)
- rgw: Fix up to 1000 entries at a time in check\_bad\_index\_multipart ([issue#20772](http://tracker.ceph.com/issues/20772), [pr#16692](https://github.com/ceph/ceph/pull/16692), Orit Wasserman)
- rgw: Initialize of member variable admin\_specified in RGWUserAdminOpState ([pr#16847](https://github.com/ceph/ceph/pull/16847), amitkuma)
- rgw: luminous: rgw\_lc: support for AWSv4 authentication ([pr#16914](https://github.com/ceph/ceph/pull/16914), Abhishek Lekshmanan)
- rgw: luminous: rgw: Use namespace for lc\_pool and roles\_pool ([issue#20177](http://tracker.ceph.com/issues/20177), [issue#20967](http://tracker.ceph.com/issues/20967), [pr#16943](https://github.com/ceph/ceph/pull/16943), Orit Wasserman)
- rgw: match wildcards in StringLike policy conditions ([issue#20308](http://tracker.ceph.com/issues/20308), [pr#16491](https://github.com/ceph/ceph/pull/16491), Casey Bodley)
- rgw: move the S3 anonymous auth handling to a dedicated engine ([pr#16485](https://github.com/ceph/ceph/pull/16485), Radoslaw Zarzynski)
- rgw: rgw\_crypt: log error messages during failures ([pr#16726](https://github.com/ceph/ceph/pull/16726), Abhishek Lekshmanan)
- rgw: rgw : fix race in RGWCompleteMultipart ([issue#20861](http://tracker.ceph.com/issues/20861), [pr#16732](https://github.com/ceph/ceph/pull/16732), Abhishek Varshney)
- rgw: should not restrict location\_constraint same when user not provide ([pr#16770](https://github.com/ceph/ceph/pull/16770), Tianshan Qu)
- rgw,tests: qa/rgw: disable lifecycle tests because of expiration failures ([pr#16760](https://github.com/ceph/ceph/pull/16760), Casey Bodley)
- rgw: validate tenant names during user create ([pr#16442](https://github.com/ceph/ceph/pull/16442), Abhishek Lekshmanan)
- tests: os: Argument cannot be negative ([pr#16688](https://github.com/ceph/ceph/pull/16688), amitkuma)
- tests: qa/suites: escape the parenthesis of the whitelist text ([pr#16722](https://github.com/ceph/ceph/pull/16722), Kefu Chai)
- tests: qa/suites/powercycle: whitelist health for thrashing ([pr#16759](https://github.com/ceph/ceph/pull/16759), Sage Weil)
- tests: qa/suites/rados: a bit more whitelisting ([pr#16820](https://github.com/ceph/ceph/pull/16820), Sage Weil)
- tests: qa/suites/rados/singleton-nomsgr/all/multi-backfill-reject: sleep longer ([pr#16739](https://github.com/ceph/ceph/pull/16739), Sage Weil)
- tests: qa/suites/upgarde/jewel-x/parallel: more whitelisting ([pr#16849](https://github.com/ceph/ceph/pull/16849), Sage Weil)
- tests: qa/tasks/ceph: debug osd setup ([pr#16841](https://github.com/ceph/ceph/pull/16841), Sage Weil)
- tests: qa/tasks/ceph: wait longer for scrub ([pr#16824](https://github.com/ceph/ceph/pull/16824), Sage Weil)
- tests: qa: timeout when waiting for mgr to be available in healthy() ([pr#16797](https://github.com/ceph/ceph/pull/16797), Josh Durgin)
- tests: test: Initialize pointer variables in TestMemIoCtxImpl ([pr#16785](https://github.com/ceph/ceph/pull/16785), amitkuma)
- tests: test/librados: Initialize member variables in aio.cc ([pr#16845](https://github.com/ceph/ceph/pull/16845), amitkuma)
- tools: Backport: “ceph-volume: adds functional CI testing #16919” ([pr#16970](https://github.com/ceph/ceph/pull/16970), Andrew Schoen, Alfredo Deza)
- tools: ceph-disk: do not remove mount point if deactive –once ([pr#16474](https://github.com/ceph/ceph/pull/16474), Song Shun)
- tools: ceph-volume: initial take on ceph-volume CLI tool ([pr#16632](https://github.com/ceph/ceph/pull/16632), Dan Mick, Alfredo Deza)
