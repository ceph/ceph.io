---
title: Google Summer of Code
order: 5
---

![Google Summer of Code](/assets/bitmaps/hero-gsoc.png)

Google Summer of Code (g.co/gsoc) is Google's mentorship program for bringing
new contributors into open source communities.

Google Summer of Code is a unique program where new contributors to open
source, ages 18 and over, are paired with a mentor to introduce them to the
open source community and provide guidance while they work on a real world open
source project over the summer. Projects cover a wide range of fields
including: Cloud, Operating Systems, Graphics, Medicine, Programming Languages,
Robotics, Science, Security and many more. GSoC Contributors do earn a stipend
to work on their small, (~90 hour), medium (~175 hour) or large (~350 hour) projects.

GSoC is a highly competitive program, so don't wait to the last minute to
prepare! GSoC Contributors should reach out to the mentors of projects that interest
them once orgs are announced on February 27, 2025. Potential GSoC Contributors can
apply for Ceph's projects at g.co/gsoc from March 24th - April 8, 2025.

See the list of projects we have available for GSoC contributors and [learn how
get started with contributions](https://ceph.io/en/developers/contribute/).

For any questions, contact Vallari Agrawal (vallari.agrawal@ibm.com).


<hr class="hr">

## Teuthology on Podman

**Mentor name(s):** Zack Cerza, Kamoltat (Junior) Sirivadhna
Aishwarya Mathuria, Vallari Agrawal

**Mentor email(s):** zack1@ibm.com, ksirivad@ibm.com, aishwarya.mathuria@ibm.com, vallari.agrawal@ibm.com

**Difficulty:** Hard

**Project Hours:** 175

**Skills needed:** python, containerisation, linux 

**Subcomponent of Ceph:** [Ceph Integration Test Framework](https://github.com/ceph/teuthology)

**Description of project:**

[ceph-devstack](https://github.com/zmc/ceph-devstack) is an in-development tool that uses rootless podman containers to deploy a scaled-down teuthology lab. It has proven useful for testing changes to teuthology and its related services, allowing us to more easily and flexibly make changes to components without worrying about causing outages.

It has some basic ability to run Ceph tests, but could benefit significantly from more investment in that area.

Improve and extend ceph-devstack's ability to perform teuthology tests against Ceph builds. This project will involve writing Python code and tests to orchestrate podman containers, and working with security systems like SELinux, CGroups, and Linux capabilities.


**Standup/weekly call mentee could attend?:** Teuthology weekly meeting

**Steps to evaluate an applicant for the project:** TBD

**1-2 short pararaphs about what first 2 weeks of work would look like during the internship:** TBD

**Expected Outcome:**  

Extend ceph-devstack's ability to perform teuthology tests

<hr class="hr">

## smartmontools drivedb.h postprocessor

**Mentor name(s):** Anthony D'Atri

**Mentor email(s):** anthony.datri@ibm.com

**Difficulty:** Intermediate

**Project Hours:** 90

**Skills needed:** c++, maybe python or golang 

**Subcomponent of Ceph:** Observability 

**Description of project:**

smartmontools (smartctl) is pretty much the only game in town for harvesting metrics and counters from
storage devices:  SMART for SATA, a few things for SAS, and passthrough to nvme-cli for NVMe.
It leverages a runtime file named drivedb.h that directs what attributes are to be found with what
numeric IDs, and how to interpret them.  drivedb.h is a mess, and upstream smartmontools would likely
resist wholesale refactoring.  For example, SSD wear might be labeled as "lifetime remaining" or
"wear level" or multiple other strings.  Some devices also report wear used, others wear remaining.

One task would be to add an interpretation primitive to the c++ code so that a drivedb.h entry 
can specify that the result should be subtracted from 100.  
The larger task would be to write a postprocessor for drivedb.h that more or less is a sequence
of regex invocations that converges the existing freeform attribute label names into a
normalized, defined set.  Many tools just pass through the text labels, so doing meaningful
analysis or queries is difficult; often only a fraction of the data is actually captured as a result.
The output also includes numeric attribute IDs, which are less varied, but relying on them instead of
the text labels is fraught because these numeric IDs are not strictly standardized either.  I have
seen drives that report a metric on a different numeric ID than most others, and/or that report
a different metric on a specific numeric than most others report on that ID.

For extra credit, interface with the central telemetry DB as described in project "Public telemetry slice/dice of SMART data".

**Standup/weekly call mentee could attend?:** TBD 

**Steps to evaluate an applicant for the project:** 
Ability to leverage code libraries and write the glue code.

**1-2 short pararaphs about what first 2 weeks of work would look like during the internship:** TBD

<hr class="hr">

## The More The Merrier

**Mentor name(s):** Yuval Lifshitz

**Mentor email(s):** ylifshit@ibm.com

**Difficulty:** Hard

**Project Hours:** 350

**Skills needed:** C++, Python

**Subcomponent of Ceph:** RGW

**Description of project:**

Persistent bucket notifications are a very useful and powerful feature 

tech talk: https://www.youtube.com/watch?v=57Ejl6R-L20

usecase example: https://www.youtube.com/watch?v=57Ejl6R-L20

However, they can pose a performance issue, since the notifications regarding a pecific bucket
are written to a single RADOS queue (unlike the writes to the bucket which are distributed across multiple
bucket shards. So, in case that small objects are written to the bucket, the overhead of the notifications is considerable.
In this project, our goal would be to create a sharded bucket notifications queue, to allow for better performance of sending 
persistent bucket notifications.

**Standup/weekly call mentee could attend?:** RGW daily Standup, RGW weekly refactoring meeting

**Steps to evaluate an applicant for the project:** 

* build ceph from source and run basic bucket notification tests
* fix low-hanging-fruit issues in bucket notifications

**1-2 short pararaphs about what first 2 weeks of work would look like during the internship:** TBD

**Expected outcome:** 

* sharded implementation of persistent topic queue
* stretch goal: perf test proving performance improvement

<hr class="hr">

## Public telemetry slice/dice of SMART data 

**Mentor name(s):** Anthony D'Atri

**Mentor email(s):** anthony.datri@ibm.com

**Difficulty:** Intermediate

**Project Hours:** 175

**Skills needed:** Some coding language, Python or Go, jq or JSON parsing or other text library.

**Subcomponent of Ceph:** telemetry

**Description of project:**

Public telemetry today offers a few Grafana panels and downloadable archives of anonymized data.  One field
is a JSON blob of smartctl output.  Parse this, apply a normalization layer, deduplicate, and present in
one or more formats that facilitate analysis:
* CSV file containing atributes for only the latest report found for a given device
* The number of data points might be too high, but possibly a Grafana dashboard or even spreadsheet with template variables for 
  manufacturer/model, interface type, etc. with various panes:
    * Histograms of power_on hours, normalized endurance used or remaining, etc
    * histogram or table of endurance remaining vs power on hours or TBW, i.e. allowing one
        to predict drive lifetime and inform purchase decisions, vs. assuming that SSDs especially QLC lack endurance
        or that high-endurance SKUs are required.
    * reallocated sectors over time, etc.

**Standup/weekly call mentee could attend?:** TBD

**Steps to evaluate an applicant for the project:** Coding experience beyond Karel 

**1-2 short pararaphs about what first 2 weeks of work would look like during the internship:**

Gain familiarity with the data format, including JSON.  Discuss input filtering: skip over invalid entries,
handle submissions from older smartmontools, uniqify, learn about SMART -- and how dumb it is, the need for nomalization
of counters. 

**Expected outcome**:

Described above under Description. More specifically, deriving the rate of wear over time for each specific SSD for which we have more than say a month of data:  capture the delta between earliest and latest wear levels reported for each given serial number, and the time delta between those samples.  Divide the wear delta by the time delta for rate of wear over time.

<hr class="hr">

## Warm and Fuzzy

**Mentor name(s):** Yuval Lifshitz

**Mentor email(s):** ylifshit@ibm.com

**Difficulty:** Intermediate

**Project Hours:** 175

**Skills needed:** C++, Python and also depending with the tool

**Subcomponent of Ceph:** RGW

**Description of project:**

The RGW's frotend is an S3 REST API server, and in this project we would like to use a REST API fuzzer to test the RGW for secuirty issues (and other bugs).
First step of the project would be to select the righ tool (e.g. https://github.com/microsoft/restler-fuzzer),
feed it with the AWS S3 OpenAPI spec, and see what happesn when we let it connect to the RGW.
Fixing issues the fuzzer finds would nice, but the real strech goal would be to integrate these tests into teuthology.

**Standup/weekly call mentee could attend:** RGW daily Standup, RGW weekly refactoring meeting

**Steps to evaluate an applicant for the project:** 

* build ceph from source and run basic s3 tests
* run sts tests against RGW
* run the REST fuzzing tool

**1-2 short pararaphs about what first 2 weeks of work would look like during the internship:** TBD

**Expected outcome:**

* find and fix security issues in the RGW found by the fuzzing tool
* stretch goal: integrate tool into automated teuthology runs

<hr class="hr">

