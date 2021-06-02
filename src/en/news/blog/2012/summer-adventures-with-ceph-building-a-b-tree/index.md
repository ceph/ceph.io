---
title: "Summer Adventures with Ceph: Building a B-tree"
date: "2012-08-21"
author: "Eleanor Cawthon"
tags: 
  - "b-tree"
  - "ceph"
  - "inktank"
  - "internship"
  - "key-value-store"
  - "storage"
---

Greetings! I am a summer intern at Inktank. My summer project is to create a distributed, B-tree-like key-value store, with support for multiple writers, using librados and the Ceph object store. In my [last blog post](http://ceph.com/community/my-first-impressions-of-ceph-as-a-summer-intern/), I wrote about the single client implementation I created to start out with. Over the last several weeks, I’ve had great fun and have learned a lot working on my project. I designed and implemented an algorithm for making my program work for an arbitrary number of clients. I still have more to do – in particular, I’ve been changing the algorithm significantly as I encounter bottlenecks during [Teuthology testing](https://github.com/ceph/teuthology#readme) – but the core of my project is complete.

I was faced with the problem of how to allow multiple concurrent operations without causing interference that could leave the system in an inconsistent state. The Ceph object store provides atomic operations on a single object, but I sometimes need to atomically change multiple objects. When splitting or merging a leaf, I have to change the leaf object and the index object without making it possible for other clients to see an in-between state.

All of the papers I read that dealt with this issue assumed either a single computer with shared memory and locking, or a locking service managed by a dedicated server or a Paxos cluster. In a locking system, the process (or client) modifying an object ensures exclusive access to the object for the entirety of the modification, and all other threads (or clients) that attempt to access that object block until the lock is released. Ceph does not have a lock service, as such setups are expensive. A locking system is pessimistic – that is, it assumes contention is likely. This is efficient on a single machine with shared memory, but replicating that functionality with a lock manager on a distributed system creates a bottleneck. In the probable use cases for my key value store, there are likely to be very large numbers of keys and very little contention. I needed to design an optimistic algorithm that took advantage of this low probability of contention. In an optimistic system that does not use a lock manager, the basic mechanism of ensuring that clients do not interfere with each other is to have them fail (or roll back changes and retry) if they discover that another client has made a change that interferes with its planned operations.

I needed to design an algorithm that would guarantee the following, even in cases of splits and merges:

- Forward progress, meaning that each client eventually makes progress. In particular, there is no combination of operations that will trigger a livelock or a deadlock.
- Atomicity, meaning that writes either complete fully or are rolled back. Any client that dies while the system is in an intermediate state will be cleaned up.
- Consistency, meaning that before and after every operation, the system is in a valid state,

At Sam’s suggestion, I made the following assumptions about likely use cases:

- Individual keys and values will be small – the exact size will vary, but I can assume they will fit in memory.
- For purposes of establishing what constitutes consistency, users will only be able to access the key value store through my structure (i.e., not through librados).
- Duplicate keys are not allowed
- The Ceph object store is reliable.

With these goals in mind, I began to brainstorm ideas for algorithms. At first, I looked for simple ways to rearrange the steps in my existing code to resolve race conditions. After discussing a few of these ideas with Sam and discovering their flaws, I decided to start over. I opened several text files side by side, one for each operation, and began writing pseudocode. After a couple of days of coming up with ideas, examining various interleavings for race conditions, and discovering the reasons they would not work, I finally came up with an algorithm in which I could not identify any race conditions. I talked to Sam about it, and after much discussion, he agreed that it seemed to be valid.

Ceph provides a number of useful features that are crucial to my design. In particular, I make use of the following:

- Ceph allows the user to combine multiple write operations or multiple read operations into a single, atomic transaction, as long as they are all performed on a single object. I use this to implement several complex test-and-set operations. For example, I can have a transaction that only performs a write if the “size” xattr is set to a number less than 2 \* k.
- Ceph allows the user to write code that runs on the OSD instead of on the client, which makes some operations faster. For example, an OSD class can scan the object’s whole key-value map (omap) and return some information about it to the client without having to send the whole map over the network.
- Ceph, of course, completely handles the challenges of distributing objects across different machines, creating replicas, and ensuring that transactions are atomic, consistent, isolated, and durable.
- Teuthology is a powerful and relatively easy to use testing suite that allows me to test many different configurations of Ceph and of my program’s configurables on a cluster of several machines. The tools Teuthology provides are invaluable to my benchmark testing.

I am still improving my algorithm as I run benchmarking tests in Teuthology. I will post a full write up of the algorithm, and a link to the source code on github, once it is in its final form.

Designing the first draft of my algorithm was challenging, fun, and rewarding for a variety of reasons. The problem itself was interesting – I had to address a general use case using specific tools that differed significantly from the tools used to address similar use cases in the papers I had read. In addition to the intrigue of the problem itself, the process of refining and correcting my ideas through discussions with other developers was highly educational and effective. The open source model takes full advantage of this communal aspect of coding, embracing the principle that “given enough eyeballs, all bugs are shallow”. The Ceph community is the ideal open source community – full of friendly, patient, and smart developers who are all committed to creating good code. These factors make working on Ceph development in general, and on my project in particular, a truly fantastic experience.

