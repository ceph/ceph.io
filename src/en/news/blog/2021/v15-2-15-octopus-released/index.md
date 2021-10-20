---
title: "v15.2.15 Octopus released"
date: "2021-10-20"
author: "dgalloway"
---

This is the 15th backport release in the Octopus series. We recommend all users update to this release.

## Notable Changes

- The default value of `osd_client_message_cap` has been set to 256, to provide better flow control by limiting maximum number of in-flight client requests.

- A new ceph-erasure-code-tool has been added to help manually recover an object from a damaged PG.

## Changelog

- auth,mon: don't log "unable to find a keyring" error when key is given ([pr#43312](https://github.com/ceph/ceph/pull/43312), Ilya Dryomov)

- ceph-monstore-tool: use a large enough paxos/{first,last}\_committed ([issue#38219](http://tracker.ceph.com/issues/38219), [pr#43263](https://github.com/ceph/ceph/pull/43263), Kefu Chai)

- ceph-volume/tests: retry when destroying osd ([pr#42547](https://github.com/ceph/ceph/pull/42547), Guillaume Abrioux)

- ceph-volume: disable cache for blkid calls ([pr#41115](https://github.com/ceph/ceph/pull/41115), Rafał Wądołowski)

- ceph-volume: fix batch report and respect ceph<span></span>.conf config values ([pr#41715](https://github.com/ceph/ceph/pull/41715), Andrew Schoen)

- ceph-volume: fix lvm activate --all --no-systemd ([pr#43268](https://github.com/ceph/ceph/pull/43268), Dimitri Savineau)

- ceph-volume: fix lvm activate arguments ([pr#43117](https://github.com/ceph/ceph/pull/43117), Dimitri Savineau)

- ceph-volume: fix lvm migrate without args ([pr#43111](https://github.com/ceph/ceph/pull/43111), Dimitri Savineau)

- ceph-volume: fix raw list with logical partition ([pr#43088](https://github.com/ceph/ceph/pull/43088), Guillaume Abrioux, Dimitri Savineau)

- ceph-volume: lvm batch: fast\_allocations(): avoid ZeroDivisionError ([pr#42494](https://github.com/ceph/ceph/pull/42494), Jonas Zeiger)

- ceph-volume: pvs --noheadings replace pvs --no-heading ([pr#43077](https://github.com/ceph/ceph/pull/43077), FengJiankui)

- ceph-volume: remove --all ref from deactivate help ([pr#43097](https://github.com/ceph/ceph/pull/43097), Dimitri Savineau)

- ceph-volume: support no\_systemd with lvm migrate ([pr#43092](https://github.com/ceph/ceph/pull/43092), Dimitri Savineau)

- ceph-volume: work around phantom atari partitions ([pr#42752](https://github.com/ceph/ceph/pull/42752), Blaine Gardner)

- ceph<span></span>.spec: selinux scripts respect CEPH\_AUTO\_RESTART\_ON\_UPGRADE ([pr#43234](https://github.com/ceph/ceph/pull/43234), Dan van der Ster)

- cephadm: add thread ident to log messages ([pr#43133](https://github.com/ceph/ceph/pull/43133), Michael Fritch)

- cephadm: default to quay<span></span>.io, not docker<span></span>.io ([pr#42533](https://github.com/ceph/ceph/pull/42533), Sage Weil)

- cephadm: use quay, not docker ([pr#43094](https://github.com/ceph/ceph/pull/43094), Sage Weil, Juan Miguel Olmo Martínez)

- cmake: Replace boost download url ([pr#42694](https://github.com/ceph/ceph/pull/42694), Rafał Wądołowski)

- cmake: s/Python\_EXECUTABLE/Python3\_EXECUTABLE/ ([pr#43265](https://github.com/ceph/ceph/pull/43265), Michael Fritch)

- common/buffer: fix SIGABRT in  rebuild\_aligned\_size\_and\_memory ([pr#42975](https://github.com/ceph/ceph/pull/42975), Yin Congmin)

- common/options: Set osd\_client\_message\_cap to 256 ([pr#42616](https://github.com/ceph/ceph/pull/42616), Mark Nelson)

- doc/ceph-volume: add lvm migrate/new-db/new-wal ([pr#43090](https://github.com/ceph/ceph/pull/43090), Dimitri Savineau)

- Don't persist report data ([pr#42670](https://github.com/ceph/ceph/pull/42670), Brad Hubbard)

- krbd: escape udev\_enumerate\_add\_match\_sysattr values ([pr#42968](https://github.com/ceph/ceph/pull/42968), Ilya Dryomov)

- mgr/cephadm: pass --container-init to cephadm if specified ([pr#42666](https://github.com/ceph/ceph/pull/42666), Tim Serong)

- mgr/dashboard: cephadm e2e start script: add --expanded option ([pr#42794](https://github.com/ceph/ceph/pull/42794), Alfonso Martínez)

- mgr/dashboard: deprecated variable usage in Grafana dashboards ([pr#43189](https://github.com/ceph/ceph/pull/43189), Patrick Seidensal)

- mgr/dashboard: Incorrect MTU mismatch warning ([pr#43186](https://github.com/ceph/ceph/pull/43186), Aashish Sharma)

- mgr/dashboard: stats=false not working when listing buckets ([pr#42892](https://github.com/ceph/ceph/pull/42892), Avan Thakkar)

- mgr/influx: use "N/A" for unknown hostname ([pr#43369](https://github.com/ceph/ceph/pull/43369), Kefu Chai)

- mgr/prometheus: Fix metric types from gauge to counter ([pr#42674](https://github.com/ceph/ceph/pull/42674), Patrick Seidensal)

- mon/OSDMonitor: account for PG merging in epoch\_by\_pg accounting ([pr#42837](https://github.com/ceph/ceph/pull/42837), Dan van der Ster)

- mon/PGMap: remove DIRTY field in `ceph df detail` when cache tiering  is not in use ([pr#42862](https://github.com/ceph/ceph/pull/42862), Deepika Upadhyay)

- mon: return -EINVAL when handling unknown option in 'ceph osd pool get' ([pr#43266](https://github.com/ceph/ceph/pull/43266), Zhao Cuicui)

- monitoring/grafana/cluster: use per-unit max and limit values ([pr#42675](https://github.com/ceph/ceph/pull/42675), David Caro)

- monitoring: fix Physical Device Latency unit ([pr#42676](https://github.com/ceph/ceph/pull/42676), Seena Fallah)

- os/bluestore: accept undecodable multi-block bluefs transactions on log ([pr#43024](https://github.com/ceph/ceph/pull/43024), Igor Fedotov)

- os/bluestore: fix bluefs migrate command ([pr#43140](https://github.com/ceph/ceph/pull/43140), Igor Fedotov)

- os/bluestore: fix using incomplete bluefs log when dumping it ([pr#43008](https://github.com/ceph/ceph/pull/43008), Igor Fedotov)

- osd/OSD: mkfs need wait for transcation completely finish ([pr#43418](https://github.com/ceph/ceph/pull/43418), Chen Fan)

- pybind/rbd: fix mirror\_image\_get\_status ([pr#42971](https://github.com/ceph/ceph/pull/42971), Ilya Dryomov, Will Smith)

- qa/mgr/dashboard: add extra wait to test ([pr#43352](https://github.com/ceph/ceph/pull/43352), Ernesto Puerta)

- qa/suites/rados: use centos\_8<span></span>.3\_container\_tools\_3<span></span>.0<span></span>.yaml ([pr#43102](https://github.com/ceph/ceph/pull/43102), Sebastian Wagner)

- qa/tests: advanced version to 15<span></span>.2<span></span>.14 to match the latest release ([pr#42761](https://github.com/ceph/ceph/pull/42761), Yuri Weinstein)

- qa/workunits/mon/test\_mon\_config\_key: use subprocess<span></span>.run() instead of proc<span></span>.communicate() ([pr#42498](https://github.com/ceph/ceph/pull/42498), Kefu Chai)

- rbd-mirror: add perf counters to snapshot replayed ([pr#42986](https://github.com/ceph/ceph/pull/42986), Arthur Outhenin-Chalandre)

- rbd-mirror: fix potential async op tracker leak in start\_image\_replayers ([pr#42978](https://github.com/ceph/ceph/pull/42978), Mykola Golub)

- rbd-mirror: unbreak one-way snapshot-based mirroring ([pr#43314](https://github.com/ceph/ceph/pull/43314), Ilya Dryomov)

- rgw : add check for tenant provided in RGWCreateRole ([pr#43270](https://github.com/ceph/ceph/pull/43270), caolei)

- rgw: avoid infinite loop when deleting a bucket ([issue#49206](http://tracker.ceph.com/issues/49206), [pr#43272](https://github.com/ceph/ceph/pull/43272), Jeegn Chen)

- rgw: fail as expected when set/delete-bucket-website attempted on a non-exis… ([pr#43424](https://github.com/ceph/ceph/pull/43424), xiangrui meng)

- rgw: fix sts memory leak ([pr#43349](https://github.com/ceph/ceph/pull/43349), yuliyang_yewu)

- rgw: remove quota soft threshold ([pr#43271](https://github.com/ceph/ceph/pull/43271), Zulai Wang)

- rgw: when deleted obj removed in versioned bucket, extra del-marker added ([pr#43273](https://github.com/ceph/ceph/pull/43273), J. Eric Ivancich)

- run-make-check<span></span>.sh: Increase failure output log size ([pr#42849](https://github.com/ceph/ceph/pull/42849), David Galloway)

- tools/erasure-code: new tool to encode/decode files ([pr#43407](https://github.com/ceph/ceph/pull/43407), Mykola Golub)

