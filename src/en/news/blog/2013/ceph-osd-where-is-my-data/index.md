---
title: "Ceph OSD : Where Is My Data ?"
date: "2013-08-20"
author: "laurentbarbe"
tags: 
  - "planet"
---

The purpose is to verify where my data is stored on the Ceph cluster.

For this, I have just create a minimal cluster with 3 osd :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ ceph-deploy osd create ceph-01:/dev/sdb ceph-02:/dev/sdb ceph-03:/dev/sdb</span></code></pre></td></tr></tbody></table>

Where is my osd directory on ceph-01 ?

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ mount | grep ceph
</span><span class="line">/dev/sdb1 on /var/lib/ceph/osd/ceph-0 type xfs (rw,noatime,attr2,delaylog,noquota)</span></code></pre></td></tr></tbody></table>

The directory content :

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
<span class="line-number">24</span>
<span class="line-number">25</span>
<span class="line-number">26</span>
<span class="line-number">27</span>
<span class="line-number">28</span>
<span class="line-number">29</span>
<span class="line-number">30</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ cd /var/lib/ceph/osd/ceph-0; ls -l
</span><span class="line">total 52
</span><span class="line">-rw-r--r-- 1 root root  487 août  20 12:12 activate.monmap
</span><span class="line">-rw-r--r-- 1 root root    3 août  20 12:12 active
</span><span class="line">-rw-r--r-- 1 root root   37 août  20 12:12 ceph_fsid
</span><span class="line">drwxr-xr-x 133 root root 8192 août  20 12:18 current
</span><span class="line">-rw-r--r-- 1 root root   37 août  20 12:12 fsid
</span><span class="line">lrwxrwxrwx   1 root root   58 août  20 12:12 journal -&gt; /dev/disk/by-partuuid/37180b7e-fe5d-4b53-8693-12a8c1f52ec9
</span><span class="line">-rw-r--r-- 1 root root   37 août  20 12:12 journal_uuid
</span><span class="line">-rw------- 1 root root   56 août  20 12:12 keyring
</span><span class="line">-rw-r--r-- 1 root root   21 août  20 12:12 magic
</span><span class="line">-rw-r--r-- 1 root root    6 août  20 12:12 ready
</span><span class="line">-rw-r--r-- 1 root root    4 août  20 12:12 store_version
</span><span class="line">-rw-r--r-- 1 root root    0 août  20 12:12 sysvinit
</span><span class="line">-rw-r--r-- 1 root root    2 août  20 12:12 whoami
</span><span class="line">
</span><span class="line">$ du -hs *
</span><span class="line">4,0K  activate.monmap → The current monmap
</span><span class="line">4,0K  active      → "ok"
</span><span class="line">4,0K  ceph_fsid   → cluster fsid (same return by 'ceph fsid')
</span><span class="line">2,1M  current
</span><span class="line">4,0K  fsid        → id for this osd
</span><span class="line">0 journal         → symlink to journal partition
</span><span class="line">4,0K  journal_uuid
</span><span class="line">4,0K  keyring     → the key
</span><span class="line">4,0K  magic       → "ceph osd volume v026"
</span><span class="line">4,0K  ready       → "ready"
</span><span class="line">4,0K  store_version   
</span><span class="line">0 sysvinit
</span><span class="line">4,0K  whoami      → id of the osd</span></code></pre></td></tr></tbody></table>

The data are store in the directory “current” : It contains some file and many \_head file :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ cd current; ls -l | grep -v head
</span><span class="line">total 20
</span><span class="line">-rw-r--r-- 1 root root     5 août  20 12:18 commit_op_seq
</span><span class="line">drwxr-xr-x 2 root root 12288 août  20 12:18 meta
</span><span class="line">-rw-r--r-- 1 root root     0 août  20 12:12 nosnap
</span><span class="line">drwxr-xr-x 2 root root   111 août  20 12:12 omap</span></code></pre></td></tr></tbody></table>

In omap directory :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ cd omap; ls -l
</span><span class="line">-rw-r--r-- 1 root root     150 août  20 12:12 000007.sst
</span><span class="line">-rw-r--r-- 1 root root 2031616 août  20 12:18 000010.log 
</span><span class="line">-rw-r--r-- 1 root root      16 août  20 12:12 CURRENT
</span><span class="line">-rw-r--r-- 1 root root       0 août  20 12:12 LOCK
</span><span class="line">-rw-r--r-- 1 root root     172 août  20 12:12 LOG
</span><span class="line">-rw-r--r-- 1 root root     309 août  20 12:12 LOG.old
</span><span class="line">-rw-r--r-- 1 root root   65536 août  20 12:12 MANIFEST-000009</span></code></pre></td></tr></tbody></table>

In meta directory :

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
<span class="line-number">24</span>
<span class="line-number">25</span>
<span class="line-number">26</span>
<span class="line-number">27</span>
<span class="line-number">28</span>
<span class="line-number">29</span>
<span class="line-number">30</span>
<span class="line-number">31</span>
<span class="line-number">32</span>
<span class="line-number">33</span>
<span class="line-number">34</span>
<span class="line-number">35</span>
<span class="line-number">36</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ cd ../meta; ls -l
</span><span class="line">total 940
</span><span class="line">-rw-r--r-- 1 root root  710 août  20 12:14 inc\uosdmap.10__0_F4E9C003__none
</span><span class="line">-rw-r--r-- 1 root root  958 août  20 12:12 inc\uosdmap.1__0_B65F4306__none
</span><span class="line">-rw-r--r-- 1 root root  722 août  20 12:14 inc\uosdmap.11__0_F4E9C1D3__none
</span><span class="line">-rw-r--r-- 1 root root  152 août  20 12:14 inc\uosdmap.12__0_F4E9C163__none
</span><span class="line">-rw-r--r-- 1 root root  153 août  20 12:12 inc\uosdmap.2__0_B65F40D6__none
</span><span class="line">-rw-r--r-- 1 root root  574 août  20 12:12 inc\uosdmap.3__0_B65F4066__none
</span><span class="line">-rw-r--r-- 1 root root  153 août  20 12:12 inc\uosdmap.4__0_B65F4136__none
</span><span class="line">-rw-r--r-- 1 root root  722 août  20 12:12 inc\uosdmap.5__0_B65F46C6__none
</span><span class="line">-rw-r--r-- 1 root root  136 août  20 12:14 inc\uosdmap.6__0_B65F4796__none
</span><span class="line">-rw-r--r-- 1 root root  642 août  20 12:14 inc\uosdmap.7__0_B65F4726__none
</span><span class="line">-rw-r--r-- 1 root root  153 août  20 12:14 inc\uosdmap.8__0_B65F44F6__none
</span><span class="line">-rw-r--r-- 1 root root  722 août  20 12:14 inc\uosdmap.9__0_B65F4586__none
</span><span class="line">-rw-r--r-- 1 root root    0 août  20 12:12 infos__head_16EF7597__none
</span><span class="line">-rw-r--r-- 1 root root 2870 août  20 12:14 osdmap.10__0_6417091C__none
</span><span class="line">-rw-r--r-- 1 root root  830 août  20 12:12 osdmap.1__0_FD6E49B1__none
</span><span class="line">-rw-r--r-- 1 root root 2870 août  20 12:14 osdmap.11__0_64170EAC__none
</span><span class="line">-rw-r--r-- 1 root root 2870 août  20 12:14 osdmap.12__0_64170E7C__none   → current osdmap
</span><span class="line">-rw-r--r-- 1 root root 1442 août  20 12:12 osdmap.2__0_FD6E4941__none
</span><span class="line">-rw-r--r-- 1 root root 1510 août  20 12:12 osdmap.3__0_FD6E4E11__none
</span><span class="line">-rw-r--r-- 1 root root 2122 août  20 12:12 osdmap.4__0_FD6E4FA1__none
</span><span class="line">-rw-r--r-- 1 root root 2122 août  20 12:12 osdmap.5__0_FD6E4F71__none
</span><span class="line">-rw-r--r-- 1 root root 2122 août  20 12:14 osdmap.6__0_FD6E4C01__none
</span><span class="line">-rw-r--r-- 1 root root 2190 août  20 12:14 osdmap.7__0_FD6E4DD1__none
</span><span class="line">-rw-r--r-- 1 root root 2802 août  20 12:14 osdmap.8__0_FD6E4D61__none
</span><span class="line">-rw-r--r-- 1 root root 2802 août  20 12:14 osdmap.9__0_FD6E4231__none
</span><span class="line">-rw-r--r-- 1 root root  354 août  20 12:14 osd\usuperblock__0_23C2FCDE__none
</span><span class="line">-rw-r--r-- 1 root root    0 août  20 12:12 pglog\u0.0__0_103B076E__none     → Log for each pg
</span><span class="line">-rw-r--r-- 1 root root    0 août  20 12:12 pglog\u0.1__0_103B043E__none
</span><span class="line">-rw-r--r-- 1 root root    0 août  20 12:12 pglog\u0.11__0_5172C9DB__none
</span><span class="line">-rw-r--r-- 1 root root    0 août  20 12:12 pglog\u0.13__0_5172CE3B__none
</span><span class="line">-rw-r--r-- 1 root root    0 août  20 12:13 pglog\u0.15__0_5172CC9B__none
</span><span class="line">-rw-r--r-- 1 root root    0 août  20 12:13 pglog\u0.16__0_5172CC2B__none
</span><span class="line">............
</span><span class="line">-rw-r--r-- 1 root root    0 août  20 12:12 snapmapper__0_A468EC03__noneosd</span></code></pre></td></tr></tbody></table>

Try decompiling crush map from osdmap :

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
<span class="line-number">24</span>
<span class="line-number">25</span>
<span class="line-number">26</span>
<span class="line-number">27</span>
<span class="line-number">28</span>
<span class="line-number">29</span>
<span class="line-number">30</span>
<span class="line-number">31</span>
<span class="line-number">32</span>
<span class="line-number">33</span>
<span class="line-number">34</span>
<span class="line-number">35</span>
<span class="line-number">36</span>
<span class="line-number">37</span>
<span class="line-number">38</span>
<span class="line-number">39</span>
<span class="line-number">40</span>
<span class="line-number">41</span>
<span class="line-number">42</span>
<span class="line-number">43</span>
<span class="line-number">44</span>
<span class="line-number">45</span>
<span class="line-number">46</span>
<span class="line-number">47</span>
<span class="line-number">48</span>
<span class="line-number">49</span>
<span class="line-number">50</span>
<span class="line-number">51</span>
<span class="line-number">52</span>
<span class="line-number">53</span>
<span class="line-number">54</span>
<span class="line-number">55</span>
<span class="line-number">56</span>
<span class="line-number">57</span>
<span class="line-number">58</span>
<span class="line-number">59</span>
<span class="line-number">60</span>
<span class="line-number">61</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ ceph osd stat
</span><span class="line">e12: 3 osds: 3 up, 3 in
</span><span class="line">
</span><span class="line">$ osdmaptool osdmap.12__0_64170E7C__none --export-crush /tmp/crushmap.bin
</span><span class="line">osdmaptool: osdmap file 'osdmap.12__0_64170E7C__none'
</span><span class="line">osdmaptool: exported crush map to /tmp/crushmap.bin
</span><span class="line">
</span><span class="line">$ crushtool -d /tmp/crushmap.bin -o /tmp/crushmap.txt
</span><span class="line">
</span><span class="line">$ cat /tmp/crushmap.txt
</span><span class="line"># begin crush map
</span><span class="line">
</span><span class="line"># devices
</span><span class="line">device 0 osd.0
</span><span class="line">device 1 osd.1
</span><span class="line">device 2 osd.2
</span><span class="line">
</span><span class="line"># types
</span><span class="line">type 0 osd
</span><span class="line">type 1 host
</span><span class="line">type 2 rack
</span><span class="line">type 3 row
</span><span class="line">type 4 room
</span><span class="line">type 5 datacenter
</span><span class="line">type 6 root
</span><span class="line">
</span><span class="line"># buckets
</span><span class="line">host ceph-01 {
</span><span class="line">  id -2       # do not change unnecessarily
</span><span class="line">  # weight 0.050
</span><span class="line">  alg straw
</span><span class="line">  hash 0  # rjenkins1
</span><span class="line">  item osd.0 weight 0.050
</span><span class="line">}
</span><span class="line">host ceph-02 {
</span><span class="line">  id -3       # do not change unnecessarily
</span><span class="line">  # weight 0.050
</span><span class="line">  alg straw
</span><span class="line">  hash 0  # rjenkins1
</span><span class="line">  item osd.1 weight 0.050
</span><span class="line">}
</span><span class="line">host ceph-03 {
</span><span class="line">  id -4       # do not change unnecessarily
</span><span class="line">  # weight 0.050
</span><span class="line">  alg straw
</span><span class="line">  hash 0  # rjenkins1
</span><span class="line">  item osd.2 weight 0.050
</span><span class="line">}
</span><span class="line">root default {
</span><span class="line">  id -1       # do not change unnecessarily
</span><span class="line">  # weight 0.150
</span><span class="line">  alg straw
</span><span class="line">  hash 0  # rjenkins1
</span><span class="line">  item ceph-01 weight 0.050
</span><span class="line">  item ceph-02 weight 0.050
</span><span class="line">  item ceph-03 weight 0.050
</span><span class="line">}
</span><span class="line">
</span><span class="line">...
</span><span class="line">
</span><span class="line"># end crush map</span></code></pre></td></tr></tbody></table>

Ok it’s what I expect. :)

The cluster is empty :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ find *_head -type f | wc -l
</span><span class="line">0</span></code></pre></td></tr></tbody></table>

The directory list correspond to the ‘ceph pg dump’

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ for dir in ` ceph pg dump | grep '\[0,' | cut -f1 `; do if [ -d $dir_head ]; then echo exist; else echo nok; fi; done | sort | uniq -c
</span><span class="line">dumped all in format plain
</span><span class="line">     69 exist</span></code></pre></td></tr></tbody></table>

To get all stats for a specific pg :

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
<span class="line-number">24</span>
<span class="line-number">25</span>
<span class="line-number">26</span>
<span class="line-number">27</span>
<span class="line-number">28</span>
<span class="line-number">29</span>
<span class="line-number">30</span>
<span class="line-number">31</span>
<span class="line-number">32</span>
<span class="line-number">33</span>
<span class="line-number">34</span>
<span class="line-number">35</span>
<span class="line-number">36</span>
<span class="line-number">37</span>
<span class="line-number">38</span>
<span class="line-number">39</span>
<span class="line-number">40</span>
<span class="line-number">41</span>
<span class="line-number">42</span>
<span class="line-number">43</span>
<span class="line-number">44</span>
<span class="line-number">45</span>
<span class="line-number">46</span>
<span class="line-number">47</span>
<span class="line-number">48</span>
<span class="line-number">49</span>
<span class="line-number">50</span>
<span class="line-number">51</span>
<span class="line-number">52</span>
<span class="line-number">53</span>
<span class="line-number">54</span>
<span class="line-number">55</span>
<span class="line-number">56</span>
<span class="line-number">57</span>
<span class="line-number">58</span>
<span class="line-number">59</span>
<span class="line-number">60</span>
<span class="line-number">61</span>
<span class="line-number">62</span>
<span class="line-number">63</span>
<span class="line-number">64</span>
<span class="line-number">65</span>
<span class="line-number">66</span>
<span class="line-number">67</span>
<span class="line-number">68</span>
<span class="line-number">69</span>
<span class="line-number">70</span>
<span class="line-number">71</span>
<span class="line-number">72</span>
<span class="line-number">73</span>
<span class="line-number">74</span>
<span class="line-number">75</span>
<span class="line-number">76</span>
<span class="line-number">77</span>
<span class="line-number">78</span>
<span class="line-number">79</span>
<span class="line-number">80</span>
<span class="line-number">81</span>
<span class="line-number">82</span>
<span class="line-number">83</span>
<span class="line-number">84</span>
<span class="line-number">85</span>
<span class="line-number">86</span>
<span class="line-number">87</span>
<span class="line-number">88</span>
<span class="line-number">89</span>
<span class="line-number">90</span>
<span class="line-number">91</span>
<span class="line-number">92</span>
<span class="line-number">93</span>
<span class="line-number">94</span>
<span class="line-number">95</span>
<span class="line-number">96</span>
<span class="line-number">97</span>
<span class="line-number">98</span>
<span class="line-number">99</span>
<span class="line-number">100</span>
<span class="line-number">101</span>
<span class="line-number">102</span>
<span class="line-number">103</span>
<span class="line-number">104</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ ceph pg 0.1 query
</span><span class="line">{ "state": "active+clean",
</span><span class="line">  "epoch": 12,
</span><span class="line">  "up": [
</span><span class="line">        0,
</span><span class="line">        1],
</span><span class="line">  "acting": [
</span><span class="line">        0,
</span><span class="line">        1],
</span><span class="line">  "info": { "pgid": "0.1",
</span><span class="line">      "last_update": "0'0",
</span><span class="line">      "last_complete": "0'0",
</span><span class="line">      "log_tail": "0'0",
</span><span class="line">      "last_backfill": "MAX",
</span><span class="line">      "purged_snaps": "[]",
</span><span class="line">      "history": { "epoch_created": 1,
</span><span class="line">          "last_epoch_started": 12,
</span><span class="line">          "last_epoch_clean": 12,
</span><span class="line">          "last_epoch_split": 0,
</span><span class="line">          "same_up_since": 9,
</span><span class="line">          "same_interval_since": 9,
</span><span class="line">          "same_primary_since": 5,
</span><span class="line">          "last_scrub": "0'0",
</span><span class="line">          "last_scrub_stamp": "2013-08-20 12:12:37.851559",
</span><span class="line">          "last_deep_scrub": "0'0",
</span><span class="line">          "last_deep_scrub_stamp": "2013-08-20 12:12:37.851559",
</span><span class="line">          "last_clean_scrub_stamp": "0.000000"},
</span><span class="line">      "stats": { "version": "0'0",
</span><span class="line">          "reported_seq": "12",
</span><span class="line">          "reported_epoch": "12",
</span><span class="line">          "state": "active+clean",
</span><span class="line">          "last_fresh": "2013-08-20 12:16:22.709534",
</span><span class="line">          "last_change": "2013-08-20 12:16:22.105099",
</span><span class="line">          "last_active": "2013-08-20 12:16:22.709534",
</span><span class="line">          "last_clean": "2013-08-20 12:16:22.709534",
</span><span class="line">          "last_became_active": "0.000000",
</span><span class="line">          "last_unstale": "2013-08-20 12:16:22.709534",
</span><span class="line">          "mapping_epoch": 5,
</span><span class="line">          "log_start": "0'0",
</span><span class="line">          "ondisk_log_start": "0'0",
</span><span class="line">          "created": 1,
</span><span class="line">          "last_epoch_clean": 12,
</span><span class="line">          "parent": "0.0",
</span><span class="line">          "parent_split_bits": 0,
</span><span class="line">          "last_scrub": "0'0",
</span><span class="line">          "last_scrub_stamp": "2013-08-20 12:12:37.851559",
</span><span class="line">          "last_deep_scrub": "0'0",
</span><span class="line">          "last_deep_scrub_stamp": "2013-08-20 12:12:37.851559",
</span><span class="line">          "last_clean_scrub_stamp": "0.000000",
</span><span class="line">          "log_size": 0,
</span><span class="line">          "ondisk_log_size": 0,
</span><span class="line">          "stats_invalid": "0",
</span><span class="line">          "stat_sum": { "num_bytes": 0,
</span><span class="line">              "num_objects": 0,
</span><span class="line">              "num_object_clones": 0,
</span><span class="line">              "num_object_copies": 0,
</span><span class="line">              "num_objects_missing_on_primary": 0,
</span><span class="line">              "num_objects_degraded": 0,
</span><span class="line">              "num_objects_unfound": 0,
</span><span class="line">              "num_read": 0,
</span><span class="line">              "num_read_kb": 0,
</span><span class="line">              "num_write": 0,
</span><span class="line">              "num_write_kb": 0,
</span><span class="line">              "num_scrub_errors": 0,
</span><span class="line">              "num_shallow_scrub_errors": 0,
</span><span class="line">              "num_deep_scrub_errors": 0,
</span><span class="line">              "num_objects_recovered": 0,
</span><span class="line">              "num_bytes_recovered": 0,
</span><span class="line">              "num_keys_recovered": 0},
</span><span class="line">          "stat_cat_sum": {},
</span><span class="line">          "up": [
</span><span class="line">                0,
</span><span class="line">                1],
</span><span class="line">          "acting": [
</span><span class="line">                0,
</span><span class="line">                1]},
</span><span class="line">      "empty": 1,
</span><span class="line">      "dne": 0,
</span><span class="line">      "incomplete": 0,
</span><span class="line">      "last_epoch_started": 12},
</span><span class="line">  "recovery_state": [
</span><span class="line">        { "name": "Started\/Primary\/Active",
</span><span class="line">          "enter_time": "2013-08-20 12:15:30.102250",
</span><span class="line">          "might_have_unfound": [],
</span><span class="line">          "recovery_progress": { "backfill_target": -1,
</span><span class="line">              "waiting_on_backfill": 0,
</span><span class="line">              "backfill_pos": "0\/\/0\/\/-1",
</span><span class="line">              "backfill_info": { "begin": "0\/\/0\/\/-1",
</span><span class="line">                  "end": "0\/\/0\/\/-1",
</span><span class="line">                  "objects": []},
</span><span class="line">              "peer_backfill_info": { "begin": "0\/\/0\/\/-1",
</span><span class="line">                  "end": "0\/\/0\/\/-1",
</span><span class="line">                  "objects": []},
</span><span class="line">              "backfills_in_flight": [],
</span><span class="line">              "pull_from_peer": [],
</span><span class="line">              "pushing": []},
</span><span class="line">          "scrub": { "scrubber.epoch_start": "0",
</span><span class="line">              "scrubber.active": 0,
</span><span class="line">              "scrubber.block_writes": 0,
</span><span class="line">              "scrubber.finalizing": 0,
</span><span class="line">              "scrubber.waiting_on": 0,
</span><span class="line">              "scrubber.waiting_on_whom": []}},
</span><span class="line">        { "name": "Started",
</span><span class="line">          "enter_time": "2013-08-20 12:14:51.501628"}]}</span></code></pre></td></tr></tbody></table>

### Retrieve an object on the cluster

In this test we create a standard pool (pgnum=8 and repli=2)

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rados mkpool testpool
</span><span class="line">$ wget -q http://ceph.com/docs/master/_static/logo.png
</span><span class="line">$ md5sum logo.png
</span><span class="line">4c7c15e856737efc0d2d71abde3c6b28  logo.png
</span><span class="line">
</span><span class="line">$ rados put -p testpool logo.png logo.png
</span><span class="line">$ ceph osd map testpool logo.png
</span><span class="line">osdmap e14 pool 'testpool' (3) object 'logo.png' -&gt; pg 3.9e17671a (3.2) -&gt; up [2,1] acting [2,1]</span></code></pre></td></tr></tbody></table>

My Ceph logo is on pg 3.2 (main on osd.2 and replica on osd.1)

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ ceph osd tree
</span><span class="line"># id  weight  type name   up/down reweight
</span><span class="line">-1    0.15    root default
</span><span class="line">-2    0.04999     host ceph-01
</span><span class="line">0 0.04999         osd.0   up  1   
</span><span class="line">-3    0.04999     host ceph-02
</span><span class="line">1 0.04999         osd.1   up  1   
</span><span class="line">-4    0.04999     host ceph-03
</span><span class="line">2 0.04999         osd.2   up  1</span></code></pre></td></tr></tbody></table>

And osd.2 is on ceph-03 :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ cd /var/lib/ceph/osd/ceph-2/current/3.2_head/
</span><span class="line">$ ls
</span><span class="line">logo.png__head_9E17671A__3
</span><span class="line">$ md5sum logo.png__head_9E17671A__3
</span><span class="line">4c7c15e856737efc0d2d71abde3c6b28  logo.png__head_9E17671A__3
</span></code></pre></td></tr></tbody></table>

It exactly the same :)

### Import RBD

Same thing, but testing as a block device.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd import logo.png testpool/logo.png 
</span><span class="line">Importing image: 100% complete...done.
</span><span class="line">$ rbd info testpool/logo.png
</span><span class="line">rbd image 'logo.png':
</span><span class="line">  size 3898 bytes in 1 objects
</span><span class="line">  order 22 (4096 KB objects)
</span><span class="line">  block_name_prefix: rb.0.1048.2ae8944a
</span><span class="line">  format: 1</span></code></pre></td></tr></tbody></table>

Only one object.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rados ls -p testpool
</span><span class="line">logo.png
</span><span class="line">rb.0.1048.2ae8944a.000000000000
</span><span class="line">rbd_directory
</span><span class="line">logo.png.rbd
</span><span class="line">$ ceph osd map testpool logo.png.rbd
</span><span class="line">osdmap e14 pool 'testpool' (3) object 'logo.png.rbd' -&gt; pg 3.d592352c (3.4) -&gt; up [0,2] acting [0,2]</span></code></pre></td></tr></tbody></table>

Let’s go.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ cd /var/lib/ceph/osd/ceph-0/current/3.4_head/
</span><span class="line">$ cat logo.png.rbd__head_D592352C__3
</span><span class="line">&lt;&lt;&lt; Rados Block Device Image &gt;&gt;&gt;
</span><span class="line">rb.0.1048.2ae8944aRBD001.005:</span></code></pre></td></tr></tbody></table>

Here we can retrieve the block name prefix of the rbd ‘rb.0.1048.2ae8944a’ :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ ceph osd map testpool rb.0.1048.2ae8944a.000000000000
</span><span class="line">osdmap e14 pool 'testpool' (3) object 'rb.0.1048.2ae8944a.000000000000' -&gt; pg 3.d512078b (3.3) -&gt; up [2,1] acting [2,1]</span></code></pre></td></tr></tbody></table>

On ceph-03 :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ cd /var/lib/ceph/osd/ceph-2/current/3.3_head
</span><span class="line">$ md5sum rb.0.1048.2ae8944a.000000000000__head_D512078B__3
</span><span class="line">4c7c15e856737efc0d2d71abde3c6b28  rb.0.1048.2ae8944a.000000000000__head_D512078B__3</span></code></pre></td></tr></tbody></table>

We retrieve the file unchanged because it is not split :)

### Try RBD snapshot

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
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd snap create testpool/logo.png@snap1
</span><span class="line">$ rbd snap ls testpool/logo.png
</span><span class="line">SNAPID NAME        SIZE 
</span><span class="line">     2 snap1 3898 bytes
</span><span class="line">$ echo "testpool/logo.png" &gt;&gt; /etc/ceph/rbdmap
</span><span class="line">$ service rbdmap reload
</span><span class="line">[ ok ] Starting RBD Mapping: testpool/logo.png.
</span><span class="line">[ ok ] Mounting all filesystems...done.
</span><span class="line">
</span><span class="line">$ dd if=/dev/zero of=/dev/rbd/testpool/logo.png 
</span><span class="line">dd: écriture vers «&nbsp;/dev/rbd/testpool/logo.png&nbsp;»: Aucun espace disponible sur le périphérique
</span><span class="line">8+0 enregistrements lus
</span><span class="line">7+0 enregistrements écrits
</span><span class="line">3584 octets (3,6 kB) copiés, 0,285823 s, 12,5 kB/s
</span><span class="line">
</span><span class="line">$ ceph osd map testpool rb.0.1048.2ae8944a.000000000000
</span><span class="line">osdmap e15 pool 'testpool' (3) object 'rb.0.1048.2ae8944a.000000000000' -&gt; pg 3.d512078b (3.3) -&gt; up [2,1] acting [2,1]</span></code></pre></td></tr></tbody></table>

It’s the same place on ceph-03 :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ cd /var/lib/ceph/osd/ceph-2/current/3.3_head
</span><span class="line">$ md5sum *
</span><span class="line">4c7c15e856737efc0d2d71abde3c6b28  rb.0.1048.2ae8944a.000000000000__2_D512078B__3
</span><span class="line">dd99129a16764a6727d3314b501e9c23  rb.0.1048.2ae8944a.000000000000__head_D512078B__3</span></code></pre></td></tr></tbody></table>

We can notice that file containing _2_ (snap id 2) contain original data. And a new file has been created for the current data : _head_

For next tests, I will try with stripped files, rbd format 2 and snap on pool.
