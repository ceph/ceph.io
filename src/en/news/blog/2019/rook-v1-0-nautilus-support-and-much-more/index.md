---
title: "Rook v1.0: Nautilus Support and much more!"
date: "2019-05-02"
author: "tnielsen"
tags:
  - "ceph"
  - "rook"
  - "storage"
---

We are excited that Rook has reached a huge milestone... v1.0 has been released! Congrats to the Rook community for all the hard work to reach this critical milestone.  This is another great release with many improvements for Ceph that solidify its use in production with Kubernetes clusters. Of all the many features and bug fixes here are just a few of the highlights.

## Nautilus

Nautilus is now fully supported with this release of Rook. Everything points users to start Nautilus. The example deployments will launch Nautilus by default and upgrades are supported from Luminous and Mimic. Try out the latest features of the Nautilus release all from within your Kubernetes cluster.

## CSI Driver

Much work has been done on the Ceph-CSI driver and we have started to integrate it with Rook. With the v1.0 release it is now possible to start using it to consume the storage in your cluster. See the [Ceph CSI](https://rook.io/docs/rook/v1.0/ceph-csi-drivers.html) topic to try it out and let us know your feedback as we are transitioning away from the Rook flex driver.

This is just the first phase of integrating the CSI driver with Rook. Our goal is that CSI will be handled automatically by Rook so you don't have to worry about the CSI driver configuration at all. Until we get that work done in the next Rook release, consider the CSI driver as experimental for now. While some are using the driver in production already, we just don't want to call it stable as long as there is still manual configuration.

## Dynamic Operations

In this release, there were a number of important improvements that make the cluster more responsive to adding storage nodes or applying other settings automatically. Previously, there were some scenarios where it was required to restart the operator before it would apply the new configuration, which we aimed to clean up. Now the operator will automatically do the following:

- When a node is added to the cluster, OSDs will be automatically configured as needed.
- When a device is attached to a storage node, OSDs will be automatically configured as needed.
- Any change to the CephCluster resource (aka cluster.yaml) will trigger cluster configuration.

We know that clusters are constantly changing so we don't want you to worry about configuration every time the cluster changes. The operator will adjust the storage for you!

## NFS

With Nautilus comes new support for NFS. Rook has a new Custom Resource Definition (CRD) specifically for using NFS with Ceph. After you create your [CephFS Filesystem](https://rook.io/docs/rook/v1.0/ceph-filesystem.html), create the [NFS custom resource](https://rook.io/docs/rook/v1.0/ceph-nfs-crd.html) to instruct Rook to start the NFS daemons.  Try out NFS today by following the guide to [deploy Ceph+NFS using Rook](https://ceph.com/community/deploying-a-cephnfs-server-cluster-with-rook/)!

## Cluster Status & Monitoring

Ever wonder what the status of the Ceph cluster is when deployed by Rook? In the past you would start up the [Rook Toolbox](https://rook.io/docs/rook/v1.0/ceph-toolbox.html) and run ceph commands to find any status information. While you may still want to fire up the toolbox occasionally, the operator now periodically queries the ceph status and saves it in the CephCluster custom resource for you. To see the status, there is a new "Health" column when you get the cluster:

> $ kubectl -n rook-ceph get CephCluster rook-ceph
> NAME DATADIRHOSTPATH MONCOUNT AGE STATE HEALTH
> rook-ceph /var/lib/rook 3 5h27m Created HEALTH_OK

If there is ever a health warning or error, you can monitor the full details in the "status" section of the cluster:

> $ kubectl -n rook-ceph get CephCluster rook-ceph -o yaml
> ...
> status:
> ceph:
> health: HEALTH_WARN details:
> OSD_DOWN:
> message: 1 osds down
> severity: HEALTH_WARN
> lastChecked: 2019-05-01T19:42:30Z
> lastChanged: 2019-05-01T19:42:30Z previousHealth: HEALTH_OK

## Versioning

One last small, but helpful feature, is to easily recognize what version of Rook and Ceph you are running in your cluster. Each deployment that starts a Ceph daemon has a version label for both Rook and Ceph. You can either inspect the individual deployments with a "kubectl describe", or you may find it useful to dump all the versions with the following command:

> $ kubectl -n rook-ceph get deployments \\
> -o jsonpath='{range .items\[\*\]}{.metadata.name}{" \\trook="}{.metadata.labels.rook-version}{" \\tceph="}{.metadata.labels.ceph-version}{"\\n"}{end}'
>
> rook-ceph-mds-myfs-a rook=v1.0.0 ceph=14.2.1
> rook-ceph-mds-myfs-b rook=v1.0.0 ceph=14.2.1
> rook-ceph-mgr-a rook=v1.0.0 ceph=14.2.1
> rook-ceph-mon-a rook=v1.0.0 ceph=14.2.1
> rook-ceph-osd-0 rook=v1.0.0 ceph=14.2.1
> rook-ceph-rgw-my-store rook=v1.0.0 ceph=14.2.1

## Next Steps

Even while Rook has come so far, we look forward to what is coming next. An initial draft of features for the 1.1 release is found in the Rook [roadmap](https://github.com/rook/rook/blob/master/ROADMAP.md). In summary, the highest priority items include:

- CSI Driver: As mentioned earlier, completing the integration of the CSI driver is a top priority to add new capabilities while we transition away from the Rook flex driver.
  - The CephFS provisioning is still the subject of some attention as we map the Kubernetes RWX PersistentVolumes (PVs) directly on the (new) first-class Ceph 'subvolume' concept for tighter integration with Ceph Nautilus.
- External Clusters: One of our most requested features is the ability to connect to Ceph storage that is running in a separate, "external" cluster. Whether Rook has configured Ceph in the external Kubernetes cluster, or whether it is a Ceph cluster running on bare-metal, Rook and the CSI driver will enable the [ability](https://github.com/rook/rook/blob/master/design/ceph-external-cluster.md) to connect to the external cluster.
- Improved topology awareness for mon placement and CRUSH map support through Kubernetes node labels.
- Backing OSDs with Persistent Volumes (PVs) to enable more dynamic provisioning when running in cloud environments.

These are all specific improvements to Rook's deployment of Ceph. Now add to this the long list the Ceph improvements that are [in the works](https://tracker.ceph.com/projects/ceph/roadmap) and sit back and enjoy the ride.

## Getting Involved

We are excited by the growth of the Rook community and we invite everyone to engage who is in need of storage. We look forward to your input to make the product the best it can be. There are many ways to get involved:

- - [Rook website](https://rook.io/)

- - [Github](https://github.com/rook/rook)

- - [X](https://x.com/rook_io)

- - [Slack](https://slack.rook.io)

- - [YouTube](https://www.youtube.com/channel/UCa7kFUSGO4NNSJV8MJVlJAA)

- - [Email](mailto:info@rook.io)

### Upcoming Events

We look forward to meeting with you in the near future at various events. The [Cephalocon](https://ceph.com/cephalocon/barcelona-2019/) Barcelona [schedule](https://ceph.com/cephalocon/barcelona-2019/cephalocon-2019-barcelona-schedule/) (May 19-20) is packed with talks showcasing the work that is happening with Ceph and Rook, followed by [Kubecon](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2019) Barcelona (May 21-23) with [four talks](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2019/schedule) on Rook. We hope to see you there!
