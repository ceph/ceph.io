---
title: Google Summer of Code
order: 5
---

![Google Summer of Code](/assets/bitmaps/hero-gsoc.png)

Google Summer of Code (g.co/gsoc) is Google's mentorship program for bringing new contributors into open source communities. It's happening again for the 18th year in 2022! Over 18,000 developers from 112 countries have participated.

Google Summer of Code is a unique program where new contributors to open source, ages 18 and over, are paired with a mentor to introduce them to the open source community and provide guidance while they work on a real world open source project over the summer. Projects cover a wide range of fields including: Cloud, Operating Systems, Graphics, Medicine, Programming Languages, Robotics, Science, Security and many more. GSoC Contributors do earn a stipend to work on their medium (~175 hour) or large (~350 hour) projects. This is not an internship but provides an invaluable experience and allows you to be part of an amazing community!

GSoC is a highly competitive program, so don't wait to the last minute to prepare! GSoC Contributors should reach out to the organizations that interest them once orgs are announced on March 7, 2022. Potential GSoC Contributors can apply at g.co/gsoc from April 4 -19, 2022.

See the list of projects we have available for GSoC contributors!

<hr class="hr">

## S3-Tests Port to Pytest

**Mentor name:** Ali Maredia

**Mentor email:** amaredia@redhat.com

**Project type:** 175 hour project

**Difficulty:** intermediate

**Skills needed:** python, Linux as a development environment

**Subcomponent of Ceph:** RGW

**Description of project:**
[Ceph's S3 tests](github.com/ceph/s3-tests/) tests Ceph's object interface (RGW) compliance of the [S3 Protocol](https://aws.amazon.com/s3/).
The S3-tests are based off of a deprecated python testing framework called Nose.
The purpose of this project is to port the existing tests to the [pytest framework](https://docs.pytest.org/en/7.0.x/).
New tests may be written if they identify gaps in the S3 API and what the test suite is testing.
This project is a great introduction to open source and Ceph development, sharpening skills with git and using the Linux CLI, and will provide a broad understanding of all aspects of the S3 API.

**Standup/weekly call mentee could attend?**: RGW

**Steps to evaluate an applicant for the project:**

- Build and run a vstart cluster
- Run existing s3-tests on said vstart cluster
- Port 3 tests to a new testing repo that uses pytest instead of ninja

<hr class="hr">

## End to End Tracing

**Mentor name:** Omri Zeneva

**Mentor email:** ozeneva@redhat.com

**Project type:** 350 hour project

**Difficulty:** intermediate

**Skills needed:** c++

**Subcomponent of Ceph:** RGW, OSD

**Description of project:**
We currently have the infrastructure to create traces in the RGW and in the OSD separately, and then the traces are sent to the jaeger tracing backend. We would like to have traces representing a single operation, from the beginning in the RGW down to the OSD.

**Standup/weekly call mentee could attend?:** RGW, Core

**Steps to evaluate an applicant for the project:**

- Build and run a vstart cluster
- Upload an objet to Ceph
- Add a new span to an existing trace

<hr class="hr">

## All Clients Deserve a Chance

**Mentor name:** Yuval Lifshitz

**Mentor email:** ylifshit@redhat.com

**Project type:** 350 hour project

**Difficulty:** intermediate

**Skills needed:** golang, java, python

**Subcomponent of Ceph:** RGW

**Description of project:**

We have several examples of how to hack the standard AWS clients to use out extended bucket notifications APIs. Currently we have such examples for python (using the boto library) - however, we need to keep them up to date with the recent changes in our code we are missing an example of how to hack the golang/java AWS SDK for the same purpose.

**Standup/weekly call mentee could attend?:** RGW

**Steps to evaluate an applicant for the project:**

- Build and run a vstart cluster
- Be able use the python boto3 SDK to upload an object to Ceph
- Be able use the Golang AWS SDK to upload an object to Ceph
- Be able use the Java AWS SDK to upload an object to Ceph

<hr class="hr">

## Telescópio Lua

**Mentor name:** Yuval Lifshitz

**Mentor email:** ylifshit@redhat.com

**Project type:** 350 hour project

**Difficulty:** advance

**Skills needed:** C++, Lua

**Subcomponent of Ceph:** RGW

**Description:**
Enhance our Lua binding in the RGW to expose the content of an object when doing GET operations. The script should be able to process the object's content and overwrite it if needed. e.g.:

- Decrease image resolution based on client attributes, covert to black&white, or create thumbnails
- on-the-fly compression

**Standup/weekly call mentee could attend?:** RGW

<hr class="hr">

## Visualizing a Ceph Cluster

**Mentor name:** Ernesto Puerta

**Mentor email:** epuertat@redhat.com

**Project type:** 350 hour project

**Difficulty:** intermediate

**Skills needed:**

- Python
- Angular/React/JS Frameworks
- Data Visualization (d3, plotly)

**Subcomponent of Ceph:** Dashboard

**Description of project:**

This project aims to provide users with a rich and interactive visualization of the status of a Ceph cluster. While Ceph already provides a high-level cluster status (HEALTH, WARNING, ERROR), that's often not enough when the cluster departs from the peaceful HEALTH zone to enter the shadowy WARNING or ERROR regions. In that situation, users will require a more fine-grained view of the status of the different cluster components.

[Reference](https://tracker.ceph.com/issues/50980)

**Standup/weekly call mentee could attend?:** Dashboard

**Steps to evaluate an applicant for the project:**

- Launch a containerized Ceph cluster (e.g.: rhcs-dashboard/ceph-dev)
- Access the Ceph Dashboard and the Landing Page
- Extend an existing chart to display a new performance metric

**What the first 2 weeks of work would look like during the internship:**

- Get familiar with the Ceph-Dashboard development environment and system architecture
- Understand how data flows from core Ceph to the Dashboard UI layer
- Identify the key data sources for depicting the status of a Ceph cluster
- Search Open Source charting and data visualization tools
