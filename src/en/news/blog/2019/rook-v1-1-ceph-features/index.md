---
title: "Rook v1.1: Ceph CSI, Bucket Provisioning, External Clusters, and much more!"
date: "2019-09-13"
author: "tnielsen"
---

We are excited to announce a number of significant features and improvements for the Ceph operator for Kubernetes in Rook v1.1.

#### **Major themes**

- CSI driver ready for production
- Dynamic bucket provisioning for object storage
- Connections to an external Ceph cluster
- Configuration of Mons and OSDs on top of dynamic underlying storage
- Enablement of Ceph manager modules from the cluster CR
- Upgrade and maintenance improvements
- OSD configuration improvements
- Placement improvements

#### **CSI Driver** 

The [CSI driver](https://rook.io/docs/rook/v1.1/ceph-csi-drivers.html) is ready for prime time! Now you can take full advantage of dynamic provisioning with the Ceph-CSI driver including:

- Dynamic provisioning for RBD (RWO access)
- Dynamic provisioning for CephFS (RWX access)

Rook now enables the CSI driver by default for both new and upgraded clusters. We encourage you to create a new storage class pointing to the CSI provisioner and create all new volumes based on CSI.

Snapshots of RBD volumes are also available. The snapshot API defined by the CSI interface is still in alpha state so you will need to enable a feature gate to test out this feature.

For the full list of CSI features and their status, see the [Ceph-CSI Github](https://github.com/ceph/ceph-csi#support-matrix) repo.

**CSI Driver vs Flex Driver**

The FlexVolume driver is taking a back seat to the CSI driver. All future development is being focused on the CSI driver. While the flex driver is still fully supported, we invite you to start this transition now.

After you upgrade from v1.0, the flex driver will continue to run to ensure your volumes keep on running. At some point in the future the FlexVolume driver will be deprecated and we will ensure your volumes have a smooth path forward. 

One reason you would still need to use the flex driver is if you are running K8s 1.12 or earlier. The CSI interface was only declared stable starting in K8s 1.13, therefore, we cannot support the CSI driver on older versions of Kubernetes.

If you are still using the flex driver, a new feature to take advantage of in this release is the ability to resize volumes. Yes, you heard it right! You can now resize volumes.

#### **Bucket Provisioning**

Have you ever wondered why object storage wasn't available as a PVC? Object storage has always been treated differently by Kubernetes. Now we have solved this challenge and brought this pattern of dynamic provisioning to buckets in your Ceph object store.

When the admin wants to expose object storage in their cluster, they start by defining a storage class that points to the Ceph cluster where object storage is configured with RGW. Buckets can then be provisioned by users when they request an object bucket claim. This follows the standard Kubernetes pattern for PVCs, except now it's available for object storage as well!

To get started, see the section titled "Object Storage Buckets" on the [Ceph examples](https://rook.io/docs/rook/v1.1/ceph-examples.html) page.

#### **External Ceph Cluster**

Do you already have a Ceph cluster running and want your K8s applications to consume that storage? It’s now possible with Rook! When this mode is enabled, Rook will not manage the external cluster, it will simply consume it. In order to connect, you only need three pieces of information:

- External cluster Ceph FSID
- External cluster monitor IP addresses
- External cluster-admin key

Once the CephCluster is created with this connection information, Rook will immediately connect to that cluster. This feature assumes that network connectivity has been established between the external Ceph cluster and the local Kubernetes environment. To achieve this, the use of Host Networking makes that connection simple. Other options are also possible, such as having your external cluster on the same subnet as your service pool IPs or customizing your IP routing.

One more thing! Rook can still bootstrap other CRDs for you in Kubernetes such as Object, Filesystem, and NFS. In this case, these resources will run and be managed by Rook in the local Kubernetes even while the persistence is all in the external Ceph Cluster. Clients in the cluster won't even recognize that the storage is running elsewhere. All the connection information through the CSI driver, RGW endpoint, or other services will be as if the storage is available in the local cluster.

Try it out today by following the walkthrough on [setting up the connection to the external cluster](https://rook.io/docs/rook/v1.1/ceph-cluster-crd.html#external-cluster) and let us know how it goes!

#### Dynamic Underlying Storage

The Ceph monitors and OSDs require a place to persist your data. Monitors need access to a directory to store their database. Until now, this was only achieved in Rook by bind mounting a directory from the host machine into the container. Now if Rook runs on a cloud provider, we can take advantage of the Kubernetes persistent storage support to attach a Persistent Volume Claim (PVC) with a filesystem on it. The Ceph monitor store will then live on a PV, just like other standard K8s storage.

Ceph object storage daemons (OSDs) require raw block devices. Their implementation for attaching storage with PVCs is similar to the monitors. The difference is that the PVC must be presented as a raw block device and not a filesystem.

This new feature brings a lot more flexibility to run Ceph in a cloud provider, or even in your on-premise clusters with the local storage provisioner. To see its usage and try it out, check out the [PVC-based example](https://rook.io/docs/rook/v1.1/ceph-cluster-crd.html#pvc-based-cluster) in the docs. The mons specify a volumeClaimTemplate that points to a storage class, while the OSDs specify a storageClassDeviceSet with the number of devices to provision and the template (and storage class) used to provision them.

#### **Enable Ceph manager modules from the Cluster CR**

The Ceph Manager has a pluggable interface that allows you to write custom modules for a particular use case. Rook is now capable of enabling any known Ceph module. This can be done with the help of the new CephCluster config:

mgr:  
modules:  
\- name: pg\_autoscaler  
enabled: true

In this example we are enabling the PG autoscaler module. See the [Ceph official documentation](https://docs.ceph.com/docs/master/mgr/) for the full list of modules.

#### **Upgrade and maintenance Improvements**

There are several improvements in the area of upgrades. First, during the Rook upgrade of either the Rook or Ceph version, Rook will wait for each daemon to be healthy before upgrading the next daemon. This makes the overall Ceph upgrade safer and more in line with what the Ceph core team recommends.

The next area of improvements is found when you need to service or upgrade your K8s cluster. We have implemented pod disruption budgets for all Ceph daemons that will be used when draining nodes for maintenance. In this scenario, depending on which type of daemon is running on the selected machine to drain, Rook will set the pod disruption budget to account for the availability needs of each Ceph daemon.

On a related note, there are machine disruption budgets for OpenShift clusters. This works with the machine-api controller which might send a fencing request on an unhealthy node. In such an event, the machine disruption budget enforces that only one Ceph node can be fenced at a particular time. Once that machine is fenced, Rook waits for Ceph PGs to settle and will unlock the machine disruption budget to allow fencing on other nodes.

To enable these features to handle upgrade, see the disruptionManagement property in the [cluster CR documentation](https://rook.io/docs/rook/v1.1/ceph-cluster-crd.html#cluster-settings).

#### **OSD Configuration Improvements**

A number of improvements have been made to the way that OSDs can be configured and expose more capabilities of ceph-volume. Among these changes are included:

- A metadata device can be specified per individual device if desired instead of only per node
- The deviceClass property can be specified per device to indicate the class of storage to be configured in the CRUSH map
- A metadataDevice can be specified explicitly instead of relying on the system guessing which device to use (requires Nautilus 14.2.1 or newer)

#### **Placement Improvements**

Several improvements were made to better integrate the topologies of K8s clusters into the Ceph topology. In particular, Rook will look for the zone and region labels on the K8s nodes. If they are found:

- Mons will be automatically spread across the different zones
- OSDs will add the zones to the CRUSH hierarchy to improve the failure domain spread. See the [topologyAware setting](https://rook.io/docs/rook/v1.1/ceph-cluster-crd.html#cluster-settings) in the cluster CR.

Under the covers, another placement improvement is a new implementation of placing mons on nodes in the cluster. Previously Rook implemented its own scheduler to decide on which nodes to place mons based on the desired node affinity and tolerations specified in the cluster CR. Now we removed all that custom scheduling code and are using the Kubernetes scheduler to place the mons for us. If you see mon "canary" pods in your cluster, this is their sole purpose. Within moments they will be replaced by the mon daemon pods that are scheduled on the same nodes. Less code means better scheduling!

#### **Conclusion**

A big thanks to the Ceph team and many other community members for all of the improvements in this release. Truly this is the greatest set of Ceph features ever delivered in a Rook release. Let's celebrate this achievement and look forward to a bright future of continued improvements!

#### **co-author: Sébastien Han**
