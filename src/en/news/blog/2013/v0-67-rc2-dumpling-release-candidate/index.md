---
title: "v0.67-rc2 Dumpling release candidate"
date: "2013-07-25"
author: "sage"
tags: 
---

Hi everyone,

We have a release candidate for v0.67 Dumpling! There are a handful of remaining known issues (which I suppose means it is technically \*not\* an actual candidate for the final release), but for the most part we are happy with the stability so far, and encourage anyone with test clusters to give it a try.

Known issues include:

- There is a known performance regression due to non-optimal tuning values for the writeback throttling. We are still playing with the numbers to get good results across all workloads, but do not be surprised if you see throughput drop slightly with -rc2.
- The metadata sync agent for multi-region radosgw clusters is not quite ready yet.
- Creating swift containers in the non-master region does not work; fix is already in next.

The v0.67-rc2 release candidate packages are available from:

- [http://ceph.com/debian-testing/](http://ceph.com/debian-testing/)
- [http://ceph.com/rpm-testing/](http://ceph.com/rpm-testing/)

Note that at any time you can move from this -rc to the latest pre-dumpling code by switching to the ‘next’ branch, available at

- http://gitbuilder.ceph.com/ceph-deb-$distro-x86\_64-basic/ref/next/

for example,

- [http://gitbuilder.ceph.com/ceph-deb-precise-x86\_64-basic/ref/next/](http://gitbuilder.ceph.com/ceph-deb-precise-x86_64-basic/ref/next/)

The draft release notes for v0.67 dumpling are at

- [http://ceph.com/docs/master/release-notes/](http://ceph.com/docs/master/release-notes/)

You can see our bug queue at

- [http://tracker.ceph.com/projects/ceph/issues?query\_id=27](http://tracker.ceph.com/projects/ceph/issues?query_id=27)

Note that ‘Pending backport’ means it is fixed in next but the cuttlefish backport has not landed yet. Also note that the kernel bugs (kcephfs, krbd) are not related to the dumpling release.

Happy testing!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-67-rc2-dumpling-release-candidate/&bvt=rss&p=wordpress)
