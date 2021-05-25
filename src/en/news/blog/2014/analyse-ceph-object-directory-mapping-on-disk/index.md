---
title: "Analyse Ceph object directory mapping on disk"
date: "2014-09-08"
author: "shan"
tags: 
  - "planet"
---

![](images/analyse-ceph-object-directory-mapping-on-disk.jpg "Analyse Ceph object directory mapping on disk")

Useful to understand benchmark result and Ceph's second write penalty (this phenomena is explained [here in the section I.1](http://www.sebastien-han.fr/blog/2014/02/24/ceph-io-patterns-the-ugly/)).

  

# I. Use an RBD image and locate the objects

Let's start with a simple 40 MB RBD image and get some statistics about this image:

`bash $ sudo rbd info volumes/2578a6ed-2bab-4f71-910d-d42f18c80d11_disk rbd image '2578a6ed-2bab-4f71-910d-d42f18c80d11_disk': size 40162 kB in 10 objects order 22 (4096 kB objects) block_name_prefix: rbd_data.97ab74b0dc51 format: 2 features: layering`

Now using my script to validate the [placement of each object](http://www.sebastien-han.fr/blog/2013/11/19/ceph-rbd-objects-placement/). Please note that all the blocks must be allocated, if not simply map the device and run `dd`.

`bash $ sudo ./rbd-placement volumes 2578a6ed-2bab-4f71-910d-d42f18c80d11_disk osdmap e2518 pool 'volumes' (28) object 'rbd_data.97ab74b0dc51.0000000000000000' -> pg 28.b52329a6 (28.6) -> up ([0,1], p0) acting ([0,1], p0) osdmap e2518 pool 'volumes' (28) object 'rbd_data.97ab74b0dc51.0000000000000009' -> pg 28.7ac71fc6 (28.6) -> up ([0,1], p0) acting ([0,1], p0) osdmap e2518 pool 'volumes' (28) object 'rbd_data.97ab74b0dc51.0000000000000002' -> pg 28.f9256dc8 (28.8) -> up ([1,0], p1) acting ([1,0], p1) osdmap e2518 pool 'volumes' (28) object 'rbd_data.97ab74b0dc51.0000000000000005' -> pg 28.141bf9ca (28.a) -> up ([1,0], p1) acting ([1,0], p1) osdmap e2518 pool 'volumes' (28) object 'rbd_data.97ab74b0dc51.0000000000000003' -> pg 28.58c5376b (28.b) -> up ([1,0], p1) acting ([1,0], p1) osdmap e2518 pool 'volumes' (28) object 'rbd_data.97ab74b0dc51.0000000000000008' -> pg 28.a310d3d0 (28.10) -> up ([1,0], p1) acting ([1,0], p1) osdmap e2518 pool 'volumes' (28) object 'rbd_data.97ab74b0dc51.0000000000000001' -> pg 28.88755b97 (28.17) -> up ([1,0], p1) acting ([1,0], p1) osdmap e2518 pool 'volumes' (28) object 'rbd_data.97ab74b0dc51.0000000000000004' -> pg 28.e52ce538 (28.18) -> up ([1,0], p1) acting ([1,0], p1) osdmap e2518 pool 'volumes' (28) object 'rbd_data.97ab74b0dc51.0000000000000006' -> pg 28.80a6755a (28.1a) -> up ([0,1], p0) acting ([0,1], p0) osdmap e2518 pool 'volumes' (28) object 'rbd_data.97ab74b0dc51.0000000000000007' -> pg 28.9c45d2fa (28.1a) -> up ([0,1], p0) acting ([0,1], p0)`

This image is stored on OSD 0 and OSD 1. Then I just picked up the all the PGs and the rbd\_prefix. We can reflect the placement in our directory hierarchy using the `tree` command:

\`\`\`bash $ sudo tree -Ph '_97ab74b0dc51_' /var/lib/ceph/osd/ceph-0/current/{28.6,28.8,28.a,28.b,28.10,28.17,28.18,28.1a}\_head/ /var/lib/ceph/osd/ceph-0/current/28.6\_head/ ├── \[4.0M\] rbd\\udata.97ab74b0dc51.0000000000000000**head\_B52329A6**1c └── \[3.2M\] rbd\\udata.97ab74b0dc51.0000000000000009**head\_7AC71FC6**1c /var/lib/ceph/osd/ceph-0/current/28.8\_head/ └── \[4.0M\] rbd\\udata.97ab74b0dc51.0000000000000002**head\_F9256DC8**1c /var/lib/ceph/osd/ceph-0/current/28.a\_head/ └── \[4.0M\] rbd\\udata.97ab74b0dc51.0000000000000005**head\_141BF9CA**1c /var/lib/ceph/osd/ceph-0/current/28.b\_head/ └── \[4.0M\] rbd\\udata.97ab74b0dc51.0000000000000003**head\_58C5376B**1c /var/lib/ceph/osd/ceph-0/current/28.10\_head/ └── \[4.0M\] rbd\\udata.97ab74b0dc51.0000000000000008**head\_A310D3D0**1c /var/lib/ceph/osd/ceph-0/current/28.17\_head/ └── \[4.0M\] rbd\\udata.97ab74b0dc51.0000000000000001**head\_88755B97**1c /var/lib/ceph/osd/ceph-0/current/28.18\_head/ └── \[4.0M\] rbd\\udata.97ab74b0dc51.0000000000000004**head\_E52CE538**1c /var/lib/ceph/osd/ceph-0/current/28.1a\_head/ ├── \[4.0M\] rbd\\udata.97ab74b0dc51.0000000000000006**head\_80A6755A**1c └── \[4.0M\] rbd\\udata.97ab74b0dc51.0000000000000007**head\_9C45D2FA**1c

0 directories, 10 files \`\`\`

  

# II. Analyse your disk geometry

For the sake of simplicity I used a virtual hard drive disk attached to my virtual machine. The disk is 10GB big.

\`\`\`bash root@ceph:~# fdisk -l /dev/sdb1

Disk /dev/sdb1: 10.5 GB, 10484711424 bytes 255 heads, 63 sectors/track, 1274 cylinders, total 20477952 sectors Units = sectors of 1 \* 512 = 512 bytes Sector size (logical/physical): 512 bytes / 512 bytes I/O size (minimum/optimal): 512 bytes / 512 bytes Disk identifier: 0x00000000

Disk /dev/sdb1 doesn't contain a valid partition table \`\`\`

So I have 20477952 sectors/blocks of 512 bytes in total, here (20477952\*512)/1024/1024/1024 = ~10 GB

  

# III. Print block mapping for each object

Now I will be assuming that the underlying filesystem of your OSDs data is XFS. Otherwise the following will not possible.

`bash $ sudo for i in $(find /var/lib/ceph/osd/ceph-0/current/{28.6,28.8,28.a,28.b,28.10,28.17,28.18,28.1a}_head/*97ab74b0dc51*) ; do xfs_bmap -v $i ;done /var/lib/ceph/osd/ceph-0/current/28.6_head/rbd\udata.97ab74b0dc51.0000000000000000__head_B52329A6__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..2943]: 1992544..1995487 0 (1992544..1995487) 2944 1: [2944..8191]: 1987296..1992543 0 (1987296..1992543) 5248 /var/lib/ceph/osd/ceph-0/current/28.6_head/rbd\udata.97ab74b0dc51.0000000000000009__head_7AC71FC6__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..255]: 1987040..1987295 0 (1987040..1987295) 256 1: [256..1279]: 1986016..1987039 0 (1986016..1987039) 1024 2: [1280..6599]: 1978848..1984167 0 (1978848..1984167) 5320 /var/lib/ceph/osd/ceph-0/current/28.8_head/rbd\udata.97ab74b0dc51.0000000000000002__head_F9256DC8__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..8191]: 19057336..19065527 3 (3698872..3707063) 8192 /var/lib/ceph/osd/ceph-0/current/28.a_head/rbd\udata.97ab74b0dc51.0000000000000005__head_141BF9CA__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..8191]: 13909496..13917687 2 (3670520..3678711) 8192 /var/lib/ceph/osd/ceph-0/current/28.b_head/rbd\udata.97ab74b0dc51.0000000000000003__head_58C5376B__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..639]: 7303544..7304183 1 (2184056..2184695) 640 1: [640..8191]: 10090000..10097551 1 (4970512..4978063) 7552 /var/lib/ceph/osd/ceph-0/current/28.10_head/rbd\udata.97ab74b0dc51.0000000000000008__head_A310D3D0__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..639]: 12289352..12289991 2 (2050376..2051015) 640 1: [640..8191]: 13934072..13941623 2 (3695096..3702647) 7552 /var/lib/ceph/osd/ceph-0/current/28.17_head/rbd\udata.97ab74b0dc51.0000000000000001__head_88755B97__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..8191]: 19049144..19057335 3 (3690680..3698871) 8192 /var/lib/ceph/osd/ceph-0/current/28.18_head/rbd\udata.97ab74b0dc51.0000000000000004__head_E52CE538__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..8191]: 13901304..13909495 2 (3662328..3670519) 8192 /var/lib/ceph/osd/ceph-0/current/28.1a_head/rbd\udata.97ab74b0dc51.0000000000000006__head_80A6755A__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..6911]: 13917688..13924599 2 (3678712..3685623) 6912 1: [6912..8191]: 13932792..13934071 2 (3693816..3695095) 1280 /var/lib/ceph/osd/ceph-0/current/28.1a_head/rbd\udata.97ab74b0dc51.0000000000000007__head_9C45D2FA__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..8191]: 13924600..13932791 2 (3685624..3693815) 8192`

It seems that I have a bit of fragmentation on my filesystem since some files are mapping to more than one extend. Thus before going further I am going to defragment some files. Example for one file:

\`\`\`bash $ sudo xfs\_bmap -v /var/lib/ceph/osd/ceph-0/current/28.6\_head/rbd\\udata.97ab74b0dc51.0000000000000009**head\_7AC71FC6**1c /var/lib/ceph/osd/ceph-0/current/28.6\_head/rbd\\udata.97ab74b0dc51.0000000000000009**head\_7AC71FC6**1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: \[0..255\]: 1987040..1987295 0 (1987040..1987295) 256 1: \[256..1279\]: 1986016..1987039 0 (1986016..1987039) 1024 2: \[1280..6599\]: 1978848..1984167 0 (1978848..1984167) 5320

$ sudo xfs\_fsr /var/lib/ceph/osd/ceph-0/current/28.6\_head/rbd\\udata.97ab74b0dc51.0000000000000009**head\_7AC71FC6**1c

$ sudo xfs\_bmap -v /var/lib/ceph/osd/ceph-0/current/28.6\_head/rbd\\udata.97ab74b0dc51.0000000000000009**head\_7AC71FC6**1c /var/lib/ceph/osd/ceph-0/current/28.6\_head/rbd\\udata.97ab74b0dc51.0000000000000009**head\_7AC71FC6**1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: \[0..6599\]: 1860632..1867231 0 (1860632..1867231) 6600 \`\`\`

After the operation, we have the following repartition:

`bash $ sudo for i in $(find /var/lib/ceph/osd/ceph-0/current/{28.6,28.8,28.a,28.b,28.10,28.17,28.18,28.1a}_head/*97ab74b0dc51*) ; do xfs_bmap -v $i ;done /var/lib/ceph/osd/ceph-0/current/28.6_head/rbd\udata.97ab74b0dc51.0000000000000000__head_B52329A6__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..8191]: 1852440..1860631 0 (1852440..1860631) 8192 /var/lib/ceph/osd/ceph-0/current/28.6_head/rbd\udata.97ab74b0dc51.0000000000000009__head_7AC71FC6__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..6599]: 1860632..1867231 0 (1860632..1867231) 6600 /var/lib/ceph/osd/ceph-0/current/28.8_head/rbd\udata.97ab74b0dc51.0000000000000002__head_F9256DC8__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..8191]: 19057336..19065527 3 (3698872..3707063) 8192 /var/lib/ceph/osd/ceph-0/current/28.a_head/rbd\udata.97ab74b0dc51.0000000000000005__head_141BF9CA__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..8191]: 13909496..13917687 2 (3670520..3678711) 8192 /var/lib/ceph/osd/ceph-0/current/28.b_head/rbd\udata.97ab74b0dc51.0000000000000003__head_58C5376B__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..8191]: 13932792..13940983 2 (3693816..3702007) 8192 /var/lib/ceph/osd/ceph-0/current/28.10_head/rbd\udata.97ab74b0dc51.0000000000000008__head_A310D3D0__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..8191]: 14201728..14209919 2 (3962752..3970943) 8192 /var/lib/ceph/osd/ceph-0/current/28.17_head/rbd\udata.97ab74b0dc51.0000000000000001__head_88755B97__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..8191]: 19049144..19057335 3 (3690680..3698871) 8192 /var/lib/ceph/osd/ceph-0/current/28.18_head/rbd\udata.97ab74b0dc51.0000000000000004__head_E52CE538__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..8191]: 13901304..13909495 2 (3662328..3670519) 8192 /var/lib/ceph/osd/ceph-0/current/28.1a_head/rbd\udata.97ab74b0dc51.0000000000000006__head_80A6755A__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..8191]: 14209920..14218111 2 (3970944..3979135) 8192 /var/lib/ceph/osd/ceph-0/current/28.1a_head/rbd\udata.97ab74b0dc51.0000000000000007__head_9C45D2FA__1c: EXT: FILE-OFFSET BLOCK-RANGE AG AG-OFFSET TOTAL 0: [0..8191]: 13924600..13932791 2 (3685624..3693815) 8192`

  

# IV. Get an idea of your object mapping

As mentioned earlier, we have 20477952 blocks of 512 in total and the object have the following mapping:

- 1852440..1860631, a range of 8192 blocks of 512 bytes, (8192\*512/1024/1024) = 4M
- 1860632..1867231
- 19057336..19065527
- 13909496..13917687
- 13932792..13940983
- 14201728..14209919
- 19049144..19057335
- 13901304..13909495
- 14209920..14218111
- 13924600..13932791

The average block position based on the range are:

- 1856535
- 1863135
- 13905399
- 13913591
- 13928695
- 13936887
- 14205823
- 14214015
- 19053239
- 19061431

We can now calculate the standard deviation of these positions: 6020910.93405966

  

> The purpose of this article was to demonstre and justify the second write penalty into Ceph. The second write is being called by `syncfs` which is writing all the objects to their respective PG directories. Understanding the PG placement of the object in addition to the physical mapping of each object of the filesystem on the block device might be a great helper while debugging perfomance issue. Unfortunately this problem is hard to solve because of the client concurrency writes and the distributed nature of Ceph. Obviously what was written here remains pure theory (it's likely true though :p) given that determining the real placement of a data on a disk is difficult. One more thing abou the block placement returned by xfs, this placement gives us values but we don't know how the mapping of these ranges really looks like on the device.
