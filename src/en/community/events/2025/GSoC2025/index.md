---
title: "Google Summer of Code 2025: Ceph Showcase"
date: 2025-10-08
end: 2025-10-08
image: "/assets/bitmaps/GSoC25.png"
categories:
  - community
tags:
  - Google Summer of Code
---

## Ceph Community: Google Summer of Code 2025 Intern Showcase

Google Summer of Code (GSoC) is Google's global mentorship program that helps new contributors gain real-world experience in open source software.

This summer, Ceph mentees took on ambitious projects that improved subcomponents like RGW and the Ceph Integration Test Framework, while sharpening their skills in Python, C++, containerization, Dashboard development, and Linux administration. Their work strengthens Ceph for the entire community.

Join us on **October 8 at 10:00 am EDT / 7:00 am PDT** to celebrate their achievements! Each mentee will present their project, share what they learned, and highlight how their contributions make Ceph better.

The event is on the [Ceph Community Calendar](https://calendar.google.com/calendar/embed?src=9ts9c7lt7u1vic2ijvvqqlfpo0%40group.calendar.google.com&ctz=America%2FChicago)

Explore the full list of projects and descriptions below, and be inspired by the next generation of open source contributors.

---

### Project Name: Teuthology on Podman  
**Mentor(s):** Zack Cerza, Kamoltat (Junior) Sirivadhna, Aishwarya Mathuria, Vallari Agrawal  
**Mentee(s):** Parfait Detchenou  

**Description:**  
`ceph-devstack` is an in-development tool that utilizes rootless Podman containers to deploy a scaled-down Teuthology lab. It has proven useful for testing changes to Teuthology and its related services, allowing us to make changes to components more easily and flexibly without worrying about causing outages.  

It had some basic ability to run Ceph tests, and this GSoC project has extended that capability, including enabling support for multiple OSD deployments per test node container with configurable device sizes.

With the help of this project, ceph-devstack can successfully run the cephadm smoke test suite using Teuthology, with 4 OSDs per test node, deployed on rootless Podman containers on a single machine.

---

### Project Name: The More The Merrier  
**Mentor(s):** Yuval Lifshitz  
**Mentee(s):** Adarsh Ashokan  

**Description:**  
Persistent bucket notifications are a handy and powerful feature. However, they can pose a performance issue, since notifications regarding a specific bucket are written to a single RADOS queue (unlike bucket writes, which are distributed across multiple bucket shards). For small objects, the notification overhead is considerable.  

This project aimed to create a sharded bucket notifications queue to improve the performance of sending persistent bucket notifications.  

- [Tech talk](https://www.youtube.com/watch?v=57Ejl6R-L20)  
- [Use case example](https://www.youtube.com/watch?v=57Ejl6R-L20)  

---

### Project Name: Warm and Fuzzy  
**Mentor(s):** Yuval Lifshitz, Pritha Srivastava  
**Mentee(s):** Suyash Dongre  

**Description:**  
The RGW's frontend is an S3 REST API server. This project used a REST API fuzzer (e.g., [RESTler](https://github.com/microsoft/restler-fuzzer)) to test the RGW for security issues and other bugs.  

The first step was selecting the right tool, feeding it the AWS S3 OpenAPI spec, and testing against RGW. Fixing issues the fuzzer finds is valuable, but the stretch goal is integrating these tests into Teuthology.

---

### Project Name: Ceph Dashboard Usability Improvements  
**Mentor(s):** Afreen Misbah  
**Mentee(s):** Anikait Sehwag  

**Description:**  
The Ceph Dashboard is Ceph's management and monitoring tool. It's a web application with Angular/Typescript on the frontend and Python on the backend.  

This project focused on improving the usability and workflow of notification management in the Dashboard to enhance user experience for Ceph administrators.  
