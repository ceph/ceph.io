---
title: "Ceph Filesystem ( CephFS) :: Step by Step Configuration"
date: "2013-12-23"
author: "syndicated"
tags: 
  - "ceph"
---

  
CephFS   
  
Ceph Filesystem is a posix compliant file system that uses ceph storage cluster to store its data. This is the only ceph component that is not ready for production , i would like to say ready for pre-production.  
  
  
Internals   

<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody><tr><td style="text-align: center;"><a href="http://docs.ceph.com/docs/master/_images/ditaa-b5a320fc160057a1a7da010b4215489fa66de242.png" imageanchor="1" style="margin-left: auto; margin-right: auto;"><img border="0" src="images/ditaa-b5a320fc160057a1a7da010b4215489fa66de242.png" height="297" width="640"></a></td></tr><tr><td class="tr-caption" style="text-align: center;">Thanks to&nbsp;http://docs.ceph.com/docs/master/cephfs/ for Image&nbsp;</td></tr></tbody></table>

  
Requirement of CephFS  
  
  

- You need a running ceph cluster with at least one MDS node. MDS is required for CephFS to work.
- If you don't have MDS configure one

- \# ceph-deploy mds create <MDS-NODE-ADDRESS>

**Note :** If you are running short of hardware or want to save hardware you can run MDS services on existing Monitor nodes. MDS services does not need much resources

- A Ceph client to mount cephFS

  

Configuring CephFS

- Install ceph on client node

\[root@storage0101-ib ceph\]# ceph-deploy install na\_fedora19  
\[ceph\_deploy.cli\]\[INFO  \] Invoked (1.3.2): /usr/bin/ceph-deploy install na\_fedora19  
\[ceph\_deploy.install\]\[DEBUG \] Installing stable version emperor on cluster ceph hosts na\_csc\_fedora19  
\[ceph\_deploy.install\]\[DEBUG \] Detecting platform for host na\_fedora19 ...  
\[na\_csc\_fedora19\]\[DEBUG \] connected to host: na\_csc\_fedora19  
\[na\_csc\_fedora19\]\[DEBUG \] detect platform information from remote host  
\[na\_csc\_fedora19\]\[DEBUG \] detect machine type  
\[ceph\_deploy.install\]\[INFO  \] Distro info: Fedora 19 Schrödinger’s Cat  
\[na\_csc\_fedora19\]\[INFO  \] installing ceph on na\_fedora19  
\[na\_csc\_fedora19\]\[INFO  \] Running command: rpm --import https://ceph.com/git/?p=ceph.git;a=blob\_plain;f=keys/release.asc  
\[na\_csc\_fedora19\]\[INFO  \] Running command: rpm -Uvh --replacepkgs --force --quiet http://ceph.com/rpm-emperor/fc19/noarch/ceph-release-1-0.fc19.noarch.rpm  
\[na\_csc\_fedora19\]\[DEBUG \] ########################################  
\[na\_csc\_fedora19\]\[DEBUG \] Updating / installing...  
\[na\_csc\_fedora19\]\[DEBUG \] ########################################  
\[na\_csc\_fedora19\]\[INFO  \] Running command: yum -y -q install ceph  
  
\[na\_csc\_fedora19\]\[ERROR \] Warning: RPMDB altered outside of yum.  
\[na\_csc\_fedora19\]\[DEBUG \] No Presto metadata available for Ceph  
\[na\_csc\_fedora19\]\[INFO  \] Running command: ceph --version  
\[na\_csc\_fedora19\]\[DEBUG \] ceph version 0.72.2 (a913ded2ff138aefb8cb84d347d72164099cfd60)  
\[root@storage0101-ib ceph\]#

- Create a new pool for CephFS

\# rados mkpool cephfs

- Create a new keyring (client.cephfs) for cephfs 

\# ceph auth get-or-create client.cephfs mon 'allow r' osd 'allow rwx pool=cephfs' -o /etc/ceph/client.cephfs.keyring

- Extract secret key from keyring

\# ceph-authtool -p -n client.cephfs /etc/ceph/client.cephfs.keyring > /etc/ceph/client.cephfs

- Copy the secret file to client node under /etc/ceph . This allow filesystem to mount when cephx authentication is enabled

\# scp client.cephfs na\_fedora19:/etc/ceph  
client.cephfs                                                                100%   41     0.0KB/s   00:00

- List all the keys on ceph cluster

\# ceph auth list 

  
  
Option-1 : Mount CephFS with Kernel Driver  
  
  

- On the client machine add mount point in /etc/fstab . Provide IP address of your ceph monitor node and path of secret key that we have created above

192.168.200.101:6789:/ /cephfs ceph name=cephfs,secretfile=/etc/ceph/client.cephfs,noatime 0 2 

- Mount cephfs mount point  , you might see some "_mount: error writing /etc/mtab: Invalid argument_" but you can ignore them and check  df -h

\[root@na\_fedora19 ceph\]# mount /cephfs  
mount: error writing /etc/mtab: Invalid argument  
  
\[root@na\_fedora19 ceph\]#  
\[root@na\_fedora19 ceph\]# df -h  
Filesystem              Size  Used Avail Use% Mounted on  
/dev/vda1               7.8G  2.1G  5.4G  28% /  
devtmpfs                3.9G     0  3.9G   0% /dev  
tmpfs                   3.9G     0  3.9G   0% /dev/shm  
tmpfs                   3.9G  288K  3.9G   1% /run  
tmpfs                   3.9G     0  3.9G   0% /sys/fs/cgroup  
tmpfs                   3.9G  2.6M  3.9G   1% /tmp  
_192.168.200.101:6789:/  419T  8.5T  411T   3% /cephfs_  
\[root@na\_fedora19 ceph\]#

  
Option-2 : Mounting CephFS as FUSE  

- Copy ceph configuration file ( ceph.conf ) from monitor node to client node and make sure it has permission of 644

\# scp ceph.conf na\_fedora19:/etc/ceph

\# chmod 644 ceph.conf

- Copy the secret file from monitor node to client node under /etc/ceph. This allow filesystem to mount when cephx authentication is enabled ( we have done this earlier )

\# scp client.cephfs na\_fedora19:/etc/ceph  
client.cephfs                                                                100%   41     0.0KB/s   00:00

- Make sure you have "_ceph-fuse_" package installed on client machine

\# rpm -qa | grep -i ceph-fuse  
ceph-fuse-0.72.2-0.fc19.x86\_64 

- To mount Ceph Filesystem as FUSE use ceph-fuse comand 

\[root@na\_fedora19 ceph\]# ceph-fuse -m 192.168.100.101:6789  /cephfs  
ceph-fuse\[3256\]: starting ceph client  
ceph-fuse\[3256\]: starting fuse  
\[root@na\_csc\_fedora19 ceph\]#  
  
\[root@na\_fedora19 ceph\]# df -h  
Filesystem      Size  Used Avail Use% Mounted on  
/dev/vda1       7.8G  2.1G  5.4G  28% /  
devtmpfs        3.9G     0  3.9G   0% /dev  
tmpfs           3.9G     0  3.9G   0% /dev/shm  
tmpfs           3.9G  292K  3.9G   1% /run  
tmpfs           3.9G     0  3.9G   0% /sys/fs/cgroup  
tmpfs           3.9G  2.6M  3.9G   1% /tmp  
ceph-fuse       419T  8.5T  411T   3% /cephfs  
\[root@na\_fedora19 ceph\]#

  
  
  

![](http://feeds.feedburner.com/~r/CephStorageNextBigThing/~4/8AmTd5XBIcU)
