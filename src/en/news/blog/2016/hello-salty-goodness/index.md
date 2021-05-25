---
title: "Hello Salty Goodness"
date: "2016-11-02"
author: "admin"
tags: 
  - "planet"
---

Anyone who’s ever deployed [Ceph](http://ceph.com/) presumably knows about [ceph-deploy](http://docs.ceph.com/docs/jewel/rados/deployment/). It’s right there in the Deployment chapter of the upstream docs, and it’s pretty easy to use to get a toy test cluster up and running. For any decent sized cluster though, ceph-deploy rapidly becomes cumbersome… As just one example, do you really want to have to `` `ceph-deploy osd prepare` `` _every_ disk? For larger production clusters it’s almost certainly better to use a fully-fledged configuration management tool, such as [Salt](https://saltstack.com/), which is what this post is about.

For those not familiar with Salt, the quickest way I can think to describe it is as follows:

- One host is the Salt master.
- All the hosts you’re managing are Salt minions.
- From the master, you can do things to the minions, for example you can run arbitrary commands. More interestingly though, you can create state files which will ensure minions are configured in a certain way – maybe a specific set of packages are installed, or some configuration files are created or modified.
- Salt has a means of storing per-minion configuration data, in what’s called a pillar. All pillar data is stored on the Salt master.
- Salt has various runner modules, which are convenience applications that execute on the Salt master. One such is the orchestrate runner, which can be used to apply configuration to specific minions in a certain order.

There’s [a bit more to Salt](https://docs.saltstack.com/en/latest/) than that, but the above should hopefully provide enough background that what follows below makes sense.

To use Salt to deploy Ceph, you obviously need to install Salt, but you also need a bunch of Salt state files, runners and modules that know how to do all the little nitty gritty pieces of Ceph deployment – installing the software, bootstrapping the MONs, creating the OSDs and so forth. Thankfully some of my esteemed colleagues on the [SUSE Enterprise Storage](https://www.suse.com/products/suse-enterprise-storage/) team have created [DeepSea](https://github.com/SUSE/DeepSea), which provides exactly that. To really understand DeepSea, you should probably review the [Intro](https://github.com/SUSE/DeepSea/wiki/intro), [Management](https://github.com/SUSE/DeepSea/wiki/management) and [Policy](https://github.com/SUSE/DeepSea/wiki/policy) docs, but for this blog post, I’m going to take the classic approach of walking through set up of (you guessed it) a toy test cluster.

I have six hosts here, imaginatively named:

- ses4-0.example.com
- ses4-1.example.com
- ses4-2.example.com
- ses4-3.example.com
- ses4-4.example.com
- ses4-5.example.com

They’re all running SLES 12 SP2, and they all have one extra disk, most of which will be used for Ceph OSDs.

ses4-0 will be my Salt master. Every host will also be a Salt minion, including ses4-0. This is because DeepSea needs to perform certain operations on the Salt master, notably automatically creating initial pillar configuration data.

So, first we have to install Salt. You can do this however you see fit, but in my case it goes something like this:

ssh ses4-0 'zypper --non-interactive install salt-master ;
            systemctl enable salt-master ;
            systemctl start salt-master'
for n in $(seq 0 5) ; do
    ssh ses4-$n 'zypper --non-interactive install salt-minion ;
                 echo "master: ses4-0.example.com" > /etc/salt/minion.d/master.conf ;
                 systemctl enable salt-minion ;
                 systemctl start salt-minion'
done

Then, on ses4-0, accept all the minion keys, and do a test.ping if you like:

ses4-0:~ # salt-key -A
The following keys are going to be accepted:
Unaccepted Keys:
ses4-0.example.com
ses4-1.example.com
ses4-2.example.com
ses4-3.example.com
ses4-4.example.com
ses4-5.example.com
Proceed? \[n/Y\] y
Key for minion ses4-0.example.com accepted.
Key for minion ses4-1.example.com accepted.
Key for minion ses4-2.example.com accepted.
Key for minion ses4-3.example.com accepted.
Key for minion ses4-4.example.com accepted.
Key for minion ses4-5.example.com accepted.

ses4-0:~ # salt '\*' test.ping
ses4-0.example.com:
    True
ses4-5.example.com:
    True
ses4-3.example.com:
    True
ses4-2.example.com:
    True
ses4-1.example.com:
    True
ses4-4.example.com:
    True

That works, so now DeepSea needs to be installed on the salt-master host (ses4-0). There’s [RPMs available](https://build.opensuse.org/package/show/home:swiftgist/deepsea) for various SUSE distros, so I just ran `` `zypper in deepsea` ``, but for other distros you can run `` `make install` `` from a clone of the source tree to get everything in the right place. If you’re doing the latter, you’ll need to `` `systemctl restart salt-master` `` so that it picks up /etc/salt/master.d/modules.conf and /etc/salt/master.d/reactor.conf included with DeepSea. Note: we’ll happily accept patches from anyone who’s interested in helping with packaging for other distros ![;-)](http://ourobengr.com/wp-includes/images/smilies/icon_wink.gif)

There’s one other tweak required. /srv/pillar/ceph/master\_minion.sls specifies the hostname of the salt master. When installing the RPM, this is automatically set to `$(hostname -f)`, so in my case I have:

ses4-0:~ # cat /srv/pillar/ceph/master\_minion.sls 
master\_minion: ses4-0.example.com

If you’re not using the RPM, you’ll need to tweak that file appropriately by hand.

Now comes the interesting part. DeepSea splits Ceph deployment into several stages, as follows:

Stage 0: Provisioning

Ensures latest updates are installed on all minions (technically this is optional).

Stage 1: Discovery

Interrogates all the minions and creates pillar configuration fragments in /srv/pillar/ceph/proposals.

Stage 2: Configure

Before running this stage, you have to create a /srv/pillar/ceph/proposals/policy.cfg file, specifying which nodes are to have which roles (MON, OSD, etc.). This stage then merges the pillar data into its final form.

Stage 3: Deploy

Validates the pillar data to ensure the configuration is correct, then deploys the MONs and OSDs.

Stage 4: Services

Deploys non-core services ([iSCSI gateway](https://github.com/SUSE/lrbd), CephFS, RadosGW, [openATTIC](http://openattic.org/home.html)).

Stage 5: Removal

Used to decommission hosts.

Let’s give it a try. Note that there’s presently a couple of SUSE-isms in DeepSea (notably some invocations of `` `zypper` `` to install software), so if you’re following along at home on a different distro and run into any kinks, please either [let us know what’s broken](https://github.com/SUSE/DeepSea/issues) or [open a PR](https://github.com/SUSE/DeepSea/pulls) if you’ve got a fix.

ses4-0:~ # salt-run state.orch ceph.stage.0
master\_minion            : valid
ceph\_version             : valid
None

###########################################################
The salt-run command reports when all minions complete.
The command may appear to hang.  Interrupting (e.g. Ctrl-C) 
does not stop the command.

In another terminal, try 'salt-run jobs.active' or
'salt-run state.event pretty=True' to see progress.
###########################################################

False
True
\[WARNING \] All minions are ready
True
ses4-0.example.com\_master:
----------
          ID: sync master
    Function: salt.state
      Result: True
     Comment: States ran successfully. Updating ses4-0.example.com.
     Started: 23:04:06.166492
    Duration: 459.509 ms
     Changes:   
              ses4-0.example.com:
              ----------
                        ID: load modules
                  Function: module.run
                      Name: saltutil.sync\_all
                    Result: True
                   Comment: Module function saltutil.sync\_all executed
                   Started: 23:04:06.312110
                  Duration: 166.785 ms
                   Changes:   
                            ----------
                            ret:
                                ----------
                                beacons:
                                grains:
                                log\_handlers:
                                modules:
                                output:
                                proxymodules:
                                renderers:
                                returners:
                                sdb:
                                states:
                                utils:

              Summary for ses4-0.example.com
              ------------
              Succeeded: 1 (changed=1)
              Failed:    0
              ------------
              Total states run:     1
\[...\]

There’s a whole lot more output than I’ve quoted above, because that’s what happens with Salt when you apply a whole lot of state to a bunch of minions, but it finished up with:

Summary for ses4-0.example.com\_master
-------------
Succeeded: 15 (changed=9)
Failed:     0
-------------
Total states run:     15

Stage 1 (discovery) is next, to interrogate all the minions and create configuration fragments:

ses4-0:~ # salt-run state.orch ceph.stage.1
\[WARNING \] All minions are ready
True
- True
ses4-0.example.com\_master:
----------
          ID: ready
    Function: salt.runner
        Name: minions.ready
      Result: True
     Comment: Runner function 'minions.ready' executed.
     Started: 23:05:02.991371
    Duration: 588.429 ms
     Changes:   Invalid Changes data: True
----------
          ID: discover
    Function: salt.runner
        Name: populate.proposals
      Result: True
     Comment: Runner function 'populate.proposals' executed.
     Started: 23:05:03.580038
    Duration: 1627.563 ms
     Changes:   Invalid Changes data: \[True\]

Summary for ses4-0.example.com\_master
------------
Succeeded: 2 (changed=2)
Failed:    0
------------
Total states run:     2

Now there’s a bunch of interesting data from all the minions stored as SLS and YAML files in subdirectories of /srv/pillar/ceph/proposals. This is the point at which you get to decide exactly how your cluster will be deployed – what roles will be assigned to each node, and how the OSDs will be configured. You do this by creating a file called /srv/pillar/ceph/proposals/policy.cfg, which in turn includes the relevant configuration fragments generated during the discovery stage.

Creating /srv/pillar/ceph/proposals/policy.cfg is probably the one part of using DeepSea that’s easy to screw up. We’re [working on making it easier](https://github.com/kmroz/deep-policy), and the [policy docs](https://github.com/SUSE/DeepSea/wiki/policy) and [examples](https://github.com/SUSE/DeepSea/tree/master/doc/examples) will help, but in the meantime the approach I’ve taken personally is to generate a policy.cfg including every possible option, then get rid of the ones I don’t want. Here’s a dump of every single configuration fragment generated by the discovery stage on my toy test cluster:

ses4-0:~ # cd /srv/pillar/ceph/proposals/
ses4-0:/srv/pillar/ceph/proposals # find \* -name \*.sls -o -name \*.yml | sort > policy.cfg
ses4-0:/srv/pillar/ceph/proposals # cat policy.cfg 
cluster-ceph/cluster/ses4-0.example.com.sls
cluster-ceph/cluster/ses4-1.example.com.sls
cluster-ceph/cluster/ses4-2.example.com.sls
cluster-ceph/cluster/ses4-3.example.com.sls
cluster-ceph/cluster/ses4-4.example.com.sls
cluster-ceph/cluster/ses4-5.example.com.sls
cluster-unassigned/cluster/ses4-0.example.com.sls
cluster-unassigned/cluster/ses4-1.example.com.sls
cluster-unassigned/cluster/ses4-2.example.com.sls
cluster-unassigned/cluster/ses4-3.example.com.sls
cluster-unassigned/cluster/ses4-4.example.com.sls
cluster-unassigned/cluster/ses4-5.example.com.sls
config/stack/default/ceph/cluster.yml
config/stack/default/global.yml
profile-1QEMU24GB-1/cluster/ses4-0.example.com.sls
profile-1QEMU24GB-1/cluster/ses4-1.example.com.sls
profile-1QEMU24GB-1/cluster/ses4-2.example.com.sls
profile-1QEMU24GB-1/cluster/ses4-3.example.com.sls
profile-1QEMU24GB-1/cluster/ses4-4.example.com.sls
profile-1QEMU24GB-1/cluster/ses4-5.example.com.sls
profile-1QEMU24GB-1/stack/default/ceph/minions/ses4-0.example.com.yml
profile-1QEMU24GB-1/stack/default/ceph/minions/ses4-1.example.com.yml
profile-1QEMU24GB-1/stack/default/ceph/minions/ses4-2.example.com.yml
profile-1QEMU24GB-1/stack/default/ceph/minions/ses4-3.example.com.yml
profile-1QEMU24GB-1/stack/default/ceph/minions/ses4-4.example.com.yml
profile-1QEMU24GB-1/stack/default/ceph/minions/ses4-5.example.com.yml
role-admin/cluster/ses4-0.example.com.sls
role-admin/cluster/ses4-1.example.com.sls
role-admin/cluster/ses4-2.example.com.sls
role-admin/cluster/ses4-3.example.com.sls
role-admin/cluster/ses4-4.example.com.sls
role-admin/cluster/ses4-5.example.com.sls
role-client-cephfs/cluster/ses4-0.example.com.sls
role-client-cephfs/cluster/ses4-1.example.com.sls
role-client-cephfs/cluster/ses4-2.example.com.sls
role-client-cephfs/cluster/ses4-3.example.com.sls
role-client-cephfs/cluster/ses4-4.example.com.sls
role-client-cephfs/cluster/ses4-5.example.com.sls
role-client-iscsi/cluster/ses4-0.example.com.sls
role-client-iscsi/cluster/ses4-1.example.com.sls
role-client-iscsi/cluster/ses4-2.example.com.sls
role-client-iscsi/cluster/ses4-3.example.com.sls
role-client-iscsi/cluster/ses4-4.example.com.sls
role-client-iscsi/cluster/ses4-5.example.com.sls
role-client-radosgw/cluster/ses4-0.example.com.sls
role-client-radosgw/cluster/ses4-1.example.com.sls
role-client-radosgw/cluster/ses4-2.example.com.sls
role-client-radosgw/cluster/ses4-3.example.com.sls
role-client-radosgw/cluster/ses4-4.example.com.sls
role-client-radosgw/cluster/ses4-5.example.com.sls
role-igw/cluster/ses4-0.example.com.sls
role-igw/cluster/ses4-1.example.com.sls
role-igw/cluster/ses4-2.example.com.sls
role-igw/cluster/ses4-3.example.com.sls
role-igw/cluster/ses4-4.example.com.sls
role-igw/cluster/ses4-5.example.com.sls
role-igw/stack/default/ceph/minions/ses4-0.example.com.yml
role-igw/stack/default/ceph/minions/ses4-1.example.com.yml
role-igw/stack/default/ceph/minions/ses4-2.example.com.yml
role-igw/stack/default/ceph/minions/ses4-3.example.com.yml
role-igw/stack/default/ceph/minions/ses4-4.example.com.yml
role-igw/stack/default/ceph/minions/ses4-5.example.com.yml
role-master/cluster/ses4-0.example.com.sls
role-master/cluster/ses4-1.example.com.sls
role-master/cluster/ses4-2.example.com.sls
role-master/cluster/ses4-3.example.com.sls
role-master/cluster/ses4-4.example.com.sls
role-master/cluster/ses4-5.example.com.sls
role-mds/cluster/ses4-0.example.com.sls
role-mds/cluster/ses4-1.example.com.sls
role-mds/cluster/ses4-2.example.com.sls
role-mds/cluster/ses4-3.example.com.sls
role-mds/cluster/ses4-4.example.com.sls
role-mds/cluster/ses4-5.example.com.sls
role-mds-nfs/cluster/ses4-0.example.com.sls
role-mds-nfs/cluster/ses4-1.example.com.sls
role-mds-nfs/cluster/ses4-2.example.com.sls
role-mds-nfs/cluster/ses4-3.example.com.sls
role-mds-nfs/cluster/ses4-4.example.com.sls
role-mds-nfs/cluster/ses4-5.example.com.sls
role-mon/cluster/ses4-0.example.com.sls
role-mon/cluster/ses4-1.example.com.sls
role-mon/cluster/ses4-2.example.com.sls
role-mon/cluster/ses4-3.example.com.sls
role-mon/cluster/ses4-4.example.com.sls
role-mon/cluster/ses4-5.example.com.sls
role-mon/stack/default/ceph/minions/ses4-0.example.com.yml
role-mon/stack/default/ceph/minions/ses4-1.example.com.yml
role-mon/stack/default/ceph/minions/ses4-2.example.com.yml
role-mon/stack/default/ceph/minions/ses4-3.example.com.yml
role-mon/stack/default/ceph/minions/ses4-4.example.com.yml
role-mon/stack/default/ceph/minions/ses4-5.example.com.yml
role-rgw/cluster/ses4-0.example.com.sls
role-rgw/cluster/ses4-1.example.com.sls
role-rgw/cluster/ses4-2.example.com.sls
role-rgw/cluster/ses4-3.example.com.sls
role-rgw/cluster/ses4-4.example.com.sls
role-rgw/cluster/ses4-5.example.com.sls
role-rgw-nfs/cluster/ses4-0.example.com.sls
role-rgw-nfs/cluster/ses4-1.example.com.sls
role-rgw-nfs/cluster/ses4-2.example.com.sls
role-rgw-nfs/cluster/ses4-3.example.com.sls
role-rgw-nfs/cluster/ses4-4.example.com.sls
role-rgw-nfs/cluster/ses4-5.example.com.sls

What I actually wanted to deploy was a Ceph cluster with MONs on ses4-1, ses4-2 and ses4-3, and OSDs on ses4-1, ses4-2, ses4-3 and ses4-4. I didn’t want DeepSea to do anything with ses4-5, and I’ve elected not to deploy CephFS, RadosGW, openATTIC or any other services, because this blog post is going to be long enough as it is. So here’s what I pared my policy.cfg back to:

ses4-0:/srv/pillar/ceph/proposals # cat policy.cfg 
cluster-unassigned/cluster/\*.sls
cluster-ceph/cluster/ses4-\[0-4\].example.com.sls
config/stack/default/ceph/cluster.yml
config/stack/default/global.yml
profile-1QEMU24GB-1/cluster/ses4-\[1-4\].example.com.sls
profile-1QEMU24GB-1/stack/default/ceph/minions/ses4-\[1-4\].example.com.yml
role-master/cluster/ses4-0.example.com.sls
role-admin/cluster/ses4-\[1-3\].example.com.sls
role-mon/cluster/ses4-\[1-3\].example.com.sls
role-mon/stack/default/ceph/minions/ses4-\[1-3\].example.com.yml

The `cluster-unassigned` line defaults all nodes to not be part of the Ceph cluster. The following `cluster-ceph` line adds only those nodes I want DeepSea to manage (this is how I’m excluding ses4-5.example.com). Ordering is important here as later lines will override earlier lines.

The `role-*` lines determine which nodes are going to be MONs. `role-admin` is needed on the MON nodes to ensure the Ceph admin keyring is installed on those nodes.

The `profile-*` lines determine how my OSDs will be deployed. In my case, because this is a ridiculous toy cluster, I have only one disk configuration on all my nodes (a single 24GB volume). On a real cluster there may be several profiles available to choose from, potentially mixing drive types and using SSDs for journals. Again, this is covered in more detail in the [policy docs](https://github.com/SUSE/DeepSea/wiki/policy).

Now that policy.cfg is set up correctly, it’s time to runs stages 2 and 3:

ses4-0:~ # salt-run state.orch ceph.stage.2
True
True
ses4-0.example.com\_master:
----------
          ID: push proposals
    Function: salt.runner
        Name: push.proposal
      Result: True
     Comment: Runner function 'push.proposal' executed.
     Started: 23:13:43.092320
    Duration: 209.321 ms
     Changes:   Invalid Changes data: True
----------
          ID: refresh\_pillar1
    Function: salt.state
      Result: True
     Comment: States ran successfully. Updating ses4-1.example.com, ses4-5.example.com, ses4-0.example.com, ses4-2.example.com, ses4-4.example.com, ses4-3.example.com.
     Started: 23:13:43.302018
    Duration: 705.173 ms
\[...\]

Again, I’ve elided quite a bit of Salt output above. Stage 3 (deployment) can take a while, so if you’re looking for something to do while that’s happening, you can either play with `` `salt-run jobs.active` `` or `` `salt-run state.event pretty=True` `` in another terminal, or you can watch a video:

ses4-0:~ # salt-run state.orch ceph.stage.3
firewall                 : disabled
True
fsid                     : valid
public\_network           : valid
public\_interface         : valid
cluster\_network          : valid
cluster\_interface        : valid
monitors                 : valid
storage                  : valid
master\_role              : valid
mon\_role                 : valid
mon\_host                 : valid
mon\_initial\_members      : valid
time\_server              : valid
fqdn                     : valid
True
ses4-1.example.com
\[ERROR   \] Run failed on minions: ses4-1.example.com, ses4-4.example.com, ses4-3.example.com, ses4-0.example.com, ses4-2.example.com
Failures:
    ses4-1.example.com:
    ----------
              ID: ntp
        Function: pkg.installed
          Result: True
         Comment: All specified packages are already installed
         Started: 23:16:18.251858
        Duration: 367.172 ms
         Changes:   
    ----------
              ID: sync time
        Function: cmd.run
            Name: sntp -S -c ses4-0.example.com
          Result: False
         Comment: Command "sntp -S -c ses4-0.example.com" run
         Started: 23:16:18.620013
        Duration: 37.438 ms
         Changes:   
                  ----------
                  pid:
                      11002
                  retcode:
                      1
                  stderr:
                      sock\_cb: 192.168.12.225 not in sync, skipping this server
                  stdout:
                      sntp 4.2.8p8@1.3265-o Mon Jun  6 08:12:56 UTC 2016 (1)
\[...\]
----------
          ID: packages
    Function: salt.state
      Result: True
     Comment: States ran successfully. Updating ses4-1.example.com, ses4-4.example.com, ses4-3.example.com, ses4-0.example.com, ses4-2.example.com.
     Started: 23:16:19.035412
    Duration: 15967.272 ms
     Changes:   
              ses4-1.example.com:
              ----------
                        ID: ceph
                  Function: pkg.installed
                    Result: True
                   Comment: The following packages were installed/updated: ceph
                   Started: 23:16:19.666218
                  Duration: 15134.487 ms
\[...\]
----------
          ID: monitors
    Function: salt.state
      Result: True
     Comment: States ran successfully. Updating ses4-1.example.com, ses4-3.example.com, ses4-2.example.com.
     Started: 23:16:36.622000
    Duration: 891.694 ms
\[...\]
----------
          ID: osd auth
    Function: salt.state
      Result: True
     Comment: States ran successfully. Updating ses4-0.example.com.
     Started: 23:16:37.513840
    Duration: 540.991 ms
\[...\]
----------
          ID: storage
    Function: salt.state
      Result: True
     Comment: States ran successfully. Updating ses4-1.example.com, ses4-4.example.com, ses4-3.example.com, ses4-2.example.com.
     Started: 23:16:38.054970
    Duration: 10854.171 ms
\[...\]

The only failure above is a minor complaint about NTP. Everything else (installing the packages, deploying the MONs, creating the OSDs etc.) ran through just fine. Check it out:

ses4-1:~ # ceph status
    cluster 9b259825-0af1-36a9-863a-e058e4b0706b
     health HEALTH\_OK
     monmap e1: 3 mons at {ses4-1=192.168.12.170:6789/0,ses4-2=192.168.12.167:6789/0,ses4-3=192.168.12.148:6789/0}
            election epoch 4, quorum 0,1,2 ses4-3,ses4-2,ses4-1
     osdmap e9: 4 osds: 4 up, 4 in
            flags sortbitwise
      pgmap v18: 64 pgs, 1 pools, 16 bytes data, 3 objects
            133 MB used, 77646 MB / 77779 MB avail
                  64 active+clean

We now have a running Ceph cluster. Like I said, this one is a toy, and I haven’t demonstrated stage 4 (services), but hopefully this has demonstrated the scalability possible when using Salt with DeepSea to deploy Ceph. The above process is the same whether you have four nodes or four hundred; it’s just the creation of a policy.cfg file plus a few `` `salt-run` `` invocations.

Finally, if you’re wondering about the title of this post, its what Cordelia Chase said the first time she saw Angel in Buffy The Vampire Slayer (time index 0:22 in [this video](https://www.youtube.com/watch?v=gNz4SHxd16w)). I was going to lead with that, but after watching the episode again, there’s teenage angst, a trip to the morgue and all sorts of other stuff, none of which really makes a good analogy for the technology I’m talking about here. The clickbait in my “[Salt and Pepper Squid with Fresh Greens](/2014/11/salt-and-pepper-squid-with-fresh-greens/)” post was much better.

Source: Tim Serong ([Hello Salty Goodness](http://ourobengr.com/2016/11/hello-salty-goodness/))
