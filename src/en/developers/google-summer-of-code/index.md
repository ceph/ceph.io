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
them once orgs are announced on February 21, 2024. Potential GSoC Contributors can
apply for Ceph's projects at g.co/gsoc from March 18th - April 2, 2024.

See the list of projects we have available for GSoC contributors and [learn how
get started with contributions](https://ceph.io/en/developers/contribute/).

<hr class="hr">

## Improving Shaman the Builder

**Mentor name(s):** Zack Cerza, Kamoltat (Junior) Sirivadhna
Aishwarya Mathuria, Vallari Agrawal

**Mentor email(s):** zcerza@ibm.com, ksirivad@ibm.com, amathuri@ibm.com,
vallariag@ibm.com

**Difficulty:** Medium

**Project Hours:** 350

**Skills needed:** Shell, Python
**Subcomponent of Ceph:** [Build System](https://github.com/ceph/ceph-build)

**Description of project:**
Ceph's build system is far from perfect and have encoutered several
problems in the past. Your job is to work with Ceph's
Infrastructure + Teuthology Team to improve the current build system. 

**Standup/weekly call mentee could attend?:** teuthology weekly meeting

**Steps to evaluate an applicant for the project:**

TBD

<hr class="hr">

## From RADOS to REDIS 

**Mentor name(s):** Yuval Lifshitz

**Mentor email(s):** ylifshit@ibm.com

**Difficulty:** Hard

**Project Hours:** 350

**Skills needed:** C++

**Subcomponent of Ceph:** RGW

**Description of project:** 

Bucket notifications are important building block for many use cases. And persistent bucket notifications in particular, as they let the system overcome broker outages. However, since the persistent notifications are backed with a RADOS queue, they have a cost. Both in the extra load on the RADOS cluster, and with the inability to operate in environemnts where there is no RADOS backend. In this project, we would like to implement persistent bucket notifications in the RADOS Gateway using a Redis Queue. Combined with the "zipper" project we would be able to enjoy bucket notifications with backends like posix, dbstore, daos etc.

**Standup/weekly call mentee could attend?:** RGW standup

**Steps to evaluate an applicant for the project:**

TBD, A link with more detailed instructions will be provided

<hr class="hr">

## RGW AdminAPI Audit & Refactoring

**Mentor name(s):** Ali Maredia, Samarah Uriarte, Josh Durgin

**Mentor email(s):** amaredia@redhat.com, samarah.uriarte@ibm.com, jdurgin@redhat.com

**Difficulty:** Intermediate

**Project Hours:** 350

**Skills needed:** Linux, Python, C++

**Subcomponent of Ceph:** RGW

**Description of project:** 

The Rados Gateway (RGW) has a REST API that can do admin operations called the [admin ops api](https://docs.ceph.com/en/latest/radosgw/adminops/). 

This project have two phases. The first phase would include enhancing the intergration testing coverage of the admin API, and auditing the documentation to make sure it is up to date.
The second phase would entail refactoring the admin API code to ensure it can work with different backends such as posix, dbstore, rados, etc.

**Standup/weekly call mentee could attend?:** RGW standup

**Steps to evaluate an applicant for the project:**

Applicants should be able to write a python program that tests a local RGW's admin API
Refactor a subset of the admin API code

<hr class="hr">

## Lunar Time

**Mentor name(s):** Yuval Lifshitz

**Mentor email(s):** ylifshit@ibm.com

**Difficulty:** Hard

**Project Hours:** 350

**Skills needed:** C++

**Subcomponent of Ceph:** RGW

**Description of project:**

Lua scripts on the RADOS Gateway are powerful, so, in the meantime we only allow admins to add them to the RADOS Gatewway. Before we open this possibility to users, we want to add several protection layers to prevent from careless users to take down the system. One of these measures, will be to limit the execution time of each script, so it does not hog the system, go into infinite loops etc.

**Standup/weekly call mentee could attend?:** RGW standup

**Steps to evaluate an applicant for the project:**

TBD, A link with more detailed instructions will be provided

<hr class="hr">

## The Coverup

**Mentor name(s):** Yuval Lifshitz

**Mentor email(s):** ylifshit@ibm.com

**Difficulty:** Intermediate

**Project Hours:** 175

**Skills needed:** C++

**Subcomponent of Ceph:** Core

**Description of project:**

Code coverage tools are useful in measuring the effectiveness of our unit tests, and in guiding us on where to write for new tests and find potential bugs.
In this project we would like to add the toolset that would allow effective code coverage reporting based on the ceph unit tests.
[old blog pt. 1](https://blog.dachary.org/2013/01/08/ceph-code-coverage-part-12/)
[old blog pt. 2](https://blog.dachary.org/2013/01/16/ceph-code-coverage-part-22/)

**Standup/weekly call mentee could attend?:** RGW standup, Core standup

**Steps to evaluate an applicant for the project:**

TBD, A link with more detailed instructions will be provided

<hr class="hr">
