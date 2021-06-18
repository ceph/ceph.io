---
title: "Ceph maintenance with Ansible"
date: "2014-04-09"
author: "shan"
tags: 
---

![](images/ceph-maintenance-with-ansible.jpg "Ceph maintenance with Ansible")

Following up this [article](http://www.sebastien-han.fr/blog/2012/08/17/ceph-storage-node-maintenance/).

This playbook was made to automate Ceph servers maintenance. The typical use case is an hardware change. By running this playbook you will set the `noout` flag on your cluster, which means that OSD **can't** be marked as out of the CRUSH map, but they will be marked as down. Thus the OSD will not receive any data. Basically we tell the cluster to do not move any data since the operation will not last for too long.

What does it do?

- It sets the `noout` flag on your Ceph cluster
- Turn off the machine that you want to manage
- Wait for the server to come up again
- Unset the `noout` flag on your Ceph cluster

How to use it:

\`\`\`bash $ ansible-playbook -v maintenance.yml

PLAY \[ceph3\] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*

TASK: \[Set the noout flag\] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* changed: \[ceph3\] => {"changed": true, "cmd": \["ceph", "osd", "set", "noout"\], "delta": "0:00:00.280238", "end": "2014-04-09 17:40:40.101276", "rc": 0, "start": "2014-04-09 17:40:39.821038", "stderr": "set noout", "stdout": ""}

TASK: \[Turn off the server\] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* changed: \[ceph3\] => {"changed": true, "cmd": \["poweroff"\], "delta": "0:00:00.008236", "end": "2014-04-09 17:40:41.385631", "rc": 0, "start": "2014-04-09 17:40:41.377395", "stderr": "", "stdout": ""}

TASK: \[wait for the server to go down (reboot)\] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* ok: \[ceph3\] => {"changed": false, "elapsed": 2, "path": null, "port": 22, "search\_regex": null, "state": "stopped"}

TASK: \[Wait for the server to come up\] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* ok: \[ceph3\] => {"changed": false, "elapsed": 47, "path": null, "port": 22, "search\_regex": null, "state": "started"}

TASK: \[Unset the noout flag\] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* changed: \[ceph3\] => {"changed": true, "cmd": \["ceph", "osd", "unset", "noout"\], "delta": "0:00:00.277196", "end": "2014-04-09 17:41:30.993053", "rc": 0, "start": "2014-04-09 17:41:30.715857", "stderr": "unset noout", "stdout": ""}

PLAY RECAP \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* ceph3 : ok=5 changed=3 unreachable=0 failed=0 \`\`\`

  

> Hope it helps!
