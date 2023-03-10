---
title: Google Summer of Code
order: 5
---

![Google Summer of Code](/assets/bitmaps/hero-gsoc.png)

Google Summer of Code (g.co/gsoc) is Google's mentorship program for bringing
new contributors into open source communities. It's happening again for the
19th year in 2023! Over 18,000 developers from 112 countries have participated.

Google Summer of Code is a unique program where new contributors to open
source, ages 18 and over, are paired with a mentor to introduce them to the
open source community and provide guidance while they work on a real world open
source project over the summer. Projects cover a wide range of fields
including: Cloud, Operating Systems, Graphics, Medicine, Programming Languages,
Robotics, Science, Security and many more. GSoC Contributors do earn a stipend
to work on their medium (~175 hour) or large (~350 hour) projects. This is not
an internship but provides an invaluable experience and allows you to be part
of an amazing community!

GSoC is a highly competitive program, so don't wait to the last minute to
prepare! GSoC Contributors should reach out to the organizations that interest
them once orgs are announced on May 4, 2023. Potential GSoC Contributors can
apply at g.co/gsoc from March 20 - April 4, 2023.

See the list of projects we have available for GSoC contributors and [learn how
get started with contributions](https://ceph.io/en/developers/contribute/).

<hr class="hr">

## Disk Fragmentation Simulator

**Mentor name(s):** Adam Kupczyk

**Mentor email(s):** akupczyk@ibm.com

**Difficulty:** Intermediate

**Project Hours:** 350

**Skills needed:** C++, Random Distributions, Data Presentation

**Subcomponent of Ceph:** BlueStore

**Description of project:**
BlueStore is a component of Ceph responsible for storing objects.
Object is a data container, like a file with extra capabilities.
To assign an object some free disk region BlueStore uses a disk allocator component.
When BlueStore was created it came with a simple disk allocator.
That worked pretty well in testing and even on customer deployments.

Customer workloads sometimes have complicated write patterns that expose allocator
deficiencies. In most cases the observed negative effect is object fragmentation.
Fragmentation is not a critical issue, an object that is distributed on the disk to
multiple fragments is still valid, but accessing it drags performance.

Long term goal is to augment BlueStore with fragmentation control / combat features.
We understand that implementing algorithms is costly and we want to evaluate
quality of certain concepts before we start implementation.
We expect to see in each algorithm some emergent properties, and we need
to squeeze months of customer operation into minutes.

We need a disk fragmentation simulator.

The simulator will provide an environment to test prospective allocators.
It will apply data-trashing workloads. Workloads will reflect the fact that
customer patterns usually change from time to time. Object access distributions should
periodically change; peak, hot objects set, r/w access size. Extra random events
that are specific to Ceph OSD (placement group add, placement group remove) can be added later.

The simulator must measure the quality of object fragmentation. It would be good
to have 2 types of measured fragmentation score: static per-object and dynamic related
to customer workload currently simulated. A great extra would be an ability to
represent fragmentation as some kind of diagram, use color as presentation aid, and show
the evolution of fragmentation in time.

The simulator platform should be written in C++ but must incorporate the existing Allocator interface.
The platform should expose C++ interface toward "defragmentation algorithm".

A contribution in the form of a new allocator proposal or defragmentation strategy is welcomed but secondary.
The goal is to evaluate allocators as we want to root out or at least document behaviour of a long running system.

**Standup/weekly call mentee could attend?:** Core standup & Bluestore Upkeep & Evolution

**Steps to evaluate an applicant for the project:**

Applicant should email the mentor (akupczyk@ibm.com) for detailed instructions on the projects application process.

In a process of assessing applicant, one will:
- write C++ sample on operations on large in-memory collections
- write C++ sample on some math code
- write C++ sample on random sequence generation
- checkout & basic compile ceph
- write sample that produces an image from C++ data

<hr class="hr">

## Gotta Catch 'Em All

**Mentor name(s):** Yuval Lifshitz

**Mentor email(s):** ylifshit@ibm.com

**Difficulty:** Intermediate

**Project Hours:** 175

**Skills needed:** C++

**Subcomponent of Ceph:** RGW

**Description of project:** 
Use the Coverity static snalysis tool to cleanup issues from the RGW code.

Applicants can get a more detailed overview of the project [here](https://gist.github.com/yuvalif/71a5c827a16269554c1a7f8f15234f09)

**Standup/weekly call mentee could attend?:** RGW standup

**Steps to evaluate an applicant for the project:**

Applicants should build ceph, analyze and fix a simple coverity issue. 

To learn how to get started visit this [link](https://gist.github.com/yuvalif/71a5c827a16269554c1a7f8f15234f09)

<hr class="hr">
