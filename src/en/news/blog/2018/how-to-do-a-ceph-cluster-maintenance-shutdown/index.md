---
title: "How to do a Ceph cluster maintenance/shutdown"
date: "2018-02-19"
author: "admin"
tags: 
  - "planet"
---

The following summarize the steps that are necessary to shutdown a Ceph cluster for maintenance.

1. Stop the clients from using your Cluster _(this step is only necessary if you want to shutdown your whole cluster)_
    
2. **Important** - Make sure that your cluster is in a healthy state before proceeding
    
3. Now you have to set some OSD flags:
    
    \# ceph osd set noout
    # ceph osd set nobackfill
    # ceph osd set norecover
    
    Those flags should be totally sufficient to safely powerdown your cluster but you
    could also set the following flags on top if you would like to pause your cluster completely::
    
    # ceph osd set norebalance
    # ceph osd set nodown
    # ceph osd set pause
    
    ## Pausing the cluster means that you can't see when OSDs come
    back up again and no map update will happen
    
4. Shutdown your service nodes one by one
    
5. Shutdown your OSD nodes one by one
    
6. Shutdown your monitor nodes one by one
    
7. Shutdown your admin node
    

After maintenance just do everything mentioned above in reverse order.

Source: SUSE ([How to do a Ceph cluster maintenance/shutdown](http://openattic.org/posts/how-to-do-a-ceph-cluster-maintenanceshutdown/))
