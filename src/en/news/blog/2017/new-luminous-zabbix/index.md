---
title: "New in Luminous: Zabbix"
date: "2017-10-23"
author: "widodh"
tags: 
  - "ceph"
  - "ceph-mgr"
  - "luminous"
  - "zabbix"
---

The Ceph manager service (ceph-mgr) was introduced in the Kraken release, and in Luminous it has been extended with a number of new python modules. One of these is a module exporting overall cluster status and performance to [Zabbix](https://zabbix.com/).

### Enabling the dashboard module

The Zabbix module is included in the ceph-mgr package, so if you’ve upgraded to Luminous then you already have it! Enabling the Zabbix module is done with a single command:

>   $ ceph mgr module enable zabbix

### Configuring the module

The module needs just a small amount of configuration to work:

- Hostname of Zabbix server
- Identifier for Ceph cluster in Zabbix

These can be set as config-key options inside Ceph:

> $ ceph zabbix config-set zabbix\_host zabbix-server.local
> $ ceph zabbix config-set identifier ceph.local

### Zabbix template

In the [source directory](https://github.com/ceph/ceph/blob/master/src/pybind/mgr/zabbix/) of the module a [XML template](https://github.com/ceph/ceph/blob/master/src/pybind/mgr/zabbix/zabbix_template.xml) file can be found which can be imported into Zabbix.

Create a host and link the host to the newly created template. Make sure the host has the same name as the identifier configured in the Ceph config-key parameter.

### Commands

The Zabbix modules registers a few commands.  One of these is the ability to immediately send data to Zabbix, and the other simply shows the current configuration:

> $ ceph zabbix config-show
> $ ceph zabbix send

### Using it

After a few minutes, data should start to appear in Zabbix under 'Lastest Data' and graphs will start to populate for the host.

Multiple triggers are pre-configured in the template which will send out notifications if you configure your Actions in Zabbix.

### Learn more

- ceph-mgr [zabbix module documentation](http://docs.ceph.com/docs/master/mgr/zabbix/)
- ceph-mgr [zabbix module source code](https://github.com/ceph/ceph/blob/master/src/pybind/mgr/zabbix/)
