---
title: "Ceph + OpenStack :: Part-1"
date: "2013-12-05"
author: "syndicated"
tags: 
  - "ceph"
  - "planet"
---

##   

## Ceph & OpenStack Integration[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "Ceph   OpenStack Integration")

We can use Ceph Block Device with openstack through `libvirt`, which configures the QEMU interface tolibrbd. To use Ceph Block Devices with openstack , we must install QEMU, `libvirt`, and openstack  first. ( we will not cover openstack installation in this document , you can use your existing openstack infrastructure ) The following diagram explains openstack  /Ceph technology stack.  

![OpenStack/Ceph technology stack](images/ditaa-e4a4957f90e4d8ebac2608e1544c34bf784cfdfb.png "OpenStack/Ceph technology stack")  

### [](https://draft.blogger.com/blogger.g?blogID=6067449713794600812)Installing QEMU[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "Installing QEMU")

  

qemu-img version 0.12.1 does not have RBD support , so we need install packages with async . On Openstack Node , create 3 YUM repo files ceph-extras-source.repo , ceph-extras.repo, ceph-extras-noarch.repo  

 \[ceph-extras\]  
  name=Ceph Extra Packages and Backports $basearch  
  baseurl=[http://ceph.com/packages/ceph-extras/rpm/centos6/$basearch](http://ceph.com/packages/ceph-extras/rpm/centos6/$basearch)  
  enabled=1  
  gpgcheck=1  
  type=rpm-md  
  gpgkey=[https://ceph.com/git/?p=ceph.git;a=blob\_plain;f=keys/release.asc](https://ceph.com/git/?p=ceph.git;a=blob_plain;f=keys/release.asc)

 \[ceph-extras-noarch\]  
  name=Ceph Extra Packages and Backports noarch  
  baseurl=[http://ceph.com/packages/ceph-extras/rpm/centos6/noarch](http://ceph.com/packages/ceph-extras/rpm/centos6/noarch)  
  enabled=1  
  gpgcheck=1  
  type=rpm-md  
  gpgkey=[https://ceph.com/git/?p=ceph.git;a=blob\_plain;f=keys/release.asc](https://ceph.com/git/?p=ceph.git;a=blob_plain;f=keys/release.asc)

 \[ceph-extras-source\]  
 name=Ceph Extra Packages and Backports Sources  
 baseurl=[http://ceph.com/packages/ceph-extras/rpm/centos6/SRPMS](http://ceph.com/packages/ceph-extras/rpm/centos6/SRPMS)  
 enabled=1  
 gpgcheck=1  
 type=rpm-md  
 gpgkey=[https://ceph.com/git/?p=ceph.git;a=blob\_plain;f=keys/release.asc](https://ceph.com/git/?p=ceph.git;a=blob_plain;f=keys/release.asc)  
 centos-extras

#yum update  
#yum remove qemu-img  
#yum --disablerepo=\* --enablerepo=ceph-extras install -y qemu-img  
\# yum --disablerepo=\* --enablerepo=ceph-extras install -y qemu-kvm  
\# yum --disablerepo=\* --enablerepo=ceph-extras install -y qemu-guest-agent  
\# yum --disablerepo=\* --enablerepo=ceph-extras install -y qemu-kvm-tools  
  
\--> Check creating a QEMU image it should work  
  
\[root@rdo yum.repos.d\]# qemu-img create -f rbd rbd:data/foo 10G  
Formatting 'rbd:data/foo', fmt=rbd size=10737418240 cluster\_size=0  
\[root@rdo yum.repos.d\]#  
  
\[root@rdo yum.repos.d\]# qemu-img info -f rbd rbd:data/foo  
image: rbd:data/foo  
file format: rbd  
virtual size: 10G (10737418240 bytes)  
disk size: unavailable  
cluster\_size: 4194304  
\[root@rdo yum.repos.d\]#  

### [](https://draft.blogger.com/blogger.g?blogID=6067449713794600812)Installing LIBVIRT[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "Installing LIBVIRT")

  

To use `libvirt` with Ceph, we must have a running Ceph Storage Cluster, and have installed and configured QEMU  

yum install libvirt

#### Please Follow [Ceph + OpenStack :: Part-2](http://karan-mj.blogspot.fi/2013/12/ceph-openstack-part-2.html) for next step in installation

  

![](http://feeds.feedburner.com/~r/CephStorageNextBigThing/~4/fMBog5EFhcM)
