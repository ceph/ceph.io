---
title: "Ceph User Survey 2018 results"
date: "2018-07-17"
author: "lmb"
---

To better understand how our current users utilize [Ceph](http://ceph.com/), we conducted a public community survey from May 1st to May 25th 2018. The [Ceph User Survey 2018 Slides](attachments/Ceph-User-Survey-2018-Slides.pdf) contain the graphs from Survey Monkey. We are also making the (only slightly cleaned up) responses available under the [Community Data License Agreement - Sharing, Version 1.0](https://cdla.io/sharing-1-0/) here: [Ceph User Survey 2018 - For Distribution](attachments/Ceph-User-Survey-2018-For-Distribution.ods).

Let’s dive in and discuss the results - if you have further comments or questions, please reach out via our [mailing list](http://lists.ceph.com/listinfo.cgi/ceph-users-ceph.com/)!

# Demography

The quantity of responses was very encouraging and shows a great interest and a diverse, active community - we received **342** completed responses from **52** different countries on **4** continents.

The majority of responses was from the Europe, Middle East, Africa region, closely followed by North America, Asia-Pacific, and finally Latin America.

The organizational background of the survey participants is largely commercial, with a few academic institutions, and personal users. Government adoption - or at least, participation in the survey - has room for growth.

# Key findings

## Why choose Ceph

Two reasons outshine all others: our users want an Open Source solution, and it needs to be scalable. Cost only shows up in third place, suggesting that cost is not the main driver for Open Source adoption, but a welcome benefit.

Alas, only two percent imply they choose Ceph for performance reasons, which is consistent with the latter feedback on where to focus going forward.

## Ceph experience and user satisfaction

Our user base shows significant portion long-term Ceph use: **over 50%** have been using it for more than two years (including 10% with over 5 years). At the same time, a rough fifth of our users is newer than a year, with another quarter between 1 to 2 years.

If we weight this by the deployed capacity (see below), **89%** have been using it for 2+ years, including **21%** for over five years.

This suggests a healthy balance - Ceph is both adopted for the long-term and persists in organizations due to its maturity and capabilities, and long-term clusters keep growing - but we also see healthy number of new deployments.

And how do our users like Ceph? Over **83%** indicated they are _(extremely) satisfied_ with the technology!

## Size of Ceph deployments

### Capacity

The second reason for choosing Ceph noted by respondents is its scalability. This is one of Ceph’s greatest architectural strengths and without equal.

It thus comes as no surprise that Ceph deployments are huge: in total, our survey respondents reported at least **880 Petabytes** of deployed capacity. (With 322 out 342 usable responses, the real world figure is likely much higher.)

With an average of 2.7 PB, over _25%_ of all installs are larger than 1 Petabyte, with **5% even above 10 Petabytes** in raw capacity! With Ceph, these sites are well equipped for further growth.

We also see a percentage of systems using up to 10 TB only; this shows that if you just want to give it a try and familiarize you with the technology, even a single server will do.

The usable capacity is lower, due to the need for either replication or erasure coding to achieve the required levels of durability. Since different types of redundancy can be mixed within a single cluster, there is no simple, direct relation between raw and usable capacity in this survey. This is also indicated by a slightly lower number of responses to this field (309/342).

Still, the 309 respondents supplying this answer estimate they have deployed a total usable capacity of **360 PB** (with a total raw capacity of **862 PB**).

### By node and device count

Echoing the massive scalability of Ceph, there are at least **46200 OSD nodes** in the world (318 of 342 responses).

While the median Ceph cluster consists of 10 nodes, about a third are between 10 to a 100 nodes, and almost 10% of clusters are over 100 nodes.

More than half have more than 50 storage devices; more than a third exceed 100, and more than 5% are beyond a 1000. We had three respondents with more than 10000 OSDs in their cluster. _Wow._

## Ceph versions

Ceph is a very lively project with frequent releases. Our survey shows over **80%** already running the latest stable release (Luminous), which is an outstanding achievement. As expected, we also have a significant portion on the last stable (Jewel, 41%), a few remaining Hammer installs (13%), and a very low number on older releases.

Weighting by total capacity (where this metric was included), these numbers shift: with 68% reporting the use of Luminous, 70% on Jewel, and 38% using Hammer. Larger deployments upgrade more slowly and over longer transition periods, but this is still a very encouraging adoption rate.

These add up to 146% for the unweighted and 200% for the weighted figures, suggesting that many users operate at least two versions in parallel.

We can also see the significant difference caused by the previous approach of alternating between stable and more aggressive releases. This model has been abandoned with the Ceph Mimic version, but the survey closed before the release of Mimic.

## Where do users source Ceph from?

The majority of respondents indicates they are utilizing package builds directly from the Ceph upstream project, followed by those included by their distribution or their Ceph vendor. A few build their own, or even customize the build.

This is a big sign of trust in the quality assurance and release processes of the upstream Ceph project.

### Linux distribution of choice to run Ceph on

The free-of-charge Linux distributions - Ubuntu (65.9%), Debian (8.6%), CentOS (28%), openSUSE (0.34%) - combined make up the largest share of deployments. Red Hat Enterprise Linux is used by 8.9%, and SUSE Linux Enterprise by 2.3%.

If weighted by deployed capacity, Debian rises to 31% and SUSE Linux Enterprise more than doubles to 6.14%. CentOS is stable at 29%, as is Red Hat Enterprise Linux at 8.5%. Ubuntu drops to 36%.

And two users even indicated they are running Ceph on a BSD operating system. Congratulations - we appreciate your efforts!

## Deployed hardware

Our survey respondents listed a very diverse choice of hardware vendors; since Ceph is a Software-Defined-Storage solution capable of running on any stable hardware platform, you can confidently choose the vendor most appropriate for your environment.

Almost everyone (**98.8%**) reported the use of x86-64 hardware.

### Storage devices

Since Ceph is chosen for its scalability and large capacity, it is no surprise that 89% use hard drives, which offer the best cost per capacity still. But a whole two thirds use SSDs, and already one third has deployed NVMe-based storage, to either accelerate the HDD clusters or as pure flash-only deployments.

Weighted by capacity, we see a marked increase (to 98%) of HDD use (as expected for large, cost-efficient archives), and NVMe jumps up to 58% by a factor of two.

### Network bandwidth

Almost three quarters of deployments take advantage of 10 GbE’s wide availability and low cost per port. (This includes 40 GbE setups, which are four aggregated 10 GbE links.)

We still have one third of users that leverage 1 GbE networks - and while this may come as a surprise, in a scale out solution, a thousand 1 GbE ports still deliver significant bandwidth and throughput to the clients.

Yet, around 13% already have deployed the new 25/50/100 GbE options, which combine higher bandwidth with significantly improved latency.

Weighted by capacity, use of 1 GbE drops to 13%, and **adoption of 25/50/100 GbE jumps up to 22%**; use of 25 and 50 GbE in particular more than doubles.

Wrapping up networking, two thirds use a dedicated OSD cluster network, and one third combines the public and private networks.

## OSD feature adoption

### BlueStore and FileStore

One of the major new features introduced with Ceph Luminous is our new improved and default OSD backend BlueStore. Again demonstrating the trust and quality of the Ceph project, more than two thirds of our users have already deployed this!

Of course, such a transition takes some time, and users need to be on Luminous or newer to take advantage - 60% are (also) using FileStore still, which remained fully supported.

Mirroring the installed Ceph versions of larger clusters, weighting this by capacity shows 56% use of BlueStore, and 90% for FileStore.

### Preferred data redundancy modes

95% of our users have deployed replication in their Ceph cluster somewhere. A full 25% are also taking advantage of the improved data density and space utilization and flexible durability of Erasure Coding.

Again weighting by capacity, the percentage of sites reporting use of replication remains unchanged, but Erasure Coding adoption jumps to **52%**; larger deployments clearly wish to take advantage of the lower capacity overhead.

The most common EC profiles are _8+3_ and _4+2_, but the numbers here really reflect the diversity of needs in the durability versus capacity trade-off.

# Use cases

The data collected on use cases for Ceph as a whole and the respective protocol front ends is quite extensive; you are encouraged to look at the data yourself.

At a high level, all forms of _Cloud Native_ deployments - virtualization, public/private cloud use, containerization - are the primary drivers of Ceph use. This becomes even more dominant if weighted by capacity. This reflects Ceph’s early focus on integration with the major platforms (such as OpenStack, Kubernetes/OpenShift, Proxmox).

As a massively scalable, capacity-oriented storage platform, Ceph is also seeing significant (42.9% total, **65%** weighted) adoption as an archive.

Other significant use cases include HPC, Big Data, and Video/CDN.

General use as home directories or HPC is comparatively low still. With the already available and coming improvements to Ceph and CephFS performance, we expect this to be a growth opportunity.

## Protocols

The maturation of features in Ceph’s history is also measurable in the choice of protocols to access a Ceph cluster - 84% utilize block (74% use RBD to boot virtual machines), 44% file, and 42% S3 or Swift, showing that all protocols are relevant and well adopted. A whole 15% has implemented native solutions on top of librados.

These numbers are fairly consistent across the different lifecycle stages of Ceph clusters; however, their might be an indication that S3/Swift and librados are going to see increasing adoption in future solutions that are currently under development.

## Block and interoperability

About 15% indicate they re-export RBD to iSCSI. This indicates either non-Linux clients, too old Linux distributions, or the need to introduce an additional isolation layer between the client and the cluster.

A significant portion (13% of the total) are using the iSCSI re-export to connect to their VMware workload. (Unfortunately, some of the detail here has made it into the _future work_ section below.)

## RadosGW - S3 and Swift

Primarily used for archive and backup, there is also one third reporting “other” uses and a sizable portion for Big Data and Analytics, reflecting diverse use cases.

As for access methods, three quarters (**74%**) opt for the widely adopted S3 API, and one third uses Swift for their object data needs. (The data has a further breakdown of the client libraries reported.)

Most users utilize Ceph’s native RGW authentication, but 30% integrate it with OpenStack Keystone and 15% with an LDAP environment.

Over **90%** indicate they are using a load balancer with RGW, and haproxy and nginx are the top choices.

### RGW multi-site

Over a quarter of our users (26%) indicate they operate more than one site and utilize RGW multi-site federation, with some even reporting more than 5 sites deployed. This allows them to address data locality as well as disaster resilience.

## CephFS

The workloads indicated for CephFS truly are too diverse to pick any clear winner. This is a good sign, since it indicates that CephFS achieves its goal of being a general-purpose, scalable cluster file system.

The vast majority of clients access CephFS natively from Linux systems, with a preference for the in-kernel client over ceph-fuse.

A combined 35% make CephFS available to NFS-based clients, and another 21% connect clients via CIFS/Samba. This is significantly more diverse than the RBD ecosystem.

We also see about 10% building native support for CephFS access into their stack via libcephfs.

# Monitoring and management tools

## Management framework

This section reflects the huge diversity and number of choices available to a Ceph user; however, we can already see the ceph-mgr dashboard (which is part of Ceph upstream) emerging as the most widely named framework. With Luminous, Mimic, and beyond, this is now the consolidated focus of the Ceph community for management.

## Monitoring and dashboard

Grafana is the most popular choice here by far - not just as a customized platform, but it also is the framework commonly used with other metric collectors such as Prometheus.

The wide diversity here shows the challenge for Ceph; users have very diverse monitoring and metric collection needs. Our roadmap will have to prioritize and try to still allow integration with different stacks.

## Deployment frameworks

A large number of users still utilize ceph-deploy, followed by Ansible, Puppet, and Salt. However, Chef and Juju are also still used, and 11% indicate they use something else entirely; the same dilemma previously explained applies.

# Helping our users

We also want to understand how we can better interact with our users. Thus, a section of the survey focuses on the interactions between them and the various communication channels offered by the Ceph community, from documentation to commercial vendors for support.

## Commercial vendors

While around three quarters of the respondents indicated they do not contract support from any commercial vendor, the other quarter does - from smaller companies and individual contractors (that combined make up 7% of this market!), followed by SUSE, Red Hat, and Canonical.

## Where do users turn for help

**Two thirds** of our users indicate they go and read the fabulous manual first, which is great news and validates the effort put into this part of the project. (If you want to have a positive impact in the community, this shows great writers are _at least_ as awesome as developers!)

Another 19% use our public mailing lists, and another 7% turn to their commercial provider first.

# What do users want from Ceph next

A key question for us as a project is understanding what matters to our users, and where we should focus our next efforts. Here, we have two clear votes:

First, **performance**. Echoing the last place on the “why choose Ceph” ranking, users clearly want us to improve Ceph performance.

Second, **ease of use**. As seen in the respective sections, the management, monitoring, and deployment ecosystem around Ceph is very diverse to the point of fragmentation. This is being addressed via the ceph-mgr and dashboard initiatives, as well as the consolidation around deployment and orchestration.  There is a great foundation in Mimic and there will be a major push for Nautilus.

Our users also continue to value **scalability**. For large deployments, the first and second priorities become especially critical.

And as Ceph adoption grows, **interoperability** - both between different Ceph versions but also non-native clients - becomes crucial.

We also received a huge quantity of feedback in text form. We are very grateful for this and will take your suggestions to heart!

# Errata and future surveys

As this was our first ever survey, we also learned many lessons on how to further improve our questionnaire. These limitations are important to understand and keep in mind when interpreting the results; we hope to address them in future iterations of our survey.

## Selection bias

This survey was mostly advertised via social media, the Ceph project channels and mailing lists, and via some outreach by vendors. This certainly introduces a selection bias; we are clearly skewed towards the more active and community-oriented Ceph members.

## Data quality issues

In some cases, our questions weren’t clear enough.

The VMware access method responses (an active use case for 13% of our respondents) unfortunately seems to have conflated the currently used with desired modes. We will have to dig a bit deeper into this data, and clarify this in the future.

In other places, we have unfortunately not provided the full list of options - for RGW federated multi-sites, users could indicate _N/A_, _2_, _3_, _4_, and _more than 5_ only, and not _5 or more_ as intended.

Some questions should have been multiple choice or rankings instead of single choice.

Some fields should have been numeric instead of free text - a shout-out to the respondent answering “fuckton” to the number of nodes they have, which is not a SI unit we are familiar with. Also, this invited people to give ranges (“40-100”) instead of picking the exact answer.

There were some obvious inconsistencies - e.g., 200 OSD nodes on average for 2 to 5 clusters, but a total capacity of 12 terabytes.

While it was possible to clean this up manually (for ranges, we’ve picked the mid-point; if someone answered “10+”, we choose the lowest fitting integer), which is good enough for our goals. In some cases, we had to discard the specific answer due to an obvious inconsistency but without knowing which interpretation was intended.

### Singular versus Plural

In some cases, we asked about multiple cluster deployments, and in others, about single cluster instances. This was not optimal and should be clarified in future surveys - preferably by having a section that repeats for each cluster, but we need to be mindful of not overloading the survey length.

## Facts, not reasons

We also don’t always have answers as to why people responded in certain ways or made certain choices. Please be mindful of this when interpreting the data.

## Asking questions to humans that should be answered programmatically

We should also not have to ask users questions that a given Ceph instance knows the answers to, or that can be inferred automatically - us humans are notoriously bad at remembering details and transcribing them correctly, especially in long and tedious forms.

Ceph Mimic has gained the first (and, of course, opt-in) support for reporting such telemetry data; building on this will improve the accuracy and sample size of future research.

# In conclusion

We would like to thank every respondent to our first Ceph Community survey again. With your help and insights, we will be able to make Ceph even better and more successful. We hope to hear from you again in our future surveys!

Until then, we would be delighted if you would share and join the conversation on our mailing lists, on social media, or an upcoming conference or Ceph Day.

What are your conclusions and thoughts?
