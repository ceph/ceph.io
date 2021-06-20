---
title: "My First Impressions of Ceph as a Summer Intern"
date: "2012-06-26"
author: "Eleanor Cawthon"
tags: 
  - "ceph"
  - "internship"
  - "open-source"
  - "storage"
---

Hi! My name is Eleanor, and I’m working on Ceph as an intern for Inktank this summer. My task for the summer is to use the Ceph API to create a lock-free, distributed key-value store suitable for storing large sets of small key-value pairs. I’ve just finished my first year at Pomona College, where I’m majoring in Computer Science. I had previously explored concurrency with a Computer Science professor at the University of Utah, but this is my first experience with file systems, my first experience with a startup, and my first experience working on an open source software project. At the beginning of the summer, I was somewhat terrified. On my first day, as Sam walked me through how to use Github, I worried that I was in over my head. There were so many skills and so much vocabulary that came naturally to everyone around me but with which I had little to no familiarity. But the Ceph team proved to be extraordinarily welcoming and supportive as I got up to speed.

As a warm-up exercise to gain familiarity with the API, I began the summer by creating an object map benchmarking tool. Librados objects are the basic unit of storage in Ceph. Objects have a number of properties:

- a name,
- data,
- extended attributes, the sizes of which are constrained by file system limitations, and
- an object map of keys and values, which, like extended attributes, are efficient to access, but which are not constrained by file system-dependent limitations.

It would be feasible to store key-value pairs with the keys as names of objects and the values as data, but for small values, this is inefficient. Because of this inefficiency at handling small values, I’m using object maps to implement a key-value store. My tool writes a configurable number of key-value pairs of configurable size to a configurable number of librados objects’ object maps, with a configurable maximum number of concurrent operations in progress at any given time. In the process of creating this, I learned a great deal about the API, about C++ and C, about Git rebases, and about Teuthology, our testing framework.

After pushing my object map benchmarker upstream, I began working on the key-value store itself. I began by reading several papers on subjects starting with the letter B: B-trees, B-link trees, B\*-trees, BigTables, and Boxwood. After reading these and other papers, I began coding a simplified data structure. For this first version, I considered only one client, and I used a structure based on a two-level B-tree. I used one librados object as the root of the tree, and other librados objects to store specific ranges of keys and their values, using the highest key as the name of the object. The root’s object map stores a set of keys corresponding to the names of the other librados objects. After implementing and debugging this single client version, I began to consider ways to make it safe for multiple clients to perform operations concurrently. As I continue to work on designing and implementing these changes, other members of the Ceph team still guide me and provide advice and feedback when I have questions, but I have a considerable degree of autonomy in my design. While this was intimidating at first, I’ve begun to enjoy this balance between freedom and guidance.

As I’ve gotten more involved with Ceph, I’ve become more comfortable asking questions. I’ve begun to realize that among Ceph developers, such trivial concerns as embarrassment over lack of experience or frustration over answering the questions of newcomers cannot be allowed to stand in the way of the more important goal: developing an elegant, efficient, and open distributed file system. If there is one characteristic that unites Ceph developers, it is their passion for the project. Even during lunch, the vast majority of conversations are related to some intricacy of the code. My experience with Ceph has so far been overwhelmingly positive, and I would encourage other interested developers to consider contributing to Ceph. The people are friendly, the project is fascinating, and the programming is thoroughly rewarding.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/my-first-impressions-of-ceph-as-a-summer-intern/&bvt=rss&p=wordpress)
