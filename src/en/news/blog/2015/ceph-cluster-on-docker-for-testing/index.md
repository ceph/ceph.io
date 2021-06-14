---
title: "Ceph cluster on Docker for testing"
date: "2015-08-24"
author: "shan"
tags: 
---

{% img center http://sebastien-han.fr/images/ceph-docker-demo.jpg Ceph cluster on Docker for testing %}

I haven't advertised this one really much (even if I've been using it in some articles). Since people are still wondering how to quickly get a full Ceph cluster up and running for testing, I believe it deserves its own article so it will get more visibility. Re-introducing the [Ceph demo container](https://github.com/ceph/ceph-docker/tree/master/demo). This is going to be a really short article :).

  

It is fairly easy to get up and running. Obviously you need to have Docker installed. Since we will be using `--net=host` option to directly plug the daemons on the host interface, you will need to select the IP address.

```
$ ip -4 a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    inet 192.168.0.69/24 brd 192.168.0.255 scope global dynamic eth0
       valid_lft 97sec preferred_lft 97sec
3: docker0@NONE: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UNKNOWN group default
    inet 172.17.42.1/16 scope global docker0
       valid_lft forever preferred_lft forever
```

For me, this going to be `192.168.0.69`. Now let's run the container:

```
$ sudo docker run -d --net=host -v /etc/ceph:/etc/ceph -e MON_IP=192.168.0.69 -e CEPH_NETWORK=192.168.0.0/24 ceph/demo
d3e4ead6c0ba4606201f9f861bd960f4c6d9376d6686714664489540b2843ce0
```

Check that the container is up and running:

```
$ sudo docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
098fa6c045f2        ceph/demo:latest    "/entrypoint.sh"    5 seconds ago       Up 3 seconds                            desperate_yonath

$ sudo docker exec 098fa6c045f2 ceph -s
    cluster d6b3670d-5cb1-4280-bb09-78ffc40afed1
     health HEALTH_OK
     monmap e1: 1 mons at {atomic1=192.168.0.69:6789/0}
            election epoch 2, quorum 0 atomic1
     mdsmap e5: 1/1/1 up {0=0=up:active}
     osdmap e16: 1 osds: 1 up, 1 in
      pgmap v19: 120 pgs, 8 pools, 2810 bytes data, 63 objects
            7081 MB used, 4124 MB / 11206 MB avail
                 120 active+clean
  client io 11271 B/s rd, 1056 B/s wr, 30 op/s
```

Thanks to this container you will get all the Ceph daemons up and running:

- 1 monitor
- 1 object storage daemon
- 1 metadata server
- 1 rados gateway

All the ports will automatically get exposed, so you can access all the services really easily.

  

> It looks like you do not have any more excuses now to try out Ceph :-).
