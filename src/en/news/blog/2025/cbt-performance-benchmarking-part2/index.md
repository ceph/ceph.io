---
title: "Benchmarking with CBT: Defining YAML Contents. Part Two"
date: 2025-09-11
author: Jake Squelch (IBM)
tags:
  - ceph
  - benchmarks
  - performance
---

## Outline of the Blog Series  

- **Part 1** - How to start a Ceph cluster for a performance benchmark with CBT  
- **Part 2** - Defining YAML contents  
- **Part 3** - How to start a CBT run - Things to consider when evaluating performance  
- **Part 4** - How to integrate CBT with Teuthology  

---

## Introduction: What goes into the YAML file?  

Once you have finished **Part 1 (How to start a Ceph cluster for a performance benchmark with CBT)** you should have an erasure coded Ceph cluster ready to go and run a performance test on it.  

Our next step will be to run a CBT performance run on this cluster. However, before we can do that, we need to understand what **YAML contents** we want.  

The YAML file defines what tests we will run on the cluster.  

---

## Key sections of the YAML file  

### Benchmark module  

In our example, we will be using **librbdfio**.  

---

### How long should the run be?  

We configure a **ramp** and a **time** for each test:  

- **Ramp** → warmup period where no data is collected.  
- **Time** → duration for which each test will run and collect results.  

---

### Volume size  

This is the amount of data used to prefill each volume.  

- Ideally, this should match the volume size created in **Part 1** when setting up the EC profile.  
- If this value is lower, then only that amount of data will be written.  

---

### Number of volumes  

This is the same number of volumes you defined in **Part 1**.  

---

### Prefill and precondition  

- **Prefill** → filling all volumes with sequential writes.  
- **Precondition** → adding random writes to simulate real-world workloads.  

---

### Workloads (tests)  

Example:  

```yaml
Seq32kwrite:
  jobname: 'seqwrite'
  mode: 'write'
  op_size: 32768
  numjobs: [ 1 ]
  total_iodepth: [ 2, 4, 8, 16, 32, 64, 128, 256, 512, 768 ]
