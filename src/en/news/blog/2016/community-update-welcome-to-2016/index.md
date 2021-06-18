---
title: "Community Update: Welcome to 2016!"
date: "2016-01-14"
author: "scuttlemonkey"
---

It has been quite a while since a coordinated Ceph update has made it to the Ceph blog, so I figured it was time to gather all of the various threads and make sure they were in a single place for consumption.

Quite a lot is happening in the Ceph world and, depending on what part of the project you are involved with, there is more than likely to be a place for you to deepen your engagement with the community. So, let's do the highlight reel:

## Sepia Lab / Testing Resources

For those of you following along at home, all of the hardware that used to live in our Irvine, CA data center has been migrated to the big RDU2 Community Cage in Raleigh, NC. This includes a bunch of our old testing machines (minus the old leased Dell hardware which has expired), the Intel performance cluster, and 60 new Supermicro systems with NVMe drives. It's all very exciting for us given some of the testing backlog that we are still fighting against. If you are interested in utilizing the Sepia lab resources, a good place to start is the [Sepia Github](http://ceph.github.io/sepia/) page.

In addition to our own community lab, we are also continuing to work with Ceph Advisory Board and community members to fully utilize the [OpenStack integration](http://dachary.org/?p=3828) with our Teuthology system that was rolled out last year by our own Loic Dachary. This integration allows a user to plug in an OpenStack endpoint and user credentials to have Teuthology automate a large swath of the testing workload and gather the results. Anyone that is able to do this, I highly encourage you to do so to help move the burden of testing to a more distributed format.

If you would like more information on either of these resources, feel free to reach out to the ceph-user list or to [community@ceph.com](mailto:community@ceph.com).

## Ceph Tech Talks

The monthly [Ceph Tech Talk](http://ceph.com/ceph-tech-talks/) program is starting back up again now that the holiday season is behind us. This program helps to elevate the level of technical knowledge in the community by bringing experts and experienced users in front of the community to present their recent work and offer themselves up for questions. These virtual meetings are usually help on the 4th Thursday of the month at 1p EST via our BlueJeans teleconferencing system.

The next two months worth of content are already scheduled. This month we're kicking off with a bang as Thorvald Natvig gives us a rundown of his work on "PostgreSQL on Ceph under Mesos/Aurora with Docker," and next month our own John Spray will be giving a technical update of CephFS as we get ready to release Jewel, and the first version of Ceph where CephFS is included in the major release. We are always looking for interesting topics to share with the community though. So, if you have some recent work that you think might be of-interest to a larger audience, please [contact me](mailto:pmcgarry@redhat.com) directly.

## Ceph Days

The [Ceph Day program](http://ceph.com/cephdays/) in 2016 will be getting off to a slightly later start, but there will be no shortage of quality regional events. We will be leading off strong with a dual Ceph Day / Hackathon event in the San Francisco Bay Area. Yahoo has agreed to host the Ceph Day on 30 Mar, and Samsung will be hosting a 2 day hackathon/design session on 31 Mar-01 Apr. The big event in April will be the OpenStack conference in Austin, TX, so we're not planning a Ceph Day. The other two currently confirmed events will be at Intel's Hillsboro, OR (just outside Portland) facility on 25 May, and 14 June will find us at CERN in Switzerland.

If you would like to sponsor a Ceph Day, or have a venue that you would like to offer up please feel free to [contact me](mailto:pmcgarry@redhat.com) for more details.

## Ceph.com

As many of you have noted, Ceph.com is showing its age a bit. With this (and many of the broken parts of the page) in mind, we have just kicked off the design of a brand new Ceph.com that should be far easier to navigate and offer a more up-to-date look at what's going on in the world of Ceph. We plan on putting early concepts and builds out to the community, so stay tuned on the ceph-user mailing list if you would like to preview the work there.

## Ceph-Brag

Another long-requested feature for the Ceph community is a repository of Ceph performance results that users can sift and filter to help their planning for the future, as well as the fun of seeing what other people are able to squeeze out of their clusters. This work is currently ongoing and we are expecting to see some early results as soon as February of this year.

This project would utilize github as a central repository of submissions that could be reviewed and curated for later inclusion on a revamped [metrics.ceph.com](http://metrics.ceph.com). If you would like to be involved in this project feel free to attend Mark Nelson's [weekly performance call](http://pad.ceph.com/p/performance_weekly) (Wednesday @ 8am PST, recordings included on the link), or [reach out to me](mailto:pmcgarry@redhat.com) directly.

## Ceph Developer Summit (CDS)

In the past, we have always held a CDS around the time that a major release is headed out the door (ex: Jewel planning as Infernalis is released). This has always had a few drawbacks:

- Interferes with testing and cleanup time from engineers
- Any gap between release and CDS is time spent without clarity
- As release timelines stretch out a bit, the community is less in-touch with what is going on

So, we have decided to decouple CDS and the release schedule in one of two ways:

1. Quarterly CDS cadence (virtual), push for a "Cephalocon" face-to-face event in 2017
2. Monthly open development "stand-ups" (virtual), and push for a face-to-face event later this year

Current discussions have #2 as the leading candidate, but I'm open to any suggestions/feedback/requests that you may have. I'm guessing that we'll still have a CDS event in March, as Jewel slides out the door, before switching to either of these events.

## Red Hat Summit

While there will be many events that have Ceph content this year, I wanted to highlight that quite a bit of Ceph content is being gathered and distilled for the Red Hat Summit this June (28-30) in San Francisco. If you haven't already made plans, I would highly recommend trying to make this a stop on your travel plans. If you have any questions, please feel free to [contact me](mailto:pmcgarry@redhat.com).

As you can see, there is quite a lot going on in the Ceph ecosystem, even beyond the massive amounts of work hitting the code repos and testing pipelines. Feel free to reach out to us with any questions that you might have. Thanks, and here is to another amazing year of Ceph and the Future of Storage!

scuttlemonkey out
