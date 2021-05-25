---
title: "A gentle introduction to the erasure coding"
date: "2013-09-09"
author: "shan"
tags: 
  - "planet"
---

![](images/erasure-coding-intro.jpg "A gentle introduction to the erasure coding")

The erasure coding is currently a very hot topic for distributed storage systems. It has been part of the Ceph roadmap for almost a year and Swift guys recently brought the discussion to the table. Both of them have planned to implement the erase code functionality so I thought it might be interesting to give a high level overview about the erasure coding principles. Before we start, I’d like to point out that **I don’t take any credit for this article**. I just read the wonderful white paper [“Erasure Coding vs. Replication: A Quantitative Comparison”](http://www.cs.rice.edu/Conferences/IPTPS02/170.pdf) written by Hakim Weatherspoon and John D. Kubiatowicz from Computer Science Division University of California, Berkeley. Many thanks to them. While ready the paper, I found their introduction to the erasure code easy to understand for a novice like me :).

  

# I. Introduction

An erasure code provides redundancy without the overhead of strict repli-cation. Erasure codes divide an object into `m` fragments and recode them into `n` fragments, where `n` > `m`. We call `r = m/n < 1` the rate of encoding.

A rate `r` code increases the storage cost by a factor of `1/r`. The key property of erasure codes is that the original object can be reconstructed from any `m` fragments. For example, using an `r = 1/4` encoding on a block divides the block into `m = 16` fragments and encodes the original `m` fragments into `n = 64` fragments; in-creasing the storage cost by a factor of four. Erasure codes are a superset of replicated and RAID systems. For example, a system that creates four replicas for each block can be described by an (`m = 1`, `n = 4`) erasure code. RAID level 1, 4, and 5 can be described by an (`m = 1`, `n = 2`, (`m = 4`, `n = 5) and (`m = 4`,`n = 5) erasure code, respectfully.

  

# II. Data Integrity

Erasure coding in a malicious environment requires the precise identification of failed or corrupted fragments. Without the ability to identify try to reconstruct the block; that is, `(n, m)` combinations. As a result, the system corrupted fragments, there is potentially a factorial combination of fragments to needs to detect when a fragment has been corrupted and discard it. A secure ver- ification hashing scheme can serve the dual purpose of identifying and verifying each fragment. It is necessarily the case that any `m` correctly verified fragments can be used to reconstruct the block. Such a scheme is likely to increase the bandwidth and storage requirements, but can be shown to still be many times less than replication.

  

> Simple isn’t?
