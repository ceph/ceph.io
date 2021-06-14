---
title: "More recommendations for Ceph and OpenStack"
date: "2017-08-03"
author: "admin"
tags: 
  - "planet"
---

A few months ago, we [shared our Dos and Don'ts](https://www.hastexo.com/resources/hints-and-kinks/dos-donts-ceph-openstack/), as they relate to Ceph and OpenStack. Since that post has proved quite popular, here are a few additional considerations for your Ceph-backed OpenStack cluster.

## Do configure your images for VirtIO-SCSI

By default, RBD-backed Nova instances use the `virtio-blk` driver to expose RBD images to the guest -- either as ephemeral drives, or as persistent volumes. In this default configuration, VirtIO presents a virtual PCI device to the guest that represents the paravirtual I/O bus, and devices are named `/dev/vda`, `/dev/vdb`, and so forth. VirtIO block devices are lightweight and efficient, but they come with a drawback: they don't support the `discard` operation.

Not being able to use `discard` means the guest cannot mount a filesystem with `mount -o discard`, and it also cannot clean up freed blocks on a filesystem with `fstrim`. This can be a security concern for your users, who might want to be able to really, actually _delete_ data from within the guest (after overwriting it, presumably). It can also be an operational concern for you as the cluster operator.

This is because not supporting `discard` also means that RADOS objects owned by the corresponding RBD image and never _removed_ during the image's lifetime -- they persist until the whole image is deleted. So your cluster may carry the overhead of perhaps tens of thousands of RADOS objects that no-one actually cares about.

Thankfully, there is an alternative VirtIO disk driver that _does_ support `discard`: the paravirtualized VirtIO SCSI controller, `virtio-scsi`.

Enabling the VirtIO SCSI controller is something you do by setting a couple of Glance **image properties,** namely `hw_scsi_model` and `hw_disk_bus`. You do so by running the following `openstack` commands on your image:

openstack image set 
  --property hw\_scsi\_model\=virtio-scsi 
  --property hw\_disk\_bus\=scsi 
  <name or ID of your image>

Then, if you boot an instance from this image, you'll see that its block device names switch from `/dev/vdX` to `/dev/sdX`, and you also get everything else you expect from a SCSI stack. For example, there's `/proc/scsi/scsi`, you can extract information about your bus, controller, and LUs with `lsscsi` command, and so on.

It's important to note that this _image_ property is inherited by the _instance_ booted from that image, which also passes it on to all _volumes_ that you may subsequently attach to that instance. Thus, `openstack server add volume` will now add `/dev/sdb`, not `/dev/vdb`, and you will automatically get the benefits of `discard` on your volumes, as well.

## Do set disk I/O limits on your Nova flavors

In a Ceph cluster that acts as backing storage for OpenStack, naturally many OpenStack VMs share the bandwidth and IOPS of your whole cluster. When that happens, occasionally you may have a VM that’s very busy (meaning it produces a lot of I/O), which the Ceph cluster will attempt to process to the best of its abilities. In doing so, since RBD has no built-in QoS guarantees ([yet](http://tracker.ceph.com/projects/ceph/wiki/Add_QoS_capacity_to_librbd)), it might cause _other_ VMs to suffer from reduced throughput, increased latency, or both.

The trouble with this is that it’s almost impossible for your users to calculate and reckon with. They’ll see a VM that sustains, say, 10,000 IOPS at times, and then drop to 2,000 with no warning or explanation. It is much smarter to pre-emptively _limit_ Ceph RBD performance from the hypervisor, and luckily, OpenStack Nova absolutely allows you to do that. This concept is known as **instance resource quotas**, and you set them via flavor properties. For example, an you may want to limit a specific flavor to 1,500 IOPS and a maximum throughput of 100 MB/s:

openstack flavor set 
  --property quota:disk\_total\_bytes\_sec\=$((100<<20))
  --property quota:disk\_total\_iops\_sec\=1500
  m1.medium

In the background, these settings are handed through to libvirt and ultimately fed into cgroup limitations for Qemu/KVM, when a VM with this flavor spins up. So these limits aren’t specific to RBD, but they come in particularly handy when dealing with RBD.

Obviously, since flavors can be public, but can also be limited to specific tenants, you can set relatively low instance resource quotas in public flavors, and then make flavors with higher resource quotas available to select tenants only.

## Do differentiate Cinder volume types by disk I/O limits

In addition to setting I/O limits on flavors for VMs, you can also influence the I/O characteristics of volumes. You do so by specifying distinct Cinder volume _types_. Volume types are frequently used to enable users to select a specific Cinder backend — say, to stick volumes either on a NetApp box or on RBD, but it’s perfectly OK if you define multiple volume types using the same backend. You can then set characteristics like maximum IOPS or maximum throughput via Cinder QoS specifications. A QoS specification akin to the Nova flavor decribed above — limiting throughput to 100 MB/s and 1,500 IOPS would be created like this:

openstack volume qos create 
  --consumer front-end
  --property total\_bytes\_sec\=$((100<<20)) 
  --property total\_iops\_sec\=1500 
  "100MB/s-1500iops"

You would then create a corresponding volume type, and associate the QoS spec with it:

openstack volume type create 
  --public 
  "100MB/s-1500iops"
openstack volume qos associate 
  "100MB/s-1500iops" 
  "100MB/s-1500iops"

Again, as with Nova flavors, you can make volume types public, but you can also limit them to specific tenants.

## Don't forget about suspend files

When you **suspend** a Nova/libvirt/KVM instance, what really happens is what libvirt calls a **managed save**: the instance's entire memory is written to a file, and then KVM process shuts down. This is actually quite neat because it means that the VM does not consume any CPU cycles nor memory until it restarts, and it will continue right where it left off, even if the compute node is rebooted in the interim.

You should understand that these savefiles are not compressed in any way: if your instance has 16GB of RAM, that's a 16GB file that instance suspension drops into `/var/lib/nova/save`. This can add up pretty quickly: if a single compute node hosts something like 10 suspended instances, their combined save file size can easily exceed 100 GB. Obviously, this can put you in a really bad spot if this fills up your `/var` (or worse, `/`) filesystem.

Of course, if you already have a Ceph cluster, you can put it to good use here too: just deep-mount a CephFS file system into that spot. Here's an Ansible playbook snippet that you may use as inspiration:

\---
\- hosts:
  \- compute-nodes

  vars:
    ceph\_mons:
      \- ceph-mon01
      \- ceph-mon02
      \- ceph-mon03
    cephfs\_client: cephfs
    cephfs\_secret: "{{ vaulted\_cephfs\_secret }}"

  tasks:

  \- name: "install ceph-fs-common package"
    apt:
      name: ceph-fs-common
      state: installed

  \- name: "create ceph directory"
    file:
      dest: /etc/ceph
      owner: root
      group: root
      mode: '0755'
      state: directory

  \- name: "create cephfs secretfile"
    copy:
      dest: /etc/ceph/cephfs.secret
      owner: root
      group: root
      mode: '0600'
      content: '{{ cephfs\_secret }}'

  \- name: "mount savefile directory"
    mount:
      fstype: ceph
      path: /var/lib/nova/save
      src: "{{ ceph\_mons | join(',') }}:/nova/save/{{ ansible\_hostname }}"
      opts: "name={{ cephfs\_client }},secretfile=/etc/ceph/cephfs.secret"
      state: mounted

  \- name: "fix savefile directory ownership"
    file:
      path: /var/lib/nova/save
      owner: libvirt-qemu
      group: kvm
      state: directory

* * *

## Got more?

Do you have Ceph/OpenStack hints of your own? Leave them in the comments below and we’ll include them in the next installment.

Source: Hastexo ([More recommendations for Ceph and OpenStack](https://www.hastexo.com/resources/hints-and-kinks/more-recommendations-ceph-openstack/))
