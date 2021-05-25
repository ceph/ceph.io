---
title: "Containerize Ceph: store config options in monitor KV store"
date: "2017-02-27"
author: "admin"
tags: 
  - "planet"
---

![Title](images/ceph-config-kv-store.jpg)

During the last CDM (Ceph Developer Monthly), I presented a blueprint that will help Ceph playing nicely when it’s being containerized.

## I. Containerized Ceph: generating Ceph config file

While running a containerized version of Ceph in Kubernetes, generating the `ceph.conf` is complex but crucial since containers have to be as self-sufficient as possible. We can not have another orchestration tool to manage cluster files such as `ceph.conf` and ceph keys. Maybe complex is not the right word, so let’s say it involves a couple of components in order to happen. The current mechanism uses [etcd](https://github.com/coreos/etcd), a REST distributed reliable key-value store. This is nice since the KV store sits somewhere in your infrastructure and we can use it to store and retrieve values without the need of distributing flat files using whatever method. When bootstrapping initial monitor they need to be aware of each other, so they need to use the same initial monitor map and monitor key. These two files must somehow be made available for each container, `etcd` helps us greatly with that. We basically inject keys and their respective values where each key corresponds to a Ceph option. So this store needs to be pre-populated before the initial monitors are deployed. To populate the kv store we have an option in our `ceph/daemon` image called `populate_kv`, for more information on how to use it, see the [README](https://github.com/ceph/ceph-docker/tree/master/ceph-releases/kraken/ubuntu/16.04/daemon#kv-backends).

Once `etcd` is fed with our keys, we deploy our initial monitor like this:

<table><tbody><tr><td class="code"><pre><span class="line">$ sudo docker run -d --net=host </span><br><span class="line">-v /var/<span class="class"><span class="keyword">lib</span>/<span class="title">ceph</span>:/<span class="title">var</span>/<span class="title">lib</span>/</span></span><br><span class="line">-e MON_IP=<span class="number">192.168</span>.<span class="number">0.20</span> </span><br><span class="line">-e CEPH_PUBLIC_NETWORK=<span class="number">192.168</span>.<span class="number">0.0</span>/</span><br><span class="line">-e KV_TYPE=etcd </span><br><span class="line">-e KV_IP=<span class="number">192.168</span>.<span class="number">0.20</span> </span><br><span class="line">ceph/daemon mon</span><br></pre></td></tr></tbody></table>

Our cluster path on `etcd` points by default to `https://192.168.0.20:4001/ceph-config/ceph/`

Here’s an example of a key tree for a cluster named ‘ceph’:

```
ceph-config/ceph/global/max_open_files
ceph-config/ceph/global/osd_pool_default_pg_num
ceph-config/ceph/global/mon_osd_full_ratio
ceph-config/ceph/global/mon_osd_nearfull_ratio

ceph-config/ceph/mon/mon_osd_down_out_interval
ceph-config/ceph/mon/mon_osd_min_down_reporters
ceph-config/ceph/mon/mon_clock_drift_allowed

ceph-config/ceph/osd/osd_journal_size
ceph-config/ceph/osd/cluster_network
ceph-config/ceph/osd/public_network
```

It’s also possible to have a more fine grained configuration, for each daemon like: `ceph-config/ceph/osd/osd.$id/crush_location`

Once the container starts, the entrypoint looks for all the keys from our cluster path in `etcd` and builds the `ceph.conf` with a help of [confd](https://github.com/kelseyhightower/confd). `confd` is a binary that builds configuration files by looking at key on a kv store and by using a specific template. It’s like an INI-style generator on steroid since it can construct files while looking at `etcd` keys.

From now on, this has been working pretty well and we don’t have many complaints except using non-standard components. Introducing new software is always tricky when it comes to supporting an application stack, so we are looking at using more standard tools. New software means supporting it and making sure it’s maintained, we will also have to manage bugs and so forth. Moreover, it’s always hard to tell if any tool will survive and will be maintained for a while. For all of those reasons, we don’t really want to put our stack at risk for a certain tool.

**For us, the best and cleaner way to do this is within Ceph directly.**

## II. The proposal

Instead of using an external KV like `etcd` and relying on `confd` to build our configuration we would like to have Ceph storing these options in its own KV store: the [one from the Ceph monitors](http://www.sebastien-han.fr/blog/2015/05/04/ceph-using-monitor-key-slash-value-store/). When you look at the mandatory options needed in your `ceph.conf` to bootstrap your initial monitors, they are fairly low:

- `fsid`: cluster fsid
- `mon_initial_members`: list of initial cluster mon hostnames
- `mon_host`: list of initial cluster mon IPs
- `initial_mon_keyring`: initial keyring to bootstrap and to authenticate to each monitor and forms the initial quorum

To put this simply, we want to get rid of the `ceph.conf` file and only rely on the Ceph monitors for the configuration. This gives us more control on which option is applied and everything is self-maintained by Ceph.

Using the existing Ceph monitor store is easier since we don’t need to implement a new layer and new protocols to talk too. Security and authentication mechanisms remain the same, we just use `cephx`.

### II.1. Monitors bootstrap and necessary improvements

So this basic idea is to improve the current CLI for the `ceph-mon` binary. This means we can get rid of anything local `ceph.conf` file to create our cluster. Daemons have their default options so they can start and use them.

The preparation of the monitors remain the same, so we:

- Pass all the keys used by the cluster initially:
    - initial monitor key
    - client.admin key
    - daemons bootstrap key
- Pass the cluster fsid that we explicitly created to the container
- The container creates the necessary files (keys only)
- The monitor store is populated

Once we have that, we can run our initial monitors like (assuming three monitors):

```
$ sudo ceph-mon -d -i ${MON_NAME} 
--public-addr "${MON_IP}:6789" 
--setuser ceph 
--setgroup ceph 
--mon-data "$MON_DATA_DIR" 
--mon-host "192.168.0.1,192.168.0.2,192.168.0.3" 
--mon-initial-members "192.168.0.1,192.168.0.2,192.168.0.3"
```

Start all the three monitors and they will all try to connect to each other. This marks the end of phase 1, we have three monitors that achieved quorum so the cluster is up and running.

### II.2. Other daemons bootstrap and necessary improvements

The preparation of each daemon remains the same:

- Pass the proper bootstrap key to the container so it creates the files in the right
- Pass the monitor address to the container so the CLI can use it with `-m` option when creating the daemon key
- Populate the daemon store

For the OSD, we might have to extend `ceph-disk` to support a monitor address so when it calls the Ceph CLI to create OSD it points to the monitors only and doesn’t look for any `ceph.conf`. The `ceph-disk` case is particular, the CLI might need more improvement and extension to support initial OSD bootstrap options such as `osd_journal_size`, filesystem etc… The rest of the daemons shouldn’t have any issues.

Once each daemon has been prepared, we also need to extend their CLI to add the support of monitor(s) address. Eventually, this is how you will run you OSD:

```
$ sudo ceph-osd -d 
-i ${OSD_ID} 
--setuser ceph 
--setgroup disk 
--mon-host "192.168.0.1,192.168.0.2,192.168.0.3"
```

As mentioned daemons have their defaults so they won’t fail the initial contact with the monitors.

## III. Reading config options from the monitors

And now, the most interesting part, or at least the core of the proposal, each new daemons will get its configuration options from the Ceph monitor KV store. This means all the newly bootstrapped Ceph daemons like OSD, MDS, RGW, rbd-mirror. In terms of steps, an OSD (for example) will start and connect to the monitor using its daemon key. It will lookup on the following path in the monitor KV store `${CLUSTER}/global/` for any particular option that might need to be changed from its default.

There will be a sequence right after the monitor’s deployment where we can populate the monitor KV store to apply different Ceph options.

Another goodness of this feature is the ability to watch keys for changes, so just like inject args. Each daemon should be able to watch for new keys and update its configuration accordingly (if possible, otherwise we will wait until the next restart). This should give us a better idea and control on the options that are injectable and the ones that are not. It’s still a bit of mystery at the moment :).

  

> Our target for this new implementation is Luminous, but I guess I’m being too optimistic here, even Sage said I was… I’m happy that my friend Erwan Velu will work on this big project. Even of the design seems pretty clear and straightforward to me, we will likely hit hiccups on the road. So perhaps, the release after Luminous will have this new functionality.

Source: Sebastian Han ([Containerize Ceph: store config options in monitor KV store](https://sebastien-han.fr/blog/2017/02/27/Containerize-Ceph-blueprint-store-ceph-options-in-monitor-kv-store/))
