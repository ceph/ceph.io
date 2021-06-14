---
title: "Manual bootstrap of a Ceph MON on Ubuntu 14.04"
date: "2014-10-14"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

A [Ceph](http://ceph.com/) MON can be created and run manually for test purposes on Ubuntu-14.04 with:

$ sudo apt-get install ceph
$ cat > /etc/ceph/ceph.conf <<EOF
\[global\]
fsid = $(uuidgen)
mon\_host = 127.0.0.1
auth\_cluster\_required = none
auth\_service\_required = none
auth\_client\_required = none
filestore\_xattr\_use\_omap = true
EOF
$ sudo ceph-mon --cluster ceph --mkfs -i a --keyring /dev/null
ceph-mon: mon.noname-a 127.0.0.1:6789/0 is local, renaming to mon.a
ceph-mon: set fsid to 80562a76-f13e-4b1e-8fd1-de8f774f2683
ceph-mon: created monfs at /var/lib/ceph/mon/ceph-a for mon.a
$ sudo ceph-mon -i a

the cluster is not healthy because it has no OSD but it is available:

    cluster 1b5ef3ac-be8c-4658-8568-bd090b534b19
     health HEALTH\_ERR 192 pgs stuck inactive; 192 pgs stuck unclean; no osds
     monmap e1: 1 mons at {a=127.0.0.1:6789/0}, election epoch 2, quorum 0 a
     osdmap e1: 0 osds: 0 up, 0 in
      pgmap v2: 192 pgs, 3 pools, 0 bytes data, 0 objects
            0 kB used, 0 kB / 0 kB avail
                 192 creating
