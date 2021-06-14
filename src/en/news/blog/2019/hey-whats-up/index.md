---
title: "Hey! What's up?!"
date: "2019-05-09"
author: "admin"
tags: 
  - "planet"
---

![Title](https://raw.githubusercontent.com/rook/rook/master/Documentation/media/logo.svg?sanitize=true)

It has been a long time since I’ve been giving updates or even blogging. Let’s take some time here (while being on the plane) to update you on what I’m doing these days.

## [](#Moving-away-from-ceph-ansible-container "Moving away from ceph-ansible/container")Moving away from ceph-ansible/container

In 2014, I was launching [ceph-ansible](https://github.com/ceph/ceph-ansible), a set of playbooks to deploy, manage and upgrade Ceph with the help of Ansible.  
In 2015, I was launching [ceph-container](https://github.com/ceph/ceph-container), the very first iteration of containerized Ceph with the help of Docker.

Since that, I’ve never stopped contributing to them, but almost a year ago ago things started moving in a different direction. As much as I love both projects, I realized it was time, to move to something else. Two years ago, I was attending my very first KubeCon, at this time, we (Ceph team) deciced our strategy when it comes to deploying Ceph in Kubernetes environments, our choice was to use [Rook](https://rook.io/). That’s where my involvment started.

## [](#New-focus-Rook "New focus: Rook")New focus: Rook

Back then, even though Rook wasn’t perfect, we decided to go with it and improve it over time.

For the record, Rook is a storage orchestrator for Kubernetes, you can read more about orchestrator [on this blogpost announcement](link). Rook allows us to deploy, manage and upgrade Ceph in Kubernetes. It is capable of deploying more storage technologies than Ceph such as EdgeFS and CockroachDB to name a few, but my focus is on Ceph obviously.

For almost a year now, I’ve started looking at Rook and contributing to it. Today, I’m one of the maintainers of the Ceph part and actively commited to its success. Last week was an important milestone for us as we release the 1.0 version with Ceph Nautilus support. Stay tune for more blogging on Rook.

## [](#Give-Rook-a-try "Give Rook a try")Give Rook a try

With a few commands, you can start playing and getting familiar with it, first download [minikube](link), once minikube is installed run the following commands:

<table><tbody><tr><td class="code"><pre><span class="line">minikube start</span><br><span class="line">git <span class="built_in">clone</span> https://github.com/rook/rook</span><br><span class="line"><span class="built_in">cd</span> cluster/examples/kubernetes/ceph</span><br><span class="line">kubectl create <span class="_">-f</span> common.yaml operator.yaml</span><br><span class="line">kubectl create <span class="_">-f</span> cluster.yaml</span><br></pre></td></tr></tbody></table>

In less, than 5 minutes you will be up and running!

  

> I kinda miss blogging, I feel it’s important for me and for you readers. You couldn’t believe how happy am I when I meet some of you at conferences and you reward me for the content of the blog. I’ve been hearing a tons of “hey thanks for your blog it’s been really helpful”. I feel so proud about it. Unfortunately, I’ve realized that the content is now getting old and always redirect you to the official documentation. I hope I’ll be able to give more attention to the blog in the second half of the year. Thanks again for your support!

Source: Sebastian Han ([Hey! What's up?!](https://sebastien-han.fr/blog/2019/05/09/hey-whats-up/))
