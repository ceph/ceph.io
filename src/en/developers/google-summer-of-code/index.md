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

## Making Teuthology Friendly

**Mentor name(s):** Aishwarya Mathuria, Zack Cerza, Kamoltat Sirivadhna

**Mentor email(s):** amathuri@redhat.com, zcerza@redhat.com, ksirivad@redhat.com

**Difficulty:** Intermediate

**Skills needed:** Python, Docker, FastAPI.

**Subcomponent of Ceph:** Teuthology

**Description of project:**
[Teuthology](https://github.com/ceph/teuthology/tree/master/docs) is Ceph's upstream integration test framework written in Python. It currently relies
heavily on users sshing into a teuthology server and execute commands to schedule, kill and update jobs.
This workflow requires a learning curve in memorizing and understanding all sorts of variables that makes up
a teuthology command. We are positive that we can improve this by creating API endpoints along with user-friendly UIs on Pulpito (Teuthology Frontend)
such that users can easily schedule and kill jobs through Pulpito.

**Standup/weekly call mentee could attend?:** Teuthology meeting

**Steps to evaluate an applicant for the project:**

Applicant should comfortable with creating simple API end-points and writting unit-tests.

<hr class="hr">

## Gotta Catch 'Em All

**Mentor name(s):** Yuval Lifshitz

**Mentor email(s):** ylifshit@ibm.com

**Difficulty:** Intermediate

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

## Disk Fragmentation Simulator

**Mentor name(s):** Adam Kupczyk

**Mentor email(s):** akupczyk@ibm.com

**Difficulty:** Intermediate

**Skills needed:** C++, Random Distributions, Data Presentation

**Subcomponent of Ceph:** BlueStore

**Description of project:**
Create a platform to evaluate defragmentation algorithms.
We intend to augment BlueStore with fragmentation control / combat features.
We understand that implementing algorithm is costly and we want to evaluate
quality of certain concepts before we start implementation.
We need a platform that can simulate OSD behaviour with regard to RBD objects.
Artificial workloads of changing characteristics will be applied to simulator.
Random events (PG-add, PG-removal) should also be thrown-in from time to time.
Platform should expose C++ interface toward "defragmentation algorithm".

**Standup/weekly call mentee could attend?:** Core standup & Bluestore Upkeep & Evolution

**Steps to evaluate an applicant for the project:**

Applicant should feel comfortable creating easily verifiable code.
Operate effectively on large collections of data. Create non-trivial data-trashing algorithms.
Understand how RBD images are maintained and how random writes mutate objects.
Familiarize with existing Allocator interface, concept of collection(PG).

<hr class="hr">

