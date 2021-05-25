---
title: "Use ceph-fuse to mount CephFS"
date: "2020-03-28"
author: "admin"
tags: 
  - "planet"
---

The upstream documentation:  
  
\* nautilus - [https://docs.ceph.com/docs/nautilus/cephfs/fuse/](https://docs.ceph.com/docs/nautilus/cephfs/fuse/)  
\* master - [https://docs.ceph.com/docs/master/cephfs/fuse/](https://docs.ceph.com/docs/master/cephfs/fuse/)  
  

### Steps to assert ceph-fuse is working

  
First, deploy a cluster with at least one MDS running.  
  
Second, decide if you will run ceph-fuse as root or as a normal user and decide which machine will be the "client machine" (it must not be a part of the Ceph cluster).  
  
Third, on the client machine, install `/etc/ceph/ceph.conf` and `/etc/ceph/ceph.client.admin.keyring` by copying these files from a MON node. If using non-root user, make sure both files have permissions 644 and the containing directory has permissions 755. 
  
Fourth, on the client machine, install the `ceph-fuse` package.  
  
Fifth, if using a normal user, make sure that user exists on the client machine and is a member of the `ceph` group.  
  
Sixth, if using a normal user, set 'user\_allow\_other' in `/etc/fuse.conf`.  
  
Seventh, get the IP address of a MON node by looking inside `/etc/ceph.conf`:  
  

$ grep mon\_host /etc/ceph/ceph.conf  
mon\_host = 10.20.24.200  

  
Eighth, create a mount point:  
  

$ mkdir ~/cephfs  
$ ls ~/cephfs  
$  

  
Ninth, mount cephfs using the IP address of the MON found in step 6:  
  

$ ceph-fuse -m 10.20.24.200 ~/cephfs  
2019-11-29 13:51:13.688 7fafe9757040 -1 init, newargv = 0x5581396d32c0 newargc=7  
ceph-fuse\[27795\]: starting ceph client  
ceph-fuse\[27795\]: starting fuse  
$  

  
Tenth, when done, unmount cephfs:  
  

$ fusermount -u ~/cephfs  

Source: Nathan Cutler ([Use ceph-fuse to mount CephFS](http://smithfarm-thebrain.blogspot.com/2019/11/use-ceph-fuse-to-mount-cephfs.html))
