---
title: "Ceph@home: the domestication of a wild cephalopod"
image: "/assets/bitmaps/photo-alexandre.png"
tags:
  - information
---

## This special case study was contributed by Alexandre Oliva

Alexandre is a Free Software user, developer and evangelist, board member of FSF Latin America, maintainer of GNU Linux-libre, co-maintainer of GNU libc, GCC and GNU binutils, toolchain engineer at Red Hat Brasil, computing engineer and master in computer science at University of Campinas.

## Free software evangelist uses Ceph in the home
I’ve long looked for a distributed and replicated filesystem to store my data. I’ve also been the sysadmin at the university, in the distributed systems lab, and for some time the entire computing institute. In both positions, I took care of backups and worried about the potential for loss of data due to disk failures and of keeping the network going in the presence of hardware failures.

Over time, I’ve grown fond of redundancy in storage (I’ve long used RAID, and I was an early LVM adopter), but I also had multiple hosts on which I wanted to keep data in sync, and do my job (and have others do theirs) even if one or two of the servers happened to be down.

Unfortunately, keeping data in sync usually required a master to be selected to get changes and then propagate to others, which I was unhappy about because the failure of the master would disrupt clients and probably lose data if a backup server took over; it also put most of the work on a single server, leaving the backup servers mostly idle–a waste of resources.

Alternatively, enabling all hosts to operate on their local copies of the data made things harder to manage: it’s not easy to determine what to push to other hosts if local copies diverge, and it just can’t be done automatically. So, this worked for such stuff as my home directories, but not much else.

Having some background in fault-tolerant distributed systems, I had an idea of what I was looking for to solve this problem, but for years I couldn’t find anything that came even close to offering what I needed. I tried Intermezzo (it wasn’t ready, and it never got ready), I came across GFS even before Red Hat acquired Sistina (it didn’t target commodity PCs as storage servers), so I remained with rsync-synchronized ext-on-lvm-on-raid for a long time.

As soon as I learned about Ceph and what it aimed to do, I knew it had all the components of a solution for the problems I wanted to solve. Given my long history of Free Software involvement and development, it was just obvious to me that, if I intended to drink from this fountain, I had a moral obligation to help build it and stabilize it so that I could use it to keep my files actively replicated and accessible from multiple hosts.

So, nearly 3 years ago, I built my first test cluster and I started storing current and historical backups in Ceph, to test the waters and shake out problems I’d likely run into. Now, almost 3 years later, after a number of cluster rebuilds from scratch, several reconfigurations and a seemingly infinite number of disk failures and (underlying) filesystem losses–I ended up helping stabilize btrfs too :-), I’ve finally finished uploading my entire backup history into the cephfs cluster, and I’m now confident enough to start keeping live data in it.

So, cephfs for replication and ease of management of changes on multiple hosts is my primary use case; I’m just about to make cephfs the primary storage for a lot of my data, some of which is back up from elsewhere, some of which is software development trees, email history, copies of pictures and videos shot with cameras and tablets, downloads of various free software distros and packages, plus “homedir” material (config files, browser data, etc) of my own, my wife’s, and daughter’s.

I’ll probably keep at least one copy outside ceph for some time, and I’ll certainly keep on taking and verifying cluster snapshots regularly, because I’m very often at the bleeding edge, but I’m happy to report that for quite some time the cluster has been rock solid, and I haven’t had disappearing files nor corrupted data or metadata for several releases.

When I started, I also intended to use ceph for the home directories at the distributed systems laboratory at the university. Unfortunately, I left my position of voluntary sysadmin there some time ago, before ceph was ready for that use case. I feel it is ready now, so hopefully whoever succeeded me there will adopt it soon. After all, it makes perfect sense for a university lab devoted to research in fault-tolerant, distributed systems to use a fault-tolerant distributed system to hold its files

Another use case that’s in my personal roadmap, but that I haven’t got to yet, is maintaining a replicated root fs for my home gateway/firewall/mail server, so that any of the hosts connected to the modem can run that VM and take over this role, so that none of my servers needs a special configuration, and the entire home network (on which I depend for my work and my activism) can survive the failure of any one of the servers. Or, should there be a need for such an extreme situation, even a failure of two out of its (currently) three servers!