---
title: "Experimenting with the Ceph REST API"
date: "2013-12-21"
author: "dmsimard"
tags: 
  - "ceph"
---

Like I mentioned in my [previous post](http://dmsimard.com/2013/12/06/ceph-has-a-rest-api/), Ceph has a [REST API](http://ceph.com/docs/master/man/8/ceph-rest-api/) now. That opens a lot of possibilities.

The Ceph REST API is a WSGI application and it listens on port 5000 by default.

This means you can query it directly but you probably want to put a webserver/proxy such a Apache or nginx in front of it.  
For high availability, you could run ceph-rest-api on several servers and have redundant load balancers pointing to the API endpoints.

ceph-rest-api doesn’t handle authentication very well right now. You start it with a cephx authentication key and that’s it. You need to handle the permissions/authentication at the application level.

For the sake of simplicity and testing, I’m going to test in a sandbox without a proxy and run ceph-rest-api directly on a monitor with the client.admin cephx key.

### Starting ceph-rest-api

ceph-rest-api is part of the ceph-common package so I already have it on my monitor.

usage: ceph-rest-api \[-h\] \[-c CONF\] \[--cluster CLUSTER\] \[-n NAME\] \[-i ID\]

Ceph REST API webapp

optional arguments:
  -h, --help            show this help message and exit
  -c CONF, --conf CONF  Ceph configuration file
  --cluster CLUSTER     Ceph cluster name
  -n NAME, --name NAME  Ceph client name
  -i ID, --id ID        Ceph client id

With my configuration file /etc/ceph/ceph.conf and my cephx key at /etc/ceph/keyring:

root@mon01:~# ceph-rest-api -n client.admin
\* Running on http://0.0.0.0:5000/

### Using the API

Well, that was easy. Let’s poke it and see what happens:

root@mon02:~# curl mon01.ceph.example.org:5000

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<title>Redirecting...</title>
<h1>Redirecting...</h1>
<p>You should be redirected automatically to target URL: <a href="/api/v0.1"\>/api/v0.1</a>.  If not click the link.</pre>

Well, that works, can we get the status of the cluster ?

root@mon02:~# curl mon01.ceph.example.org:5000/api/v0.1/health
HEALTH\_OK

Let’s do the same call with JSON, look at all the data we get !

root@mon02:~# curl -i -H "Accept: application/json" mon01.ceph.example.org:5000/api/v0.1/health

HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 1379
Server: Werkzeug/0.8.1 Python/2.7.3
Date: Fri, 27 Dec 2013 04:10:29 GMT
{
  "status": "OK",
  "output": {
    "detail": \[

    \],
    "timechecks": {
      "round\_status": "finished",
      "epoch": 8,
      "round": 3418,
      "mons": \[
        {
          "latency": "0.000000",
          "skew": "0.000000",
          "health": "HEALTH\_OK",
          "name": "03"
        },
        {
          "latency": "0.001830",
          "skew": "-0.001245",
          "health": "HEALTH\_OK",
          "name": "01"
        },
        {
          "latency": "0.001454",
          "skew": "-0.001546",
          "health": "HEALTH\_OK",
          "name": "02"
        }
      \]
    },
    "health": {
      "health\_services": \[
        {
          "mons": \[
            {
              "last\_updated": "2013-12-27 04:10:28.096444",
              "name": "03",
              "avail\_percent": 87,
              "kb\_total": 20641404,
              "kb\_avail": 18132220,
              "health": "HEALTH\_OK",
              "kb\_used": 1460900,
              "store\_stats": {
                "bytes\_total": 14919567,
                "bytes\_log": 983040,
                "last\_updated": "0.000000",
                "bytes\_misc": 65609,
                "bytes\_sst": 13870918
              }
            },
            {
              "last\_updated": "2013-12-27 04:10:25.155508",
              "name": "01",
              "avail\_percent": 87,
              "kb\_total": 20641404,
              "kb\_avail": 18030408,
              "health": "HEALTH\_OK",
              "kb\_used": 1562712,
              "store\_stats": {
                "bytes\_total": 15968034,
                "bytes\_log": 2031616,
                "last\_updated": "0.000000",
                "bytes\_misc": 65609,
                "bytes\_sst": 13870809
              }
            },
            {
              "last\_updated": "2013-12-27 04:10:24.362689",
              "name": "02",
              "avail\_percent": 87,
              "kb\_total": 20641404,
              "kb\_avail": 18143028,
              "health": "HEALTH\_OK",
              "kb\_used": 1450092,
              "store\_stats": {
                "bytes\_total": 15968294,
                "bytes\_log": 2031616,
                "last\_updated": "0.000000",
                "bytes\_misc": 65609,
                "bytes\_sst": 13871069
              }
            }
          \]
        }
      \]
    },
    "overall\_status": "HEALTH\_OK",
    "summary": \[

    \]
  }
}

### Wrap-up

The ceph-rest-api is powerful.  
You could use it to monitor your cluster with something like nagios or even create a full blown interface to manage your cluster like what [Inktank](http://www.inktank.com/) provides with the Calamari GUI in their enterprise offering.

Personally ? I’m going to toy with the idea of making a wrapper library around the API calls and surely improve the documentation, not only for myself but for the benefit of other ceph users.
