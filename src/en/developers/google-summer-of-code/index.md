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

## Shaman Scheduling for Success

**Mentor name(s):** Zack Cerza, Kamoltat (Junior) Sirivadhna
Aishwarya Mathuria, Vallari Agrawal

**Mentor email(s):** zack1@ibm.com, ksirivad@ibm.com, aishwarya.mathuria@ibm.com, vallari.agrawal@ibm.com

**Difficulty:** Medium

**Project Hours:** 350

**Skills needed:** Shell, Python, FastAPI

**Subcomponent of Ceph:** [Ceph Build System](https://github.com/ceph/ceph-build), [Ceph Integration Test Framework](https://github.com/ceph/teuthology)

**Description of project:**
We can make the process of scheduling Ceph integration tests upstream more efficient by allowing users to auto-schedule teuthology-suite commands
when pushing their feature-branch to ceph-ci.

Your mission is to build the auto-schedule feature based off a pre-existing work:

[teuthology-api pull request](https://github.com/ceph/teuthology-api/pull/24)

[ceph-build pull request](https://github.com/VallariAg/ceph-build/commit/217f080a45c00a07829be9c0ce51057f23b27ddc)

**Standup/weekly call mentee could attend?:** teuthology weekly meeting

**Steps to evaluate an applicant for the project:**

TBD

**Expected Outcome(s):**

A working auto-schedule feature for at least one suite.

<hr class="hr">

## From RADOS to REDIS

**Mentor name(s):** Yuval Lifshitz

**Mentor email(s):** ylifshit@ibm.com

**Difficulty:** Hard

**Project Hours:** 350

**Skills needed:** C++

**Subcomponent of Ceph:** RGW

**Description of project:**

Detailed description of the project, as well as the steps expected to ba taken by candidates in the evaluation stage could be found [here](https://gist.github.com/yuvalif/26ff6c115a8386d1d47f2ed4e38cfd39)

**Expected Outcome(s):**

Persistent bucket notifications being stored in a Redis cluster that is being read and written to by the RADOS Gateway with non RADOS backends like posix store

<hr class="hr">

## RGW AdminAPI Audit & Refactoring

**Mentor name(s):** Ali Maredia, Samarah Uriarte

**Mentor email(s):** amaredia@redhat.com, samarah.uriarte@ibm.com

**Difficulty:** Intermediate

**Project Hours:** 350

**Skills needed:** Linux, Python, C++

**Subcomponent of Ceph:** RGW

**Description of project:**

The Rados Gateway (RGW) has a REST API that can do admin operations called the [admin ops api](https://docs.ceph.com/en/latest/radosgw/adminops/).

This project have two phases. The first phase would include enhancing the intergration testing coverage of the admin API, and auditing the documentation to make sure it is up to date.
The second phase would entail refactoring the admin API code to ensure it can work with different backends such as posix, dbstore, rados, etc.

**Expected Outcome(s):**

For the first phase, improvements to the test suite that tests the RGW admin API. In the second phase would be a working admin API with a non-RADOS backend like posix store

<hr class="hr">

## Tidy Up Song

**Mentor name(s):** Ronen Friedman, Yuval Lifshitz

**Mentor email(s):** rfriedma@ibm.com, ylifshit@ibm.com

**Difficulty:** Intermediate

**Project Hours:** 175

**Skills needed:** C++

**Subcomponent of Ceph:** RGW, Core

**Description of project:**

Detailed description of the project, as well as the steps expected to ba taken by candidates in the evaluation stage could be found [here](https://gist.github.com/yuvalif/b29efb8ff2c68831eaf70870c6398869)

**Expected Outcome(s):**

Have clang-tidy run against Ceph PRs, and show errors only if introduced in the PR.

<hr class="hr">
