---
title: "Clustering the office"
date: "2013-08-29"
author: "scuttlemonkey"
tags: 
---

Ceph community member Loic Dachary posted a fun entry this week about using the hardware you already have in the office, your desktops, to make a cluster. Turns out it’s a pretty easy setup, and it can handle if random machines disappear for reboots. Take a look.

> July 1st 2013, [Heinlein](http://www.heinlein-support.de/) set up a Ceph “Cuttlefish” ( now upgraded to version 0.61.8 ) cluster using the desktop of seven employees willing to host a Ceph node and share part of their disk. The nodes are partly connected with 1Gb/s links and some only have 100Mb/s. The cluster supports a 4TB [Ceph file system](http://ceph.com/docs/next/cephfs/)
> 
> ceph-office$ df -h .
> Filesystem                 Size  Used Avail Use% Mounted on
> x.x.x.x,y.y.y.y,z.z.z.z:/  4,0T  2,0T  2,1T  49% /mnt/ceph-office
> 
> which is used as a temporary space to exchange files. On a typical day at least one desktop is switched off and on again. The cluster has been self healing since its installation, with the only exception of a placement group being stuck and fixed with a manual [pg repair](http://ceph.com/docs/master/rados/operations/control/#osd-subsystem).
> 
> ### usage
> 
> Each employee willing to use the ceph file system can add the following line to _/etc/fstab_
> 
> x.x.x.x,y.y.y.y,z.z.z.z:/ /mnt/ceph-office ceph 
>     noatime,dirstat,name=office,secret=SECRET\_IN\_BASE64 0 0
> 
> run _mkdir /mnt/ceph-office ; mount /mnt/ceph-office_ and start taking / dropping files to exchange them within the company. Some use it to store temporary git repositories.
> 
> ### ceph-deploy
> 
> The installation of the nodes was done using ceph-deploy and following the documentation instructions. There are three monitors, two of which are running on the desktops and one of them in a virtual machine dedicated to Ceph. The same virtual machine hosts the active MDS and another sits on one of the desktops. As of today ceph -s shows:
> 
> $ ceph -s
>    health HEALTH\_OK
>    monmap e7: 3 mons at {mon01=192.168.100.x:6789/0,
>                                       mon02=192.168.100.y:6789/0,
>                                       mon03=192.168.100.z:6789/0}, 
>    election epoch 124, quorum 0,1,2 mon01,mon02,mon03
>    osdmap e2497: 7 osds: 7 up, 7 in
>     pgmap v329003: 464 pgs: 464 active+clean; 124 GB data, 
>                 1934 GB used, 
>                 2102 GB / 4059 GB avail; 614B/s wr, 0op/s
>    mdsmap e31488: 1/1/1 up {0=192.168.100.a=up:active}, 1 up:standby
> 
> ### Deploying OSDs
> 
> On most machines a disk partition was dedicated to ceph and used to store the journal and the data. On others a LVM logical volume was created for ceph. After mounting it in _/mnt/lvm/ceph_, ceph-deploy was used to designate it as a directory to be used for the OSD.
> 
> /var/lib/ceph/osd$ ls -l
> total 0
> lrwxrwxrwx 1 root root 13 Jul  4 11:21 ceph-1 -> /mnt/lvm/ceph/
> 
> Although the logical volume could be used as a regular disk or partition, it would involve tricks with tools like kpartx with no real benefit. An attempt was made to use a loopback device but for some reason it led to a high IOwait and this option was abandonned.  
> All nodes use XFS and SATA disks.
> 
> ### crush map
> 
> The machines are on two different floors of the building and in different offices. The crush map is configured to reflect this but the two replicas are forced to use two different offices, regardless of the floor. The _ceph osd tree_ looks like this:
> 
> \# id	weight	type name	up/down	reweight
> -1	3.08	root default
> -12	0.35		floor three
> -7	0.21			office 304
> -5	0.21				host node01
> 3	0.21					osd.3	up	1
> -8	0.06999			office 305
> -6	0.06999				host node02
> 4	0.06999					osd.4	up	1
> -9	0.06999			office 307
> -2	0.06999				host node03
> 7	0.06999					osd.7	up	1
> -13	2.73		floor four
> -10	0.49			office 403
> -3	0.24				host node04
> 1	0.24					osd.1	up	1
> -14	0.25				host node05
> 5	0.25					osd.5	up	1
> -11	0.24			office 404
> -4	0.24				host node06
> 0	0.24					osd.0	up	1
> -16	2			office 405
> -15	2				host node07
> 6	2					osd.6	up	1
> 
> The relevant lines of the crush map are:
> 
> rule data {
> 	ruleset 0
> 	type replicated
> 	min\_size 1
> 	max\_size 10
> 	step take default
> 	step chooseleaf firstn 0 type office
> 	step emit
> }
> rule metadata {
> 	ruleset 1
> 	type replicated
> 	min\_size 1
> 	max\_size 10
> 	step take default
> 	step chooseleaf firstn 0 type office
> 	step emit
> }

Originally posted by [Loic Dachary](http://dachary.org/?p=2269).

Looks like a great way to bootstrap your way to distributed storage! Of course, once you decided to get dedicated hardware to handle this for you the effort of adding those resources and slowly migrating your data off of the desktop infrastructure would be relatively easy as well. Just one more example of how Ceph is incredibly flexible and powerful to suit just about any use case.

If you have an fun and interesting project like this we’d love to hear about it. Please send your notes/ideas/drafts to the [community team](mailto:community@inktank.com) so that we can share your awesome-tastic-ness with the rest of the community.

scuttlemonkey out

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/user-story/clustering-the-office/&bvt=rss&p=wordpress)
