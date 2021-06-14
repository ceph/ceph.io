---
title: "Your first exabyte in a Ceph cluster"
date: "2014-03-26"
author: "loic"
tags: 
  - "ceph"
---

$ rbd create --size $((1024 \* 1024 \* 1024 \* 1024)) tiny
$ rbd info tiny
rbd image 'tiny':
	size 1024 PB in 274877906944 objects
	order 22 (4096 kB objects)
	block\_name\_prefix: rb.0.1009.6b8b4567
	format: 1

Note: **rbd rm tiny** will take a long time.
