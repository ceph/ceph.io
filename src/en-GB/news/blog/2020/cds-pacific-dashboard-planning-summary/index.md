---
title: 'CDS Pacific: Dashboard planning summary'
date: 2020-04-30
author: Lenz Grimmer
tags:
  - 'dashboard'
  - 'pacific'
---

A few weeks ago, a number of virtual [Ceph Developer Summit](https://pad.ceph.com/p/cds-pacific) meetings took place as a replacement for the in-person summit that was planned as part of Cephalocon in Seoul.

The Ceph Dashboard team also participated in these and held three video conference meetings to lay out our plans for the “Pacific” release. For details, please take a look at our notes at [this Etherpad](https://pad.ceph.com/p/ceph-dashboard-pacific-priorities). Unfortunately we failed to record our first session due to a technical glitch, sorry about that.

We tried to identify a few “themes”, outlining individual tasks which we keep track of in the [bug tracker](https://tracker.ceph.com/). The tracker issues should be used for discussing and defining the tasks at hand.

A key theme for the upcoming Ceph Pacific release is the intention to **further deepen and enhance the integration and support with cephadm** and the orchestrator.

For Ceph octopus, we tried focusing on the most common day-2 operation which is OSD management, but going forward we would like to also support the deployment and management of all other Ceph-related services that can be rolled out via cephadm and the orchestrator.

In a hopefully not so distant future, we would like to be able to use the dashboard as a kind of “graphical installer”, that guides the user through the entire installation deployment process of a Ceph cluster from scratch (well, almost: starting from an initial Mon+Mgr deployment).

Another key theme is **closing feature gaps**: the various services of a Ceph cluster like RBD or RGW are constantly evolving and getting new features, so we always are trying to catch up with the latest developments there.

We’re also looking into **enhancing our monitoring/alerting support** and integration with Grafana and Prometheus.

Last but not least, we always try to **enhance and improve existing functionality** and work on **better usability and user experience**. This also includes bigger refactoring work or updating key components that the dashboard depends on.

As always, we would like the dashboard to be an application that Ceph administrators like and actually want to use to perform their jobs, so we are very keen on getting your feedback here!

If there is anything you are missing or if you find any part of the dashboard to be confusing or not helpful, we’d like to know about it!

Please get in touch with us to share your impressions and ideas. The best way to do this is to join the #ceph-dashboard IRC channel on OFTC or [by filing a bug report](https://tracker.ceph.com/projects/mgr/issues/new) via the tracker.

Thank you!
