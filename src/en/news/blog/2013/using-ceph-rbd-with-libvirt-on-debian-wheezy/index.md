---
title: "Using Ceph Rbd With Libvirt on Debian Wheezy"
date: "2013-09-12"
author: "laurentbarbe"
tags: 
  - "planet"
---

Howto add support of rbd device on debian wheezy.

# libvirt

Since wheezy, libvirt supports rbd device.

# qemu-kvm

If you do not add the support in qemu-kvm you may have an error like this:

```
error: Failed to start domain ubuntu
error: internal error process exited while connecting to monitor: char device redirected to /dev/pts/2
kvm: -drive file=rbd:vmimages/ubuntu:id=vmimages:key=AQAfwTFScNKmLxAAo9abfSLct78rfIQRzQnS5A==:auth_supported=cephx\;none:mon_host=192.168.0.100\:6789\;192.168.0.101\:6789\;192.168.0.102\:6789,if=none,id=drive-virtio-disk0,format=raw,cache=writeback: could not open disk image rbd:vmimages/ubuntu:id=vmimages:key=AQAfwTFScNKmLxAAo9abfSLct78rfIQRzQnS5A==:auth_supported=cephx\;none:mon_host=192.168.0.100\:6789\;192.168.0.101\:6789\;192.168.0.102\:6789: No such file or directory
```

## install ceph dependencies

```
apt-get install lsb-release
wget -q -O- 'https://ceph.com/git/?p=ceph.git;a=blob_plain;f=keys/release.asc' | sudo apt-key add -
echo deb http://ceph.com/debian-firefly/ $(lsb_release -sc) main | sudo tee /etc/apt/sources.list.d/ceph.list
apt-get update
apt-get install librbd-dev librados-dev build-essential
```

## build kvm

```
mkdir -p sources/qemu-kvm
cd sources/qemu-kvm
apt-get source qemu-kvm
apt-get build-dep qemu-kvm
cd qemu-kvm-1.1.2+dfsg/
vim debian/optional-features
```

Uncomment line `# --enable-rbd` and compile :

```
dpkg-buildpackage -rfakeroot -b
cd ..
```

Installation :

```
apt-get install librados2 librbd1
dpkg -i kvm_1.1.2+dfsg-6_amd64.deb qemu-kvm_1.1.2+dfsg-6_amd64.deb
```

Becareful on upgrade ! You can also hold package version :

```
echo "kvm hold" | dpkg --set-selections
echo "qemu-kvm hold" | dpkg --set-selections
```

# qemu (for util like qemu-img)

(Only if needed) You also need to add support in debian rules : “—enable-rbd”

```
mkdir -p sources/qemu
cd sources/qemu
apt-get source qemu
apt-get build-dep qemu
cd qemu-1.1.2+dfsg/
vim debian/rules +82
dpkg-buildpackage -rfakeroot -b
cd ..
```

# Use

Create a pool and associated key on ceph admin host :

```
ceph osd pool create vmimages 100 100
ceph auth get-or-create client.vmimages mon 'allow r' osd 'allow rwx pool=vmimages'
```

keep the key returned.

Create a secret file for libvirt for this user :

```
echo "
    <secret ephemeral='no' private='no'>
   <usage type='ceph'>
     <name>client.vmimages secret</name>
   </usage>
</secret>" > secret.xml

virsh secret-define --file secret.xml
```

Define the key value : first uuid is the value return by the previous command follow by the key return by `ceph auth get-or-create`

```
virsh secret-set-value  76e3a541-b997-58ac-f7bd-77dd7d4347cb AQAREH1QkNDNCBaac03ZICi/CePnRDS+vGyrqQ==
```

Create a device:

(on ceph admin host if you do not want to specify the user, the key, and monitors) with rbd : `rbd create vmimages/ubuntu-newdrive --size=2048` with qemu (you need to add support for that) : `qemu-img create -f rbd rbd:vmimages/ubuntu-newdrive 2G`

Attach on existing host (even if running) :

(192.168.0.100, 192.168.0.101, 192.168.0.102 is the mon host.)

```
echo "
    <disk type='network' device='disk'>
      <driver name='qemu' type='raw'/>
      <auth username='vmimages'>
        <secret type='ceph' uuid='76e3a541-b997-58ac-f7bd-77dd7d4347cb'/>
      </auth>
      <source protocol='rbd' name='vmimages/ubuntu-newdrive'>
        <host name='192.168.0.100' port='6789'/>
        <host name='192.168.0.101' port='6789'/>
        <host name='192.168.0.102' port='6789'/>
      </source>
      <target dev='vdz' bus='virtio'/>
    </disk>
" > device.xml

virsh attach-device ubuntu device.xml --persistent 
```
