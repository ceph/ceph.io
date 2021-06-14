---
title: "New in Luminous: Upgrade Complete?"
date: "2017-09-05"
author: "jdurgin"
tags: 
  - "luminous"
---

When upgrading any distributed system, it's easy to miss a step and have an old daemon running long after you thought the previous version was history. A common mistake is installing new packages and forgetting to restart the processes using them.

With distributed storage like Ceph, it's also important to remember the client side: the VMs, containers, file systems, or object gateways that access Ceph. To use new features, it's sometimes necessary to upgrade the client side libraries or kernel. If you've got a VM using librbd from Jewel, and want to enable an incompatible Luminous feature (like the erasure coded data pool for librbd), you'd need to live-migrate or otherwise restart the process running the VM so that it links the new Luminous version of librbd.

To make this a easier to track, Luminous adds a few new commands.

### Daemon versions

To find out what daemons are currently running, try

> $ ceph versions

This summarizes the versions of daemons running in the cluster. On a cluster with everything upgraded except for two OSDs, this looks something like:

> {
>     "mon": {
>         "ceph version 12.2.0 (32ce2a3ae5239ee33d6150705cdb24d43bab910c) luminous (rc)": 3
>     },
>     "mgr": {
>         "ceph version 12.2.0 (32ce2a3ae5239ee33d6150705cdb24d43bab910c) luminous (rc)": 1
>     },
>     "osd": {
>         "ceph version 10.2.7-116-g41ac764 (41ac7649ade52628174e58671f2d1aa4a39c2b19)": 2,
>         "ceph version 12.2.0 (32ce2a3ae5239ee33d6150705cdb24d43bab910c) luminous (rc)": 4
>     }
>     "mds": {
>         "ceph version 12.2.0 (32ce2a3ae5239ee33d6150705cdb24d43bab910c) luminous (rc)": 1
>     },
>     "overall": {
>         "ceph version 10.2.7-116-g41ac764 (41ac7649ade52628174e58671f2d1aa4a39c2b19)": 2,
>         "ceph version 12.2.0 (32ce2a3ae5239ee33d6150705cdb24d43bab910c) luminous (rc)": 9
>     }
> }

Note that MDS daemons prior to Luminous did not report this information to the monitor, so they may be listed as 'unknown'.

### Connected clients

To find out what protocol features are used by connected daemons and clients, try

> $ ceph features

This reports the major release version and feature bitmask for all daemons _and_ clients currently connected to the monitors.  This might look like:

> {
>     "mon": {
>         "group": {
>             "features": "0x1ffddff8eea4fffb",
>             "release": "luminous",
>             "num": 3
>         }
>     },
>     "mds": {
>         "group": {
>             "features": "0x1ffddff8eea4fffb",
>             "release": "luminous",
>             "num": 1
>         }
>     },
>     "osd": {
>         "group": {
>             "features": "0x17fddff8ee84bffb",
>             "release": "jewel",
>             "num": 2
>         },
>         "group": {
>             "features": "0x1ffddff8eea4fffb",
>             "release": "luminous",
>             "num": 4
>         }
>     },
>     "client": {
>         "group": {
>             "features": "0x1ffddff8eea4fffb",
>             "release": "luminous",
>             "num": 1
>         }
>     }
> }

Note that this command effectively double-reports the daemon information (since we could already tell exactly which version of the code they were running without having to infer it from their supported feature bits).

Also, note that Linux kernel clients are effectively labeled based on what set of protocol features (e.g., CRUSH tunables) they support.  That will tell you which Ceph features you can safely enable but not the exact kernel version they are running.

### Completing an Upgrade

Once '_ceph versions_' shows all your OSDs have updated to Luminous, you can complete the upgrade (and enable new features or functionality) with

> $ ceph osd require-osd-release luminous

This prevents OSDs older than Luminous from booting or joining the cluster (the monitors refuse to mark them "up").  This is a generalization of the older require\_$release\_osds flags, which are now hidden from ceph status. If you're curious, you can see the full set of flags in ceph osd dump.  Setting this option will fail if there are any older OSDs still running.

Most new cluster features or protocol improvements will not be used until this flag is set, since older daemons would not understand the new protocol.

### Client compatibility

There are usually fewer features that affect interoperability with older Ceph clients.  Historically, the main exception has been changes to CRUSH (so-called "tunables").  For example, if you wanted to enable the "jewel" CRUSH tunables (e.g., because it will take a while to get all of your hypervisor hosts upgraded), you can use the new command

> $ ceph osd set-require-min-compat-client jewel

This is the default for new Luminous clusters, and corresponds to kernel 4.5 for kernel clients.

This "minimum compatible client" setting is recorded by the cluster and prevents you from enabling any feature in the system that would prevent older clients from connecting.  For example, setting the minimum compatible client to "jewel" will prevent you from using the new [PG "upmap" capability](http://docs.ceph.com/docs/master/rados/operations/upmap/):

> $ ceph osd pg-upmap 0.0 osd.1 osd.2
> Error EPERM: min\_compat\_client jewel < luminous, which is required for pg-upmap. Try 'ceph osd set-require-min-compat-client luminous' before using the new interface

### Conclusion

Once you've set the required OSD release and appropriate minimum compatible client, you can be sure no older clients or OSDs will run and your upgrade is complete!
