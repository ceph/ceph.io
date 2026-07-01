---
title: "Recover the Ceph Monitor Store Using OSDs"
date: "2026-07-04"
author: "Eugen Block, crossposted by Anthony D'Atri"
categories: "mon"
image: "images/splash.jpg"
tags:
  - "ceph"
  - "mon"
  - "recovery"
---

## Introduction

A few weeks ago I helped a Ceph user to recover his broken cluster (see [this thread](https://lists.ceph.io/hyperkitty/list/ceph-users@ceph.io/thread/4Q6JK65M72MHUWUHVRITQKXNLQTKDH6I/)).
Basically, after his Monitors stopped working he re-deployed a new cluster with the
same Ceph FSID and attached the existing OSDs to the re-deployed hosts. But it’s not
that easy to re-activate those OSDs because the new Monitors don’t have the old osdmap,
hence they don’t know anything about the existing OSDs. So how did we fix that?

This scenario can be considered a total Monitor store failure. There’s a [documented procedure](https://docs.ceph.com/en/latest/rados/troubleshooting/troubleshooting-mon/#recovery-using-osds)
in the upstream docs, unfortunately it’s written for non-cephadm clusters and doesn’t contain many details about subsequent steps.
When Ceph daemons run within containers there are more things to consider.
So I decided to write this blog post and add some more details to the procedure,
targeting mainly clusters managed by [cephadm](https://docs.ceph.com/en/latest/cephadm/).
But the recovery procedure doesn’t
specifically require cephadm-specific commands, so it can be considered as a
general guideline how to recover from a Monitor store loss, just with some extra
details about cephadm deployments.

This procedure only works for non-encrypted OSDs. If you are using dmcrypt (LUKS) OSDs,
make sure you have a backup of the keys, otherwise your data is lost forever! But
there is some development, a user in Slack pointed me to [this PR](https://github.com/ceph/ceph/pull/68978)
which adds a backup mechanism for Monitors, probably available in the upcoming Umbrella
release. Note that the PR also contains this statement:

    _Monitor backups complement, but do not replace, the existing Monitor recovery procedures_

The procedure covered by said docs is already written in script form, so I used that
as a template and extended it for cephadm usage and included some very basic logging.
It collects the osdmaps from all OSDs and contains the necessary considerations regarding
containers. I decided to automate only the osdmap collection, not all required steps
of the store rebuild procedure (e. g. Monitor store rebuild, client auth, etc.) because
the result of the collection process *must* be inspected carefully before proceeding.
Here’s the script I used on one of my lab clusters to collect the osdmaps:

```bash
#!/bin/bash

: <<'END'
This script does:
1. Login to each OSD host
2. Create a temporary mon-store in /tmp after cleaning it up 
3. Create a temporary mon-store directory within each OSD's
   filesystem (which is then mapped into the cephadm shell) after cleaning it up
4. Collect the osdmaps from each OSD and sync it to each host's temporary mon-store  
5. Sync each host's temporary mon-store to the central mon-store
END

# List of all OSD hosts
hosts="squid1 squid2 squid3"

# Ensure this user has passwordless sudo on all OSD hosts (if not root)
# It's also easier if the user has passwordless login, e.g. via ssh public key
user="root"

# Cluster FSID
ceph_fsid="df500e26-1930-11f1-a79f-fa163e65a168"

# Logging directories
ms_central="/tmp/mon-store-central"
log_central="/tmp/central-osd-logs"
logdir="/tmp/logdir"
ms_collected="/tmp/mon-store-collected"

# Ensure all OSDs are stopped before proceeding

rm -rf $ms_central
rm -rf $log_central
mkdir -p $log_central

for host in $hosts; do
ssh $user@$host <<EOF
logdir="/tmp/logdir"
ms_collected="/tmp/mon-store-collected"
ceph_fsid="df500e26-1930-11f1-a79f-fa163e65a168"
osd_dir="/var/lib/ceph/\$ceph_fsid"
rm -rf \$ms_collected
rm -rf \$logdir
mkdir -p \$logdir
echo -e "\nHost: \$(hostname -s)"

for osd in \$(cephadm ceph-volume lvm list --format json 2>/dev/null | jq -r '.[].[].tags | ."ceph.osd_id"'); do
echo -e "\nProcessing osd.\$osd ..."
rm -rf \$osd_dir/osd.\$osd/mon-store-collect
mkdir -p \$osd_dir/osd.\$osd/mon-store-collect

cephadm shell --name osd.\$osd -- ceph-objectstore-tool --data-path /var/lib/ceph/osd/ceph-\$osd --no-mon-config --op update-mon-db --mon-store-path /var/lib/ceph/osd/ceph-\$osd/mon-store-collect 2> >(tee \$logdir/osd.\$osd.\$(hostname -s).log | grep -vEi "quay|infer|using|creating")

rsync -qaz \$osd_dir/osd.\$osd/mon-store-collect/. \$ms_collected
done
EOF
rsync -qaz -e ssh $user@$host:$ms_collected/. $ms_central
rsync -qav -e ssh $user@$host:$logdir/. $log_central
done

```

If not all osdmaps are collected successfully, the rebuilt monitor store will be
incomplete and some OSDs won’t be able to join the cluster. There are many more
potential obstacles before the OSDs can be activated, so it’s *critical* to review
the logs from each host after the osdmap collection script has finished (in
case of errors) and then continue step by step. 

## Collect the osdmaps

There are a couple of assumptions made in the script, you will need to adapt those
according to your requirements. For example, the list of hosts, the Ceph FSID, and the
user who logs in to each host. All OSDs should be stopped if there are still running
processes, otherwise the `ceph-objectstore-tool` will fail during collection.
I recommend to stop all daemons (`mgr`, `MDS`, `ceph-exporter`, etc.) before starting
the recovery, otherwise you might get stuck with a stale Manager.

The procedure has been tested on two different Squid lab clusters, one on 19.2.3,
the other one on 19.2.4. Here’s an example of the script output:

```
Host: squid1

Processing osd.1 ...
osd.1   : 0 osdmaps trimmed, 226 osdmaps added.

Processing osd.2 ...
osd.2   : 0 osdmaps trimmed, 228 osdmaps added.

Processing osd.0 ...
osd.0   : 0 osdmaps trimmed, 223 osdmaps added.
```

## Ceph FSID

Depending on how much data is actually lost, there are several ways to retrieve
the Ceph FSID (to keep the output brief, I use $FSID instead of the actual UUID):

* `ceph.conf`: If there’s any `ceph.conf` left on any host (clients also have a `ceph.conf`)
  it will contain the FSID. Alternatively, since every daemon also has a copy of
  `ceph.conf`, check any daemon config file in `/var/lib/ceph/$FSID/osd.X/config` if
  the filesystem is intact. Note that hosts that have been used for prior cluster
  incarnations may have multiple directories under `/var/lib/ceph`, so be sure to
  use only the latest and greatest!
* LV tags: On any OSD host run the command and look for the tag `ceph.cluster_fsid=$FSID`:

```
    lvs -o tags
```

* ceph-volume: On any OSD host run the command:

```
    cephadm ceph-volume lvm list | grep "cluster fsid"
```

Only run “bare” `ceph-volume` commands if your cluster is not managed by cephadm! Otherwise you’ll most likely end up with more chaos! 

## SSH user

The easiest way is to have a user that can log in to each host without a password and
has (passwordless) `sudo` permissions to execute the necessary commands. Depending
on your Ceph deployment, you may log in as the `cephadm` user which usually has
the mentioned permissions. Often the `root` user is configured as the cephadm
user, as it is in my lab cluster in which I tested this procedure. 

## Rebuild the monitor store

Assuming the collection of osdmaps was successful and no errors were logged,
you can now rebuild the store. The hostname of the first Monitor host in this
example is `squid1`.

```bash
# Create a backup of the current store (just in case)
root@squid1:~# rsync -a /var/lib/ceph/$FSID/mon.squid1/store.db/ /root/mon-store-backup/

# Ensure all daemons are stopped!

# Remove current mon-store
root@squid1:~# rm -rf /var/lib/ceph/$FSID/mon.squid1/store.db/

# Copy collected store.db from your management
# node (where you ran the collection script) to the first monitor's store.db
root@squid1:~# rsync -av -e ssh /tmp/mon-store-collected/store.db/ root@squid1:/var/lib/ceph/$FSID/mon.squid1/store.db/

# Rebuild mon-store
root@squid1:~# cephadm shell --name mon.squid1 -- ceph-monstore-tool /var/lib/ceph/mon/ceph-squid1/ rebuild  -- --keyring /etc/ceph/ceph.keyring --mon-ids squid1 squid2 squid3
...
epoch 0
fsid df500e26-1930-11f1-a79f-fa163e65a168
last_changed 2026-06-27T12:18:38.557560+0000
created 2026-06-27T12:18:38.557560+0000
min_mon_release 0 (unknown)
election_strategy: 1
0: [v2:192.168.124.107:3300/0,v1:192.168.124.107:6789/0] mon.squid2
1: [v2:192.168.124.222:3300/0,v1:192.168.124.222:6789/0] mon.squid3
2: [v2:192.168.124.230:3300/0,v1:192.168.124.230:6789/0] mon.squid1

### Note: you need to specify all monitors in the correct order (as mentioned in the docs)!

# Change ownership 
root@squid1:~# chown -R 167.167 /var/lib/ceph/$FSID/mon.squid1/store.db/
```

## Start the Monitors

If all above steps were successful, you can try to start the first Monitor,
either via `systemd` or `cephadm` or `podman`/`docker` This also depends on
the actual deployment situation. One of these commands should work:

```bash
root@squid1:~# systemctl start ceph-$FSID@mon.squid1.service 

root@squid1:~# cephadm unit start --name mon.squid1

root@squid1:~# podman start ... / docker start ...

# Now check the monitor log to see if it starts successfully
root@squid1:~# journalctl -fu start ceph-$FSID@mon.squid1.service
```

If the first Monitor starts, copy the contents of its `store.db` directory
to the other Monitor daemon directories, ensure the correct ownership, and
try to start them as well. Inspect their logs if something goes wrong, and
if it does it must be fixed before continuing. You can also simply repeat
the `rsync` and rebuild steps to recreate the Monitor stores for the remaining
Monitors.

If the Monitors start you should be able to see a Ceph status
now (`ceph -s`). The Ceph status should now contain the OSDs in the output (just an excerpt):

```
ceph -s
cluster:
id: df500e26-1930-11f1-a79f-fa163e65a168
health: HEALTH_WARN
mons are allowing insecure global_id reclaim
no active mgr
services:
mon: 3 daemons, quorum squid2,squid3,squid1 (age 57s)
mgr: no daemons active
osd: 6 osds: 1 up (since 52m), 6 in (since 54m)
data:
pools: 0 pools, 0 pgs
objects: 0 objects, 0 B
usage: 0 B used, 0 B / 0 B avail
pgs:
```

We now see that the Monitors are aware of six OSDs (which is
correct for my lab cluster), but the `pool`, `objects` and `usage` output
is not correct since the OSDs are not up yet and haven’t been able to report
to the Monitors and Managers.

## Before starting OSDs

There are additional steps required before you can activate the OSDs. For example,
all custom configuration option settings (`ceph config dump`) are gone,
auth entries are missing, the `container_image` config value has been reset,
and the orchestrator doesn’t work yet: it must be re-enabled first.
Not all of these steps have to be performed necessarily before activating
the OSDs, but some of them are crucial and others can make life easier when
activating the OSDs.

```bash
# Disable auth_allow_insecure_global_id_reclaim (to clear the warning)
root@squid1:~# ceph config set mon auth_allow_insecure_global_id_reclaim false

# Recreate and import at least one mgr auth keyring to enable the orchestrator
root@squid1:~# cat mgr.squid1.tkgxvc.keyring
[mgr.squid1.tkgxvc]
key = AQDjJhtqCOWnFRAA4/QHkFo2tnWFG8m37kM5HQ==
caps mds = allow *
caps mon = profile mgr
caps osd = allow *

root@squid1:~# ceph auth import -i mgr.squid1.tkgxvc.keyring

# Recreate and import all OSDs keyrings
# If present, use key from /var/lib/ceph/$FSID/osd.$id/keyring to recreate an OSD keyring
root@squid1:~# cat osd.0.keyring
[osd.0]
key = AQBzGxtqPUu8EBAAC0BqZMcfRJb5ZuGtXFgBCA==
caps mgr = allow profile osd
caps mon = allow profile osd
caps osd = allow *

# Check ceph auth for completeness
root@quid1:~# ceph auth ls

# Start at least one manager daemon to be able to manage the cluster again
root@squid1:~# systemctl start ceph-$FSID@mgr.squid1.tkgxvc.service

# Set the public network(s), otherwise OSDs will refuse to start
root@squid1:~# ceph config set global public_network 192.168.124.0/24

# Enable cephadm module
root@squid1:~# ceph mgr module enable cephadm

# Set orchestrator backend
root@squid1:~# ceph orch set backend cephadm

# Recreate cephadm user/keyring
root@squid1:~# ceph cephadm generate-key

# Get new public key
root@squid1:~# ceph cephadm get-pub-key

# Add new public key to each host's authorized_keys (usually of the root user)

# Re-add hosts to the orchestrator
root@squid1:~# ceph orch host add squid1 192.168.124.230
root@squid1:~# ceph orch host add squid2 192.168.124.107
root@squid1:~# ceph orch host add squid3 192.168.124.222

# Add labels if necessary

# Configure container_image (choose the correct version for your cluster)
root@squid1:~# ceph config set global container_image quay.io/ceph/ceph:v19.2.4
```

If you don’t change the `container_image`, some daemons most likely will be deployed
using the hard-coded default:

```
docker.io/ceph/daemon-base:latest-master-devel
```

Not changing that image could lead to issues when redeploying other daemons such as MDSes. 

## Activate the OSDs

There’s a wrapper for cephadm to [activate existing OSDs](https://docs.ceph.com/en/latest/cephadm/services/osd/#activate-existing-osds).
It covers a slightly different scenario: when an OSD host fails due to a broken
operating system, its OSDs can be re-activated after reinstalling the operating
system. In that case, after all prerequisites are met, you can simply run:

```
ceph cephadm osd activate <host>
```

but chances are high that this approach won’t work in a scenario like we’re facing
here: total Monitor store loss. So a more manual workaround like the following
might be required.

Now assuming that the previously described steps worked and errors were fixed,
we can try to start OSDs. Check the contents of the OSD directories first and
see if the most important files are present:

```bash
root@squid1:~# ls -l /var/lib/ceph/$FSID/osd.0/
total 68
lrwxrwxrwx 1 167 167 93 Jun 19 14:56 block -> /dev/ceph-3d3a6efd-02d7-4abf-ae23-17bc239feb1e/osd-block-8012c0dc-cb7b-4179-908c-df0a94a4227b
-rw-r--r-- 1 167 167 37 Jun 19 14:56 ceph_fsid
-rw------- 1 167 167 181 Jun 19 14:58 config
-rw-r--r-- 1 167 167 37 Jun 19 14:56 fsid
-rw------- 1 167 167 142 Jun 19 14:58 keyring
-rw------- 1 167 167 1875 Jun 19 14:33 unit.poststop
-rw------- 1 167 167 3457 Jun 19 14:33 unit.run
-rw-r--r-- 1 167 167 2 Jun 19 14:56 whoami
```

Without these files the OSDs will most likely refuse to start. Now let’s give it a try:

```bash
# systemd
root@squid1:~# systemctl start ceph-$FSID@osd.0.service

or via

# cephadm
root@squid1:~# cephadm unit start --name osd.0
```

Alternatively, if the orchestrator works (you could try to
deploy `node-exporter` or other daemons to confirm), you
can also just redeploy an OSD:

```bash
root@squid1:~# ceph orch daemon redeploy osd.X
```

This will recreate missing files in the OSD’s directory and hopefully start the OSD successfully.

Inspect the OSD logs after starting them and look out for error messages if they fail to start:

```bash
root@squid1:~# journalctl -fu ceph-$FSID@osd.X.service
```

If you enabled `log_to_file` you can follow the log file like this:

```
root@squid1:~# tail -F /var/log/ceph/$FSID/ceph-osd.X.log
```

## Next steps

Let’s assume that we could successfully start the OSDs and recovery is progressing,
and we need to access the data now. For RBD pools there’s (probably) not much you
need to do: as soon as clients can access the OSDs again, they should be able to
map/attach/access the RBD images.

For CephFS it’s a different story. Since the MDS maps are lost as well, all
file systems will have to be recreated, including the MDS daemons.
The [Ceph docs](https://docs.ceph.com/en/latest/cephfs/recover-fs-after-mon-store-loss/)
cover this part. Read the instructions very carefully! The required commands are:

```bash
root@squid1:~# ceph fs new <fs_name> <metadata_pool> <data_pool> --force --recover
root@squid1:~# ceph fs set <fs_name> joinable true
```

Since there are no existing MDS daemons yet, you’ll need to deploy them either via `.yaml` file:

```bash
root@squid1:~# ceph orch apply -i mds.yaml
```

or directly:

```bash
root@squid1:~# ceph orch apply mds <fs_name> --placement="label:mds"
```

Check out [the docs](https://docs.ceph.com/en/latest/cephadm/services/mds/)
for more information on MDS deployment.

I won’t go into more details, as this post is long enough as it is. But
you’ll need to deploy required daemons for all services you had
running before the crash. So you’ll have to recreate your `yaml`
files for all the services like RGW, Monitoring, NVMe-oF, etc.
The existing service specs in a recovered cluster look like this
(when no services have been managed yet):

```
root@squid1:~# ceph orch ls
NAME  PORTS  RUNNING  REFRESHED  AGE  PLACEMENT     
mgr              2/0  9m ago     -    <unmanaged>   
mon              1/0  9m ago     -    <unmanaged>   
osd                0  9m ago     -    <unmanaged>
```

You’ll need to update those as well to match your actual cluster configuration.
I recommend to regularly back up your cluster configuration, auth keyrings, service
specs and so on, so you don’t have to recreate everything from scratch in such a
failure scenario. Commands to capture the most crucial information include the below:

* `ceph status`
* `ceph orch ls --export`
* `ceph config dump`
* `ceph crush dump`
* `ceph report`

One strategy is to emplace a cron job that emails the output files as attachments;
another is to store them as S3 objects, say in another Ceph cluster. Be sure that
you keep a prudent number of revisions, so that a cluster mishap does not overwrite
your good data with bad.

After the recovery has been completed, the cluster status looks like this:

```bash
squid1:~ # ceph -s
 cluster:
   id:     df500e26-1930-11f1-a79f-fa163e65a168
   health: HEALTH_OK
 
 services:
   mon: 3 daemons, quorum squid2,squid3,squid1 (age 80m)
   mgr: squid3.fepqsu(active, since 62m), standbys: squid1.pcgzhi
   mds: 2/2 daemons up, 3 standby
   osd: 6 osds: 6 up (since 65m), 6 in (since 65m)
 
 data:
   volumes: 2/2 healthy
   pools:   7 pools, 385 pgs
   objects: 49 objects, 4.3 MiB
   usage:   421 MiB used, 60 GiB / 60 GiB avail
   pgs:     385 active+clean
```

## Potential obstacles

There are things that can go wrong while trying to re-activate the OSDs.
This is not an exhaustive list, but it can help in specific scenarios.

### Missing OSD path contents

As mentioned above, the contents of the OSD directories must be present
and matching. If OSDs don’t start, the logs might point to permission
issues, missing files (unit.poststop, type, and so on), a broken symbolic
link to the OSD block device, or other failures. 

### Ceph Dashboard

Most likely you’ll have to enable the [dashboard](https://docs.ceph.com/en/latest/mgr/dashboard/#enabling) again since all configs are gone:

```bash
root@squid1:~# ceph mgr module enable dashboard
```

After that, you’ll have to recreate users, roles etc., whatever you had configured before. 

### Packages

One of the issues during OSD activation in this case was the presence of the `ceph-osd`
package on at least one of the hosts. It’s known to be problematic to have that
package present on a cephadm-managed cluster. So make sure that the `ceph-osd` package
is absent from all cephadm-managed hosts. Basically, on a cephadm-managed cluster node you
only need the `cephadm` package: the orchestrator uses a binary stored at /var/lib/ceph/$FSID/cephadm.{some_digest}
to remotely execute commands. For comfort reasons the `ceph-common` package is also useful.
Other YUM/DNF/APT packages including `ceph-mon`, `ceph-mgr`, etc. are not required and should
also be absent.

## ceph-volume

As mentioned above, there’s a hard-coded default
image (`docker.io/ceph/daemon-base:latest-master-devel`) which can make life harder.
Make sure to configure the correct Ceph `container_image` as well as those for other
daemons, including `nvmeof`, `grafana`, `prometheus`, `node_exporter`, etc.):

```bash
root@squid1:~# ceph config ls | grep container_image
container_image
mgr/cephadm/container_image_alertmanager
mgr/cephadm/container_image_base
mgr/cephadm/container_image_elasticsearch
mgr/cephadm/container_image_grafana
mgr/cephadm/container_image_haproxy
mgr/cephadm/container_image_jaeger_agent
mgr/cephadm/container_image_jaeger_collector
mgr/cephadm/container_image_jaeger_query
mgr/cephadm/container_image_keepalived
mgr/cephadm/container_image_loki
mgr/cephadm/container_image_node_exporter
mgr/cephadm/container_image_nvmeof
mgr/cephadm/container_image_prometheus
mgr/cephadm/container_image_promtail
mgr/cephadm/container_image_samba
mgr/cephadm/container_image_snmp_gateway
```


Disclaimer: The procedure above was tested in two lab environments in order
to write this blog post, but the individual steps were executed in a real
cluster. It worked for me/us but it might not work for you. If anything
goes wrong it’s not my fault, but yours. And it’s yours to fix it! 

If you have suggestions how to improve the procedure or feedback in case you had to use it, I’d appreciate a comment!



PS: Note that the best way to avoid losing cluster data due to an unrecoverable Monitor
store is to not lose the Monitor store in the first place. The abovementioned backup
procedure can help, as will ensuring that every production cluster runs five Monitor
daemons. While three is a valid number of Monitors to run, five has much greater
resilience. Ensure that your Monitors are spread across failure domains (e.g. hosts
or racks) and that no more than two can be placed in any one failure domain.


This article has been crossposted from https://heiterbiswolkig.blogs.nde.ag/2026/06/28/cephadm-recover-mon-store-using-osds/

