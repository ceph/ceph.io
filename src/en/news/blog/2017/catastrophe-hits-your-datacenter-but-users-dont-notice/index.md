---
title: "Catastrophe Hits Your Datacenter – But Users Don't Notice"
date: "2017-02-23"
author: "admin"
tags: 
  - "planet"
---

_Many large, network-dependent organizations are deploying OpenStack together with Red Hat Ceph Storage because they are inherently highly available solutions._

What if you lost your datacenter completely in a catastrophe, but your users hardly noticed?

Sounds like a mirage, but it’s absolutely possible, and major datacenters with high demand for full availability are already accomplishing this.

# Redefining Disaster Recovery

When most companies talk about disaster recovery, they’re referring to backing up their data and how quickly they can restore it if something goes wrong. Their strategy depends on how much downtime their operations can tolerate, balanced against the cost of restoring full function. A business’ tolerance for data loss is codified by the Recovery Point Objective (RPO) and Recovery Time Objective (RTO) targets it set in its data protection plan, specifying how much data can be lost due to downtime, and how quickly service must be restored. High Availability (HA), Disaster Recovery (DR), and Fault Tolerance (FT) are related, but they are not the same thing. Neither are they substitutes for traditional backup.

At the low end are strategies for providing hot-swap spare servers, storage, and other units for restoring data in the event of unit failure. At the high end are fully redundant data centers equipped identically to the primary facility. Going beyond the ordinary are the large financial institutions, telco, and related service providers for whom every second of downtime is incalculably expensive. They simply can’t afford downtime at all. Clearly, they must invest heavily in sophisticated redundancy systems with instantaneous failover.

With all that investment, these high-demand environments can still fail in the wake of a true catastrophe. Major extended storms, massive seismic events, and, unfortunately, the acts of insiders gone rogue are just a few of the events that can completely disable or destroy data centers. This has created a whole new level of disaster requiring a paradigm shift in how true resilience is achieved.

# Redefining Cloud

Datacenter computing is maturing. Even when delivered from a cloud service, applications have always been thought of as monolithic segments of code running on a server in someone’s datacenter, using a storage appliance that is also located in that private cloud.

In today’s OpenStack environment, the application paradigm has shifted completely. New applications are assembled as a collection of microservices that have been containerized along with the resources required to run them. Should a microservice fail, it is discarded and a new one is instantiated to take its place. VMs and containers are routinely replicated and exist on servers located at a variety of datacenters in a variety of locations.

Storage is similarly distributed in clusters that are also replicated and distributed widely throughout the cloud network environment. Removing the intelligence from the storage hardware and running it instead on servers and disks of our choice has given cloud architects new flexibility. The software-defined storage strategy, enabled by solutions like Red Hat Ceph Storage, provides more opportunity for innovation in the design of storage clusters and the geographic distribution of the data stored therein.

Several containerized microservice platforms have emerged to orchestrate the replication and distribution of compute workloads, including Google’s Kubernetes, Mesos, and Docker Swarm. Strong storage capabilities are rapidly becoming the norm in all these platforms.

# Redefining Resilience

The benefit of this paradigm shift to high-demand users is a massive increase in resilience.

Since microservices and stored workloads can be containerized, replicated, and distributed widely, even the loss of an entire datacenter can be tolerated with minimal service impact. All microservice and storage containers from the lost datacenter are restarted elsewhere by the orchestration platform, using replicated images that the underlying smart storage system continuously pre-positioned for this very purpose through a facility like Ceph’s RBD-Mirror or RGW global object clustering. Red Hat Ceph Storage streams changes in your running disk images to your disaster recovery site in real time, enabling your workloads to recover right from where they left off. Ceph can also replicate S3 object buckets to the same site, providing your application with the same data to continue processing.

Capacity planning tends to get in the way of this nirvana. It’s sobering to realize you need to run two datacenters at 50% utilization in order to accommodate the failure of one. Data needs to be replicated to all the locations where the load that uses it will move to. As load moves from the failed datacenter to the surviving ones, a mechanism to shed non-critical load is required to enable greater than 50% utilization at each site, but none of the current container engines provide constraint-based or prioritized scheduling yet, even in the simple real time/batch sense.

Software-defined storage replaces proprietary, expensive appliances with industry standard hardware. The traditional scale-up method of replacing servers with ever more powerful hardware is replaced by a more dynamic scale-out approach, which adds processing power from additional servers on a gradual basis to improve rather than reduce throughput as the storage cluster becomes larger. The result is a far more resilient cloud environment that is far less disruptive to IT and operates at lower cost.

[![from our Austin review of block DR options in Ceph](images/p4oqhbtjohfw_small.png)](https://svbtleusercontent.com/p4oqhbtjohfw.png)  
_The author reviewed a range of [DR architectural options at the OpenStack Summit in Austin](https://f2.svbtle.com/saving-the-galaxy-openstack-dr-with-ceph) with his colleagues Sébastien Han and Sean Cohen._

# Mitigating Risk

Failure is costly, and the costs can be great. A component can fail, a service cannot. Beyond lost operations are possible lapses in regulatory compliance, loss of customer data, and the impact to your company’s reputation in the wake of lost customer confidence.

Many large financial, communications, and other network-dependent organizations are deploying OpenStack together with Red Hat Ceph Storage because they are inherently highly available solutions. Operating with multiple sites to deliver redundant fail-over and nearly continuous operation is the logical next step in this high-stakes game.

Don’t wait for reports that the next hurricane is headed right at you. By then it’s too late.

_Cross-posted to [Information Week](http://www.informationweek.com/partner-perspectives/redhat/catastrophe-hits-your-datacenter---but-users-dont-notice/a/d-id/1328254?)._

Source: Federico Lucifredi ([Catastrophe Hits Your Datacenter – But Users Don't Notice](http://f2.svbtle.com/catastrophe-hits-your-datacenter-but-users-don-t-notice-1))
