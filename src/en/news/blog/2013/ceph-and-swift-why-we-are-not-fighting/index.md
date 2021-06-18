---
title: "Ceph and Swift: Why we are not fighting."
date: "2013-12-02"
author: "syndicated"
tags: 
  - "ceph"
---

I have just come back from the OpenStack summit in Hong Kong. As always it was a blast talking to lot of people and listening to presentations or designing the future of the software we all love.

While chatting with different people there was a recurrent question coming up to me: people wanted to know whether _“Ceph is better than Swift”_.

Having been involved in Swift since 2008, way before OpenStack was even an idea, and now as a core developer, my answer is obviously biased.

I can understand when there is a better alternative product and people are moving to it. This is the normal evolution we have in technologies. I remember when, back in the days, at the beginning of Linux, I stubbornly wanted to keep to use the Linux terminal with my Lynx and my tools and avoiding X11 because I didn’t see the merit of it, and now I am happily using Mac OS X ![:)](http://i2.wp.com/techs.enovance.com/wp-includes/images/smilies/simple-smile.png?w=600)

But Ceph and Swift are not actually competing with each other: they are two different technologies, each with a different purpose. There is some feature overlap between both but the two have different use-cases and can actually live happily together in the same deployment.

# Features Comparisons

From a high level perspective the main differences between the two object storage technologies are :

**Ceph**

- Started in 2006
- Written in C++.
- Strongly consistent.
- Block storage.
- Object storage.

**Swift**

- Started in 2008
- Written in Python.
- Eventually consistent.
- Object storage.
- In production on really [large](https://www.youtube.com/watch?feature=player_embedded&v=YxnFUQHIwNs) public clouds.

Ceph is doing a lot of more than just object storage. Using it as an Open Source block storage (a way to provide remote virtual disks) is what people would start to get attracted by. It does this brilliantly since it seems to become a very popular block storage system option for OpenStack deployments and that’s a win for OpenStack and the Open Source community in general.

The reason Ceph can do block storage is because it is being strongly consistent, ensuring that everything you are writing is written on disks before you are sending an OK back to the client. Being written in C++ makes Ceph very optimized for performances and, thanks to the way it’s designed, allows clients talking straight to the storage servers (OSDs).

The shared file system feature is a work in progress not completely ready for production just yet but when it will it should solve a really hard and complex problem that people have been trying to tackle for the last few decades.

Swift, on the other hand, does one thing and does it well. Its only ambition is to do object storage and provide a REST api to access it. It is eventually consistent. This means that when hardware fails (which is inevitable in a cluster) Swift will fall back to providing high availability to the data. Swift’s eventual consistency window is most likely to be seen when reading objects that were overwritten while hardware has failed and when looking at container listings when many objects in that container are created at the same time.

This eventual consistency also allows Swift cluster to be deployed across wide geographic areas. This isn’t just a “replay logs” style replication, but it allows deployers to configure the cluster for synchronous or asynchronous replication into different distinct regions. The Swift proxy servers are aware of which region they are in, and this allows deployers to optimize for throughput or dispersion when new data is written.

Having it in Python is a huge advantage for deployers not just because of the language itself but because it is arguably more approachable with flexible middleware that can plug into the WSGI pipeline. It is also easy to have Swift plug in a whole lot of different auth systems and have all sort of middleware modifying its behavior and integrating specific feature.

Like python, Swift has a philosophy of being “batteries included” you have all sorts of middleware doing different thing making it a credible alternative to S3.

One final advantage for Swift is being proven in production at very large scale, with a lot of different public cloud running it already (like [Rackspace](http://rackspacecloud.com/)/[HP](http://hpcloud.com/)/[Cloudwatt](http://cloudwatt.com/)/[MercadoLibre](http://www.youtube.com/watch?v=9vUCw0t63aY) etc..) and are happy with it.

On the other hand, the way CEPH does object storage is via its rados gateway but while being API agnostic and have a strong S3 emulation API, it’s not as powerful as a full scaled python WSGI system and does not allow modularity. The issue in having it as a gateway is to always have to mimic and follow the Swift API and while the core API is well defined, stable and backward compatible, that doesn’t include all the middleware shipped with Swift.

# Use cases

If you had to choose only one and you had a requirement for block storage you definitely want to go with CEPH. If you had only a object storage use case then I would advise you to go with Swift.

Having said that there are use cases where you want to have both but some organisations don’t want to have to manage two different clusters with different systems. The Radosgw can be good enough for some simple use cases if you want to use it with the S3 API or the Swift API but would not provide you a fully featured object storage system. One other point to take in consideration is that the objects stored from the RadosGW will not be accessible from the block storage system and since they have a difference usage pattern they would have a to be placed (via ceph intelligent modular placement) on a different hardware setup.

At the end of the day, users want to have choices and, thanks to the Red Hat Gluster team, Swift now has a [multi backend system](https://github.com/openstack/swift/commit/5202b0e58613738cc81ec63e7c6da14ce5429526) where you can have a different storage backend system for Swift which effectively would allow to have ceph plugged as object servers.

We are not totally there yet and the Swift and Ceph developers had chats together trying to see how this can plug but, in the end, this would provide choices for the end user with minimal management.

# Conclusion

Don’t think of Swift and Ceph as rivals. Both are great OpenSource projects with a specific set of tasks in mind. The main competition are proprietary software solutions resulting in a vendor lock-in, and both Swift and Ceph, with their strong communities and lively discussions, are great solutions for a vast majority of challenges.

_Thanks to the friends at [Swiftstack](http://swiftstack.com/), [Rackspace](http://rackspacecloud.com/) and [Inktank](http://inktank.com/) (and my colleagues) for reviewing this post._
