---
title: "Auto-tiering Ceph Object Storage - PART 1"
date: 2024-03-07
author: Steven Umbehocker
---

S3-compatible object storage systems generally have the ability to store
objects into different tiers with different characteristics so you can get the
best combination of cost and performance to match the needs of any given
application workload.  Storage tiers are referred to as ‘Storage Classes’ in S3
parlance with example storage classes at AWS including “STANDARD” for general
purpose use and lower storage classes like “DEEP_ARCHIVE” and “GLACIER” for
backups and archive use cases.

Ceph’s S3-compatible storage capabilities also includes the ability to create
your own Storage Classes and by default it automatically creates a single
storage class called “STANDARD” to match the default tier offered by AWS.

In this 3 part blog post we’re going to dive into auto-tiering object storage
with Ceph and explore some basic Lua scripting as part of that which I think
you’ll find approachable even if you’ve not used or heard of Lua before:



* PART 1 - Ceph Object storage basics and why you’d want to set up different
  storage classes
* PART 2 - How to use Lua scripting to automatically assign objects to
  different storage classes based on size
* PART 3 - More advanced Lua scripting to dynamically match objects to storage
  classes based on regex matching to object names

**Ceph Object Storage Basics**

Ceph object storage clusters consist of two primary storage pools, one for
metadata and one for data.

The metadata pool stores the index of all the objects for every bucket and
contains “rgw.bucket.index” in the name. Essentially the bucket index pool is
a collection of databases, one for each bucket which contains the list of every
object in that bucket and information on the location of each chunk of data
(RADOS object) that makes up each S3 object.

Data pools typically contain “rgw.buckets.data” in their name and they store
all the actual data blocks (RADOS objects) that make up each S3 object in your
cluster.

The metadata in the bucket index pool needs to be on fast storage that’s great
for small reads and writes (IOPS) as it is essentially a collection of
databases.  As such (and for various technical reasons beyond this article)
this pool must be configured with a replica layout and ideally should be
stored on all-flash storage media.  Flash storage for the bucket index pool
is also important as buckets must resize their bucket index databases
(RocksDB based) periodically to make it larger to make more room for more
object metadata as a bucket grows.   This process is called “resharding”
and it all happens automatically behind the scenes but resharding can
greatly impact cluster performance if the bucket index pool is on HDD media
rather than flash media.

In contrast, the data pool (eg default.rgw.buckets.data) is typically storing
large chunks of data that can be written efficiently to HDDs.  This is where
erasure coding layouts shine and provide one with a [big boost in usable
capacity](https://docs.ceph.com/en/latest/rados/operations/erasure-code/#erasure-coded-pool-overhead)
(usually 66% or more vs 33% usable with replica=3).   Erasure coding also has
great write performance when you’re working with objects that are [large
enough](https://docs.google.com/spreadsheets/d/1rpGfScgG-GLoIGMJWDixEkqs-On9w8nAUToPQjN8bDI/edit#gid=358760253)
(generally anything 4MB and larger but ideally 64MB and larger) as there’s much
less network write amplification when using erasure coding (~125% of client N/S
traffic) vs a replica based layout (300% of client N/S traffic).


![alt_text](images/image1.png "image_tooltip")


**Object Storage Zones and Zone Groups**

A zone contains a complete copy of all of your S3 objects and those can be
mirrored in whole or in part to other zones.  When you want to mirror
everything to another zone you put the zones you want mirrored together into
a Zone Group.  Typically the name of the Zone Group is also the name of the S3
realm like “us” or “eu” and the zone will have a name like “us-east-1” or
“us-west-1” to borrow from some common AWS zone names.   When setting up your
Ceph object storage for use with products like Veritas Netbackup we recommend
using a AWS zone name like “us-east-1” for compatibility as some products
specifically look for known AWS zone and realm names.  A cluster setup with
a zone “us-east-1” and zone group (and realm) of “us” will look like this.


![alt_text](images/image2.png "image_tooltip")


**Object Storage Classes**

Storage classes provide us with a way to tag objects to go into the data pool
of our choosing.  When you set up a cluster with a single data pool like you
see above you’ll have a single storage class mapped to it called “STANDARD” and
your cluster will look like this.

![alt_text](images/image3.png "image_tooltip")


**Auto-tiering via Multiple Storage Classes**

So now we get to the heart of this article.  What if all your data isn’t
composed of large objects, what if you have millions or billions of small
objects mixed in with large objects?  You want to use erasure coding for the
large objects but that’ll be wasteful and expensive for the small objects (eg.
1K to 64K).   But if you use replica=3 as the layout for the data pool you’ll
only get 33% usable capacity and you’ll run out of space and need three times
more storage.  This is where multiple data pools come to the rescue.  Without
buying any additional storage we can share the underlying media (OSDs) with the
existing pools and make new data pools to give ourselves additional layout
options.  Here’s an example of where we add two additional data pools and
associated storage classes we’ll call SMALL_OBJ for objects &lt; 16K and
MEDIUM_OBJ for everything 16K to 1MB would look like:


![alt_text](images/image4.png "image_tooltip")


So now we have a storage class “SMALL_OBJ” that’s only going to use a few
gigabytes for every million small objects and will be able to read and write
those efficiently.  We also have a HDD based “MEDIUM_OBJ” storage class that is
also using a replica=3 layout like “SMALL_OBJ” but this pool is on HDD media so
it’s less costly and allows us to reasonably store roughly one million 1MB
objects in just 1TB of space.  For everything else we’ll route it to our
erasure-coded default “STANDARD” storage class.  Note also that some
applications written for AWS S3 won’t accept custom Storage Class names like
“SMALL_OBJ” so if you run into compatibility issues, try choosing from
[pre-defined Storage Class names used by
AWS](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html).

**Users Don’t Aim**

Ok, so you’ve done all the above, you’ve got an optimally configured object
storage cluster but now your users are calling and saying it’s slow.  So you
look into it and you find that your users are not making any effort to
categorize their objects into the right Storage Class categories (i.e. by
setting the S3 X-Amz-Storage-Class header) when they upload objects.  It’s like
trying to get everyone to organize and separate their recycling.  But in this
case we have a secret weapon, that’s Lua, and in the next article we’re going
to use a few lines of scripting to put our objects into the right Storage Class
every time so that users won’t need to do a thing.

(Following the recycle bin analogy, we’ll be able to just throw the object in
the general direction of the bins and it will always land in the correct bin.
No aiming required, just like Shane from [Stuff Made
Here](https://en.wikipedia.org/wiki/Shane_Wighton)! 😀 )

**Auto-tiering Ceph Object Storage - PART 2**

In this article we’re getting into the fun part of writing a simple Lua script
to start automatically tiering (organizing) S3 objects into the right pools by
dynamically changing the Storage Class setting on the fly as objects are being
uploaded (S3 PUTs).

If you haven’t read PART 1 you want to check that out over <span
style="text-decoration:underline;">here</span> as it lays the groundwork for
what we’re doing here in PART 2.

**Why Auto-Tiering Matters**

Having different tiers (Storage Classes) is really important not just for cost
savings but also for performance considerations.  As we discussed in PART 1 if
you’re uploading millions of small 1K objects it is a generally bad idea to
write those objects into an erasure-coded data pool.  It’ll be slow, you’ll
waste a lot of space due to object padding, you’ll have unhappy users.  But the
key is to have the objects get assigned to a suitable storage class
automatically as users oftentimes will not make the effort to categorize them
themselves.


![alt_text](images/image5.png "image_tooltip")


Revisiting our diagram from PART 1 we’ll use this example again in PART 2 as we
write up a Lua script.

Before we jump into the Lua though, a big THANK YOU to [Yuval
Lifshitz](https://www.youtube.com/watch?v=N1MDa_raDPY) and team for
implementing the feature we’re discussing here today.  That feature of course
is the ability to inject [Lua](https://lua.org/start.html) scripts into the
CephRGW (CephRGW = Ceph Rados Gateway = S3 protocol gateway) so we can do fun
stuff like auto-tiering.

I’d also like to highlight the Lua scripting and talk done by Anthony D’Atri
and Curt Bruns that you can find on [YouTube
here](https://www.youtube.com/watch?v=w91e0EjWD6E) that gave me the idea for
this series.  In that video you’ll see how they developed a Lua script to
auto-tier between TLC and QLC based NVMe storage, highly recommended.

**A Basic Lua Example**

We’re going to start with a basic example and borrow from Curt & Anthony’s Lua
script.  In this script we’ll assign objects to three different Storage Classes
we defined in the example from PART 1.  Those Storage Classes are STANDARD (for
our objects greater than 1MB), MEDIUM_OBJ (for objects between 16K and 1MB),
and SMALL_OBJ for everything less than 16K.


```
-- Lua script to auto-tier S3 object PUT requests

-- exit script quickly if it is not a PUT request
if Request == nil or Request.RGWOp ~= "put_obj"
then
  return
end

-- apply StorageClass only if user hasn't already assigned a storage-class
if Request.HTTP.StorageClass == nil or Request.HTTP.StorageClass == '' then
  if Request.ContentLength < 16384 then
    Request.HTTP.StorageClass = "SMALL_OBJ"
  elseif Request.ContentLength < 1048576 then
    Request.HTTP.StorageClass = "MEDIUM_OBJ"
  else
    Request.HTTP.StorageClass = "STANDARD"
  end
  RGWDebugLog("applied '" .. Request.HTTP.StorageClass .. "' to object '" .. Request.Object.Name .. "'")
end
```


**Installing Lua Scripts into CephRGW**

Next you’ll save the above Lua script to a file like `autotier.lua` and then
you can install it into the CephRGW gateways like so:


```
radosgw-admin script put --infile=./autotier.lua --context=preRequest
```


There’s no need to restart your CephRGW instances, the script becomes active
immediately for all your RGW instances in the zone.  Note though, if you’re
doing more advanced scripting and are adding a new Lua package then the CephRGW
instances will need to be restarted one time on all the nodes in the zone like
so:


```
# sudo systemctl restart ceph-radosgw@radosgw.*
```

![alt_text](images/image6.png "image_tooltip")


As illustrated by the diagram, object information about each request including
the S3 PUT request, is sent to our autotier.lua script.  In there we’re able to
dynamically update the value of `Request.HTTP.StorageClass `to get our objects
into the optimal data pools.  Now simply upload some objects to any bucket and
you’ll see that they’re getting routed to different data pools based on the
dynamically assigned StorageClass value applied by the autotier.lua script.

**Debugging**

To debug the script and see what’s going on via the `RGWDebugLog `messages
we’ll want to enable debug mode into the CephRGW and that’s done by editing the
ceph.conf, adding ‘debug rgw 20’ to the RGW section, then restarting your
CephRGW.  Here’s what my radosgw section looks like, and you can ignore all of
it except for the two debug options added to the end.


```
[client.radosgw.smu-80]
        admin_socket = /var/run/ceph/ceph-client.radosgw.smu-80.asok
        host = smu-80
        keyring = /etc/ceph/ceph.client.radosgw.keyring
        log file = /var/log/radosgw/client.radosgw.smu-80.log
        rgw dns name = smu-80.osnexus.net
        rgw frontends = beast endpoint=10.0.8.80:7480
        rgw print continue = false
        rgw zone = us-east-1
        debug rgw = 20
```


Now we restart the CephRGW to apply the debug settings we added to the
ceph.conf.  There are ways you can [dynamically enable debug
mode](https://docs.ceph.com/en/latest/rados/troubleshooting/log-and-debug/)
without changing the ceph.conf like (ceph config set client.radosgw.smu-80
debug_rgw 20) but it’s generally best to update the ceph.conf so your debug
mode setting is saved between restarts.


```
# sudo systemctl restart ceph-radosgw@radosgw.*
```


Last, let’s look at the log, on RHEL you’ll find the log under
/var/log/ceph/FSID/ but I’ve got my log file set to go here
/var/log/radosgw/client.radosgw.smu-80.log so I use this to view the Lua debug
messages:


```
# tail -f  /var/log/radosgw/client.radosgw.smu-80.log | grep Lua
```


Now I can see all the messages on how the objects are getting tagged as
I upload objects into the object store.


```
2024-02-14T06:08:11.257+0000 7f16a8dc1700 20 Lua INFO: applied 'MEDIUM_OBJ' to object 'security_features_2023.pdf'
2024-02-14T06:08:12.345+0000 7f171569a700 20 Lua INFO: applied 'MEDIUM_OBJ' to object 'security_features_2023.pdf'
2024-02-14T06:08:13.389+0000 7f16a55ba700 20 Lua INFO: applied 'MEDIUM_OBJ' to object 'security_features_2023.pdf'
2024-02-14T06:08:14.465+0000 7f1742ef5700 20 Lua INFO: applied 'MEDIUM_OBJ' to object 'security_features_2023.pdf'
2024-02-14T06:08:42.928+0000 7f16d7e1f700 20 Lua INFO: applied 'SMALL_OBJ' to object 'whitepaper.docx'
2024-02-14T06:08:44.012+0000 7f1680570700 20 Lua INFO: applied 'SMALL_OBJ' to object 'whitepaper.docx'
2024-02-14T06:08:45.056+0000 7f1674558700 20 Lua INFO: applied 'SMALL_OBJ' to object 'whitepaper.docx'
2024-02-14T06:08:46.092+0000 7f1664d39700 20 Lua INFO: applied 'SMALL_OBJ' to object 'whitepaper.docx'
```


**Testing**

To test this out you’ll want to upload some objects of various sizes and you’ll
see the storage-class tag get applied to them dynamically.  Note that if you
assign a tag like “PERFORMANCE” to a PUT request and you haven’t configured it
then your data will just get routed into the pool associated with the
“STANDARD” storage-class, typically `rgw.default.bucket.data `if you have
a default config.

**Summary**

Hope you enjoyed this tutorial on auto-tiering Ceph object storage with Lua.
In the last part, PART 3 we’re going to deep dive into setting up a Ceph object
cluster with three Storage Classes from scratch using QuantaStor 6.  We’ll have
a companion video on YouTube where we’ll go through setting up everything and
then we’ll go into more CephRGW Lua scripting where we’ll organize objects not
just by size but by string match to specific file name extensions.  Last,
thanks to Anthony D’Atri and Yuval Lifshitz for their help in reviewing and
proofreading these articles.
