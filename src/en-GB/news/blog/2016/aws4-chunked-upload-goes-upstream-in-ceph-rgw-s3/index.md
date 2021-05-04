---
title: "AWS4 chunked upload goes upstream in Ceph RGW S3"
date: "2016-08-30"
author: "admin"
tags: 
  - "planet"
---

![](images/20160831-loafofbread.png "Loaf of bread!")

With [AWS Signature Version 4](http://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html "Signing AWS Request with Signature Version 4") (AWS4) you have the option of uploading the payload in fixed or variable-size chunks.

This [chunked upload](http://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-streaming.html "chunked upload") option, also known as [Transfer payload in multiple chunks](http://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-streaming.html "Transfer payload in multiple chunks") or [STREAMING-AWS4-HMAC-SHA256-PAYLOAD](http://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-streaming.html "STREAMING-AWS4-HMAC-SHA256-PAYLOAD") feature in the [Amazon S3](https://aws.amazon.com/s3/ "Amazon S3") ecosystem, avoids reading the payload twice (or buffer it in memory) to compute the signature in the client side.

AWS4 chunked upload support is now upstream code in [Ceph](http://ceph.com "Ceph"). It will also ship with the next [Jewel](http://ceph.com/releases/v10-2-2-jewel-released/ "Jewel") release.

**Signing single vs multiple chunks payloads**

In AWS Signature Version 4 using the HTTP Authorization header is the most common method of providing authentication information. There are two supported options in S3:

- [Transfer payload in a single chunk](http://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-header-based-auth.html "Transfer payload in a single chunk")
- [Transfer payload in multiple chunks (chunked upload)](http://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-streaming.html "Transfer payload in multiple chunks (chunks upload)")

The first option, 'Transfer payload in a single chunk', is the way how Ceph RGW S3 authenticates requests under AWS4 right now. It supports signed and unsigned payloads.

For this case the major client-side drawback with signed payloads uploads is the necessity to read the payload twice or buffer it in memory. For big files this approach may be inefficient so you might prefer to upload data in chunks instead.

The second option, 'Transfer payload in multiple chunks (chunked upload)', is the new functionality being added upstream and backported to Jewel.

In this case you break up the payload in fixed or variable-size chunks. By uploading data in chunks, you avoid accesing the payload twice to calculate the signature in the client side.

**Signing the chunks**

Each chunk signature computation includes the signature of the previous chunk. The seed signature is generated using the request headers only:

![](images/20160831-aws4-auth-header-chunked-seed-signature.png)

Bear in mind the seed signature is used in the signature computation of the first chunk only. For each subsequent chunk, you create a chunk signature that includes the signature of the previous chunk.

The string to sign used in each subsequent chunk signature is:

![](images/20160831-aws4-auth-header-chunk-signature.png)

The chunk signatures chaining ensures you send the chunks in correct order.

**Uploading chunked payloads with the AWS SDK for Java**

To test chunked uploads with Ceph RGW S3 you can use the [AWS SDK for Java](https://aws.amazon.com/sdk-for-java/ "AWS SDK for Java"). It supports AWS4 chunked uploads. The last version is available [here](https://sdk-for-java.amazonwebservices.com/latest/aws-java-sdk.zip "aws-java-sdk.zip").

Feel free to use this [code](/blog/content/aws4-ceph/UploadObjectSingleOperation.java "UploadObjectSingleOperation.java") based on the AWS SDK Java's **UploadObjectSingleOperation** example.

Enjoy!

**Acknowledgments**

My work in [Ceph](http://www.ceph.com "Ceph") is sponsored by [Outscale](http://www.outscale.com "Outscale") and has been made possible by [Igalia](http://www.igalia.com "Igalia") and the invaluable help of the [Ceph development team](http://tracker.ceph.com/projects/rgw "Ceph development team"). Thank you all!

![](images/20160831-igalia-ceph-outscale.png "Igalia - Ceph - Outscale")

**Related posts**

- [AWS Signature Version 4 goes upstream in Ceph](/blog/2016/03/01/aws-signature-version-4-goes-upstream-in-ceph.html "AWS Signature Version 4 goes upstream in Ceph")
- [Ceph, a free unified distributed storage system](/blog/2016/02/26/ceph-a-free-unified-distributed-storage-system.html "Ceph, a free unified distributed storage system")
- [On S3, endpoints, regions, signatures and Boto 3](/blog/2016/02/01/on-s3-endpoints-regions-signatures-and-boto-3.html "On S3, endpoints, regions, signatures and Boto 3")

Source: Javier Munoz ([AWS4 chunked upload goes upstream in Ceph RGW S3](http://javiermunhoz.com/blog/2016/08/31/aws4-chunked-upload-goes-upstream-in-ceph-rgw-s3.html))
