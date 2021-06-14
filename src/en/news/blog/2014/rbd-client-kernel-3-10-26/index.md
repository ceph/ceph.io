---
title: "RBD Client Kernel 3.10.26"
date: "2014-01-10"
author: "laurentbarbe"
tags: 
  - "planet"
---

I take opportunity to the new kernel release 3.10.26 to advise the person using the client rbd kernel update to this version. Indeed a number of fixes have been applied to this version making use of rbd kernel particularly stable.

[http://kernel.org](http://kernel.org)

Patches applied :

```
Josh Durgin <josh.durgin@inktank.com>
    rbd: fix error handling from rbd_snap_name()

Josh Durgin <josh.durgin@inktank.com>
    rbd: ignore unmapped snapshots that no longer exist

Josh Durgin <josh.durgin@inktank.com>
    rbd: fix use-after free of rbd_dev->disk

Josh Durgin <josh.durgin@inktank.com>
    rbd: make rbd_obj_notify_ack() synchronous

Josh Durgin <josh.durgin@inktank.com>
    rbd: complete notifies before cleaning up osd_client and rbd_dev

Josh Durgin <josh.durgin@inktank.com>
    libceph: add function to ensure notifies are complete

Josh Durgin <josh.durgin@inktank.com>
    rbd: fix null dereference in dout

Josh Durgin <josh.durgin@inktank.com>
    rbd: fix buffer size for writes to images with snapshots

majianpeng <majianpeng@gmail.com>
    ceph: allow sync_read/write return partial successed size of read/write.

majianpeng <majianpeng@gmail.com>
    ceph: fix bugs about handling short-read for sync read mode.

Dan Carpenter <dan.carpenter@oracle.com>
    libceph: create_singlethread_workqueue() doesn't return ERR_PTRs

Dan Carpenter <dan.carpenter@oracle.com>
    libceph: potential NULL dereference in ceph_osdc_handle_map()

Dan Carpenter <dan.carpenter@oracle.com>
    libceph: fix error handling in handle_reply()

majianpeng <majianpeng@gmail.com>
    ceph: Add check returned value on func ceph_calc_ceph_pg.

Dan Carpenter <dan.carpenter@oracle.com>
    ceph: cleanup types in striped_read()

Nathaniel Yazdani <n1ght.4nd.d4y@gmail.com>
    ceph: fix null pointer dereference

Yan, Zheng <zheng.z.yan@intel.com>
    libceph: call r_unsafe_callback when unsafe reply is received

Sasha Levin <sasha.levin@oracle.com>
    ceph: avoid accessing invalid memory

majianpeng <majianpeng@gmail.com>
    ceph: Free mdsc if alloc mdsc->mdsmap failed.

Sage Weil <sage@inktank.com>
    rbd: fix a couple warnings

Yan, Zheng <zheng.z.yan@intel.com>
    libceph: fix truncate size calculation

Yan, Zheng <zheng.z.yan@intel.com>
    libceph: fix safe completion

Alex Elder <elder@inktank.com>
    rbd: protect against concurrent unmaps

Alex Elder <elder@inktank.com>
    rbd: set removing flag while holding list lock

Alex Elder <elder@inktank.com>
    rbd: flush dcache after zeroing page data

Alex Elder <elder@inktank.com>
    libceph: add lingering request reference when registered

Emil Goode <emilgoode@gmail.com>
    ceph: improve error handling in ceph_mdsmap_decode
```

Thank you to the developers.
