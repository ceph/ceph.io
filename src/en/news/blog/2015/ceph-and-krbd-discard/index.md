---
title: "Ceph and KRBD discard"
date: "2015-01-25"
author: "shan"
tags: 
---

![Ceph and KRBD discard](http://sebastien-han.fr/images/ceph-krbd-discard-support.jpg)

Space reclamation mechanism for the Kernel RBD module. Having this kind of support is really crucial for operators and ease your capacity planing. RBD images are sparse, thus size after creation is equal to 0 MB. The main issue with sparse images is that images grow to eventually reach their entire size. The thing is Ceph doesn't know anything that this happening on top of that block especially if you have a filesystem. You can easily write the entire filesystem and then delete everything, Ceph will still believe that the block is fully used and will keep that metric. However thanks to the discard support on the block device, the filesystem can send discard flush commands to the block. In the end, the storage will free up blocks.

This feature was added into the Kernel 3.18.

Let's create a RBD image

\`\`\`bash $ rbd create -s 10240 leseb $ rbd info leseb rbd image 'leseb': size 10240 MB in 2560 objects order 22 (4096 kB objects) block\_name\_prefix: rb.0.1066.74b0dc51 format: 1

$ rbd diff rbd/leseb | awk '{ SUM += $2 } END { print SUM/1024/1024 " MB" }' 0 MB \`\`\`

Map it to a host and put a filesystem on top of it:

\`\`\`bash $ sudo rbd -p rbd map leseb /dev/rbd0

$ sudo rbd showmapped id pool image snap device 0 rbd leseb - /dev/rbd0

$ sudo mkfs.xfs /dev/rbd0 log stripe unit (4194304 bytes) is too large (maximum is 256KiB) log stripe unit adjusted to 32KiB meta-data=/dev/rbd0 isize=256 agcount=17, agsize=162816 blks

```
     =                       sectsz=512   attr=2, projid32bit=0
```

data = bsize=4096 blocks=2621440, imaxpct=25

```
     =                       sunit=1024   swidth=1024 blks
```

naming =version 2 bsize=4096 ascii-ci=0 log =internal log bsize=4096 blocks=2560, version=2

```
     =                       sectsz=512   sunit=8 blks, lazy-count=1
```

realtime =none extsz=4096 blocks=0, rtextents=0

$ sudo mount /dev/rbd0 /mnt \`\`\`

Ok we are all set now, so let's write some data:

\`\`\`bash $ dd if=/dev/zero of=/mnt/leseb bs=1M count=128 128+0 records in 128+0 records out 134217728 bytes (134 MB) copied, 2.88215 s, 46.6 MB/s

$ df -h /mnt/ Filesystem Size Used Avail Use% Mounted on /dev/rbd0 10G 161M 9.9G 2% /mnt \`\`\`

Then we check the size of the image again:

`bash $ rbd diff rbd/leseb | awk '{ SUM += $2 } END { print SUM/1024/1024 " MB" }' 142.406 MB`

We know have 128MB of data and ~14,406MB of filesystem data/metadata. Check that discard is properly enabled on the device:

`bash root@ceph-mon0:~# cat /sys/block/rbd0/queue/discard_* 4194304 4194304 1`

Now let's check the default behavior, when discard is not supported, we delete our 128 MB file so we free up some space on the filesystem. Unfortunately Ceph didn't notice anything and still believes that this 128 MB of data are still there.

`bash $ rm /mnt/leseb $ rbd diff rbd/leseb | awk '{ SUM += $2 } END { print SUM/1024/1024 " MB" }' 142.406 MB`

Now let's Run the `fstrim` command on the mounted filesystem to instruct the block to free up unused space:

`bash $ fstrim /mnt/ $ rbd diff rbd/leseb | awk '{ SUM += $2 } END { print SUM/1024/1024 " MB" }' 10.6406 MB`

Et voilà ! Ceph freed up our 128 MB.

If you want to run discard on the fly and let the filesystem check for discard all the time you can mount the filesystem with the `discard` option:

\`\`\`bash $ mount -o discard /dev/rbd0 /mnt/

$ mount | grep rbd /dev/rbd0 on /mnt type xfs (rw,discard) \`\`\`

  

> Note that using the `discard` mount option can be a real performance killer. So generally you want to trigger the `fstrim` command through a daily cron job.
