---
title: "S3-compatible object storage with radosgw"
date: "2010-11-13"
author: "sage"
tags: 
---

The [radosgw](http://ceph.newdream.net/wiki/RADOS_Gateway) has been around for a while, but it hasn’t been well publicized or documented, so I thought I’d mention it here.  The idea is this:

- Ceph’s architecture is based on a robust, scalable distributed object store called RADOS.
- Amazon’s S3 has shown that a simple object-based storage interface is a convenient way to write applications, even when that interface is very restrictive.
- Providing access to Ceph’s object store via an S3-compatible interface is easy with [librados](http://ceph.newdream.net/wiki/RADOS_Gateway).

The result is [radosgw](http://ceph.newdream.net/wiki/RADOS_Gateway), a FastCGI-based proxy that exposes Ceph’s object store via a REST (HTTP-based) interface.  Radosgw implements a subset of Amazon’s API (some Amazon-specific features of ACLs and object versioning aren’t supported), but the subset it does implement aims to be fully compatible.  That means that most existing apps that are designed for S3 can be seamlessly migrated to a Ceph-based object store, provided they allow the hostname to be configured (many hard-code s3.amazonaws.com).

It should be noted that this approach has some fundamental limitations:

- librados provides direct parallel access to storage nodes; radosgw is a single endpoint proxy that sits in front of your storage cluster.  That may actually be a good thing, depending on your security model.
- The REST-based storage interface is much more restricted than that provided by librados.  librados allows partial object updates, has no object size limits, supports extensible object classes, fine-grained snapshots, and more.
- The radosgw security model emulates S3′s, and is implemented as a layer on top of librados.  Accessing the same objects via the native librados library will not reflect S3-style ACLs created via radosgw.

Check it out!

