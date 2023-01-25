---
title: "v16.2.11 Pacific released"
date: "2023-01-25"
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

- RBD: The `rbd device unmap` command gained the `--namespace` option.  Support for
  namespaces was added to RBD in Nautilus 14.2.0; and while it has been possible to
  map and unmap images in namespaces using the `image-spec` syntax since then
  but the corresponding option available in most other commands was missing.

## Changelog

- <span></span>.github/CODEOWNERS: tag core devs on core PRs ([pr#46520](https://github.com/ceph/ceph/pull/46520), Neha Ojha)

- <span></span>.github: continue on error and reorder milestone step ([pr#46448](https://github.com/ceph/ceph/pull/46448), Ernesto Puerta)

- <span></span>.readthedocs<span></span>.yml: Always build latest doc/releases pages ([pr#47443](https://github.com/ceph/ceph/pull/47443), David Galloway)

- backport of cephadm: fix osd adoption with custom cluster name ([pr#46552](https://github.com/ceph/ceph/pull/46552), Adam King)

- bluestore: Improve deferred write decision ([pr#49170](https://github.com/ceph/ceph/pull/49170), Adam Kupczyk, Igor Fedotov)

- Add mapping for ernno:13 and adding path in error msg in opendir()/cephfs<span></span>.pyx ([pr#46646](https://github.com/ceph/ceph/pull/46646), Sarthak0702)

- Catch exception if thrown by \_\_generate\_command\_map() ([pr#45893](https://github.com/ceph/ceph/pull/45893), Nikhil Kshirsagar)

- ceph-fuse: add dedicated snap stag map for each directory ([pr#46949](https://github.com/ceph/ceph/pull/46949), Xiubo Li)

- ceph mixin: backports ([pr#47868](https://github.com/ceph/ceph/pull/47868), Aswin Toni, Kefu Chai, Anthony D'Atri)

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

- cephfs: fix grammar ([pr#48982](https://github.com/ceph/ceph/pull/48982), Zac Dover)

- cephfs-data-scan: make scan\_links more verbose ([pr#48443](https://github.com/ceph/ceph/pull/48443), Mykola Golub)

- cephfs-shell: fix put and get cmd ([pr#46297](https://github.com/ceph/ceph/pull/46297), Dhairya Parmar, dparmar18)

- cephfs-shell: move source to separate subdirectory ([pr#47401](https://github.com/ceph/ceph/pull/47401), Tim Serong)

- cephfs-top: adding filesystem menu option ([pr#47998](https://github.com/ceph/ceph/pull/47998), Neeraj Pratap Singh)

- cephfs-top: display average read/write/metadata latency ([issue#48619](http://tracker.ceph.com/issues/48619), [pr#47978](https://github.com/ceph/ceph/pull/47978), Venky Shankar)

- cephfs-top: fix the rsp/wsp display ([pr#47647](https://github.com/ceph/ceph/pull/47647), Jos Collin)

- cephfs-top: make cephfs-top display scrollable ([pr#48734](https://github.com/ceph/ceph/pull/48734), Jos Collin)

- cephfs-top: Multiple filesystem support ([pr#46146](https://github.com/ceph/ceph/pull/46146), Neeraj Pratap Singh)

- client: always return ESTALE directly in handle\_reply ([pr#46557](https://github.com/ceph/ceph/pull/46557), Xiubo Li)

- client: stop forwarding the request when exceeding 256 times ([pr#46179](https://github.com/ceph/ceph/pull/46179), Xiubo Li)

- client: switch AT\_NO\_ATTR\_SYNC to AT\_STATX\_DONT\_SYNC ([pr#46679](https://github.com/ceph/ceph/pull/46679), Xiubo Li)

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

- doc/cephadm: add prompts to host-management<span></span>.rst ([pr#48590](https://github.com/ceph/ceph/pull/48590), Zac Dover)

- doc/rados: add prompts to placement-groups<span></span>.rst ([pr#49272](https://github.com/ceph/ceph/pull/49272), Zac Dover)

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

- doc/glossary: rewrite "Ceph File System" ([pr#48918](https://github.com/ceph/ceph/pull/48918), Zac Dover)

- doc/glossary: s/an/each/ where it's needed ([pr#49596](https://github.com/ceph/ceph/pull/49596), Zac Dover)

- doc/glossary: s/Ceph System/Ceph Cluster/ ([pr#49081](https://github.com/ceph/ceph/pull/49081), Zac Dover)

- doc/glossary: s/comprising/consisting of/ ([pr#49019](https://github.com/ceph/ceph/pull/49019), Zac Dover)

- doc/glossary: update "Cluster Map" ([pr#48798](https://github.com/ceph/ceph/pull/48798), Zac Dover)

- doc/glossary: update "pool/pools" ([pr#48858](https://github.com/ceph/ceph/pull/48858), Zac Dover)

- doc/index<span></span>.rst: add link to Dev Guide basic workfl ([pr#46903](https://github.com/ceph/ceph/pull/46903), Zac Dover)

- doc/install: clone-source<span></span>.rst s/master/main ([pr#48381](https://github.com/ceph/ceph/pull/48381), Zac Dover)

- doc/install: improve updating submodules procedure ([pr#48465](https://github.com/ceph/ceph/pull/48465), Zac Dover)

- doc/install: update "Official Releases" sources ([pr#49039](https://github.com/ceph/ceph/pull/49039), Zac Dover)

- doc/install: update clone-source<span></span>.rst ([pr#49378](https://github.com/ceph/ceph/pull/49378), Zac Dover)

- doc/man/ceph-rbdnamer: remove obsolete udev rule ([pr#49696](https://github.com/ceph/ceph/pull/49696), Ilya Dryomov)

- doc/man/rbd: Mention changed `bluestore\_min\_alloc\_size` ([pr#47578](https://github.com/ceph/ceph/pull/47578), Niklas Hambüchen)

- doc/man: define --num-rep, --min-rep and --max-rep ([pr#49660](https://github.com/ceph/ceph/pull/49660), Zac Dover)

- doc/mgr: add prompt directives to dashboard<span></span>.rst ([pr#47823](https://github.com/ceph/ceph/pull/47823), Zac Dover)

- doc/mgr: edit orchestrator<span></span>.rst ([pr#47781](https://github.com/ceph/ceph/pull/47781), Zac Dover)

- doc/mgr: name data source in "Man Install & Config" ([pr#48371](https://github.com/ceph/ceph/pull/48371), Zac Dover)

- doc/mgr: update prompts in dboard<span></span>.rst includes ([pr#47870](https://github.com/ceph/ceph/pull/47870), Zac Dover)

- doc/monitoring: add min vers of apps in mon stack ([pr#48062](https://github.com/ceph/ceph/pull/48062), Zac Dover, Himadri Maheshwari)

- doc/osd: Fixes the introduction for writeback mode of cache tier ([pr#48883](https://github.com/ceph/ceph/pull/48883), Mingyuan Liang)

- doc/rados/operations: add prompts to operating<span></span>.rst ([pr#47587](https://github.com/ceph/ceph/pull/47587), Zac Dover)

- doc/rados: add prompts to add-or-remove-osds ([pr#49071](https://github.com/ceph/ceph/pull/49071), Zac Dover)

- doc/rados: add prompts to add-or-rm-prompts<span></span>.rst ([pr#48986](https://github.com/ceph/ceph/pull/48986), Zac Dover)

- doc/rados: add prompts to monitoring-osd-pg<span></span>.rst ([pr#49240](https://github.com/ceph/ceph/pull/49240), Zac Dover)

- doc/rados: add prompts to add-or-rm-prompts<span></span>.rst ([pr#48980](https://github.com/ceph/ceph/pull/48980), Zac Dover)

- doc/rados: add prompts to auth-config-ref<span></span>.rst ([pr#49516](https://github.com/ceph/ceph/pull/49516), Zac Dover)

- doc/rados: add prompts to balancer<span></span>.rst ([pr#49112](https://github.com/ceph/ceph/pull/49112), Zac Dover)

- doc/rados: add prompts to bluestore-config-ref<span></span>.rst ([pr#49536](https://github.com/ceph/ceph/pull/49536), Zac Dover)

- doc/rados: add prompts to bluestore-migration<span></span>.rst ([pr#49123](https://github.com/ceph/ceph/pull/49123), Zac Dover)

- doc/rados: add prompts to cache-tiering<span></span>.rst ([pr#49125](https://github.com/ceph/ceph/pull/49125), Zac Dover)

- doc/rados: add prompts to ceph-conf<span></span>.rst ([pr#49493](https://github.com/ceph/ceph/pull/49493), Zac Dover)

- doc/rados: add prompts to change-mon-elections<span></span>.rst ([pr#49130](https://github.com/ceph/ceph/pull/49130), Zac Dover)

- doc/rados: add prompts to control<span></span>.rst ([pr#49128](https://github.com/ceph/ceph/pull/49128), Zac Dover)

- doc/rados: add prompts to crush-map<span></span>.rst ([pr#49184](https://github.com/ceph/ceph/pull/49184), Zac Dover)

- doc/rados: add prompts to devices<span></span>.rst ([pr#49188](https://github.com/ceph/ceph/pull/49188), Zac Dover)

- doc/rados: add prompts to erasure-code-clay<span></span>.rst ([pr#49206](https://github.com/ceph/ceph/pull/49206), Zac Dover)

- doc/rados: add prompts to erasure-code-isa ([pr#49208](https://github.com/ceph/ceph/pull/49208), Zac Dover)

- doc/rados: add prompts to erasure-code-jerasure<span></span>.rst ([pr#49210](https://github.com/ceph/ceph/pull/49210), Zac Dover)

- doc/rados: add prompts to erasure-code-lrc<span></span>.rst ([pr#49219](https://github.com/ceph/ceph/pull/49219), Zac Dover)

- doc/rados: add prompts to erasure-code-shec<span></span>.rst ([pr#49221](https://github.com/ceph/ceph/pull/49221), Zac Dover)

- doc/rados: add prompts to health-checks (1 of 5) ([pr#49223](https://github.com/ceph/ceph/pull/49223), Zac Dover)

- doc/rados: add prompts to health-checks (2 of 5) ([pr#49225](https://github.com/ceph/ceph/pull/49225), Zac Dover)

- doc/rados: add prompts to health-checks (3 of 5) ([pr#49227](https://github.com/ceph/ceph/pull/49227), Zac Dover)

- doc/rados: add prompts to health-checks (4 of 5) ([pr#49229](https://github.com/ceph/ceph/pull/49229), Zac Dover)

- doc/rados: add prompts to health-checks (5 of 5) ([pr#49231](https://github.com/ceph/ceph/pull/49231), Zac Dover)

- doc/rados: add prompts to librados-intro<span></span>.rst ([pr#49552](https://github.com/ceph/ceph/pull/49552), Zac Dover)

- doc/rados: add prompts to monitoring<span></span>.rst ([pr#49245](https://github.com/ceph/ceph/pull/49245), Zac Dover)

- doc/rados: add prompts to msgr2<span></span>.rst ([pr#49512](https://github.com/ceph/ceph/pull/49512), Zac Dover)

- doc/rados: add prompts to pg-repair<span></span>.rst ([pr#49247](https://github.com/ceph/ceph/pull/49247), Zac Dover)

- doc/rados: add prompts to placement-groups<span></span>.rst ([pr#49274](https://github.com/ceph/ceph/pull/49274), Zac Dover)

- doc/rados: add prompts to placement-groups<span></span>.rst (3) ([pr#49276](https://github.com/ceph/ceph/pull/49276), Zac Dover)

- doc/rados: add prompts to pools<span></span>.rst ([pr#48060](https://github.com/ceph/ceph/pull/48060), Zac Dover)

- doc/rados: add prompts to stretch-mode<span></span>.rst ([pr#49370](https://github.com/ceph/ceph/pull/49370), Zac Dover)

- doc/rados: add prompts to upmap<span></span>.rst ([pr#49372](https://github.com/ceph/ceph/pull/49372), Zac Dover)

- doc/rados: add prompts to user-management<span></span>.rst ([pr#49385](https://github.com/ceph/ceph/pull/49385), Zac Dover)

- doc/rados: clarify default EC pool from simplest ([pr#49469](https://github.com/ceph/ceph/pull/49469), Zac Dover)

- doc/rados: cleanup "erasure code profiles" ([pr#49051](https://github.com/ceph/ceph/pull/49051), Zac Dover)

- doc/rados: correct typo in python<span></span>.rst ([pr#49560](https://github.com/ceph/ceph/pull/49560), Zac Dover)

- doc/rados: fix grammar in configuration/index<span></span>.rst ([pr#48885](https://github.com/ceph/ceph/pull/48885), Zac Dover)

- doc/rados: fix prompts in erasure-code<span></span>.rst ([pr#48335](https://github.com/ceph/ceph/pull/48335), Zac Dover)

- doc/rados: improve pools<span></span>.rst ([pr#48868](https://github.com/ceph/ceph/pull/48868), Zac Dover)

- doc/rados: link to cephadm replacing osd section ([pr#49681](https://github.com/ceph/ceph/pull/49681), Zac Dover)

- doc/rados: move colon ([pr#49705](https://github.com/ceph/ceph/pull/49705), Zac Dover)

- doc/rados: refine English in crush-map-edits<span></span>.rst ([pr#48366](https://github.com/ceph/ceph/pull/48366), Zac Dover)

- doc/rados: remove prompt from php<span></span>.ini line ([pr#49562](https://github.com/ceph/ceph/pull/49562), Zac Dover)

- doc/rados: reword part of cache-tiering<span></span>.rst ([pr#48888](https://github.com/ceph/ceph/pull/48888), Zac Dover)

- doc/rados: rewrite EC intro ([pr#48324](https://github.com/ceph/ceph/pull/48324), Zac Dover)

- doc/rados: s/backend/back end/ ([pr#48782](https://github.com/ceph/ceph/pull/48782), Zac Dover)

- doc/rados: update "Pools" material ([pr#48856](https://github.com/ceph/ceph/pull/48856), Zac Dover)

- doc/rados: update bluestore-config-ref<span></span>.rst ([pr#46485](https://github.com/ceph/ceph/pull/46485), Zac Dover)

- doc/rados: update prompts in crush-map-edits<span></span>.rst ([pr#48364](https://github.com/ceph/ceph/pull/48364), Zac Dover)

- doc/rados: update prompts in network-config-ref ([pr#48158](https://github.com/ceph/ceph/pull/48158), Zac Dover)

- doc/radosgw: add prompts to multisite<span></span>.rst ([pr#48660](https://github.com/ceph/ceph/pull/48660), Zac Dover)

- doc/radosgw: add push\_endpoint for rabbitmq ([pr#48488](https://github.com/ceph/ceph/pull/48488), Zac Dover)

- doc/radosgw: improve "Ceph Object Gateway" text ([pr#48864](https://github.com/ceph/ceph/pull/48864), Zac Dover)

- doc/radosgw: improve grammar - notifications<span></span>.rst ([pr#48495](https://github.com/ceph/ceph/pull/48495), Zac Dover)

- doc/radosgw: refine "bucket notifications" ([pr#48562](https://github.com/ceph/ceph/pull/48562), Zac Dover)

- doc/radosgw: refine "notification reliability" ([pr#48530](https://github.com/ceph/ceph/pull/48530), Zac Dover)

- doc/radosgw: refine "notifications" and "events" ([pr#48580](https://github.com/ceph/ceph/pull/48580), Zac Dover)

- doc/radosgw: refine notifications<span></span>.rst - top part ([pr#48503](https://github.com/ceph/ceph/pull/48503), Zac Dover)

- doc/radosgw: update notifications<span></span>.rst - grammar ([pr#48500](https://github.com/ceph/ceph/pull/48500), Zac Dover)

- doc/radosgw: Uppercase s3 ([pr#47360](https://github.com/ceph/ceph/pull/47360), Anthony D'Atri)

- doc/radosw: improve radosgw text ([pr#48967](https://github.com/ceph/ceph/pull/48967), Zac Dover)

- doc/radowsgw: add prompts to notifications<span></span>.rst ([pr#48536](https://github.com/ceph/ceph/pull/48536), Zac Dover)

- doc/rbd: improve grammar in "immutable object<span></span>.<span></span>.<span></span>." ([pr#48970](https://github.com/ceph/ceph/pull/48970), Zac Dover)

- doc/rbd: refine "Create a Block Device Pool" ([pr#49308](https://github.com/ceph/ceph/pull/49308), Zac Dover)

- doc/rbd: refine "Create a Block Device User" ([pr#49319](https://github.com/ceph/ceph/pull/49319), Zac Dover)

- doc/rbd: refine "Create a Block Device User" ([pr#49301](https://github.com/ceph/ceph/pull/49301), Zac Dover)

- doc/rbd: refine "Creating a Block Device Image" ([pr#49347](https://github.com/ceph/ceph/pull/49347), Zac Dover)

- doc/rbd: refine "Listing Block Device Images" ([pr#49349](https://github.com/ceph/ceph/pull/49349), Zac Dover)

- doc/rbd: refine "Removing a Block Device Image" ([pr#49357](https://github.com/ceph/ceph/pull/49357), Zac Dover)

- doc/rbd: refine "Resizing a Block Device Image" ([pr#49353](https://github.com/ceph/ceph/pull/49353), Zac Dover)

- doc/rbd: refine "Restoring a Block Device Image" ([pr#49355](https://github.com/ceph/ceph/pull/49355), Zac Dover)

- doc/rbd: refine "Retrieving Image Information" ([pr#49351](https://github.com/ceph/ceph/pull/49351), Zac Dover)

- doc/rbd: refine rbd-exclusive-locks<span></span>.rst ([pr#49598](https://github.com/ceph/ceph/pull/49598), Zac Dover)

- doc/rbd: refine rbd-snapshot<span></span>.rst ([pr#49485](https://github.com/ceph/ceph/pull/49485), Zac Dover)

- doc/rbd: remove typo and ill-formed command ([pr#49366](https://github.com/ceph/ceph/pull/49366), Zac Dover)

- doc/rbd: s/wuold/would/ in rados-rbd-cmds<span></span>.rst ([pr#49592](https://github.com/ceph/ceph/pull/49592), Zac Dover)

- doc/rbd: update iSCSI gateway info ([pr#49069](https://github.com/ceph/ceph/pull/49069), Zac Dover)

- doc/releases: improve grammar in pacific<span></span>.rst ([pr#48426](https://github.com/ceph/ceph/pull/48426), Zac Dover)

- doc/releases: update pacific release notes ([pr#48404](https://github.com/ceph/ceph/pull/48404), Zac Dover)

- doc/security: improve grammar in CVE-2022-0670<span></span>.rst ([pr#48431](https://github.com/ceph/ceph/pull/48431), Zac Dover)

- doc/start: add Anthony D'Atri's suggestions ([pr#49616](https://github.com/ceph/ceph/pull/49616), Zac Dover)

- doc/start: add link-related metadocumentation ([pr#49607](https://github.com/ceph/ceph/pull/49607), Zac Dover)

- doc/start: alphabetize hardware-recs links ([pr#46340](https://github.com/ceph/ceph/pull/46340), Zac Dover)

- doc/start: improve documenting-ceph<span></span>.rst ([pr#49566](https://github.com/ceph/ceph/pull/49566), Zac Dover)

- doc/start: make OSD and MDS structures parallel ([pr#46656](https://github.com/ceph/ceph/pull/46656), Zac Dover)

- doc/start: Polish network section of hardware-recommendations<span></span>.rst ([pr#46663](https://github.com/ceph/ceph/pull/46663), Anthony D'Atri)

- doc/start: refine "Quirks of RST" ([pr#49611](https://github.com/ceph/ceph/pull/49611), Zac Dover)

- doc/start: rewrite CRUSH para ([pr#46657](https://github.com/ceph/ceph/pull/46657), Zac Dover)

- doc/start: rewrite hardware-recs networks section ([pr#46653](https://github.com/ceph/ceph/pull/46653), Zac Dover)

- doc/start: s/3/three/ in intro<span></span>.rst ([pr#46326](https://github.com/ceph/ceph/pull/46326), Zac Dover)

- doc/start: update documenting-ceph branch names ([pr#47956](https://github.com/ceph/ceph/pull/47956), Zac Dover)

- doc/start: update documenting-ceph<span></span>.rst ([pr#49571](https://github.com/ceph/ceph/pull/49571), Zac Dover)

- doc/start: update hardware recs ([pr#47122](https://github.com/ceph/ceph/pull/47122), Zac Dover)

- doc/various: update link to CRUSH pdf ([pr#48403](https://github.com/ceph/ceph/pull/48403), Zac Dover)

- doc: add disk benchmarking and cache recommendations ([pr#46348](https://github.com/ceph/ceph/pull/46348), Dan van der Ster)

- doc: backport pacific release notes into pacific branch ([pr#46484](https://github.com/ceph/ceph/pull/46484), Zac Dover, David Galloway)

- doc: Change 'ReST' to 'REST' in doc/radosgw/layout<span></span>.rst ([pr#48654](https://github.com/ceph/ceph/pull/48654), wangyingbin)

- doc: fix a couple grammatical things ([pr#49622](https://github.com/ceph/ceph/pull/49622), Brad Fitzpatrick)

- doc: fix a typo ([pr#49684](https://github.com/ceph/ceph/pull/49684), Brad Fitzpatrick)

- doc: Install graphviz ([pr#48905](https://github.com/ceph/ceph/pull/48905), David Galloway)

- doc: point to main branch for release info ([pr#48958](https://github.com/ceph/ceph/pull/48958), Patrick Donnelly)

- doc: Update release process doc to accurately reflect current process ([pr#47838](https://github.com/ceph/ceph/pull/47838), David Galloway)

- docs/start: fixes typo and empty headline in hardware recommendation … ([pr#48392](https://github.com/ceph/ceph/pull/48392), Sebastian Schmid)

- docs: correct add system user to the master zone command ([pr#48656](https://github.com/ceph/ceph/pull/48656), Salar Nosrati-Ershad)

- docs: fix doc link pointing to master in dashboard<span></span>.rst ([pr#47791](https://github.com/ceph/ceph/pull/47791), Nizamudeen A)

- doc: Wip doc pr 46109 backport to pacific ([pr#46117](https://github.com/ceph/ceph/pull/46117), Ville Ojamo)

- doc: Wip min hardware typo pacific backport 2022 05 19 ([pr#46347](https://github.com/ceph/ceph/pull/46347), Zac Dover)

- Fix data corruption in bluefs truncate() ([pr#45171](https://github.com/ceph/ceph/pull/45171), Adam Kupczyk)

- fsmap: switch to using iterator based loop ([pr#48269](https://github.com/ceph/ceph/pull/48269), Aliaksei Makarau)

- Implement CIDR blocklisting ([pr#46470](https://github.com/ceph/ceph/pull/46470), Jos Collin, Greg Farnum)

- include/buffer: include <memory> ([pr#47295](https://github.com/ceph/ceph/pull/47295), Kefu Chai, Duncan Bellamy)

- include: fix IS\_ERR on Windows ([pr#47923](https://github.com/ceph/ceph/pull/47923), Lucian Petrut)

- libcephfs: define AT\_NO\_ATTR\_SYNC back for backward compatibility ([pr#47862](https://github.com/ceph/ceph/pull/47862), Xiubo Li)

- libcephsqlite: ceph-mgr crashes when compiled with gcc12 ([pr#47271](https://github.com/ceph/ceph/pull/47271), Ganesh Maharaj Mahalingam)

- librados/watch\_notify: reconnect after socket injection ([pr#46499](https://github.com/ceph/ceph/pull/46499), Nitzan Mordechai)

- librados: rados\_ioctx\_destroy check for initialized ioctx ([pr#47451](https://github.com/ceph/ceph/pull/47451), Nitzan Mordechai)

- librbd/cache/pwl: fix clean vs bytes\_dirty cache state inconsistency ([pr#49054](https://github.com/ceph/ceph/pull/49054), Yin Congmin)

- librbd/cache/pwl: fix endianness issue ([pr#46815](https://github.com/ceph/ceph/pull/46815), Yin Congmin)

- librbd/cache/pwl: narrow the scope of m\_lock in write\_image\_cache\_state() ([pr#47939](https://github.com/ceph/ceph/pull/47939), Ilya Dryomov, Yin Congmin)

- librbd: bail from schedule\_request\_lock() if already lock owner ([pr#47161](https://github.com/ceph/ceph/pull/47161), Christopher Hoffman)

- librbd: retry ENOENT in V2\_REFRESH\_PARENT as well ([pr#47995](https://github.com/ceph/ceph/pull/47995), Ilya Dryomov)

- librbd: tweak misleading "image is still primary" error message ([pr#47247](https://github.com/ceph/ceph/pull/47247), Ilya Dryomov)

- librbd: unlink newest mirror snapshot when at capacity, bump capacity ([pr#46593](https://github.com/ceph/ceph/pull/46593), Ilya Dryomov)

- librbd: update progress for non-existent objects on deep-copy ([pr#46909](https://github.com/ceph/ceph/pull/46909), Ilya Dryomov)

- librbd: use actual monitor addresses when creating a peer bootstrap token ([pr#47911](https://github.com/ceph/ceph/pull/47911), Ilya Dryomov)

- make-dist: patch boost source to support python 3<span></span>.10  … ([pr#47027](https://github.com/ceph/ceph/pull/47027), Tim Serong, Kefu Chai)

- mds/client: fail the request if the peer MDS doesn't support getvxattr op ([pr#47891](https://github.com/ceph/ceph/pull/47891), Xiubo Li, Zack Cerza)

- mds/Server: Do not abort MDS on unknown messages ([pr#48253](https://github.com/ceph/ceph/pull/48253), Dhairya Parmar, Dhairy Parmar)

- mds: add a perf counter to record slow replies ([pr#46138](https://github.com/ceph/ceph/pull/46138), haoyixing)


- mds: damage table only stores one dentry per dirfrag ([pr#48262](https://github.com/ceph/ceph/pull/48262), Patrick Donnelly)

- mds: do not assert early on when issuing client leases ([issue#54701](http://tracker.ceph.com/issues/54701), [pr#46567](https://github.com/ceph/ceph/pull/46567), Venky Shankar)

- mds: Don't blocklist clients in any replay state ([pr#47111](https://github.com/ceph/ceph/pull/47111), Kotresh HR)

- mds: fix crash when exporting unlinked dir ([pr#47180](https://github.com/ceph/ceph/pull/47180), 胡玮文)

- mds: include encoded stray inode when sending dentry unlink message to replicas ([issue#54046](http://tracker.ceph.com/issues/54046), [pr#46183](https://github.com/ceph/ceph/pull/46183), Venky Shankar)

- mds: increment directory inode's change attr by one ([pr#48521](https://github.com/ceph/ceph/pull/48521), Ramana Raja)

- mds: notify the xattr\_version to replica MDSes ([pr#47056](https://github.com/ceph/ceph/pull/47056), Xiubo Li)

- mds: skip fetching the dirfrags if not a directory ([pr#47433](https://github.com/ceph/ceph/pull/47433), Xiubo Li)

- mds: standby-replay daemon always removed in MDSMonitor::prepare\_beacon ([pr#47282](https://github.com/ceph/ceph/pull/47282), Patrick Donnelly)

- mds: switch to use projected inode instead ([pr#47059](https://github.com/ceph/ceph/pull/47059), Xiubo Li)

- mds: wait unlink to finish to avoid conflict when creating same entries ([pr#48453](https://github.com/ceph/ceph/pull/48453), Xiubo Li)

- mgr/alerts: Add Message-Id and Date header to sent emails ([pr#46312](https://github.com/ceph/ceph/pull/46312), Lorenz Bausch)

- mgr, mgr/prometheus: Fix regression with prometheus metrics ([pr#47693](https://github.com/ceph/ceph/pull/47693), Prashant D)

- mgr, mgr/prometheus: Fix regression with prometheus metrics ([pr#46429](https://github.com/ceph/ceph/pull/46429), Prashant D)

- mgr, mon: Keep upto date metadata with mgr for MONs ([pr#47692](https://github.com/ceph/ceph/pull/47692), Laura Flores, Prashant D)

- mgr, mon: Keep upto date metadata with mgr for MONs ([pr#46427](https://github.com/ceph/ceph/pull/46427), Prashant D)

- mgr/ActivePyModules<span></span>.cc: fix cases where GIL is held while attempting to lock mutex ([pr#46302](https://github.com/ceph/ceph/pull/46302), Cory Snyder)

- mgr/cephadm: Add disk rescan feature to the orchestrator ([pr#47372](https://github.com/ceph/ceph/pull/47372), Adam King, Paul Cuzner)

- mgr/cephadm: adding logic to close ports when removing a daemon ([pr#46780](https://github.com/ceph/ceph/pull/46780), Redouane Kachach)

- mgr/cephadm: Adding logic to store grafana cert/key per node ([pr#48103](https://github.com/ceph/ceph/pull/48103), Redouane Kachach)

- mgr/cephadm: allow setting prometheus retention time ([pr#48100](https://github.com/ceph/ceph/pull/48100), Adam King)

- mgr/cephadm: capture exception when not able to list upgrade tags ([pr#46776](https://github.com/ceph/ceph/pull/46776), Redouane Kachach)

- mgr/cephadm: check if a service exists before trying to restart it ([pr#46779](https://github.com/ceph/ceph/pull/46779), Redouane Kachach)

- mgr/cephadm: clear error message when resuming upgrade ([pr#47375](https://github.com/ceph/ceph/pull/47375), Adam King)

- mgr/cephadm: don't redeploy osds seen in raw list if cephadm knows them ([pr#46545](https://github.com/ceph/ceph/pull/46545), Adam King)

- mgr/cephadm: fixing scheduler consistent hashing ([pr#46975](https://github.com/ceph/ceph/pull/46975), Redouane Kachach)

- mgr/cephadm: Raw OSD Support ([pr#45964](https://github.com/ceph/ceph/pull/45964), Guillaume Abrioux, Adam King, Sage Weil)

- mgr/cephadm: reconfig iscsi daemons if trusted\_ip\_list changes ([pr#48096](https://github.com/ceph/ceph/pull/48096), Adam King)

- mgr/cephadm: recreate osd config when redeploy/reconfiguring ([pr#47663](https://github.com/ceph/ceph/pull/47663), Adam King)

- mgr/cephadm: set dashboard grafana-api-password when user provides one ([pr#47662](https://github.com/ceph/ceph/pull/47662), Adam King)

- mgr/cephadm: staggered upgrade ([pr#46359](https://github.com/ceph/ceph/pull/46359), Adam King)

- mgr/cephadm: try to get FQDN for active instance ([pr#46775](https://github.com/ceph/ceph/pull/46775), Tatjana Dehler)

- mgr/cephadm: use host shortname for osd memory autotuning ([pr#46556](https://github.com/ceph/ceph/pull/46556), Adam King)

- mgr/dashboard:  don't log 3xx as errors ([pr#46461](https://github.com/ceph/ceph/pull/46461), Ernesto Puerta)

- mgr/dashboard:  WDC multipath bug fixes ([pr#46456](https://github.com/ceph/ceph/pull/46456), Nizamudeen A)

- mgr/dashboard: Add details to the modal which displays the `safe-to-d… ([pr#48176](https://github.com/ceph/ceph/pull/48176), Francesco Torchia)

- mgr/dashboard: add option to resolve ip addr ([pr#48220](https://github.com/ceph/ceph/pull/48220), Tatjana Dehler)

- mgr/dashboard: add required validation for frontend and monitor port ([pr#47357](https://github.com/ceph/ceph/pull/47357), Avan Thakkar)

- mgr/dashboard: Add text to empty life expectancy column ([pr#48276](https://github.com/ceph/ceph/pull/48276), Francesco Torchia)

- mgr/dashboard: allow cross origin when the url is set ([pr#49151](https://github.com/ceph/ceph/pull/49151), Nizamudeen A)

- mgr/dashboard: allow Origin url for CORS if present in config ([pr#49429](https://github.com/ceph/ceph/pull/49429), Avan Thakkar)

- mgr/dashboard: batch rbd-mirror backports ([pr#46531](https://github.com/ceph/ceph/pull/46531), Pere Diaz Bou, Pedro Gonzalez Gomez, Nizamudeen A, Melissa Li, Sarthak0702, Avan Thakkar, Aashish Sharma)

- mgr/dashboard: BDD approach for the dashboard cephadm e2e ([pr#46529](https://github.com/ceph/ceph/pull/46529), Nizamudeen A)

- mgr/dashboard: bug fixes for rbd mirroring edit and promotion/demotion ([pr#48806](https://github.com/ceph/ceph/pull/48806), Pedro Gonzalez Gomez)

- mgr/dashboard: bump moment from 2<span></span>.29<span></span>.1 to 2<span></span>.29<span></span>.3 in /src/pybind/mgr/dashboard/frontend ([pr#46717](https://github.com/ceph/ceph/pull/46717), dependabot[bot])

- mgr/dashboard: bump up teuthology ([pr#47497](https://github.com/ceph/ceph/pull/47497), Kefu Chai)

- mgr/dashboard: Creating and editing Prometheus AlertManager silences is buggy ([pr#46277](https://github.com/ceph/ceph/pull/46277), Volker Theile)

- mgr/dashboard: customizable log-in page text/banner ([pr#46343](https://github.com/ceph/ceph/pull/46343), Sarthak0702)

- mgr/dashboard: dashboard help command showing wrong syntax for login-banner ([pr#46810](https://github.com/ceph/ceph/pull/46810), Sarthak0702)

- mgr/dashboard: display helpfull message when the iframe-embedded Grafana dashboard failed to load ([pr#47008](https://github.com/ceph/ceph/pull/47008), Ngwa Sedrick Meh)

- mgr/dashboard: do not recommend throughput for ssd's only cluster ([pr#47155](https://github.com/ceph/ceph/pull/47155), Nizamudeen A)

- mgr/dashboard: don't log tracebacks on 404s ([pr#47093](https://github.com/ceph/ceph/pull/47093), Ernesto Puerta)

- mgr/dashboard: enable addition of custom Prometheus alerts ([pr#48099](https://github.com/ceph/ceph/pull/48099), Patrick Seidensal)

- mgr/dashboard: ensure limit 0 returns 0 images ([pr#47888](https://github.com/ceph/ceph/pull/47888), Pere Diaz Bou)

- mgr/dashboard: Feature 54330 osd creation workflow ([pr#46690](https://github.com/ceph/ceph/pull/46690), Pere Diaz Bou, Nizamudeen A, Sarthak0702)

- mgr/dashboard: fix \_rbd\_image\_refs caching ([pr#47636](https://github.com/ceph/ceph/pull/47636), Pere Diaz Bou)

- mgr/dashboard: fix Expected to find element: `cd-modal <span></span>.badge but never found it ([pr#48142](https://github.com/ceph/ceph/pull/48142), Nizamudeen A)

- mgr/dashboard: fix nfs exports form issues with squash field ([pr#47960](https://github.com/ceph/ceph/pull/47960), Nizamudeen A)

- mgr/dashboard: fix openapi-check ([pr#48045](https://github.com/ceph/ceph/pull/48045), Pere Diaz Bou)

- mgr/dashboard: fix rgw connect when using ssl ([issue#56970](http://tracker.ceph.com/issues/56970), [pr#48189](https://github.com/ceph/ceph/pull/48189), Henry Hirsch)

- mgr/dashboard: fix snapshot creation with duplicate name ([pr#48048](https://github.com/ceph/ceph/pull/48048), Aashish Sharma)

- mgr/dashboard: fix ssl cert validation for ingress service creation ([pr#46204](https://github.com/ceph/ceph/pull/46204), Avan Thakkar)

- mgr/dashboard: fix unmanaged service creation ([pr#48026](https://github.com/ceph/ceph/pull/48026), Nizamudeen A)

- mgr/dashboard: fix wrong pg status processing ([pr#46228](https://github.com/ceph/ceph/pull/46228), Ernesto Puerta)

- mgr/dashboard: form field validation icons overlap with other icons ([pr#46379](https://github.com/ceph/ceph/pull/46379), Sarthak0702)

- mgr/dashboard: grafana frontend e2e testing and update cypress ([pr#47721](https://github.com/ceph/ceph/pull/47721), Nizamudeen A)

- mgr/dashboard: handle the cephfs permission issue in nfs exports ([pr#48316](https://github.com/ceph/ceph/pull/48316), Nizamudeen A)

- mgr/dashboard: host list tables doesn't show all services deployed ([pr#47454](https://github.com/ceph/ceph/pull/47454), Avan Thakkar)

- mgr/dashboard: ingress backend service should list all supported services ([pr#47084](https://github.com/ceph/ceph/pull/47084), Avan Thakkar)

- mgr/dashboard: introduce memory and cpu usage for daemons ([pr#46459](https://github.com/ceph/ceph/pull/46459), Aashish Sharma, Avan Thakkar)

- mgr/dashboard: iops optimized option enabled ([pr#46737](https://github.com/ceph/ceph/pull/46737), Pere Diaz Bou)

- mgr/dashboard: iterate through copy of items ([pr#46870](https://github.com/ceph/ceph/pull/46870), Pedro Gonzalez Gomez)

- mgr/dashboard: prevent alert redirect ([pr#47145](https://github.com/ceph/ceph/pull/47145), Tatjana Dehler)

- mgr/dashboard: Pull latest languages from Transifex ([pr#46695](https://github.com/ceph/ceph/pull/46695), Volker Theile)

- mgr/dashboard: rbd image pagination ([pr#47105](https://github.com/ceph/ceph/pull/47105), Pere Diaz Bou, Nizamudeen A)

- mgr/dashboard: rbd striping setting pre-population and pop-over ([pr#47410](https://github.com/ceph/ceph/pull/47410), Vrushal Chaudhari)

- mgr/dashboard: remove token logging ([pr#47431](https://github.com/ceph/ceph/pull/47431), Pere Diaz Bou)

- mgr/dashboard: Show error on creating service with duplicate service id ([pr#47404](https://github.com/ceph/ceph/pull/47404), Aashish Sharma)

- mgr/dashboard: stop polling when page is not visible ([pr#46675](https://github.com/ceph/ceph/pull/46675), Sarthak0702)

- mgr/dashboard: unselect rows in datatables ([pr#46322](https://github.com/ceph/ceph/pull/46322), Sarthak0702)

- mgr/DaemonServer<span></span>.cc: fix typo in output gap >= max\_pg\_num\_change ([pr#47211](https://github.com/ceph/ceph/pull/47211), Kamoltat)

- mgr/prometheus: expose num objects repaired in pool ([pr#48205](https://github.com/ceph/ceph/pull/48205), Pere Diaz Bou)

- mgr/prometheus: use vendored "packaging" instead ([pr#49695](https://github.com/ceph/ceph/pull/49695), Matan Breizman)

- mgr/rbd\_support: avoid wedging the task queue if pool is removed ([pr#49056](https://github.com/ceph/ceph/pull/49056), Ilya Dryomov)

- mgr/snap\_schedule: add time zone suffix to snapshot dir name ([pr#45968](https://github.com/ceph/ceph/pull/45968), Milind Changire, Venky Shankar)

- mgr/snap\_schedule: persist all updates to RADOS ([pr#46797](https://github.com/ceph/ceph/pull/46797), Milind Changire)

- mgr/snap\_schedule: remove subvol interface ([pr#48221](https://github.com/ceph/ceph/pull/48221), Milind Changire)

- mgr/stats: be resilient to offline MDS rank-0 ([pr#45293](https://github.com/ceph/ceph/pull/45293), Jos Collin)

- mgr/stats: change in structure of perf\_stats o/p ([pr#47851](https://github.com/ceph/ceph/pull/47851), Neeraj Pratap Singh)

- mgr/stats: missing clients in perf stats command output ([pr#47866](https://github.com/ceph/ceph/pull/47866), Neeraj Pratap Singh)

- mgr/telemetry: reset health warning after re-opting-in ([pr#47307](https://github.com/ceph/ceph/pull/47307), Yaarit Hatuka)

- mgr/volumes: A few dependent mgr volumes PRs ([pr#47112](https://github.com/ceph/ceph/pull/47112), Rishabh Dave, Kotresh HR, John Mulligan, Nikhilkumar Shelke)

- mgr/volumes: Add human-readable flag to volume info command ([pr#48468](https://github.com/ceph/ceph/pull/48468), Neeraj Pratap Singh)

- mgr/volumes: add interface to check the presence of subvolumegroups/subvolumes ([pr#47460](https://github.com/ceph/ceph/pull/47460), Neeraj Pratap Singh)

- mgr/volumes: Add volume info command ([pr#47769](https://github.com/ceph/ceph/pull/47769), Neeraj Pratap Singh)

- mgr/volumes: filter internal directories in 'subvolumegroup ls' command ([pr#47512](https://github.com/ceph/ceph/pull/47512), Nikhilkumar Shelke)

- mgr/volumes: Fix idempotent subvolume rm ([pr#46139](https://github.com/ceph/ceph/pull/46139), Kotresh HR)

- mgr/volumes: Fix subvolume creation in FIPS enabled system ([pr#47369](https://github.com/ceph/ceph/pull/47369), Kotresh HR)

- mgr/volumes: remove incorrect 'size' from output of 'snapshot info' ([pr#46803](https://github.com/ceph/ceph/pull/46803), Nikhilkumar Shelke)

- mgr/volumes: set, get, list and remove metadata of snapshot ([pr#46515](https://github.com/ceph/ceph/pull/46515), Nikhilkumar Shelke)

- mgr/volumes: set, get, list and remove metadata of subvolume ([pr#45961](https://github.com/ceph/ceph/pull/45961), Nikhilkumar Shelke)

- mgr/volumes: Show clone failure reason in clone status command ([pr#45928](https://github.com/ceph/ceph/pull/45928), Kotresh HR)

- mgr/volumes: subvolume ls command crashes if groupname as '\_nogroup' ([pr#46806](https://github.com/ceph/ceph/pull/46806), Nikhilkumar Shelke)

- mgr/volumes: subvolumegroup quotas ([pr#46668](https://github.com/ceph/ceph/pull/46668), Kotresh HR)

- mgr: relax "pending\_service\_map<span></span>.epoch > service\_map<span></span>.epoch" assert ([pr#46688](https://github.com/ceph/ceph/pull/46688), Mykola Golub)

- mirror snapshot schedule and trash purge schedule fixes ([pr#46778](https://github.com/ceph/ceph/pull/46778), Ilya Dryomov)

- mon/ConfigMonitor: fix config get key with whitespaces ([pr#47380](https://github.com/ceph/ceph/pull/47380), Nitzan Mordechai)

- mon/Elector<span></span>.cc: Compress peer >= rank\_size sanity check into send\_peer\_ping ([pr#49444](https://github.com/ceph/ceph/pull/49444), Kamoltat)

- mon/Elector: Added sanity check when pinging a peer monitor ([pr#48320](https://github.com/ceph/ceph/pull/48320), Kamoltat)

- mon/Elector: Change how we handle removed\_ranks and notify\_rank\_removed() ([pr#49312](https://github.com/ceph/ceph/pull/49312), Kamoltat)

- mon/Elector: notify\_rank\_removed erase rank from both live\_pinging and dead\_pinging sets for highest ranked MON ([pr#47087](https://github.com/ceph/ceph/pull/47087), Kamoltat)

- mon/MDSMonitor: fix standby-replay mds being removed from MDSMap unexpectedly ([pr#48270](https://github.com/ceph/ceph/pull/48270), 胡玮文)

- mon/OSDMonitor: Added extra check before mon<span></span>.go\_recovery\_stretch\_mode() ([pr#48803](https://github.com/ceph/ceph/pull/48803), Kamoltat)

- mon/OSDMonitor: Ensure kvmon() is writeable before handling "osd new" cmd ([pr#46691](https://github.com/ceph/ceph/pull/46691), Sridhar Seshasayee)

- mon/OSDMonitor: properly set last\_force\_op\_resend in stretch mode ([pr#45870](https://github.com/ceph/ceph/pull/45870), Ilya Dryomov)

- mon: allow a MON\_DOWN grace period after cluster mkfs ([pr#48558](https://github.com/ceph/ceph/pull/48558), Sage Weil)

- monitoring/ceph-mixin: add RGW host to label info ([pr#48035](https://github.com/ceph/ceph/pull/48035), Tatjana Dehler)

- monitoring/ceph-mixin: OSD overview typo fix ([pr#47386](https://github.com/ceph/ceph/pull/47386), Tatjana Dehler)

- mount/conf: Fix IPv6 parsing ([pr#46112](https://github.com/ceph/ceph/pull/46112), Matan Breizman)

- msg: fix deadlock when handling existing but closed v2 connection ([pr#48254](https://github.com/ceph/ceph/pull/48254), Radosław Zarzyński)

- msg: Fix Windows IPv6 support ([pr#47303](https://github.com/ceph/ceph/pull/47303), Lucian Petrut)

- msg: Log at higher level when Throttle::get\_or\_fail() fails ([pr#47764](https://github.com/ceph/ceph/pull/47764), Brad Hubbard)

- msg: reset ProtocolV2's frame assembler in appropriate thread ([pr#48255](https://github.com/ceph/ceph/pull/48255), Radoslaw Zarzynski)

- os/bluestore:  proper locking for Allocators' dump methods ([pr#48167](https://github.com/ceph/ceph/pull/48167), Igor Fedotov)

- os/bluestore: add bluefs-import command ([pr#47875](https://github.com/ceph/ceph/pull/47875), Adam Kupczyk, zhang daolong)

- os/bluestore: Always update the cursor position in AVL near-fit search ([pr#46642](https://github.com/ceph/ceph/pull/46642), Mark Nelson)

- os/bluestore: Better readability of perf output ([pr#47259](https://github.com/ceph/ceph/pull/47259), Adam Kupczyk)

- os/bluestore: BlueFS: harmonize log read and writes modes ([pr#49431](https://github.com/ceph/ceph/pull/49431), Adam Kupczyk)

- os/bluestore: do not signal deleted dirty file to bluefs log ([pr#48168](https://github.com/ceph/ceph/pull/48168), Igor Fedotov)

- os/bluestore: fix AU accounting in bluestore\_cache\_other mempool ([pr#47337](https://github.com/ceph/ceph/pull/47337), Igor Fedotov)

- os/bluestore: Fix collision between BlueFS and BlueStore deferred writes ([pr#47296](https://github.com/ceph/ceph/pull/47296), Adam Kupczyk)

- os/bluestore: fix improper bluefs log size tracking in volume selector ([pr#45408](https://github.com/ceph/ceph/pull/45408), Igor Fedotov)

- os/bluestore: get rid of fake onode nref increment for pinned entry ([pr#47556](https://github.com/ceph/ceph/pull/47556), Igor Fedotov)

- os/bluestore: incremental update mode for bluefs log ([pr#48915](https://github.com/ceph/ceph/pull/48915), Adam Kupczyk)

- os/bluestore: update perf counter priorities ([pr#47095](https://github.com/ceph/ceph/pull/47095), Laura Flores)

- os/bluestore: use direct write in BlueStore::\_write\_bdev\_label ([pr#48278](https://github.com/ceph/ceph/pull/48278), luo rixin)

- osd, mds: fix the "heap" admin cmd printing always to error stream ([pr#48106](https://github.com/ceph/ceph/pull/48106), Radoslaw Zarzynski)

- osd, tools, kv: non-aggressive, on-line trimming of accumulated dups ([pr#47701](https://github.com/ceph/ceph/pull/47701), Radoslaw Zarzynski, Nitzan Mordechai)

- osd/PGLog<span></span>.cc: Trim duplicates by number of entries ([pr#46252](https://github.com/ceph/ceph/pull/46252), Nitzan Mordechai)

- osd/scrub: mark PG as being scrubbed, from scrub initiation to Inacti… ([pr#46767](https://github.com/ceph/ceph/pull/46767), Ronen Friedman)

- osd/scrub: Reintroduce scrub starts message ([pr#48070](https://github.com/ceph/ceph/pull/48070), Prashant D)

- osd/scrub: use the actual active set when requesting replicas ([pr#48544](https://github.com/ceph/ceph/pull/48544), Ronen Friedman)

- osd/SnapMapper: fix legacy key conversion in snapmapper class ([pr#47134](https://github.com/ceph/ceph/pull/47134), Manuel Lausch, Matan Breizman)

- osd: add created\_at meta ([pr#49144](https://github.com/ceph/ceph/pull/49144), Alex Marangone)

- osd: fix wrong input when calling recover\_object() ([pr#46120](https://github.com/ceph/ceph/pull/46120), Myoungwon Oh)

- osd: log the number of 'dups' entries in a PG Log ([pr#46608](https://github.com/ceph/ceph/pull/46608), Radoslaw Zarzynski)

- osd: remove invalid put on message ([pr#47525](https://github.com/ceph/ceph/pull/47525), Nitzan Mordechai)

- osd: set per\_pool\_stats true when OSD has no PG ([pr#48250](https://github.com/ceph/ceph/pull/48250), jindengke, lmgdlmgd)

- osd/scrub: late-arriving reservation grants are not an error ([pr#46873](https://github.com/ceph/ceph/pull/46873), Ronen Friedman)

- osd/scrubber/pg\_scrubber<span></span>.cc: fix bug where scrub machine gets stuck ([pr#46845](https://github.com/ceph/ceph/pull/46845), Cory Snyder)

- rgw: on FIPS enabled, fix segfault performing s3 multipart PUT ([pr#46715](https://github.com/ceph/ceph/pull/46715), Mark Kogan)

- mds: clear MDCache::rejoin\\_\*\_q queues before recovering file inodes ([pr#46682](https://github.com/ceph/ceph/pull/46682), Xiubo Li)

- mds: flush mdlog if locked and still has wanted caps not satisfied ([pr#46423](https://github.com/ceph/ceph/pull/46423), Xiubo Li)

- mds: reset heartbeat when fetching or committing entries ([pr#46180](https://github.com/ceph/ceph/pull/46180), Xiubo Li)

- mds: trigger to flush the mdlog in handle\_find\_ino() ([pr#46424](https://github.com/ceph/ceph/pull/46424), Xiubo Li)

- PendingReleaseNotes: document online and offline trimming of PG Log's… ([pr#48020](https://github.com/ceph/ceph/pull/48020), Radoslaw Zarzynski)

- pybind/mgr/cephadm/serve: don't remove ceph<span></span>.conf which leads to qa failure ([pr#46974](https://github.com/ceph/ceph/pull/46974), Dhairya Parmar)

- pybind/mgr/dashboard: move pytest into requirements<span></span>.txt ([pr#48081](https://github.com/ceph/ceph/pull/48081), Kefu Chai)

- pybind/mgr/pg\_autoscaler: change overlapping roots to warning ([pr#47522](https://github.com/ceph/ceph/pull/47522), Kamoltat)

- pybind/mgr: fix flake8 ([pr#47393](https://github.com/ceph/ceph/pull/47393), Avan Thakkar)

- pybind: fix typo in cephfs<span></span>.pyx ([pr#48953](https://github.com/ceph/ceph/pull/48953), Zac Dover)

- pybind/mgr: fixup after upgrading tox versions ([pr#49363](https://github.com/ceph/ceph/pull/49363), Adam King, Kefu Chai)

- pybind/mgr: tox and test fixes ([pr#49542](https://github.com/ceph/ceph/pull/49542), Kefu Chai)

- pybind/rados: notify callback reconnect ([pr#48112](https://github.com/ceph/ceph/pull/48112), Nitzan Mordechai)

- pybind: add wrapper for rados\_write\_op\_omap\_cmp ([pr#48376](https://github.com/ceph/ceph/pull/48376), Sandy Kaur)

- python-common: Add 'KB' to supported suffixes in SizeMatcher ([pr#48243](https://github.com/ceph/ceph/pull/48243), Tim Serong)

- python-common: allow crush device class to be set from osd service spec ([pr#46555](https://github.com/ceph/ceph/pull/46555), Cory Snyder)

- qa: add filesystem/file sync stuck test support ([pr#46425](https://github.com/ceph/ceph/pull/46425), Xiubo Li)

- qa/cephadm: remove fsid dir before bootstrap in test\_cephadm<span></span>.sh ([pr#48101](https://github.com/ceph/ceph/pull/48101), Adam King)

- qa/cephfs: fallback to older way of get\_op\_read\_count ([pr#46901](https://github.com/ceph/ceph/pull/46901), Dhairya Parmar)

- qa/import-legacy: install python3 package for nautilus ceph ([pr#47528](https://github.com/ceph/ceph/pull/47528), Xiubo Li)

- qa/suites/rados/thrash-erasure-code-big/thrashers: add `osd max backfills` setting to mapgap and pggrow ([pr#46391](https://github.com/ceph/ceph/pull/46391), Laura Flores)

- qa/suites/rbd/pwl-cache: ensure recovery is actually tested ([pr#47128](https://github.com/ceph/ceph/pull/47128), Ilya Dryomov, Yin Congmin)

- qa/suites/rbd: disable workunit timeout for dynamic\_features\_no\_cache ([pr#47158](https://github.com/ceph/ceph/pull/47158), Ilya Dryomov)

- qa/suites/rbd: place cache file on tmpfs for xfstests ([pr#46597](https://github.com/ceph/ceph/pull/46597), Ilya Dryomov)

- qa/tasks/ceph\_manager<span></span>.py: increase test\_pool\_min\_size timeout ([pr#47446](https://github.com/ceph/ceph/pull/47446), Kamoltat)

- qa/tasks/kubeadm: set up tigera resources via kubectl create ([pr#48097](https://github.com/ceph/ceph/pull/48097), John Mulligan)

- qa/tasks/rbd\_fio: bump default to fio 3<span></span>.32 ([pr#48385](https://github.com/ceph/ceph/pull/48385), Ilya Dryomov)

- qa/workunits/cephadm: update test\_repos master -> main ([pr#47320](https://github.com/ceph/ceph/pull/47320), Adam King)

- qa/workunits/rados: specify redirect in curl command ([pr#49139](https://github.com/ceph/ceph/pull/49139), Laura Flores)

- qa: Fix test\_subvolume\_group\_ls\_filter\_internal\_directories ([pr#48328](https://github.com/ceph/ceph/pull/48328), Kotresh HR)

- qa: Fix test\_subvolume\_snapshot\_info\_if\_orphan\_clone ([pr#48647](https://github.com/ceph/ceph/pull/48647), Kotresh HR)

- qa: Fix test\_subvolume\_snapshot\_info\_if\_orphan\_clone ([pr#48417](https://github.com/ceph/ceph/pull/48417), Kotresh HR)

- qa: fix teuthology master branch ref ([pr#46504](https://github.com/ceph/ceph/pull/46504), Ernesto Puerta)

- qa: ignore disk quota exceeded failure in test ([pr#48165](https://github.com/ceph/ceph/pull/48165), Nikhilkumar Shelke)

- qa: remove <span></span>.teuthology\_branch file ([pr#46490](https://github.com/ceph/ceph/pull/46490), Jeff Layton)

- qa: run e2e test on centos only ([pr#49337](https://github.com/ceph/ceph/pull/49337), Kefu Chai)

- qa: switch back to git protocol for qemu-xfstests ([pr#49543](https://github.com/ceph/ceph/pull/49543), Ilya Dryomov)

- qa: switch to https protocol for repos' server ([pr#49470](https://github.com/ceph/ceph/pull/49470), Xiubo Li)

- qa: wait rank 0 to become up:active state before mounting fuse client ([pr#46802](https://github.com/ceph/ceph/pull/46802), Xiubo Li)

- radosgw-admin: 'reshard list' doesn't log ENOENT errors ([pr#45451](https://github.com/ceph/ceph/pull/45451), Casey Bodley)

- rbd-fuse: librados will filter out -r option from command-line ([pr#46953](https://github.com/ceph/ceph/pull/46953), wanwencong)

- rbd-mirror: don't prune non-primary snapshot when restarting delta sync ([pr#46590](https://github.com/ceph/ceph/pull/46590), Ilya Dryomov)

- rbd-mirror: generally skip replay/resync if remote image is not primary ([pr#46813](https://github.com/ceph/ceph/pull/46813), Ilya Dryomov)

- rbd-mirror: remove bogus completed\_non\_primary\_snapshots\_exist check ([pr#47118](https://github.com/ceph/ceph/pull/47118), Ilya Dryomov)

- rbd-mirror: resume pending shutdown on error in snapshot replayer ([pr#47913](https://github.com/ceph/ceph/pull/47913), Ilya Dryomov)

- rbd: device map/unmap --namespace handling fixes ([pr#48459](https://github.com/ceph/ceph/pull/48459), Ilya Dryomov, Stefan Chivu)

- rbd: don't default empty pool name unless namespace is specified ([pr#47143](https://github.com/ceph/ceph/pull/47143), Ilya Dryomov)

- rbd: find\_action() should sort actions first ([pr#47583](https://github.com/ceph/ceph/pull/47583), Ilya Dryomov)

- rgw: Swift retarget needs bucket set on object ([pr#47230](https://github.com/ceph/ceph/pull/47230), Daniel Gryniewicz)

- rgw: Fix crashes with Sync policy APIs ([pr#47994](https://github.com/ceph/ceph/pull/47994), Soumya Koduri)

- rgw/notifications: Change in multipart upload notification behavior ([pr#47175](https://github.com/ceph/ceph/pull/47175), Kalpesh Pandya)

- rgw/rgw\_string<span></span>.h: add missing includes for alpine and boost 1<span></span>.75 ([pr#47304](https://github.com/ceph/ceph/pull/47304), Duncan Bellamy)

- rgw/sts: adding code for aws:RequestTags as part ([pr#47746](https://github.com/ceph/ceph/pull/47746), Kalpesh Pandya, Pritha Srivastava)

- rgw: address bug where object puts could write to decommissioned shard ([pr#48663](https://github.com/ceph/ceph/pull/48663), J. Eric Ivancich)

- rgw: better tenant id from the uri on anonymous access ([pr#47341](https://github.com/ceph/ceph/pull/47341), Rafał Wądołowski, Marcus Watts)

- rgw: check bucket shard init status in RGWRadosBILogTrimCR ([pr#44907](https://github.com/ceph/ceph/pull/44907), Mykola Golub)

- rgw: check object storage\_class when check\_disk\_state ([pr#46579](https://github.com/ceph/ceph/pull/46579), Huber-ming)

- rgw: data sync uses yield\_spawn\_window() ([pr#45713](https://github.com/ceph/ceph/pull/45713), Casey Bodley)

- rgw: do not permit locked object version removal ([pr#47041](https://github.com/ceph/ceph/pull/47041), Igor Fedotov)

- rgw: fix bool/int logic error when calling get\_obj\_head\_ioctx ([pr#48230](https://github.com/ceph/ceph/pull/48230), J. Eric Ivancich)

- rgw: fix bug where variable referenced after data moved out ([pr#48229](https://github.com/ceph/ceph/pull/48229), J. Eric Ivancich)

- rgw: fix data corruption due to network jitter ([pr#48274](https://github.com/ceph/ceph/pull/48274), Shasha Lu)

- rgw: Fix data race in ChangeStatus ([pr#47196](https://github.com/ceph/ceph/pull/47196), Adam C. Emerson)

- rgw: fix ListBucketMultiparts response with common prefixes ([pr#44558](https://github.com/ceph/ceph/pull/44558), Casey Bodley)

- rgw: fix segfault in OpsLogRados::log when realm is reloaded ([pr#45410](https://github.com/ceph/ceph/pull/45410), Cory Snyder)

- rgw: fix self-comparison for RGWCopyObj optimization ([pr#43802](https://github.com/ceph/ceph/pull/43802), Casey Bodley)

- rgw: Guard against malformed bucket URLs ([pr#47194](https://github.com/ceph/ceph/pull/47194), Adam C. Emerson)

- rgw: initialize rgw\_log\_entry::identity\_type ([pr#49142](https://github.com/ceph/ceph/pull/49142), Casey Bodley)

- rgw: log access key id in ops logs ([pr#46622](https://github.com/ceph/ceph/pull/46622), Cory Snyder)

- rgw: log deletion status of individual objects in multi object delete request ([pr#48348](https://github.com/ceph/ceph/pull/48348), Cory Snyder)

- rgw: maintain object instance within RGWRadosObject::get\_obj\_state method ([pr#47266](https://github.com/ceph/ceph/pull/47266), Casey Bodley, Cory Snyder)

- rgw: OpsLogFile::stop() signals under mutex ([pr#46039](https://github.com/ceph/ceph/pull/46039), Casey Bodley)

- rgw: remove rgw\_rados\_pool\_pg\_num\_min and its use on pool creation use the cluster defaults for pg\_num\_min ([pr#46235](https://github.com/ceph/ceph/pull/46235), Casey Bodley)

- rgw: reopen ops log file on sighup ([pr#46619](https://github.com/ceph/ceph/pull/46619), Cory Snyder)

- rgw: return OK on consecutive complete-multipart reqs ([pr#45486](https://github.com/ceph/ceph/pull/45486), Mark Kogan)

- rgw: RGWCoroutine::set\_sleeping() checks for null stack ([pr#46040](https://github.com/ceph/ceph/pull/46040), Or Friedmann, Casey Bodley)

- rgw: splitting gc chains into smaller parts to prevent ([pr#48240](https://github.com/ceph/ceph/pull/48240), Pritha Srivastava)

- rgw: x-amz-date change breaks certain cases of aws sig v4 ([pr#48313](https://github.com/ceph/ceph/pull/48313), Marcus Watts)

- rgw\_reshard: drop olh entries with empty name ([pr#45847](https://github.com/ceph/ceph/pull/45847), Dan van der Ster, Casey Bodley)

- rgw\_rest\_user\_policy: Fix GetUserPolicy & ListUserPolicies responses ([pr#47234](https://github.com/ceph/ceph/pull/47234), Sumedh A. Kulkarni)

- rgwlc:  don't incorrectly expire delete markers when !next\_key\_name ([pr#47231](https://github.com/ceph/ceph/pull/47231), Matt Benjamin)

- rgwlc: fix segfault resharding during lc ([pr#46744](https://github.com/ceph/ceph/pull/46744), Mark Kogan)

- rpm: use system libpmem on Centos 9 Stream ([pr#46211](https://github.com/ceph/ceph/pull/46211), Ilya Dryomov)

- run-make-check<span></span>.sh: enable RBD persistent caches ([pr#45991](https://github.com/ceph/ceph/pull/45991), Ilya Dryomov)

- SimpleRADOSStriper: Avoid moving bufferlists by using deque in read() ([pr#48187](https://github.com/ceph/ceph/pull/48187), Matan Breizman)

- test/bufferlist: ensure rebuild\_aligned\_size\_and\_memory() always rebuilds ([pr#46215](https://github.com/ceph/ceph/pull/46215), Radoslaw Zarzynski)

- test/cli-integration/rbd: iSCSI REST API responses aren't pretty-printed anymore ([pr#47920](https://github.com/ceph/ceph/pull/47920), Ilya Dryomov)

- test/{librbd, rgw}: increase delay between and number of bind attempts ([pr#48024](https://github.com/ceph/ceph/pull/48024), Ilya Dryomov, Kefu Chai)

- test: bump DecayCounter<span></span>.steady acceptable error ([pr#48031](https://github.com/ceph/ceph/pull/48031), Patrick Donnelly)

- test: fix TierFlushDuringFlush to wait until dedup\_tier is set on bas… ([issue#53855](http://tracker.ceph.com/issues/53855), [pr#46748](https://github.com/ceph/ceph/pull/46748), Myoungwon Oh, Sungmin Lee)

- test: No direct use of nose ([pr#46255](https://github.com/ceph/ceph/pull/46255), Steve Kowalik, Kefu Chai)

- tooling: Change mrun to use bash ([pr#46077](https://github.com/ceph/ceph/pull/46077), Adam C. Emerson)

- tools: ceph-objectstore-tool is able to trim solely pg log dups' entries ([pr#46631](https://github.com/ceph/ceph/pull/46631), Radosław Zarzyński, Radoslaw Zarzynski)

- Updates to fix `make check` failures ([pr#47803](https://github.com/ceph/ceph/pull/47803), Tim Serong, Kefu Chai, Willem Jan Withagen, Nathan Cutler, Boris Ranto, Laura Flores, Pete Zaitcev)

- v16<span></span>.2<span></span>.10 ([pr#47220](https://github.com/ceph/ceph/pull/47220), Kotresh HR, Seena Fallah)

- v16<span></span>.2<span></span>.9 ([pr#46336](https://github.com/ceph/ceph/pull/46336), Cory Snyder)

- win32\_deps\_build<span></span>.sh: master -> main for wnbd ([pr#46762](https://github.com/ceph/ceph/pull/46762), Ilya Dryomov)
