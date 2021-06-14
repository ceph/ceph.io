---
title: "Ansible module to create CRUSH hierarchy"
date: "2018-03-15"
author: "admin"
tags: 
  - "planet"
---

![Title](images/ansible-ceph-crush-module.jpg)

First post of the year after a long time with no article, three months… I know it has been a while, I wish I had more time to do more blogging. I have tons of draft articles that never made it through, I need to make up for lost time.

So for this first post, let me introduce an Ansible I wrote for ceph-ansible: **ceph\_crush**.

## [](#I-Rationale "I. Rationale")I. Rationale

ceph-ansible is feature-full, but we lack modules. I’ve long thought that everything that can be done via a simple `command` task in Ansible does not deserve a module. I was wrong.

Day 2 operations, as we call them, refers to consuming and giving access to the storage. In the context of Ceph, this means several things:

- RGW Configuration
    
    - Users
    - Buckets
    - Bucket policies
    - S3 acls
- RBD
    
    - Create/delete/modify RBD images
    - Map them if kRBD
- Mon:
    
    - create pools
    - create user and keys

Of course, all of that can be handled by the main playbook, but people are unlikely going to re-run the entire playbook to do that. What they want is a simple playbook via a simple interface to interact with the cluster. They don’t want to know anything about Ceph and its CLI, this only thing they care about is to finalize the task they were assigned too.

One the idea behind this is to unify the operational experience through a standard interface, which Ansible and language description, YAML.

## [](#II-Ceph-CRUSH-module "II. Ceph CRUSH module")II. Ceph CRUSH module

This module, as its name state, allows you to create CRUSH hierarchy. The creation is done by passing to each host of your inventory a dictionary containing a set of keys where each determines a CRUSH bucket location. Here is an inventory example:

<table><tbody><tr><td class="code"><pre><span class="line">ceph-osd-0 osd_crush_location="{ <span class="string">'root'</span>: <span class="string">'mon-roottt'</span>, <span class="string">'rack'</span>: <span class="string">'mon-rackkkk'</span>, <span class="string">'pod'</span>: <span class="string">'monpod'</span>, <span class="string">'host'</span>: <span class="string">'ceph-osd-0'</span> }"</span><br></pre></td></tr></tbody></table>

The module is configured like this:

<table><tbody><tr><td class="code"><pre><span class="line"><span class="attr">- name:</span> configure crush hierarchy</span><br><span class="line"><span class="attr">  ceph_crush:</span></span><br><span class="line"><span class="attr">    cluster:</span> <span class="string">"<span class="template-variable">{{ cluster }}</span>"</span></span><br><span class="line"><span class="attr">    location:</span> <span class="string">"<span class="template-variable">{{ hostvars[item]['osd_crush_location'] }}</span>"</span></span><br><span class="line"><span class="attr">    containerized:</span> <span class="string">"<span class="template-variable">{{ docker_exec_cmd }}</span>"</span></span><br><span class="line"><span class="attr">  with_items:</span> <span class="string">"<span class="template-variable">{{ groups[osd_group_name] }}</span>"</span></span><br></pre></td></tr></tbody></table>

The resulting CRUSH map will be following:

<table><tbody><tr><td class="code"><pre><span class="line">ID CLASS WEIGHT  TYPE NAME                STATUS REWEIGHT PRI-AFF</span><br><span class="line">-<span class="ruby"><span class="number">5</span>       <span class="number">0</span>.09738 root mon-roottt</span><br><span class="line"></span>-<span class="ruby"><span class="number">4</span>       <span class="number">0</span>.09738     pod monpod</span><br><span class="line"></span>-<span class="ruby"><span class="number">3</span>       <span class="number">0</span>.09738         rack mon-rackkkk</span><br><span class="line"></span>-<span class="ruby"><span class="number">2</span>       <span class="number">0</span>.09738             host ceph-osd-<span class="number">0</span></span></span><br></pre></td></tr></tbody></table>

The module takes care of the ordering for you so that you can declare the keys of `osd_crush_location` in any order. The pre-requisites for the module to successfully run are the following:

- at least two buckets must be declared
- a ‘host’ bucket must be declared

That’s it :).

  

> This module saves us from hundreds of complex Ansible lines. As I said, more modules are coming for daily operations so stay tuned! We are planing on adding this module to Ansible core and we are aiming for 2.6.

Source: Sebastian Han ([Ansible module to create CRUSH hierarchy](https://sebastien-han.fr/blog/2018/03/15/Ansible-module-to-create-CRUSH-hierarchy/))
