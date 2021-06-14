---
title: "RGW Metadata Search"
date: "2016-11-03"
author: "yehudasa"
---

I have recently been working on adding metadata search to rgw. It's not in yet, nor is it completely ready. I do think that it's at a point where it would be great to get some feedback. This feature is built on top of another feature that I talked about a few months ago on CDM, which is the "sync modules" (formerly known as "sync plugins") feature. The current code can be found in the following PR:

[https://github.com/ceph/ceph/pull/10731](https://github.com/ceph/ceph/pull/10731)

The "sync modules" feature that the metadata search (via elasticsearch) depends on provides the framework that allows forwarding data (and metadata) to external tiers. It extends the current multi-zone feature such that the current sync process uses the default sync module. A sync module is a set of callbacks that are called for each change that happens in data (and potentially in metadata, e.g., bucket creation, new user, etc.; note: object's metadata change is regaded as change in data) in a single zone-group. The rgw multi-zone system is eventual consistent, so changes are not applied synchronously.

A sync module is tied to a zone. Each zone has the module that is responsible for handling the cross-zones data synchronization. A sync module defines whether the zone can export data (e.g., regular rgw data one), or can only digest data that was modified on another zone (e.g., log zone, metadata search, etc.).

The zone definition within the zonegroup configuration has a new 'tier\_type' field. This param controls which sync module will be used for handling the cross-zone data sync. The zone private configuration (that is not exposed to other zones) has a new section that can be used to pass in sync-module specific configuration parameters. An example of such param would be the endpoint of the elasticsearch server that will be used by the module.

A sync module is tied to a zone. Each zone has the module that is responsible for handling the cross-zones data synchronization. A sync module defines whether the zone can export data (e.g., regular rgw data one), or can only digest data that was modified on another zone (e.g., log zone, metadata search, etc.)

The zone definition within the zonegroup configuration has a new 'tier\_type' field. This param controls which sync module will be used for handling the cross-zone data sync. See here:

> $ mrun c1 radosgw-admin zonegroup get
> {
> ...
>     "zones": \[
>         {
>             "id": "cc602d3a-de81-4682-ad51-59765acad32c",
>             "name": "us-west",
>             "endpoints": \[
>                 "http:\\/\\/localhost:8001"
>             \],
>             "log\_meta": "false",
>             "log\_data": "true",
>             "bucket\_index\_max\_shards": 0,
>             "read\_only": "false",
>             "tier\_type": "elasticsearch"
>         },
>         {
>             "id": "cde6b332-5bb8-4dc0-8219-b68932565ea1",
>             "name": "us-east-1",
>             "endpoints": \[
>                 "http:\\/\\/localhost:8000"
>             \],
>             "log\_meta": "true",
>             "log\_data": "true",
>             "bucket\_index\_max\_shards": 0,
>             "read\_only": "false",
>             "tier\_type": ""
>         }
>     \],
> ...
> }

The zone private configuration (that is not exposed to other zones) has a new section that can be used to pass in sync-module specific configuration parameters. An example of such param would be the endpoint of the elasticsearch server that will be used by the module.

> $ mrun c2 radosgw-admin zone get
> {
> ...
>     "metadata\_heap": "us-west.rgw.meta",
>     "tier\_config": \[
>         {
>             "key": "endpoint",
>             "val": "http:\\/\\/localhost:9200"
>         }
>     \],
> ...
> }

An example for a trivial sync module implementation is the log module, which dumps to the rgw debug log every object that needs to be synced, and the operation that associated with it (create, delete, delete\_marker). Note that for object creation it only provides the name of the objects that needs to be synced, but not any extra information about that object (such as object's size, and metadata). We also have a not-as-trivial implementation that fetches all the metadata associated with an object that needs to be synced from the source zone. This serves as the foundation for the metadata indexing module.

### metadata search via elasticsearch

The solution for metadata search we discussed was to use elasticsearch to index metadata. When saying metadata here I refer to all the metadata that is associated with data objects. Such metadata includes the object names, containing bucket name, size, content type, user specified metadata, acls, etc. We will also be able to index other type of metadata that associated with the zone, such as existing users, and bucket names.

Elasticsearch is an indexing framework that provides trivial mechanisms to index data, and to perform queries on that. Indexing the data is being through a RESTful api that allows HTTP PUTting and POSTing a json structure that describes the data. Querying the index is being done by simple GET operation.

A metadata indexing rgw zone consists of a ceph cluster (can piggy-back on another existing zone, or can reside in its own ceph cluster) that needs to hold the synchronization and rgw metadata information. It also includes an elasticsearch server. The zone needs to be configured with tier\_type set to 'elasticsearch', and the zone private configuration should point at the designated elasticsearch server. Whenever a change happens in the zone group (or through the initial full-sync process) the sync module updates elasticsearch with the metadata associated with the object, or removes the object's metadata altogether if needed. Once data is indexed, it is possible to access elasticsearch and query the metadata by the the different index keys.

An open question is whether we want to have rgw deal with the querying api, or just leave it for elasticsearch to handle that. Another option is to proxy metadata requests (via rgw) and send these to elasticsearch. In any solution that requires that rgw is involved in the querying process, we'll need to make up a RESTful api (that could be based on the elasticsearch api). Leaving this outside of rgw is trivial (from the perspective of rgw development).

Elasticsearch does not provide off the shelf security module (that is open and free at least) such as user authentication and/or authorization. Security is needed so that users could only run metadata queries on their own data, and not on other users' data. Current security mechanisms for elasticsearch require either a proprietary non-open elasticsearch extension, or other rudimentary open modules. The elasticsearch default "security" model is non existent, and relies on limiting access to specific url prefix through a proxy. It is an open question which way we want to go. We can leave it for the users (provided that we document the setup), or address it by proxying requests through rgw and reuse its own auth (which on one hand will solve the authorization issue, but will introduce an api problem, it's probably not going to be compatible with current elasticsearch commonly used api). We currently store which users have read permissions to each object. This will allow filtering search results so that only the authorized users could see the relevant objects.

### status

The branch (referenced above through the PR), implements a trivial sync module that pushes object's metadata to a configured elasticsearch module. The main things that I want to add is

\- limit zone sync to prespecified zones, and not all zones in the zonegroup

This is not necessarily unique to this feature, but can help here quite a lot. There are a few edge cases that can cause some trouble when syncing from more than one zone here (and are not an issue with the regular rgw data sync, but due to some limitations can cause some weirdness).

\- elasticsearch preconfiguration / index setup

We currently don't control any of the indexes that are being created by elasticsearch. We just post the objects and let elasticsearch do what it does. This might not be optimal, or might even be problematic. One way to handle that would be through preconfiguring the index when first starting the sync process on the elasticsearch zone. Howeve, it'll need bigger expertise in elasticsearch, as there are some tricky issues (e.g., what to do with user custom defined metadata?)

And finally, here's an example of a query that retrieves all the objects that have the custom 'color' metadata field set to 'silver':

$ curl -XGET http://localhost:9200/rgw/\_search?q=meta.custom.color:silver
{
    "took": 5,
    "timed\_out": false,
    "\_shards": {
        "total": 5,
        "successful": 5,
        "failed": 0
    },
    "hits": {
        "total": 1,
        "max\_score": 0.30685282,
        "hits": \[
            {
                "\_index": "rgw",
                "\_type": "object",
                "\_id": "cde6b332-5bb8-4dc0-8219-b68932565ea1.4127.1:foo3:",
                "\_score": 0.30685282,
                "\_source": {
                    "bucket": "buck2",
                    "name": "foo3",
                    "instance": "",
                    "owner": {
                        "id": "yehsad",
                        "display\_name": "yehuda"
                    },
                    "permissions": \[
                        "yehsad"
                    \],
                    "meta": {
                        "size": 35,
                        "mtime": "2016-08-23T18:28:40.098Z",
                        "etag": "6216701a3418bdf56506670b91db3845",
                        "x-amz-date": "Tue, 23 Aug 2016 18:28:39 GMT",
                        "custom": {
                            "color": "silver"
                        }
                    }
                }
            }
        \]
    }
}

### open questions

\- special metadata search api

Do we need to integrate a special metadata search api into rgw? This will require defining the new api. Another option is to just proxy requests to elasticsearch. A third option is to do nothing.

\- authorization

Authorization is an issue. As it is now, a user that can connect to the elasticsearch server will be able by default to yank metadata of all objects in the system. There are ways to configure a proxy on top of elasticsearch to limit users operations. The read permissions field that we provide as part of the indexed documents should help there.

\- Should we just document how users need to configure the system? - Do we need to investigate an external elasticsearch security module?

The ones I've seen didn't seem to quite cut it.

\- proxy requests through rgw to force authorization through that?

\- deep object inspection for metadata classification

As it is now we only look at the current metadata assigned to the objects. Something that we can explore in the future is to allow for some extensible way to look into the actual objects' data, and then attach other metadata to these objects. E.g., for image files it could store the resolution, or the EXIF data if exists. This can currently be done by external scripts that would run over the data itself and update the objects' metadata, but hooking it into the sync module itself could be interesting.
