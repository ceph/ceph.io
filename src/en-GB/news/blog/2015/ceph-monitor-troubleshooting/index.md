---
title: "Ceph: Monitor Troubleshooting"
date: "2015-05-30"
author: "syndicated"
tags: 
  - "planet"
---

![Ceph monitor ip change](images/monitor-troubleshooting.jpg "Ceph monitor ip change")

While playing with your Ceph cluster , you might have seen **HEALTH\_WARN** cluster status.

Cluster warning can occur due to several reasons of component malfunctioning such as MON,OSD,PG & MDS.

In my case i saw warning due to Ceph monitors, which was like :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line">health HEALTH_WARN <span class="m">1</span> mons down, quorum 0,1 ceph-mon1,ceph-mon2
</span></code></pre></td></tr></tbody></table>

At first i tried restarting MON service , but no luck.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
<span class="line-number">10</span>
<span class="line-number">11</span>
<span class="line-number">12</span>
<span class="line-number">13</span>
<span class="line-number">14</span>
<span class="line-number">15</span>
<span class="line-number">16</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@ceph-mon3 ~<span class="o">]</span><span class="c"># service ceph status mon</span>
</span><span class="line"><span class="o">===</span> mon.ceph-mon3 <span class="o">===</span>
</span><span class="line">mon.ceph-mon3: not running.
</span><span class="line"><span class="o">[</span>root@ceph-mon3 ~<span class="o">]</span><span class="c"># service ceph start mon</span>
</span><span class="line"><span class="o">===</span> mon.ceph-mon3 <span class="o">===</span>
</span><span class="line">Starting Ceph mon.ceph-mon3 on ceph-mon3...
</span><span class="line">Invalid argument: /var/lib/ceph/mon/ceph-ceph-mon3/store.db: does not exist <span class="o">(</span>create_if_missing is <span class="nb">false</span><span class="o">)</span>
</span><span class="line">IO error: /var/lib/ceph/mon/ceph-ceph-mon3/store.db/000001.dbtmp: Input/output error
</span><span class="line">2015-05-22 11:44:38.065906 7fad6c6967a0 -1 failed to create new leveldb store
</span><span class="line">failed: <span class="s1">'ulimit -n 131072;  /usr/bin/ceph-mon -i ceph-mon3 --pid-file /var/run/ceph/mon.ceph-mon3.pid -c /etc/ceph/ceph.conf --cluster ceph '</span>
</span><span class="line">Starting ceph-create-keys on ceph-mon3...
</span><span class="line"><span class="o">[</span>root@ceph-mon3 ~<span class="o">]</span><span class="c">#</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon3 ~<span class="o">]</span><span class="c"># service ceph status mon</span>
</span><span class="line"><span class="o">===</span> mon.ceph-mon3 <span class="o">===</span>
</span><span class="line">mon.ceph-mon3: not running.
</span><span class="line"><span class="o">[</span>root@ceph-mon3 ~<span class="o">]</span><span class="c">#</span>
</span></code></pre></td></tr></tbody></table>

The error message that i received was not something normal, so i started playing rough with my cluster , by moving monitor `store.db` files. !!! Be Cautious

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line">mv /var/lib/ceph/mon/ceph-ceph-mon3/store.db /var/lib/ceph/mon/ceph-ceph-mon3/store.db.orig
</span></code></pre></td></tr></tbody></table>

And this broke MON really badly, so now i know another way that causes a new error YAY :-)

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@ceph-mon3 ceph-ceph-mon3<span class="o">]</span><span class="c"># service ceph start mon</span>
</span><span class="line"><span class="o">===</span> mon.ceph-mon3 <span class="o">===</span>
</span><span class="line">Starting Ceph mon.ceph-mon3 on ceph-mon3...
</span><span class="line">2015-05-22 11:59:45.385826 7faa43dfb7a0 -1 unable to <span class="nb">read </span>magic from mon data.. did you run mkcephfs?
</span><span class="line">failed: <span class="s1">'ulimit -n 131072;  /usr/bin/ceph-mon -i ceph-mon3 --pid-file /var/run/ceph/mon.ceph-mon3.pid -c /etc/ceph/ceph.conf --cluster ceph '</span>
</span><span class="line">Starting ceph-create-keys on ceph-mon3...
</span><span class="line"><span class="o">[</span>root@ceph-mon3 ceph-ceph-mon3<span class="o">]</span><span class="c">#</span>
</span></code></pre></td></tr></tbody></table>

Show Time begins :-)

Then i started doing real work by reading monitor logs and what i found was monitor IP address were incorrect , they need to have a different address range.

To fix this first we need to change monitor IP address to the correct rage.

### Changing Ceph Monitor IP Address

- Get monitor maps , you could see the current IP range is 80.50.X.X , we need to change this to the correct range.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
<span class="line-number">10</span>
<span class="line-number">11</span>
<span class="line-number">12</span>
<span class="line-number">13</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c"># ceph mon getmap -o /tmp/monmap</span>
</span><span class="line">got monmap epoch 3
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c">#</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c"># monmaptool --print /tmp/monmap</span>
</span><span class="line">monmaptool: monmap file /tmp/monmap
</span><span class="line">epoch 3
</span><span class="line">fsid 98d89661-f616-49eb-9ccf-84d720e179c0
</span><span class="line">last_changed 2015-05-18 14:42:01.287460
</span><span class="line">created 2015-05-18 14:41:00.514879
</span><span class="line">0: 80.50.50.35:6789/0 mon.ceph-mon1
</span><span class="line">1: 80.50.50.37:6789/0 mon.ceph-mon2
</span><span class="line">2: 80.50.50.39:6789/0 mon.ceph-mon3
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c">#</span>
</span></code></pre></td></tr></tbody></table>

- Remove monitor nodes from monitor map

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
<span class="line-number">10</span>
<span class="line-number">11</span>
<span class="line-number">12</span>
<span class="line-number">13</span>
<span class="line-number">14</span>
<span class="line-number">15</span>
<span class="line-number">16</span>
<span class="line-number">17</span>
<span class="line-number">18</span>
<span class="line-number">19</span>
<span class="line-number">20</span>
<span class="line-number">21</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c"># monmaptool --rm ceph-mon1 /tmp/monmap</span>
</span><span class="line">monmaptool: monmap file /tmp/monmap
</span><span class="line">monmaptool: removing ceph-mon1
</span><span class="line">monmaptool: writing epoch <span class="m">3</span> to /tmp/monmap <span class="o">(</span><span class="m">2</span> monitors<span class="o">)</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c"># monmaptool --rm ceph-mon2 /tmp/monmap</span>
</span><span class="line">monmaptool: monmap file /tmp/monmap
</span><span class="line">monmaptool: removing ceph-mon2
</span><span class="line">monmaptool: writing epoch <span class="m">3</span> to /tmp/monmap <span class="o">(</span><span class="m">1</span> monitors<span class="o">)</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c"># monmaptool --rm ceph-mon3 /tmp/monmap</span>
</span><span class="line">monmaptool: monmap file /tmp/monmap
</span><span class="line">monmaptool: removing ceph-mon3
</span><span class="line">monmaptool: writing epoch <span class="m">3</span> to /tmp/monmap <span class="o">(</span><span class="m">0</span> monitors<span class="o">)</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c">#</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c">#</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c"># monmaptool --print /tmp/monmap</span>
</span><span class="line">monmaptool: monmap file /tmp/monmap
</span><span class="line">epoch 3
</span><span class="line">fsid 98d89661-f616-49eb-9ccf-84d720e179c0
</span><span class="line">last_changed 2015-05-18 14:42:01.287460
</span><span class="line">created 2015-05-18 14:41:00.514879
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c">#</span>
</span></code></pre></td></tr></tbody></table>

- Add the correct hostname and IP address for monitor nodes

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
<span class="line-number">10</span>
<span class="line-number">11</span>
<span class="line-number">12</span>
<span class="line-number">13</span>
<span class="line-number">14</span>
<span class="line-number">15</span>
<span class="line-number">16</span>
<span class="line-number">17</span>
<span class="line-number">18</span>
<span class="line-number">19</span>
<span class="line-number">20</span>
<span class="line-number">21</span>
<span class="line-number">22</span>
<span class="line-number">23</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c"># monmaptool --add ceph-mon1-ib 10.100.1.101:6789 /tmp/monmap</span>
</span><span class="line">monmaptool: monmap file /tmp/monmap
</span><span class="line">monmaptool: writing epoch <span class="m">3</span> to /tmp/monmap <span class="o">(</span><span class="m">1</span> monitors<span class="o">)</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c">#</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c">#</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c"># monmaptool --add ceph-mon2-ib 10.100.1.102:6789 /tmp/monmap</span>
</span><span class="line">monmaptool: monmap file /tmp/monmap
</span><span class="line">monmaptool: writing epoch <span class="m">3</span> to /tmp/monmap <span class="o">(</span><span class="m">2</span> monitors<span class="o">)</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c">#</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c"># monmaptool --add ceph-mon3-ib 10.100.1.103:6789 /tmp/monmap</span>
</span><span class="line">monmaptool: monmap file /tmp/monmap
</span><span class="line">monmaptool: writing epoch <span class="m">3</span> to /tmp/monmap <span class="o">(</span><span class="m">3</span> monitors<span class="o">)</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c">#</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c">#</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c"># monmaptool --print /tmp/monmap monmaptool: monmap file /tmp/monmap</span>
</span><span class="line">epoch 3
</span><span class="line">fsid 98d89661-f616-49eb-9ccf-84d720e179c0
</span><span class="line">last_changed 2015-05-18 14:42:01.287460
</span><span class="line">created 2015-05-18 14:41:00.514879
</span><span class="line">0: 10.100.1.101:6789/0 mon.ceph-mon1-ib
</span><span class="line">1: 10.100.1.102:6789/0 mon.ceph-mon2-ib
</span><span class="line">2: 10.100.1.103:6789/0 mon.ceph-mon3-ib
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c">#</span>
</span></code></pre></td></tr></tbody></table>

- Before injecting the new monmap , bring down monitor services and then inject the monmap.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c"># service ceph stop mon</span>
</span><span class="line"><span class="o">===</span> mon.ceph-mon1 <span class="o">===</span>
</span><span class="line">Stopping Ceph mon.ceph-mon1 on ceph-mon1...kill 441540...done
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ~<span class="o">]</span><span class="c">#</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ceph<span class="o">]</span><span class="c"># ceph-mon -i ceph-mon1 --inject-monmap /tmp/monmap</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ceph<span class="o">]</span><span class="c">#</span>
</span></code></pre></td></tr></tbody></table>

- Repeat these steps for the other monitors in your cluster , to save some time you can copy the new monmap file from first monitor node (ceph-mon1) to other monitor nodes and simply inject this new monmap into their ceph monitor instance.
- Finally bring up the monitor services on all the monitor nodes.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@ceph-mon1 ceph<span class="o">]</span><span class="c"># service ceph start mon</span>
</span><span class="line"><span class="o">===</span> mon.ceph-mon1 <span class="o">===</span>
</span><span class="line">Starting Ceph mon.ceph-mon1 on ceph-mon1...
</span><span class="line">Starting ceph-create-keys on ceph-mon1...
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ceph<span class="o">]</span><span class="c">#</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ceph<span class="o">]</span><span class="c"># service ceph status mon</span>
</span><span class="line"><span class="o">===</span> mon.ceph-mon1 <span class="o">===</span>
</span><span class="line">mon.ceph-mon1: running <span class="o">{</span><span class="s2">"version"</span>:<span class="s2">"0.80.9"</span><span class="o">}</span>
</span><span class="line"><span class="o">[</span>root@ceph-mon1 ceph<span class="o">]</span><span class="c">#</span>
</span></code></pre></td></tr></tbody></table>

If you still see monitor problems, you can redeploy the monitor node

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@ceph-mon1 ceph<span class="o">]</span><span class="c"># ceph-deploy --overwrite-conf  mon create ceph-mon3</span>
</span></code></pre></td></tr></tbody></table>

- Finally your cluster should attain **Health\_OK** status

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@ceph-mon3 ceph<span class="o">]</span><span class="c"># ceph -s</span>
</span><span class="line">    cluster 98d89661-f616-49eb-9ccf-84d720e179c0
</span><span class="line">     health HEALTH_OK
</span><span class="line">     monmap e4: <span class="m">3</span> mons at <span class="o">{</span>ceph-mon1<span class="o">=</span>10.100.1.101:6789/0,ceph-mon2<span class="o">=</span>10.100.1.102:6789/0,ceph-mon3<span class="o">=</span>10.100.1.103:6789/0<span class="o">}</span>, election epoch 18, quorum 0,1,2 ceph-mon1,ceph-mon2,ceph-mon3
</span><span class="line">     osdmap e244: <span class="m">55</span> osds: <span class="m">54</span> up, <span class="m">54</span> in
</span><span class="line">      pgmap v693: <span class="m">192</span> pgs, <span class="m">3</span> pools, <span class="m">0</span> bytes data, <span class="m">0</span> objects
</span><span class="line">            <span class="m">5327</span> MB used, <span class="m">146</span> TB / <span class="m">146</span> TB avail
</span><span class="line">                 <span class="m">192</span> active+clean
</span><span class="line"><span class="o">[</span>root@ceph-mon3 ceph<span class="o">]</span><span class="c">#</span>
</span></code></pre></td></tr></tbody></table>

> This might give you some idea of Ceph monitor troubleshooting. You could also follow more detailed steps mentioned in Ceph documentation.
