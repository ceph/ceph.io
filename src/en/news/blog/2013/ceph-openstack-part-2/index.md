---
title: "Ceph + OpenStack :: Part-2"
date: "2013-12-05"
author: "syndicated"
tags: 
  - "ceph"
---

  
Configuring OpenStack  
  
Two parts of openstack integrates with Ceph’s block devices:  

- **Images**: OpenStack Glance manages images for VMs.
- **Volumes**: Volumes are block devices. OpenStack uses volumes to boot VMs, or to attach volumes to running VMs. OpenStack manages volumes using Cinder services.
    - Create pools for volumes and images:

ceph osd pool create volumes 128  
ceph osd pool create images 128

- Configure OpenStack Ceph Client - The nodes running glance-api and cinder-volume act as Ceph clients. Each requires the ceph.conf file:

\[root@ceph-mon1 ceph\]# scp ceph.conf openstack:/etc/ceph

- **Installing ceph client packages on openstack node**
    - First install Python bindings for librbd

yum install python-ceph  

- - Install ceph

\[root@ceph-mon1 ceph\]# ceph-deploy install openstack

- **Setup Ceph Client Authentication for both pools along with keyrings**
    - Create a new user for Nova/Cinder and Glance.

ceph auth get-or-create client.volumes mon 'allow r' osd 'allow class-read object\_prefix rbd\_children, allow rwx pool=volumes, allow rx pool=images'  
ceph auth get-or-create client.images mon 'allow r' osd 'allow class-read object\_prefix rbd\_children, allow rwx pool=images' 

- - Add these keyrings to glance-api and cinder-volume nodes.

ceph auth get-or-create client.images | ssh openstack tee /etc/ceph/ceph.client.images.keyring  
ssh openstack chown glance:glance /etc/ceph/ceph.client.images.keyring  
ceph auth get-or-create client.volumes | ssh openstack tee /etc/ceph/ceph.client.volumes.keyring  
ssh openstack chown cinder:cinder /etc/ceph/ceph.client.volumes.keyring

- - Hosts running nova-compute do not need the keyring. Instead, they store the secret key in libvirt. To create libvirt secret key you will need key from client.volumes.key

ceph auth get-key client.volumes | ssh openstack tee client.volumes.key

- - on the compute nodes, add the secret key to `libvirt create a secret.xml file`

cat > secret.xml < <EOF  
<secret ephemeral='no' private='no'>  
  <usage type='ceph'>  
    <name>client.volumes secret</name>  
  </usage>  
EOF

- - Generate secret from created secret.xml file , make a note of uuid of secret output

\# virsh secret-define --file secret.xml 

- - Set libvirt secret using above key

\# virsh secret-set-value --secret {uuid of secret} --base64 $(cat client.volumes.key) && rm client.volumes.key secret.xml

- **Configure OpenStack-Glance to use CEPH**
    - Glance can use multiple back ends to store images. To use Ceph block devices by default, edit `/etc/glance/glance-api.conf` and add:

default\_store=rbd  
rbd\_store\_user=images  
rbd\_store\_pool=images

- - If want to enable copy-on-write cloning of images into volumes, also add:

show\_image\_direct\_url=True

- **Configure OpenStack - Cinder to use CEPH** 
    - OpenStack requires a driver to interact with Ceph block devices. You must specify the pool name for the block device. On your OpenStack node, edit`/etc/cinder/cinder.conf` by adding:

volume\_driver=cinder.volume.drivers.rbd.RBDDriver  
rbd\_pool=volumes  
glance\_api\_version=2

- If you’re using cephx authentication also configure the user and uuid of the secret you added to `libvirt` earlier:

rbd\_user=volumes  
rbd\_secret\_uuid={uuid of secret}

- Restart Openstack

service glance-api restart  
service nova-compute restart  
service cinder-volume restart

- Once OpenStack is up and running, you should be able to create a volume with OpenStack on a Ceph block device.
- **NOTE :** Make sure /etc/ceph/ceph.conf file have sufficient rights to be ready by cinder and glance users.

#### Please Follow [Ceph + OpenStack :: Part-3](http://karan-mj.blogspot.fi/2013/12/ceph-openstack-part-3.html) for next step in installation

  

![](http://feeds.feedburner.com/~r/CephStorageNextBigThing/~4/qO1qAHJOOpM)
