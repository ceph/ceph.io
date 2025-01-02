---
title: "Automating Ceph Cluster Deployments with Ceph: A Step-by-Step Guide Using Cephadm and Ansible (Part 1)"
date: 2024-12-27
author: Daniel Parkes, Anthony D'Atri (IBM)
tags:
  - ceph
---

### Introduction

In the era of big data, managing vast amounts of storage efficiently and reliably
is a critical challenge for enterprises. Ceph has become a leading
software defined storage solution known for its flexibility, scalability,
and robustness. Building on this foundation, Ceph elevates these capabilities,
offering seamless integration with enterprise environments and advanced tools
for efficiently managing petabytes of data.

This blog post series will delve into the automated deployment of Ceph clusters
using Ceph's state-of-the-art orchestrator, `cephadm`. Additionally, for those
automating their infrastructure with Ansible, we will share an example using
an Infrastracture-As-Code approach with the help of Jinja2 templates and Ansible.

### Infrastructure as Code

Infrastructure as Code (IaC) revolutionizes infrastructure management by treating
infrastructure setups as code. This allows us to apply software development
practices such as version control, testing, and continuous integration to
infrastructure management, reducing the risk of errors and speeding up
deployment and scaling.

With Ceph, tools like Ansible and `cephadm` are perfect examples of IaC in
action. They allow administrators to define the desired state of their Ceph
clusters in code, making it easier to deploy, manage, and scale these clusters
across different environments.

### A Brief History of Ceph Orchestration Tools

As Ceph became more popular and clusters rapidly grew, the need for an effective
orchestration tool became increasingly critical. Over the years, several tools
have been developed to simplify and automate the deployment and management of
Ceph clusters. Let’s take a brief look at them:

- `ceph-deploy` was one of the first tools introduced to ease the deployment of Ceph clusters. As a lightweight command-line utility, `ceph-deploy` allowed administrators to quickly set up a basic Ceph cluster by automating many manual steps in configuring Ceph daemons like MONs, OSDs, and MGRs.

- `ceph-ansible` marked a significant step forward by integrating Ceph deployment with Ansible, a popular open-source automation tool. This approach embraced the principles of Infrastructure as Code (IaC), allowing administrators to define the entire Ceph cluster configuration in Ansible playbooks.

- `cephadm` The current bundled Ceph orchestrator, which we will cover in detail in the next section.

### Cephadm Introduction

Unlike its predecessors, `ephadm` deploys all Ceph daemons as containers using
Docker or Podman. This containerized approach ensures consistency across
different environments and simplifies the management of dependencies,
making deploying, upgrading, and scaling Ceph clusters easier.

Cephadm's use of a declarative spec file to define the cluster's desired
state marks a significant improvement in how Ceph clusters are managed.
Administrators can now describe their entire cluster configuration
in advance, and Cephadm continuously ensures that the cluster matches
this desired state. This process is also known as _convergence_.

In addition to its powerful deployment capabilities, Cephadm integrates
with the Ceph Dashboard, provides built-in monitoring and alerting, and
supports automated upgrades, making it the most comprehensive and
user-friendly orchestration tool in the Ceph ecosystem to date.

### Repetitive Automated Deployment of Ceph Clusters with Cephadm

Modern IT environments increasingly require repeatedly deploying and scaling
storage clusters across different environments: development, testing, and
production. This is where Cephadm comes to the rescue. By automating the
deployment and management of Ceph clusters, Cephadm eliminates the manual,
error-prone processes traditionally involved in setting up distributed storage
systems.

#### Cephadm’s Declarative Approach

`cephadm`’s use of a declarative service spec file allows administrators to
define the entire configuration of a Ceph cluster in a single, reusable
file that is amenable to revision control. This spec file can describe
everything from the placement of OSDs, Monitors, and Managers to the setup and
configuration of File, Block, and Object Services. By applying this spec file,
`cephadm` can automatically converge the cluster to match the desired state,
ensuring consistency across multiple deployments.

It’s important to note that Cephadm provides the deployment and lifecycle of
Ceph cluster services. Still, not all day two operations of specific services,
like creating a Ceph Object Storage (RGW) user, are currently covered by Cephadm.

#### Fitting into Infrastructure as Code (IaC)

`cephadm` fits perfectly into an Infrastructure as Code (IaC) paradigm. IaC treats
infrastructure configurations like software code, storing them in version control,
automating their application, and enabling continuous delivery pipelines. With `cephadm`,
the spec file acts as the code that defines your storage infrastructure.

For example, you could store your `cephadm` spec files in a version control system
like Git with optional CICD pipelines. When changes are made to the cluster
configuration, they are committed and pushed, triggering automated pipelines
that deploy or update the Ceph cluster based on the updated spec file. This
approach streamlines deployments and ensures that your storage infrastructure
is always in sync with your application and service needs.

Note that specific `cephadm` configuration changes require restarting the
corresponding service, which must be coordinated with an automation tool
for the changes to take effect once applied.

#### Walkthrough of a Cephadm Service Spec File that Provides an Automated Deployment of a Ceph Cluster

Below is an example of a Cephadm spec file that enables a complete Ceph cluster
deployment during the bootstrap process. This basic example is designed to get
you started; a production deployment would require further customization of the spec file.

```
service_type: host
hostname: ceph1
addr: 10.10.0.2
location:
  root: default
  datacenter: DC1
labels:
- osd
- mon
- mgr
---
service_type: host
hostname: ceph2
addr: 10.10.0.3
location:
  datacenter: DC1
labels:
- osd
- mon
- rgw
---
service_type: host
hostname: ceph3
addr: 10.10.0.4
location:
  datacenter: DC1
labels:
- osd
- mds
- mon
---
service_type: mon
placement:
  label: "mon"
---
service_type: mgr
service_name: mgr
placement:
 label: "mgr"
---
service_type: osd
service_id: all-available-devices
service_name: osd.all-available-devices
spec:
  data_devices:
    all: true
    limit: 1
placement:
  label: "osd"
---
service_type: rgw
service_id: objectgw
service_name: rgw.objectgw
placement:
  count: 2
  label: "rgw"
spec:
  rgw_frontend_port: 8080
  rgw_frontend_extra_args:
   - "tcp_nodelay=1"
---
service_type: ingress
service_id: rgw.external-traffic
placement:
  label: "rgw"
spec:
  backend_service: rgw.objectgw
  virtual_ips_list:
  - 172.18.8.191/24
  - 172.18.8.192/24
  frontend_port: 8080
  monitor_port: 1967
```

The first `service_type` is `host`, which enumerates all hosts in the cluster,
including their hostnames and IP addresses. The `location` field indicates
the host's position within the Ceph CRUSH topology, a hierarchical structure
that informs data placement and retrieval across the cluster. Check
out [this document](https://docs.ceph.com/en/reef/rados/operations/crush-map/)
for more info.

By setting specific labels on the host, Cephadm can efficiently schedule and
deploy containerized Ceph services on desired nodes, with a given node sometimes
having more than one label and thus hosting more than one Ceph service.
This ensures resource isolation and reduces the number of nodes required,
optimizing resource usage and cutting costs in production environments.

Note that the hosts we are adding to the cluster need a set of prerequisites
configured to successfully join the Ceph cluster. This blog series will also
cover automating the deployment of these prerequisites.

```
service_type: host
hostname: ceph1
addr: 10.10.0.2
location:
  root: default
  datacenter: DC1
labels:
- osd
- mon
- mgr
```

After that, we have the Monitor and Manager service deployments. We have a
simple configuration for these, using only the `placement parameter`. With
the `placement` parameter, we tell `cephadm` that it can deploy the Monitor
service on any host with the `mon` label.

```
---
service_type: mon
placement:
  label: "mon"
---
service_type: mgr
service_name: mgr
placement:
  label: "mgr"
```

Next, we have the `osd` service type. The `cephadm` OSD service type is
incredibly flexible: it allows you to define almost any OSD configuration
you can imagine. For full details on the OSD service spec, check
out [this document](https://docs.ceph.com/en/reef/cephadm/services/osd/#advanced-osd-service-specifications)

In our example, we take one of the most straightforward approaches possible: we
tell Cephadm to use as OSDs all free/usable media devices that are available
on the, again using the placement parameter. It will only configure OSD
devices on nodes that have the `osd` label.

In this next section, we configure the `cephfs` service to deploy
the Ceph shared file system, including metadata service (MDS) daemons.
For all service spec configuration options, check
out [this document](https://docs.ceph.com/en/reef/cephadm/services/mds/)

Finally, we populate the `rgw` service type to set up Ceph Object
Gateway (RGW) services. The RGW services provide an S3- and Swift-compatible
HTTP RESTful endpoint for clients. In this example, in the placement
section we are set the count of RGW services to `2`. This means that
the Cephadm scheduler will look to schedule two RGW daemons on
two available hosts that have the `rgw` label set. The `tcp_nodelay=1`
frontend option disable Nagle congestion control, which can improve latency
for RGW operations on small objects.

```
---
service_type: mds
service_id: cephfs
Placement:
  count: 2
  label: "mds"
---
service_type: rgw
service_id: objectgw
service_name: rgw.objectgw
placement:
  count: 2
  label: "rgw"
rgw_realm: {{ rgw_realm }}
rgw_zone: {{ rgw_zone }}
rgw_zonegroup: {{ rgw_zonegroup }}
spec:
  rgw_frontend_port: 8080
  rgw_frontend_extra_args:
  - "tcp_nodelay=1"
```

Ceph also provides an out-of-the-box load balancer based on `haproxy`
and `keepalived` called the ingress service, a term that may be familiar to
Kubernetes admins. In this example, we are
use the ingress service to balance client S3 requests among
the RGW daemons running in our cluster, providing
the object service with HA and load lalancing.
Detailed information is [here](https://docs.ceph.com/en/reef/cephadm/services/rgw/#high-availability-service-for-rgw)

We use the `rgw` label service to colocate the `haproxy`/`keepalived` daemons
with RGW services. We then set the list of floating Virtual IP addresses (VIPs)
that the clients will use to access the S3 endpoint API with
the `virtual_ips_list` spec parameter.

```
---
service_type: ingress
service_id: rgw.external-traffic
placement:
  label: "rgw"
spec:
  backend_service: rgw.objectgw
  virtual_ips_list:
    - 172.18.8.191/24
    - 172.18.8.192/24
  frontend_port: 8080
  monitor_port: 1967
```

Once we have all the services spec defined and ready, we need to pass the spec
file to the `cephadm` bootstrap command to get our cluster deployed and
configured as we have described in our file. Here is an example of the
bootstrap command using the `--apply-spec` parameter to pass our cluster
specification file:

```
# cephadm bootstrap \
    --registry-json /root/registry.json \
    --dashboard-password-noupdate \
    --ssh-user=cephadm \
    --mon-ip {{ admin_host_ip_addr }} \
    --apply-spec /root/cluster-spec.yaml
```

### Next Steps

In the next installment of this series, we’ll explore how to leverage
Jinja2 (J2) templating and Ansible in tandem with `cephadm` service spec files.
This approach will demonstrate how to build an Infrastructure as Code (IaC)
framework for Ceph cluster deployments, facilitating a streamlined
Continuous Delivery (CICD)pipeline with Git as the single source of
Ceph configuration management.

### Footnote

The authors would like to thank IBM for supporting the community by facilitating our time to create these posts.
