---
title: "openATTIC 3.4.1 has been released"
date: "2017-06-21"
author: "admin"
tags: 
  - "planet"
---

We are very happy to announce the release of openATTIC version 3.4.1 In this version we completely removed Nagios/PNP4Nagios graphs from the UI and installation in favor of Prometheus/Grafana.

We've continued with the integration of Ceph Luminous features. The 'allow\_ec\_overwrites' flag can now be set when creating erasure coded pools via the REST API. The UI part is currently under construction. Enabling the features "layering" and "striping" at once is also supported when creating an RBD now. Furthermore support for the new 'ceph health' format has been integrated.

The UI settings page has been extended to support the configuration of Grafana and gracefully handle a not properly entered config - which means it's no longer needed to set this configuration in /etc/sysconfig/openattic or /etc/default/openattic. The Salt-API could now be configured by using sharedsecret-key authentication, in addition to 'auto'. As usual we also improved some exsting UI features, this release, for example, contains help-text changes to provide users with more troubleshooting hints for possible solution.

[Read more…](http://openattic.org/posts/openattic-341-has-been-released/) (3 min remaining to read)

Source: SUSE ([openATTIC 3.4.1 has been released](http://openattic.org/posts/openattic-341-has-been-released/))
