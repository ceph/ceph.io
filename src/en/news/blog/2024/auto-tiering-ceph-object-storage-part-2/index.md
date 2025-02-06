﻿---
title: "Auto-tiering Ceph Object Storage - PART 2"
date: 2024-03-08
author: Steven Umbehocker
---

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
