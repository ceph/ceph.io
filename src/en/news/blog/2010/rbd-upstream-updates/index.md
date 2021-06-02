---
title: "RBD upstream updates"
date: "2010-12-22"
author: "yehudasa"
tags: 
---

QEMU-RBD

The QEMU-RBD block device has been merged upstream into the QEMU project. QEMU-RBD was created originally by Christian Brunner, and is binary compatible with the linux native RBD driver. It allows the creation of QEMU block devices that are striped over objects in RADOS — the Ceph distributed object store. As with the corresponding Linux device driver, the QEMU driver gets all the RBD goodies: thin provisioning, reliability, scalability, and snapshots!

libvirt

[libvirt](http://libvirt.org "libvirt") is a virtualization library that allows controlling virtual machines (such as QEMU based VMs, but also others) using a single API. There are many tools already built around it (e.g., virsh, virt-manager, etc.), and adding the ability to configure RBD devices via the library makes RBD work in the existing tools. With the help of the Sheepdog project (whom also merged their QEMU block device upstream into QEMU recently), we were able to get RBD (and Sheepdog, and also nbd) support upstream into libvirt. Basically a new “network” disk type was added, and there are currently 3 possible types for such a disk: nbd, sheepdog, or rbd. For each you can specify a host name. E.g., for rbd the host name(s) would hold the ip address and tcp port for the ceph cluster monitor(s).

libvirt support for the Linux native kernel rbd driver is also in the works, which will allow rbd to be used with non-qemu VMs supported by libvirt (e.g., Xen, VirtualBox, VMware, etc.)

- For more information about using QEMU-RBD and libvirt, see [http://ceph.newdream.net/wiki/QEMU-RBD](http://ceph.newdream.net/wiki/QEMU-RBD)

Linux Kernel

As we posted before, the RBD native linux device was merged into the upcoming Linux kernel version (2.6.37) which will be out in a few weeks. Since the original merge we’ve modified the RBD sysfs interface so that it’d conform better with the sysfs requirements: originally, the RBD driver was based on another linux block device called osdblk and it inherited its sysfs interface, which was monolithic and kept a single sysfs entry per config option for all the devices. This was both wrong and cumbersome, as we needed to specify the device id for each operation. The new interface moves the sysfs rbd subdir to a better location (/sys/bus/rbd) and creates a subdir per device, so that all operations for a single device are grouped together, and there’s no need to specify the device name. We also create a subdir per snapshot under the device that holds all its information, and we dropped the one-big-list-for-all entry.

All in all, it was a relatively big change to introduce [well into the release cycle](http://lwn.net/Articles/418963/ "well into the release cycle"), but we believe it was worth it.

