---
title: "Start with the RBD support for TGT"
date: "2014-07-07"
author: "shan"
tags: 
  - "planet"
---

{% img center http://sebastien-han.fr/images/ceph-rbd-tgt.jpg Start with the RBD support for TGT %}

A couple a months ago, [Dan Mick](http://ceph.com/dev-notes/adding-support-for-rbd-to-stgt/) posted a nice article that introduced the RBD support for iSCSI / TGT. In this article, I will have a look at it.

  

# I. OSD Server side

The following actions must be performed on your OSD nodes.

Add the Ceph extra repositorie since it contains a package version of TGT with the RBD support. And install the package:

`bash $ echo "deb http://ceph.com/packages/ceph-extras/debian $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/ceph-extras.list $ sudo apt-get update && sudo apt-get install tgt`

We can check that tgt has been well compiled with the RBD support:

\`\`\`bash $ sudo tgtadm --lld iscsi --op show --mode system | grep rbd

```
rbd (bsoflags sync:direct)
```

\`\`\`

First provision a new RBD image in Ceph:

`bash $ ceph osd pool create iscsi 128 128 pool 'iscsi' created $ rbd -p iscsi create iscsi-rbd -s 10240`

Register targets on your **OSD servers**, for this either append the following in `/etc/tgt/targets.conf` or `etc/tgt/conf.d/ceph.conf`:

```
<target iqn.2014-04.rbdstore.example.com:iscsi>
    driver iscsi
    bs-type rbd
    backing-store iscsi/iscsi-rbd  # Format is <iscsi-pool>/<iscsi-rbd-image>
    initiator-address <clients address allowed to map the device>
</target>
```

Then reload the tgt service:

`bash $ service tgt reload Updating target framework daemon configuration`

  

# II. Client side

It is critical that you disable the RBD caching, using writeback caching while mapping multiple targets on different host could result in data loss or corruption.

It's important to disable the rbd cache on tgtd host. Set in /etc/ceph/ceph.conf:

```
[client]
rbd_cache = false
```

Install `open-iscsi` on your client machine:

`bash $ sudo apt-get install open-iscsi $ sudo service open-iscsi restart [ ok ] Unmounting iscsi-backed filesystems: Unmounting all devices marked _netdev. [....] Disconnecting iSCSI targets:iscsiadm: No matching sessions found . ok [ ok ] Stopping iSCSI initiator service:. [ ok ] Starting iSCSI initiator service: iscsid. [....] Setting up iSCSI targets: iscsiadm: No records found . ok [ ok ] Mounting network filesystems:.`

Discover the target:

`bash $ iscsiadm -m discovery -t st -p 192.168.0.100 # the IP is the IP of one of your OSD with the TGT 192.168.0.100:3260,1 iqn.2014-04.rbdstore.example.com:iscsi`

Map the target:

`bash $ iscsiadm -m node --login Logging in to [iface: default, target: iqn.2014-04.rbdstore.example.com:iscsi, portal: 192.168.0.100,3260] (multiple) Login to [iface: default, target: iqn.2014-04.rbdstore.example.com:iscsi, portal: 192.168.0.100,3260] successful.`

Check if everything went well:

\`\`\`bash $ sudo cat /proc/partition major minor #blocks name

8 0 97650720 sda 8 1 1792 sda1 8 2 248064 sda2 8 3 97400576 sda3 8 112 10485760 sdh \`\`\`

Check the block size:

`bash $ blockdev --report /dev/sdh RO RA SSZ BSZ StartSec Size Device rw 256 512 4096 0 10737418240 /dev/sdh`

  

> Moving forward in a next article, I will discuss a multipath implementation to make this setup highly available.
