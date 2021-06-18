---
title: "Rook v1.3: Octopus, OSD enhancements, and more!"
date: "2020-04-07"
author: "tnielsen"
---

We are excited to announce a number of significant features and improvements for the Ceph operator for Kubernetes in Rook v1.3.

## Major Themes

- Octopus Support
- Pool Compression
- OSD Configuration
- Legacy OSD Removal
- Ceph-CSI v2.0
- Cluster Cleanup on Uninstall
- Controller Runtime Conversion
- Design for RGW MultiSite

### Octopus Support

With each release of Ceph, we strive to support the new features, upgrades, and other configuration changes. As the management plane, Rook automates the configuration so you don't have to worry so much about it. With the recent release of Ceph Octopus, the supported versions of Ceph now include:

- Nautilus v14.2.5 or newer
- Octopus v15.2.0 or newer

As always, Rook will manage the deployment and upgrade to these releases. Just follow the [upgrade guide](https://rook.github.io/docs/rook/v1.3/ceph-upgrade.html#ceph-version-upgrades) when you are ready to upgrade the version of Ceph running in your cluster. Usually it is as simple as changing the CephCluster CR. For example, to upgrade to Octopus:

spec:
  cephVersion:
    image: ceph/ceph:v15.2.0

Support for Mimic has been removed. Older clusters with Mimic will need to upgrade to Nautilus before updating to Rook v1.3.

### Pool Compression

The option to compress data in Ceph pools has been available in Ceph for some time. Now the option to compress the pool is available as an option on the [CephBlockPool CR](https://rook.github.io/docs/rook/v1.3/ceph-pool-crd.html). The _compressionMode_ property can be set on the pool to indicate the level of compression.

spec:
  compressionMode: <mode>

The mode can be one of the four options as seen in the Ceph [compression topic](https://docs.ceph.com/docs/master/rados/configuration/bluestore-config-ref/#inline-compression):

- _none_: Never compress data
- _passive_: Do not compress data unless the write operation has a _compressible_ hint set
- _aggressive_: Compress data unless the write operation has an _incompressible_ hint set
- _force_: Try to compress data no matter what

### OSD Configuration

The core Ceph storage daemons (OSDs) have a number of improvements in this release. 

- OSDs on PVCs: Added support for a separate volume to be created for the BlueStore metadata (DB/WAL)
- OSDs on PVCs can be increased in size if the underlying block size changes (an EBS volume was resized), the next time the OSD deployment is restarted the BlueStore engine will expand and this will be reflected in the overall cluster capacity.
- Dependency on LVM is removed for many scenarios. When running OSD on PVC with a collocated scenario (a single device is used for the OSD), the raw mode will be used and no LVM layer will be configured. 
- The CRUSH device class can be specified when running OSD on PVC. This is particularly useful in environments where Ceph cannot properly detect on which disks OSDs are running on. For instance, some Amazon volume type are reflected as NVMe as a transport layer. However, this is just a bus implementation and it’s not an actual NVMe that you are using. Ceph could be confused and tune itself to reflect the wrong type. Unfortunately, this tuning is not desired. If the administrator knows the correct type up front, an annotation can be applied in the volumeClaimTemplates metadata section and the OSD class will be populated with the correct value.
- Full path: Devices can be specified by their full path instead of the device name

### Legacy OSD Removal

While we do everything we can to avoid breaking changes, we were no longer able to maintain support for two types of legacy OSDs.

- Directories can no longer be specified for creating OSDs. Only raw devices or partitions can be used for OSDs. Directories that were based on Ceph FileStore are no longer recommended in production for new OSDs.
- OSDs created prior to Rook v0.9 are no longer supported that were using Rook’s partitioning scheme. Only OSDs created by Rook with ceph-volume since v0.9 are supported.

See Rook's [upgrade guide](https://rook.github.io/docs/rook/v1.3/ceph-upgrade.html#converting-legacy-osds) for more details on migrating the OSDs before upgrading to v1.3.

### **Ceph-CSI v2.0**

The Ceph-CSI v2.0 driver has been updated with a number of improvements in the [v2.0 release](https://github.com/ceph/ceph-csi/releases/tag/v2.0.0). This is now the minimum version of CSI driver that the Rook-Ceph operator supports. There are a number of critical features such as supporting volume resizing.

With the Rook v1.3 release, the default version of the CSI driver installed is [v2.1](https://github.com/ceph/ceph-csi/releases/tag/v2.0.1). When a new version of the CSI driver comes out, you can configure Rook to run the newer version before it becomes Rook's default by modifying the [CSI version settings](https://github.com/rook/rook/blob/release-1.3/cluster/examples/kubernetes/ceph/operator.yaml#L49-L54).

### Multus Support (Experimental)

Rook has the necessary changes to use Multus so dedicated networks can be exposed inside specific containers. It’s not uncommon to separate networks when deploying a Ceph cluster into three:

1. Monitor network: on traditional SDN on the API network
2. Public network: for client communication with the cluster, dedicated NIC, and subnet
3. Cluster network: for internal communication between cluster component, also known as replication network, dedicated NIC, and subnet

With the help of Multus, the above can be achieved and Rook will read the provided Network Attachment Definitions. Rook also allows you to separate both Public and Cluster networks by adding the following in your CR under the network section:

network:
 provider: multus
 selectors: 
 public: <Multus NetworkAttachmentDefinition object name>
 cluster: <Multus NetworkAttachmentDefinition object name>

If a single network is available it can used for both public and cluster and you can only specify “public”.

Due to limited testing and giving the complexity of Multus this feature is declared experimental in this release. Please report any feedback you might have so we can declare this feature as stable!

### Controller Runtime Conversion

Rook has several CRDs (Custom Resource Definition) such as CephCluster, CephBlockPool, CephFilesystem, and CephObjectStore. These controllers that implement these CRDs are now built with the [Kubernetes controller-runtime project](https://github.com/kubernetes-sigs/controller-runtime) which represents a set of go libraries for building Controllers. This project is leveraged by Kubebuilder and Operator SDK and is the most commonly used library to write CRD controllers. Some of the benefits:

- Follow industry standards and common patterns
- Enhanced robustness of the desired state. With watchers on resources, each controller will reconcile Kubernetes object if they change (e.g. if a resource is deleted accidentally, the controller will re-create it within seconds).
- Faster reconciliation on events
- Each controller has its own reconciliation loop which is outside of the main CephCluster one. So each CRD is treated more independently and will quickly respond to changes.

### Cleanup during uninstall

When Rook is uninstalled, one of the biggest pain points has been cleaning up the data on the hosts. Since Rook wants to ensure your data isn't accidentally deleted, we have been reluctant to create an automated uninstall. Now we have settled on a design that we hope will be a safe compromise.

To enable the host cleanup during uninstall, the process is the following:

First, immediately before uninstall set the cleanup policy in the CephCluster CR:

spec:
  cleanupPolicy:
    deleteDataDirOnHosts: yes-really-destroy-data

Now when you delete the CephCluster CR, the operator will start a Kubernetes Job to clean up the data on each of the hosts where the Ceph deamons were running.

There is a second aspect to the cleanup that we will be implementing very soon, which is to wipe the data off the raw devices used by OSDs. For now, only the mon data will be cleaned from the hosts.

### Operator Settings via a ConfigMap

The settings for the Ceph operator have long only been applied through environment variables to the operator deployment. If any update were needed to the settings it required a restart to the operator. Now many of the settings have been converted to a [ConfigMap](https://github.com/rook/rook/blob/release-1.3/cluster/examples/kubernetes/ceph/operator.yaml#L13), which the operator will watch for changes. If the settings are updated, the operator will automatically apply the new settings without a restart. In particular, a new version of the CSI driver can be applied if desired.

### Design for RGW MultiSite

Beyond configuring Ceph in a single Kubernetes cluster, Rook aims to simplify replicating data across multiple Ceph clusters. Supporting RGW MultiSite has long been in the plan and we have completed the [design](https://github.com/rook/rook/blob/master/design/ceph/object/ceph-multisite-overview.md) of this feature.  In the Rook v1.4 release we will look forward to the first release with this feature available. If you have feedback on the design before the feature is out in the next release, we would love to hear from you.

### Conclusion

A big thanks to the Ceph team and many other community members for all of the improvements in this release. Let’s celebrate this achievement and look forward to a bright future of continued improvements!

#### **co-author: Sébastien Han**
