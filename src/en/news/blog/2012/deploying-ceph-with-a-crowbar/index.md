---
title: "Deploying Ceph with a Crowbar"
date: "2012-12-13"
author: "scuttlemonkey"
tags: 
---

We have seen users deploying Ceph in a number of different ways, which is just plain awesome! I have spoken with people deploying with [makecephfs](http://ceph.com/docs/master/rados/deployment/mkcephfs/), [ceph-deploy](http://ceph.com/docs/master/rados/deployment/ceph-deploy/), [Juju](http://jujucharms.com/~james-page/quantal/ceph), [Chef](http://ceph.com/docs/master/rados/deployment/chef/), and even the beginnings of some [Puppet](https://github.com/fcharlier/puppet-ceph) work. However, thanks to collaboration between Inktank and Dell there is a really solid deployment pathway using Dell’s Crowbar tool and a Ceph “barclamp.”

For those not familiar with Dell Crowbar, it is an Open Source cloud deployment framework that originated as a way for Dell to support their OpenStack and Hadoop powered solutions. Since its inception, and eventual open source-ing at OSCON 2011, it has come a long way, growing into the full-featured solution that we see today. Crowbar uses packages called “barclamps” that allow individuals to create ready-made ways to deploy the tools they want (like Chef’s “recipes” or Juju’s “charms”). These barclamps include custom UI for config, dependency graphs, and even localization support. Using it as one of the powerful devops vehicles to deploy Ceph seemed like the next logical step.

**NOTE:** If you are looking to actually follow a step-by-step guide for installing Ceph and OpenStack via Crowbar, please take a look at our full install guide on the Inktank site.

### Hardware Requirements

There are a few prerequisites before you charge off wildly and start installing Crowbar nodes all over your datacenter. First, while Crowbar is hardware agnostic, you need to make sure that your nodes have an IPMI ([intelligent platform management interface](http://en.wikipedia.org/wiki/Intelligent_Platform_Management_Interface)) accessible w/ a BMC ([baseboard management controller](http://en.wikipedia.org/wiki/Intelligent_Platform_Management_Interface#Baseboard_management_controller)). A BMC is the smarts behind the whole IPMI mojo and allows you to control the hardware from the Crowbar admin node.

While the network settings are configurable, Dell also recommends that you have VLAN-capable NICs and switches. Crowbar uses five different networks via 802.1Q which makes network setup much easier, although slightly more expensive for those components. Given the amount of network traffic between OpenStack and Ceph, having 10G ethernet is usually never a bad idea either.

### Getting Set Up

Crowbar uses a number of tools, starting with a full OS install of Ubuntu. Below is a quick list of what you can expect to be installed with the Crowbar ISO:

1. Ubuntu: Ubuntu Server. We recommend version 12.04 LTS or later.
2. Opscode® Chef™: Opscode Chef and its dependencies (e.g. Ruby, nginx, RabbitMQ, etc.)
3. Nagios: Nagios infrastructure monitoring software.
4. Ganglia: Ganglia distributed monitoring system.
5. Dell Crowbar: Crowbar software and additional scripts for Admin nodes, etc.

Thankfully, Dell makes all of this quite painless by providing a Crowbar ISO (start [here](https://github.com/dellcloudedge/crowbar)) that you can burn and boot from to get your admin node set up (you can also use a bootstrat node and PXE boot the admin node). There is a small bit of config once you have things installed, but then you are able to jump right into a browser-based Crowbar admin interface that helps you configure the rest.

### Deploying Barclamps

In Crowbar, the language you use to deploy the contents of a barclamp to a node is called a “proposal.” This allows you to point a barclamp one or more nodes, and install it in true fire-and-forget fashion. The mechanics for doing this are just as easy as they sound:

1. Click on a barclamp and click “create.” A dialogue box will open.
2. Drag-and-drop an available node from the left-hand side list to a role on the right-hand side list.
3. Click “apply.”
4. Wait for Crowbar to apply the proposal successfully.

That’s it! That’s all it takes. You just need to replicate this for each piece that you wish to install. For an OpenStack install you should install the following Barclamps:

1. Mysql
2. Keystone
3. Swift
4. Glance
5. Nova dashboard
6. Nova

### Installing Ceph

While future versions of the Crowbar ISO will have the ability to install Ceph by default, currently you have to deploy it by hand. The best way to do this is grab the two [Barclamps from Inktank’s site](http://www.inktank.com/dell/). This will allow you to deploy Ceph, and allow OpenStack’s Nova to work with Ceph.

### Verifying Your Setup

Now that you have both OpenStack and Ceph deployed on your Crowbar nodes it’s probably a good idea to verify that OpenStack can actually create Ceph block devices. In order to do this you can head on over to the Nova dashboard interface and under “manage compute” click on “instances and volumes.” Here you can just select the “create volume” button and pick a name and size.

Once that completes you can drop down into Ceph and take a look at the volume that was just created for you with a simple “sudo rbd ls” command on your Ceph monitor node. That’s it, you now have the power of Ceph to go with your OpenStack install, all courtesy of Crowbar! Enjoy your delicious cloud deployment and all of the associated goodness.

### Conclusion

As you can see, the process is quite painless and allows for a large amount of flexibility for both deployment and usability. Once you have this install you can even drop a raw image into Ceph and then import it into Glance. This makes for simple deployment of pre-configured machines, and easier is (almost) always better!

It’s great to see Ceph being deployed in such a number of different ways and under an amazing number of circumstances. The Crowbar deployment is definitely a solid option if you are evaluating enterprise deployment architectures like Chef, Puppet, or Juju. And, no matter what your deployment strategy, if you would like help with your Ceph cluster [Inktank](http://inktank.com) is always more than happy to help!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/deploying-ceph-with-a-crowbar/&bvt=rss&p=wordpress)
