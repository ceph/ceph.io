---
title: "Change Log Level on the Fly to Ceph Daemons"
date: "2017-01-20"
author: "admin"
tags: 
  - "planet"
---

Aaahhh full disk this morning. Sometimes the logs can go crazy, and the files can quickly reach several gigabytes.

Show debug option (on host) :

```
# Look at log file
tail -n 1000 /var/log/ceph/ceph-osd.33.log

# Check debug levels
ceph daemon osd.33 config show | grep '"debug_'
    "debug_none": "0/5",
    "debug_lockdep": "0/1",
    "debug_context": "0/1",
    "debug_crush": "1/1",
    "debug_mds": "1/5",
    ...
    "debug_filestore": "1/5",
    ...
```

In my case it was about filestore, so “ceph tell” is my friend to apply the new value to the whole cluster (on admin host) :

```
ceph tell osd.* injectargs --debug-filestore 0/5
```

Now you can remove the log file on reopen it :

```
rm /var/log/ceph/ceph-osd.33.log

ceph daemon osd.33 log reopen
```

Then it will remain to be added in the ceph.conf file (on each osd hosts) :

```
[osd]
        debug filestore = 0/5
```

For more information from ceph documentation : [http://docs.ceph.com/docs/master/rados/troubleshooting/log-and-debug/](http://docs.ceph.com/docs/master/rados/troubleshooting/log-and-debug/)

Source: Laurent Barbe ([Change Log Level on the Fly to Ceph Daemons](http://cephnotes.ksperis.com/blog/2017/01/20/change-log-level-on-the-fly-to-ceph-daemons/))
