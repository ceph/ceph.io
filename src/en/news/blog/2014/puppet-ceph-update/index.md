---
title: "puppet-ceph update"
date: "2014-06-28"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

End of last year, a new [puppet-ceph module](https://github.com/ceph/puppet-ceph/) was bootstrapped with the ambitious goal to re-unite the dozens of individual efforts. I’m very happy with what we’ve accomplished. We are [making progress](https://github.com/ceph/puppet-ceph/graphs/commit-activity) although [our community is mixed](https://github.com/ceph/puppet-ceph/graphs/contributors), but more importantly, we do things differently.  
  
In my humble opinion (and the [core reviewers of puppet-ceph](https://launchpad.net/~puppet-ceph-bugs/+members#active) will certainly have a different view on this), this is what makes puppet-ceph special:

- **Strict policy on integration tests.**
    
    More than half the time I spend on puppet-ceph is about figuring out how to use and write integration tests. Although unit tests are well supported in the puppet world, integration tests are new. We first tried [rspec-system](https://gitorious.org/rspec-system/rspec-system/) which we had to fork because it was abandoned. We also [write and maintain a tool](https://gitorious.org/gerritexec/) to run these tests because there is no standard way to do this from gerrit. After a few months of observation (mostly checking that it was not going to be abandoned ![;-)](http://dachary.org/wp-includes/images/smilies/icon_wink.gif) we are planning to translate [our tests](https://github.com/ceph/puppet-ceph/tree/master/spec/system) to [beaker](https://github.com/puppetlabs/beaker) using docker ( mimicing the [elasticsearch example instructions](https://github.com/elasticsearch/puppet-elasticsearch/commit/229f9c9e529bf74dce93bfdce5861a93273f6cb7)). The primary reason is that relying on an obsoleted tool is not sustainable. The secondary reason is that vagrant based tests require a dedicated hardware ( today we re-installed the machine which is hosted graciously by Free Software Foundation France and [tetaneutral.net](http://tetaneutral.net/)) while docker can use an [OpenStack](http://openstack.org/) virtual machine which root file system is supported by [Ceph](http://ceph.com/) and **/var/lib/docker** is on a LVM attached volume [attached to the same hardware as the instance for I/O efficiency](http://dachary.org/?p=2518).
    
- **Leverage the OpenStack development workflow.**
    
    All [changes go to gerrit](https://review.openstack.org/#/q/project:stackforge/puppet-ceph,n,z) and must be reviewed by two core reviewers before they are merged into [master](https://github.com/stackforge/puppet-ceph). Only then is it mirrored to the repository in the Ceph namespace ( https://github.com/ceph/puppet-ceph/ ). Such a policy is fit for large projects but imposes long delays on small projects because the core reviewers are less available. David Gurtner recently joined the core reviewer team and it helps a lot but the blocking factor for most changes is still the availability of the reviewers. Although it would be tempting to resolve this by relaxing the rules and allow a single reviewer to approve a change, the side effect would be that less core reviewer know about the code. As it stands, the rhythm of the project is more or less in sync with the understanding of each core reviewer. If we were tempted to speed things up, some of us would be lost.
    
- **Amicable to part time developers.**
    
    None of the core reviewer is appointed by his employer to work on puppet-ceph. I may be unable to even look a pool request during weeks because my work requires all my attention. When I come back to puppet-ceph, I fetch the latest changes, run the integration tests locally and read what they do while they run. This tells me what happens since I left. Not in terms of code that may or may not work but in terms of code that proves it does what is expected. Within an hour I’m back into the project and able to contribute again. Of course I’ve lost my touch and I do stupid mistakes : most of them are caught by the integration tests and, ultimately, by the other core reviewers. This is a development pattern that is common to numerous Free Software projects and it plays a big role in the fact that I’m happy to return to them. Without integration tests developers are either extremely dedicated and 100% focused on the project at all times or constantly facing the frustration of recurring regressions.
    
- **Slow and steady**
    
    Numerous puppet ceph modules exist and most of them have burst of activities, depending on who needs what. They go faster than puppet-ceph. But all of them, without exception, are cursed with constant regressions, because they have no integration tests. The author of the last commit probably manually tested a use case for which there is no trace. Someone trying to figure it out has no clue. puppet-ceph does little but does not regress. It is tested on Centos and Ubuntu, for the Ceph releases Dumpling, Emperor and Firefly. If I was to deploy puppet-ceph with a use case that is more or less similar to what I can read in the integration tests, I would be confident that it works. They are both examples and proof that it works.
    
    There are a few other aspects of puppet-ceph that I like although they are not as prominent. It is a real world training ground for new Free Software contributors: dozens of them made their first contribution and learn the tools and social dynamics within puppet-ceph. It is challenging and noisy at times but also refreshing and I’m hopeful that in a few years from now these students will become outstanding citizens of the Free Software community. It supports multiple usage patterns (writing manifests the usual way, [scenario based deployment](https://github.com/bodepd/scenario_node_terminus), pure hiera), some of which I discovered when they were introduced.
    

Last but not least, despite the difficulties that anyone would expect when trying to walk a new path, everyone has been very agreeable and accommodating. It has been a pleasure working on puppet-ceph and I hope to continue for as long as I can ![:-)](http://dachary.org/wp-includes/images/smilies/icon_smile.gif)
