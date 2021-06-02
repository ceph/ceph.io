---
title: "Recursive accounting for size, ctime, etc."
date: "2008-05-23"
author: "sage"
tags: 
---

Watch the size on the directories:

$ mkdir foo ; cd foo
$ mkdir -p dir1/subdir
$ mkdir -p dir2
$ echo 123456789 > dir1/file.10
$ echo 12345678901234 > dir1/file.15
$ echo 1234 > dir1/subdir/file.5
$ echo 12345678901234567890123456789 > dir2/file.30
$ find . -ls
1 drwxr-xr-x   1 sage     sage           60 May 23 15:23 .
1 drwxr-xr-x   1 sage     sage           30 May 23 15:23 ./dir1
1 -rw-r--r-- 1 sage     sage           10 May 23 15:23 ./dir1/file.10
1 -rw-r--r-- 1 sage     sage           15 May 23 15:23 ./dir1/file.15
1 drwxr-xr-x   1 sage     sage            5 May 23 15:24 ./dir1/subdir
1 -rw-r--r-- 1 sage     sage            5 May 23 15:24 ./dir1/subdir/file.5
1 drwxr-xr-x   1 sage     sage           30 May 23 15:24 ./dir2
1 -rw-r--r-- 1 sage     sage           30 May 23 15:24 ./dir2/file.30

The client is configured to give the “nested” size when we stat() the directory, telling you the sum of all file sizes within and nested beneath a directory. This is basically arbitrary granularity directory-based quota accounting.

Internally, the MDS is actually doing recursive accounting for:

- file size (bytes)
- ctime (consider backup software scanning the FS for changes)
- file count
- directory count

A few notes and caveats (of course):

- There may be some delay before the recursive stats propagate up the hierarchy, particularly when the hierarchy spans multiple metadata servers. The plan is ensure that times are pushed up at least once every minute or something. In general, though, stats are pushed up as long as there are no conflicting locks.
- Directories don’t currently contribute any “bytes” to the total size.  It should probably be some estimate of the amount of disk space used storing the directory’s metadata.
- The directories’ i\_blocks are not recursively defined, so ‘du’ will still work (although you probably won’t want to use it).
- This is a summation of raw file i\_sizes, not blocks used. That means sparse files “appear” larger than they are.
- Ceph internally distinguishes between multiple links to the same file. Only the first (“primary”) link to each file is counted recursively.

