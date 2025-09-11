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

## Key sections of the YAML file:  

<details>
<summary>Benchmark module</summary> 

In our example, we will be using **librbdfio**.  
</details>

---

<details>
<summary>Length of run</summary> 

We configure a **ramp** and a **time** for each test:  

- **Ramp** → warmup period where no data is collected.  
- **Time** → duration for which each test will run and collect results.  
</details>

---

<details>
<summary>Volume size</summary>

This is the amount of data used to prefill each volume.  

- Ideally, this should match the volume size created in **Part 1** when setting up the EC profile.  
- If this value is lower, then only that amount of data will be written.  
</details>

---

<details>
<summary>Number of volumes</summary>

This is the same number of volumes you defined in **Part 1**.  
</details>

---

<details>
<summary>Prefill & Precondition </summary> 

- **Prefill** → filling all volumes with sequential writes.  
- **Precondition** → adding random writes to simulate real-world workloads.
</details>  

---

<details>
<summary>Workloads</summary>

Example:  

```yaml
Seq32kwrite:
  jobname: 'seqwrite'
  mode: 'write'
  op_size: 32768
  numjobs: [ 1 ]
  total_iodepth: [ 2, 4, 8, 16, 32, 64, 128, 256, 512, 768 ]
```
The above is an example of a 32k sequential write, we configure different levels of total_iodepth.
</details>

---

## Expressing queue depth

Firstly, what is **queue depth**?

Queue depth can be defined as the number of concurrent commands that are outstanding.

There are two ways of expressing the queue depth per volume in CBT
1. Using the `iodepth` attribute
2. Using the `total_iodepth` attribute

`iodepth` will use a `queue depth` of **n** per volume lets say. For example, if the number of configured volumes is 8. Then a setting of `iodepth` 2, means the `total_iodepth` on the system will be 16 (as 8*2). And the `queue depth` for each volume is 2. Therefore if we want to scale up the queue depth, we have to increase it by the number of volumes. 

`total_iodepth` will use that queue depth across all volumes. For example, if `total_iodepth` is set to 16 and the number of configured volumes is 8, then the queue depth per volume will be 2 (16/8). 

Now the reason we use `total_iodepth` over `iodepth` is because we can have a finer grain of control over the queue depth across the system. For example, let's say we have a total_iodepth of 17 with 8 volumes. Each volume will initially have a queue depth of 2 as we go through each volume, but volume 1 will have a queue depth of 3, as we have a remainder of 1, whereas all the other volumes will have a queue depth of 2. So using total_iodepth we can have volumes with different queue depth values, whereas using iodepth means each volume has the same queue depth.

---

## Why do we have lots of different IO values in the yaml?

We have lots of different levels of IOs for our writes and reads because we want to get test results for all the different scenarios that happen in the real world. Also to test the different bottlenecks that could be holding back the ceph cluster. Different scenarios could include a bank returning a single customer's payment to them, this would be a random read. On the other hand netflix streaming involves sequential reading of data and displaying that. 
- In terms of bottlenecks:

 - Short IOs will usually have a CPU bottleneck (this is why the x axis is IOPs for small IOs)
 - Larger IOs are more likely to suffer from network and device storage bottlenecks (this is why the x axis turns to Bandwidth for the larger IO sizes)
