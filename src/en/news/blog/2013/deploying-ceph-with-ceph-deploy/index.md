---
title: "Deploying Ceph with ceph-deploy"
date: "2013-05-16"
author: "scuttlemonkey"
tags: 
  - "planet"
---

If you have deployed Ceph recently without the assistance of an orchestration tool like [Chef](http://wiki.ceph.com/02Guides/Deploying_Ceph_with_Chef) or [Juju](http://ceph.com/dev-notes/deploying-ceph-with-juju/) you may have noticed there has been a lot of attention on [ceph-deploy](https://github.com/ceph/ceph-deploy). Ceph-deploy is the new stand-alone way to deploy Ceph (replacing [mkcephfs](http://ceph.com/docs/master/man/8/mkcephfs/)) that relies only on ssh, sudo, and some Python to get the job done. If you are experimenting with Ceph or find yourself deploying and tearing down Ceph clusters a lot and don’t want the added overhead of an orchestration framework, this is probably the tool for you.

Since this tool has undergone a lot of work lately, we wanted to publish a nice simple walkthrough to help people get up and running. However, since we also love it when brilliance comes from our community instead of us hogging the microphone all the time; we thought it would be better to replicate a blog from community contributor Loic Dachary. Read on for his ceph-deploy walkthrough and give it a shot!

> A [ceph-deploy](https://github.com/ceph/ceph-deploy) package is created for [Ubuntu raring](http://releases.ubuntu.com/raring/) and installed with
> 
> dpkg -i ceph-deploy\_0.0.1-1\_all.deb
> 
> A ssh key is generated without a password and copied over to the root .ssh/authorized\_keys file of each host on which ceph-deploy will act:
> 
> \# ssh-keygen
> Generating public/private rsa key pair.
> Enter file in which to save the key (/root/.ssh/id\_rsa):
> Enter passphrase (empty for no passphrase):
> Enter same passphrase again:
> Your identification has been saved in /root/.ssh/id\_rsa.
> Your public key has been saved in /root/.ssh/id\_rsa.pub.
> The key fingerprint is:
> ca:1f:c3:ce:8d:7e:27:54:71:3b:d7:31:32:14:ba:68 root@bm0014.the.re
> The key's randomart image is:
> +--\[ RSA 2048\]----+
> |            .o.  |
> |            oo.o |
> |           . oo.+|
> |          . o o o|
> |        SE o   o |
> |     . o. .      |
> |      o +.       |
> |       + =o .    |
> |       .\*..o     |
> +-----------------+
> # for i in 12 14 15
> do
>  ssh bm00$i.the.re cat >> .ssh/authorized\_keys < .ssh/id\_rsa.pub
> done
> 
> Each host is installed with Ubuntu raring and has a spare, unused, disk at /dev/sdb. The ceph packages are installed with:
> 
> ceph-deploy install bm0012.the.re bm0014.the.re bm0015.the.re
> 
> The short version of each FQDN is added to /etc/hosts on each host, because ceph-deploy will assume that it exists:
> 
> for host in bm0012.the.re bm0014.the.re bm0015.the.re
> do
>  getent hosts bm0012.the.re bm0014.the.re bm0015.the.re | 
>    sed -e 's/.the.re//' | ssh $host cat >> /etc/hosts
> done
> 
> The ceph cluster configuration is created with:
> 
> \# ceph-deploy new bm0012.the.re bm0014.the.re bm0015.the.re
> 
> and the corresponding mon are deployed with
> 
> ceph-deploy mon create bm0012.the.re bm0014.the.re bm0015.the.re
> 
> Even after the command returns, it takes a few seconds for the keys to be generated on each host: the ceph-mon process shows when it is complete. Before creating the osd, the keys are obtained from a mon with:
> 
> ceph-deploy gatherkeys bm0012.the.re
> 
> The osds are then created with:
> 
> ceph-deploy osd create bm0012.the.re:/dev/sdb  bm0014.the.re:/dev/sdb  bm0015.the.re:/dev/sdb
> 
> After a few seconds the cluster stabilizes, as shown with
> 
> \# ceph -s
>    health HEALTH\_OK
>    monmap e1: 3 mons at {bm0012=188.165:6789/0,bm0014=188.165:6789/0,bm0015=188.165:6789/0}, election epoch 24, quorum 0,1,2 bm0012,bm0014,bm0015
>    osdmap e14: 3 osds: 3 up, 3 in
>     pgmap v106: 192 pgs: 192 active+clean; 0 bytes data, 118 MB used, 5583 GB / 5583 GB avail
>    mdsmap e1: 0/0/1 up
> 
> A 10GB RBD is created, mounted and destroyed with:
> 
> \# rbd create --size 10240 test1
> # rbd map test1 --pool rbd
> # mkfs.ext4 /dev/rbd/rbd/test1
> # mount /dev/rbd/rbd/test1 /mnt
> # df -h /mnt
> Filesystem      Size  Used Avail Use% Mounted on
> /dev/rbd1       9.8G   23M  9.2G   1% /mnt
> # umount /mnt
> # rbd unmap /dev/rbd/rbd/test1
> # rbd rm test1
> Removing image: 100% complete...done.
> 
> ### Ubuntu raring package
> 
> A [series of patches](https://github.com/ceph/ceph-deploy/pull/10) fix minor build and deploy problems for the [ceph-deploy](https://github.com/ceph/ceph-deploy) package:
> 
> - the debian packages need python-setuptools as a build dependency
> - Add python-pushy to the list of packages required to run ceph-deploy when installed on debian
> - The list of path added by ceph-deploy does not cover all the deployment scenarios. In particular, when installed from a package it will end up in /usr/lib/python2.7/dist-packages/ceph\_deploy . The error message is removed : the from will fail if it does not find the module.
> - add missing python-setuptools runtime dependency to debian/control
> 
> ### Reseting the installation
> 
> To restart from scratch ( i.e. discarding all data and all installation parameters ), uninstall the software with
> 
> ceph-deploy uninstall bm0012.the.re bm0014.the.re bm0015.the.re
> 
> and purge any leftovers with
> 
> for host in bm0012.the.re bm0014.the.re bm0015.the.re
> do
>  ssh $host apt-get remove --purge ceph ceph-common ceph-mds
> done
> 
> Remove the configuration files and data files with
> 
> for host in bm0012.the.re bm0014.the.re bm0015.the.re
> do
>  ssh $host rm -fr /etc/ceph /var/lib/ceph
> done
> 
> Reset the disk with
> 
> for host in bm0012.the.re bm0014.the.re bm0015.the.re
> do
>  ssh $host <<EOF
> umount /dev/sdb1
> dd if=/dev/zero of=/dev/sdb bs=1024k count=100
> sgdisk -g --clear /dev/sdb
> EOF
> done
> 
> **\[Republished from\]:** [Loic Dachary](http://dachary.org/?p=1971)

As you can see ceph-deploy is an easy, lightweight way to deploy a Ceph cluster. It is worth noting, however, that it wont handle fine-control over things like security settings, partitions, or directory locations. So, if you really want to customize your Ceph cluster to that extent you'd probably be better served using a full-blown orchestration and deployment framework like [Chef](http://www.opscode.com/chef/), [Puppet](https://puppetlabs.com/puppet/what-is-puppet/), or [Juju](https://juju.ubuntu.com/).

We do love to publish things like this, so if you have your own Ceph-related howto or walkthrough, we'd love to hear about it. Feel free to send links or transcripts to our [community team](mailto:%20community@inktank.com) and we'll be sure to share them with the community-at-large either via social media or as a guest blog here. Thanks!

scuttlemonkey out

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/howto/deploying-ceph-with-ceph-deploy/&bvt=rss&p=wordpress)
