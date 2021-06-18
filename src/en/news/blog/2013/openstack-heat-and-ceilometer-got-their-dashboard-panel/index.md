---
title: "OpenStack Heat and Ceilometer got their dashboard panel"
date: "2013-09-06"
author: "shan"
tags: 
---

The Havana milestone release of the Horizon dashboard brought an absolutely wonderful panel for Heat, the orchestration service and Ceilometer, the metering service. Quick preview before the Havana’s official release.

  

# I. Heat

Grab a simple [Wordpress template](https://raw.github.com/openstack/heat-templates/master/cfn/F17/WordPress_Single_Instance.template):

Create your stack:

![](images/horizon-heat-stack-create.jpg "Heat create stack")

Describe it:

![](images/horizon-heat-stack-description.jpg "Heat describe stack")

Topology animation. The first time I clicked on the button and saw this animation, I was really impressed. It’s really fancy, smooth and you can move the whole thing by dragging one item and move with your mouse. Pretty funny :D.

![](images/horizon-stack-topology.jpg "Heat stack topology")

Stack overview:

![](images/horizon-stack-overview.jpg "Heat stack overview")

Stack Resources:

![](images/horizon-stack-resources.jpg "Heat stack resources")

Stack events:

![](images/horizon-stack-events.jpg "Heat stack events")

  

# II. Ceilometer

**Note: admin panel only**

Disk usage:

![](images/horizon-ceilometer-disk.jpg "Ceilometer Disk Usage")

Network usage:

![](images/horizon-ceilometer-network.jpg "Ceilometer Network Usage")

Graph:

![](images/horizon-ceilometer-graph.jpg "Ceilometer Graph")

  

# III. Minor enhancements

## III.1 Instance boot

The instance boot panel also got a fresh new look while trying to boot from different soruces:

![](images/horizon-instance-boot.jpg "Instance boot")

## III.2. Network topology

The network topology panel also had a nice re-looking. We now have 2 differents views (small and normal), depends on the number of instances you run. Another cool thing is that you can directly interact with the VM from the network topology panel and for instance request a termination or the console.

![](images/horizon-network-topology.jpg "Network topology")

  

> Thanks for reading!
