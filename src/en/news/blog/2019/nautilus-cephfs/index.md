---
title: "New in Nautilus: CephFS Improvements"
date: "2019-05-18"
author: "batrick"
---

Work continues to improve the CephFS file system in Nautilus. As with the rest of Ceph, we have been dedicating significant developer time towards improving usability and stability. The following sections go through each of these works in detail

## **MDS stability**  

MDS stability has been a major focus for developers in the past two releases. One of the more recent issues we’ve discovered is that an MDS with a very large cache (64+GB) will hang during certain recovery events. For example, when the MDS is trying to reduce its cache size to obey the “mds\_cache\_memory\_limit”, the client is asked to release some of its capabilities. To do this, the MDS calculates a desired ratio of capabilities to remove and asks each client to do so. However, a large MDS may have tens of millions of capabilities outstanding and an individual long-running client may have millions. The time to go through the release messages all at once can cause the MDS to become unavailable to do real work or even cause the monitors to replace the MDS with a standby.  

We have addressed this issue from two directions:  

- The MDS now throttles how quickly it recalls capabilities from clients so that sudden reductions in the cache size (due to configuration changes) or large client caches do not destabilize the MDS. This behavior is controlled through these new configuration variables: `mds_recall_max_caps`, `mds_recall_max_decay_rate`, `mds_recall_max_decay_threshold`, `mds_recall_global_max_decay_threshold`, `mds_recall_warning_threshold`, `mds_recall_warning_decay_rate`. The defaults have been carefully chosen; we do not expect administrators should need to change them. Each option’s description documents its function.
- The MDS now limits the number of capabilities that a single client can hold. This is controlled through the new `mds_max_caps_per_client` configuration variable. The MDS will recall capabilities from a client going over this limit until it goes back under. The version of the client does not matter.

There is also ongoing work to address this within the client itself by having it voluntarily release capabilities it is no longer using.  

Users of CephFS should expect to see the MDS behave in more predictable ways when operating with a very large cache. Additionally, the MDS will no longer be tolerant of a client holding millions of caps which causes its own problems during recovery events or large MDS cache size changes.

## **NFS-Ganesha Gateway Clusters**  

Ganesha is a user-space NFS server that exports local file systems and alternative storage solutions. One of the long existing export types allows exporting the CephFS file system. This exposes a Ceph file system to NFS clients which may be desirable for many reasons including storage cluster isolation, security, and legacy applications.  

The Nautilus release of Ceph makes NFS-Ganesha a first class citizen in the cluster with a lifetime managed by Ceph from start to finish. Together with the Rook operator and Kubernetes, Ceph creates clusters of NFS-Ganesha daemons to export a Ceph file system.  

Each daemon in the Ganesha cluster is configured to export the same file system in an active-active fashion. This means that multiple NFS servers can load-balance requests by clients to the same CephFS file system. Before Nautilus, this was an unsafe configuration (done manually) due to the way failover could lose NFS client state.  

Work continues to make setting up these clusters as turn-key as possible. We expect many user interface changes will be backported to Nautilus in the coming months. In the mean-time, a hands-on demo is available in Jeff Layton's[previous blog post.](https://ceph.com/community/deploying-a-cephnfs-server-cluster-with-rook/)  

## **Changes to Standby Replay**  

The mechanism for configuring “standby replay” daemons in CephFS has been reworked. Standby-replay daemons track an active MDS’s journal in real-time, enabling very fast failover if an active MDS goes down. Prior to Nautilus, it was necessary to configure the daemon with the `mds_standby_replay` option so that the MDS could operate as standby-replay. The monitors would receive beacons from these MDS daemons indicating that they are able to operate in standby-replay and then would assign them ranks to follow if available.  

This was discontinuous with other file system configurations which normally are changed via the `ceph fs` command suite; configuring the MDS to influence the monitors inverts the decision making. Instead, it is simpler to have the operator indicate which file systems should have standby-replay daemon. Also, it doesn’t make sense to have standby-replay daemons for only some ranks.  

The new file system setting `allow_standby_replay` configures the file system to allow standby-replay. As long as standby daemons are available, the monitors will assign them to follow available ranks on the file system.  

The standby-replay daemons count towards the file systems desired standby count, configured by the file system setting “standby\_count\_wanted”. Be sure to configure this setting to track your changes to “max\_mds” so that [sufficient standbys are available](http://docs.ceph.com/docs/nautilus/cephfs/health-messages/#cluster-health-checks). With standby-replay daemons, it would be recommended to set this to at least “max\_mds+1”. So, one vanilla standby daemon would be available to replace a standby-replay daemon.

Finally, there were config options which allowed the operator to specify which file systems, ranks, or named MDS to follow. These config options were “mds\_standby\_for\_\*”. These options have been obsoleted in Nautilus so that all MDSs are treated uniformly and equally.

## **New cephfs-shell tool**  

CephFS has two main vectors for access: the ceph-fuse client and the Linux kernel driver. There is now a new cephfs-shell tool written in Python by [our Outreachy intern Pavani Rajula](https://rpavani1998.github.io/) in Summer 2018. The tool lets the user do simple operations on the file system via a custom shell. For example

CephFS:~/>>> mkdir foo  
CephFS:~/>>> put /etc/hosts foo/hosts  
CephFS:~/>>> cat foo/hosts  
127.0.0.1       localhost  
  
\# The following lines are desirable for IPv6 capable hosts  
::1     localhost ip6-localhost ip6-loopback  
ff02::1 ip6-allnodes  
ff02::2 ip6-allrouters  
CephFS:~/>>> 

Please keep in mind that the cephfs-shell is alpha-quality software and probably has bugs. We are regularly backporting fixes to Nautilus and the community’s ideas on improvements are most welcome (on the ceph-users mailing list).  

## **Blacklisting Older Clients**  

Also in Mimic v13.2.2+, CephFS now allows the cluster administrator to prevent older clients from mounting the file system. This can be helpful to blacklist versions which are known to misbehave in some way (e.g., by not releasing capabilities).  

This is done using the new file system setting:  

ceph fs set tank min\_compat\_client mimic  

Once done, the MDSs will blacklist and evict older clients and prevent them from connecting in the future.
