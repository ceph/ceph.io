---
title: "Ceph Pacific:Detecting Configuration Anomalies"
date: "2021-08-30"
author: "Paul Cuzner"
---

The Ceph Pacific release introduces a new feature within the `cephadm` mgr module that makes use of the metadata that each Ceph host provides. The cephadm binary (your friend from the bootstrap process!) implements a `gather-facts` sub-command which examines the host, and assembles relevant metadata. This metadata then allows the orchestrator/cephadm logic to better understand the hosts supporting Ceph services and daemons and provides the basis for detecting configuration anomalies across your Ceph cluster.

You can take a look at the metadata that `gather-facts` generates by simply running the cephadm binary directly, like this;

```console
[cephadmin@c8-node1 ~]# sudo cephadm gather-facts
{
  "arch": "x86_64",
  "bios_date": "04/01/2014",
  "bios_version": "1.14.0-3.fc34",
  "cpu_cores": 1,
  "cpu_count": 4,
  "cpu_load": {
    "15min": 0.79,
    "1min": 0.29,
    "5min": 0.35
  },
  "cpu_model": "Intel Xeon Processor (Cooperlake)",
  "cpu_threads": 1,
  "flash_capacity": "0.0",
  "flash_capacity_bytes": 0,
  "flash_count": 0,
  "flash_list": [],
  "hdd_capacity": "3.3TB",
  "hdd_capacity_bytes": 3341484556288,
  "hdd_count": 4,
.
.
.
```

The cephadm mgr module invokes the `gather-facts` command regularly to maintain a 'picture' of each host’s configuration. Having this data available helps with scheduling decisions, and also presents an opportunity to try and get in front of any configuration anomalies, or drift, that could turn into performance or service impacting events. This is the focus of the **config-check** feature.

Whether the configuration checks are active is determined by the `config_checks_enabled` setting of the cephadm mgr module. By default it’s **disabled**. You can check the state of this setting by running the following command from the cephadm shell;

```console
[ceph: root@c8-node1 /]# ceph config get mgr mgr/cephadm/config_checks_enabled
false
```

Even with the feature disabled, you can see the new commands that this feature introduces with the `ceph cephadm -h` command.

| Command                                        | Description                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| ceph cephadm config-check status               | Show whether the configuration checker feature is enabled/disabled |
| ceph cephadm config-check ls                   | List the available configuration checks and their current state    |
| ceph cephadm config-check disable <check_name> | Disable a specific configuration check                             |
| ceph cephadm config-check enable <check_name>  | Enable a specific configuration check                              |

Some of these checks may make sense within your environment, others may not. The point is, the choice is yours. You can enable/disable the feature with a single command, and pick the checks that make sense to you.

Here’s an example where the software subscription checks, and kernel version consistency checks are disabled.

```console
[ceph: root@c8-node1 /]# ceph cephadm config-check disable os_subscription
ok
[ceph: root@c8-node1 /]# ceph cephadm config-check disable kernel_version
ok
[ceph: root@c8-node1 /]# ceph cephadm config-check ls
NAME             HEALTHCHECK                      STATUS    DESCRIPTION
kernel_security  CEPHADM_CHECK_KERNEL_LSM         enabled   checks SELINUX/Apparmor profiles are consistent across cluster hosts
os_subscription  CEPHADM_CHECK_SUBSCRIPTION       disabled  checks subscription states are consistent for all cluster hosts
public_network   CEPHADM_CHECK_PUBLIC_MEMBERSHIP  enabled   check that all hosts have a NIC on the Ceph public_netork
osd_mtu_size     CEPHADM_CHECK_MTU                enabled   check that OSD hosts share a common MTU setting
osd_linkspeed    CEPHADM_CHECK_LINKSPEED          enabled   check that OSD hosts share a common linkspeed
network_missing  CEPHADM_CHECK_NETWORK_MISSING    enabled   checks that the cluster/public networks defined exist on the Ceph hosts
ceph_release     CEPHADM_CHECK_CEPH_RELEASE       enabled   check for Ceph version consistency - ceph daemons should be on the same
                                                            release (unless upgrade is active)
kernel_version   CEPHADM_CHECK_KERNEL_VERSION     disabled  checks that the MAJ.MIN of the kernel on Ceph hosts is consistent
```

Enabling the config-check feature is simple - just set the config_checks_enabled flag to true, like this;

```console
[ceph: root@c8-node1 /]# ceph config set mgr mgr/cephadm/config_checks_enabled true
[ceph: root@c8-node1 /]# ceph cephadm config-check status
Enabled
```

Now mgr/cephadm can analyse the host metadata automatically, according to the checks you have enabled. Any issues will generate a _"WARN level"_ health alert that you’ll see with `ceph -s`. However, if every enabled check passes, all you'll see is a summary message in the ceph mgr log, like this;

```
CEPHADM 6/8 checks enabled and executed (0 bypassed, 2 disabled). No issues detected
```

If you want to find out more about what the configuration checks do, they’re described [here](https://docs.ceph.com/en/latest/cephadm/operations/)

Not every environment will benefit from this feature, which is why it's disabled by default. However, trying it is simple and you never know - it may find something you weren't expecting! If you try it and decide it's not for you, just set `config_checks_enabled` back to `false`, and you're done.

Maybe you have ideas for new configuration checks, or perhaps ideas for metadata that would help identify other configuration anomalies. If so, we obviously welcome contributions in the form of PR's, but feel free to reach out on <dev@ceph.io> with any questions or ideas. Just prefix the subject of your email with _"orchestrator/cephadm"_.
