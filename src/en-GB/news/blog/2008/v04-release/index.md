---
title: "v0.4 Release"
date: "2008-10-07"
author: "sage"
tags: 
  - "planet"
---

I’ve tagged v0.4.  New in this release:

- Flexible snapshots (create snapshots of \_any\_ subdirectory)
- Recursive accounting for size, ctime, file counts
- Lots of client bug fixes and improvements, including asynchronous writepages, additional crc protection of network messages, sendpage (zero-copy writes where supported).

The main new item in this release is the snapshot support.  Unlike snapshots in most other file systems, Ceph snapshots are not volume-wide; they can be created on a per-subdirectory (tree) basis.  That is, you can do something like

$ cd /ceph
$ mkdir foo/.snap/foo\_snap
$ ls foo/.snap
foo\_snap
$ mkdir foo/bar/.snap/bar\_snap
$ ls foo/bar/.snap
\_12020210321\_foo\_snap    # snaps of parents are preceeded by ino#
bar\_snap

Snapshots include accurate recursive accounting statistics (like rsize, which reflects the total size of all files nested beneath a directory, and is reported by default as a directory’s st\_size).  For example,

$ cd test
$ tar jxf something.tar.bz2 &
$ mkdir .snap/1
$ mkdir .snap/2
$ killall %1
$ ls -al .snap
total 0
drwxr-xr-x 1 root root       0 Jan  1  1970 .   # virtual ".snap" dir
drwxr-xr-x 1 root root 3590037 Oct  7 20:36 ..  # the "live" dir is biggest
drwxr-xr-x 1 root root 1220238 Oct  7 20:36 1
drwxr-xr-x 1 root root 2366114 Oct  7 20:36 2

Snapshot removal is as simple as

$ rmdir foo/.snap/foo\_snap

The kernel client has stabilized significantly in the last few months. The next release will focus on improving the failure recovery behavior of the storage cloud (mainly, throttling recovery and snap removal versus client workloads), responding intelligently to partial failures (EIO on individual file objects), and coping with ENOSPC conditions.

Source code is available with

git clone git://ceph.newdream.net/ceph.git

Or browseable via [via gitweb](http://ceph.newdream.net/git/?p=ceph.git;a=summary).

