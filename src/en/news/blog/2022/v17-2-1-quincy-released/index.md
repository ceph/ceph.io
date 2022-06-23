---
title: "v17.2.1 Quincy released"
date: "2022-06-23"
author: "dgalloway"
tags:
  - "release"
  - "quincy"
---

This is the first backport release in the Pacific series. We recommend all users update to this release.

## Notable Changes



- The "BlueStore zero block detection" feature (first introduced to Quincy in #43337) has been turned off by default with a new global configuration called bluestore_zero_block_detection. This feature, intended for large-scale synthetic testing, does not interact well with some RBD and CephFS features. Any side effects experienced in previous Quincy versions would no longer occur, provided that the configuration remains set to false. Relevant tracker: https://tracker.ceph.com/issues/55521

- telemetry: Added new Rook metrics to the 'basic' channel to report Rook's version, Kubernetes version, node metrics, etc. See a sample report with ceph telemetry preview. Opt-in with ceph telemetry on.

  For more details, see:

  https://docs.ceph.com/en/latest/mgr/telemetry/

- Add offline dup op trimming ability in the ceph-objectstore-tool. Relevant tracker: https://tracker.ceph.com/issues/53729

- Fixed a bug with cluster logs not being populated after log rotation. Relevant tracker: https://tracker.ceph.com/issues/55383

## Changelog

- <span></span>.github/CODEOWNERS: tag core devs on core PRs ([pr#46519](https://github.com/ceph/ceph/pull/46519), Neha Ojha)

- <span></span>.github: continue on error and reorder milestone step ([pr#46447](https://github.com/ceph/ceph/pull/46447), Ernesto Puerta)

- [quincy] mgr/alerts: Add Message-Id and Date header to sent emails ([pr#46311](https://github.com/ceph/ceph/pull/46311), Lorenz Bausch)

- ceph-fuse: ignore fuse mount failure if path is already mounted ([pr#45939](https://github.com/ceph/ceph/pull/45939), Nikhilkumar Shelke)

- ceph<span></span>.in: clarify the usage of `--format` in the ceph command ([pr#46246](https://github.com/ceph/ceph/pull/46246), Laura Flores)

- ceph<span></span>.spec<span></span>.in: disable annobin plugin if compile with gcc-toolset ([pr#46377](https://github.com/ceph/ceph/pull/46377), Kefu Chai)

- ceph<span></span>.spec<span></span>.in: remove build directory at end of %install ([pr#45697](https://github.com/ceph/ceph/pull/45697), Tim Serong)

- ceph<span></span>.spec<span></span>.in: Use libthrift-devel on SUSE distros ([pr#45700](https://github.com/ceph/ceph/pull/45700), Tim Serong)

- ceph<span></span>.spec: make ninja-build package install always ([pr#45875](https://github.com/ceph/ceph/pull/45875), Deepika Upadhyay)

- Cephadm Batch Backport April ([pr#46055](https://github.com/ceph/ceph/pull/46055), Adam King, Lukas Mayer, Ken Dreyer, Redouane Kachach, Aashish Sharma, Avan Thakkar, Moritz Röhrich, Teoman ONAY, Melissa Li, Christoph Glaubitz, Guillaume Abrioux, wangyunqing, Joseph Sawaya, Matan Breizman, Pere Diaz Bou, Michael Fritch, Patrick C. F. Ernzer)

- Cephadm Batch Backport May ([pr#46360](https://github.com/ceph/ceph/pull/46360), John Mulligan, Adam King, Prashant D, Redouane Kachach, Aashish Sharma, Ramana Raja, Ville Ojamo)

- cephadm: infer the default container image during pull ([pr#45568](https://github.com/ceph/ceph/pull/45568), Michael Fritch)

- cephadm: preserve `authorized\_keys` file during upgrade ([pr#45359](https://github.com/ceph/ceph/pull/45359), Michael Fritch)

- cephadm: prometheus: The generatorURL in alerts is only using hostname ([pr#46353](https://github.com/ceph/ceph/pull/46353), Volker Theile)

- cephfs-shell: fix put and get cmd ([pr#46300](https://github.com/ceph/ceph/pull/46300), Dhairya Parmar, dparmar18)

- cephfs-top: Multiple filesystem support ([pr#46147](https://github.com/ceph/ceph/pull/46147), Neeraj Pratap Singh)

- client: add option to disable collecting and sending metrics ([pr#46476](https://github.com/ceph/ceph/pull/46476), Xiubo Li)

- cls/rgw: rgw\_dir\_suggest\_changes detects race with completion ([pr#45901](https://github.com/ceph/ceph/pull/45901), Casey Bodley)

- cmake/modules: always use the python3 specified in command line ([pr#45966](https://github.com/ceph/ceph/pull/45966), Kefu Chai)

- cmake/rgw: add missing dependency on Arrow::Arrow ([pr#46144](https://github.com/ceph/ceph/pull/46144), Casey Bodley)

- cmake: resurrect mutex debugging in all Debug builds ([pr#45913](https://github.com/ceph/ceph/pull/45913), Ilya Dryomov)

- cmake: WITH\_SYSTEM\_UTF8PROC defaults to OFF ([pr#45766](https://github.com/ceph/ceph/pull/45766), Casey Bodley)

- CODEOWNERS: add RBD team ([pr#46542](https://github.com/ceph/ceph/pull/46542), Ilya Dryomov)

- debian: include the new object\_format<span></span>.py file ([pr#46409](https://github.com/ceph/ceph/pull/46409), John Mulligan)

- doc/cephfs/add-remove-mds: added cephadm note, refined "Adding an MDS" ([pr#45879](https://github.com/ceph/ceph/pull/45879), Dhairya Parmar)

- doc/dev: update basic-workflow<span></span>.rst ([pr#46287](https://github.com/ceph/ceph/pull/46287), Zac Dover)

- doc/mgr/dashboard: Fix typo and double slash missing from URL ([pr#46075](https://github.com/ceph/ceph/pull/46075), Ville Ojamo)

- doc/start: add testing support information ([pr#45988](https://github.com/ceph/ceph/pull/45988), Zac Dover)

- doc/start: s/3/three/ in intro<span></span>.rst ([pr#46325](https://github.com/ceph/ceph/pull/46325), Zac Dover)

- doc/start: update "memory" in hardware-recs<span></span>.rst ([pr#46449](https://github.com/ceph/ceph/pull/46449), Zac Dover)

- Implement CIDR blocklisting ([pr#46469](https://github.com/ceph/ceph/pull/46469), Jos Collin, Greg Farnum)

- librbd/cache/pwl: fix bit field endianness issue ([pr#46094](https://github.com/ceph/ceph/pull/46094), Yin Congmin)

- mds: add a perf counter to record slow replies ([pr#46156](https://github.com/ceph/ceph/pull/46156), haoyixing)

- mds: include encoded stray inode when sending dentry unlink message to replicas ([issue#54046](http://tracker.ceph.com/issues/54046), [pr#46184](https://github.com/ceph/ceph/pull/46184), Venky Shankar)

- mds: reset heartbeat when fetching or committing entries ([pr#46181](https://github.com/ceph/ceph/pull/46181), Xiubo Li)

- mds: trigger to flush the mdlog in handle\_find\_ino() ([pr#46497](https://github.com/ceph/ceph/pull/46497), Xiubo Li)

- mgr/cephadm: Adding python natsort module ([pr#46065](https://github.com/ceph/ceph/pull/46065), Redouane Kachach)

- mgr/cephadm: try to get FQDN for configuration files ([pr#45665](https://github.com/ceph/ceph/pull/45665), Tatjana Dehler)

- mgr/dashboard:  don't log 3xx as errors ([pr#46453](https://github.com/ceph/ceph/pull/46453), Ernesto Puerta)

- mgr/dashboard: Compare values of MTU alert by device ([pr#45814](https://github.com/ceph/ceph/pull/45814), Aashish Sharma, Patrick Seidensal)

- mgr/dashboard: Creating and editing Prometheus AlertManager silences is buggy ([pr#46278](https://github.com/ceph/ceph/pull/46278), Volker Theile)

- mgr/dashboard: customizable log-in page text/banner ([pr#46342](https://github.com/ceph/ceph/pull/46342), Sarthak0702)

- mgr/dashboard: datatable in Cluster Host page hides wrong column on selection ([pr#45862](https://github.com/ceph/ceph/pull/45862), Sarthak0702)

- mgr/dashboard: extend daemon actions to host details ([pr#45722](https://github.com/ceph/ceph/pull/45722), Aashish Sharma, Nizamudeen A)

- mgr/dashboard: fix columns in host table  with NaN Undefined ([pr#46446](https://github.com/ceph/ceph/pull/46446), Avan Thakkar)

- mgr/dashboard: fix ssl cert validation for ingress service creation ([pr#46203](https://github.com/ceph/ceph/pull/46203), Avan Thakkar)

- mgr/dashboard: fix wrong pg status processing ([pr#46229](https://github.com/ceph/ceph/pull/46229), Ernesto Puerta)

- mgr/dashboard: form field validation icons overlap with other icons ([pr#46380](https://github.com/ceph/ceph/pull/46380), Sarthak0702)

- mgr/dashboard: highlight the search text in cluster logs ([pr#45679](https://github.com/ceph/ceph/pull/45679), Sarthak0702)

- mgr/dashboard: Imrove error message of '/api/grafana/validation' API endpoint ([pr#45957](https://github.com/ceph/ceph/pull/45957), Volker Theile)

- mgr/dashboard: introduce memory and cpu usage for daemons ([pr#46220](https://github.com/ceph/ceph/pull/46220), Aashish Sharma, Avan Thakkar)

- mgr/dashboard: Language dropdown box is partly hidden on login page ([pr#45619](https://github.com/ceph/ceph/pull/45619), Volker Theile)

- mgr/dashboard: RGW users and buckets tables are empty if the selected gateway is down ([pr#45867](https://github.com/ceph/ceph/pull/45867), Volker Theile)

- mgr/dashboard: Table columns hiding fix ([issue#51119](http://tracker.ceph.com/issues/51119), [pr#45724](https://github.com/ceph/ceph/pull/45724), Daniel Persson)

- mgr/dashboard: unselect rows in datatables ([pr#46323](https://github.com/ceph/ceph/pull/46323), Sarthak0702)

- mgr/dashboard: WDC multipath bug fixes ([pr#46455](https://github.com/ceph/ceph/pull/46455), Nizamudeen A)

- mgr/stats: be resilient to offline MDS rank-0 ([pr#45291](https://github.com/ceph/ceph/pull/45291), Jos Collin)

- mgr/telemetry: add Rook data ([pr#46486](https://github.com/ceph/ceph/pull/46486), Yaarit Hatuka)

- mgr/volumes: Fix idempotent subvolume rm ([pr#46140](https://github.com/ceph/ceph/pull/46140), Kotresh HR)

- mgr/volumes: set, get, list and remove metadata of snapshot ([pr#46508](https://github.com/ceph/ceph/pull/46508), Nikhilkumar Shelke)

- mgr/volumes: set, get, list and remove metadata of subvolume ([pr#45994](https://github.com/ceph/ceph/pull/45994), Nikhilkumar Shelke)

- mgr/volumes: Show clone failure reason in clone status command ([pr#45927](https://github.com/ceph/ceph/pull/45927), Kotresh HR)

- mon/LogMonitor: reopen log files on SIGHUP ([pr#46374](https://github.com/ceph/ceph/pull/46374), 胡玮文)

- mon/OSDMonitor: properly set last\_force\_op\_resend in stretch mode ([pr#45871](https://github.com/ceph/ceph/pull/45871), Ilya Dryomov)

- mount/conf: Fix IPv6 parsing ([pr#46113](https://github.com/ceph/ceph/pull/46113), Matan Breizman)

- os/bluestore: set upper and lower bounds on rocksdb omap iterators ([pr#46175](https://github.com/ceph/ceph/pull/46175), Adam Kupczyk, Cory Snyder)

- os/bluestore: turn `bluestore zero block detection` off by default ([pr#46468](https://github.com/ceph/ceph/pull/46468), Laura Flores)

- osd/PGLog<span></span>.cc: Trim duplicates by number of entries ([pr#46251](https://github.com/ceph/ceph/pull/46251), Nitzan Mordechai)

- osd/scrub: ignoring unsolicited DigestUpdate events ([pr#45595](https://github.com/ceph/ceph/pull/45595), Ronen Friedman)

- osd/scrub: restart snap trimming after a failed scrub ([pr#46418](https://github.com/ceph/ceph/pull/46418), Ronen Friedman)

- osd: log the number of 'dups' entries in a PG Log ([pr#46607](https://github.com/ceph/ceph/pull/46607), Radoslaw Zarzynski)

- osd: return appropriate error if the object is not manifest ([pr#46061](https://github.com/ceph/ceph/pull/46061), Myoungwon Oh)

- PendingReleaseNotes: add a note about Rook telemetry ([pr#46544](https://github.com/ceph/ceph/pull/46544), Yaarit Hatuka)

- qa/smoke: use ceph-quincy branch of s3tests ([pr#46577](https://github.com/ceph/ceph/pull/46577), Casey Bodley)

- qa/suites/rados/thrash-erasure-code-big/thrashers: add `osd max backfills` setting to mapgap and pggrow ([pr#46384](https://github.com/ceph/ceph/pull/46384), Laura Flores)

- qa/tasks/cephadm\_cases: increase timeouts in test\_cli<span></span>.py ([pr#45625](https://github.com/ceph/ceph/pull/45625), Adam King)

- qa: add filesystem/file sync stuck test support ([pr#46496](https://github.com/ceph/ceph/pull/46496), Xiubo Li)

- qa: fix teuthology master branch ref ([pr#46503](https://github.com/ceph/ceph/pull/46503), Ernesto Puerta)

- qa: remove <span></span>.teuthology\_branch file ([pr#46491](https://github.com/ceph/ceph/pull/46491), Jeff Layton)

- Quincy: client: stop forwarding the request when exceeding 256 times ([pr#46178](https://github.com/ceph/ceph/pull/46178), Xiubo Li)

- Quincy: Wip doc backport quincy release notes to quincy branch 2022 05 24 ([pr#46381](https://github.com/ceph/ceph/pull/46381), Neha Ojha, David Galloway, Josh Durgin, Ilya Dryomov, Ernesto Puerta, Sridhar Seshasayee, Zac Dover, Yaarit Hatuka)

- rbd persistent cache UX improvements (status report, metrics, flush command) ([pr#45896](https://github.com/ceph/ceph/pull/45896), Ilya Dryomov, Yin Congmin)

- revert backport of #45529 ([pr#46605](https://github.com/ceph/ceph/pull/46605), Radoslaw Zarzynski)

- rgw: OpsLogFile::stop() signals under mutex ([pr#46038](https://github.com/ceph/ceph/pull/46038), Casey Bodley)

- rgw: remove rgw\_rados\_pool\_pg\_num\_min and its use on pool creation use the cluster defaults for pg\_num\_min ([pr#46234](https://github.com/ceph/ceph/pull/46234), Casey Bodley)

- rgw: RGWCoroutine::set\_sleeping() checks for null stack ([pr#46041](https://github.com/ceph/ceph/pull/46041), Or Friedmann, Casey Bodley)

- rgw\_reshard: drop olh entries with empty name ([pr#45846](https://github.com/ceph/ceph/pull/45846), Dan van der Ster)

- rocksdb: build with rocksdb-7<span></span>.y<span></span>.z ([pr#46492](https://github.com/ceph/ceph/pull/46492), Kaleb S. KEITHLEY)

- rpm: use system libpmem on Centos 9 Stream ([pr#46212](https://github.com/ceph/ceph/pull/46212), Ilya Dryomov)

- run-make-check<span></span>.sh: enable RBD persistent caches ([pr#45992](https://github.com/ceph/ceph/pull/45992), Ilya Dryomov)

- test/rbd\_mirror: grab timer lock before calling add\_event\_after() ([pr#45905](https://github.com/ceph/ceph/pull/45905), Ilya Dryomov)

- test: fix TierFlushDuringFlush to wait until dedup\_tier is set on base pool ([issue#53855](http://tracker.ceph.com/issues/53855), [pr#45624](https://github.com/ceph/ceph/pull/45624), Sungmin Lee)

- test: No direct use of nose ([pr#46254](https://github.com/ceph/ceph/pull/46254), Steve Kowalik)

- Wip doc pr 46109 backport to quincy ([pr#46116](https://github.com/ceph/ceph/pull/46116), Ville Ojamo)
