---
title: "Ceph RGW AWS4 presigned URLs working with the Minio Cloud client"
date: "2016-12-15"
author: "admin"
tags: 
  - "planet"
---

![](images/20161216-minio-logo.png "Minio")

Some fellows are using the [Minio Client](https://docs.minio.io/docs/minio-client-complete-guide "Minio Client") (mc) as their primary client-side tool to work with [S3](https://en.wikipedia.org/wiki/Amazon_S3 "S3") cloud storage and filesystems. As you may know, mc works with the AWS v4 signature API and it provides a modern alternative under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0 "Apache 2.0 License") to [UNIX](https://en.wikipedia.org/wiki/Unix "Unix") commands (ls, cat, cp, diff, etc).

In the case you are using mc in the client side and [Ceph](http://ceph.com/ "Ceph") [RGW](http://docs.ceph.com/docs/master/radosgw/ "RGW") S3 in the server side, you could be experimenting some issues with AWS4 presigned URLs and the error code '403 Forbidden'.

To resolve this issue you need to set to 'false' a new configuration parameter in the RGW S3 configuration file:

**rgw s3 auth aws4 force boto2 compat = false** 

With this configuration in place, RGW S3 will be able to handle mc and other client-side tools experimenting the same issue properly. This configuration option is already available upstream.

By the way, if you are interested to know the origin of this issue you can have a look in this [old boto2 bug](https://github.com/boto/boto/pull/3181).

While computing the signature a buggy boto2 version will craft the host using the port number twice while a proper implementation (mc, etc) uses it once only. The result will be two different outputs to compute the same URL.

Amazon S3 will accept as valid both signatures.

In the case of RGW S3, with the new configuration option set to 'false', RGW S3 will compute a second signature in the case of presigned URLs if the first signature computation does not match. The AWS4 presigned URL will be valid if any of the two signatures match.

Enjoy!

**Acknowledgments**

My work in [Ceph](http://www.ceph.com "Ceph") is sponsored by [Outscale](http://www.outscale.com "Outscale") and has been made possible by [Igalia](http://www.igalia.com "Igalia") and the invaluable help of the [Ceph development team](http://tracker.ceph.com/projects/rgw "Ceph development team"). Thanks Pritha, Matt Benjamin and Yehuda for all your support to go upstream!

![](images/20161216-igalia-ceph-outscale.png "Igalia - Ceph - Outscale")

**Related posts**

- [Multipart Upload (Copy part) goes upstream in Ceph](http://javiermunhoz.com/blog/2016/10/12/multipart-upload-copy-part-goes-upstream-in-ceph.html "Multipart Upload (Copy part) goes upstream in Ceph")
- [AWS4 chunked upload goes upstream in Ceph RGW S3](http://javiermunhoz.com/blog/2016/08/31/aws4-chunked-upload-goes-upstream-in-ceph-rgw-s3.html "AWS4 chunked upload goes upstream in Ceph RGW S3")
- [Ansible AWS S3 core module now supports Ceph RGW S3](/blog/2016/06/21/ansible-aws-s3-core-module-now-supports-ceph-rgw-s3.html "Ansible AWS S3 core module now supports Ceph RGW S3")
- [The Ceph RGW storage driver goes upstream in Libcloud](/blog/2016/05/17/the-ceph-rgw-storage-driver-goes-upstream-in-libcloud.html "The Ceph RGW storage driver goes upstream in Libcloud")
- [The Outscale OSU driver goes upstream in Libcloud](/blog/2016/04/11/the-outscale-osu-driver-goes-upstream-in-libcloud.html "The Outscale OSU driver goes upstream in Libcloud")
- [AWS Signature Version 4 goes upstream in Ceph](/blog/2016/03/01/aws-signature-version-4-goes-upstream-in-ceph.html "AWS Signature Version 4 goes upstream in Ceph")
- [Ceph, a free unified distributed storage system](/blog/2016/02/26/ceph-a-free-unified-distributed-storage-system.html "Ceph, a free unified distributed storage system")
- [On S3, endpoints, regions, signatures and Boto 3](/blog/2016/02/01/on-s3-endpoints-regions-signatures-and-boto-3.html "On S3, endpoints, regions, signatures and Boto 3")

Source: Javier Munoz ([Ceph RGW AWS4 presigned URLs working with the Minio Cloud client](http://javiermunhoz.com/blog/2016/12/16/ceph-rgw-aws4-presigned-urls-working-with-the-minio-cloud-client.html))
