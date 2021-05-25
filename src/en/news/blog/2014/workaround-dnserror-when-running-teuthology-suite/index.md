---
title: "workaround DNSError when running teuthology-suite"
date: "2014-06-25"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

**Note:** this is only useful for people with access to the Ceph lab.

When running a [Ceph](http://ceph.com/) integration tests using [teuthology](https://github.com/ceph/teuthology/), it may fail because of a DNS resolution problem with:

$ ./virtualenv/bin/teuthology-suite --base ~/software/ceph/ceph-qa-suite \\
   --suite upgrade/firefly-x \\
   --ceph wip-8475 --machine-type plana \\
   --email loic@dachary.org --dry-run
2014-06-27 INFO:urllib3.connectionpool:Starting new HTTP connection (1):
...
requests.exceptions.ConnectionError:
  HTTPConnectionPool(host='gitbuilder.ceph.com', port=80):
  Max retries exceeded with
  url: /kernel-rpm-centos6-x86\_64-basic/ref/testing/sha1
  (Caused by : \[Errno 3\] name does not exist) 

It may be caused by DNS propagation problems and pointing to the ceph.com may work better. If running bind, adding the following in **/etc/bind/named.conf.local** will forward all ceph.com related DNS queries to the primary server (NS1.DREAMHOST.COM i.e. 66.33.206.206), assuming **/etc/resolv.conf** is set to use the local DNS server first:

zone "ceph.com."{
   type forward ;
   forward only ;
  forwarders { 66.33.206.206; } ;
};
zone "ipmi.sepia.ceph.com" {
   type forward;
   forward only;
   forwarders {
      10.214.128.4;
      10.214.128.5;
   };
};
zone "front.sepia.ceph.com" {
   type forward;
   forward only;
   forwarders {
      10.214.128.4;
      10.214.128.5;
   };
};

The **front.sepia.ceph.com** zone will resolve machine names allocated by **teuthology-lock** and used as targets such as:

targets:
  ubuntu@saya001.front.sepia.ceph.com: ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABA ... 8r6pYSxH5b
