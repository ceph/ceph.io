---
title: "Improving Persistent Bucket Notifications Parallelism"

date: 2025-08-20
author: Adarsh Ashokan
tags:
  - ceph
  - rgw
  - notifications
---

## Improving Persistent Bucket Notifications

### Problem at Hand  

Persistent Bucket Notifications were first rolled out in **Ceph Pacific** as part of the **RADOS Gateway (RGW) project**.  
For a good background, see the [existing blog post on ceph.io](https://ceph.io/en/news/blog/2021/persistent-bucket-notifications-deep-dive/).  

In brief, this post deals with **improving the performance** of persistent bucket notifications.  

Currently, the implementation doesn’t fully leverage RADOS’ distributed capabilities. Each topic is tied to a **2 Phase Commit Queue** implemented as a   **single RADOS object**.

This design creates a bottleneck. A **sharded queue implementation** allows notifications to be distributed across multiple RADOS objects, enabling **parallel writes via multiple OSDs**.  

---

### Example  

- Suppose you create **10,000 objects** in a Ceph bucket.  
- In the current design, all `"Object Created"` notifications are directed to a **single queue object**, causing contention on a single OSD.  
- With **sharded topic queues**, notifications are split across multiple queue objects. Multiple OSDs now handle writes in parallel, removing the bottleneck.  

---

### What Was Done  

- In the **old design**, each topic was mapped to **one RADOS object** (one `2pc_cls_queue`).  
- In the **new design**, each topic maps to **multiple RADOS objects** (multiple `2pc_cls_queue` objects).  

Each `2pc_cls_queue` object associated with a topic is called a **shard**.  

The number of shards is configurable via:  

```bash
rgw_bucket_persistent_notif_num_shards
```

- **Default value:** 11  
- **Note:** Existing topics are **not** re-sharded. To extend this feature for existing topics, you must delete and recreate the topic.  

---

### Topic Management  

Topic operations updated to support sharded queues:  

| Operation          | Behavior                                                                 |
|--------------------|---------------------------------------------------------------------------|
| **Create topic**   | Creates multiple `2pc_cls_queue` objects as shards                        |
| **Delete topic**   | Deletes all associated shards                                             |
| **Set topic**      | Supports toggling persistent ↔ non-persistent, with shard cleanup if needed |

---

### Design Details  

#### Enqueue  
- Ordering is guaranteed at the **per-key level** (per object in a bucket).  
- The **target shard** is computed as:  

```
hash("bucket:object") % (# of shards)
```  

- Once computed, the notification is enqueued into the chosen shard (`2pc_cls_queue`).  
  
- The shards for a topic are named as per the follwing convention. 
    - The first shard is just named as `topic_name`. This ensures that old RGW's unaware of shards can still enqueue notifications to a valid queue.
    - The others Shards from 1 to (n - 1) are named as `topic_name.x`, where x is anywhere in `1` and `(n - 1)`.

#### Dequeue  
- Each shard is an independent `2pc_cls_queue`.  
- Each RGW daemon attempts to obtain a lock on a shard.  
- If successful, it dequeues notifications from that shard.  
- No changes were needed here as the shards are still added to the global list of queues.

---

### Other Impacted Areas  

- **Topic dump stats**: Now aggregate across all shards for size and count.  

---

### Limitations & Points to Keep in Mind  

- **Per-key ordering not guaranteed during upgrades** on topics created during upgrades.  
  - In a mixed cluster, older RGWs are unaware of shards and enqueue to a single shard.  

---

### Performance & Stats  

Performance tests were run using the setup described [here](https://gist.github.com/yuvalif/6a320a4254aca2795d117d0a3480c824).  

#### Small Objects (4 KB)  

- **Baseline (no notifications):**  
```
PUT:  542,690 ops (IO/s: 9,044, Lat avg: 7.1 ms)
DEL:  542,690 ops (IO/s: 9,768, Lat avg: 6.5 ms)
```  

- **With notifications, 1 shard (`rgw_bucket_persistent_notif_num_shards=1`):**  
```
PUT:  191,572 ops (IO/s: 3,192, Lat avg: 20.0 ms)
DEL:  191,572 ops (IO/s: 3,204, Lat avg: 20.0 ms)
```  

- **With notifications, 11 shards (default):**  
```
PUT:  363,486 ops (IO/s: 6,057, Lat avg: 10.6 ms)
DEL:  363,486 ops (IO/s: 6,428, Lat avg: 10.0 ms)
```  

- **Existing code (pre-change) ≈ single shard performance.**  

---

#### Medium Objects (4 MB)  

Notification overhead is smaller since notification size (~1 KB) is small relative to object size (4 MB).  

- **Baseline (no notifications):**
```
PUT:  24,034 ops (IO/s: 400, Lat avg: 159.9 ms)
DEL:  24,014 ops (IO/s: 8,862, Lat avg: 7.2 ms)
```  

- **With notifications, 1 shard:**  
```
PUT:  22,167 ops (IO/s: 369, Lat avg: 173.3 ms)
DEL:  22,167 ops (IO/s: 3,027, Lat avg: 21.1 ms)
```  

- **With notifications, 11 shards:**  
```
PUT:  24,848 ops (IO/s: 413, Lat avg: 154.7 ms)
DEL:  24,848 ops (IO/s: 6,342, Lat avg: 10.1 ms)
```  

---