---
title: "v15.2.11 Octopus released"
date: "2021-04-19"
author: "dgalloway"
---

This is the 11th bugfix release in the Octopus stable series. It addresses a security vulnerability in the Ceph authentication framework.  
  
We recommend all Octopus users upgrade.

  
  

## Security Fixes

- This release includes a security fix that ensures the global\_id value (a numeric value that should be unique for every authenticated client or daemon in the cluster) is reclaimed after a network disconnect or ticket renewal in a secure fashion. Two new health alerts may appear during the upgrade indicating that there are clients or daemons that are not yet patched with the appropriate fix.  
      
    To temporarily mute the health alerts around insecure clients for the duration of the upgrade, you may want to:
    
        ceph health mute AUTH\_INSECURE\_GLOBAL\_ID\_RECLAIM 1h
        ceph health mute AUTH\_INSECURE\_GLOBAL\_ID\_RECLAIM\_ALLOWED 1h
    
    For more information, see [CVE-2021-20288\`](https://docs.ceph.com/en/latest/security/CVE-2021-20288/).
