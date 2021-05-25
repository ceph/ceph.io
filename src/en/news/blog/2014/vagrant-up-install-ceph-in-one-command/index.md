---
title: "Vagrant up: install Ceph in one command"
date: "2014-04-30"
author: "shan"
tags: 
  - "planet"
---

![Vagrant up: install Ceph in one command](http://sebastien-han.fr/images/ceph-vagrant-up.jpg)

A simple script to bootstrap a Ceph cluster and start playing with it. The script heavily relies on:

- [Vagrant](http://www.vagrantup.com/)
- [Ceph Ansible](https://github.com/ceph/ceph-ansible)

The final machine will contain:

- 1 Monitor
- 3 OSDs
- 1 MDS
- 1 RADOS Gateway

  

# Let's do it!

Simply execute the following script:

\`\`\`bash

# !/bin/bash

git clone https://github.com/ceph/ceph-ansible.git

cat > Vagrantfile << EOF VAGRANTFILE\_API\_VERSION = "2"

Vagrant.configure(VAGRANTFILE\_API\_VERSION) do |config| config.vm.box = "trusty" config.vm.box\_url = "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-i386-vagrant-disk1.box" config.vm.define :cephaio do |cephaio|

```
cephaio.vm.network :private_network, ip: "192.168.0.2"
cephaio.vm.host_name = "cephaio"
(0..2).each do |d|
  cephaio.vm.provider :virtualbox do |vb|
    vb.customize [ "createhd", "--filename", "disk-#{d}", "--size", "1000" ]
    vb.customize [ "storageattach", :id, "--storagectl", "SATA Controller", "--port", 3+d, "--device", 0, "--type", "hdd", "--medium", "disk-#{d}.vdi" ]
    vb.customize [ "modifyvm", :id, "--memory", "512" ]
  end
end
config.vm.provision "ansible" do |ansible|
  ansible.playbook = "ceph-ansible/site.yml"
  ansible.groups = {
    "mons" => ["cephaio"],
    "osds" => ["cephaio"],
    "mdss" => ["cephaio"],
    "rgws" => ["cephaio"]
  }
  ansible.extra_vars = {
    fsid: "4a158d27-f750-41d5-9e7f-26ce4c9d2d45",
    monitor_secret: "AQAWqilTCDh7CBAAawXt6kyTgLFCxSvJhTEmuw=="
  }
end
```

end end EOF vagrant up \`\`\`

  

> Hope you will like this one :)
