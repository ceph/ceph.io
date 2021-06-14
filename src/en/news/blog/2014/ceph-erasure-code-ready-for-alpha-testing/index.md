---
title: "Ceph erasure code : ready for alpha testing"
date: "2014-03-03"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

The addition of [erasure code](http://en.wikipedia.org/wiki/Erasure_code) in Ceph started in [april 2013](https://wiki.ceph.com/Planning/Blueprints/Dumpling/Erasure_encoding_as_a_storage_backend) and was discussed during the [first Ceph Developer Summit](https://wiki.ceph.com/Planning/CDS/Dumpling). The implementation reached an important milestone a few days ago and it is now [ready for alpha testing](http://permalink.gmane.org/gmane.comp.file-systems.ceph.devel/18760).  
For the record, here is the simplest way to store and retrieve an object in an erasure coded pool as of [today](https://github.com/ceph/ceph/commit/ffdfb846a20e478f921232447188d49b5470f854):

parameters="erasure-code-k=2 erasure-code-m=1"
./ceph osd crush rule create-erasure ecruleset \\
  $parameters \\
  erasure-code-ruleset-failure-domain=osd
./ceph osd pool create ecpool 12 12 erasure \\
  crush\_ruleset=ecruleset \\
  $parameters
./rados --pool ecpool put SOMETHING /etc/group
./rados --pool ecpool get SOMETHING /tmp/group
$ tail -3 /tmp/group
postfix:x:133:
postdrop:x:134:
\_cvsadmin:x:135:

The chunks are stored in three objects and it can be reconstructed if any of them are lost.

find dev | grep SOMETHING
dev/osd4/current/3.7s0\_head/SOMETHING\_\_head\_847441D7\_\_3\_ffffffffffffffff\_0
dev/osd6/current/3.7s1\_head/SOMETHING\_\_head\_847441D7\_\_3\_ffffffffffffffff\_1
dev/osd9/current/3.7s2\_head/SOMETHING\_\_head\_847441D7\_\_3\_ffffffffffffffff\_2
