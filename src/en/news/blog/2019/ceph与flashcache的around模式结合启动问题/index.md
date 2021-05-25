---
title: "ceph与flashcache的around模式结合启动问题"
date: "2019-09-04"
author: "admin"
tags: 
  - "planet"
---

## 问题

通过对我们的启动流程看了下，目前是穿到一个脚本里面的，然后这个脚本是用无限循环的方式去执行一些事情，这个地方不符合松耦合的设计，一个模块做一个事情，两个并不相关的功能不要嵌入另一个脚本，否则出现问题的时候，不好更改不好优化

## 解决方式

首先分析ceph自身的启动方式

ceph的启动方式是通过去enable的一个service的方式这个enable会传入参数，osd的id和osd的fsid，这两个都是集群的定值，也就是每个osd的这块都是各自独立的，所以就是一个总控脚本去通过调用参数的方式进行服务的启动和挂载

那么最佳的处理方式应该也是近似处理，我们做结合启动的时候，先禁用相关的服务，这个后面脚本里面内部会处理，我们先写出来怎么禁用ceph的挂载和启动

```bash
systemctl stop ceph-osd@$osd_id
systemctl disable ceph-osd@$osd_id
systemctl disable ceph-volume@lvm-$osd_id-$osd_dev
umount /var/lib/ceph/osd/ceph-0/
```

上面一个是osd id 一个是fsid  
fsid可以从ceph osd dump|grep osdid获得  
初始部署成功后，机器的上面的磁盘也会打上上面的相关的标签

启动禁止了，开始写我们的启动服务  
我们看下原生的服务

```bash
[root@lab101 ~]# cat /usr/lib/systemd/system/ceph-volume@.service
[Unit]
Description=Ceph Volume activation: %i
After=local-fs.target
Wants=local-fs.target

[Service]
Type=oneshot
KillMode=none
Environment=CEPH_VOLUME_TIMEOUT=10000
ExecStart=/bin/sh -c 'timeout $CEPH_VOLUME_TIMEOUT /usr/sbin/ceph-volume-systemd %i'
TimeoutSec=0

[Install]
WantedBy=multi-user.target
```

我们写我们自己的服务

```bash
[root@lab101 ~]# cat /usr/lib/systemd/system/ceph-volume-flashcache@.service
[Unit]
Description=Ceph flash cache Volume activation: %i
After=local-fs.target
Wants=local-fs.target

[Service]
Type=oneshot
KillMode=none
ExecStart=/bin/sh -c 'timeout 10000 /usr/lib/ceph/ceph-load-flashcache.sh  %i'
TimeoutSec=0

[Install]
WantedBy=multi-user.target
```

这是总控服务，我们传参进去，用加载脚本处理

```bash
[root@lab101 ~]# cat  /usr/lib/ceph/ceph-load-flashcache.sh
#! /usr/bin/sh

startflashcache(){
    ssd_dev=`echo $1|awk -F '--' '{print $1}'`
    osd_id=`echo $1|awk -F '--' '{print $2}'`
    osd_dev=`echo $1|awk -F '--' '{print $3}'`

    echo $ssd_dev
    echo "$osd_id"
    echo "$osd_dev"

    # 先停掉osd
    systemctl disable ceph-volume@lvm-0-bcdb55b0-e95b-4833-8362-18f633782632
    systemctl stop ceph-osd@$osd_id
    systemctl disable ceph-osd@$osd_id
    systemctl disable ceph-volume@lvm-$osd_id-$osd_dev
    # umount osd
    umount /var/lib/ceph/osd/ceph-$osd_id

    #remove 原来的虚拟设备 我们确定arond的
    if [ ! -f "/dev/mapper/$osd_id" ]; then
      dmsetup remove osd$osd_id
      echo "remove old flashcache /dev/mapper/$osd_id"
    fi

    # if osd exit
    ssd_path="/dev/disk/by-partuuid/$ssd_dev"
    osd_lv_path=`lvdisplay |grep $osd_dev |grep "LV Path"|awk '{print $3}'`

    #if path exist
    ls -al $ssd_path
    ls -al $osd_lv_path

    #创建 around flashcache
    flashcache_create -p around osd$osd_id $ssd_path $osd_lv_path

    ls -al  /dev/mapper/osd$osd_id
    flashcache_dev_dm=/dev/`ls -al /dev/mapper/osd0|awk '{print $11}'|cut -d "/" -f 2`

    echo $flashcache_dev_dm

    mount -t tmpfs tmpfs /var/lib/ceph/osd/ceph-$osd_id
    restorecon /var/lib/ceph/osd/ceph-$osd_id
    chown -R ceph:ceph $flashcache_dev_dm
    chown -R ceph:ceph /var/lib/ceph/osd/ceph-$osd_id

    #进入部署流程

    ceph-bluestore-tool --cluster=ceph prime-osd-dir --dev /dev/mapper/osd$osd_id --path /var/lib/ceph/osd/ceph-$osd_id
    ln -snf /dev/mapper/osd$osd_id /var/lib/ceph/osd/ceph-0/block
    chown -h ceph:ceph /var/lib/ceph/osd/ceph-0/block
    chown ceph:ceph -R /var/lib/ceph/osd/ceph-0
    chown -R ceph:ceph /dev/mapper/osd$osd_id
    systemctl start ceph-osd@$osd_id
}

startflashcache $1
```

脚本内容的内容全部是从ceph内部启动流程给剥离出来的，也就是全部按照ceph的自身的启动方式处理，只是加入了flashcache的处理，每次启动前，去掉缓存设备，这个flashcache的arond的模式是每次新加载的

## 怎么用

预制前提是部署好了一个osd  
我们准备添加flashcache  
获取缓存设备的uuid,就是PARTUUID

```bash
[root@lab101 ~]# blkid /dev/sdc1
/dev/sdc1: PARTLABEL="primary" PARTUUID="3b3546e5-65e5-426e-9659-f2e0d37a0895" 
```

获取准备加缓存的osd id

```bash
[root@lab101 ~]# cat /var/lib/ceph/osd/ceph-0/whoami 
0
[root@lab101 ~]# cat /var/lib/ceph/osd/ceph-0/fsid 
bcdb55b0-e95b-4833-8362-18f633782632
```

得到0 和bcdb55b0-e95b-4833-8362-18f633782632

我们写入启动服务

```bash
systemctl enable ceph-volume-flashcache@3b3546e5-65e5-426e-9659-f2e0d37a0895--0--bcdb55b0-e95b-4833-8362-18f633782632.service
```

注意@后面有三个值，第一个是cache盘的uuid，第二个值为0，就是osd的id，第三个值就是osd的fsid，中间用–相连

如果想查询本机做了多少个flashcache的自启动

```bash
[root@lab101 ~]#ls /etc/systemd/system/multi-user.target.wants/ceph-volume-flashcache*
/etc/systemd/system/multi-user.target.wants/ceph-volume-flashcache@3b3546e5-65e5-426e-9659-f2e0d37a0895--0--bcdb55b0-e95b-4833-8362-18f633782632.service
```

执行加缓存的操作

```bash
systemctl start ceph-volume-flashcache@3b3546e5-65e5-426e-9659-f2e0d37a0895--0--bcdb55b0-e95b-4833-8362-18f633782632.service
```

```bash
[root@lab101 ~]# ll /var/lib/ceph/osd/ceph-0
total 24
lrwxrwxrwx. 1 ceph ceph 16 Oct 25 14:13 block -> /dev/mapper/osd0
-rw-------. 1 ceph ceph 37 Oct 25 14:13 ceph_fsid
-rw-------. 1 ceph ceph 37 Oct 25 14:13 fsid
-rw-------. 1 ceph ceph 55 Oct 25 14:13 keyring
-rw-------. 1 ceph ceph  6 Oct 25 14:13 ready
-rw-------. 1 ceph ceph 10 Oct 25 14:13 type
-rw-------. 1 ceph ceph  2 Oct 25 14:13 whoami
```

检查可以看到block的路径变更了

如果想去掉缓存，恢复没有缓存怎么处理，很简单

```bash
systemctl disable ceph-volume-flashcache@3b3546e5-65e5-426e-9659-f2e0d37a0895--0--bcdb55b0-e95b-4833-8362-18f633782632.service
systemctl stop ceph-osd@0
umount /var/lib/ceph/osd/ceph-0

systemctl start ceph-volume@lvm-0-bcdb55b0-e95b-4833-8362-18f633782632
systemctl enable ceph-volume@lvm-0-bcdb55b0-e95b-4833-8362-18f633782632
systemctl start ceph-osd@0
systemctl enable ceph-osd@0
```

## 总结

用这种方式每个osd的服务自己记录自己的，没有配置文件，启动服务就是记录配置的地方，需要就启动，不需要disable，都是通用标准操作  
并且不干扰其它没有配置flashcache的osd

限制

目前这个只适用于arond的模式的，因为这个模式的cache设备是随时可分离的，随时新建，少了很多盘符续用的问题

## 更新历史

| why | when |
| --- | --- |
| 创建 | 2019年09月04日 |
| 更新 | 2019年12月9日 |

Source: zphj1987@gmail ([ceph与flashcache的around模式结合启动问题](http://zphj1987.com/2019/09/04/ceph-with-flashcache-around/))
