---
title: "De-mystifying gluster shards"
date: "2016-07-06"
author: "admin"
tags: 
  - "ceph"
---

Recently I've been working on converging glusterfs with oVirt - hyperconverged, open source style. oVirt has supported glusterfs storage domains for a while, but in the past a virtual disk was stored as a single file on a gluster volume. This helps some workloads, but file distribution and functions like self heal and rebalance have more work to do. The larger the virtual disk, the more work gluster has to do in one go.

  

Enter **sharding**. 

  

The shard translator was introduced with version 3.7, and enables large files to be split into smaller chunks(shards) of a user defined size. This addresses a number of legacy issues when using glusterfs for virtual machine storage - but does introduce an additional level complexity. For example, how do you now relate a file to it's shard, or vice-versa?

  

The great thing is that even though a file is split into shards, the implementation still allows you to relate files to shards with a few simple commands.

    
Firstly, let's look at how to relate a file to it's shards;  
  

  
And now, let's go the other way. We start with a shard, and end with the parent file.  

  
  
Hopefully this helps others getting to grips with glusterfs sharding (and maybe even oVirt!)  
  

Source: Paul Cuzner ([De-mystifying gluster shards](http://opensource-storage.blogspot.com/2016/07/de-mystifying-gluster-shards.html))
