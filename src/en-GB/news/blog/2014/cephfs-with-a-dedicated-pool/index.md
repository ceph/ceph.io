---
title: "CephFS with a dedicated pool"
date: "2014-01-10"
author: "syndicated"
tags: 
  - "ceph"
  - "planet"
---

  

CephFS with a Dedicated Pool

  

  

[![cephfs with a dedicated pool](images/SLEPPINS_TARGET.jpg "cephfs with a dedicated pool")](http://karan-mj.blogspot.fi/2014/01/cephfs-with-dedicated-pool.html)

This blog is about configuring a dedicated pool ( user defined pool ) for cephfs. If you are looking to configure cephfs , please visit [CephFS Step by Step](http://karan-mj.blogspot.fi/2013/12/ceph-filesystem-cephfs-step-by-step.html) blog  
  
  

- Create a new pool for cephfs ( obviosly you can use your existing pool )

\# rados mkpool cephfs

- Grab pool id

\# ceph osd dump | grep -i cephfs  
pool 34 'cephfs' rep size 2 min\_size 1 crush\_ruleset 0 object\_hash rjenkins pg\_num 8 pgp\_num 8 last\_change 860 owner 0  
\# 

- Assign the pool to MDS

\# ceph mds add\_data\_pool 34 

- Mount your cephfs share

\# mount -t ceph 192.168.100.101:/ /cephfs -o name=cephfs,secretfile=/etc/ceph/client.cephfs  

- Check current layout of cephfs , you would notice the default layout.data\_pool is set to 0 , which means your cephfs will store date in pool 0 i.e data pool

\# cephfs /cephfs/ show\_layout  
layout.data\_pool:     0  
layout.object\_size:   4194304  
layout.stripe\_unit:   4194304  
layout.stripe\_count:  1  

- Set a new layout for data\_pool in cephfs , use pool id of the pool that we have created above.

\# cephfs /cephfs/ set\_layout -p 34  
\# cephfs /cephfs/ show\_layout  
layout.data\_pool:     34  
layout.object\_size:   4194304  
layout.stripe\_unit:   4194304  
layout.stripe\_count:  1  
\[root@na\_csc\_fedora19 ~\]#  

- Remount your cephfs share

\# umount /cephfs  
\# mount -t ceph 192.168.100.101:/ /cephfs -o name=cephfs,secretfile=/etc/ceph/client.cephfs  

- Check objects that are present in cephfs pool , there should be no object as this is a fresh pool and does not contain any data . But if you look for objects for any other pool , it should contain objects.

\# rados --pool=cephfs ls  
#  
\# rados --pool=metadata ls  
1.00000000.inode  
100.00000000  
100.00000000.inode  
1.00000000  
2.00000000  
200.00000000  
this is a tesf fine  
200.00000001  
600.00000000  
601.00000000  
602.00000000  
603.00000000  
604.00000000  
605.00000000  
606.00000000  
607.00000000  
608.00000000  
609.00000000  
mds0\_inotable  
mds0\_sessionmap  
mds\_anchortable  
mds\_snaptable  
#  

- Go to your cephfs directory and create some files ( put data in your file ) .

\# cd /cephfs/  
\# vi test  

- Recheck for objects in cephfs pool , now it will show you objects .

\# rados --pool=cephfs ls  
10000000005.00000000  
#

Summary is , we have created a new pool named "cephfs" , changed layout of cephfs to store its data in new pool "cephfs" , and finally we saw cephfs data is getting stored in pool named cephfs  ( i know its too more cephfs , read it again if you are sleeping and didn't understand cephfs)  
  
  
  

![](http://feeds.feedburner.com/~r/CephStorageNextBigThing/~4/FqaMqJupxuE)
