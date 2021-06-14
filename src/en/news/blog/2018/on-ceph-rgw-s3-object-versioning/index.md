---
title: "On Ceph RGW/S3 Object Versioning"
date: "2018-11-13"
author: "admin"
tags: 
  - "planet"
---

![](images/20181114-ovl.png)

In the last few months I spent some time reviewing the [Object Versioning](https://docs.aws.amazon.com/AmazonS3/latest/dev/ObjectVersioning.html) feature originally designed for [AWS S3](https://aws.amazon.com/s3/ "AWS S3"), the implementation that is available from [Ceph Hammer 0.94](http://docs.ceph.com/docs/master/releases/hammer/#v0-94-hammer) and the user experience with S3 clients.

I found it useful to compile a description of the feature in a short entry, as well as review the main use cases along with examples to have them on hand and share them easily.

The examples use the official [AWS CLI (s3api set)](https://docs.aws.amazon.com/cli/latest/userguide/using-s3api-commands.html) and are organized based on the states in which the bucket can be found.

The deployed backend is [Ceph RGW S3](http://docs.ceph.com/docs/master/radosgw/s3/) / [Mimic](http://docs.ceph.com/docs/master/releases/schedule/)

To facilitate the follow-up of the examples, some of them use the state / configuration of the previous example, although the status / configuration is not reused between major use cases.

**Note:** To quickly explore the use cases and examples feel free to use the following quick links:

- [Overview](#overview)
- [On object addition](#on-object-addition)
- [On object retrieval](#on-object-retrieval)
- [On object removal](#on-object-removal)
- [On object restoration](#on-object-restoration)
- [On delete marker](#on-delete-marker)
- [On suspended buckets](#on-suspended-buckets)

**Overview**

[Object Versioning as described in AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/ObjectVersioning.html "Object Versioning") is used to store multiple copies of an object within the same bucket. Each of these copies corresponds to the content of the object at a specific moment in the past. This functionality can be used to protect the objects of a bucket against overwriting or accidental deletion.

This functionality, which allows a historical record of the objects in a bucket, requires that it be enabled at the bucket level, thus giving rise to three different states of the bucket: 'unversioned', 'versioning enabled' or 'versioning suspended'.

When a bucket is created, it is always in the 'unversioned state'.

When the functionality is enabled, the bucket can switch between the states 'versioning enabled' or 'versioning suspended' but can not return to the state 'unversioned state', that is, you can not disable the versioning of the bucket once it is enabled. It can only be suspended.

Each version of an object is identified through a VersionID. When the bucket is not versioned, the VersionID will be a null value. In a versioned bucket, updating an object through a PUT request will store a new object with an unique VersionID.

Access to a version of an object in a bucket can be done through its name or combination name and VersionID. In the case of accessing by name only, the most recent version of the object will be recovered.

In the case of deleting an object in a versioned bucket, access attempts, through GET requests, will return an error, unless a VersionID is included. To restore a deleted object it is not necessary to download and upload the object. It is sufficient to issue a COPY operation including a specific VersionID.

To test the versioning of objects we can use the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html "AWS CLI"), an open source tool that provides commands to interact with AWS services from a terminal program.

Specifically we will use the AWS CLI's API-level commands, contained in the [s3api command set](https://docs.aws.amazon.com/cli/latest/userguide/using-s3api-commands.html "s3api command set").

[\[return to quick links\]](#quick-links)

**On object addition**

For non versioned bucket, if an object with the same key is uploaded it overwrites the object:

$ aws --endpoint=http://rgw:8080 s3api create-bucket 
      --bucket test-bucket

$ aws --endpoint=http://rgw:8080 s3api put-object 
      --bucket test-bucket --key test-key-1 --body /tmp/test-1
{
    "ETag": ""f3b92d795c9ee0725c160680acd084d9""
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T11:00:33.427Z",
            "VersionId": "null",
            "ETag": ""f3b92d795c9ee0725c160680acd084d9"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 126584
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api put-object 
      --bucket test-bucket --key test-key-1 --body /tmp/test-2
{
    "ETag": ""b9c85244be9733bc79eca588db7bf306""
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T11:01:00.522Z",
            "VersionId": "null",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 151024
        }
    \]
}

For versioned bucket, if an object with the same key is uploaded the new uploaded object becomes the current version and the previous object becomes the non current version:

$ aws --endpoint=http://rgw:8080 s3api get-bucket-versioning 
      --bucket test-bucket

$ aws --endpoint=http://rgw:8080 s3api put-bucket-versioning 
      --bucket test-bucket --versioning-configuration Status=Enabled

$ aws --endpoint=http://rgw:8080 s3api get-bucket-versioning 
      --bucket test-bucket
{
    "Status": "Enabled",
    "MFADelete": "Disabled"
}

$ aws --endpoint=http://rgw:8080 s3api put-object 
      --bucket test-bucket --key test-key-1 --body /tmp/test-4
{
    "VersionId": ".CdpeAdFdcwp-QZlmNnWjtJJpDacSmW",
    "ETag": ""0cdfdd010d5f4acab64a1d89066c92e9""
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T11:09:04.955Z",
            "VersionId": ".CdpeAdFdcwp-QZlmNnWjtJJpDacSmW",
            "ETag": ""0cdfdd010d5f4acab64a1d89066c92e9"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 130488
        },
        {
            "LastModified": "2018-11-14T11:01:00.522Z",
            "VersionId": "null",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 151024
        }
    \]
}

[\[return to quick links\]](#quick-links)

**On object retrieval**

For non versioned bucket, an object retrieval always returns the only object available:

$ aws --endpoint=http://rgw:8080 s3api create-bucket 
      --bucket test-bucket-1

$ aws --endpoint=http://rgw:8080 s3api get-bucket-versioning 
      --bucket test-bucket-1

$ aws --endpoint=http://rgw:8080 s3api put-object 
      --bucket test-bucket-1 --key test-key-1 --body /tmp/test-2
{
    "ETag": ""b9c85244be9733bc79eca588db7bf306""
}

$ aws --endpoint=http://rgw:8080 s3api get-object 
      --bucket test-bucket-1 --key test-key-1 test-key-1.out
{
    "AcceptRanges": "bytes",
    "ContentType": "binary/octet-stream",
    "LastModified": "Tue, 20 Nov 2018 11:15:53 GMT",
    "ContentLength": 151024,
    "ETag": ""b9c85244be9733bc79eca588db7bf306"",
    "Metadata": {}
}

For versioned bucket, an object retrieval returns the current object:

$ aws --endpoint=http://rgw:8080 s3api put-bucket-versioning 
      --bucket test-bucket-1 --versioning-configuration Status=Enabled

$ aws --endpoint=http://rgw:8080 s3api put-object 
      --bucket test-bucket-1 --key test-key-1 --body /tmp/test-1
{
    "VersionId": "1pEZmxXbgJ5ypMQSEfwEqygDxECveeS",
    "ETag": ""f3b92d795c9ee0725c160680acd084d9""
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-1
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T11:21:35.603Z",
            "VersionId": "1pEZmxXbgJ5ypMQSEfwEqygDxECveeS",
            "ETag": ""f3b92d795c9ee0725c160680acd084d9"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 126584
        },
        {
            "LastModified": "2018-11-14T11:15:53.164Z",
            "VersionId": "null",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 151024
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api get-object 
      --bucket test-bucket-1 --key test-key-1 test-key-1.out
{
    "AcceptRanges": "bytes",
    "ContentType": "binary/octet-stream",
    "LastModified": "Tue, 20 Nov 2018 11:21:35 GMT",
    "ContentLength": 126584,
    "VersionId": "1pEZmxXbgJ5ypMQSEfwEqygDxECveeS",
    "ETag": ""f3b92d795c9ee0725c160680acd084d9"",
    "Metadata": {}
}

For versioned bucket, non current objects can be retrieved by specifying the VersionID:

$ aws --endpoint=http://rgw:8080 s3api put-object 
      --bucket test-bucket-1 --key test-key-1 --body /tmp/test-3
{
    "VersionId": "Y7BeLcAC6s9isoBr2.FZ3vVqyqbhvQo",
    "ETag": ""03275d2d0964bee80711e983f07145e8""
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-1
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T11:27:35.943Z",
            "VersionId": "Y7BeLcAC6s9isoBr2.FZ3vVqyqbhvQo",
            "ETag": ""03275d2d0964bee80711e983f07145e8"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 72632
        },
        {
            "LastModified": "2018-11-14T11:21:35.603Z",
            "VersionId": "1pEZmxXbgJ5ypMQSEfwEqygDxECveeS",
            "ETag": ""f3b92d795c9ee0725c160680acd084d9"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 126584
        },
        {
            "LastModified": "2018-11-14T11:15:53.164Z",
            "VersionId": "null",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 151024
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api get-object 
      --bucket test-bucket-1 
      --key test-key-1 
      --version-id 1pEZmxXbgJ5ypMQSEfwEqygDxECveeS 
      test-key-1.out
{
    "AcceptRanges": "bytes",
    "ContentType": "binary/octet-stream",
    "LastModified": "Tue, 20 Nov 2018 11:21:35 GMT",
    "ContentLength": 126584,
    "VersionId": "1pEZmxXbgJ5ypMQSEfwEqygDxECveeS",
    "ETag": ""f3b92d795c9ee0725c160680acd084d9"",
    "Metadata": {}
}

$ aws --endpoint=http://rgw:8080 s3api get-object 
      --bucket test-bucket-1 
      --key test-key-1 
      --version-id null 
      test-key-1.out
{
    "AcceptRanges": "bytes",
    "ContentType": "binary/octet-stream",
    "LastModified": "Tue, 20 Nov 2018 11:15:53 GMT",
    "ContentLength": 151024,
    "VersionId": "null",
    "ETag": ""b9c85244be9733bc79eca588db7bf306"",
    "Metadata": {}
}

[\[return to quick links\]](#quick-links)

**On object removal**

For non versioned bucket, an object is permanently deleted and can not be recovered:

$ aws --endpoint=http://rgw:8080 s3api create-bucket 
      --bucket test-bucket-2

$ aws --endpoint=http://rgw:8080 s3api put-object 
      --bucket test-bucket-2 --key test-key-1 --body /tmp/test-2
{
    "ETag": ""b9c85244be9733bc79eca588db7bf306""
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-2
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T11:38:22.859Z",
            "VersionId": "null",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 151024
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api delete-object 
      --bucket test-bucket-2 --key test-key-1

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-2

$

For versioned bucket, all versions remain in the bucket and RGW inserts a delete marker which becomes the current version:

$ aws --endpoint=http://rgw:8080 s3api create-bucket 
      --bucket test-bucket-3

$ aws --endpoint=http://rgw:8080 s3api put-bucket-versioning 
      --bucket test-bucket-3 --versioning-configuration Status=Enabled

$ aws --endpoint=http://rgw:8080 s3api put-object 
      --bucket test-bucket-3 --key test-key-1 --body /tmp/test-2
{
    "VersionId": "1VUUs7jdM-QwU2l9SczDAib87Az7pw7",
    "ETag": ""b9c85244be9733bc79eca588db7bf306""
}

$ aws --endpoint=http://rgw:8080 s3api delete-object 
      --bucket test-bucket-3 --key test-key-1
{
    "VersionId": "fLg1ObY9WjneAHbweFRfwwmAAyk8Zvw",
    "DeleteMarker": true
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-3
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "VersionId": "fLg1ObY9WjneAHbweFRfwwmAAyk8Zvw",
            "Key": "test-key-1",
            "LastModified": "2018-11-14T11:44:31.718Z"
        }
    \],
    "Versions": \[
        {
            "LastModified": "2018-11-14T11:44:09.633Z",
            "VersionId": "1VUUs7jdM-QwU2l9SczDAib87Az7pw7",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 151024
        }
    \]
}

For versioned bucket, if an object with a specific VersionID is deleted, a permanent deletion happens:

$ aws --endpoint=http://rgw:8080 s3api delete-object 
      --bucket test-bucket-3 
      --key test-key-1 
      --version-id 1VUUs7jdM-QwU2l9SczDAib87Az7pw7
{
    "VersionId": "1VUUs7jdM-QwU2l9SczDAib87Az7pw7"
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions --bucket test-bucket-3
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "VersionId": "fLg1ObY9WjneAHbweFRfwwmAAyk8Zvw",
            "Key": "test-key-1",
            "LastModified": "2018-11-14T11:44:31.718Z"
        }
    \]
}

[\[return to quick links\]](#quick-links)

**On object restoration**

To restore an object, the recommended approach is copying a previous version of the object into the same bucket. The copied object becomes the current version of the object and all object versions are preserved:

$ aws --endpoint=http://rgw:8080 s3api create-bucket 
      --bucket test-bucket-4

$ aws --endpoint=http://rgw:8080 s3api put-bucket-versioning 
      --bucket test-bucket-4 --versioning-configuration Status=Enabled

$ aws --endpoint=http://rgw:8080 s3api put-object 
      --bucket test-bucket-4 --key test-key-1 --body /tmp/test-2
{
    "VersionId": "T7i7USZG-DaqHBOtruDhIzaov0tSnVZ",
    "ETag": ""b9c85244be9733bc79eca588db7bf306""
}

$ aws --endpoint=http://rgw:8080 s3api delete-object 
      --bucket test-bucket-4 --key test-key-1
{
    "VersionId": "NSiqwXFnv7pA8ixFzIXZJw3xi0xlsO6",
    "DeleteMarker": true
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-4
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "VersionId": "NSiqwXFnv7pA8ixFzIXZJw3xi0xlsO6",
            "Key": "test-key-1",
            "LastModified": "2018-11-14T12:14:05.736Z"
        }
    \],
    "Versions": \[
        {
            "LastModified": "2018-11-14T12:13:55.945Z",
            "VersionId": "T7i7USZG-DaqHBOtruDhIzaov0tSnVZ",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 151024
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api copy-object 
      --bucket test-bucket-4 
      --copy-source 
               test-bucket-4/test-key-1?versionId=T7i7USZG-DaqHBOtruDhIzaov0tSnVZ 
      --key test-key-1
{
    "CopyObjectResult": {
        "LastModified": "2018-11-14T12:27:32.613Z",
        "ETag": "b9c85244be9733bc79eca588db7bf306"
    }
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-4
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "VersionId": "NSiqwXFnv7pA8ixFzIXZJw3xi0xlsO6",
            "Key": "test-key-1",
            "LastModified": "2018-11-14T12:14:05.736Z"
        }
    \],
    "Versions": \[
        {
            "LastModified": "2018-11-14T12:27:32.613Z",
            "VersionId": "gydfTpqlM7ex7WJChvVN1TsrivDCZ1b",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 151024
        },
        {
            "LastModified": "2018-11-14T12:13:55.945Z",
            "VersionId": "T7i7USZG-DaqHBOtruDhIzaov0tSnVZ",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 151024
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api get-object 
      --bucket test-bucket-4 
      --key test-key-1 
      test-key-1.out
{
    "AcceptRanges": "bytes",
    "ContentType": "binary/octet-stream",
    "LastModified": "Tue, 20 Nov 2018 12:27:32 GMT",
    "ContentLength": 151024,
    "VersionId": "gydfTpqlM7ex7WJChvVN1TsrivDCZ1b",
    "ETag": ""b9c85244be9733bc79eca588db7bf306"",
    "Metadata": {}
}

On the other side, deleting the current object version turns the previous version into the current version of the object:

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-4
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "VersionId": "NSiqwXFnv7pA8ixFzIXZJw3xi0xlsO6",
            "Key": "test-key-1",
            "LastModified": "2018-11-14T12:14:05.736Z"
        }
    \],
    "Versions": \[
        {
            "LastModified": "2018-11-14T12:27:32.613Z",
            "VersionId": "gydfTpqlM7ex7WJChvVN1TsrivDCZ1b",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 151024
        },
        {
            "LastModified": "2018-11-14T12:13:55.945Z",
            "VersionId": "T7i7USZG-DaqHBOtruDhIzaov0tSnVZ",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 151024
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api delete-object 
      --bucket test-bucket-4 
      --key test-key-1 
      --version-id NSiqwXFnv7pA8ixFzIXZJw3xi0xlsO6
{
    "VersionId": "NSiqwXFnv7pA8ixFzIXZJw3xi0xlsO6",
    "DeleteMarker": true
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-4
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T12:27:32.613Z",
            "VersionId": "gydfTpqlM7ex7WJChvVN1TsrivDCZ1b",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 151024
        },
        {
            "LastModified": "2018-11-14T12:13:55.945Z",
            "VersionId": "T7i7USZG-DaqHBOtruDhIzaov0tSnVZ",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 151024
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api delete-object 
      --bucket test-bucket-4 
      --key test-key-1 
      --version-id gydfTpqlM7ex7WJChvVN1TsrivDCZ1b
{
    "VersionId": "gydfTpqlM7ex7WJChvVN1TsrivDCZ1b"
}

$ aws --endpoint=http://rgw:8080 s3api get-object 
      --bucket test-bucket-4 
      --key test-key-1 
      test-key-1.out
{
    "AcceptRanges": "bytes",
    "ContentType": "binary/octet-stream",
    "LastModified": "Tue, 20 Nov 2018 12:13:55 GMT",
    "ContentLength": 151024,
    "VersionId": "T7i7USZG-DaqHBOtruDhIzaov0tSnVZ",
    "ETag": ""b9c85244be9733bc79eca588db7bf306"",
    "Metadata": {}
}

[\[return to quick links\]](#quick-links)

**On delete marker**

An object retrieval on a bucket with delete marker as the current version returns an error:

$ aws --endpoint=http://rgw:8080 s3api create-bucket 
      --bucket test-bucket-5

$ aws --endpoint=http://rgw:8080 s3api put-bucket-versioning 
      --bucket test-bucket-5 --versioning-configuration Status=Enabled

$ aws --endpoint=http://rgw:8080 s3api put-object 
      --bucket test-bucket-5 --key test-key-1 --body /tmp/test-2
{
    "VersionId": "dfws1NkE5h4SflBIZ6mB1ItavPY0S-s",
    "ETag": ""b9c85244be9733bc79eca588db7bf306""
}

$ aws --endpoint=http://rgw:8080 s3api delete-object 
      --bucket test-bucket-5 --key test-key-1
{
    "VersionId": "9oOebs64t4jF6dCUh11r2nmw8ICyBAp",
    "DeleteMarker": true
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-5
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "VersionId": "9oOebs64t4jF6dCUh11r2nmw8ICyBAp",
            "Key": "test-key-1",
            "LastModified": "2018-11-14T12:52:07.402Z"
        }
    \],
    "Versions": \[
        {
            "LastModified": "2018-11-14T12:51:42.894Z",
            "VersionId": "dfws1NkE5h4SflBIZ6mB1ItavPY0S-s",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 151024
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api get-object 
      --bucket test-bucket-5 --key test-key-1 test-key-1.out

An error occurred (NoSuchKey) when calling the GetObject operation: Unknown

Only a DELETE operation is allowed on the delete marker object. If a DELETE request is fired on the bucket with delete marker as the current version, the delete marker object is not deleted but a new delete marker is added again:

$ aws --endpoint=http://rgw:8080 s3api delete-object 
      --bucket test-bucket-5 --key test-key-1
{
    "VersionId": "reuccmq7o7Oc3SRYP30Mf4l8bfRpOXc",
    "DeleteMarker": true
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-5
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "VersionId": "reuccmq7o7Oc3SRYP30Mf4l8bfRpOXc",
            "Key": "test-key-1",
            "LastModified": "2018-11-14T12:55:56.424Z"
        },
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "VersionId": "9oOebs64t4jF6dCUh11r2nmw8ICyBAp",
            "Key": "test-key-1",
            "LastModified": "2018-11-14T12:52:07.402Z"
        }
    \],
    "Versions": \[
        {
            "LastModified": "2018-11-14T12:51:42.894Z",
            "VersionId": "dfws1NkE5h4SflBIZ6mB1ItavPY0S-s",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 151024
        }
    \]
}

If the delete marker object is deleted by specifying its VersionID, the previous non current version object becomes the current version object.

$ aws --endpoint=http://rgw:8080 s3api delete-object 
      --bucket test-bucket-5 
      --key test-key-1 
      --version-id reuccmq7o7Oc3SRYP30Mf4l8bfRpOXc
{
    "VersionId": "reuccmq7o7Oc3SRYP30Mf4l8bfRpOXc",
    "DeleteMarker": true
}

$ aws --endpoint=http://rgw:8080 s3api delete-object 
      --bucket test-bucket-5 
      --key test-key-1 
      --version-id 9oOebs64t4jF6dCUh11r2nmw8ICyBAp
{
    "VersionId": "9oOebs64t4jF6dCUh11r2nmw8ICyBAp",
    "DeleteMarker": true
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-5
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T12:51:42.894Z",
            "VersionId": "dfws1NkE5h4SflBIZ6mB1ItavPY0S-s",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 151024
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api get-object 
      --bucket test-bucket-5 
      --key test-key-1 
      test-key-1.out
{
    "AcceptRanges": "bytes",
    "ContentType": "binary/octet-stream",
    "LastModified": "Tue, 20 Nov 2018 12:51:42 GMT",
    "ContentLength": 151024,
    "VersionId": "dfws1NkE5h4SflBIZ6mB1ItavPY0S-s",
    "ETag": ""b9c85244be9733bc79eca588db7bf306"",
    "Metadata": {}
}

[\[return to quick links\]](#quick-links)

**On suspended buckets**

Versioning can be suspended to stop accruing new versions of the same object in a bucket:

$ aws --endpoint=http://rgw:8080 s3api create-bucket 
       --bucket test-bucket-6

$ aws --endpoint=http://rgw:8080 s3api get-bucket-versioning 
      --bucket test-bucket-6

$ aws --endpoint=http://rgw:8080 s3api put-bucket-versioning 
      --bucket test-bucket-6 --versioning-configuration Status=Enabled

$ aws --endpoint=http://rgw:8080 s3api get-bucket-versioning 
      --bucket test-bucket-6
{
    "Status": "Enabled",
    "MFADelete": "Disabled"
}

$ aws --endpoint=http://rgw:8080 s3api put-bucket-versioning 
      --bucket test-bucket-6 --versioning-configuration Status=Suspended

$ aws --endpoint=http://rgw:8080 s3api get-bucket-versioning 
      --bucket test-bucket-6
{
    "Status": "Suspended",
    "MFADelete": "Disabled"
}

For each new object addition, an object with VersionID null is added:

$ aws --endpoint=http://rgw:8080 s3api put-object 
      --bucket test-bucket-6 --key test-key-1 --body /tmp/test-2
{
    "ETag": ""b9c85244be9733bc79eca588db7bf306""
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-6
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T13:13:57.203Z",
            "VersionId": "null",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 151024
        }
    \]
}

For each object addition with the same key name, the object with VersionID null is overwritten:

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-6
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T13:13:57.203Z",
            "VersionId": "null",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 151024
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api put-object 
      --bucket test-bucket-6 --key test-key-1 --body /tmp/test-2
{
    "ETag": ""b9c85244be9733bc79eca588db7bf306""
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-6
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T13:16:08.466Z",
            "VersionId": "null",
            "ETag": ""b9c85244be9733bc79eca588db7bf306"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 151024
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api put-object 
      --bucket test-bucket-6 --key test-key-1 --body /tmp/test-1
{
    "ETag": ""f3b92d795c9ee0725c160680acd084d9""
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-6
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T13:16:52.712Z",
            "VersionId": "null",
            "ETag": ""f3b92d795c9ee0725c160680acd084d9"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 126584
        }
    \]
}

An object retrieval request will always return the current version of the object:

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-6
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T13:16:52.712Z",
            "VersionId": "null",
            "ETag": ""f3b92d795c9ee0725c160680acd084d9"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 126584
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api put-bucket-versioning 
      --bucket test-bucket-6 --versioning-configuration Status=Enabled

$ aws --endpoint=http://rgw:8080 s3api put-object 
      --bucket test-bucket-6 --key test-key-1 --body /tmp/test-3
{
    "VersionId": "65Fg0wOc7mwG46iUUtObfY3BrjI6ila",
    "ETag": ""03275d2d0964bee80711e983f07145e8""
}

$ aws --endpoint=http://rgw:8080 s3api put-bucket-versioning 
      --bucket test-bucket-6 --versioning-configuration Status=Suspended

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-6
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T13:21:28.411Z",
            "VersionId": "65Fg0wOc7mwG46iUUtObfY3BrjI6ila",
            "ETag": ""03275d2d0964bee80711e983f07145e8"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 72632
        },
        {
            "LastModified": "2018-11-14T13:16:52.712Z",
            "VersionId": "null",
            "ETag": ""f3b92d795c9ee0725c160680acd084d9"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 126584
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api get-object 
      --bucket test-bucket-6 --key test-key-1 test-key-1.out
{
    "AcceptRanges": "bytes",
    "ContentType": "binary/octet-stream",
    "LastModified": "Tue, 20 Nov 2018 13:21:28 GMT",
    "ContentLength": 72632,
    "VersionId": "65Fg0wOc7mwG46iUUtObfY3BrjI6ila",
    "ETag": ""03275d2d0964bee80711e983f07145e8"",
    "Metadata": {}
}

A DELETE request on the bucket deletes the VersionID null object and inserts a delete marker:

$ aws --endpoint=http://rgw:8080 s3api list-objects 
      --bucket test-bucket-6
{
    "Contents": \[
        {
            "LastModified": "2018-11-14T13:21:28.411Z",
            "ETag": ""03275d2d0964bee80711e983f07145e8"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "Size": 72632
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-6
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T13:21:28.411Z",
            "VersionId": "65Fg0wOc7mwG46iUUtObfY3BrjI6ila",
            "ETag": ""03275d2d0964bee80711e983f07145e8"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 72632
        },
        {
            "LastModified": "2018-11-14T13:16:52.712Z",
            "VersionId": "null",
            "ETag": ""f3b92d795c9ee0725c160680acd084d9"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 126584
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api delete-object 
      --bucket test-bucket-6 --key test-key-1
{
    "VersionId": "null",
    "DeleteMarker": true
}

$ aws --endpoint=http://rgw:8080 s3api list-objects 
      --bucket test-bucket-6

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-6
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "VersionId": "null",
            "Key": "test-key-1",
            "LastModified": "2018-11-14T13:26:14.348Z"
        }
    \],
    "Versions": \[
        {
            "LastModified": "2018-11-14T13:21:28.411Z",
            "VersionId": "65Fg0wOc7mwG46iUUtObfY3BrjI6ila",
            "ETag": ""03275d2d0964bee80711e983f07145e8"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 72632
        }
    \]
}

A DELETE request does not delete anything if the bucket does not have an object with VersionID null:

$ aws --endpoint=http://rgw:8080 s3api list-objects 
      --bucket test-bucket-6

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-6
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "VersionId": "null",
            "Key": "test-key-1",
            "LastModified": "2018-11-14T13:26:14.348Z"
        }
    \],
    "Versions": \[
        {
            "LastModified": "2018-11-14T13:21:28.411Z",
            "VersionId": "65Fg0wOc7mwG46iUUtObfY3BrjI6ila",
            "ETag": ""03275d2d0964bee80711e983f07145e8"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 72632
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api delete-object 
      --bucket test-bucket-6 --key test-key-1 --version-id null
{
    "VersionId": "null"
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-6
{
    "Versions": \[
        {
            "LastModified": "2018-11-14T13:21:28.411Z",
            "VersionId": "65Fg0wOc7mwG46iUUtObfY3BrjI6ila",
            "ETag": ""03275d2d0964bee80711e983f07145e8"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "Size": 72632
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api delete-object 
      --bucket test-bucket-6 --key test-key-1
{
    "VersionId": "null",
    "DeleteMarker": true
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-6
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "VersionId": "null",
            "Key": "test-key-1",
            "LastModified": "2018-11-14T13:34:25.143Z"
        }
    \],
    "Versions": \[
        {
            "LastModified": "2018-11-14T13:21:28.411Z",
            "VersionId": "65Fg0wOc7mwG46iUUtObfY3BrjI6ila",
            "ETag": ""03275d2d0964bee80711e983f07145e8"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 72632
        }
    \]
}

A DELETE request can still be fired with a specific VersionID for any previous object with VersionID stored:

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-6
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "VersionId": "null",
            "Key": "test-key-1",
            "LastModified": "2018-11-14T13:34:25.143Z"
        }
    \],
    "Versions": \[
        {
            "LastModified": "2018-11-14T13:21:28.411Z",
            "VersionId": "65Fg0wOc7mwG46iUUtObfY3BrjI6ila",
            "ETag": ""03275d2d0964bee80711e983f07145e8"",
            "StorageClass": "STANDARD",
            "Key": "test-key-1",
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": false,
            "Size": 72632
        }
    \]
}

$ aws --endpoint=http://rgw:8080 s3api delete-object 
      --bucket test-bucket-6 
      --key test-key-1 
      --version-id 65Fg0wOc7mwG46iUUtObfY3BrjI6ila
{
    "VersionId": "65Fg0wOc7mwG46iUUtObfY3BrjI6ila"
}

$ aws --endpoint=http://rgw:8080 s3api list-object-versions 
      --bucket test-bucket-6
{
    "DeleteMarkers": \[
        {
            "Owner": {
                "DisplayName": "Test User",
                "ID": "testuser1"
            },
            "IsLatest": true,
            "VersionId": "null",
            "Key": "test-key-1",
            "LastModified": "2018-11-14T13:34:25.143Z"
        }
    \]
}

[\[return to quick links\]](#quick-links)

**Related posts**

- [Ceph Day in Santiago de Compostela](/blog/2018/04/06/ceph-day-in-santiago-de-compostela.html "Ceph Day in Santiago de Compostela")
- [Ceph RGW/S3 demo container technical notes](/blog/2018/03/23/ceph-rgw-s3-demo-container-technical-notes.html "Ceph RGW/S3 demo container technical notes")
- [Attending LibreCon 2017](/blog/2017/10/16/attending-librecon-2017.html "Attending LibreCon 2017")
- [AWS4 browser-based upload goes upstream in Ceph](/blog/2017/06/28/aws4-browser-based-upload-goes-upstream-in-ceph.html "AWS4 browser-based upload goes upstream in Ceph")
- [Ceph RGW AWS4 presigned URLs working with the Minio Cloud client](/blog/2016/12/16/ceph-rgw-aws4-presigned-urls-working-with-the-minio-cloud-client.html "Ceph RGW AWS4 presigned URLs working with the Minio Cloud client")
- [AWS4 chunked upload goes upstream in Ceph RGW S3](/blog/2016/08/31/aws4-chunked-upload-goes-upstream-in-ceph-rgw-s3.html "AWS4 chunked upload goes upstream in Ceph RGW S3")
- [Ansible AWS S3 core module now supports Ceph RGW S3](/blog/2016/06/21/ansible-aws-s3-core-module-now-supports-ceph-rgw-s3.html "Ansible AWS S3 core module now supports Ceph RGW S3")
- [The Ceph RGW storage driver goes upstream in Libcloud](/blog/2016/05/17/the-ceph-rgw-storage-driver-goes-upstream-in-libcloud.html "The Ceph RGW storage driver goes upstream in Libcloud")
- [Scalable placement of replicated data in Ceph](/blog/2016/04/30/scalable-placement-of-replicated-data-in-ceph.html "Scalable placement of replicated data in Ceph")
- [Requester Pays Bucket goes upstream in Ceph](/blog/2016/03/15/requester-pays-bucket-goes-upstream-in-ceph.html "Requester Pays Bucket goes upstream in Ceph")
- [AWS Signature Version 4 goes upstream in Ceph](/blog/2016/03/01/aws-signature-version-4-goes-upstream-in-ceph.html "AWS Signature Version 4 goes upstream in Ceph")
- [Ceph, a free unified distributed storage system](/blog/2016/02/26/ceph-a-free-unified-distributed-storage-system.html "Ceph, a free unified distributed storage system")
- [On S3, endpoints, regions, signatures and Boto 3](/blog/2016/02/01/on-s3-endpoints-regions-signatures-and-boto-3.html "On S3, endpoints, regions, signatures and Boto 3")

Source: Javier Munoz ([On Ceph RGW/S3 Object Versioning](http://javiermunhoz.com/blog/2018/11/14/on-ceph-rgw-s3-object-versioning.html))
