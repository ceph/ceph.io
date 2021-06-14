---
title: "Ceph make check in a ram disk"
date: "2015-04-10"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

When running tests from the [Ceph](http://ceph.com/) sources, the disk is used intensively and a ram disk can be used to reduce the latency. The kernel must be rebooted to set the [ramdisk maximum size](https://www.kernel.org/doc/Documentation/blockdev/ramdisk.txt) to 16GB. For instance on Ubuntu 14.04 in **/etc/default/grub** (the module name which could be **rb** or **brd** depending).

GRUB\_CMDLINE\_LINUX="brd.rd\_size=16777216" # 16GB in KB

the grub configuration must then be updated with

sudo update-grub

After reboot the ram disk is formatted as an ext4 file system and mounted:

$ cat /sys/module/brd/parameters/rd\_size
16777216
$ sudo mkfs -t ext4 /dev/ram1
$ sudo mount /dev/ram1 /srv
$ df -h /srv
Filesystem      Size  Used Avail Use% Mounted on
/dev/ram1        16G   44M   15G   1% /srv
$ free -g
             total       used       free     shared    buffers     cached
Mem:            31          0         31          0          0          0
-/+ buffers/cache:          0         31

Cloning ceph, compiling and running tests should now take less than 15 minutes with

$ git clone https://github.com/ceph/ceph
$ cd ceph
$ ./run-make-check.sh

When the ram disk is umounted, some of the memory used by the ram disk is still in use

$ free -g
             total       used       free     shared    buffers     cached
Mem:            31         27          4          0          0         17
-/+ buffers/cache:          9         22
$ sudo umount /srv
$ free -g
             total       used       free     shared    buffers     cached
Mem:            31         18         13          0          0          8
-/+ buffers/cache:          9         22

It can be flushed with

$ sudo blockdev --flushbufs /dev/ram1
$ free -g
             total       used       free     shared    buffers     cached
Mem:            31          9         22          0          0          8
-/+ buffers/cache:          0         31

  
Using a ram file system

mount -t tmpfs -o size=2G tmpfs /somewhere

is not a viable option because **make check** only supports btrfs, xfs and ext4 file systems and it will fail. [eatmydata](https://www.flamingspork.com/projects/libeatmydata/) does not work for **make check** on Unbuntu 14.04. 
Many thanks to Cyril Bouthors for his help in researching the best solution.
