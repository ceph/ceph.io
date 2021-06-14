---
title: "Making gluster play nicely with others"
date: "2016-05-30"
author: "admin"
tags: 
  - "ceph"
---

These days hyperconverged strategies are everywhere. But when you think about it, sharing the finite resources within a physical host requires an effective means of prioritisation and enforcement. Luckily, the Linux kernel already provides an infrastructure for this in the shape of cgroups, and the interface to these controls is now simplified with systemd integration.

  

So lets look at how you could use these capabilities to make Gluster a better neighbour in a collocated or hyperconverged  model. 

  

First some common systemd terms, we should to be familiar with;  

**slice :** a slice is a concept that systemd uses to group together resources into a hierarchy. Resource constraints can then be applied to the slice, which defines 

- how different slices may compete with each other for resources (e.g. weighting)
- how resources within a slice are controlled (e.g. cpu capping)

**unit :** a systemd unit is a resource definition for controlling a specific system service

NB. _More information about control groups with systemd can be found [here](http://man7.org/linux/man-pages/man5/systemd.cgroup.5.html)_

  

In this article, I'm keeping things simple by implementing a cpu cap on glusterfs processes. Hopefully, the two terms above are big clues, but conceptually it breaks down into two main steps;

1. define a **slice** which implements a CPU limit
2. ensure gluster's systemd **unit(s)** start within the correct slice.

So let's look at how this is done.  
  

#### Defining a slice

Slice definitions can be found under /lib/systemd/system, but systemd provides a neat feature where /etc/systemd/system can be used provide local "tweaks". This override directory is where we'll place a slice definition. Create a file called glusterfs.slice, containing;

  

<table style="background-color: #e6e6e6;border: 1px solid #a6a6a6;font-family: monospace;margin: auto auto;width: 90%"><tbody><tr><td>[Slice]<br>CPUQuota=200%</td></tr></tbody></table>

  

CPUQuota is our means of applying a cpu limit on all resources running within the slice. A value of 200% defines a 2 cores/execution threads limit.

  

#### Updating glusterd

  

Next step is to give gluster a nudge so that it shows up in the right slice. If you're using RHEL7 or Centos7, cpu accounting may be off by default (you can check in /etc/systemd/system.conf). This is OK, it just means we have an extra parameter to define. Follow these steps to change the way glusterd is managed by systemd

  

<table style="background-color: #e6e6e6;border: 1px solid #a6a6a6;font-family: monospace;margin: auto auto;width: 90%"><tbody><tr><td># cd /etc/systemd/system<br># mkdir glusterd.service.d<br># echo -e "[Service]nCPUAccounting=truenSlice=glusterfs.slice" &gt; glusterd.service.d/override.conf</td></tr></tbody></table>

  

_glusterd_ is responsible for starting the brick and self heal processes, so by ensuring glusterd starts in our cpu limited slice, we capture all of glusterd's child processes too. Now the potentially bad news...this 'nudge' requires a stop/start of gluster services. If your doing this on a live system you'll need to consider quorum, self heal etc etc. However, with the settings above in place, you can get gluster into the right slice by;

  

<table style="background-color: #e6e6e6;border: 1px solid #a6a6a6;font-family: monospace;margin: auto auto;width: 90%"><tbody><tr><td># systemctl daemon-reload<br># systemctl stop glusterd<br># killall glusterfsd &amp;&amp; killall glusterfs<br># systemctl daemon-reload<br># systemctl start glusterd</td></tr></tbody></table>

  
  

You can see where gluster is within the control group hierarchy by looking at it's runtime settings

  

<table style="background-color: #e6e6e6;border: 1px solid #a6a6a6;font-family: monospace;margin: auto auto;width: 90%"><tbody><tr><td># systemctl show glusterd | grep slice<br>Slice=<b>glusterfs.slice</b><br>ControlGroup=/<b>glusterfs.slice/glusterd.service</b><br>Wants=glusterfs.slice<br>After=rpcbind.service glusterfs.slice systemd-journald.socket network.target basic.target</td></tr></tbody></table>

  

or use the systemd-cgls command to see the whole control group hierarchy

  

<table style="background-color: #e6e6e6;border: 1px solid #a6a6a6;font-family: monospace;margin: auto auto;width: 90%"><tbody><tr><td><span style="color: #666666">├─1 /usr/lib/systemd/systemd --switched-root --system --deserialize 19<br>├─<span style="color: black"><b>glusterfs.slice</b><br>│ └─glusterd.service<br>│&nbsp;&nbsp; ├─ 867 /usr/sbin/glusterd -p /var/run/glusterd.pid --log-level INFO<br>│&nbsp;&nbsp; ├─1231 /usr/sbin/glusterfsd -s server-1 --volfile-id repl.server-1.bricks-brick-repl -p /var/lib/glusterd/vols/repl/run/server-1-bricks-brick-repl.pid&nbsp;</span></span><br><span style="color: #666666"><span style="color: black">&nbsp;│&nbsp;&nbsp; └─1305 /usr/sbin/glusterfs -s localhost --volfile-id gluster/glustershd -p /var/lib/glusterd/glustershd/run/glustershd.pid -l /var/log/glusterfs/glustershd.log</span><br>├─user.slice<br>│ └─user-0.slice<br>│&nbsp;&nbsp; └─session-1.scope<br>│&nbsp;&nbsp;&nbsp;&nbsp; ├─2075 sshd: root@pts/0&nbsp;&nbsp;<br>│&nbsp;&nbsp;&nbsp;&nbsp; ├─2078 -bash<br>│&nbsp;&nbsp;&nbsp;&nbsp; ├─2146 systemd-cgls<br>│&nbsp;&nbsp;&nbsp;&nbsp; └─2147 less<br>└─system.slice</span></td></tr></tbody></table>

  

At this point gluster is exactly where we want it! 

  

Time for some more systemd coolness ;) The resource constraints that are applied by the slice are dynamic, so if you need more cpu, you're one command away from getting it;

  

<table style="background-color: #e6e6e6;border: 1px solid #a6a6a6;font-family: monospace;margin: auto auto;width: 90%"><tbody><tr><td># systemctl set-property glusterfs.slice CPUQuota=350%</td></tr></tbody></table>

  

Try the 'systemd-cgtop' command to show the cpu usage across the complete control group hierarchy.

  

Now if jumping straight into applying resource constraints to gluster is a little daunting, why not test this approach with a tool like '[stress](http://pkgs.repoforge.org/stress/)'. Stress is designed to simply consume components of the system - cpu, memory, disk. Here's an example .service file which uses stress to consume 4 cores

  

<table style="background-color: #e6e6e6;border: 1px solid #a6a6a6;font-family: monospace;margin: auto auto;width: 90%"><tbody><tr><td>[Unit]<br>Description=CPU soak task<br><br>[Service]<br>Type=simple<br>CPUAccounting=true<br>ExecStart=/usr/bin/stress -c 4<br>Slice=glusterfs.slice<br><br>[Install]<br>WantedBy=multi-user.target</td></tr></tbody></table>

  

Now you can tweak the service, and the slice with different thresholds before you move on to bigger things! Use stress to avoid stress :)

  

And now the obligatory warning. Introducing any form of resource constraint may resort in unexpected outcomes especially in hyperconverged/collocated systems - so adequate testing is key.

  
With that said...happy hacking :)  
  
  
  
  

Source: Paul Cuzner ([Making gluster play nicely with others](http://opensource-storage.blogspot.com/2016/05/making-gluster-play-nicely-with-others.html))
