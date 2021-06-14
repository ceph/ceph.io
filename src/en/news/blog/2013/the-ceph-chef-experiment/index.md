---
title: "The Ceph Chef Experiment"
date: "2013-04-11"
author: "admin"
tags: 
  - "planet"
---

Sometimes it’s most interesting to just dive in and see what breaks. There’s a [Chef cookbook for Ceph on github](https://github.com/ceph/ceph-cookbooks) which seems rather more recently developed than the one in [SUSE-Cloud/barclamp-ceph](https://github.com/SUSE-Cloud/barclamp-ceph/tree/release/essex-hack-suse/master/chef), and seeing as its use is [documented in the Ceph manual](http://ceph.com/docs/master/rados/deployment/chef/), I reckon that’s the one I want to be using. Of course, the README says “Tested as working: Ubuntu Precise (12.04)”, and I’m using openSUSE 12.3…

First things first, need a Chef server, so I installed openSUSE 12.3 on a VM, then installed Chef 10 on that, roughly following the [manual installation instructions](http://wiki.opscode.com/display/chef/Installing+Chef+Server+Manually). Note for those following along at home – sometimes the blocks I’ve copied here are just commands, sometimes they include command output as well. You’ll figure it out ![:-)](http://ourobengr.com/wp-includes/images/smilies/icon_smile.gif)

\# zypper ar -f http://download.opensuse.org/repositories/systemsmanagement:/chef:/10/openSUSE\_12.3/systemsmanagement:chef:10.repo
# zypper in rubygem-chef-server
# chkconfig couchdb on
# rccouchdb start
# chkconfig rabbitmq-server on
# rcrabbitmq-server start
# rabbitmqctl add\_vhost /chef
# rabbitmqctl add\_user chef testing
# rabbitmqctl set\_permissions -p /chef chef ".\*" ".\*" ".\*"
# for service in solr expander server server-webui; do
      chkconfig chef-$service on
      rcchef-$service start
  done

I didn’t bother editing `/etc/chef/server.rb`, the config as shipped works fine (not that the AMQP password is very secure, mind). The only catch is the web UI didn’t start. IIRC this is due to `/etc/chef/webui.pem` not existing yet (chef-server creates it, but this doesn’t finish until later).

Then configured knife:

\# knife configure -i
WARNING: No knife configuration file found
Where should I put the config file? \[/root/.chef/knife.rb\]
Please enter the chef server URL: \[http://os-chef.example.com:4000\]
Please enter a clientname for the new client: \[root\]
Please enter the existing admin clientname: \[chef-webui\]
Please enter the location of the existing admin client's private key: \[/etc/chef/webui.pem\]
Please enter the validation clientname: \[chef-validator\]
Please enter the location of the validation key: \[/etc/chef/validation.pem\]
Please enter the path to a chef repository (or leave blank):
Creating initial API user...
Created client\[root\]
Configuration file written to /root/.chef/knife.rb

And make a client for me:

\# knife client create tserong -d -a -f /tmp/tserong.pem
Created client\[tserong\]

Then set up my desktop as a Chef workstation (roughly following [these docs](http://wiki.opscode.com/display/chef/Workstation+Setup+for+openSUSE), and again pulling Chef from [systemsmanagement:chef:10](https://build.opensuse.org/project/show?project=systemsmanagement:chef:10) on OBS):

\# sudo zypper in rubygem-chef
# cd ~
# git clone git://github.com/opscode/chef-repo.git
# cd chef-repo
# mkdir -p ~/.chef
# scp root@os-chef:/etc/chef/validation.pem ~/.chef/
# scp root@os-chef:/tmp/tserong.pem ~/.chef/
# knife configure
WARNING: No knife configuration file found
Where should I put the config file? \[/home/tserong/.chef/knife.rb\]
Please enter the chef server URL: \[http://desktop.example.com:4000\] http://os-chef.example.com:4000
Please enter an existing username or clientname for the API: \[tserong\]
Please enter the validation clientname: \[chef-validator\]
Please enter the location of the validation key: \[/etc/chef/validation.pem\] /home/tserong/.chef/validation.pem
Please enter the path to a chef repository (or leave blank): /home/tserong/chef-repo
\[...\]
Configuration file written to /home/tserong/.chef/knife.rb

Make sure it works:

\# knife client list
chef-validator
chef-webui
root
tserong

Grab the cookbooks and upload them to the Chef server. The Ceph cookbook claims to depend on apache and apt, although presumably the former is only necessary for RADOSGW, and the latter for Debian-based systems. Anyway:

\# cd ~/chef-repo
# git submodule add git@github.com:opscode-cookbooks/apache2.git cookbooks/apache2
# git submodule add git@github.com:opscode-cookbooks/apt.git cookbooks/apt
# git submodule add git@github.com:ceph/ceph-cookbooks.git cookbooks/ceph
# knife cookbook upload apache2
# knife cookbook upload apt
# knife cookbook upload ceph

Boot up a couple more VMs to be Ceph nodes, using the [appliance image](https://susestudio.com/a/eEqfPk/opensuse-12-3-ceph-0-56) from [last time](/2013/04/hackweek-9-ceph-appliance-odyssey/ "Hackweek 9: Ceph Appliance Odyssey"). These need chef-client installed, and need to be registered with the chef server. `knife bootstrap` will install chef-client and dependencies for you, but after looking at the source, if `/usr/bin/chef` doesn’t exist, it actually uses `wget` or `curl` to pull http://opscode.com/chef/install.sh and runs that. How this is considered a good idea is completely baffling to me, so again I installed our chef build from OBS on each of my Ceph nodes (note to self: should add this to appliance image on Studio):

\# zypper ar -f http://download.opensuse.org/repositories/systemsmanagement:/chef:/10/openSUSE\_12.3/systemsmanagement:chef:10.repo
# zypper in rubygem-chef

And ran the now-arguably-safe `knife bootstrap` from my desktop:

\# knife bootstrap ceph-0.example.com
Bootstrapping Chef on ceph-0.example.com
\[...\]
# knife bootstrap ceph-1.example.com
Bootstrapping Chef on ceph-1.example.com
\[...\]

Then, roughly following the Ceph [Deploying with Chef](http://ceph.com/docs/master/rados/deployment/chef/) document.

Generate a UUID and monitor secret (had to do the latter on one of my Ceph VMs, as ceph-authtool is conveniently already installed):

\# uuidgen -r
f80aba97-26c5-4aa3-971e-09c5a3afa32f
# ceph-authtool /dev/stdout --name=mon. --gen-key
\[mon.\]
key = AQC8umZRaDlKKBAAqD8li3u2JObepmzFzDPM3g==

Then on my desktop:

knife environment create Ceph

This I filled in with:

{
  "name": "Ceph",
  "description": "",
  "cookbook\_versions": {
  },
  "json\_class": "Chef::Environment",
  "chef\_type": "environment",
  "default\_attributes": {
    "ceph": {
      "monitor-secret": "AQC8umZRaDlKKBAAqD8li3u2JObepmzFzDPM3g==",
      "config": {
        "fsid": "f80aba97-26c5-4aa3-971e-09c5a3afa32f",
        "mon\_initial\_members": "ceph-0,ceph-1",
        "global": {
        },
        "osd": {
          "osd journal size": "1000",
          "filestore xattr use omap": "true"
        }
      }
    }
  },
  "override\_attributes": {
  }
}

Uploaded roles:

\# knife role from file cookbooks/ceph/roles/ceph-mds.rb
# knife role from file cookbooks/ceph/roles/ceph-mon.rb
# knife role from file cookbooks/ceph/roles/ceph-osd.rb
# knife role from file cookbooks/ceph/roles/ceph-radosgw.rb

Assigned roles to nodes:

\# knife node run\_list add ceph-0.example.com 'role\[ceph-mon\],role\[ceph-osd\],role\[ceph-mds\]'
# knife node run\_list add ceph-1.example.com 'role\[ceph-mon\],role\[ceph-osd\],role\[ceph-mds\]'

I didn’t bother with recipe\[ceph::repo\] as I don’t care about installation right now (Ceph is already installed in my VM images).

Had to set `"chef_environment": "Ceph"` for each node by running:

\# knife node edit ceph-0.example.com
# knife node edit ceph-1.example.com

Didn’t set Ceph osd\_devices per node – I’m just playing, so can sit on top of the root partition.

Now let’s see if it works:

\# knife ssh name:ceph-0.example.com -x root chef-client
\[2013-04-11T13:44:47+00:00\] INFO: \*\*\* Chef 10.24.0 \*\*\*
\[2013-04-11T13:44:48+00:00\] INFO: Run List is \[role\[ceph-mon\], role\[ceph-osd\], role\[ceph-mds\]\]
\[2013-04-11T13:44:48+00:00\] INFO: Run List expands to \[ceph::mon, ceph::osd, ceph::mds\]
\[2013-04-11T13:44:48+00:00\] INFO: HTTP Request Returned 404 Not Found: No routes match the request: /reports/nodes/ceph-0.example.com/runs
\[2013-04-11T13:44:48+00:00\] INFO: Starting Chef Run for ceph-0.example.com
\[2013-04-11T13:44:48+00:00\] INFO: Running start handlers
\[2013-04-11T13:44:48+00:00\] INFO: Start handlers complete.
\[2013-04-11T13:44:48+00:00\] INFO: Loading cookbooks \[apache2, apt, ceph\]
No ceph-mon found.

\[2013-04-11T13:44:48+00:00\] INFO: Processing template\[/etc/ceph/ceph.conf\] action create (ceph::conf line 6)
\[2013-04-11T13:44:48+00:00\] INFO: template\[/etc/ceph/ceph.conf\] backed up to /var/chef/backup/etc/ceph/ceph.conf.chef-20130411134448
\[2013-04-11T13:44:48+00:00\] INFO: template\[/etc/ceph/ceph.conf\] updated content
\[2013-04-11T13:44:48+00:00\] INFO: template\[/etc/ceph/ceph.conf\] owner changed to 0
\[2013-04-11T13:44:48+00:00\] INFO: template\[/etc/ceph/ceph.conf\] group changed to 0
\[2013-04-11T13:44:48+00:00\] INFO: template\[/etc/ceph/ceph.conf\] mode changed to 644
\[2013-04-11T13:44:48+00:00\] INFO: Processing service\[ceph\_mon\] action nothing (ceph::mon line 23)
\[2013-04-11T13:44:48+00:00\] INFO: Processing execute\[ceph-mon mkfs\] action run (ceph::mon line 40)
creating /var/lib/ceph/tmp/ceph-ceph-0.mon.keyring
added entity mon. auth auth(auid = 18446744073709551615 key=AQC8umZRaDlKKBAAqD8li3u2JObepmzFzDPM3g== with 0 caps)
ceph-mon: mon.noname-a 192.168.4.118:6789/0 is local, renaming to mon.ceph-0
ceph-mon: set fsid to f80aba97-26c5-4aa3-971e-09c5a3afa32f
ceph-mon: created monfs at /var/lib/ceph/mon/ceph-ceph-0 for mon.ceph-0
\[2013-04-11T13:44:49+00:00\] INFO: execute\[ceph-mon mkfs\] ran successfully
\[2013-04-11T13:44:49+00:00\] INFO: execute\[ceph-mon mkfs\] sending start action to service\[ceph\_mon\] (immediate)
\[2013-04-11T13:44:49+00:00\] INFO: Processing service\[ceph\_mon\] action start (ceph::mon line 23)
\[2013-04-11T13:44:49+00:00\] INFO: service\[ceph\_mon\] started
\[2013-04-11T13:44:49+00:00\] INFO: Processing ruby\_block\[tell ceph-mon about its peers\] action create (ceph::mon line 64)
connect to
/var/run/ceph/ceph-mon.ceph-0.asok
failed with
(2) No such file or directory

connect to
/var/run/ceph/ceph-mon.ceph-0.asok
failed with
(2) No such file or directory

\[2013-04-11T13:44:49+00:00\] INFO: ruby\_block\[tell ceph-mon about its peers\] called
\[2013-04-11T13:44:49+00:00\] INFO: Processing ruby\_block\[get osd-bootstrap keyring\] action create (ceph::mon line 79)
2013-04-11 13:44:49.928800 7f58e9677700 0
-- :/23863 >> 192.168.4.117:6789/0 pipe(0x18f0d30 sd=3 :0 s=1 pgs=0 cs=0 l=1).fault

2013-04-11 13:44:52.928739 7f58efc1c700 0 -- :/23863 >> 192.168.4.118:6789/0 pipe(0x7f58e0000c00 sd=3 :0 s=1 pgs=0 cs=0 l=1).fault
2013-04-11 13:44:55.929375 7f58e9677700 0 -- :/23863 >> 192.168.4.117:6789/0 pipe(0x7f58e0003010 sd=3 :0 s=1 pgs=0 cs=0 l=1).fault
2013-04-11 13:44:58.929211 7f58efc1c700 0 -- :/23863 >> 192.168.4.118:6789/0 pipe(0x7f58e00039f0 sd=3 :0 s=1 pgs=0 cs=0 l=1).fault
2013-04-11 13:45:01.929787 7f58e9677700 0 -- :/23863 >> 192.168.4.117:6789/0 pipe(0x7f58e00023b0 sd=3 :0 s=1 pgs=0 cs=0 l=1).fault
\[...\]

And it’s stuck there, trying and failing to talk to something.

See those “no such file or directory” errors after “service\[ceph\_mon\] started”? Yeah? Well, the mon isn’t started, hence the missing sockets in `/var/run/ceph`.

Why isn’t the mon started? Turns out the ceph init script won’t start any mon (or osd or mds for that matter) if you don’t have entries in the config file with some suffix, e.g. `[mon.a]`. And all I’ve got is:

\[global\]
  fsid =  f80aba97-26c5-4aa3-971e-09c5a3afa32f
  mon initial members = ceph-0,ceph-1
  mon host = 192.168.4.118:6789, 192.168.4.117:6789

\[osd\]
    osd journal size = 1000
    filestore xattr use omap = true

But given the mon recipe triggers `ceph-mon-all-starter` if using upstart (which it would be, on the “Tested as working: Ubuntu Precise”), and `ceph-mon-all-starter` seems to just ultimately run something like `ceph-mon --cluster=ceph -i ceph-0` regardless of what’s in the config file… Maybe I can cheat.

Directly starting ceph-mon from a shell on ceph-0 before the `chef-client` run turned out to be a bad idea (bit of a chicken and egg problem figuring out what to inject into the “mon host” line of the config file). So I put a bit of evil into the mon recipe:

diff --git a/recipes/mon.rb b/recipes/mon.rb
index 5cd76de..a518830 100644
--- a/recipes/mon.rb
+++ b/recipes/mon.rb
@@ -61,6 +61,10 @@ EOH
   notifies :start, "service\[ceph\_mon\]", :immediately
 end
 
+execute 'hack to force mon start' do
+  command "ceph-mon --cluster=ceph -i #{node\['hostname'\]}"
+end
+
 ruby\_block "tell ceph-mon about its peers" do
   block do
     mon\_addresses = get\_mon\_addresses()

Try again:

\# knife ssh name:ceph-0.example.com -x root chef-client
\[2013-04-11T15:10:43+00:00\] INFO: \*\*\* Chef 10.24.0 \*\*\*
\[2013-04-11T15:10:44+00:00\] INFO: Run List is \[role\[ceph-mon\], role\[ceph-osd\], role\[ceph-mds\]\]
\[2013-04-11T15:10:44+00:00\] INFO: Run List expands to \[ceph::mon, ceph::osd, ceph::mds\]
\[2013-04-11T15:10:44+00:00\] INFO: HTTP Request Returned 404 Not Found: No routes match the request: /reports/nodes/ceph-0.example.com/runs
\[2013-04-11T15:10:44+00:00\] INFO: Starting Chef Run for ceph-0.example.com
\[2013-04-11T15:10:44+00:00\] INFO: Running start handlers
\[2013-04-11T15:10:44+00:00\] INFO: Start handlers complete.
\[2013-04-11T15:10:44+00:00\] INFO: Loading cookbooks \[apache2, apt, ceph\]
\[2013-04-11T15:10:44+00:00\] INFO: Storing updated cookbooks/ceph/recipes/mon.rb in the cache.
No ceph-mon found.

\[2013-04-11T15:10:44+00:00\] INFO: Processing template\[/etc/ceph/ceph.conf\] action create (ceph::conf line 6)
\[2013-04-11T15:10:44+00:00\] INFO: Processing service\[ceph\_mon\] action nothing (ceph::mon line 23)
\[2013-04-11T15:10:44+00:00\] INFO: Processing execute\[ceph-mon mkfs\] action run (ceph::mon line 40)
\[2013-04-11T15:10:44+00:00\] INFO: Processing execute\[hack to force mon start\] action run (ceph::mon line 65)
starting mon.ceph-0 rank 1 at 192.168.4.118:6789/0 mon\_data /var/lib/ceph/mon/ceph-ceph-0 fsid f80aba97-26c5-4aa3-971e-09c5a3afa32f
\[2013-04-11T15:10:44+00:00\] INFO: execute\[hack to force mon start\] ran successfully
\[2013-04-11T15:10:44+00:00\] INFO: Processing ruby\_block\[tell ceph-mon about its peers\] action create (ceph::mon line 69)
adding peer 192.168.4.118:6789/0 to list: 192.168.4.117:6789/0,192.168.4.118:6789/0

adding peer 192.168.4.117:6789/0 to list: 192.168.4.117:6789/0,192.168.4.118:6789/0

\[2013-04-11T15:10:44+00:00\] INFO: ruby\_block\[tell ceph-mon about its peers\] called
\[2013-04-11T15:10:44+00:00\] INFO: Processing ruby\_block\[get osd-bootstrap keyring\] action create (ceph::mon line 84)
2013-04-11 15:10:44.432266 7f8f9f8c0700  0 
-- :/25965 >> 192.168.4.117:6789/0 pipe(0x16d9d30 sd=3 :0 s=1 pgs=0 cs=0 l=1).fault

2013-04-11 15:10:50.433053 7f8f9f7bf700  0 -- 192.168.4.118:0/25965 >> 192.168.4.117:6789/0 pipe(0x7f8f94001d30 sd=3 :0 s=1 pgs=0 cs=0 l=1).fault
2013-04-11 15:10:56.433268 7f8fa5e65700  0 -- 192.168.4.118:0/25965 >> 192.168.4.117:6789/0 pipe(0x7f8f94001d30 sd=3 :0 s=1 pgs=0 cs=0 l=1).fault
2013-04-11 15:11:02.433987 7f8f9f8c0700  0 -- 192.168.4.118:0/25965 >> 192.168.4.117:6789/0 pipe(0x7f8f94002db0 sd=3 :0 s=1 pgs=0 cs=0 l=1).fault
2013-04-11 15:11:08.434358 7f8f9f7bf700  0 -- 192.168.4.118:0/25965 >> 192.168.4.117:6789/0 pipe(0x7f8f94004fb0 sd=3 :0 s=1 pgs=0 cs=0 l=1).fault

At this point it’s stalled presumably waiting to talk to the other mon, so in another terminal window had to kick off a `chef-client` run on ceph-1 to get it into the same state as ceph-0 (`knife ssh name:ceph-1.example.com -x root chef-client`). This allowed both nodes to progress to the next problem:

2013-04-11 15:11:28.563438 7f8fa5e67780 -1 monclient(hunting): authenticate NOTE: no keyring found; disabled cephx authentication
2013-04-11 15:11:28.563443 7f8fa5e67780 -1 unable to authenticate as client.admin
2013-04-11 15:11:28.563814 7f8fa5e67780 -1 ceph\_tool\_common\_init failed.
2013-04-11 15:11:29.572208 7f2369130780 -1 monclient(hunting): authenticate NOTE: no keyring found; disabled cephx authentication
2013-04-11 15:11:29.572210 7f2369130780 -1 unable to authenticate as client.admin
2013-04-11 15:11:29.572527 7f2369130780 -1 ceph\_tool\_common\_init failed.
2013-04-11 15:11:31.380073 7f1907d18780 -1 monclient(hunting): authenticate NOTE: no keyring found; disabled cephx authentication
2013-04-11 15:11:31.380078 7f1907d18780 -1 unable to authenticate as client.admin
2013-04-11 15:11:31.380720 7f1907d18780 -1 ceph\_tool\_common\_init failed.
2013-04-11 15:11:32.392345 7fc2bc462780 -1 monclient(hunting): authenticate NOTE: no keyring found; disabled cephx authentication
\[...\]

And we’re spinning again.

But that’s enough for one day.

Source: Tim Serong ([The Ceph Chef Experiment](http://ourobengr.com/2013/04/the-ceph-chef-experiment/))
