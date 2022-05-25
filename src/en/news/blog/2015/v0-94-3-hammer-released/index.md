---
title: "v0.94.3 Hammer released"
date: "2015-08-27"
author: "sage"
tags:
  - "release"
  - "hammer"
---

This Hammer point release fixes a critical (though rare) data corruption bug that could be triggered when logs are rotated via SIGHUP. It also fixes a range of other important bugs in the OSD, monitor, RGW, RBD, and CephFS.

All v0.94.x Hammer users are strongly encouraged to upgrade.

### UPGRADING

- The pg ls-by-{pool,primary,osd} commands and pg ls now take the argument recovering instead of recovery in order to include the recovering pgs in the listed pgs.

### NOTABLE CHANGES

- librbd: aio calls may block ([issue#11770](http://tracker.ceph.com/issues/11770), [pr#4875](http://github.com/ceph/ceph/pull/4875), Jason Dillaman)
- osd: make the all osd/filestore thread pool suicide timeouts separately configurable ([issue#11701](http://tracker.ceph.com/issues/11701), [pr#5159](http://github.com/ceph/ceph/pull/5159), Samuel Just)
- mon: ceph fails to compile with boost 1.58 ([issue#11982](http://tracker.ceph.com/issues/11982), [pr#5122](http://github.com/ceph/ceph/pull/5122), Kefu Chai)
- tests: TEST\_crush\_reject\_empty must not run a mon ([issue#12285,11975](http://tracker.ceph.com/issues/12285,11975), [pr#5208](http://github.com/ceph/ceph/pull/5208), Kefu Chai)
- osd: FAILED assert(!old\_value.deleted()) in upgrade:giant-x-hammer-distro-basic-multi run ([issue#11983](http://tracker.ceph.com/issues/11983), [pr#5121](http://github.com/ceph/ceph/pull/5121), Samuel Just)
- build/ops: linking ceph to tcmalloc causes segfault on SUSE SLE11-SP3 ([issue#12368](http://tracker.ceph.com/issues/12368), [pr#5265](http://github.com/ceph/ceph/pull/5265), Thorsten Behrens)
- common: utf8 and old gcc breakage on RHEL6.5 ([issue#7387](http://tracker.ceph.com/issues/7387), [pr#4687](http://github.com/ceph/ceph/pull/4687), Kefu Chai)
- crush: take crashes due to invalid arg ([issue#11740](http://tracker.ceph.com/issues/11740), [pr#4891](http://github.com/ceph/ceph/pull/4891), Sage Weil)
- rgw: need conversion tool to handle fixes following #11974 ([issue#12502](http://tracker.ceph.com/issues/12502), [pr#5384](http://github.com/ceph/ceph/pull/5384), Yehuda Sadeh)
- rgw: Swift API: support for 202 Accepted response code on container creation ([issue#12299](http://tracker.ceph.com/issues/12299), [pr#5214](http://github.com/ceph/ceph/pull/5214), Radoslaw Zarzynski)
- common: Log::reopen\_log\_file: take m\_flush\_mutex ([issue#12520](http://tracker.ceph.com/issues/12520), [pr#5405](http://github.com/ceph/ceph/pull/5405), Samuel Just)
- rgw: Properly respond to the Connection header with Civetweb ([issue#12398](http://tracker.ceph.com/issues/12398), [pr#5284](http://github.com/ceph/ceph/pull/5284), Wido den Hollander)
- rgw: multipart list part response returns incorrect field ([issue#12399](http://tracker.ceph.com/issues/12399), [pr#5285](http://github.com/ceph/ceph/pull/5285), Henry Chang)
- build/ops: ceph.spec.in: 95-ceph-osd.rules, mount.ceph, and mount.fuse.ceph not installed properly on SUSE ([issue#12397](http://tracker.ceph.com/issues/12397), [pr#5283](http://github.com/ceph/ceph/pull/5283), Nathan Cutler)
- rgw: radosgw-admin dumps user info twice ([issue#12400](http://tracker.ceph.com/issues/12400), [pr#5286](http://github.com/ceph/ceph/pull/5286), guce)
- doc: fix doc build ([issue#12180](http://tracker.ceph.com/issues/12180), [pr#5095](http://github.com/ceph/ceph/pull/5095), Kefu Chai)
- tests: backport 11493 fixes, and test, preventing ec cache pools ([issue#12314](http://tracker.ceph.com/issues/12314), [pr#4961](http://github.com/ceph/ceph/pull/4961), Samuel Just)
- rgw: does not send Date HTTP header when civetweb frontend is used ([issue#11872](http://tracker.ceph.com/issues/11872), [pr#5228](http://github.com/ceph/ceph/pull/5228), Radoslaw Zarzynski)
- mon: pg ls is broken ([issue#11910](http://tracker.ceph.com/issues/11910), [pr#5160](http://github.com/ceph/ceph/pull/5160), Kefu Chai)
- librbd: A client opening an image mid-resize can result in the object map being invalidated ([issue#12237](http://tracker.ceph.com/issues/12237), [pr#5279](http://github.com/ceph/ceph/pull/5279), Jason Dillaman)
- doc: missing man pages for ceph-create-keys, ceph-disk-\* ([issue#11862](http://tracker.ceph.com/issues/11862), [pr#4846](http://github.com/ceph/ceph/pull/4846), Nathan Cutler)
- tools: ceph-post-file fails on rhel7 ([issue#11876](http://tracker.ceph.com/issues/11876), [pr#5038](http://github.com/ceph/ceph/pull/5038), Sage Weil)
- build/ops: rcceph script is buggy ([issue#12090](http://tracker.ceph.com/issues/12090), [pr#5028](http://github.com/ceph/ceph/pull/5028), Owen Synge)
- rgw: Bucket header is enclosed by quotes ([issue#11874](http://tracker.ceph.com/issues/11874), [pr#4862](http://github.com/ceph/ceph/pull/4862), Wido den Hollander)
- build/ops: packaging: add SuSEfirewall2 service files ([issue#12092](http://tracker.ceph.com/issues/12092), [pr#5030](http://github.com/ceph/ceph/pull/5030), Tim Serong)
- rgw: Keystone PKI token expiration is not enforced ([issue#11722](http://tracker.ceph.com/issues/11722), [pr#4884](http://github.com/ceph/ceph/pull/4884), Anton Aksola)
- build/ops: debian/control: ceph-common (>> 0.94.2) must be >= 0.94.2-2 ([issue#12529,11998](http://tracker.ceph.com/issues/12529,11998), [pr#5417](http://github.com/ceph/ceph/pull/5417), Loic Dachary)
- mon: Clock skew causes missing summary and confuses Calamari ([issue#11879](http://tracker.ceph.com/issues/11879), [pr#4868](http://github.com/ceph/ceph/pull/4868), Thorsten Behrens)
- rgw: rados objects wronly deleted ([issue#12099](http://tracker.ceph.com/issues/12099), [pr#5117](http://github.com/ceph/ceph/pull/5117), wuxingyi)
- tests: kernel\_untar\_build fails on EL7 ([issue#12098](http://tracker.ceph.com/issues/12098), [pr#5119](http://github.com/ceph/ceph/pull/5119), Greg Farnum)
- fs: Fh ref count will leak if readahead does not need to do read from osd ([issue#12319](http://tracker.ceph.com/issues/12319), [pr#5427](http://github.com/ceph/ceph/pull/5427), Zhi Zhang)
- mon: OSDMonitor: allow addition of cache pool with non-empty snaps with co… ([issue#12595](http://tracker.ceph.com/issues/12595), [pr#5252](http://github.com/ceph/ceph/pull/5252), Samuel Just)
- mon: MDSMonitor: handle MDSBeacon messages properly ([issue#11979](http://tracker.ceph.com/issues/11979), [pr#5123](http://github.com/ceph/ceph/pull/5123), Kefu Chai)
- tools: ceph-disk: get\_partition\_type fails on /dev/cciss... ([issue#11760](http://tracker.ceph.com/issues/11760), [pr#4892](http://github.com/ceph/ceph/pull/4892), islepnev)
- build/ops: max files open limit for OSD daemon is too low ([issue#12087](http://tracker.ceph.com/issues/12087), [pr#5026](http://github.com/ceph/ceph/pull/5026), Owen Synge)
- mon: add an “osd crush tree” command ([issue#11833](http://tracker.ceph.com/issues/11833), [pr#5248](http://github.com/ceph/ceph/pull/5248), Kefu Chai)
- mon: mon crashes when “ceph osd tree 85 –format json” ([issue#11975](http://tracker.ceph.com/issues/11975), [pr#4936](http://github.com/ceph/ceph/pull/4936), Kefu Chai)
- build/ops: ceph / ceph-dbg steal ceph-objecstore-tool from ceph-test / ceph-test-dbg ([issue#11806](http://tracker.ceph.com/issues/11806), [pr#5069](http://github.com/ceph/ceph/pull/5069), Loic Dachary)
- rgw: DragonDisk fails to create directories via S3: MissingContentLength ([issue#12042](http://tracker.ceph.com/issues/12042), [pr#5118](http://github.com/ceph/ceph/pull/5118), Yehuda Sadeh)
- build/ops: /usr/bin/ceph from ceph-common is broken without installing ceph ([issue#11998](http://tracker.ceph.com/issues/11998), [pr#5206](http://github.com/ceph/ceph/pull/5206), Ken Dreyer)
- build/ops: systemd: Increase max files open limit for OSD daemon ([issue#11964](http://tracker.ceph.com/issues/11964), [pr#5040](http://github.com/ceph/ceph/pull/5040), Owen Synge)
- build/ops: rgw/logrotate.conf calls service with wrong init script name ([issue#12044](http://tracker.ceph.com/issues/12044), [pr#5055](http://github.com/ceph/ceph/pull/5055), wuxingyi)
- common: OPT\_INT option interprets 3221225472 as -1073741824, and crashes in Throttle::Throttle() ([issue#11738](http://tracker.ceph.com/issues/11738), [pr#4889](http://github.com/ceph/ceph/pull/4889), Kefu Chai)
- doc: doc/release-notes: v0.94.2 ([issue#11492](http://tracker.ceph.com/issues/11492), [pr#4934](http://github.com/ceph/ceph/pull/4934), Sage Weil)
- common: admin\_socket: close socket descriptor in destructor ([issue#11706](http://tracker.ceph.com/issues/11706), [pr#4657](http://github.com/ceph/ceph/pull/4657), Jon Bernard)
- rgw: Object copy bug ([issue#11755](http://tracker.ceph.com/issues/11755), [pr#4885](http://github.com/ceph/ceph/pull/4885), Javier M. Mellid)
- rgw: empty json response when getting user quota ([issue#12245](http://tracker.ceph.com/issues/12245), [pr#5237](http://github.com/ceph/ceph/pull/5237), wuxingyi)
- fs: cephfs Dumper tries to load whole journal into memory at once ([issue#11999](http://tracker.ceph.com/issues/11999), [pr#5120](http://github.com/ceph/ceph/pull/5120), John Spray)
- rgw: Fix tool for #11442 does not correctly fix objects created via multipart uploads ([issue#12242](http://tracker.ceph.com/issues/12242), [pr#5229](http://github.com/ceph/ceph/pull/5229), Yehuda Sadeh)
- rgw: Civetweb RGW appears to report full size of object as downloaded when only partially downloaded ([issue#12243](http://tracker.ceph.com/issues/12243), [pr#5231](http://github.com/ceph/ceph/pull/5231), Yehuda Sadeh)
- osd: stuck incomplete ([issue#12362](http://tracker.ceph.com/issues/12362), [pr#5269](http://github.com/ceph/ceph/pull/5269), Samuel Just)
- osd: start\_flush: filter out removed snaps before determining snapc’s ([issue#11911](http://tracker.ceph.com/issues/11911), [pr#4899](http://github.com/ceph/ceph/pull/4899), Samuel Just)
- librbd: internal.cc: 1967: FAILED assert(watchers.size() == 1) ([issue#12239](http://tracker.ceph.com/issues/12239), [pr#5243](http://github.com/ceph/ceph/pull/5243), Jason Dillaman)
- librbd: new QA client upgrade tests ([issue#12109](http://tracker.ceph.com/issues/12109), [pr#5046](http://github.com/ceph/ceph/pull/5046), Jason Dillaman)
- librbd: \[ FAILED \] TestLibRBD.ExclusiveLockTransition ([issue#12238](http://tracker.ceph.com/issues/12238), [pr#5241](http://github.com/ceph/ceph/pull/5241), Jason Dillaman)
- rgw: Swift API: XML document generated in response for GET on account does not contain account name ([issue#12323](http://tracker.ceph.com/issues/12323), [pr#5227](http://github.com/ceph/ceph/pull/5227), Radoslaw Zarzynski)
- rgw: keystone does not support chunked input ([issue#12322](http://tracker.ceph.com/issues/12322), [pr#5226](http://github.com/ceph/ceph/pull/5226), Hervé Rousseau)
- mds: MDS is crashed (mds/CDir.cc: 1391: FAILED assert(!is\_complete())) ([issue#11737](http://tracker.ceph.com/issues/11737), [pr#4886](http://github.com/ceph/ceph/pull/4886), Yan, Zheng)
- cli: ceph: cli interactive mode does not understand quotes ([issue#11736](http://tracker.ceph.com/issues/11736), [pr#4776](http://github.com/ceph/ceph/pull/4776), Kefu Chai)
- librbd: add valgrind memory checks for unit tests ([issue#12384](http://tracker.ceph.com/issues/12384), [pr#5280](http://github.com/ceph/ceph/pull/5280), Zhiqiang Wang)
- build/ops: admin/build-doc: script fails silently under certain circumstances ([issue#11902](http://tracker.ceph.com/issues/11902), [pr#4877](http://github.com/ceph/ceph/pull/4877), John Spray)
- osd: Fixes for rados ops with snaps ([issue#11908](http://tracker.ceph.com/issues/11908), [pr#4902](http://github.com/ceph/ceph/pull/4902), Samuel Just)
- build/ops: ceph.spec.in: ceph-common subpackage def needs tweaking for SUSE/openSUSE ([issue#12308](http://tracker.ceph.com/issues/12308), [pr#4883](http://github.com/ceph/ceph/pull/4883), Nathan Cutler)
- fs: client: reference counting ‘struct Fh’ ([issue#12088](http://tracker.ceph.com/issues/12088), [pr#5222](http://github.com/ceph/ceph/pull/5222), Yan, Zheng)
- build/ops: ceph.spec: update OpenSUSE BuildRequires ([issue#11611](http://tracker.ceph.com/issues/11611), [pr#4667](http://github.com/ceph/ceph/pull/4667), Loic Dachary)

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v0.94.3.txt).

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.94.3.tar.gz](http://ceph.com/download/ceph-0.94.3.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
