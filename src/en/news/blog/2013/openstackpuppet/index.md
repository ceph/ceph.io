---
title: "Openstack+Puppet"
date: "2013-11-26"
author: "dmsimard"
tags: 
  - "ceph"
---

Thanks to the hard work of the puppet-openstack community, Puppet was the preferred method of deployment for Openstack in the latest [Openstack User Survey](http://www.openstack.org/blog/2013/11/openstack-user-survey-october-2013/).

If you’d like to join in on the fun and contribute, read on !    
First things first, a bit of context:

- [Openstack](http://www.openstack.org/) is a modular cloud orchestration platform, self-described as “Open source software for building private and public clouds”.
- [puppet-openstack](https://wiki.openstack.org/wiki/Puppet-openstack) is a Stackforge project that centralizes the development of puppet modules related to Openstack. puppet-openstack is also an actual [module](https://github.com/stackforge/puppet-openstack) allowing the installation and configuration of core Openstack services.
- [Stackforge](http://ci.openstack.org/stackforge.html) is used to host Openstack-related projects so that they can benefit from the same continuous integration infrastructure and review system that the main Openstack projects use such as Nova.

Now that we have the basics out of the way, if you’d like to contribute to Openstack in general, it’s not mandatory to have any programming or networking knowledge. There’s always things like documentation and translation that need manpower.

For contributing to puppet-openstack in particular, however, it is required to be (or become!) familiar with [ruby](https://www.ruby-lang.org/en/), [puppet](http://puppetlabs.com/puppet/what-is-puppet), [puppet-rspec](http://rspec-puppet.com/tutorial/) and of course, Openstack..

The contribution process for puppet-openstack is slightly different than committing code to primary Openstack projects (such as Nova) and I won’t be highlighting them here for the sake of simplicity - this is a topic for another blog post !

_I recently started contributing as part of the new [puppet-ceph](https://github.com/stackforge/puppet-ceph) initiative so this blog post more or less describes what I had to go through to get my first contribution in._

### Okay, sign me up.

If you want to join in on the fun, the basic instructions for signing up are pretty well documented on the Openstack Wiki: [https://wiki.openstack.org/wiki/How\_To\_Contribute](https://wiki.openstack.org/wiki/How_To_Contribute)

In a nutshell:

- Sign up a Launchpad account, this will be used to login to the Gerrit review system used by Openstack continuous integration: [https://launchpad.net/+login](https://launchpad.net/+login)
- Join the Openstack Foundation, this is free and required for contributing to Openstack: [https://www.openstack.org/join/](https://www.openstack.org/join/)
- Agree to the Individual [Contributor’s License Agreement](https://review.openstack.org/#/settings/agreements) (CLA)
- If you’re going to be comitting code on behalf of an organization, you’ll need to have a [Corporate Contributor’s License Agreement](https://wiki.openstack.org/wiki/HowToUpdateCorporateCLA) (CCLA) in addition to the individual CLA.
- Start contributing !

### Getting started

Let’s say I want to develop for puppet-ceph (!), I’ll keep these resources handy:

- **The Launchpad project** for bugs/issues/fixes/feature/backlog documentation and discussion: [https://bugs.launchpad.net/puppet-ceph](https://bugs.launchpad.net/puppet-ceph) (each project has it’s own launchpad project)
- **The developer documentation** will prove useful to prepare your development environment and beyond. For puppet modules, documentation is provided both on the [Openstack Wiki](https://wiki.openstack.org/wiki/Puppet-openstack) and directly in the [README](https://github.com/stackforge/puppet-ceph/blob/master/README.md) files.

#### Clone the project

You’re going to need the puppet module source to work on it, you can either clone it from **Github**:

git clone https://github.com/stackforge/puppet-ceph

or from **Gerrit**:

git clone https://review.openstack.org/stackforge/puppet-ceph

#### Make sure you have ruby, rubygems and bundle installed

First of all, you’ll need **ruby** and **bundle** to manage ruby packages (gems).  
These will be required, especially when the time will come to do spec/integration/lint tests.

If you already have them you can skip this part !

**On Ubuntu**:

apt-get install ruby rubygems ruby-bundler

**On Debian**:

apt-get install ruby rubygems bundler

#### Install development dependencies

With the help of bundle, fetch and install the gem dependencies documented in the Gemfile located at the root of the repository.

bundle install

#### Create your branch and do your stuff

Create a branch with a name relevant to what you’re doing

git checkout -b feature/my\_feature

Now you can do your modifications.  
Don’t forget to add new spec tests or modify existing ones to match the modifications you made to the module.

#### Test your stuff

You’ve added or modified some code, now you want to test it:

**Test for puppet syntax ([puppet-lint](http://puppet-lint.com/))**:

bundle exec rake lint

**Run spec tests ([puppet-rspec](http://rspec-puppet.com/))**

bundle exec rake spec

_If you try to push code that doesn’t pass the tests, jenkins will not let you through - better make sure everything is okay before sending something for review!_

#### Tests are successful ? Add and commit your stuff

git add \[file\] git commit

_Make sure your commit message follows the [right format](https://wiki.openstack.org/wiki/Gerrit_Workflow#Committing_Changes) !_

#### Send your stuff for review

git review

That’s it ! Your code was sent to [gerrit](https://review.openstack.org/#/q/status:open,n,z) for review by the community and the core reviewers !

#### Jenkins or someone -1’d my code. Help !

Maybe you did a typo or something far worse you’d like to fix - this is done by submitting another patch set.

Do the changes you want to do, add the files again but instead of using ‘**git commit**‘, use ‘**git commit —amend**‘.  
This will essentially modify the initial commit.

After amending your commit, send the code back for a new review with ‘**git review**‘ once more.
