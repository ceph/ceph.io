---
title: "Inktank and Redhat to open source Calamari, the Ceph web interface"
date: "2014-05-03"
author: "dmsimard"
tags: 
  - "ceph"
  - "inktank"
  - "planet"
---

You might have heard this already but [Redhat](http://www.redhat.com/) made an [annoucement](http://www.redhat.com/about/news/press-archive/2014/4/red-hat-to-acquire-inktank-provider-of-ceph) last week that they will be acquiring [Inktank](http://www.inktank.com/), the company behind [Ceph](http://ceph.com/).

Inktank steered Ceph’s development, offered training and provided support through an [entreprise package](http://www.inktank.com/enterprise/) which included Calamari: a web interface to have insight on what is going on inside your cluster.  
You can have a peek at what Calamari looks like [here](http://www.youtube.com/watch?feature=player_detailpage&v=WlDCyLe7QBk#t=436) - in a session from Portland’s Openstack Summit.

Now, what’s interesting is that prior to this [announcement](http://comments.gmane.org/gmane.comp.file-systems.ceph.devel/19436), Calamari was closed source and would only be available as part of Inktank’s entreprise package. The fact that Calamari was closed source resulted in several open source alternatives spawning left and right - some of them pretty good looking, too - to name a few:

- [kraken](https://github.com/krakendash/krakendash "kraken")
- [dashing-ceph](https://github.com/rochaporto/dashing-ceph "dashing-ceph")
- [ceph-dash](https://github.com/Crapworks/ceph-dash "ceph-dash")

I’m glad that Calamari will be open sourced, hopefully this means the community will focus their efforts on one initiative. Having personally worked on both [python-cephclient](http://dmsimard.com/2014/01/18/python-cephclient-now-on-pypi/) and [kraken](https://github.com/krakendash/krakendash), the programmer in me is also curious as to how Inktank developed it. I can’t wait.
