---
title: "VM live migration across the globe with Ceph and Openstack"
date: "2017-06-08"
author: "admin"
tags: 
  - "planet"
---

Have you ever been in a situation where you had to migrate a VMs across the globe with minimum downtime? VM live migration across Openstack regions.

### Classic approach

The volume import/export capabilities of Openstack are limited, therefore the classic approach is to turn off the VM, copy it to the destination, then attach the volume to a VM in the new region. It works but the VM is down during the transfer and it could mean days of downtime for your application.

That translates in the following Openstack commands:

```
DST_REGION=RegionTwo
VOL_SIZE=100
# Stop the VM for safety
openstack server stop myserver
# Send the VM snapshot into glance
openstack image create --volume myvolume mysnapshot
# Pipe the glance image into the DST_REGION
glance image-download mysnapshot | glance --os-region-name "$DST_REGION" image-upload --name mysnapshot
# Switch to destination region for all further commands
export OS_REGION_NAME="$DST_REGION"
# Create volume
openstack volume create --image mysnapshot --size $VOL_SIZE myvolume
# Boot new server in DST_REGION
openstack server create --flavor m1.small --image mybaseimage myserver
# Attach the volume to the new VM
openstack server add volume myserver myvolume
```

This technique is using exclusively the Openstack API but requires downtime during the transfer.

### Here comes Ceph

Ceph’s snapshot feature allows this type of migration to be handled like VM live migrations:

1. Take a live snapshot of the volume
2. Transfer the snapshot (many GBs)
3. Stop the original VM
4. Transfer the changes since the snapshot (few MBs)
5. Attach volume and start the VM

```
# Set source region variables
SRC_REGION=RegionOne
SRC_POOL=volumes
SRC_SERVER=src-server
SRC_VOL_ID=00000000-1111-2222-3333-4444444444444

# Set destination region variables
DST_REGION=RegionTwo
DST_POOL=volumes
DST_SERVER=dst-server

# Keep the volume size and name handy
VOL_SIZE=$(openstack volume show $SRC_VOL_ID --format value --column size)
VOL_NAME=$(openstack volume show $SRC_VOL_ID --format value --column name)

# Take a snapshot of volume and keep snapshot ID
SRC_SNAP_ID=$(openstack --os-region-name "$SRC_REGION" snapshot create testrbd --name testsnapshot --force --format value --column id)

# Create volume in destination region and keep its ID
DST_VOL_ID=$(openstack --os-region-name "$DST_REGION" volume create --size $VOL_SIZE --name $VOL_NAME --format value --column id)
ceph-dst:~# rbd rm $DST_POOL/volume-$DST_VOL_ID

# export | import of the snapshot with an SSH pipe for data transfer
ceph-src:~# rbd export $SRC_POOL/volume-$SRC_VOL_ID@snapshot-$SRC_SNAP_ID - | ssh ceph-dst rbd --image-format 2 import - $DST_POOL/volume-$DST_VOL_ID
```

The export-import can take a long time (hours or days) but since the VM is still running in the source region there is no downtime during the transfer time. Also note that the data transfer is encrypted by SSH in this example.

Once the base snapshot is imported to its destination, we can start with the incremental:

```
# Unmount the file system on the volume (downtime starts)
src-server:~# umount /path/to/mount/point
ceph-src:~# openstack server remove volume $SRC_SERVER $SRC_VOL_ID

# Create a matching snapshot in the destination region
ceph-dst:~# rbd snap create $DST_POOL/volume-$DST_VOL_ID@snapshot-$SRC_SNAP_ID

# Then export-diff | import-diff the delta between current state and base snapshot
ceph-src:~# rbd export-diff --from-snap snapshot-$SRC_SNAP_ID $SRC_POOL/volume-$SRC_VOL_ID - | ssh ceph-dst rbd import-diff - $DST_POOL/volume-$DST_VOL_ID

# Clean up the temporary snapshot
ceph-dst:~# rbd snap rm $DST_POOL/volume-$DST_VOL_ID@snapshot-$SRC_SNAP_ID

# Attach volume to destination VM and mount the file system (downtime ends)
ceph-dst:~# openstack server add volume $DST_SERVER $DST_VOL_ID
dst-server:~# mount /dev/disk/by-id/virtio-${DST_VOL_ID:0:20} /path/to/mount/point
```

# To summarize

This example demonstrate how to get it going with 1 incremental iteration for simplicity, but you might repeat the `export-diff | import-diff` a couple of times to reduce the downtime to **less than 10 seconds**. This type of live volume migration is great tool to critical move VMs accross continents.

Source: Maxime Guyot ([VM live migration across the globe with Ceph and Openstack](http://www.root314.com/ceph/2017/06/08/VM-live-migration-across-the-globe-with-Ceph-and-Openstack/))
