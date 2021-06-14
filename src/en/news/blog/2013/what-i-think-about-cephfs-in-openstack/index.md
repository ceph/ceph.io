---
title: "What I think about CephFS in OpenStack"
date: "2013-06-23"
author: "shan"
tags: 
---

![](images/what-I-think-about-ceph-and-openstack.jpg "What I think about CephFS in OpenStack")

I recently had some really interesting questions that led to some nice discussions. Since I received the same question twice, I thought it might be good to share the matter with the community.

The question was pretty simple and obvioulsy the context is about OpenStack:

  

> Can I use CephFS to store my virtual machine disks?

  

The question is pretty fair since Ceph acts as a wonderful storage backend for OpenStack and is well implemented in Nova, Glance and Cinder. And it’s getting better and better after each stable release. For me Ceph is definitely the _de facto_ storage for OpenStack. The main goal of using CephFS is that you can entirely abstract `/var/lib/nova/instances` by mounting CephFS on it. It’s transparent for the end-users, and it’s an operator choice. At the end, you get a shared storage for your VMs disks. This sounds great but everyone knows that CephFS is not ready yet.

Before answering the question what I always like to start with is a bit of history and legacy issues with filesystem in general. I won’t be dealing with the need of shared centralized data. Here I’ll just try to explain why people think they need a DFS in a traditionnal computing environment (ISP oriented). Distributed file systems try to answer the main issue of legacy applications, typically webservers but also bringing HA on the underlying storage of traditionnal softwares. Classically, you have plenty webservers on your frontend that are accessing the same storage backend (this old good NFS), that contains the files of the website. Because of the design of the application, webservers need to be able to access all the files at the same time (because it makes the application easy to scale) and DFS is a good anwser to that. It’s just a common use case, there are others just like storing all the VM disks on a shared storage. This method brings irrefutable benefits such as VMs HA for the clients and smooth maintenance for the operators (even if DFS can be a real pain sometimes for the operators).

  

> But how about satisfaying everyone without using a DFS? Huh? Is it really possible? Yes yes! But now, let’s try to focus on the CephFS use case.

  

Roughly, when the question is asked, I always recommend to not use CephFS but RBD for a lot of reasons that make it more suitable for this cloud use case. RBD relies on RADOS (object store), the bottom layer of the entire Ceph’s stack. This abstraction level _simply_ offers an image that is stripped across a lot of objects around the cluster. RBD can present images to a client in 2 different forms:

- A Kernel module, part of the main line since 2010, that exposes block devices to a system (same way as iSCSI does)
- A QEMU driver to build virtual machine disks on top of RBD (attaching devices and booting from device)

Also RBD itself is stable and performs well because Ceph developers have sacrificed a lot of time to make a it robust, thus this makes it the second more reliable piece of Ceph.

  

> So you were saying that this can be **solved by RBD** but how?

  

Everyone wants High availability of the VMs, currenlty the boot from volume functionality from OpenStack partly solves this, but it’s not the default option when you boot a VM. Booting from volume is a process where the disk of the virtual machine is stored within a storage cluster, this makes the data highly available. In OpenStack this takes the form of the block device controlled and managed by Cinder and stored on a storage backend, in this case the backend is RBD. So yes the boot from volume with Cinder / RBD is our solution to provide HA of a VM. Btw things like `nova evacuate` and `nova live migration` are really fast since only the workload is migrated during the process ;-)

  

> Yes but you just said _partly solved_? I’m getting to that.

  

Ok as you already figured the problem is half solved since we want a transparent way to boot from volume. In OpenStack, the boot from volume is an optional way to boot a VM, it’s not the default. The end-user must choose the right parameter. Forcing the boot-from-volume is not possible, it could be, although it implies some heavy modifications in the code base and on the API. Obviously you still have the **ugly** option to use a Nova modified API version, that calls Cinder and issues a hidden boot from volume on RBD. I have to say that if you don’t run a public cloud this _could be_ fine… I see 2 use cases:

1. ISP (public provider), forget about the idea unless you want to provide a _really_ close service.
2. Corporate Cloud (private cloud), you’re the only one managing the platform and you know everything happening on it. You must be 100% sure that you have the complete control of your infra. You can always hack the dashboard, but it’s more than that: you have to automate the creation of a volume from an image. This will prolong the process.

In both cases I don’t even recommend it, you can imagine:

- Compatibility issues, you’re stuck!
- Maintenance issues, how can I update my system on any update release?, you can’t!

At that point it’s up to you :-).

Then the way to address the problem is to implement a new backend on the `libvirt_image_type` flag. The main goal is to provide an alternative backend store for the ephemeral disk images. This is usually managed by the flag `libvirt_images_type` in your `nova.conf` file. At the moment, only file (raw, qcow2) and lvm are supported. In a RBD context, the mechanism is fairly identical to the boot-from-volume feature, where nova needs to be able to attach a device from a ceph cluster. The advantage of the method is that from a client perspective it’s completely transparent. This also makes the live-migration easier if the VM is already stored in Ceph (boot-from-volume). Basically, the operator will specify a Ceph pool to build RBD images from. Then everytime a VM is booted and according to the flavor requested the RBD image will be sized that way and used as a root drive for the VM.

This is addressed by the following blueprint: [https://blueprints.launchpad.net/nova/+spec/bring-rbd-support-libvirt-images-type](https://blueprints.launchpad.net/nova/+spec/bring-rbd-support-libvirt-images-type), I sincerely hope this can be available for Havana.

  

> Room for more improvement

  

One the things that OpenStack doesn’t take advantage of is the QEMU driver with caching options. In no way can one use special flags to use the `rbd_cache` for instance.

This is addressed by the following blueprint: [https://blueprints.launchpad.net/nova/+spec/enable-rbd-tuning-options](https://blueprints.launchpad.net/nova/+spec/enable-rbd-tuning-options), I hope this can be made available in time for Havana.

  

> Ok but what will you say in a year’s time?

  

Well, probably the same thing, since I’m pushing this initiative and I’d like to see people getting into those new storage considerations. We are in a transitional period, so the adoption is slow, however things are moving. I think there’ll always be use cases for Distributed File systems, forHPC platform for instance. Thus, it’s good to re-consider the question as soon as DFSs are getting more mature. Although I assume that is a rely good solution, we don’t need a filesystem to store our VM disks (less overhead and complexity).

  

> I think you all got it now! Let’s consolidate all of this ephemeral space on a distributed, fast accessible, open source storage! Obviously and as always feel free to interact with this blog post.
