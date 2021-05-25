---
title: "Ceph: manually repair object"
date: "2015-04-27"
author: "shan"
tags: 
  - "planet"
---

![Ceph: manually repair object](http://sebastien-han.fr/images/ceph-manually-repair-objects.jpg)

Debugging scrubbing errors can be tricky and you don't necessary know how to proceed.

Assuming you have a cluster state similar to this one:

```
health HEALTH_ERR 1 pgs inconsistent; 2 scrub errors
```

Let's trouble shoot this!

## Find the PG

A simple command can give use the PG:

`bash $ sudo ceph health detail HEALTH_ERR 1 pgs inconsistent; 2 scrub errors pg 17.1c1 is active+clean+inconsistent, acting [21,25,30] 2 scrub errors`

Ok, so the problematic PG is `17.1c1` and is acting on OSD 21, 25 and 30.

You can always try to run `ceph pg repair 17.1c1` and check if this will fix your issue. Sometime it does, something it does not and you need to dig further.

  

## Find the problem

In order to get the root cause, we need to dive into the OSD log files. A simple `grep -Hn 'ERR' /var/log/ceph/ceph-osd.21.log`, note that if logs rotated you might have to use `zgrep` instead.

This gives us the following root cause:

```
log [ERR] : 17.1c1 shard 21: soid 58bcc1c1/rb.0.90213.238e1f29.00000001232d/head//17 digest 0 != known digest 3062795895
log [ERR] : 17.1c1 shard 25: soid 58bcc1c1/rb.0.90213.238e1f29.00000001232d/head//17 digest 0 != known digest 3062795895
```

What is telling this log?

Well it says that the object digest should be 3062795895 and is actually 0.

  

## Find the object

Now we have to dive into OSD 21 directory, thanks to the information we have it is pretty straightforward.

What do we know?

- Problematic PG: 17.1c1
- OSD number
- Object name: rb.0.90213.238e1f29.00000001232d

At this stage we search the object:

`bash $ sudo find /var/lib/ceph/osd/ceph-21/current/17.1c1_head/ -name 'rb.0.90213.238e1f29.00000001232d*' -ls 671193536 4096 -rw-r--r-- 1 root root 4194304 Feb 14 01:05 /var/lib/ceph/osd/ceph-21/current/17.1c1_head/DIR_1/DIR_C/DIR_1/DIR_C/rb.0.90213.238e1f29.00000001232d__head_58BCC1C1__11`

Now there are a couple of other things you can check:

- Look at the size of each objects on every systems
- Look at the MD5 of each objects on every systems

Then compare all of them to find the _bad_ object.

  

## Fix the problem

Just move the object away :) with the following:

- stop the OSD that has the **wrong object** responsible for that PG
- flush the journal (`ceph-osd -i <id> --flush-journal`)
- move the bad object to another location
- start the OSD again
- call `ceph pg repair 17.1c1`

  

> It might look a bit rough to delete an object but in the end it's job Ceph's job to do that. Of course the above works well when you have 3 replicas when it is easier for Ceph to compare two versions against another one. A situation with 2 replicas can be a bit different, Ceph might not be able to solve this conflict and the problem could persist. So a simple trick could be to chose the latest version of the object, set the noout flag on the cluster, stop the OSD that has a wrong version. Wait a bit, start the OSD again and unset the noout flag. The cluster should sync up the good version of the object to OSD that had a wrong version.
