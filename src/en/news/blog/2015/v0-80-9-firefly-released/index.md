---
title: "v0.80.9 Firefly released"
date: "2015-03-10"
author: "sage"
---

This is a bugfix release for firefly. It fixes a performance regression in librbd, an important CRUSH misbehavior (see below), and several RGW bugs. We have also backported support for flock/fcntl locks to ceph-fuse and libcephfs.

We recommend that all Firefly users upgrade.

For more detailed information, see the complete changelog.

### ADJUSTING CRUSH MAPS

- This point release fixes several issues with CRUSH that trigger excessive data migration when adjusting OSD weights. These are most obvious when a very small weight change (e.g., a change from 0 to .01) triggers a large amount of movement, but the same set of bugs can also lead to excessive (though less noticeable) movement in other cases.
    
    However, because the bug may already have affected your cluster, fixing it may trigger movement _back_ to the more correct location. For this reason, you must manually opt-in to the fixed behavior.
    
    In order to set the new tunable to correct the behavior:
    
    ceph osd crush set-tunable straw\_calc\_version 1
    
    Note that this change will have no immediate effect. However, from this point forward, any ‘straw’ bucket in your CRUSH map that is adjusted will get non-buggy internal weights, and that transition may trigger some rebalancing.
    
    You can estimate how much rebalancing will eventually be necessary on your cluster with:
    
      ceph osd getcrushmap -o /tmp/cm
      crushtool -i /tmp/cm --num-rep 3 --test --show-mappings > /tmp/a 2>&1
      crushtool -i /tmp/cm --set-straw-calc-version 1 -o /tmp/cm2
      crushtool -i /tmp/cm2 --reweight -o /tmp/cm2
      crushtool -i /tmp/cm2 --num-rep 3 --test --show-mappings > /tmp/b 2>&1
      wc -l /tmp/a                          # num total mappings
      diff -u /tmp/a /tmp/b | grep -c ^+    # num changed mappings
    
    Divide the total number of lines in /tmp/a with the number of lines
    changed.  We've found that most clusters are under 10%.
    
    You can force all of this rebalancing to happen at once with::
    
      ceph osd crush reweight-all
    
    Otherwise, it will happen at some unknown point in the future when
    CRUSH weights are next adjusted.
    

### NOTABLE CHANGES

- ceph-fuse: flock, fcntl lock support (Yan, Zheng, Greg Farnum)
- crush: fix straw bucket weight calculation, add straw\_calc\_version tunable (#10095 Sage Weil)
- crush: fix tree bucket (Rongzu Zhu)
- crush: fix underflow of tree weights (Loic Dachary, Sage Weil)
- crushtool: add –reweight (Sage Weil)
- librbd: complete pending operations before losing image (#10299 Jason Dillaman)
- librbd: fix read caching performance regression (#9854 Jason Dillaman)
- librbd: gracefully handle deleted/renamed pools (#10270 Jason Dillaman)
- mon: fix dump of chooseleaf\_vary\_r tunable (Sage Weil)
- osd: fix PG ref leak in snaptrimmer on peering (#10421 Kefu Chai)
- osd: handle no-op write with snapshot (#10262 Sage Weil)
- radosgw-admin: create subuser when creating user (#10103 Yehuda Sadeh)
- rgw: change multipart uplaod id magic (#10271 Georgio Dimitrakakis, Yehuda Sadeh)
- rgw: don’t overwrite bucket/object owner when setting ACLs (#10978 Yehuda Sadeh)
- rgw: enable IPv6 for embedded civetweb (#10965 Yehuda Sadeh)
- rgw: fix partial swift GET (#10553 Yehuda Sadeh)
- rgw: fix quota disable (#9907 Dong Lei)
- rgw: index swift keys appropriately (#10471 Hemant Burman, Yehuda Sadeh)
- rgw: make setattrs update bucket index (#5595 Yehuda Sadeh)
- rgw: pass civetweb configurables (#10907 Yehuda Sadeh)
- rgw: remove swift user manifest (DLO) hash calculation (#9973 Yehuda Sadeh)
- rgw: return correct len for 0-len objects (#9877 Yehuda Sadeh)
- rgw: S3 object copy content-type fix (#9478 Yehuda Sadeh)
- rgw: send ETag on S3 object copy (#9479 Yehuda Sadeh)
- rgw: send HTTP status reason explicitly in fastcgi (Yehuda Sadeh)
- rgw: set ulimit -n from sysvinit (el6) init script (#9587 Sage Weil)
- rgw: update swift subuser permission masks when authenticating (#9918 Yehuda Sadeh)
- rgw: URL decode query params correctly (#10271 Georgio Dimitrakakis, Yehuda Sadeh)
- rgw: use attrs when reading object attrs (#10307 Yehuda Sadeh)
- rgw: use rn for http headers (#9254 Benedikt Fraunhofer, Yehuda Sadeh)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.80.9.tar.gz](http://ceph.com/download/ceph-0.80.9.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
