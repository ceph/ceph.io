---
title: "New in Luminous: RGW Metadata Search"
date: "2017-09-07"
author: "yehuda"
tags: 
  - "luminous"
  - "rgw"
---

RGW metadata search is a new feature that was added in Ceph Luminous.  It enables integration with Elasticsearch to provide a search API to query an object store based on object metadata.

### A new zone type

A _zone_ in the RGW multisite system is a set of radosgw daemons serving the same data, backed by the same set of RADOS pools in Ceph.  Multiple zones that are placed in the same _zonegroup_ mirror each others data.  In most cases there is a zone per cluster and multiple Ceph clusters in different data centers or geographies are federated.

As part of this new multisite architecture we introduced a way to create new tiers or zone types.  New _sync modules_ can now also send a copy of the data--or metadata--to a different data tier. Enter Elasticsearch, which can now be used to  index the metadata of all objects in a zonegroup. A zonegroup can then contain some zones storing copies of all of the objects (and serving them up via radosgw) and some indexing the object metadata in Elasticsearch.

For example, we can create a zonegroup that has three zones: zone _A_, zone _B_, and zone _M_. Zone _A_ and zone _B_ are data zones. Users will create buckets there, upload objects to them, and so on. Zone _M_ will be a metadata search zone. Whenever data is written to zone _A_ or _B_ the elasticsearch sync module will push the a copy of the metadata to Elasticsearch.

One of the main questions we had when designing this features was whether we should involve RGW with the search queries, or whether that should be left for the users to deal with (presumably by accessing Elasticsearch directly). We concluded it would be much better in terms of user experience if we served as a proxy between users and Elasticsearch and managed the queries ourselves. This allows us to provide a more consistent experience, and solves the authentication and authorization problems. End users do not have access to Elasticsearch, and we make sure that the queries that are sent to Elasticsearch request only data that the users are permitted to read.

Below is a summary of the new APIs and new configurables, followed by a real-world configuration example.

### New RESTful APIs

New REST APIs were added to RGW in order to use and control metadata search:

#### _Query metadata_

The request needs to be sent to the RGW that is located on the Elasticsearch tier zone.

Input:

> GET /\[<bucket>\]?query=<expression>

Request params:

- **max-keys**: max number of entries to return
- **marker**: result pagination marker

The query _expression_ takes the form:

> \[(\]<arg> <op> <value> \[)\]\[<and|or> ...\]

where the _op_ can be any of

> <, _<=, ==, >=, >_

For example:

> GET /?query=name==foo

Will return all the indexed keys that user has read permission to, and are named 'foo'.

The output will be a list of keys in XML that is similar to the S3 list buckets response.

#### Configure custom metadata fields

Define which custom metadata entries should be indexed under the specified bucket, along with the types of the keys. If explicit custom metadata indexing is configured, this is needed so that RGW will index the specified custom metadata values. Otherwise it is needed in cases where the indexed metadata keys are of a type other than string.

Note that this request needs to be sent to the metadata master zone.

Input:

> PUT /<bucket>?mdsearch

HTTP headers:

> X-Amz-Meta-Search: <key \[; type\]> \[, ...\]

Where key is x-amz-meta-<name>, and type is one of the following: _string, integer, date._

#### Delete custom metadata configuration

Delete custom metadata bucket configuration.  This request should be sent to the metadata master zone.

Input:

> DELETE /<bucket>?mdsearch

#### Get custom metadata configuration

Retrieve custom metadata bucket configuration.

Input:

> GET /<bucket>?mdsearch

### Elasticsearch tier zone configurables

The following configurables are now defined:

- **endpoint**: Specifies the Elasticsearch server endpoint to access
- **num\_shards** (integer): The number of shards that Elasticsearch will be configured with on data sync initialization. Note that this cannot be changed after init. Any change here requires rebuild of the Elasticsearch index and reinit of the data sync process.
- **num\_replicas** (integer): The number of the replicas that Elasticsearch will be configured with on data sync initialization.
- **explicit\_custom\_meta** (true | false): Specifies whether all user custom metadata will be indexed, or whether user will need to configure (at the bucket level) what custom metadata entries should be indexed. This is false by default.
- **index\_buckets\_list** (comma separated list of strings): If empty, all buckets will be indexed. Otherwise, only buckets specified here will be indexed. It is possible to provide bucket prefixes (e.g., foo\*), or bucket suffixes (e.g., \*bar).
- **approved\_owners\_list** (comma separated list of strings): If empty, buckets of all owners will be indexed (subject to other restrictions), otherwise, only buckets owned by specified owners will be indexed. Suffixes and prefixes can also be provided.
- **override\_index\_path** (string): if not empty, this string will be used as the elasticsearch index path. Otherwise the index path will be determined and generated on sync initialization.

### Configuration example

Here is a simple configuration in which we create a new realm, with a single zonegroup, and have two zones in that zonegroup: a data zone and a metadata search zone. Both zones will run on the same Ceph cluster.

#### Naming

For the purposes of this example, we use the following zone information:

> **realm**: _gold_ **zonegroup**: _us_ **data zone**: _us-east-1_ **metadata search zone**: _us-east-es_

#### Prerequisites

- Ceph Luminous cluster
- Elasticsearch configured.  We will assume it runs on the same machine as radosgw, listening to default port 9200

#### System Keys

Similar to a regular multisite configuration, we will need to define system keys for cross radosgw communications:

> $ SYSTEM\_ACCESS\_KEY=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 20 | head -n 1)
> $ SYSTEM\_SECRET\_KEY=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 40 | head -n 1)
> $ RGW\_HOST=<host>

#### Create a realm

> $ radosgw-admin realm create --rgw-realm=gold --default

#### Remove default zone

This is only needed if the default zone was generated (e.g., because radosgw was already started).

> $ radosgw-admin zonegroup delete --rgw-zonegroup=default

#### Create zonegroup

The zonegroup will contain both the data zone and the Elasticsearch zone, which will share the same data set.

> $ radosgw-admin zonegroup create --rgw-zonegroup=us \\
>   --endpoints=http://${RGW\_HOST}:8000 --master --default
>  {
>      "id": "db23c836-9184-4090-a6dc-8bb0489c72ba",
>      "name": "us",
>      "api\_name": "us",
>      "is\_master": "true",
>      "endpoints": \[
>          "http:\\/\\/<RGW\_HOST>:8000"
>      \],
>      "hostnames": \[\],
>      "hostnames\_s3website": \[\],
>      "master\_zone": "",
>      "zones": \[\],
>      "placement\_targets": \[\],
>      "default\_placement": "",
>      "realm\_id": "0fea4ced-14fb-436d-8a4d-3d362adcf4e1"
>  }

#### Create zone

Here we create the normal zone that will store the object data.

> $ radosgw-admin zone create --rgw-zonegroup=us --rgw-zone=us-east-1 \\
>   --endpoints=http://${RGW\_HOST}:8000 --access-key=$SYSTEM\_ACCESS\_KEY \\
>   --secret=$SYSTEM\_SECRET\_KEY --default --master
>  {
>      "id": "a9b9e45a-4fa6-49e8-9236-db31e84169b8",
>      "name": "us-east-1",
>      "domain\_root": "us-east-1.rgw.meta:root",
>      "control\_pool": "us-east-1.rgw.control",
>      "gc\_pool": "us-east-1.rgw.log:gc",
>      "lc\_pool": "us-east-1.rgw.log:lc",
>      "log\_pool": "us-east-1.rgw.log",
>      "intent\_log\_pool": "us-east-1.rgw.log:intent",
>      "usage\_log\_pool": "us-east-1.rgw.log:usage",
>      "user\_keys\_pool": "us-east-1.rgw.meta:users.keys",
>      "user\_email\_pool": "us-east-1.rgw.meta:users.email",
>      "user\_swift\_pool": "us-east-1.rgw.meta:users.swift",
>      "user\_uid\_pool": "us-east-1.rgw.meta:users.uid",
>      "system\_key": {
>          "access\_key": "NgKnw4Q9ocFUJUykxHiu",
>          "secret\_key": "QahZhmhRg12oiKOq1bVsO6qO43Yqd8OMu8jrwVSq"
>      },
>      "placement\_pools": \[
>          {
>              "key": "default-placement",
>              "val": {
>                  "index\_pool": "us-east-1.rgw.buckets.index",
>                  "data\_pool": "us-east-1.rgw.buckets.data",
>                  "data\_extra\_pool": "us-east-1.rgw.buckets.non-ec",
>                  "index\_type": 0,
>                  "compression": ""
>              }
>          }
>      \],
>      "metadata\_heap": "",
>      "tier\_config": \[\],
>      "realm\_id": "0fea4ced-14fb-436d-8a4d-3d362adcf4e1"
>  }

#### Create system user

The system user will be used to access the radosgw REST API.

> $ radosgw-admin user create --uid=zone.user --display-name="Zone User" \\
>     --access-key=$SYSTEM\_ACCESS\_KEY --secret=$SYSTEM\_SECRET\_KEY --system
>  {
>      "user\_id": "zone.user",
>      "display\_name": "Zone User",
>      "email": "",
>      "suspended": 0,
>      "max\_buckets": 1000,
>      "auid": 0,
>      "subusers": \[\],
>      "keys": \[
>          {
>              "user": "zone.user",
>              "access\_key": "NgKnw4Q9ocFUJUykxHiu",
>              "secret\_key": "QahZhmhRg12oiKOq1bVsO6qO43Yqd8OMu8jrwVSq"
>          }
>      \],
>      "swift\_keys": \[\],
>      "caps": \[\],
>      "op\_mask": "read, write, delete",
>      "system": "true",
>      "default\_placement": "",
>      "placement\_tags": \[\],
>      "bucket\_quota": {
>          "enabled": false,
>          "check\_on\_raw": false,
>          "max\_size": -1,
>          "max\_size\_kb": 0,
>          "max\_objects": -1
>      },
>      "user\_quota": {
>          "enabled": false,
>          "check\_on\_raw": false,
>          "max\_size": -1,
>          "max\_size\_kb": 0,
>          "max\_objects": -1
>      },
>      "temp\_url\_keys": \[\],
>      "type": "rgw"
>  }

#### Update the period

This commits the federation changes we've proposed so that the zones will start talking to each other.

> $ radosgw-admin period update --commit
> 
> {
>      "id": "96535dc9-cb15-4c3d-96a1-d661a2f6e71f",
>      "epoch": 1,
>      "predecessor\_uuid": "691ebbf4-7104-4c78-aa42-7d20061e31ff",
>      "sync\_status": \[
>  ...
>      "realm\_id": "0fea4ced-14fb-436d-8a4d-3d362adcf4e1",
>      "realm\_name": "gold",
>      "realm\_epoch": 2
>  }

#### Start RGW

Note that this step may vary, depending on the specific OS and environment.  One way to do it:

> $ radosgw --rgw-frontends="civetweb port=8000" \\
>   --log-file=/var/log/ceph/radosgw-us-east-1.log

#### Configure second zone in the same cluster, used for metadata indexing

This is the "zone" (i.e., radosgw daemon(s)) that will be sending metadata to Elasticsearch.

> $ radosgw-admin zone create --rgw-zonegroup=us --rgw-zone=us-east-es \\
>   --access-key=$SYSTEM\_ACCESS\_KEY --secret=$SYSTEM\_SECRET\_KEY \\
>   --endpoints=http://${RGW\_HOST}:8002
>  {
>      "id": "24b0a61c-8a99-4f30-9bce-a99900dba818",
>      "name": "us-east-es",
>      "domain\_root": "us-east-es.rgw.meta:root",
>      "control\_pool": "us-east-es.rgw.control",
>      "gc\_pool": "us-east-es.rgw.log:gc",
>      "lc\_pool": "us-east-es.rgw.log:lc",
>      "log\_pool": "us-east-es.rgw.log",
>      "intent\_log\_pool": "us-east-es.rgw.log:intent",
>      "usage\_log\_pool": "us-east-es.rgw.log:usage",
>      "user\_keys\_pool": "us-east-es.rgw.meta:users.keys",
>      "user\_email\_pool": "us-east-es.rgw.meta:users.email",
>      "user\_swift\_pool": "us-east-es.rgw.meta:users.swift",
>      "user\_uid\_pool": "us-east-es.rgw.meta:users.uid",
>      "system\_key": {
>          "access\_key": "NgKnw4Q9ocFUJUykxHiu",
>          "secret\_key": "QahZhmhRg12oiKOq1bVsO6qO43Yqd8OMu8jrwVSq"
>      },
>      "placement\_pools": \[
>          {
>              "key": "default-placement",
>              "val": {
>                  "index\_pool": "us-east-es.rgw.buckets.index",
>                  "data\_pool": "us-east-es.rgw.buckets.data",
>                  "data\_extra\_pool": "us-east-es.rgw.buckets.non-ec",
>                  "index\_type": 0,
>                  "compression": ""
>              }
>          }
>      \],
>      "metadata\_heap": "",
>      "tier\_config": \[\],
>      "realm\_id": "0fea4ced-14fb-436d-8a4d-3d362adcf4e1"
>  }

#### Elasticsearch related zone configuration

Here we specify that this zone is of type _elasticsearch_ and specify the endpoint for the local Elasticsearch API.

> $ radosgw-admin zone modify --rgw-zone=us-east-es \\
>   --tier-type=elasticsearch \\
>   --tier-config=endpoint=[http://localhost:9200](http://localhost:9200),num\_shards=10,num\_replicas=1
>  {
>      "id": "24b0a61c-8a99-4f30-9bce-a99900dba818",
>      "name": "us-east-es"
>  ...
>      "tier\_config": \[
>          {
>              "key": "endpoint",
>              "val": "http:\\/\\/localhost:9200"
>          },
>          {
>              "key": "num\_replicas",
>              "val": "1"
>          },
>          {
>              "key": "num\_shards",
>              "val": "10"
>          }
>      \],
>      "realm\_id": "0fea4ced-14fb-436d-8a4d-3d362adcf4e1"
>  }

#### Update period

These changes also need to be committed:

> $ radosgw-admin period update --commit
> ...

#### Start second RGW

Again, this may vary in your environment.  One way to do it:

> $ radosgw --rgw-zone=us-east-es --rgw-frontends="civetweb port=8002" \\
>   --log-file=/var/log/ceph/radosgw-us-east-es.log

#### Create a user, upload stuff

> $ radosgw-admin user create --uid=yehsad --display-name=yehuda
> ...

Here we use obo tool (can be found here: [https://github.com/ceph/obo](https://github.com/yehudasa/obo)) to create buckets and upload some data. This is just an example and users can upload data using any S3 or Swift compatible client tool.  You will need to fill in the access key and secret based on the output of the user create command.

> $ export S3\_ACCESS\_KEY\_ID=...
> $ export S3\_SECRET\_ACCESS\_KEY=...
> $ export S3\_HOSTNAME=$RGW\_HOST:8000
> $ obo create buck
> $ obo put buck/foo --in-file=foo
> $ obo put buck/foo1 --in-file=foo

#### Query metadata

The metadata search operation is implemented in obo, and it can be used as follows.  First, make sure we point obo at the correct radosgw, and then submit a query:

> $ export S3\_HOSTNAME=$RGW\_HOST:8002
> $ obo mdsearch buck --query='name>=foo1'
> {
>      "SearchMetadataResponse": {
>          "Marker": {},
>          "IsTruncated": "false",
>          "Contents": \[
>              {
>                  "Bucket": "buck",
>                  "Key": "foo2",
>                  "Instance": "null",
>                  "LastModified": "2017-04-06T23:18:39.053Z",
>                  "ETag": "\\"7748956db0bddb51a2bb81a26395ff98\\"",
>                  "Owner": {
>                      "ID": "yehsad",
>                      "DisplayName": "yehuda"
>                  },
>                  "CustomMetadata": {}
>              },
>              {
>                  "Bucket": "buck",
>                  "Key": "foo1",
>                  "Instance": "null",
>                  "LastModified": "2017-04-06T23:18:15.029Z",
>                  "ETag": "\\"7748956db0bddb51a2bb81a26395ff98\\"",
>                  "Owner": {
>                      "ID": "yehsad",
>                      "DisplayName": "yehuda"
>                  },
>                  "CustomMetadata": {}
>              }
>          \]
>      }
>  }

#### Configure custom metadata

By default we don't index any custom metadata. We can turn on custom metadata indexing on a bucket by the following obo command:

> $ obo mdsearch buck --config='x-amz-meta-foo; string, x-amz-meta-bar; integer'

Note that this will only apply to new data (indexing old data will require re-initializing the sync process on the specific bucket).

#### Query metadata again

Upload a few more objects, this time with custom metadata:

> $ obo put buck/foo3 --in-file=LICENSE --x-amz-meta foo=abc bar=12
> $ obo put buck/foo4 --in-file=LICENSE --x-amz-meta foo=bbb bar=8
> $ obo put buck/foo2 --in-file=LICENSE --x-amz-meta foo=aaa

and we can run the following query:

> $ obo mdsearch buck --query='x-amz-meta-foo==aaa or x-amz-meta-bar < 12'
> {
>      "SearchMetadataResponse": {
>          "Marker": {},
>          "IsTruncated": "false",
>          "Contents": \[
>              {
>                  "Bucket": "buck",
>                  "Key": "foo4",
>                  "Instance": "null",
>                  "LastModified": "2017-04-07T00:04:15.584Z",
>                  "ETag": "\\"7748956db0bddb51a2bb81a26395ff98\\"",
>                  "Owner": {
>                      "ID": "yehsad",
>                      "DisplayName": "yehuda"
>                  },
>                  "CustomMetadata": {
>                      "Entry": \[
>                          {
>                              "Name": "foo",
>                              "Value": "bbb"
>                          },
>                          {
>                              "Name": "bar",
>                              "Value": "8"
>                          }
>                      \]
>                  }
>              },
>              {
>                  "Bucket": "buck",
>                  "Key": "foo2",
>                  "Instance": "null",
>                  "LastModified": "2017-04-07T00:05:00.666Z",
>                  "ETag": "\\"7748956db0bddb51a2bb81a26395ff98\\"",
>                  "Owner": {
>                      "ID": "yehsad",
>                      "DisplayName": "yehuda"
>                  },
>                  "CustomMetadata": {
>                      "Entry": {
>                          "Name": "foo",
>                          "Value": "aaa"
>                      }
>                  }
>              }
>          \]
>      }
>  }

### Conclusion

With minimal configuration, RGW can leverage Elasticsearch to query your object store based on basic metadata (like object names). With a bit more effort it can be used to index based on custom metadata fields that may be in use in your environment.

This is implemented on top of the RGW multisite infrastructure, which is proving to be quite flexible. Stay tuned in future releases for sync plugins that replicate data to (or even from) cloud storage services like S3!
