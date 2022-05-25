---
title: "v9.1.0 Infernalis release candidate released"
date: "2015-10-13"
author: "sage"
tags:
  - "release"
  - "infernalis"
---

This is the first Infernalis release candidate. There have been some major changes since Hammer, and the upgrade process is non-trivial. Please read carefully.

### GETTING THE RELEASE CANDIDATE

The v9.1.0 packages are pushed to the development release repositories:

http://download.ceph.com/rpm-testing
http://download.ceph.com/debian-testing

For for info, see:

http://docs.ceph.com/docs/master/install/get-packages/

Or install with ceph-deploy via:

ceph-deploy install --testing HOST

### KNOWN ISSUES

- librbd and librados ABI compatibility is broken. Be careful installing this RC on client machines (e.g., those running qemu). It will be fixed in the final v9.2.0 release.

### MAJOR CHANGES FROM HAMMER

- _General_:
    - Ceph daemons are now managed via systemd (with the exception of Ubuntu Trusty, which still uses upstart).
    - Ceph daemons run as ‘ceph’ user instead root.
    - On Red Hat distros, there is also an SELinux policy.
- _RADOS_:
    - The RADOS cache tier can now proxy write operations to the base tier, allowing writes to be handled without forcing migration of an object into the cache.
    - The SHEC erasure coding support is no longer flagged as experimental. SHEC trades some additional storage space for faster repair.
    - There is now a unified queue (and thus prioritization) of client IO, recovery, scrubbing, and snapshot trimming.
    - There have been many improvements to low-level repair tooling (ceph-objectstore-tool).
    - The internal ObjectStore API has been significantly cleaned up in order to faciliate new storage backends like NewStore.
- _RGW_:
    - The Swift API now supports object expiration.
    - There are many Swift API compatibility improvements.
- _RBD_:
    - The rbd du command shows actual usage (quickly, when object-map is enabled).
    - The object-map feature has seen many stability improvements.
    - Object-map and exclusive-lock features can be enabled or disabled dynamically.
    - You can now store user metadata and set persistent librbd options associated with individual images.
    - The new deep-flatten features allows flattening of a clone and all of its snapshots. (Previously snapshots could not be flattened.)
    - The export-diff command command is now faster (it uses aio). There is also a new fast-diff feature.
    - The –size argument can be specified with a suffix for units (e.g., \--size 64G).
    - There is a new rbd status command that, for now, shows who has the image open/mapped.
- _CephFS_:
    - You can now rename snapshots.
    - There have been ongoing improvements around administration, diagnostics, and the check and repair tools.
    - The caching and revocation of client cache state due to unused inodes has been dramatically improved.
    - The ceph-fuse client behaves better on 32-bit hosts.

### DISTRO COMPATIBILITY

We have decided to drop support for many older distributions so that we can move to a newer compiler toolchain (e.g., C++11). Although it is still possible to build Ceph on older distributions by installing backported development tools, we are not building and publishing release packages for ceph.com.

In particular,

- CentOS 7 or later; we have dropped support for CentOS 6 (and other RHEL 6 derivatives, like Scientific Linux 6).
- Debian Jessie 8.x or later; Debian Wheezy 7.x’s g++ has incomplete support for C++11 (and no systemd).
- Ubuntu Trusty 14.04 or later; Ubuntu Precise 12.04 is no longer supported.
- Fedora 22 or later.

### UPGRADING FROM FIREFLY

Upgrading directly from Firefly v0.80.z is not possible. All clusters must first upgrade to Hammer v0.94.4 or a later v0.94.z release; only then is it possible to upgrade to Infernalis 9.2.z.

Note that v0.94.4 isn’t released yet, but you can upgrade to a test build from gitbuilder with:

ceph-deploy install --dev hammer HOST

The v0.94.4 Hammer point release will be out before v9.2.0 Infernalis is.

### UPGRADING FROM HAMMER

- For all distributions that support systemd (CentOS 7, Fedora, Debian Jessie 8.x, OpenSUSE), ceph daemons are now managed using native systemd files instead of the legacy sysvinit scripts. For example,:
    
    systemctl start ceph.target       # start all daemons
    systemctl status ceph-osd@12      # check status of osd.12
    
    The main notable distro that is _not_ yet using systemd is Ubuntu trusty 14.04. (The next Ubuntu LTS, 16.04, will use systemd instead of upstart.)
- Ceph daemons now run as user and group ceph by default. The ceph user has a static UID assigned by Fedora and Debian (also used by derivative distributions like RHEL/CentOS and Ubuntu). On SUSE the ceph user will currently get a dynamically assigned UID when the user is created.
    
    If your systems already have a ceph user, upgrading the package will cause problems. We suggest you first remove or rename the existing ‘ceph’ user before upgrading.
    
    When upgrading, administrators have two options:
    
    > 1. Add the following line to ceph.conf on all hosts:
    >     
    >     setuser match path = /var/lib/ceph/$type/$cluster-$id
    >     
    >     This will make the Ceph daemons run as root (i.e., not drop privileges and switch to user ceph) if the daemon’s data directory is still owned by root. Newly deployed daemons will be created with data owned by user ceph and will run with reduced privileges, but upgraded daemons will continue to run as root.
    > 2. Fix the data ownership during the upgrade. This is the preferred option, but is more work. The process for each host would be to:
    >     
    >     1. Upgrade the ceph package. This creates the ceph user and group. For example:
    >         
    >         ceph-deploy install --stable infernalis HOST
    >         
    >     2. Stop the daemon(s).:
    >         
    >         service ceph stop           # fedora, centos, rhel, debian
    >         stop ceph-all               # ubuntu
    >         
    >     3. Fix the ownership:
    >         
    >         chown -R ceph:ceph /var/lib/ceph
    >         
    >     4. Restart the daemon(s).:
    >         
    >         start ceph-all                # ubuntu
    >         systemctl start ceph.target   # debian, centos, fedora, rhel
    >         
    
- The on-disk format for the experimental KeyValueStore OSD backend has changed. You will need to remove any OSDs using that backend before you upgrade any test clusters that use it.
    

### UPGRADE NOTES

- When a pool quota is reached, librados operations now block indefinitely, the same way they do when the cluster fills up. (Previously they would return -ENOSPC). By default, a full cluster or pool will now block. If your librados application can handle ENOSPC or EDQUOT errors gracefully, you can get error returns instead by using the new librados OPERATION\_FULL\_TRY flag.

### NOTABLE CHANGES

NOTE: These notes are somewhat abbreviated while we find a less time-consuming process for generating them.

- build: C++11 now supported
- build: many cmake improvements
- build: OSX build fixes (Yan, Zheng)
- build: remove rest-bench
- ceph-disk: many fixes (Loic Dachary)
- ceph-disk: support for multipath devices (Loic Dachary)
- ceph-fuse: mostly behave on 32-bit hosts (Yan, Zheng)
- ceph-objectstore-tool: many improvements (David Zafman)
- common: bufferlist performance tuning (Piotr Dalek, Sage Weil)
- common: make mutex more efficient
- common: some async compression infrastructure (Haomai Wang)
- librados: add FULL\_TRY and FULL\_FORCE flags for dealing with full clusters or pools (Sage Weil)
- librados: fix notify completion race (#13114 Sage Weil)
- librados, libcephfs: randomize client nonces (Josh Durgin)
- librados: pybind: fix binary omap values (Robin H. Johnson)
- librbd: fix reads larger than the cache size (Lu Shi)
- librbd: metadata filter fixes (Haomai Wang)
- librbd: use write\_full when possible (Zhiqiang Wang)
- mds: avoid emitting cap warnigns before evicting session (John Spray)
- mds: fix expected holes in journal objects (#13167 Yan, Zheng)
- mds: fix SnapServer crash on deleted pool (John Spray)
- mds: many fixes (Yan, Zheng, John Spray, Greg Farnum)
- mon: add cache over MonitorDBStore (Kefu Chai)
- mon: ‘ceph osd metadata’ can dump all osds (Haomai Wang)
- mon: detect kv backend failures (Sage Weil)
- mon: fix CRUSH map test for new pools (Sage Weil)
- mon: fix min\_last\_epoch\_clean tracking (Kefu Chai)
- mon: misc scaling fixes (Sage Weil)
- mon: streamline session handling, fix memory leaks (Sage Weil)
- mon: upgrades must pass through hammer (Sage Weil)
- msg/async: many fixes (Haomai Wang)
- osd: cache proxy-write support (Zhiqiang Wang, Samuel Just)
- osd: configure promotion based on write recency (Zhiqiang Wang)
- osd: don’t send dup MMonGetOSDMap requests (Sage Weil, Kefu Chai)
- osd: erasure-code: fix SHEC floating point bug (#12936 Loic Dachary)
- osd: erasure-code: update to ISA-L 2.14 (Yuan Zhou)
- osd: fix hitset object naming to use GMT (Kefu Chai)
- osd: fix misc memory leaks (Sage Weil)
- osd: fix peek\_queue locking in FileStore (Xinze Chi)
- osd: fix promotion vs full cache tier (Samuel Just)
- osd: fix replay requeue when pg is still activating (#13116 Samuel Just)
- osd: fix scrub stat bugs (Sage Weil, Samuel Just)
- osd: force promotion for ops EC can’t handle (Zhiqiang Wang)
- osd: improve behavior on machines with large memory pages (Steve Capper)
- osd: merge multiple setattr calls into a setattrs call (Xinxin Shu)
- osd: newstore prototype (Sage Weil)
- osd: ObjectStore internal API refactor (Sage Weil)
- osd: SHEC no longer experimental
- osd: throttle evict ops (Yunchuan Wen)
- osd: upgrades must pass through hammer (Sage Weil)
- osd: use SEEK\_HOLE / SEEK\_DATA for sparse copy (Xinxin Shu)
- rbd: rbd-replay-prep and rbd-replay improvements (Jason Dillaman)
- rgw: expose the number of unhealthy workers through admin socket (Guang Yang)
- rgw: fix casing of Content-Type header (Robin H. Johnson)
- rgw: fix decoding of X-Object-Manifest from GET on Swift DLO (Radslow Rzarzynski)
- rgw: fix sysvinit script
- rgw: fix sysvinit script w/ multiple instances (Sage Weil, Pavan Rallabhandi)
- rgw: improve handling of already removed buckets in expirer (Radoslaw Rzarzynski)
- rgw: log to /var/log/ceph instead of /var/log/radosgw
- rgw: rework X-Trans-Id header to be conform with Swift API (Radoslaw Rzarzynski)
- rgw: s3 encoding-type for get bucket (Jeff Weber)
- rgw: set max buckets per user in ceph.conf (Vikhyat Umrao)
- rgw: support for Swift expiration API (Radoslaw Rzarzynski, Yehuda Sadeh)
- rgw: user rm is idempotent (Orit Wasserman)
- selinux policy (Boris Ranto, Milan Broz)
- systemd: many fixes (Sage Weil, Owen Synge, Boris Ranto, Dan van der Ster)
- systemd: run daemons as user ceph
