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

**Difficulty:** intermediate

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

**Difficulty:** Intermidiate

**Skills needed:** C++

**Subcomponent of Ceph:** RGW

**Description of project:** 
Use the Coverity static snalysis tool to cleanup issues from the RGW code


**Standup/weekly call mentee could attend?:** RGW standup

**Steps to evaluate an applicant for the project:**

Build ceph, analyse and fix simple coverity issue

<hr class="hr">

