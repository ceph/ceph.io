---
title: "Ceph: activate RBD readahead"
date: "2015-06-03"
author: "shan"
tags: 
  - "planet"
---

![Ceph: activate RBD readhead](http://sebastien-han.fr/images/ceph-rbd-readhead.jpg)

RBD readahead was introduced with Giant.

  

During the boot sequence of a virtual machine if the librbd detects contiguous reads, it will attempt to readahead on the OSDs and fill up the RBD cache with the content. When the OS reads it will get those reads from the librbd cache. Parameters that control the readahead:

```
rbd readahead trigger requests = 10 # number of sequential requests necessary to trigger readahead.
rbd readahead max bytes = 524288 # maximum size of a readahead request, in bytes.
rbd readahead disable after bytes = 52428800
```

  

## Testing procedure

The way I tested this is rather simple, I simply calculated the time it took to SSH into the virtual machine. I ran this test 10 times with and without the readahead in order to get an average value

Execution script:

`bash for i in $(seq 1 10) do nova delete leseb > /dev/null 2>&1 sleep 5 nova boot --flavor m1.small --image 19dab28e-5d13-4d13-9fd4-dbc597fdccb7 leseb > /dev/null 2>&1 time ./checkup.sh 10.0.0.2 22 done`

Checkup script:

\`\`\`bash

# !/bin/bash

host=$1 port=$2 max=1000000 counter=1

while true do python -c "import socket;s = socket.socket(socket.AF\_INET, socket.SOCK\_STREAM);s.connect(('$host', $port))" > /dev/null 2>&1 && break || \\ echo -n "."

if \[\[ ${counter} == ${max} \]\];then

```
  echo "Could not connect"
  exit 1
```

fi (( counter++ )) done \`\`\`

  

## Boot time comparison

At some point, I tried to look at the virtual machine logs and analysed the block size. I was hoping that using a more accurate value for `rbd_readahead_max_bytes` would bring me some befenit. So I queried the admin socket to hopefully get something useful about the reads that happen during the boot sequence:

\`\`\`bash $ sudo ceph --admin-daemon /var/run/ceph/guests/ceph-client.cinder.463407.139639582721120.asok perf dump ... ...

```
    "flush": 0,
    "aio_rd": 5477,
    "aio_rd_bytes": 117972992,
    "aio_rd_latency": {
        "avgcount": 5477,
        "sum": 16.090880101
```

... \`\`\`

Unfortunately I don't see to get anything interesting, ideally I'd have gotten average reads. My last resort is to log every single read entries of the librbd. I used one of [my previous article](http://www.sebastien-han.fr/blog/2015/02/27/analyse-openstack-guest-writes-and-reads-running-on-ceph/) as a reference. Over 9903 reads during the boot sequence, it resulted the average read block size was 98304. I eventually decided to give it a try.

Here are the results:

![Ceph RBD readahead boot time comparison](http://sebastien-han.fr/images/ceph-rbd-readahead-boot-time-comp.jpg)

> My second optimisation attempt was clearly the most successful since we are almost below 23 seconds to boot a virtual machine. In the meantime the default values are not that bad and sound pretty reasonnable. Thus sticking with the default should not be an issue.
