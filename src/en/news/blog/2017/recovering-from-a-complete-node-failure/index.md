---
title: "Recovering from a complete node failure"
date: "2017-05-06"
author: "admin"
tags: 
  - "planet"
---

![Drawing](images/Ceph_Logo_Standard_RGB_120411_fa.png)

## Recovering an entire OSD node

### A Ceph Recovery Story

  
**Note:** This will be a very lengthy and detail account of my experience. If you want to skip it, please just scroll down to the TL:DR section at the bottom

I wanted to share with everyone a situation that happened to me over the weekend. This is a tale of a disaster, shear panic, and recovery of said disaster. I know some may just want a quick answer to how **_“X”_** happened to me and how I did **_“Y”_** to solve it. But I truly believe that if you want to be a better technician and all around admin, you need to know the methodology of how the solution was found. Let get into what happened, why it happened, how I fixed it, and how to prevent this from happening again.

## What happened

It started with the simple need to upgrade a few packages on each of my cluster nodes (non Ceph related). Standard operating procedures dictate that this needs to be done on a not so traffic heavy part of the week. My cluster setup is small, consisting of 4 OSD nodes, an MDS and 3 monitors. Only wanting to upgrade standard packages on the machine, I decided to start with my first OSD node (lets just call it **node1**). I upgraded the packages fine, set the cluster to **_ceph old set noout_**, and proceeded to commence a reboot.

> …Unbeknownst to me, the No.2 train from Crap city was about to pull into Pants station.

Reboot finishes, Centos starts to load up and then I go to try and login. Nothing. Maybe I typed the password wrong. Nothing. Caps lock? Nope. Long story short, changing my password in single user mode hosed my entire os. Thats fine though I can rebuild this node and re-add it back in. Lets mark these disk out one at a time, left the cluster heal, and add in a new node (after reinstalling the os).

After removing most of the disks, I notice I have 3 pgs stuck in a **_stale+active+clean_** state. What?!

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div></pre></td><td class="code"><pre><div class="line">$ ceph health detail | grep stale</div><div class="line"></div><div class="line">pg 11.48 is stuck stale for 240992.605278, current state stale+active+clean, last acting [73,64,60]</div><div class="line">pg 11.1e is stuck stale for 240992.605734, current state stale+active+clean, last acting [73,70,60]</div><div class="line">pg 11.1c is stuck stale for 240992.606204, current state stale+active+clean, last acting [75,68,77]</div></pre></td></tr></tbody></table>

The pool in this case is pool 11 _(pg 11.48 - 11 here tells you what pool its from)_. Checking on the status of pool 11, I find it is inaccessible and it has caused an outage.

> …and the train has arrived.

## But why did this happen?

Panic sets in a bit, and I mentally start going through the 5 “whys” of troubleshooting.

> - Problem - My entire node is dead and lost access to its disks and one of my pools is completely unavailable
>     - Why? And upgraded hosed the OS
>     - Why? Pool outage possibly was related to the OSD disks
>     - Why? Pool outage was PG related

What did all 3 of those PGs have in common? Their PG OSD disks all resided on the same node. But how? I have all my pools in CRUSH to replicate between hosts.  
**Note:** You can see the OSDs that make up a PG at the end of the detail status for it **‘last acting \[73,64,60\]’**

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div><div class="line">6</div><div class="line">7</div><div class="line">8</div><div class="line">9</div><div class="line">10</div><div class="line">11</div><div class="line">12</div><div class="line">13</div><div class="line">14</div><div class="line">15</div><div class="line">16</div><div class="line">17</div><div class="line">18</div><div class="line">19</div><div class="line">20</div><div class="line">21</div><div class="line">22</div><div class="line">23</div><div class="line">24</div><div class="line">25</div><div class="line">26</div><div class="line">27</div><div class="line">28</div><div class="line">29</div><div class="line">30</div><div class="line">31</div><div class="line">32</div><div class="line">33</div><div class="line">34</div><div class="line">35</div></pre></td><td class="code"><pre><div class="line">$ ceph osd dump |grep pool</div><div class="line"></div><div class="line">...</div><div class="line">pool 11 'important-pool' replicated size 3 min_size 2 crush_ruleset 0 object_hash rjenkins pg_num 128 pgp_num 128 last_change 8040 flags hashpspool stripe_width 0</div><div class="line">	removed_snaps</div><div class="line">...</div><div class="line"></div><div class="line">$ ceph osd crush dump</div><div class="line"></div><div class="line">...</div><div class="line">"rules": [</div><div class="line">        {</div><div class="line">            "rule_id": 0,</div><div class="line">            "rule_name": "replicated_ruleset",</div><div class="line">            "ruleset": 0,</div><div class="line">            "type": 1,</div><div class="line">            "min_size": 1,</div><div class="line">            "max_size": 10,</div><div class="line">            "steps": [</div><div class="line">                {</div><div class="line">                    "op": "take",</div><div class="line">                    "item": -1,</div><div class="line">                    "item_name": "default"</div><div class="line">                },</div><div class="line">                {</div><div class="line">                    "op": "choose_firstn",</div><div class="line">                    "num": 0,</div><div class="line">                    "type": "osd"</div><div class="line">                },</div><div class="line">                {</div><div class="line">                    "op": "emit"</div><div class="line">                }</div><div class="line">            ]</div><div class="line">        }</div><div class="line">...</div></pre></td></tr></tbody></table>

Holy crap, it never got set to the “hosts” crush rule 1.

## How do we fix this

Lets update our whys.

> - Problem - My entire node is dead and lost access to its disks and one of my pools is completely unavailable
>     - Why? And upgraded hosed the OS
>     - Why? Pool outage possibly was related to the OSD disks
>     - Why? Pool outage was PG related
>     - Why? Pool fail because 3 of its PG solely resided on a failed node. These disks were also marked out and removed from the cluster.

There you have it. We need to get the data back from these disks. Now a quick google of how to fix these PGs will quickly lead you to the most common answer, delete the pool and start over. Well thats great for people who don’t have anything in their pool. Well looks like I’m on my own here.

First thing I want to do is get this node installed back with an OS on it. Once thats complete I want to install ceph and deploy some admin keys to it. Now the tricky part, how to I get these disks to be added back in to the cluster and retain all their data and OSD IDs?

Well we need to map the effected OSDs back to their respective directories. Since this OS is fresh, lets recreate those directories. I need to recover data from osd 60,64,68,70,73,75,77 so we’ll make only these.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">$ <span class="keyword">for</span> i <span class="keyword">in</span> 60 64 68 70 73 75 77; <span class="keyword">do</span> mkdir -p /var/lib/ceph/osd/ceph-<span class="variable">$i</span>; <span class="keyword">done</span></div></pre></td></tr></tbody></table>

Thankfully I knew where each /dev/sd$ device gets mapped. If you don’t remember thats ok, each disk has a unique ID that can be found on the actual disk it self. Using that we can cross reference it with out actually cluster info!

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div><div class="line">6</div><div class="line">7</div><div class="line">8</div><div class="line">9</div><div class="line">10</div><div class="line">11</div><div class="line">12</div></pre></td><td class="code"><pre><div class="line">$ mount /dev/sda1 /mnt/tmpdisk</div><div class="line">$ ls /mnt/tmpdisk</div><div class="line">activate.monmap  active  ceph_fsid  current  </div><div class="line">fsid  journal  journal_uuid  keyring  magic  </div><div class="line">ready  store_version  superblock  systemd  type  whoami</div><div class="line">$ cat /mnt/tmpdisk/fsid</div><div class="line">e0999546-df8f-44d5-9997-bb332a9c972a</div><div class="line">$ ceph osd dump | grep e0999546-df8f-44d5-9997-bb332a9c972a</div><div class="line"></div><div class="line">osd.60 up   in  weight 1 up_from 522 up_thru 7784 down_at 520 last_clean_interval  </div><div class="line">[387,520) 1.1.1.1:6876/9175 2.2.2.2:6892/4009175 3.3.3.3:6894/4009175</div><div class="line">4.4.4.4:6895/4009175 exists,up e0999546-df8f-44d5-9997-bb332a9c972a</div></pre></td></tr></tbody></table>

Boom there we go, this disk belonged to **_osd.60_**, lets mount that to the appropriate cep directory **_/var/lib/ceph/osd/ceph-60_**

Ok so maybe you did like me and REMOVED the osd entirely from the cluster, how do I find out its OSD number then, well easier than you think. All you do is take that FSID number and use it to create a new OSD. Once complete it will return and create it with its original OSD id!

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div></pre></td><td class="code"><pre><div class="line">$ ceph osd create e0999546-df8f-44d5-9997-bb332a9c972a</div><div class="line">60</div></pre></td></tr></tbody></table>

Ok so now what, well lets start one of our disks and see what happens (set it to debug 10 just in case)

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">ceph-osd -f -i 60 --osd-data /var/lib/ceph/osd/ceph-60 --osd-journal /var/lib/ceph/osd/ceph-60/journal --debug_osd 10</div></pre></td></tr></tbody></table>

Well it failed with this error

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div><div class="line">6</div><div class="line">7</div><div class="line">8</div><div class="line">9</div></pre></td><td class="code"><pre><div class="line">2017-05-01 18:58:02.913051 7fb4d4bd4800 -1 osd.61 4704 log_to_monitors {default=true}</div><div class="line">2017-05-01 18:58:32.995110 7fb4d4bd4800  0 monclient: wait_auth_rotating timed out after 30</div><div class="line">2017-05-01 18:58:32.995161 7fb4d4bd4800 -1 osd.61 4704 unable to obtain rotating service keys; retrying</div><div class="line">2017-05-01 18:52:24.337511 7efc64886700 10 osd.61 4704 do_waiters -- start</div><div class="line">2017-05-01 18:52:24.337514 7efc64886700 10 osd.61 4704 do_waiters -- finish</div><div class="line">2017-05-01 18:52:24.341935 7efc64085700 10 osd.61 4704 tick_without_osd_lock</div><div class="line">2017-05-01 18:52:25.230537 7efc4a699700  5 osd.61 4704 heartbeat: osd_stat(121 GB used, 1554 GB avail, 1675 GB total, peers []/[] op hist [])</div><div class="line">2017-05-01 18:52:25.334245 7efc6f327800  0 monclient: wait_auth_rotating timed out after 30</div><div class="line">2017-05-01 18:52:25.334263 7efc6f327800 -1 osd.61 4704 unable to obtain rotating service keys; retrying</div></pre></td></tr></tbody></table>

Well googling this resulted in nothing. So run it through the 5 whys and see if we can’t figure it out.

> - Problem - OSD failed to obtain rotating keys. This sounds like a heartbeat/auth problem.
>     - Why? Other nodes may have issues seeing this one on the network. Nope this checks fine.
>     - Why? Heartbeat could be messed up, time off?
>     - Why? Time was off by 1 whole hour, this solved the issue.

Yay! Having a bad time set will make your keys (or tickets) look like they have expired during this handshake. Trying to start this osd again resulted in a journal error, not a big deal lets just recreate the journal.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div><div class="line">6</div></pre></td><td class="code"><pre><div class="line">2017-05-01 22:27:05.198493 7f0434e55800  0 filestore(/var/lib/ceph/osd/ceph-64) mount: enabling WRITEAHEAD journal mode: checkpoint is not enabled</div><div class="line">2017-05-01 22:27:05.201283 7f0434e55800 -1 filestore(/var/lib/ceph/osd/ceph-64) mount failed to open journal /var/lib/ceph/osd/ceph-64/journal: (13) Permission denied</div><div class="line">2017-05-01 22:27:05.201409 7f0434e55800 -1 osd.64 0 OSD:init: unable to mount object store</div><div class="line">2017-05-01 22:27:05.201423 7f0434e55800 -1  ** ERROR: osd init failed: (13) Permission denied</div><div class="line"></div><div class="line">$ ceph-osd -f -i 60 --osd-data /var/lib/ceph/osd/ceph-60 --osd-journal /var/lib/ceph/osd/ceph-60/journal --mkjournal</div></pre></td></tr></tbody></table>

Lets try one more time…

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">screen ceph-osd -f -i 60 --osd-data /var/lib/ceph/osd/ceph-60 --osd-journal /var/lib/ceph/osd/ceph-60/journal --debug_osd 6</div></pre></td></tr></tbody></table>

Success! How do I know? Because **_systemctl status ceph-osd@60_** reports success and running **_ceph -s_** shows it as up and in.

**Note:** When adding these disks back to the crush map, set their weight to 0, so that nothing gets moved to them, but you can read what data you need off of them.

I repeated this will all the other needed OSDs, and after all the rebuilding and backfilling was done. I check the pool again and saw all my images! Thank god. I changed the pool to replicate at the host level by changing to the new crush rule.

I waited for it to rebalance the pool and my cluster status was healthy again! At this point I didn’t want to keep up just 8 OSDs on one node, so one by one I set them out and properly removed them from the cluster. Ill rejoin this node later once my cluster status goes back to being healthy.

## TL:DR

I had a PG that was entirely on a failed node. By reinstalling the OS again on that node, I was able to manually mount up the old OSDs and add them to the cluster. This allowed me to regain access to vital data pools and fix the crush rule set that caused this to begin with.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div></pre></td><td class="code"><pre><div class="line">ceph-osd -f -i 78 --osd-data /var/lib/ceph/osd/ceph-78 --osd-journal /var/lib/ceph/osd/ceph-78/journal --debug_osd 6 --mkjournal</div><div class="line">ceph osd rm osd.78</div><div class="line">ceph osd create 3a8802a4-1ee1-4043-a32e-758054e21fe2</div><div class="line">screen ceph-osd -f -i 78 --osd-data /var/lib/ceph/osd/ceph-78 --osd-journal /var/lib/ceph/osd/ceph-78/journal --debug_osd 6</div></pre></td></tr></tbody></table>

Thank you for taking the time to read this. I know its lengthy but I wanted to detail to the best of my ability everything I encountered and went through. If it have any questions or just wanna say thanks, please feel free to send me an email at **magusnebula@gmail.com**.

Source: Stephen McElroy ([Recovering from a complete node failure](http://obsidiancreeper.com/2017/05/06/Recovering-from-a-complete-node-failure/))
