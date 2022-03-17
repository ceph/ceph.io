---
title: "Bucket Notifications in Rook - Part II"
date: "2022-03-16"
author: "ylifshit"
---

## Why?

[Last time](https://ceph.io/en/news/blog/2021/bucket-notifications-with-knative-and-rook-on-minikube/) we saw how to use bucket notification together with Knative on minikube.
Most of the process was "easy as a YAML" - most, but not all...

In order to setup the bucket notifications part of the solution some manual steps were neeeded.
However, as proimised, a set of [new CRs](https://rook.io/docs/rook/v1.8/ceph-object-bucket-notifications.html) has come to our rescue in Rook1.8!

Now the entire process could be done using YAMLs only.

## The "Moving Parts"

We are going to use the same infrastructure bits as in the previous post (with some improvments): minikube, Knative and Rook

### minikube

When using minikube 1.25 there is no need to manually attach the extra disk needed for Rook (kvm2 driver should be used in that case). So we would just run:

```bash
minikube start --driver=kvm2 --cpus=8 --extra-disks=1
```

> note that Knative requires k8s v1.21, so, if an older version is used, you should add `--kubernetes-version=v1.21.0` to the above command

### Knative

Lets use the latest-and-greatest Knative 1.2 operator to install the eventing and serving parts, as described [here](https://knative.dev/docs/install/operator/knative-with-operators/):

Install the Knative operator:

```bash
kubectl apply -f https://github.com/knative/operator/releases/download/knative-v1.2.0/operator.yaml
```

Then install the "serving" components:

```bash
cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: knative-serving
---
apiVersion: operator.knative.dev/v1alpha1
kind: KnativeServing
metadata:
  name: knative-serving
  namespace: knative-serving
EOF
```

The networking layer (using Kourier);

```bash
cat << EOF | kubectl apply -f -
apiVersion: operator.knative.dev/v1alpha1
kind: KnativeServing
metadata:
  name: knative-serving
  namespace: knative-serving
spec:
  ingress:
    kourier:
      enabled: true
  config:
    network:
      ingress-class: "kourier.ingress.networking.knative.dev"
EOF
```

The "Ceph Source" is now packaged as part of Knative (yay!), so there is no need to install it from [source](https://github.com/knative-sandbox/eventing-ceph). We will install the "eventing" component with the "Ceph Source":

```bash
cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: knative-eventing
---
apiVersion: operator.knative.dev/v1alpha1
kind: KnativeEventing
metadata:
  name: knative-eventing
  namespace: knative-eventing
spec:
  source:
    ceph:
      enabled: true
EOF
```

### Rook

Deploy the Rook operator (can also look at the [quickstart guide](https://rook.io/docs/rook/v1.8/quickstart.html)):

```bash
kubectl apply -f https://raw.githubusercontent.com/rook/rook/release-1.8/deploy/examples/crds.yaml
kubectl apply -f https://raw.githubusercontent.com/rook/rook/release-1.8/deploy/examples/common.yaml
kubectl apply -f https://raw.githubusercontent.com/rook/rook/release-1.8/deploy/examples/operator.yaml
```

Now the "test" (single node) Ceph cluster:

```bash
kubectl apply -f https://raw.githubusercontent.com/rook/rook/release-1.8/deploy/examples/cluster-test.yaml
```

And make sure that the OSDs and MONs are up and running:

```bash
kubectl -n rook-ceph get pod
```

And last, the "test" (single node) object store:

```bash
kubectl apply -f https://raw.githubusercontent.com/rook/rook/release-1.8/deploy/examples/object-test.yaml
```

## Really Easy as a YAML

Lets setup **everything** from YAMLs:

### Ceph Source in Knative

Create the Ceph Source CR and service (that would be used as the endpoint for the bucket notification topic):

```bash
kubectl apply -f https://raw.githubusercontent.com/knative-sandbox/eventing-ceph/release-1.2/samples/ceph-source.yaml
```

```bash
cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: my-ceph-source-svc
spec:
  selector:
    eventing.knative.dev/sourceName: my-ceph-source
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8888
EOF
```

The receiver (sink) for the event would be a generic event display pod:

```bash
kubectl apply -f https://raw.githubusercontent.com/knative-sandbox/eventing-ceph/release-1.2/samples/event-display.yaml
```

Note that the "event-display" pod would start, but terminate once it sees that it has no events to handle.

### Object bucket Claim (OBC) in Rook

Based on [OBC configuration doc](https://rook.io/docs/rook/v1.8/ceph-object-bucket-claim.html) and the [notification configuration doc](https://rook.io/docs/rook/v1.8/ceph-object-bucket-notifications.html).
Lets create a storage class, and a bucket preconfigured with a notification:

```bash
kubectl apply -f https://raw.githubusercontent.com/rook/rook/release-1.8/deploy/examples/storageclass-bucket-delete.yaml
kubectl apply -f https://raw.githubusercontent.com/rook/rook/release-1.8/deploy/examples/object-bucket-claim-notification.yaml
```

### Bucket Notifications

Now we should create the bucket notifications topic pointing at the Ceph Source Service we configured in Knative (based on [this example](https://github.com/rook/rook/blob/release-1.8/deploy/examples/bucket-topic.yaml)):

```bash
cat << EOF | kubectl apply -f -
apiVersion: ceph.rook.io/v1
kind: CephBucketTopic
metadata:
  name: my-topic
  # the topic should be created in the app namespace
spec:
  objectStoreName: my-store
  objectStoreNamespace: rook-ceph
  persistent: false
  endpoint:
    http:
      uri: http://my-ceph-source-svc.default.svc.cluster.local
EOF
```

And the notification that ties the OBC to the topic (based on [this example](https://github.com/rook/rook/blob/release-1.8/deploy/examples/bucket-notification.yaml)):

```bash
cat << EOF | kubectl apply -f -
apiVersion: ceph.rook.io/v1
kind: CephBucketNotification
metadata:
  name: my-notification
  # the notification should be created in the app namespace
spec:
  topic: my-topic
  events:
    - s3:ObjectCreated:*
EOF
```

## Let's Try It

### External Access

By default, Rook exposes the Object Store as a service accessible to other pods in the cluster, but we want to acess it from an [aws CLI client](https://docs.aws.amazon.com/cli/index.html) on the node.
For that we would add a new `NodePort` service and attach it to the Object Store:

```bash
cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: rook-ceph-rgw-my-store-external
  namespace: rook-ceph
  labels:
    app: rook-ceph-rgw
    rook_cluster: rook-ceph
    rook_object_store: my-store
spec:
  ports:
  - name: rgw
    port: 80
    protocol: TCP
    targetPort: 8080
  selector:
    app: rook-ceph-rgw
    rook_cluster: rook-ceph
    rook_object_store: my-store
  sessionAffinity: None
  type: NodePort
EOF
```

Well, the truth is that we don't want to access it from the node (the minikube VM), we want to access it from the machine hosting that VM.
Minikube will help us here, and give us the actual host name we should use:

```bash
export AWS_URL=$(minikube service --url rook-ceph-rgw-my-store-external -n rook-ceph)
```

### User Credentials

We get the user credentials and put them into into environment variables used by the aws CLI tool:

```bash
export AWS_ACCESS_KEY_ID=$(kubectl -n default get secret ceph-notification-bucket -o jsonpath='{.data.AWS_ACCESS_KEY_ID}' | base64 --decode)
export AWS_SECRET_ACCESS_KEY=$(kubectl -n default get secret ceph-notification-bucket -o jsonpath='{.data.AWS_SECRET_ACCESS_KEY}' | base64 --decode)
```

And then fetch the generated bucket name:

```bash
export BUCKET_NAME=$(kubectl get objectbucketclaim ceph-notification-bucket -o jsonpath='{.spec.bucketName}')
```

### Push the Button

Last, we can create a file, and upload it to Ceph.

```bash
echo "hello world" > hello.txt
aws --endpoint-url "$AWS_URL" s3 cp hello.txt s3://"$BUCKET_NAME"
```

We should now see these events in the "event-display" pod log:

```bash
kubectl logs -l serving.knative.dev/service=event-display -c display-container --tail=100
```

At this point, the "event-display" pod should be created and exists as long as notifications are being sent from the RGW.

### Debugging Bucket Notifications

To debug the Ceph Source use:

```bash
kubectl logs -l eventing.knative.dev/sourceName=my-ceph-source --tail 100
```

The RGW with:

```bash
kubectl logs -l app=rook-ceph-rgw -n rook-ceph --tail 100
```

And the Rook operator with:

```bash
kubectl logs -l app=rook-ceph-operator -n rook-ceph --tail 100
```

The Ceph toolbox pod may also be useful for debugging, as it holds the `radosgw-admin` and other tools:

```bash
kubectl apply -f https://raw.githubusercontent.com/rook/rook/release-1.8/deploy/examples/toolbox.yaml
```

## What's Next?

Looks like we are done? Well, not really.

There are several alternatives to the technologies that we selected above that are worth exploring. So, stay tuned!

### microshift

[microshift](https://github.com/redhat-et/microshift) is a small footprint alternative to minikube (based on Openshift).
Note that microshift runs directly on the host, and an extra **physical** disk is needed (e.g. attach a USB drive).
Also note that since micorshift is based on Openshift and not vanilla k8s, there are some different steps in installaing the other components.

### CRC

[CodeReadty Containers](https://github.com/code-ready/crc) is another, VM based, small footprint, Openshift.

### Cloudevents Endpoint

In the next Rook version there will be a popssibility to send notifications as Cloudevents directly to the Knative channel, without the "Ceph Sourcee" adapter

### KEDA

[KEDA](https://keda.sh/) Is another serverless framework . It lightweight (batteries not included), and well suited for edge deploymnets.
KEDA has "scalers" that poll an external queueing system and spawn the serverless functions to pull the events.
