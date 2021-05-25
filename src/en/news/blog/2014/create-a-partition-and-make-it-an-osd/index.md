---
title: "Create a partition and make it an OSD"
date: "2014-05-08"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

_Note: it is similar to [Creating a Ceph OSD from a designated disk partition](http://dachary.org/?p=2548) but simpler._  
In a nutshell, to use the remaining space from **/dev/sda** and assuming [Ceph](http://ceph.com/) is already configured in **/etc/ceph/ceph.conf** it is enough to:

$ sgdisk --largest-new=$PARTITION --change-name="$PARTITION:ceph data" \\
  --partition-guid=$PARTITION:$OSD\_UUID \\
  --typecode=$PARTITION:$PTYPE\_UUID -- /dev/sda
$ partprobe
$ ceph-disk prepare /dev/sda$PARTITION
$ ceph-disk activate /dev/sda$PARTITION

  
The **/etc/ceph/ceph.conf** is assumed to contain the IP of the monitors and instructions to [automatically set the location](http://dachary.org/?p=2536) of a new OSD:

osd\_crush\_update\_on\_start = 1
osd\_crush\_location = datacenter=ovh

Let say the **/dev/sda** disk has spare space and is configured with GPT:

$ sgdisk --print /dev/sda
Disk /dev/sda: 3907029168 sectors, 1.8 TiB
Logical sector size: 512 bytes
Disk identifier (GUID): E409D145-0A08-4768-A6A0-9E5C68265944
Partition table holds up to 128 entries
First usable sector is 34, last usable sector is 3907029134
Partitions will be aligned on 2048-sector boundaries
Total free space is 2801113197 sectors (1.3 TiB)

Number  Start (sector)    End (sector)  Size       Code  Name
   1            4096        40962047   19.5 GiB    FD00  Linux RAID
   2        40962048        57343999   7.8 GiB     8200  Linux swap
   3        57344000      1105919999   500.0 GiB   8E00  Linux LVM

A random UUID is computed and set to an environment variable to uniquely identify the new OSD:

OSD\_UUID=$(uuidgen -r)

The typecode [designating a Ceph data disk](https://github.com/ceph/ceph/blob/firefly/src/ceph-disk#L78) is set to another environment variable:

PTYPE\_UUID=4fbd7e29-9d25-41b8-afd0-062c0ceff05d

A partition number is chosen to be the next one available and also set to an environment variable:

PARTITION=4

The new partition is created with:

$ sgdisk --largest-new=$PARTITION --change-name="$PARTITION:ceph data" \\
  --partition-guid=$PARTITION:$OSD\_UUID \\
  --typecode=$PARTITION:$PTYPE\_UUID -- /dev/sda
Warning: The kernel is still using the old partition table.
The new table will be used at the next reboot.
The operation has completed successfully.
$ sgdisk --print /dev/sda
Disk /dev/sda: 3907029168 sectors, 1.8 TiB
Logical sector size: 512 bytes
Disk identifier (GUID): E409D145-0A08-4768-A6A0-9E5C68265944
Partition table holds up to 128 entries
First usable sector is 34, last usable sector is 3907029134
Partitions will be aligned on 2048-sector boundaries
Total free space is 4062 sectors (2.0 MiB)

Number  Start (sector)    End (sector)  Size       Code  Name
   1            4096        40962047   19.5 GiB    FD00  Linux RAID
   2        40962048        57343999   7.8 GiB     8200  Linux swap
   3        57344000      1105919999   500.0 GiB   8E00  Linux LVM
   4      1105920000      3907029134   1.3 TiB     FFFF  ceph data

But it will not show up until **partprobe** is run:

$ ls -l /dev/sda4
ls: cannot access /dev/sda4: No such file or directory
$ partprobe
$ ls -l /dev/sda4
brw-rw---- 1 root disk 8, 4 May  8 17:34 /dev/sda4

The partition is prepared (i.e. formatted) as an OSD and the journal will be included in it by default:

$ ceph-disk prepare /dev/sda4
meta-data=/dev/sda4              isize=2048   agcount=32, agsize=10941833 blks
         =                       sectsz=512   attr=2, projid32bit=0
data     =                       bsize=4096   blocks=350138641, imaxpct=5
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0
log      =internal log           bsize=4096   blocks=170966, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0

It is then **activated**, meaning the file system is mounted and the OSD daemon running:

$ ceph-disk activate /dev/sda4
got latest monmap
2014-05-08 17:34:46.390267 7fa966361780 -1 journal FileJournal::\_open: disabling aio for non-block journal.  Use journal\_force\_aio to force use of aio anyway
2014-05-08 17:34:46.611058 7fa966361780 -1 journal FileJournal::\_open: disabling aio for non-block journal.  Use journal\_force\_aio to force use of aio anyway
2014-05-08 17:34:46.661352 7fa966361780 -1 filestore(/var/lib/ceph/tmp/mnt.foozff) could not find 23c2fcde/osd\_superblock/0//-1 in index: (2) No such file or directory
2014-05-08 17:34:46.902508 7fa966361780 -1 created object store /var/lib/ceph/tmp/mnt.foozff journal /var/lib/ceph/tmp/mnt.foozff/journal for osd.6 fsid 571bb920-6d85-44d7-9ec\\
a-1bc114d1cd75
2014-05-08 17:34:46.909010 7fa966361780 -1 auth: error reading file: /var/lib/ceph/tmp/mnt.foozff/keyring: can't open /var/lib/ceph/tmp/mnt.foozff/keyring: (2) No such file or\\
 directory
2014-05-08 17:34:46.971750 7fa966361780 -1 created new key in keyring /var/lib/ceph/tmp/mnt.foozff/keyring
added key for osd.6
$ df -h
Filesystem      Size  Used Avail Use% Mounted on
rootfs           20G  3.2G   15G  18% /
/dev/root        20G  3.2G   15G  18% /
devtmpfs        7.8G  4.0K  7.8G   1% /dev
none            1.6G  284K  1.6G   1% /run
none            5.0M     0  5.0M   0% /run/lock
none            7.8G     0  7.8G   0% /run/shm
cgroup          7.8G     0  7.8G   0% /sys/fs/cgroup
/dev/sdb4       1.4T  705G  631G  53% /var/lib/ceph/osd/ceph-2
/dev/sda4       1.4T  1.1G  1.4T   1% /var/lib/ceph/osd/ceph-6
