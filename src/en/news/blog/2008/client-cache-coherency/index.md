---
title: "Client cache coherency"
date: "2008-03-24"
author: "sage"
tags: 
---

I’ve been shying away from the question of how to manage the client metadata cache consistency for ages, now, under the assumption that it was going to complicate the client/MDS protocol and MDS significantly. Zach’s progress on CRFS got me thinking about it again, though, and I had a realization the other night that most of the complex parts have already been dealt with in the course of making replication across the MDS cluster and client capabilities on file data work:

- Most MDS code is already written in terms of a generic lock framework that is allowed to block
- Client session timeout infrastructure (for coping with dead or unresponsive clients) is already there for dealing with file I/O capabilities

The client was already maintaining and checking per-object TTL values based on a lame fixed-timeout caching scheme. All that was really needed is some additional flags in MDS replies messages to grant leases, an additional object in the MDS to track client replicas of metadata objects, and a simple lease revocation/release message handler. I was pleasantly surprised to have things basically working after only a few hours of coding.

The protocol and data structures will initially only support relatively simple combinations for leases. For example, different inode fields are protected by different locks (e.g. uid/gid/mode versus file size), and leases on fields can be granted or revoked independently, but they will share a single lease interval. Really, though, this will capture the bulk of the performance for most workloads, and keeps things (relatively) simple on the MDS.

Eventually, I’d like to apply the file capabilities to directories to allow clients to create files and write to them asynchronously from the MDS (by essentially preallocating unused inode numbers). I haven’t thought it all through yet, but I think this will provide most of the missing infrastructure to make something like that work…

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/dev-notes/client-cache-coherency/&bvt=rss&p=wordpress)
