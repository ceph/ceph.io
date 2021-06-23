---
title: "New  in Luminous: RADOS improvements"
date: "2017-10-20"
author: "sage"
tags: 
  - "luminous"
---

RADOS is the reliable autonomic distributed object store that underpins Ceph, providing a reliable, highly available, and scalable storage service to other components.  As with every Ceph release, Luminous includes a range of improvements to the RADOS core code (mostly in the OSD and monitor) that benefit all object, block, and file users.

### Parallel monitor hunting

The Ceph monitor cluster is built to function whenever a majority of the monitor daemons are running.  Clients who connect to the cluster--either to do IO or to execute some administrative command via the CLI--must first authenticate with the monitors before performing their function.  The client code is built to be extremely forgiving:

- The monitors can be listed via the _\-m_ command line option, the _mon host_ option in ceph.conf, the _MON\_HOST_ environment variable, or even _SRV_ DNS records
- Monitors can be identified by an IP address or a DNS name.  If a DNS name is used, all A or AAAA records are added to the list of monitors to probe.
- Once any single monitor is reached, the client immediately learns the current set of all monitors.  If the monitor cluster membership changes while the client is connected it will learn about that too.  This means that a client with a stale configuration that only knows about some of the monitors will generally still work, as long as one of the monitors it does know about are reachable.
- If the client is ever disconnected, it goes through a "hunting" sequence probing random monitors it knows about until it can reconnect

The problem previously was that the client would only try one monitor at a time, and would wait 2-3 seconds before trying another one.  If, say, 1 out of your 5 monitors was down, about every 5th command issued via the CLI would start by probing the down monitor and take 2-3 seconds before it tried an active one.

Luminous fixes this by making the clients probe multiple monitors in parallel, and using whichever session is able to connect first.  By default _mon\_client\_hunt\_parallel_ is set to 2, but that can be changed to control the number of sessions we initiate while hunting for a connection.

### Automatic HDD vs SSD tuning

There are dozens of documents floating around with long lists of Ceph configurables that have been tuned for optimal performance on specific hardware or for specific workloads.  In most cases these ceph.conf fragments tend to induce funny looks on developers' faces because the settings being adjusted seem counter-intuitive, unrelated to the performance of the system, and/or outright dangerous.  Our goal is to make Ceph work as well as we can out of the box without requiring any tuning at all, so we are always striving to choose sane defaults.  And generally, we discourage tuning by users. With Luminous we have taken steps to annotate and document the large set of configuration knobs available, and clearly mark settings that should be adjusted as "developer only."  (Expect another blog soon about configuration options and what we have planned there.)

In any case, to make things work out of the box with Luminous, we've added functionality in BlueStore and the OSD code to autodetect whether the underlying device is a spinning hard disk (HDD) or solid state drive (SSD) so that Ceph can automatically use appropriate defaults, without any additional configuration.  BlueStore has a fair number of device-specific defaults, but interestingly we only identified a handful of OSD options that it made sense to adjust.

If you are a Ceph power user and believe there is some setting that you need to change for your environment to get the best performance, please tell us--we'd like to either adjust our defaults so that your change isn't necessary or have a go at convincing you that you shouldn't be tuning that option.

### Client backoff

The OSDs are careful about throttling the amount of incoming client requests that are read off the network and queued to control memory usage (500 MB or 100 messages by default).  This ensures we have work ready to keep the OSD busy but don't waste too much memory.  However, prior to Luminous, we could get into problems when a PG was busy peering, doing recovery, or an object was blocked for some reason (e.g., if it was "unfound" because the latest version was only stored on an OSD that wasn't currently up).  In general Ceph will simply put blocked requests on a waiting list until it is ready to process them.  However, if the PG or object is unavailable for long enough, it's possible to accumulate enough blocked client messages to exhaust the memory limit, preventing the OSD from servicing any requests at all.

This was clearly not good.  With unfound objects the issue was especially frustrating for administrators because the commands needed to revert or remove the unfound object required sending a request to the OSD... which would often not be read or processed by the OSD because of the exhausted memory limit.  The only workaround was to restart the OSD and reissue the administrative command quickly before other clients were able to resend their messages.

Luminous fixes this by extending the RADOS client/OSD protocol to include a "backoff" capability in which the OSD can instruct clients to stop sending requests for either a single PG or object.  Later, when the OSD is ready to process work, clients are unblocked and requests can flow.  The OSD issues backoffs in several different situations (certain peering states and unfound objects being the main ones) where it expects that there will be some delay before it will be able to process requests again.  This keeps OSD resources free for processing requests for other PGs and objects and allows administrators to communicate with the OSD to resolve any issues.

### Asynchronous peering deletes

In most cases, RADOS goes to great lengths to process any unbounded work in an orderly deferred manner.  For example, when an OSD is down for a short while and comes back online, during the "peering" process it builds a list of stale or missing objects (aka the _missing set_) and brings them up to date in the background while still servicing requests on other objects.

There was one case we missed, however: deletes.  If the log of recent operations includes object deletions, those changes were processed synchronously by the peering code, meaning the objects had to be deleted immediately before peering could complete and activate.  The combination of an OSD recovering and peering and a delete-heavy workload were uncommon enough that it took years for us to notice this was actually a problem, but it recently came up under a couple of different workloads.

Luminous finally adjusts the peering and recovery code to process pending deletions asynchronously, the same way it does other object updates.  If you were unlucky enough to encounter this issue (which usually just presents as _very_ slow peering), it should be gone after you upgrade and run 'ceph osd require-osd-release luminous'.

### Large ping messages

Jumbo frames are often the key to achieving high throughput on high-end networking gear and large, high performance clusters.  They are also the bane of Ceph support engineers everywhere who are tasked with explaining why requests mysteriously hang under heavy load.  I cannot count the number of times I'm spent half a day pouring over logs to identify a single blocked TCP stream and had to convince a network engineering team to recheck their switch configurations.  I have no idea why there seem to be so many ways to get jumbo frame configurations wrong, but invariably in these cases turning them off fixes the problem.

One reason why such misconfigurations have historically been hard to catch is that OSDs actually have two TCP connections between each pair of daemons: one for actual work, and one for heartbeat "ping" messages.  When we start loading the cluster and a large packet on the real TCP connect hangs, the heartbeat stream continues to happily pass messages and OSDs don't realize that they can't communicate.

In Luminous, we've changed the "ping" messages to be large by default--around 8 KB--so that they are more likely to fail if switches are having trouble with large packets.  Hopefully this will make these network configuration issues easier to identify!

### Throttle and sleep improvements

Over the last several releases we've added various options to inject a simple delay or sleep into background work activities to limit their impact on system responsiveness.  This has always been viewed as a short-term solution--we really want the system to process background work as quickly as possible, but always (or mostly) prioritize any client requests that come along.  Attention has thus been focused on improving QoS and we've mostly ignored the sleep-based workarounds.

Meanwhile, other OSD refactoring activities have moved most of the background work into the primary work queue (in order to better deprioritize it against client work) where the old sleep workarounds actually made things worse instead of better.  In Luminous, these settings have all been reimplemented to behave appropriately.  We've also set default values for many of them (based on whether the OSD is backed on an SSD or HDD) in order to limit the impact of recovery on client performance. Furthermore, some activities (such as snapshot trimming) have new options for prioritizing their activity against client IO (our preferred solution). Many of these were important enough we also backported them to Jewel point releases.

### Recovery preemption

If an OSD is down for some period and comes back up, the peering process determines either exactly which recently-updated objects are out of date or (if the PG logs aren't long enough) whether a full scan (aka "backfill") is necessary to bring the recovering OSD back into sync.  Since OSDs usually have many PGs that need recovery, each PG is assigned a priority based on how critical its recovery to data safety.  For example, if a PG has only 1 fully complete replica it will get a much higher priority than a PG with 2 complete replicas, and log-based recovery of recent objects will generally be prioritized over backfill because it can complete much sooner.

However, prior to Luminous, once recovery or backfill had started it would run to completion, even another PG with a higher recovery priority appears.  The could lead to instances where PGs needing only a small amount of (high priority) work had to wait extended periods of time for another PG to backfill.  It could even lead to excessive memory use because the blocked PG would be unable to trim older log entries (because the log entries were needed for log-based recovery).

This is fixed in Luminous with recovery preemption, which means that OSDs will always work on recovering the highest priority PG at any point in time.  A side effect of this change is that tunables like _osd max backfills_ (which control how many PGs are recovering in parallel on each OSD) can be adjusted down and the OSD will immediately respond by deferring recovery on some PGs to respect the limit.

### EIO recovery

One side effect of the full data checksums in the new BlueStore backend is that media errors can lead to checksum failures, which now propagate up into the OSD as IO errors (EIO).  This didn't happen as often with FileStore because we didn't have checksum to verify--we would only get such errors if the device itself reported an error.  Returning errors to the client is hardly polite, however--we are, after all, a distributed storage system with built-in redundancy.  Luminous includes a range of improvements in the request handling to initiate automatic repair of such errors when they are encountered by making use of the other replicas or additional erasure coded shards so that the problem is corrected and clients get a correct result.  Errors that cannot be corrected cause the object to be marked unfound by the OSDs, requiring admin intervention.

### RocksDB instead of LevelDB

Both the monitor daemons and the old FileStore OSD backend make use of LevelDB for storing various key/value data.  Overall it has served us pretty well, but for very large leveldb instances--either for monitors with large collections of OSDMaps or OSDs with a lot of key/value object data for RGW indexes--the leveldb compaction has become a serious performance problem.  In some cases, compaction has been unable to keep up with injected updates and the OSD or monitor daemons have gone into a nose-dive.

BlueStore is built around RocksDB, a fork of LevelDB with a broad range of improvements that is extensively used by Facebook and others.  After becoming comfortable with its overall stability we have replaced LevelDB with RocksDB in the monitor and FileStore too and have seen most of these issues disappear.  In fact, it has been such a big enough improvement that we're backporting the RocksDB change to Jewel as well, so that new Jewel OSDs will use it by default.

### Summary

The overall user experience and perceived robustness of complicated systems like Ceph is as much about all of the things that don't go wrong as the things that go right.  It is a little anticlimactic for developers when a subtle issue is fixed because--if we did our jobs right--it is likely nobody will ever notice.  Even the handful of operators who had an unfortunate run-in with the problem on an earlier release may not notice when the same problem doesn't resurface later.  We hope that some of these improvements will resonate with users and give them some insight into the important--but somewhat less glamorous--work that is going on.
