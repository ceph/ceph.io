---
title: "Ceph: collect Kernel RBD logs"
date: "2014-12-17"
author: "shan"
tags: 
  - "planet"
---

{% img center http://sebastien-han.fr/images/ceph-collect-krbd-logs.jpg Ceph: collect Kernel RBD logs %}

Quick tip to collect Kernel RBD logs.

  

Make sure your kernel is compiled with `CONFIG_DYNAMIC_DEBUG` (and `CONFIG_DEBUG_FS`) enabled:

``bash $ sudo cat /boot/config-`uname -r` | grep DYNAMIC_DEBUG CONFIG_DYNAMIC_DEBUG=y``

Then mount debugfs:

`bash $ sudo mount -t debugfs none /sys/kernel/debug`

Set the console log level to 9:

`bash $ sudo echo 9 > /proc/sysrq-trigger`

Then chose the module that you want to log:

`bash $ sudo echo 'module rbd +p' | sudo tee -a /sys/kernel/debug/dynamic_debug/control`

Looking at `dmesg` will show the corresponding logs. You can use this [script](https://github.com/ceph/ceph/blob/master/src/script/kcon_all.sh) from the Ceph repo as well to enable all of them:

\`\`\`bash

# !/bin/sh -x

p() { echo "$\*" > /sys/kernel/debug/dynamic\_debug/control }

echo 9 > /proc/sysrq-trigger p 'module ceph +p' p 'module libceph +p' p 'module rbd +p' \`\`\`
