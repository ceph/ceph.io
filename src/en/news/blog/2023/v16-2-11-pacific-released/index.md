---
title: "v16.2.11 Pacific released"
date: "2023-01-26"
author: "yuriw"
tags:
  - "release"
  - "pacific"
---

This is the eighth backport release in the Pacific series. We recommend all users update to this release.

## Notable Changes

- Cephfs: The 'AT_NO_ATTR_SYNC' macro is deprecated, please use the standard
  'AT_STATX_DONT_SYNC' macro. The 'AT_NO_ATTR_SYNC' macro will be removed in
  the future.

- Trimming of PGLog dups is now controlled by the size instead of the version.
  This fixes the PGLog inflation issue that was happening when the on-line
  (in OSD) trimming got jammed after a PG split operation. Also, a new off-line
  mechanism has been added: `ceph-objectstore-tool` got `trim-pg-log-dups` op
  that targets situations where OSD is unable to boot due to those inflated dups.
  If that is the case, in OSD logs the "You can be hit by THE DUPS BUG" warning
  will be visible.
  Relevant tracker: https://tracker.ceph.com/issues/53729

- RBD: `rbd device unmap` command gained `--namespace` option.  Support for
  namespaces was added to RBD in Nautilus 14.2.0 and it has been possible to
  map and unmap images in namespaces using the `image-spec` syntax since then
  but the corresponding option available in most other commands was missing.

## Changelog

- <span></span>.github/CODEOWNERS: tag core devs on core PRs ([pr#46520](https://github.com/ceph/ceph/pull/46520), Neha Ojha)

- <span></span>.github: continue on error and reorder milestone step ([pr#46448](https://github.com/ceph/ceph/pull/46448), Ernesto Puerta)

- <span></span>.readthedocs<span></span>.yml: Always build latest doc/releases pages ([pr#47443](https://github.com/ceph/ceph/pull/47443), David Galloway)

- [bluestore] Improve deferred write decision ([pr#49170](https://github.com/ceph/ceph/pull/49170), Adam Kupczyk, Igor Fedotov)

- [pacific] mgr/alerts: Add Message-Id and Date header to sent emails ([pr#46312](https://github.com/ceph/ceph/pull/46312), Lorenz Bausch)

- Add mapping for ernno:13 and adding path in error msg in opendir()/cephfs<span></span>.pyx ([pr#46646](https://github.com/ceph/ceph/pull/46646), Sarthak0702)

- backport of cephadm: fix osd adoption with custom cluster name ([pr#46552](https://github.com/ceph/ceph/pull/46552), Adam King)

- Catch exception if thrown by \_\_generate\_command\_map() ([pr#45893](https://github.com/ceph/ceph/pull/45893), Nikhil Kshirsagar)

- ceph-fuse: add dedicated snap stag map for each directory ([pr#46949](https://github.com/ceph/ceph/pull/46949), Xiubo Li)

- ceph-mixin: backport of recent cleanups ([pr#46549](https://github.com/ceph/ceph/pull/46549), Arthur Outhenin-Chalandre)

- ceph-volume/tests: fix lvm centos8-filestore-create job ([pr#48123](https://github.com/ceph/ceph/pull/48123), Guillaume Abrioux)

- ceph-volume: add a retry in util<span></span>.disk<span></span>.remove\_partition ([pr#47990](https://github.com/ceph/ceph/pull/47990), Guillaume Abrioux)

- ceph-volume: allow listing devices by OSD ID ([pr#47018](https://github.com/ceph/ceph/pull/47018), Rishabh Dave)

- ceph-volume: avoid unnecessary subprocess calls ([pr#46969](https://github.com/ceph/ceph/pull/46969), Guillaume Abrioux)

- ceph-volume: decrease number of `pvs` calls in `lvm list` ([pr#46967](https://github.com/ceph/ceph/pull/46967), Guillaume Abrioux)

- ceph-volume: do not log sensitive details ([pr#46729](https://github.com/ceph/ceph/pull/46729), Guillaume Abrioux)

- ceph-volume: fix activate ([pr#46511](https://github.com/ceph/ceph/pull/46511), Guillaume Abrioux, Sage Weil)

- ceph-volume: fix inventory with device arg ([pr#48126](https://github.com/ceph/ceph/pull/48126), Guillaume Abrioux)

- ceph-volume: make is\_valid() optional ([pr#46731](https://github.com/ceph/ceph/pull/46731), Guillaume Abrioux)

- ceph-volume: only warn when config file isn't found ([pr#46069](https://github.com/ceph/ceph/pull/46069), Guillaume Abrioux)

- ceph-volume: Pacific backports ([pr#47413](https://github.com/ceph/ceph/pull/47413), Guillaume Abrioux, Zack Cerza, Arthur Outhenin-Chalandre)

- ceph-volume: system<span></span>.get\_mounts() refactor ([pr#47535](https://github.com/ceph/ceph/pull/47535), Guillaume Abrioux)

- ceph-volume: zap osds in rollback\_osd() ([pr#44769](https://github.com/ceph/ceph/pull/44769), Guillaume Abrioux)

- ceph<span></span>.spec<span></span>.in: disable annobin plugin if compile with gcc-toolset ([pr#46368](https://github.com/ceph/ceph/pull/46368), Kefu Chai)

- ceph<span></span>.spec<span></span>.in: remove build directory at end of %install ([pr#45698](https://github.com/ceph/ceph/pull/45698), Tim Serong)

- ceph\_test\_librados\_service: wait longer for servicemap to update ([pr#46677](https://github.com/ceph/ceph/pull/46677), Sage Weil)

- cephadm batch backport May ([pr#46327](https://github.com/ceph/ceph/pull/46327), Adam King, Redouane Kachach, Moritz Röhrich)

- cephadm/ceph-volume: fix rm-cluster --zap ([pr#47627](https://github.com/ceph/ceph/pull/47627), Guillaume Abrioux)

- cephadm: add "su root root" to cephadm<span></span>.log logrotate config ([pr#47319](https://github.com/ceph/ceph/pull/47319), Adam King)

- cephadm: add 'is\_paused' field in orch status output ([pr#46570](https://github.com/ceph/ceph/pull/46570), Guillaume Abrioux)

- cephadm: add `ip\_nonlocal\_bind` to haproxy deployment ([pr#48212](https://github.com/ceph/ceph/pull/48212), Michael Fritch)

- Cephadm: Allow multiple virtual IP addresses for keepalived and haproxy ([pr#47611](https://github.com/ceph/ceph/pull/47611), Luis Domingues)

- cephadm: consider stdout to get container version ([pr#48210](https://github.com/ceph/ceph/pull/48210), Tatjana Dehler)

- cephadm: Fix disk size calculation ([pr#48098](https://github.com/ceph/ceph/pull/48098), Paul Cuzner)

- cephadm: Fix repo\_gpgkey should return 2 vars ([pr#47376](https://github.com/ceph/ceph/pull/47376), Laurent Barbe)

- cephadm: improve network handling during bootstrap ([pr#46309](https://github.com/ceph/ceph/pull/46309), Redouane Kachach)

- cephadm: pin flake8 to 5<span></span>.0<span></span>.4 ([pr#49058](https://github.com/ceph/ceph/pull/49058), Kefu Chai)

- cephadm: preserve cephadm user during RPM upgrade ([pr#46553](https://github.com/ceph/ceph/pull/46553), Scott Shambarger)

- cephadm: prometheus: The generatorURL in alerts is only using hostname ([pr#46352](https://github.com/ceph/ceph/pull/46352), Volker Theile)

- cephadm: return nonzero exit code when applying spec fails in bootstrap ([pr#48102](https://github.com/ceph/ceph/pull/48102), Adam King)

- cephadm: run tests as root ([pr#48470](https://github.com/ceph/ceph/pull/48470), Kefu Chai)

- cephadm: support for Oracle Linux 8 ([pr#47661](https://github.com/ceph/ceph/pull/47661), Adam King)

- cephadm: support quotes around public/cluster network in config passed to bootstrap ([pr#47664](https://github.com/ceph/ceph/pull/47664), Adam King)

- cephfs-data-scan: make scan\_links more verbose ([pr#48443](https://github.com/ceph/ceph/pull/48443), Mykola Golub)

- cephfs-shell: fix put and get cmd ([pr#46297](https://github.com/ceph/ceph/pull/46297), Dhairya Parmar, dparmar18)

- cephfs-shell: move source to separate subdirectory ([pr#47401](https://github.com/ceph/ceph/pull/47401), Tim Serong)

- cephfs-top: adding filesystem menu option ([pr#47998](https://github.com/ceph/ceph/pull/47998), Neeraj Pratap Singh)

- cephfs-top: display average read/write/metadata latency ([issue#48619](http://tracker.ceph.com/issues/48619), [pr#47978](https://github.com/ceph/ceph/pull/47978), Venky Shankar)

- cephfs-top: fix the rsp/wsp display ([pr#47647](https://github.com/ceph/ceph/pull/47647), Jos Collin)

- cephfs-top: make cephfs-top display scrollable ([pr#48734](https://github.com/ceph/ceph/pull/48734), Jos Collin)

- cephfs-top: Multiple filesystem support ([pr#46146](https://github.com/ceph/ceph/pull/46146), Neeraj Pratap Singh)

- client/fuse: Fix directory DACs overriding for root ([pr#46596](https://github.com/ceph/ceph/pull/46596), Kotresh HR)

- client: abort the client if we couldn't invalidate dentry caches ([pr#48109](https://github.com/ceph/ceph/pull/48109), Xiubo Li)

- client: add option to disable collecting and sending metrics ([pr#46798](https://github.com/ceph/ceph/pull/46798), Xiubo Li)

- client: allow overwrites to file with size greater than the max\_file\_size ([pr#47972](https://github.com/ceph/ceph/pull/47972), Tamar Shacked)

- client: buffer the truncate if we have the Fx caps ([pr#45792](https://github.com/ceph/ceph/pull/45792), Xiubo Li)

- client: choose auth MDS for getxattr with the Xs caps ([pr#46799](https://github.com/ceph/ceph/pull/46799), Xiubo Li)

- client: do not uninline data for read ([pr#48133](https://github.com/ceph/ceph/pull/48133), Xiubo Li)

- client: fix incorrectly showing the <span></span>.snap size for stat ([pr#48413](https://github.com/ceph/ceph/pull/48413), Xiubo Li)

- client: Inode::hold\_caps\_until is time from monotonic clock now ([pr#46626](https://github.com/ceph/ceph/pull/46626), Laura Flores, Neeraj Pratap Singh)

- client: stop the remount\_finisher thread in the Client::unmount() ([pr#48108](https://github.com/ceph/ceph/pull/48108), Xiubo Li)

- client: use parent directory POSIX ACLs for snapshot dir ([issue#57084](http://tracker.ceph.com/issues/57084), [pr#48553](https://github.com/ceph/ceph/pull/48553), Venky Shankar)

- cls/rbd: update last\_read in group::snap\_list ([pr#49195](https://github.com/ceph/ceph/pull/49195), Ilya Dryomov, Prasanna Kumar Kalever)

- cls/rgw: rgw\_dir\_suggest\_changes detects race with completion ([pr#45900](https://github.com/ceph/ceph/pull/45900), Casey Bodley)

- cmake: check for python(\d)\<span></span>.(\d+) when building boost ([pr#46365](https://github.com/ceph/ceph/pull/46365), Kefu Chai)

- cmake: remove spaces in macro used for compiling cython code ([pr#47484](https://github.com/ceph/ceph/pull/47484), Kefu Chai)

- CODEOWNERS: add RBD team ([pr#46541](https://github.com/ceph/ceph/pull/46541), Ilya Dryomov)

- common: use boost::shared\_mutex on Windows ([pr#47492](https://github.com/ceph/ceph/pull/47492), Lucian Petrut)

- crash: pthread\_mutex\_lock() ([pr#47684](https://github.com/ceph/ceph/pull/47684), Patrick Donnelly)

- doc/\_static: add scroll-margin-top to custom<span></span>.css ([pr#49645](https://github.com/ceph/ceph/pull/49645), Zac Dover)

- doc/architecture: correct PDF link ([pr#48796](https://github.com/ceph/ceph/pull/48796), Zac Dover)

- doc/ceph-volume: add A<span></span>. D'Atri's suggestions ([pr#48646](https://github.com/ceph/ceph/pull/48646), Zac Dover)

- doc/ceph-volume: improve prepare<span></span>.rst ([pr#48669](https://github.com/ceph/ceph/pull/48669), Zac Dover)

- doc/ceph-volume: refine "bluestore" section ([pr#48635](https://github.com/ceph/ceph/pull/48635), Zac Dover)

- doc/ceph-volume: refine "filestore" section ([pr#48637](https://github.com/ceph/ceph/pull/48637), Zac Dover)

- doc/ceph-volume: refine "prepare" top matter ([pr#48652](https://github.com/ceph/ceph/pull/48652), Zac Dover)

- doc/ceph-volume: refine Filestore docs ([pr#48671](https://github.com/ceph/ceph/pull/48671), Zac Dover)

- doc/cephadm/services: fix example for specifying rgw placement ([pr#47948](https://github.com/ceph/ceph/pull/47948), Redouane Kachach)

- doc/cephadm/services: the config section of service specs ([pr#47321](https://github.com/ceph/ceph/pull/47321), Redouane Kachach)

- doc/cephadm: add airgapped install procedure ([pr#49146](https://github.com/ceph/ceph/pull/49146), Zac Dover)

- doc/cephadm: add note about OSDs being recreated to OSD removal section ([pr#47103](https://github.com/ceph/ceph/pull/47103), Adam King)

- doc/cephadm: Add post-upgrade section ([pr#46977](https://github.com/ceph/ceph/pull/46977), Redouane Kachach)

- doc/cephadm: alphabetize external tools list ([pr#48726](https://github.com/ceph/ceph/pull/48726), Zac Dover)

- doc/cephadm: arrange "listing hosts" section ([pr#48724](https://github.com/ceph/ceph/pull/48724), Zac Dover)

- doc/cephadm: clean colons in host-management<span></span>.rst ([pr#48604](https://github.com/ceph/ceph/pull/48604), Zac Dover)

- doc/cephadm: correct version staggered upgrade got in pacific ([pr#48056](https://github.com/ceph/ceph/pull/48056), Adam King)

- doc/cephadm: document recommended syntax for mounting files with ECA ([pr#48069](https://github.com/ceph/ceph/pull/48069), Adam King)

- doc/cephadm: enhancing daemon operations documentation ([pr#46976](https://github.com/ceph/ceph/pull/46976), Redouane Kachach)

- doc/cephadm: fix example for specifying networks for rgw ([pr#47807](https://github.com/ceph/ceph/pull/47807), Adam King)

- doc/cephadm: fix grammar in compatibility<span></span>.rst ([pr#48715](https://github.com/ceph/ceph/pull/48715), Zac Dover)

- doc/cephadm: format airgap install procedure ([pr#49149](https://github.com/ceph/ceph/pull/49149), Zac Dover)

- doc/cephadm: improve airgapping procedure grammar ([pr#49158](https://github.com/ceph/ceph/pull/49158), Zac Dover)

- doc/cephadm: improve front matter ([pr#48607](https://github.com/ceph/ceph/pull/48607), Zac Dover)

- doc/cephadm: improve grammar in "listing hosts" ([pr#49165](https://github.com/ceph/ceph/pull/49165), Zac Dover)

- doc/cephadm: improve lone sentence ([pr#48738](https://github.com/ceph/ceph/pull/48738), Zac Dover)

- doc/cephadm: refine "Removing Hosts" ([pr#49707](https://github.com/ceph/ceph/pull/49707), Zac Dover)

- doc/cephadm: s/osd/OSD/ where appropriate ([pr#49718](https://github.com/ceph/ceph/pull/49718), Zac Dover)

- doc/cephadm: s/ssh/SSH/ in doc/cephadm (complete) ([pr#48612](https://github.com/ceph/ceph/pull/48612), Zac Dover)

- doc/cephadm: s/ssh/SSH/ in troubleshooting<span></span>.rst ([pr#48602](https://github.com/ceph/ceph/pull/48602), Zac Dover)

- doc/cephadm: update install<span></span>.rst ([pr#48595](https://github.com/ceph/ceph/pull/48595), Zac Dover)

- doc/cephfs - s/yet to here/yet to hear/ posix<span></span>.rst ([pr#49449](https://github.com/ceph/ceph/pull/49449), Zac Dover)

- doc/cephfs/add-remove-mds: added cephadm note, refined "Adding an MDS" ([pr#45878](https://github.com/ceph/ceph/pull/45878), Dhairya Parmar)

- doc/cephfs: fix "e<span></span>.g<span></span>." in posix<span></span>.rst ([pr#49451](https://github.com/ceph/ceph/pull/49451), Zac Dover)

- doc/cephfs: s/all of there are/all of these are/ ([pr#49447](https://github.com/ceph/ceph/pull/49447), Zac Dover)

- doc/conf<span></span>.py: run ditaa with java ([pr#48906](https://github.com/ceph/ceph/pull/48906), Kefu Chai)

- doc/css: add "span" padding to custom<span></span>.css ([pr#49694](https://github.com/ceph/ceph/pull/49694), Zac Dover)

- doc/css: add scroll-margin-top to dt elements ([pr#49640](https://github.com/ceph/ceph/pull/49640), Zac Dover)

- doc/css: Add scroll-margin-top to h2 html element ([pr#49662](https://github.com/ceph/ceph/pull/49662), Zac Dover)

- doc/css: add top-bar padding for h3 html element ([pr#49702](https://github.com/ceph/ceph/pull/49702), Zac Dover)

- doc/dev/cephadm: fix host maintenance enter/exit syntax ([pr#49647](https://github.com/ceph/ceph/pull/49647), Ranjini Mandyam Narasiodeyar)

- doc/dev/developer\_guide/tests-unit-tests: Add unit test caveat ([pr#49013](https://github.com/ceph/ceph/pull/49013), Matan Breizman)

- doc/dev: add context note to dev guide config ([pr#46817](https://github.com/ceph/ceph/pull/46817), Zac Dover)

- doc/dev: add Dependabot section to essentials<span></span>.rst ([pr#47043](https://github.com/ceph/ceph/pull/47043), Zac Dover)

- doc/dev: add explanation of how to use deduplication ([pr#48568](https://github.com/ceph/ceph/pull/48568), Myoungwon Oh)

- doc/dev: add IRC registration instructions ([pr#46939](https://github.com/ceph/ceph/pull/46939), Zac Dover)

- doc/dev: add submodule-update link to dev guide ([pr#48480](https://github.com/ceph/ceph/pull/48480), Zac Dover)

- doc/dev: alphabetize EC glossary ([pr#48686](https://github.com/ceph/ceph/pull/48686), Zac Dover)

- doc/dev: edit delayed-delete<span></span>.rst ([pr#47050](https://github.com/ceph/ceph/pull/47050), Zac Dover)

- doc/dev: Elaborate on boost <span></span>.deb creation ([pr#47416](https://github.com/ceph/ceph/pull/47416), David Galloway)

- doc/dev: fix graphviz diagram ([pr#48923](https://github.com/ceph/ceph/pull/48923), Zac Dover)

- doc/dev: improve Basic Workflow wording ([pr#49078](https://github.com/ceph/ceph/pull/49078), Zac Dover)

- doc/dev: improve EC glossary ([pr#48676](https://github.com/ceph/ceph/pull/48676), Zac Dover)

- doc/dev: improve lone sentence ([pr#48741](https://github.com/ceph/ceph/pull/48741), Zac Dover)

- doc/dev: improve presentation of note (git remote) ([pr#48236](https://github.com/ceph/ceph/pull/48236), Zac Dover)

- doc/dev: link to Dot User's Manual ([pr#48926](https://github.com/ceph/ceph/pull/48926), Zac Dover)

- doc/dev: refine erasure\_coding<span></span>.rst ([pr#48701](https://github.com/ceph/ceph/pull/48701), Zac Dover)

- doc/dev: remove deduplication<span></span>.rst from pacific ([pr#48571](https://github.com/ceph/ceph/pull/48571), Zac Dover)

- doc/dev: s/github/GitHub/ in essentials<span></span>.rst ([pr#47049](https://github.com/ceph/ceph/pull/47049), Zac Dover)

- doc/dev: s/master/main/ essentials<span></span>.rst dev guide ([pr#46662](https://github.com/ceph/ceph/pull/46662), Zac Dover)

- doc/dev: s/master/main/ in basic workflow ([pr#46704](https://github.com/ceph/ceph/pull/46704), Zac Dover)

- doc/dev: s/master/main/ in title ([pr#46722](https://github.com/ceph/ceph/pull/46722), Zac Dover)

- doc/dev: s/the the/the/ in basic-workflow<span></span>.rst ([pr#46934](https://github.com/ceph/ceph/pull/46934), Zac Dover)

- doc/dev: update basic-workflow<span></span>.rst ([pr#46288](https://github.com/ceph/ceph/pull/46288), Zac Dover)

- doc/dev\_guide: s/master/main in merging<span></span>.rst ([pr#46710](https://github.com/ceph/ceph/pull/46710), Zac Dover)

- doc/glosary<span></span>.rst: add "Ceph Block Device" term ([pr#48745](https://github.com/ceph/ceph/pull/48745), Zac Dover)

- doc/glossary - add "secrets" ([pr#49398](https://github.com/ceph/ceph/pull/49398), Zac Dover)

- doc/glossary<span></span>.rst: add "Ceph Dashboard" term ([pr#48749](https://github.com/ceph/ceph/pull/48749), Zac Dover)

- doc/glossary<span></span>.rst: alphabetize glossary terms ([pr#48339](https://github.com/ceph/ceph/pull/48339), Zac Dover)

- doc/glossary<span></span>.rst: define "Ceph Manager" ([pr#48765](https://github.com/ceph/ceph/pull/48765), Zac Dover)

- doc/glossary<span></span>.rst: remove duplicates ([pr#48358](https://github.com/ceph/ceph/pull/48358), Zac Dover)

- doc/glossary<span></span>.rst: remove old front matter ([pr#48755](https://github.com/ceph/ceph/pull/48755), Zac Dover)

- doc/glossary: add "BlueStore" ([pr#48778](https://github.com/ceph/ceph/pull/48778), Zac Dover)

- doc/glossary: add "ceph monitor" entry ([pr#48448](https://github.com/ceph/ceph/pull/48448), Zac Dover)

- doc/glossary: add "Ceph Object Store" ([pr#49031](https://github.com/ceph/ceph/pull/49031), Zac Dover)

- doc/glossary: add "Dashboard Module" ([pr#49138](https://github.com/ceph/ceph/pull/49138), Zac Dover)

- doc/glossary: add "FQDN" entry ([pr#49425](https://github.com/ceph/ceph/pull/49425), Zac Dover)

- doc/glossary: add "mds" term ([pr#48872](https://github.com/ceph/ceph/pull/48872), Zac Dover)

- doc/glossary: add "RADOS Cluster" ([pr#49135](https://github.com/ceph/ceph/pull/49135), Zac Dover)

- doc/glossary: add "RADOS" definition ([pr#48951](https://github.com/ceph/ceph/pull/48951), Zac Dover)

- doc/glossary: Add "SDS" ([pr#48977](https://github.com/ceph/ceph/pull/48977), Zac Dover)

- doc/glossary: add DAS ([pr#49255](https://github.com/ceph/ceph/pull/49255), Zac Dover)

- doc/glossary: add matter to "RBD" ([pr#49266](https://github.com/ceph/ceph/pull/49266), Zac Dover)

- doc/glossary: add oxford comma to "Cluster Map" ([pr#48993](https://github.com/ceph/ceph/pull/48993), Zac Dover)

- doc/glossary: beef up "Ceph Block Storage" ([pr#48965](https://github.com/ceph/ceph/pull/48965), Zac Dover)

- doc/glossary: capitalize "DAS" correctly ([pr#49604](https://github.com/ceph/ceph/pull/49604), Zac Dover)

- doc/glossary: clean OSD id-related entries ([pr#49590](https://github.com/ceph/ceph/pull/49590), Zac Dover)

- doc/glossary: Clean up "Ceph Object Storage" ([pr#49668](https://github.com/ceph/ceph/pull/49668), Zac Dover)

- doc/glossary: collate "releases" entries ([pr#49601](https://github.com/ceph/ceph/pull/49601), Zac Dover)

- doc/glossary: Define "Ceph Node" ([pr#48995](https://github.com/ceph/ceph/pull/48995), Zac Dover)

- doc/glossary: define "Ceph Object Gateway" ([pr#48902](https://github.com/ceph/ceph/pull/48902), Zac Dover)

- doc/glossary: define "Ceph OSD" ([pr#48771](https://github.com/ceph/ceph/pull/48771), Zac Dover)

- doc/glossary: define "Ceph Storage Cluster" ([pr#49003](https://github.com/ceph/ceph/pull/49003), Zac Dover)

- doc/glossary: define "OSD" ([pr#48760](https://github.com/ceph/ceph/pull/48760), Zac Dover)

- doc/glossary: define "RGW" ([pr#48961](https://github.com/ceph/ceph/pull/48961), Zac Dover)

- doc/glossary: disambiguate "OSD" ([pr#48791](https://github.com/ceph/ceph/pull/48791), Zac Dover)

- doc/glossary: disambiguate clauses ([pr#49575](https://github.com/ceph/ceph/pull/49575), Zac Dover)

- doc/glossary: fix "Ceph Client" ([pr#49033](https://github.com/ceph/ceph/pull/49033), Zac Dover)

- doc/glossary: improve "Ceph Manager Dashboard" ([pr#48825](https://github.com/ceph/ceph/pull/48825), Zac Dover)

- doc/glossary: improve "Ceph Manager" term ([pr#48812](https://github.com/ceph/ceph/pull/48812), Zac Dover)

- doc/glossary: improve "Ceph Point Release" entry ([pr#48891](https://github.com/ceph/ceph/pull/48891), Zac Dover)

- doc/glossary: improve "ceph" term ([pr#48821](https://github.com/ceph/ceph/pull/48821), Zac Dover)

- doc/glossary: improve wording ([pr#48752](https://github.com/ceph/ceph/pull/48752), Zac Dover)

- doc/glossary: link to "Ceph Manager" ([pr#49064](https://github.com/ceph/ceph/pull/49064), Zac Dover)

- doc/glossary: link to OSD material ([pr#48785](https://github.com/ceph/ceph/pull/48785), Zac Dover)

- doc/glossary: redirect entries to "Ceph OSD" ([pr#48834](https://github.com/ceph/ceph/pull/48834), Zac Dover)

- doc/glossary: remove "Ceph System" ([pr#49073](https://github.com/ceph/ceph/pull/49073), Zac Dover)

- doc/glossary: remove "Ceph Test Framework" ([pr#48842](https://github.com/ceph/ceph/pull/48842), Zac Dover)

