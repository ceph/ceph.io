---
title: "Rapido: A Glorified Wrapper for Dracut and QEMU"
date: "2016-12-13"
author: "admin"
tags: 
  - "planet"
---

### Introduction

  
I've blogged a few of times about how [Dracut](https://dracut.wiki.kernel.org/) and [QEMU](http://wiki.qemu.org/) can be combined to greatly improve Linux kernel dev/test turnaround.  

- My [first post](http://blog.elastocloud.org/2015/06/rapid-linux-kernel-devtest-with-qemu.html) covered the basics of building the kernel, running _dracut_, and booting the resultant image with _qemu-kvm_.
- A [later post](http://blog.elastocloud.org/2015/07/qemukvm-bridged-network-with-tap.html) took a closer look at network configuration, and focused on bridging VMs with the hypervisor.
- Finally, my [third post](http://blog.elastocloud.org/2016/05/rapid-ceph-kernel-module-testing-with.html) looked at how this technique could be combined with [Ceph](http://ceph.com/), to provide a similarly efficient workflow for Ceph development.

In bringing this series to a conclusion, I'd like to introduce the newly released [Rapido](https://github.com/ddiss/rapido) project. Rapido combines all of the procedures and techniques described in the articles above into a handful of scripts, which can be used to test specific Linux kernel functionality, standalone or alongside other technologies such as Ceph.  

### Usage - Standalone Linux VM

  
The following procedure was tested on [openSUSE](https://www.opensuse.org/) [Leap 42.2](https://software.opensuse.org/422/en) and [SLES](https://www.suse.com/products/server/) 12SP2, but should work fine on many other Linux distributions.  

#### Step 1: Checkout and Build

  
Checkout the Linux kernel and Rapido source repositories:  

~/> cd ~  
~/> git clone https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git  
~/> git clone https://github.com/ddiss/rapido.git  

  
Build the kernel (using a config provided with the Rapido source):  

~/> cp rapido/kernel/vanilla\_config linux/.config  
~/> cd linux  
~/linux/> make -j6  
~/linux/> make modules  
~/linux/> INSTALL\_MOD\_PATH=./mods make modules\_install  
~/linux/> sudo ln -s $PWD/mods/lib/modules/$(make kernelrelease)   
                        /lib/modules/$(make kernelrelease)  

  

#### Step 2: Configuration 

  
Install Rapido dependencies: _dracut_, _qemu_, _brctl_ (bridge-utils) and _tunctl_.  
  
Edit _rapido.conf_, the master Rapido configuration file:  

~/linux/> cd ~/rapido  
~/rapido/> vi rapido.conf

- set _KERNEL\_src="https//dracut.wiki.kernel.org/home/<user>/linux"_
- set _TAP\_USER="<user>"_
- set _MAC\_ADDR1_ to a valid MAC address, e.g. _"b8:ac:24:45:c5:01"_
- set _MAC\_ADDR2_ to a valid MAC address, e.g. _"b8:ac:24:45:c5:02"_

  
Configure the bridge and tap network devices. This must be done as root:  

~/rapido/> sudo tools/br\_setup.sh  
~/rapido/> ip addr show br0  
4: br0: <BROADCAST,MULTICAST,UP,LOWER\_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000  
    ...  
    inet 192.168.155.1/24 scope global br0

  
  

#### Step 3: Image Generation 

  
Generate a minimal Linux VM image which includes binaries, libraries and kernel modules for filesystem testing:  

~/rapido/> ./cut\_fstests\_local.sh  
...  
 dracut: \*\*\* Creating initramfs image file 'initrds/myinitrd' done \*\*\*  
~/rapido/> ls -lah initrds/myinitrd  
\-rw-r--r-- 1 ddiss users 30M Dec 13 18:17 initrds/myinitrd  

  

#### Step 4 - Boot!

 ~/rapido/> ./vm.sh  
\+ mount -t btrfs /dev/zram1 /mnt/scratch  
\[    3.542927\] BTRFS info (device zram1): disk space caching is enabled  
...  
btrfs filesystem mounted at /mnt/test and /mnt/scratch  
rapido1:/#  

  
In a whopping four seconds, or thereabouts, the VM should have booted to a _rapido:/#_ bash prompt. Leaving you with two [_zram_](https://www.kernel.org/doc/Documentation/blockdev/zram.txt) backed Btrfs filesystems mounted at _/mnt/test_ and _/mnt/scratch_.  
  
Everything, including the VM's root filesystem, is in memory, so any changes will not persist across reboot. Use the rapido.conf _QEMU\_EXTRA\_ARGS_ parameter if you wish to add persistent storage to a VM.  
  
Although the network isn't used in this case, you should be able to observe that the VM's network adapter can be reached from the hypervisor, and vice-versa.  

rapido1:/# ip a show dev eth0  
    ...  
    inet 192.168.155.101/24 brd 192.168.155.255 scope global eth0  
    ...  
rapido1:/# ping 192.168.155.1  
PING 192.168.155.1 (192.168.155.1) 56(84) bytes of data.  
64 bytes from 192.168.155.1: icmp\_seq=1 ttl=64 time=1.97 ms

  
Once you're done playing around, you can shutdown:  

rapido1:/# shutdown  
\[  267.304313\] sysrq: SysRq : sysrq: Power Off  
rapido1:/# \[  268.168447\] ACPI: Preparing to enter system sleep state S5  
\[  268.169493\] reboot: Power down  
\+ exit 0

### Usage - Ceph vstart.sh cluster and CephFS client VM

This usage guide builds on the previous _standalone Linux VM_ procedure, but this time adds Ceph to the mix. If you're not interested in Ceph (how could you not be!) then feel free to skip to the next section.  

#### Step I - Checkout and Build

  
We already have a clone of the Rapido and Linux kernel repositories. All that's needed for CephFS testing is a Ceph build:  

~/> git clone https://github.com/ceph/ceph  
~/> cd ceph  
<install Ceph build dependencies>  
~/ceph/> ./do\_cmake.sh -DWITH\_MANPAGE=0 -DWITH\_OPENLDAP=0 -DWITH\_FUSE=0 -DWITH\_NSS=0 -DWITH\_LTTNG=0  
~/ceph/> cd build  
~/ceph/build/> make -j4 

#### Step II - Start a _vstart.sh_ Ceph "cluster"

  
Once Ceph has finished compiling, _vstart.sh_ can be run with the following parameters to configure and locally start three _OSDs_, one _monitor_ process, and one _MDS_.  

~/ceph/build/> OSD=3 MON=1 RGW=0 MDS=1 ../src/vstart.sh -i 192.168.155.1 -n  
...  
~/ceph/build/> bin/ceph -c status  
...  
     health HEALTH\_OK  
     monmap e2: 1 mons at {a=192.168.155.1:40160/0}  
            election epoch 4, quorum 0 a  
      fsmap e5: 1/1/1 up {0=a=up:active}  
        mgr no daemons active   
     osdmap e10: 3 osds: 3 up, 3 in  

#### Step III - Rapido configuration

  
Edit _rapido.conf_, the master Rapido configuration file:  

~/ceph/build/> cd ~/rapido  
~/rapido/> vi rapido.conf

- set _CEPH\_src="https//dracut.wiki.kernel.org/home/<user>/ceph/src"_
- _KERNEL\_SRC_ and network parameters were configured earlier

  

#### Step IV - Image Generation

  
The _cut\_cephfs.sh_ script generates a VM image with the Ceph configuration and keyring from the _vstart.sh_ cluster, as well as the CephFS kernel module.  

~/rapido/> ./cut\_cephfs.sh

...  
 dracut: \*\*\* Creating initramfs image file 'initrds/myinitrd' done \*\*\*

#### Step V - Boot!

  
Booting the newly generated image should bring you to a shell prompt, with the _vstart.sh_ provisioned CephFS filesystem mounted under _/mnt/cephfs_:  

~/rapido/> ./vm.sh

...

\+ mount -t ceph 192.168.155.1:40160:/ /mnt/cephfs -o name=admin,secret=...  
\[    3.492742\] libceph: mon0 192.168.155.1:40160 session established  
...  
rapido1:/# df -h /mnt/cephfs  
Filesystem             Size  Used Avail Use% Mounted on  
192.168.155.1:40160:/  1.3T  611G  699G  47% /mnt/cephfs

CephFS is a clustered filesystem, in which case testing from multiple clients is also of interest. From another window, boot a second VM:  

~/rapido/> ./vm.sh

### Further Use Cases

  
Rapido ships with a bunch of scripts for testing different kernel components:  

- **cut\_cephfs.sh** (shown above)

- Image: includes Ceph config, credentials and CephFS kernel module
- Boot: mounts CephFS filesystem

- **cut\_cifs.sh**

- Image: includes [_CIFS_](https://www.kernel.org/doc/readme/Documentation-filesystems-cifs-README) (SMB client) kernel module
- Boot: mounts share using details and credentials specified in rapido.conf

- **cut\_dropbear.sh**

- Image: includes [_dropbear_](https://matt.ucc.asn.au/dropbear/dropbear.html) SSH server
- Boot: starts an SSH server with _SSH\_AUTHORIZED\_KEY_

- **cut\_fstests\_cephfs.sh**

- Image: includes _[xfstests](http://git.kernel.org/cgit/fs/xfs/xfstests-dev.git)_ and CephFS kernel client
- Boot: mounts CephFS filesystem and runs _FSTESTS\_AUTORUN\_CMD_

- **cut\_fstests\_local.sh** (shown above)

- Image: includes _xfstests_ and local Btrfs and XFS dependencies
- Boot: provisions local xfstest zram devices. Runs _FSTESTS\_AUTORUN\_CMD_

- **cut\_lio\_local.sh**

- Image: includes _[LIO](http://linux-iscsi.org/)_, _loopback_ dev and [_dm-delay_](https://www.kernel.org/doc/Documentation/device-mapper/delay.txt) kernel modules
- Boot: provisions an iSCSI target, with three LUs exposed

- **cut\_lio\_rbd.sh**

- Image: includes _LIO_ and Ceph RBD kernel modules
- Boot: provisions an iSCSI target backed by _CEPH\_RBD\_IMAGE,_ using target\_core\_rbd

- **cut\_qemu\_rbd.sh**

- Image: _CEPH\_RBD\_IMAGE_ is attached to the VM using qemu-block-rbd
- Boot: runs shell only

- **cut\_rbd.sh**

- Image: includes Ceph config, credentials and Ceph RBD kernel module
- Boot: maps _CEPH\_RBD\_IMAGE_ using the RBD kernel client

- **cut\_tcmu\_rbd\_loop.sh**

- Image: includes Ceph config, librados, librbd, and pulls in [tcmu-runner](https://github.com/open-iscsi/tcmu-runner) from _TCMU\_RUNNER\_SRC_
- Boot: starts tcmu-runner and configures a tcmu+rbd backstore exposing _CEPH\_RBD\_IMAGE_ via the LIO loopback fabric

- [**cut\_usb\_rbd.sh**](http://blog.elastocloud.org/2016/06/linux-usb-gadget-application-testing.html) (see [https://github.com/ddiss/rbd-usb](https://github.com/ddiss/rbd-usb))

- Image: _usb\_f\_mass\_storage_, _zram_, _dm-crypt_, and _RBD\_USB\_SRC_
- Boot: starts the _conf-fs.sh_ script from _RBD\_USB\_SRC_

### Conclusion

  

- Dracut and QEMU can be combined for super-fast Linux kernel testing and development.
- [Rapido](https://github.com/ddiss/rapido) is mostly just a glorified wrapper around these utilities, but does provide some useful tools for automated testing of specific Linux kernel functionality.

  
If you run into any problems, or wish to provide any kind of feedback (always appreciated), please feel free to leave a message below, or raise a ticket in the [Rapido issue tracker](https://github.com/ddiss/rapido/issues).  
  
_Update 20170106:_  

- _Add cut\_tcmu\_rbd\_loop.sh details and fix the example CEPH\_SRC path._

Source: David Disseldorp ([Rapido: A Glorified Wrapper for Dracut and QEMU](http://blog.elastocloud.org/2016/12/rapido-glorified-wrapper-for-dracut-and.html))
