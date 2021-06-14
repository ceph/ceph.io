---
title: "RGW/S3 Archive Zone goes upstream in Ceph"
date: "2019-02-14"
author: "admin"
tags: 
  - "planet"
---

![](images/20190215-az.jpg)

One of my recent contributions, [the new Ceph RGW/S3 archive zone](http://docs.ceph.com/docs/nautilus/radosgw/archive-sync-module/ "the new Ceph RGW/S3 archive zone"), was merged upstream a few days ago and will finally be available in [Ceph Nautilus](http://docs.ceph.com/docs/nautilus/releases/schedule/ "Ceph Nautilus"). The feature covers the need to provide archiving zones at the S3 object level in [multi-zone RGW configurations](http://docs.ceph.com/docs/nautilus/radosgw/multisite/).

This blog post describes the feature in detail together with some of the use cases considered during its development.

**The archive zone**

The 'zone' abstraction in Ceph/RGW appears with the need to add [multisite support](http://docs.ceph.com/docs/nautilus/radosgw/multisite/) in RGW with [Dumpling](http://docs.ceph.com/docs/nautilus/releases/dumpling/). This support was improved and completely rewritten to provide better performance and integration with the gateways in later versions.

Technically, the first version of multisite evolved from external replicating agents with some difficulties to be managed in an agile way to the latest version in Nautilus that has this functionality incorporated in the gateways themselves. Part of this development effort involved redesigning the model and the abstractions used, which at first were confusing for those users who had used the first version of multisite or had come to use the [AWS S3 service](https://aws.amazon.com/s3/ "AWS S3 service").

The new version of multisite is implemented with co-routines, which allow talking between the gateways asynchronously and efficiently. The new multisite version was also factored with the intention of separating the common part of the replication and the communication between the gateways of the specific replication functionality that the different replication use cases entail.

This separation between 'mechanism' and 'policy' gave rise to a set of modules ('policies') that instantiated through a zone allow flexible configuration of the replication behavior of the multisite framework. The modules, called [Sync modules](http://docs.ceph.com/docs/nautilus/radosgw/sync-modules/ "Sync modules"), are also flexible enough to implement use cases not only involving Ceph clusters but also involving external services. With Nautilus, there will be four modules available: [ElasticSearch Sync Module](http://docs.ceph.com/docs/nautilus/radosgw/elastic-sync-module/ "ElasticSearch Sync Module"), [Cloud Sync Module](http://docs.ceph.com/docs/nautilus/radosgw/cloud-sync-module/ "Cloud Sync Module"), [PubSub Sync Module](http://docs.ceph.com/docs/nautilus/radosgw/pubsub-module/ "PubSub Sync Module") and [Archive Sync Module](http://docs.ceph.com/docs/nautilus/radosgw/archive-sync-module/ "Archive Sync Module").

The archive module, therefore, implements a specific archive behavior associated with a zone within the RGW federation model.

**The RGW federation model and the archive zone**

The RGW federation model is supported by three fundamental logical abstractions: zone, zonegroup and realm/namespace.

![](images/20190215-rgw-fm-1.jpg)

The zone represents a collection of RADOS gateways that serve the content stored in a set of RADOS pools.

The zonegroup depicts a collection of zones with a relationship of replication between them (active/active, active/passive ...)

The realm, provides independent naming for users and buckets.

Something characteristic of the RGW federation model is that all zonegroups and zones replicate user and bucket index pool but only one zone serves as the leader to handle user and bucket creations/deletions.

![](images/20190215-rgw-fm-2.jpg)

With this model in place, RGW can be configured to work with different multi-site configurations (multi-zone, multi-zonegroup or multiple realms/namespaces).

Through the RGW sync archive module it is possible for a zone to archive all data and metadata updates, which come from the rest of the non-archive zones. These updates are stored as new versions of S3 objects.

**The S3 object versioning feature and the archive zone**

The archive zone enables the [RGW/S3 object versioning feature](/blog/2018/11/14/on-ceph-rgw-s3-object-versioning.html "RGW/S3 object versioning feature") by default and extends it to:

1. reduce the number of copies of S3 objects in federated configurations
2. protect and maintain a complete S3 object history beyond voluntary or involuntary updates of legitimate users in non-archive zones

The new code allows the S3 object versioning feature to be enabled in a single zone independently of the S3 versioning configuration of the other zones.

The synchronization process of the archive zone is independent of the rest of the zones and reacts adequately to metadata updates originated in the rest of the zones. It is important to keep in mind that among these metadata updates is the activation or suspension of versioning in buckets or the elimination of empty buckets in non-archive zones.

The management and administration of the versioned S3 objects is carried out through the gateway/s of the archive zone. In case the gateways in the archive zone are not accessible or remain protected from the end users, all updates will be non-destructive by creating new S3 objects.

The latter makes it possible to safeguard a history of S3 objects in a certain zone of the multi-site configuration and minimize the storage capacity required for versioning.

Including an archive zone in the configuration allows to have the flexibility of an S3 object history in one only zone while saving the space that the replicas of the versioned S3 objects would consume in the rest of the zones.

**The archive zone in action**

To review the behavior and administration of the archive zone, we will work with a geo-replication scenario (503.90 km) between two clusters located in Barcelona and Madrid.

![](images/20190215-az-sm.jpg)

In this scenario, the Barcelona cluster provides S3 objects service to end users. The Madrid cluster acts as an archive cluster.

The simplest configuration to represent this scenario would be formed by a single realm, a zonegroup and two zones ('bcn' and 'mad'). Each zone would be accessible through an endpoint.

![](images/20190215-fm-3.jpg)

We also use two auxiliary environment variables associated with the endpoints of Barcelona and Madrid.

export BCN=http://s3.rgw.barcelona
export MAD=http://s3.rgw.madrid

We started creating a bucket in the master zone and verified that it is available in both zones.

$ aws --endpoint=$BCN s3api create-bucket 
      --bucket test-bucket-1

$ aws --endpoint=$BCN s3api list-buckets
{
    "Owner": {
        "DisplayName": "Test User",
        "ID": "testuser1"
    },
    "Buckets": \[
        {
            "CreationDate": "2019-02-15T17:06:46.542Z",
            "Name": "test-bucket-1"
        }
    \]
}

$ aws --endpoint=$MAD s3api list-buckets
{
    "Owner": {
        "DisplayName": "Test User",
        "ID": "testuser1"
    },
    "Buckets": \[
        {
            "CreationDate": "2019-02-15T17:06:46.542Z",
            "Name": "test-bucket-1"
        }
    \]
}

The new bucket will be empty.

The versioning support is implemented lazily in the archive zone and therefore is not activated with the creation of a new bucket immediately.

$ aws --endpoint=$BCN s3api get-bucket-versioning 
      --bucket test-bucket-1

$ aws --endpoint=$MAD s3api get-bucket-versioning 
      --bucket test-bucket-1

We add a new object in the master zone and verify that it replicates properly in the archive zone.

$ aws --endpoint=$BCN s3api put-object 
      --bucket test-bucket-1 
      --key test-file-1-in 
      --body test-file-1-in
{
    "ETag": ""f7d53f25b67715fd4959eb7787de7902""
}

$ aws --endpoint=$BCN s3api list-objects 
      --bucket test-bucket-1
{
    "Contents": \[
        {
            "LastModified": "2019-02-15T17:08:11.372Z",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "Size": 141528
        }
    \]
}

$ aws --endpoint=$MAD s3api list-objects 
      --bucket test-bucket-1
{
    "Contents": \[
        {
            "LastModified": "2019-02-15T17:08:11.372Z",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "Size": 141528
        }
    \]
}

If we list the objects and their versions, we verify that the object in the master zone contains 'null' in the 'VersionId' field, since it is an unversioned bucket.

$ aws --endpoint=$BCN s3api list-object-versions 
      --bucket test-bucket-1
{
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:08:11.372Z",
            "VersionId": "null",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 141528
        }
    \]
}

In contrast, in the archive zone the object appears versioned as expected.

$ aws --endpoint=$MAD s3api list-object-versions 
      --bucket test-bucket-1
{
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:08:11.372Z",
            "VersionId": "uuBWDCNNTuE5Ia4mHO7Qivu9wro4uB.",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 141528
        }
    \]
}

We also verify that the replication of the first object created in an empty bucket within the master zone activates the object versioning support in the same bucket of the archive zone.

$ aws --endpoint=$BCN s3api get-bucket-versioning 
      --bucket test-bucket-1

$ aws --endpoint=$MAD s3api get-bucket-versioning 
      --bucket test-bucket-1
{
    "Status": "Enabled",
    "MFADelete": "Disabled"
}

Now we update the content of the object through the master zone.

$ aws --endpoint=$BCN s3api put-object 
      --bucket test-bucket-1 
      --key test-file-1-in 
      --body test-file-2-in
{
    "ETag": ""66c1aae4b4d46f1ab430a7c325c9c948""
}

We verify that the content update of the object takes place in the master zone by creating a second version of the object in the archive zone.

$ aws --endpoint=$BCN s3api list-object-versions 
      --bucket test-bucket-1
{
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:10:32.267Z",
            "VersionId": "null",
            "ETag": ""66c1aae4b4d46f1ab430a7c325c9c948"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 2301
        }
    \]
}

$ aws --endpoint=$MAD s3api list-object-versions 
      --bucket test-bucket-1
{
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:10:32.267Z",
            "VersionId": "R-IJMMfxRbUOAUFQi.c9YEMLiOt63dp",
            "ETag": ""66c1aae4b4d46f1ab430a7c325c9c948"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 2301
        },
        {
            "LastModified": "2019-02-15T17:08:11.372Z",
            "VersionId": "uuBWDCNNTuE5Ia4mHO7Qivu9wro4uB.",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 141528
        }
    \]
}

The deletion of the object in the master zone supposes that the object disappears from the master zone while the archive zone ignores the deletion.

As the bucket of the master zone is not versioned, the deletion of the object in the master zone does not create a delete marker in the archive zone.

$ aws --endpoint=$BCN s3api delete-object 
      --bucket test-bucket-1 --key test-file-1-in

$ aws --endpoint=$BCN s3api list-object-versions 
      --bucket test-bucket-1

$ aws --endpoint=$MAD s3api list-object-versions 
      --bucket test-bucket-1
{
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:10:32.267Z",
            "VersionId": "R-IJMMfxRbUOAUFQi.c9YEMLiOt63dp",
            "ETag": ""66c1aae4b4d46f1ab430a7c325c9c948"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 2301
        },
        {
            "LastModified": "2019-02-15T17:08:11.372Z",
            "VersionId": "uuBWDCNNTuE5Ia4mHO7Qivu9wro4uB.",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 141528
        }
    \]
}

If we proceed to delete the empty bucket through the master zone, the bucket will be deleted in the master zone.

In the archive zone the bucket, which is not empty, is renamed atomically following the format "bucket-name-deleted-hash".

In the calculation of the hash, unique values are included from the bucket metadata, such as the bucket creation date. This manages possible conflicts and collisions in the naming of buckets in the archive zone.

$ aws --endpoint=$BCN s3api list-object-versions 
      --bucket test-bucket-1

$ aws --endpoint=$BCN s3api delete-bucket 
      --bucket test-bucket-1

$ aws --endpoint=$BCN s3api list-buckets
{
    "Owner": {
        "DisplayName": "Test User",
        "ID": "testuser1"
    },
    "Buckets": \[\]
}

$ aws --endpoint=$MAD s3api list-buckets
{
    "Owner": {
        "DisplayName": "Test User",
        "ID": "testuser1"
    },
    "Buckets": \[
        {
            "CreationDate": "2019-02-15T17:06:46.542Z",
            "Name": "test-bucket-1-deleted-e18f855a5e705b087db7645aa327ae8c"
        }
    \]
}

$ aws --endpoint=$MAD s3api list-object-versions 
      --bucket test-bucket-1-deleted-e18f855a5e705b087db7645aa327ae8c
{
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:10:32.267Z",
            "VersionId": "R-IJMMfxRbUOAUFQi.c9YEMLiOt63dp",
            "ETag": ""66c1aae4b4d46f1ab430a7c325c9c948"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 2301
        },
        {
            "LastModified": "2019-02-15T17:08:11.372Z",
            "VersionId": "uuBWDCNNTuE5Ia4mHO7Qivu9wro4uB.",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 141528
        }
    \]
}

The recovery of versions of objects in the renamed buckets is carried out with the usual commands.

$ aws --endpoint=$MAD s3api get-object 
      --bucket test-bucket-1-deleted-e18f855a5e705b087db7645aa327ae8c 
      --key test-file-1-in 
      --version-id=uuBWDCNNTuE5Ia4mHO7Qivu9wro4uB. test-file-1-out
{
    "AcceptRanges": "bytes",
    "ContentType": "binary/octet-stream",
    "LastModified": "Wed, 20 Feb 2019 17:08:11 GMT",
    "ContentLength": 141528,
    "VersionId": "uuBWDCNNTuE5Ia4mHO7Qivu9wro4uB.",
    "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
    "StorageClass": "STANDARD",
    "Metadata": {}
}

$ md5sum test-file-1-\*
f7d53f25b67715fd4959eb7787de7902  test-file-1-in
f7d53f25b67715fd4959eb7787de7902  test-file-1-out

There is also the possibility that a user creates a new bucket through the master zone with a name that exists in the archive zone.

$ aws --endpoint=$BCN s3api create-bucket 
      --bucket test-bucket-1-deleted-e18f855a5e705b087db7645aa327ae8c

$ aws --endpoint=$BCN s3api list-buckets
{
    "Owner": {
        "DisplayName": "Test User",
        "ID": "testuser1"
    },
    "Buckets": \[
        {
            "CreationDate": "2019-02-15T17:18:47.409Z",
            "Name": "test-bucket-1-deleted-e18f855a5e705b087db7645aa327ae8c"
        }

}

In this case the archive zone code creates a new bucket with the same name that will capture the contents of the bucket with the same name in the master zone and rename the existing bucket replacing the old hash of its name with a new one.

$ aws --endpoint=$MAD s3api list-buckets
{
    "Owner": {
        "DisplayName": "Test User",
        "ID": "testuser1"
    },
    "Buckets": \[
        {
            "CreationDate": "2019-02-15T17:06:46.542Z",
            "Name": "test-bucket-1-deleted-5b68662853005d79e7b4fcde0698eb05"
        },
        {
            "CreationDate": "2019-02-15T17:18:47.409Z",
            "Name": "test-bucket-1-deleted-e18f855a5e705b087db7645aa327ae8c"
        }
    \]
}

In this case the creation of a new object in the bucket of the master zone will also be replicated to the corresponding bucket in the archive zone.

$ aws --endpoint=$BCN s3api put-object 
      --bucket test-bucket-1-deleted-e18f855a5e705b087db7645aa327ae8c 
      --key new-test-file-1-in
      --body test-file-1-in
{
    "ETag": ""f7d53f25b67715fd4959eb7787de7902""
}

$ aws --endpoint=$BCN s3api list-object-versions 
      --bucket test-bucket-1-deleted-e18f855a5e705b087db7645aa327ae8c
{
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:19:56.845Z",
            "VersionId": "null",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "new-test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 141528
        }
    \]
}

$ aws --endpoint=$MAD s3api list-object-versions 
      --bucket test-bucket-1-deleted-e18f855a5e705b087db7645aa327ae8c
{
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:19:56.845Z",
            "VersionId": "hXgSPnnrFZM79Auzzd28gbZjeYtEqK3",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "new-test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 141528
        }
    \]
}

We also check that the previous bucket contains the expected objects.

$ aws --endpoint=$MAD s3api list-object-versions 
      --bucket test-bucket-1-deleted-5b68662853005d79e7b4fcde0698eb05
{
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:10:32.267Z",
            "VersionId": "R-IJMMfxRbUOAUFQi.c9YEMLiOt63dp",
            "ETag": ""66c1aae4b4d46f1ab430a7c325c9c948"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 2301
        },
        {
            "LastModified": "2019-02-15T17:08:11.372Z",
            "VersionId": "uuBWDCNNTuE5Ia4mHO7Qivu9wro4uB.",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 141528
        }
    \]
}

There is also the possibility that we want to work with a versioned bucket in the master zone. To illustrate this case we created a fresh scenario.

$ aws --endpoint=$BCN s3api create-bucket 
      --bucket test-bucket-1

$ aws --endpoint=$BCN s3api get-bucket-versioning 
      --bucket test-bucket-1

$ aws --endpoint=$MAD s3api get-bucket-versioning 
      --bucket test-bucket-1

$ aws --endpoint=$BCN s3api put-object 
      --bucket test-bucket-1 
      --key test-file-1-in 
      --body test-file-1-in
{
    "ETag": ""f7d53f25b67715fd4959eb7787de7902""
}

$ aws --endpoint=$BCN s3api get-bucket-versioning 
      --bucket test-bucket-1

$ aws --endpoint=$MAD s3api get-bucket-versioning 
      --bucket test-bucket-1
{
    "Status": "Enabled",
    "MFADelete": "Disabled"
}

$ aws --endpoint=$MAD s3api list-object-versions 
      --bucket test-bucket-1
{
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:27:08.389Z",
            "VersionId": "BfxAPJzrXRWD1Bv8vQbt2PXsq.kUau2",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 141528
        }
    \]
}

We are now ready to activate the versioning in the master zone manually.

$ aws --endpoint=$BCN s3api put-bucket-versioning 
      --bucket test-bucket-1 --versioning-configuration Status=Enabled

$ aws --endpoint=$BCN s3api get-bucket-versioning 
      --bucket test-bucket-1
{
    "Status": "Enabled",
    "MFADelete": "Disabled"
}

And we update the existing object in the master zone. A new version of the object is added to the history of versions in the master zone.

$ aws --endpoint=$BCN s3api put-object 
      --bucket test-bucket-1 
      --key test-file-1-in 
      --body test-file-2-in
{
    "VersionId": "-1np210uBaLT5QdrooExGGhOE4PcmWE",
    "ETag": ""66c1aae4b4d46f1ab430a7c325c9c948""
}

$ aws --endpoint=$BCN s3api list-object-versions 
      --bucket test-bucket-1
{
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:29:57.564Z",
            "VersionId": "-1np210uBaLT5QdrooExGGhOE4PcmWE",
            "ETag": ""66c1aae4b4d46f1ab430a7c325c9c948"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 2301
        },
        {
            "LastModified": "2019-02-15T17:27:08.389Z",
            "VersionId": "null",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 141528
        }
    \]
}

And the new version of the object will be replicated within the versioned bucket in the archive zone.

$ aws --endpoint=$MAD s3api list-object-versions 
      --bucket test-bucket-1
{
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:29:57.564Z",
            "VersionId": "-1np210uBaLT5QdrooExGGhOE4PcmWE",
            "ETag": ""66c1aae4b4d46f1ab430a7c325c9c948"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 2301
        },
        {
            "LastModified": "2019-02-15T17:27:08.389Z",
            "VersionId": "BfxAPJzrXRWD1Bv8vQbt2PXsq.kUau2",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 141528
        }
    \]
}

Now we proceed to eliminate the object in the versioned master zone generating a delete-marker.

$ aws --endpoint=$BCN s3api delete-object 
      --bucket test-bucket-1 
      --key test-file-1-in
{
    "VersionId": "sT704ipTKzG1sQZIvwDWDVeo7Hf0rG0",
    "DeleteMarker": true
}

The delete marker does not only appear in the master zone. It is also added in the archive zone.

$ aws --endpoint=$BCN s3api list-object-versions 
      --bucket test-bucket-1
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "VersionId": "sT704ipTKzG1sQZIvwDWDVeo7Hf0rG0",
            "Key": "test-file-1-in",
            "LastModified": "2019-02-15T17:31:09.153Z"
        }
    \],
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:29:57.564Z",
            "VersionId": "-1np210uBaLT5QdrooExGGhOE4PcmWE",
            "ETag": ""66c1aae4b4d46f1ab430a7c325c9c948"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 2301
        },
        {
            "LastModified": "2019-02-15T17:27:08.389Z",
            "VersionId": "null",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 141528
        }
    \]
}

$ aws --endpoint=$MAD s3api list-object-versions 
      --bucket test-bucket-1
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "VersionId": "sT704ipTKzG1sQZIvwDWDVeo7Hf0rG0",
            "Key": "test-file-1-in",
            "LastModified": "2019-02-15T17:31:09.153Z"
        }
    \],
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:29:57.564Z",
            "VersionId": "-1np210uBaLT5QdrooExGGhOE4PcmWE",
            "ETag": ""66c1aae4b4d46f1ab430a7c325c9c948"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 2301
        },
        {
            "LastModified": "2019-02-15T17:27:08.389Z",
            "VersionId": "BfxAPJzrXRWD1Bv8vQbt2PXsq.kUau2",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 141528
        }
    \]
}

In the event that we want to delete the delete marker in the non-archive zone, it will be removed only from the non-archive zone making visible the status of the previous object version. The delete marker will be retained in the archive zone.

$ aws --endpoint=$BCN s3api delete-object 
      --bucket test-bucket-1 
      --key test-file-1-in 
      --version-id sT704ipTKzG1sQZIvwDWDVeo7Hf0rG0
{
    "VersionId": "sT704ipTKzG1sQZIvwDWDVeo7Hf0rG0",
    "DeleteMarker": true
}

$ aws --endpoint=$BCN s3api list-object-versions 
      --bucket test-bucket-1
{
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:29:57.564Z",
            "VersionId": "-1np210uBaLT5QdrooExGGhOE4PcmWE",
            "ETag": ""66c1aae4b4d46f1ab430a7c325c9c948"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 2301
        },
        {
            "LastModified": "2019-02-15T17:27:08.389Z",
            "VersionId": "null",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 141528
        }
    \]
}

$ aws --endpoint=$MAD s3api list-object-versions 
      --bucket test-bucket-1
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "VersionId": "sT704ipTKzG1sQZIvwDWDVeo7Hf0rG0",
            "Key": "test-file-1-in",
            "LastModified": "2019-02-15T17:31:09.153Z"
        }
    \],
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:29:57.564Z",
            "VersionId": "-1np210uBaLT5QdrooExGGhOE4PcmWE",
            "ETag": ""66c1aae4b4d46f1ab430a7c325c9c948"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 2301
        },
        {
            "LastModified": "2019-02-15T17:27:08.389Z",
            "VersionId": "BfxAPJzrXRWD1Bv8vQbt2PXsq.kUau2",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 141528
        }
    \]
}

We can also delete the delete marker from the archive zone to recover the state of the previous object.

$ aws --endpoint=$MAD s3api delete-object 
      --bucket test-bucket-1 
      --key test-file-1-in 
      --version-id sT704ipTKzG1sQZIvwDWDVeo7Hf0rG0
{
    "VersionId": "sT704ipTKzG1sQZIvwDWDVeo7Hf0rG0",
    "DeleteMarker": true
}

$ aws --endpoint=$MAD s3api list-object-versions 
      --bucket test-bucket-1
{
    "Versions": \[
        {
            "LastModified": "2019-02-15T17:29:57.564Z",
            "VersionId": "-1np210uBaLT5QdrooExGGhOE4PcmWE",
            "ETag": ""66c1aae4b4d46f1ab430a7c325c9c948"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 2301
        },
        {
            "LastModified": "2019-02-15T17:27:08.389Z",
            "VersionId": "BfxAPJzrXRWD1Bv8vQbt2PXsq.kUau2",
            "ETag": ""f7d53f25b67715fd4959eb7787de7902"",
            "StorageClass": "STANDARD",
            "Key": "test-file-1-in",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 141528
        }
    \]
}

**Wrapping up**

After evaluating the requirements and new archiving needs for S3 objects in the RGW federation model, the feature was finally implemented as a [Sync module](http://docs.ceph.com/docs/nautilus/radosgw/sync-modules/) using the multisite framework.

This approach allowed to encapsulate most of the functionality in a new module and make use of the replication facilities of the framework, thus avoiding starting from scratch.

The functionality also required extending the multisite framework to support mechanisms and primitives that until now had not been necessary in other modules. These new modifications in the framework were essentially made to support a coherent and deterministic replication between buckets that may or may not be versioned in a non-archive zone, but which we want to be lazily versioned in an archive zone.

Special care had to be taken with the handling of empty buckets and the replication of metadata that required atomic bucket renaming.

In relation to the specification of the [Amazon S3 Object Versioning feature](https://docs.aws.amazon.com/AmazonS3/latest/dev/ObjectVersioning.html), the [original functionality implemented in RGW](/blog/2018/11/14/on-ceph-rgw-s3-object-versioning.html) continues to work in the same way.

The new feature (archive module + framework modifications) is an extension of the original functionality adapted to work with the RGW federation model at the zone level. The configuration and handling of the archive zone takes place through the tool 'radosgw-admin' and the endpoint/s associated with the archive zone.

Given the number, size and level of integration of the current S3 features implemented in RGW, exhaustive testing of the archive zone is challenging. Only the most common use cases of archiving between zones involving S3 Object Versioning were tested.

Among the next actions, it is considered to review and extend the multisite testing-suite for the inclusion of new testing cases that support the archive zone.

**Acknowledgments**

My work in [Ceph](http://www.ceph.com "Ceph") has been made possible by [Igalia](http://www.igalia.com "Igalia") and the invaluable help of the [Ceph development team](http://tracker.ceph.com/projects/rgw "Ceph development team"). My deep thanks to [Yehuda](https://ceph.com/team/#yehuda-sadeh "Yehuda Sadeh") for all the feedback and support to go upstream.

See you in [Cephalocon Barcelona](https://ceph.com/cephalocon/barcelona-2019/ "Cephalocon Barcelona 2019")!

![](images/20170628-igalia-ceph.png "Igalia - Ceph")

**Related posts**

- [On Ceph RGW/S3 Object Versioning](/blog/2018/11/14/on-ceph-rgw-s3-object-versioning.html "On Ceph RGW/S3 Object Versioning")
- [AWS4 browser-based upload goes upstream in Ceph](/blog/2017/06/28/aws4-browser-based-upload-goes-upstream-in-ceph.html "AWS4 browser-based upload goes upstream in Ceph")
- [Ceph RGW AWS4 presigned URLs working with the Minio Cloud client](/blog/2016/12/16/ceph-rgw-aws4-presigned-urls-working-with-the-minio-cloud-client.html "Ceph RGW AWS4 presigned URLs working with the Minio Cloud client")
- [Multipart Upload (Copy part) goes upstream in Ceph](/blog/2016/10/12/multipart-upload-copy-part-goes-upstream-in-ceph.html "Multipart Upload (Copy part) goes upstream in Ceph")
- [AWS4 chunked upload goes upstream in Ceph RGW S3](/blog/2016/08/31/aws4-chunked-upload-goes-upstream-in-ceph-rgw-s3.html "AWS4 chunked upload goes upstream in Ceph RGW S3")
- [Ansible AWS S3 core module now supports Ceph RGW S3](/blog/2016/06/21/ansible-aws-s3-core-module-now-supports-ceph-rgw-s3.html "Ansible AWS S3 core module now supports Ceph RGW S3")
- [The Ceph RGW storage driver goes upstream in Libcloud](/blog/2016/05/17/the-ceph-rgw-storage-driver-goes-upstream-in-libcloud.html "The Ceph RGW storage driver goes upstream in Libcloud")
- [Scalable placement of replicated data in Ceph](/blog/2016/04/30/scalable-placement-of-replicated-data-in-ceph.html "Scalable placement of replicated data in Ceph")
- [Requester Pays Bucket goes upstream in Ceph](/blog/2016/03/15/requester-pays-bucket-goes-upstream-in-ceph.html "Requester Pays Bucket goes upstream in Ceph")
- [AWS Signature Version 4 goes upstream in Ceph](/blog/2016/03/01/aws-signature-version-4-goes-upstream-in-ceph.html "AWS Signature Version 4 goes upstream in Ceph")
- [More blog posts on Ceph ...](/blog/tag/ceph.html "More blog posts on Ceph ...")

Source: Javier Munoz ([RGW/S3 Archive Zone goes upstream in Ceph](http://javiermunhoz.com/blog/2019/02/15/rgw-s3-archive-zone-goes-upstream-in-ceph.html))
