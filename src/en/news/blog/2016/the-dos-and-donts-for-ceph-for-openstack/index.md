---
title: "The Dos and Don&#039;ts for Ceph for OpenStack"
date: "2016-11-28"
author: "admin"
tags: 
  - "planet"
---

Ceph and OpenStack are an extremely useful and [highly popular](https://www.openstack.org/assets/survey/April-2016-User-Survey-Report.pdf) combination. Still, new Ceph/OpenStack deployments frequently come with easily avoided shortcomings — we'll help you fix them!

## Do use `show_image_direct_url` and the Glance v2 API

With Ceph RBD (RADOS Block Device), you have the ability to create **clones.** You can think of clones as the writable siblings of _snapshots_ (which are read-only). A clone creates RADOS objects only for those parts of your block device which have been modified relative to its parent snapshot, and this means two things:

1. You save space. That's a no-brainer, but in and of itself it's not a very compelling argument as storage space is one of the cheapest things in a distributed system.
    
2. What's _not_ been modified in the clone can be served from the original volume. This is important because, of course, it means you are effectively hitting the same RADOS objects — and thus, the same OSDs — no matter which clone you're talking to. And that, in turn, means, those objects are likely to be served from the respective OSD's page caches, in other words, from RAM. RAM is way faster to access than any persistent storage device, so being able to serve lots of reads from the page cache is good. That, in turn, means, that serving data from a clone will be faster than serving the same data from a full copy of a volume.
    

Both Cinder (when creating a volume from an image) and Nova (when serving ephemeral disks from Ceph) will make use of cloning RBD images in the Ceph backend, and will do so automatically. But they will do so only if `show_image_direct_url=true` is set in `glance‑api.conf`, and they are configured to connect to Glance using the Glance v2 API. [So do both.](http://docs.ceph.com/docs/jewel/rbd/rbd-openstack/#any-openstack-version)

## Do set `libvirt/images_type = rbd` on Nova compute nodes

In Nova (using the libvirt compute driver with KVM), you have several options of storing ephemeral disk images, that is, storage for any VM that is _not_ booted from a Cinder volume. You do so by setting the `images_type` option in the `[libvirt]` section in `nova‑compute.conf`:

\[libvirt\]
images\_type \= <type>

The default type is `disk`, which means that when you fire up a new VM, the following events occur:

- `nova‑compute` on your hypervisor node connects to the Glance API, looks up the desired image, and downloads the image to your compute node (into the `/var/lib/nova/instances/_base` directory by default).
- It then creates a new qcow2 file which uses the downloaded image as its backing file.

This process uses up a fair amount of space on your compute nodes, and can quite seriously delay spawning a new VM if it has been scheduled to a host that hasn't downloaded the desired image before. It also makes it impossible for such a VM to be live-migrated to another host without downtime.

Flipping `images_type` to `rbd` means the disk lives in the RBD backend, as an RBD clone of the original image, and can be created instantaneously. No delay on boot, no wasting space, all the benefits of clones. [Use it.](http://docs.ceph.com/docs/jewel/rbd/rbd-openstack/#id2)

## Do enable RBD caching on Nova compute nodes

`librbd`, the library that underpins the Qemu/KVM RBD storage driver, can enable a disk cache that uses the hypervisor host's RAM for caching purposes. You should use this.

Yes, it's a cache that is safe to use. On the one hand, the combination of `virtio-blk` with the Qemu RBD storage driver **will** properly honor disk flushes. That is to say, when an application inside your VM says "I want this data on disk now," then `virtio‑blk`, Qemu, and Ceph will all work together to only report the write as complete when it has been

- written to the primary OSD,
- replicated to the available replica OSDs,
- acknowledged to have hit at least the persistent journal on all OSDs.

In addition, Ceph RBD has an intelligent safeguard in place: even if it is configured to cache in write-back mode, _it will refuse to do so_ (meaning, it will operate in write-through mode) until it has received the first flush request from its user. Thus, if you run a VM that just never does that — because it has been misconfigured or its guest OS is just ages old — then RBD will stubbornly refuse to cache any writes. The corresponding RBD option is called [`rbd cache writethrough until flush`](http://docs.ceph.com/docs/jewel/rbd/rbd-config-ref/#cache-settings), it defaults to `true` and you should never disable it.

You can enable writeback caching for Ceph by setting the following `nova-compute` configuration option:

\[libvirt\]
images\_type \= rbd
...
disk\_cachemodes\="network=writeback"

And you just should.

## Do use separate pools for images, volumes, and ephemeral disks

Now that you have enabled `show_image_direct_url=true` in Glance, configured Cinder and `nova-compute` to talk to Glance using the v2 API, and configured `nova-compute` with `libvirt/images_type=rbd`, all your VMs and volumes will be using RBD clones. Clones can span multiple RADOS pools, meaning you can have an RBD image (and its snapshots) in one pool, and its clones in another.

You should do exactly that, for several reasons:

1. Separate pools means you can lock down access to those pools separately. This is just a standard threat mitigation approach: if your `nova-compute` node gets compromised and the attacker can corrupt or delete ephemeral disks, then that's bad — but it would be _worse_ if they could also corrupt your Glance images.
2. Separate pools also means that you can have different pool settings, such as the settings for `size` or `pg_num`.
3. Most importantly, separate pools can use separate `crush_ruleset` settings. We'll get back to this in a second, it'll come in handy shortly.

It's common to have three different pools: one for your Glance images (usually named `glance` or `images`), one for your Cinder volumes (`cinder` or `volumes`), and one for your VMs (`nova-compute` or `vms`).

## Don't necessarily use SSDs for your Ceph OSD journals

Of the recommendations in this article, this one will probably be the one that surprises the most people. Of course, conventional wisdom holds that you should _always_ put your OSD journals on fast OSDs, and that you should deploy SSDs and spinners in a 1:4 to 1:6 ratio, right?

Let's take a look. Suppose you're following the 1:6 approach, and your SATA spinners are capable of writing at 100 MB/s. 6 spinners make 6 OSDs, and each OSD uses a journal device that's on a partition on an enterprise SSD. Suppose further that the SSD is capable of writing at 500 MB/s.

Congratulations, in that scenario you've just made your SSD your bottleneck. While you would be able to hit your OSDs at 600 MB/s on aggregate, your SSD limits you to about 83% of that.

In that scenario you _would_ actually be fine with a 1:4 ratio, but make your spindles just a little faster and the SSD advantage goes out the window again.

Now, of course, do consider the alternative: if you're putting your journals on the same drive as your OSD filestores, then you effectively get only half the nominal bandwidth of your drive, on average, because you write everything twice, to the same device. So that means that _without_ SSDs, your effective spinner bandwidth is only about 50 MB/s, so the _total_ bandwidth you get out of 6 drives that way is more like 300 MB/s, against which 500 MB/s is still a substantial improvement.

So you will need to plug your own numbers into this, and make your own evaluation for price _and_ performance. Just don't assume that journal SSD will be a panacea, or that it's always a good idea to use them.

## Do create all-flash OSDs

One thing your journal SSDs don't help with are reads. So, what can you do to take advantage of SSDs on reads, too?

Make them OSDs. That is, not OSD _journals,_ but actual OSDs with a filestore _and_ journal. What this will create are OSDs that don't just write fast, but read fast, too.

## Do put your all-flash OSDs into a separate CRUSH root

Assuming you don't run on all-flash hardware, but operate a cost-effective mixed cluster where some OSDs are spinners and others are SSDs (or NVMe devices or whatever), you obviously want to treat those OSDs separately. The simplest and easiest way to do that is to create a separate CRUSH `root` in addition to the normally configured `default` root.

For example, you could set up your CRUSH hierarchy as follows:

ID WEIGHT  TYPE NAME         UP/DOWN REWEIGHT PRIMARY-AFFINITY
- 
-1 4.85994 root default
-2 1.61998     host elk
 0 0.53999         osd.0          up  1.00000          1.00000 
 1 0.53999         osd.1          up  1.00000          1.00000 
 2 0.53999         osd.2          up  1.00000          1.00000 
-3 1.61998     host moose
 3 0.53999         osd.3          up  1.00000          1.00000 
 4 0.53999         osd.4          up  1.00000          1.00000 
 5 0.53999         osd.5          up  1.00000          1.00000 
-4 1.61998     host reindeer
 6 0.53999         osd.6          up  1.00000          1.00000 
 7 0.53999         osd.7          up  1.00000          1.00000 
 8 0.53999         osd.8          up  1.00000          1.00000
-5 4.85994 root highperf
-6 1.61998     host elk-ssd
 9 0.53999         osd.9          up  1.00000          1.00000 
10 0.53999         osd.10         up  1.00000          1.00000 
11 0.53999         osd.11         up  1.00000          1.00000 
-7 1.61998     host moose-ssd
12 0.53999         osd.12         up  1.00000          1.00000 
13 0.53999         osd.13         up  1.00000          1.00000 
14 0.53999         osd.14         up  1.00000          1.00000 
-8 1.61998     host reindeer-ssd
15 0.53999         osd.15         up  1.00000          1.00000 
16 0.53999         osd.16         up  1.00000          1.00000 
17 0.53999         osd.17         up  1.00000          1.00000

In the example above, OSDs 0-8 are assigned to the `default` root, whereas OSDs 9-17 (our SSDs) belong to the root `highperf`. We can now create two separate CRUSH rulesets:

rule replicated\_ruleset {
    ruleset 0
    type replicated
    min\_size 1
    max\_size 10
    step take default
    step chooseleaf firstn 0 type host
    step emit
}

rule highperf\_ruleset {
    ruleset 1
    type replicated
    min\_size 1
    max\_size 10
    step take highperf
    step chooseleaf firstn 0 type host
    step emit
}

The default ruleset, `replicated_ruleset`, picks OSDs from the `default` root, whereas `step take highperf` in `highperf_ruleset` means it covers only OSDs in the `highperf` root.

## Do assign individual pools to your all-flash ruleset

Assigning individual pools to a new CRUSH ruleset (and hence, to a whole different set of OSDs) is a matter of issuing a single command:

ceph osd pool set <name> crush\_ruleset <number>

... where `<name>` name of your pool and `<number>` is the numerical ID of your ruleset as per your CRUSH map. You can do this while the pool is online, and while clients are accessing its data — although of course, there will be a lot of remapping and backfilling so your overall performance may be affected somewhat.

Now, the assumption is that you will have more spinner storage than SSD storage. Thus, you will want to select individual pools for your all-flash OSDs. Here are a handful of pools that might come in handy as first candidates to migrate to all-flash. You can interpret the list below as a priority list: as you add more SSD capacity to your cluster, you can move pools over to all-flash storage one by one.

1. Nova ephemeral RBD pools (`vms`, `nova-compute`)
2. radosgw bucket indexes (`.rgw.buckets.index` and friends) — if you're using radosgw as your drop-in OpenStack Swift replacement
3. Cinder volume pools (`cinder`, `volumes`)
4. radosgw data pools (`.rgw.buckets` and friends) — if you need low-latency reads and writes on Swift storage
5. Glance image pools (`glance`, `images`)
6. Cinder backup pools (`cinder-backup`) — usually the last pool to convert to all-flash OSDs.

## Do designate some non-Ceph compute hosts with low-latency local storage

Now, there will undoubtedly be some applications where Ceph does not produce the latency you desire. Or, for that matter, _any_ network-based storage. That's just a direct consequence of recent developments in storage and network technology.

Just a few years ago, the average latency of a single-sector uncached write to a block device was on the order of a millisecond, or 1,000 microseconds (µs). In contrast, the latency incurred on a TCP packet carrying a 512-byte (1-sector) payload was about 50 µs, which makes for a 100-µs round trip. All in all, the _additional_ latency incurred from writing to a device over the network, as opposed to locally, was approximately 10%.

In the interim, a single-sector write for a device of the same price is itself about 100 µs, tops, with some reasonably-priced devices down to about 40 µs. Network latency, in contrast, hasn't changed all that much — going down about 20% from Gigabit Ethernet to 10 GbE.

So even going to a single, un-replicated SSD device over the network will now be 40 + 80 = 120 µs latency, vs. just 40 µs locally. That's not a 10% overhead anymore, that's a whopping _factor_ of 3.

With Ceph, that gets worse. Ceph writes data multiple times, first to the primary OSD, then (in parallel) to all replicas. So in contrast to a single-sector write at 40 µs, we now incur a latency of at least two writes, _plus_ two network round-trips, to that's 40 x 2 + 80 x 2 = 240 µs, _six times_ the local write latency.

The good news is, _most_ applications don't care about this sort of latency overhead, because they're not latency-critical at all. The bad news is, _some_ will.

So, should you ditch Ceph because of that? Nope. But do consider adding a handful of compute nodes that are _not_ configured with `libvirt/images_type=rbd`, but that use local disk images instead. Roll those hosts into a [host aggregate,](http://docs.openstack.org/admin-guide/dashboard-manage-host-aggregates.html) and map them to a specific flavor. Recommend to your users that they use that flavor for low-latency applications.

Source: Hastexo ([The Dos and Don'ts for Ceph for OpenStack](https://www.hastexo.com/resources/hints-and-kinks/dos-donts-ceph-openstack/))
