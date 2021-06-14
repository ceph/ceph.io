---
title: "Live Demo : OpenStack and Ceph"
date: "2015-07-31"
author: "syndicated"
tags: 
---

![openstack and ceph live demonstration](images/live-demo-openstack-ceph.jpg "openstack and ceph live demonstration")

Hey Guys , with this blog post i would like to share live demonstration screen cast that i have prepared using my openstack and Ceph environment.

# What’s expected from this Demo

- Creating OpenStack glance image stored on Ceph RBD
- Creating OpenStack instance with Ephermal disk on Ceph RBD ( storing instance on Ceph )
- Creating OpenStack Cinder volume on Ceph RBD
    
    - Attaching this volume to OpenStack instance
    - Mounting this volume and generating some load
- OpenStack Instance LIVE MIGRATION across hypervisors

# Environment Details

- OpenStack RDO ( Kilo Release )
    
    - 2 Nodes deployment
        
        - Node1 - Controller + Network + Compute
        - Node2 - Compute
- Ceph ( [Fujitsu Eternus CD10000 Ceph storage appliance](http://www.fujitsu.com/global/products/computing/storage/eternus-cd/) )
    
    - Release : Firefly ( 0.80.7 )
    - 5 node cluster
        
        - Node 1 : Dedicated management node ( ceph admin node )
        - Node 2 , 3 , 4 : Ceph monitor + OSD nodes
        - Node 5 : Ceph OSD node
- OpenStack Glance, Cinder & Nova are configured to use Ceph as a storage backend

# Architecture

![openstack and ceph live demonstration](images/live-demo-openstack-ceph-architecture.png "openstack and ceph live demonstration")

# Demo Time !!!

<iframe src="http://www.youtube.com/embed/rctzxGzQcDs" allowfullscreen></iframe>

# Commands used during demo

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c">## Task 1 : Creating OpenStack glance image and making sure its stored on Ceph RBD</span>
</span><span class="line">
</span><span class="line">openstack image list
</span><span class="line">glance image-create --name<span class="o">=</span><span class="s1">'Fedora-22'</span> --is-public<span class="o">=</span><span class="s1">'true'</span> --disk-format<span class="o">=</span><span class="s1">'raw'</span> --container-format<span class="o">=</span><span class="s1">'bare'</span> &lt; Fedora-Cloud-Base-22-20150521.x86_64.raw
</span><span class="line">openstack image list
</span><span class="line">rbd ls -p glance --id glance
</span><span class="line">
</span><span class="line"><span class="c">## Task 2 : Creating OpenStack instance with Ephermal disk on Ceph RBD</span>
</span><span class="line">
</span><span class="line">openstack network list
</span><span class="line">openstack image list
</span><span class="line">openstack flavor list
</span><span class="line">openstack keypair list
</span><span class="line">openstack server list
</span><span class="line">openstack server create --image &lt;glance_image_id&gt; --flavor <span class="m">2</span> --key-name &lt;keypair_name&gt; --nic net-id<span class="o">=</span>&lt;network_id&gt; &lt;Instance_name&gt;
</span><span class="line">nova floating-ip-pool-list
</span><span class="line">nova add-floating-ip &lt;instance_id&gt; &lt;floating_ip_address&gt;
</span><span class="line">nova list
</span><span class="line">ssh fedora@&lt;floating_ip_address&gt;
</span><span class="line">
</span><span class="line"><span class="c">## Task 3 : Creating OpenStack Cinder volume on Ceph RBD</span>
</span><span class="line">
</span><span class="line">openstack volume create --size <span class="m">10</span> --description <span class="s2">"volume description"</span> --type <span class="s2">"ceph_storage"</span> &lt;volume_name&gt;
</span><span class="line">openstack volume list
</span><span class="line">rbd ls -p cinder --id cinder
</span><span class="line">nova volume-attach  &lt;instance_id&gt; &lt;cinder_volume_id&gt; auto
</span><span class="line">openstack volume list
</span><span class="line">ssh fedora@&lt;floating_ip_address&gt;
</span><span class="line">fdisk -l
</span><span class="line">mkfs.ext4 /dev/vdb
</span><span class="line">mount /dev/vdb /mnt
</span><span class="line">df -h
</span><span class="line">
</span><span class="line"><span class="c">## Task 4 : OpenStack Instance LIVE MIGRATION across hypervisors</span>
</span><span class="line">
</span><span class="line">nova list
</span><span class="line">nova hypervisor-servers &lt;hypervisor_1_name&gt;
</span><span class="line">nova hypervisor-servers &lt;hypervisor_2_name&gt;
</span><span class="line">virsh list
</span><span class="line">ssh node2 virsh list
</span><span class="line">tail -f /var/log/nova-compute.log
</span><span class="line">
</span><span class="line"><span class="c">## On openstack instance generate load</span>
</span><span class="line">uptime
</span><span class="line">date
</span><span class="line">dd <span class="k">if</span><span class="o">=</span>/dev/zero <span class="nv">of</span><span class="o">=</span>file1 <span class="nv">bs</span><span class="o">=</span>1M <span class="nv">count</span><span class="o">=</span><span class="m">9000</span>
</span><span class="line">
</span><span class="line"><span class="c">## From hypervisor initiate live migration</span>
</span><span class="line">
</span><span class="line">nova live-migration &lt;instance_id&gt; &lt;new_hypervisor_name&gt;
</span><span class="line">
</span><span class="line"><span class="c">## Once migration completes, verify instance new location</span>
</span><span class="line">
</span><span class="line">nova list
</span><span class="line">nova hypervisor-servers &lt;hypervisor_1_name&gt;
</span><span class="line">nova hypervisor-servers &lt;hypervisor_2_name&gt;
</span><span class="line">virsh list
</span><span class="line">ssh node2 virsh list
</span></code></pre></td></tr></tbody></table>

> Live migration support for OpenStack instances is one of the showstopper feature of Ceph. That’s why Ceph is the most popular storage backend for OpenStack.
