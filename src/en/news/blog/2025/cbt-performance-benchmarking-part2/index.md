# Part 2 - Defining YAML Contents for CBT

Once you have finished **Part 1 (How to start a Ceph cluster for a performance benchmark with CBT)** you should have an erasure coded Ceph cluster ready to go and run a performance test on it. Our next step will be to run a CBT performance run on this cluster. However first, we need to understand what **YAML contents** we want. The YAML contents we provide outline what tests we will be doing on our cluster.

---

## What goes into the YAML file?

Within the YAML file we will have to define a few things:

### Benchmark module
In our example we will be using **librbdfio**.

---

### How long we want the run to be
This includes setting a **ramp** and a **time** for each individual test:  

- **Ramp** is a warmup period where no data is collected.  
- **Time** is the period for how long each test will run and collect results.  

---

### Volume size
This is the amount of data used to prefill each volume.  
- Generally, this should be the same as the volume size that was created in Part 1 when we set up the EC profile.  
- If the value here is lower than the volume size created in the EC profile setup, only that amount of data will be written.  

---

### Number of volumes
This is the number of volumes that you defined in Part 1.  

---

### Prefill and precondition configurations
- **Prefill** involves filling all the volumes with sequential writes.  
- **Precondition** involves adding random writes to simulate real-world testing.  

---

### The actual tests (workloads)
Example:  

```yaml
Seq32kwrite:
  jobname: 'seqwrite'
  mode: 'write'
  op_size: 32768
  numjobs: [ 1 ]
  total_iodepth: [ 2, 4, 8, 16, 32, 64, 128, 256, 512, 768 ]
