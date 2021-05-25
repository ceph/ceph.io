---
title: "rbd ioengine for fio"
date: "2014-02-27"
author: "dalgaaf"
tags: 
  - "ceph"
  - "planet"
---

Since running benchmarks against Ceph was a topic in the "Best Practices with Ceph as Distributed, Intelligent, Unified Cloud Storage (Dieter Kasper, Fujitsu)" talk on the Ceph day in Frankfurt today, I would like to point you to a blog post about the outcome of the time we spend on benchmarking Ceph performance to find bottlenecks at the Platform Engineering team for the Business Marketplace at Deutsche Telekom AG: ["Ceph Performance Analysis: fio and RBD"](http://telekomcloud.github.io/ceph/2014/02/26/ceph-performance-analysis_fio_rbd.html)

  

[![](https://images-blogger-opensocial.googleusercontent.com/gadgets/proxy?url=http%3A%2F%2Fwww.inktank.com%2Fwp-content%2Fuploads%2F2014%2F01%2FCeph-Days-Logo.png&container=blogger&gadget=a&rewriteMime=image%2F*)](https://images-blogger-opensocial.googleusercontent.com/gadgets/proxy?url=http%3A%2F%2Fwww.inktank.com%2Fwp-content%2Fuploads%2F2014%2F01%2FCeph-Days-Logo.png&container=blogger&gadget=a&rewriteMime=image%2F*)Short summary: We contributed a rbd engine swiss-knife-IO-tool fio. You are now able to run tests directly against the userspace librbd implementation as e.g. used by RBD QEMU driver. This allows you to have one single IO benchmark tool to run against RBD kernel, the userspace implementation or against a RBD block device directly in your VM.
