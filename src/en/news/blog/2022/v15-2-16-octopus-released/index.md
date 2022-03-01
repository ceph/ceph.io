---
title: "v15.2.16 Octopus released"
date: "2022-03-01"
author: "akraitma"
---

This is the 16th backport release in the Octopus series. We recommend all
users update to this release.

Notable Changes
---------------

* Fix in the read lease logic to prevent PGs from going into WAIT state
  after OSD restart.

* Several bug fixes in BlueStore, including a fix for object listing bug, which
  could cause stat mismatch scrub errors.

Changelog
---------

- Fix data corruption in bluefs truncate() (pr#44860, Adam Kupczyk)

- Octopus: mds: just respawn mds daemon when osd op requests timeout (pr#43785, Xiubo Li)

- admin/doc-requirements.txt: pin Sphinx at 3.5.4 (pr#43758, Casey Bodley, Kefu Chai, Nizamudeen A, Varsha Rao)

- backport diff-iterate include_parent tests (pr#44673, Ilya Dryomov)

- ceph-volume: get_first_lv() refactor (pr#43959, Guillaume Abrioux)

- ceph-volume: don't use MultiLogger in find_executable_on_host() (pr#44766, Guillaume Abrioux)

- ceph-volume: fix a typo causing AttributeError (pr#43950, Taha Jahangir)

- ceph-volume: fix bug with miscalculation of required db/wal slot size for VGs with multiple PVs (pr#43947, Guillaume Abrioux, Cory Snyder)

- ceph-volume: fix regression introcuded via #43536 (pr#44757, Guillaume Abrioux)

- ceph-volume: honour osd_dmcrypt_key_size option (pr#44974, Guillaume Abrioux)

- ceph-volume: human_readable_size() refactor (pr#44210, Guillaume Abrioux)

- ceph-volume: improve mpath devices support (pr#44791, Guillaume Abrioux)

- ceph-volume: make it possible to skip needs_root() (pr#44320, Guillaume Abrioux)

- ceph-volume: show RBD devices as not available (pr#44709, Michael Fritch)

- ceph-volume: util/prepare fix osd_id_available() (pr#43952, Guillaume Abrioux)

- cephadm/ceph-volume: do not use lvm binary in containers (pr#43953, Guillaume Abrioux)

- cephadm: Fix iscsi client caps (allow mgr <service status> calls) (pr#43822, Juan Miguel Olmo Martínez)

- cephfs: client: Fix executeable access check for the root user (pr#41295, Kotresh HR)

- cls/journal: skip disconnected clients when calculating min_commit_position (pr#44689, Mykola Golub)

- common/PriorityCache: low perf counters priorities for submodules (pr#44176, Igor Fedotov)

- doc: Use older mistune (pr#44227, David Galloway)

- doc: prerequisites fix for cephFS mount (pr#44271, Nikhilkumar Shelke)

- librbd/object_map: rbd diff between two snapshots lists entire image content (pr#43806, Sunny Kumar)

- librbd: diff-iterate reports incorrect offsets in fast-diff mode (pr#44548, Ilya Dryomov)

- mds: Add new flag to MClientSession (pr#43252, Kotresh HR)

- mds: PurgeQueue.cc fix for 32bit compilation (pr#44169, Duncan Bellamy)

- mds: do not trim stray dentries during opening the root (pr#43816, Xiubo Li)

- mds: skip journaling blocklisted clients when in replay state (pr#43842, Venky Shankar)

- mgr/dashboard/api: set a UTF-8 locale when running pip (pr#43607, Kefu Chai)

- mgr/dashboard: all pyfakefs must be pinned on same version (pr#44159, Rishabh Dave)

- mgr/dashboard: upgrade Cypress to the latest stable version (pr#44373, Alfonso Martínez)

- mgr: Add check to prevent mgr from crashing (pr#43446, Aswin Toni)

- mgr: fix locking for MetadataUpdate::finish (pr#44720, Sage Weil)

- mgr: set debug_mgr=2/5 (so INFO goes to mgr log by default) (pr#42677, Sage Weil)

- mon/MgrStatMonitor: do not spam subscribers (mgr) with service_map (pr#44722, Sage Weil)

- mon/MgrStatMonitor: ignore MMgrReport from non-active mgr (pr#43861, Sage Weil)

- mon/OSDMonitor: avoid null dereference if stats are not available (pr#44700, Josh Durgin)

- mon: prevent new sessions during shutdown (pr#44544, Sage Weil)

- msg/async: allow connection reaping to be tuned; fix cephfs test (pr#43310, Sage Weil, Gerald Yang)

- msgr/async: fix unsafe access in unregister_conn() (pr#43325, Sage Weil, Gerald Yang)

- os/bluestore/AvlAllocator: introduce bluestore_avl_alloc_ff_max_* options (pr#43747, Kefu Chai, Mauricio Faria de Oliveira, Adam Kupczyk, Xue Yantao)

- os/bluestore: _do_write_small fix head_pad (pr#43757, dheart)

- os/bluestore: avoid premature onode release (pr#44724, Igor Fedotov)

- os/bluestore: cap omap naming scheme upgrade transactoin (pr#42958, Adam Kupczyk, Igor Fedotov)

- os/bluestore: fix additional errors during missed shared blob repair (pr#43887, Igor Fedotov)

- os/bluestore: fix writing to invalid offset when repairing (pr#43885, Igor Fedotov)

- os/bluestore: list obj which equals to pend (pr#44978, Mykola Golub, Kefu Chai)

- os/bluestore: make shared blob fsck much less RAM-greedy (pr#44614, Igor Fedotov)

- os/bluestore: use proper prefix when removing undecodable Share Blob (pr#43883, Igor Fedotov)

- osd/OSDMap.cc: clean up pg_temp for nonexistent pgs (pr#44097, Cory Snyder)

- osd/PeeringState: separate history's pruub from pg's (pr#44585, Sage Weil)

- osd: fix 'ceph osd stop <osd.nnn>' doesn't take effect (pr#43962, tan changzhi)

- osd: fix partial recovery become whole object recovery after restart osd (pr#44165, Jianwei Zhang)

- osd: re-cache peer_bytes on every peering state activate (pr#43438, Mykola Golub)

- osd: set r only if succeed in FillInVerifyExtent (pr#44174, yanqiang-ux)

- osdc: add set_error in BufferHead, when split set_error to right (pr#44726, jiawd)

- pybind/mgr/balancer: define Plan.{dump,show}() (pr#43965, Kefu Chai)

- qa/ceph-ansible: Bump OS version for centos (pr#43658, Brad Hubbard)

- qa/ceph-ansible: Pin to last compatible stable release (pr#43557, Brad Hubbard)

- qa/distros: Remove stale kubic distros (pr#43788, Sebastian Wagner)

- qa/mgr/dashboard/test_pool: don't check HEALTH_OK (pr#43441, Ernesto Puerta)

- qa/rgw: Fix vault token file access.case (issue#51539, pr#43963, Marcus Watts)

- qa/rgw: bump tempest version to resolve dependency issue (pr#43967, Casey Bodley)

- qa/rgw: octopus branch targets ceph-octopus branch of java_s3tests (pr#43810, Casey Bodley)

- qa/run-tox-mgr-dashboard: Do not write to /tmp/test_sanitize_password… (pr#44728, Kevin Zhao)

- qa/run_xfstests_qemu.sh: stop reporting success without actually running any tests (pr#44595, Ilya Dryomov)

- qa/suites/rados/cephadm: use centos 8.stream (pr#44929, Adam King, Sage Weil)

- qa: account for split of the kclient "metrics" debugfs file (pr#44270, Jeff Layton, Xiubo Li)

- qa: miscellaneous perf suite fixes (pr#44254, Neha Ojha)

- qa: remove centos8 from supported distros (pr#44864, Casey Bodley, Sage Weil)

- rbd-mirror: fix mirror image removal (pr#43663, Arthur Outhenin-Chalandre)

- rbd-mirror: fix races in snapshot-based mirroring deletion propagation (pr#44753, Ilya Dryomov)

- rbd: add missing switch arguments for recognition by get_command_spec() (pr#44741, Ilya Dryomov)

- rgw/beast: optimizations for request timeout (pr#43961, Mark Kogan, Casey Bodley)

- rgw/rgw_rados: make RGW request IDs non-deterministic (pr#43696, Cory Snyder)

- rgw: clear buckets before calling list_buckets() (pr#43381, Nikhil Kshirsagar)

- rgw: disable prefetch in rgw_file to fix 3x read amplification (pr#44170, Kajetan Janiak)

- rgw: fix bi put not using right bucket index shard (pr#44167, J. Eric Ivancich)

- rgw: fix bucket purge incomplete multipart uploads (pr#43863, J. Eric Ivancich)

- rgw: user stats showing 0 value for "size_utilized" and "size_kb_utilized" fields (pr#44172, J. Eric Ivancich)

- rgwlc: remove lc entry on bucket delete (pr#44730, Matt Benjamin)

- rpm, debian: move smartmontools and nvme-cli to ceph-base (pr#44177, Yaarit Hatuka)

