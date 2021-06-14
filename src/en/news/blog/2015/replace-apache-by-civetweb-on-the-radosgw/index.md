---
title: "Replace Apache by Civetweb on the RadosGW"
date: "2015-01-27"
author: "laurentbarbe"
tags: 
  - "planet"
---

Since Firefly you can test the use of the lightweight web client Civetweb instead of Apache. To activate it, it’s very simple, there’s nothing to install again, simply add this line to your ceph.conf:

```
[client.radosgw.gateway]
rgw frontends = "civetweb port=80"
...
```

If you have already installed apache, remember to stop it before activating civetweb, or it must not listen on the same port.

Then :

```
/etc/init.d/radosgw restart
```
