---
title: "Seamless Data Movement Across Clusters using RBD Live Migration in Squid"

date: 2025-02-07
author: Sunil Angadi, Anthony D'Atri, Ila Dryomov (IBM)
tags:
  - ceph
  - rbd
---

## Seamless Data Movement Across Clusters using RBD Live Migration in Squid

### Introduction to Block Storage

A block is a small, fixed-sized piece of data, like a 512-byte chunk. Imagine
breaking a book into many pages: each page is a "block". When you put all the
pages together, you get a complete book, just like combining many smaller data
blocks creates a larger storage unit.

#### Where Do We Use Blocks?

Block-based storage is commonly used in computing, and in devices including:
* Hard drives or SSDs (your computer's storage)
* CDs/DVDs (discs you use for music or movies)
* Floppy disks (older storage devices)
* Tape drives (used in big data backup systems)

#### What Are Ceph RADOS Block Devices (RBD)?

Ceph RADOS Block Devices are a type of storage served by a Ceph cluster that
works like a virtual physical storage drive. Instead of storing data on a single
device, it spreads the data across multiple storage nodes and devices (called
OSDs) in a Ceph cluster. This makes it efficient, scalable, and reliable.

#### Why Are Ceph Block Devices Special?

Ceph Block Devices have some amazing features:
* Snapshots – Like taking a photo of your data at a moment in time, so you can restore or roll back to it later.
* Replication – Your data is copied multiple times to prevent loss.
* Data consistency – Ensures your data is accurate and safe.

#### How Do Ceph Block Devices Work?

Clients use the ``librbd`` library to talk to the components of a Ceph
cluster and manage data efficiently.

#### Who Uses Ceph Block Devices?

* Cloud computing platforms like OpenStack, Proxmox, AWS EBS, and IBM Cloud rely on them.
* Virtual machines (KVM/QEMU) use them for fast and scalable storage.
* They can even work alongside Ceph’s Object Storage for a flexible storage solution.

In short, Ceph Block Devices provide fast, scalable, and reliable storage for
modern computing needs, ensuring that data is always available, accurate,
and safe.

## Ceph RBD Live Migration of Images

As a storage administrator, you have the power to seamlessly move (_live-migrate_)
RBD images within your Ceph cluster or to a different Ceph cluster. Think of this
like moving a file from one folder to another on your computer, but in this case,
it happens within or between large, distributed storage clusters.

Note that RBD images are also known as _volumes_, a term that is less likely to
be confused with graphics files containing the likeness of Taylor Swift or cats.

### Key Features

* Migration between pools or RBD namespaces within a Ceph cluster
* Migration between pools and RBD namespaces across Ceph clusters
* Support for multiple image formats (Native, QCOW, RAW)
* Live migration of encrypted images
* Integration with external data sources including HTTP, S3, and NBD
* Preservation of snapshot history and sparseness during migration

Note: Linux KRBD kernel clients currently do not support live migration.

### What Can You Migrate?

* Between different storage pools (e.g., moving from a high-performance replicated TLC SSD pool to a cost-effective erasure-coded QLC or HDD pool).
* Within the same pool (e.g., reorganizing data for better management or to effect compression).
* Across different formats or layouts (e.g., upgrading from an older storage format to a newer one).
* From external data sources (e.g., migrating from a non-Ceph storage system into Ceph).

### Live Migration: Import-Only Mode

Want to migrate data from an external source or storage provider? No problem! You can:

* Import data from a backup file
* Pull data from a web URL (HTTP/HTTPS file)
* Move data from an S3 storage bucket
* Connect to an NBD (Network Block Device) export

### How Does Live Migration Work?

When you start a live migration, here’s what happens behind the scenes:

* Deep Copying – The system duplicates the entire image while keeping all historical snapshots.
* Sparse Data Optimization – Only the actual used data is copied, saving storage space and speeding up the process.
* Seamless Transition – The migration happens while the image remains usable, minimizing downtime.
* Source Becomes Read-Only – The original image is locked so no new changes are made.
* Automatic I/O Redirection – All applications and users automatically start using the new image without interruptions.

### Why Is This Important?

* Keeps data flexible – Move storage based on performance, cost, or organizational needs.
* Ensures data integrity – Snapshot history and structure remain intact.
* Works in real-time – Migration happens without disrupting workloads.

### Step-by-Step Guide to Live Migrating Ceph RBD Images 

Live migration of RBD images in Ceph allows you to move storage seamlessly between
pools, RBD namespaces, and clusters in different formats with minimal downtime.
Let's break it down into three simple steps, along with the necessary commands to execute them.

#### Step 1: Prepare for Migration

Before starting the migration, a new target image is created and
linked to the source image.

* If the import-only mode is not enabled, the source image will be marked read-only to prevent modifications.
* Any attempts to read uninitialized parts of the new target image will redirect the read operation to the source image.
* If data is written to an uninitialized part of the target image, Ceph automatically deep-copies the corresponding blocks from the source.

**Syntax:**

```
rbd migration prepare SOURCE_POOL_NAME/SOURCE_IMAGE_NAME TARGET_POOL_NAME/TARGET_IMAGE_NAME
```

**Example:**

```
rbd migration prepare source_pool1/source_image1 target_pool1/target_image1
```

Initiate the import-only live migration process by running
the ``rbd migration prepare`` command with the ``--import-only`` flag and
either ``--source-spec`` or ``--source-spec-path`` option, passing a JSON file
that describes how to access the source image data.

1. Create a JSON file:

```
[ceph: root@rbd-client /]# cat testspec.json
 {
   "type": "raw",
    "stream": {
        "type": "s3",
        "url": "https:hots_ip:80/testbucket1/image.raw",
        "access_key": "Access key",
        "secret_key": "Secret Key"}
}
```

2. Prepare the import-only live migration process:

**Syntax:**

```
rbd migration prepare --import-only --source-spec-path "JSON_FILE" TARGET_POOL_NAME/TARGET_IMAGE_NAME
```

**Example:**

```
[ceph: root@rbd-client /]# rbd migration prepare --import-only --source-spec-path "testspec.json" target_pool/traget_image
```

Check the status of the migration with the ``rbd status`` command:

```
[ceph: root@rbd-client /]# rbd status target_pool/target_image
Watchers: none
Migration:
source: {"stream":{"access_key":"RLJOCP6345BGB38YQXI5","secret_key":"oahWRB2ote2rnLy4dojYjDrsvaBADriDDgtSfk6o","type":"s3","url":"http://10.74.253.18:80/testbucket1/image.raw"},"type":"raw"}
destination: targetpool1/sourceimage1 (b13865345e66)
state: prepared
```

#### Step 2: Execute Migration

After preparation is complete, Ceph starts deep copying all existing data
from the source image to the target image.

* The migration runs in the background; applications can use the new target image immediately.
* Any new write operations are stored only on the target image, ensuring a seamless transition.

**Syntax:**

```
rbd migration execute TARGET_POOL_NAME/TARGET_IMAGE_NAME
```

**Example:**

```
rbd migration execute target_pool1/target_image1
```

### Step 3: Finalizing the Migration

After the data has been fully transferred, commit or abort the migration.

#### Option 1: Commit the Migration

Committing the migration removes all links between the source and target images.

* If import-only mode was not used, the source image is automatically deleted.
* The target image becomes fully independent.

**Syntax:**

```
rbd migration commit TARGET_POOL_NAME/TARGET_IMAGE_NAME
```

**Example:**

```
rbd migration commit target_pool1/target_image1
```

#### Option 2: Abort the Migration

Migrations can be cancelled.  Cancelling a migration will cause the following to happen:

* Remove any cross-links between the images.
* Delete the target image, restoring the source image to its previous state.

**Syntax:**

```
rbd migration abort TARGET_POOL_NAME/TARGET_IMAGE_NAME
```

**Example:**

```
rbd migration abort targetpool1/targetimage1
```

The following example shows how to migrate data from one Ceph cluster to another Ceph
cluster, here named _cluster1_ and _cluster2:_

```
[ceph: root@rbd-client /]# cat /tmp/native_spec
{
  "cluster_name": "c1",
  "type": "native",
  "pool_name": "pool1",
  "image_name": "image1",
  "snap_name": "snap1"
}
[ceph: root@rbd-client /]# rbd migration prepare --import-only --source-spec-path /tmp/native_spec c2pool1/c2image1 --cluster c2
[ceph: root@rbd-client /]# rbd migration execute c2pool1/c2image1 --cluster c2
Image migration: 100% complete...done.
[ceph: root@rbd-client /]# rbd migration commit c2pool1/c2image1 --cluster c2
Commit image migration: 100% complete...done.
```

### Supported Image Formats

Live migration supports three primary formats:

1. *Native format* uses Ceph's internal format for efficient migration.

The native format does not include the stream since it utilizes
native Ceph operations. For example, to import from the
image ``rbd/ns1/image1@snap1``, the source specification can be constructed as below:

```
{
"type": "native",
"pool_name": "rbd",
"pool_namespace": "ns1",
"image_name": "image1",
"snap_name": "snap1"
}
```

2. *QCOW format* is compatible with QEMU Copy-On-Write volume images.

The QCOW format describes a QEMU copy-on-write (QCOW) block device.
QCOW v1 and v2 formats are currently supported, with the exception of
certain features including compression, encryption, backing files, and external
data files. Use the QCOW format with any supported stream source:

```
{
    "type": "qcow",
    "stream": {
      "type": "file",
  "file_path": "/mnt/image.qcow"
    }
}
```

3. *Raw format* is used for thick-provisioned block device exports.

```
{
    "type": "raw",
    "stream": {
      "type": "file",
      "file_path": "/mnt/image-head.raw"
    },
    "snapshots": [
        {
            "type": "raw",
            "name": "snap1",
            "stream": {
              "type": "file",
       "file_path": "/mnt/image-snap1.raw"
            }
        },
    (optional oldest to newest ordering of snapshots)
}
```

### Supported Streams

Multiple stream types are available for importing from various data sources:

#### File Stream (Local files)

Use a ``file`` stream to import from a locally accessible POSIX file source.

```
{
    <format-specific parameters>
    "stream": {
        "type": "file",
        "file_path": "FILE_PATH"
    }
}
```
#### HTTP Stream (remote web server)

Use an ``HTTP`` stream to import from an HTTP or HTTPS web server.

```
{
    <format-specific parameters>
    "stream": {
        "type": "http",
        "url": "URL_PATH"
    }
}
```

#### S3 Stream (AWS or compatible object storage)

Use an ``s3`` stream to import from an S3 bucket.

```
{
    <format-specific parameters>
    "stream": {
        "type": "s3",
        "url": "URL_PATH",
        "access_key": "ACCESS_KEY",
        "secret_key": "SECRET_KEY"
    }
}
```

#### NBD Stream (Network Block Device exports)

Use an ``NBD`` stream to import from a remote NBD export.

```
{
    <format-specific parameters>
    "stream": {
        "type": "nbd",
        "uri": "<nbd-uri>",
    }
}
```

The ``nbd-uri`` parameter must follow the [NBD URI specification](https://github.com/NetworkBlockDevice/nbd/blob/master/doc/uri.md).  The default NBD port is ``tcp/10809``.

### Use Cases of RBD Live Migration

* Disaster Recovery and Data Migration\
_Scenario_: An organization runs mission-critical applications on a primary Ceph cluster
in one data center. Due to an impending maintenance window, potential hardware
failure, or a disaster event, they need to migrate RBD images to a secondary
Ceph cluster in a different location.\
_Benefit_: Live migration ensures that applications using RBD volumes can continue
functioning with minimal downtime and no data loss during the transition to the
secondary cluster.

* Bursting and Workload Distribution\
_Scenario_: An organization operates a Ceph cluster that accommodates routine workloads but
occasionally requires extra capacity during peak usage. By migrating RBD images
to an external Ceph cluster (possibly deployed in a cloud) they can temporarily
scale operations then scale then back.\
_Benefit_: Dynamic workload balancing helps admins leverage external resources
only when needed, reducing operational costs and improving scalability.

* Data Center Migration\
_Scenario_: An organization is migrating infrastructure from one physical data
center to another due to an upgrade, consolidation, or relocation. All RBD images
from the source Ceph cluster need to be moved to a destination Ceph cluster in the
new location.\
_Benefit_: Live migration minimizes disruptions to services during data center
migrations, maintaining application availability.

* Compliance and Data Sovereignty\
_Scenario_: A organization must comply with local data residency regulations that
require sensitive data to be stored within specific geographic boundaries.
Data held in RBD images thus must be migrated from a general-purpose Ceph
cluster to one dedicated to and within the regulated region.\
_Benefit_: The live migration feature enables seamless relocation of RBD data
without halting ongoing operations, ensuring compliance with regulations.

* Multi-Cluster Load and Capacity Balancing\
_Scenario_: An organization runs multiple Ceph clusters to handle high traffic
workloads. To prevent overloading any single cluster, they redistribute
RBD images among clusters as workload patterns shift.\
_Benefit_: Live migration allows for efficient rebalancing of workloads across
Ceph clusters, optimizing resource utilization and performance.

* Dev/Test to Production Migration\
_Scenario_: Developers run test environments on a dedicated Ceph cluster.
After testing is complete, production-ready RBD images can be migrated to the
production Ceph cluster without data duplication or downtime.\
_Benefit_: Simplifies the process of promoting test data to production
while maintaining data integrity.

* Hardware Lifecycle Management\
_Scenario_: A Ceph cluster is running on older hardware that is nearing the end of
its lifecycle. The admin plans to migrate RBD images to a new Ceph cluster
with upgraded hardware for better performance and reliability.\
_Benefit_: Live migration facilitates a smooth transition from legacy to modern
infrastructure without impacting application uptime.\
_Note_: In many situations one can incrementally replace 100% of Ceph cluster
hardware in situ without downtime or migration, but in others it may be
desirable to stand up a new, independent cluster and migrate
data between the two.

* Global Data Replication\
_Scenario_: An enterprise has Ceph clusters distributed across locations
to improve latency for regional end users. RBD images can be migrated
from one region to another based on data center additions or closures,
changes in user traffic patterns, or business priorities.\
_Benefit_: Enhances user experience by moving data closer to the point of
consumption while maintaining data consistency.

### Conclusion

Ceph live migration of RBD images provides a seamless and efficient way to move
storage data and workloads without disrupting operations. By leveraging native
Ceph operations and external stream sources, administrators can ensure smooth
and flexible data migration processes.



The authors would like to thank IBM for supporting the community by through
our time to create these posts.
