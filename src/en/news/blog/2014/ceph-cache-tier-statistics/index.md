---
title: "Ceph: Cache Tier Statistics"
date: "2014-12-15"
author: "shan"
tags: 
---

![Ceph: Cache Tier Statistics](http://sebastien-han.fr/images/ceph-cache-statistics.jpg)

Quick tip on how to retrieve cache statistics from the a cache pool.

  

Simply use the admin socket:

\`\`\`bash $ sudo ceph daemon osd.{id} perf dump ...

```
 "tier_promote": 1425,
 "tier_flush": 0,
 "tier_flush_fail": 0,
 "tier_try_flush": 216,
 "tier_try_flush_fail": 21,
 "tier_evict": 1413,
 "tier_whiteout": 201,
 "tier_dirty": 671,
 "tier_clean": 216,
 "tier_delay": 16,
```

... \`\`\`
