---
title: "Hosting a web site in radosgw"
date: "2016-01-26"
author: "admin"
tags: 
  - "planet"
---

If you're familiar with [web site hosting on Amazon S3](//docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html), which is a simple and cheap way to host a static web site, you might be wondering whether or not you can do the same in Ceph radosgw.

The short answer is you can't. Bucket Website is listed as _Not Supported_ in the radosgw S3 API [support matrix](http://docs.ceph.com/docs/master/radosgw/s3/), and radosgw doesn't have [index document support](http://docs.aws.amazon.com/AmazonS3/latest/dev/IndexDocumentSupport.html) either.

But the longer answer is that you can, provided you use radosgw in combination with a front-end load-balancer — which, as it happens, can add a few more bells and whistles, as well. You could probably do the same thing with nginx, Varnish, or Apache in a `mod_proxy_balancer` balancer setup, but in this example configuration, we'll use HAProxy.

## Getting started: the radosgw basics

Let's take look at a simple radosgw configuration with virtual host support, such that you can access your buckets as either `http://ceph.example.com/bucketname` or `http://bucketname.ceph.example.com`:

\[client.rgw.radosgw01\]
rgw\_frontends \= civetweb port=7480
rgw\_dns\_name \= ceph.example.com
rgw\_resolve\_cname \= True

Suppose we use `s3cmd` to upload an HTML file to this bucket, setting a public ACL:

s3cmd mb s3://testwebsite
s3cmd put --acl-public index.html s3://testwebsite/

Then if you exposed your radosgw to the web, any client (without authentication) would be able to retrieve `http://testwebsite.ceph.example.com:7480/index.html` with a web browser, or any other HTTP client application (such as `curl` or `wget`):

curl -I http://testwebsite.ceph.example.com:7480/index.html

Which would then return something like:

HTTP/1.1 200 OK
Content-Length: 18050
Accept-Ranges: bytes
Last-Modified: Mon, 25 Jan 2016 21:28:47 GMT
ETag: "b03130a4a1fc24df0f9f336f2b6d1d90"
x-amz-request-id: tx000000000000000005a88-0056a7b7eb-312df-default
Content-type: text/html
Date: Tue, 26 Jan 2016 18:16:11 GMT

## Introducing HAProxy

Now let's start out with putting HAproxy in between. Nothing special there: radosgw listens on the conventional 7480 port, and we simply hand HAproxy traffic through there, and bind HAProxy itself to port 80.

global
    log         /dev/log local0
    pidfile     /var/run/haproxy.pid
    maxconn     4000
    user        haproxy
    group       haproxy
    daemon

    \# turn on stats unix socket
    stats socket /var/lib/haproxy/stats level admin

    \# Default SSL material locations
    ca-base /etc/ssl/certs
    crt-base /etc/haproxy/ssl

    \# Default ciphers to use on SSL-enabled listening sockets.
    \# For more information, see ciphers(1SSL).
    ssl-default-bind-ciphers HIGH
    tune.ssl.default-dh-param 2048

defaults
    log global
    mode http
    option httplog
    option dontlognull
    retries 3
    timeout queue 1000
    timeout connect 1000
    timeout client 30000
    timeout server 30000
    option forwardfor

frontend ceph\_front
    bind 0.0.0.0:80
    default\_backend ceph\_back

backend ceph\_back
    balance source
    server radosgw01 127.0.0.1:7480 check

## Index documents

So, the first thing we'll need to add is support for index documents. We'd like to make sure that when we retrieve `https://testwebsite.ceph.example.com/`, what's actually fetched from the backend is `/index.html`. We can do that by adding an HAproxy ACL that matches for the trailing slash in the path, and an `http-request set-path` directive that appends the index document name:

frontend ceph\_front
    bind 0.0.0.0:80
    acl path\_ends\_in\_slash path\_end \-i /
    \# Append index document (index.html) to any path
    \# ending in "/".
    http-request set-path %\[path\]index.html if path\_ends\_in\_slash
    default\_backend ceph\_back

Now, that's fine in terms of **getting** the index document correctly:

curl -I http://testwebsite.ceph.example.com/index.html

HTTP/1.1 200 OK
Content-Length: 18050
Accept-Ranges: bytes
Last-Modified: Mon, 25 Jan 2016 21:28:47 GMT
ETag: "b03130a4a1fc24df0f9f336f2b6d1d90"
x-amz-request-id: tx000000000000000005a94-0056a7b9e3-312df-default
Content-type: text/html
Date: Tue, 26 Jan 2016 18:24:35 GMT

However, it of course breaks uploads and even bucket listings, or in other words, anything that uses the S3 API. Now you could test for some S3-specific headers in the request, but really, you should just check whether the request is authorized, and only apply the index document logic if it isn't, like so:

frontend ceph\_front
    bind 0.0.0.0:80
    acl path\_ends\_in\_slash path\_end \-i /
    acl auth\_header hdr(Authorization) \-m found
    \# Append index document (index.html) to any path
    \# ending in "/", unless the request has an auth header
    http-request set-path %\[path\]index.html if path\_ends\_in\_slash !auth\_header
    default\_backend ceph\_back

Great. Now we can upload using full paths without mangling, and on any un-authenticated requests, we substitute `/index.html` for any trailing `/`. In case you're wondering: yes, this works for any path, not just the root path.

## Directory paths

However, you may also want something else, which is the ability to correctly handle a request like `http://testwebsite.ceph.example.com/my/sub/directory`, where of course you want the path `/my/sub/directory` translated into `/my/sub/directory/index.html`, which means we want to append a slash _and_ an index document name to the request path.

So let's do that:

frontend ceph\_front
    bind 0.0.0.0:80
    acl path\_has\_dot path\_sub \-i .
    acl path\_ends\_in\_slash path\_end \-i /
    acl auth\_header hdr(Authorization) \-m found
    http-request set-path %\[path\]index.html if path\_ends\_in\_slash !auth\_header
    \# Append trailing slash if necessary.
    http-request set-path %\[path\]/index.html if !path\_has\_dot !path\_ends\_in\_slash !auth\_header
    default\_backend ceph\_back

Note that what we're doing here is somewhat crude. We're assuming that any actual file that we want to retrieve looks like `name.ext`, meaning it has a dot (period, full stop) character in it. The `path_sub -i .` expression in the `path_has_dot` ACL simply matches any path with `.` in it, and we're assuming that if a path has a dot then it points to a file, if it doesn't then it points to a directory.

You could be a little more clever here and use `path_regex` instead of `path_sub` for a full regular expression match. But regex lookups are slower than simple substring matches, so if the substring match works for you, go for it.

So now, we can do this:

s3cmd put --acl-public index.html s3://testwebsite/my/sub/directory/

And then:

\# Note omitted trailing slash
curl -I http://testwebsite.ceph.example.com/my/sub/directory

HTTP/1.1 200 OK
Content-Length: 24235
Accept-Ranges: bytes
Last-Modified: Mon, 25 Jan 2016 23:57:04 GMT
ETag: "fecd005b33c0f6bfdee61b787cf54cb0"
x-amz-request-id: tx00000000000000000bc83-0056a7bd25-312cd-default
Content-type: text/html
Date: Tue, 26 Jan 2016 18:38:29 GMT

## HTTPS support

So, what else might you want to do? One obvious thing that you can use HAproxy for is SSL termination. The radosgw embedded `civetweb` webserver can do that for you, but that feature is [currently mildly broken in a rather curious way](http://tracker.ceph.com/issues/11239). So in order to allow HTTPS access to all your content via HAproxy instead, you would add:

frontend ceph\_front\_ssl
    bind 0.0.0.0:443 ssl crt ceph.pem no-sslv3 no-tls-tickets
    reqadd X-Forwarded-Proto: https
    acl path\_has\_dot path\_sub \-i .
    acl path\_ends\_in\_slash path\_end \-i /
    acl auth\_header hdr(Authorization) \-m found
    http-request set-path %\[path\]index.html if path\_ends\_in\_slash !auth\_header
    http-request set-path %\[path\]/index.html if !path\_has\_dot !path\_ends\_in\_slash !auth\_header
    default\_backend ceph\_back

But maybe you'd like to **force,** not merely allow, HTTPS access. `redirect` to the rescue:

frontend ceph\_front
    bind 0.0.0.0:80
    reqadd X-Forwarded-Proto: http
    redirect scheme https code 301 if !{ ssl\_fc }

frontend ceph\_front\_ssl
    bind 0.0.0.0:443 ssl crt ceph.pem no-sslv3 no-tls-tickets
    reqadd X-Forwarded-Proto: https
    acl path\_has\_dot path\_sub \-i .
    acl path\_ends\_in\_slash path\_end \-i /
    acl auth\_header hdr(Authorization) \-m found
    http-request set-path %\[path\]index.html if path\_ends\_in\_slash !auth\_header
    http-request set-path %\[path\]/index.html if !path\_has\_dot !path\_ends\_in\_slash !auth\_header
    default\_backend ceph\_back

And here we go:

\# Note HTTP
curl -IL http://testwebsite.ceph.example.com/my/sub/directory

HTTP/1.1 301 Moved Permanently
Content-length: 0
Location: https://testwebsite.ceph.example.com/my/sub/directory
Connection: close

HTTP/1.1 200 OK
Content-Length: 24235
Accept-Ranges: bytes
Last-Modified: Mon, 25 Jan 2016 23:57:04 GMT
ETag: "fecd005b33c0f6bfdee61b787cf54cb0"
x-amz-request-id: tx00000000000000000bdeb-0056a7bf9b-312cd-default
Content-type: text/html
Date: Tue, 26 Jan 2016 18:48:59 GMT

## Compression

And finally, maybe you'd like to speed up access to the stuff on your site. Why not add gzip on-the-fly-compression? It's supported by every browser worth its salt, and will make your users happier. You'll want to restrict compression to specific MIME types though. In the configuration below, we enable compression for plain text, HTML, XML, CSS, JavaScript, and SVG images.

frontend ceph\_front
    bind 0.0.0.0:80
    reqadd X-Forwarded-Proto: http
    redirect scheme https code 301 if !{ ssl\_fc }

frontend ceph\_front\_ssl
    bind 0.0.0.0:443 ssl crt ceph.pem no-sslv3 no-tls-tickets
    reqadd X-Forwarded-Proto: https
    acl path\_has\_dot path\_sub \-i .
    acl path\_ends\_in\_slash path\_end \-i /
    acl auth\_header hdr(Authorization) \-m found
    http-request set-path %\[path\]index.html if path\_ends\_in\_slash !auth\_header
    http-request set-path %\[path\]/index.html if !path\_has\_dot !path\_ends\_in\_slash !auth\_header
    compression algo gzip
    compression type text/html text/xml text/plain text/css application/javascript image/svg+xml
    default\_backend ceph\_back

Let's see how that helps us. Do a request without gzip encoding support, and observe that its total download size matches the document's `Content-Length`:

curl https://testwebsite.ceph.example.com/my/sub/directory > /dev/null

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 24235  100 24235    0     0  94565      0 \--:--:-- \--:--:-- \--:--:-- 94299

Now, add an `Accept-Encoding` header:

curl -H 'Accept-Encoding: gzip' https://testwebsite.ceph.example.com/my/sub/directory > /dev/null

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  5237    0  5237    0     0  19243      0 \--:--:-- \--:--:-- \--:--:-- 19324

There. Actual download size goes from 24KB down to just 5KB.

## Where to go from here

There's a few additional features to be added here. You could enable CORS or HSTS, for example, and of course you could add more backends. But if you read this far, you surely get the idea.

And you're welcome to examine the headers you can pull from this page you're reading, wink wink. :)

Source: Hastexo ([Hosting a web site in radosgw](https://www.hastexo.com/resources/hints-and-kinks/hosting-website-radosgw/))
