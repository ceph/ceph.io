---
title: "Ceph + OpenStack :: Part-5"
date: "2013-12-05"
author: "syndicated"
tags: 
  - "ceph"
  - "planet"
---

  
  

### OpenStack Instance boot from Ceph Volume[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "OpenStack Instance boot from Ceph Volume")

- For a list of images to choose from to create a bootable volume

\[root@rdo /(keystone\_admin)\]# nova image-list  
+--------------------------------------+-----------------------------+--------+--------+  
| ID                                   | Name                        | Status | Server |  
+--------------------------------------+-----------------------------+--------+--------+  
| f61edc8d-c9a1-4ff4-b4fc-c8128bd1a10b | Ubuntu 12.04 cloudimg amd64 | ACTIVE |        |  
| fcc07414-bbb3-4473-a8df-523664c8c9df | ceph-glance-image           | ACTIVE |        |  
| be62a5bf-879f-4d1f-846c-fdef960224ff | precise-cloudimg.raw        | ACTIVE |        |  
| 3c2db0ad-8d1e-400d-ba13-a506448f2a8e | precise-server-cloudimg     | ACTIVE |        |  
+--------------------------------------+-----------------------------+--------+--------+  
\[root@rdo /(keystone\_admin)\]#  

- To create a bootable volume from an image, include the image ID in the command: Before the volume builds, its bootable state is false.

\[root@rdo qemu(keystone\_admin)\]# cinder create --image-id be62a5bf-879f-4d1f-846c-fdef960224ff --display-name my-boot-vol 10  
+---------------------+--------------------------------------+  
|       Property      |                Value                 |  
+---------------------+--------------------------------------+  
|     attachments     |                  \[\]                  |  
|  availability\_zone  |                 nova                 |  
|       bootable      |                false                 |  
|      created\_at     |      2013-12-05T13:34:38.296723      |  
| display\_description |                 None                 |  
|     display\_name    |             my-boot-vol              |  
|          id         | 5fca6e1b-b494-4773-9c78-63f72703bfdf |  
|       image\_id      | be62a5bf-879f-4d1f-846c-fdef960224ff |  
|       metadata      |                  {}                  |  
|         size        |                  10                  |  
|     snapshot\_id     |                 None                 |  
|     source\_volid    |                 None                 |  
|        status       |               creating               |  
|     volume\_type     |                 None                 |  
+---------------------+--------------------------------------+  
\[root@rdo qemu(keystone\_admin)\]#  
\[root@rdo qemu(keystone\_admin)\]# cinder list  
+--------------------------------------+-------------+--------------+------+--------------+----------+--------------------------------------+  
|                  ID                  |    Status   | Display Name | Size | Volume Type  | Bootable |             Attached to              |  
+--------------------------------------+-------------+--------------+------+--------------+----------+--------------------------------------+  
| 0e2bfced-be6a-44ec-a3ca-22c771c66cdc |    in-use   |  nova-vol\_1  |  2   |     None     |  false   | 9d3c327f-1893-40ff-8a82-16fad9ce6d91 |  
| 10cc0855-652a-4a9b-baa1-80bc86dc12ac |  available  |  ceph-vol1   |  5   | ceph-storage |  false   |                                      |  
| 5fca6e1b-b494-4773-9c78-63f72703bfdf | downloading | my-boot-vol  |  10  |     None     |  false   |                                      |  
+--------------------------------------+-------------+--------------+------+--------------+----------+--------------------------------------+  
  

- Wait for few minutes the bootable state turns to true. Copy the value in the ID field for your volume.

\[root@rdo qemu(keystone\_admin)\]# cinder list  
+--------------------------------------+-----------+--------------+------+--------------+----------+--------------------------------------+  
|                  ID                  |   Status  | Display Name | Size | Volume Type  | Bootable |             Attached to              |  
+--------------------------------------+-----------+--------------+------+--------------+----------+--------------------------------------+  
| 0e2bfced-be6a-44ec-a3ca-22c771c66cdc |   in-use  |  nova-vol\_1  |  2   |     None     |  false   | 9d3c327f-1893-40ff-8a82-16fad9ce6d91 |  
| 10cc0855-652a-4a9b-baa1-80bc86dc12ac | available |  ceph-vol1   |  5   | ceph-storage |  false   |                                      |  
| 5fca6e1b-b494-4773-9c78-63f72703bfdf | available | my-boot-vol  |  10  |     None     |   true   |                                      |  
+--------------------------------------+-----------+--------------+------+--------------+----------+--------------------------------------+  
\[root@rdo qemu(keystone\_admin)\]#  

- Create a nova instance which will be boot from ceph volume

\[root@rdo qemu(keystone\_admin)\]# nova boot --flavor 2 --image be62a5bf-879f-4d1f-846c-fdef960224ff --block\_device\_mapping vda=5fca6e1b-b494-4773-9c78-63f72703bfdf::0 --security\_groups=default --nic net-id=4fe5909e-02db-4517-89f2-1278248fa26c  myInstanceFromVolume  
+--------------------------------------+--------------------------------------+  
| Property                             | Value                                |  
+--------------------------------------+--------------------------------------+  
| OS-EXT-STS:task\_state                | scheduling                           |  
| image                                | precise-cloudimg.raw                 |  
| OS-EXT-STS:vm\_state                  | building                             |  
| OS-EXT-SRV-ATTR:instance\_name        | instance-0000001e                    |  
| OS-SRV-USG:launched\_at               | None                                 |  
| flavor                               | m1.small                             |  
| id                                   | f24a0b29-9f1e-444b-b895-c3c694f2f1bc |  
| security\_groups                      | \[{u'name': u'default'}\]              |  
| user\_id                              | 99f8019ba2694d78a680a5de46aa1afd     |  
| OS-DCF:diskConfig                    | MANUAL                               |  
| accessIPv4                           |                                      |  
| accessIPv6                           |                                      |  
| progress                             | 0                                    |  
| OS-EXT-STS:power\_state               | 0                                    |  
| OS-EXT-AZ:availability\_zone          | nova                                 |  
| config\_drive                         |                                      |  
| status                               | BUILD                                |  
| updated                              | 2013-12-05T13:47:34Z                 |  
| hostId                               |                                      |  
| OS-EXT-SRV-ATTR:host                 | None                                 |  
| OS-SRV-USG:terminated\_at             | None                                 |  
| key\_name                             | None                                 |  
| OS-EXT-SRV-ATTR:hypervisor\_hostname  | None                                 |  
| name                                 | myInstanceFromVolume                 |  
| adminPass                            | qt34izQiLkG3                         |  
| tenant\_id                            | 0dafe42cfde242ddbb67b681f59bdb00     |  
| created                              | 2013-12-05T13:47:34Z                 |  
| os-extended-volumes:volumes\_attached | \[\]                                   |  
| metadata                             | {}                                   |  
+--------------------------------------+--------------------------------------+  
\[root@rdo qemu(keystone\_admin)\]#  
\[root@rdo qemu(keystone\_admin)\]#  
\[root@rdo qemu(keystone\_admin)\]#  
\[root@rdo qemu(keystone\_admin)\]# nova list  
+--------------------------------------+----------------------+---------+------------+-------------+---------------------+  
| ID                                   | Name                 | Status  | Task State | Power State | Networks            |  
+--------------------------------------+----------------------+---------+------------+-------------+---------------------+  
| 0043a8be-60d1-43ed-ba43-1ccd0bba7559 | instance2            | SHUTOFF | None       | Shutdown    | public=172.24.4.228 |  
| f24a0b29-9f1e-444b-b895-c3c694f2f1bc | myInstanceFromVolume | BUILD   | spawning   | NOSTATE     | private=10.0.0.3    |  
| 9d3c327f-1893-40ff-8a82-16fad9ce6d91 | small-ubuntu         | ACTIVE  | None       | Running     | public=172.24.4.230 |  
+--------------------------------------+----------------------+---------+------------+-------------+---------------------+  
\[root@rdo qemu(keystone\_admin)\]#  

- Just in few minutes the instance starts RUNNING , time for a party now

\[root@rdo qemu(keystone\_admin)\]# nova list  
+--------------------------------------+----------------------+---------+------------+-------------+---------------------+  
| ID                                   | Name                 | Status  | Task State | Power State | Networks            |  
+--------------------------------------+----------------------+---------+------------+-------------+---------------------+  
| 0043a8be-60d1-43ed-ba43-1ccd0bba7559 | instance2            | SHUTOFF | None       | Shutdown    | public=172.24.4.228 |  
| f24a0b29-9f1e-444b-b895-c3c694f2f1bc | myInstanceFromVolume | ACTIVE  | None       | Running     | private=10.0.0.3    |  
| 9d3c327f-1893-40ff-8a82-16fad9ce6d91 | small-ubuntu         | ACTIVE  | None       | Running     | public=172.24.4.230 |  
+--------------------------------------+----------------------+---------+------------+-------------+---------------------+  
\[root@rdo qemu(keystone\_admin)\]#  

#### [](https://draft.blogger.com/blogger.g?blogID=6067449713794600812)OpenStack Instance boot from Ceph Volume :: Troubleshooting[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "OpenStack Instance boot from Ceph Volume :: Troubleshooting")

  

- During boot from volume , i encountered some errors after creating nova instance. The image was not able to get booted up from volume

\[root@rdo nova(keystone\_admin)\]# nova boot --flavor 2 --image be62a5bf-879f-4d1f-846c-fdef960224ff --block\_device\_mapping vda=dd315dda-b22a-4cf8-8b77-7c2b2f163155:::0 --security\_groups=default --nic net-id=4fe5909e-02db-4517-89f2-1278248fa26c  myInstanceFromVolume  
+--------------------------------------+----------------------------------------------------+  
| Property                             | Value                                              |  
+--------------------------------------+----------------------------------------------------+  
| OS-EXT-STS:task\_state                | scheduling                                         |  
| image                                | precise-cloudimg.raw                               |  
| OS-EXT-STS:vm\_state                  | building                                           |  
| OS-EXT-SRV-ATTR:instance\_name        | instance-0000001d                                  |  
| OS-SRV-USG:launched\_at               | None                                               |  
| flavor                               | m1.small                                           |  
| id                                   | f324e9b8-ec3a-4174-8b97-bf78dba62932               |  
| security\_groups                      | \[{u'name': u'default'}\]                            |  
| user\_id                              | 99f8019ba2694d78a680a5de46aa1afd                   |  
| OS-DCF:diskConfig                    | MANUAL                                             |  
| accessIPv4                           |                                                    |  
| accessIPv6                           |                                                    |  
| progress                             | 0                                                  |  
| OS-EXT-STS:power\_state               | 0                                                  |  
| OS-EXT-AZ:availability\_zone          | nova                                               |  
| config\_drive                         |                                                    |  
| status                               | BUILD                                              |  
| updated                              | 2013-12-05T12:42:22Z                               |  
| hostId                               |                                                    |  
| OS-EXT-SRV-ATTR:host                 | None                                               |  
| OS-SRV-USG:terminated\_at             | None                                               |  
| key\_name                             | None                                               |  
| OS-EXT-SRV-ATTR:hypervisor\_hostname  | None                                               |  
| name                                 | myInstanceFromVolume                               |  
| adminPass                            | eish5pu56CiE                                       |  
| tenant\_id                            | 0dafe42cfde242ddbb67b681f59bdb00                   |  
| created                              | 2013-12-05T12:42:21Z                               |  
| os-extended-volumes:volumes\_attached | \[{u'id': u'dd315dda-b22a-4cf8-8b77-7c2b2f163155'}\] |  
| metadata                             | {}                                                 |  
+--------------------------------------+----------------------------------------------------+  
\[root@rdo nova(keystone\_admin)\]#  
\[root@rdo nova(keystone\_admin)\]#  
\[root@rdo nova(keystone\_admin)\]#  
\[root@rdo nova(keystone\_admin)\]# nova list  
+--------------------------------------+----------------------+---------+------------+-------------+---------------------+  
| ID                                   | Name                 | Status  | Task State | Power State | Networks            |  
+--------------------------------------+----------------------+---------+------------+-------------+---------------------+  
| 0043a8be-60d1-43ed-ba43-1ccd0bba7559 | instance2            | SHUTOFF | None       | Shutdown    | public=172.24.4.228 |  
| f324e9b8-ec3a-4174-8b97-bf78dba62932 | myInstanceFromVolume | ERROR   | None       | NOSTATE     | private=10.0.0.3    |  
| 9d3c327f-1893-40ff-8a82-16fad9ce6d91 | small-ubuntu         | ACTIVE  | None       | Running     | public=172.24.4.230 |  
+--------------------------------------+----------------------+---------+------------+-------------+---------------------+  
\[root@rdo nova(keystone\_admin)\]#  

- After checking up logs from /var/log/libvirt/qemu/instance-0000001d.log

qemu-kvm: -drive file=rbd:ceph-volumes/volume-dd315dda-b22a-4cf8-8b77-7c2b2f163155:id=volumes:key=AQC804xS8HzFJxAAD/zzQ8LMzq9wDLq/5a472g==:auth\_supported=cephx\\;none:mon\_host=192.168.1.31\\:6789\\;192.168.1.33\\:6789\\;192.168.1.38\\:6789,if=none,id=drive-virtio-disk0,format=raw,serial=dd315dda-b22a-4cf8-8b77-7c2b2f163155,cache=none: could not open disk image rbd:ceph-volumes/volume-dd315dda-b22a-4cf8-8b77-7c2b2f163155:id=volumes:key=AQC804xS8HzFJxAAD/zzQ8LMzq9wDLq/5a472g==:auth\_supported=cephx\\;none:mon\_host=192.168.1.31\\:6789\\;192.168.1.33\\:6789\\;192.168.1.38\\:6789: No such file or directory  
2013-12-05 12:42:29.544+0000: shutting down  

- Run qemu-img -h command to check for the supported format , here i found rbd format is not supported by qemu , so there is something fishy in this

Supported formats: raw cow qcow vdi vmdk cloop dmg bochs vpc vvfat qcow2 qed vhdx parallels nbd blkdebug host\_cdrom host\_floppy host\_device file gluster gluster gluster gluster  

- Check the installed qemu version

\[root@rdo qemu(keystone\_admin)\]# rpm -qa | grep -i qemu  
qemu-img-0.12.1.2-2.415.el6\_5.3.x86\_64  
qemu-guest-agent-0.12.1.2-2.415.el6\_5.3.x86\_64  
gpxe-roms-qemu-0.9.7-6.10.el6.noarch  
qemu-kvm-0.12.1.2-2.415.el6\_5.3.x86\_64  
qemu-kvm-tools-0.12.1.2-2.415.el6\_5.3.x86\_64  
\[root@rdo qemu(keystone\_admin)\]#  

- Have a look on previous post to see the installation of correct version of qemu . After this your nova instance should boot from volume

  

  

\[root@rdo qemu(keystone\_admin)\]# rpm -qa | grep -i qemu  
qemu-img-0.12.1.2-2.355.el6.2.cuttlefish.async.x86\_64  
qemu-guest-agent-0.12.1.2-2.355.el6.2.cuttlefish.async.x86\_64  
qemu-kvm-0.12.1.2-2.355.el6.2.cuttlefish.async.x86\_64  
gpxe-roms-qemu-0.9.7-6.10.el6.noarch  
qemu-kvm-tools-0.12.1.2-2.355.el6.2.cuttlefish.async.x86\_64  
\[root@rdo qemu(keystone\_admin)\]#  
  
\[root@rdo /(keystone\_admin)\]# qemu-img -h | grep -i rbd  
Supported formats: raw cow qcow vdi vmdk cloop dmg bochs vpc vvfat qcow2 qed parallels nbd blkdebug host\_cdrom host\_floppy host\_device file rbd  
\[root@rdo /(keystone\_admin)\]#  
  
  
\[root@rdo qemu(keystone\_admin)\]# nova list  
+--------------------------------------+----------------------+---------+------------+-------------+---------------------+  
| ID                                   | Name                 | Status  | Task State | Power State | Networks            |  
+--------------------------------------+----------------------+---------+------------+-------------+---------------------+  
| 0043a8be-60d1-43ed-ba43-1ccd0bba7559 | instance2            | SHUTOFF | None       | Shutdown    | public=172.24.4.228 |  
| f24a0b29-9f1e-444b-b895-c3c694f2f1bc | myInstanceFromVolume | ACTIVE  | None       | Running     | private=10.0.0.3    |  
| 9d3c327f-1893-40ff-8a82-16fad9ce6d91 | small-ubuntu         | ACTIVE  | None       | Running     | public=172.24.4.230 |  
+--------------------------------------+----------------------+---------+------------+-------------+---------------------+  
\[root@rdo qemu(keystone\_admin)\]#  

  

![](http://feeds.feedburner.com/~r/CephStorageNextBigThing/~4/gpo73P7F-B0)
