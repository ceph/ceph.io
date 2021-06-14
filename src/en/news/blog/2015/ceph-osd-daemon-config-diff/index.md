---
title: "Ceph OSD daemon config diff"
date: "2015-06-01"
author: "shan"
tags: 
---

{% img center http://sebastien-han.fr/images/ceph-osd-config-diff.jpg Ceph OSD daemon config diff %}

Quick tip. Simply check the diff between the applied configuration in your `ceph.conf` and the default values on an OSD.

\`\`\`bash $ sudo ceph daemon osd.1 config diff {

```
"diff": {
    "current": {
        "auth_client_required": "cephx",
        "cephx_cluster_require_signatures": "true",
        "cluster_addr": "10.143.114.186:0\/0",
        "cluster_network": "10.143.114.128\/26",
        "filestore_merge_threshold": "40",
        "filestore_op_threads": "8",
        "filestore_split_multiple": "8",
        "fsid": "4a158d27-f750-41d5-9e7f-26ce4c9d2d45",
        "internal_safe_to_start_threads": "true",
        "keyring": "\/var\/lib\/ceph\/osd\/ceph-1\/keyring",
        "leveldb_log": "",
        "log_to_stderr": "false",
        "max_open_files": "131072",
        "osd_journal_size": "10240",
        "osd_max_backfills": "2",
        "osd_op_threads": "8",
        "osd_pool_default_crush_rule": "0",
        "osd_pool_default_min_size": "1",
        "osd_pool_default_pg_num": "128",
        "osd_pool_default_pgp_num": "128",
        "osd_pool_default_size": "2",
        "osd_recovery_max_active": "5",
        "osd_recovery_max_chunk": "1048576",
        "osd_recovery_op_priority": "2",
        "pid_file": "\/var\/run\/ceph\/osd.1.pid",
        "public_addr": "10.143.114.186:0\/0",
        "public_network": "10.143.114.128\/26"
    },
    "defaults": {
        "auth_client_required": "cephx, none",
        "cephx_cluster_require_signatures": "false",
        "cluster_addr": ":\/0",
        "cluster_network": "",
        "filestore_merge_threshold": "10",
        "filestore_op_threads": "2",
        "filestore_split_multiple": "2",
        "fsid": "00000000-0000-0000-0000-000000000000",
        "internal_safe_to_start_threads": "false",
        "keyring": "\/etc\/ceph\/ceph.osd.1.keyring,\/etc\/ceph\/ceph.keyring,\/etc\/ceph\/keyring,\/etc\/ceph\/keyring.bin",
        "leveldb_log": "\/dev\/null",
        "log_to_stderr": "true",
        "max_open_files": "0",
        "osd_journal_size": "5120",
        "osd_max_backfills": "10",
        "osd_op_threads": "2",
        "osd_pool_default_crush_rule": "-1",
        "osd_pool_default_min_size": "0",
        "osd_pool_default_pg_num": "8",
        "osd_pool_default_pgp_num": "8",
        "osd_pool_default_size": "3",
        "osd_recovery_max_active": "15",
        "osd_recovery_max_chunk": "8388608",
        "osd_recovery_op_priority": "10",
        "pid_file": "",
        "public_addr": ":\/0",
        "public_network": ""
    }
},
"unknown": []
```

} \`\`\`
