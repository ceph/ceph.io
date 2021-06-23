---
title: "Melbourne Ceph Day - A recap with videos"
date: "2015-11-18"
author: "timhildred"
tags: 
  - "ceph-days"
  - "melbourne"
  - "mellanox"
  - "sandisk"
  - "troubleshooting"
---

In case you didn’t know, [Ceph Days](http://ceph.com/cephdays/) are a series of regular events in support of the Ceph community that happen at locations around the world from [New York](http://ceph.com/cephdays/nyc/) to [Berlin](http://ceph.com/cephdays/ceph-day-berlin/), and more recently in APAC to [Shanghai](http://ceph.com/cephdays/ceph-day-shanghai/) and [Melbourne](http://ceph.com/cephdays/ceph-day-melbourne/).

The Melbourne edition on November 5th, 2015 was Australia’s first ever Ceph Day. It was hosted at the Clayton campus of sponsor Monash University, about a $60 Uber ride from the city centre. Monash is also home to a part of Australia’s national research cloud: [NeCTAR](https://rcblog.erc.monash.edu.au/), including Ceph-backed storage capacity provided as part of the [Research Data Services](https://www.rds.edu.au/) initiative.

Watch this video to get a feel for the day in about 2 minutes.

https://www.youtube.com/watch?v=vcK6KSA0DN0

The day was sponsored by the usual suspects: Fujitsu, SanDisk, Mellanox, and Red Hat. Monash provided excellent facilities that dwarfed the number of participants: room for 400, ~100 RSVPed yes (that’s pretty good), and somewhere between 50-70 turned up (that’s pretty normal).

The attendees were a mixed bunch ranging from complete neophytes looking to see what the fuss was about, to sysadmins from medium sized companies experimenting with Ceph POCs to large academic institutions with massive production Ceph clusters deployed.

Speakers were heavily weighted towards the vendor side, which maybe to be expected at a community event relatively early in the uptake of Ceph in Australia. That being said, all of the presentations were focused on providing value to the community rather than selling product.

Patrick McGarry, Ceph’s Community Director kicked off with a community state of affairs. His presentation included information about the upcoming expanded Ceph metrics platform, what the Ceph User Committee has been up to (mirror network!), new community infrastructure for a better contributor experience, and Governance: It’s HERE!

https://www.youtube.com/watch?v=joCp3WByV9E

Sandisk’s Vekat Kolli talked about the contributions that he and his team had been making to improve Ceph’s performance on solid state drives (SSDs). In particular, he shared how they’d managed to drastically improve Ceph IOPS on flash drives.

https://www.youtube.com/watch?v=F6vnxfO9x8Y

Red Hat’s Brad Hubbard provided a tactical presentation on how to troubleshoot your Ceph cluster including how to properly diagnose your performance issues, how to tell if your hang is \*really\* a hang, and a massive toolbox you can use on your Ceph cluster.

https://www.youtube.com/watch?v=yZX1oNqrJMk

Suda from Mellanox made it clear that when you reach a certain scale, you can’t solve your storage problems without good networking. One of the key messages from his presentation was that “Ceph will eat up all the bandwidth you give it, and perform better” when you have more.

https://www.youtube.com/watch?v=hNgvk2BCln0

Steve and Blair from Monash laid out how the needs of researchers differ from those of the enterprise, and how they’re using Ceph to meet the needs of researchers from around Australia, and why Ceph is especially useful when solving “4th paradigm” problems.

https://www.youtube.com/watch?v=aZNwQieDpfg

Tohohiko Kimura from Midokura had to put together a Software-Defined-Everything POC using OpenStack and Ceph, as well has his company’s Neutron plugin for software defined networking. Here is how he did it.

https://www.youtube.com/watch?v=3CaDZXdsbwA

At the end of the day all of the presenters gathered on stage to speak together with the audience. They fielded questions on everything from favourite deployment tools (ceph-deploy versus Ansible versus…) to erasure coding considerations (what did Yahoo do?) to the state of Ceph front ends (Romana? Calamari? WHAT?).

https://www.youtube.com/watch?v=Bf5Gs6KeWLI
