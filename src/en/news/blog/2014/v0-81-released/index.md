---
title: "v0.81 released"
date: "2014-06-03"
author: "sage"
---

This is the first development release since Firefly. It includes a lot of work that we delayed merging while stabilizing things. Lots of new functionality, as well as several fixes that are baking a bit before getting backported.

### UPGRADING

- CephFS support for the legacy anchor table has finally been removed. Users with file systems created before firefly should ensure that inodes with multiple hard links are modified_prior_ to the upgrade to ensure that the backtraces are written properly. For example:
    
    sudo find /mnt/cephfs -type f -links +1 -exec touch \\{\\} \\;
    
- Disallow nonsensical ‘tier cache-mode’ transitions. From this point onward, ‘writeback’ can only transition to ‘forward’ and ‘forward’ can transition to 1) ‘writeback’ if there are dirty objects, or 2) any if there are no dirty objects.

### NOTABLE CHANGES

- bash completion improvements (Wido den Hollander)
- brag: fixes, improvements (Loic Dachary)
- ceph-disk: handle corrupt volumes (Stuart Longlang)
- ceph-disk: partprobe as needed (Eric Eastman)
- ceph-fuse, libcephfs: asok hooks for handling session resets, timeouts (Yan, Zheng)
- ceph-fuse, libcephfs: improve traceless reply handling (Sage Weil)
- clang build fixes (John Spray, Danny Al-Gaaf)
- config: support G, M, K, etc. suffixes (Joao Eduardo Luis)
- coverity cleanups (Danny Al-Gaaf)
- doc: cache tiering (John Wilkins)
- doc: keystone integration docs (John Wilkins)
- doc: updated simple configuration guides (John Wilkins)
- libcephfs-java: fix gcj-jdk build (Dmitry Smirnov)
- librbd: check error code on cache invalidate (Josh Durgin)
- librbd: new libkrbd library for kernel map/unmap/showmapped (Ilya Dryomov)
- Makefile: fix out of source builds (Stefan Eilemann)
- mds: multi-mds fixes (Yan, Zheng)
- mds: remove legacy anchor table (Yan, Zheng)
- mds: remove legacy discover ino (Yan, Zheng)
- monclient: fix hang (Sage Weil)
- mon: prevent nonsensical cache-mode transitions (Joao Eduardo Luis)
- msgr: avoid big lock when sending (most) messages (Greg Farnum)
- osd: bound osdmap epoch skew between PGs (Sage Weil)
- osd: cache tier flushing fixes for snapped objects (Samuel Just)
- osd: fix agent early finish looping (David Zafman)
- osd: fix flush vs OpContext (Samuel Just)
- osd: fix MarkMeDown and other shutdown races (Sage Weil)
- osd: fix scrub vs cache bugs (Samuel Just)
- osd: fix trim of hitsets (Sage Weil)
- osd, msgr: fast-dispatch of OSD ops (Greg Farnum, Samuel Just)
- osd, objecter: resend ops on last\_force\_op\_resend barrier; fix cache overlay op ordering (Sage Weil)
- osd: remove obsolete classic scrub code (David Zafman)
- osd: scrub PGs with invalid stats (Sage Weil)
- osd: simple snap trimmer throttle (Sage Weil)
- osd: use FIEMAP to inform copy\_range (Haomai Wang)
- rbd-fuse: allow exposing single image (Stephen Taylor)
- rbd-fuse: fix unlink (Josh Durgin)
- removed mkcephfs (deprecated since dumpling)
- rgw: bucket link uses instance id (Yehuda Sadeh)
- rgw: fix memory leak following chunk read error (Yehuda Sadeh)
- rgw: fix URL escaping (Yehuda Sadeh)
- rgw: fix user manifest (Yehuda Sadeh)
- rgw: object and bucket rewrite functions to allow restriping old objects (Yehuda Sadeh)
- rgw: prevent multiobject PUT race (Yehuda Sadeh)
- rgw: send user manifest header (Yehuda Sadeh)
- test\_librbd\_fsx: test krbd as well as librbd (Ilya Dryomov)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.81.tar.gz](http://ceph.com/download/ceph-0.81.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
