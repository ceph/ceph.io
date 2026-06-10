---
title: "Managing Multiple Lua Scripts with Ceph Object Storage"
date: "2026-06-10"
author: "Kirby Chin"
categories: "rgw"
image: ""
tags:
  - "ceph"
  - "rgw"
  - "s3"
---

Since the Pacific release, Lua scripting in Ceph's RADOS Gateway (RGW) has provided users the ability to interpolate a single script to upload operations per request context and tenant. This way of working might be completely fine for a storage deployment with limited scripting customizations. However, script management becomes increasingly difficult as more than one team wants to get involved in managing the Lua script within the same context and tenant.

For this reason, we've released a new feature in RGW allowing you to manage more than one Lua script at a time. In this blog, we'll go over a couple of examples to walk you through how this feature can help your team to reduce runtime errors and lower developer friction when managing Lua scripts in RGW. To begin, we will create a script to enforce a bucket security control and then add another script to demonstrate the new feature.

## Script 1: Bucket security

Let's suppose we are part of a security team and want to mitigate the risk of ransomware threats happening on our storage platform. One possible way to achieve this is to implement a Write Once, Read Many (WORM) strategy to add an object lock onto any newly created bucket. By using an object lock, we can add a constraint to write objects to disk only once, ensuring that an infected client cannot delete or override objects at a later time.

To set our WORM strategy, we can create a Lua script in the `prerequest` context that aborts when a `create_bucket` operation is made without the write-once (object lock) requirement.

**objectlock.lua**

```lua
-- enforcing object lock on bucket creation

if Request.RGWOp == "create_bucket" and
  Request.HTTP.Metadata["x-amz-bucket-object-lock-enabled"] ~= "true" then
  RGWDebugLog("object lock is missing on bucket: " .. Request.Bucket.Name)
  Request.Response.Message = "Bucket must have object lock enabled"
  return RGW_ABORT_REQUEST
end
```

You can create a new `objectlock.lua` file with the contents above and run the CLI commands below to upload the script to RGW.

**Add the `objectlock.lua` script to the `preRequest` context:**

```
$ radosgw-admin script put --infile=./objectlock.lua --context=prerequest
```

**End Result:**
You'll know if this worked correctly if the `aws s3 mb` (make bucket) command below has failed.

```
$ aws s3 mb --endpoint-url http://127.0.0.1:8000 \
  s3://fish1 \
  --debug
```

**Error:**

```
Bucket must have object lock enabled
```

Instead, you'll need to use the `aws s3api create-bucket` command, which includes the `--object-lock-enabled-for-bucket` flag to set the write-once capability.

```
$ aws s3api create-bucket --endpoint-url http://127.0.0.1:8000 \
  --bucket fish2 \
  --object-lock-enabled-for-bucket
```

Once the script is uploaded, it's stored as a Ceph S3 object, so you will get the same benefits of data consistency and availability as you would get with any other object in the platform.

To delete the script, use `radosgw-admin script rm --context={context}`.

## Script 2: Cost optimization

Let's say that our engineering team now wants to implement object [auto-tiering](https://ceph.io/en/news/blog/2024/auto-tiering-ceph-object-storage-part-2/) to manage storage efficiently. Specifically, the team wants to classify objects with a `StorageClass` attribute, one of `STANDARD` (<16KB), `STANDARD_IA` (>=16KB and <1MB) or `ONE_ZONE_IA` (>1MB) to provide them with a heuristic on where to store the data in a cost effective manner. Although we are using AWS Storage Class names here, please avoid using `GLACIER` with Ceph's RGW because some clients/SDKs expect specific behavior that is not currently supported.

Similar to the first script, the engineering team wants to run their new script in the `prerequest` context before the object request starts. However, whereas the earlier example targets the `create_bucket` operation, the latter focuses exclusively on the `put_obj` operation.

**autotier.lua**

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
    Request.HTTP.StorageClass = "STANDARD"
  elseif Request.ContentLength < 1048576 then
    Request.HTTP.StorageClass = "STANDARD_IA"
  else
    Request.HTTP.StorageClass = "ONE_ZONE_IA"
  end
  RGWDebugLog("applied '" .. Request.HTTP.StorageClass .. "' to object '" .. Request.Object.Name .. "'")
end
```

You can create the `autotier.lua` file from the contents above, but you might quickly notice a new issue.

If we were to combine both scripts together, the engineering team's Lua script returns early if the request is not a `put_obj` operation. This means script order matters: if the engineering team's script runs first our initial script may never execute.

To avoid this merge conflict scenario and as mentioned earlier, we can use the multiple Lua script support in RGW by setting the `--script-name` parameter to add more than one script to the same request context.

### Adding more than one Lua script to the same context

Since it's important that both teams be able to run their own scripts in the `prerequest` context, you can add more than one script without affecting others by using the `script put` command with the `--script-name` flag.

For example, try adding both scripts with the following commands below:

```bash
$ radosgw-admin script put --infile=./objectlock.lua --script-name=worm-policy --context=prerequest
$ radosgw-admin script put --infile=./autotier.lua --script-name=smart-tiering --context=prerequest
```

One important caveat to remember when using multiple Lua scripts is that they have completely separate local scopes during execution. This means that a global variable in one script cannot be accessed in another script regardless of the context.

Apart from this, the Lua scripts will run sequentially and in lexicographical order, which follows the same ordering to how the scripts are listed in the admin command output below. The only exception to this is `--script-name=default` which is reserved for the unnamed script and will always be run first. 

**List all uploaded scripts with the `script list` command:**

```
$ radosgw-admin script list --context=prerequest
smart-tiering
worm-policy
```

Do note that if you haven't deleted the unnamed `objectlock.lua` script yet from the earlier example, you might get an extra `default` script included in the script list output.

Finally, to delete a named script, use `radosgw-admin script rm --context={context} --script-name={script-name}`.

## Wrapping Up

This was a brief look at the new multiple Lua scripting support in RGW to show how you can manage more than one script in the same context across teams in an independent way. For more information about this feature, you can find the complete reference in The Ceph Documentation on [Lua Scripting](https://docs.ceph.com/en/latest/radosgw/lua-scripting/).
