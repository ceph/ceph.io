---
title: "Deploying Ceph with storage tiering"
date: "2017-01-15"
author: "admin"
tags: 
  - "planet"
---

You have several options to deploy storage tiering within Ceph. In this post I will show you a simple yet powerful approach to automatically update the CRUSHmap and create storage policies.

### Some basics

Storage tiering means having several tiers available. The classic 3 tiered approach is:

- fast: all flash
- medium: disks accelerated by some flash journals
- slow: archive disks with collocated journals

### Tiered CRUSHmap

First we will configure the `crush location hook`. It is a script invoked on OSD start to determine the OSD’s location in the CRUSHmap. To make things simple I use the size of a disk to find out which tier it should belong to:

- Bigger than 6 TB → Archive drive
- Between 1.6TB and 6TB → Disk with flash journal
- Smaller than 1.6TB → SSD assumed

This works in most environments but you might want to adjust the script to fit your environment.

Append the following code to a **copy** of [/usr/bin/ceph-crush-location](https://github.com/ceph/ceph/blob/master/src/ceph-crush-location.in), then specify its path with [osd crush location hook](http://docs.ceph.com/docs/master/rados/operations/crush-map/#custom-location-hooks) in `ceph.conf`.

```
# more than 6TB for slow
size_limit_slow=6000
# more than 1.6TB for medium
size_limit_medium=1600

size=$(df /var/lib/ceph/osd/ceph-$id | awk '{if(NR > 1){printf "%d", $2/1024/1024}}')
if [ "$size" -gt "$size_limit_slow" ]
then
  tier="slow"
if [ "$size" -gt "$size_limit_medium" ]
then
  tier="medium"
else
  tier="fast"
fi
echo "host=$(hostname -s)-$tier root=$tier"
```

After a restart your OSDs will show up in a tier specific root, the OSD tree should look like that:

- root fast
    - host ceph-1-fast
    - host ceph-2-fast
    - host ceph-3-fast
- root medium
    - host ceph-1-medium
    - host ceph-2-medium
    - host ceph-3-medium
- root slow
    - host ceph-1-slow
    - host ceph-2-slow
    - host ceph-3-slow

### Creating rulesets

Rulesets allow you to describe your storage policies. We will use rulesets to restrict storage pools to each tiers. You can easily do this by editing the CRUSHmap. Below is an example of rulesets for replicated pools with copies stored on different hosts.

```
rule fast {
  ruleset 1
  type replicated
  min_size 1
  max_size 10
  step take fast
  step chooseleaf firstn 0 type host
  step emit
}
rule medium {
  ruleset 2
  type replicated
  min_size 1
  max_size 10
  step take medium
  step chooseleaf firstn 0 type host
  step emit
}
rule slow {
  ruleset 3
  type replicated
  min_size 1
  max_size 10
  step take slow
  step chooseleaf firstn 0 type host
  step emit
}
```

### Bring it all together

To finish you simply set the appropriate ruleset to each storage pool as shown below and you are ready to go.

```
# Set fast tier for the rbd-fast
ceph osd pool set rbd-fast crush_ruleset 1
# Set medium tier for the rbd pool
ceph osd pool set rbd crush_ruleset 2
# Set slow tier for the "archives" pool
ceph osd pool set archives crush_ruleset 3
```

### Monitoring

If you are doing Ceph tiering in production, you quickly realize that the output of `ceph status` shows the combined available and used space of all tiers.

To find the used space of each storage tier use `ceph osd df tree`. You can reflect that in your monitoring system with the following command:

```
# Show percentage space used, space used and
ceph@ceph-1:~# sudo ceph osd df tree | grep 'root ' | awk '{print $10 ":", $7 "%" " " $5 "/" $4}'
fast: 50.11% 1169G/2332G
medium: 23.28% 3059G/13142G
slow: 10.19% 6153G/60383G
```

Source: Maxime Guyot ([Deploying Ceph with storage tiering](http://www.root314.com/ceph/2017/01/15/Ceph-storage-tiers/))
