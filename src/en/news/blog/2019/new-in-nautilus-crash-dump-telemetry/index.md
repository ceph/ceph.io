---
title: "New in Nautilus: crash dump telemetry"
date: "2019-04-30"
author: "sage"
tags: 
  - "nautilus"
---

When Ceph daemons encounter software bugs, unexpected state, failed assertions, or other exceptional cases, they dump a stack trace and recently internal log activity to their log file in `/var/log/ceph`. On modern systems, systemd will restart the daemon and life will go on--often without the cluster administrator even realizing that there was a problem. This is partly a good thing (Ceph is robust to failures!) and a bad thing (problems often go unnoticed).

Nautilus improves this situation by adding the concept of a _crash dump_ that summarizes all relevant information about the failure, tracking failures centrally so that an administrator can easily see any crashes happening across the cluster, and incorporating crash dumps with the telemetry function so that (if the administrator opts-in) failures can be automatically reported back to Ceph developers.

## Crash dumps

Software faults still result in a stack trace and other information being appended to the daemon's log.  In addition, a new sub-directory is created in `/var/log/ceph/crash` with a unique identifier for the crash, and relevant information about the fault is recorded there.  That includes

- the unique crash identifier
- daemon name and type
- Ceph version
- kernel version and Linux distribution
- a full stack trace
- metadata about the failed assertion (file name, function name, line number, failed condition), if appropriate
- metadata about an IO error (device name, type of IO operation that failed, offset and length if known), if appropriate
- a dump of recent debug log entries

A helper utility called `ceph-crash` runs periodically on any hosts where Ceph daemons are installed (by default, every 10 minutes) and will report any new crash reports back to the cluster.

Reported crashes can be queried via the new `ceph crash ls` and `ceph crash info` commands. For example, here are some crashes we encountered while testing a release candidate for Nautilus:

> $ ceph crash ls
> ...
> 2019-03-15\_21:19:19.614860Z\_8d2a8acb-694d-4a5b-a8d1-c9f3ce2bd90a osd.144
> 2019-03-15\_21:19:37.584082Z\_253ece02-e4fe-4af4-ae1e-f273bf30fcee osd.144
> 2019-03-15\_21:25:19.262250Z\_16dbfbd1-6811-4754-95ca-983a2896981a osd.144
> 2019-03-15\_21:26:44.778675Z\_e4ac09ae-e080-46a0-80d9-8427aeebb90b osd.144
> $ ceph crash info 2019-03-15\_21:26:44.778675Z\_e4ac09ae-e080-46a0-80d9-8427aeebb90b
> {
>     "crash\_id": "2019-03-15\_21:26:44.778675Z\_e4ac09ae-e080-46a0-80d9-8427aeebb90b",
>     "timestamp": "2019-03-15 21:26:44.778675Z",
>     "process\_name": "ceph-osd",
>     "entity\_name": "osd.144",
>     "ceph\_version": "14.1.1-185-ga144a88",
>     "utsname\_hostname": "reesi006.front.sepia.ceph.com",
>     "utsname\_sysname": "Linux",
>     "utsname\_release": "4.4.0-112-generic",
>     "utsname\_version": "#135-Ubuntu SMP Fri Jan 19 11:48:36 UTC 2018",
>     "utsname\_machine": "x86\_64",
>     "os\_name": "Ubuntu",
>     "os\_id": "ubuntu",
>     "os\_version\_id": "16.04",
>     "os\_version": "16.04.4 LTS (Xenial Xerus)",
>     "assert\_condition": "info.history.same\_interval\_since != 0",
>     "assert\_func": "void PG::start\_peering\_interval(OSDMapRef, const std::vector&, int, const std::vector&, int, ObjectStore::Transaction\*)",
>     "assert\_file": "/build/ceph-14.1.1-185-ga144a88/src/osd/PG.cc",
>     "assert\_line": 6222,
>     "assert\_thread\_name": "tp\_osd\_tp",
>     "assert\_msg": "/build/ceph-14.1.1-185-ga144a88/src/osd/PG.cc: In function 'void PG::start\_peering\_interval(OSDMapRef, const std::vector&, int, const std::vector&, int, ObjectStore::Transaction\*)' thread 7f9907e66700 time 2019-03-15 21:26:44.762873\\n/build/ceph-14.1.1-185-ga144a88/src/osd/PG.cc: 6222: FAILED ceph\_assert(info.history.same\_interval\_since != 0)\\n",
>     "backtrace": \[
>         "(()+0x11390) \[0x7f9928728390\]",
>         "(gsignal()+0x38) \[0x7f9927c53428\]",
>         "(abort()+0x16a) \[0x7f9927c5502a\]",
>         "(ceph::\_\_ceph\_assert\_fail(char const\*, char const\*, int, char const\*)+0x1a3) \[0x84fced\]",
>         "(ceph::\_\_ceph\_assertf\_fail(char const\*, char const\*, int, char const\*, char const\*, ...)+0) \[0x84fe77\]",
>         "(PG::start\_peering\_interval(std::shared\_ptr, std::vector<int, std::allocator > const&, int, std::vector<int, std::allocator > const&, int, ObjectStore::Transaction\*)+0x1607) \[0xa48997\]",
>         "(PG::RecoveryState::Reset::react(PG::AdvMap const&)+0x1bb) \[0xa4c2cb\]",
>         "(boost::statechart::simple\_state<PG::RecoveryState::Reset, PG::RecoveryState::RecoveryMachine, boost::mpl::list<mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na, mpl\_::na>, (boost::statechart::history\_mode)0>::react\_impl(boost::statechart::event\_base const&, void const\*)+0x140) \[0xaaf150\]",
>         "(boost::statechart::state\_machine<PG::RecoveryState::RecoveryMachine, PG::RecoveryState::Initial, std::allocator, boost::statechart::null\_exception\_translator>::process\_queued\_events()+0xb3) \[0xa81a13\]",
>         "(PG::handle\_advance\_map(std::shared\_ptr, std::shared\_ptr, std::vector<int, std::allocator >&, int, std::vector<int, std::allocator >&, int, PG::RecoveryCtx\*)+0x27b) \[0xa4b49b\]",
>         "(OSD::advance\_pg(unsigned int, PG\*, ThreadPool::TPHandle&, PG::RecoveryCtx\*)+0x2d1) \[0x9aa6f1\]",
>         "(OSD::dequeue\_peering\_evt(OSDShard\*, PG\*, std::shared\_ptr, ThreadPool::TPHandle&)+0xa6) \[0x9ac046\]",
>         "(PGPeeringItem::run(OSD\*, OSDShard\*, boost::intrusive\_ptr&, ThreadPool::TPHandle&)+0x50) \[0xc2e420\]",
>         "(OSD::ShardedOpWQ::\_process(unsigned int, ceph::heartbeat\_handle\_d\*)+0xbed) \[0x9a028d\]",
>         "(ShardedThreadPool::shardedthreadpool\_worker(unsigned int)+0x4ac) \[0xfc0dfc\]",
>         "(ShardedThreadPool::WorkThreadSharded::entry()+0x10) \[0xfc3fb0\]",
>         "(()+0x76ba) \[0x7f992871e6ba\]",
>         "(clone()+0x6d) \[0x7f9927d2541d\]"
>     \]
> }

Failures that generate crash dumps include:

- failed developer assertions, indicating that the code has encountered an unexpected or exception situation, as in the example above
- Segmentation faults, usually indicating a software bug, or occasionally memory corruption caused by faulty hardware
- unhandled IO errors when reading or writing to a storage device that cannot be transparently masked by the software

## Telemetry

The ability to opt-in to reporting high-level, anonymized telemetry about a Ceph cluster to upstream Ceph developers was introduced in the Mimic release.  In Nautilus, we have made several improvements to the feature and expanded telemetry to include crash reports in the cluster. This feature allows developers to get timely and automatic feedback from deployed Ceph clusters when crashes are encountered, along with important information like stack traces, build versions, and OS details.

The crash dumps are reported in their entirety (see example above) with the exception of the `utsname_hostname` field, which is removed to protect privacy [as of 14.2.1](https://github.com/ceph/ceph/pull/27709/commits/8928ef1071c357b424b4ee54e033a257c9b54a81) (and being scrubbed from incoming reports on the server side).

We strongly encourage Ceph users to enable this feature as this information is extremely valuable to the developer community.  It will help us identify problems early, without relying on users submitting bug reports, and provide information about the _frequency_ that problems occur so that bugs can be better prioritized.

To see what information the telemetry module shares (without actually enabling the feature),

> $ ceph mgr module telemetry
> $ ceph mgr telemetry show

If you are satisfied that there is no sensitive information being shared, you can enable automatic telemetry reports with

> $ ceph telemetry on

You can optionally include additional information in your reports, like a cluster description and contact information:

> $ ceph config set mgr mgr/telemetry/contact 'Sage Weil <sage@newdream.net>'
> $ ceph config set mgr mgr/telemetry/description 'My test cluster'
> $ ceph config set mgr mgr/telemetry/organization 'ceph.io'

You can view the current status of the telemetry module, including whether it is enabled and how frequently reports are submitted, with

> $ ceph telemetry status
> {
>     "url": "https://telemetry.ceph.com/report",
>     "enabled": true,
>     "leaderboard": false,
>     "description": "My test cluster",
>     "contact": "Sage Weil <sage@newdream.net>",
>     "organization": "ceph.io",
>     "proxy": null,
>     "interval": 72
> }

## Next steps

At the moment, telemetry and crash reports are being dumped into an ElasticSearch database.  We are in the process of setting up some basic reporting and query infrastructure that will enable Ceph developers with access to browse and query reports.  Our hope is that we'll soon be able to identify common faults across multiple crash reports and link them to bugs in the [tracker](https://tracker.ceph.com), and easily see relevant information like the frequency of crashes across different Ceph versions.
