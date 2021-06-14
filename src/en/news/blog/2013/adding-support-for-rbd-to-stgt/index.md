---
title: "Adding Support for RBD to stgt"
date: "2013-03-21"
author: "dmick"
tags: 
  - "planet"
---

[tgt](http://stgt.sourceforge.net), the Linux SCSI target framework (well, one of them) is an iSCSI target implementation whose goals include implementing a large portion of the SCSI emulation code in userland. tgt can provide iSCSI over Ethernet or iSER (iSCSI extensions for RDMA) over Infiniband. It can emulate various SCSI target types (really  
“command sets”):

- SBC (normal “disk” type devices)
- SMC (“jukebox” media changer)
- MMC (CD/DVD drive)
- SSC (tape device)
- OSD (the ‘object storage device’)

It can use either a raw block device or a file as backing storage for any of these device types.

Well, since Ceph provides a distributed reliable storage pool on the network, having a way to access that storage as an iSCSI device seems natural; this way clients that speak iSCSI don’t even need to be aware that their storage is on the Ceph cluster (except to know that it’s highly available and safe). Virtual machine providers and cloud software of many types can speak iSCSI, and if Ceph could export storage as an iSCSI device, it would be easy to glue all those providers to a Ceph cluster.

To that end, I’ve written a backend for tgt that can use a RADOS block device ([rbd](http://ceph.com/docs/master/rbd/rbd/)) image as the storage for the iSCSI target device. Now, you may be saying, “but wait, I can already create an RBD image on the Ceph cluster, map it in my kernel as a block device, and use tgt or LIO or other iSCSI tools to export it as an iSCSI target”, and that’s correct; people do this with success today. However, the completely-userland approach has several benefits:

- the userland code for rbd typically leads the kernel implementation with respect to new features. At the time of this writing, userland rbd can use copy-on-write cloning and ‘fancy striping’, which are still being implemented in the kernel
- userland code can be compiled and installed on older kernels that may not have the kernel rbd module available at all, or may have an older, less-stable version
- avoiding the kernel can be useful for throttling memory/bandwidth, management in general, delegating access, security, avoiding kernel crashes, etc.
- Without risk of memory deadlock, we can perform much better caching in the userland librbd

Of course these advantages don’t come for free; there can also be a cost in performance. The tgt project has taken some care to try to mitigate performance effects, but your mileage may vary. However, the ease of the port, and the ease of modifying it for new features makes this a worthwhile effort even in the face of possible performance hits.

### The bs\_rbd backing-store driver

Adding rbd support to tgt was fairly simple due to its modular design and simple backing-store drivers. Starting from the bs\_rdwr backing-store driver, which backs the daemon-provided instances with either a file in a filesystem or a block device, using normal open/close /read/write functions, I added the initialization to open a connection to the RADOS cluster using librados, and a small function to parse the rbd pool, imagename, and snapshot name out of the arguments (see below). Then the POSIX calls were translated into librbd calls for rbd\_open, rbd\_close, etc. librbd is very similar to POSIX file operations in both its synchronous and asynchronous forms, so the translation was obvious and easy.

The patch to add bs\_rbd has been accepted into the [mainline repository](http://github.com/fujita/tgt) as of mid-February 2013, along with some very brief README information on how to use it. _Edit: however, tgtd must be built with the CEPH\_RBD flag in order to support rbd; you may need to build it yourself from source. You can check if support is present with the command_

tgtadm --lld iscsi --mode system --op show

‘rbd’ should appear in “Backing stores:” if your tgtd supports rbd.

Here’s a little expansion on that brief usage:

tgtd is configured by the tgtadm command; to select an RBD image as the backend storage for a tgtd instance, you use the –bstype rbd option to tell tgtd that it should access the storage using bs\_rbd. Also, use the –backing-store option to select the (already-existing) rbd image in the usual Ceph syntax: –backing-store \[pool/\]image\[@snap\] to select an rbd image named ‘image’, optionally in pool ‘pool’, and optionally a readonly snapshot of that image @snap. You can create the image in the usual way, using the rbd command-line tool.

You must give the device you’re creating a name; a typical name form would be an ‘IQN’ (iSCSI qualified name), of the form: iqn.<year>-<month>.<domain>:<domain-specified-string> but no particular form seems to be required, so ‘testrbd’ works just as well. In my testing I created a target named simply “rbd”.

### Using bs\_rbd with tgtd

So a typical setup using manual commands might go like this: First, create an image on your running Ceph cluster:

rbd create iscsi-image --size 500       # a 500 MB image named iscsi-image

tgtadm/tgtd will access the cluster using the configuration supplied via the default Ceph configuration files (by default, /etc/ceph/$cluster.conf, ~/.ceph/$cluster.conf, and ./$cluster.conf, where $cluster is, by default, ‘ceph’), or by the CEPH\_CONF environment variable; make sure your configuration is accessible through one of those settings.

Next, create a new target for the tgtd daemon to emulate (_Edit: as of 16 Jul 2013 you may not use tid 0 for reasons that are unclear_):

tgtadm --lld iscsi --mode target --op new --tid 1 --targetname rbd

Create a LUN on this target bound to an rbd image (_Edit: lun 0 is always reserved for a ‘control’ node, so lun 1 is the first available_):

tgtadm --lld iscsi --mode logicalunit --op new --tid 1 --lun 1 --backing-store iscsi-image --bstype rbd

Allow access to that lun:

tgtadm --lld iscsi --op bind --mode target --tid 1 -I ALL

Verify that the image can be seen by a local iscsi initiator. Here I’m using iscsiadm, part of the open-iscsi package:

iscsiadm -m discovery -t st -p localhost

Log into node, which will create a /dev/sdX block device:

iscsiadm -m node --login

Now you can access the device locally as /dev/sdX using iSCSI. You can also perform the last two steps from a different network host, specifying -p <tgtd-hostname>, of course.

When you’re done, you can terminate the session and remove the device:

iscsiadm -m node --logout

### Details of the bs\_rbd backing-store driver, possible future work

As a first implementation, I wrote the bs\_rbd driver to handle up to 20 simultaneous rbd images (just an arbitrary fixed-size-array limit), and used the bs\_rdwr module as a starting point, so that I/O is synchronous to the RADOS cluster. However, tgtd itself maintains a thread worker pool of, by default, 16 threads, so while I/O blocks in the RADOS cluster, the daemon itself maintains multiple outstanding requests. The thread count can be adjusted with -t or –nr-iothreads when creating the LUN.

It’s possible that using librbd’s asynchronous-I/O support would improve performance or CPU utilization; this is something that could be the basis of experiments. I chose the simpler implementation as a working proof-of-concept; performance studies and experiments would be welcomed.

The driver links against librbd and librados, so those must be installed on your machine to build, and you must select the configuration option CEPH\_RBD by, for example, “make CEPH\_RBD=1″.

### Try it!

So that’s the story of rbd support in tgt! Please try it out and let us know what you think; report any bugs to the stgt mailing list and the ceph development list: stgt@vger.kernel.org and ceph-devel@vger.kernel.org.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/dev-notes/adding-support-for-rbd-to-stgt/&bvt=rss&p=wordpress)
