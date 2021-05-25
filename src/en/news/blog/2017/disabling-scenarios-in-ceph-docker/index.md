---
title: "Disabling scenarios in ceph-docker"
date: "2017-04-17"
author: "admin"
tags: 
  - "planet"
---

![Title](images/ceph-docker-disable-scenarios.jpg)

I recently completed a full resync from Kraken to Jewel in [ceph-docker](https://github.com/ceph/ceph-docker) in which I introduced a new feature to disable scenarios. Running an application on bleeding edge technology can be tough and challenging for individuals and also for companies. Even me, as a developer and for bleeding edge testers I’m tempted to release unstable features (understand not recommended for production). So sometimes it’s handy to have the ability to restrict the use of a software by disabling some of its functionality. This is exactly what I did for ceph-docker, in this article I’ll explain how that works.

We currently have a lot of scenarios to deployment, I refer a scenario sometimes as a daemon or an osd scenario. Let me clarify this. In ceph-docker, we have a single container image that holds all the Ceph daemons. So by calling it, you can run any of the Ceph daemons.

All the scenarios are contained into the `ALL_SCENARIOS` variable:

- `populate_kvstore`: will populate etcd with key and value written into the [ceph.defaults](https://github.com/ceph/ceph-docker/blob/master/ceph-releases/kraken/ubuntu/16.04/daemon/ceph.defaults) file.
- `mon`: will deploy a monitor.
- `osd`: will deploy an OSD and try to determine which OSD scenario is desired based on the variables passed at runtime.
- `osd_directory`: will deploy an OSD by simply consuming a directory, this assumes that the OSD store has been populated earlier. You can run multi-osd process into this container.
- `osd_directory_single`: identical as the `osd_directory` scenario, the only difference is that only one OSD will be picked up and started.
- `osd_ceph_disk`: will deploy an OSD using ceph-disk, it will prepare and activate a given device.
- `osd_ceph_disk_prepare`: will only prepare an OSD disk on a given device.
- `osd_ceph_disk_activate`: will only activate an OSD disk on a given device.
- `osd_ceph_activate_journal`: will only activate a journal device.
- `mds`: will deploy a Ceph metadata server.
- `rgw`: will deploy a Ceph Rados Gateway.
- `rgw_user`: will create a Rados Gateway user.
- `restapi`: will deploy the ceph-rest-api.
- `nfs`: will deploy Ceph Rados Gateway NFS.
- `zap_device`: will zap a given block device (many can be passed).
- `mon_health`: check the health of all the monitors (used when deploying on Kubernetes).

So now thanks to the [disabled\_scenario](https://github.com/ceph/ceph-docker/blob/master/ceph-releases/kraken/ubuntu/16.04/daemon/disabled_scenario) file you can disable any of the scenarios above. Disabling a daemon will be done during the image build. Instead of removing portions of the code we call a specific function that tells you the chosen scenario is disabled (at runtime).

Here is an example, I edited my `disabled_scenario` file like this:

```
EXCLUDED_TAGS="nfs"
```

Then I built my container Ubuntu 16.04 container image on Ceph Jewel like this:

<table><tbody><tr><td class="code"><pre><span class="line">ceph-docker - [master] $ ./generate-dev-env.sh jewel ubuntu <span class="number">16.04</span></span><br><span class="line">...</span><br><span class="line">...</span><br><span class="line">ceph-docker - [master] $ cd daemon</span><br><span class="line">ceph-docker - [master] $ docker build -t ceph/daemon .</span><br><span class="line">...</span><br><span class="line">...</span><br></pre></td></tr></tbody></table>

And then I ran my container image like so:

<table><tbody><tr><td class="code"><pre><span class="line">$ sudo docker run -d --name ceph-<span class="built_in">nfs</span> ceph/daemon <span class="built_in">nfs</span></span><br><span class="line">ceph-<span class="built_in">nfs</span></span><br><span class="line">a1ef6079e0d8d83cda9f9254fc04947f33e1131ea252425f0d2e2d162fa4b17f</span><br></pre></td></tr></tbody></table>

Now let’s look at this container logs:

<table><tbody><tr><td class="code"><pre><span class="line">$ sudo docker logs -f ceph-nfs</span><br><span class="line">ERROR: <span class="string">'nfs'</span> scenario <span class="keyword">or</span> key/<span class="built_in">value</span> store <span class="string">'none'</span> is <span class="keyword">not</span> supported <span class="keyword">by</span> this distribution.</span><br><span class="line">ERROR: <span class="keyword">for</span> <span class="keyword">the</span> list <span class="keyword">of</span> supported scenarios, please refer <span class="built_in">to</span> your vendor.</span><br></pre></td></tr></tbody></table>

As you can see, I’m getting an error and the container won’t run.

  

> In a feature version, I might introduce the support of Docker `--build-arg` to set `EXCLUDED_TAGS` as a build-time variable. So it will be easier for automated CI to quickly build more images with different scenarios available.

Source: Sebastian Han ([Disabling scenarios in ceph-docker](https://sebastien-han.fr/blog/2017/04/17/Disabling-scenarios-in-ceph-docker/))
