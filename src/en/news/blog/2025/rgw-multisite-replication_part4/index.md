---
title: "Ceph Object Storage Multisite Replication Series. Part Four"

date: 2024-12-27
author: Daniel Parkes, Anthony D'Atri (IBM)
tags:
  - ceph
  - rgw
  - s3
---



## IBM Storage Ceph Object Storage Multisite Replication Series

In the previous episode of the series, we discussed configuring dedicated RGW
services for client and replication requests. Additionally, we explored the
performance enhancements the sync fairness feature offer. In the fourth article
of this series, we will be talking about load balancing our freshly deployed
RGW S3 endpoints to provide high-availability and increased performance by
distributing requests across individual RGW services.

### Load-Balancing RGW S3 endpoints

#### Introduction

In the previous installment, we configured four RGW instances: two dedicated to
client S3 API requests and the rest for multisite replication requests. With
this configuration, clients can connect to each RGW endpoint individually
to use the HTTP restful S3 API. They could, for example, issue an S3 call like
a LIST using as an endpoint the IP/FQDN of one of the nodes running and RGW
service.

Here's an example with the AWS s3 client:  `$ aws –endpoint https://ceph-node02 s3 ls`.
They will be able to access their buckets and data.

The problem is, what happens if `ceph-node02` goes down? The user will start getting
error messages and failed requests, even if the rest of the RGW services are running
fine on the surviving nodes. To avoid this behaviour, providing high availability
and increased performance, we need to configure a load balancer in front of our
RGW services. Because the RGW endpoints are using the HTTP protocol, we have
multiple well-known solutions to load balance HTTP requests. These include
hardware-based commercial solutions as well as open-source software load
balancers. We need to find a solution that will cover our performance needs
depending on the size of our deployment and specific requirements.
There are some great examples of different RadosGW load-balancing mechanisms
in this [github repository](https://github.com/mmgaggle/ceph-lb) from Kyle Bader.

![](images/i4-1.png)

#### Inter-Site Replication Network

Each site's network infrastructure must offer ample bandwidth to
support reading and writing of replicated objects or erasure-coded object
shards. We recommend that the network fabric of each site has either zero (1:1)
or minimal oversubscription (e.g., 2:1). One of the most used network topologies
for Ceph cluster deployments is Leaf and Spine as it can provide
the needed scalability.

Networking between zones participating in the same zone group will be utilized
for asynchronous replication traffic. The inter-site bandwidth must be equal
to or greater than ingest throughput to prevent synchronisation lag from
growing and increasing the risk of data loss. Inter-site networking will not be
relied on for read traffic or reconstitution of objects because all objects are
locally durable. Path diversity is recommended for inter-site networking, as we
generally speak of WAN connections. The inter-site networks should be routed (L3)
instead of switched (L2 Extended Vlans) in order to provide independent networking
stacks at each site. Finally, even if we are not doing so in our lab example,
Ceph Object Gateway synchronization should be configured to use HTTPS
endpoints to encrypt replication traffic with SSL/TLS in production. 

#### The Ingress Service Overview

Beginning with the Pacifc release, Ceph provides a cephadm service called `ingress`,
which provides an easily deployable HA and load-balancing stack based
on Keepalived and HAproxy.

The ingress service allows you to create a high-availability endpoint for RGW
with a minimum of configuration options. The orchestrator will deploy and manage
a combination of HAproxy and Keepalived to balance the load on the different
configured floating virtual IPs.

![](images/i4-2.png)

There are mutliple hosts where the ingress service is deployed. Each host has an
HAproxy daemon and a keepalived daemon.

By default, a single virtual IP address is automatically configured by
Keepalived on one of the hosts. Having a single VIP means that all traffic for
the load-balancer will flow through a single host. This is less than ideal for
configurations that service a high number of client requests while maintaining
high throughput. We recommend configuring one VIP address per ingress node.
We can then, for example, configure round-robin DNS across all deployed VIPs to
load balance requests across all VIPs. This provides the possibility to achieve
higher throughput as we are using more than one host to load-balance client HTTP
requests across our configured RGW services. Depending on the size and
requirements of the deployment, the ingress service may not be adequate,
and other more scalable solutions can be used to balance the requests,
like BGP + ECMP.

### Deploying the Ingress Service
In this post, we will configure the ingress load balancing service so we can
load-balance S3 client HTTP requests across the public-facing RGW services
running on nodes `ceph-node-02` and `ceph-node-03` in `zone1`,
and `ceph-node-06` and `ceph-node-07` in `zone2`.

In the following diagram, we depict at a high level the new load balancer
components we are adding to our previously deployed architecture. In this way
we will provide HA and load balancing for S3 client requests.

![](images/i4-3.png)

The first step is to create, as usual, a cephadm service spec file.
In this case, the service type will be `ingress`. We specify our existing
public RGW service name `rgw.client-traffic` as well as the `service_id`
and `backend_service` parameters. We can get the name of the cephadm
services using the `cephadm orch ls` command.


We will configure one VIP per ingress service daemon, and two nodes to manage
the ingress service with VIPs per Ceph cluster. We will enable SSL/HTTPS for
client connections terminating at the ingress service.

```
[root@ceph-node-00 ~]# ceph orch ls | grep rgw
rgw.client-traffic         ?:8000           2/2  4m ago     3d   count-per-host:1;label:rgw
rgw.multisite.zone1        ?:8000           2/2  9m ago     3d   count-per-host:1;label:rgwsync

[root@ceph-node-00 ~]# cat << EOF >  rgw-ingress.yaml
service_type: ingress
service_id: rgw.client-traffic
placement:
  hosts:
    - ceph-node-02.cephlab.com
    - ceph-node-03.cephlab.com
spec:
  backend_service: rgw.client-traffic
  virtual_ips_list:
  - 192.168.122.150/24
  - 192.168.122.151/24
  frontend_port: 443
  monitor_port:  1967
  ssl_cert: |
    -----BEGIN CERTIFICATE-----
    -----END CERTIFICATE-----

    -----BEGIN CERTIFICATE-----
    -----END CERTIFICATE-----
    -----BEGIN PRIVATE KEY-----
    -----END PRIVATE KEY-----
EOF


[root@ceph-node-00 ~]# ceph orch apply -i rgw-ingress.yaml
Scheduled ingress.rgw.client update...
```

**NOTE**: The ingress service builds from all the certs we add
to the `ssl_cert` list a single certificate file named `HAproxy.pem`.
For the certificate to work, HAproxy requires that you add the certificates
in the following order: `cert.pem` first, then the chain certificate,
and finally, the private key.

Soon we can see our HAproxy and Keepalived services running on `ceph-node-[02/03]` :

```
[root@ceph-node-00 ~]# ceph orch ps | grep -i client
haproxy.rgw.client.ceph-node-02.icdlxn     ceph-node-02.cephlab.com  *:443,1967             running (3d)     9m ago   3d    8904k        -  2.4.22-f8e3218    0d25561e922f  9e3bc0e21b4b
haproxy.rgw.client.ceph-node-03.rupwfe     ceph-node-03.cephlab.com  *:443,1967             running (3d)     9m ago   3d    9042k        -  2.4.22-f8e3218    0d25561e922f  63cf75019c35
keepalived.rgw.client.ceph-node-02.wvtzsr  ceph-node-02.cephlab.com                        running (3d)     9m ago   3d    1774k        -  2.2.8             6926947c161f  031802fc4bcd
keepalived.rgw.client.ceph-node-03.rxqqio  ceph-node-03.cephlab.com                        running (3d)     9m ago   3d    1778k        -  2.2.8             6926947c161f  3d7539b1ab0f
```

You can check the configuration of HAproxy from inside the container: it is using
static round-robin load balancing between both of our client-facing RGWs
configured as the backends. The frontend listens on port 443 with our
certificate in the path `/var/lib/haproxy/haproxy.pem`:

```
[root@ceph-node-02 ~]# podman exec -it ceph-haproxy-rgw-client-ceph-node-02-jpnuri cat /var/lib/haproxy/haproxy.cfg | grep -A 15 "frontend frontend"
frontend frontend
    bind *:443 ssl crt /var/lib/haproxy/haproxy.pem
    default_backend backend

backend backend
    option forwardfor
    balance static-rr
    option httpchk HEAD / HTTP/1.0
    server rgw.client-traffic.ceph-node-02.yntfqb 192.168.122.94:8000 check weight 100
    server rgw.client-traffic.ceph-node-03.enzkpy 192.168.122.180:8000 check weight 100
```

For this example, we have configured basic DNS round robin using the load
balancer CoreDNS plugin. We are resolving `s3.zone1.cephlab.com` across all
configured ingress VIPs. As you can see with the following example,
each request for `s3.zone1.cephlab.com` resolves to a different Ingress VIP.

```
[root@ceph-node-00 ~]# ping -c 1 s3.zone1.cephlab.com
PING s3.cephlab.com (192.168.122.150) 56(84) bytes of data.
[root@ceph-node-00 ~]# ping -c 1 s3.zone1.cephlab.com
PING s3.cephlab.com (192.168.122.151) 56(84) bytes of data.
```

You can now point the S3 client to `s3.zone1.cephlab.com` to
access the RGW S3 API endpoint.

```
[root@ceph-node-00 ~]# aws --endpoint https://s3.zone1.cephlab.com:443 s3 ls
2024-01-04 13:44:00 firstbucket
```

At this point, we have high availability and load balancing configured for
`zone1`. If we lose one server running the RGW service, client requests will be
redirected to the remaining RGW service.

We need to do the same steps for the second Ceph cluster that hosts `zone2`,
so we will end up with a load-balanced endpoint per zone:

```
s3.zone1.cephlab.com
s3.zone2.cephlab.com
```

As a final step, we could deploy a global load balancer (GLB). This is not part of
the Ceph solution and should be provided by a third party; there are many DNS
global load balancers available that implement various load balancing policies.

As we are using SSL/TLS in our lab per-site load balancers, if we were to
configure a GLB  we will need to implement TLS passthrough or re-encrypt
client connections so connections will be encrypted from the client to the
per-site load balancer. Using a GLB has significant advantages:

* Taking advantage of the active/active nature of Ceph Object storage replication,
you can provide users with a single S3 endpoint FQDN and then apply policy
at the load balancer to send the user request to one site or the other.
The load balancer could, for example, redirect the client to the S3 endpoint
closest to their location. 

* If you need an active/passive disaster recovery approach, a GLB can enhance
failover. Users will have a single S3 endpoint FQDN o use. During normal
operations, they will always be redirected to the primary site. In case
of site failure the GLB will detect the failure of the primary site,
and redirect the users transparently to the secondary site, enhancing
user experience and reducing the failover time. 

In the following diagram we provide an example where we add a GLB with the
FQDN `s3.cephlab.com`. Clients connect to `s3.cephlab.com` and will
be redirected to one or the other site based on the applied policy
at the GLB level

![](images/i4-4.png)

#### Should we use a load balancer for RGW replication endpoints?

In the load balancing ingress service examples we shared, we
configured load balancing for S3 client endpoints, so the
client HTTP requests are distributed among the available
RGW services. We haven’t yet dicusssed the RGWs serving multisite sync requests.
In our previous installment, we configured two RGWs dedicated to multisite sync
operations. How do we load-balance sync requests across the two RGWs if we don’t
have an ingress service or external load balancer configured?.

RGW implements round-robin at the zonegroup and zone endpoint levels. We can
configure a comma-separated list of RGW services IP address or hostnames. The
RGW service code will load-balance the request among the entries in the list.

Replication endpoints for our `multizg` zone group:

```
[root@ceph-node-00 ~]# radosgw-admin zonegroup get | jq .endpoints
[
  "http://ceph-node-04.cephlab.com:8000",
  "http://ceph-node-05.cephlab.com:8000"
]
```
Replication endpoints for our zone1 and zone2 zones. 

```
[root@ceph-node-00 ~]# radosgw-admin zonegroup get | jq .zones[].endpoints
[
  "http://ceph-node-00.cephlab.com:8000",
  "http://ceph-node-01.cephlab.com:8000"
]
[
  "http://ceph-node-04.cephlab.com:8000",
  "http://ceph-node-05.cephlab.com:8000"
]
```

We can take another approach using a load balancer for multisite sync endpoints.
For example, a dedicated ingress service or any other HTTP load balancer.
If we take this approach, we would just have a single FQDN in the list of
zonegroup and zone endpoints.

##### What would be the best solution, a dedicated load balancer or RGW round-robin on the provided list of endpoints?

It depends.. external load balancing could be better if the load balancer can
offer at least the same throughput as round-robin of the configured dedicated
RGW services. As an example, if our external load balancer is HAproxy running
on a single VM with a single VIP and limited network throughput, we are better
off using the RGW round-robin replication endpoint list option. For releases
after a PR from early 2024 was merged, I would say that both options are ok.
You need to trade the simplicity of just setting up a list of IPs for the
endpoints, which is done for us automatically with the RGW manager module,
against the more advanced features that a full-blown load-balancer can offer.


### Summary & Up Next

In part four of this series, we discussed everything related to
load-balancing our RGW S3 endpoints. We covered multiple Load-balancing techniques,
including the bundled Ceph0provided load balancer, the `Ingress service`.
In part five, we will detail the new Sync Policy feature that provides
Object Multisite replication with a granular and flexible sync policy scheme. 


### Footnote

The authors would like to thank IBM for supporting the community by facilitating our time to create these posts.

