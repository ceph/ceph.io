---
title: "The Ceph RGW storage driver goes upstream in Libcloud"
date: "2016-05-16"
author: "admin"
tags: 
  - "planet"
---

![](images/20160517-libcloud-s3-ceph.png "Libcloud - S3 - Ceph")

The [Ceph](http://www.ceph.com "Ceph") [RGW](http://docs.ceph.com/docs/master/radosgw/ "RGW") storage driver was upstream in [Apache Libcloud](http://libcloud.apache.org/ "Apache Libcloud") today. It is available in the [Libcloud trunk repository](https://github.com/apache/libcloud/tree/trunk "Libcloud trunk repository") and it will ship with the next release [Apache Libcloud 1.0.0](https://libcloud.apache.org/blog/2016/06/22/libcloud-1-0-0-released.html "Apache Libcloud 1.0.0 released").

This post will introduce the new RGW driver together with the proper configuration parameters to run some examples uploading/downloading objects in Ceph Jewel.

**The Ceph RGW storage driver**

The Ceph RGW storage driver requires Ceph Jewel or above. As of this writing, the last Ceph Jewel version is [10.2.1](http://ceph.com/releases/v10-2-1-jewel-released/ "Ceph Jewel v10.2.1 released"). This version is available in the [downloads section](https://download.ceph.com/ "Ceph downloads").

The driver extends the Libcloud S3 storage driver to provide a compatible S3 API with Ceph RGW.

The driver also contains support for AWS signature versions 2 (AWS2) and 4 (AWS4). It leverages the Libcloud common auth support on the client side. On the Ceph RGW side it required a [little patch to handle unsigned paylods in the AWS4 auth header](https://github.com/ceph/ceph/pull/8601 "rgw: aws4: handle UNSIGNED-PAYLOAD under header auth patch").

Developers and apps can use the Ceph RGW driver via the S3\_RGW provider easily. A simple snippet follows...

**from libcloud.storage.types import Provider
from libcloud.storage.providers import get\_driver
import libcloud

api\_key = 'api\_key'
secret\_key = 'secret\_key'

cls = get\_driver(Provider.S3\_RGW)

driver = cls(api\_key,
             secret\_key,
	     signature\_version='4',
	     region='my-region',
	     host='my-host',
	     port=8000)

container = driver.get\_container(...)** 

If the region has not an explicit value, the driver will use the default region 'default'.

The valid signature versions are '2' (AWS2) and '4' (AWS4). AWS2 is the default signature version.

One host name is always required. No default value here.

The following two examples contain the minimal code to upload/download objects with the new provider:

- [test-upload-ceph-rgw-driver.py](/blog/content/libcloud-ceph/test-upload-ceph-rgw-driver.py.txt)
- [test-download-ceph-rgw-driver.py](/blog/content/libcloud-ceph/test-download-ceph-rgw-driver.py.txt)

Running the upload example...

**$ ./test-upload-ceph-rgw-driver.py
<Object: name=my-name-abcdabcd-123,
size=110080,
hash=0a5cfeb3bb10e0971895f8899a64e816,
provider=Ceph RGW S3 (my-region) ...>** 

Running the download example...

**$ ./test-download-ceph-rgw-driver.py
<Object: name=my-name-abcdabcd-123,
size=110080,
hash=0a5cfeb3bb10e0971895f8899a64e816,
provider=Ceph RGW S3 (my-region) ...>** 

Enjoy!

**Acknowledgments**

My work in [Apache Libcloud](http://libcloud.apache.org/ "Apache Libcloud") is sponsored by [Outscale](http://www.outscale.com "Outscale") and has been made possible by [Igalia](http://www.igalia.com "Igalia") and the invaluable help of the [Libcloud community](https://libcloud.apache.org/community.html "Libcloud community"). Thank you all!

![](images/20160517-igalia-libcloud-outscale.png "Igalia - Apache Libcloud - Outscale")

**Related posts**

- [The Outscale OSU driver goes upstream in Libcloud](/blog/2016/04/11/the-outscale-osu-driver-goes-upstream-in-libcloud.html "The Outscale OSU driver goes upstream in Libcloud")
- [AWS Signature Version 4 goes upstream in Ceph](/blog/2016/03/01/aws-signature-version-4-goes-upstream-in-ceph.html "AWS Signature Version 4 goes upstream in Ceph")
- [Ceph, a free unified distributed storage system](/blog/2016/02/26/ceph-a-free-unified-distributed-storage-system.html "Ceph, a free unified distributed storage system")
- [On S3, endpoints, regions, signatures and Boto 3](/blog/2016/02/01/on-s3-endpoints-regions-signatures-and-boto-3.html "On S3, endpoints, regions, signatures and Boto 3")

Source: Javier Munoz ([The Ceph RGW storage driver goes upstream in Libcloud](http://javiermunhoz.com/blog/2016/05/17/the-ceph-rgw-storage-driver-goes-upstream-in-libcloud.html))
