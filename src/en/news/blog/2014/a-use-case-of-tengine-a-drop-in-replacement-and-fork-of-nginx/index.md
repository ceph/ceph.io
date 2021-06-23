---
title: "A use case of Tengine, a drop-in replacement and fork of nginx"
date: "2014-06-22"
author: "dmsimard"
tags: 
  - "ceph"
---

# Some context

I’ve always been a fan of [nginx](http://nginx.org/), it was love at first sight.

I tend to use nginx first and foremost as a reverse proxy server for web content and applications. This means that nginx sends your request to backend servers and forwards you their response.

Some examples of backend servers I use:  
\- [php5-fpm](http://php-fpm.org/) for PHP  
\- [gunicorn](http://gunicorn.org/) or [wsgi](http://wsgi.readthedocs.org/en/latest/) for Python  
\- [PSGI/Plack](http://plackperl.org/) or [fastcgi](http://www.fastcgi.com/) for Perl

Now, the cool thing is that these backend servers are good at what they do: serve code and applications written in specific languages.

Mix an awesome, lightweight, proxy and an awesome backend server, you’re in for some serious performance.  
This is in contrast to Apache that has an approach with modules: it tries to do everything itself – jack of all trades, master of none.

nginx is steadily [increasing it’s market share](http://news.netcraft.com/archives/2014/06/06/june-2014-web-server-survey.html) against the likes of [Apache](https://httpd.apache.org/) and it’s not exactly complicated to understand why.

Did I tell you that nginx can also do [SSL termination](http://nginx.com/resources/admin-guide/nginx-ssl-termination/) and be used as a [load balancer](http://nginx.org/en/docs/http/load_balancing.html) ?

# Tengine

Enough of nginx, let’s talk about [Tengine](http://tengine.taobao.org/).

Ever heard of [Taobao](http://www.taobao.com/market/global/index_new.php) ? I’ll be honest, I hadn’t until fairly recently.  
It turns out they are number 8 on [Alexa’s top websites](http://www.alexa.com/topsites), right in front of Twitter.  
When China makes up [almost 20%](http://www.worldpopulationstatistics.com/population-of-china-2014/) of the World’s population, even a small penetration on the market is in fact huge by all means.

Tengine is a fork of nginx created by the team over at Taobao. There’s a lot of features in Tengine that do not (yet) exist in nginx and some features that upstream maintainers said they would not implement.

Some highlights include:  
\- All features of Nginx-1.4.7 are inherited, i.e., it is 100% compatible with Nginx.  
\- Dynamic module loading support (DSO). No need to recompile Tengine.  
\- Send unbuffered uploads directly to backend servers  
\- More load balancing methods like consistent hashing and session persistence  
\- Input body filter support, for use in things like web application firewalls  
\- Logging enhancements: Syslog (local or remote), pipe logging and log sampling

# The use case: Object storage

Long story short, [Object storage](http://en.wikipedia.org/wiki/Object_storage) is a mean of storing data online and make it easily accessible with the help of APIs. Example of products using this technology include [Dropbox](https://www.dropbox.com/), [Google Drive](https://drive.google.com/), [Microsoft OneDrive](https://onedrive.live.com/) or [Amazon S3](http://aws.amazon.com/s3/). [Owncloud](http://owncloud.org/) is also a good open source and self-hosted alternative front end to Object Storage.

## Openstack Swift & Ceph Object Gateway

[Openstack Swift](http://docs.openstack.org/developer/swift/) and [Ceph Object Gateway](https://ceph.com/docs/master/radosgw/) (RADOS Gateway) are two of the most popular open source object storage solutions out there right now.

They’re both similar in that you upload files to a proxy server – a Swift proxy server or a Ceph RADOS Gateway server. These proxy servers take care of sending the files back to storage servers that ensure data is distributed and replicated to ensure the high availability and redundancy of your data. It looks a bit like this:

                                 +-----------+
                            +--> |  Storage  |
                            |    +-----------+
                            |                 
+-----+  File  +-------+    |    +-----------+
| You | +----> | Proxy | +-----> |  Storage  |
+-----+        +-------+    |    +-----------+
                            |                 
                            |    +-----------+
                            +--> |  Storage  |
                                 +-----------+                                                          

Now, in a highly available and distributed environment, you might have dozens or hundreds of storage and proxy servers. There are a lot of options out there, you might have something like [haproxy](http://www.haproxy.org/), [pound](http://www.apsis.ch/pound) or nginx for load balancing.

With a load balancer in front of your proxy servers, your setup now looks like this:

                                         +-------+         +-----------+
                                    +--> | Proxy | +--+--> |  Storage  |
                                    |    +-------+    |    +-----------+
                                    |                 |                 
+-----+  File  +---------------+    |    +-------+    |    +-----------+
| You | +----> | Load Balancer | +-----> | Proxy | +-----> |  Storage  |
+-----+        +---------------+    |    +-------+    |    +-----------+
                                    |                 |                 
                                    |    +-------+    |    +-----------+
                                    +--> | Proxy | +--+--> |  Storage  |
                                         +-------+         +-----------+            

I noticed a problem when using nginx as a load balancer in front of servers that are the target of large and numerous uploads. nginx buffers the request of the body and this is something that drives a lot of discussion in the [nginx mailing lists](http://forum.nginx.org/read.php?2,234926,234926).

This effectively means that the file is uploaded **twice**. You upload a file to nginx that acts as a reverse proxy/load balancer and nginx waits until the file is finished uploading before sending the file to one of the available backends. The buffer will happen either in memory or to an actual file, depending on [configuration](http://nginx.org/en/docs/http/ngx_http_core_module.html#client_body_buffer_size).

Tengine was recently brought up in the [Ceph mailing lists](https://www.mail-archive.com/ceph-users@lists.ceph.com/msg09979.html) as part of the solution to tackling the problem so I decided to give it a try and see what kind of impact it’s [unbuffered requests](http://tengine.taobao.org/document/http_core.html) had on performance.

## An unscientific test

I uploaded a 1GB file to an Object storage cluster with nginx 1.6.0 in front. I then swapped it out for Tengine 1.5.2 and tried again. Swapping webservers was as simple as uninstalling Nginx and installing Tengine from a [package I built](https://github.com/dmsimard/make-tengine-deb). The configuration I had was 100% compatible, I only had to add configuration to disable request buffering.

+----+  1GB File   +---------------+       +-------+       +-----------+
| Me | +---------> | Load Balancer | +---> | Proxy | +---> |  Storage  |
+----+             +---------------+       +-------+       +-----------+
                                     1Gbps           1Gbps                           

With nginx, the upload took 1 minute 13 seconds.  
With Tengine, the upload took 41 seconds.

**That’s a difference of more than 30 seconds !**

# Conclusion

I was blown away by the difference disabling the buffering made.  
Tengine really was a drop-in replacement to Nginx, much like [MariaDB](https://mariadb.org/) 5.5 is for MySQL.  
This blog now runs both Tengine and MariaDB, perhaps there is also a bright future ahead of Tengine ?

It might just start making waves outside of China.

Let’s wait and see.
