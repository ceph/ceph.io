---
title: "Benchmarking with CBT: Running and Analysing a Performance Test. Part Three"
date: 2025-09-12
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

## Introduction  

Now that we have created our erasure coded (EC) cluster (from **Part 1**) and defined our YAML file and workloads (from **Part 2**), we can finally start a CBT run and analyse the performance results.  

This part will cover:  

1. Running a performance test  
2. Processing the results  
3. Analysing the results  
4. Comparing Jerasure vs CLAY EC pools  
5. Running tests with an OSD stopped 

---

<details>
<summary>Step 1: Run the performance test</summary>

First, clone the [CBT repository](https://github.com/ceph/cbt) into a directory of your choice on the machine you are using and `cd` into it.

This is an example of the command to run a CBT performance test:

```bash
  python /cbt/cbt.py -a /tmp/cbt -c /example/ceph.conf /example/<yaml_file> 2>&1 | tee /tmp/cbt.out
```

You will specify the location of your `cbt.py` file. Provide an archive folder where your results will be generated `/tmp/cbt`. Provide a config folder `/example/ceph.conf`

</details>

