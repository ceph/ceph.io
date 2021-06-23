---
title: "v9.2.0 Infernalis released"
date: "2015-11-06"
author: "sage"
---

![Infernalis](images/infernalis-460x148.png)This major release will be the foundation for the next stable series. There have been some major changes since v0.94.x Hammer, and the upgrade process is non-trivial. Please read these release notes carefully.

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

We now build packages for:

- CentOS 7 or later. We have dropped support for CentOS 6 (and other RHEL 6 derivatives, like Scientific Linux 6).
- Debian Jessie 8.x or later. Debian Wheezy 7.x’s g++ has incomplete support for C++11 (and no systemd).
- Ubuntu Trusty 14.04 or later. Ubuntu Precise 12.04 is no longer supported.
- Fedora 22 or later.

### UPGRADING FROM FIREFLY

Upgrading directly from Firefly v0.80.z is not recommended. It is possible to do a direct upgrade, but not without downtime. We recommend that clusters are first upgraded to Hammer v0.94.4 or a later v0.94.z release; only then is it possible to upgrade to Infernalis 9.2.z for an online upgrade (see below).

To do an offline upgrade directly from Firefly, all Firefly OSDs must be stopped and marked down before any Infernalis OSDs will be allowed to start up. This fencing is enforced by the Infernalis monitor, so use an upgrade procedure like:

> 1. Upgrade Ceph on monitor hosts
>     
> 2. Restart all ceph-mon daemons
>     
> 3. Upgrade Ceph on all OSD hosts
>     
> 4. Stop all ceph-osd daemons
>     
> 5. Mark all OSDs down with something like::
>     
>     ceph osd down seq 0 1000
>     
> 6. Start all ceph-osd daemons
>     
> 7. Upgrade and restart remaining daemons (ceph-mds, radosgw)
>     

### UPGRADING FROM HAMMER

- For all distributions that support systemd (CentOS 7, Fedora, Debian Jessie 8.x, OpenSUSE), ceph daemons are now managed using native systemd files instead of the legacy sysvinit scripts. For example,:
    
    systemctl start ceph.target       # start all daemons
    systemctl status ceph-osd@12      # check status of osd.12
    
    The main notable distro that is _not_ yet using systemd is Ubuntu trusty 14.04. (The next Ubuntu LTS, 16.04, will use systemd instead of upstart.)
- Ceph daemons now run as user and group ceph by default. The ceph user has a static UID assigned by Fedora and Debian (also used by derivative distributions like RHEL/CentOS and Ubuntu). On SUSE the ceph user will currently get a dynamically assigned UID when the user is created.
    
    If your systems already have a ceph user, upgrading the package will cause problems. We suggest you first remove or rename the existing ‘ceph’ user and ‘ceph’ group before upgrading.
    
    When upgrading, administrators have two options:
    
    > 1. Add the following line to ceph.conf on all hosts:
    >     
    >     setuser match path = /var/lib/ceph/$type/$cluster-$id
    >     
    >     This will make the Ceph daemons run as root (i.e., not drop privileges and switch to user ceph) if the daemon’s data directory is still owned by root. Newly deployed daemons will be created with data owned by user ceph and will run with reduced privileges, but upgraded daemons will continue to run as root.
    > 2. Fix the data ownership during the upgrade. This is the preferred option, but it is more work and can be very time consuming. The process for each host is to:
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
    >     
    >     Alternatively, the same process can be done with a single daemon type, for example by stopping only monitors and chowning only /var/lib/ceph/mon.
    
- The on-disk format for the experimental KeyValueStore OSD backend has changed. You will need to remove any OSDs using that backend before you upgrade any test clusters that use it.
    
- When a pool quota is reached, librados operations now block indefinitely, the same way they do when the cluster fills up. (Previously they would return -ENOSPC). By default, a full cluster or pool will now block. If your librados application can handle ENOSPC or EDQUOT errors gracefully, you can get error returns instead by using the new librados OPERATION\_FULL\_TRY flag.
    
- The return code for librbd’s rbd\_aio\_read and Image::aio\_read API methods no longer returns the number of bytes read upon success. Instead, it returns 0 upon success and a negative value upon failure.
    
- ‘ceph scrub’, ‘ceph compact’ and ‘ceph sync force are now DEPRECATED. Users should instead use ‘ceph mon scrub’, ‘ceph mon compact’ and ‘ceph mon sync force’.
    
- ‘ceph mon\_metadata’ should now be used as ‘ceph mon metadata’. There is no need to deprecate this command (same major release since it was first introduced).
    
- The –dump-json option of “osdmaptool” is replaced by –dump json.
    
- The commands of “pg ls-by-{pool,primary,osd}” and “pg ls” now take “recovering” instead of “recovery”, to include the recovering pgs in the listed pgs.
    

### NOTABLE CHANGES SINCE HAMMER

- aarch64: add optimized version of crc32c (Yazen Ghannam, Steve Capper)
- auth: cache/reuse crypto lib key objects, optimize msg signature check (Sage Weil)
- auth: reinit NSS after fork() (#11128 Yan, Zheng)
- autotools: fix out of tree build (Krxysztof Kosinski)
- autotools: improve make check output (Loic Dachary)
- buffer: add invalidate\_crc() (Piotr Dalek)
- buffer: fix zero bug (#12252 Haomai Wang)
- buffer: some cleanup (Michal Jarzabek)
- build: allow tcmalloc-minimal (Thorsten Behrens)
- build: C++11 now supported
- build: cmake: fix nss linking (Danny Al-Gaaf)
- build: cmake: misc fixes (Orit Wasserman, Casey Bodley)
- build: disable LTTNG by default (#11333 Josh Durgin)
- build: do not build ceph-dencoder with tcmalloc (#10691 Boris Ranto)
- build: fix junit detection on Fedora 22 (Ira Cooper)
- build: fix pg ref disabling (William A. Kennington III)
- build: fix ppc build (James Page)
- build: install-deps: misc fixes (Loic Dachary)
- build: install-deps.sh improvements (Loic Dachary)
- build: install-deps: support OpenSUSE (Loic Dachary)
- build: make\_dist\_tarball.sh (Sage Weil)
- build: many cmake improvements
- build: misc cmake fixes (Matt Benjamin)
- build: misc fixes (Boris Ranto, Ken Dreyer, Owen Synge)
- build: OSX build fixes (Yan, Zheng)
- build: remove rest-bench
- ceph-authtool: fix return code on error (Gerhard Muntingh)
- ceph-detect-init: added Linux Mint (Michal Jarzabek)
- ceph-detect-init: robust init system detection (Owen Synge)
- ceph-disk: ensure ‘zap’ only operates on a full disk (#11272 Loic Dachary)
- ceph-disk: fix zap sgdisk invocation (Owen Synge, Thorsten Behrens)
- ceph-disk: follow ceph-osd hints when creating journal (#9580 Sage Weil)
- ceph-disk: handle re-using existing partition (#10987 Loic Dachary)
- ceph-disk: improve parted output parsing (#10983 Loic Dachary)
- ceph-disk: install pip > 6.1 (#11952 Loic Dachary)
- ceph-disk: make suppression work for activate-all and activate-journal (Dan van der Ster)
- ceph-disk: many fixes (Loic Dachary, Alfredo Deza)
- ceph-disk: fixes to respect init system (Loic Dachary, Owen Synge)
- ceph-disk: pass –cluster arg on prepare subcommand (Kefu Chai)
- ceph-disk: support for multipath devices (Loic Dachary)
- ceph-disk: support NVMe device partitions (#11612 Ilja Slepnev)
- ceph: fix ‘df’ units (Zhe Zhang)
- ceph: fix parsing in interactive cli mode (#11279 Kefu Chai)
- cephfs-data-scan: many additions, improvements (John Spray)
- ceph-fuse: do not require successful remount when unmounting (#10982 Greg Farnum)
- ceph-fuse, libcephfs: don’t clear COMPLETE when trimming null (Yan, Zheng)
- ceph-fuse, libcephfs: drop inode when rmdir finishes (#11339 Yan, Zheng)
- ceph-fuse,libcephfs: fix uninline (#11356 Yan, Zheng)
- ceph-fuse, libcephfs: hold exclusive caps on dirs we “own” (#11226 Greg Farnum)
- ceph-fuse: mostly behave on 32-bit hosts (Yan, Zheng)
- ceph: improve error output for ‘tell’ (#11101 Kefu Chai)
- ceph-monstore-tool: fix store-copy (Huangjun)
- ceph: new ‘ceph daemonperf’ command (John Spray, Mykola Golub)
- ceph-objectstore-tool: many many improvements (David Zafman)
- ceph-objectstore-tool: refactoring and cleanup (John Spray)
- ceph-post-file: misc fixes (Joey McDonald, Sage Weil)
- ceph\_test\_rados: test pipelined reads (Zhiqiang Wang)
- client: avoid sending unnecessary FLUSHSNAP messages (Yan, Zheng)
- client: exclude setfilelock when calculating oldest tid (Yan, Zheng)
- client: fix error handling in check\_pool\_perm (John Spray)
- client: fsync waits only for inode’s caps to flush (Yan, Zheng)
- client: invalidate kernel dcache when cache size exceeds limits (Yan, Zheng)
- client: make fsync wait for unsafe dir operations (Yan, Zheng)
- client: pin lookup dentry to avoid inode being freed (Yan, Zheng)
- common: add descriptions to perfcounters (Kiseleva Alyona)
- common: add perf counter descriptions (Alyona Kiseleva)
- common: bufferlist performance tuning (Piotr Dalek, Sage Weil)
- common: detect overflow of int config values (#11484 Kefu Chai)
- common: fix bit\_vector extent calc (#12611 Jason Dillaman)
- common: fix json parsing of utf8 (#7387 Tim Serong)
- common: fix leak of pthread\_mutexattr (#11762 Ketor Meng)
- common: fix LTTNG vs fork issue (Josh Durgin)
- common: fix throttle max change (Henry Chang)
- common: make mutex more efficient
- common: make work queue addition/removal thread safe (#12662 Jason Dillaman)
- common: optracker improvements (Zhiqiang Wang, Jianpeng Ma)
- common: PriorityQueue tests (Kefu Chai)
- common: some async compression infrastructure (Haomai Wang)
- crush: add –check to validate dangling names, max osd id (Kefu Chai)
- crush: cleanup, sync with kernel (Ilya Dryomov)
- crush: fix crash from invalid ‘take’ argument (#11602 Shiva Rkreddy, Sage Weil)
- crush: fix divide-by-2 in straw2 (#11357 Yann Dupont, Sage Weil)
- crush: fix has\_v4\_buckets (#11364 Sage Weil)
- crush: fix subtree base weight on adjust\_subtree\_weight (#11855 Sage Weil)
- crush: respect default replicated ruleset config on map creation (Ilya Dryomov)
- crushtool: fix order of operations, usage (Sage Weil)
- crypto: fix NSS leak (Jason Dillaman)
- crypto: fix unbalanced init/shutdown (#12598 Zheng Yan)
- deb: fix rest-bench-dbg and ceph-test-dbg dependendies (Ken Dreyer)
- debian: minor package reorg (Ken Dreyer)
- deb, rpm: move ceph-objectstore-tool to ceph (Ken Dreyer)
- doc: docuemnt object corpus generation (#11099 Alexis Normand)
- doc: document region hostnames (Robin H. Johnson)
- doc: fix gender neutrality (Alexandre Maragone)
- doc: fix install doc (#10957 Kefu Chai)
- doc: fix sphinx issues (Kefu Chai)
- doc: man page updates (Kefu Chai)
- doc: mds data structure docs (Yan, Zheng)
- doc: misc updates (Fracois Lafont, Ken Dreyer, Kefu Chai, Owen Synge, Gael Fenet-Garde, Loic Dachary, Yannick Atchy-Dalama, Jiaying Ren, Kevin Caradant, Robert Maxime, Nicolas Yong, Germain Chipaux, Arthur Gorjux, Gabriel Sentucq, Clement Lebrun, Jean-Remi Deveaux, Clair Massot, Robin Tang, Thomas Laumondais, Jordan Dorne, Yuan Zhou, Valentin Thomas, Pierre Chaumont, Benjamin Troquereau, Benjamin Sesia, Vikhyat Umrao, Nilamdyuti Goswami, Vartika Rai, Florian Haas, Loic Dachary, Simon Guinot, Andy Allan, Alistair Israel, Ken Dreyer, Robin Rehu, Lee Revell, Florian Marsylle, Thomas Johnson, Bosse Klykken, Travis Rhoden, Ian Kelling)
- doc: swift tempurls (#10184 Abhishek Lekshmanan)
- doc: switch doxygen integration back to breathe (#6115 Kefu Chai)
- doc: update release schedule docs (Loic Dachary)
- erasure-code: cleanup (Kefu Chai)
- erasure-code: improve tests (Loic Dachary)
- erasure-code: shec: fix recovery bugs (Takanori Nakao, Shotaro Kawaguchi)
- erasure-code: update ISA-L to 2.13 (Yuan Zhou)
- gmock: switch to submodule (Danny Al-Gaaf, Loic Dachary)
- hadoop: add terasort test (Noah Watkins)
- init-radosgw: merge with sysv version; fix enumeration (Sage Weil)
- java: fix libcephfs bindings (Noah Watkins)
- libcephfs: add pread, pwrite (Jevon Qiao)
- libcephfs,ceph-fuse: cache cleanup (Zheng Yan)
- libcephfs,ceph-fuse: fix request resend on cap reconnect (#10912 Yan, Zheng)
- librados: add config observer (Alistair Strachan)
- librados: add FULL\_TRY and FULL\_FORCE flags for dealing with full clusters or pools (Sage Weil)
- librados: add src\_fadvise\_flags for copy-from (Jianpeng Ma)
- librados: define C++ flags from C constants (Josh Durgin)
- librados: fadvise flags per op (Jianpeng Ma)
- librados: fix last\_force\_resent handling (#11026 Jianpeng Ma)
- librados: fix memory leak from C\_TwoContexts (Xiong Yiliang)
- librados: fix notify completion race (#13114 Sage Weil)
- librados: fix striper when stripe\_count = 1 and stripe\_unit != object\_size (#11120 Yan, Zheng)
- librados, libcephfs: randomize client nonces (Josh Durgin)
- librados: op perf counters (John Spray)
- librados: pybind: fix binary omap values (Robin H. Johnson)
- librados: pybind: fix write() method return code (Javier Guerra)
- librados: respect default\_crush\_ruleset on pool\_create (#11640 Yuan Zhou)
- libradosstriper: fix leak (Danny Al-Gaaf)
- librbd: add const for single-client-only features (Josh Durgin)
- librbd: add deep-flatten operation (Jason Dillaman)
- librbd: add purge\_on\_error cache behavior (Jianpeng Ma)
- librbd: allow additional metadata to be stored with the image (Haomai Wang)
- librbd: avoid blocking aio API methods (#11056 Jason Dillaman)
- librbd: better handling for dup flatten requests (#11370 Jason Dillaman)
- librbd: cancel in-flight ops on watch error (#11363 Jason Dillaman)
- librbd: default new images to format 2 (#11348 Jason Dillaman)
- librbd: fadvise for copy, export, import (Jianpeng Ma)
- librbd: fast diff implementation that leverages object map (Jason Dillaman)
- librbd: fix fast diff bugs (#11553 Jason Dillaman)
- librbd: fix image format detection (Zhiqiang Wang)
- librbd: fix lock ordering issue (#11577 Jason Dillaman)
- librbd: fix reads larger than the cache size (Lu Shi)
- librbd: fix snapshot creation when other snap is active (#11475 Jason Dillaman)
- librbd: flatten/copyup fixes (Jason Dillaman)
- librbd: handle NOCACHE fadvise flag (Jinapeng Ma)
- librbd: lockdep, helgrind validation (Jason Dillaman, Josh Durgin)
- librbd: metadata filter fixes (Haomai Wang)
- librbd: misc aio fixes (#5488 Jason Dillaman)
- librbd: misc rbd fixes (#11478 #11113 #11342 #11380 Jason Dillaman, Zhiqiang Wang)
- librbd: new diff\_iterate2 API (Jason Dillaman)
- librbd: object map rebuild support (Jason Dillaman)
- librbd: only update image flags while hold exclusive lock (#11791 Jason Dillaman)
- librbd: optionally disable allocation hint (Haomai Wang)
- librbd: prevent race between resize requests (#12664 Jason Dillaman)
- librbd: readahead fixes (Zhiqiang Wang)
- librbd: return result code from close (#12069 Jason Dillaman)
- librbd: store metadata, including config options, in image (Haomai Wang)
- librbd: tolerate old osds when getting image metadata (#11549 Jason Dillaman)
- librbd: use write\_full when possible (Zhiqiang Wang)
- log: fix data corruption race resulting from log rotation (#12465 Samuel Just)
- logrotate.d: prefer service over invoke-rc.d (#11330 Win Hierman, Sage Weil)
- mds: add ‘damaged’ state to MDSMap (John Spray)
- mds: add nicknames for perfcounters (John Spray)
- mds: avoid emitting cap warnigns before evicting session (John Spray)
- mds: avoid getting stuck in XLOCKDONE (#11254 Yan, Zheng)
- mds: disable problematic rstat propagation into snap parents (Yan, Zheng)
- mds: do not add snapped items to bloom filter (Yan, Zheng)
- mds: expose frags via asok (John Spray)
- mds: fix expected holes in journal objects (#13167 Yan, Zheng)
- mds: fix handling for missing mydir dirfrag (#11641 John Spray)
- mds: fix integer truncateion on large client ids (Henry Chang)
- mds: fix mydir replica issue with shutdown (#10743 John Spray)
- mds: fix out-of-order messages (#11258 Yan, Zheng)
- mds: fix rejoin (Yan, Zheng)
- mds: fix setting entire file layout in one setxattr (John Spray)
- mds: fix shutdown (John Spray)
- mds: fix shutdown with strays (#10744 John Spray)
- mds: fix SnapServer crash on deleted pool (John Spray)
- mds: fix snapshot bugs (Yan, Zheng)
- mds: fix stray reintegration (Yan, Zheng)
- mds: fix stray handling (John Spray)
- mds: fix suicide beacon (John Spray)
- mds: flush immediately in do\_open\_truncate (#11011 John Spray)
- mds: handle misc corruption issues (John Spray)
- mds: improve dump methods (John Spray)
- mds: many fixes (Yan, Zheng, John Spray, Greg Farnum)
- mds: many snapshot and stray fixes (Yan, Zheng)
- mds: misc fixes (Jianpeng Ma, Dan van der Ster, Zhang Zhi)
- mds: misc journal cleanups and fixes (#10368 John Spray)
- mds: misc repair improvements (John Spray)
- mds: misc snap fixes (Zheng Yan)
- mds: misc snapshot fixes (Yan, Zheng)
- mds: new SessionMap storage using omap (#10649 John Spray)
- mds: persist completed\_requests reliably (#11048 John Spray)
- mds: reduce memory consumption (Yan, Zheng)
- mds: respawn instead of suicide on blacklist (John Spray)
- mds: separate safe\_pos in Journaler (#10368 John Spray)
- mds: snapshot rename support (#3645 Yan, Zheng)
- mds: store layout on header object (#4161 John Spray)
- mds: throttle purge stray operations (#10390 John Spray)
- mds: tolerate clock jumping backwards (#11053 Yan, Zheng)
- mds: warn when clients fail to advance oldest\_client\_tid (#10657 Yan, Zheng)
- misc cleanups and fixes (Danny Al-Gaaf)
- misc coverity fixes (Danny Al-Gaaf)
- misc performance and cleanup (Nathan Cutler, Xinxin Shu)
- mon: add cache over MonitorDBStore (Kefu Chai)
- mon: add ‘mon\_metadata <id>’ command (Kefu Chai)
- mon: add ‘node ls ...’ command (Kefu Chai)
- mon: add NOFORWARD, OBSOLETE, DEPRECATE flags for mon commands (Joao Eduardo Luis)
- mon: add PG count to ‘ceph osd df’ output (Michal Jarzabek)
- mon: ‘ceph osd metadata’ can dump all osds (Haomai Wang)
- mon: clean up, reorg some mon commands (Joao Eduardo Luis)
- monclient: flush\_log (John Spray)
- mon: detect kv backend failures (Sage Weil)
- mon: disallow >2 tiers (#11840 Kefu Chai)
- mon: disallow ec pools as tiers (#11650 Samuel Just)
- mon: do not deactivate last mds (#10862 John Spray)
- mon: fix average utilization calc for ‘osd df’ (Mykola Golub)
- mon: fix CRUSH map test for new pools (Sage Weil)
- mon: fix log dump crash when debugging (Mykola Golub)
- mon: fix mds beacon replies (#11590 Kefu Chai)
- mon: fix metadata update race (Mykola Golub)
- mon: fix min\_last\_epoch\_clean tracking (Kefu Chai)
- mon: fix ‘pg ls’ sort order, state names (#11569 Kefu Chai)
- mon: fix refresh (#11470 Joao Eduardo Luis)
- mon: fix variance calc in ‘osd df’ (Sage Weil)
- mon: improve callout to crushtool (Mykola Golub)
- mon: make blocked op messages more readable (Jianpeng Ma)
- mon: make osd get pool ‘all’ only return applicable fields (#10891 Michal Jarzabek)
- mon: misc scaling fixes (Sage Weil)
- mon: normalize erasure-code profile for storage and comparison (Loic Dachary)
- mon: only send mon metadata to supporting peers (Sage Weil)
- mon: optionally specify osd id on ‘osd create’ (Mykola Golub)
- mon: ‘osd tree’ fixes (Kefu Chai)
- mon: periodic background scrub (Joao Eduardo Luis)
- mon: prevent bucket deletion when referenced by a crush rule (#11602 Sage Weil)
- mon: prevent pgp\_num > pg\_num (#12025 Xinxin Shu)
- mon: prevent pool with snapshot state from being used as a tier (#11493 Sage Weil)
- mon: prime pg\_temp when CRUSH map changes (Sage Weil)
- mon: refine check\_remove\_tier checks (#11504 John Spray)
- mon: reject large max\_mds values (#12222 John Spray)
- mon: remove spurious who arg from ‘mds rm ...’ (John Spray)
- mon: streamline session handling, fix memory leaks (Sage Weil)
- mon: upgrades must pass through hammer (Sage Weil)
- mon: warn on bogus cache tier config (Jianpeng Ma)
- msgr: add ceph\_perf\_msgr tool (Hoamai Wang)
- msgr: async: fix seq handling (Haomai Wang)
- msgr: async: many many fixes (Haomai Wang)
- msgr: simple: fix clear\_pipe (#11381 Haomai Wang)
- msgr: simple: fix connect\_seq assert (Haomai Wang)
- msgr: xio: fastpath improvements (Raju Kurunkad)
- msgr: xio: fix ip and nonce (Raju Kurunkad)
- msgr: xio: improve lane assignment (Vu Pham)
- msgr: xio: sync with accellio v1.4 (Vu Pham)
- msgr: xio: misc fixes (#10735 Matt Benjamin, Kefu Chai, Danny Al-Gaaf, Raju Kurunkad, Vu Pham, Casey Bodley)
- msg: unit tests (Haomai Wang)
- objectcacher: misc bug fixes (Jianpeng Ma)
- osd: add latency perf counters for tier operations (Xinze Chi)
- osd: add misc perfcounters (Xinze Chi)
- osd: add simple sleep injection in recovery (Sage Weil)
- osd: allow SEEK\_HOLE/SEEK\_DATA for sparse read (Zhiqiang Wang)
- osd: avoid dup omap sets for in pg metadata (Sage Weil)
- osd: avoid multiple hit set insertions (Zhiqiang Wang)
- osd: avoid transaction append in some cases (Sage Weil)
- osd: break PG removal into multiple iterations (#10198 Guang Yang)
- osd: cache proxy-write support (Zhiqiang Wang, Samuel Just)
- osd: check scrub state when handling map (Jianpeng Ma)
- osd: clean up some constness, privateness (Kefu Chai)
- osd: clean up temp object if promotion fails (Jianpeng Ma)
- osd: configure promotion based on write recency (Zhiqiang Wang)
- osd: constrain collections to meta and PGs (normal and temp) (Sage Weil)
- osd: don’t send dup MMonGetOSDMap requests (Sage Weil, Kefu Chai)
- osd: EIO injection (David Zhang)
- osd: elminiate txn apend, ECSubWrite copy (Samuel Just)
- osd: erasure-code: drop entries according to LRU (Andreas-Joachim Peters)
- osd: erasure-code: fix SHEC floating point bug (#12936 Loic Dachary)
- osd: erasure-code: update to ISA-L 2.14 (Yuan Zhou)
- osd: filejournal: cleanup (David Zafman)
- osd: filestore: clone using splice (Jianpeng Ma)
- osd: filestore: fix recursive lock (Xinxin Shu)
- osd: fix check\_for\_full (Henry Chang)
- osd: fix dirty accounting in make\_writeable (Zhiqiang Wang)
- osd: fix dup promotion lost op bug (Zhiqiang Wang)
- osd: fix endless repair when object is unrecoverable (Jianpeng Ma, Kefu Chai)
- osd: fix hitset object naming to use GMT (Kefu Chai)
- osd: fix misc memory leaks (Sage Weil)
- osd: fix negative degraded stats during backfill (Guang Yang)
- osd: fix osdmap dump of blacklist items (John Spray)
- osd: fix peek\_queue locking in FileStore (Xinze Chi)
- osd: fix pg resurrection (#11429 Samuel Just)
- osd: fix promotion vs full cache tier (Samuel Just)
- osd: fix replay requeue when pg is still activating (#13116 Samuel Just)
- osd: fix scrub stat bugs (Sage Weil, Samuel Just)
- osd: fix snap flushing from cache tier (again) (#11787 Samuel Just)
- osd: fix snap handling on promotion (#11296 Sam Just)
- osd: fix temp-clearing (David Zafman)
- osd: force promotion for ops EC can’t handle (Zhiqiang Wang)
- osd: handle log split with overlapping entries (#11358 Samuel Just)
- osd: ignore non-existent osds in unfound calc (#10976 Mykola Golub)
- osd: improve behavior on machines with large memory pages (Steve Capper)
- osd: include a temp namespace within each collection/pgid (Sage Weil)
- osd: increase default max open files (Owen Synge)
- osd: keyvaluestore: misc fixes (Varada Kari)
- osd: low and high speed flush modes (Mingxin Liu)
- osd: make suicide timeouts individually configurable (Samuel Just)
- osd: merge multiple setattr calls into a setattrs call (Xinxin Shu)
- osd: misc fixes (Ning Yao, Kefu Chai, Xinze Chi, Zhiqiang Wang, Jianpeng Ma)
- osd: move scrub in OpWQ (Samuel Just)
- osd: newstore prototype (Sage Weil)
- osd: ObjectStore internal API refactor (Sage Weil)
- osd: peer\_features includes self (David Zafman)
- osd: pool size change triggers new interval (#11771 Samuel Just)
- osd: prepopulate needs\_recovery\_map when only one peer has missing (#9558 Guang Yang)
- osd: randomize scrub times (#10973 Kefu Chai)
- osd: recovery, peering fixes (#11687 Samuel Just)
- osd: refactor scrub and digest recording (Sage Weil)
- osd: refuse first write to EC object at non-zero offset (Jianpeng Ma)
- osd: relax reply order on proxy read (#11211 Zhiqiang Wang)
- osd: require firefly features (David Zafman)
- osd: set initial crush weight with more precision (Sage Weil)
- osd: SHEC no longer experimental
- osd: skip promotion for flush/evict op (Zhiqiang Wang)
- osd: stripe over small xattrs to fit in XFS’s 255 byte inline limit (Sage Weil, Ning Yao)
- osd: sync object\_map on syncfs (Samuel Just)
- osd: take excl lock of op is rw (Samuel Just)
- osd: throttle evict ops (Yunchuan Wen)
- osd: upgrades must pass through hammer (Sage Weil)
- osd: use a temp object for recovery (Sage Weil)
- osd: use blkid to collection partition information (Joseph Handzik)
- osd: use SEEK\_HOLE / SEEK\_DATA for sparse copy (Xinxin Shu)
- osd: WBThrottle cleanups (Jianpeng Ma)
- osd: write journal header on clean shutdown (Xinze Chi)
- osdc/Objecter: allow per-pool calls to op\_cancel\_writes (John Spray)
- os/filestore: enlarge getxattr buffer size (Jianpeng Ma)
- pybind: pep8 cleanups (Danny Al-Gaaf)
- pycephfs: many fixes for bindings (Haomai Wang)
- qa: fix filelock\_interrupt.py test (Yan, Zheng)
- qa: improve ceph-disk tests (Loic Dachary)
- qa: improve docker build layers (Loic Dachary)
- qa: run-make-check.sh script (Loic Dachary)
- rados: add –striper option to use libradosstriper (#10759 Sebastien Ponce)
- rados: bench: add –no-verify option to improve performance (Piotr Dalek)
- rados bench: misc fixes (Dmitry Yatsushkevich)
- rados: fix error message on failed pool removal (Wido den Hollander)
- radosgw-admin: add ‘bucket check’ function to repair bucket index (Yehuda Sadeh)
- radosgw-admin: fix subuser modify output (#12286 Guce)
- rados: handle –snapid arg properly (Abhishek Lekshmanan)
- rados: improve bench buffer handling, performance (Piotr Dalek)
- rados: misc bench fixes (Dmitry Yatsushkevich)
- rados: new pool import implementation (John Spray)
- rados: translate errno to string in CLI (#10877 Kefu Chai)
- rbd: accept map options config option (Ilya Dryomov)
- rbd: add disk usage tool (#7746 Jason Dillaman)
- rbd: allow unmapping by spec (Ilya Dryomov)
- rbd: cli: fix arg parsing with –io-pattern (Dmitry Yatsushkevich)
- rbd: deprecate –new-format option (Jason Dillman)
- rbd: fix error messages (#2862 Rajesh Nambiar)
- rbd: fix link issues (Jason Dillaman)
- rbd: improve CLI arg parsing, usage (Ilya Dryomov)
- rbd: rbd-replay-prep and rbd-replay improvements (Jason Dillaman)
- rbd: recognize queue\_depth kernel option (Ilya Dryomov)
- rbd: support G and T units for CLI (Abhishek Lekshmanan)
- rbd: update rbd man page (Ilya Dryomov)
- rbd: update xfstests tests (Douglas Fuller)
- rbd: use image-spec and snap-spec in help (Vikhyat Umrao, Ilya Dryomov)
- rest-bench: misc fixes (Shawn Chen)
- rest-bench: support https (#3968 Yuan Zhou)
- rgw: add max multipart upload parts (#12146 Abshishek Dixit)
- rgw: add missing headers to Swift container details (#10666 Ahmad Faheem, Dmytro Iurchenko)
- rgw: add stats to headers for account GET (#10684 Yuan Zhou)
- rgw: add Trasnaction-Id to response (Abhishek Dixit)
- rgw: add X-Timestamp for Swift containers (#10938 Radoslaw Zarzynski)
- rgw: always check if token is expired (#11367 Anton Aksola, Riku Lehto)
- rgw: conversion tool to repair broken multipart objects (#12079 Yehuda Sadeh)
- rgw: document layout of pools and objects (Pete Zaitcev)
- rgw: do not enclose bucket header in quotes (#11860 Wido den Hollander)
- rgw: do not prefetch data for HEAD requests (Guang Yang)
- rgw: do not preserve ACLs when copying object (#12370 Yehuda Sadeh)
- rgw: do not set content-type if length is 0 (#11091 Orit Wasserman)
- rgw: don’t clobber bucket/object owner when setting ACLs (#10978 Yehuda Sadeh)
- rgw: don’t use end\_marker for namespaced object listing (#11437 Yehuda Sadeh)
- rgw: don’t use rgw\_socket\_path if frontend is configured (#11160 Yehuda Sadeh)
- rgw: enforce Content-Length for POST on Swift cont/obj (#10661 Radoslaw Zarzynski)
- rgw: error out if frontend did not send all data (#11851 Yehuda Sadeh)
- rgw: expose the number of unhealthy workers through admin socket (Guang Yang)
- rgw: fail if parts not specified on multipart upload (#11435 Yehuda Sadeh)
- rgw: fix assignment of copy obj attributes (#11563 Yehuda Sadeh)
- rgw: fix broken stats in container listing (#11285 Radoslaw Zarzynski)
- rgw: fix bug in domain/subdomain splitting (Robin H. Johnson)
- rgw: fix casing of Content-Type header (Robin H. Johnson)
- rgw: fix civetweb max threads (#10243 Yehuda Sadeh)
- rgw: fix Connection: header handling (#12298 Wido den Hollander)
- rgw: fix copy metadata, support X-Copied-From for swift (#10663 Radoslaw Zarzynski)
- rgw: fix data corruptions race condition (#11749 Wuxingyi)
- rgw: fix decoding of X-Object-Manifest from GET on Swift DLO (Radslow Rzarzynski)
- rgw: fix GET on swift account when limit == 0 (#10683 Radoslaw Zarzynski)
- rgw: fix handling empty metadata items on Swift container (#11088 Radoslaw Zarzynski)
- rgw: fix JSON response when getting user quota (#12117 Wuxingyi)
- rgw: fix locator for objects starting with \_ (#11442 Yehuda Sadeh)
- rgw: fix log rotation (Wuxingyi)
- rgw: fix mulitipart upload in retry path (#11604 Yehuda Sadeh)
- rgw: fix quota enforcement on POST (#11323 Sergey Arkhipov)
- rgw: fix reset\_loc (#11974 Yehuda Sadeh)
- rgw: fix return code on missing upload (#11436 Yehuda Sadeh)
- rgw: fix sysvinit script
- rgw: fix sysvinit script w/ multiple instances (Sage Weil, Pavan Rallabhandi)
- rgw: force content\_type for swift bucket stats requests (#12095 Orit Wasserman)
- rgw: force content type header on responses with no body (#11438 Orit Wasserman)
- rgw: generate Date header for civetweb (#10873 Radoslaw Zarzynski)
- rgw: generate new object tag when setting attrs (#11256 Yehuda Sadeh)
- rgw: improve content-length env var handling (#11419 Robin H. Johnson)
- rgw: improved support for swift account metadata (Radoslaw Zarzynski)
- rgw: improve handling of already removed buckets in expirer (Radoslaw Rzarzynski)
- rgw: issue aio for first chunk before flush cached data (#11322 Guang Yang)
- rgw: log to /var/log/ceph instead of /var/log/radosgw
- rgw: make init script wait for radosgw to stop (#11140 Dmitry Yatsushkevich)
- rgw: make max put size configurable (#6999 Yuan Zhou)
- rgw: make quota/gc threads configurable (#11047 Guang Yang)
- rgw: make read user buckets backward compat (#10683 Radoslaw Zarzynski)
- rgw: merge manifests properly with prefix override (#11622 Yehuda Sadeh)
- rgw: only scan for objects not in a namespace (#11984 Yehuda Sadeh)
- rgw: orphan detection tool (Yehuda Sadeh)
- rgw: pass in civetweb configurables (#10907 Yehuda Sadeh)
- rgw: rectify 202 Accepted in PUT response (#11148 Radoslaw Zarzynski)
- rgw: remove meta file after deleting bucket (#11149 Orit Wasserman)
- rgw: remove trailing :port from HTTP\_HOST header (Sage Weil)
- rgw: return 412 on bad limit when listing buckets (#11613 Yehuda Sadeh)
- rgw: rework X-Trans-Id header to conform with Swift API (Radoslaw Rzarzynski)
- rgw: s3 encoding-type for get bucket (Jeff Weber)
- rgw: send ETag, Last-Modified for swift (#11087 Radoslaw Zarzynski)
- rgw: set content length on container GET, PUT, DELETE, HEAD (#10971, #11036 Radoslaw Zarzynski)
- rgw: set max buckets per user in ceph.conf (Vikhyat Umrao)
- rgw: shard work over multiple librados instances (Pavan Rallabhandi)
- rgw: support end marker on swift container GET (#10682 Radoslaw Zarzynski)
- rgw: support for Swift expiration API (Radoslaw Rzarzynski, Yehuda Sadeh)
- rgw: swift: allow setting attributes with COPY (#10662 Ahmad Faheem, Dmytro Iurchenko)
- rgw: swift: do not override sent content type (#12363 Orit Wasserman)
- rgw: swift: enforce Content-Type in response (#12157 Radoslaw Zarzynski)
- rgw: swift: fix account listing (#11501 Radoslaw Zarzynski)
- rgw: swift: fix metadata handling on copy (#10645 Radoslaw Zarzynski)
- rgw: swift: send Last-Modified header (#10650 Radoslaw Zarzynski)
- rgw: swift: set Content-Length for account GET (#12158 Radoslav Zarzynski)
- rgw: swift: set content-length on keystone tokens (#11473 Herv Rousseau)
- rgw: update keystone cache with token info (#11125 Yehuda Sadeh)
- rgw: update to latest civetweb, enable config for IPv6 (#10965 Yehuda Sadeh)
- rgw: use attrs from source bucket on copy (#11639 Javier M. Mellid)
- rgw: use correct oid for gc chains (#11447 Yehuda Sadeh)
- rgw: user rm is idempotent (Orit Wasserman)
- rgw: use unique request id for civetweb (#10295 Orit Wasserman)
- rocksdb: add perf counters for get/put latency (Xinxin Shu)
- rocksdb, leveldb: fix compact\_on\_mount (Xiaoxi Chen)
- rocksdb: pass options as single string (Xiaoxi Chen)
- rocksdb: update to latest (Xiaoxi Chen)
- rpm: add suse firewall files (Tim Serong)
- rpm: always rebuild and install man pages for rpm (Owen Synge)
- rpm: loosen ceph-test dependencies (Ken Dreyer)
- rpm: many spec file fixes (Owen Synge, Ken Dreyer)
- rpm: misc fixes (Boris Ranto, Owen Synge, Ken Dreyer, Ira Cooper)
- rpm: misc systemd and SUSE fixes (Owen Synge, Nathan Cutler)
- selinux policy (Boris Ranto, Milan Broz)
- systemd: logrotate fixes (Tim Serong, Lars Marowsky-Bree, Nathan Cutler)
- systemd: many fixes (Sage Weil, Owen Synge, Boris Ranto, Dan van der Ster)
- systemd: run daemons as user ceph
- sysvinit compat: misc fixes (Owen Synge)
- test: misc fs test improvements (John Spray, Loic Dachary)
- test: python tests, linter cleanup (Alfredo Deza)
- tests: fixes for rbd xstests (Douglas Fuller)
- tests: fix tiering health checks (Loic Dachary)
- tests for low-level performance (Haomai Wang)
- tests: many ec non-regression improvements (Loic Dachary)
- tests: many many ec test improvements (Loic Dachary)
- upstart: throttle restarts (#11798 Sage Weil, Greg Farnum)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-9.2.0.tar.gz](http://ceph.com/download/ceph-9.2.0.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
