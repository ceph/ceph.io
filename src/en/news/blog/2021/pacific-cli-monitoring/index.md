---
title: "Ceph Pacific:Exploiting Prometheus data from the CLI"
date: "2021-09-14"
author: "Paul Cuzner"
---

For a while now, Ceph has directly supported the [Prometheus](https://prometheus.io) monitoring and alerting environment, via the `mgr/prometheus` module. In fact, since the Ceph Octopus release, the ceph orchestrator can install Prometheus and Alertmanager for you, taking care of all deployment configuration tasks, including ceph-dashboard integration. That in itself is pretty cool.

Visualizing the data is normally left to one of the GUI front-ends like ceph-dashboard, Grafana or even the Prometheus server UI itself. However, the data that the mgr/prometheus module provides is available to **any application** via a simple `GET` request. Now not every Ceph user is a GUI user, so I started to kick around the idea of a tool that CLI users could use which consumed the same Prometheus data. After all, the data is already being 'composed' by the mgr module for Prometheus, which makes it _"free"_, and accessing it is simple!

This was the idea and motivation behind the [cmon](https://github.com/pcuzner/cmon) tool. Before I go any further, first the disclaimer: 'cmon' is **not** an official Ceph project, it's a proof of concept to see if the idea makes sense to the wider user community.

With that said, lets look at what 'cmon' provides;

- A core set of panels covering Inventory, Capacity, Performance and Health
- Optional panels that can be togged on/off within the interface using command keys;
  - IO Load graphs (IOPS and throughput) using data pulled from the Prometheus server (i)
  - Active alerts triggered by Prometheus alert rules (a)
  - Pool configuration and performance (p)
  - RBD image performance, similar to rbd-top (r)
  - RGW performance (g)
  - Ceph CLI integration (c) - _currently on the devel branch_
- Integrated help
- container based deployment - nothing to install, no dependencies!
- 15 second refresh interval

I could dive into each of these options, but maybe you'd rather watch a video!

{% YouTube '24vulOxXWXY', 'Monitoring your Ceph cluster from the CLI, with cmon' %}

&nbsp;
There are couple of benefits to reusing the data that mgr/prometheus provides;

1. cmon doesn't have any Ceph _baggage_ or introduce any new components into the Ceph stack.
2. the format of the data that mgr/prometheus provides is very well maintained and controlled. In fact, cmon isn't just applicable to Ceph Pacific clusters, it works with Octopus and Nautilus releases too!
3. cmon can be easily containerized and, at least in theory, would work against any Ceph Nautilus or above cluster, regardless of the OS or Ceph distribution type

Interested? The easiest way to take cmon for a test drive is to grab the container, and define an alias to run it like this;

```
docker pull docker.io/pcuzner/cmon:latest
alias cmon="podman run --interactive --tty --net=host -e TERM \
  -e CEPH_URL=http://192.168.122.92:9283/metrics \
  -e PROMETHEUS_URL=http://192.168.122.92:9095 \
  --entrypoint='/cmon.py' docker.io/pcuzner/cmon:latest"
```

Don't forget to change the CEPH_URL and PROMETHEUS_URL parameters to match your environment. This example is using the 'latest' stable code - which at the time of writing (Sep 2021) will not include the CLI integration. If you want to try that you'll need to give cmon some Ceph credentials.

1. Create a directory holding your keyring and conf, that looks like this;

```
[root@mydesktop ~]# tree etc_ceph
etc_ceph
├── ceph.client.admin.keyring
└── ceph.conf

```

2. Create your alias with a volume binding to your directory and use the _devel_ image tag to pick up the correct cmon image.
   e.g.

```
docker pull docker.io/pcuzner/cmon:devel
alias cmon='podman run --interactive --tty --net=host -e TERM \
  -e CEPH_URL=http://192.168.122.92:9283/metrics \
  -e PROMETHEUS_URL=http://192.168.122.92:9095 \
  -v /root/etc_ceph:/etc/ceph:ro,z \
  --entrypoint='\''/cmon.py'\'' docker.io/pcuzner/cmon:devel'
```

Either way, once the alias is defined you can run 'cmon' and should be presented with the core panels view. The display gets refreshed every 15 seconds (there's a countdown indicator in the bottom right corner). Pressing 'h', overlays the help page on the display which tells you about the command keys which toggle the optional panels.

You could even create multiple aliases pointing to different Ceph clusters, and since the optional panels are parameters to cmon, you could tailor the displays to the clusters role...RGW or rbd for example.

If you're a Ceph user, and prefer to use the CLI, maybe a tool like this would be helpful. However, don't expect it to magically appear in the next Ceph release. Remember - at this point, cmon is a proof of concept to gauge community interest. If you think this utility would be a helpful addition to your Ceph 'toolbox', head on over to the projects [repo](https://github.com/pcuzner/cmon). You can simply ⭐ the project, or comment/vote in the [discussions](https://github.com/pcuzner/cmon/discussions/12).
