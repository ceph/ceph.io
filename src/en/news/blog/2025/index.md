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

This article will help you to set up a test ceph cluster running on single node minikube cluster. We chose Docker as the driver to create the Minikube cluster on Mac M1 because it is simpler and more reliable, avoiding the complexities of virtualization, firewall issues (bootpd), and x86 emulation. Docker runs ARM-native containers directly, enhancing performance and compatibility, which is crucial for resource-intensive systems like Rook/Ceph. 

#### Prerequisite 

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
- Install and start minikube
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
- As with docker on M1 mac, we can not attach /dev/sd* or /dev/vd* devices as it is ARM based and Ceph does not use /dev/loop devices which are available in minikube with docker driver. That's why we will be using network block device /dev/nbd0
```
minikube ssh
sudo mkdir /mnt/disks

# Create an empty file of size 10GB to mount disk as ceph osd 

sudo dd if=/dev/zero of=/mnt/disks/mydisk.img bs=1M count=10240
sudo apt update
sudo apt upgrade
sudo apt-get install qemu-utils

# List out the nbd devices

lsblk | grep nbd

# If you are unable to see the nbd device, load the NBD (Network Block Device) kernel module

sudo modprobe nbd max_part=8

# To bind nbd device to the file 
# Note: Please check there is no necessary data in /dev/nbdx, otherwise please take backup.

sudo qemu-nbd --format raw -c /dev/nbd0 /mnt/disks/mydisk.img      
```
- Verify the size of nbd device using lsblk
```
 lsblk | grep nbd0        
```

- Clone rook repository on your host machine.
```
git clone https://github.com/rook/rook.git        
```

- Change into rook/deploy/examples/ directory
```
cd rook/deploy/examples/        
```

- Deploy rook operator
```
kubectl create -f crds.yaml -f common.yaml -f operator.yaml        
```
- Verify the rook-ceph-operator is in running state before proceeding
```
kubectl get pods -n rook-ceph        
```
- In cluster-test.yaml, make necessary changes to storage section with the device selection:
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
- Create ceph cluster
```
kubectl create -f cluster-test.yaml        
```
- Verify the cluster is running by checking pods status in rook-ceph namespace
```
kubectl -n rook-ceph get pod
```       
- If the rook-ceph-mon, rook-ceph-mgr, or rook-ceph-osd pods are not created, please refer to the [Ceph common issues](https://rook.io/docs/rook/latest/Troubleshooting/ceph-common-issues/) for more details and potential solutions.

- To verify that the cluster is in a healthy state, connect to the Rook Toolbox.
```
kubectl create -f toolbox.yaml        
```
- Wait for the toolbox pod to download its container and get to the running state:
```
kubectl -n rook-ceph rollout status deploy/rook-ceph-tools        
```
- Once the rook-ceph-tools pod is running, you can connect to it with:
```
kubectl -n rook-ceph exec -it deploy/rook-ceph-tools -- bash        
```
- Run the ceph status command and check

  - All mons should be in quorum
  - A mgr should be active
  - At least 1 OSDs should be up and in
  - If the health is not HEALTH_OK, the warnings or errors should be investigated
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
If the cluster is not healthy, please refer to the [Ceph common issues](https://rook.io/docs/rook/latest/Troubleshooting/ceph-common-issues/) for potential solutions.

Footnote:

Thanks Yuval Lifshitz for providing all the support and guidance to write this article.

References:

https://rook.io/docs/rook/latest/Getting-Started/quickstart/
