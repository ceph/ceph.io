---
title: "Sharing hard drives with Ceph"
date: "2014-04-22"
author: "loic"
tags: 
  - "ceph"
---

A group of users give hard drives to the system administrator of the [Ceph](http://ceph.com/) cluster. In exchange, each of them get credentials to access a dedicated [pool](http://ceph.com/docs/master/rados/operations/pools/) of a given size from the Ceph cluster.  
  
The system administrator runs:

\# ceph-authtool jean-keyring --create-keyring --name client.jean \\
   --gen-key --set-uid 458 \\
   --cap mon 'allow profile simple-rados-client' \\
   --cap osd 'allow rwx pool=jean-pool'
creating jean-keyring
# ceph auth import --in-file jean-keyring
imported keyring
# ceph auth get client.jean
exported keyring for client.jean
\[client.jean\]
        key = AQCziVZT6EJoIRAA/HVxueyPmRGjvqQeOR40hQ==
        auid = 458
        caps mon = "allow profile simple-rados-client"
        caps osd = "allow rwx pool=jean-pool"

which creates the user **client.jean** in the Ceph cluster, with limited access to the monitors ( **simple-rados-client** ) and read write access to the OSDs but only for the benefit of accessing the (not yet existent), pool **jean-pool**. The pool is then created with:

\# cat > create-pool-auid.py <<EOF
import rados
import sys
cluster = rados.Rados(conffile = '/etc/ceph/ceph.conf')
cluster.connect()
cluster.create\_pool(sys.argv\[1\], int(sys.argv\[2\]))
EOF
# python create-pool-auid.py jean-pool 458
# ceph osd pool set-quota jean-pool max\_bytes $((1024 \* 1024 \* 1024))
set-quota max\_bytes = 1073741824 for pool jean-pool

The python API is used to set jean as the owner of the pool, via the **auid** value **458** that was associated to it when it was created. The quota of the pool is set to 1GB and writes will fail when it is reached:

rados  put --pool jean-pool GROUP /etc/group
error putting jean-pool/GROUP: No space left on device

The user is provided with the keyring that was just created and a ceph.conf file with the list of monitors to access the cluster:

\[global\]
auth\_service\_required = cephx
fsid = 8790ab57-f06f-4b27-8507-55c8d59e1327
auth\_supported = cephx
auth\_cluster\_required = cephx
mon\_host = 10.89.0.2
auth\_client\_required = cephx

The user can then create an [RBD](http://ceph.com/docs/master/rbd/rbd/) volume with:

\# rbd --name client.jean --keyring jean-keyring --pool jean-pool create --size 100 vda
# rbd --name client.jean --keyring jean-keyring --pool jean-pool info vda
rbd image 'vda':
        size 102400 kB in 25 objects
        order 22 (4096 kB objects)
        block\_name\_prefix: rb.0.10f5.74b0dc51
        format: 1

It is then mapped as a block device with:

\# rbd --name client.jean --keyring jean-keyring --pool jean-pool map vda
# dmesg
...
  232.099642\] Key type ceph registered
\[  232.099695\] libceph: loaded (mon/osd proto 15/24)
\[  232.100879\] rbd: loaded rbd (rados block device)
\[  232.102434\] libceph: client4399 fsid 8790ab57-f06f-4b27-8507-55c8d59e1327
\[  232.102971\] libceph: mon0 10.89.0.2:6789 session established
\[  232.159177\]  rbd1: unknown partition table
\[  232.159230\] rbd: rbd1: added with size 0x6400000
# ls -l /dev/rbd1
brw-rw---- 1 root disk 251, 0 Apr 22 17:49 /dev/rbd1

and can be formatted and mounted as a file system with:

\# mkfs /dev/rbd1
mke2fs 1.42.9 (4-Feb-2014)
Filesystem label=
OS type: Linux
Block size=1024 (log=0)
Fragment size=1024 (log=0)
Stride=4096 blocks, Stripe width=4096 blocks
25688 inodes, 102400 blocks
5120 blocks (5.00%) reserved for the super user
First data block=1
Maximum filesystem blocks=67371008
13 block groups
8192 blocks per group, 8192 fragments per group
1976 inodes per group
Superblock backups stored on blocks:
        8193, 24577, 40961, 57345, 73729
Allocating group tables: done
Writing inode tables: done
Writing superblocks and filesystem accounting information: done
# mount /dev/rbd1 /mnt
# df -h /mnt
Filesystem      Size  Used Avail Use% Mounted on
/dev/rbd1        97M  1.6M   91M   2% /mnt

Note: The [proposed change to automatically set auid with when the pool is created](http://tracker.ceph.com/issues/8185) is too intrusive. Alternatively, a [ceph osd pool set auid](https://github.com/ceph/ceph/pull/1717) is proposed to provide a way to set **auid** using a shell command line instead of python code.
