---
title: "Map Rbd Kernel Whithout Install Ceph-common"
date: "2014-01-09"
author: "laurentbarbe"
tags: 
  - "planet"
---

It is not mandatory to install Ceph binaries (especially ceph-common) to be able to map a Rbd blocdevice you can also use the kernel path /sys/bus/rbd provided by rbd module.

```
$ modprobe rbd
$ echo "192.168.0.1,192.168.0.2,192.168.0.3 name=admin,secret=AQBG5SlSmLELKBAA6sKvuJyRWUmFl2R5E1ukTw== rbd testrbd" > /sys/bus/rbd/add
```

# Startup rc script

For map rbd on startup and unmap on shutdown you can use this modified rc script [http://cephnotes.ksperis.com/downloads/rbdmap](http://cephnotes.ksperis.com/downloads/rbdmap)

You do not need ceph-common :

```
$  apt-cache policy ceph-common
ceph-common:
  Installed: (none)
  Candidate: 0.67.4-0ubuntu2
  Version table:
     0.67.4-0ubuntu2 0
        500 http://fr.archive.ubuntu.com/ubuntu/ saucy/main amd64 Packages
```

You need to have a ceph.conf file with mon\_host var :

```
$ egrep 'mon[ _]host' /etc/ceph/ceph.conf
mon_host = 192.168.0.1,192.168.0.2,192.168.0.3
```

And /etc/ceph/rbdmap file with this format :

```
$ cat /etc/ceph/rbdmap
rbd/testrbd id=admin,secret=AQBG5SlSmLELKBAA6sKvuJyRWUmFl2R5E1ukTw==
```

Be carefull tu use “id=” and “secret=” (not user, key or keyfile…) Then, download this modify rc script :

```
$ wget http://cephnotes.ksperis.com/downloads/rbdmap -O /etc/init.d/rbdmap
$ chmod +x /etc/init.d/rbdmap
$ update-rc.d rbdmap defaults
```

Test :

```
$ /etc/init.d/rbdmap start
* Starting RBD Mapping             [ OK ]
* Mounting all filesystems...      [ OK ]

$ ls /dev/rbd/*
testrbd

$ /etc/init.d/rbdmap stop
* Stopping RBD Mapping             [ OK ]

$ ls /dev/rbd/*
ls: cannot access /dev/rbd/*: No such file or directory
```
