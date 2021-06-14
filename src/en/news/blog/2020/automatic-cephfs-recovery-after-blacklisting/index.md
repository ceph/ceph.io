---
title: "Automatic CephFS Recovery after Blacklisting"
date: "2020-04-14"
author: "jtlayton"
---

The Linux Kernel CephFS client has gained the ability to automatically recover access to the cluster after a blacklisting and unblacklisting event.

CephFS relies heavily on delegating recallable stateful objects (represented by file capabilities, dentries, etc.) to the clients to attain good performance. This allows the clients to effectively cache granular information about the filesystem. Performance (and forward progress) also relies on the client to return that state in a timely fashion when it's revoked by the MDS.

In certain cases the client can fail to return its state back to the MDS for a long time. This could be due to a bug on the client or server, or a loss of connectivity between them. In this situation, the client can end up [blacklisted](https://docs.ceph.com/docs/master/cephfs/eviction/) (aka evicted) by the MDS's, with all of its state forcibly revoked.

Once the problem has been solved, the administrator can remove the client from the blacklist. In the past, the client needed to re-mount the filesystem in order to recover, which is disruptive for some applications.

Starting in v5.4, the Linux client accepts a new `recover_session=` mount option. The default is `recover_session=no`, which preserves the historical behavior.

If the mount option `recover_session=clean` is specified, then the client will attempt to reconnect to the MDS once the blacklisting has been cleared.

For a workload that is all reads and that doesn't involve file locking, the recovery should be seamless.

It can also be used on writeable mounts and/or with file locking as well, but the client must take steps to protect data integrity for clients that weren't blacklisted, and ensure that its caches are coherent in this situation.

Any data or metadata that was written to the cache and not yet flushed out will be dropped, and writeback errors will be recorded against those inodes (causing an error to be returned when `fsync()` is called on one of its file descriptors).

File descriptors that are associated with files on which any file locks were held will return errors on any read or write attempt against them. All of them must be closed before any reads or writes will again be allowed.

In general, this option should not be used by most clients that have stable connections to the MDS's, but in environments where connectivity may be spotty, and availability is more important than correctness, admins may want to consider enabling it.
