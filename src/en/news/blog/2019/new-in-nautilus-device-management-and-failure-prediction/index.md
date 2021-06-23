---
title: "New in Nautilus: device management and failure prediction"
date: "2019-04-12"
author: "sage"
tags: 
  - "nautilus"
---

Ceph storage clusters ultimately rely on physical hardware devices--HDDs or SSDs--that can fail. Starting in Nautilus, management and tracking of physical devices is now handled by Ceph. Furthermore, we've added infrastructure to collect device health metrics (e.g., SMART) and to predict device failures before they happen, either via a built-in pre-trained prediction model, or via a SaaS service.

## Managing devices

Ceph has always taken the approach that storage devices are just one of many physical components that can fail and has instead focused attention on the failure of the storage daemons themselves.  Whether it was a bad CPU, network link, memory, power supply, or storage device that failed, the end result is the storage daemon process stops and the system must cope.  This has generally worked out well, except that when a fault _does_ occur, it is often tedious to trace the failure of a daemon (say, osd.123) back to the failing hardware that needs to be replaced.  Usually it's the hard disk or SSD that's failing, so it's time that we made the part of cluster management easier.

Starting in Nautilus, Ceph identifies physical devices by _$vendor\_$model\_$serial_.  For example, WDC\_WD40EFRX-68N32N0\_WD-WCC7K2ZL0V6K or Micron\_MTFDHBG800MCG-1AN1ZABYY\_ZF1000DQ. Both OSD and Monitor collect metadata about which physical devices they are consuming (whether they are directly consumed or layered beneath devicemapper or LVM) and report that to the monitor and manager.  You can see a full inventory of which devices are consumed with the new ceph device ls command:

> $ ceph device ls
> DEVICE                                  HOST:DEV      DAEMONS LIFE EXPECTANCY 
> Crucial\_CT1024M550SSD1\_14160C164100     stud:sdd      osd.40               
> Crucial\_CT1024M550SSD1\_14210C25F933     stud:sdc      osd.39               
> Crucial\_CT1024M550SSD1\_14210C25F936     stud:sde      osd.41               
> INTEL\_SSDPE2ME400G4\_CVMD5442003M400FGN  cpach:nvme0n1 osd.10                  
> INTEL\_SSDPE2MX012T4\_CVPD6185002R1P2QGN  stud:nvme0n1  osd.1                   
> ST2000NX0253\_S4608PDF                   cpach:sdo     osd.7                   
> ST2000NX0253\_S46097S2                   cpach:sdr     osd.4                   
> ST2000NX0253\_S460TMFE                   eutow:sdl     osd.32                  
> Samsung\_SSD\_850\_EVO\_1TB\_S2RENX0J500066T cpach:sdb     osd.17               
> Samsung\_SSD\_850\_EVO\_1TB\_S2RENX0J504842Z stud:sdt      osd.23               
> WDC\_WDS200T2B0A-00SM50\_183503800168     cpach:sdn     osd.56               
> WDC\_WDS200T2B0A-00SM50\_183503800398     stud:sdg      osd.62                  
> WDC\_WDS200T2B0A-00SM50\_183503800843     stud:sdf      osd.61                  

You can also limit the results to devices consumed by a specific daemon or host:

> $ ceph device ls-by-daemon <daemon-name>
> $ ceph device ls-by-host <host>

You can get information about a specific device with

> $ ceph device info Seagate\_ST31000524AS\_5VP8JLY4
> device Seagate\_ST31000524AS\_5VP8JLY4
> attachment mira116:sdf
> daemons osd.53

This will tell you specifically which daemons have reported consuming the device, and what device name it last held on which hosts.  Although multi-path devices were not tested, Ceph _should_ report all hosts where the device has been consumed.

## Health metrics

Nautilus can also monitor the health metrics for these devices.  For SATA devices this is done via SMART, and for SAS and NVMe devices there are similar standards that are mostly collectively referred to as SMART by humans (despite SMART technically being a SATA standard).

The content of each scrape comes from the smartctl command.  Version 7.0 of smartmontools is required for this to work (just released on Dec 30 2018) as that version adds the JSON output mode that our scraper consumes.  This version has not made its way into the various downstream Linux distributions or the ceph-container image, but these pieces should fall into place soon.  For the time being, you may need to build from source and manually install smartctl on your cluster.

To enable device monitoring,

> $ ceph device monitoring on

To disable monitoring,

> $ ceph device monitoring off

Once enabled, Ceph will scrape metrics every 24 hours by default.  These metrics are stored in a RADOS pool called device\_health\_metrics, and can be dumped with a command like ceph device get-health-metrics <devid>.  For example,

> $ ceph device get-health-metrics Micron\_MTFDHBG800MCG-1AN1ZABYY\_ZF1000DQ | head
> {
>     "20190402-000812": {
>         "nvme\_controller\_id": 0, 
>         "power\_on\_time": {
>             "hours": 10120
>         }, 
>         "nvme\_smart\_health\_information\_log": {
>             "controller\_busy\_time": 15126, 
>             "host\_writes": 4622443474, 
>             "temperature": 55, 

You can also force an immediate scrape of metrics with any of

> ceph device scrape-health-metrics
> $ ceph device scrape-health-metrics <devid>
> $ ceph device scrape-daemon-health-metrics <daemon-name>

By default, metrics are preserved for two weeks and then discarded. You can adjust this with

> $ ceph config set mgr mgr/devicehealth/scrape\_frequency <duration>

where the duration can be specified as seconds or with an h, d, w, or similar suffix (e.g., 3w means three weeks).

## Failure prediction

The primary goal of gathering metrics is to predict failures before they happen.  There are currently a few modes supported by Ceph:

- **none**: disable failure prediction (this is the default)
- **local**: use a pre-trained model, running the ceph-mgr daemon, to predict the remaining life for each device.  The model was trained and contributed by [ProphetStor](https://www.prophetstor.com/), and AIOps company.
- **cloud**: use [ProphetStor](https://www.prophetstor.com/)'s cloud-based prediction service.  This can be enabled for free and, if you're comfortable sharing your failure data (and some other performance-related metrics) with a third party, you'll get a more accurate life expectancy prediction.  ProphetStor also has a commercial cloud-based plan with their most accurate model, as well as an option to deploy their service on-premises.  For more information about ProphetStor's failure prediction service for Ceph, you can visit [their web site](https://www.prophetstor.com/).

You can set the prediction mode with:

> $ ceph config set global device\_failure\_prediction\_mode <mode>

Once prediction is enabled, the cluster will (eventually) be informed about each device's _life expectancy_, which is specified as a time interval describing when the device is predicted to fail.  The width of that interval is meant to provide some indication of the certainty of the prediction, although the range is not rigorously defined in terms of a confidence interval or other formal concept in statistics.  You'll see this life expectancy (if known) reported as part of the ceph device ls output, although for most devices there is no anticipated failure and the field will remain blank:

> $ ceph device ls
> DEVICE                                  HOST:DEV      DAEMONS LIFE EXPECTANCY 
> Crucial\_CT1024M550SSD1\_14160C164100     stud:sdd      osd.40  3m             
> Crucial\_CT1024M550SSD1\_14210C25B79E     eutow:sds     osd.19               
> Crucial\_CT1024M550SSD1\_14210C25B79F     eutow:sdq     osd.21               

One thing to keep in mind is that failure prediction is new, and we don't have a lot of real-world experience that tells us how accurate it is.  Please consider enable prediction, keep an eye on what it tells you, and let us know what you see, but take these life expectancy values with a grain of salt.

## Responding to predictions

By default, the clusters response to devices that are expected to fail soon is to raise a health warning.  There are several different alerts that we generate:

- _DEVICE\_HEALTH_: One or more devices is expected to fail soon.  The threshold is controlled by the mgr/devicehealth/warn\_threshold configuration option and defaults to three months.
- _DEVICE\_HEALTH\_TOOMANY_: Lots of devices are expected to fail soon--enough that if they are all marked out it will push the cluster below the configured mon\_osd\_min\_in\_ratio.
- _DEVICE\_HEALTH\_IN\_USE_: One or more device is expected to fail soon, have been marked out, but data hasn't been fully migrated off yet.

The cluster can also be configured to automatically mark OSDs out when they are backed by devices that are expected to fail.  To enable this,

> $ ceph config set global mgr/devicehealth/self\_heal true

When this is enabled, the mgr/devicehealth/mark\_out\_threshold controls how short a device life expectancy must be before we mark out an OSD.  The default is four weeks.

## Thanks

The work to collect and store health metrics was driven by Yaarit Hatuka, a recent Outreachy intern. The failure prediction code, both for the local and cloud modes, was contributed by Rick Chen at ProphetStor. A big thank you to both of them for driving this work to completion!

## What's next: blinking lights

Now that Ceph finally has some information about the physical devices we are consuming, and the user interfaces to inspect them, we have an opportunity to blink lights on hardware enclosures to make the replacement of failed disks easy and less error-prone!  This is still a work in progress, and will require some support from the new orchestration layer that has been introduced in Nautilus but is still in its early stages, but the idea is that you'll soon be able to do something like

> $ ceph device light fault <devid> on
> $ ceph device light fault <devid> off

The first orchestrators that will gain support for this are DeepSea and Rook, and once available we expect to see it backported to Nautilus.

## What's next: improving prediction accuracy

One of the challenges with the current failure prediction is that it works as a black box.  The pre-trained prediction model that ProphetStor contributed is trained with their private data set of failure data, and it is unclear to the open source community what devices are well covered, what the training parameters were, and so on.

There is a related project that aims to create an open data set of device health metric data that can be used to train open source prediction models based entirely on open data. Currently, the only data available is that [published by BackBlaze](https://www.backblaze.com/b2/hard-drive-test-data.html) (who, incidentally, deserve much credit for doing so--several cloud providers have published academic papers around device failure prediction but to my knowledge none have shared their data). The goal, once the project kicks off, is to allow Ceph users (and others!) to opt-in to sharing their device health metrics, which will include most of the metrics the cluster currently gathers, minus the device serial numbers and other fields which raise privacy concerns.  In time, we'll be able to build a larger and more comprehensive data set of data from a broad range of devices and use that to train more accurate failure prediction models.  Stay tuned!
