---
title: "Quick overview of Ceph version running on OSDs"
date: "2017-11-28"
author: "admin"
tags: 
  - "planet"
---

When checking a Ceph cluster it’s useful to know which versions you OSDs in the cluster are running. There is a very simple on-line command to do this: ceph osd metadata|jq '.\[\].ceph\_version'|sort|uniq -c Running this on a cluster which is currently being upgraded to Jewel to Luminous it shows: 10 "ceph version 10.2.6 (656b5b63ed7c43bd014bcafd81b001959d5f089f)" 1670 … [Continue reading Quick overview of Ceph version running on OSDs](https://blog.widodh.nl/2017/11/quick-overview-of-ceph-version-running-on-osds/)

Source: widodh ([Quick overview of Ceph version running on OSDs](https://blog.widodh.nl/2017/11/quick-overview-of-ceph-version-running-on-osds/))
