---
title: "How to repair a leveldb database"
date: "2016-11-25"
author: "admin"
tags: 
  - "planet"
---

Repairing a corrupted leveldb database turns out to be simple, but there is no guarantee that the database state after repair will be the same as it was before the corruption occurred!  
  
First, install the [leveldb Python module](https://pypi.python.org/pypi/leveldb), e.g., using pip.  
  
Then, determine the directory path where your leveldb database is stored. For example, the omap of a Ceph (hammer, jewel) OSD is generally stored in /var/lib/ceph/osd/ceph-$ID/current/omap  
  
Finally, run the Python shell and enter the following commands:  
  
$ python  
...  
\>>> import leveldb  
\>>> leveldb.RepairDB('')  
\>>>  
  
That's all.  

Source: Nathan Cutler ([How to repair a leveldb database](http://smithfarm-thebrain.blogspot.com/2016/11/how-to-repair-leveldb-database.html))
