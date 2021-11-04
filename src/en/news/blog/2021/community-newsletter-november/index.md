---
title: Ceph Community Newsletter November 2021 Edition
date: 2021-11-04
author: Mike Perez (thingee)
image: "./images/octo.jpg"
tags:
  - newsletter
---

## Sage Weil Steps Back From Leadership

Sage Weil, the creator of Ceph, is stepping back from his leadership role after 17 years. Sage will contribute as a developer for the short term but plans to leave Red Hat in December.

Sage took time off in 2020 during the Pacific development cycle. The release was still a success with the Ceph Leadership Team sharing responsibilities.

The Ceph leadership team has been working on governance changes to support the transition and responsibilities Sage held. One crucial difference is introducing the Ceph Executive Council. The council comprises 3 or 5 people to help with consensus on decisions, distributing Sage's responsibilities, and ensuring things get done. The first elected members of the council will be Josh Durgin, Neha Ojha, and Dan van der Ster. Governance structure changes are in discussion in a [pull request](https://github.com/ceph/ceph/pull/43567/files).

## Urgent Release Bugs

There have recently been a couple of severe bugs discovered in the Pacific release. Igor Fedotov provides a more detailed explanation of the [ceph-users mailing list](https://lists.ceph.io/hyperkitty/list/ceph-users@ceph.io/thread/U4QX4E32BR5IOICOUW4FR7E56YEET3CN/). Igor also reports another issue where [Bug #53139](https://tracker.ceph.com/issues/53139), where an OSD might wrongly attempt to use a "slow" device when a single device is backing the store. Upgrade recommendations for these particular issues are available in [Ceph documentation](https://docs.ceph.com/en/latest/releases/pacific/#upgrading-from-octopus-or-nautilus).

## Introducing the Ceph Community Ambassador Team

The [Ceph Community Ambassador team](ceph.io/en/community/ambassadors/) comprises community managers supporting communities in their region. Here are some things the ambassadors can help with:

- Help organize Ceph Days or assist organizers.
- Help Ceph [meetups](https://tracker.ceph.com/projects/ceph/wiki/Meetups) find speakers/sponsors and provide swag.
- Provide content for the Ceph blog (e.g., tutorials, meetup outcomes).
- Help with finding content for [Ceph Tech Talks](https://ceph.io/en/community/tech-talks) and [Code Walkthroughs](https://tracker.ceph.com/projects/ceph/wiki/Code_Walkthroughs).
- Promote Ceph on social media channels.
- Collect knowledge from local communities to inspire future activities and priorities.

The first meeting took place on October 18 at 6:00 UTC, in which the group has plans to see which Ceph meetups in their regions are still active and need assistance.

Chris Ballnath is planning a Ceph meetup at either end of November or early December in Munich. Look for promotions of the event [@Ceph](https://twitter.com/ceph) twitter and the [Ceph users mailing list](https://lists.ceph.io/postorius/lists/ceph-users.ceph.io/).

We're still looking for more people who can join the team to support more regions. Meetings will be announced on the Ceph mailing list and are open to everyone.

## Ceph Blog

[Ceph Pacific:Exploiting Prometheus data from the CLI](https://ceph.io/en/news/blog/2021/pacific-cli-monitoring/)

[Welcoming OSNexus to the Ceph Foundation](https://ceph.io/en/news/blog/2021/welcoming-osnexus-to-the-ceph-foundation/)

[Visual Regression Testing of Ceph Dashboard](https://ceph.io/en/news/blog/2021/visual-regression-testing-ceph-dashboard/)

[Reporting Ceph issues from Ceph CLI and GUI](https://ceph.io/en/news/blog/2021/reporting-ceph-issues-from-ceph-cli-and-gui/)

[Ceph Pacific:Detecting Configuration Anomalies](https://ceph.io/en/news/blog/2021/pacific-configuration-checks/)

[Welcoming Linode to the Ceph Foundation](https://ceph.io/en/news/blog/2021/welcoming-linode-to-the-ceph-foundation/)

[Ceph Pacific Usability: Advanced Installation](https://ceph.io/en/news/blog/2021/pacific-usability-advanced-install/)

## Notable Ceph Youtube Channel Videos

[Ceph Developer Monthly 2021-10-06](https://www.youtube.com/watch?v=eVrimCfFtms)

[Ceph Developer Monthly 2021-11-03](https://www.youtube.com/watch?v=Y7jrix5NBr8)

[Ceph Code Walkthroughs](https://tracker.ceph.com/projects/ceph/wiki/Code_Walkthroughs)

- [CRUSH](https://www.youtube.com/watch?v=M7yyfUoYw2I&list=PLrBUGiINAakN87iSX3gXOXSU3EB8Y1JLd)
- [Paddles](https://www.youtube.com/watch?v=BdpyHG1xk6I&list=PLrBUGiINAakN87iSX3gXOXSU3EB8Y1JLd&index=1)
- [BlueStore SMR](https://www.youtube.com/watch?v=nQS5OWOL1nM&list=PLrBUGiINAakN87iSX3gXOXSU3EB8Y1JLd&index=3)
- [RGW Bucket Notifications with AMQA/Kafka](https://www.youtube.com/watch?v=hMaw_bxAc-I&list=PLrBUGiINAakN87iSX3gXOXSU3EB8Y1JLd&index=4)

[CephFS Code Walkthroughs](https://tracker.ceph.com/projects/ceph/wiki/CephFS_Code_Walkthroughs)

- [MDS Journal Machinery](https://www.youtube.com/watch?v=yB5JvIvZ764&list=PLrBUGiINAakOXvawFetHtUGYi2HlK6HGE&index=1)
- [MDS Locker, Part 1](https://www.youtube.com/watch?v=jkWJ6x_Bz-s&list=PLrBUGiINAakOXvawFetHtUGYi2HlK6HGE&index=2)
- [MDS path traversal](https://www.youtube.com/watch?v=dYJ84qpR0kY&list=PLrBUGiINAakOXvawFetHtUGYi2HlK6HGE&index=3)

[Find more Ceph videos on the Youtube Channel!](https://www.youtube.com/channel/UCno-Fry25FJ7B4RycCxOtfw)

## Release Notes

[V15.2.15 Octopus](https://ceph.io/en/news/blog/2021/v15-2-15-octopus-released/)

[V16.2.6 Pacific](https://ceph.io/en/news/blog/2021/v16-2-6-pacific-released/)
