---
title: "Understanding BlueStore, Ceph’s New Storage Backend"
date: "2017-09-04"
author: "admin"
tags: 
  - "planet"
---

On June 1, 2017 I presented [Understanding BlueStore, Ceph’s New Storage Backend](http://ourobengr.com/wp-uploads/2017/07/Understanding-BlueStore-Cephs-New-Storage-Backend.pdf) at [OpenStack Australia Day Melbourne](http://australiaday.openstack.org.au/). As the video is up (and [Luminous is out](http://ceph.com/releases/v12-2-0-luminous-released/)!), I thought I’d take the opportunity to share it, and write up the questions I was asked at the end.

First, here’s the video:

The bit at the start where the audio cut out was me asking “Who’s familiar with Ceph?” At this point, most of the 70-odd people in the room put their hands up. I continued with “OK, so for the two people who _aren’t_…” then went into the introduction.

After the talk we had a Q&A session, which I’ve paraphrased and generally cleaned up here.

_With BlueStore, can you still easily look at the objects like you can through the filesystem when you’re using FileStore?_

There’s not a regular filesystem anymore, so you can’t just browse through it. However you can use \``ceph-objectstore-tool`\` to “mount” a offline OSD’s data via FUSE and poke around that way. Some more information about this can be found in Sage’s Weil’s recent blog post: [New in Luminous: BlueStore](http://ceph.com/community/new-luminous-bluestore/).

_Do you have real life experience with BlueStore for how IOPS performance scales?_

We (SUSE) haven’t released performance numbers yet, so I will instead refer you to [Sage Weil’s slides](http://events.linuxfoundation.org/sites/events/files/slides/20170323%20bluestore.pdf) from Vault 2017, and [Allan Samuel’s slides](https://www.socallinuxexpo.org/sites/default/files/presentations/allen-samuels-Scale%2015x.pdf) from SCALE 15x, which together include a variety of performance graphs for different IO patterns and sizes. Also, you can expect to see more about this on [the Ceph blog](http://ceph.com/community/blog/) in the coming weeks.

_What kind of stress testing has been done for corruption in BlueStore?_

It’s well understood by everybody that it’s sort of important to stress test these things and that people really do care if their data goes away. Ceph has a huge battery of [integration tests](http://docs.ceph.com/docs/master/dev/#testing-integration-tests), various of which are run on a regular basis in the upstream labs against Ceph’s master and stable branches, others of which are run less frequently as needed. The various downstreams all also run independent testing and QA.

_Wouldn’t it have made sense to try to enhance existing POSIX filesystems such as XFS, to make them do what Ceph needs?_

Long answer: POSIX filesystems still need to provide POSIX semantics. Changing the way things work (or adding extensions to do what Ceph needs) in, say, XFS, assuming it’s possible at all, would be a big, long, scary, probably painful project.

Short answer: it’s really a different use case; better to build a storage engine that fits the use case, that shoehorn in one that doesn’t.  

Best answer: go read [New in Luminous: BlueStore](http://ceph.com/community/new-luminous-bluestore/) ;-)

Source: Tim Serong ([Understanding BlueStore, Ceph’s New Storage Backend](http://ourobengr.com/2017/09/understanding-bluestore/))
