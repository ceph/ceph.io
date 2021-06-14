---
title: "Run ceph CLI commands from Python"
date: "2019-03-13"
author: "admin"
tags: 
  - "planet"
---

"mon\_command" is a way to run ceph CLI commands via the librados Python API.  
  

### Which commands can I run?

  
[https://github.com/ceph/ceph/blob/master/src/mon/MonCommands.h](https://github.com/ceph/ceph/blob/master/src/mon/MonCommands.h)  
[https://github.com/ceph/ceph/blob/master/src/mgr/MgrCommands.h](https://github.com/ceph/ceph/blob/master/src/mgr/MgrCommands.h)  
  

### Do you have a sample Python script?

  

#!/usr/bin/python3  
import json  
import rados  
  
def run\_command(cluster\_handle, cmd):  
    return cluster\_handle.mon\_command(json.dumps(cmd), b'', timeout=5)  
  
cluster = rados.Rados(conffile='/etc/ceph/ceph.conf')  
cluster.connect()  
print(run\_command(cluster, {"prefix": "osd safe-to-destroy", "ids": \["2"\], "format": "json"}))  
print(run\_command(cluster, {"prefix": "osd ok-to-stop", "ids": \["2"\], "format": "json"}))  

Source: Nathan Cutler ([Run ceph CLI commands from Python](http://smithfarm-thebrain.blogspot.com/2019/03/run-ceph-cli-commands-from-python.html))
