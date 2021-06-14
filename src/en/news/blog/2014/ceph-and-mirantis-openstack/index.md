---
title: "Ceph and Mirantis OpenStack"
date: "2014-01-21"
author: "scuttlemonkey"
---

Last week Dmitry Borodaenko presented his talk on Ceph and OpenStack at the inaugural [Silicon Valley Ceph User Group meeting](http://www.meetup.com/SF-Bay-Area-Ceph-User-group/events/158239642/). The meeting was well attended and also featured talks from Mellanox's Eli Karpilovski and Inktank's Kyle Bader. However, if you were unable to attend, the following transcript from Dmitry's talk is a good recap just in time for the joint Mirantis / Inktank [webcast on Ceph and OpenStack](http://mirantis.hs-sites.com/how-to-stop-worrying-about-storage-openstack-ceph-webcast?utm_campaign=INKW&utm_medium=BLOG&utm_source=INKX).

\[Reposted from [Mirantis.com](http://www.mirantis.com/openstack-portal/external-tutorials/ceph-mirantis-openstack-full-transcript/)\]

> To understand how Ceph works as part of Mirantis OpenStack, we need to take that 20,000-foot view first. You need to know what Ceph is, what OpenStack is, and what you can do with them. And, then, we’ll get into details that actually makes this combination work. So, first we’ll explain how Ceph came about and what it turned out to be.
> 
> ### What is Ceph?
> 
> Defining Ceph is less trivial than you’d think. When I first heard of it, it was called a file system, but actually it’s not quite there yet. On the other hand it’s quite a bit more than that. Ceph is a free clustered storage platform that provides unified object, block, and file storage.
> 
> Somewhere along the way it picked up an object storage backend, which turned out to be more important than its ability to store files. And, on top of that, Ceph has added a block storage layer, which uses also objects as a backend to provide RBD block devices, and that’s the most interesting for OpenStack.
> 
> To reiterate, Ceph consists of:
> 
> - Object storage. RADOS objects support snapshotting, replication, and consistency.
> - Block storage. RBD block devices are thinly provisioned over RADOS objects and can be accessed by QEMU via librbd library, as seen in the following figure.
> 
> [![](images/mirantis1.png "mirantis1")](http://ceph.com/wp-content/uploads/2014/01/mirantis1.png)
> 
> Figure 1 Ceph block storage
> 
> - File storage. CephFS metadata servers (MDS) provide a POSIX-compliant overlay over RADOS.
> 
> Now, let’s talk about OpenStack. Figure 2 outlines a couple of core components, just the ones that are actually relevant to the discussion of what Ceph can do for OpenStack.
> 
> ### What is Mirantis OpenStack?
> 
> OpenStack is an open source cloud computing platform.
> 
> [![](images/mirantis2-300x82.png "mirantis2")](http://ceph.com/wp-content/uploads/2014/01/mirantis2.png)
> 
> Figure 2 OpenStack components relevant to Ceph
> 
> Nova computing provisions VMs, Cinder provide volumes for block devices or volumes for those VMs. Those VMs are based on images taken from Glance. They can store objects in the Swift object storage system, which can also be used as a storage backend for Glance.
> 
> Mirantis OpenStack is basically a set of hardened OpenStack packages wrapped in a nice tooling that allows it to be installed very simply out of the box with a range of different, rather complex configurations, including a configuration where you use Ceph instead of everything else for storage.
> 
> Mirantis provides the Fuel utility to simplify the deployment of OpenStack and Ceph. Fuel uses Cobbler, MCollective, and Puppet to discover nodes, provision OS, and set up OpenStack services, as shown in the following diagram.
> 
> [![](images/mirantis3-300x120.png "mirantis3")](http://ceph.com/wp-content/uploads/2014/01/mirantis3.png)
> 
> Figure 3 Fuel in action
> 
> As you can see, we use Cobbler to provisions nodes, and then we use MCollective and Puppet to discover them and distribute Puppet manifests, and set up OpenStack using those Puppet manifests.
> 
> ### How does Ceph fit into OpenStack?
> 
> RBD drivers for OpenStack make libvirt configure the QEMU interface to librbd.
> 
> So how does Ceph fit into OpenStack? Very simple, that RADOS block device, or in short RBD, a block device layer on top of Ceph object storage has drivers for QEMU. And OpenStack has drivers for RBD, which make libvirt tell QEMU to use RBD backend for all its storage needs. This process is shown in the next figure.
> 
> [![](images/mirantis4-153x220.png "mirantis4")](http://ceph.com/wp-content/uploads/2014/01/mirantis4.png)
> 
> Figure 4 How Ceph fits into OpenStack
> 
> So you get quite a lot. First of all, unlike a basic Cinder, LVM-based backend, Ceph provides multi-node redundancies so that if you lose one storage node, your volumes that were stored on that node do not disappear because they have a replica elsewhere.
> 
> Another nice thing is it allows you to do copy-on-write clones of images and volumes and instances. So, once you got system image, you can move it around and start different VMs based on it without any unnecessary data copy operations, which actually speeds things up and makes your storage usage a bit more efficient.
> 
> And another thing that comes out of all that is that since Ceph allows you to do all sorts of storage, like block storage and object storage and can be a backend for Cinder, Nova, and Glance, that means that all of your storage needs of your OpenStack cloud can be based on the same storage pool. Therefore, the same set of hard drives can be distributed between your needs as necessary, so you don’t have to have dedicated object storage and block storage nodes–it’s all part of the cloud or just generic storage.
> 
> And that’s one of the reasons I was having trouble called Ceph a file system. It’s really more of a platform because it just gives you storage, period.
> 
> Finally, one of the nicer things that you can do with Ceph thanks to the things we’ve done with the recent release of Fuel is getting live migrations to work on all sorts of Ceph-backed instances.
> 
> To sum things up, Ceph benefits include:
> 
> - Multi-node striping and redundancy for block storage (Cinder volumes and Nova ephemeral drives)
> 
> - Copy-on-write cloning of images to volumes and instances
> 
> - Unified storage pool for all types of storage (object, block, and POSIX)
> 
> - Live migration of Ceph-backed instances
> 
> However, Ceph is not a panacea for all problems. It has some issues that still need to be overcome. Those problems are:
> 
> - Ceph is quite sensitive to clock drift. If you want to use Ceph, you’d better make sure that you’ve got your infrastructure rock solid. If you don’t, your servers drift out of sync, and your cluster breaks.
> 
> - Multisite support. Unlike Swift which has had multisite support for quite some time, Ceph has only capacity for asynchronous replication is the most recent release called Emperor. Before then Ceph was synchronous replication only, and sync classification means that you cannot replicate on a long-distance link, which means you cannot replicate between multiple sites, which does limit Ceph’s usability. We haven’t yet tried the asynchronous replications that was introduced in Emperor, so I cannot tell you how well it works, how suitable it is for different needs, but we are very excited about it.
> 
> - Block storage density. Unlike Cinder, which just gives one replica of data, so we basically have 100 percent utilization of all your hard drives, with Ceph you have to have data replication, and that means that you have at least two copies of your data for all of your data. That means that your actual raw storage capacity has to be twice or three times bigger than your data set. One way to address that that’s been promised in the next iteration in a tool called Firefly is erasure coding, which means that instead of a full replication of the data, you could have erasure coded striping that would make the data multiplication requirements of Ceph quite a bit smaller. Instead of twice the data or three times the data, you can have one and a half times the data, or even 1.2 times the data.
> 
> - Swift API gap. If you do want to use Ceph as your primary object storage, there will be some minor bits of Swift APIs that will not be 100 percent supported in Ceph, because right now the only way to use Swift API with Ceph is to use RADOS Gateway, which is an implementation of Swift API. That’s not Swift itself, so there are bound to be some gaps.
> 
> ### That’s all fine and dandy, but what has Fuel got to do with it?
> 
> What has Fuel ever done for Ceph? Aside from making OpenStack work like a charm and having all those hardened packages and making it all deploy, what has ever Fuel done for Ceph? Fuel actually includes Puppet manifests and other bits and pieces here and there, so the whole configuration, provisioning, deployment process of Mirantis OpenStack with Ceph enabled makes sure you end up with a Ceph cluster deployed as a part of your OpenStack environment and also OpenStack components that are aware of storage configured to use Ceph as a storage backend. So it goes and creates partitions for OSD nodes. It can create general partitions as well. It sets up authentications of the different OpenStack components that have their own storage pools. It configures those components to use the right pools and right credentials. And it sets up RADOS Gateway, even goes as far as sticking RADOS Gateway behind HAProxy so that these actually are high available.
> 
> Therefore:
> 
> 1. Fuel deploys Ceph Monitors and OSDs on dedicated nodes or in combination with OpenStack components.
> 
> [![](images/mirantis5-300x102.png "mirantis5")](http://ceph.com/wp-content/uploads/2014/01/mirantis5.png)
> 
> 5. Creates partitions for OSDs when nodes are provisioned.
> 
> 7. Creates separate RADOS pools and sets up Cephx authentication for Cinder, Glance, and Nova.
> 
> 9. Configures Cinder, Glance, and Nova to use RBD backend with the right pools and credentials.
> 
> 11. Deploys RADOS Gateway (S3 and Swift API frontend to Ceph) behind HAProxy on controller nodes.
> 
> ### What does it look like?
> 
> So here is a couple of screenshots of what it looks like to configure Ceph for OpenStack in Fuel.
> 
> [![](images/mirantis6-300x167.png "mirantis6")](http://ceph.com/wp-content/uploads/2014/01/mirantis6.png)
> 
> Figure 5 Configure Ceph for OpenStack in Fuel: select storage options ⇒ assign roles to nodes ⇒ allocate disks
> 
> You start with setting your storage settings, so you say click a bunch of checkboxes sticking Ceph for Cinder, Glance, Nova, object storage if you will. You go and discover some nodes. You assign some roles to those nodes. One of those roles is Ceph OSD. As I mentioned—or actually not mentioned, but anyway, we don’t have a separate role for Ceph monitor just yet, so—but by default just stick Ceph monitor on the controller. So whichever controller nodes you have will have not just OpenStack controller components; they will also—will also be monitoring managing the Ceph cluster.
> 
> And, the final step that you actually don’t have to do but you might want to do if you want to fine-tune your performance or you have not assigned the disk layout is configure your disk storage. So that topmost screenshot on that screen shows you the default layout of how a system with multiple disks would look if you didn’t tweak anything and just let Fuel do its thing. So by default what we do is stick all the partitions in the first drive except Ceph, which gets all the rest of the drives for just OSD storage. What you could—what you might want to do actually is stick a couple of SSD drives, depending on how many hard drives you have in your storage node, and have those SSDs, servers dedicated to general devices. So, as you can see, there is a list of storage roles or partition roles you can assign to different drives. You can just change their allocation from Ceph to Ceph General to say, “Okay, that device is going to be general.”
> 
> Next, we’ll discuss those little things we’ve done to make this work.
> 
> ### Things we’ve done
> 
> Superficially it all looks very simple: partition the drives, tell Ceph here are your drives, build the Ceph cluster, configure OpenStack to use that cluster—done. As we’ve found out, it’s not quite that simple. There are a lot of small things that you have to do that are documented in different places or not documented at all, so I thought I’d just have them all in one place for all the audiences.
> 
> 1. Set the right GPT type GUIDs on OSD and journal partitions for udev automount rules
> 
> But one of the first things we found out—not first things, but one of the first things you have to do is make sure that you’ve got the right partition types for your OSD partitions, otherwise your OSD wouldn’t come back up automatically on reboot. The problem is that unless you want to actually add all your OSD devices in an FS tab, they will not be automated on reboot. But Ceph provides udev automount rules that look for specific GPT partition GUIDs and automounts those as OSD devices and Journals. And the only place where that’s documented is source code or Ceph disks at the moment unfortunately.
> 
> 4. ceph-deploy: set up root SSH between Ceph nodes
> 
> Another thing that we do is for Ceph deploy to work we obviously have to have SSH configured between all the nodes, so we—one of the things that Fuel does for you is generate SSH keys and distributes those between nodes so that the nodes can talk to each other.
> 
> 7. Basic Ceph settings: cephx, pool size, networks
> 
> So it goes without saying that you have to have a basic Ceph configuration. You have to have Cephx authentication keys, configure your replication factor, tell Ceph which networks to talk to, and so on.
> 
> 10. Cephx: ceph auth command line can’t be split
> 
> Another minor problem that we found out is that when you use Cephx command lines in scripts, never split them up because there is a bug in Ceph auth that just doesn’t deal with unexpected types of white space. Let’s put it that way.
> 
> 13. Rados Gateway: has to be the Inktank’s fork of FastCGI, set an infinite revocation interval for UUID auth tokens to work
> 
> RADOS Gateway is also a bit finicky. It uses FastCGI but it’s not any FastCGI. It has to be—it’s Inktank’s forked CGI because it has a couple of bug fixes that never found their way into upstream. One other thing is that while it can use PPI as a self-certificate for authentication, out of the box settings add up to more than you’d want an automated tool to do. You want to have your own PPI management infrastructure. You want to have your certificate authority or at least proper certificate sign by proxy authority. So Fuel doesn’t try to do all that for you. So by default it sets things up using UUID authentication tokens, which are easy to manage and easy to set up automatically. But what RADOS Gateway doesn’t know is that if you have your UUID authentication tokens, there is no such thing as token verification in Keystone so you have to set the verification interval to have infinitely large values so it doesn’t get in the way.
> 
> 16. Patch Cinder to convert non-raw images when creating an RBD backed volume from Glance
> 
> We also had to make quite a lot of patching for Cinder and Nova, especially Nova, to make things work properly with Ceph—Ceph as storage backend for all things. For example, Cinder wasn’t smart enough to know that if you have an image in any other format except raw you cannot just create a volume from that and expect that volume to be usable, because Ceph only works with raw volumes. So we’ve added a patch for Cinder to check what the image format actually is, and if it’s requesting to create an image from a non-raw volume, how to convert it.
> 
> 19. Patch Nova: clone RBD backed Glance images into RBD backed ephemeral volumes, pass RBD user to qemu-img
> 
> We also did a lot of stuff to adjust the ephemeral RBD so that we could get nice things like copy on write when launching an instance directly from a Glance image, not just from a Cinder volume, so we could have live migrations.
> 
> 22. Ephemeral RBD: disable SSH key injection, set up Nova, libvirt, and QEMU for live migration
> 
> Now we’ll focus on disk partitioning for Ceph.
> 
> ### Disk partitioning for Ceph OSD
> 
> As I’ve said, disk partitioning for Ceph is done automatically by Fuel. Here is how it works (see Figure 6).
> 
> [![](images/mirantis7-300x94.png "mirantis7")](http://ceph.com/wp-content/uploads/2014/01/mirantis7.png)
> 
> Figure 6 Flow of disk partitioning information during discovery, configuration, provisioning, and deployment
> 
> First of all, we discover the nodes. The nodes get booted into a bootstrap image and the agent then reports back to Fuel all the information about the node, including its disk configuration. So Fuel is then able to display that in the UI so that user can allocate drives to the volume types that are required for a particular role. And if you had a Ceph OSD role, that obviously means Ceph has a Journal. That gets filed into Cobbler via ks\_spaces variable. That gets consumed by a script that Cobbler runs during provisioning, which is required to create those partitions, and asks your disk utility to set the partition type, to set those auth modules actually. So for your reference here are the UUIDs if you want to learn more about what Ceph expects, refer to the Ceph disk source code because that’s where we found them.
> 
> GPT partition type GUIDs according to ceph-disk are:
> 
> `JOURNAL_UUID = ’45b0969e-9b03-4f30-b4c6-b4b80ceff106 ’ OSD_UUID = ’4fbd7e29-9d25-41b8-afd0-062c0ceff05d ’`
> 
> If you have more than one Journal device and you have multiple OSD drives, it will evenly distribute the Journal devices between OSDs so that the load between your SSD Journal devices is evenly distributed and you get the most out of your cluster.
> 
> ### Cephx authentication settings
> 
> The authentications we do for Cephx is a bit more advanced than what you’d find in a typical howto because we decided to nail things down in terms of authentication security. So instead of just having a single pool called RBD, which is what Ceph drivers for OpenStack components usually expect, what we have is three separate pools, one for each of the components that each have Ceph drivers. We have a pool for images, volumes, and instances, respectively. And, then you also need to have the permissions. That is an absolute minimum required for those Ceph drivers to work.
> 
> Next, take a look at the scripts for each component.
> 
> Monitor ACL is the same for all Cephx users:
> 
> `allow r`
> 
> OSD ACLs vary per OpenStack component:
> 
> Glance: allow class -read object\_prefix rbd\_children ,
> 
> `allow rwx pool=images`
> 
> Cinder: allow class -read object\_prefix rbd\_children ,
> 
> `allow rwx pool=volumes allow rx pool=images`
> 
> Nova: allow class -read object\_prefix rbd\_children ,
> 
> `allow rwx pool=volumes allow rx pool=images allow rwx pool=compute`
> 
> NOTE: Cephx is easily tripped up by unexpected whitespace in ceph auth command line parameters, so we have to keep them all on a single line.
> 
> Now let’s talk about live migrations.
> 
> ### Live VM migrations with Ceph
> 
> So one of the things that we found kind of baffling is the terminology. Like, there are so many different types of migrations supported by OpenStack and specifically by libvirt, and this is what all those words mean so you can understand when I say that the live migrations we support with Ceph are live, volume-backed, native, peer-to-peer, managed.
> 
> Table 1 Types of VM migrations
> 
> <table><colgroup><col width="185"> <col width="439"></colgroup><tbody><tr><td><p dir="ltr">OpenStack</p></td><td><p dir="ltr">Live vs offline: Is VM stopped during migration?</p><p dir="ltr">Block vs shared storage vs volume-backed: Is VM data shared between nodes? Is VM metadata (e.g. libvirt domain XML) shared?</p></td></tr><tr><td><p dir="ltr">Libvirt</p></td><td><p dir="ltr">Native vs tunneled: Is VM state transferred directly between hypervisors or tunneled by libvirtd?</p><p dir="ltr">Direct vs peer-to-peer: Is migration controlled by libvirt client or by source libvirtd?</p><p dir="ltr">Managed vs unmanaged: Is migration controlled by libvirt or by hypervisor itself?</p></td></tr><tr><td><p dir="ltr">Our type</p></td><td><p dir="ltr">Live, volume-backed*, native, peer-to-peer, managed.</p></td></tr></tbody></table>
> 
> \* Nova actually thinks that it’s called shared storage, but it was confused about this definition of shared storage until we patched that confusion away.
> 
> A live migration means that a VM doesn’t have to be stopped. It’s volume backed–the ephemeral volume of the VM is shared between compute nodes. It’s obviously shared because it’s in the Ceph cluster. It’s native–we use QEMU to direct a QEMU-to-QEMU connection to transfer ZVM state between the compute nodes. It’s peer-to-peer–we don’t have the libvirt clients talk to both compute nodes. We initiate it on one compute node and that source compute node is responsible for managing the migration. And it is managed–libvirt oversees the process of migration instead of handing it off to VM and not caring what happens next.
> 
> So, you have VMs, you have Nova telling libvirt to start the migration, and libvirt tells QEMU, “Okay, here’s a URL to connect to the remote node. Go and transfer the state, and here is the hard drive—and here is the VM configuration to use.” So that VM configuration gets transferred to the node, to the target node, which picks up the VM that was migrated over the QEMU to the connection. And we also set flags to persist the VM on the destination node, and we file it on the source node so that if that if either of the nodes is reached their migrated state remains migrated so that VM doesn’t get diverted back to the source node.
> 
> So here are a couple of things that we changed that were not very obvious. One of the things is that Nova tended to assume that if it’s not a Cinder volume-backed VM being migrated, it has to be shared instance metadata along with shared volume. So we had to decouple that and say, “Okay, it is fairly legal for VM to migrate if it has a shared ephemeral volume which is not Cinder-backed. It’s just an ephemeral drive, Ceph-backed.” But it’s—the libvirt metadata, the libvirt XML does not live in NFS. It’s not shared. It has to be transferred from one node to another.
> 
> Another annoying thing about Nova is that it doesn’t update the VNC listen address as it migrates a VM. So the widely documented workaround is that you have to set the VNC address to all zeroes, which means that anyone can connect to VNC on any compute node. So we had to add an empty table row to limit that the management of that compute node from the public network, the whole wide world is unable to talk to your VNC.
> 
> Finally you have to open ephemeral port 49152. In fact, you have to open the range of ports for QEMU migrations. Just one port is not gonna be enough because for each migration in progress QEMU opens a different port in the range. The more nodes you have, the more VMs you would expect to have to migrate and the more ports you need to have open.
> 
> To sum up, you:
> 
> Enable native peer to peer live migration:
> 
> [![](images/mirantis8-300x109.png "mirantis8")](http://ceph.com/wp-content/uploads/2014/01/mirantis8.png)
> 
> Figure 7 Enabling native peer-to-peer live migration
> 
> `libvirt VIR_MIGRATE_* flags: LIVE, PEER2PEER, UNDEFINE_SOURCE, PERSIST_DEST`
> 
> - Patch Nova to decouple shared volumes from shared libvirt metadata logic during live migration
> 
> - Set VNC listen address to 0.0.0.0 and block VNC from outside the management network in iptables
> 
> - Open ports 49152+ between computes for QEMU migrations
> 
> ### Things we left undone
> 
> There is also quite a long list of things that we didn’t get around to doing, like, setting up root SSH between all nodes. Technically you don’t need root SSH. You could connect a non-root user with sudo, but, if you want that, you can punch that in relatively easily.
> 
> What we also don’t do is we—right now we just hardwire PG numbers, which is a sizing information for pool stripings that technically should be based on the number of OSDs. But since Fuel installs OpenStack in an open-ended manner, it allows you to scale things out or down arbitrarily after the deployment is done, we don’t want to make wrong assumptions. So you actually have to tune that yourself based on the size of your cluster and the workload.
> 
> One problem that we actually do plan to fix as soon as possible is right now Fuel has sort of hardwired network roles for different traffic types, and we only have a single storage network. And that means Ceph, which has two networks for traffic, one for Glance server traffic, one for application traffic, has to either have both types of traffic on the storage network or one type on the storage network and one on the administrative network. So depending on what is the network configuration you’re deploying, that could mean that you have to make some compromises until Fuel gets support for an arbitrary number of networks of different types.
> 
> One of the things that we don’t do out of the box that we probably should do in the next release as well is make sure that all of the Ceph monitors gets listed in Ceph.conf on each Ceph node. Right now what we do is we just get the primary monitors there. That makes it simpler as you scale out to more monitors—well, it’s basically the same compromise as was the PG numbers. Once you’ve done your deployment, getting those monitors listed has to be part of the process we do.
> 
> One more thing that you might want if your cloud is really large is dedicated monitoring also. Actually our Puppet manifests are prepared to do that. They expected Ceph 1 as its own node role, but the rest of Fuel doesn’t have such a role defined, so you have to do a bit of manual deployment, tweaking with Puppet manifests to make that work. But it’s doable. It just would be nicer to have that in a nice GUI as the rest of Fuel.
> 
> One of the things that we started doing but didn’t get around to integrating it into Fuel is multi-backend configuration to Cinder. So Cinder actually supports having multiple storage backends in parallel. So you can have—in the same OpenStack environment have some Cinder LVM nodes and the Ceph cluster, and you could choose for any given volume whether you want to with an LVM or with Ceph. Well, our Fuel manifests right now only have—support one option at a time. You either use LVM or you use Ceph, which should be fine for most cases, but for some cases you’d have to once again do a bit more tweaking of Cinder configuration to make that work for you. It shouldn’t be that difficult anyway.
> 
> One more thing is that—it’s kind of ugly, although I guess—well, it works, but still in order for any of the OpenStack components that support Ceph to know which pool to go to, you have to pass an environment variable via init script, which is actually not exactly the right way to do things. You do have a configuration variable in the RBD driver that tells you which pool to use. It just turns out not to be enough. So hopefully that will get addressed in the upcoming OpenStack releases.
> 
> One of the things that I already mentioned is that Nova doesn’t update the VNC listen address. So actually that shouldn’t be too hard, so once we get around to it, or maybe if somebody else gets around to it, it would really be nice to have that automatically updated to the target node management address instead of relying on that ugly 000 hack.
> 
> And finally I found that there is still one use case where the Ceph driver was still using a data clone. It was an attempt to get away with just cloning an image. And that use case is snapshotting a Ceph-backed VM. So if you have a VM that was started from Ceph, it has its internal arg in Ceph and you want to create a snapshot, instead of cloning that image, what happens is Nova calls QEMU IMG, which, downloads it to local storage, converts it—even if it doesn’t have to convert it from raw to raw, and then uploads it back into Ceph. Well, it would be nice if that didn’t have to happen.
> 
> Here is the summary of our todos:
> 
> 1. Non-root user with sudo for ceph-deploy
> 
> 3. Calculate PG numbers based on the number of OSDs
> 
> 5. Ceph public network should go to a second storage network instead of management
> 
> 7. Dedicated Monitor nodes, list all Monitors in ceph.conf on each Ceph node
> 
> 9. Multi-backend configuration for Cinder
> 
> 11. A better way to configure pools for OpenStack services (than CEPH\_ARGS in the init script)
> 
> 13. Make Nova update VM’s VNC listen address to vncserver\_listen of the destination compute after migration
> 
> 15. Replace ’qemu-img convert’ with clone\_image() in LibvirtDriver.snapshot() in Nova
> 
> ### Diagnostics and troubleshooting
> 
> How do you check if your Ceph is all right? What do you do if something goes wrong? Oh, here is a very, very quick smoke test you could do once your deployment is done, see if your Ceph + is healthy, if all your OSD devices are in the OSD tree, try to create a volume, see if that volume creates okay, see if all the other pools were created for you, if the data shows up in them when you create the volume instances and whatnot. Check if your other pools are there, if data shows up in those pools when you’re creating instances, and volumes, and so on, and finally try to create an image and boot an instance from it, and migrate that instance to another node. If all that works, well, your environment is basically good to go and ready for stress test.
> 
> `ceph -s ceph osd tree cinder create 1 rados df qemu - img convert -O raw cirros . qcow2 cirros .raw glance image - create --name cirros -raw --is - public yes \ --container - format bare --disk - format raw < cirros .raw nova boot -- flavor 1 --image cirros - raw vm0 nova live - migration vm0 node -3`
> 
> What do you do:
> 
> - Disk partitioning failed during provisioning. Check if traces of previous partition tables are left on any drives
> 
> - ’ceph-deploy config pull’ failed. Check if the node can ssh to the primary controller over management network
> 
> - HEALTH\_WARN: clock skew detected. Check your ntpd settings, make sure your NTP server is reachable from all nodes
> 
> - ENOSPC when storing small objects in RGW. Try setting a smaller rgw object stripe size
> 
> Now here are the common things that we saw happen every once in a while. First of all, going from provisioning all the way to usage. First things that could happen is your OSD could fail to provision some drives. We added some disk cleaning, so that’s not supposed to happen anymore, but in case it does, if you’re provisioning refused to format a drive, that means that some traces of LVM groups or partition tables are left on the drive and you need to clean them out and retry your deployment.
> 
> Another common error that happens and is referring to Ceph is “ceph-deploy config pull fail,” which actually means that most likely your network is broken. If your node cannot talk to the primary controller over SSH, then it will not be able to pull the Ceph config and the rest of the deployment will fail.
> 
> One of the things that I warned earlier is that your your NTP has to be rock solid. If it’s not, what you will end up with is a health warning that a clock skew is detected, and that means your cluster goes into a degraded state at best and might even explode. Well, we’ve seen it explode in some bad cases.
> 
> And finally we’ve seen some discussion of an ENOSPC error on that Ceph mailing list that could happen if you use RADOS Gateway to store lots of small objects in Ceph. So what ends up happening is that it uses up a lot more space that is a combined size of all objects. One of the ways to work around that is just set a smaller stripe size, because by default the stripe size is four megabytes. So if your objects are 64K you’re gonna use up 4 megabytes per 64K you try to store.
> 
> ### Resources
> 
> Read the docs:
> 
> [http://ceph.com/docs/next/rbd/rbd-openstack/](http://ceph.com/docs/next/rbd/rbd-openstack/)
> 
> [http://docs.mirantis.com/fuel/fuel-4.0/ http://libvirt.org/migration.html](http://docs.mirantis.com/fuel/fuel-4.0/ http://libvirt.org/migration.html)
> 
> [http://docs.openstack.org/admin-guide-cloud/contentch\_introduction-to-openstack-compute.html](http://docs.openstack.org/admin-guide-cloud/contentch_introduction-to-openstack-compute.html)
> 
> Get the code:
> 
> [Mirantis OpenStack](http://software.mirantis.com/) ISO image and VirtualBox scripts,
> 
> [ceph](https://github.com/stackforge/fuel-library/tree/master/deployment/puppet/ceph) Puppet module for Fuel,
> 
> Josh Durgin’s [havana-ephemeral-rbd](https://github.com/jdurgin/nova/commits/havana-ephemeral-rbd) branch for Nova.
> 
> Vote on Nova bugs:
> 
> [#1226351](https://bugs.launchpad.net/fuel/%2Bbug/1226351), [#1261675](https://bugs.launchpad.net/fuel/%2Bbug/1262450), [#1262450](https://bugs.launchpad.net/fuel/%2Bbug/1262450), [#1262914](https://bugs.launchpad.net/fuel/%2Bbug/1262914).
> 
> Sign up for the [Mirantis and Inktank webcast on Ceph and OpenStack](http://bit.ly/JZIgRD).
