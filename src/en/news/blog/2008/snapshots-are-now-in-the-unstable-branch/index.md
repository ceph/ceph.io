---
title: "Snapshots are now in the ‘unstable’ branch"
date: "2008-08-18"
author: "sage"
tags: 
---

I’ve just merged the snapshot support into the unstable branch.  It’s not  
completely finished yet (garbage collection and handling for a number of  
corner cases is still missing), but provided you don’t actually  
create/destroy any snapshots, things will behave as before.

I’m merging this now because there was relatively extensive surgery on the  
MDS to include this support, and I’d like to shake out the resulting bugs  
sooner rather than later.  This also precipitated a lot of cleanups and  
bug fixes.

If you’d like to try out the snapshots, it’s pretty fun.  The main caveat  
is you snapshots on the fs root directory don’t work right… it has to be  
a subdirectory.  Something like so:

$ mount -t ceph 1.2.3.4:/ /ceph
$ mkdir /ceph/foo
$ touch /ceph/foo/asdf
$ mkdir /ceph/foo/.snap/my\_first\_snapshot
$ rm /ceph/foo/asdf
$ ls -al /ceph/foo/.snap/\* /ceph/foo

‘rmdir’ will remove a snapshot (although disk space isn’t being reclaimed  
yet).

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/updates/snapshots-are-now-in-the-unstable-branch/&bvt=rss&p=wordpress)
