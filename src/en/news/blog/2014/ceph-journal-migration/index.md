---
title: "Ceph Journal Migration"
date: "2014-06-29"
author: "laurentbarbe"
tags: 
  - "planet"
---

An exemple for migrating journal from file on the default location to a dedicated partition on /dev/sde1.

```
$ apt-get install hdparm

### Stop osd
$ service ceph stop osd.0

### Flush Journal
$ ceph-osd --flush-journal -i 0

### Create symlink to partition
$ rm /var/lib/ceph/osd/ceph-0/journal
$ ln -s /dev/sde1 /var/lib/ceph/osd/ceph-0/journal

### Create new journal
$ ceph-osd --mkjournal -i 0
$ service ceph start osd.0
```
