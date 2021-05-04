---
title: "Ceph + OpenStack :: Part-4"
date: "2013-12-05"
author: "syndicated"
tags: 
  - "ceph"
  - "planet"
---

  

### Testing OpenStack Glance + RBD[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "Testing OpenStack Glance + RBD")

- To allow glance to keep images on ceph RBD volume , edit /etc/glance/glance-api.conf

default\_store = rbd  
\# ============ RBD Store Options =============================  
  
\# Ceph configuration file path  
\# If using cephx authentication, this file should  
\# include a reference to the right keyring  
\# in a client. section  
rbd\_store\_ceph\_conf = /etc/ceph/ceph.conf  
  
\# RADOS user to authenticate as (only applicable if using cephx)  
rbd\_store\_user = images         ## This is the ceph user that we have created above in this document  
  
\# RADOS pool in which images are stored  
rbd\_store\_pool = ceph-images   ## This is the ceph pool for images that we have created above in this document  
  
\# Images will be chunked into objects of this size (in megabytes).  
\# For best performance, this should be a power of two  
rbd\_store\_chunk\_size = 8  

- Check ceph auth to make sure keys are present for client.images user . This should present here as we have created them earlier in this document.

\[root@rdo ceph(keystone\_admin)\]# ceph auth list  
installed auth entries:  
  
mds.ceph-mon1  
   key: AQAxp35ScNUxOBAAfAXc+J5F3/v7jUrpztVRBQ==  
   caps: \[mds\] allow  
   caps: \[mon\] allow profile mds  
   caps: \[osd\] allow rwx  
osd.0  
   key: AQCOvWpSsKN4JBAA015Uf53JjGCJS4cgzhxGFg==  
   caps: \[mon\] allow profile osd  
   caps: \[osd\] allow \*  
osd.1  
   key: AQCn+mtSULePJxAACKvSkIqF39f5MaFiwsVR6Q==  
   caps: \[mon\] allow profile osd  
   caps: \[osd\] allow \*  
osd.10  
   key: AQCjNIZSOF7AFxAA3vwLvgaB3PI+WAZPt2eIlQ==  
   caps: \[mon\] allow profile osd  
   caps: \[osd\] allow \*  
osd.2  
   key: AQDHBmxSwKTZBxAAyWlQGj8H48sdPGl4PzlFbQ==  
   caps: \[mon\] allow profile osd  
   caps: \[osd\] allow \*  
osd.3  
   key: AQBv/WtSwH5gOBAAHrSWblzq/n/qPbaurBMC2g==  
   caps: \[mon\] allow profile osd  
   caps: \[osd\] allow \*  
osd.4  
   key: AQCiE2xSgDLQMRAAjWotlPtyqaSgpll1P6NTfw==  
   caps: \[mon\] allow profile osd  
   caps: \[osd\] allow \*  
osd.5  
   key: AQCrFGxSOEnjMRAAnrqLcMR8UHu3rTTTQ5DHjw==  
   caps: \[mon\] allow profile osd  
   caps: \[osd\] allow \*  
osd.6  
   key: AQAXFmxSUAmsJxAA83qr0mZ3sGLQbi+C59LXgw==  
   caps: \[mon\] allow profile osd  
   caps: \[osd\] allow \*  
osd.7  
   key: AQBpFmxSOCZFNBAAONPg5I3QnB3Wd/pr7rSkEg==  
   caps: \[mon\] allow profile osd  
   caps: \[osd\] allow \*  
osd.8  
   key: AQC7M4ZSSP9dMhAAh4HQ0uvKFs9yHiQrobXzUA==  
   caps: \[mon\] allow profile osd  
   caps: \[osd\] allow \*  
osd.9  
   key: AQBmNIZSkAIjMRAA3FFGaMhGiPCmYmQ9REisRQ==  
   caps: \[mon\] allow profile osd  
   caps: \[osd\] allow \*  
client.admin  
   key: AQBSt2pS4M5cCBAAUd4jWA1vxJT+y5C9X6juzg==  
   caps: \[mds\] allow  
   caps: \[mon\] allow \*  
   caps: \[osd\] allow \*  
client.bootstrap-mds  
   key: AQBSt2pS8IirKxAAQ27MWZ4pEEBuNhCDrj/FRw==  
   caps: \[mon\] allow profile bootstrap-mds  
client.bootstrap-osd  
   key: AQBSt2pSYLXVGRAAYs0R8gXKSEct6ApEy4h6dQ==  
   caps: \[mon\] allow profile bootstrap-osd  
client.images  
   key: AQDS04xSEJEYABAA8Kl9eEqIr3Y8pyz+tPRpvQ==  
   caps: \[mon\] allow r  
   caps: \[osd\] allow class-read object\_prefix rbd\_children, allow rwx pool=ceph-images  
client.volumes  
   key: AQC804xS8HzFJxAAD/zzQ8LMzq9wDLq/5a472g==  
   caps: \[mon\] allow r  
   caps: \[osd\] allow class-read object\_prefix rbd\_children, allow rwx pool=ceph-volumes, allow rx pool=ceph-images  
  
\[root@rdo ceph(keystone\_admin)\]#  

- Copy the keyrings file to glance directory. This is the same file that we have generated above in this document.

cp /etc/ceph/ceph.client.images.keyring /etc/glance  
chown glance:glance /etc/glance/ceph.client.images.keyring  
  
 #  service openstack-glance-api restart  
 #  service openstack-glance-registry restart  
 #  service openstack-glance-scrubber restart  

- Before creating a new glance image on ceph volume , check the ceph pool content ( in my case its empty and it should be , this is for the first time we are using this volume )

\[root@rdo init.d(keystone\_admin)\]# rbd -p ceph-images ls  
rbd: pool ceph-images doesn't contain rbd images  
\[root@rdo init.d(keystone\_admin)\]#  

- Download a new image or use if you have existing.

\[root@rdo var(keystone\_admin)\]# wget http://cloud-images.ubuntu.com/precise/current/precise-server-cloudimg-amd64-disk1.img  
\[root@rdo var(keystone\_admin)\]# glance add name="ceph-glance-image" is\_public=True disk\_format=qcow2 container\_format=ovf architecture=x86\_64 <  ubuntu-12.04.3-desktop-amd64.iso  
Added new image with ID: fcc07414-bbb3-4473-a8df-523664c8c9df  
\[root@rdo var(keystone\_admin)\]# glance index  
ID                                   Name                           Disk Format          Container Format     Size  
\------------------------------------ ------------------------------ -------------------- -------------------- -------------- 
fcc07414-bbb3-4473-a8df-523664c8c9df ceph-glance-image              qcow2                ovf                       742391808  
3c2db0ad-8d1e-400d-ba13-a506448f2a8e precise-server-cloudimg        qcow2                ovf                       254738432  
f61edc8d-c9a1-4ff4-b4fc-c8128bd1a10b Ubuntu 12.04 cloudimg amd64    qcow2                ovf                       254738432  
\[root@rdo var(keystone\_admin)\]#  

- Now check your ceph pool , it will have image ( even match the glance image ID with pool objects , also compare image size with object size )

\[root@rdo var(keystone\_admin)\]# rbd -p ceph-images ls  
fcc07414-bbb3-4473-a8df-523664c8c9df  
\[root@rdo var(keystone\_admin)\]#  
  
\[root@rdo var(keystone\_admin)\]# du ubuntu-12.04.3-desktop-amd64.iso  
724996   ubuntu-12.04.3-desktop-amd64.iso  
\[root@rdo var(keystone\_admin)\]#  
  
\[root@rdo var(keystone\_admin)\]# rados df  
pool name       category                 KB      objects       clones     degraded      unfound           rd        rd KB           wr        wr KB  
ceph-images     - 724993           92            0            0           0           63           50           98       724993  
ceph-volumes    - 1            9            0            0           0          284          212           72            8  
data            - 141557761        34563            0            0           0        71843    131424295        71384    146013188  
metadata        - 9667           23            0            0           0           72        19346          851        10102  
rbd             - 1            1            0            0           0         2117        21883          305       226753  
  total used       287309244        34688  
  total avail     6222206348  
  total space     6509515592  

- Feeling Happy , you should be , now glance will use ceph to retrieve / store images

#### Please Follow [Ceph + OpenStack :: Part-5](http://karan-mj.blogspot.fi/2013/12/ceph-openstack-part-5.html) for next step in installation

  

![](http://feeds.feedburner.com/~r/CephStorageNextBigThing/~4/pZ3Io64kut0)
