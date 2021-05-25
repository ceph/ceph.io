---
title: "New in Pacific: CephFS Updates"
date: "2021-04-23"
author: "batrick"
---

The Ceph file system (CephFS) is the file storage solution of Ceph. Pacific brings many exciting changes to CephFS with a strong focus on usability, performance, and integration with other platforms, like Kubernetes CSI. Let’s talk about some of those enhancements.

## Multiple File System Support

CephFS has had experimental support for multiple file systems for several releases now. They are even often necessarily used in some recovery operations. In Pacific, the team has increased testing and improved usability for client access. The feature is now considered stable and ready to use in production environments.

On existing Ceph clusters upgraded to Pacific, the feature flag must still be enabled:

`$ ceph fs flag set enable_multiple true`

Following this, the recommended way to create more file systems is through the [volume API](https://docs.ceph.com/en/latest/cephfs/fs-volumes/#fs-volumes):

`$ ceph fs volume create <fs_name> [<placement>]`

A file system and its pools are created in a single operation using Ceph’s recommended defaults. Finally, MDS are automatically deployed by cephadm (or the backend deployment technology) following the `<placement>` specification.

## MDS Autoscaler

A larger theme of the Ceph project is to improve usability by simplifying management. The new [MDS autoscaler plugin](https://docs.ceph.com/en/latest/mgr/mds_autoscaler/) automates MDS deployment according to the needs of the file systems. It can deploy MDS in response to changing max\_mds or standby\_count\_wanted settings on the file system. To enable, use:

`$ ceph mgr module enable mds_autoscaler`

## CephFS Monitoring: cephfs-top

[The `cephfs-top` utility](https://docs.ceph.com/en/latest/cephfs/cephfs-top/) provides a view of the active sessions on a CephFS file system. This provides a view of what clients are doing that has been difficult or impossible to learn from only the MDS performance statistics (accessible via the admin socket). In particular, the capability hit ratio (cache effectiveness), read/write/metadata latency, and I/O throughput/sizes of the client are now shown through this tool.

# ![../../_images/cephfs-top.png](https://lh3.googleusercontent.com/wrdSMUQ0waVkn4wh5fuks0BnHtHnVlAEwExZLVc5BKpfzsoo0qI9n9bQ_l2mrF87PZQjgkKBCj4zbRHlDjvqKUSnehIgTvvS0HGYqJcAQS9AUpQzVUumzwO-vqyts10DOcm_rUNj)

Work is on-going to improve the utility. It is currently development preview quality. Currently `cephfs-top` only gives a view of a single file system. Multiple file system support is planned.

## Scheduled Snapshots

[A new manager module is available to schedule snapshots on a Ceph file system](https://docs.ceph.com/en/latest/cephfs/snap-schedule/). This must be enabled via:

`$ ceph mgr module enable snap_schedule`

Then a policy can be setup to schedule snapshots like so:

`$ ceph fs snap-schedule add / 1h  
$ ceph fs snap-schedule status /  
{"fs": "a", "subvol": null, "path": "/", "rel_path": "/", "schedule": "1h", "retention": {"h": 12}, "start": "2021-04-21T00:00:00", "created": "2021-04-21T19:42:33", "first": "2021-04-21T20:00:00", "last": "2021-04-21T20:00:00", "last_pruned": null, "created_count": 1, "pruned_count": 0, "active": true}`

`$ ls /cephfs/.snap  
scheduled-2021-04-21-20_00_00`

  
Retention policies can also be configured so that snapshots are deleted on a schedule.

## NFS Gateway Clusters

NFS is a common file access protocol that continues to be popular. Ceph now offers a way to orchestrate and configure clusters of NFS gateways that export CephFS (and soon RGW). Ceph has incorporated NFS as a first class service for many reasons including ensuring cache coherency and consistency, ease-of-use, and usability.

Creating an NFS cluster is as simple as:

`$ ceph nfs cluster create cephfs mynfs`

With the NFS cluster named “mynfs”. Next configure one or more exports:

`$ ceph nfs export create cephfs mycephfs mynfs /mycephfs --path=/`

An export is created in the mynfs cluster for the mycephfs Ceph file system. The export is mountable at `/mycephfs` for NFS clients. The `--path` argument allows selecting which path in mycephfs to export.

Following that, learn the IP/port for the NFS gateways:

`$ ceph nfs cluster info mynfs  
{    
    "mynfs": [  
        {     
            "hostname": "XXXX",  
            "ip": [  
                "192.168.149.18"  
            ],  
            "port": 2049  
        }  
    ]  
}`

And then mount on the clients:

`$ mount -t nfs 192.168.149.18:/mycephfs /mnt -o port=2049`

`$ df -h /mnt  
Filesystem                Size  Used Avail Use% Mounted on  
192.168.149.18:/mycephfs  943G     0  943G   0% /mnt`

NFS clusters may have multiple gateways (“active-active”) with load distribution by NFS clients implemented by the administrator. (Future work for automatic load balancing via HAProxy and high-availability with cephadm is underway.)

For more information, please refer to the [documentation](https://docs.ceph.com/en/latest/cephfs/fs-nfs-exports/#).

## Multiple Active MDS Scrub

[Scrubbing a file system](https://docs.ceph.com/en/latest/cephfs/scrub/) may now be done when multiple ranks are active (_max\_mds_ > 1). More bug fixes and testing have been done to support this mode. It is no longer necessary to reduce _max\_mds_ to 1 in order to scrub.

Scrubbing is now always directed at rank 0. Scrub operations to other ranks are dispatched from rank 0 when it is not authoritative for some metadata. For example:

`$ ceph tell mds.mycephfs:0 scrub start / recursive`

Note, this is using the `ceph tell` syntax unique to MDS daemons `mds.<fs_name>:<rank>`.

## Subtree Pinning Policies: Ephemeral Pins

[Subtree pinning](https://docs.ceph.com/en/latest/cephfs/multimds/#manually-pinning-directory-trees-to-a-particular-rank) debuted in the Luminous release. This allowed statically configuring the subtree distribution between the MDS ranks for a file system. The static partition would override any decisions by the _balancer_ internal to the MDS which would otherwise try to dynamically distribute subtrees. Subtree pinning has enjoyed popularity for its reliability and predictability.

In Pacific, CephFS is taking this a step farther by adding a [new mechanism for defining _policies_ for setting pins on subtrees](https://docs.ceph.com/en/latest/cephfs/multimds/#setting-subtree-partitioning-policies). These pins are transient in nature and called therefore _ephemeral_. Where an ephemerally pinned directory is statically located (which rank) is determined by the MDS cluster. The policies only control _how_ a directory is ephemerally pinned not _where_.

CephFS supports two pinning policies: _distributed_ and _random_.

The _distributed_ policy statically partitions immediate sub-directories across all MDS ranks. The most canonical use-case would be a `/home` directory in which you’d like to evenly distribute user home directories across MDS ranks without manually setting pins. To set such a policy, it is done via an extended attribute change:

`$ setfattr -n ceph.dir.pin.distributed -v 1 /cephfs/home`

The _random_ policy ephemerally pins a directory based on a probability. Whether a directory is ephemerally pinned is determined when it's loaded into the MDS cache (an existing directory) or on creation. Setting this policy is done via:

`$ setfattr -n ceph.dir.pin.random -v 0.005 /cephfs/home`

So, a directory will have a 0.5% probability of becoming a new ephemerally pinned subtree.

This performance improvement is especially exciting for us and we are eager to hear feedback from users.

## File System Mirroring: cephfs-mirror

CephFS supports asynchronous replication of snapshots to a remote CephFS file system via the **cephfs-mirror** tool. A mirroring module (manager plugin) provides interfaces for managing directory snapshot mirroring (but does not manage spawning of `cephfs-mirror` daemon).

Mirror daemons require a Ceph user for accessing file systems on the primary cluster which can be done as follows:

**Mirror Daemon**

`$ ceph auth get-or-create client.mirror mon ‘profile cephfs-mirror’ mds ‘allow r’ osd ‘allow rw tag cephfs metadata=*, allow r tag cephfs data=*’ mgr ‘allow r’`

**Note**: This creates _client.mirror_ user which is passed to the mirror daemon during startup.

Mirror daemons can be deployed using **cephadm** (recommended) or via **systemctl**.

To deploy via cephadm use:

`# ceph orch apply cephfs-mirror`

Or, via **systemctl**:

`# systemctl enable --now cephfs-mirror@mirror`

**Mirroring Module and Interface**

The mirroring module provides interfaces for managing directory snapshot mirroring and is responsible for assigning directory paths to mirror daemons for synchronization.

Mirroring module is disabled by default. To enable mirroring use:

`$ ceph mgr module enable mirroring`

Mirroring module provides a family of commands to control mirroring of directory snapshots. Mirroring needs to be enabled on a file system before adding directory paths for snapshot mirroring. This can be done as:

`$ ceph fs snapshot mirror enable <fs_name>`

Once mirroring is enabled, add a peer to the file system. A peer is a remote filesystem, either a file system on a separate ceph cluster or in the same cluster as the primary file system. The easiest way to add a peer is via _bootstrap_. Bootstrapping a peer is a two step process. First, create a _bootstrap token_ on the remote filesystem using:

`$ ceph fs snapshot mirror peer_bootstrap create <fs_name> <client_entity> <site-name>`

For example:

`$ ceph fs snapshot mirror peer_bootstrap create backup_fs client.mirror_remote site-remote  
{"token":"eyJmc2lkIjogIjBkZjE3MjE3LWRmY2QtNDAzMC05MDc5LTM2Nzk4NTVkNDJlZiIsICJmaWxlc3lzdGVtIjogImJhY2t1cF9mcyIsICJ1c2VyIjogImNsaWVudC5taXJyb3JfcGVlcl9ib290c3RyYXAiLCAic2l0ZV9uYW1lIjogInNpdGUtcmVtb3RlIiwgImtleSI6ICJBUUFhcDBCZ0xtRmpOeEFBVnNyZXozai9YYUV0T2UrbUJEZlJDZz09IiwgIm1vbl9ob3N0IjogIlt2MjoxOTIuMTY4LjAuNTo0MDkxOCx2MToxOTIuMTY4LjAuNTo0MDkxOV0ifQ=="}`

Next, import the bootstrap token in the primary cluster using:

`$ ceph fs snapshot mirror peer_bootstrap import <fs_name> <token>`

For example:

`$ ceph fs snapshot mirror peer_bootstrap import cephfs  
eyJmc2lkIjogIjBkZjE3MjE3LWRmY2QtNDAzMC05MDc5LTM2Nzk4NTVkNDJlZiIsICJmaWxlc3lzdGVtIjogImJhY2t1cF9mcyIsICJ1c2VyIjogImNsaWVudC5taXJyb3JfcGVlcl9ib290c3RyYXAiLCAic2l0ZV9uYW1lIjogInNpdGUtcmVtb3RlIiwgImtleSI6ICJBUUFhcDBCZ0xtRmpOeEFBVnNyZXozai9YYUV0T2UrbUJEZlJDZz09IiwgIm1vbl9ob3N0IjogIlt2MjoxOTIuMTY4LjAuNTo0MDkxOCx2MToxOTIuMTY4LjAuNTo0MDkxOV0ifQ==`

File system peers can be listed using:

`$ ceph fs snapshot mirror peer_list <fs_name>`

To add a directory path for snapshot synchronization, use the following:

`$ ceph fs snapshot mirror add <fs_name> <path>`

For example:

`$ ceph fs snapshot mirror add cephfs /d0/d1`

Note: Once a directory is added for mirroring, its children or ancestor directories cannot be added for mirroring; there is no nested mirroring. Also, only absolute directory paths are allowed. File system paths are normalized by the mirroring module, therefore, `/a/b/../b` is equivalent to `/a/b`.

Likewise, to stop snapshot mirroring for a directory use:

`$ ceph fs snapshot mirror remove <fs_name> <path>`

Directory synchronization status can be checked using:

`$ ceph fs snapshot mirror daemon status <fs_name>`

More details can be found at in the [CephFS documentation](https://docs.ceph.com/en/latest/cephfs/cephfs-mirroring/).

## Windows Client: cephfs-dokan

Thanks to consulting work by Lucian Petrut of Cloudbase Solutions, Pacific also brings a [Windows driver for CephFS via Dokan](https://docs.ceph.com/en/latest/cephfs/ceph-dokan/) (think FUSE for Windows). It uses the same userspace library as ceph-fuse. Starting the client is as simple as:

`ceph-dokan.exe -c c:\ceph.conf -l x`

The new cephfs-dokan client is undergoing active development and continuous integration testing is still to be written for the Ceph QA infrastructure (Windows images are not yet available). Users should consider this preview software.

## Conclusions

Pacific has shaped up to be one of the biggest releases for CephFS. Developers have been hard at work on improving usability, performance and stability. We hope the community gets a lot of value of this release and look forward to hearing your experiences and feedback on the mailing lists. Enjoy!
