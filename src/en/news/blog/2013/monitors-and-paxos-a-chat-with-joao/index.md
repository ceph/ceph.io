---
title: "Monitors and Paxos, a chat with Joao"
date: "2013-09-10"
author: "scuttlemonkey"
tags: 
  - "planet"
---

This is a dialog where Joao Luis, Ceph core developer with an intimate knowledge of the monitor, answers [Loïc Dachary](http://dachary.org/)’s questions who discovers this area of the Ceph code base. Many answers are covered in Joao’s article [Ceph’s New Monitor Changes](http://ceph.com/dev-notes/cephs-new-monitor-changes/) (March 2013), with a different angle.

**Loic:** My line of questions will be from the point of view of a developer who is new to the Ceph monitor code base. And I would like to write unit tests.

**Joao:** : I once proposed we write a couple of unit tests for the paxos mechanism in the monitors. But it is not as straightforward as one would expect.

**Loic:** I’m confused about one thing and if you could explain this first, it would help. My understanding is that the monitors can agree on a given MonMap. Is it correct ?

**Joao:** : We need to make sure all the monitors have the same content throughout the cluster, regardless of what those contents are. In order to work the cluster needs a couple of maps to be kept consistent. Not only the MonMap but also an OSDmap, MDSMap, PGMap and a keyring that should be scattered accross the monitors in order for clients and other daemons to authenticate.

**Loic:** are we trying to store all this information as a single unit ? Or are there paxos and elections on a per map basis ?

**Joao:** : the elections ( although they rely on a modified paxos implementation ) are basically completely distinct from the rest of the paxos mechanism. From the monitor point of view, elections can happen at any time and are only useful for monitors to establish a leader based on a rank. There is one leader and the rest are peons. Let’s put the election aside for a minute. Prior to cuttlefish we used to have a paxos implementation for each paxos service which is responsible for a monitor component which is responsible for a map. The OSDMonitor is a paxos service responsible for the OSDMap. But we could use a single paxos implementation to handle multiple maps because services are supposed to be independant from the paxos and from the algorithm by which they propose their changes. We made sure we use a single paxos instance to propose the changes accross the cluster.

**Loic:** If I understand correctly, the goal of the paxos implementation is that monitors agree on a value. So the value in this case is the whole set of information that is in the monitor ? So the goal is, for instance, when something changes in the MonMap and OSDMap, paxos will be used so these blobs of data including these modifications are spread accross all the monitors. And from the paxos point of view it would be a single value containing all the data, which seems big. What am I missing ?

**Joao:** : you assume the paxos will share all the information with all the monitors, right ?

**Loic:** Yes.

**Joao:** : the monitors have information that are not to be shared. The paxos is used to share any blob of data, regardless of their semantics. It does not care about what is shared. It only cares that there is a blob of data that is assigned a version, that it is proposed to the peons. The peons will either accept or ignore that version and once commited, all monitors will have that blob of data in their storage.

**Loic:** so what is shared is actually the transaction that will change the data but paxos does not know anything about it. It’s just a transaction.

**Joao:** : exactly. The paxos will then apply the transaction to the store without knowing what it is applying.

**Loic:** and it’s possible that this transaction is about modifying the MonMap, but it could be modifying the OSDMap … paxos only helps make sure it is shared.

**Joao:** : exactly. Our paxos is not a pure paxos implementation though.

**Loic:** indeed, in src/mon/paxos.h it states is based on the Paxos algorithm, but varies in a few key ways : “Only a single new value is generated at a time, simplifying the recovery logic.. What does that mean ?

**Joao:** : the recovery logic in our implementation tries to aleviate the burden of recovering multiple versions at the same time. We propose a version, let the peons accept it, then move on to the next version. On ceph, we only provide one value at a time.

**Loic:** what does it mean to propose one value ? A value could be a change in the MonMap ?

**Joao:** : paxos does not really care what service proposes but in the current code base, only one service will propose at a time. One proposal for the OSDMap, one proposal for the MonMap : they are not aggregated. We only propose changes for one kind of component at a time.

**Loic:** another difference is : 2- Nodes track “committed” values, and share them generously (and trustingly).

**Joao:** : Upon consulting ‘git blame’, looks like I’m actually the one who wrote that bit, but have no recollection of doing so — that happens more often that I would be comfortable admitting. ![:-P](http://ceph.com/wp-includes/images/smilies/icon_razz.gif)

It refers to the fact that during recovery a monitor shares any committed value it has and that the other monitors may need to join the quorum, etc. and we will trust that when they say they accepted that value it means they actually wrote it to disk. And also that when they claim a value is committed, it is actually committed to the store.

**Loic:** the last point is the leasing mechanism : 3- A ‘leasing’ mechanism is built-in, allowing nodes to determine when it is safe to “read” their copy of the last committed value.

**Joao:** : you have a leader, proposes a given paxos version. The other monitors commit that version. From that point on it becomes available to be readable by any client from any monitor. However, that version has a time to live. The reading capabilities on a given monitor has a time to live. Let say you have three monitors and you have clients connected to all of them. If one of the monitors loses touch with the other monitors. It is bound to drop out of the quorum ( and it is unable to receive new versions ). The time to live is assigned to a given paxos version : the last\_committed version. There are not multiple leases because it’s all it requires. That lease will have to be refreshed by the leader : if it expires the monitor will assume it lost connection with the rest of the cluster, including the leader.

**Loic:** and it will cease to serve the clients requests ?

**Joao:** : yes, and bootstrap a new election.

**Loic:** the benefit is that when a client is connected to a monitor that lost touch with the quorum, it will keep getting data, but not for too long.

**Joao:** : and I believe we rely on the lease time out to trigger the election. It can also mean that the leader died, which also requires a new election. You can imagine now why latency and clock synchronization is so critical in the monitors. If you have a clock skew it means you will expire either earlier or later. Regardless it will create chaos and randomness and monitors will start calling for elections constantly.

**Loic:** when you say version is it related to the epoch ? The one you see when you ceph -s ?

**Joao:** : maps have epochs and values have versions. They apply to different contexts. We have a paxos mechanism that will propose values ( bunch of modifications bundled in transactions ). They are proposed by the paxos services ( in the code the class names end with Monitor : OSDMonitor, MonMapMonitor … ) : they are responsible for managing a given map or set of information on the cluster. When you propose : it has a paxos version and the paxos keeps track of its version. But that does not mean that it has a one to one relation with the service epoch.

**Loic:** but when something changes in a service ( MonMapMonitor for instance), it translates into a transaction which translates into a paxos value and version x. And when this transaction is committed to the other monitors, it will change the MonMap and therefore change the epoch. You’re saying there is no relationship between epoch and paxos version although whenever a transaction is processed it will change the epoch ?

**Joao:** : let say you have two monitors. A client sends an incremental change to the MonMap and it’s forwarded to the leader. It creates a transaction based on this incremental modification, encodes it into a bufferlist and proposes it to the other monitors with version 10. The other monitors commit that version and both have paxos version 10. Upon commiting they will decode the transaction and apply it to the store. In this transaction ( which is exactly the same on both monitors ) you will have that change to the MonMap, including the new epoch of the map ( let say 2 ). It does not correlate with the paxos version.

**Loic:** Speaking of transactions, a comment at the beginning of Paxos.h is The Paxos will write the value to disk, associating it with its version, but will take a step further: the value shall be decoded, and the operations on that transaction shall be applied during the same transaction that will write the value’s encoded bufferlist to disk What does it mean ?

**Joao:** : We need the paxos version on the monitor to enable the other monitors to recover. When we propose a new value ( that is a transaction encoded into a bufferlist ), we must make sure it is written to disc so that we don’t loose it. The leader sends a transaction to the other monitors that is comprised of : the paxos version ( 10 for instance ), the value and an operation to update the last\_committed version ( 10 if the paxos version is 10 ). Upon committing this version, the monitor will basically create a new transaction by decoding the value and apply it.

**Loic:** I assume this transaction is not applied to the same store as the one used to store the incoming paxos version ?

**Joao:** : We use only one store for the whole monitor. We basically divide the paxos and the services into different namespaces by doing some creative naming of keys. When we accept the value, we write it to the paxos version key. Only upon committing will we decode that value and create a massive transaction that will, at the same time, update the last\_committed version of the paxos and perform the transaction on the service side. We bundle them together because we write it to disc after accepting it, but only after committing will it actually update the last\_committed pointer to that version. And I believe the only thing missing in this call is a whiteboard.

**Loic:** Yes ![:-)](http://ceph.com/wp-includes/images/smilies/icon_smile.gif) Changing the level of detail, it would be useful if you could explain how paxos works, in the context of Ceph.

**Joao:** : Ok. Basically we have a leader : this is the one guy that will propose anything to the cluster. The other monitors in the cluster will just nod and write that value to disk.

**Loic:** Why would a leader propose anything ?

**Joao:** : It’s a change to some service on the monitor. An OSDMap update a MonMap update always happen on the leader.

**Loic:** That means that whenever a do a change thru the command line, it has to talk to the leader ?

**Joao:** : It will communicate to whatever monitor it is connected to. If it is a write operation, it will be forwarded to the leader. And the leader will reply thru the same path.

**Loic:** So the monitor only acts as a proxy but in the end only the leader will do the change.

**Joao:** : Yes, and the monitor will serve reads. This is not a constraint imposed by paxos. Back on track : the service submits a change to be proposed by paxos ( Paxos::begin), the value will be sent to all other monitors in the quorum. Upon receiving this proposal, the monitor will check if it has seen that proposal before. If they did not, they will write that value to disk and send a message to the leader saying they accepted that value. It’s not committed yet, it’s just written to disk. If the leader fails, a copy of that value can be retrieved from any member in the quorum. After receiving accepts from a majority of the monitors, the leader will issue a commit order after committing its own value. And the other monitors can safely say that this paxos version is the latest committed version. A proposal can expire if a majority of monitors do not accept the value, or the leader lost connection … it does not matter. The proposal will be discarded and the client will have to re-submit that change because it was never accepted, so it’s as if it never happened. If the other monitors accepted that version but did not committed, even if the leader fails, on the next round of elections that version will be proposed as an uncommitted value.

**Loic:** It has already been accepted and therefore…

**Joao:** : it will be re-proposed because it is safe to assume it was accepted by a majority’, I should have phrased that as ‘it is safe to assume it was accepted when the monitor was part of a quorum (which in turn is formed by a majority of monitors)’ — in fact, if haven’t got word from the leader to commit, we are unable to tell whether the value was accepted by a majority; we only know that said value was proposed and if it doesn’t get committed we must in turn try to propose it the next time a quorum is formed. I believe that part is mostly covered in the next few interactions, but as such that remark is sort of wrong. ![:-)](http://ceph.com/wp-includes/images/smilies/icon_smile.gif)

**Loic:** What happens if the new majority has a monitor that has not accepted this value ?

**Joao:** : If you assume that you have, in this majority, at least one monitor with this value, it will be the first proposal of the quorum. There is a recovery phase that is issued right after an election and it allows the leader to ask for any uncommitted values existing on the other monitors. So these monitors will share their uncommited values and the leader will repropose them to the cluster. So that they can be re-accepted and finally committed. Does it make sense ?

**Loic:** It makes sense and since a value is accepted only if there is a majority, whatever is the result of the election, the quorum has at least one monitor that contains this accepted value.

**Joao:** : If it do  
es not, it means someone tampered with the cluster. Changing the set of monitors between quorums is the only way to defeat the algorithm. For instance you have three monitors, one is down but the other two are progressing, and one of them fail just before committing a new version. And someone, just to not lose the cluster, restarts the third monitor, injects a new MonMap… It’s not that bad because the client will eventually timeout and resend the change to the new leader.

**Loic:** How do the election happen ?

**Joao:** : They happen pretty much in the same way the proposal do. The monitor will trigger an election ( expired lease, monitor just started … ). It depends on ranks : they determine who will get elected. It’s based on the IP address : the higher the IP the higher the rank”, one should read “the lower the IP:PORT combination the higher the rank”. This means that 192.168.1.1:6789 will have a higher rank than 192.168.1.2:6789, which in turn will have a higher rank than 192.168.1.2:6790 (the first one would have rank 0, being the leader, and the remaining would have rank 1 and 2, respectively, being peons: lower numerical rank values means higher ranks).

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/monitors-and-paxos-a-chat-with-joao/&bvt=rss&p=wordpress)
