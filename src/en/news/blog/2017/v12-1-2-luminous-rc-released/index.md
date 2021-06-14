---
title: "v12.1.2 Luminous RC released"
date: "2017-08-02"
author: "TheAnalyst"
---

This is the third release candidate for Luminous, the next long term stable release.

Ceph Luminous (v12.2.0) will be the foundation for the next long-term stable release series. There have been major changes since Kraken (v11.2.z) and Jewel (v10.2.z), and the upgrade process is non-trivial. Please read these release notes carefully.

### Major Changes from Kraken

- _General_:
    
    - Ceph now has a simple, [built-in web-based dashboard](../mgr/dashboard) for monitoring cluster status.
- _RADOS_:
    
    - _BlueStore_:
        
        - The new _BlueStore_ backend for _ceph-osd_ is now stable and the new default for newly created OSDs. BlueStore manages data stored by each OSD by directly managing the physical HDDs or SSDs without the use of an intervening file system like XFS. This provides greater performance and features.
        - BlueStore supports _full data and metadata checksums_ of all data stored by Ceph.
        - BlueStore supports inline compression using zlib, snappy, or LZ4. (Ceph also supports zstd for RGW compression but zstd is not recommended for BlueStore for performance reasons.) FIXME DOCS
    - _Erasure coded_ pools now have [full support for overwrites](../rados/operations/erasure-code/#erasure-coding-with-overwrites), allowing them to be used with RBD and CephFS.
        
    - The configuration option “osd pool erasure code stripe width” has been replaced by “osd pool erasure code stripe unit”, and given the ability to be overridden by the erasure code profile setting “stripe\_unit”. For more details see “Erasure Code Profiles” in the documentation.
        
    - rbd and cephfs can use erasure coding with bluestore. This may be enabled by setting ‘allow\_ec\_overwrites’ to ‘true’ for a pool. Since this relies on bluestore’s checksumming to do deep scrubbing, enabling this on a pool stored on filestore is not allowed.
        
    - The ‘rados df’ JSON output now prints numeric values as numbers instead of strings.
        
    - The mon\_osd\_max\_op\_age option has been renamed to mon\_osd\_warn\_op\_age (default: 32 seconds), to indicate we generate a warning at this age. There is also a new mon\_osd\_err\_op\_age\_ratio that is a expressed as a multitple of mon\_osd\_warn\_op\_age (default: 128, for roughly 60 minutes) to control when an error is generated.
        
    - The default maximum size for a single RADOS object has been reduced from 100GB to 128MB. The 100GB limit was completely impractical in practice while the 128MB limit is a bit high but not unreasonable. If you have an application written directly to librados that is using objects larger than 128MB you may need to adjust osd\_max\_object\_size.
        
    - The semantics of the ‘rados ls’ and librados object listing operations have always been a bit confusing in that “whiteout” objects (which logically don’t exist and will return ENOENT if you try to access them) are included in the results. Previously whiteouts only occurred in cache tier pools. In luminous, logically deleted but snapshotted objects now result in a whiteout object, and as a result they will appear in ‘rados ls’ results, even though trying to read such an object will result in ENOENT. The ‘rados listsnaps’ operation can be used in such a case to enumerate which snapshots are present.
        
        This may seem a bit strange, but is less strange than having a deleted-but-snapshotted object not appear at all and be completely hidden from librados’s ability to enumerate objects. Future versions of Ceph will likely include an alternative object enumeration interface that makes it more natural and efficient to enumerate all objects along with their snapshot and clone metadata.
    - _ceph-mgr_:
        
        - There is a new daemon, _ceph-mgr_, which is a required part of any Ceph deployment. Although IO can continue when _ceph-mgr_ is down, metrics will not refresh and some metrics-related calls (e.g., ceph df) may block. We recommend deploying several instances of _ceph-mgr_ for reliability. See the notes on [Upgrading](#upgrading) below.
            
        - The _ceph-mgr_ daemon includes a [REST-based management API](../mgr/restful). The API is still experimental and somewhat limited but will form the basis for API-based management of Ceph going forward.
            
        - _ceph-mgr_ also includes a [Prometheus exporter](http://docs.ceph.com/docs/master/mgr/prometheus) plugin, which can provide Ceph perfcounters to Prometheus.
        - The status ceph-mgr module is enabled by default, and initially provides two commands: ceph tell mgr osd status and ceph tell mgr fs status. These are high level colorized views to complement the existing CLI.
            
    - The overall _scalability_ of the cluster has improved. We have successfully tested clusters with up to 10,000 OSDs.
        
    - Each OSD can now have a [device class](http://docs.ceph.com/docs/master/rados/operations/crush-map/#device-classes) associated with it (e.g., hdd or ssd), allowing CRUSH rules to trivially map data to a subset of devices in the system. Manually writing CRUSH rules or manual editing of the CRUSH is normally not required.
        
    - You can now _optimize CRUSH weights_ to maintain a _near-perfect distribution of data_ across OSDs. FIXME DOCS
        
    - There is also a new [upmap](http://docs.ceph.com/docs/master/rados/operations/upmap) exception mechanism that allows individual PGs to be moved around to achieve a _perfect distribution_ (this requires luminous clients).
        
    - Each OSD now adjusts its default configuration based on whether the backing device is an HDD or SSD. Manual tuning generally not required.
        
    - The prototype [mClock QoS queueing algorithm](http://docs.ceph.com/docs/master/rados/configuration/osd-config-ref/#qos-based-on-mclock) is now available.
        
    - There is now a _backoff_ mechanism that prevents OSDs from being overloaded by requests to objects or PGs that are not currently able to process IO.
        
    - There is a simplified OSD replacement process that is more robust.
        
    - You can query the supported features and (apparent) releases of all connected daemons and clients with [ceph features](http://docs.ceph.com/docs/master/man/8/ceph#features).
        
    - You can configure the oldest Ceph client version you wish to allow to connect to the cluster via ceph osd set-require-min-compat-client and Ceph will prevent you from enabling features that will break compatibility with those clients.
        
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
    - New pool-level rbd mirror pool promote and rbd mirror pool demote commands to batch promote/demote all mirrored images within a pool.
    - Mirroring now optionally supports a configurable replication delay via the rbd mirroring replay delay \= <seconds> configuration option.
    - Improved discard handling when the object map feature is enabled.
    - rbd CLI import and copy commands now detect sparse and preserve sparse regions.
    - Images and Snapshots will now include a creation timestamp.
- _CephFS_:
    
    - _Multiple active MDS daemons_ is now considered stable. The number of active MDS servers may be adjusted up or down on an active CephFS file system.
    - CephFS _directory fragmentation_ is now stable and enabled by default on new filesystems. To enable it on existing filesystems use “ceph fs set <fs\_name> allow\_dirfrags”. Large or very busy directories are sharded and (potentially) distributed across multiple MDS daemons automatically.
    - Directory subtrees can be explicitly pinned to specific MDS daemons in cases where the automatic load balancing is not desired or effective.
- _Miscellaneous_:
    
    - Release packages are now being built for _Debian Stretch_. Note that QA is limited to CentOS and Ubuntu (xenial and trusty). The distributions we build for now includes:
        - CentOS 7 (x86\_64 and aarch64)
        - Debian 8 Jessie (x86\_64)
        - Debian 9 Stretch (x86\_64)
        - Ubuntu 16.04 Xenial (x86\_64 and aarch64)
        - Ubuntu 14.04 Trusty (x86\_64)
    - _CLI changes_:
        - The ceph \-s or ceph status command has a fresh look.
        - ceph mgr metadata will dump metadata associated with each mgr daemon.
        - ceph versions or ceph {osd,mds,mon,mgr} versions summarize versions of running daemons.
        - ceph {osd,mds,mon,mgr} count-metadata <property> similarly tabulates any other daemon metadata visible via the ceph {osd,mds,mon,mgr} metadata commands.
        - ceph features summarizes features and releases of connected clients and daemons.
        - ceph osd require-osd-release <release> replaces the old require\_RELEASE\_osds flags.
        - ceph osd pg-upmap, ceph osd rm-pg-upmap, ceph osd pg-upmap-items, ceph osd rm-pg-upmap-items can explicitly manage upmap items (see [_Using the pg-upmap_](http://docs.ceph.com/docs/master/rados/operations/upmap/)).
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
        - ceph auth list is deprecated in favor of ceph auth ls.
        - ceph osd crush rule list is deprecated in favor of ceph osd crush rule ls.
        - ceph osd set-{full,nearfull,backfillfull}-ratio sets the cluster-wide ratio for various full thresholds (when the cluster refuses IO, when the cluster warns about being close to full, when an OSD will defer rebalancing a PG to itself, respectively).
        - ceph osd reweightn will specify the reweight values for multiple OSDs in a single command. This is equivalent to a series of ceph osd reweight commands.
        - ceph osd crush class {rm,ls,ls-osd} manage the new CRUSH _device class_ feature. ceph crush set-device-class <class> <osd> \[<osd>...\] will set the class for particular devices. Note that if you specify a non-existent class, it will be created automatically. ceph crush rm-device-class <osd> \[<osd>...\] will instead remove the class for particular devices. And if a class contains no more devices, it will be automatically destoryed.
        - ceph osd crush rule create-replicated replaces the old ceph osd crush rule create-simple command to create a CRUSH rule for a replicated pool. Notably it takes a class argument for the _device class_ the rule should target (e.g., ssd or hdd).
        - ceph mon feature ls will list monitor features recorded in the MonMap. ceph mon feature set will set an optional feature (none of these exist yet).
        - ceph tell <daemon> help will now return a usage summary.

### Major Changes from Jewel[¶](#major-changes-from-jewel "Permalink to this headline")

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

### Upgrade from Jewel or Kraken[¶](#upgrade-from-jewel-or-kraken "Permalink to this headline")

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
    

### Upgrading from pre-Jewel releases (like Hammer)[¶](#upgrading-from-pre-jewel-releases-like-hammer "Permalink to this headline")

You _must_ first upgrade to Jewel (10.2.z) before attempting an upgrade to Luminous.

### Upgrade compatibility notes, Kraken to Luminous[¶](#upgrade-compatibility-notes-kraken-to-luminous "Permalink to this headline")

- We no longer test the FileStore ceph-osd backend in combination with btrfs. We recommend against using btrfs. If you are using btrfs-based OSDs and want to upgrade to luminous you will need to add the follwing to your ceph.conf:
    
    enable experimental unrecoverable data corrupting features = btrfs
    
    The code is mature and unlikely to change, but we are only continuing to test the Jewel stable branch against btrfs. We recommend moving these OSDs to FileStore with XFS or BlueStore.
- The ruleset-\* properties for the erasure code profiles have been renamed to crush-\* to (1) move away from the obsolete ‘ruleset’ term and to be more clear about their purpose. There is also a new optional crush-device-class property to specify a CRUSH device class to use for the erasure coded pool. Existing erasure code profiles will be converted automatically when upgrade completes (when the ceph osd require-osd-release luminous command is run) but any provisioning tools that create erasure coded pools may need to be updated.
    
- The structure of the XML output for osd crush tree has changed slightly to better match the osd tree output. The top level structure is now nodes instead of crush\_map\_roots.
    
- When assigning a network to the public network and not to the cluster network the network specification of the public network will be used for the cluster network as well. In older versions this would lead to cluster services being bound to 0.0.0.0:<port>, thus making the cluster service even more publicly available than the public services. When only specifying a cluster network it will still result in the public services binding to 0.0.0.0.
    
- In previous versions, if a client sent an op to the wrong OSD, the OSD would reply with ENXIO. The rationale here is that the client or OSD is clearly buggy and we want to surface the error as clearly as possible. We now only send the ENXIO reply if the osd\_enxio\_on\_misdirected\_op option is enabled (it’s off by default). This means that a VM using librbd that previously would have gotten an EIO and gone read-only will now see a blocked/hung IO instead.
    
- The “journaler allow split entries” config setting has been removed.
    

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

### Notable Changes since v12.1.0 (RC1)[¶](#notable-changes-since-v12-1-1-rc1 "Permalink to this headline")

- choose\_args encoding has been changed to make it architecture-independent. If you deployed Luminous dev releases or 12.1.0 rc release and made use of the CRUSH choose\_args feature, you need to remove all choose\_args mappings from your CRUSH map before starting the upgrade.
- The ‘ceph health’ structured output (JSON or XML) no longer contains a ‘timechecks’ section describing the time sync status. This information is now available via the ‘ceph time-sync-status’ command.
- Certain extra fields in the ‘ceph health’ structured output that used to appear if the mons were low on disk space (which duplicated the information in the normal health warning messages) are now gone.
- The “ceph -w” output no longer contains audit log entries by default. Add a “–watch-channel=audit” or “–watch-channel=\*” to see them.
- The ‘apply’ mode of cephfs-journal-tool has been removed
- Added new configuration “public bind addr” to support dynamic environments like Kubernetes. When set the Ceph MON daemon could bind locally to an IP address and advertise a different IP address “public addr” on the network.
- New “ceph -w” behavior - the “ceph -w” output no longer contains I/O rates, available space, pg info, etc. because these are no longer logged to the central log (which is what “ceph -w” shows). The same information can be obtained by running “ceph pg stat”; alternatively, I/O rates per pool can be determined using “ceph osd pool stats”. Although these commands do not self-update like “ceph -w” did, they do have the ability to return formatted output by providing a “–format=<format>” option.
- Pools are now expected to be associated with the application using them. Upon completing the upgrade to Luminous, the cluster will attempt to associate existing pools to known applications (i.e. CephFS, RBD, and RGW). In-use pools that are not associated to an application will generate a health warning. Any unassociated pools can be manually associated using the new “ceph osd pool application enable” command. For more details see “Associate Pool to Application” in the documentation.
- ceph-mgr now has a Zabbix plugin. Using zabbix\_sender it sends trapper events to a Zabbix server containing high-level information of the Ceph cluster. This makes it easy to monitor a Ceph cluster’s status and send out notifications in case of a malfunction.
- The ‘mon\_warn\_osd\_usage\_min\_max\_delta’ config option has been removed and the associated health warning has been disabled because it does not address clusters undergoing recovery or CRUSH rules that do not target all devices in the cluster.
- Specifying user authorization capabilities for RBD clients has been simplified. The general syntax for using RBD capability profiles is “mon ‘profile rbd’ osd ‘profile rbd\[-read-only\]\[ pool={pool-name}\[, ...\]\]’”. For more details see “User Management” in the documentation.
- ceph config-key put has been deprecated in favor of ceph config-key set.

### Notable Changes since v12.1.1 (RC2)[¶](#notable-changes-since-v12-1-1-rc2 "Permalink to this headline")

- New “ceph -w” behavior - the “ceph -w” output no longer contains I/O rates, available space, pg info, etc. because these are no longer logged to the central log (which is what “ceph -w” shows). The same information can be obtained by running “ceph pg stat”; alternatively, I/O rates per pool can be determined using “ceph osd pool stats”. Although these commands do not self-update like “ceph -w” did, they do have the ability to return formatted output by providing a “–format=<format>” option.
- Pools are now expected to be associated with the application using them. Upon completing the upgrade to Luminous, the cluster will attempt to associate existing pools to known applications (i.e. CephFS, RBD, and RGW). In-use pools that are not associated to an application will generate a health warning. Any unassociated pools can be manually associated using the new “ceph osd pool application enable” command. For more details see “Associate Pool to Application” in the documentation.
- ceph-mgr now has a Zabbix plugin. Using zabbix\_sender it sends trapper events to a Zabbix server containing high-level information of the Ceph cluster. This makes it easy to monitor a Ceph cluster’s status and send out notifications in case of a malfunction.
- The ‘mon\_warn\_osd\_usage\_min\_max\_delta’ config option has been removed and the associated health warning has been disabled because it does not address clusters undergoing recovery or CRUSH rules that do not target all devices in the cluster.
- Specifying user authorization capabilities for RBD clients has been simplified. The general syntax for using RBD capability profiles is “mon ‘profile rbd’ osd ‘profile rbd\[-read-only\]\[ pool={pool-name}\[, ...\]\]’”. For more details see “User Management” in the documentation.
- RGW: bucket index resharding now uses the reshard namespace in log pool upgrade scenarios as well this is a changed behaviour from RC1 where a new pool for reshard was created
- RGW multisite now supports for enabling or disabling sync at a bucket level.

### Other Notable Changes[¶](#other-notable-changes "Permalink to this headline")

- bluestore: bluestore/BlueFS: pass string as const ref ([pr#16600](https://github.com/ceph/ceph/pull/16600), dingdangzhang)
- bluestore: common/options: make “blue{fs,store}\_allocator” LEVEL\_DEV ([issue#20660](http://tracker.ceph.com/issues/20660), [pr#16645](https://github.com/ceph/ceph/pull/16645), Kefu Chai)
- bluestore: os/bluestore/BlueStore: Avoid double counting state\_kv\_queued\_lat ([pr#16374](https://github.com/ceph/ceph/pull/16374), Jianpeng Ma)
- bluestore: os/bluestore/BlueStore: remove unused code ([pr#16522](https://github.com/ceph/ceph/pull/16522), Jianpeng Ma)
- bluestore: os/bluestore: move aio.h/cc from fs dir to bluestore dir ([pr#16409](https://github.com/ceph/ceph/pull/16409), Pan Liu)
- bluestore: os/bluestore/StupidAllocator: rounded down len to an align boundary ([issue#20660](http://tracker.ceph.com/issues/20660), [pr#16593](https://github.com/ceph/ceph/pull/16593), Zhu Shangzhong)
- bluestore: os/bluestore: use reference to avoid string copy ([pr#16364](https://github.com/ceph/ceph/pull/16364), Pan Liu)
- build/ops: ceph-disk: don’t activate suppressed journal devices ([issue#19489](http://tracker.ceph.com/issues/19489), [pr#16123](https://github.com/ceph/ceph/pull/16123), David Disseldorp)
- build/ops: do\_cmake.sh: fix syntax for /bin/sh (doesn’t have +=) ([pr#16433](https://github.com/ceph/ceph/pull/16433), Dan Mick)
- build/ops: include/assert: test c++ before using static\_cast<> ([pr#16424](https://github.com/ceph/ceph/pull/16424), Kefu Chai)
- build/ops: install-deps.sh: add missing dependencies for FreeBSD ([pr#16545](https://github.com/ceph/ceph/pull/16545), Alan Somers)
- build/ops,rbd,rgw: CMakeLists: trim rbd/rgw forced dependencies ([pr#16574](https://github.com/ceph/ceph/pull/16574), Patrick Donnelly)
- build/ops: rpm: Drop legacy libxio support ([pr#16449](https://github.com/ceph/ceph/pull/16449), Nathan Cutler)
- build/ops: rpm: fix typo WTIH\_BABELTRACE ([pr#16366](https://github.com/ceph/ceph/pull/16366), Nathan Cutler)
- build/ops: rpm: put mgr python build dependencies in make\_check bcond ([issue#20425](http://tracker.ceph.com/issues/20425), [pr#15940](https://github.com/ceph/ceph/pull/15940), Nathan Cutler, Tim Serong)
- build/ops,tests: qa: make run-standalone work on FreeBSD ([pr#16595](https://github.com/ceph/ceph/pull/16595), Willem Jan Withagen)
- cmake: disable -fvar-tracking-assignments for config.cc ([pr#16695](https://github.com/ceph/ceph/pull/16695), Kefu Chai)
- cmake: use CMAKE\_INSTALL\_INCLUDEDIR ([pr#16483](https://github.com/ceph/ceph/pull/16483), David Disseldorp)
- common: buffer: silence unused var warning on FreeBSD ([pr#16452](https://github.com/ceph/ceph/pull/16452), Willem Jan Withagen)
- common: common/common\_init: disable default dout logging for UTILITY\_NODOUT too ([issue#20771](http://tracker.ceph.com/issues/20771), [pr#16578](https://github.com/ceph/ceph/pull/16578), Sage Weil)
- common: common/options: refactors to set the properties in a more structured way ([pr#16482](https://github.com/ceph/ceph/pull/16482), Kefu Chai)
- common: common/WorkQueue: use threadpoolname + threadaddr for heartbeat\_han… ([pr#16563](https://github.com/ceph/ceph/pull/16563), huangjun)
- common,core: osd,mds,mgr: do not dereference null rotating\_keys ([issue#20667](http://tracker.ceph.com/issues/20667), [pr#16455](https://github.com/ceph/ceph/pull/16455), Sage Weil)
- common: fix Option set\_long\_description ([pr#16668](https://github.com/ceph/ceph/pull/16668), Yan Jun)
- common: follow up to new options infrastructure ([pr#16527](https://github.com/ceph/ceph/pull/16527), John Spray)
- common: HashIndex.cc: add compat.h for ENODATA ([pr#16697](https://github.com/ceph/ceph/pull/16697), Willem Jan Withagen)
- common: libradosstriper: fix format injection vulnerability ([issue#20240](http://tracker.ceph.com/issues/20240), [pr#15674](https://github.com/ceph/ceph/pull/15674), Stan K)
- common,mon: crush,mon: add weight-set introspection and manipulation commands ([pr#16326](https://github.com/ceph/ceph/pull/16326), Sage Weil)
- common: mon/MonClient: scale backoff interval down when we have a healthy mon session ([issue#20371](http://tracker.ceph.com/issues/20371), [pr#16576](https://github.com/ceph/ceph/pull/16576), Kefu Chai, Sage Weil)
- common: prevent unset\_dumpable from generating warnings ([pr#16462](https://github.com/ceph/ceph/pull/16462), Willem Jan Withagen)
- common,rbd: osdc/Objecter: unify disparate EAGAIN handling paths into one ([pr#16627](https://github.com/ceph/ceph/pull/16627), Sage Weil)
- common: remove config opt conversion utility ([pr#16480](https://github.com/ceph/ceph/pull/16480), John Spray)
- common: Revamp config option definitions ([issue#20627](http://tracker.ceph.com/issues/20627), [pr#16211](https://github.com/ceph/ceph/pull/16211), John Spray, Kefu Chai, Sage Weil)
- common,rgw: cls/refcount: store and use list of retired tags ([issue#20107](http://tracker.ceph.com/issues/20107), [pr#15673](https://github.com/ceph/ceph/pull/15673), Yehuda Sadeh)
- common: the latency dumped by “ceph osd perf” is not real ([issue#20749](http://tracker.ceph.com/issues/20749), [pr#16512](https://github.com/ceph/ceph/pull/16512), Pan Liu)
- common: use std::move() for better performance ([pr#16620](https://github.com/ceph/ceph/pull/16620), Xinying Song)
- core: auth: Remove unused function in AuthSessionHandler ([pr#16666](https://github.com/ceph/ceph/pull/16666), Luo Kexue)
- core: ceph: allow ‘-‘ with -i and -o for stdin/stdout ([pr#16359](https://github.com/ceph/ceph/pull/16359), Sage Weil)
- core: ceph-disk: support osd new ([pr#15432](https://github.com/ceph/ceph/pull/15432), Loic Dachary, Sage Weil)
- core: common/options: remove mon\_warn\_osd\_usage\_min\_max\_delta from options.cc too ([pr#16488](https://github.com/ceph/ceph/pull/16488), Sage Weil)
- core: kv: resolve a crash issue in ~LevelDBStore() ([pr#16553](https://github.com/ceph/ceph/pull/16553), wumingqiao)
- core: kv/RocksDBStore: use vector instead of VLA for holding slices ([pr#16615](https://github.com/ceph/ceph/pull/16615), Kefu Chai)
- core: messages: default-initialize MOSDPGRecoveryDelete\[Reply\] members ([pr#16584](https://github.com/ceph/ceph/pull/16584), Greg Farnum)
- core: mgr/MgrClient: do not attempt to access a global variable for config ([pr#16544](https://github.com/ceph/ceph/pull/16544), Jason Dillaman)
- core,mgr,tests: qa: flush out monc’s dropped msgs on msgr failure injection ([issue#20371](http://tracker.ceph.com/issues/20371), [pr#16484](https://github.com/ceph/ceph/pull/16484), Joao Eduardo Luis)
- core,mon: crush, mon: simplify device class manipulation commands ([pr#16388](https://github.com/ceph/ceph/pull/16388), xie xingguo)
- core: mon, osd: misc fixes ([pr#16283](https://github.com/ceph/ceph/pull/16283), xie xingguo)
- core,mon,rbd: mon,osd: new rbd-based cephx cap profiles ([pr#15991](https://github.com/ceph/ceph/pull/15991), Jason Dillaman)
- core: msg/async: fix the bug of inaccurate calculation of l\_msgr\_send\_bytes ([pr#16526](https://github.com/ceph/ceph/pull/16526), Jin Cai)
- core: objclass: modify omap\_get\_{keys,vals} api ([pr#16667](https://github.com/ceph/ceph/pull/16667), Yehuda Sadeh, Casey Bodley)
- core: osd/PG: fix warning so we discard\_event() on a no-op state change ([pr#16655](https://github.com/ceph/ceph/pull/16655), Sage Weil)
- core: osd/PG: ignore CancelRecovery in NotRecovering ([issue#20804](http://tracker.ceph.com/issues/20804), [pr#16638](https://github.com/ceph/ceph/pull/16638), Sage Weil)
- core: osd/PGLog: fix inaccurate missing assert ([issue#20753](http://tracker.ceph.com/issues/20753), [pr#16539](https://github.com/ceph/ceph/pull/16539), Josh Durgin)
- core: osd/PrimaryLogPG: fix recovering hang when have unfound objects ([pr#16558](https://github.com/ceph/ceph/pull/16558), huangjun)
- core: osd/PrimaryLogPG: skip deleted missing objects in pg\[n\]ls ([issue#20739](http://tracker.ceph.com/issues/20739), [pr#16490](https://github.com/ceph/ceph/pull/16490), Josh Durgin)
- core,performance: kv/RocksDBStore: Table options for indexing and filtering ([pr#16450](https://github.com/ceph/ceph/pull/16450), Mark Nelson)
- core,performance: osd/PG: make prioritized recovery possible ([pr#13723](https://github.com/ceph/ceph/pull/13723), Piotr Dałek)
- core: PGLog: store extra duplicate ops beyond the normal log entries ([pr#16172](https://github.com/ceph/ceph/pull/16172), Josh Durgin, J. Eric Ivancich)
- core,rgw,tests: qa/suits/rados/basic/tasks/rgw\_snaps: wait for pools to be created ([pr#16509](https://github.com/ceph/ceph/pull/16509), Sage Weil)
- core,tests: ceph\_test\_rados\_api\_watch\_notify: flush after unwatch ([issue#20105](http://tracker.ceph.com/issues/20105), [pr#16402](https://github.com/ceph/ceph/pull/16402), Sage Weil)
- core,tests: ceph\_test\_rados: max\_stride\_size must be more than min\_stride\_size ([issue#20775](http://tracker.ceph.com/issues/20775), [pr#16590](https://github.com/ceph/ceph/pull/16590), Lianne Wang)
- core,tests: qa: move ceph-helpers-based make check tests to qa/standalone; run via teuthology ([pr#16513](https://github.com/ceph/ceph/pull/16513), Sage Weil)
- core,tests: qa/suites/rados: at-end: ignore PG\_{AVAILABILITY,DEGRADED} ([issue#20693](http://tracker.ceph.com/issues/20693), [pr#16575](https://github.com/ceph/ceph/pull/16575), Sage Weil)
- core,tests: qa/tasks/ceph\_manager: wait for osd to start after objectstore-tool sequence ([issue#20705](http://tracker.ceph.com/issues/20705), [pr#16454](https://github.com/ceph/ceph/pull/16454), Sage Weil)
- core,tests: qa/tasks/ceph: wait for mgr to activate and pg stats to flush in health() ([issue#20744](http://tracker.ceph.com/issues/20744), [pr#16514](https://github.com/ceph/ceph/pull/16514), Sage Weil)
- core,tests: qa/tasks/dump\_stuck: fix dump\_stuck test bug ([pr#16559](https://github.com/ceph/ceph/pull/16559), huangjun)
- core,tests: qa/workunits/cephtool/test.sh: add sudo for daemon compact ([pr#16500](https://github.com/ceph/ceph/pull/16500), Sage Weil)
- core,tests: test: add separate ceph-helpers-based smoke test ([pr#16572](https://github.com/ceph/ceph/pull/16572), Sage Weil)
- core: throttle: Minimal destructor fix for Luminous ([pr#16661](https://github.com/ceph/ceph/pull/16661), Adam C. Emerson)
- core: vstart.sh: start mgr after mon, before osds ([pr#16613](https://github.com/ceph/ceph/pull/16613), Sage Weil)
- crush: a couple of weight-set fixes ([pr#16623](https://github.com/ceph/ceph/pull/16623), xie xingguo)
- crush: enforce buckets-before-rules rule ([pr#16453](https://github.com/ceph/ceph/pull/16453), Sage Weil)
- crush: s/ruleset/id/ in decompiled output; prevent compilation when ruleset != id ([pr#16400](https://github.com/ceph/ceph/pull/16400), Sage Weil)
- doc: Add amitkumar50 affiliation to .organizationmap ([pr#16475](https://github.com/ceph/ceph/pull/16475), Amit Kumar)
- doc: add doc requirements on PR submitters ([pr#16394](https://github.com/ceph/ceph/pull/16394), John Spray)
- doc: added mgr caps to manual deployment documentation ([pr#16660](https://github.com/ceph/ceph/pull/16660), Nick Erdmann)
- doc: add instructions for replacing an OSD ([pr#16314](https://github.com/ceph/ceph/pull/16314), Kefu Chai)
- doc: add rbd new trash cli and cleanups in release-notes.rst ([issue#20702](http://tracker.ceph.com/issues/20702), [pr#16498](https://github.com/ceph/ceph/pull/16498), songweibin)
- doc: Add Zabbix ceph-mgr plugin to PendingReleaseNotes ([pr#16412](https://github.com/ceph/ceph/pull/16412), Wido den Hollander)
- doc: AUTHORS: update CephFS PTL ([pr#16399](https://github.com/ceph/ceph/pull/16399), Patrick Donnelly)
- doc: ceph-disk: use ‘-‘ for feeding ceph cli with stdin ([pr#16362](https://github.com/ceph/ceph/pull/16362), Kefu Chai)
- doc: common/options.cc: document bluestore config options ([pr#16489](https://github.com/ceph/ceph/pull/16489), Sage Weil)
- doc: Describe mClock’s use within Ceph in great detail ([pr#16707](https://github.com/ceph/ceph/pull/16707), J. Eric Ivancich)
- doc: doc/install/manual-deployment: update osd creation steps ([pr#16573](https://github.com/ceph/ceph/pull/16573), Sage Weil)
- doc: doc/mon: fix ceph-authtool command in rebuild mon’s sample ([pr#16503](https://github.com/ceph/ceph/pull/16503), huanwen ren)
- doc: doc/qa: cover config help command ([pr#16727](https://github.com/ceph/ceph/pull/16727), John Spray)
- doc: doc/rados: add page for health checks and update monitoring.rst ([pr#16566](https://github.com/ceph/ceph/pull/16566), John Spray)
- doc: doc/rados/operations/health-checks: osd section ([pr#16611](https://github.com/ceph/ceph/pull/16611), Sage Weil)
- doc: doc/release-notes: fix upmap and osd replacement links; add fixme ([pr#16730](https://github.com/ceph/ceph/pull/16730), Sage Weil)
- doc: \[docs/quick-start\]: update quick start to add a note for mgr create command for luminous+ builds ([pr#16350](https://github.com/ceph/ceph/pull/16350), Vasu Kulkarni)
- doc: Documentation updates for July 2017 releases ([pr#16401](https://github.com/ceph/ceph/pull/16401), Bryan Stillwell)
- doc: document mClock related options ([pr#16552](https://github.com/ceph/ceph/pull/16552), Kefu Chai)
- doc: Fixed a typo in yum repo filename script ([pr#16431](https://github.com/ceph/ceph/pull/16431), Jeff Green)
- doc: fix typo in config.rst ([pr#16721](https://github.com/ceph/ceph/pull/16721), Jos Collin)
- doc: fix typos in config.rst ([pr#16681](https://github.com/ceph/ceph/pull/16681), Song Shun)
- doc: mailmap: add affiliation for Zhu Shangzhong ([pr#16537](https://github.com/ceph/ceph/pull/16537), Zhu Shangzhong)
- doc: .mailmap, .organizationmap: Update ztczll affiliation ([pr#16038](https://github.com/ceph/ceph/pull/16038), zhanglei)
- doc: PendingReleaseNotes: “ceph -w” behavior has changed drastically ([pr#16425](https://github.com/ceph/ceph/pull/16425), Joao Eduardo Luis, Nathan Cutler)
- doc: Remove contractions from the documentation ([pr#16629](https://github.com/ceph/ceph/pull/16629), John Wilkins)
- doc: remove docs on non-existant command ([pr#16616](https://github.com/ceph/ceph/pull/16616), Luo Kexue, Kefu Chai)
- doc: reword mds deactivate docs; add optional fs\_name argument ([issue#20607](http://tracker.ceph.com/issues/20607), [pr#16471](https://github.com/ceph/ceph/pull/16471), Jan Fajerski)
- doc: rgw clarify limitations when creating tenant names ([pr#16418](https://github.com/ceph/ceph/pull/16418), Abhishek Lekshmanan)
- doc: update ceph(8) man page with new sub-commands ([pr#16437](https://github.com/ceph/ceph/pull/16437), Kefu Chai)
- doc: Update .organizationmap ([pr#16507](https://github.com/ceph/ceph/pull/16507), luokexue)
- doc: update the pool names created by vstart.sh by default ([pr#16652](https://github.com/ceph/ceph/pull/16652), Zhu Shangzhong)
- doc: update the rados namespace docs ([pr#15838](https://github.com/ceph/ceph/pull/15838), Abhishek Lekshmanan)
- doc: upmap docs; various missing links for release notes ([pr#16637](https://github.com/ceph/ceph/pull/16637), Sage Weil)
- doc: various fixes ([pr#16723](https://github.com/ceph/ceph/pull/16723), Kefu Chai)
- librados: add missing implementations for C service daemon API methods ([pr#16543](https://github.com/ceph/ceph/pull/16543), Jason Dillaman)
- librbd: add compare and write API ([pr#14868](https://github.com/ceph/ceph/pull/14868), Zhengyong Wang, Jason Dillaman)
- librbd: add LIBRBD\_SUPPORTS\_WRITESAME support ([pr#16583](https://github.com/ceph/ceph/pull/16583), Xiubo Li)
- mgr: add per-DaemonState lock ([pr#16432](https://github.com/ceph/ceph/pull/16432), Sage Weil)
- mgr: fix lock cycle ([pr#16508](https://github.com/ceph/ceph/pull/16508), Sage Weil)
- mgr: mgr/dashboard: add OSD list view ([pr#16373](https://github.com/ceph/ceph/pull/16373), John Spray)
- mgr: mgr\_module interface to report health alerts ([pr#16487](https://github.com/ceph/ceph/pull/16487), Sage Weil)
- mgr: mgr/PyState: shut up about get\_config on nonexistent keys ([pr#16641](https://github.com/ceph/ceph/pull/16641), Sage Weil)
- mgr: mon/MgrMonitor: fix standby addition to mgrmap ([issue#20647](http://tracker.ceph.com/issues/20647), [pr#16397](https://github.com/ceph/ceph/pull/16397), Sage Weil)
- mgr,mon: mon/AuthMonitor: generate bootstrap-mgr key on upgrade ([issue#20666](http://tracker.ceph.com/issues/20666), [pr#16395](https://github.com/ceph/ceph/pull/16395), Joao Eduardo Luis)
- mgr,mon: mon/MgrMonitor: reset mgrdigest timer with new subscription ([issue#20633](http://tracker.ceph.com/issues/20633), [pr#16582](https://github.com/ceph/ceph/pull/16582), Sage Weil)
- mgr: perf schema fns/change notification and Prometheus plugin ([pr#16406](https://github.com/ceph/ceph/pull/16406), Dan Mick)
- mgr: pybind/mgr/zabbix: fix health in non-compat mode ([issue#20767](http://tracker.ceph.com/issues/20767), [pr#16580](https://github.com/ceph/ceph/pull/16580), Sage Weil)
- mgr,pybind,rbd: mgr/dashboard: show rbd image features ([pr#16468](https://github.com/ceph/ceph/pull/16468), Yanhu Cao)
- mgr,rbd: mgr/dashboard: RBD iSCSI daemon status page ([pr#16547](https://github.com/ceph/ceph/pull/16547), Jason Dillaman)
- mgr,rbd: mgr/dashboard: rbd mirroring status page ([pr#16360](https://github.com/ceph/ceph/pull/16360), Jason Dillaman)
- mgr: vstart.sh: fix mgr vs restful command startup race ([pr#16564](https://github.com/ceph/ceph/pull/16564), Sage Weil)
- mon: add force-create-pg back ([issue#20605](http://tracker.ceph.com/issues/20605), [pr#16353](https://github.com/ceph/ceph/pull/16353), Kefu Chai)
- mon: add mgr metdata commands, and overall ‘versions’ command for all daemon versions ([pr#16460](https://github.com/ceph/ceph/pull/16460), Sage Weil)
- mon: a few health fixes ([pr#16415](https://github.com/ceph/ceph/pull/16415), xie xingguo)
- mon: ‘config-key put’ -> ‘config-key set’ ([pr#16569](https://github.com/ceph/ceph/pull/16569), Sage Weil)
- mon: do not dereference empty mgr\_commands ([pr#16501](https://github.com/ceph/ceph/pull/16501), Sage Weil)
- mon: Fix deep\_age copy paste error ([pr#16434](https://github.com/ceph/ceph/pull/16434), Brad Hubbard)
- mon: Fix output text and doc ([pr#16367](https://github.com/ceph/ceph/pull/16367), Yan Jun)
- mon: ‘\* list’ -> ‘\* ls’ ([pr#16423](https://github.com/ceph/ceph/pull/16423), Sage Weil)
- mon: load mgr commands at runtime ([pr#16028](https://github.com/ceph/ceph/pull/16028), John Spray, Sage Weil)
- mon: mon/HealthMonitor: avoid sending unnecessary MMonHealthChecks to leader ([pr#16478](https://github.com/ceph/ceph/pull/16478), xie xingguo)
- mon: mon/HealthMonitor: trigger a proposal if stat updated ([pr#16477](https://github.com/ceph/ceph/pull/16477), Kefu Chai)
- mon: mon/LogMonitor: don’t read list’s end() for log last ([pr#16376](https://github.com/ceph/ceph/pull/16376), Joao Eduardo Luis)
- mon: mon/MDSMonitor: close object section of formatter ([pr#16516](https://github.com/ceph/ceph/pull/16516), Chang Liu)
- mon: mon/MgrMonitor: only induce mgr epoch shortly after mkfs ([pr#16356](https://github.com/ceph/ceph/pull/16356), Sage Weil)
- mon: mon/OSDMonitor: ensure UP is not set for newly-created OSDs ([issue#20751](http://tracker.ceph.com/issues/20751), [pr#16534](https://github.com/ceph/ceph/pull/16534), Sage Weil)
- mon: mon/OSDMonitor: issue pool application related warning ([pr#16520](https://github.com/ceph/ceph/pull/16520), xie xingguo)
- mon: mon/OSDMonitor: remove zeroed new\_state updates ([issue#20751](http://tracker.ceph.com/issues/20751), [pr#16518](https://github.com/ceph/ceph/pull/16518), Sage Weil)
- mon: mon/PGMap: remove skewed utilizatoin warning ([issue#20730](http://tracker.ceph.com/issues/20730), [pr#16461](https://github.com/ceph/ceph/pull/16461), Sage Weil)
- mon: OSDMonitor: check mon\_max\_pool\_pg\_num when set pool pg\_num ([pr#16511](https://github.com/ceph/ceph/pull/16511), chenhg)
- mon: prime pg\_temp and a few health warning fixes ([pr#16530](https://github.com/ceph/ceph/pull/16530), xie xingguo)
- mon: show destroyed status in tree view; do not auto-out destroyed osds ([pr#16446](https://github.com/ceph/ceph/pull/16446), xie xingguo)
- mon: stop issuing not-\[deep\]-scrubbed warnings if disabled ([pr#16465](https://github.com/ceph/ceph/pull/16465), xie xingguo)
- mon: support pool application metadata key/values ([pr#15763](https://github.com/ceph/ceph/pull/15763), Jason Dillaman)
- msg: messages/: always set header.version in encode\_payload() ([issue#19939](http://tracker.ceph.com/issues/19939), [pr#16421](https://github.com/ceph/ceph/pull/16421), Kefu Chai)
- msg: mgr/status: row has incorrect number of values ([issue#20750](http://tracker.ceph.com/issues/20750), [pr#16529](https://github.com/ceph/ceph/pull/16529), liuchang0812)
- msg: msg/async: use auto iterator having more simple code and good performance ([pr#16524](https://github.com/ceph/ceph/pull/16524), dingdangzhang)
- osd: add default\_device\_class to metadata ([pr#16634](https://github.com/ceph/ceph/pull/16634), Neha Ojha)
- osd: add dump filter for tracked ops ([pr#16561](https://github.com/ceph/ceph/pull/16561), Yan Jun)
- osd: Add recovery sleep configuration option for HDDs and SSDs ([pr#16328](https://github.com/ceph/ceph/pull/16328), Neha Ojha)
- osd: cmpext operator should ignore -ENOENT on read ([pr#16622](https://github.com/ceph/ceph/pull/16622), Jason Dillaman)
- osd: combine conditional statements ([pr#16391](https://github.com/ceph/ceph/pull/16391), Yan Jun)
- osd: do not send pg\_created unless luminous ([issue#20785](http://tracker.ceph.com/issues/20785), [pr#16677](https://github.com/ceph/ceph/pull/16677), Kefu Chai)
- osd: EC read handling: don’t grab an objectstore error to use as the read error ([pr#16663](https://github.com/ceph/ceph/pull/16663), David Zafman)
- osd: fix a couple bugs with persisting the missing set when it contains deletes ([issue#20704](http://tracker.ceph.com/issues/20704), [pr#16459](https://github.com/ceph/ceph/pull/16459), Josh Durgin)
- osd: fix OpRequest and tracked op dump information ([pr#16504](https://github.com/ceph/ceph/pull/16504), Yan Jun)
- osd: fix pg ref leaks when osd shutdown ([issue#20684](http://tracker.ceph.com/issues/20684), [pr#16408](https://github.com/ceph/ceph/pull/16408), Yang Honggang)
- osd: Log audit ([pr#16281](https://github.com/ceph/ceph/pull/16281), Brad Hubbard)
- osd: moved OpFinisher logic from OSDOp to OpContext ([issue#20783](http://tracker.ceph.com/issues/20783), [pr#16617](https://github.com/ceph/ceph/pull/16617), Jason Dillaman)
- osd: populate last\_epoch\_split during build\_initial\_pg\_history ([issue#20754](http://tracker.ceph.com/issues/20754), [pr#16519](https://github.com/ceph/ceph/pull/16519), Sage Weil)
- osd: PrimaryLogPG, PGBackend: complete callback even if interval changes ([issue#20747](http://tracker.ceph.com/issues/20747), [pr#16536](https://github.com/ceph/ceph/pull/16536), Josh Durgin)
- osd: process deletes during recovery instead of peering ([issue#19971](http://tracker.ceph.com/issues/19971), [pr#15952](https://github.com/ceph/ceph/pull/15952), Josh Durgin)
- osd: rephrase “wrongly marked me down” clog message ([pr#16365](https://github.com/ceph/ceph/pull/16365), John Spray)
- osd: scrub\_to specifies clone ver, but transaction include head write… ([issue#20041](http://tracker.ceph.com/issues/20041), [pr#16404](https://github.com/ceph/ceph/pull/16404), David Zafman)
- osd: support cmpext operation on EC-backed pools ([pr#15693](https://github.com/ceph/ceph/pull/15693), Zhengyong Wang, Jason Dillaman)
- performance,rgw: rgw\_file: permit dirent offset computation ([pr#16275](https://github.com/ceph/ceph/pull/16275), Matt Benjamin)
- pybind: pybind/mgr/restful: fix typo ([pr#16560](https://github.com/ceph/ceph/pull/16560), Nick Erdmann)
- rbd: cls/rbd: silence warning from -Wunused-variable ([pr#16670](https://github.com/ceph/ceph/pull/16670), Yan Jun)
- rbd: cls/rbd: trash\_list should be iterable ([issue#20643](http://tracker.ceph.com/issues/20643), [pr#16372](https://github.com/ceph/ceph/pull/16372), Jason Dillaman)
- rbd: fixed coverity ‘Argument cannot be negative’ warning ([pr#16686](https://github.com/ceph/ceph/pull/16686), amitkuma)
- rbd: make it more understandable when adding peer returns error ([pr#16313](https://github.com/ceph/ceph/pull/16313), songweibin)
- rbd-mirror: guard the deletion of non-primary images ([pr#16398](https://github.com/ceph/ceph/pull/16398), Jason Dillaman)
- rbd-mirror: initialize timer context pointer to null ([pr#16603](https://github.com/ceph/ceph/pull/16603), Jason Dillaman)
- rbd: modified some commands’ description into imperative sentence ([pr#16694](https://github.com/ceph/ceph/pull/16694), songweibin)
- rbd,tests: qa/tasks/rbd\_fio: bump default fio version to 2.21 ([pr#16656](https://github.com/ceph/ceph/pull/16656), Ilya Dryomov)
- rbd,tests: qa: thrash tests for backoff and upmap ([pr#16428](https://github.com/ceph/ceph/pull/16428), Ilya Dryomov)
- rbd,tests: qa/workunits: adjust path to ceph-helpers.sh ([pr#16599](https://github.com/ceph/ceph/pull/16599), Sage Weil)
- rgw: acl grants num limit ([pr#16291](https://github.com/ceph/ceph/pull/16291), Enming Zhang)
- rgw: check placement existence when create bucket ([pr#16385](https://github.com/ceph/ceph/pull/16385), Jiaying Ren)
- rgw: check placement target existence during bucket creation ([pr#16384](https://github.com/ceph/ceph/pull/16384), Jiaying Ren)
- rgw: delete object in error path ([issue#20620](http://tracker.ceph.com/issues/20620), [pr#16324](https://github.com/ceph/ceph/pull/16324), Yehuda Sadeh)
- rgw: Do not decrement stats cache when the cache values are zero ([issue#20661](http://tracker.ceph.com/issues/20661), [pr#16389](https://github.com/ceph/ceph/pull/16389), Pavan Rallabhandi)
- rgw: Drop dump\_usage\_bucket\_info() to silence warning from -Wunused-function ([pr#16497](https://github.com/ceph/ceph/pull/16497), Wei Qiaomiao)
- rgw: drop unused find\_replacement() and some function docs ([pr#16386](https://github.com/ceph/ceph/pull/16386), Jiaying Ren)
- rgw: fix asctime when logging in rgw\_lc ([pr#16422](https://github.com/ceph/ceph/pull/16422), Abhishek Lekshmanan)
- rgw: fix error message in removing bucket with –bypass-gc flag ([issue#20688](http://tracker.ceph.com/issues/20688), [pr#16419](https://github.com/ceph/ceph/pull/16419), Abhishek Varshney)
- rgw: fix err when copy object in bucket with specified placement rule ([issue#20378](http://tracker.ceph.com/issues/20378), [pr#15837](https://github.com/ceph/ceph/pull/15837), fang yuxiang)
- rgw: Fix for Policy Parse exception in case of multiple statements ([pr#16689](https://github.com/ceph/ceph/pull/16689), Pritha Srivastava)
- rgw: fix memory leaks during Swift Static Website’s error handling ([issue#20757](http://tracker.ceph.com/issues/20757), [pr#16531](https://github.com/ceph/ceph/pull/16531), Radoslaw Zarzynski)
- rgw: fix parse/eval of policy conditions with IfExists ([issue#20708](http://tracker.ceph.com/issues/20708), [pr#16463](https://github.com/ceph/ceph/pull/16463), Casey Bodley)
- rgw: fix radosgw will crash when service is restarted during lifecycl… ([issue#20756](http://tracker.ceph.com/issues/20756), [pr#16495](https://github.com/ceph/ceph/pull/16495), Wei Qiaomiao)
- rgw: fix rgw hang when do RGWRealmReloader::reload after go SIGHUP ([issue#20686](http://tracker.ceph.com/issues/20686), [pr#16417](https://github.com/ceph/ceph/pull/16417), fang.yuxiang)
- rgw: fix segfault in RevokeThread during its shutdown procedure ([issue#19831](http://tracker.ceph.com/issues/19831), [pr#15033](https://github.com/ceph/ceph/pull/15033), Radoslaw Zarzynski)
- rgw: fix the UTF8 check on bucket entry name in rgw\_log\_op() ([issue#20779](http://tracker.ceph.com/issues/20779), [pr#16604](https://github.com/ceph/ceph/pull/16604), Radoslaw Zarzynski)
- rgw: modify email to empty by admin RESTful api doesn’t work ([pr#16309](https://github.com/ceph/ceph/pull/16309), fang.yuxiang)
- rgw: never let http\_redirect\_code of RGWRedirectInfo to stay uninitialized ([issue#20774](http://tracker.ceph.com/issues/20774), [pr#16601](https://github.com/ceph/ceph/pull/16601), Radoslaw Zarzynski)
- rgw: raise debug level of RGWPostObj\_ObjStore\_S3::get\_policy ([pr#16203](https://github.com/ceph/ceph/pull/16203), Shasha Lu)
- rgw: req xml params size limitation error msg ([pr#16310](https://github.com/ceph/ceph/pull/16310), Enming Zhang)
- rgw: restore admin socket path in mrgw.sh ([pr#16540](https://github.com/ceph/ceph/pull/16540), Casey Bodley)
- rgw: rgw\_file: properly & [|](#id4)‘d flags ([issue#20663](http://tracker.ceph.com/issues/20663), [pr#16448](https://github.com/ceph/ceph/pull/16448), Matt Benjamin)
- rgw: rgw multisite: feature of bucket sync enable/disable ([pr#15801](https://github.com/ceph/ceph/pull/15801), Zhang Shaowen, Casey Bodley, Zengran Zhang)
- rgw: should unlock when reshard\_log->update() reture non-zero in RGWB… ([pr#16502](https://github.com/ceph/ceph/pull/16502), Wei Qiaomiao)
- rgw: test,rgw: fix rgw placement rule pool config option ([pr#16380](https://github.com/ceph/ceph/pull/16380), Jiaying Ren)
- rgw: usage ([issue#16191](http://tracker.ceph.com/issues/16191), [pr#14287](https://github.com/ceph/ceph/pull/14287), Ji Chen, Orit Wasserman)
- rgw: use a namespace for rgw reshard pool for upgrades as well ([issue#20289](http://tracker.ceph.com/issues/20289), [pr#16368](https://github.com/ceph/ceph/pull/16368), Karol Mroz, Abhishek Lekshmanan)
- rgw: Use comparison instead of assignment ([pr#16653](https://github.com/ceph/ceph/pull/16653), amitkuma)
- tests: add setup/teardown for asok dir ([pr#16523](https://github.com/ceph/ceph/pull/16523), Kefu Chai)
- tests: cephtool/test.sh: Only delete a test pool when no longer needed ([pr#16443](https://github.com/ceph/ceph/pull/16443), Willem Jan Withagen)
- tests: qa: Added luminous to the mix in schedule\_subset.sh ([pr#16430](https://github.com/ceph/ceph/pull/16430), Yuri Weinstein)
- tests: qa,doc: document and fix tests for pool application warnings ([pr#16568](https://github.com/ceph/ceph/pull/16568), Sage Weil)
- tests: qa/run-standalone.sh: fix the find option to be compatible with GNU find ([pr#16646](https://github.com/ceph/ceph/pull/16646), Kefu Chai)
- tests: qa/suites/rados/singleton/all/erasure-code-nonregression: fix typo ([pr#16579](https://github.com/ceph/ceph/pull/16579), Sage Weil)
- tests: qa/suites/upgrade/jewel-x: misc fixes for new health checks ([pr#16429](https://github.com/ceph/ceph/pull/16429), Sage Weil)
- tests: qa/tasks/ceph-deploy: Fix bluestore options for ceph-deploy ([pr#16571](https://github.com/ceph/ceph/pull/16571), Vasu Kulkarni)
- tests: qa/tasks/reg11184: use literal ‘foo’ instead pool\_name ([pr#16451](https://github.com/ceph/ceph/pull/16451), Kefu Chai)
- tests: qa/workunits/cephtool/test.sh: “ceph osd stat” output changed, update accordingly ([pr#16444](https://github.com/ceph/ceph/pull/16444), Willem Jan Withagen, Kefu Chai)
- tests: qa/workunits/cephtool/test.sh: disable ‘fs status’ until bug is fixed ([issue#20761](http://tracker.ceph.com/issues/20761), [pr#16541](https://github.com/ceph/ceph/pull/16541), Sage Weil)
- tests: qa/workunits/cephtool/test.sh: fix test to watch audit channel ([pr#16470](https://github.com/ceph/ceph/pull/16470), Sage Weil)
- tests: test: ceph osd stat out has changed, fix tests for that ([pr#16403](https://github.com/ceph/ceph/pull/16403), Willem Jan Withagen)
- tests: test: create asok files in a temp directory under $TMPDIR ([issue#16895](http://tracker.ceph.com/issues/16895), [pr#16445](https://github.com/ceph/ceph/pull/16445), Kefu Chai)
- tests: test: Fixes for test\_pidfile ([issue#20770](http://tracker.ceph.com/issues/20770), [pr#16587](https://github.com/ceph/ceph/pull/16587), David Zafman)
- tests: test/osd: kill compile warning ([pr#16669](https://github.com/ceph/ceph/pull/16669), Yan Jun)
- tests: test/rados: fix wrong parameter order of RETURN1\_IF\_NOT\_VAL ([pr#16589](https://github.com/ceph/ceph/pull/16589), Yan Jun)
- tests: test: reg11184 might not always find pg 2.0 prior to import ([pr#16610](https://github.com/ceph/ceph/pull/16610), David Zafman)
- tests: test: s/osd\_objectstore\_type/osd\_objectstore ([pr#16469](https://github.com/ceph/ceph/pull/16469), xie xingguo)
- tests: test: test\_pidfile running 2nd mon has unreliable log output ([pr#16635](https://github.com/ceph/ceph/pull/16635), David Zafman)
- tools: ceph-disk: change the lockbox partition number to 5 ([issue#20556](http://tracker.ceph.com/issues/20556), [pr#16247](https://github.com/ceph/ceph/pull/16247), Shangzhong Zhu)
- tools: ceph-disk: Fix for missing ‘not’ in \*\_is\_diskdevice checks ([issue#20706](http://tracker.ceph.com/issues/20706), [pr#16481](https://github.com/ceph/ceph/pull/16481), Nikita Gerasimov)
- tools: ceph\_disk/main.py: FreeBSD root has wheel for group ([pr#16609](https://github.com/ceph/ceph/pull/16609), Willem Jan Withagen)
- tools: ceph-disk: s/ceph\_osd\_mkfs/command\_check\_call/ ([issue#20685](http://tracker.ceph.com/issues/20685), [pr#16427](https://github.com/ceph/ceph/pull/16427), Zhu Shangzhong)
- tools: ceph-release-notes: escape \_ for unintended links ([issue#17499](http://tracker.ceph.com/issues/17499), [pr#16528](https://github.com/ceph/ceph/pull/16528), Kefu Chai)
- tools: ceph-release-notes: port it to py3 ([pr#16261](https://github.com/ceph/ceph/pull/16261), Kefu Chai)
- tools: ceph-release-notes: refactor and fix regressions ([pr#16411](https://github.com/ceph/ceph/pull/16411), Nathan Cutler)
- tools: os/bluestore/bluestore\_tool: add sanity check to get rid of occasionally crash ([pr#16013](https://github.com/ceph/ceph/pull/16013), xie xingguo)
- tools: script: add docker core dump debugger ([pr#16375](https://github.com/ceph/ceph/pull/16375), Patrick Donnelly)
