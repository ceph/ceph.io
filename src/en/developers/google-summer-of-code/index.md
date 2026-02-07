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

In addition, for each project, mentors have detailed their expectations for usage 
of AI tools at the end of each project description.

For any questions, contact Vallari Agrawal (vallari.agrawal@ibm.com).


<hr class="hr">

## radosgw-admin UX and documentation improvements

**Mentor name(s):** Yuval Lifshitz, Jacques Heunis

**Mentor email(s):** ylifshit@ibm.com, jheunis@bloomberg.net

**Difficulty:** Advanced

**Project Hours:** 350

**Skills needed:** C++, (maybe python)

**Subcomponent of Ceph:** RGW

**Description of project:**

Currently documenting radosgw-admin commands is a manual and error prone process.

After implementing a new command, the "usage" part should be updated accordingly in 
the code, where there could be a mismatch between the command itself and its arguments 
and what is documented in the usage.

After that the man page should be updated manually, as well as the admin guide. any reference to this command in other places in our documentation is also manual.

We would like to use a more Programmatic approach towards the problem:

* use a cli/args framework that support auto-generation of context-aware "usage" docs
* investigate how we can use it to auto generate the man page and admin guides (maybe using some python code)
* see if we can easily reference these command descriptions in other places in our documentation
* all of this, while maintaining backward compatibility with the existing behavior
* see also: https://tracker.ceph.com/issues/74508

**Standup/weekly call mentee could attend?:** RGW standup, RGW refactoring meeting

**Steps to evaluate an applicant for the project:** TBD

**1-2 short paragraphs about what first 2 weeks of work would look like during the internship:** TBD

**Expected Outcome:**  Detailed in the description.

**Rules for AI usage:** https://gist.github.com/yuvalif/b07312c98ea74890e157594a456c6e6b

<hr class="hr">


## Kafka Security

**Mentor name(s):** Yuval Lifshitz

**Mentor email(s):** ylifshit@ibm.com

**Difficulty:** Advanced

**Project Hours:** 350

**Skills needed:** Python and C++

**Subcomponent of Ceph:** RGW (teuthology and rook as stretch goals)

**Description of project:**

Bucket notification integration with Kafka is a very useful feature in the RGW.
However, some security features needed for such integrations are missing. so, in this project we will try to make bucket notifications over kafka more secure.

The following features are missing:

* GSSAPI
* OAUTHBEARER
* mtls
* passing in CA without a file (useful for rook integration)

The main challenge in the above would be in automating the tests, so they could easily run locally,

* as a stretch goal, we should make sure these tests can also run in teuthology.
* another stretch goal would be to use the integrate the above feature into rook (this would involve some golang coding as well).

**Standup/weekly call mentee could attend?:** RGW daily standup, RGW weekly refactoring meeting

**Steps to evaluate an applicant for the project:** TBD

**1-2 short paragraphs about what first 2 weeks of work would look like during the internship:** TBD

**Expected outcome:** Detailed in the description.

**Rules for AI usage:** https://gist.github.com/yuvalif/b07312c98ea74890e157594a456c6e6b

<hr class="hr">


## RGW tcmalloc profiling

**Mentor name(s):** Yuval Lifshitz

**Mentor email(s):** ylifshit@ibm.com

**Difficulty:** Advanced 

**Project Hours:** 175

**Skills needed:** Python and C++

**Subcomponent of Ceph:** RGW (teuthology and rook as stretch goals)

**Description of project:**

All daemons in ceph are using tcmalloc as the memory allocator to achieve better performance.

However, while the OSD, MON, and MDS can report the memory allocation performance, the RGW does not support that
(see: https://docs.ceph.com/en/latest/rados/troubleshooting/memory-profiling/#memory-profiling).

In this project, we should add this reporting support to the RGW as well.

As a stretch goal, we should use the profiling information from RGW runs to tune the tcmalloc parameters so that would be more suitable for the memory use of the RGW

**Standup/weekly call mentee could attend:** RGW daily standup, RGW weekly refactoring meeting

**Steps to evaluate an applicant for the project:** TBD

**1-2 short paragraphs about what first 2 weeks of work would look like during the internship:** TBD

**Expected outcome:** Detailed in description.

**Rules for AI usage:** https://gist.github.com/yuvalif/b07312c98ea74890e157594a456c6e6b

<hr class="hr">


## Carbonization and UX Consistency Improvements for Ceph Dashboard

**Mentor name(s):** Afreen Misbah, Abhishek Desai, Dnyaneshwari Talwekar

**Mentor contact:** Join Ceph Slack from [here](https://join.slack.com/t/ceph-storage/shared_invite/zt-3jlvf8f6e-45tyKGpqkkfcC9feAUpgfQ) and reach out to: @Afreen @Abhishek Desai @Dnyaneshwari Talwekar 

**Difficulty:** Easy 

**Project Hours:** 350

**Skills needed:** Angular, Typescript, CSS, jest, cypress, carbon library, Frontend skills

**Subcomponent of Ceph:** Dashboard

**Description of project:**

Ceph Dashboard is Ceph’s web-based management and monitoring interface built using Angular and TypeScript on the frontend, with Python on the backend. While the dashboard is feature-complete, several parts of the UI remain partially or fully non-carbonized and exhibit inconsistent UX patterns, including layouts, forms, typography, and overview pages. These inconsistencies increase maintenance complexity and negatively impact usability.

This project focuses on completing the carbonization of the Ceph Dashboard by standardizing remaining UI components using the [Carbon Design System](https://carbondesignsystem.com/). As part of this effort, an existing routed resource page pattern—already implemented for one resource—will be extended consistently across all relevant dashboard resources. The project also includes usability improvements and expanding frontend test coverage to ensure long-term maintainability and stability. 

https://tracker.ceph.com/projects/dashboard/wiki/Contributing_to_dashboard


**Standup/weekly call mentee could attend:** 1:00 PM IST Mon-Wed & 3:00 PM IST Thur | https://meet.jit.si/ceph-dashboard

**Steps to evaluate an applicant for the project:** Writing quality code, active participation in slack, and good communication skills

**1-2 short paragraphs about what first 2 weeks of work would look like during the internship:** TBD

**Expected outcome:** 

By the end of the project, the Ceph Dashboard will have a fully carbonized and UX-consistent frontend, with standardized routed resource pages across all major resources, improved usability workflows, and expanded frontend test coverage. The result will be a more maintainable, user-friendly dashboard aligned with Carbon design standards and easier for future contributors to extend.

**Rules for AI usage:** TBD

<hr class="hr">
