---
title: "Persistent Bucket Notifications Deep Dive"
date: "2021-04-08"
author: "ylifshit"
tags: 
  - "pacific-release"
---

## Reliability

[Persistent bucket notifications](https://docs.ceph.com/en/latest/radosgw/notifications/#notification-reliability) are going to be introduced in Ceph "Pacific". The idea behind them is to allow for reliable and asynchronous delivery of notifications from the RADOS gateway (RGW) to the endpoint configured at the topic. Regular notifications could also be considered reliable since the delivery to the endpoint is performed synchronously during the request.

Regular notifications's reliability comes from the RGW. For example, the client will not get an ACK until the ACK is received from the endpoint. However, if the endpoint in unreliable, the solution will not be reliable either. For example, the client will not retry if the endpoint is offline.

Also, note that, with regular notifications, if the endpoint sends back a NACK, the operation is still considered successful (since there is no way to roll back the RADOS operations that happened before the notification was tried).

When the endpoint is down, but only indication for it is that notification times out; using regular notifications will slow down the operation of the RGW and may bring it to a complete halt.

With persistent notifications, we allow the RGW to retry sending notifications even if the endpoint is down or a network disconnect with it happened during the operation (i.e., notifications are retried if not successfully delivered to the endpoint).

During the asynchronous operation, the notifications are pushed into a queue (see below). The queuing operation is done in 2 phases (**reserve** and **commit** or **abort**) to guarantee the atomicity of the queuing operation with the other operations.

| Type | RGW Failure | Endpoint Failure | Atomic Operation | Synchronous Operation |
| --- | --- | --- | --- | --- |
| **Regular** | yes | no | no | yes |
| **Persistent** | yes | yes | yes^ | no |

^ as mentioned below, the **commit** may still fail even if **reserve** was successful

## [2 Phase Commit](https://en.wikipedia.org/wiki/Two-phase_commit_protocol) Queue

We use a persistent (RADOS backed), bounded, 2 phase commit queue to store notifications. This is implemented via the [`2pc_cls_queue`](https://github.com/ceph/ceph/tree/master/src/cls/2pc_queue) Ceph [object class](https://docs.ceph.com/en/latest/rados/api/objclass-sdk/).

Sending to this queue will be done in 2 steps:

1. **reserve** a spot for the notification on the queue. If the queue is complete (e.g., endpoints are down, and we have too many pending notifications in the queue), the reservation would fail, which would fail the operation on the RGW.

\> Note: The reservation should be performed before any RADOS operations are done, so no rollback is needed).

2. Perform the actual operation of the RGW. /and either **commit** or **abort** the reservation. If any of the operations failed, we would **abort** the reservation. If all were successful, we will **commit** the reservation, pushing the notification to the queue.

\> Notes: > 1. Old reservations are cleaned up automatically if, for some reason (e.g., RGW crashed after **reserve** and before **commit**/**abort**) they were not aborted explicitly. > 2. Even though it is unlikely, the **commit** operation may also fail, but in this case, we cannot roll back the RADOS operations, so we will not fail the entire operation but would instead log the error.

Asynchronously, one of the RGWs (not necessarily the one that pushed the notification into the queue) will **list** the notification in the queue and send these notifications to the endpoint. Once the endpoint ACKs the notifications, we **remove** them from the queue. Notifications that are not ACKed will remain in the queue and will be retried the next time the queue is processed. Both the **list** and **remove** operations are made in batches, which means that once we receive a NACK from the endpoint, only the notifications that were already ACKed will be removed others will remain.

## Topics and Queues

Every time a persistent bucket notification topic is [created](https://docs.ceph.com/en/latest/radosgw/notifications/#create-a-topic), a matching queue (with the same name) will be created as well. The queue is a RADOS object that belongs to the "notif" namespace in the "log" pool.

Having a separate queue for each endpoint allows for the isolation of problems between the endpoints. For example, one endpoint which is down may fill up its queue but will not impact other queues.

\> Note: Since the notifications are usually negligible in size when compared to the actual objects and are written every time an object is written or deleted, it is recommended that the "log" pool would be on fast media and could be smaller than the pools on which the objects are located

In addition to the queue object, there will be one global object named "queues\_list\_object" holding the list of all queues; the system uses this object to distribute the queue processing ownership between the different rows. For example, if we created two persistent topics in our cluster, one called "fishtopic" and the other "dogtopic" we would see:

```bash
# rados -p default.rgw.log -N notif ls
fishtopic
queues_list_object
dogtopic
```

Deletion of the queue (with all of its pending notifications) is done via [deletion of the topic](https://docs.ceph.com/en/latest/radosgw/notifications/#delete-topic).

In many cases, notifications from multiple sources can share the same topic even if a single bucket generates notifications for a topic. [Deleting the notification](https://docs.ceph.com/en/latest/radosgw/s3/bucketops/#delete-notification) definition or the bucket would prevent new notifications from being pushed to that queue but would not delete the queue with any pending notifications.

## Queue Ownership

Any RGW can push notifications to any queue (queues are RADOS objects that allow multiple concurrent writers). However, to prevent duplicate notifications and guarantee processing in case of RGW failures on the other, every queue is owned by a single RGW at any point in time.

Ownership is implemented via the [lock](https://github.com/ceph/ceph/tree/master/src/cls/lock) Ceph object class.

Every 30 seconds, each RGW go through the list of queues from the "queues\_list\_object" and try to **lock** them elusively:

- If this RGW already locked the queue, it will **renew** it
- If another RGW locks the queue, it will do nothing with it
- If any RGW does not lock the queue, it will **lock** it and start processing on it. This can happen when a new topic is added, or when an RGW goes down and does not **renew** its locks for 90 seconds (this is to make sure that ownership is transferred only when the RGW is down) > The name of the lock will be similar to the name of the queue, with "\_lock" suffix

To see the queue's ownership, execute the following command:

```bash
# rados -p default.rgw.log -N notif lock info fishtopic fishtopic_lock
{"name":"fishtopic_lock","type":"exclusive","tag":"","lockers":[{"name":"client.4137","cookie":"gEToHBoc635RTGPp","description":"","expiration":"2021-03-16T18:58:11.244676+0200","addr":"10.46.11.34:0/4074536612"}]}
```

This output indicates which RGW owns the lock and if it has renewed every 30 seconds.

Multiple rows may reside on the same host (with the same IP), but they would be distinguished using their nonce (the number of the slash in the "addr" field). This unique address is found in the RGW log file (when the `debug-ms` flag is set).
