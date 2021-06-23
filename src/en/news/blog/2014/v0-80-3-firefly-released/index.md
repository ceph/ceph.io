---
title: "v0.80.3 Firefly released"
date: "2014-07-11"
author: "sage"
---

## V0.80.3 FIREFLY

This is the third Firefly point release. It includes a single fix for a radosgw regression that was discovered in v0.80.2 right after it was released.

We recommand that all v0.80.x Firefly users upgrade.

### NOTABLE CHANGES

- radosgw: fix regression in manifest decoding (#8804, Sage Weil)

For more detailed information, see [the complete changelog](http://ceph.com/docs/master/_downloads/v0.80.3.txt).

## V0.80.2 FIREFLY

This is the second Firefly point release. It contains a range of important fixes, including several bugs in the OSD cache tiering, some compatibility checks that affect upgrade situations, several radosgw bugs, and an irritating and unnecessary feature bit check that prevents older clients from communicating with a cluster with any erasure coded pools.

One someone large change in this point release is that the ceph RPM package is separated into a ceph and ceph-common package, similar to Debian. The ceph-common package contains just the client libraries without any of the server-side daemons.

We recommend that all v0.80.x Firefly users skip this release and use v0.80.3.

### NOTABLE CHANGES

- ceph-disk: better debug logging (Alfredo Deza)
- ceph-disk: fix preparation of OSDs with dmcrypt (#6700, Stephen F Taylor)
- ceph-disk: partprobe on prepare to fix dm-crypt (#6966, Eric Eastman)
- do not require ERASURE\_CODE feature from clients (#8556, Sage Weil)
- libcephfs-java: build with older JNI headers (Greg Farnum)
- libcephfs-java: fix build with gcj-jdk (Dmitry Smirnov)
- librados: fix osd op tid for redirected ops (#7588, Samuel Just)
- librados: fix rados\_pool\_list buffer bounds checks (#8447, Sage Weil)
- librados: resend ops when pool overlay changes (#8305, Sage Weil)
- librbd, ceph-fuse: reduce CPU overhead for clean object check in cache (Haomai Wang)
- mon: allow deletion of cephfs pools (John Spray)
- mon: fix default pool ruleset choice (#8373, John Spray)
- mon: fix health summary for mon low disk warning (Sage Weil)
- mon: fix ‘osd pool set <pool> cache\_target\_full\_ratio’ (Geoffrey Hartz)
- mon: fix quorum feature check (Greg Farnum)
- mon: fix request forwarding in mixed firefly+dumpling clusters 9#8727, Joao Eduardo Luis)
- mon: fix rule vs ruleset check in ‘osd pool set ... crush\_ruleset’ command (John Spray)
- mon: make osd ‘down’ count accurate (Sage Weil)
- mon: set ‘next commit’ in primary-affinity reply (Ilya Dryomov)
- mon: verify CRUSH features are supported by all mons (#8738, Greg Farnum)
- msgr: fix sequence negotiation during connection reset (Guang Yang)
- osd: block scrub on blocked objects (#8011, Samuel Just)
- osd: call XFS hint ioctl less often (#8241, Ilya Dryomov)
- osd: copy xattr spill out marker on clone (Haomai Wang)
- osd: fix flush of snapped objects (#8334, Samuel Just)
- osd: fix hashindex restart of merge operation (#8332, Samuel Just)
- osd: fix osdmap subscription bug causing startup hang (Greg Farnum)
- osd: fix potential null deref (#8328, Sage Weil)
- osd: fix shutdown race (#8319, Sage Weil)
- osd: handle ‘none’ in CRUSH results properly during peering (#8507, Samuel Just)
- osd: set no spill out marker on new objects (Greg Farnum)
- osd: skip op ordering debug checks on tiered pools (#8380, Sage Weil)
- rados: enforce ‘put’ alignment (Lluis Pamies-Juarez)
- rest-api: fix for ‘rx’ commands (Ailing Zhang)
- rgw: calc user manifest etag and fix check (#8169, #8436, Yehuda Sadeh)
- rgw: fetch attrs on multipart completion (#8452, Yehuda Sadeh, Sylvain Munaut)
- rgw: fix buffer overflow for long instance ids (#8608, Yehuda Sadeh)
- rgw: fix entity permission check on metadata put (#8428, Yehuda Sadeh)
- rgw: fix multipart retry race (#8269, Yehuda Sadeh)
- rpm: split ceph into ceph and ceph-common RPMs (Sandon Van Ness, Dan Mick)
- sysvinit: continue startin daemons after failure doing mount (#8554, Sage Weil)

For more detailed information, see [the complete changelog](http://ceph.com/docs/master/_downloads/v0.80.2.txt).

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.80.3.tar.gz](http://ceph.com/download/ceph-0.80.3.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
