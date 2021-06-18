---
title: "Remove Pool Without Name"
date: "2014-10-29"
author: "laurentbarbe"
tags: 
---

For exemple :

```
# rados lspools
data
metadata
rbd
                            <---- ?????
.eu.rgw.root
.eu-west-1.domain.rgw
.eu-west-1.rgw.root
.eu-west-1.rgw.control
.eu-west-1.rgw.gc
.eu-west-1.rgw.buckets.index
.eu-west-1.rgw.buckets
.eu-west-1.log


# ceph osd dump | grep "pool 4 "
pool 4 '' replicated size 2 min_size 1 crush_ruleset 0 object_hash rjenkins pg_num 8 pgp_num 8 last_change 1668 stripe_width 0

# rados rmpool "" "" --yes-i-really-really-mean-it
successfully deleted pool
```
