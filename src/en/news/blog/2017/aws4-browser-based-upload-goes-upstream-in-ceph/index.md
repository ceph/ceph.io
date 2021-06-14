---
title: "AWS4 browser-based upload goes upstream in Ceph"
date: "2017-06-27"
author: "admin"
tags: 
  - "planet"
---

![](images/20170628-aws4-bub.png "Browser-based uploads")

Some days ago [Matt](https://github.com/mattbenjamin) committed the great [Radek](https://github.com/rzarzynski)'s effort to have a more coherent and structured scaffolding in the [Ceph](http://ceph.com "Ceph") [RGW](http://docs.ceph.com/docs/master/radosgw/ "RGW") auth subsystem supporting the differences among the available auth algorithms.

As part of this effort and patchset related to the RGW auth subsystem, Radek was kind enough to include my last patches supporting the [AWS4 authentication for S3 Post Object API](http://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-authentication-HTTPPOST.html "AWS4 authentication for S3 Post Object API") as part of this big patchset.

This entry comments on this AWS4 feature upgrade and how it works with Ceph RGW S3.

**Browser-Based Uploads Using POST (AWS Signature Version 4)**

The [Amazon S3](https://aws.amazon.com/s3) feature documentation is available [here](http://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-authentication-HTTPPOST.html "Authenticating Requests: Browser-Based Uploads Using POST (AWS Signature Version 4)"). It describes how users upload content to Amazon S3 by using their browsers via authenticated [HTTP POST](https://en.wikipedia.org/wiki/POST_(HTTP) "HTTP POST") requests and [HTML forms](https://en.wikipedia.org/wiki/Form_(HTML) "HTML forms").

Those HTML forms consist of a form declaration and form fields. The form declaration contains high-level information about the request and the form fields contain detailed request information.

The technical details to craft a S3 HTML form are available [here](http://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTForms.html "Creating an HTML Form (Using AWS Signature Version 4)"). The HTML form also requires a proper POST policy (have a look [here](http://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html "Creating a POST policy") to create a POST policy!).

The process for sending browser-based POST requests is as follows:

1. Create a security policy specifying conditions restricting what you want to allow in the request.
2. Create a signature that is based on the policy. For authenticated requests, the form must include a valid signature and the policy.
3. Create a HTML form that your users can access in order to upload objects to your Amazon S3 bucket directly.

**Using the feature with Ceph RGW S3 and AWS4**

Ceph RGW S3 supports HTTP POST requests under [AWS2](http://docs.aws.amazon.com/AmazonS3/latest/dev/auth-request-sig-v2.html "AWS2"). With the new patch in place Ceph RGW S3 also authenticates HTTP POST requests under [AWS4](http://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html "AWS4").

To test the feature you can use a browser, the boto3 client or the AWS command line interface. Try the following commands:

1\. Create a new bucket

**$ aws s3 mb s3://test-1-2-1-bucket --region eu-central-1 
> --endpoint-url http://s3.eu-central-1.amazonaws.com:8000
make\_bucket: test-1-2-1-bucket** 

2\. Generate some test html code with the minimal and required data form fields to auth under aws4, proper policy encoding, etc. Feel free to use [this script](/blog/content/ceph-http-form/rgw-s3-aws4-form.py.txt "rgw-s3-aws4-form.py script") in [Python](https://www.python.org/ "Python") to get a simple and tested skeleton.

**$ ./rgw-s3-aws4-form.py
test-rgw-s3-aws4-form.html created.** 

3\. Load test-rgw-s3-aws4-form.html in some browser and upload a test file. You should receive a 204 message.

4\. Verify the object is in place and the content is good.

**$ md5sum test-1-2-1-key
aaf3b5e3b7505131a6baf9fb6ec1f9dc test-1-2-1-key

$ aws s3 cp s3://test-1-2-1-bucket/test-1-2-1-key --region eu-central-1 
> --endpoint-url http://s3.eu-central-1.amazonaws.com:8000 - | md5sum
aaf3b5e3b7505131a6baf9fb6ec1f9dc -** 

Enjoy!

**Note:** The example uses s3.eu-central-1.amazonaws.com as an example box name in the local network. You should use the names of your RGWs here.

**Acknowledgments**

My work in [Ceph](http://www.ceph.com "Ceph") has been made possible by [Igalia](http://www.igalia.com "Igalia") and the invaluable help of the [Ceph development team](http://tracker.ceph.com/projects/rgw "Ceph development team")!

![](images/20170628-igalia-ceph.png "Igalia - Ceph")

**Related posts**

- [Ceph RGW AWS4 presigned URLs working with the Minio Cloud client](/blog/2016/12/16/ceph-rgw-aws4-presigned-urls-working-with-the-minio-cloud-client.html "Ceph RGW AWS4 presigned URLs working with the Minio Cloud client")
- [AWS4 chunked upload goes upstream in Ceph RGW S3](/blog/2016/08/31/aws4-chunked-upload-goes-upstream-in-ceph-rgw-s3.html "AWS4 chunked upload goes upstream in Ceph RGW S3")
- [Ansible AWS S3 core module now supports Ceph RGW S3](/blog/2016/06/21/ansible-aws-s3-core-module-now-supports-ceph-rgw-s3.html "Ansible AWS S3 core module now supports Ceph RGW S3")
- [The Ceph RGW storage driver goes upstream in Libcloud](/blog/2016/05/17/the-ceph-rgw-storage-driver-goes-upstream-in-libcloud.html "The Ceph RGW storage driver goes upstream in Libcloud")
- [Scalable placement of replicated data in Ceph](/blog/2016/04/30/scalable-placement-of-replicated-data-in-ceph.html "Scalable placement of replicated data in Ceph")
- [Requester Pays Bucket goes upstream in Ceph](/blog/2016/03/15/requester-pays-bucket-goes-upstream-in-ceph.html "Requester Pays Bucket goes upstream in Ceph")
- [AWS Signature Version 4 goes upstream in Ceph](/blog/2016/03/01/aws-signature-version-4-goes-upstream-in-ceph.html "AWS Signature Version 4 goes upstream in Ceph")
- [Ceph, a free unified distributed storage system](/blog/2016/02/26/ceph-a-free-unified-distributed-storage-system.html "Ceph, a free unified distributed storage system")
- [On S3, endpoints, regions, signatures and Boto 3](/blog/2016/02/01/on-s3-endpoints-regions-signatures-and-boto-3.html "On S3, endpoints, regions, signatures and Boto 3")

Source: Javier Munoz ([AWS4 browser-based upload goes upstream in Ceph](http://javiermunhoz.com/blog/2017/06/28/aws4-browser-based-upload-goes-upstream-in-ceph.html))
