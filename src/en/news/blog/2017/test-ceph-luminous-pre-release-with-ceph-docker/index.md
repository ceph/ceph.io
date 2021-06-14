---
title: "Test Ceph Luminous pre-release with ceph-docker"
date: "2017-04-13"
author: "admin"
tags: 
  - "planet"
---

![Title](images/test-pre-release-ceph-luminous-container.jpg)

**/! DISCLAIMER /!**

**/! DO NOT GET TOO EXCITED, AT THE TIME OF THE WRITTING LUMINOUS IS NOT OFFICIALLY RELEASE IN STABLE YET /!**

**/! USE AT YOUR OWN RISK, DO NOT PUT PRODUCTION DATA ON THIS /!**

Luminous is just around the corner but we have been having packages available for a couple of weeks already. That’s why I recently thought: “how come don’t we have any Ceph container image for Luminous then?”. And I know a lot of you are eager to test the latest developments of Bluestore (the new method to store objects, directly on a raw device).

Now it’s done, you can fetch the `ceph/daemon` image using one of these two tags:

- tag-build-master-luminous-centos-7
- tag-build-master-luminous-ubuntu-16.04

And you will get a running Ceph cluster on Luminous.

> Enjoy your Luminous container image!

Source: Sebastian Han ([Test Ceph Luminous pre-release with ceph-docker](https://sebastien-han.fr/blog/2017/04/13/Testing-Luminous-pre-release-with-ceph-docker/))
