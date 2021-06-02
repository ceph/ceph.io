---
title: "Deploying Ceph with ComodIT"
date: "2013-02-14"
author: "scuttlemonkey"
tags: 
---

At this year’s [Cloud Expo Europe](http://www.cloudexpoeurope.com/) I had a nice chat with the guys from ComodIT who are making some interesting deployment and orchestration tools. They were kind enough to include their work in a blog post earlier this week and give me permission to replicate it here for your consumption.

As always, if any of you have interesting things that you have done with Ceph we always want to hear about it. Feel free to send a link to [@Ceph](http://twitter.com/ceph) or email it to our [Community](mailto:community@inktank.com) alias. Now enjoy this week’s slice of deployment goodness.  

### Effortless deployment and scaling of a Ceph cluster

[![](images/logohorizontalComodit-thicker-16Sep2012-300x80.png "logohorizontalComodit-thicker-16Sep2012")](http://www.comodit.com/)

In this blog post, we explain how to deploy and scale a cluster hosting a distributed object store and file system called Ceph in the Cloud using ComodIT’s orchestration possibilities. Orchestration was already illustrated in a previous post with a web cluster hosting a WordPress blog. We successfully tested the deployment of Ceph cluster on Amazon EC2 and Openstack, however it should be possible to use any platform supported by ComodIT (Eucalyptus, Rackspace, etc.) or even deploy the cluster on a bare-metal infrastructure.

scuttlemonkey: I followed the install guide below and have a few notes that may help others in their testing. Keep in mind that this demo was put together as a proof-of-concept, and not a robust deployment script. ComodIT plans on improving the script over time, but I think this shows a nice bit of early functionality for evaluation.

The ceph orchestration scripts are available in the [ComodIT repository](https://github.com/comodit).

If you have other orchestration use cases, we’d be happy to help you out. Contact us and let’s discuss it.

### Ceph clusters

A typical Ceph cluster is composed of several instances of each of these services:

- monitors (MONs) which manage the cluster,
- meta-data services (MDSs) which manage the file system namespace,
- object storage services (OSDs) which actually store the data.

In particular, OSDs should be particularly numerous to obtain a large storage. Multiple MONs and MDSs allow to achieve scalability and reliability. Finally, data are replicated among OSDs for reliability.

A Ceph cluster can be scaled in 2 ways:

- increase the number of MONs,
- increase the number of OSDs.

scuttlemonkey: three really, because you can scale (or exclude, if you aren’t using CephFS) the MDSs independently. In this example ComodIT is deploying MON/MDS together though. Also keep in mind CephFS is still a little rough around the edges for a production deployment.

### Requirements

1. A ComodIT account with a valid platform and distribution (you won’t be able to deploy this example on the demo platform provided by ComodIT).
2. the ComodIT Python library (bundled with command-line interface, see [this tutorial](http://www.comodit.com/resources/tutorials/cli.html) for information about how to install it).

scuttlemonkey: it’s also worth noting here that while I deployed from an Ubuntu machine with minimal effort, the ComodIT guys default to CentOS 6.3 for most of their stuff (that’s the image you’ll need to use for your distribution later on as well) so it might be best to use that for testing.

### Deployment

1. Clone the demos public repository and enter Ceph cluster’s folder:
    
     git clone https://github.com/comodit/demos.git
     cd demos/ceph-cluster
    
2. Create a config.py file with the following content:
    
    scuttlemonkey: I noticed that there was a config.py.sample here, so I just did a ‘cp config.py.sample config.py’ and edited the values required.
    
     endpoint = "https://my.comodit.com/api"
    
     username = "<user>"
     password = "<password>"
     organization = "<org\_name>"
    
     time\_out = 60 \* 30  # seconds
    
     admin\_key = "AQAEKwlRgBqsDhAA7cwN/JtEyCym6vYN/ixHqA=="
    
     platform = {"name" : "<plat\_name>",
                 "settings" : { ... }
                }
    
     distribution = {"name" : "<dist\_name>",
                     "settings" : { ... }
                    }
    
    where <user> and <password> are your ComodIT credentials, <org\_name> the name of your organization, <plat\_name> the name of a platform in your organization and <dist\_name> the name of a distribution in your organization. You should also fill the settings for both platform and distribution.
    
    scuttlemonkey: Platform and Distribution are things you define in your ComodIT web GUI. For the purposes of this demo I would suggest creating and using an ‘ec2′ paltform and just using ComodIT’s ‘Default Distribution’ (a CentOS image with the user data stuff already configured).
    
    For instance, you may use an Amazon EC2 platform and store’s CentOS 6.3 AMI. In this case, platform settings look like:
    
     "settings" : {
                  "ec2.instanceType": "t1.micro",
                  "ec2.securityGroups": "default",
                  "ec2.zone": "eu-west-1a",
                  "ec2.keyPair": "<key name>"
                  }
    
    scuttlemonkey: I chose to leave ec2.zone blank in this case as Amazon was pitching a fit about us-east-1a at the time I was testing this.
    
    where <key name> is a key pair name and distribution takes no setting:
    
     "settings" : {}
    
3. Setup your ComodIT account i.e. create all required applications and create an environment that will contain cluster’s hosts:
    
    ./setup.py
    
4. Actually deploy the cluster:
    
    ./deploy.py
    
    A simple Ceph cluster composed of 1 MON, 1 MDS and 2 OSDs hosted by 3 hosts is deployed: the MON and the MDS are hosted by the same host, the OSDs have their own host. Of course, this is not an architecture to use in production, you should always have several MONs. The complete deployment takes a few minutes on Amazon EC2.
    

scuttlemonkey: it’s worth noting here that if you have an error, or need to ^C out to fix or tweak something, you’ll want to run the ./teardown.py script to reset the stored variables on mon/osd number. If you don’t it may just sit there waiting for a machine to deploy that never will (this is an early prototype afterall).

6. Deployment script prints the public address of what we call the master node i.e. the computer hosting the monitor and MDS. You can connect to this host using SSH and check cluster’s health using the following command (executed as super-user or root):
    
    ceph -s
    
    See [Ceph’s documentation](http://ceph.com/docs/master/rados/operations/monitoring/#checking-a-cluster-s-status) for more details.
    

scuttlemonkey: In case you are used to using Ubuntu hosts like I am you’ll need to use ‘ec2-user’ and whatever key pair you specified at ComodIT setup for logging in to your CentOS box.

### Scaling up (OSDs)

Add an OSD to deployed cluster:

./scale\_osds.py -c 1

\-c option is the number of OSDs to add.

scuttlemonkey: in my case, the ‘-c 1′ portion was causing the script to choke (perhaps some issue w/ arg parsing from Cent vs Ubuntu?). I didn’t really poke around to find out, the ./scale\_osds.py script defaults to 1 so I just ran it without args and it worked fine.

### Scaling up (MONs)

Add a monitor to deployed cluster:

./scale\_mons.py -c 1

\-c option is the number of monitors to add.

scuttlemonkey: it’s worth noting here that the best setup for a Ceph cluster is to have an odd number of mons for quorum. I mentioned this to the ComodIT guys and they will add a warning in upcoming versions of their deployment. For now it’s up to you to remember (although it will work just fine with an even number for the purposes of seeing it deploy).

### Shutting down cluster

You can delete all hosts created during deployment and scaling operations:

./teardown.py

If you also want to clean-up your organization i.e. delete the applications and environment created by setup script:

./cleanup.py

scuttlemonkey: There you have it, another easy way to deploy a Ceph cluster for testing or prototyping. It’s always great to see folks fitting Ceph into their own workflows and environments. Hope to see lots more projects that showcase Ceph! Thanks to the ComodIT guys, especially Gérard (bottom-left below), for putting this demo together and sharing it with all of us.

[![](images/teamComodIT-11Sep2012-292x220.png "teamComodIT-11Sep2012")](http://ceph.com/wp-content/uploads/2013/02/teamComodIT-11Sep2012.png)

scuttlemonkey out.  
——————–

_REPOSTED FROM:_ [http://www.comodit.com/2013/02/12/effortless-deployment-of-a-ceph-cluster/](http://www.comodit.com/2013/02/12/effortless-deployment-of-a-ceph-cluster/)

