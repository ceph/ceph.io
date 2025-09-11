---
title: "Benchmarking with CBT: Running and Analysing a Performance Test. Part Three"
date: 2025-09-12
author: Jake Squelch (IBM)
tags:
  - ceph
  - benchmarks
  - performance
  - analysis
---

## Outline of the Blog Series  

- **Part 1** - How to start a Ceph cluster for a performance benchmark with CBT  
- **Part 2** - Defining YAML contents  
- **Part 3** - How to start a CBT run - Things to consider when evaluating performance  
- **Part 4** - How to integrate CBT with Teuthology  

---

## Introduction  

Now that we have created our erasure coded (EC) cluster (from **Part 1**) and defined our YAML workloads (from **Part 2**), we can finally start a CBT run and analyse the performance results.  

This part will cover:  

1. Running a performance test  
2. Processing the results  
3. Analysing the results  
4. Comparing Jerasure vs CLAY EC pools  
5. Running tests with an OSD down  

---

## Step 1: Run the performance test  

First, clone the **CBT repository**:  

```bash
git clone https://github.com/ceph/cbt.git
