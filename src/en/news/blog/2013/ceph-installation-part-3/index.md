---
title: "Ceph Installation :: Part-3"
date: "2013-12-05"
author: "syndicated"
tags: 
  - "ceph"
---

  
  

### Creating Block Device from Ceph[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "Creating Block Device from Ceph")

- From monitor node , use ceph-deploy to install Ceph on your ceph-client1 node.

\[root@ceph-mon1 ~\]# ceph-deploy install ceph-client1  
\[ceph\_deploy.cli\]\[INFO  \] Invoked (1.3): /usr/bin/ceph-deploy install ceph-client1  
\[ceph\_deploy.install\]\[DEBUG \] Installing stable version dumpling on cluster ceph hosts ceph-client1  
\[ceph\_deploy.install\]\[DEBUG \] Detecting platform for host ceph-client1 ...  
\[ceph-client1\]\[DEBUG \] connected to host: ceph-client1  
\[ceph-client1\]\[DEBUG \] detect platform information from remote host  
\[ceph-client1\]\[DEBUG \] detect machine type  
\[ceph\_deploy.install\]\[INFO  \] Distro info: Ubuntu 13.04 raring  
\[ceph-client1\]\[INFO  \] installing ceph on ceph-client1  
\[ceph-client1\]\[INFO  \] Running command: env DEBIAN\_FRONTEND=noninteractive apt-get -q install --assume-yes ca-certificates  
\[ceph-client1\]\[DEBUG \] Reading package lists...  
\[ceph-client1\]\[DEBUG \] Building dependency tree...  
\[ceph-client1\]\[DEBUG \] Reading state information...  
\[ceph-client1\]\[DEBUG \] ca-certificates is already the newest version.  
\[ceph-client1\]\[DEBUG \] 0 upgraded, 0 newly installed, 0 to remove and 105 not upgraded.  
\[ceph-client1\]\[INFO  \] Running command: wget -q -O- 'https://ceph.com/git/?p=ceph.git;a=blob\_plain;f=keys/release.asc' | apt-key add - 
\[ceph-client1\]\[WARNIN\] command returned non-zero exit status: 4  
\[ceph-client1\]\[DEBUG \] add ceph deb repo to sources.list  
\[ceph-client1\]\[INFO  \] Running command: apt-get -q update  
\[ceph-client1\]\[DEBUG \] Hit http://security.ubuntu.com raring-security Release.gpg  
\[ceph-client1\]\[DEBUG \] Hit http://security.ubuntu.com raring-security Release  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring Release.gpg  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring-updates Release.gpg  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring Release  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring-updates Release  
\[ceph-client1\]\[DEBUG \] Hit http://security.ubuntu.com raring-security/main Sources  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring/main Sources  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring/universe Sources  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring/main amd64 Packages  
\[ceph-client1\]\[DEBUG \] Hit http://security.ubuntu.com raring-security/universe Sources  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring/universe amd64 Packages  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring/main i386 Packages  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring/universe i386 Packages  
\[ceph-client1\]\[DEBUG \] Hit http://security.ubuntu.com raring-security/main amd64 Packages  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring/main Translation-en  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring/universe Translation-en  
\[ceph-client1\]\[DEBUG \] Hit http://security.ubuntu.com raring-security/universe amd64 Packages  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring-updates/main Sources  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring-updates/universe Sources  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring-updates/main amd64 Packages  
\[ceph-client1\]\[DEBUG \] Hit http://security.ubuntu.com raring-security/main i386 Packages  
\[ceph-client1\]\[DEBUG \] Get:1 http://ceph.com raring Release.gpg \[836 B\]  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring-updates/universe amd64 Packages  
\[ceph-client1\]\[DEBUG \] Hit http://security.ubuntu.com raring-security/universe i386 Packages  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring-updates/main i386 Packages  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring-updates/universe i386 Packages  
\[ceph-client1\]\[DEBUG \] Hit http://ceph.com raring Release  
\[ceph-client1\]\[DEBUG \] Hit http://security.ubuntu.com raring-security/main Translation-en  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring-updates/main Translation-en  
\[ceph-client1\]\[DEBUG \] Hit http://nova.clouds.archive.ubuntu.com raring-updates/universe Translation-en  
\[ceph-client1\]\[DEBUG \] Hit http://security.ubuntu.com raring-security/universe Translation-en  
\[ceph-client1\]\[DEBUG \] Hit http://ceph.com raring/main amd64 Packages  
\[ceph-client1\]\[DEBUG \] Hit http://ceph.com raring/main i386 Packages  
\[ceph-client1\]\[DEBUG \] Ign http://ceph.com raring/main Translation-en  
\[ceph-client1\]\[DEBUG \] Fetched 836 B in 15s (55 B/s)  
\[ceph-client1\]\[DEBUG \] Reading package lists...  
\[ceph-client1\]\[INFO  \] Running command: env DEBIAN\_FRONTEND=noninteractive DEBIAN\_PRIORITY=critical apt-get -q -o Dpkg::Options::=--force-confnew --no-install-recommends --assume-yes install -- ceph ceph-mds ceph-common ceph-fs-common gdisk  
\[ceph-client1\]\[DEBUG \] Reading package lists...  
\[ceph-client1\]\[DEBUG \] Building dependency tree...  
\[ceph-client1\]\[DEBUG \] Reading state information...  
\[ceph-client1\]\[DEBUG \] gdisk is already the newest version.  
\[ceph-client1\]\[DEBUG \] The following extra packages will be installed:  
\[ceph-client1\]\[DEBUG \]   binutils libaio1 libboost-thread1.49.0 libgoogle-perftools4 libjs-jquery  
\[ceph-client1\]\[DEBUG \]   libleveldb1 libnspr4 libnss3 librados2 librbd1 libreadline5 libsnappy1  
\[ceph-client1\]\[DEBUG \]   libtcmalloc-minimal4 libunwind8 python-ceph python-flask python-jinja2  
\[ceph-client1\]\[DEBUG \]   python-markupsafe python-werkzeug xfsprogs  
\[ceph-client1\]\[DEBUG \] Suggested packages:  
\[ceph-client1\]\[DEBUG \]   binutils-doc javascript-common python-jinja2-doc ipython python-genshi  
\[ceph-client1\]\[DEBUG \]   python-lxml python-memcache libjs-sphinxdoc xfsdump acl attr quota  
\[ceph-client1\]\[DEBUG \] Recommended packages:  
\[ceph-client1\]\[DEBUG \]   btrfs-tools ceph-fuse libcephfs1  
\[ceph-client1\]\[DEBUG \] The following NEW packages will be installed:  
\[ceph-client1\]\[DEBUG \]   binutils ceph ceph-common ceph-fs-common ceph-mds libaio1  
\[ceph-client1\]\[DEBUG \]   libboost-thread1.49.0 libgoogle-perftools4 libjs-jquery libleveldb1 libnspr4  
\[ceph-client1\]\[DEBUG \]   libnss3 librados2 librbd1 libreadline5 libsnappy1 libtcmalloc-minimal4  
\[ceph-client1\]\[DEBUG \]   libunwind8 python-ceph python-flask python-jinja2 python-markupsafe  
\[ceph-client1\]\[DEBUG \]   python-werkzeug xfsprogs  
\[ceph-client1\]\[DEBUG \] 0 upgraded, 24 newly installed, 0 to remove and 105 not upgraded.  
\[ceph-client1\]\[DEBUG \] Need to get 40.9 MB of archives.  
\[ceph-client1\]\[DEBUG \] After this operation, 192 MB of additional disk space will be used.  
\[ceph-client1\]\[DEBUG \] Get:1 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main libaio1 amd64 0.3.109-3 \[6328 B\]  
\[ceph-client1\]\[DEBUG \] Get:2 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main libsnappy1 amd64 1.0.5-2 \[13.2 kB\]  
\[ceph-client1\]\[DEBUG \] Get:3 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main libleveldb1 amd64 1.9.0-1 \[138 kB\]  
\[ceph-client1\]\[DEBUG \] Get:4 http://ceph.com/debian-dumpling/ raring/main librados2 amd64 0.67.4-1raring \[1635 kB\]  
\[ceph-client1\]\[DEBUG \] Get:5 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main libnspr4 amd64 2:4.9.5-1ubuntu1 \[134 kB\]  
\[ceph-client1\]\[DEBUG \] Get:6 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main libnss3 amd64 2:3.14.3-0ubuntu1 \[1044 kB\]  
\[ceph-client1\]\[DEBUG \] Get:7 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main libreadline5 amd64 5.2+dfsg-1 \[131 kB\]  
\[ceph-client1\]\[DEBUG \] Get:8 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main libunwind8 amd64 1.0.1-4ubuntu2 \[55.9 kB\]  
\[ceph-client1\]\[DEBUG \] Get:9 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main binutils amd64 2.23.2-2ubuntu1 \[2393 kB\]  
\[ceph-client1\]\[DEBUG \] Get:10 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main libboost-thread1.49.0 amd64 1.49.0-3.2ubuntu1 \[41.6 kB\]  
\[ceph-client1\]\[DEBUG \] Get:11 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main libjs-jquery all 1.7.2+debian-1ubuntu1 \[115 kB\]  
\[ceph-client1\]\[DEBUG \] Get:12 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main python-werkzeug all 0.8.3+dfsg-1 \[1333 kB\]  
\[ceph-client1\]\[DEBUG \] Get:13 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main python-markupsafe amd64 0.15-1build3 \[13.8 kB\]  
\[ceph-client1\]\[DEBUG \] Get:14 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main python-jinja2 amd64 2.6-1build3 \[158 kB\]  
\[ceph-client1\]\[DEBUG \] Get:15 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main python-flask all 0.9-1 \[56.1 kB\]  
\[ceph-client1\]\[DEBUG \] Get:16 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main xfsprogs amd64 3.1.9 \[1238 kB\]  
\[ceph-client1\]\[DEBUG \] Get:17 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main libtcmalloc-minimal4 amd64 2.0-4ubuntu1 \[163 kB\]  
\[ceph-client1\]\[DEBUG \] Get:18 http://nova.clouds.archive.ubuntu.com/ubuntu/ raring/main libgoogle-perftools4 amd64 2.0-4ubuntu1 \[412 kB\]  
\[ceph-client1\]\[DEBUG \] Get:19 http://ceph.com/debian-dumpling/ raring/main librbd1 amd64 0.67.4-1raring \[276 kB\]  
\[ceph-client1\]\[DEBUG \] Get:20 http://ceph.com/debian-dumpling/ raring/main python-ceph amd64 0.67.4-1raring \[39.7 kB\]  
\[ceph-client1\]\[DEBUG \] Get:21 http://ceph.com/debian-dumpling/ raring/main ceph-common amd64 0.67.4-1raring \[6090 kB\]  
\[ceph-client1\]\[DEBUG \] Get:22 http://ceph.com/debian-dumpling/ raring/main ceph amd64 0.67.4-1raring \[22.8 MB\]  
\[ceph-client1\]\[DEBUG \] Get:23 http://ceph.com/debian-dumpling/ raring/main ceph-fs-common amd64 0.67.4-1raring \[28.2 kB\]  
\[ceph-client1\]\[DEBUG \] Get:24 http://ceph.com/debian-dumpling/ raring/main ceph-mds amd64 0.67.4-1raring \[2676 kB\]  
\[ceph-client1\]\[DEBUG \] Fetched 40.9 MB in 12s (3212 kB/s)  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package libaio1:amd64. 
\[ceph-client1\]\[DEBUG \] (Reading database ... 58918 files and directories currently installed.)  
\[ceph-client1\]\[DEBUG \] Unpacking libaio1:amd64 (from .../libaio1\_0.3.109-3\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package libsnappy1. 
\[ceph-client1\]\[DEBUG \] Unpacking libsnappy1 (from .../libsnappy1\_1.0.5-2\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package libleveldb1:amd64. 
\[ceph-client1\]\[DEBUG \] Unpacking libleveldb1:amd64 (from .../libleveldb1\_1.9.0-1\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package libnspr4:amd64. 
\[ceph-client1\]\[DEBUG \] Unpacking libnspr4:amd64 (from .../libnspr4\_2%3a4.9.5-1ubuntu1\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package libnss3:amd64. 
\[ceph-client1\]\[DEBUG \] Unpacking libnss3:amd64 (from .../libnss3\_2%3a3.14.3-0ubuntu1\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package libreadline5:amd64. 
\[ceph-client1\]\[DEBUG \] Unpacking libreadline5:amd64 (from .../libreadline5\_5.2+dfsg-1\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package libunwind8. 
\[ceph-client1\]\[DEBUG \] Unpacking libunwind8 (from .../libunwind8\_1.0.1-4ubuntu2\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package binutils.  
\[ceph-client1\]\[DEBUG \] Unpacking binutils (from .../binutils\_2.23.2-2ubuntu1\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package libboost-thread1.49.0. 
\[ceph-client1\]\[DEBUG \] Unpacking libboost-thread1.49.0 (from .../libboost-thread1.49.0\_1.49.0-3.2ubuntu1\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package librados2. 
\[ceph-client1\]\[DEBUG \] Unpacking librados2 (from .../librados2\_0.67.4-1raring\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package librbd1. 
\[ceph-client1\]\[DEBUG \] Unpacking librbd1 (from .../librbd1\_0.67.4-1raring\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package libjs-jquery.  
\[ceph-client1\]\[DEBUG \] Unpacking libjs-jquery (from .../libjs-jquery\_1.7.2+debian-1ubuntu1\_all.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package python-werkzeug.  
\[ceph-client1\]\[DEBUG \] Unpacking python-werkzeug (from .../python-werkzeug\_0.8.3+dfsg-1\_all.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package python-markupsafe.  
\[ceph-client1\]\[DEBUG \] Unpacking python-markupsafe (from .../python-markupsafe\_0.15-1build3\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package python-jinja2. 
\[ceph-client1\]\[DEBUG \] Unpacking python-jinja2 (from .../python-jinja2\_2.6-1build3\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package python-flask.  
\[ceph-client1\]\[DEBUG \] Unpacking python-flask (from .../python-flask\_0.9-1\_all.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package python-ceph.  
\[ceph-client1\]\[DEBUG \] Unpacking python-ceph (from .../python-ceph\_0.67.4-1raring\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package ceph-common.  
\[ceph-client1\]\[DEBUG \] Unpacking ceph-common (from .../ceph-common\_0.67.4-1raring\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package xfsprogs.  
\[ceph-client1\]\[DEBUG \] Unpacking xfsprogs (from .../xfsprogs\_3.1.9\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package libtcmalloc-minimal4. 
\[ceph-client1\]\[DEBUG \] Unpacking libtcmalloc-minimal4 (from .../libtcmalloc-minimal4\_2.0-4ubuntu1\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package libgoogle-perftools4. 
\[ceph-client1\]\[DEBUG \] Unpacking libgoogle-perftools4 (from .../libgoogle-perftools4\_2.0-4ubuntu1\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package ceph.  
\[ceph-client1\]\[DEBUG \] Unpacking ceph (from .../ceph\_0.67.4-1raring\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package ceph-fs-common.  
\[ceph-client1\]\[DEBUG \] Unpacking ceph-fs-common (from .../ceph-fs-common\_0.67.4-1raring\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Selecting previously unselected package ceph-mds.  
\[ceph-client1\]\[DEBUG \] Unpacking ceph-mds (from .../ceph-mds\_0.67.4-1raring\_amd64.deb) ...  
\[ceph-client1\]\[DEBUG \] Processing triggers for man-db ...  
\[ceph-client1\]\[DEBUG \] Processing triggers for ureadahead ...  
\[ceph-client1\]\[DEBUG \] Setting up libaio1:amd64 (0.3.109-3) ...  
\[ceph-client1\]\[DEBUG \] Setting up libsnappy1 (1.0.5-2) ...  
\[ceph-client1\]\[DEBUG \] Setting up libleveldb1:amd64 (1.9.0-1) ...  
\[ceph-client1\]\[DEBUG \] Setting up libnspr4:amd64 (2:4.9.5-1ubuntu1) ...  
\[ceph-client1\]\[DEBUG \] Setting up libnss3:amd64 (2:3.14.3-0ubuntu1) ...  
\[ceph-client1\]\[DEBUG \] Setting up libreadline5:amd64 (5.2+dfsg-1) ...  
\[ceph-client1\]\[DEBUG \] Setting up libunwind8 (1.0.1-4ubuntu2) ...  
\[ceph-client1\]\[DEBUG \] Setting up binutils (2.23.2-2ubuntu1) ...  
\[ceph-client1\]\[DEBUG \] Setting up libboost-thread1.49.0 (1.49.0-3.2ubuntu1) ...  
\[ceph-client1\]\[DEBUG \] Setting up librados2 (0.67.4-1raring) ...  
\[ceph-client1\]\[DEBUG \] Setting up librbd1 (0.67.4-1raring) ...  
\[ceph-client1\]\[DEBUG \] Setting up libjs-jquery (1.7.2+debian-1ubuntu1) ...  
\[ceph-client1\]\[DEBUG \] Setting up python-werkzeug (0.8.3+dfsg-1) ...  
\[ceph-client1\]\[DEBUG \] Setting up python-markupsafe (0.15-1build3) ...  
\[ceph-client1\]\[DEBUG \] Setting up python-jinja2 (2.6-1build3) ...  
\[ceph-client1\]\[DEBUG \] Setting up python-flask (0.9-1) ...  
\[ceph-client1\]\[DEBUG \] Setting up python-ceph (0.67.4-1raring) ...  
\[ceph-client1\]\[DEBUG \] Setting up ceph-common (0.67.4-1raring) ...  
\[ceph-client1\]\[DEBUG \] Setting up xfsprogs (3.1.9) ...  
\[ceph-client1\]\[DEBUG \] Setting up libtcmalloc-minimal4 (2.0-4ubuntu1) ...  
\[ceph-client1\]\[DEBUG \] Setting up libgoogle-perftools4 (2.0-4ubuntu1) ...  
\[ceph-client1\]\[DEBUG \] Setting up ceph (0.67.4-1raring) ...  
\[ceph-client1\]\[DEBUG \] ceph-all start/running  
\[ceph-client1\]\[DEBUG \] Setting up ceph-fs-common (0.67.4-1raring) ...  
\[ceph-client1\]\[DEBUG \] Processing triggers for ureadahead ...  
\[ceph-client1\]\[DEBUG \] Setting up ceph-mds (0.67.4-1raring) ...  
\[ceph-client1\]\[DEBUG \] ceph-mds-all start/running  
\[ceph-client1\]\[DEBUG \] Processing triggers for libc-bin ...  
\[ceph-client1\]\[DEBUG \] ldconfig deferred processing now taking place  
\[ceph-client1\]\[DEBUG \] Processing triggers for ureadahead ...  
\[ceph-client1\]\[INFO  \] Running command: ceph --version  
\[ceph-client1\]\[DEBUG \] ceph version 0.67.4 (ad85b8bfafea6232d64cb7ba76a8b6e8252fa0c7)  
\[root@ceph-mon1 ~\]# 

- From monitor node , use ceph-deploy to copy the Ceph configuration file and the ceph.client.admin.keyring to the ceph-client1.

\[root@ceph-mon1 ceph\]# ceph-deploy admin ceph-client1  
\[ceph\_deploy.cli\]\[INFO  \] Invoked (1.3): /usr/bin/ceph-deploy admin ceph-client1  
\[ceph\_deploy.admin\]\[DEBUG \] Pushing admin keys and conf to ceph-client1  
\[ceph-client1\]\[DEBUG \] connected to host: ceph-client1  
\[ceph-client1\]\[DEBUG \] detect platform information from remote host  
\[ceph-client1\]\[DEBUG \] detect machine type  
\[ceph-client1\]\[DEBUG \] get remote short hostname  
\[ceph-client1\]\[DEBUG \] write cluster configuration to /etc/ceph/{cluster}.conf  
\[root@ceph-mon1 ceph\]#

- On the ceph-client1 node, create a block device image.

rbd create block1-ceph-client1 --size 200  

- On the ceph-client1 node, load the rbd client module.

modprobe rbd

- On the ceph-client1 node, map the image to a block device.

root@ceph-client1:~# rbd map block1-ceph-client1  
root@ceph-client1:~#  
root@ceph-client1:~#  
root@ceph-client1:~# rbd showmapped  
id pool image               snap device  
1  rbd  block1-ceph-client1 - /dev/rbd1  
root@ceph-client1:~#  

- Use the block device by creating a file system on the ceph-client1 node.

root@ceph-client1:/dev/rbd/rbd# mkfs.ext4 /dev/rbd/rbd/block1-ceph-client1  
mke2fs 1.42.5 (29-Jul-2012)  
Filesystem label=  
OS type: Linux  
Block size=1024 (log=0)  
Fragment size=1024 (log=0)  
Stride=4096 blocks, Stripe width=4096 blocks  
51200 inodes, 204800 blocks  
10240 blocks (5.00%) reserved for the super user  
First data block=1  
Maximum filesystem blocks=67371008  
25 block groups  
8192 blocks per group, 8192 fragments per group  
2048 inodes per group  
Superblock backups stored on blocks:  
   8193, 24577, 40961, 57345, 73729  
  
Allocating group tables: done  
Writing inode tables: done  
Creating journal (4096 blocks): done  
Writing superblocks and filesystem accounting information: done  
  
root@ceph-client1:/dev/rbd/rbd#  

- Mount the file system on the ceph-client1 node.

  

  

root@ceph-client1:/dev/rbd/rbd# mount /dev/rbd/rbd/block1-ceph-client1 /rbd-1/  
root@ceph-client1:/dev/rbd/rbd#  
root@ceph-client1:/dev/rbd/rbd#  
root@ceph-client1:/dev/rbd/rbd#  
root@ceph-client1:/dev/rbd/rbd# df -h  
Filesystem      Size  Used Avail Use% Mounted on  
/dev/vda1       9.8G  1.3G  8.0G  14% /  
none            4.0K     0  4.0K   0% /sys/fs/cgroup  
udev            487M  8.0K  487M   1% /dev  
tmpfs           100M  256K  100M   1% /run  
none            5.0M     0  5.0M   0% /run/lock  
none            498M     0  498M   0% /run/shm  
none            100M     0  100M   0% /run/user  
/dev/vdb        109G  188M  103G   1% /mnt  
/dev/rbd1       190M  1.6M  179M   1% /rbd-1  
root@ceph-client1:/dev/rbd/rbd#  

  
  
  

![](http://feeds.feedburner.com/~r/CephStorageNextBigThing/~4/85z6RgTm-wA)
