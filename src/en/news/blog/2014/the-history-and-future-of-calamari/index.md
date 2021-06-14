---
title: "The History and Future of Calamari"
date: "2014-05-30"
author: "nwl"
tags: 
---

Calamari was started in the summer of 2013 with the goal of creating a Ceph management platform that, while not necessary to run Ceph, would make it easier and more efficient to do so. It’s exciting to see the project [open-sourced](http://ceph.com/?p=5862%20%E2%80%8E) with so many eager to contribute.

The vision for Calamari is to provide 5 core ‘pillars’ of functionality or workflow:

1. Provisioning: to allow an admin to deploy the Ceph software on an operating system.  This function is currently provided by ceph-deploy.
    

2. Configuration: to enable policy and component settings to be applied to a cluster. In particular, allow the admin to define CRUSH maps.
    

3. Monitoring: to ensure that critical events that require user interaction are highlighted and provide the admin with an “at a glance” view of cluster metrics and status. This pillar involves providing clear visualizations of complex data sets.
    

4. Management: to enable ad-hoc changes to a running cluster, typically in response to monitoring information.
    

5. Analytics: to interpret information from the cluster to help suggest actions or even to apply them automatically.
    

The first 1.0 version was developed by Dan Mick, Yan-Fa Li and Noah Watkins, and came out after 4 months of rapid development as part of the first release of Inktank Ceph Enterprise.  It was almost exclusively focused on monitoring. In particular, the goal was to create a simple dashboard that would allow the Ceph admin to see the most important details about the cluster and provide visualizations to aid with debugging issues. John Spray and Gregory Meno joined the team a few months later and version 1.1 shortly followed, bringing several visual and architectural improvements to the dashboard.

For the past 6 months the team has been focused on v1.2, which has brought in the first set of management features around OSD, Pool and Placement Groups as well as a major re-architecture to improve responsiveness and allow a wider set of topology options for where Calamari would sit in a network.

**Lessons Learned**

Along the way, we’ve learned a considerable amount about what works and doesn’t work in managing a Ceph cluster.

_Visualizations_

What we called the “Workbench” view was a first attempt at representing a physical topology in a way that allows sorting and filter by component status. The original implementation was limited to a fixed numbers of OSDs.  We explored alternative ways of showing the info (such as a Google Maps style scan-and-pan or a hexagon-based unit for hosts) but have not yet implemented them due to a lack of resources. Providing visualizations that scale from a few hosts to thousands of hosts is non-trivial and there is much UX best practice that we need to build on.

_Opinions_

While the goal of the analytics pillar was to embed the knowledge of an experienced Ceph admin into Calamari (what I used to call “Kyle Bader in a box”, in reference to DreamHost’s original Ceph admin), we discovered that even trying to provide a simple NOC-friendly dashboard on top of the monitoring functions required opinions to be embedded into the code (e.g., what PG states should be considered cause for concern). More work needs to be done to ensure we have the right data to make opinionated judgements about when the red flag should be waved, and some of this will require changes in Ceph.

_API_

The first version of Calamari retrieved data from the Ceph cluster via Dan’s ceph-rest-api package, which provided a simple map of the CLI to a web-based service, and was also intended to allow the community to develop tools around Ceph (and explicitly to ensure Calamari was not a lock-in).

However, in line with the need for subjective opinion to parse multiple data sources, we realized that to allow people to easily build tools (and to provide a foundation for features like SNMP traps) it was useful to provide a higher-level interpreted API so the analysis happens before the data is transmitted. The Calamari REST API does this to allow the GUI to focus on showing data rather than crunching it. We expect the Calamari REST API to evolve into a superset of the existing monitor API.  This will ensure that both granular and interpreted data is available for people to hook into external monitoring tools, and that community efforts can focus around building and ecosystem around a single API.

**The Future**

Of the remaining pillars, provisioning and configuration were intended to be embedded into Calamari using existing tools like Foreman, Puppet, Salt, and similar tools.  This should be simpler than developing the features natively, but this is clearly not the only possible architecture. I’d love to see a clean interface that allows users to choose their tools but still allows Calamari to drive a coherent, integrated workflow.

I personally believe Analytics is the most interesting area to develop, particularly if a privacy respecting way can be engineered to allow Ceph users to share data with each other. Being able to see what drives fail the most frequently, what settings are optimal for particular workloads, and what hardware has the best performance would provide a wealth of raw data for individual organizations or the broader community (depending on one’s appetite for sharing).  This would allow us to develop the intelligence to automate management tasks in response to system status, pushing Calamari beyond a simple lever-driven management tool into something which further enables Ceph to deliver low-cost storage through operational efficiency.

Finally, the Inktank professional services team has expressed interest in adding a 6th pillar to Calamari, that of Performance Testing i.e embedding the common tools they used to test cluster performance so that Calamari could aggregate and store test results (also for possible sharing).

I look forward to discussing all these options and more at the upcoming developer summit being run to welcome Calamari to the Ceph developer community.

![](http://track.hubspot.com/__ptq.gif?a=265024&k=14&bu=http%3A%2F%2Fwww.inktank.com&r=http%3A%2F%2Fwww.inktank.com%2Fsoftware%2Ffuture-of-calamari%2F&bvt=rss&p=wordpress)
