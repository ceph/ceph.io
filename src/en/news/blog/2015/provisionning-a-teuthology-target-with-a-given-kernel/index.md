---
title: "Provisionning a teuthology target with a given kernel"
date: "2015-03-09"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

When a [teuthology](https://github.com/ceph/teuthology/) target (i.e. machine) is provisioned with **teuthology-lock** for the purpose of testing [Ceph](http://ceph.com/), there is no way to choose the kernel. But it can be installed afterwards using the following:

cat > kernel.yaml <<EOF
interactive-on-error: true
roles:
- - mon.a
  - client.0
kernel:
   branch: testing
tasks:
- interactive:
EOF

Assuming the target on which the new kernel is to be installed is **vpm083**, running

$ teuthology  --owner loic@dachary.org \\
  kernel.yaml <(teuthology-lock --list-targets vpm083)
...
2015-03-09 17:47 INFO:teuthology.task.internal:Starting timer...
2015-03-09 17:47 INFO:teuthology.run\_tasks:Running task interactive...
Ceph test interactive mode, use ctx to interact with the cluster
>>>

will install an alternate kernel and reboot the machine:

\[ubuntu@vpm083 ~\]$ uname -a
Linux vpm083 3.19.0-ceph-00029-gaf5b96e #1 SMP Thu Mar 5 01:04:25 GNU/Linux
\[ubuntu@vpm083 ~\]$ lsb\_release -a
LSB Version:	:base-4.0-amd64:base-4.0-noarch:
Distributor ID:	RedHatEnterpriseServer
Description:  release 6.5 (Santiago)
Release:	6.5
Codename:	Santiago

Command line arguments to the kernel may be added to **/boot/grub/grub.conf**. For instance **loop.max\_part=16** to allow partition creation on /dev/loop devices:

default=0
timeout=5
splashimage=(hd0,0)/boot/grub/splash.xpm.gz
hiddenmenu
title rhel-6.5-cloudinit (3.19.0-ceph-00029-gaf5b96e)
        root (hd0,0)
        kernel /boot/vmlinuz-3.19.0 ro root=LABEL=79d3d2d4  loop.max\_part=16
        initrd /boot/initramfs-3.19.0.img
