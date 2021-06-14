---
title: "Monitoring a Ceph Cluster"
date: "2012-12-06"
author: "scuttlemonkey"
tags: 
  - "planet"
---

[![](images/rtfm.png "Inktank will help even if you don't RTFM.")](http://www.xkcd.org/293/)

credit: xkcd.org

Ok, so you have gone through the five minute quickstart guide, learned a bit about Ceph, and stood a pre-production server up to test real data and operations…now what? Over the past couple of weeks we have gotten quite a few questions about monitoring and troubleshooting a Ceph cluster once you have one. Thankfully, our doc has been getting a ton of polish. However, we figured a quick rundown of some of the more frequently-useful troubleshooting tools might be helpful.

The first step to fixing a problem is understanding that you actually \_have\_ a problem in the first place. To that end there are a number of health and monitoring tools available to keep a hairy eyeball on Ceph. These tools can be run in interactive mode (just typing ‘ceph’ from the command line) or by a series of status queries and watch commands. To run the ceph tool in interactive mode, type ceph at the command line with no arguments. For example:

- ceph
- ceph> health
- ceph> status
- ceph> quorum\_status
- ceph> mon\_status

Alternately you can also get the same data from one-off commands like ‘_ceph health_‘, ‘_ceph status_‘ (_ceph -s_), or ‘_ceph -w_‘. These commands are roughly in order of their level of detail, with ‘_ceph health_‘ simply returning a one-line status (eg. HEALTH\_OK), ‘_ceph status_‘ giving you the health info plus a few lines about your mon/osd/pg/mds data, and ‘_ceph -w_‘ giving you a running tail of operations in the cluster.

Similar commands are also available to keep that eyeball on the individual node type of a cluster in the form of ‘_ceph {mon|mds|osd} {stat|dump}_‘ that can give you more specific information about a each node archetype. For a better idea of what your OSDs are doing you can also print out a CRUSH tree to see how your OSDs relate to each other and what their status and weight is. with ‘_ceph osd tree_‘. This is a particularly helpful command when troubleshooting a cluster and will often be something the engineers in our irc channel will request when a new question is raised in channel.

Another frequently-asked question relates to what is returned from the various monitoring commands. In general you want your OSDs to be “up” and “in” (meaning running and an active member of the cluster). With respect to the placement groups within OSDs you should also see the return of “active” and “clean”, but if you happen to see something else head over to our [placement group states](http://ceph.com/docs/master/rados/operations/pg-states/) page and take a look at what your cluster is telling you.

For a more in-depth look, our doc has a pretty solid look at [cluster and node monitoring options](http://ceph.com/docs/master/rados/operations/monitoring/), but as always if you have troubles or see something that is missing from the doc please [let us know about it](http://ceph.com/resources/mailing-list-irc/)!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/monitoring-a-ceph-cluster/&bvt=rss&p=wordpress)
