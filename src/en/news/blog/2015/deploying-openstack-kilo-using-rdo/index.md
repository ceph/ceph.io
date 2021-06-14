---
title: "Deploying OpenStack KILO Using RDO"
date: "2015-07-11"
author: "syndicated"
tags: 
---

![Deploying OpenStack KILO using RDO](images/openstack-kilo-architecture.png "Deploying OpenStack KILO using RDO")

Getting openstack up and running using RDO is fairly straight forward. However many people have asked to deploy openstack with an existing external network. This method should allow any machine on the network to be able to access launched instances via their floating IPs.

## Environment

- CentOS7
- OpenStack RDO KILO
- Vagrant ( Optional )

In this demo , we will use Vagrant to spin up two CentOS7 VM’s node1 and node2. You can also use your other machines or even your physical servers.

## Step 1 - Creating virtual machines for OpenStack deployment

- Get my version of Vagrantfile

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># wget https://gist.githubusercontent.com/ksingh7/85d887b92a448a042ca8/raw/372be2527bad24045b3a1764dee31e91074ecb50/Vagrantfile --output-document=Vagrantfile</span>
</span></code></pre></td></tr></tbody></table>

- Bring up virtual machines using Vagrant

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># vagrant up node1 node2</span>
</span></code></pre></td></tr></tbody></table>

- Once both machines are UP , ssh into them followed by `sudo su -`

## Step 2 - Setting up OpenStack nodes

- On both the nodes disable CentOS7 network manager and update CentOS7 packages

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># systemctl stop NetworkManager;systemctl disable NetworkManager;chkconfig network on;systemctl start network;yum update -y</span>
</span></code></pre></td></tr></tbody></table>

## Step 3 - Setting up RDO

- On **node1** setup RDO repositories and install packstack

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># yum install -y https://rdoproject.org/repos/rdo-release.rpm ; yum install -y openstack-packstack</span>
</span></code></pre></td></tr></tbody></table>

## Step 4 - Modify Packstack answerfile

- Next generate packsack answer file , by keeping some unrelevant options disabled and enabling neutron ML2 plugins.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line">packstack <span class="se">\</span>
</span><span class="line">--provision-demo<span class="o">=</span>n  <span class="se">\</span>
</span><span class="line">--nagios-install<span class="o">=</span>n <span class="se">\</span>
</span><span class="line">--os-swift-install<span class="o">=</span>n <span class="se">\</span>
</span><span class="line">--os-ceilometer-install<span class="o">=</span>n <span class="se">\</span>
</span><span class="line">--os-neutron-ml2-type-drivers<span class="o">=</span>vxlan,flat,vlan <span class="se">\</span>
</span><span class="line">--gen-answer-file<span class="o">=</span>answerfile.cfg
</span></code></pre></td></tr></tbody></table>

- Edit `answerfile.cfg` to add IP addresses of CONTROLLER, COMPUTE, NETWORK, STORAGE and databases.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">CONFIG_CONTROLLER_HOST</span><span class="o">=</span>10.0.1.10
</span><span class="line"><span class="nv">CONFIG_COMPUTE_HOSTS</span><span class="o">=</span>10.0.1.10,10.0.1.11
</span><span class="line"><span class="nv">CONFIG_NETWORK_HOSTS</span><span class="o">=</span>10.0.1.10
</span><span class="line"><span class="nv">CONFIG_STORAGE_HOST</span><span class="o">=</span>10.0.1.10
</span><span class="line"><span class="nv">CONFIG_AMQP_HOST</span><span class="o">=</span>10.0.1.10
</span><span class="line"><span class="nv">CONFIG_MARIADB_HOST</span><span class="o">=</span>10.0.1.10
</span><span class="line"><span class="nv">CONFIG_MONGODB_HOST</span><span class="o">=</span>10.0.1.10
</span></code></pre></td></tr></tbody></table>

- Next edit `answerfile.cfg` to add public and private interface names

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">CONFIG_NOVA_COMPUTE_PRIVIF</span><span class="o">=</span>enp0s9
</span><span class="line"><span class="nv">CONFIG_NOVA_NETWORK_PUBIF</span><span class="o">=</span>enp0s8
</span><span class="line"><span class="nv">CONFIG_NOVA_NETWORK_PRIVIF</span><span class="o">=</span>enp0s9
</span></code></pre></td></tr></tbody></table>

- Since we have multiple nodes to deploy openstack on, lets setup SSH between nodes.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># ssh-keygen</span>
</span><span class="line"><span class="c"># ssh-copy-id root@node1</span>
</span><span class="line"><span class="c"># ssh-copy-id root@node2</span>
</span></code></pre></td></tr></tbody></table>

## Step 5 - Installing OpenStack

- Finally start deploying openstack

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># packstack --answer-file=answerfile.cfg</span>
</span></code></pre></td></tr></tbody></table>

- Once deployment is completed
    
    - Get you openstack username and password from `keystonerc_admin` file `# cat keystonerc_admin`
    - Point your web browser to [http://10.0.1.10/dashboard](http://10.0.1.10/dashboard) and login to openstack dashboard
    - You can also source `keystonerc_admin` file to use openstack CLI

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># source keystonerc_admin</span>
</span><span class="line"><span class="c"># openstack server list</span>
</span></code></pre></td></tr></tbody></table>

## Step 6 - Configure OVS external bridge ( for floating IP )

- Create OVS bridge interface by creating file `/etc/sysconfig/network-scripts/ifcfg-br-ex` with the following contents

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">DEVICE</span><span class="o">=</span>br-ex
</span><span class="line"><span class="nv">DEVICETYPE</span><span class="o">=</span>ovs
</span><span class="line"><span class="nv">TYPE</span><span class="o">=</span>OVSBridge
</span><span class="line"><span class="nv">BOOTPROTO</span><span class="o">=</span>static
</span><span class="line"><span class="nv">IPADDR</span><span class="o">=</span>10.0.1.10   <span class="c"># IP address of enp0s8 interface</span>
</span><span class="line"><span class="nv">NETMASK</span><span class="o">=</span>255.255.255.0
</span><span class="line"><span class="nv">GATEWAY</span><span class="o">=</span>10.0.1.1
</span><span class="line"><span class="nv">DNS1</span><span class="o">=</span>8.8.8.8
</span><span class="line"><span class="nv">ONBOOT</span><span class="o">=</span>yes
</span></code></pre></td></tr></tbody></table>

- Configure enp0s8 for OVS bridging by editing `/etc/sysconfig/network-scripts/ifcfg-enp0s8` and adding the following content

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">DEVICE</span><span class="o">=</span>enp0s8
</span><span class="line"><span class="nv">TYPE</span><span class="o">=</span>OVSPort
</span><span class="line"><span class="nv">DEVICETYPE</span><span class="o">=</span>ovs
</span><span class="line"><span class="nv">OVS_BRIDGE</span><span class="o">=</span>br-ex
</span><span class="line"><span class="nv">ONBOOT</span><span class="o">=</span>yes
</span></code></pre></td></tr></tbody></table>

- Modify neutron plugin to define a logical name for our external physical L2 segment as “extnet”

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># openstack-config --set /etc/neutron/plugins/openvswitch/ovs_neutron_plugin.ini ovs bridge_mappings extnet:br-ex</span>
</span></code></pre></td></tr></tbody></table>

- Restart networking services

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># service network restart</span>
</span><span class="line"><span class="c"># service neutron-openvswitch-agent restart</span>
</span><span class="line"><span class="c"># service neutron-server restart</span>
</span></code></pre></td></tr></tbody></table>

## Step 7 - Create OpenStack networks for Instances

- Create Public ( External ) network

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># neutron net-create public_network --provider:network_type flat --provider:physical_network extnet  --router:external --shared</span>
</span></code></pre></td></tr></tbody></table>

- Create Public ( External ) network subnet

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># neutron subnet-create --name public_subnet --enable_dhcp=False --allocation-pool=start=10.0.1.100,end=10.0.1.110 --gateway=10.0.1.1 public_network 10.0.1.0/24 --dns-nameservers list=true 8.8.8.8 4.2.2.2</span>
</span></code></pre></td></tr></tbody></table>

- Create Private ( Tenent ) network

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># neutron net-create private_network</span>
</span></code></pre></td></tr></tbody></table>

- Create Private ( Tenent ) network subnet

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># neutron subnet-create --name private_subnet private_network 10.15.15.0/24</span>
</span></code></pre></td></tr></tbody></table>

- Create Router

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># neutron router-create router1</span>
</span></code></pre></td></tr></tbody></table>

- Set Router gateway as public network

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># neutron router-gateway-set router1 public_network</span>
</span></code></pre></td></tr></tbody></table>

- Set Router interface as private network subnet

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># neutron router-interface-add router1 private_subnet</span>
</span></code></pre></td></tr></tbody></table>

- At this point you have configured openstack networks and your network topology should look like

![Deploying OpenStack KILO using RDO](images/deploying_openstack_kilo_using_rdo.png "Deploying OpenStack KILO using RDO")

## Step 8 - Launch Instance

- Add a glance image

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># curl http://download.cirros-cloud.net/0.3.4/cirros-0.3.4-x86_64-disk.img | glance image-create --name='cirros image' --is-public=true  --container-format=bare --disk-format=qcow2</span>
</span></code></pre></td></tr></tbody></table>

- From openstack dashboard
    
    - Add key pair `Projects --> Compute --> Access & Security --> Key Pairs --> Import Key Pair`
        
        - Key Pair Name –> **node1\_key**
        - Public Key –> Contents of `# cat /root/.ssh/id_rsa.pub`
    - Create security groups rules for ICMP and SSH `Projects --> Compute --> Access & Security --> security groups --> default --> manage rules` ![Deploying OpenStack KILO using RDO](images/deploying_openstack_kilo_using_rdo_security_groups.png "Deploying OpenStack KILO using RDO")
- Launch Instance
    
    - Get Private\_Network ID using `# openstack network list`
    - Create instance ( replace net-id from network id that got from above ) `# openstack server create --image="cirros image" --flavor=m1.tiny --key-name=node1 --nic net-id="288f9b1f-7453-4132-9dd4-8829a6844d73" Demo_Instance`
    - Check instance status `# openstack server list`

## Step 9 - Accessing Instance

- From openstack dashboard assign floating ip to instance `Projects --> Compute --> Instances --> Actions --> Associate Floating IP`
- Ping this floating ip address from node1 `# ping 10.0.1.101`
- SSH into demo\_instance `# ssh cirros@10.0.1.101` ![Deploying OpenStack KILO using RDO](images/deploying_openstack_kilo_using_rdo_login.png "Deploying OpenStack KILO using RDO")

> Tadaa … you are Done !!! Play around, create several instances and test them against your workloads ;-)
