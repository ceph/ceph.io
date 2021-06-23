---
title: "Ceph Calamari Goes Open Source"
date: "2014-05-30"
author: "scuttlemonkey"
---

Today Red Hat is following through on one of my favorite promises from the acquisition: we’re open sourcing Calamari, the management platform for Ceph. Originally delivered as a proprietary dashboard included with Inktank Ceph Enterprise, Calamari has some really great visualization stuff for your cluster as well as the long term goal of being the all-in-wonder management system that can configure and analyze a Ceph cluster. We’re really glad that we can share this work with the community, with the added benefit of aggregating several different groups of folks working on a management GUI for Ceph. Now, on to the details!

\[caption width="800" align="alignnone"\]![](images/11847079564_738048a775_c.jpg) Photo Credit: [Flickr](https://www.flickr.com/photos/parksjd/11847079564/in/photolist-j3To1u-fX3gjV-9sJtdA-4QqdME-4Qqdvs-bMWNdn-2Dfs36-27o9m-i4m9JU-65chBG-6jk7ZL-4E4Tyq-91uAu7-fwGNxm-8poYHx-5CUh5u-79x4gp-shN7J-6jk4uC-6pN1RD-aafkCC-3JETAA-n739K-y8pba-6581Wn-m1QWXK-a7nAGd-kHLFNK-8sjkC3-d2xD39-8eYHjD-75ZeBk-5CMCUi-2P7xvn-8CUd4a-7CuXmY-9SW7vH-79AVdY-t8MPg-63ZghA-aU4k6H-arMM3x-iY4vtr-fvSQts-9ouCw-2SSgHH-fDR31X-fS2jLA-4Cprfe-aatmvX/)\[/caption\]

### What is Calamari Made of?

Calamari consists of two pieces (and two separate repos, now in the Ceph Github project):

1) [Backend](http://github.com/ceph/calamari) -- the Calamari backend is written in Python 2.6+, using Saltstack, ZeroRPC, gevent, Django, django-rest-framework, graphite, (and a few others I may have forgotten) and instantiates a new REST API for integration with other systems. This is an important distinction because earlier versions of Calamari were based on the Ceph REST API. The new Calamari REST API is designed to be much more comprehensive and should be the basis for new development efforts that wish to interact with a Ceph cluster.

2) [Frontend](http://github.com/ceph/calamari-clients) -- the Calamari frontend is a web browser UI implemented primarily in Javascript that uses the Calamari REST API.

Getting Calamari running is relatively straightforward and can be done by following the README.rst in the source. The basic idea is an agent sits on your cluster machines gathering data and is then periodically polling by the main web agent. We think it’s pretty slick.

### Licensing

As for the license, we have decided on an MIT License for the front end and an LGPL2+ for the backend work. Really we wanted to be as close to the intent of the Ceph license, in addition to being well-aligned with the respective developer communities (MIT is good for javascript UI code), while still allowing plugins that reference proprietary code. There are definitely a lot of potential ways that people could integrate this dashboard work into other existing management tools and monitoring suites, so we didn’t want to limit any integration work that our community may want to do. We’re hoping to keep the licensing bits relatively lightweight though, so that the community can focus on just making a cool GUI and using it to make awesome clusters.

### What Does This Mean for Existing Inktank Ceph Enterprise Customers?

Ultimately this doesn’t change much beyond the fact that you now will have a management interface that benefits from the advantage of many more developers working on it (and testing it!). The Calamari product is developed as an upstream component of Inktank Ceph Enterprise, in the same way that Ceph itself is. The commercial Inktank product will still provide certified and supported binaries.

### How Can I Get Started Hacking on Calamari?

The reason that we pushed this through without a bunch of hullabaloo was so that we could get it into the hands of our community as fast as humanly possible. As such you are free to begin hacking immediately in the same way as you engage with the rest of the Ceph codebase. Below I have included a short FAQ and some contribution guidelines from John Spray (one of the Inktank Calamari devs) that should answer some of your questions, but you are always welcome to pose discussions on [IRC](irc://irc.oftc.net/ceph), the [mailing lists](http://ceph.com/resources/mailing-list-irc/) (notice the new **ceph-calamari** list), or as a [development blueprint](https://wiki.ceph.com/Planning/Blueprints) on our wiki.

For more details on the “big picture” thoughts of both Calamari and Inktank Ceph Enterprise, check out Neil Levine’s [blog post](http://www.inktank.com/?p=4357) over on inktank.com. If you still have questions you can always feel free to contact me directly (@scuttlemonkey or patrick at inktank). I look forward to our new army of GUI developers!

scuttlemonkey out

### FAQ

**Q** What's the relationship between Calamari and ceph-deploy? **A** Calamari doesn't include deployment functionality, but we expect that in the long term Calamari will have hooks for deployment tools that include both ceph-deploy and other tools like Puppet, Chef, Juju, etc.

**Q** What's the relationship between Calamari's REST API and the Ceph REST API? **A** The Ceph REST API is a low level interface, where each URL maps directly to an equivalent command to the \`ceph\` CLI tool. The Calamari REST API presents a higher level interface, where API consumers can manipulate objects using idiomatic GET/POST/PATCH operations without knowing the underlying Ceph commands. The Calamari REST API also includes functionality related to managing servers in general, as well as pure Ceph functionality. The main distinction between them is that the Ceph REST API will require a high degree of knowledge about Ceph internals, whereas the Calamari REST API produces interpreted data and is designed for many applications to be built on top of it.

**Q** I'm not a UI developer, can I still hack on Calamari? **A** Absolutely: we welcome implementation of features on the backend or suggestions on how to extend the API, to be exposed in a UI later. We would also welcome UX/UI help in the form of graphic design, even if you aren’t able to implement it with code.

**Q** Why are you using SaltStack instead of \[Ansible|Chef|Puppet\]? **A** Saltstack was chosen for its ease of integration with python applications, and for its secure, lightweight message bus.

**Q** What are the system requirements for a Calamari server? **A** The answer to this varies depending on the size of the Ceph cluster being managed. Calamari server is intended to be very frugal in its use of system resources, especially I/O. The main I/O consumer on the Calamari server is usually graphite, rather than Calamari itself.

**Q** Can I use the Calamari backend to integrate Ceph with my own user interface? **A** Yes: this is one of the primary goals of the Calamari REST API.

**Q** How should I send patches for Calamari? **A** Please use github pull requests, following the same commit message guidelines as ceph

### Contribution Guidelines

- Expose functionality cleanly via the REST API: use appropriate HTTP verbs and JSON document syntax, including validation for appropriate 400/304 response codes.
- Remote and potentially long running operations are implemented as UserRequest subclasses, \*not\* called directly from REST API handlers.
- Avoid persistence for anything that doesn't really need it, and do persistence asynchronously. We want to avoid operations blocking on DB I/O when they could return immediately and persist in the background, and we want to avoid writing lots of monitoring data to the database just to have the REST API code poll it: hold the current state in memory and expose it to the REST API layer using ZeroRPC.
- Design your code to cope gracefully with 1000s of OSDs and millions of PGs. For example, we don't pass the full PG data through Calamari server, instead reducing it to a summary while gathering it from the mon.
- Call out directly from REST API layer to outside world where it makes sense: for example, when we grab the tail of a log, read a graphite statistic, or manage Salt authentication keys, these operations are done directly from the REST API to the relevant external actor, without an intermediate ZeroRPC hop.
- Don't be shy about creating new services (processes on the backend exposing ZeroRPC interfaces): if you are implementing a substantial new feature it may well be appropriate to create a new service on the backend to handle it. Remember that more than one service can subscribe to the same messages from salt, and the REST API layer can call into as many different ZeroRPC interfaces as it needs to fulfil a request. Creating services is easy because you can add them to the supervisord configuration: no packaging changes needed.
- Follow the coding guidelines in doc/development/coding\_style.rst
- Run tests (at least the unit tests) before sending us a pull request.
- Write tests for your new functionality: unit tests for isolated functionality like REST API validation or helper functions, integration tests (i.e. top level tests/) for end-to-end features
