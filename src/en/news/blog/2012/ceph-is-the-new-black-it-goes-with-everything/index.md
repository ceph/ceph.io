---
title: "Ceph is the new black.  It goes with everything!"
date: "2012-10-17"
author: "scuttlemonkey"
tags: 
  - "planet"
---

In my (rather brief) time digging in to Ceph and working with the community, most discussions generally boil down to two questions: _“How does Ceph work?”_ and _“What can I do with Ceph?”_ The first question has garnered a fair amount of attention in our outreach efforts. Ross Turk’s post “[More Than an Object Store](http://ceph.com/community/more-than-an-object-store/ "More Than an Object Store")” does a fantastic job summarizing Ceph’s magic. The second question is what I will address below.

So what _can_ you do with Ceph? For those who like to read the ending first, the answer turns out to be “a blindingly awesome ton.” Thankfully that doesn’t spoil it for the rest of us, because it’s the details that make it fun. In an email discussion of these details, it was Inktank’s chief suit, Bryan Bogensberger, who managed to succinctly summarize many of the available options while still citing examples and supporting data. (How do you like that, a business guy who has a solid handle on the tech. How lucky are we!?) Without immediately overwhelming you with all the supporting details, his list was as follows:

- Enable the Public Cloud
- Enable the Private Cloud
- Support service providers replacing legacy storage
- Act as a replacement for HDFS
- Act as a replacement for enterprise storage
- Serve as a Lustre replacement
- Provide a platform for Application Development

I would actually add one more:

- Act as the basis for loads of academic research, development, and experimentation

The cool part about this is that a number of these categories already have early adopters that took one look at Ceph and decided to dive right in, building amazing things on top of it. The combination of Ceph as open source technology and Inktank’s seasoned enterprise veterans have allowed those responsible for Ceph to engage with two disparate communities at a very deep level. Open source enthusiasts have helped with edge cases, testing, patches, and even active development and support. Additionally, many businesses have provided their own external expertise as we build bridges from Ceph to other technologies, interesting problems to solve, as well as active development contributions. This combination is starting to allow Ceph as a technology to spread like wildfire, challenging many expensive alternatives just as cloud challenged traditional infrastructure.

### Enabling the Public Cloud

[![](images/Cumulus_clouds_in_fair_weather-293x220.jpg "Credit: http://commons.wikimedia.org/wiki/File:Cumulus_clouds_in_fair_weather.jpeg")](http://ceph.com/community/ceph-is-the-new-black-it-goes-with-everything/attachment/cumulus_clouds_in_fair_weather/)

Several service providers are already availing themselves of the insanely low comparative cost per gigabyte that Ceph allows, building object storage products to compete with incumbent offerings. Because of Ceph’s extensible nature, powerful integrations, and ease of management these service providers are finding themselves with a lot of room to grow, sidestepping the inherent limitations of proprietary technologies. Dreamhost is a prime example of this with their new [DreamObjects](http://dreamhost.com/cloud/dreamobjects/) offering. DreamObjects is aimed at being an inexpensive, object-based, cloud storage service that allows users to connect via Amazon S3 and OpenStack Swift compatible APIs. Ceph is giving them the ability to bring this new object store to market quickly, cheaply, and in a way that is extremely easy to scale.

### Enabling the Private Cloud

Over the last few years many businesses have been moving to virtual infrastructure as a way to save both time and money. Unfortunately this trades the problem of managing the sprawl of physical racks for the complexity of maintaining the digital sprawl of your virtual infrastructure. IT managers are always looking for a good way to get the most bang for their buck, as well as scale resources across applications. Ceph is a platform with many capabilities, and not just a simple object store; many IT professionals are finding that it can solve many problems at once, extending its usefulness and their budget.

Inktank is already supporting a few companies who are developing their own cloud projects with a cost effective alternative for reliable, scalable cloud storage. Ceph’s modularity and auto-rebalancing of the cluster through intelligent object storage daemons (OSDs) are especially important in the private cloud. They allow a business to spin nodes up or down based on need without downtime or effects on performance. This goes a long way towards having a truly dynamic infrastructure that is so important in today’s virtualized data center. Additionally, there are a number of different ways you can access a Ceph cluster which allows a massively flexible, and self-service, approach for your application developers. Whether you are taking advantage of one of the native APIs or simply mounting your cluster with CephFS, once the cluster is available, application developers can interface with it in a way that makes the most sense for their individual project. This allows ops people to focus on ops and application developers to focus on building the best software possible.

A great example of what Ceph can do in a private cloud can be seen in [Piston Cloud’s](http://www.pistoncloud.com/) OpenStack product. Piston Cloud has created a tool that auto-configures a whole rack of servers as OpenStack nodes with Ceph providing the block storage. This offering installs in under 10 minutes and allows customers to evaluate all of OpenStack’s services without having to configure several different machines. Piston’s implementation also promises both easy deployment and seamless upgrade from a pilot deployment to a fully supported production environment.

### Support service providers replacing legacy storage

[![](images/BackupLeftAccent-153x220.jpg "Credit: http://www.lynxtechnologies.net/Images/BackupLeftAccent.jpg")](http://ceph.com/community/ceph-is-the-new-black-it-goes-with-everything/attachment/backupleftaccent/)

Many enterprises are long overdue for upgrading their storage needs, due in no small part to the cost associated with doing so via existing technologies. Ceph has a leg up on traditional enterprise storage through being both open source and driven primarily by commodity hardware. Several companies have already come to the conclusion that while reliability and scalability can be enhanced, the real driving force is the long term effects on the bottom line. Ceph is a technology that can grow with a business, through the expert help of someone like Inktank or the internal expertise developed as with any other technology.

### HDFS / Enterprise Storage / Lustre Replacement

Ceph actually originated as an alternative to Lustre that would provide better scalability and performance, and has offered a number of other interesting enhancements as well. One of the interesting parts about Ceph is that it has the ability to maintain multiple metadata server daemons, which makes file system access much more efficient. This particular approach is also what makes it an [ideal replacement for the Hadoop Distributed File System](http://static.usenix.org/publications/login/2010-08/openpdfs/maltzahn.pdf) (HDFS), especially when [compared to HDFS’s single name-node architecture](http://www.itworld.com/big-datahadoop/262612/ceph-extends-storage-open-scalability). Several folks are already experimenting with blending a Ceph back end with a Hadoop front end and we can’t wait to see the results.

In addition to the strictly technical advantages, Ceph’s open source nature and ability to run on commodity hardware also makes it a very attractive offering for Enterprise data storage, especially as it relates to the bottom line. The ability to deploy Ceph as a strictly software solution in an existing infrastructure allows businesses to remove the ongoing cost and difficulty of maintaining a separate appliance-based solution. This allows for many options when it comes to extensibility and flexibility, which are key to the long-term viability of an enterprise environment. The level of data ownership and control available to an integrated solution also mitigates a lot of risk when it comes to future migrations or data access requirements.

### Application development

As mentioned earlier, Ceph is so much [more than just an object store](http://ceph.com/community/more-than-an-object-store/ "More Than an Object Store"): it is a whole platform that can be used in a myriad of different ways. Two of the key ways we see developers engaging with Ceph are through the client library (directly via librados) and via our RADOS gateway (radosgw). Librados gives developers full control over Ceph’s object store via C, C++, Java, Python, Ruby, or PHP and offers the most advanced functionality of the four types of interfaces with RADOS. The massive horizontal scaling and fault tolerance of object stores are ideal for many of the big data operations that businesses are finding problematic from storing and loading virtual machine images to archival of video surveillance. Regardless of what interesting applications people decide to build though, librados gives you the best tools to build them.

The RADOS gateway provides a REST interface compatible with applications written for Swift or Amazon’s S3. This allows developers to take advantage of the Ceph platform without having to rewrite their applications. Developers can immediately realize the advantages offered by Ceph like the financial benefits of commodity hardware or the time savings of self-healing storage devices. Amazon has done a tremendous job of building and proving out the cloud model for application development; now anyone can build their own version of S3 and take advantage of, or improve upon, those benefits.

### Research, development, and experimentation

[![](images/research-293x220.jpg "Credit: http://www.observera.com/images/research.jpg")](http://ceph.com/community/ceph-is-the-new-black-it-goes-with-everything/attachment/research/)

Ceph’s unique characteristics and modular architecture also make it an ideal candidate as the subject of purely academic study. The most obvious research pathway is the “Controlled Replication Under Scalable Hashing” (CRUSH) algorithm. CRUSH can be described as follows:

> “CRUSH works by describing the storage cluster in a hierarchy that reflects its physical organization. For example, let’s say each host has three disks, each rack has 30 hosts, and we have some number of racks. The result is a hierarchy of racks, hosts, and devices.”

The nature of this CRUSH algorithm allows you to pass three things in (the placement group, latest state of the cluster, and a crush map) and it can always calculate the location of your data object. CRUSH is both repeatable and fluid, since the cluster can change and CRUSH will always know how to adapt to the new layout. CRUSH is also fully configurable allowing you to specify things like how many times your data should be replicated and what kind of weighting should be applied. This allows us to ask a few potentially interesting questions, like “to what other types of problems could the CRUSH algorithm be applied?” or “how can we extend or refine the CRUSH algorithm?”

In any good academic study, it is important to have very controlled circumstances (to the extent possible). The modular nature of Ceph allows you to limit the number of variables in the equation by only running the parts of the platform that you require. If your particular case doesn’t require a RESTful interface, for instance, you have the ability to turn off an entire part of the platform (in this case, radosgw). This distinct separation of function allows you to scale out the pieces you need without any unnecessary overhead or interdependency. This is helpful for study and also useful in production environments!

Another application of pure study could be uses and extensions to the object store, RADOS (Reliable, Autonomic, Distributed Object Store). RADOS is comprised of two kinds of components: the monitors (ceph-mon), which keep track of which nodes are in operation at any given time, and the object storage daemons (ceph-osd) themselves. The incredibly cool part about RADOS is that the storage nodes have a certain level of “intelligence” built into them and have the ability to be self-healing, self-managing, and smarter than your average bear. The potential for other applications (or just enhancing this intelligence) is quite vast, especially as it relates to Ceph’s object model. Objects in Ceph have properties (as objects do), but you can also build extensions that give them methods like makeThumbnail() or MD5encrypt(). Tools like this could provide an enterprising developer hours of enjoyment, and we look forward to helping them experiment!

Other avenues of study could incorporate things like cluster power efficiency, multi data center research, plain old optimization tweakery, or many other things that we haven’t even thought of yet. Ceph has provided a veritable “wild west” of opportunities for research, development, and experimentation, and our community has responded in kind with the best creativity and ingenuity an open source project could hope for.

### Conclusion

Now that you have read the details, you can see our skip-to-the-end conclusion of “a blindingly awesome ton” was pretty accurate, even with today’s list. This list grows every day thanks to the creativity of our community. We are all deeply excited to see what fancy new cloud apps, massive data applications, or other incredibly creative new tools might be built on top of Ceph tomorrow! If you have questions, ideas, or requests please feel free to snag us at one of the stops on our rigorous trade show schedule, on irc (irc.oftc.net #ceph), or on Twitter ([@Ceph](http://twitter.com/ceph) or [@Inktank](http://twitter.com/inktank)). We’d love to hear from you.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/ceph-is-the-new-black-it-goes-with-everything/&bvt=rss&p=wordpress)
