---
title: "Ceph: monitoring with the Ceph Admin API"
date: "2014-04-14"
author: "shan"
tags: 
  - "planet"
---

![](images/ceph-monitor-with-admin-api.jpg "Ceph: monitoring with the Ceph Admin API")

For quite some time, Ceph has an admin API. This article demonstrates and gives some hints to monitor Ceph.

Check health status:

`bash $ curl localhost:5000/api/v0.1/health HEALTH_OK`

OSD tree:

\`\`\`bash $ curl localhost:5000/api/v0.1/osd/tree

# id weight type name up/down reweight

\-1 2 root default -4 2 datacenter dc -5 2 room laroom -6 2 row larow -3 2 rack lerack -2 2 host ceph 0 1 osd.0 up 1 1 1 osd.1 up 1 \`\`\`

OSD status:

\`\`\`bash $ curl localhost:5000/api/v0.1/osd/stat

```
 osdmap e1371: 2 osds: 2 up, 2 in
```

\`\`\`

Monitors status:

\`\`\`bash $ curl localhost:5000/api/v0.1/mon/stat e3: 1 mons at {1=192.168.251.100:6790/0}, election epoch 1, quorum 0 1

$ curl localhost:5000/api/v0.1/mon\_status {"name":"1","rank":0,"state":"leader","election\_epoch":1,"quorum":\[0\],"outside\_quorum":\[\],"extra\_probe\_peers":\[\],"sync\_provider":\[\],"monmap":{"epoch":3,"fsid":"1c13637d-6c6f-47e3-92ca-3687f9cf9b52","modified":"2013-03-15 16:47:55.482545","created":"2013-03-11 10:33:18.021677","mons":\[{"rank":0,"name":"1","addr":"192.168.251.100:6790\\/0"}\]}} \`\`\`

  

> For a complete API overview please look at: [http://dmsimard.com/2014/01/01/documentation-for-ceph-rest-api/](http://dmsimard.com/2014/01/01/documentation-for-ceph-rest-api/)
