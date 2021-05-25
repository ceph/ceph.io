---
title: "Set Tunables Optimal on Ceph Crushmap"
date: "2014-01-16"
author: "laurentbarbe"
tags: 
  - "planet"
---

Il you just upgrade to Ceph 0.75, you can see this message :

$ ceph health HEALTH\_WARN crush map has non-optimal tunables

For more explanation, everything is explained in the documentation: [http://ceph.com/docs/master/rados/operations/crush-map/#warning-when-tunables-are-non-optimal](http://ceph.com/docs/master/rados/operations/crush-map/#warning-when-tunables-are-non-optimal)

Before doing this, read the documentation !

```
$ ceph osd crush tunables optimal
```

Verify the change in the crushmap :

```
$ ceph osd getcrushmap -o crushmap_optimal.bin
got crush map from osdmap epoch 186

$ crushtool -d crushmap_optimal.bin -o crushmap_optimal.txt

$ head -n6 crushmap_optimal.txt
# begin crush map
tunable choose_local_tries 0
tunable choose_local_fallback_tries 0
tunable choose_total_tries 50
tunable chooseleaf_descend_once 1
```

For more details about these options, you can look at the docmention : [http://ceph.com/docs/master/rados/operations/crush-map/#crush-tunables](http://ceph.com/docs/master/rados/operations/crush-map/#crush-tunables)

> \- choose\_local\_tries: Number of local retries. Legacy value is 2, optimal value is 0. 
> \- choose\_local\_fallback\_tries: Legacy value is 5, optimal value is 0. 
> \- choose\_total\_tries: Total number of attempts to choose an item. Legacy value was 19, subsequent testing indicates that a value of 50 is more appropriate for typical clusters. For extremely large clusters, a larger value might be necessary.  
> \- chooseleaf\_descend\_once: Whether a recursive chooseleaf attempt will retry, or only try once and allow the original placement to retry. Legacy default is 0, optimal value is 1.

Note that, before update the crushmap you must ensure that clients are compatible with these options. For example, an incompatible kernel will cause “feature set mismatch” in kernel logs. If you dont want to enable optimal tunables, you can disable this warning with the option `mon warn on legacy crush tunables = false` in \[mon\] section in ceph.conf.
