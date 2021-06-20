---
title: "OpenStack, Ceph RBD and QoS"
date: "2013-12-22"
author: "shan"
tags: 
---

![](images/openstack-cinder-rate-limiting.jpg "OpenStack, Ceph RBD and QoS")

The Havana cycle introduced a QoS feature on both Cinder and Nova. Quick tour of this excellent implementation.

Originally both QEMU and KVM support rate limitation. This is obviously implemented through libvirt and available as an extra xml flag within the `<disk>` section called `iotune`.

QoS options are:

- `total_bytes_sec`: the total allowed bandwidth for the guest per second
- `read_bytes_sec`: sequential read limitation
- `write_bytes_sec`: sequential write limitation
- `total_iops_sec`: the total allowed IOPS for the guest per second
- `read_iops_sec`: random read limitation
- `write_iops_sec`: random write limitation

This is wonderful that OpenStack implemented such (easy?) feature in both Nova and Cinder. It is also a sign that OpenStack is getting more featured and complete in the existing core projects. Having such facility is extremely useful for several reasons. First of all, not all the storage backends support QoS. For instance, Ceph doesn’t have any built-in QoS feature whatsoever. Moreover, the limitation is directly at the hypervisor layer and your storage solution doesn’t even need to have such feature. Another good point is that from an operator side it is quite nice to be able to offer different levels of service. Operators can now offer different types of volumes based on a certain QoS, customers then, will be charged accordingly.

  

# II. Test it!

First create the QoS in Cinder:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>cinder qos-create high-iops <span class="nv">consumer</span><span class="o">=</span><span class="s2">"front-end"</span> <span class="nv">read_iops_sec</span><span class="o">=</span>2000 <span class="nv">write_iops_sec</span><span class="o">=</span>1000
</span><span class="line">+----------+---------------------------------------------------------+
</span><span class="line">| Property |                       Value                             |
</span><span class="line">+----------+---------------------------------------------------------+
</span><span class="line">| consumer |                     front-end                           |
</span><span class="line">|    id    |        c38d72f8-f4a4-4999-8acd-a17f34b040cb             |
</span><span class="line">|   name   |                high-iops                                |
</span><span class="line">|  specs   | <span class="o">{</span>u<span class="s1">'write_iops_sec'</span>: u<span class="s1">'1000'</span>, u<span class="s1">'read_iops_sec'</span>: u<span class="s1">'2000'</span><span class="o">}</span> |
</span><span class="line">+----------+---------------------------------------------------------+
</span></code></pre></td></tr></tbody></table>

Create a new volume type:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>cinder <span class="nb">type</span>-create high-iops
</span><span class="line">+--------------------------------------+-----------+
</span><span class="line">|                  ID                  | Name      |
</span><span class="line">+--------------------------------------+-----------+
</span><span class="line">| 9c746ca5-eff8-40fe-9a96-1cdef7173bd0 | high-iops |
</span><span class="line">+--------------------------------------+-----------+
</span></code></pre></td></tr></tbody></table>

Then associate the volume type with the QoS:

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>cinder qos-associate c38d72f8-f4a4-4999-8acd-a17f34b040cb 9c746ca5-eff8-40fe-9a96-1cdef7173bd0
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>cinder create --display-name slow --volume-type slow 1
</span><span class="line">+---------------------+--------------------------------------+
</span><span class="line">|       Property      |                Value                 |
</span><span class="line">+---------------------+--------------------------------------+
</span><span class="line">|     attachments     |                  <span class="o">[]</span>                  |
</span><span class="line">|  availability_zone  |                 nova                 |
</span><span class="line">|       bootable      |                <span class="nb">false</span>                 |
</span><span class="line">|      created_at     |      2013-12-02T12:59:33.177875      |
</span><span class="line">| display_description |                 None                 |
</span><span class="line">|     display_name    |                 high-iop             |
</span><span class="line">|          id         | 743549c1-c7a3-4e86-8e99-b51df4cf7cdc |
</span><span class="line">|       metadata      |                  <span class="o">{}</span>                  |
</span><span class="line">|         size        |                  1                   |
</span><span class="line">|     snapshot_id     |                 None                 |
</span><span class="line">|     source_volid    |                 None                 |
</span><span class="line">|        status       |               creating               |
</span><span class="line">|     volume_type     |                 high-iop             |
</span><span class="line">+---------------------+--------------------------------------+
</span></code></pre></td></tr></tbody></table>

Eventually attach the volume to an instance:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>nova volume-attach cirrOS 743549c1-c7a3-4e86-8e99-b51df4cf7cdc /dev/vdc
</span><span class="line">+----------+--------------------------------------+
</span><span class="line">| Property | Value                                |
</span><span class="line">+----------+--------------------------------------+
</span><span class="line">| device   | /dev/vdc                             |
</span><span class="line">| serverId | 7fff1d37-efc4-46b9-8681-3e6b1086c453 |
</span><span class="line">| id       | 743549c1-c7a3-4e86-8e99-b51df4cf7cdc |
</span><span class="line">| volumeId | 743549c1-c7a3-4e86-8e99-b51df4cf7cdc |
</span><span class="line">+----------+--------------------------------------+
</span></code></pre></td></tr></tbody></table>

  

Expected result:

While attaching the device you should see the following xml creation from the nova-volume debug log. Dumping the virsh xml works as well.

```
2013-12-11 14:12:05.874 DEBUG nova.virt.libvirt.config [req-232cf5eb-a79b-42d5-a183-2f4758e8d8eb admin admin] Generated XML <disk type="network" device="disk">
  <driver name="qemu" type="raw" cache="none"/>
  <source protocol="rbd" name="volumes/volume-743549c1-c7a3-4e86-8e99-b51df4cf7cdc">
    <host name="192.168.251.100" port="6790"/>
  </source>
  <auth username="volumes">
    <secret type="ceph" uuid="95c98032-ad65-5db8-f5d3-5bd09cd563ef"/>
  </auth>
  <target bus="virtio" dev="vdc"/>
  <serial>2e589abc-a008-4433-89ae-1bb142b139e3</serial>
  <iotune>
    <read_iops_sec>2000</read_iops_sec>
    <write_iops_sec>1000</write_iops_sec>
  </iotune>
</disk>
```

  

W **Important note: rate-limiting is currently broken in Havana, however the [bug](https://bugs.launchpad.net/cinder/+bug/1259957) has already been reported and a [fix submitted/accepted](https://review.openstack.org/#/c/61531/). This same patch has also already been proposed as a [potential backport](https://review.openstack.org/#/c/63632/) for Havana.**
