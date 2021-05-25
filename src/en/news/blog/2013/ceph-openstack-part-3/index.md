---
title: "Ceph + OpenStack :: Part-3"
date: "2013-12-05"
author: "syndicated"
tags: 
  - "ceph"
  - "planet"
---

  
  

### Testing OpenStack Cinder + RBD[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "Testing OpenStack Cinder + RBD")

- Creating a cinder volume provided by ceph backend

\[root@rdo /\]#  
\[root@rdo /\]# cinder create --display-name cinder-ceph-vol1 --display-description "first cinder volume on ceph backend" 10  
+---------------------+--------------------------------------+  
|       Property      |                Value                 |  
+---------------------+--------------------------------------+  
|     attachments     |                  \[\]                  |  
|  availability\_zone  |                 nova                 |  
|       bootable      |                false                 |  
|      created\_at     |      2013-11-27T19:35:39.481075      |  
| display\_description | first cinder volume on ceph backend  |  
|     display\_name    |           cinder-ceph-vol1           |  
|          id         | 10cc0855-652a-4a9b-baa1-80bc86dc12ac |  
|       metadata      |                  {}                  |  
|         size        |                  10                  |  
|     snapshot\_id     |                 None                 |  
|     source\_volid    |                 None                 |  
|        status       |               creating               |  
|     volume\_type     |                 None                 |  
+---------------------+--------------------------------------+  
\[root@rdo /\]#  
\[root@rdo /\]#

\[root@rdo /(keystone\_admin)\]# cinder list  
+--------------------------------------+-----------+------------------+------+--------------+----------+-------------+  
| ID | Status | Display Name | Size | Volume Type | Bootable | Attached to |  
+--------------------------------------+-----------+------------------+------+--------------+----------+-------------+  
| 10cc0855-652a-4a9b-baa1-80bc86dc12ac | available | cinder-ceph-vol1 | 5 | ceph-storage | false | |  
| 9671edaa-62c8-4f98-a36c-d6e59612141b | available | boot\_from\_volume | 20 | None | false | |  
+--------------------------------------+-----------+------------------+------+--------------+----------+-------------+  
\[root@rdo /(keystone\_admin)\]#

\[root@rdo /\]#

\[root@rdo /\]# rados lspools  
data  
metadata  
rbd  
ceph-images  
ceph-volumes  
\[root@rdo /\]#  
\[root@rdo /\]#  
\[root@rdo /\]# rbd -p ceph-volumes ls  
volume-10cc0855-652a-4a9b-baa1-80bc86dc12ac  
\[root@rdo /\]#  
  

- Attaching cinder volume to Instance

\[root@rdo /(keystone\_admin)\]# nova list  
+--------------------------------------+------------------+---------+--------------+-------------+---------------------+  
| ID | Name | Status | Task State | Power State | Networks |  
+--------------------------------------+------------------+---------+--------------+-------------+---------------------+  
| 0043a8be-60d1-43ed-ba43-1ccd0bba7559 | instance2 | SHUTOFF | None | Shutdown | public=172.24.4.228 |  
| 9d3c327f-1893-40ff-8a82-16fad9ce6d91 | small-ubuntu | ACTIVE | None | Running | public=172.24.4.230 |  
| 10d1c49f-9fbc-455f-b72d-f731338b2dd5 | small-ubuntu-pwd | ACTIVE | powering-off | Shutdown | public=172.24.4.231 |  
+--------------------------------------+------------------+---------+--------------+-------------+---------------------+  
\[root@rdo /(keystone\_admin)\]#  
  
\[root@rdo /(keystone\_admin)\]# nova show 9d3c327f-1893-40ff-8a82-16fad9ce6d91  
+--------------------------------------+--------------------------------------------------------------------+  
| Property                             | Value                                                              |  
+--------------------------------------+--------------------------------------------------------------------+  
| status                               | ACTIVE                                                             |  
| updated                              | 2013-12-03T15:58:31Z                                               |  
| OS-EXT-STS:task\_state                | None                                                               |  
| OS-EXT-SRV-ATTR:host                 | rdo                                                                |  
| key\_name                             | RDO-admin                                                          |  
| image                                | Ubuntu 12.04 cloudimg amd64 (f61edc8d-c9a1-4ff4-b4fc-c8128bd1a10b) |  
| hostId                               | 4a74aa79a23a084f73f49a4fedba7447c132ab45c4701ed7fbbb2286           |  
| OS-EXT-STS:vm\_state                  | active                                                             |  
| OS-EXT-SRV-ATTR:instance\_name        | instance-00000018                                                  |  
| public network                       | 172.24.4.230                                                       |  
| OS-SRV-USG:launched\_at               | 2013-12-03T08:55:46.000000                                         |  
| OS-EXT-SRV-ATTR:hypervisor\_hostname  | rdo                                                                |  
| flavor                               | m1.small (2)                                                       |  
| id                                   | 9d3c327f-1893-40ff-8a82-16fad9ce6d91                               |  
| security\_groups                      | \[{u'name': u'default'}\]                                            |  
| OS-SRV-USG:terminated\_at             | None                                                               |  
| user\_id                              | 99f8019ba2694d78a680a5de46aa1afd                                   |  
| name                                 | small-ubuntu                                                       |  
| created                              | 2013-12-03T08:55:39Z                                               |  
| tenant\_id                            | 0dafe42cfde242ddbb67b681f59bdb00                                   |  
| OS-DCF:diskConfig                    | MANUAL                                                             |  
| metadata                             | {}                                                                 |  
| os-extended-volumes:volumes\_attached | \[\]                                                                 |  
| accessIPv4                           |                                                                    |  
| accessIPv6                           |                                                                    |  
| progress                             | 0                                                                  |  
| OS-EXT-STS:power\_state               | 1                                                                  |  
| OS-EXT-AZ:availability\_zone          | nova                                                               |  
| config\_drive                         |                                                                    |  
+--------------------------------------+--------------------------------------------------------------------+  
\[root@rdo /(keystone\_admin)\]#  
  
\[root@rdo /(keystone\_admin)\]# virsh list  
 Id    Name                           State  
\---------------------------------------------------- 
 2     instance-00000018              running  
  

\[root@rdo /(keystone\_admin)\]# cat disk.xml  
<disk type='network'>  
 <driver name="qemu" type="raw"/>  
 <source protocol="rbd" name="ceph-volumes/volume-10cc0855-652a-4a9b-baa1-80bc86dc12ac">  
 <host name='192.168.1.38' port='6789'/>  
 <host name='192.168.1.31' port='6789'/>  
 <host name='192.168.1.33' port='6789'/>  
 </source>  
 <target dev="vdf" bus="virtio"/>  
<auth username='volumes'>  
<secret type='ceph' uuid='801a42ec-aec1-3ea8-d869-823c2de56b83'/>  
</auth>  
</disk>  
\[root@rdo /(keystone\_admin)\]#

- Things you should know about this file
    - source name=<ceph\_pool\_name/volume\_name> ## ceph pool that we have created above and its cinder volume
    - host name=<Your\_Monitor\_nodes>
    - auth username=<user\_you\_created\_in\_Ceph\_having\_rights\_to\_pools\_that\_will\_be\_used\_with\_OS> ## we have created 2 users client.volumes and client.images for ceph that will have access to pools for openstack
    - secret uuid=<secret\_generated\_by\_virsh\_secrec\_define\_command> ## refer above that we have generated.

- Attaching disk device to instance

\[root@rdo /(keystone\_admin)\]# virsh attach-device instance-00000018 disk.xml  
Device attached successfully  
\[root@rdo /(keystone\_admin)\]#  

- Now the ceph volume is attached to your openstack instance , you can use this as a regular block disk.

#### [](https://draft.blogger.com/blogger.g?blogID=6067449713794600812)Making integration more seamless[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "Making integration more seamless")

- To allow openstack create and attach ceph volumes using nova / cinder CLI as well as horizon dashboard , we need to add in /etc/nova/nova.conf the following values

rbd\_user=volumes  
rbd\_secret\_uuid=801a42ec-aec1-3ea8-d869-823c2de56b83 

- After updating nova.conf , try creating volume from nova cli and attach to instance

  
\[root@rdo nova(keystone\_admin)\]#  
\[root@rdo nova(keystone\_admin)\]# nova volume-create --display\_name=nova-vol\_1 2  
+---------------------+--------------------------------------+  
| Property | Value |  
+---------------------+--------------------------------------+  
| status | creating |  
| display\_name | nova-vol\_1 |  
| attachments | \[\] |  
| availability\_zone | nova |  
| bootable | false |  
| created\_at | 2013-12-04T14:13:07.265831 |  
| display\_description | None |  
| volume\_type | None |  
| snapshot\_id | None |  
| source\_volid | None |  
| size | 2 |  
| id | 0e2bfced-be6a-44ec-a3ca-22c771c66cdc |  
| metadata | {} |  
+---------------------+--------------------------------------+  
\[root@rdo nova(keystone\_admin)\]#  
  
\[root@rdo nova(keystone\_admin)\]# nova volume-list  
+--------------------------------------+-----------+------------------+------+--------------+-------------+  
| ID | Status | Display Name | Size | Volume Type | Attached to |  
+--------------------------------------+-----------+------------------+------+--------------+-------------+  
| 0e2bfced-be6a-44ec-a3ca-22c771c66cdc | available | nova-vol\_1 | 2 | None | |  
| 9671edaa-62c8-4f98-a36c-d6e59612141b | available | boot\_from\_volume | 20 | None | |  
| 10cc0855-652a-4a9b-baa1-80bc86dc12ac | available | ceph-vol1 | 5 | ceph-storage | |  
+--------------------------------------+-----------+------------------+------+--------------+-------------+  
\[root@rdo nova(keystone\_admin)\]#  
  
\[root@rdo nova(keystone\_admin)\]# nova list  
+--------------------------------------+------------------+---------+--------------+-------------+---------------------+  
| ID | Name | Status | Task State | Power State | Networks |  
+--------------------------------------+------------------+---------+--------------+-------------+---------------------+  
| 0043a8be-60d1-43ed-ba43-1ccd0bba7559 | instance2 | SHUTOFF | None | Shutdown | public=172.24.4.228 |  
| 9d3c327f-1893-40ff-8a82-16fad9ce6d91 | small-ubuntu | ACTIVE | None | Running | public=172.24.4.230 |  
| 10d1c49f-9fbc-455f-b72d-f731338b2dd5 | small-ubuntu-pwd | ACTIVE | powering-off | Shutdown | public=172.24.4.231 |  
+--------------------------------------+------------------+---------+--------------+-------------+---------------------+  
\[root@rdo nova(keystone\_admin)\]#  
  
\[root@rdo nova(keystone\_admin)\]# nova volume-attach 9d3c327f-1893-40ff-8a82-16fad9ce6d91 0e2bfced-be6a-44ec-a3ca-22c771c66cdc /dev/vdi  
+----------+--------------------------------------+  
| Property | Value |  
+----------+--------------------------------------+  
| device | /dev/vdi |  
| serverId | 9d3c327f-1893-40ff-8a82-16fad9ce6d91 |  
| id | 0e2bfced-be6a-44ec-a3ca-22c771c66cdc |  
| volumeId | 0e2bfced-be6a-44ec-a3ca-22c771c66cdc |  
+----------+--------------------------------------+  
\[root@rdo nova(keystone\_admin)\]#  
\[root@rdo nova(keystone\_admin)\]#  
\[root@rdo nova(keystone\_admin)\]# nova volume-list  
+--------------------------------------+-----------+------------------+------+--------------+--------------------------------------+  
| ID | Status | Display Name | Size | Volume Type | Attached to |  
+--------------------------------------+-----------+------------------+------+--------------+--------------------------------------+  
| 0e2bfced-be6a-44ec-a3ca-22c771c66cdc | in-use | nova-vol\_1 | 2 | None | 9d3c327f-1893-40ff-8a82-16fad9ce6d91 |  
| 9671edaa-62c8-4f98-a36c-d6e59612141b | available | boot\_from\_volume | 20 | None | |  
| 10cc0855-652a-4a9b-baa1-80bc86dc12ac | available | ceph-vol1 | 5 | ceph-storage | |  
+--------------------------------------+-----------+------------------+------+--------------+--------------------------------------+  
\[root@rdo nova(keystone\_admin)\]#  
  

####   

#### Please Follow [Ceph + OpenStack :: Part-4](http://karan-mj.blogspot.fi/2013/12/ceph-openstack-part-4.html) for next step in installation

  

  

![](http://feeds.feedburner.com/~r/CephStorageNextBigThing/~4/RXhLM58-oHY)
