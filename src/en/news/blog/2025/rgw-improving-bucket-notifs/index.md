---
title: "Improving Persistent Bucket Notifications Parallelism"

date: 2025-08-20
author: Adarsh Ashokan
tags:
  - ceph
  - rgw
  - notifications
---

## Improving Persistent Bucket Notifications Parallelism

### Problem at Hand  

Persistent Bucket Notifications were first rolled out in Ceph Pacific as part of the RADOS Gateway (RGW) project.  
For a good background, see the [existing blog post on ceph.io](https://ceph.io/en/news/blog/2021/persistent-bucket-notifications-deep-dive/).  

In brief, this post deals with improving the performance of persistent bucket notifications.  

Currently, the implementation doesn’t fully leverage RADOS’ distributed capabilities. Each topic is tied to a 2 Phase Commit Queue implemented as a   single RADOS object.

This design creates a bottleneck. A sharded queue implementation allows notifications to be distributed across multiple RADOS objects, enabling parallel writes via multiple OSDs.  

---

<!-- ### Example  

- Suppose you create 10,000 objects in a Ceph bucket.  
- In the current design, all `"Object Created"` notifications are directed to a single queue object, causing contention on a single OSD.  
- With sharded topic queues, notifications are split across multiple queue objects. Multiple OSDs now handle writes in parallel, removing the bottleneck.  

--- -->

### What Was Done  

- In the old design, each topic was mapped to one RADOS object (one 2-Phase Commit Queue).  
- In the new design, each topic maps to multiple RADOS objects (multiple 2-Phase Commit Queue objects).  

Each 2-phase commit queue RADOS object associated with a topic is called a shard.  

The number of shards is configurable via the `rgw_bucket_persistent_notif_num_shards` central configuration option.

- Default value: 11  
- Note: Existing topics are not re-sharded. To extend this feature for existing topics, you must delete and recreate the topic.  

---

### Topic Management  

Topic operations updated to support sharded queues:  

| Operation    | Behavior                                                                    |
| ------------ | --------------------------------------------------------------------------- |
| Create topic | Creates multiple RADOS objects as shards                                    |
| Delete topic | Deletes all associated shards                                               |
| Set topic    | Supports toggling persistent ↔ non-persistent, with shard cleanup if needed |

---

### Design Details  

#### Enqueue  
- Ordering is guaranteed at the per-key level (per object in a bucket).  
- The target shard is computed using the following formula:  

```
hash("bucket:object") % (# of shards)
```  

- Once computed, the notification is enqueued into the chosen shard.  
  
- The shards for a topic are named as per the following convention. 
    - The first shard just named `topic_name`. This ensures that old RGW instances unaware of shards can still enqueue notifications to a valid queue.
    - The other shards from 1 to (n - 1) are named as `topic_name.x`, where x is between `1` and `(n-1)`.
  
Admins can verify the shards created in the RADOS object pool using the `rados ls` command. 

```bash
##inside /build dir
bin/rados -c ceph.conf ls --pool default.rgw.log --namespace notif
```

##### Example

```bash
### create a persistent topic called fishtopic
$ bin/rados -c ceph.conf ls --pool default.rgw.log --namespace notif | grep fishtopic
:fishtopic.7
:fishtopic.5
:fishtopic.2
:fishtopic.10
:fishtopic.1
:fishtopic.4
:fishtopic.8
:fishtopic
:fishtopic.3
:fishtopic.6
:fishtopic.9
```

Note: `:fishtopic` is the name of the first shard to support backward compatibility and clusters having RGWs of different versions.

#### Dequeue   
- The key difference is that in the sharded setup, each shard is treated as an independent queue, which can be processed by a different RGW. This enables better load balancing across RGWs, even when the number of topics is small.
---

### Other Impacted Areas  

- Topic dump stats: This command now aggregates across all shards of a topic to determine size and count.  

---

### Limitations & Points to Keep in Mind  

- Per-key ordering is not guaranteed during upgrades on topics created during upgrades.  
  - In a mixed cluster, older RGWs are unaware of shards and enqueue to the first shard always.  

---

### Benchmarking Setup 

Performance tests were run on the following machine using the setup described below.

* Machine specifications

```
 lsblk
NAME           MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda              8:0    0 893.8G  0 disk
└─sda1           8:1    0 893.7G  0 part /
nvme1n1        259:0    0   1.5T  0 disk
nvme0n1        259:1    0   1.5T  0 disk
├─vg_nvme-lv_1 253:0    0  89.4G  0 lvm
├─vg_nvme-lv_2 253:1    0  89.4G  0 lvm
├─vg_nvme-lv_3 253:2    0  89.4G  0 lvm
├─vg_nvme-lv_4 253:3    0  89.4G  0 lvm
└─vg_nvme-lv_5 253:4    0  14.9G  0 lvm  /var/lib/ceph
nvme3n1        259:2    0   1.5T  0 disk
nvme4n1        259:3    0   1.5T  0 disk
nvme2n1        259:4    0   1.5T  0 disk
nvme6n1        259:5    0   1.5T  0 disk
nvme5n1        259:6    0   1.5T  0 disk
nvme7n1        259:7    0   1.5T  0 disk
```
* Cluster Setup using `vstart` for baseline notification setup - `rgw_bucket_persistent_notif_num_shards` set to 1.
  
```
sudo MON=1 OSD=2 MDS=0 MGR=0 RGW=1 ../src/vstart.sh -n -X --nolockdep --bluestore \
    -o "rgw_bucket_persistent_notif_num_shards=1" \
    --bluestore-devs "/dev/nvme7n1,/dev/nvme6n1,/dev/nvme5n1,/dev/nvme4n1,/dev/nvme3n1,/dev/nvme2n1" \
    -o "bluestore_block_size=1500000000000" -o "rgw_max_concurrent_requests=8192" \
    -o "rgw_dynamic_resharding=false" -o "osd_pool_default_pg_num=128" -o "osd_pool_default_pgp_num=128" \
    -o "mon_max_pg_per_osd=32768" -o "mon_pg_warn_max_per_osd=32768" -o "osd_pool_default_pg_autoscale_mode=warn"
```

* Setting up persistent notifications

```
aws --region=default --endpoint-url http://localhost:8000 sns create-topic --name=fishtopic0  \
  --attributes='{"push-endpoint": "kafka://localhost", "persistent": "true"}'
aws --region=default --endpoint-url http://localhost:8000 s3api put-bucket-notification-configuration \
  --bucket bk000000000000 --notification-configuration='{"TopicConfigurations": [{"Id": "notif1", "TopicArn": "arn:aws:sns:default::fishtopic0", "Events": []}]}'
```


* Now change `rgw_bucket_persistent_notif_num_shards`
to 11 under `build` dir.

```
bin/ceph config set client.rgw.8000 rgw_bucket_persistent_notif_num_shards 11 --conf /ceph.conf
```

* Create a new topic and notification for this setting.

```
aws --region=default --endpoint-url http://localhost:8000 sns create-topic --name=fishtopic1  \
  --attributes='{"push-endpoint": "kafka://localhost", "persistent": "true"}'
aws --region=default --endpoint-url http://localhost:8000 s3api put-bucket-notification-configuration \
  --bucket bk000000000000 --notification-configuration='{"TopicConfigurations": [{"Id": "notif1", "TopicArn": "arn:aws:sns:default::fishtopic1", "Events": []}]}'
```

* Compare results of this run where `rgw_bucket_persistent_notif_num_shards` is set to default (i.e, 11) with baseline performance.

### Performance Stats

#### Small Objects (4 KB)  

- No notifications :  
```
PUT:  542,690 ops (IO/s: 9,044, Lat avg: 7.1 ms)
DEL:  542,690 ops (IO/s: 9,768, Lat avg: 6.5 ms)
```  

- With notifications, 1 shard (`rgw_bucket_persistent_notif_num_shards=1`):  
```
PUT:  191,572 ops (IO/s: 3,192, Lat avg: 20.0 ms)
DEL:  191,572 ops (IO/s: 3,204, Lat avg: 20.0 ms)
```  

- With notifications, 11 shards (default):  
```
PUT:  363,486 ops (IO/s: 6,057, Lat avg: 10.6 ms)
DEL:  363,486 ops (IO/s: 6,428, Lat avg: 10.0 ms)
```  

- Existing code (pre-change) ≈ single shard performance.  

---

#### Medium Objects (4 MB)  

Notification overhead is smaller since notification size (~1 KB) is small relative to object size (4 MB).  

- No notifications :
```
PUT:  24,034 ops (IO/s: 400, Lat avg: 159.9 ms)
DEL:  24,014 ops (IO/s: 8,862, Lat avg: 7.2 ms)
```  

- With notifications, 1 shard:  
```
PUT:  22,167 ops (IO/s: 369, Lat avg: 173.3 ms)
DEL:  22,167 ops (IO/s: 3,027, Lat avg: 21.1 ms)
```  

- With notifications, 11 shards:  
```
PUT:  24,848 ops (IO/s: 413, Lat avg: 154.7 ms)
DEL:  24,848 ops (IO/s: 6,342, Lat avg: 10.1 ms)
```  

---