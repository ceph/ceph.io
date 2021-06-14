---
title: "v14.2.20 Nautilus released"
date: "2021-04-19"
author: "dgalloway"
---

This is the 20th bugfix release in the Nautilus stable series. It addresses a security vulnerability in the Ceph authentication framework.  
  
We recommend all Nautilus users upgrade.

  
  

## Security Fixes[¶](#notable-changes "Permalink to this headline")

- This release includes a security fix that ensures the global\_id value (a numeric value that should be unique for every authenticated client or daemon in the cluster) is reclaimed after a network disconnect or ticket renewal in a secure fashion. Two new health alerts may appear during the upgrade indicating that there are clients or daemons that are not yet patched with the appropriate fix.  
      
    It is possible to disable the health alerts around insecure clients:
    
        ceph config set mon mon\_warn\_on\_insecure\_global\_id\_reclaim false
        ceph config set mon mon\_warn\_on\_insecure\_global\_id\_reclaim\_allowed false
    
    However, if you disable these alerts, we strongly recommend that you follow up by removing these settings after clients have been upgraded or after upgrading to Octopus. (Starting in Octopus, these health alerts can be muted for a specific period of time.)  
      
    For more information, see [CVE-2021-20288](https://docs.ceph.com/en/latest/security/CVE-2021-20288/).
