---
title: "v0.94.2 Hammer released"
date: "2015-06-11"
author: "sage"
---

This Hammer point release fixes a few critical bugs in RGW that can prevent objects starting with underscore from behaving properly and that prevent garbage collection of deleted objects when using the Civetweb standalone mode.

All v0.94.x Hammer users are strongly encouraged to upgrade, and to make note of the repair procedure below if RGW is in use.

### UPGRADING FROM PREVIOUS HAMMER RELEASE

Bug #11442 introduced a change that made rgw objects that start with underscore incompatible with previous versions. The fix to that bug reverts to the previous behavior. In order to be able to access objects that start with an underscore and were created in prior Hammer releases, following the upgrade it is required to run (for each affected bucket):

$ radosgw-admin bucket check --check-head-obj-locator \\
                             --bucket=<bucket> \[--fix\]

### NOTABLE CHANGES

- build: compilation error: No high-precision counter available (armhf, powerpc..) (#11432, James Page)
- ceph-dencoder links to libtcmalloc, and shouldn’t (#10691, Boris Ranto)
- ceph-disk: disk zap sgdisk invocation (#11143, Owen Synge)
- ceph-disk: use a new disk as journal disk,ceph-disk prepare fail (#10983, Loic Dachary)
- ceph-objectstore-tool should be in the ceph server package (#11376, Ken Dreyer)
- librados: can get stuck in redirect loop if osdmap epoch == last\_force\_op\_resend (#11026, Jianpeng Ma)
- librbd: A retransmit of proxied flatten request can result in -EINVAL (Jason Dillaman)
- librbd: ImageWatcher should cancel in-flight ops on watch error (#11363, Jason Dillaman)
- librbd: Objectcacher setting max object counts too low (#7385, Jason Dillaman)
- librbd: Periodic failure of TestLibRBD.DiffIterateStress (#11369, Jason Dillaman)
- librbd: Queued AIO reference counters not properly updated (#11478, Jason Dillaman)
- librbd: deadlock in image refresh (#5488, Jason Dillaman)
- librbd: notification race condition on snap\_create (#11342, Jason Dillaman)
- mds: Hammer uclient checking (#11510, John Spray)
- mds: remove caps from revoking list when caps are voluntarily released (#11482, Yan, Zheng)
- messenger: double clear of pipe in reaper (#11381, Haomai Wang)
- mon: Total size of OSDs is a maginitude less than it is supposed to be. (#11534, Zhe Zhang)
- osd: don’t check order in finish\_proxy\_read (#11211, Zhiqiang Wang)
- osd: handle old semi-deleted pgs after upgrade (#11429, Samuel Just)
- osd: object creation by write cannot use an offset on an erasure coded pool (#11507, Jianpeng Ma)
- rgw: Improve rgw HEAD request by avoiding read the body of the first chunk (#11001, Guang Yang)
- rgw: civetweb is hitting a limit (number of threads 1024) (#10243, Yehuda Sadeh)
- rgw: civetweb should use unique request id (#10295, Orit Wasserman)
- rgw: critical fixes for hammer (#11447, #11442, Yehuda Sadeh)
- rgw: fix swift COPY headers (#10662, #10663, #11087, #10645, Radoslaw Zarzynski)
- rgw: improve performance for large object (multiple chunks) GET (#11322, Guang Yang)
- rgw: init-radosgw: run RGW as root (#11453, Ken Dreyer)
- rgw: keystone token cache does not work correctly (#11125, Yehuda Sadeh)
- rgw: make quota/gc thread configurable for starting (#11047, Guang Yang)
- rgw: make swift responses of RGW return last-modified, content-length, x-trans-id headers.(#10650, Radoslaw Zarzynski)
- rgw: merge manifests correctly when there’s prefix override (#11622, Yehuda Sadeh)
- rgw: quota not respected in POST object (#11323, Sergey Arkhipov)
- rgw: restore buffer of multipart upload after EEXIST (#11604, Yehuda Sadeh)
- rgw: shouldn’t need to disable rgw\_socket\_path if frontend is configured (#11160, Yehuda Sadeh)
- rgw: swift: Response header of GET request for container does not contain X-Container-Object-Count, X-Container-Bytes-Used and x-trans-id headers (#10666, Dmytro Iurchenko)
- rgw: swift: Response header of POST request for object does not contain content-length and x-trans-id headers (#10661, Radoslaw Zarzynski)
- rgw: swift: response for GET/HEAD on container does not contain the X-Timestamp header (#10938, Radoslaw Zarzynski)
- rgw: swift: response for PUT on /container does not contain the mandatory Content-Length header when FCGI is used (#11036, #10971, Radoslaw Zarzynski)
- rgw: swift: wrong handling of empty metadata on Swift container (#11088, Radoslaw Zarzynski)
- tests: TestFlatIndex.cc races with TestLFNIndex.cc (#11217, Xinze Chi)
- tests: ceph-helpers kill\_daemons fails when kill fails (#11398, Loic Dachary)

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v0.94.2.txt).

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.94.2.tar.gz](http://ceph.com/download/ceph-0.94.2.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
