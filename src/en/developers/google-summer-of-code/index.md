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

For more details about the evaluation tasks, see [here](https://github.com/zmc/ceph-devstack?tab=readme-ov-file#for-gsoc-2025-applicants).

**Standup/weekly call mentee could attend?:** Teuthology weekly meeting

**Steps to evaluate an applicant for the project:** TBD

**1-2 short paragraphs about what first 2 weeks of work would look like during the internship:** TBD

**Expected Outcome:**  

Extend ceph-devstack's ability to perform teuthology tests

<hr class="hr">

## smartmontools drivedb.h postprocessor

**Mentor name(s):** Anthony D'Atri, Sunil Angadi

**Mentor email(s):** anthony.datri@ibm.com, sunil.angadi@ibm.com

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

For more details about the project and evaluation steps, see [here](https://gist.github.com/sunilangadi2/729ae4855ab0997b27108e6c6e60781c).

**Standup/weekly call mentee could attend?:** TBD 

**Steps to evaluate an applicant for the project:** 
Ability to leverage code libraries and write the glue code.

**1-2 short paragraphs about what first 2 weeks of work would look like during the internship:** TBD

<hr class="hr">

## The More The Merrier

**Mentor name(s):** Yuval Lifshitz

**Mentor email(s):** ylifshit@ibm.com

**Difficulty:** Hard

**Project Hours:** 350

**Skills needed:** C++, Python

**Subcomponent of Ceph:** RGW

**Description of project:**


Detailed description of the project and evalution steps can be found [here](https://gist.github.com/yuvalif/9c5a1ed326ca14cf4851d7a0b8ba0db8).

Persistent bucket notifications are a very useful and powerful feature 

tech talk: https://www.youtube.com/watch?v=57Ejl6R-L20

usecase example: https://www.youtube.com/watch?v=57Ejl6R-L20

However, they can pose a performance issue, since the notifications regarding a specific bucket
are written to a single RADOS queue (unlike the writes to the bucket which are distributed across multiple
bucket shards. So, in case that small objects are written to the bucket, the overhead of the notifications is considerable.
In this project, our goal would be to create a sharded bucket notifications queue, to allow for better performance of sending 
persistent bucket notifications.


**Standup/weekly call mentee could attend?:** RGW daily Standup, RGW weekly refactoring meeting

**Steps to evaluate an applicant for the project:** 

* build ceph from source and run basic bucket notification tests
* fix low-hanging-fruit issues in bucket notifications

**1-2 short paragraphs about what first 2 weeks of work would look like during the internship:** TBD

**Expected outcome:** 

* sharded implementation of persistent topic queue
* stretch goal: perf test proving performance improvement

<hr class="hr">

## Warm and Fuzzy

**Mentor name(s):** Yuval Lifshitz, Pritha Srivastava

**Mentor email(s):** ylifshit@ibm.com, Pritha.Srivastava@ibm.com

**Difficulty:** Medium 

**Project Hours:** 175

**Skills needed:** C++, Python and also depending with the tool

**Subcomponent of Ceph:** RGW

**Description of project:**

The RGW's frontend is an S3 REST API server, and in this project we would like to use a REST API fuzzer to test the RGW for security issues (and other bugs).
First step of the project would be to select the right tool (e.g. https://github.com/microsoft/restler-fuzzer),
feed it with the AWS S3 OpenAPI spec, and see what happens when we let it connect to the RGW.
Fixing issues the fuzzer finds would nice, but the real stretch goal would be to integrate these tests into teuthology.

**Standup/weekly call mentee could attend:** RGW daily Standup, RGW weekly refactoring meeting

**Steps to evaluate an applicant for the project:** 

Detailed description of the project and evalution steps can be found [here](https://gist.github.com/yuvalif/4c922fd9f5e472a342e8b585be1f23ef). 

**1-2 short paragraphs about what first 2 weeks of work would look like during the internship:** TBD

**Expected outcome:**

* find and fix security issues in the RGW found by the fuzzing tool
* stretch goal: integrate tool into automated teuthology runs


<hr class="hr">


## Ceph Dashboard Usability Improvements

**Mentor name(s):** Afreen Misbah

**Mentor email(s):** afreen@ibm.com

**Difficulty:** Easy

**Project Hours:** 175

**Skills needed:** Typescript, Angular, and basic understanding of HTML & CSS.

**Subcomponent of Ceph:** Dashboard

**Description of project:**

Ceph Dashboard is Ceph's management and monitoring tool. It's a web application tool with Angular/Typescript on frontend side and Python as backend. 

We are in an effort to provide more usability workflows and solve UX issues to make management and monitoring easy for Ceph users. 

The task includes improving the notification system and creating a workflow for managing NVMe-oF devices from dashboard.

**Standup/weekly call mentee could attend?:** Dashboard daily sync

**Steps to evaluate an applicant for the project:** 

* Build ceph dashboard locally via docker-compose and kcli both
* Able to understand issues and ask useful questions
* Eagerness to learn and contribute

**1-2 short paragraphs about what first 2 weeks of work would look like during the internship:** 

Learning about ceph and storage and gradually contributing to the dashboard.

**Expected Outcome:**  

Improve dashboard usability.


<hr class="hr">

