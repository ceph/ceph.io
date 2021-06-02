---
title: "RBD Status Update"
date: "2011-10-11"
author: "yehudasa"
tags: 
---

_Just a quick update on the current status of RBD.  
_  
The main recent development is that librbd (the userspace library) can ack writes immediately (instead of waiting for them to actually commit), to better mimic the behavior of a normal disk.

Why do this? A long long time ago, when you issued a write to a disk, it would ACK the write when the data was written. No more. Now, the ACK means the data is either the drive’s cache or on disk. You don’t know data is safe/durable until you issue a separate flush command. Now RBD behaves similarly: writes are acked immediately (up to some number of bytes, at least), and a flush will wait for all previous writes to commit. The only real difference between this and a real drive cache is that a real drive will try to coalesce small writes into a single operation, while RBD sends them all straight through to the backend cluster.

To make this work with qemu/KVM you need:

- Ceph v0.35 or later.
- Set the rbd\_writeback\_window to the number of bytes (something on the order of what you’d expect a physical disk cache to be.. say, 8 MB). This means using a qemu drive string like
    
    rbd:rbd/myimage:rbd\_writeback\_window=8000000
    
- You need qemu with commit 7a3f5fe, which wires up the qemu flush function properly.  It is not included in v0.15, but should be in the next release.

This is not yet implemented in the kernel RBD driver. As a result, effective performance using that device is still relatively poor. We hope to have similar behavior ready when the v3.2 merge window opens.

