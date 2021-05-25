---
title: "Distributed Storage is Easier Now: Usability from Ceph Luminous to Nautilus"
date: "2019-01-29"
author: "admin"
tags: 
  - "planet"
---

On January 21, 2019 I presented [Distributed Storage is Easier Now: Usability from Ceph Luminous to Nautilus](https://tserong.github.io/lca2019-ceph-usability/) at the [linux.conf.au 2019](https://lca2019.linux.org.au/) [Systems Administration Miniconf](http://sysadmin.miniconf.org/programme19.html). Thanks to the incredible [Next Day Video](http://www.nextdayvideo.com/) crew, the video was online the next day, and you can watch it here:

If you’d rather read than watch, the meat of the talk follows, but before we get to that I have two important announcements:

1. [Cephalocon 2019](https://ceph.com/cephalocon/barcelona-2019/) is coming up on May 19-20, in Barcelona, Spain. The CFP is open until Friday February 1, so time is rapidly running out for submissions. Get onto it.
2. If you’re able to make it to FOSDEM on February 2-3, there’s a whole [Software Defined Storage Developer Room](https://fosdem.org/2019/schedule/track/software_defined_storage/) thing going on, with loads of excellent content including [What’s new in Ceph Nautilus – project status update and preview of the coming release](https://fosdem.org/2019/schedule/event/ceph_project_status_update/) and [Managing and Monitoring Ceph with the Ceph Manager Dashboard](https://fosdem.org/2019/schedule/event/ceph_manager_dashboard/), which will cover rather more than I was able to here.

Back to the talk. At [linux.conf.au 2018](https://lca2018.linux.org.au/), Sage Weil presented [“Making distributed storage easy: usability in Ceph Luminous and beyond”](https://www.youtube.com/watch?v=GrStE7XSKFE). What follows is somewhat of a sequel to that talk, covering the changes we’ve made in the meantime, and what’s still coming down the track. If you’re not familiar with Ceph, you should probably check out [A Gentle Introduction to Ceph](/2016/02/a-gentle-introduction-to-ceph/) before proceeding. In brief though, Ceph provides object, block and file storage in a single, horizontally scalable cluster, with no single points of failure. It’s Free and Open Source software, it runs on commodity hardware, and it tries to be self-managing wherever possible, so it notices when disks fail, and replicates data elsewhere. It does background scrubbing, and it tries to balance data evenly across the cluster. But you do still need to actually administer it.

This leads to one of the first points Sage made this time last year: Ceph is Hard. Status display and logs were traditionally difficult to parse visually, there were (and still are) lots of configuration options, tricky authentication setup, and it was difficult to figure out the number of placement groups to use (which is really an internal detail of how Ceph shards data across the cluster, and ideally nobody should need to worry about it). Also, you had to do everything with a CLI, unless you had a third-party GUI.

I’d like to be able to flip this point to the past tense, because a bunch of those things were already fixed in the [Luminous release](http://ceph.com/releases/v12-2-0-luminous-released/) in August 2017; status display and logs were cleaned up, a balancer module was added to help ensure data is spread more evenly, crush device classes were added to differentiate between HDDs and SSDs, a new in-tree web dashboard was added (although it was read-only, so just cluster status display, no admin tasks), plus a bunch of other stuff.

But we can’t go all the way to saying “Ceph was hard”, because that might imply that _everything_ is now easy. So until we reach that frabjous day, I’m just going to say that Ceph is easier now, and it will continue to get easier in future.

At linux.conf.au in January 2018, we were half way through the Mimic development cycle, and at the time the major usability enhancements planned included:

- Centralised configuration management
- Slick deployment in Kubernetes with Rook
- A vastly improved dashboard based on ceph-mgr and openATTIC
- Placement Group merging

We got some of that stuff done for Mimic, which was [released in June 2018](https://ceph.com/releases/v13-2-0-mimic-released/), and more of it is coming in the Nautilus release, which is due out very soon.

In terms of usability improvements, Mimic gave us [a new dashboard](http://docs.ceph.com/docs/mimic/mgr/dashboard/#mgr-dashboard-overview), inspired by and derived from [openATTIC](https://www.openattic.org/). This dashboard includes all the features of the Luminous dashboard, plus username/password authentication, SSL/TLS support, RBD and RGW management, and a configuration settings browser. Mimic also brought the ability to store and manage configuration options centrally on the MONs, which means we no longer need to set options in `/etc/ceph/ceph.conf`, replicate that across the cluster, and restart whatever daemons were affected. Instead, you can run `` `ceph config set ...` `` to make configuration changes. For initial cluster bootstrap, you can even use DNS SRV records rather than specifying MON hosts in the ceph.conf file.

As I mentioned, the Nautilus release is due out really soon, and will include a bunch more good stuff:

- PG autoscaling:
    - Because we now have PG merging (as well as PG splitting) we can now decrease _or_ increase the number of PGs at will. So you can do this by hand, or you can turn on PG autoscaling, and Ceph will try to take care of this for you, based on certain storage size targets that you can set (see [http://docs.ceph.com/docs/master/rados/operations/placement-groups/#autoscaling-placement-groups](http://docs.ceph.com/docs/master/rados/operations/placement-groups/#autoscaling-placement-groups))
- More dashboard enhancements, including:
    - Multiple users/roles, also single sign on via SAML
    - Internationalisation and localisation
    - iSCSI and NFS Ganesha management
    - Embedded Grafana dashboards
    - The ability to mark OSDs up/down/in/out, and trigger scrubs/deep scrubs
    - Storage pool management
    - A configuration settings editor which actually tells you what the configuration settings mean, and do
    - Embedded Grafana dashboards
    - To see what this all looks like, check out [Ceph Manager Dashboard Screenshots as of 2019-01-17](https://www.openattic.org/posts/ceph-manager-dashboard-screenshots-as-of-2019-01-17/)
- [Blinky lights](https://pad.ceph.com/p/blinky-lights), that being the ability to turn on or off the ident and fault LEDs for the disk(s) backing a given OSD, so you can find the damn things in your DC.
- Orchestrator module(s)

Blinky lights, and some of the dashboard functionality (notably configuring iSCSI gateways and NFS Ganesha) means that Ceph needs to be able to talk to whatever tool it was that deployed the cluster, which leads to the final big thing I want to talk about for the Nautilus release, which is the [Orchestrator modules](http://docs.ceph.com/docs/master/mgr/orchestrator_modules/).

There’s a bunch of ways to deploy Ceph, and your deployment tool will always know more about your environment, and have more power to do things than Ceph itself will, but if you’re managing Ceph, through the inbuilt dashboard and CLI tools, there’s things you want to be able to do as a Ceph admin, that Ceph itself can’t do. Ceph can’t deploy a new MDS, or RGW, or NFS Ganesha host. Ceph can’t deploy new OSDs by itself. Ceph can’t blink the lights on a disk on some host if Ceph itself has somehow failed, but the host is still up. For these things, you rely on your deployment tool, whatever it is. So Nautilus will include Orchestrator modules for [Ansible](http://docs.ceph.com/docs/master/mgr/ansible/), [DeepSea/Salt](http://docs.ceph.com/docs/master/mgr/deepsea/), and [Rook/Kubernetes](http://docs.ceph.com/docs/master/mgr/rook/), which allow the Ceph management tools to call out to your deployment tool as necessary to have it perform those tasks. This is the bit I’m working on at the moment.

Beyond Nautilus, Octopus is the next release, due in a bit more than nine months, and on the usability front I know we can expect more dashboard and more orchestrator functionality, but before that, we have the [Software Defined Storage Developer Room at FOSDEM on February 2-3](https://fosdem.org/2019/schedule/track/software_defined_storage/) and [Cephalocon 2019 on May 19-20](https://ceph.com/cephalocon/barcelona-2019/). Hopefully some of you reading this will be able to attend ![:-)](http://ourobengr.com/wp-includes/images/smilies/icon_smile.gif)

Source: Tim Serong ([Distributed Storage is Easier Now: Usability from Ceph Luminous to Nautilus](http://ourobengr.com/2019/01/usability-from-ceph-luminous-to-nautilus/))
