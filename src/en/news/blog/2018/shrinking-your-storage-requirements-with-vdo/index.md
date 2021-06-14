---
title: "Shrinking Your Storage Requirements with VDO"
date: "2018-04-05"
author: "admin"
tags: 
  - "ceph"
---

Whether you're using proprietary storage arrays or software defined storage, the actual cost of capacity can sometimes provoke responses like, "_why do you you need all that space?_" or "_OK, but that's all the storage you're going to get, so make it last_".

  

The problem is that storage is a commodity resource, it's like toner or ink in a printer. When you run out, things will stop and lots of people tend to lose their sense of humor. Controlling storage growth has been going on for over 10 years in the proprietary storage space, with one of the most successful companies being NetApp who introduced data deduplication with their ASIS (advanced Single Instance Storage) feature back in 2007. The message was that if you wanted to reduce storage consumption, you basically had to buy the more expensive "stuff" in the first place.

  

This was the "status quo" until [Red Hat acquired](https://www.redhat.com/en/about/press-releases/red-hat-acquires-permabit-assets-eases-barriers-cloud-portability-data-deduplication-technology) [Permabit](http://permabit.com/) in mid 2017...now compression and deduplication features are heading towards a Linux server near you!

  

That's the history lesson, now let's look at how you can kick the tyres on open sourced based compression and deduplication. For the remainder of this article, I'll walk through the steps you need to quickly get "dedupe" up and running with [Fedora](https://getfedora.org/en/).

  

  

### Installation

Since we're just testing, create a vm and install Fedora 27. Use libvirt, parallels, virtualbox...whatever takes your fancy - or maybe just use a cloud image in AWS. The choice is yours! Just try to ensure the vm has something like; 2 vcpus, 4GB RAM, an OS disk (20GB) and a data disk for vdo testing.

  

Once installed you'll need to enable an additional repository to pick up the vdo deduplication modules (kvdo - kernel virtual data optimizer)

  

dnf copr enable rhawalsh/dm-vdo  
dnf install vdo kmod-kvdo  
depmod

  

### Configuration

In my test environment, I'm using a 20g vdisk for my vdo testing.

\[root@f27-vdo ~\]# lsblk  
NAME   MAJ:MIN RM SIZE RO TYPE MOUNTPOINT  
vda    252:0    0   4G  0 disk   
└─vda1 252:1    0   4G  0 part /  
vdb    252:16   0  **20G**  0 disk 

  
Now with the kvdo module in place, let's create a vdo volume of 100G using the 20G /dev/vdb device  
  

\[root@f27-vdo ~\]# vdo create --name=vdo0 --device=/dev/vdb  
\--vdoLogicalSize=**100g**  
Creating VDO vdo0  
Starting VDO vdo0  
Starting compression on VDO vdo0  
VDO instance 0 volume is ready at /dev/mapper/vdo0

  
Not exactly complicated :) Couple of things worth noting though;  

- by default new volumes are created with compression and deduplication enabled. If you don't like that you can play with the  \--compression or \--deduplication flags.
- a vdo volume is actually a device mapper device, in this case /dev/mapper/vdo0. It's this 'dm' device that you'll use from here on in.

### Usage

Now you have a vdo volume, next step is to get it deployed and understand how to report on space savings. The first thing is filesystem formatting. Make sure you use the -K switch to avoid issuing discards, remember a vdo volume is in effect a thin provisioned volume.

  

\[root@f27-vdo ~\]# mkfs.xfs -K /dev/mapper/vdo0

  

With the filesystem in place, the next step would normally be updating fstab...right? Well not this time. For vdo volumes, the boot time startup sequence between fstab and the vdo service is a problem - so we need to use a mount service to ensure vdo volumes are mounted correctly. 

The vdo rpm provides a sample mount service definition (/usr/share/doc/vdo/examples/systemd/VDO.mount.example). For this example, I'm going to mount the vdo volume at /mnt/vdo0

  

mkdir /mnt/vdo0  
cp /usr/share/doc/vdo/examples/systemd/VDO.mount.example /etc/systemd/system/mnt-vdo0.mount

  
Then update the mount unit to look like this  

\[Unit\]  
Description = Mount filesystem that lives on VDO0  
name = mnt-vdo0.mount  
Requires = vdo.service systemd-remount-fs.service  
After = multi-user.target  
Conflicts = umount.target  
  
\[Mount\]  
What = /dev/mapper/vdo0  
Where = /mnt/vdo0  
Type = xfs  
Options = discard  
  
\[Install\]  
WantedBy = multi-user.target

  
_Reminder: mount services are named to reflect their intended mount location within the filesystem._  
  
Now reload systemd, enable the mount and start it  

systemctl daemon-reload  
systemctl enable mnt-vdo0.mount  
systemctl start mnt-vdo0.mount  
\[root@f27-vdo ~\]# df -h /mnt/vdo0  
Filesystem         Size Used Avail Use% Mounted on  
/dev/mapper/vdo0   100G 135M 100G    1% /mnt/vdo0

  

At this point you've used the vdo command to create the volume, but there is also a command to look at the volume's statistics called **vdostats**. To give us something to look at I copied the same 200MB [disk image](https://download.fedoraproject.org/pub/fedora/linux/releases/27/CloudImages/x86_64/images/Fedora-Cloud-Base-27-1.6.x86_64.qcow2) to the volume 20 times, which will also help to explain vdo overheads.

  

\[root@f27-vdo ~\]# df -h /mnt/vdo0  
Filesystem        Size  Used Avail Use% Mounted on  
/dev/mapper/vdo0  100G  **4.5G**   96G   5% /mnt/vdo0  

  

\[root@f27-vdo ~\]# vdostats --hu vdo0

Device               Size   Used   Available   Use% Space saving%

vdo0                20.0G   **4.2G**       15.8G    21%           **95%**

  

Wait a minute...at a logical layer, the filesystem says that it's 4.5G used, but at the physical vdo layer it's saying practically the same thing AND that there's a 95% saving! So which is right? The answer is **both** :) The vdo subsystem persists metadata on the volume (lookup maps etc), which accounts for a chunk of the physical space used, and the savings value is derived purely from the logical blocks "in" and the physical, unique blocks written. If you need to understand more you can dive into the sysfs filesystem. 

Each vdo volume stores and maintains statistics under  /sys/kvdo/<vol\_name>/statistics (which is where vdostats gets it's information from!)

  
The most useful stats I've found to understand how space is consumed are;  
  

- overhead\_blocks\_used : metadata for the volume. The overhead is proportional to the physical size of the volume; for example, on an 8TB device, the overhead was around 9GB
- data\_blocks\_used: this is the count of the physical blocks consumed by **user data**
- logical\_blocks\_used: the count of blocks consumed at the filesystem level

In my case, the "overhead\_blocks\_used" was 4GB, and the "data\_blocks\_used" around 200MB. The savings% value is derived from  data\_blocks\_used / logical\_blocks\_used, since it only applies to actual user data written to the volume, which equates to around 95%. Now it makes sense!

  

### Final Words

Deduplication is a complex beast, but hopefully the above will at least get you up and running with this new Linux feature.

  

If you decide to use vdo across a number of servers, running vdostats isn't really a viable option. For that it would be more useful to leave the command line behind at look at solutions like prometheus and grafana to track capacity usage and generate alerts. Spoiler alert!...that's the subject of my next post :)

  

### Useful Links

- Public vdo mirror on github - [https://github.com/dm-vdo/](https://github.com/dm-vdo/) 
- Mail list -  [vdo-devel@redhat.com](mailto:vdo-devel@redhat.com)

  
  
  
  
  

Source: Paul Cuzner ([Shrinking Your Storage Requirements with VDO](http://opensource-storage.blogspot.com/2018/04/shrinking-your-storage-requirements.html))
