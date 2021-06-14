---
title: "Feature Set Mismatch Error on Ceph Kernel Client"
date: "2014-01-21"
author: "laurentbarbe"
tags: 
---

Depending on the kernel version you may be missing some features required by the cluster (or vice versa, required by client but not available on the cluster). Hence the errors “feature set mismatch”.

Some examples of errors that can be encountered :

```
mon0 192.168.0.1:6789 feature set mismatch, my XXXXXX < server's XXXXXX, missing 2040000
```

—> Upgrade kernel client up to 3.9 or set tunables to legacy : `ceph osd crush tunables legacy`

```
mon0 192.168.0.1:6789 feature set mismatch, my XXXXXX < server's XXXXXX, missing 40000000
```

—> Upgrade kernel client up to 3.9 or unset hashpspool : `ceph osd pool set rbd hashpspool false`

```
mon0 192.168.0.1:6789 feature set mismatch, my XXXXXX < server's XXXXXX, missing 800000000
```

—> Remove cache pool and reload monitors or upgrade kernel client up to 3.14

```
mon0 192.168.0.1:6789 feature set mismatch, my XXXXXX < server's XXXXXX, missing 1000000000
```

—> Upgrade kernel client up to 3.14

```
mon0 192.168.0.1:6789 feature set mismatch, my 4a042a42 < server's 2004a042a42, missing 20000000000
```

—> Upgrade kernel client up to 3.15 or disable tunable 3 features

## CEPH\_FEATURE Table and Kernel Version

You can find the feature missing in that table :

For exemple, `missing 2040000` means that CEPH\_FEATURE\_CRUSH\_TUNABLES (40000) and CEPH\_FEATURE\_CRUSH\_TUNABLES2 (2000000) is missing on kernel client.

‘R’:required, ’S’:support, ‘-X-’ feature is new since this version

| Feature | BIT | OCT | 3.8 | 3.9 | 3.10 | 3.14 | 3.15 | 3.18 |
| :-- | :-: | --: | :-: | :-: | :-: | :-: | :-: | :-: |
| CEPH\_FEATURE\_UID | 0 | 1 |  |  |  |  |  |  |
| CEPH\_FEATURE\_NOSRCADDR | 1 | 2 | R | R | R | R | R | R |
| CEPH\_FEATURE\_MONCLOCKCHECK | 2 | 4 |  |  |  |  |  |  |
| CEPH\_FEATURE\_FLOCK | 3 | 8 |  |  |  |  |  |  |
| CEPH\_FEATURE\_SUBSCRIBE2 | 4 | 10 |  |  |  |  |  |  |
| CEPH\_FEATURE\_MONNAMES | 5 | 20 |  |  |  |  |  |  |
| CEPH\_FEATURE\_RECONNECT\_SEQ | 6 | 40 |  |  | \-R- | R | R | R |
| CEPH\_FEATURE\_DIRLAYOUTHASH | 7 | 80 |  |  |  |  |  |  |
| CEPH\_FEATURE\_OBJECTLOCATOR | 8 | 100 |  |  |  |  |  |  |
| CEPH\_FEATURE\_PGID64 | 9 | 200 |  | R | R | R | R | R |
| CEPH\_FEATURE\_INCSUBOSDMAP | 10 | 400 |  |  |  |  |  |  |
| CEPH\_FEATURE\_PGPOOL3 | 11 | 800 |  | R | R | R | R | R |
| CEPH\_FEATURE\_OSDREPLYMUX | 12 | 1000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_OSDENC | 13 | 2000 |  | R | R | R | R | R |
| CEPH\_FEATURE\_OMAP | 14 | 4000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_MONENC | 15 | 8000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_QUERY\_T | 16 | 10000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_INDEP\_PG\_MAP | 17 | 20000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_CRUSH\_TUNABLES | 18 | 40000 | S | S | S | S | S | S |
| CEPH\_FEATURE\_CHUNKY\_SCRUB | 19 | 80000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_MON\_NULLROUTE | 20 | 100000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_MON\_GV | 21 | 200000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_BACKFILL\_RESERVATION | 22 | 400000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_MSG\_AUTH | 23 | 800000 |  |  |  |  |  | \-S- |
| CEPH\_FEATURE\_RECOVERY\_RESERVATION | 24 | 1000000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_CRUSH\_TUNABLES2 | 25 | 2000000 |  | S | S | S | S | S |
| CEPH\_FEATURE\_CREATEPOOLID | 26 | 4000000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_REPLY\_CREATE\_INODE | 27 | 8000000 |  | S | S | S | S | S |
| CEPH\_FEATURE\_OSD\_HBMSGS | 28 | 10000000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_MDSENC | 29 | 20000000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_OSDHASHPSPOOL | 30 | 40000000 |  | S | S | S | S | S |
| CEPH\_FEATURE\_MON\_SINGLE\_PAXOS | 31 | 80000000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_OSD\_SNAPMAPPER | 32 | 100000000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_MON\_SCRUB | 33 | 200000000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_OSD\_PACKED\_RECOVERY | 34 | 400000000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_OSD\_CACHEPOOL | 35 | 800000000 |  |  |  | \-S- | S | S |
| CEPH\_FEATURE\_CRUSH\_V2 | 36 | 1000000000 |  |  |  | \-S- | S | S |
| CEPH\_FEATURE\_EXPORT\_PEER | 37 | 2000000000 |  |  |  | \-S- | S | S |
| CEPH\_FEATURE\_OSD\_ERASURE\_CODES | 38 | 4000000000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_OSD\_TMAP2OMAP | 38\* | 4000000000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_OSDMAP\_ENC | 39 | 8000000000 |  |  |  |  | \-S- | S |
| CEPH\_FEATURE\_MDS\_INLINE\_DATA | 40 | 10000000000 |  |  |  |  |  |  |
| CEPH\_FEATURE\_CRUSH\_TUNABLES3 | 41 | 20000000000 |  |  |  |  | \-S- | S |
| CEPH\_FEATURE\_OSD\_PRIMARY\_AFFINITY | 41\* | 20000000000 |  |  |  |  | \-S- | S |

(Note that CEPH\_FEATURE\_OSD\_ERASURE\_CODES is no more required for client since firefly)
