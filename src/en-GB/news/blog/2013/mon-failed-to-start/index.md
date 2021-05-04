---
title: "Mon Failed to Start"
date: "2013-08-29"
author: "laurentbarbe"
tags: 
  - "planet"
---

Some common problems when adding a monitor to an existing cluster, for example if config is not found :

```
 $ service ceph start mon.ceph-03
 /etc/init.d/ceph: mon.ceph-03 not found (/etc/ceph/ceph.conf defines osd.2 , /var/lib/ceph defines osd.2)
```

If you do not want to specify a section mon.ceph-03 in ceph.conf, you need to have a file _sysvinit_ in /var/lib/ceph/mon/ceph-ceph-03/

```
$   ls -l /var/lib/ceph/mon/ceph-ceph-03/
total 8
-rw-r--r-- 1 root root   77 août  29 16:56 keyring
drwxr-xr-x 2 root root 4096 août  29 17:03 store.db
```

Just create the file, then it should start :

```
$ touch /var/lib/ceph/mon/ceph-ceph-03/sysvinit
$ service ceph start mon.ceph-03
=== mon.ceph-03 === 
Starting Ceph mon.ceph-03 on ceph-03...
failed: 'ulimit -n 32768;  /usr/bin/ceph-mon -i ceph-03 --pid-file /var/run/ceph/mon.ceph-03.pid -c /etc/ceph/ceph.conf '
Starting ceph-create-keys on ceph-03...
```

Next error on starting monitor, if you have a look to log you can see :

```
$ tail -f ceph-mon.ceph-03.log
mon.ceph-03 does not exist in monmap, will attempt to join an existing cluster
no public_addr or public_network specified, and mon.ceph-03 not present in monmap or ceph.conf
```

You shoud verify, that you do not have ceph-create-keys process that hang, if so you can kill it :

```
$ ps aux | grep create-keys
root      1317  0.1  1.4  36616  7168 pts/0    S    17:13   0:00 /usr/bin/python /usr/sbin/ceph-create-keys -i ceph-03

$ kill 1317
```

Verify that you have defined this mon on the current monmap

```
$  ceph mon dump
dumped monmap epoch 6
epoch 6
fsid e0506c4d-e86a-40a8-8306-4856f9ccb989
last_changed 2013-08-29 16:58:06.145127
created 0.000000
0: 10.2.4.10:6789/0 mon.ceph-01
1: 10.2.4.11:6789/0 mon.ceph-02
2: 10.2.4.12:6789/0 mon.ceph-03
```

You need to retrieve the current monmap and add if for this node :

```
$ ceph mon getmap -o /tmp/monmap
2013-08-29 17:36:36.204257 7f641a54d700  0 -- :/1005682 >> 10.2.4.12:6789/0 pipe(0x2283400 sd=4 :0 s=1 pgs=0 cs=0 l=1 c=0x2283660).fault
got latest monmap

$ ceph-mon -i ceph-03 --inject-monmap /tmp/monmap
```

Try again :

```
$ service ceph start mon.ceph-03
=== mon.ceph-03 === 
Starting Ceph mon.ceph-03 on ceph-03...
Starting ceph-create-keys on ceph-03...
```

It’s seems working fine. You can verify the state of monitor quorum :

```
$ ceph mon stat
e6: 3 mons at {ceph-01=10.2.4.10:6789/0,ceph-02=10.2.4.11:6789/0,ceph-03=10.2.4.12:6789/0}, election epoch 1466, quorum 0,1,2 ceph-01,ceph-02,ceph-03
```

For more information, have a look to the documentation : [http://ceph.com/docs/master/rados/operations/add-or-rm-mons/](http://ceph.com/docs/master/rados/operations/add-or-rm-mons/)
