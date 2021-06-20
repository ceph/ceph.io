---
title: "Introducing Cephadm"
date: "2020-03-25"
author: "sage"
tags: 
  - "cephadm"
  - "orchestrator"
---

A wide variety of Ceph deployment tools have emerged over the years with the aim of making Ceph easier to install and manage. Most of these have leveraged existing tools like Ansible, Puppet, and Salt, bringing with them an existing ecosystem of users and an opportunity to align with an existing investment by an organization in a particular tool. As a result, however, the Ceph community's investment has been fragmented across many different efforts, new users are faced with a difficult choice of tool when starting out, and attempts to simplify the experience and integration with Ceph itself has been difficult.

Like many others, I've personally stuck with the dated ceph-deploy tool, which has the benefit of being extremely simple to use and understand (at least for someone familiar with Ceph), and has the nice property of not requiring an initial investment in installing and learning another tool. These days ceph-deploy is no longer maintained, however, and doesn't even work with some newer distros like RHEL/CentOS 8.

Most importantly, however, none of these tools has done a great job of solving the core problem: making Ceph very easy to install for a new user, and making a Ceph cluster easy to maintain over time through seamless integration with the Ceph CLI and GUI. A new _orchestrator API_ was first introduced in Ceph Nautilus to provide a generic way for Ceph--the CLI and the dashboard--to interact with its deployment environment, whether it's [Rook](https://rook.io/) or [ceph-ansible](https://docs.ceph.com/ceph-ansible/master/) or [DeepSea](https://github.com/SUSE/DeepSea/wiki), but only with Octopus has this reached a level of maturity where it is providing meaningful abstraction across multiple backends: Rook for Kubernetes environments, and Cephadm for everyone else.

## Enter Cephadm

The goal of [Cephadm](https://docs.ceph.com/docs/octopus/cephadm/) is to provide a fully-featured, robust, and well-maintained install and management layer that can be used for anyone that is not running Ceph in Kubernetes. The goals we set out with include:

- **Deploy all components in containers.** Using [containers](https://docs.ceph.com/docs/octopus/install/containers/) simplifies the dependency management and packaging burden across different distributions. We're still building RPM and Deb packages, of course, but as more users transition to cephadm (or Rook) and the container builds, the fewer OS-specific bugs we'll see.
- **Tight integration with the orchestrator API.** Ceph's orchestrator interface evolved extensively during the development of cephadm in order to match the implementation and to cleanly abstract the (slightly different) functionality present in Rook. The end result is something that looks, feels, and acts like a part of Ceph.
- **No dependency on management tools.** Systems like Salt and Ansible are great when deployed at scale across a large organization, but making Ceph depend on such a tool means there is one more piece of software for users to learn. More importantly, the resulting deployment ends up being much more complicated, harder to debug, and (most significantly) slower than something that is purpose-built for managing just Ceph.
- **Minimal OS dependencies.** Cephadm requires Python 3, LVM, and a container runtime--either Podman or Docker. Any modern Linux distro will do.
- **Isolate clusters from each other.** Supporting multiple Ceph clusters coexisting on the same host has historically been a niche scenario, but it does come up, and having a robust, generic way to isolate clusters from each other makes testing and redeploying clusters a safe and natural process for both developers and users.
- **Automated upgrades.** Once Ceph "owns" its own deployment, it can take responsibility for [upgrading Ceph](https://docs.ceph.com/docs/octopus/cephadm/upgrade/) in a safe and automated fashion.
- **Easy migration from "legacy" deployment tools.** We need to allow existing Ceph deployments from existing tools like ceph-ansible, ceph-deploy, and DeepSea to [painlessly transition to cephadm](https://docs.ceph.com/docs/octopus/cephadm/adoption/).

The goal with all of this is to focus the attention of the Ceph developer and user community on just two platforms for deploying and managing Ceph--cephadm for "bare metal" deployments, and Rook for running Ceph in Kubernetes--and to provide a similar management experience for both of them.

## Bootstrap

The cephadm model is to have a simple "[bootstrap](https://docs.ceph.com/docs/octopus/cephadm/install/)" step that is started from a command line that brings up a minimal Ceph cluster (a single monitor and manager daemon) on the local host. The rest of the cluster is then deployed using "day 2" orchestrator commands to add additional hosts, consume storage devices, and deploy daemons for cluster services.

Getting a cluster bootstrapped is as simple as:

> curl --silent --remote-name --location https://github.com/ceph/ceph/raw/octopus/src/cephadm/cephadm
> chmod +x cephadm
> mkdir -p /etc/ceph
> ./cephadm bootstrap --mon-ip <ip>

After 30 to 60 seconds, a minimal Ceph cluster will be up and running, and cephadm will have printed out command to access the Ceph CLI (via a containerized shell) and a URL to access the dashboard:

> INFO:cephadm:Ceph Dashboard is now available at:
> 
>              URL: https://gnit:8443/
>             User: admin
>         Password: 07j394z550
> 
> INFO:cephadm:You can access the Ceph CLI with:
> 
>         sudo ./cephadm shell --fsid 2d2fd136-6df1-11ea-ae74-002590e526e8 -c /etc/ceph/ceph.conf -k /etc/ceph/ceph.client.admin.keyring
> 
> INFO:cephadm:Bootstrap complete.

## Accessing the Ceph CLI

Because Ceph is fully containerized (check `podman ps` or `docker ps`), no software has been installed on the host, and the usual `ceph` command won't work (not yet, at least). There are a few ways to interact with the new cluster.

One way is to use the `cephadm shell` command. The cephadm that was used to bootstrap can also launch a containerized shell that has all of the Ceph software (including the CLI) installed. And because bootstrap puts a copy of the ceph config and admin keyring in `/etc/ceph` by default, and the shell command looks there by default, you can launch a working shell and use the CLI with just

> ./cephadm shell
> ceph status

The cephadm command also makes it easy to install "traditional" Ceph packages on the host. To install the Ceph CLI commands and the cephadm command in the standard locations,

> ./cephadm add-repo --release octopus
> ./cephadm install cephadm ceph-common

This supports a few common Linux distros to start (CentOS/RHEL, Debian/Ubuntu, OpenSUSE/SLE) and can easily be extended to support new ones.

## Expanding the cluster

Any real Ceph cluster spans multiple hosts. Cephadm manages the cluster by using SSH to connect from the ceph-mgr daemon to hosts in the cluster to introspect the environment, monitor Ceph daemons, and deploy or remove daemons. Each Ceph cluster generates a unique SSH identity and key that is used to connect to hosts. The bootstrap process adds this key to the local host's root user's `authorized_keys` file for you. Adding additional hosts, however, requires a few manual steps.

First, we need a copy of the public side of the cluster key. By default bootstrap puts a copy at `/etc/ceph/ceph.pub`, or you can fetch a copy from the cluster with `ceph cephadm get-ssh-pub-key`.

For each host, we first need to install the key on the remote system. This is most easily done with the `ssh-copy-id` command included with any recent version of SSH:

> ssh-copy-id -f -i /etc/ceph/ceph.pub root@new-host

This command may prompt for a root password if your current user does not already have password-less SSH access set up.

Next, we need to tell Ceph about the new host. We assume here that all hosts have a unique hostname that matches the configured hostname on the host itself. If your local environment does not also have DNS configured such that we connect to these hostnames, or if you would like to avoid a dependency on DNS, you can provide an IP address for each host as well:

> ceph orch host add <new-host> \[<new-host-ip>\]

You can see all hosts in the cluster with

> ceph orch host ls

## Managing Ceph monitor, manager, and other daemons

Each _service_ or collection of daemons in Cephadm has an associated _[placement spec](https://docs.ceph.com/docs/octopus/mgr/orchestrator/#placement-specification)_, or description of where and how many daemons should be deployed. By default, a new Ceph cluster with cephadm knows that clusters should have 5 monitors, 2 managers, and a few other services (like a crash dump collector) deployed on every host. New monitors and managers are deployed automatically as soon as additional hosts are added to the cluster. You can see the new clusters services and deployed daemons with the `ceph orch ls` and `ceph orch ps` commands:

> \# ceph orch ls
> NAME           RUNNING  REFRESHED  AGE  PLACEMENT  IMAGE NAME                           IMAGE ID      
> alertmanager       1/1  71s ago    22m  count:1    docker.io/prom/alertmanager:latest   0881eb8f169f  
> crash              1/1  71s ago    23m  \*          docker.io/ceph/ceph:v15              204a01f9b0b6  
> grafana            1/1  71s ago    22m  count:1    docker.io/ceph/ceph-grafana:latest   87a51ecf0b1c  
> mgr                1/2  71s ago    23m  count:2    docker.io/ceph/ceph:v15              204a01f9b0b6  
> mon                1/5  71s ago    23m  count:5    docker.io/ceph/ceph:v15              204a01f9b0b6  
> node-exporter      1/1  71s ago    22m  \*          docker.io/prom/node-exporter:latest  e5a616e4b9cf  
> prometheus         1/1  71s ago    22m  count:1    docker.io/prom/prometheus:latest     e935122ab143  
> # ceph orch ps
> NAME                HOST  STATUS         REFRESHED  AGE  VERSION  IMAGE NAME                           IMAGE ID      CONTAINER ID  
> alertmanager.gnit   gnit  running (21m)  96s ago    22m  0.20.0   docker.io/prom/alertmanager:latest   0881eb8f169f  15ceff5ae935  
> crash.gnit          gnit  running (22m)  96s ago    23m  15.2.0   docker.io/ceph/ceph:v15              204a01f9b0b6  0687711365e4  
> grafana.gnit        gnit  running (21m)  96s ago    22m  6.6.2    docker.io/ceph/ceph-grafana:latest   87a51ecf0b1c  fa1db4647c4c  
> mgr.gnit.xmfvjy     gnit  running (24m)  96s ago    24m  15.2.0   docker.io/ceph/ceph:v15              204a01f9b0b6  6a29bc868357  
> mon.gnit            gnit  running (24m)  96s ago    24m  15.2.0   docker.io/ceph/ceph:v15              204a01f9b0b6  072f5926faa8  
> node-exporter.gnit  gnit  running (22m)  96s ago    22m  0.18.1   docker.io/prom/node-exporter:latest  e5a616e4b9cf  eb5f715005fc  
> prometheus.gnit     gnit  running (22m)  96s ago    22m  2.16.0   docker.io/prom/prometheus:latest     e935122ab143  6ee6de1b3cc1  

In the example output above, you'll notice that a number of non-Ceph daemons are deployed: Prometheus, Grafana, alertmanager, and node-exporter. These provide a basic but fully configured and functional monitoring stack that allow all of the metrics and graphs for the Ceph dashboard to work out of the box. If you already have an existing Prometheus deployment you'd like Ceph to use, you can tell cephadm to skip all of this by passing `--skip-monitoring-stack` to the bootstrap command.

For most users, this default behavior is all that you need. For advanced users who want to control exactly which hosts monitors are deployed on, or which IPs are chosen, some additional steps are needed to customized the placement of these daemons. Automated placement for specific services (like monitors) can even be disabled entirely, although there should be relatively few reasons to do so.

Once a cluster is up running, a minimal but sufficient `ceph.conf` file for hosts accessing the cluster can be fetched with:

> \# ceph config generate-minimal-conf

## Adding storage

Adding OSDs to the Ceph cluster is usually one of the trickiest part of a deployment. There are a variety of ways that HDDs and SSDs can be combined to balance performance and cost, and telling Ceph which devices to consume can be tricky.

For many users, we hope, the following command will be sufficient:

> ceph orch apply osd --all-available-devices

This will consume any device (HDD or SSD) on any host that is part of the Ceph cluster that passes all of the safety checks, which means there are no partitions, no LVM volumes, no file systems, etc. Each device will get a single OSD deployed, which is the simplest case that applies to many (if not most) users.

For the rest of us, we have several tools at our disposal. We can enumerate all devices on all hosts (and the status of the above safety checks) with:

> ceph orch device ls

A single OSD can be created on a single device explicitly with:

> ceph orch daemon add osd host-foo:/dev/foo

For more sophisticated automation, however, the orchestrator API introduces the concept of [DriveGroups](https://docs.ceph.com/docs/master/cephadm/drivegroups/#drivegroups), which allow OSD deployments to be described in terms of device properties (SSD vs HDD, model name, size, host name patterns), and for "hybrid" OSDs that combine multiple devices (e.g., SSD for metadata and HDD for data) to be deployed in a semi-automated fashion.

## Deploying storage services

Other Ceph daemons are stateless, in the sense that they don't store any data locally and can be trivially redeployed on any host. These are easy for cephadm... and in the case of CephFS, their deployment is completely automated. For example, to create a CephFS file system called `foo`

> ceph fs volume create foo

will create the necessary data and metadata pools and deploy MDS daemons all in one step. The number and placement of daemons can be examined and adjusted later via the `ceph orch ls` and `ceph orch apply mds ...` commands, or an optional placement argument can be passed to the volume create command.

For object storage with RGW, things aren't quite as streamlined (yet), but the orchestrator and cephadm infrastructure is there to manage the underlying daemons. For a standalone object storage cluster,

> radosgw-admin realm create --rgw-realm=myorg --default
> radosgw-admin zonegroup create --rgw-zonegroup=default --master --default
> radosgw-admin zone create --rgw-zonegroup=default --rgw-zone=us-east-1 --master --default
> ceph orch apply rgw myorg us-east-1

For an existing (multi-site or standalone) deployment, deploying the daemons can be as simple as `ceph orch apply rgw <realmname> <zonename>`, provided the RGW configuration options are already stored in the cluster's config database (`ceph config set client.rgw.$realmname.$zonename ...`) and not in a `ceph.conf` file.

## Upgrades

One of the nicest features of cephadm, once you have your new cluster deployed (or existing cluster [upgraded and converted](https://docs.ceph.com/docs/octopus/cephadm/adoption/)), is its ability to [automate upgrades](https://docs.ceph.com/docs/octopus/cephadm/upgrade/). In most cases, this is as simple as:

> ceph orch upgrade start --ceph-version 15.2.1

The upgrade progress can be monitored from the `ceph status` view, which will include a progress bar like:

>     Upgrade to docker.io/ceph/ceph:v15.2.1 (3m)
>       \[===.........................\] (remaining: 21m)

## A look under the hood

It's helpful (and, for me, comforting) to be able to take a closer look at what cephadm is doing behind the scenes to run services on remote hosts. The first thing you can take a look at is the running containers with `podman ps` or `docker ps`. You'll notice that all containers have the cluster fsid UUID in the name so that multiple clusters may be present on the same host without bumping into each other. (This is mostly true, except for when daemons used fixed ports, like the Ceph monitor, or services like the prometheus node-exporter.)

The files are all separate as well. In `/var/lib/ceph` and `/var/log/ceph` you'll find things are separated out by cluster fsid. And in each of these daemon directories you'll see a file called `unit.run` which has the docker or podman command that starts the daemon--this is what the systemd unit executes.

Although you may recall that the bootstrap step wrote files to `/etc/ceph`, it did that only for convenience so that in the common case of a single cluster on the host, simply installing the `ceph-common` package will allow the `ceph` CLI to work. Passing `--output-dir .` (or similar) to bootstrap will write those files elsewhere.

In fact, the only other changes present the host OS are

- the systemd unit files written to `/etc/systemd/system` for each cluster (`ceph-$fsid.target` for each cluster`ceph-$fsid@.service` shared by all daemons)
- an overall `ceph.target` unit to start/stop _all_ Ceph services
- a logrotate file at `/etc/logrotate.d/ceph-$fsid`, in case [logging to files](https://docs.ceph.com/docs/octopus/cephadm/operations/#logging-to-files) is enabled. (By default, cephadm daemons log to stderr and logs are captured by the container runtime.)

Meanwhile, changes are being driven by the cephadm module running in the ceph-mgr daemon. Services are configured via the orchestrator interface, which is accessible either via the internal Python interfaces (e.g., for use by the dashboard) or via the CLI. To see all available commands, try `ceph orch -h`. `ceph orch ls` in particular will describe the currently configured services.

In the background, cephadm has a "reconciliation loop," much like Kubernetes, that compares the current state to the desired state, as specified by the configured services. To monitor its activity, `ceph -W cephadm` will tail the log as it makes changes, or `ceph log last cephadm` will show recent messages. This background work can be paused at any time with `ceph orch pause` and resumed with `ceph orch resume`.

## Looking forward

With the initial Octopus release, cephadm has solid support for the core Ceph services: RADOS, CephFS, RBD, and RGW. A number of secondary services are under active development, including NFS and iSCSI gateway support, and CIFS support (via Samba) is expected to follow after that. All of these changes will be backported to Octopus as they are completed.

Meanwhile, we also expect to improve the robustness and intelligence of the "scheduling" algorithm that decides where to run services. Right now cephadm simply spreads service daemons across hosts, but (by default) chooses those hosts at random. We'd like to improve this by setting resource limits on daemon containers (e.g., CPU and memory) and choosing the location of daemons intelligently based on the available resources on each host.

Finally, we expect to spend a lot of time over the next development cycle surfacing more of the orchestrator functionality through the Ceph dashboard to simplify the overall user experience, especially for common operations like initial deployment, cluster expansion, and the replacement of failed storage devices.

## Feedback welcome!

Last but not least: Cephadm is brand new, and we're looking for feedback from real users deploying it for the first time in the real world to hear about what works well and what doesn't, and what we can do to improve things!

For more information on Cephadm, please see the [online documentation](https://docs.ceph.com/docs/octopus/cephadm/).

A big thank you goes out to the team that made cephadm possible: Sebastian Wagner, Joshua Schmidt, Michael Fritch, Daniel Pivonka, Paul Cuzner, Kristoffer Grönlund, Kiefer Chang, Patrick Seidensal, and Volker Theile; to Noah Watkins, who wrote the first version of the "ssh orchestrator;" and to John Spray, who got the whole orchestrator abstraction started way back in Nautilus.
