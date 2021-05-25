---
title: "Multipart Upload (Copy part) goes upstream in Ceph"
date: "2016-10-11"
author: "admin"
tags: 
  - "planet"
---

![](images/20161012-ceo-s3.png "Copying existing objects in S3")

The last [Upload Part (Copy)](http://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadUploadPartCopy.html "Upload Part (Copy)") patches went upstream in [Ceph](http://ceph.com "Ceph") some days ago. This new feature is available in the master branch now, and it will ship with the [first development checkpoint for Kraken](http://ceph.com/releases/kraken-11-0-2-released/ "Ceph v11.0.2 (Kraken first dev release)").

In [S3](https://en.wikipedia.org/wiki/Amazon_S3 "Amazon S3"), this feature is used to copy/move data using an existing object as data source in the storage backend instead of downloading/uploading the object to achieve the same effect via the request body.

This extension, part of the [Multipart Upload API](http://docs.aws.amazon.com/AmazonS3/latest/dev/mpuoverview.html "Multipart Upload API"), reduces the required bandwidth between the RGW cluster and the final user when copying/moving existing objects in specific use cases.

In this post I will introduce the feature to know this concept maps to Ceph and how it works under the hood.

**Amazon S3 and the Multipart Upload API**

In November 2010 AWS [announced](https://aws.amazon.com/about-aws/whats-new/2010/11/10/Amazon-S3-Introducing-Multipart-Upload/ "Introducing Amazon S3 Multipart Upload") the Multipart Upload API to allow faster and more flexible uploads into Amazon S3.

Before the Multipart Upload API, the large object uploads usually experienced network issues with limited bandwidth connections. If there was an error on the upload you had to restart the upload. In some cases the network issues were not transient, and it was difficult (or maybe impossible) to upload those larger objects with low-end connections.

The other issue is related to the size of the object, and the time this information is available. Before the Multipart Upload API it was not possible to upload an object with unknown size. You had to wait to have the whole object in place before starting the upload.

In addition to these inconveniences there was also the inability to upload in parallel. The uploads had to be linear.

The next picture shows how things were working before the Multipart Upload API.

![](images/20161012-bmp-s3.png)

As you can see the upload process with the usual Upload API runs straight but it may raises issues with larger objects in some cases.

The Multipart Upload API resolves these limitations to upload a single object as a set of parts. After all the parts of your object are uploaded, Amazon S3 then presents the data as a single object.

With this feature you can create parallel uploads, pause and resume an object upload, and begin uploads before you know the total object size.

A typical multipart upload consists of four steps:

1. [Initiate the Multipart Upload](http://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadInitiate.html)
2. Separate the object into multiple parts
3. [Upload the parts in any order, one at a time or in parallel](http://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadUploadPart.html)
4. [Complete the upload](http://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadComplete.html)

![](images/20161012-mp-s3.png)

The official [documentation](http://docs.aws.amazon.com/AmazonS3/latest/dev/mpuoverview.html "Multipart Upload Overview documentation") also describes how the Multipart Upload API should interact with the Object Versioning or Bucket Lifecycle support in S3.

A great Multipart Upload API overview is also this official [Amazon S3 Multipart Upload introduction by the S3 product managers](http://www.slideshare.net/AmazonWebServices/amazon-s3-multipartuploadwebcast111710 "Amazon S3 Multipart Upload introduction by the S3 product managers").

**Ceph and the Multipart Upload (Copy part) API**

Ceph got the initial Multipart Upload API core support in June 2011. It was 6-7 months later that it was announced, as part of Amazon S3 publicly. It shipped with Argonaut (v0.48), the first major 'stable' release of Ceph in July 2012, although the feature went in around v0.29. A truly impressive timing.

The Multipart Upload API feature is a sensitive feature. It works in tandem with other parts of the code such as Object Versioning, ACL granting, AWS2/AWS4 auth and so on.

Some of the these last features were merged after the original Multipart Upload API code was upstreamed so the Multipart Upload API may be considered as one of the RGW S3 features requiring continuos evolution to face integration and growth with the new features going in.

Notice if you have a look at the previous Multipart Upload API description, and you need to copy/move an existing object, you will miss the right step to run it efficiently.

Before this API, RGW S3 users were copying/moving existing objects, by downloading and uploading the objects again.

After this new feature going upstream the efficient way to copy/move an existing object becomes the 'Upload Part (Copy)' option. The 'Upload Part (Copy)' option works specifying the source object by adding the 'x-amz-copy-source' and 'x-amz-copy-source-range' request headers.

This improvement allows the user to drive the multipart upload process (steps 1, 2, 3 and 4) while steps 2 and 3 handle data coming from the storage backend instead of the request body.

The next picture shows how the data reading happens in RGW S3 along the new copy process (steps 2 and 3 are affected).

![](images/20161012-cp-s3.png)

**Using the Multipart Upload (Copy part) API with Ceph**

As you can imagine the new code is a bandwidth saver with specific use cases where the final object needs to be, at least partially, composed of objects that already exist in the system.

Feel free to use this Python [code](/blog/content/mpu-part-copy/multipart-upload-copy-part-test.py.txt) to test the new API.

Enjoy!

**Acknowledgments**

My work in [Ceph](http://www.ceph.com "Ceph") is sponsored by [Outscale](http://www.outscale.com "Outscale") and has been made possible by [Igalia](http://www.igalia.com "Igalia") and the invaluable help of the [Ceph development team](http://tracker.ceph.com/projects/rgw "Ceph development team"). Thanks Yehuda and Casey for all your support to go upstream!

![](images/20161012-igalia-ceph-outscale.png "Igalia - Ceph - Outscale")

**Related posts**

- [AWS4 chunked upload goes upstream in Ceph RGW S3](/blog/2016/08/31/aws4-chunked-upload-goes-upstream-in-ceph-rgw-s3.html "AWS4 chunked upload goes upstream in Ceph RGW S3")
- [Ansible AWS S3 core module now supports Ceph RGW S3](/blog/2016/06/21/ansible-aws-s3-core-module-now-supports-ceph-rgw-s3.html "Ansible AWS S3 core module now supports Ceph RGW S3")
- [The Ceph RGW storage driver goes upstream in Libcloud](/blog/2016/05/17/the-ceph-rgw-storage-driver-goes-upstream-in-libcloud.html "The Ceph RGW storage driver goes upstream in Libcloud")
- [Scalable placement of replicated data in Ceph](/blog/2016/04/30/scalable-placement-of-replicated-data-in-ceph.html "Scalable placement of replicated data in Ceph")
- [Requester Pays Bucket goes upstream in Ceph](/blog/2016/03/15/requester-pays-bucket-goes-upstream-in-ceph.html "Requester Pays Bucket goes upstream in Ceph")
- [AWS Signature Version 4 goes upstream in Ceph](/blog/2016/03/01/aws-signature-version-4-goes-upstream-in-ceph.html "AWS Signature Version 4 goes upstream in Ceph")
- [Ceph, a free unified distributed storage system](/blog/2016/02/26/ceph-a-free-unified-distributed-storage-system.html "Ceph, a free unified distributed storage system")
- [On S3, endpoints, regions, signatures and Boto 3](/blog/2016/02/01/on-s3-endpoints-regions-signatures-and-boto-3.html "On S3, endpoints, regions, signatures and Boto 3")

Source: Javier Munoz ([Multipart Upload (Copy part) goes upstream in Ceph](http://javiermunhoz.com/blog/2016/10/12/multipart-upload-copy-part-goes-upstream-in-ceph.html))
