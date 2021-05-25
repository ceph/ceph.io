---
title: "POSIX file system test suite"
date: "2008-04-18"
author: "sage"
tags: 
  - "planet"
---

A few weeks back a [POSIX file system test suite was announced](http://marc.info/?l=linux-fsdevel&m=120717468905606&w=2) on linux-fsdevel. Some 1700 tests of return values, error codes, and side effects for things like unlink, chmod, and so forth. The suite turned up a number of minor bugs in the MDS and client (mostly relating to things like legal file modes), and what appears to be a VFS bug with rename (affecting only a few filesystems, Ceph included). The Ceph kernel client now passes all but a handful of tests. Yay!

Which ones doesn’t it pass, you ask? They’re all like this:

> expect 0 create ${n0} 0644
> ctime1=\`${fstest} stat ${n0} ctime\`
> sleep 1
> expect 0 -- chown ${n0} -1 -1
> ctime2=\`${fstest} stat ${n0} ctime\`
> case "${os}:${fs}" in
> Linux:ext3)
>         test\_check $ctime1 -lt $ctime2
>         ;;
> \*)
>         test\_check $ctime1 -eq $ctime2
>         ;;
> esac

Sorry, chown(file, -1, -1) shouldn’t update ctime, even if ext3 disagrees.

