---
title: "Ceph early adopter: Université de Nantes"
date: "2013-07-16"
author: "scuttlemonkey"
tags: 
---

In case you missed Loic’s account of a recent visit to the Université de Nantes, we are replicating his blog here. It’s always great to see the community adopting Ceph and doing great things with it, even if they are doing it without [Inktank support](http://www.inktank.com/support-services/). Read on for a great look at a Ceph early adopter.

> The [Université de Nantes](http://www.univ-nantes.fr/english/) started using Ceph for backups early 2012, before the Bobtail was released or Inktank founded. The IRTS department, under the lead of Yann Dupont, created a twelve nodes Ceph cluster to store backups. It contains the data generated by 35,000 students and 4,500 employees totaling 100 millions inodes and 25TB of data (out of 40TB). The hardware is spread accross three geographical locations ( Loire, Chantrerie and Lombarderie ) and Ceph is configured to keep working transparently even when one of them is down. The backup pool has two replicas and the crushmap states that each must be stored in a different geographical location. For instance, when Lombarderie is unreachable, which happened this week because of a planned power outage combined with an unplanned UPS failure, Ceph keeps serving the objects from the replicas located in Loire and Chantrerie.
> 
> Although three Dell R720xd were recently added to the Ceph cluster, with SSD disks to store the journals, most of it re-uses existing hardware. The sites are however connected with black fibers ensuring a stable low latency ( i.e. 0.44ms RTT between two Ceph nodes that are 13KM appart ).
> 
> [![](images/loic1-293x220.png "Dell R720xd 12 SATA disks and two SSD")](http://ceph.com/wp-content/uploads/2013/07/loic1.png)
> 
> Being an early adopter is challenging and with a small team there is little room for error : the Ceph maintenance work must not overweight the benefits and cannot take precedence over the constant flow of user requests for more pressing matters such as ensuring the availability of the online courses material or caring for the needs of the human resources department handling employees spread over 20 geographical locations.
> 
> Three Ceph clusters co-exist on the same hardware : one of them is dedicated to backups and running Cuttlefish 0.61.4, another running the latest development release 0.65 to experiment with [Owncloud](http://owncloud.org/) ( one of many experimental projects ) and the last being prepared for [OpenStack](http://openstack.org/) block storage. Experiments with various combinations of the linux kernel and file systems ( and a few bug reports back in 2012 ) found linux-3.2 and XFS to be a stable combination. The Ceph cluster dedicated to backups has been used and upgraded from Bobtail to [Cuttlefish](http://ceph.com/releases/v0-61-cuttlefish-released/) without data loss or downtime over the past year. The more experimental clusters are maintained with a precedence that is lower than the other tasks. Running them helps define what the next stable installation will be. For instance one of the new Dell 720xd is running linux-3.10 and it will show if the kernel virtual memory deadlock that sometimes occur with any linux > 3.2 under heavy recovery has been fixed.
> 
> Erasure encoding, which is my day job, was also discussed although it would only save 25% of the disk space in the current use case. As more geographical locations are added ( one more is planned in a year from now ) it will become more appealing. The current challenges are mostly to find time to properly diagnose the bugs and report them to the linux kernel, XFS or Ceph. The fun parts are to watch Ceph working working even when a geographical location becomes unavailable and to upload a file to Owncloud, knowing it is stored in an experimental version of Cephfs.
> 
> ## The Université de Nantes
> 
> Nantes is a beautiful town in Britanny where many universities and schools are located. Yann Dupont is the head of the IRTS department (which is part of DSIN, Direction des Systèmes d’Information et du Numérique de l’Université de Nantes), in charge of IT for all of them, and even some in towns nearby ( St Nazaire … ). He works with Jacky Carimalo, Yoann Juet, Damiano Albani, Thomas Boudard, Arnaud Abélard, Benjamin Mazinghien [and others](http://www.univ-nantes.fr/90082/0/fiche___defaultstructureksup/) to provide storage, development, system administration, security, monitoring, etc. but the desktops are handled by another department. The infrastructure is used by 35,000 students every year, spread on twenty sites, and 4,500 employees. They provide a wide range of services, from backups to delivering online courses.
> 
> In France most universities are state funded and nobody has to worry about saving money to get a proper education. As a consequence, they are on a tight budget and getting new hardware is not easy : if machines were bought a few years ago they cannot be replaced before the end of their planned lifetime. The Université de Nantes has however permission to operate black fibers that were installed by the city back in 1992.
> 
> ## Architecture
> 
> Three machine rooms ( Lombarderie, Loire and Chantrerie ) are linked with a black fiber and connected at 10Gp/s with Alcatel Lucent equipment. A black fiber is dedicated to storage and could provide much more bandwidth. But the required network equipments are too expensive for now ( although there are plans to add another 10GB in 2014 ). The distance and round trip time between the three sites are as follows:
> 
> Loire > Lombarderie (4 Km) : 0.275ms RTT
> Loire > Chantrerie (13 Km) : 0.440ms RTT
> Lombarderie > Chantrerie (10,5 Km) : 0.335ms RTT
> 
> The RTT not only accounts for the time it takes for the bytes to go thru the fiber, it also includes the equipments within the machine room. For instance the time added by the equipements internal to Lombarderie is 0.19ms.
> 
> [![](images/loic2-164x220.png "OmniSwitch 9700")](http://ceph.com/wp-content/uploads/2013/07/loic2.png)
> 
> The MON and the MDS are not hosted on dedicated hardware. They are running in LXC containers together with other LXC containers unrelated to Ceph. There is one MON and one MDS on each site and for each cluster.
> 
> Four physical machines are dedicated to OSDs on each site. With the notable exception of the three recently added Dell R720xd, all nodes share the same configuration. A Dell M610 blade with 40GB of RAM is connected to a fiber channel transtec SAN dedicated to it containing 16 x 2TB disks and has two internal SAS disks used for Ceph journals. The Dell R720xd has two RAID0 SSD dedicated to the Ceph journals, 12 3TB SATA disks and 64GB of RAM. All machines have two 10GB ports but only one of them is connected and is used for all purposes.
> 
> [![](images/loic3-165x220.png "Blade attached to a SAN")](http://ceph.com/wp-content/uploads/2013/07/loic3.png)
> 
> In each machines, the physical disks are grouped using RAID5 to minimize the probability of a failure. For instance 12 disks are divided in 3 RAID5 disks, each containing 4 disks. The operating system only sees three disks. This is redundant with the service provided by Ceph and if new hardware had to be bought it would be recommended to not purchase a RAID5 controller to reduce the cost. However, the hardware is already available and using RAID5 reduces the probability of a Ceph failure. If Ceph or the underlying components are to fail, chances are they will do so while recovering from an OSD failure. By taking advantage of the existing RAID5, the odds of this event happening are reduced. It can save a few hours of work over a year.
> 
> The operating system is Debian Wheezy, running a 3.2 linux kernel with XFS and the Ceph packages are from the repositories provided by Inktank. The OSDs are run in LXC containers : one per disk ( i.e. RAID5 group of disk really ) for a given Ceph cluster.
> 
>      machine
>  +--------------------------------------------------+
>  |   disk one ( 4 physical disks RAID5 )            |
>  | +----------------------------------------------+ |
>  | | +------------LXC-+ +--------------LXC-+      | |
>  | | | OSD     1      | | OSD    1         |  ... | |
>  | | | cluster backup | | cluster owncloud |      | |
>  | | +----------------+ +------------------+      | |
>  | +----------------------------------------------+ |
>  |   disk two ( 4 physical disks RAID5 )            |
>  | +----------------------------------------------+ |
>  | | +------------LXC-+ +--------------LXC-+      | |
>  | | | OSD     2      | | OSD    2         |  ... | |
>  | | | cluster backup | | cluster owncloud |      | |
>  | | +----------------+ +------------------+      | |
>  | +----------------------------------------------+ |
>  |           ....                                   |
>  +----------------------------- 10GB ether ---------+
> 
> For the backup cluster, the crushmap shows three datacenter ( Lombarderie, Chantrerie and Loire ) each containing a room. The racks really are the physical machines and the nodes are the LXC containers and each LXC contains a single OSD.
> 
> datacenter lombarderie {
> ...
> 	item lombarderie-ltc weight 22.500
> }
> 
> room lombarderie-ltc {
> ...
> 	item kavalan weight 9.000
> 	item braeval weight 4.500
> 	item inchmurrin weight 9.000
> }
> 
> node inchmurrin {
> ...
> 	item ceph-osd-lmb-A-4-1.u107 weight 3.000
> 	item ceph-osd-lmb-A-4-2.u107 weight 3.000
> 	item ceph-osd-lmb-A-4-3.u107 weight 3.000
> }
> 
> lxc ceph-osd-lmb-A-4-1.u107 {
> ...
> 	item osd.38 weight 3.000
> }
> 
> The Ceph version installed in the backup cluster LXC is Cuttlefish 0.61.4 and the Ceph version installed in the owncloud cluster is 0.65.
> 
> When a LXC container located outside of the Ceph cluster wants to access the Ceph cluster, it cannot do it entirely within the container because the kernel RBD module does not yet support network kernel namespaces. Instead it is installed and used on the host and defined as an LXC mount point.
> 
> ## Replicas and Erasure Coding
> 
> The current setup is using a pool size of two for backups with a crush rule imposing that the copies are never co-located on the same datacenter.
> 
> rule rbd {
> ...
> 	step chooseleaf firstn 0 type datacenter
> ...
> }
> 
> Because Ceph uses replicas, 1TB usable requires 2TB of physical storage. If erasure coding was used instead of replicas, 1TB usable would only require 1.5TB of physical storage. If one of the three sites go down, the other two must hold at least 50% of the information required to rebuild, that is 0.5TB on each site, hence 1.5TB total. For instance if using reed-solomon with 2 data chunks + 1 parity chunks and a crush map that ensure that each site stores 1 chunks out of 3, 1TB is coded as 1.5TB saving 25%. When more sites are added the savings increase.
> 
> ## Bug hunting
> 
> More often than not, when a bug such as XFS corruption is found, it is diagnosed and reported upstream. The most recent is related to kernels 3.4 slower due to allocation workqueue when used with XFS.

This blog was replicated from [Loic Dachary’s blog](http://dachary.org/?p=2087). If you have an article that you would like featured on Ceph.com please feel free to email our [community team](mailto:community@inktank.com). We love original content, technical features, or replicating content as you saw here.

scuttlemonkey out

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/ceph-early-adopter-universite-de-nantes/&bvt=rss&p=wordpress)
