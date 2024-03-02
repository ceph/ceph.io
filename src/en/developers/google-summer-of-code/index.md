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

**Expected Outcome(s):**

A reduction in build times from Ceph developers pushing to the ceph-ci repo to rpms, debs, and containers bieng created

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

## Lunar Time

**Mentor name(s):** Yuval Lifshitz

**Mentor email(s):** ylifshit@ibm.com

**Difficulty:** Hard

**Project Hours:** 350

**Skills needed:** C++

**Subcomponent of Ceph:** RGW

**Description of project:**

Lua scripts on the RADOS Gateway are powerful, so, in the meantime we only allow admins to add them to the RADOS Gatewway. Before we open this possibility to users, we want to add several protection layers to prevent from careless users to take down the system. One of these measures, will be to limit the execution time of each script, so it does not hog the system, go into infinite loops etc.

**Expected Outcome(s):**

Prevention of lua scripts in the RADOS Gateway from hogging system resources.

<hr class="hr">

## Tidy Up Song

**Mentor name(s):** Ronen Friedman, Yuval Lifshitz

**Mentor email(s):** rfriedma@ibm.com, ylifshit@ibm.com

**Difficulty:** Intermediate

**Project Hours:** 350

**Skills needed:** C++

**Subcomponent of Ceph:** RGW, Core

**Description of project:**
Use [clang-tidy](https://clang.llvm.org/extra/clang-tidy/) for static analysis in the Ceph project:

1. make sure that ceph compiles under clang
2. tune up clang-tidy to find important issues that are common to Ceph (looking for a relatively _small_ subset of _critical_ issues)
3. cleanup issues found in (2). don't have to cleanup all of them...
4. add to jenkins/github actions (non blocking)

**Expected Outcome(s):**
Have clang-tidy run against Ceph PRs, and show errors only if introduced in the PR.

<hr class="hr">
