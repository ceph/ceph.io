---
title: "On the Road to a Better Ceph-Deploy"
date: "2013-09-26"
author: "alfredo"
tags: 
---

[Ceph-deploy](https://github.com/ceph/ceph-deploy) is the easy deployment tool for Ceph, but for a while it caused more than one headache: almost no logging and no clear error messages when something went wrong.

There has been a \*lot\* of effort trying to get those (and other) issues ironed out and making _ceph-deploy_ way better. Like, ridiculously better. This post will walk through some of the major changes the tools has undergone and will give a glimpse on what is coming up.

## What is going on in my host?

One of the most important items a tool that executes commands on a remote host is to be able to display exactly what is executing and with what output. But that was not the case with _ceph-deploy_. As we started fixing the issues we made this the priority.

If there is no verbose logging of what is going on remotely, it is (almost) impossible to tell how to fix an issue, or to be able to improve any procedures.

Now by default, the tool will have a logging level of _DEBUG_ and will actually output every command that it executes on the remote end, exactly in the way that it calls those commands.

Below is a short extract of output when deploying a monitor in a test machine:

  $ ceph-deploy mon create node1
  \[ceph\_deploy.mon\]\[DEBUG \] Deploying mon, cluster ceph hosts node1
  \[ceph\_deploy.mon\]\[DEBUG \] detecting platform for host node1 ...
  \[ceph\_deploy.sudo\_pushy\]\[DEBUG \] will use a remote connection with sudo
  \[ceph\_deploy.mon\]\[INFO  \] distro info: Ubuntu 12.04 precise
  \[node1\]\[DEBUG \] determining if provided host has same hostname in remote
  \[node1\]\[DEBUG \] deploying mon to node1
  \[node1\]\[DEBUG \] remote hostname: node1
  \[node1\]\[INFO  \] write cluster configuration to /etc/ceph/{cluster}.conf
  \[node1\]\[DEBUG \] checking for done path: /var/lib/ceph/mon/ceph-node1/done
  \[node1\]\[INFO  \] create a done file to avoid re-doing the mon deployment
  \[node1\]\[INFO  \] create the init path if it does not exist
  \[node1\]\[INFO  \] locating \`service\` executable...
  \[node1\]\[INFO  \] found \`service\` executable: /usr/sbin/service
  \[node1\]\[INFO  \] Running command: sudo initctl emit ceph-mon cluster=ceph id=node1
  \[node1\]\[INFO  \] Running command: sudo ceph daemon mon.node1 mon\_status

Not only we are logging commands and interactions, but we are also naming each logger with the actual host name where that action is taking place! This is specially important if you are taking advantage of running commands on multiple hosts.

In this case the output went to the terminal but a copy is always left in the executing directory (in a file commonly named _ceph.log_).

As mentioned before, all commands are displayed as well, they are usually prefixed by _Running command:_ followed by the exact command executing.

Just by looking at the logs, it should be straight forward for someone to come up with a Chef recipe, Puppet manifest, or any other configuration management engine. It is **very** important for us that we empower users as they get ready to graduate from _ceph-deploy_ defaults into more custom Ceph configurations.

## Errors clear as mud

There is nothing as frustrating as obscure, unintelligible error messages that do not tell you what is going on (and possibly hint you at the fix).

This was another big problem that we wanted to fix. A lot of work went into properly capturing errors and giving meaningful messages back to the log output.

Not only we had big tracebacks when errors happened, but remote errors were clobbered by the library _ceph-deploy_ used to connect remotely. This is particularly painful because to fix issues happening on the remote end, it is very important we (at the very least) know what the error was.

Now, not only remote errors are being handled and reported back nicely, but if for some reason there is an error that could not be handled correctly by _ceph-deploy_ it will be logged at _ERROR_ level so that is clear that something went wrong.

This is an example of some code that was not able to create a file because a variable was not defined::

    \[vpm017\]\[ERROR \] Traceback (most recent call last):
    \[vpm017\]\[ERROR \]   File "/home/ubuntu/ceph-deploy/ceph\_deploy/util/decorators.py", line 10, in inner
    \[vpm017\]\[ERROR \]   File "/home/ubuntu/ceph-deploy/ceph\_deploy/hosts/common.py", line 3, in write\_monitor\_keyring
    \[vpm017\]\[ERROR \] NameError: global name 'keyring' is not defined

Remember, that output is from commands being executed remotely, so it is very important we (and the users) are clear if something is not working right (and why).

A lot of normalization was done in most of the tool’s internal exception  
handling, making the error reporting much cleaner, and hopefully easier to digest.

## Stability Stability Stability

Our main goal, besides improved logging and error reporting was to increase the stability of the tool. That means to get rid of bugs as they are being found, but also getting rid of the old ones that seemed to never go away.

I believe that we are getting to a point with the code base where there are less and less big issues to be resolved and there is a better window to get started on some features long overdue.

### Where are we going next?

## Better monitor deployment

As we’ve been fixing some issues, there were clear pain points that needed to be addressed with better output, one of them being deploying monitors.

Sometimes monitors would just hang, or gathering keys would fail and there was little information (even with the new logging in place) that could tell a user what could possibly be wrong.

As of version 1.2.6, _ceph-deploy_ reports the monitor status when it gets deployed, makes sure that the short version of the host matches the remote one and that the rank of the monitor is at an acceptable value.

But much more is coming up! There will be even more checks to catch common pitfalls and an easier way (single command) to just deploy all the monitors defined, wait for them to form quorum and finally gather keys.

That will hopefully provide better information as to what is going on when things don’t work as expected and make it easier to deploy a few monitors.

## Making all commands chatty

As great as it is having the _install_ flag (along with a few others) to tell us what is going on remote hosts, there is still a few that need to be updated to use the newer connection utilities that bring remote verbosity levels up to par.

It has been crucial for _install_, _osd_, and _mon_ and we are sure it will be for the rest of _ceph-deploy_.

## Easier Rados Gateway deployment

It is currently not supported by _ceph-deploy_, but it is in the backlog, as soon as we have a packaged version of all the things needed for it, it will make it into the tool set.

This is a place where we need to draw a line into what the tool should do and we decided to rely on a package first and make _ceph-deploy_ use that to deploy it second.

## More and better documentation

It is another thing we need to improve on. We are very close to having most internals properly documented to auto-generate documentation, but commands and mostly other user-facing options and combinations are in need of attention. As we move to a more stable phase, you should count on **outstanding** docs.

## And finally…

It has been a tremendous amount of work to get this little tool up to speed and behaving nicely while maintaining its usefulness, there is still much to do and a lot to improve! Stay tuned (and stay patient!) while the regular releases start to get better, improving the previous version by leaps and bounds.

**Make sure you udpate**. Every release gets on average about 5-10 bug fixes, which is why we try to release as often as possible.

Hopefully _ceph-deploy_ will be much nicer to work with and will make it easier to deal with errors.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/dev-notes/on-the-road-to-a-better-ceph-deploy/&bvt=rss&p=wordpress)
