---
title: "Bucket Notifications with Knative and Rook on minikube!"
date: "2021-05-15"
author: "ylifshit"
---

## Why?

[Bucket notifications](https://docs.ceph.com/en/latest/radosgw/notifications/) is a powerful integration feature, with some [interesting applications](https://medium.com/analytics-vidhya/automated-data-pipeline-using-ceph-notifications-and-kserving-5e1e9b996661), but like anything that has to do with integration, it has lots of moving parts that require setup. I thought that trying to create such a setup from scratch, as a small demo running on my laptop, is probably the best way to figure out the pain points in the process.

In this setup, Ceph, together with the RADOS Getaway (RGW) will be running inside a minikube Kubernetes cluster, using Rook. Knative will be running in the same cluster. > everything is tested with: > \* Fedora32 > \* minikube: v1.13.0 > \* knative: v0.22 > \* rook: v1.6.0

\> Important note about this guide: everything in Kubernetes is dynamic (not to say a "moving target"...), meaning that the commands below may be obsolete or wrong quite soon after this guide is written :-) So, before copy&pasteting them in your shell, check the official docs (usually linked just before the commands).

## The "Moving Parts"

Let's see if the setup is simple despite all the bits that we need to do.

### minikube

minikube isn't the obvious choice for running Ceph, rook, etc. However, at least according to [this blog post](https://ksingh7.medium.com/rook-ceph-deployment-on-openshift-4-2b34dfb6a442):

_"Before you start OCP 4 deployment, be aware that it needs 6 EC2 instances and 6 EIP. So send a request to AWS support and get the limit of EIP increased for your account."_.

This rules out a "small demo running on my laptop" approach - so, I went down the minikube path:

First we install minikube (check [this page](https://minikube.sigs.k8s.io/docs/start/)):

```
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-latest.x86_64.rpm
sudo rpm -ivh minikube-latest.x86_64.rpm
```

Now we can run minikube and verify it is ok (note that we assume that we already have: KVM, virsh, etc. installed):

```
minikube start --cpus 8
```

\> Note that you would need 8 CPUs, as quite a few things are running there, and some have constraints on available CPUs.

If this works fine, we can check if minikube has an extra disk that could be used by Ceph:

```
minikube ssh lsblk
```

It probably won't, so we would need to add it:

```
UUID=$(uuidgen)
IMAGE=/var/lib/libvirt/images/minikube-$UUID
sudo qemu-img create -f raw $IMAGE 30G
sudo virsh attach-disk minikube $IMAGE vdb --cache none --persistent
```

Now we should restart minikube:

```
minikube stop
minikube start
```

And see if the disk was added:

```
minikube ssh lsblk
```

Last but not least, we should use the docker daemon running inside minikube (I prefer [podman](https://podman.io/) on my host :-)

```
eval $(minikube docker-env)
```

### Knative

Following instruction from [here](https://knative.dev/docs/install/install-serving-with-yaml/) we first install Knaive "serving":

```
kubectl apply -f https://github.com/knative/serving/releases/download/v0.22.0/serving-crds.yaml
kubectl apply -f https://github.com/knative/serving/releases/download/v0.22.0/serving-core.yaml
```

Then Kourier:

```
kubectl apply -f https://github.com/knative/net-kourier/releases/download/v0.22.0/kourier.yaml
```

Then configure knative "serving" to use Kourier:

```
kubectl patch configmap/config-network \
  --namespace knative-serving \
  --type merge \
  --patch '{"data":{"ingress.class":"kourier.ingress.networking.knative.dev"}}'
```

And finally Knative "eventing":

```
kubectl apply -f https://github.com/knative/eventing/releases/download/v0.22.0/eventing-crds.yaml
kubectl apply -f https://github.com/knative/eventing/releases/download/v0.22.0/eventing-core.yaml
```

The "Ceph Source" is built and deployed from source using the ["ko" tool](https://github.com/google/ko) and according to [these instructions](https://github.com/knative-sandbox/eventing-ceph/blob/main/README.md):

```
git clone https://github.com/knative-sandbox/eventing-ceph.git
cd eventing-ceph/
ko apply -f config
```

### Rook

Usually, Ceph requires multiple nodes, so inside the [rook ceph documentation](https://rook.io/docs/rook/v1.6/ceph-quickstart.html) and the [rook object store documentation](https://rook.io/docs/rook/v1.6/ceph-examples.html#object-storage) we should look for the "test" setup that allows for a single node:

```
git clone --single-branch --branch v1.6.0 https://github.com/rook/rook.git
cd rook/cluster/examples/kubernetes/ceph
kubectl apply -f crds.yaml -f common.yaml -f operator.yaml
kubectl apply -f cluster-test.yaml
kubectl apply -f object-test.yaml
```

The next step would be to install the "toolbox", this is needed so we can get the credentials of the user that owns the bucket we create:

```
kubectl apply -f toolbox.yaml
```

## Easy as a YAML

So, setting up the system wasn't too bad, now let's see if the specific configuration is as easy as editing a YAML file.

### Ceph Source in Knative

Once we have Knative setup, we can create the "ceph source" service that later would be the notification endpoint configured in the RGW:

```
kubectl apply -f samples/ceph-source-svc.yaml
```

The receiver (sink) for the event would be a generic event display pod:

```
kubectl apply -f samples/event-display.yaml
```

Note that the "event-display" pod would start, but terminate once it sees that it has no events to handle.

And most important, we should create the "ceph source" resource (CRD):

```
kubectl apply -f samples/ceph-source.yaml
```

\> As mentioned above, these instructions were tested only on minikube, and may not work with other Kubernetes distros (e.g. OpenShift).

### OBC in Rook

To create the bucket, follow [this documentation](https://rook.io/docs/rook/v1.6/ceph-examples.html#object-storage-buckets). First, the storage class has to be created:

```
kubectl apply -f storageclass-bucket-delete.yaml
```

Then the object bucket claim (OBC). However, the OBC YAML sample was modified, to contain an explicit bucket name, so that the `object-bucket-claim-delete.yaml` is:

```
apiVersion: objectbucket.io/v1alpha1
kind: ObjectBucketClaim
metadata:
  name: ceph-delete-bucket
spec:
  bucketName: fish
  storageClassName: rook-ceph-delete-bucket
```

The main reason for that modification is that, when using the AWS CLI to set up bucket notifications, we have to know the actual bucket name, so, setting it explicitly makes it easier.

We can use the toolbox pod to make sure that the bucket was created:

```
kubectl -n rook-ceph exec -it deploy/rook-ceph-tools -- radosgw-admin bucket list
```

### Bucket Notifications

The first thing that is needed for bucket notifications is a pod that has the [AWS CLI](https://docs.aws.amazon.com/cli/index.html) installed in it. Note the s3cmd is not sufficient for what we do here, since creating the "topic" for the notifications is part of the SNS API and not S3. In addition, this pod would have some extensions that we support.

YAML for this pod would be:

```
apiVersion: v1
kind: Pod 
metadata:
  name: aws-cli-runner
  namespace: rook-ceph
spec:
  containers:
    - name: aws-cli
      image: quay.io/ylifshit/aws-cli
```

Now we need to use the toolbox from the previous section to see which user owns the bucket that was created by the OBC. Get the list of users:

```
kubectl -n rook-ceph exec -it deploy/rook-ceph-tools -- radosgw-admin user list
[
    "rook-ceph-internal-s3-user-checker-f234b0db-612f-48ec-870f-40a359f189b0",
    "dashboard-admin",
    "ceph-user-902n5sk8"
]
```

And get the credentials for the `ceph-user-902n5sk8` user:

```
kubectl -n rook-ceph exec -it deploy/rook-ceph-tools -- radosgw-admin user info --uid ceph-user-902n5sk8
```

After the AWS CLI pod is up and running we can use it to use the AWS CLI:

```
kubectl -n rook-ceph exec -it aws-cli-runner -- bash
```

First, we should configure AWS CLI according to the access key and secret key of the user. Run `aws configure` and make sure to set the `Default region name` to `my-store`.

Before we create a topic, we have to do the following conf (this is actually to workaround a [bug](https://tracker.ceph.com/issues/50039)):

```
aws configure set default.sns.signature_version s3
```

Now we can create a [topic](https://docs.ceph.com/en/latest/radosgw/notifications/#create-a-topic) that points into the Knative "ceph source" service:

```
 aws --endpoint-url http://rook-ceph-rgw-my-store:80 sns create-topic --name=fishtopic --attributes='{"push-endpoint": "http://my-ceph-source-svc.default.svc.cluster.local"}'
```

And a [notification](https://docs.ceph.com/en/latest/radosgw/s3/bucketops/#create-notification) that ties the topic with the bucket:

```
aws --endpoint-url http://rook-ceph-rgw-my-store:80 s3api put-bucket-notification-configuration --bucket fish --notification-configuration='{"TopicConfigurations": [{"Id": "notif1", "TopicArn": "arn:aws:sns:default::fishtopic", "Events": []}]}'
```

Last, we can create a file, and upload it to ceph:

```
echo "hello world" &gt; hello.txt
aws --endpoint-url http://rook-ceph-rgw-my-store:80 s3 cp hello.txt s3://fish
```

We should now see these events in the "event-display" pod log:

```
kubectl logs -l serving.knative.dev/service=event-display -c display-container --tail=100
```

At this point, the "event-display" pod should be created and exists as long as notifications are being sent from the RGW.

### Debugging Bucket Notifications

To debug the ceph source adapter use:

```
kubectl logs -l knative-eventing-source-name=my-ceph-source -c receive-adapter --tail=100
```

And the RGW with:

```
kubectl logs -l app=rook-ceph-rgw -c rgw --tail=100 -n rook-ceph
```

## The Last Piece of the Puzzle

Configuration is indeed easy until we hit the "bucket notifications" part. There we have to:

- Do manual invocation of the AWS CLI command with their JSON encoded parameters
- Figure out the user's credentials
- Get the bucket name (if we use generated bucket names in the OBCs)
- Not to mention the fact that we need another "toolbox" pod to run the AWS CLI commands...

To the rescue, we have a [bucket notification CRD design](https://github.com/rook/rook/blob/master/design/ceph/object/ceph-bucket-notification-crd.md) - once materialized into code would be the last piece of the puzzle!
