---
title: Rook Ceph Installation on Minikube for Mac M1 with Docker Driver
date: 2024-05-07
author: Anushruti Sharma
image: ""
tags:
  - ceph
  - rook
  - docker
  - mac
---

### Introduction

This article explains how to set up a test Ceph cluster that runs on a
single-node Minikube cluster.

Docker has been chosen as the driver of the Minikube cluster on Mac M1 due to
its reliability and simplicity. By choosing Docker, we avoid the complexities
of virtualization, the difficulties of firewall configuration (bootpd), and the
cost of x86 emulation.

Docker runs ARM-native containers directly. This improves performance and
compatibility and lowers cost, which is important in resource-intensive systems
such as Rook and Ceph.

#### Prerequisites

- MAC M1 with macOS Sonoma 14
- 2 CPUs or more
- 2GB of free memory
- 20GB of free disk space
- Internet connection

### Procedure

- Install docker

```
brew install docker
brew install colima
colima start
```

- Install and start Minikube

```
brew install minikube
minikube start --disk-size=20g --driver docker
```

- Install kubectl on your host machine

```
curl -LO "https://dl.k8s.io/release/v1.26.1/bin/darwin/arm64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

- Because the M1 Mac is ARM-based, it is not possible to attach /dev/sd*
  devices or /dev/vd* devices. In this situation, we would normally default to
  the use of /dev/loop devices, but Ceph does not permit the use of /dev/loop
  devices. Instead, we will use the network block device /dev/nbd0.

```
minikube ssh
sudo mkdir /mnt/disks

# Create an empty file of size 10GB to mount disk as ceph osd

sudo dd if=/dev/zero of=/mnt/disks/mydisk.img bs=1M count=10240
sudo apt update
sudo apt upgrade
sudo apt-get install qemu-utils

# List the nbd devices

lsblk | grep nbd

# If you are unable to see the nbd device, load the NBD (Network Block Device)
kernel module.

sudo modprobe nbd max_part=8

# To bind nbd device to the file
# Note: Please check there is no necessary data in /dev/nbdx, otherwise back up
that data.

sudo qemu-nbd --format raw -c /dev/nbd0 /mnt/disks/mydisk.img
```

- Verify the size of the nbd device by using lsblk

```
 lsblk | grep nbd0
```

- Clone the Rook repository to your host machine.

```
git clone https://github.com/rook/rook.git
```

- Move into the rook/deploy/examples/ directory.

```
cd rook/deploy/examples/
```

- Deploy the Rook operator.

```
kubectl create -f crds.yaml -f common.yaml -f operator.yaml
```

- Verify that the rook-ceph-operator is in a running state before proceeding.

```
kubectl get pods -n rook-ceph
```

- In cluster-test.yaml, make necessary changes to the storage section with the
  device selection:

```
  storage:
    useAllNodes: false
    useAllDevices: false
    nodes:
    - name: minikube    # node name of minikube node
      devices:
      - name: /dev/nbd0   # device name being used
    allowDeviceClassUpdate: true
    allowOsdCrushWeightUpdate: false
```

- Create the Ceph cluster.

```
kubectl create -f cluster-test.yaml
```

- Verify that the cluster is running by checking the pods' status in the
  rook-ceph namespace

```
kubectl -n rook-ceph get pod
```

- If the rook-ceph-mon, rook-ceph-mgr, or rook-ceph-osd pods are not created,
  refer to [Ceph common
issues](https://rook.io/docs/rook/latest/Troubleshooting/ceph-common-issues/)
for more information.

- To verify that the cluster is in a healthy state, connect to the Rook
  Toolbox.

```
kubectl create -f toolbox.yaml
```

- Wait for the toolbox pod to download its container and then to arrive in a
  running state:

```
kubectl -n rook-ceph rollout status deploy/rook-ceph-tools
```

- After the rook-ceph-tools pod is running, you can connect to it with the
  following command:

```
kubectl -n rook-ceph exec -it deploy/rook-ceph-tools -- bash
```

- Run the `ceph status` command and ensure the following: 

  - All mons are in quorum
  - A mgr is active 
  - At least 1 OSDs should be up and in
  - If the health status is not HEALTH_OK, investigate the warnings or errors 

```
bash-5.1$ ceph -s
  cluster:
    id:     f89dd5e5-e2bb-44e8-8969-659f0fc9dc55
    health: HEALTH_OK

  services:
    mon: 1 daemons, quorum a (age 7m)
    mgr: a(active, since 5m)
    osd: 1 osds: 1 up (since 6m), 1 in (since 6m)

  data:
    pools:   1 pools, 1 pgs
    objects: 2 objects, 449 KiB
    usage:   27 MiB used, 10 GiB / 10 GiB avail
    pgs:     1 active+clean
```

If the cluster is not healthy, refer to the [Ceph common
issues](https://rook.io/docs/rook/latest/Troubleshooting/ceph-common-issues/)
for potential solutions.

Footnote:

Thanks Yuval Lifshitz for providing all the support and guidance to write this
article.

References:

https://rook.io/docs/rook/latest/Getting-Started/quickstart/
