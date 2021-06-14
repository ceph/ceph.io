---
title: "OpenStack: import existing Ceph volumes in Cinder"
date: "2014-12-09"
author: "shan"
tags: 
---

{% img center http://sebastien-han.fr/images/openstack-import-existing-vol-ceph-cinder.jpg OpenStack: import existing Ceph volumes in Cinder %}

This method can be useful while migrating from one OpenStack to another.

  

> Imagine you have operating system instances configured with a legacy application that can only run once. Imagine that you want to run them in Ceph using Cinder booting from volumes. Then this is probably how you will import them.

  

1. If you only need a single instance of that virtual machine then you should not bother to convert it in this first place. No matter the original format, keep it like this. For Ceph RAW is recommended while doing COW clone but not mandatory.
2. Evaluate the size of your image (`du`)
3. Create a Cinder volume with the corresponding size
4. Get the uuid of the volume
5. Import the volume with `rbd -p volumes --image-format 2 import <your-image-file> <volume-uuid>`
6. Flag the volume as bootable: `cinder set-bootable <volume> True`
7. Boot from volume
