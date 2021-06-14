---
title: "Bring persistent storage for your containers with KRBD on Kubernetes"
date: "2015-06-28"
author: "shan"
tags: 
  - "planet"
---

{% img center http://sebastien-han.fr/images/kubernetes-ceph-krbd.png Bring persistent storage for your containers with KRBD on Kubernetes %}

Use RBD device to provide persistent storage to your containers. This work was initiated by a colleague of mine [Huamin Chen](https://huaminchen.wordpress.com/). I would like to take the opportunity to thank him for the troubleshooting session we had. Having the ability to use persistent volume for your containers is critical, containers can be ephemeral since they are immutable. If they did on a machine they can be bootstrapped on another host without any problem. The only problem here is we need to ensure that somehow the data that come with this container will follow it no matter where it goes. This is exactly what we want to achieve with this implementation.

  

# Pre requisite

This article assumes that your Kubernetes environment is up and running. First on your host install Ceph:

```
$ sudo yum install -y ceph-common
```

W **Important: the version of ceph-common must be >= 0.87.**

Set up your Ceph environment:

```
$ sudo docker run -d \
--net=host \
-v /var/lib/ceph:/var/lib/ceph \
-v /etc/ceph:/etc/ceph \
-e MON_IP=192.168.0.1 \
-e CEPH_NETWORK=192.168.0.0/24 \
ceph/demo
```

Several actions are not assumed by Kubernetes such as:

- RBD volume creation
- Filesystem on this volume

So let's do this first:

```
$ sudo rbd create foo -s 1024
$ sudo rbd map foo
/dev/rbd0
$ sudo mkfs.ext4 /dev/rbd0
$ sudo rbd unmap /dev/rbd0
```

  
  

# Configure Kubernetes

First, we clone Kubernetes repository to get some handy file examples:

```
$ git clone https://github.com/GoogleCloudPlatform/kubernetes.git
$ cd kubernetes/examples/rbd
```

Get your `ceph.admin` key and encode it in base64:

```
$ sudo ceph auth get-key client.admin
AQBAMo1VqE1OMhAAVpERPcyQU5pzU6IOJ22x1w==

$ echo "AQBAMo1VqE1OMhAAVpERPcyQU5pzU6IOJ22x1w==" | base64
QVFCQU1vMVZxRTFPTWhBQVZwRVJQY3lRVTVwelU2SU9KMjJ4MXc9PQo=
```

R Note: it's not mandatory to use the `client.admin` key, you can use whatever key you want as soon as it has the approprieate permissions of the given pool.

Edit your `ceph-secret.yml` with the base64 key:

```
apiVersion: v1
kind: Secret
metadata:
  name: ceph-secret
data:
  key: QVFCQU1vMVZxRTFPTWhBQVZwRVJQY3lRVTVwelU2SU9KMjJ4MXc9PQo=
```

Add your secret to Kubernetes:

```
$ kubectl create -f secret/ceph-secret.yaml
$ kubectl get secret
NAME                  TYPE                                  DATA
ceph-secret           Opaque                                1
```

Now, we edit our `rbd-with-secret.json` pod file. This file describes the content of your pod:

```
{
    "apiVersion": "v1beta3",
    "id": "rbdpd2",
    "kind": "Pod",
    "metadata": {
        "name": "rbd2"
    },
    "spec": {
        "containers": [
            {
                "name": "rbd-rw",
                "image": "kubernetes/pause",
                "volumeMounts": [
                    {
                        "mountPath": "/mnt/rbd",
                        "name": "rbdpd"
                    }
                ]
            }
        ],
        "volumes": [
            {
                "name": "rbdpd",
                "rbd": {
                    "monitors": [
                                                        "192.168.0.1:6789"
                                 ],
                    "pool": "rbd",
                    "image": "foo",
                    "user": "admin",
                    "secretRef": {
                                                  "name": "ceph-secret"
                                         },
                    "fsType": "ext4",
                    "readOnly": true
                }
            }
        ]
    }
}
```

The relevant sections are:

- `mountPath`: where to mount the RBD image, this mountpoint **must** exist
- `monitors`: address of the monitors (you can have asn many as you want)
- `pool`: the pool used to store your image
- `image`: name of the image
- `secretRef`: name of the secret
- `fsType`: filesystem type of the image

Now it's time to fire it up your pod:

```
$ kubectl create -f rbd-with-secret.json
$ kubectl get pods
NAME      READY     REASON    RESTARTS   AGE
rbd2      1/1       Running   0          1m
```

Check the running containers:

```
$ docker ps
CONTAINER ID        IMAGE                                  COMMAND             CREATED             STATUS              PORTS               NAMES
61e12752d0e9        kubernetes/pause:latest                "/pause"            18 minutes ago      Up 18 minutes                           k8s_rbd-rw.1d89132d_rbd2_default_bd8b2bb0-1c0d-11e5-9dcf-b4b52f63c584_f9954e16
e7b1c2645e8f        gcr.io/google_containers/pause:0.8.0   "/pause"            18 minutes ago      Up 18 minutes                           k8s_POD.e4cc795_rbd2_default_bd8b2bb0-1c0d-11e5-9dcf-b4b52f63c584_ac64e07c
e9dfc079809f        ceph/demo:latest                       "/entrypoint.sh"    3 hours ago         Up 3 hours                              mad_ardinghelli
```

Everything seems to be working well, let's check the device status on the Kubernetes host:

```
$ sudo rbd showmapped
id pool image snap device
0  rbd  foo   - /dev/rbd0
```

The image got mapped, now we check where this image got mounted:

```
$ mount |grep kube
/dev/rbd0 on /var/lib/kubelet/plugins/kubernetes.io/rbd/rbd/rbd-image-foo type ext4 (ro,relatime,stripe=1024,data=ordered)
/dev/rbd0 on /var/lib/kubelet/pods/bd8b2bb0-1c0d-11e5-9dcf-b4b52f63c584/volumes/kubernetes.io~rbd/rbdpd type ext4 (ro,relatime,stripe=1024,data=ordered)
```

  
  

# Further work and known issue

The current implementation is here and it's good to see that we merged such thing. It will be easier in the future to follow up on that original work. The "v2" will ease operators life, since they won't need to pre-populate RBD images and filesystems.

There is a bug currently where the pod creation failed if the mount point doest not exist. This is fixed in [Kubernetes 0.20](https://github.com/GoogleCloudPlatform/kubernetes/commit/0280dac6b1ad735690144717cf81568392e8a526).

  

> I hope you will enjoy this as much as I do :)
