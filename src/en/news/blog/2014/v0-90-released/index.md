---
title: "v0.90 released"
date: "2014-12-19"
author: "sage"
---

This is the last development release before Christmas. There are some API cleanups for librados and librbd, and lots of bug fixes across the board for the OSD, MDS, RGW, and CRUSH. The OSD also gets support for discard (potentially helpful on SSDs, although it is off by default), and there are several improvements to ceph-disk.

The next two development releases will be getting a slew of new functionality for hammer. Stay tuned!

### UPGRADING

- Previously, the formatted output of ‘ceph pg stat -f ...’ was a full pg dump that included all metadata about all PGs in the system. It is now a concise summary of high-level PG stats, just like the unformatted ‘ceph pg stat’ command.
- All JSON dumps of floating point values were incorrecting surrounding the value with quotes. These quotes have been removed. Any consumer of structured JSON output that was consuming the floating point values was previously having to interpret the quoted string and will most likely need to be fixed to take the unquoted number.

### NOTABLE CHANGES

- arch: fix NEON feaeture detection (#10185 Loic Dachary)
- build: adjust build deps for yasm, virtualenv (Jianpeng Ma)
- build: improve build dependency tooling (Loic Dachary)
- ceph-disk: call partx/partprobe consistency (#9721 Loic Dachary)
- ceph-disk: fix dmcrypt key permissions (Loic Dachary)
- ceph-disk: fix umount race condition (#10096 Blaine Gardner)
- ceph-disk: init=none option (Loic Dachary)
- ceph-monstore-tool: fix shutdown (#10093 Loic Dachary)
- ceph-objectstore-tool: fix import (#10090 David Zafman)
- ceph-objectstore-tool: many improvements and tests (David Zafman)
- ceph.spec: package rbd-replay-prep (Ken Dreyer)
- common: add ‘perf reset ...’ admin command (Jianpeng Ma)
- common: do not unlock rwlock on destruction (Federico Simoncelli)
- common: fix block device discard check (#10296 Sage Weil)
- common: remove broken CEPH\_LOCKDEP optoin (Kefu Chai)
- crush: fix tree bucket behavior (Rongze Zhu)
- doc: add build-doc guidlines for Fedora and CentOS/RHEL (Nilamdyuti Goswami)
- doc: enable rbd cache on openstack deployments (Sebastien Han)
- doc: improved installation nots on CentOS/RHEL installs (John Wilkins)
- doc: misc cleanups (Adam Spiers, Sebastien Han, Nilamdyuti Goswami, Ken Dreyer, John Wilkins)
- doc: new man pages (Nilamdyuti Goswami)
- doc: update release descriptions (Ken Dreyer)
- doc: update sepia hardware inventory (Sandon Van Ness)
- librados: only export public API symbols (Jason Dillaman)
- libradosstriper: fix stat strtoll (Dongmao Zhang)
- libradosstriper: fix trunc method (#10129 Sebastien Ponce)
- librbd: fix list\_children from invalid pool ioctxs (#10123 Jason Dillaman)
- librbd: only export public API symbols (Jason Dillaman)
- many coverity fixes (Danny Al-Gaaf)
- mds: ‘flush journal’ admin command (John Spray)
- mds: fix MDLog IO callback deadlock (John Spray)
- mds: fix deadlock during journal probe vs purge (#10229 Yan, Zheng)
- mds: fix race trimming log segments (Yan, Zheng)
- mds: store backtrace for stray dir (Yan, Zheng)
- mds: verify backtrace when fetching dirfrag (#9557 Yan, Zheng)
- mon: add max pgs per osd warning (Sage Weil)
- mon: fix [\*](http://docs.ceph.com/docs/master/release-notes/#id1)\_ratio units and types (Sage Weil)
- mon: fix JSON dumps to dump floats as flots and not strings (Sage Weil)
- mon: fix formatter ‘pg stat’ command output (Sage Weil)
- msgr: async: several fixes (Haomai Wang)
- msgr: simple: fix rare deadlock (Greg Farnum)
- osd: batch pg log trim (Xinze Chi)
- osd: clean up internal ObjectStore interface (Sage Weil)
- osd: do not abort deep scrub on missing hinfo (#10018 Loic Dachary)
- osd: fix ghobject\_t formatted output to include shard (#10063 Loic Dachary)
- osd: fix osd peer check on scrub messages (#9555 Sage Weil)
- osd: fix pgls filter ops (#9439 David Zafman)
- osd: flush snapshots from cache tier immediately (Sage Weil)
- osd: keyvaluestore: fix getattr semantics (Haomai Wang)
- osd: keyvaluestore: fix key ordering (#10119 Haomai Wang)
- osd: limit in-flight read requests (Jason Dillaman)
- osd: log when scrub or repair starts (Loic Dachary)
- osd: support for discard for journal trim (Jianpeng Ma)
- qa: fix osd create dup tests (#10083 Loic Dachary)
- rgw: add location header when object is in another region (VRan Liu)
- rgw: check timestamp on s3 keystone auth (#10062 Abhishek Lekshmanan)
- rgw: make sysvinit script set ulimit -n properly (Sage Weil)
- systemd: better systemd unit files (Owen Synge)
- tests: ability to run unit tests under docker (Loic Dachary)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.90.tar.gz](http://ceph.com/download/ceph-0.90.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
