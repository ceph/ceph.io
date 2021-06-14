---
title: "One More chef-client Run"
date: "2013-04-15"
author: "admin"
tags: 
  - "planet"
---

Carrying on from my [last post](/2013/04/the-ceph-chef-experiment/ "The Ceph Chef Experiment"), the failed chef-client run came down to the init script in ceph 0.56 not yet knowing how to iterate `/var/lib/ceph/{mon,osd,mds}` and automatically start the appropriate daemons. This functionality seems to have been introduced in 0.58 or so by [commit c8f528a](https://github.com/ceph/ceph/commit/c8f528a4070dd3aa0b25c435c6234032aee39b21). So I gave it another shot with a build of ceph 0.60.

On each of my ceph nodes, a bit of upgrading and cleanup. Note the choice of ceph 0.60 was mostly arbitrary, I just wanted the latest thing I could find an RPM for in a hurry. Also some of the `rm` invocations won’t be necessary, depending on what state things are actually in:

\# zypper ar -f http://download.opensuse.org/repositories/home:/dalgaaf:/ceph:/extra/openSUSE\_12.3/home:dalgaaf:ceph:extra.repo
# zypper ar -f http://gitbuilder.ceph.com/ceph-rpm-opensuse12-x86\_64-basic/ref/next/x86\_64/ ceph.com-next\_openSUSE\_12\_x86\_64
# zypper in ceph-0.60
# kill $(pidof ceph-mon)
# rm /etc/ceph/\*
# rm /var/run/ceph/\*
# rm -r /var/lib/ceph/\*/\*

That last gets rid of any half-created mon directories.

I also edited the Ceph environment to only have one mon (one of my colleagues rightly pointed out that you need an odd number of mons, and I had declared two previously, for no good reason). That’s `knife environment edit Ceph` on my desktop, and set `"mon_initial_members": "ceph-0"` instead of `"ceph-0,ceph-1"`.

I also had to edit each of the nodes, to add an osd\_devices array to each node, and remove the mon role from ceph-1. That’s `knife node edit ceph-0.example.com` then insert:

  "normal": {
    ...
    "ceph": {
      "osd\_devices": \[  \]
    }
  ...

Without the osd\_devices array defined, the osd recipe fails (“undefined method \`each\_with\_index’ for nil:NilClass”). I was kind of hoping an empty osd\_devices array would allow ceph to use the root partition. No such luck, the cookbook really does expect you to be doing a sensible deployment with actual separate devices for your OSDs. Oh, well. I’ll try that another time. For now at least I’ve demonstrated that ceph-0.60 does give you what appears to be a clean mon setup when using the [upstream cookbooks](https://github.com/ceph/ceph-cookbooks) on openSUSE 12.3:

knife ssh name:ceph-0.example.com -x root chef-client
\[2013-04-15T06:32:13+00:00\] INFO: \*\*\* Chef 10.24.0 \*\*\*
\[2013-04-15T06:32:13+00:00\] INFO: Run List is \[role\[ceph-mon\], role\[ceph-osd\], role\[ceph-mds\]\]
\[2013-04-15T06:32:13+00:00\] INFO: Run List expands to \[ceph::mon, ceph::osd, ceph::mds\]
\[2013-04-15T06:32:13+00:00\] INFO: HTTP Request Returned 404 Not Found: No routes match the request: /reports/nodes/ceph-0.example.com/runs
\[2013-04-15T06:32:13+00:00\] INFO: Starting Chef Run for ceph-0.example.com
\[2013-04-15T06:32:13+00:00\] INFO: Running start handlers
\[2013-04-15T06:32:13+00:00\] INFO: Start handlers complete.
\[2013-04-15T06:32:13+00:00\] INFO: Loading cookbooks \[apache2, apt, ceph\]
\[2013-04-15T06:32:13+00:00\] INFO: Processing template\[/etc/ceph/ceph.conf\] action create (ceph::conf line 6)
\[2013-04-15T06:32:13+00:00\] INFO: template\[/etc/ceph/ceph.conf\] updated content
\[2013-04-15T06:32:13+00:00\] INFO: template\[/etc/ceph/ceph.conf\] mode changed to 644
\[2013-04-15T06:32:13+00:00\] INFO: Processing service\[ceph\_mon\] action nothing (ceph::mon line 23)
\[2013-04-15T06:32:13+00:00\] INFO: Processing execute\[ceph-mon mkfs\] action run (ceph::mon line 40)
creating /var/lib/ceph/tmp/ceph-ceph-0.mon.keyring
added entity mon. auth auth(auid = 18446744073709551615 key=AQC8umZRaDlKKBAAqD8li3u2JObepmzFzDPM3g== with 0 caps)
ceph-mon: mon.noname-a 192.168.4.118:6789/0 is local, renaming to mon.ceph-0
ceph-mon: set fsid to f80aba97-26c5-4aa3-971e-09c5a3afa32f
ceph-mon: created monfs at /var/lib/ceph/mon/ceph-ceph-0 for mon.ceph-0
\[2013-04-15T06:32:14+00:00\] INFO: execute\[ceph-mon mkfs\] ran successfully
\[2013-04-15T06:32:14+00:00\] INFO: execute\[ceph-mon mkfs\] sending start action to service\[ceph\_mon\] (immediate)
\[2013-04-15T06:32:14+00:00\] INFO: Processing service\[ceph\_mon\] action start (ceph::mon line 23)
\[2013-04-15T06:32:15+00:00\] INFO: service\[ceph\_mon\] started
\[2013-04-15T06:32:15+00:00\] INFO: Processing ruby\_block\[tell ceph-mon about its peers\] action create (ceph::mon line 64)
mon already active; ignoring bootstrap hint

\[2013-04-15T06:32:16+00:00\] INFO: ruby\_block\[tell ceph-mon about its peers\] called
\[2013-04-15T06:32:16+00:00\] INFO: Processing ruby\_block\[get osd-bootstrap keyring\] action create (ceph::mon line 79)
2013-04-15 06:32:16.872040 7fca8e297780 -1 monclient(hunting): authenticate NOTE: no keyring found; disabled cephx authentication
2013-04-15 06:32:16.872042 7fca8e297780 -1 unable to authenticate as client.admin
2013-04-15 06:32:16.872400 7fca8e297780 -1 ceph\_tool\_common\_init failed.
\[2013-04-15T06:32:18+00:00\] INFO: ruby\_block\[get osd-bootstrap keyring\] called
\[2013-04-15T06:32:18+00:00\] INFO: Processing package\[gdisk\] action upgrade (ceph::osd line 37)
\[2013-04-15T06:32:27+00:00\] INFO: package\[gdisk\] upgraded from uninstalled to 
\[2013-04-15T06:32:27+00:00\] INFO: Processing service\[ceph\_osd\] action nothing (ceph::osd line 48)
\[2013-04-15T06:32:27+00:00\] INFO: Processing directory\[/var/lib/ceph/bootstrap-osd\] action create (ceph::osd line 67)
\[2013-04-15T06:32:27+00:00\] INFO: Processing file\[/var/lib/ceph/bootstrap-osd/ceph.keyring.raw\] action create (ceph::osd line 76)
\[2013-04-15T06:32:27+00:00\] INFO: entered create
\[2013-04-15T06:32:27+00:00\] INFO: file\[/var/lib/ceph/bootstrap-osd/ceph.keyring.raw\] owner changed to 0m
\[2013-04-15T06:32:27+00:00\] INFO: file\[/var/lib/ceph/bootstrap-osd/ceph.keyring.raw\] group changed to 0
\[2013-04-15T06:32:27+00:00\] INFO: file\[/var/lib/ceph/bootstrap-osd/ceph.keyring.raw\] mode changed to 440
\[2013-04-15T06:32:27+00:00\] INFO: file\[/var/lib/ceph/bootstrap-osd/ceph.keyring.raw\] created file /var/lib/ceph/bootstrap-osd/ceph.keyring.raw
\[2013-04-15T06:32:27+00:00\] INFO: Processing execute\[format as keyring\] action run (ceph::osd line 83)
creating /var/lib/ceph/bootstrap-osd/ceph.keyring
added entity client.bootstrap-osd auth auth(auid = 18446744073709551615 key=AQAOl2tR0M4bMRAAatSlUh2KP9hGBBAP6u5AUA== with 0 caps)
\[2013-04-15T06:32:27+00:00\] INFO: execute\[format as keyring\] ran successfully
\[2013-04-15T06:32:28+00:00\] INFO: Chef Run complete in 14.479108446 seconds
\[2013-04-15T06:32:28+00:00\] INFO: Running report handlers
\[2013-04-15T06:32:28+00:00\] INFO: Report handlers complete

Witness:

ceph-0:~ # rcceph status
=== mon.ceph-0 === 
mon.ceph-0: running {"version":"0.60-468-g98de67d"}

On the note of building an [easy-to-deploy Ceph appliance](/2013/04/hackweek-9-ceph-appliance-odyssey/ "Hackweek 9: Ceph Appliance Odyssey"), assuming you’re not using Chef and just want something to play with, I reckon the way to go is use config pretty similar to what _would_ be deployed by this Chef cookbook, i.e. an absolute minimal `/etc/ceph/ceph.conf`, specifying nothing other than initial mons, then use the various Ceph CLI tools to create mons and osds on each node and just rely on the init script in Ceph >= 0.58 to do the right thing with what it finds (having to explicitly specify each mon, osd and mds in the Ceph config by name always bugged me). Bonus points for using [csync2](http://oss.linbit.com/csync2/) to propagate `/etc/ceph/ceph.conf` across the cluster.

Source: Tim Serong ([One More chef-client Run](http://ourobengr.com/2013/04/one-more-chef-client-run/))
