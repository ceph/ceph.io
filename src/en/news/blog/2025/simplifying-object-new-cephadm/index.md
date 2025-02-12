---
title: "Simplyfing Ceph Object Deployments: Production-ready Ceph Object Gateway (RGW) with New Cephadm Features"
date: 2024-12-28
author: Daniel Parkes, Anthony D'Atri (IBM)
tags:
  - ceph
  - rgw
  - s3
---

### Introduction

Deploying a *production-ready object storage solution* can be challenging,
particularly when managing complex requirements including SSL/TLS encryption,
optimal data placement, and multisite replication. During deployment, it’s
easy to overlook configuration options that become crucial once the system
is live in production.

Traditionally, configuring Ceph for high availability, security, and efficient
data handling required users to manually adjust multiple parameters based on
their needs, such as Multisite Replication, Encryption, and High Availability.
This initial complexity made it tedious to achieve a production-ready
Object Storage configuration.

To tackle these challenges, we have introduced several new features to Ceph's
orchestrator that simplify the deployment of Ceph RGW and its associated
services. Enhancing the Ceph Object Gateway and Ingress service specification
files enables an out-of-the-box, production-ready RGW setup with just a few
configuration steps. These enhancements include automated SSL/TLS
configurations, virtual host bucket access support, erasure coding for
cost-effective data storage, and more.

These improvements aim to provide administrators with a seamless deployment
experience that ensures secure, scalable, and production-ready configurations
for the Ceph Object Gateway and Ingress Service (load balancer).

In this blog post, we'll explore each of these new features, discuss the
problems they solve, and demonstrate how they can be easily configured
using `cephadm` spec files to achieve a fully operational Ceph Object
Gateway setup in minutes.

### Feature Highlights

#### Virtual Host Bucket Access and Self-Signed Certificates

One of the major challenges in deploying RGW is ensuring seamless access to
buckets using virtual host-style URLs. For applications and users that rely
on virtual host bucket access, proper SSL/TLS certificates that include the
necessary Subject Alternative Names (SANs) are crucial. To simplify this,
we've added the option to automatically generate self-signed certificates
for the Object Gateway if the user does not provide custom certificates.
These self-signed certificates include SAN entries that allow TLS/SSL to work
seamlessly with virtual host bucket access.

#### Complete TLS/SSL Client-to-RGW Encryption

Security is a top priority for any production-grade deployment, and the Ceph
community has increasingly requested full TLS/SSL encryption from the client to the
Object Gateway service. Previously, our ingress implementation only supported
terminating SSL at the HAProxy level, which meant that communication between
HAProxy and RGW could not be encrypted.

To address this, we've added configurable options that allow users to choose
whether to re-encrypt traffic between HAProxy and RGW or to use passthrough
mode, where the TLS connection remains intact from the client to RGW. This
flexibility allows users to achieve complete end-to-end encryption, ensuring
sensitive data is always protected in transit.

#### Multisite Replication Configuration

In the past, Ceph multisite deployments involved running many commands to
configure your Realm, zonegroup, and zone, and also establishing the
relationship between the zones that will be involved in the Multisite replication.
Thanks to the RGW manager module, the multisite bootstrap and configuration can
now be done in two steps.  There is an example in the Object Storage Replication
blog post.

In Squid release, we have also added the possibility of configuring dedicating
Object Gateways just for client traffic purposes through the `cephadm` spec file
with the RGW spec file option: 

```
disable_multisite_sync_traffic: True
```

The advantages of dedicating Ceph Object Gateways to specific tasks are covered
in the blog post: _Ceph Object Storage Multisite Replication Series. Part Three_

#### Configure your Erasure coded data pool in the Spec file during bootstrap.

Object Storage often uses Erasure Coding for the data pool to reduce the TCO of
the object storage solution.  We have included options for configuring
erasure-coded (EC) pools in the spec file. This allows users to define the EC
profile, device class, and failure domain for RGW data pools, which provides
control over data placement and storage efficiency.

### Ceph Object Deployment Walkthrough

If you are new to Ceph and `cephadm`, the _Automating Ceph Cluster Deployments
with Ceph: A Step-by-Step Guide Using Cephadm and Ansible (Part 1)_  blog post
will give you a good overview of `cephadm` and how we can define the desired state
of Ceph services in a declarative YAML spec file to deploy and configure Ceph.

Below, we'll walk through the CLI commands required to deploy a production-ready
RGW setup using the new features added to the `cephadm` orchestrator.

#### Enabling the RGW Manager Module

The first step is to enable the RGW manager module. This module is required to
manage RGW services through `cephadm`.

```
# ceph mgr module enable rgw
```

Next, we create a spec file for the Object Gateway service. This spec file includes
realm, zone, and zonegroup settings, SSL/TLS, EC profile for the data pool, etc.

```
# cat << EOF > /root/rgw-client.spec
service_type: rgw
service_id: client
service_name: rgw.client
placement:
  label: rgw
  count_per_host: 1
networks:
  - 192.168.122.0/24
spec:
  rgw_frontend_port: 4443
  rgw_realm: multisite
  rgw_zone: zone1
  rgw_zonegroup: multizg
  generate_cert: true
  ssl: true
  zonegroup_hostnames:
    - s3.cephlab.com
  data_pool_attributes:
    type: ec
    k: 2
    m: 2
extra_container_args:
  - "--stop-timeout=120"
config:
  rgw_exit_timeout_secs: "120"
  rgw_graceful_stop: true
EOF
```

In this spec file we specify that the RGW service should use erasure coding with
a 2+2 profile `(k: 2, m: 2)` for the data pool, which reduces storage costs compared
to a replicated setup. We also generate a self-signed certificate `(generate_cert: true)`
for the RGW service to ensure secure SSL/TLS communication. With `zonegroup_hostnames`,
we enable virtual host bucket access using the specified domain `bucket.s3.cephlab.com`.
Thanks to the config parameter `rgw_gracefull_stop`, we configure graceful stopping
of object gateway services. During a graceful stop, the service will wait until all
client connections are closed (drained) subject to the specified 120 second timeout.

#### Bootstrapping the RGW Realm

Once the spec file is created, we bootstrap RGW services. This step creates and deploys
RGW services with the configuration specified in our spec file.

```
# ceph rgw realm bootstrap -i rgw-client.spec
```

#### Verifying the RGW Services

The cephadm bootstrap command will asynchronously apply the configuration
defined in our spec file. Soon the RGW services will be up and running, and we
can verify their status using the `ceph orch ps command`.

```
# ceph orch ps --daemon_type rgw
NAME                            HOST                      PORTS                 STATUS         REFRESHED  AGE  MEM USE  MEM LIM  VERSION          IMAGE ID      CONTAINER ID
rgw.client.ceph-node-05.yquamf  ceph-node-05.cephlab.com  192.168.122.175:4443  running (32m)    94s ago  32m    91.2M        -  19.2.0-53.el9cp  fda78a7e8502  a0c39856ddd8
rgw.client.ceph-node-06.zfsutg  ceph-node-06.cephlab.com  192.168.122.214:4443  running (32m)    94s ago  32m    92.9M        -  19.2.0-53.el9cp  fda78a7e8502  82c21d350cb7
```

This output shows that the RGW services run on the specified nodes and are
accessible via the configured `4443/tcp` port.

#### Verifying the Data Pool

To verify that the RGW data pools are correctly configured with erasure
coding, we can use the following command:

```
# ceph osd pool ls detail | grep data
pool 24 'zone1.rgw.buckets.data' erasure profile zone1_zone_data_pool_ec_profile size 4 min_size 3 crush_rule 1 object_hash rjenkins pg_num 32 pgp_num 32 autoscale_mode on last_change 258 lfor 0/0/256 flags hashpspool stripe_width 8192 application rgw
```

#### Viewing the Erasure Code Profile

To get more details about the erasure code profile used for the data pool, we can run the below:

```
# ceph osd erasure-code-profile get zone1_zone_data_pool_ec_profile
crush-device-class=
crush-failure-domain=host
crush-num-failure-domains=0
crush-osds-per-failure-domain=0
crush-root=default
jerasure-per-chunk-alignment=false
k=2
m=2
plugin=jerasure
technique=reed_sol_van
w=8
```

This confirms that the erasure code profile is configured with `k=2` and `m=2`
and uses the Reed-Solomon technique.

#### Configuring the Ingress Service

Finally, we must configure the ingress service to load balance traffic to multiple
RGW daemons. We create a spec file for the ingress service:

```
# cat << EOF > rgw-ingress.yaml
service_type: ingress
service_id: rgw
placement:
  hosts:
    - ceph-node-06.cephlab.com
    - ceph-node-07.cephlab.com
spec:
  backend_service: rgw.client
  virtual_ip: 192.168.122.152/24
  frontend_port: 443
  monitor_port:  1967
  use_tcp_mode_over_rgw: True
EOF
```

This spec file sets up the ingress service with the virtual (floating) IP (VIP)
address `192.168.122.152` and specifies that it should use TCP mode for
communication with the Object Gateway, ensuring that SSL/TLS is maintained
throughout. With the `backend_service` we specify the RGW service we want
to use as the backend for HAproxy, as it is possible for a Ceph cluster to
run multiple, unrelated RGW services.

#### Testing Load Balancer and SSL/TLS Configuration

Our ingress service stack uses `keepalived` for HA of the VIP, and HAproxy
takes care of the load balancing:

```
# ceph orch ps --service_name ingress.rgw
NAME                                HOST                      PORTS       STATUS         REFRESHED  AGE  MEM USE  MEM LIM  VERSION         IMAGE ID      CONTAINER ID
haproxy.rgw.ceph-node-06.vooxuh     ceph-node-06.cephlab.com  *:443,1967  running (58s)    46s ago  58s    5477k        -  2.4.22-f8e3218  0d25561e922f  4cd458e1f6b0
haproxy.rgw.ceph-node-07.krdmsb     ceph-node-07.cephlab.com  *:443,1967  running (56s)    46s ago  56s    5473k        -  2.4.22-f8e3218  0d25561e922f  4d18247e7615
keepalived.rgw.ceph-node-06.cwraia  ceph-node-06.cephlab.com              running (55s)    46s ago  55s    1602k        -  2.2.8           6926947c161f  50fd6cf57187
keepalived.rgw.ceph-node-07.svljiw  ceph-node-07.cephlab.com              running (53s)    46s ago  53s    1598k        -  2.2.8           6926947c161f  aaab5d79ffdd
```
When we check the haproxy configuration on `ceph-node-06` where the service is
running, we confirm that we are using TCP passthrough for the backend
configuration of our Object Gateway services.

```
# ssh ceph-node-06.cephlab.com cat /var/lib/ceph/93d766b0-ae6f-11ef-a800-525400ac92a7/haproxy.rgw.ceph-node-06.vooxuh/haproxy/haproxy.cfg | grep -A 10 "frontend frontend"
...
backend backend
    mode        tcp
    balance     roundrobin
    option ssl-hello-chk
    server rgw.client.ceph-node-05.yquamf 192.168.122.175:4443 check weight 100 inter 2s
    server rgw.client.ceph-node-06.zfsutg 192.168.122.214:4443 check weight 100 inter 2s
```

To verify that the SSL/TLS configuration is working correctly, we can use `curl`
to test the endpoint. We can see that the CA is not trusted by our client system
where we are running the curl command:

```
# curl https://192.168.122.152
curl: (60) SSL certificate problem: unable to get local issuer certificate
More details here: https://curl.se/docs/sslcerts.html
curl failed to verify the legitimacy of the server and therefore could not
establish a secure connection to it.
```

To fix this, we need to add the cephadm root CA certificate to the trusted store of our client system:

```
# ceph orch cert-store get cert cephadm_root_ca_cert > /etc/pki/ca-trust/source/anchors/cephadm-root-ca.crt
# update-ca-trust
```

After updating the trusted store, we can test again:

```
# curl  https://s3.cephlab.com
<?xml version="1.0" encoding="UTF-8"?><ListAllMyBucketsResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Owner><ID>anonymous</ID></Owner><Buckets></Buckets></ListAllMyBucketsResult>
```

This confirms that the SSL/TLS self-signed certificate configuration works correctly
and that the RGW service is accessible using HTTPS. As you can see, we have
configured our DNS subdomain `s3.cephlab.com` and the wildcard `*.s3.cephlab.com`
to point to our VIP address `192.168.122.152`. Also, it's important to mention
that you can have more than one VIP address configured so not all the traffic
goes through a single haproxy LB node; when using a list of VIP IPs, you need
to use the option: `virtual_ips_list`

### Conclusion

These new features in the `cephadm` orchestrator represents significant steps
forward in making Ceph RGW deployments more accessible, secure, and
production-ready. By automating complex configurations—such as SSL/TLS
encryption, virtual host bucket access, multisite replication, and erasure
coding administrators can now deploy an RGW setup ready for production with
minimal manual intervention.

For further details on the Squid release, check Laura Flores' [blog post](https://ceph.io/en/news/blog/2024/v19-2-0-squid-released/)

Note that some features described here may not be available before the Squid 19.2.2 release.

### Footnote

The authors would like to thank IBM for supporting the community by facilitating our time to create these posts.

