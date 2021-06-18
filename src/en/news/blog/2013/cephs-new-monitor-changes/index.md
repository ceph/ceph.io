---
title: "Ceph’s New Monitor Changes"
date: "2013-03-07"
author: "joao"
tags: 
---

Back in May 2012, after numerous hours confined to a couple of planes since departing Lisbon, I arrived at Los Angeles to meet most of the folks from Inktank. During my stay I had the chance to meet everybody on the team, attend the company’s launch party and start a major and well deserved rework of some key aspects of the Ceph Monitor. These changes were merged into Ceph for v0.58.

Before getting into details on the changes, let me give some background on how the Monitor works.

### Monitor Architecture

As you may already know, the Monitor is a critical piece in any Ceph cluster: without at least one monitor, the cluster just won’t do anything useful. And by that I mean nothing will happen. Ever.

Think of the monitors as that central piece of the cluster that keeps track of who and where the other pieces of the cluster are and what is happening with them. Through a single monitor, a Client is able to obtain the location of the remaining monitors, where the object storage daemons (OSDs) or the metadata servers (MDS) can be found, or figure out where the data lies; and it is to the monitors that OSDs and MDS’ will report.

The monitor tracks a lot of information essential to the cluster’s operation, much of which is at some point provided by the other components in the system. Some of this information is kept in the form of maps — OSDMap and PGMap, to name a couple –, and each map may have multiple versions. For instance, the OSDMap contains the location of the OSDs, the CRUSH map, and numerous statistics; the PGMap keeps track of PGs and where they are located at any given moment, with different versions providing different insights on the cluster history. So one might want to consider having multiple monitors in the same cluster, not only to guarantee redundancy of this information in case the monitor’s data store suffers a terrible death, but also to guarantee availability if something should happen to the monitor (power or network failure on the monitor’s server or rack, for instance).

However, keeping multiple monitors means that the information must be equally shared by them all. Any potential inconsistencies, may they be lost or corrupted versions, could lead to incorrect cluster behavior or even data-loss. In order to enforce the consistency requirements throughout the monitor cluster, Ceph resorts to Paxos ([http://en.wikipedia.org/wiki/Paxos\_(computer\_science)](http://en.wikipedia.org/wiki/Paxos_(computer_science))), a distributed consensus algorithm. Each time a map is modified, a new version is created and run through a quorum of monitors. When a majority acknowledges the change, and only then, the new version will be considered committed. Throughout the documentation and the mailing list archives one can find numerous reasons to maintain more than one monitor (and an odd numbers at that), but I believe that Mike Lowe described it the best in an email to the list

([http://lists.ceph.com/pipermail/ceph-users-ceph.com/2013-February/000224.html](http://lists.ceph.com/pipermail/ceph-users-ceph.com/2013-February/000224.html)):

_“Think of yourself as a mob boss and the mon is your mob accountant. While you may have all of the account numbers where you have stashed your ill gotten gains only your accountant knows which bank those account numbers belong to. If you or somebody else whacks your sole accountant then your money is gone. Oh, and your accountants may lie to you so best to have an odd number and let the majority rule.”_

### ARCHITECTURAL REWORK

There were three major architectural reworks on the monitor, which I will explain in further detail in the next sections:

- Shifting from the legacy file-based data store onto a Key/Value store;
- Introducing a single Paxos instance instead of an instance per monitor service; and,
- Performing a store-wide sync to catch up with cluster state

### K/V STORE INSTEAD OF THE LEGACY FILE-BASED STORE

Up until v0.58, the monitor’s data store was comprised of a set of files and directories. This approach benefited from the simplicity of inspecting the data store with tools like ‘ls’, ‘cat’, and the likes. However, this simplicity would also enable some creative problem-solving approaches, and every now and then we would get ahold of someone whose monitors would crash and burn because there had been some tampering with monmap versions, for instance. Let me make this clear: black boxing the monitor is not a workaround to avoid this kind of approach — once the users understand that they should not do it, they won’t ever repeat the feat –, but black boxing does provide other benefits that are far more important.

The file-based monitor store has some other drawbacks that cannot be avoided by simply informing the user. For instance, there is no way to atomically change a set of files. This issue is not uncommon in file systems, and several techniques have been developed to work around it, but they are annoying and there are several circumstances when they don’t really work out. Take how the monitor applies a version on its data store: reads V, the latest committed version in the store; creates a new file under foo/V+1 with the new version’s contents; writes V+1 to the latest committed version file. Now say that the store runs out of space when writing the new version’s contents to disk. There is a chance that only part of the contents ever reached disk, and we might end up with a corrupted version. And you say, “but we didn’t mark that version as being the last committed version, so there’s no problem, right?!?”. Well, that is certainly true, to some extent of true. The real story is that, during recovery, the monitor **might** check if there is an uncommitted version in the store, and if so try to run it through Paxos, and in this case the version might be corrupted. So one would say that this is a bug, the store’s fault, and one would certainly be correct: it could be avoided by stashing the version’s crc before we went out to write it out, and we could check if the crc matched the read version before we did anything with it.

Sure, we could have kept on working on the file-based store, adding features as we deemed necessary, and that’s what we probably would have done if we weren’t about to perform a major rework on the monitor. Therefore, instead of focusing on extending the existing file-based store, we decided it was time to move on to a key/value store with all the properties we were looking for, and given that we have already been using one such store in Ceph, we just went ahead and used leveldb ([http://code.google.com/p/leveldb/](http://code.google.com/p/leveldb/)).

In fact, the legacy file-based store acted much like a key/value store when it came to data placement. It was mainly comprised of files holding data, the filename acting as the key, the data acting as the value. Thus, moving to a key/value store didn’t pose much of an ordeal, and it gave us something we were really looking forward to use on the remaining architectural rework of the monitor: transactions, being able to perform multiple modification operations in one single atomic batch.

### PAXOS & MONITOR SERVICES

[![Figure 1](images/2013-03-07_17-57-12-241x220.png "mon_fig1")](http://ceph.com/wp-content/uploads/2013/03/2013-03-07_17-57-12.png)

Figure 1

We have already discussed how the monitor maintains map consistency throughout the cluster by resorting to Paxos, but we didn’t give much detail on it. Without getting into excruciating detail, in fact the monitor can be seen as being divided in 6 services, each responsible to handle one kind of information: authentication, logging, MDS, Monitor, PG and OSD maps. Each of these services are what we call ‘Paxos Services’, given that they pretty much behave as paxos machines, each one maintaining a Paxos instance (see Figure 1). This means that at any given moment, it would be theoretically possible to have 6 parallel modifications going on, granted each one would be of a different type. In reality they are not really parallel, as the monitor only handles one message at a time, but it is possible to keep multiple concurrent Paxos proposals.

Having a Paxos instance per service guarantees that each service will keep track of its own versions, and will be responsible for their maintenance that may differ from service to service, depending on different requirements and criteria. Basically, this approach confers a great deal of autonomy to each service, at the expense of some redundancy by having multiple Paxos instances when just one would be enough. In Figure 1 we roughly depict how each service used perform their read and write operations on the monitor data store. In a nutshell, most modifications would be made through their Paxos instance, while reads would be directly performed by the service. We say most modifications because we would only resort to Paxos when dealing with a new version on the cluster. There were several other modifications that would be done directly on the store, as long as they were considered as not affecting the global Paxos state, such as version trimming (i.e., getting rid of old, unnecessary versions).

Disregarding the conceptual architecture and diving for a moment into the implementation point-of-view, each service also involved quite a bit of effort when accessing its own data, as they were required to some extent to explicitly use the file-based monitor store interface to access their allocated namespace within the file system. Little to no abstraction was provided.

This brings us to our ultimate goal with the architectural rework: use one single Paxos instance across all services, while keeping their autonomy and sandboxing their store accesses to their own namespace using a clean and simple-to-use interface.

### ONE PAXOS TO RULE THEM ALL

[![Figure 2](images/2013-03-07_17-58-59-234x220.png "mon_fig2")](http://ceph.com/wp-content/uploads/2013/03/2013-03-07_17-58-59.png)

Figure 2

Although using a single Paxos instance makes sense, it involved some serious reworking on how the services perceive their world, as well as how Paxos is used within the monitor.

Instead of keeping up with the previous approach of using Paxos solely to run new versions of a specific service through the other monitors in the cluster, we now use it to perform any change whatsoever across the cluster, thus guaranteeing that all the monitors are constantly in sync — and this means trimming too, which is now enforced to happen at the same time across the cluster. Therefore, with the Single Paxos approach we make sure that every write is run through Paxos prior to be applied onto the store, although services can read the store directly (see Figure 2).

This approach posed one major challenge: given that service versions (and by that we mean, for instance, map epochs) were directly associated with the Paxos version, ranging from \[1,n\] in incremental fashion, how would we now deal with this given that we have only a single Paxos instance? Would we end up with gaps in map epochs? Were this a headline, I could easily refer to Betteridge’s law of headlines ([http://en.wikipedia.org/wiki/Betteridge’s\_law\_of\_headlines](http://en.wikipedia.org/wiki/Betteridge's_law_of_headlines)); given it’s not, I will just have to answer No! and explain why.

In dissociating Paxos from the services, the Paxos’ version became analogous to a global version, representing a given proposal’s version instead of a map epoch. The services kept their responsibility of managing their own versions, and are absolutely oblivious to the fact that there is only one single Paxos instance — they really don’t care, they just push their changes up the chain, and propose them to the cluster. The same goes to Paxos. By leveraging the new key/value store’s capability to perform transactions, not only are we able to abstract the services from however Paxos deals with versions, but we are able to abstract Paxos from whatever the services propose, which didn’t happen before — the Paxos/service relation was so tight that a Paxos proposal took the form of set version ‘foo’ with contents ‘bar’ for service ‘baz’.

[![Figure 3](images/2013-03-07_17-59-49-170x220.png "mon_fig3")](http://ceph.com/wp-content/uploads/2013/03/2013-03-07_17-59-49.png)

Figure 3

With the support of transactions however, we can make a service generate a transaction containing the operations it wants to perform on its namespace — which will be properly adjusted to reflect the service’s namespace without the service being aware. The transaction will then be encoded into a byte array (Ceph has all the data structures allowing this to happen effortlessly), and submitted to Paxos. Take Figure 3, where we depict this process. Once the service’s transaction reaches Paxos, a new transaction will be created, reflecting the new Paxos version. In Figure 3 we can see that Paxos will create a new version 42 with the contents of the service’s encoded transaction — Paxos won’t care what the contents really are though; they are meaningless from its point-of-view. Once the proposal is acknowledge by a majority of monitors, each monitor will perform one single transaction comprised of the Paxos transaction’s operations and the service’s transaction’s operations — all of them applied in one single atomic batch.

This approach is also used for pretty much any operation requiring to be applied throughout the cluster in a consistent manner. For instance, while we used to let each service, on each monitor, decide when to trim their versions, we now delegate that decision only to the Leader on the monitor quorum. Periodically, the Leader will assess which versions, either Paxos or service-specific, need to be trimmed, generating a transaction comprised of erase() operations over Paxos versions, alongside with service-specific versions (if any). Similarly to what happens with other modifications, this transaction is proposed through Paxos, which will create a new version containing the encoded proposed transaction, finally applying it throughout the cluster.

One might have noticed that we just stated that trimming versions is also a Paxos proposal that will lead to a new Paxos version. Well, that is by design, and comes as wonderfully useful when recovering drifted monitors.

A monitor is considered as having drifted if it is behind a given number of Paxos versions. If this number is small enough such that its last committed version is within the interval of available versions on the remaining cluster monitors, then the monitor is able to recover without much effort, simply by obtaining the missing Paxos versions and re-applying them on the store — some of these versions can simply add new information to the store, or erase old versions; regardless, the monitor will obtain a consistent state with the remaining cluster.

However, at times there is a chance that the monitor drifted so much that no longer shares any Paxos version with the remaining cluster. At this point, the monitor must perform a store-wide synchronization.

### STORE-WIDE SYNCHRONIZATION

Prior to v0.58, when a Paxos service drifted beyond a given number of versions, a mechanism called slurp would be triggered. In a nutshell, this mechanism consisted of establishing a connection with the quorum Leader and obtain every single version the Leader had, for every service that had drifted. Such approach was adequate to the one-Paxos-per-service architecture, but wouldn’t fare so well on a single Paxos architecture. The reason is simple and follows the behavior of Paxos as it was described in the previous section: Paxos versions no longer represent service versions, and only synchronizing them would certainly lead to a corrupted state, with lots and lots of information missing.

So we got rid of slurp. Instead, we leveraged leveldb’s snapshots and iterators, and we now perform a store-wide sync. This means that once a monitor (hereafter known as Requester) finds out it has drifted beyond salvaging, it will request some other monitor (hereafter known as Provider) to perform a sync. The Provider will then take a snapshot of its store and iterate over it, bundling all the key/values it can find into transactions and sending them to the Requester. The Requester will apply each received transaction and once it receives the last chunk it will be ready to join the cluster.

The great thing about this new mechanism, is that unlike the slurp, the Requester doesn’t really need to synchronize directly from the quorum’s Leader. Instead, it may synchronize from any given monitor in the quorum, and there may be any given number of syncs being performed simultaneously, without overloading the Leader.

### BUT, BUT… IS UPGRADING COMPLEX? IS IT POSSIBLE TO REVERT?

Well… no and kind of.

Sometime around Bobtail, the monitor started recording a Global Version for each version a service proposed through their Paxos instance. After some time running, the monitor be holding a mapping from service-specific Paxos versions to a Global Version, and would then set a flag on its store stating just that: we are now able to map any Paxos version to a global id.

This was slipped into the monitor in order to allow us to upgrade a monitor from the one-Paxos-per-service to the single Paxos architecture. So, basically, as long as one has been running a Bobtail monitor for some time, upgrading to the new monitor should be as simple as restarting it and waiting for the store conversion to finish. This conversion will be triggered automatically, and may take some time if the store is big enough. So, no, upgrading is not complex, granted you are coming from Bobtail; otherwise, you will have to upgrade to Bobtail and take it from there.

If upgrading fails for some reason, we would really appreciate if you’d let us know on the [mailing-list and/or on IRC](http://ceph.com/resources/mailing-list-irc/). In any case, there is no need for despair. Given that during conversion we only perform read operations on the legacy file-based store, and we convert everything into a leveldb sub-directory on the monitor’s data directory, you can easily revert to your original data store simply by running your old monitor. However, if your monitor did not fail, if you successfully upgrade all your monitors and they form a quorum, from that point onward there is no going back (unless you are okay with just reverting to an older state). Furthermore, you should be aware that this upgrade does not allow for mixed monitor clusters, so there is no point in trying to upgrade just part of your monitor cluster: it won’t work as the post-rework code is unable to understand pre-rework way of doing business.

### SUMMARY

Over the past ten months the Ceph Monitor undertook a major rework, from its backend data store moving from a file-based format to a key/value store supporting atomic transactions, to the way versions are created, unifying all services under a single Paxos instance and sandboxing their access to the data store. Such rework allowed us to suppress some limitations of the previous architecture, and to create an architecture that by dissociating Paxos from the monitor services it will allow us to disseminate information throughout the cluster in a seamless way, allowing to simplify how new capabilities can be built around and within the monitor. Future versions of the monitor may for instance include a generic key/value store, such that a user could stash and retrieve information deemed necessary, while benefitting from the distributed and high-availability nature of the monitor. There’s work being developed towards such an implementation, taking advantage of the mechanisms now in place, leveraging Paxos as a conduit of modifications throughout the cluster.

If you would like to know more, feel free to take a look at the commit messages of the patches introducing the whole architectural rework ([single Paxos](https://github.com/ceph/ceph/commit/a5e2dcb33d915dca26558909647e2e56ed1c23f4), [trimming through Paxos](https://github.com/ceph/ceph/commit/86f6a342715e50cbd304e73d38af74ccfcfffbc4), and [store sync](https://github.com/ceph/ceph/commit/cab3411b4a06a8cd9bac3feac49dc423981cc808)), dive into the [source code](https://github.com/ceph/ceph), or chat us up on [the mailing list or IRC](http://ceph.com/resources/mailing-list-irc/)!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/dev-notes/cephs-new-monitor-changes/&bvt=rss&p=wordpress)
