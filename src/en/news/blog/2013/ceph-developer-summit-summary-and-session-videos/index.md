---
title: "Ceph Developer Summit – Summary and Session Videos"
date: "2013-05-09"
author: "scuttlemonkey"
tags: 
---

Contents

1. [Introduction](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/)
2. [Opening Remarks](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#opening_remarks)
3. [Morning Sessions](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#morning_sessions)

1. [Ceph Management API](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#api)
2. [Erasure Encoding as a Storage Backend](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#erasure)
3. [RGW Geo-Replication and Disaster Recovery](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#geo)

5. [Afternoon Sessions](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#afternoon_sessions)

1. [RADOS Gateway refactor into library, internal APIs](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#rgw_refactor)
2. [Chef Cookbook Consolidation & ceph-deploy Improvements](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#chef)
3. [Enforced bucket-level quotas in RGW](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#quotas)
4. [Testing, build/release & Teuthology](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#testing)
5. [Client Security for CephFS](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#cephfs_security)
6. [RADOS namespaces, CRUSH language extension, CRUSH library](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#rados_namespaces)
7. [Inline Data Support](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#inline_data)
8. [Ceph stats and monitoring tools](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#stats)
9. [Fallocate/Hole Punching](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#fallocate)
10. [A hook framework for CephFS operation](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#hook)

7. [Conclusion](http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/#conclusion)

### Introduction

This week marked the very first [Ceph Developer Summit](http://wiki.ceph.com/01Planning/Developer_Summit) where the community gathered to discuss development efforts focused on the next stable release ‘Dumpling.’ There was quite a turnout for such a boutique event! We hit over 50 concurrent participants in the live video stream and had almost 400 unique visitors to the relatively new [Ceph wiki](http://wiki.ceph.com/) during that window. Participants included folks from all over the world:

- United States
- China
- Germany
- France
- United Kingdom
- Phillippines
- India
- Australia
- Belgium
- Netherlands
- Portugal

There was a ton of work proposed by the community, and almost all of it was accepted and discussed for inclusion in Dumpling. We were incredibly pleased with both the turn-out, and the general caliber of the participants. Having an awesome community makes it really easy to stay excited about what we do.

Below you will find each of the session videos split out with a brief description and links to the blueprint, etherpad, and irc logs as they appeared during the session. The original [summit page](http://wiki.ceph.com/01Planning/Developer_Summit) has also been updated with the appropriate links for posterity. We plan to leave these pages up in order to give people the ability to look back at Ceph development as far as possible. If you have questions or feedback, please email the [community team](mailto:community@inktank.com).

We will be doing a developer summit for each stable release (quarterly) so if you are interested in participating feel free to [post a blueprint](http://wiki.ceph.com/01Planning/02Blueprints) on the wiki for consideration. The sessions for each developer summit are selected directly from submitted blueprints.

If you are interested in contributing to Ceph on a smaller scale feel free to dive right in, clone our [github repository](https://github.com/ceph/ceph) and submit a pull request for any changes you make.

Now, on to the summit!

### Opening Remarks

<iframe width="560" height="315" src="http://www.youtube.com/embed/88mCRhjdgBU" frameborder="0" allowfullscreen></iframe>

\[ [Etherpad](http://wiki.ceph.com/01Planning/Developer_Summit/Etherpad_Snapshots/1A%3A_Welcome,_Introduction,_and_Housekeeping) \] \[ [IRC Logs](http://wiki.ceph.com/01Planning/Developer_Summit/CDS_Chat_Logs/1A%3A_Welcome,_Introduction,_and_Housekeeping) \]

Sage kicked off the event [with a few slides](https://dl.dropboxusercontent.com/u/6302680/Ceph%20Developer%20Summit%20-%20Welcome.pdf) that offered a summary of the event, how Cuttlefish development went, and what the next steps were. This event actually marks the first time we have promoted an open roadmap discussion and really pushed for community participation. The event was entirely virtual so some discussion of the tools was in order, explaining how we planned to run the event.

- **Google Hangouts** – The video conferencing setup was broadcast using Google Hangout. This meant we had a small pool of dedicated participant on camera and the larger community watching via a live YouTube stream and commenting via irc.
- **Ceph Wiki** – Leading up to the event users were able to submit blueprints for proposed work to the Ceph wiki. This allowed everyone to have a clear idea of what was being discussed, and how the author proposed to get there.
- **Etherpad** – Each session had an associated etherpad for collaborative note taking during the session. This allowed us to capture architectural decisions, issues, work items, and other notes during the sessions.
- **IRC** – Each track had its own logged IRC channel for discussion. This allowed asyncronous discussion, offsite-links, and questions to the “speakers” in a format that could be logged and posted for later consumption.

The goal of this event was ultimately to make sure that all proposed development work for Dumpling was viable, coordinated, and appropriately understood. Blueprint ownership was established, implementation questions were discussed, and next steps were established. Inktank folks really want to make sure the community has all the tools at their disposal to participate fully and are happy to act as a resource for anyone pushing code to the main repository.

### Morning Sessions

There were actually quite a few sessions for such a small event. Thirteen blueprints were discussed in total. Inktank shared the work they are planning to contribute to the Dumpling release. This work includes geo-replication, a management API, RBD support for OpenStack Havana, and several others. The community contributed plans for many things including a modularization of the RADOS gateway, Ceph stats and reporting work, erasure encoding, and inline data support to name a few. Read below for a quick summary of each session and the associated video, irc chatlog, and etherpad.

* * *

#### Ceph Management API

<iframe width="420" height="315" src="http://www.youtube.com/embed/Ayr0sSJSWcM" frameborder="0" allowfullscreen></iframe>

\[ [Blueprint](http://wiki.ceph.com/01Planning/02Blueprints/Dumpling/Ceph_management_API) \] \[ [Etherpad](http://wiki.ceph.com/01Planning/Developer_Summit/Etherpad_Snapshots/1B%3A_Ceph_Management_API) \] \[ [IRC Log](http://wiki.ceph.com/01Planning/Developer_Summit/CDS_Chat_Logs/1B%3A_Ceph_Management_API) \]

Inktank’s Dan Mick kicked off the first session with an overview of Inktank’s plans for building a management API that will provide a RESTful endpoint to performan monitoring and management tasks. The goal here is to allow complete integration into whatever management tool or dashboard that is desired. Specific use case examples might be inclusion in OpenStack Horizon or a similar technology.

* * *

#### Erasure Encoding as a Storage Backend

<iframe width="420" height="315" src="http://www.youtube.com/embed/G2Xgf0Pt2rs" frameborder="0" allowfullscreen></iframe>

\[ [Blueprint](http://wiki.ceph.com/01Planning/02Blueprints/Dumpling/Erasure_encoding_as_a_storage_backend) \] \[ [Etherpad](http://pad.ceph.com/p/Erasure_encoding_as_a_storage_backend) \] \[ [IRC Log](http://wiki.ceph.com/01Planning/Developer_Summit/CDS_Chat_Logs/1C%3A_Erasure_Encoding_as_a_Storage_Backend) \]

Loic Dachary and Christopher Liljenstolpe jointly kicked off the next session with an ambitious look at erasure encoding.

> “For a class of users, there is a requirement for very durable data, but the cost of meeting that durability by using xN replication becomes cost prohibitive if the size of the data to be stored is large. An example usecase where this is an issue is genomic data. By using a 3x replication, a 20PB genomic repository requires spinning 60+PB of disk. However, the other features of ceph are very attractive (such as using a common storage infrastructure for objects, blocks, and filesystems, CRUSH, self-healing infrastructure, non-disruptive scaling, etc.”

* * *

#### RGW Geo-Replication and Disaster Recovery

<iframe width="420" height="315" src="http://www.youtube.com/embed/DH42dB6cbu8" frameborder="0" allowfullscreen></iframe>

\[ [Blueprint](http://wiki.ceph.com/01Planning/02Blueprints/Dumpling/RGW_Geo-Replication_and_Disaster_Recovery) \] \[ [Etherpad](http://wiki.ceph.com/01Planning/Developer_Summit/Etherpad_Snapshots/1C%3A_Erasure_Encoding_as_a_Storage_Backend) \] \[ [IRC Log](http://wiki.ceph.com/01Planning/Developer_Summit/CDS_Chat_Logs/1D%3A_RGW_Geo-Replication_and_Disaster_Recovery) \]

Inktank’s Yehuda Sadeh led the next session which discussed the work he is doing with the RADOS Gateway (RGW) for the purposes of geo-replication. The current Ceph model expects a high-bandwidth, low latency connection between all nodes. This makes WAN scale replication impractical. This session showed how Inktank plans to take the first pass at geo-replication for disaster recovery and geographic eventual consistancy using RGW.

* * *

### Afternoon Sessions

The afternoon tracks were designed to be small, concentrated sessions and were split into two tracks. Track 1 saw more RGW discussion, CephFS security, inline data support, and fallocate/hole punching. Track 2 saw discussions on orchestration, testing, stats and monitoring, RADOS namespaces, and a hook framework for Ceph FS.

* * *

#### RADOS Gateway refactor into library, internal APIs

<iframe width="420" height="315" src="http://www.youtube.com/embed/9ijjC7JlzZM" frameborder="0" allowfullscreen></iframe>

\[ [Blueprint](http://wiki.ceph.com/01Planning/02Blueprints/Dumpling/RADOS_Gateway_refactor_into_library,_internal_APIs) \] \[ [Etherpad](http://wiki.ceph.com/01Planning/Developer_Summit/Etherpad_Snapshots/1E%3A_RADOS_Gateway_refactor_into_library,_internal_APIs) \] \[ [IRC Log](http://wiki.ceph.com/01Planning/Developer_Summit/CDS_Chat_Logs/1E%3A_RADOS_Gateway_refactor_into_library,_internal_APIs) \]

42on founder Wido den Hollander is championing the efforts behind moving the RADOS Gateway (RGW) out of the core code and making it more modular. This would allow for a number of improvements to flexibility and the ability to stand up RGW without FastCGI and Apache being quite so required.

* * *

#### Chef Cookbook Consolidation & ceph-deploy Improvements

<iframe width="420" height="315" src="http://www.youtube.com/embed/5nb8jZHAeNs" frameborder="0" allowfullscreen></iframe>

\[ No Blueprint \] \[ [Etherpad](http://wiki.ceph.com/index.php?title=01Planning/Developer_Summit/Etherpad_Snapshots/2E:_Chef_Cookbook_Consolidation_&_ceph-deploy_Improvements) \] \[ [IRC Log](http://wiki.ceph.com/index.php?title=01Planning/Developer_Summit/CDS_Chat_Logs/2E:_Chef_Cookbook_Consolidation_&_ceph-deploy_Improvements) \]

While there was no blueprint for this session, Inktank’s Alexandre Marangone and Dan Mick hosted a session to talk about some of the orchestration work including consolidating the Chef recipes and some of the work that has been done on ceph-deploy. Discussions included many orchestration tools that Ceph is currently deployed with including Juju, Salt, Puppet, and others. The focus was how deployment went from ceph-deploy -> chef and how this could be scaled to others.

* * *

#### Enforced bucket-level quotas in RGW

<iframe width="420" height="315" src="http://www.youtube.com/embed/V8cnRdnrIjg" frameborder="0" allowfullscreen></iframe>

\[ [Blueprint](http://wiki.ceph.com/01Planning/02Blueprints/Dumpling/Enforced_bucket-level_quotas_in_the_Ceph_Object_Gateway) \] \[ [Etherpad](http://wiki.ceph.com/01Planning/Developer_Summit/Etherpad_Snapshots/1F%3A_Enforced_bucket-level_quotas_in_RGW) \] \[ [IRC Log](http://wiki.ceph.com/01Planning/Developer_Summit/CDS_Chat_Logs/1F%3A_Enforced_bucket-level_quotas_in_RGW) \]

Inktank’s Yehuda Sadeh made another appearance to discuss the feasibility of bucket-level quotas in the Ceph Object Gateway. The focus here is how to simplify, optimize, and ensure accurate record keeping across multiple gateways without incurring huge overhead costs.

* * *

#### Testing, build/release, & Teuthology

<iframe width="420" height="315" src="http://www.youtube.com/embed/sO5ww4lgdEk" frameborder="0" allowfullscreen></iframe>

\[ No Blueprint \] \[ [Etherpad](http://wiki.ceph.com/index.php?title=01Planning/Developer_Summit/Etherpad_Snapshots/2F:_Testing,_build//release_&_Teuthology) \] \[ [IRC Log](http://wiki.ceph.com/index.php?title=01Planning/Developer_Summit/CDS_Chat_Logs/2F:_Testing,_build//release_&_Teuthology) \]

Sage took the helm for another blueprint-less session to discuss how to build and test Ceph automatically using the Teuthology framework and how this framework could evolve. Work items coming out of this session include the creation of a large cluster test suite, a qemu gitbuilder, performance regressions, possible chart.io graphs, and several others.

* * *

#### Client Security for CephFS

<iframe width="420" height="315" src="http://www.youtube.com/embed/AL5h4W9ne74" frameborder="0" allowfullscreen></iframe>

\[ [Blueprint](http://wiki.ceph.com/01Planning/02Blueprints/Dumpling/Client_Security_for_CephFS) \] \[ [Etherpad](http://wiki.ceph.com/01Planning/Developer_Summit/Etherpad_Snapshots/1G%3A_Client_Security_for_CephFS) \] \[ [IRC Log](http://wiki.ceph.com/01Planning/Developer_Summit/CDS_Chat_Logs/1G%3A_Client_Security_for_CephFS) \]

Currently access to CephFS is somewhat of an “all or nothing” model. Several folks were interesting in more robust security measures being built in for user- and/or tree-level security. Mike Kelly was leading the charge on tackling this issue and may end up combining some of the RADOS namespace discussion with his solution.

* * *

#### RADOS namespaces, CRUSH language extension, CRUSH library

<iframe src="http://www.youtube.com/embed/rbVFozB9qls" frameborder="0" width="560" height="315"></iframe>

\[ [Blueprint 1](http://wiki.ceph.com/01Planning/02Blueprints/Dumpling/rados_namespaces), [Blueprint 2](http://wiki.ceph.com/01Planning/02Blueprints/Dumpling/extend_crush_rule_language), [Blueprint 3](http://wiki.ceph.com/01Planning/02Blueprints/Dumpling/create_crush_library) \] \[ [Etherpad](http://wiki.ceph.com/01Planning/Developer_Summit/Etherpad_Snapshots/2G%3A_RADOS_namespaces,_CRUSH_language_extension,_CRUSH_library) \] \[ [IRC Log](http://wiki.ceph.com/01Planning/Developer_Summit/CDS_Chat_Logs/2G%3A_RADOS_namespaces,_CRUSH_language_extension,_CRUSH_library) \]

Sage tackled several blueprints at once with this session that included deep-level discussion on both RADOS and CRUSH. The focus was on extending both to be able to handle new or more complex tasks.

* * *

#### Inline Data Support

<iframe width="560" height="315" src="http://www.youtube.com/embed/C1fpJeqTTmI" frameborder="0" allowfullscreen></iframe>

\[ [Blueprint](http://wiki.ceph.com/01Planning/02Blueprints/Dumpling/Inline_data_support_for_Ceph) \] \[ [Etherpad](http://wiki.ceph.com/01Planning/Developer_Summit/Etherpad_Snapshots/1H%3A_Inline_data_support) \] \[ [IRC Log](http://wiki.ceph.com/01Planning/Developer_Summit/CDS_Chat_Logs/1H%3A_Inline_data_support) \]

NUDT’s Li Wang has stepped up to tackle inline data support. The hope here is to allow a mount option to store metadata as an extended attribute for each file.

> “Inline data is a good feature for accelerating small file access, which is present in mainstream local file systems, for example, ext4, btrfs etc. It should be beneficial to let Ceph implement this optimization, since it could save the client the calculation of object location and communication with the OSDs. It hopefully will receive a good IO speedup for small files traffic.
> 
> For a typical Ceph file access traffic, client first asks mds for metadata, then communicates with osd for file data. If a file is very small, its data can be stored together with the metadata, as an extended attribute. While opening a small file, osd will receive file metadata as well as data from mds, the calculation of object location as well as communication with osd are saved.”

* * *

#### Ceph stats and monitoring tools

<iframe width="420" height="315" src="http://www.youtube.com/embed/-xp2VMjycJE" frameborder="0" allowfullscreen></iframe>

\[ [Blueprint](http://wiki.ceph.com/01Planning/02Blueprints/Dumpling/ceph_stats_and_monitoring_tools) \] \[ [Etherpad](http://wiki.ceph.com/01Planning/Developer_Summit/Etherpad_Snapshots/2H%3A_Ceph_stats_and_monitoring_tools) \] \[ [IRC Log](http://wiki.ceph.com/01Planning/Developer_Summit/CDS_Chat_Logs/2H%3A_Ceph_stats_and_monitoring_tools) \]

While Ceph tracks some things internally it also exposes a wealth of knowledge that can be assimilated by other tools. Dreamhost’s Kyle Bader discussed some of the work that they have been doing with tools like graphite and nagios and how some of this data can be shared with the community. The hope is to create some shared community knowledge around monitoring and stats for a Ceph cluster.

* * *

#### Fallocate/Hole Punching

<iframe width="560" height="315" src="http://www.youtube.com/embed/w8YEFyBYTW8" frameborder="0" allowfullscreen></iframe>

\[ [Blueprint](http://wiki.ceph.com/01Planning/02Blueprints/Dumpling/Fallocate//Hole_Punching_Support_for_Ceph) \] \[ [Etherpad](http://wiki.ceph.com/01Planning/Developer_Summit/Etherpad_Snapshots/1I%3A_Fallocate//Hole_Punching) \] \[ [IRC Log](http://wiki.ceph.com/01Planning/Developer_Summit/CDS_Chat_Logs/1I%3A_Fallocate//Hole_Punching) \]

NUDT’s Li Wang took the reins for another session to talk about how to implement hole punching. This was a relatively short discussion since this should be a relatively small change.

* * *

#### A hook framework for CephFS operation

<iframe width="420" height="315" src="http://www.youtube.com/embed/x6Y1nxZ4Yag" frameborder="0" allowfullscreen></iframe>

\[ [Blueprint](http://wiki.ceph.com/01Planning/02Blueprints/Dumpling/A_hook_framework_for_Ceph_FS_operation) \] \[ [Etherpad](http://wiki.ceph.com/01Planning/Developer_Summit/Etherpad_Snapshots/2I%3A_A_hook_framework_for_Ceph_FS_operation) \] \[ [IRC Log](http://wiki.ceph.com/01Planning/Developer_Summit/CDS_Chat_Logs/2I%3A_A_hook_framework_for_Ceph_FS_operation) \]

In the last session of the day, UCSC’s Yasuhiro Ohara presented a proposal for a hook framework that would enable execution of callback functions for CephFS operations. There was quite a bit of discussion around implementation decisions of fork/exec vs something a bit less heavyweight.

* * *

### Conclusion

While there were a few technical hiccups using the Google hangouts, overall it was a great event with some amazing community participation. Now that the implementation decisions and next steps have been established, the development begins! Each of these blueprints is designed to be a living doc with notes, updates, and tasks recorded as needed. If you are interested in participating in an existing blueprint or future development please contact the owner or the [community team](mailto:community@inktank.com) and get started! Thanks again to everyone who participated and helped make this a great first Ceph Developer Summit.

scuttlemonkey out

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/events/ceph-developer-summit-summary-and-session-videos/&bvt=rss&p=wordpress)
