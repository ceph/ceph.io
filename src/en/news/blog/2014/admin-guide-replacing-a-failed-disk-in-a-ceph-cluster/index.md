---
title: "Admin Guide :: Replacing a Failed Disk in a Ceph Cluster"
date: "2014-03-08"
author: "syndicated"
tags: 
  - "ceph"
  - "planet"
---

##   

## Replacing a Failed Disk from Ceph a Cluster

Do you have a ceph cluster , great , you are awesome ; so very soon you would face this . 

- Check your cluster health

\# ceph status  
  cluster c452b7df-0c0b-4005-8feb-fc3bb92407f5  
  
   health HEALTH\_WARN 6 pgs peering; 6 pgs stale; 6 pgs stuck inactive; 6 pgs stuck stale; 6 pgs stuck unclean; 2 requests are blocked > 32 sec  
  
   monmap e6: 3 mons at {node01-ib=10.168.100.101:6789/0,node06-ib=10.168.100.106:6789/0,node11-ib=10.168.100.111:6789/0}, election epoch 2  
  
830, quorum 0,1,2 node01-ib,node06-ib,node11-ib  
  
   mdsmap e58: 1/1/1 up {0=node01-ib=up:active}  
  
   osdmap e8871: 153 osds: 152 up, 152 in  
  
   pgmap v1409465: 66256 pgs, 30 pools, 201 TB data, 51906 kobjects  
  
      90439 GB used, 316 TB / 413 TB avail  
  
        66250 active+clean  
  
          6 stale+peering  
  

- Login to any ceph node and search for failed disk

#ceph osd tree | grep -i down  
  
9 2.63 osd.9 up 1  
  
17 2.73 osd.17 up 1  
  
30 2.73 osd.30 up 1  
  
53 2.73 osd.53 up 1  
  
65 2.73 osd.65 up 1  
  
78 2.73 osd.78 up 1  
  
89 2.73 osd.89 up 1  
  
99 2.73 osd.99 down 0  
  
113 2.73 osd.113 up 1  
  
128 2.73 osd.128 up 1  
  
141 2.73 osd.141 up 1  

- Now you have identified which node's OSD is failed and what's the OSD number. Login to that node and check if that OSD is mounted , IT would be NOT ( as its failed )

\# df -h  
  
Filesystem      Size Used Avail Use% Mounted on  
  
/dev/sda1       47G 6.0G 38G 14% /  
  
tmpfs         12G  0 12G 0% /dev/shm  
  
/dev/sdd1      2.8T 197G 2.5T 8% /var/lib/ceph/osd/ceph-30  
  
/dev/sde1      2.8T 172G 2.6T 7% /var/lib/ceph/osd/ceph-53  
  
/dev/sdc1      2.8T 264G 2.5T 10% /var/lib/ceph/osd/ceph-17  
  
/dev/sdh1      2.8T 227G 2.5T 9% /var/lib/ceph/osd/ceph-89  
  
/dev/sdf1      2.8T 169G 2.6T 7% /var/lib/ceph/osd/ceph-65  
  
/dev/sdi1      2.8T 150G 2.6T 6% /var/lib/ceph/osd/ceph-113  
  
/dev/sdb1      2.7T 1.3T 1.3T 51% /var/lib/ceph/osd/ceph-9  
  
/dev/sdj1      2.8T 1.6T 1.2T 58% /var/lib/ceph/osd/ceph-128  
  
/dev/sdg1      2.8T 237G 2.5T 9% /var/lib/ceph/osd/ceph-78  
  
/dev/sdk1      2.8T 1.5T 1.3T 53% /var/lib/ceph/osd/ceph-141  
  

- Go to your datacenter with a new physical drive and replace the drive physically , i assume depending on enterprise server that you are using it should be hot swappable , These days almost all servers support hot swapping of disks , but still you should check for your server model . In this example i was using HPDL380 server.
- Once you have replaced the drive physically , wait for some time so that new drive gets stable.
- Login to your node and make OSD out from cluster . Please remember , the OSD was already DOWN and OUT as soon as disk was failed . Ceph takes care of OSD and if its not available it marks it down and moves it out of cluster.

\# ceph osd out osd.99  
  
osd.99 is already out.  
  
#  
  
\# service ceph stop osd.99  
  
/etc/init.d/ceph: osd.99 not found (/etc/ceph/ceph.conf defines osd.9 osd.30 osd.17 osd.128 osd.65 osd.141 osd.89 osd.53 osd.113 osd.78 , /var/lib/ceph defines osd.9 osd.30 osd.17 osd.128 osd.65 osd.141 osd.89 osd.53 osd.113 osd.78)  
  
#  
  
\# service ceph status osd.99  
  
/etc/init.d/ceph: osd.99 not found (/etc/ceph/ceph.conf defines osd.9 osd.30 osd.17 osd.128 osd.65 osd.141 osd.89 osd.53 osd.113 osd.78 , /var/lib/ceph defines osd.9 osd.30 osd.17 osd.128 osd.65 osd.141 osd.89 osd.53 osd.113 osd.78)  
  
#  
  
\# service ceph status  
  
\=== osd.9 ===  
  
osd.9: running {"version":"0.72.1"}  
  
\=== osd.30 ===  
  
osd.30: running {"version":"0.72.1"}  
  
\=== osd.17 ===  
  
osd.17: running {"version":"0.72.1"}  
  
\=== osd.128 ===  
  
osd.128: running {"version":"0.72.1"}  
  
\=== osd.65 ===  
  
osd.65: running {"version":"0.72.1"}  
  
\=== osd.141 ===  
  
osd.141: running {"version":"0.72.1"}  
  
\=== osd.89 ===  
  
osd.89: running {"version":"0.72.1"}  
  
\=== osd.53 ===  
  
osd.53: running {"version":"0.72.1"}  
  
\=== osd.113 ===  
  
osd.113: running {"version":"0.72.1"}  
  
\=== osd.78 ===  
  
osd.78: running {"version":"0.72.1"}  
  
#  
  

- Now remove this failed OSD from Crush Map , as soon as its removed from crush map , ceph starts making PG copies that were located on this failed disk and it places these PG on other disks. So a recovery process will start.

\# ceph osd crush remove osd.99  
  
removed item id 99 name 'osd.99' from crush map  
  
\# ceph status  
  
  cluster c452b7df-0c0b-4005-8feb-fc3bb92407f5  
  
   health HEALTH\_WARN 43 pgs backfill; 56 pgs backfilling; 9 pgs peering; 82 pgs recovering; 6 pgs stale; 6 pgs stuck inactive; 6 pgs stuck stale; 192 pgs st  
  
uck unclean; 4 requests are blocked > 32 sec; recovery 373488/106903578 objects degraded (0.349%)  
  
   monmap e6: 3 mons at {node01-ib=10.168.100.101:6789/0,node06-ib=10.168.100.106:6789/0,node11-ib=10.168.100.111:6789/0}, election epoch 2  
  
836, quorum 0,1,2 node01-ib,node06-ib,node11-ib  
  
   mdsmap e58: 1/1/1 up {0=node01-ib=up:active}  
  
   osdmap e8946: 153 osds: 152 up, 152 in  
  
   pgmap v1409604: 66256 pgs, 30 pools, 201 TB data, 51916 kobjects  
  
   1   
      1 GB used, 316 TB / 413 TB avail  
  
   1   
      1 /106903578 objects degraded (0.349%)  
  
          1 active  
  
        66060 active+clean  
  
   1   
      1   
         1 active+remapped+wait\_backfill  
  
          3 peering  
  
          1 active+remapped  
  
   1   
      1   
         1 active+remapped+backfilling  
  
          6 stale+peering  
  
          4 active+clean+scrubbing+deep  
  
   1   
      1   
         1 active+recovering  
  
recovery io 159 MB/s, 39 objects/s  

- (optional) Check disk statistics , it looks nice and after some times ( depending on data that your FAILED disk holds ) it completes

\# dstat 10  
  
\----total-cpu-usage---- -dsk/total- -net/total- ---paging-- ---system-- 
  
usr sys idl wai hiq siq| read writ| recv send| in out | int csw  
  
 2 3 95 1 0 0|2223k 5938k| 0  0 |1090B 2425B|5853  11k  
  
 14 58 1 25 0 2| 130M 627M| 219M 57M|6554B  0 | 28k 111k  
  
 14 57 1 26 0 2| 106M 743M| 345M 32M| 0 4096B| 35k 73k  
  
 13 61 1 23 0 2| 138M 680M| 266M 67M| 83k  0 | 31k 82k  
  
 14 52 1 31 0 2| 99M 574M| 230M 32M| 48k 6963B| 27k 78k  
  
 14 51 2 31 0 2| 99M 609M| 291M 31M| 0  0 | 29k 83k  
  
 11 57 1 28 0 2| 118M 636M| 214M 57M|9830B  0 | 26k 92k  
  
 12 49 4 34 0 1| 97M 432M| 166M 48M| 35k  0 | 22k 100k  
  
 13 44 3 38 0 1| 95M 422M| 183M 46M| 0  0 | 22k 88k  
  
 13 52 3 30 0 2| 96M 510M| 207M 44M| 0  0 | 25k 109k  
  
 14 49 3 32 0 2| 96M 568M| 276M 37M| 16k  0 | 27k 72k  
  
 9 54 4 31 0 2| 109M 520M| 136M 45M| 0  0 | 20k 89k  
  
 14 44 5 35 0 1| 76M 444M| 192M 13M| 0  0 | 22k 54k  
  
 15 47 3 34 0 2| 101M 452M| 141M 20M|3277B 13k| 21k 79k  
  
 17 48 3 31 0 1| 108M 445M| 181M 16M| 0 200k| 23k 69k  
  
 17 48 3 30 0 1| 154M 406M| 138M 23M| 0  0 | 21k 75k  
  
 17 53 3 27 0 1| 169M 399M| 115M 23M| 0 396k| 21k 81k  
  
 13 45 4 36 0 1| 161M 330M| 131M 20M| 0 397k| 20k 90k  
  
 11 51 5 33 0 1| 116M 416M| 145M 1177k| 0 184k| 20k 69k  
  
 14 50 4 31 0 1| 144M 376M| 124M 8752k| 0  0 | 20k 72k  
  
 14 42 6 37 0 1| 142M 340M| 138M 19M| 0  0 | 19k 79k  
  
 15 47 6 32 0 1| 111M 427M| 129M 11M| 0 819B| 19k 66k  
  
 15 50 5 29 0 1| 163M 413M| 139M 5709k| 58k  0 | 20k 90k  
  
 14 49 4 32 0 1| 155M 395M| 91M 12M| 0  0 | 18k 93k  
  
 18 43 7 31 0 1| 166M 338M| 84M 6493k| 0  0 | 17k 81k  
  
 14 49 5 32 0 1| 179M 335M| 98M 3824k| 0  0 | 18k 91k  
  
 13 46 9 31 0 1| 157M 299M| 72M 14M| 0  0 | 17k 125k  
  
 17 42 9 30 0 1| 188M 269M| 82M 11M| 16k  0 | 16k 102k  
  
 22 35 15 27 0 1| 158M 167M|8932k 287k| 0  0 | 13k 88k  
  
 7 20 46 26 0 0| 118M 12M| 250k 392k| 0  82k|9333  61k  
  
 7 17 60 16 0 0| 124M 1638B| 236k 225k| 0  0 |7512  64k  
  
 7 16 63 14 0 0| 117M 1005k| 247k 238k| 0  0 |7429  60k  
  
 3 9 82 5 0 0| 41M 17M| 225k 225k| 0  0 |6049  27k  
  
 4 8 81 7 0 0| 56M 7782B| 227k 225k| 0 6144B|5933  33k  
  
 4 9 79 7 0 0| 60M 9011B| 248k 245k| 0 9011B|6457  36k  
  
 4 9 79 7 0 0| 58M 236k| 231k 230k| 0  14k|6210  35k  
  
\# ceph status  
  
  cluster c452b7df-0c0b-4005-8feb-fc3bb92407f5  
  
   health HEALTH\_WARN 6 pgs peering; 6 pgs stale; 6 pgs stuck inactive; 6 pgs stuck stale; 6 pgs stuck unclean; 2 requests are blocked > 32 sec  
  
   monmap e6: 3 mons at {node01-ib=10.168.100.101:6789/0,node06-ib=10.168.100.106:6789/0,node11-ib=10.168.100.111:6789/0}, election epoch 2  
  
836, quorum 0,1,2 node01-ib,node06-ib,node11-ib  
  
   mdsmap e58: 1/1/1 up {0=node01-ib=up:active}  
  
   osdmap e9045: 153 osds: 152 up, 152 in  
  
   pgmap v1409957: 66256 pgs, 30 pools, 200 TB data, 51705 kobjects  
  
      90448 GB used, 316 TB / 413 TB avail  
  
        66250 active+clean  
  
          6 stale+peering  

- Once data recovery is done , go ahead delete keyrings for that OSD and finally remove OSD

\# ceph auth del osd.99  
  
updated  
  
#  
  
\# ceph osd rm osd.99  
  
removed osd.99  
  
#  
  
#ceph status   
  
  cluster c452b7df-0c0b-4005-8feb-fc3bb92407f5  
  
   health HEALTH\_WARN 6 pgs peering; 6 pgs stale; 6 pgs stuck inactive; 6 pgs stuck stale; 6 pgs stuck unclean; 2 requests are blocked > 32 sec  
  
   monmap e6: 3 mons at {node01-ib=10.168.100.101:6789/0,node06-ib=10.168.100.106:6789/0,node11-ib=10.168.100.111:6789/0}, election epoch 2  
  
836, quorum 0,1,2 node01-ib,node06-ib,node11-ib  
  
   mdsmap e58: 1/1/1 up {0=node01-ib=up:active}  
  
   osdmap e9046: 152 osds: 152 up, 152 in  
  
   pgmap v1409971: 66256 pgs, 30 pools, 200 TB data, 51705 kobjects  
  
      90445 GB used, 316 TB / 413 TB avail  
  
        66250 active+clean  
  
          6 stale+peering  
  

- Remove entry of this OSD from ceph.conf ( if its present ) , make sure you keep all the nodes ceph.conf file updated .  You can push the new configuration file to entire cluster using # ceph admin command.
- Time to create new OSD for the physical disk that we have inserted , You would see, ceph will create new OSD with the same OSD number , that was failed , as we have removed failed OSD cleanly , if you see a different OSD number , it means that you have not cleanly removed failed OSD.

\# ceph osd create  
  
99  
  
\# ceph status  
  
  cluster c452b7df-0c0b-4005-8feb-fc3bb92407f5  
  
   health HEALTH\_WARN 6 pgs peering; 6 pgs stale; 6 pgs stuck inactive; 6 pgs stuck stale; 6 pgs stuck unclean; 2 requests are blocked > 32 sec  
  
   monmap e6: 3 mons at {node01-ib=10.168.100.101:6789/0,node06-ib=10.168.100.106:6789/0,node11-ib=10.168.100.111:6789/0}, election epoch 2  
  
836, quorum 0,1,2 node01-ib,node06-ib,node11-ib  
  
   mdsmap e58: 1/1/1 up {0=node01-ib=up:active}  
  
   osdmap e9047: 153 osds: 152 up, 152 in  
  
   pgmap v1409988: 66256 pgs, 30 pools, 200 TB data, 51705 kobjects  
  
      90442 GB used, 316 TB / 413 TB avail  
  
        66250 active+clean  
  
          6 stale+peering  
  
#  
  

- List the disk , zap it and deploy it again

\# ceph-deploy disk list node14  
  
\[ceph\_deploy.cli\]\[INFO \] Invoked (1.3.2): /usr/bin/ceph-deploy disk list node14  
  
\[node14\]\[DEBUG \] connected to host: node14  
  
\[node14\]\[DEBUG \] detect platform information from remote host  
  
\[node14\]\[DEBUG \] detect machine type  
  
\[ceph\_deploy.osd\]\[INFO \] Distro info: CentOS 6.4 Final  
  
\[ceph\_deploy.osd\]\[DEBUG \] Listing disks on node14...  
  
\[node14\]\[INFO \] Running command: ceph-disk list  
  
\[node14\]\[DEBUG \] /dev/sda :  
  
\[node14\]\[DEBUG \] /dev/sda1 other, ext4, mounted on /  
  
\[node14\]\[DEBUG \] /dev/sda2 swap, swap  
  
\[node14\]\[DEBUG \] /dev/sdb :  
  
\[node14\]\[DEBUG \] /dev/sdb1 ceph data, active, cluster ceph, osd.9, journal /dev/sdb2  
  
\[node14\]\[DEBUG \] /dev/sdb2 ceph journal, for /dev/sdb1  
  
\[node14\]\[DEBUG \] /dev/sdc :  
  
\[node14\]\[DEBUG \] /dev/sdc1 ceph data, active, cluster ceph, osd.17, journal /dev/sdc2  
  
\[node14\]\[DEBUG \] /dev/sdc2 ceph journal, for /dev/sdc1  
  
\[node14\]\[DEBUG \] /dev/sdd :  
  
\[node14\]\[DEBUG \] /dev/sdd1 ceph data, active, cluster ceph, osd.30, journal /dev/sdd2  
  
\[node14\]\[DEBUG \] /dev/sdd2 ceph journal, for /dev/sdd1  
  
\[node14\]\[DEBUG \] /dev/sde :  
  
\[node14\]\[DEBUG \] /dev/sde1 ceph data, active, cluster ceph, osd.53, journal /dev/sde2  
  
\[node14\]\[DEBUG \] /dev/sde2 ceph journal, for /dev/sde1  
  
\[node14\]\[DEBUG \] /dev/sdf :  
  
\[node14\]\[DEBUG \] /dev/sdf1 ceph data, active, cluster ceph, osd.65, journal /dev/sdf2  
  
\[node14\]\[DEBUG \] /dev/sdf2 ceph journal, for /dev/sdf1  
  
\[node14\]\[DEBUG \] /dev/sdg :  
  
\[node14\]\[DEBUG \] /dev/sdg1 ceph data, active, cluster ceph, osd.78, journal /dev/sdg2  
  
\[node14\]\[DEBUG \] /dev/sdg2 ceph journal, for /dev/sdg1  
  
\[node14\]\[DEBUG \] /dev/sdh :  
  
\[node14\]\[DEBUG \] /dev/sdh1 ceph data, active, cluster ceph, osd.89, journal /dev/sdh2  
  
\[node14\]\[DEBUG \] /dev/sdh2 ceph journal, for /dev/sdh1  
  
\[node14\]\[DEBUG \] /dev/sdi other, btrfs  
  
\[node14\]\[DEBUG \] /dev/sdj :  
  
\[node14\]\[DEBUG \] /dev/sdj1 ceph data, active, cluster ceph, osd.113, journal /dev/sdj2  
  
\[node14\]\[DEBUG \] /dev/sdj2 ceph journal, for /dev/sdj1  
  
\[node14\]\[DEBUG \] /dev/sdk :  
  
\[node14\]\[DEBUG \] /dev/sdk1 ceph data, active, cluster ceph, osd.128, journal /dev/sdk2  
  
\[node14\]\[DEBUG \] /dev/sdk2 ceph journal, for /dev/sdk1  
  
\[node14\]\[DEBUG \] /dev/sdl :  
  
\[node14\]\[DEBUG \] /dev/sdl1 ceph data, active, cluster ceph, osd.141, journal /dev/sdl2  
  
\[node14\]\[DEBUG \] /dev/sdl2 ceph journal, for /dev/sdl1  
  

\# ceph-deploy disk zap node14:sdi  
  
\[ceph\_deploy.cli\]\[INFO \] Invoked (1.3.2): /usr/bin/ceph-deploy disk zap node14:sdi  
  
\[ceph\_deploy.osd\]\[DEBUG \] zapping /dev/sdi on node14  
  
\[node14\]\[DEBUG \] connected to host: node14  
  
\[node14\]\[DEBUG \] detect platform information from remote host  
  
\[node14\]\[DEBUG \] detect machine type  
  
\[ceph\_deploy.osd\]\[INFO \] Distro info: CentOS 6.4 Final  
  
\[node14\]\[DEBUG \] zeroing last few blocks of device  
  
\[node14\]\[INFO \] Running command: sgdisk --zap-all --clear --mbrtogpt -- /dev/sdi  
  
\[node14\]\[DEBUG \] Creating new GPT entries.  
  
\[node14\]\[DEBUG \] GPT data structures destroyed! You may now partition the disk using fdisk or  
  
\[node14\]\[DEBUG \] other utilities.  
  
\[node14\]\[DEBUG \] The operation has completed successfully.  
  
#  
  
\# ceph-deploy --overwrite-conf osd prepare node14:sdi  
  
\[ceph\_deploy.cli\]\[INFO \] Invoked (1.3.2): /usr/bin/ceph-deploy --overwrite-conf osd prepare node14:sdi  
  
\[ceph\_deploy.osd\]\[DEBUG \] Preparing cluster ceph disks node14:/dev/sdi:  
  
\[node14\]\[DEBUG \] connected to host: node14  
  
\[node14\]\[DEBUG \] detect platform information from remote host  
  
\[node14\]\[DEBUG \] detect machine type  
  
\[ceph\_deploy.osd\]\[INFO \] Distro info: CentOS 6.4 Final  
  
\[ceph\_deploy.osd\]\[DEBUG \] Deploying osd to node14  
  
\[node14\]\[DEBUG \] write cluster configuration to /etc/ceph/{cluster}.conf  
  
\[node14\]\[INFO \] Running command: udevadm trigger --subsystem-match=block --action=add  
  
\[ceph\_deploy.osd\]\[DEBUG \] Preparing host node14 disk /dev/sdi journal None activate False  
  
\[node14\]\[INFO \] Running command: ceph-disk-prepare --fs-type xfs --cluster ceph -- /dev/sdi  
  
\[node14\]\[ERROR \] INFO:ceph-disk:Will colocate journal with data on /dev/sdi  
  
\[node14\]\[DEBUG \] The operation has completed successfully.  
  
\[node14\]\[DEBUG \] The operation has completed successfully.  
  
\[node14\]\[DEBUG \] meta-data=/dev/sdi1       isize=2048 agcount=32, agsize=22884224 blks  
  
\[node14\]\[DEBUG \]     =           sectsz=512 attr=2, projid32bit=0  
  
\[node14\]\[DEBUG \] data  =           bsize=4096 blocks=732295168, imaxpct=5  
  
\[node14\]\[DEBUG \]     =           sunit=64  swidth=64 blks  
  
\[node14\]\[DEBUG \] naming =version 2       bsize=4096 ascii-ci=0  
  
\[node14\]\[DEBUG \] log   =internal log     bsize=4096 blocks=357568, version=2  
  
\[node14\]\[DEBUG \]     =           sectsz=512 sunit=64 blks, lazy-count=1  
  
\[node14\]\[DEBUG \] realtime =none         extsz=4096 blocks=0, rtextents=0  
  
\[node14\]\[DEBUG \] The operation has completed successfully.  
  
\[ceph\_deploy.osd\]\[DEBUG \] Host node14 is now ready for osd use.  
  
#  

- Check the new OSD

\# ceph osd tree   
  
9 2.63 osd.9 up 1  
  
17 2.73 osd.17 up 1  
  
30 2.73 osd.30 up 1  
  
53 2.73 osd.53 up 1  
  
65 2.73 osd.65 up 1  
  
78 2.73 osd.78 up 1  
  
89 2.73 osd.89 up 1  
  
113 2.73 osd.113 up 1  
  
128 2.73 osd.128 up 1  
  
141 2.73 osd.141 up 1  
  
99 2.73 osd.99 up 1  
  
\# ceph status   
  
  cluster c452b7df-0c0b-4005-8feb-fc3bb92407f5  
  
   health HEALTH\_WARN 186 pgs backfill; 12 pgs backfilling; 6 pgs peering; 57 pgs recovering; 887 pgs recovery\_wait; 6 pgs stale; 6 pgs stuck inactive; 6 pgs  
  
 stuck stale; 283 pgs stuck unclean; 2 requests are blocked > 32 sec; recovery 784023/106982434 objects degraded (0.733%)  
  
   monmap e6: 3 mons at {node01-ib=10.168.100.101:6789/0,node06-ib=10.168.100.106:6789/0,node11-ib=10.168.100.111:6789/0}, election epoch 2  
  
836, quorum 0,1,2 node01-ib,node06-ib,node11-ib  
  
   mdsmap e58: 1/1/1 up {0=node01-ib=up:active}  
  
   osdmap e9190: 153 osds: 153 up, 153 in  
  
   pgmap v1413041: 66256 pgs, 30 pools, 200 TB data, 51840 kobjects  
  
      90504 GB used, 319 TB / 416 TB avail  
  
      784023/106982434 objects degraded (0.733%)  
  
        65108 active+clean  
  
         186 active+remapped+wait\_backfill  
  
         887 active+recovery\_wait  
  
         12 active+remapped+backfilling  
  
          6 stale+peering  
  
         57 active+recovering  
  
recovery io 383 MB/s, 95 objects/s  
  

- You would notice ceph will start putting PG ( data ) on this new OSD , so as to rebalance data and to make this new osd to participate cluster.

Yes at this stage you are done with replacement.

  

![](http://feeds.feedburner.com/~r/CephStorageNextBigThing/~4/t1nHVEnMYWA)
