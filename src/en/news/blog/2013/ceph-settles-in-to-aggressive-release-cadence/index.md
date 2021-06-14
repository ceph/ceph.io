---
title: "Ceph Settles in to Aggressive Release Cadence"
date: "2013-03-12"
author: "scuttlemonkey"
tags: 
  - "planet"
---

Since its inception, Ceph has always had a fast-paced rolling release tempo. However, with the amount of adoption that Ceph has had over the last year (including continued integration work with several other open source projects), we wanted to move to a more reliable, and predictable, release schedule.

The release schedule can be divided into four different flavors: point releases, development (interim) releases, stable releases, and long term support (LTS) releases. You can expect these releases to appears on the following periodic schedule:

- Point Releases — ad hoc
- Interim Releases — every 2 weeks
- Stable Releases — every 3 months
- LTS Releases — coming soon!

### Point Releases

Point releases are generated on an ad hoc basis for the purposes of critical bug or security fixes. We currently only generate point releases on stable releases for a period of 3-6 months, though this may become longer for certain versions included in downstream distros. Since they are only generated on an as-needed basis they will be commicated via all blog, mailing list, and social media channels as appropriate.

### Interim Releases

Every two weeks (approximately) you can expect the latest development work to be aggregated and made available to the community. We wanted a very aggressive schedule here to make sure that everyone building things with, or associated with, Ceph had access to the latest and greatest work by the core Ceph developers. Primarily what you will see in these releases will be bug fixes, patches, and smaller feature additions. Larger features may appear in an interim release, however that feature should not be considered production ready until the next stable release.

These announcements will appear on the [blog](http://ceph.com/community/blog/), and the ceph-devel mailing list with a release number and a summary of changes. Keep your eyes peeled!

### Stable Releases

Given the amount of work that has gone into the testing and QA procedures, stable releases can be done on a much more reliable (and frequent!) basis. Much of this work has been directed at our primary testing tool, [Teuthology](https://github.com/ceph/teuthology). Originally written as a “test my nightlies” kind of tool, it has been updated to run installations as a task, run longer term testing (instead of just compile-type tests), include more distro-specific testing, and allow for a wider range of testing parameters.

Given the amount of crossover between Inktank and Ceph development it’s also worth noting that Inktank’s testing lab has grown from 160-ish machines to around 286 machines. That plus the amount of rigorous testing we see from the Ceph community means that releases will be put through a lot more paces to be considered “stable” and will have a more traditional feature freeze, QA period, and release candidate lifecycle. The dates of this lifecycle should be available soon via a new Ceph wiki to give upstream users more visibility.

Stable releases will include larger feature changes, bug fixes, and stability from much more exhaustive testing. These releases will function as a “roll up” of all interim releases since the last stable version and where new features that have been added can be considered production-ready. These releases will be featured in our [blog](http://ceph.com/community/blog/), mailing lists, as well as being featured on Ceph.com in our [Downloads](http://ceph.com/resources/downloads/) resource section. Each stable release will have a name associated with a different type of cephalopod corresponding to the appropriate letter of release (“stable” releases thusfar: argonaut, bobtail).

### LTS Releases

Given the pace of development, the incredibly wide-range of use cases Ceph is being thrown at, and especially the amount of change in the CephFS portion of Ceph, we don’t feel that having LTS releases quite makes sense yet. However, all of the work above is laying a very solid groundwork for us to make LTS guarantees in the very near future. Of course we’ll be able to get there even faster with your help!

### Getting Involved

The more testing and bug reports we see from the community the more sure we’ll be that all angles possible are being considered and tested for, and the sooner we’ll be able to start making even more guarantees than we do now. A great example of this would be relatively new committer, [Loic Dachary](https://github.com/dachary) who has done a bunch of great work around building out unit tests. We love it when new users show up and become prolific, and would love to help anyone interested in contributing, to succeed.

There are a number of different ways that users can get involved, from writing code to just running a test cluster on the latest-and-greatest code and everything in between! If you are interested in lending a hand, feel free to drop us a note via our [mailing lists or IRC](http://ceph.com/resources/mailing-list-irc/).

### Conclusion

While this may seem like minor news, we’re quite excited by the ramifications of what this means for Ceph. We are very happy with how production clusters have been performing and want to ensure that all of our users, from vast enterprise deployments down to a single 5-minute quickstart, are able to expect a high degree of stability and reliability going forward. The level of community support for testing and development has been amazing, so we also would like to thank all of our contributors, testers, and users for their insight and bug reports! Happy Ceph-ing.

scuttlemonkey out

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/ceph-settles-in-to-aggressive-release-cadence/&bvt=rss&p=wordpress)
