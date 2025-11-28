---
title: "Benchmarking Performance with CBT: Running and Analysing a Performance Test. Part Three"
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
- **Part 3** - How to start a CBT performance benchmark 
- **Part 4** - Analysing a CBT performance benchmark 

---

## Introduction  

Now that we have created our erasure coded (EC) cluster (from **Part 1**) and defined our YAML file and workloads (from **Part 2**), we can now start a CBT performance benchmark test.

This part will cover:  

1. Running a performance test  
2. Processing the results  
3. Comparing the results
4. Running a performance test with an OSD down
5. How to read response time curves  

---

<details>
<summary>Step 1: Run the performance test</summary>

First, clone the [CBT GitHub repository](https://github.com/ceph/cbt) into a directory of your choice on the machine you are using and `cd` into it.

This is an example of the command to run a CBT performance test:

```bash
  python /cbt/cbt.py -a /tmp/cbt -c /example/ceph.conf /example/<yaml_file> 2>&1 | tee /tmp/cbt.out
```

You will specify the location of your `cbt.py` file. Provide an archive folder where your results will be generated `/tmp/cbt`. Provide a config folder `/example/ceph.conf` to allow CBT to connect with the cluster. Finally we specify our `yaml_file` which will outline what tests/workloads will be running.

</details>

---

<details>
<summary>Step 2: Processing the results</summary>

Once you have ran the performance test your output files will be located wherever you specified them to go. For me, the previous command referenced `/tmp/cbt` so my results are within there. 

- I now copy these files to a new directory I would like them to be within, `my_test` in this case, I do this because I like to keep a directory of all my test results, and I delete `/tmp/cbt` before each run, so that is not a suitable palce. So I would do this for example:
```bash
cp -r /tmp/cbt/* /perftests/my_test
```

- Next, it is a case of generating the performance report, which can be done by the following command for myself in this example:
```bash
PYTHONPATH=/cbt/ /cbt/tools/generate_performance_report.py --archive /perftests/my_test --output_directory /perftests/my_test_results --create_pdf
```

Above I am referencing the location of cbt.py again at the start, I then reference the script that will generate the performance report (generate_performance_report.py). I state the directory, `my_test` in this case, that has the results from the performance run, and also state a desired `output-directory`, this is where the pdf for the performance report will be. Side note, you do not need to already have created the `my_test_results` directory you can see in the command above, this will be automatically done for you. You will now have a pdf file inside this new `my_test_results` folder along with a few other files, you can upload these files to GitHub if you'd like to store/view them somewhere.

</details>

---

<details>
<summary>Step 3: Comparing the results</summary>

With CBT, as well as performance reports we can also generate **comparison reports** quickly. Now that we have ran our tests for our CLAY and Jerasure test, we can generate a performance report. I will use the following command to do so:  

```bash
PYTHONPATH=/cbt/ /cbt/tools/generate_comparison_performance_report.py --baseline /perftests/jerasure_test/ --archives /perftests/clay_test/ --output_directory /perftests/clay_vs_jerasure_comparison --create_pdf
```
In the above command we will have to specify what our baseline is, we will use our test folder from the Jerasure performance report, and then our archive curve will be our CLAY performance report test folder. It is important here that in the above command you are inputting the test folders for Jerasure and CLAY **NOT** the results folders that were generated from the previous performance runs. We we will generate a comparison report in our chosen output directory. 

Using the above command I generated a comparison report between the above two runs, that can be found [here](https://github.com/Jakesquelch/cbt_results/blob/main/Blog/Jerasure_Vs_Clay_comparison/comparitive_performance_report_251015_142011.pdf).

### What results are we expecting?

Jerasure is a generic reed-solomon erasure coding library, it is matrix-based, not CPU-optimised. It is fairly balanced between read and write. CLAY is designed for faster recovery at the cost of more complicated write paths. So we are expecting to see better performance from CLAY potentially when it comes to smaller IO sizes, but as the writes get bigger we may see a decline in performance from CLAY leading to better Jerasure results. Furthermore in terms of reads we expect fairly similar results across the board as they are implemented very similar, the main difference is when it comes to writes.

So now I will analyse the results from this comparison report. Firstly I will take a look at a **1024k sequential read**:

![alt text](images/1024k_seq_read.png "1024k Sequential Read curve")

As shown by the diagram, the orange curve is our CLAY EC pool, and the blue curve is our Jerasure EC pool. Now as you can see the difference between the two curves really isn’t anything too substantial, they follow very similar paths, and that was expected. This is because for a normal read, ceph only needs to fetch data chunks (not parity chunks). Both Jerasure and CLAY are basically just returning the stored object, there is no real difference unless a failure occurs.

Now lets look at the **1024k sequential write**:

![alt text](images/1024k_seq_write.png "1024k Sequential Write curve")

Looking at the graph above writes we see that CLAY has 20-60% higher latency, with throughput dropping compared to Jerasure. This is likely due to extra CPU and network demands in CLAY. Larger writes mean bigger encoding matrices/layers, and CLAY has more complexity per write than Jerasure, laeding to the higher latency.

Our sequential write benchmark show that Jerasure delivers more consistent write performance across all block sizes, while CLAY is more volatile, performing better at some smaller sizes but much worse at large sequential writes. This shows CLAY’s design priorities: it is optimised for reduced recovery bandwidth rather than raw write performance.

</details>

---

<details>
<summary>Step 4: Running a test with OSD down</summary>

So before was a CLAY and Jerasure EC pool compared with one another. The results solidified our hypothesis that Jerasure would likely perform better because of the more complex computations used to recover data. So now we will do an additional run and deliberately kill an OSD prior to running the CBT test, to simulate real world failures that could occur, to see how the performance between the two differs when it comes to OSD recovery. 

So the following comparison report shows a CLAY and Jerasure curve where both of the plugins have 1 OSD that has been stopped, I did this so we could focus on the differences between the performance of the two. The report can be found [here](https://github.com/Jakesquelch/cbt_results/blob/main/Blog/Jerasure_Vs_Clay_down_comparison/comparitive_performance_report_251015_154505.pdf).

We will now take a look at 1024k Sequential read from the above comparison report: 

![alt text](images/down_1024_seq_read.png "1024k sequential read")

Now we expect CLAY to have better performance here due to it's supposedly more efficient data recovery. However this is not the case as shown by the diagram above. 

### So what does this mean?

This has led to me exploring the CLAY plugin further to understand what is going on here, and why there is no improvements when we compare CLAY to Jerasure. The worse performance from CLAY is due to CPU overheads that come along with CLAY. When we have a chunk size of 4k we are getting a subchunk size of 512, subchunks are a smaller unit within a chunk. For reads of less than 4K they get rounded up to a whole 4K block, therefore CLAY sometimes ends up reading the same data more than once and discarding different parts of what is read, this therefore is not good for performance and concludes that a small subchunk size doesn't work alongside NVMe drive block size of 4k. I've also noticed that Squid recovery also always tries to read 2MB from each stripe and expects the read to be truncated if the object is smaller than 2MB * number of stripes. With CLAY this results in a lot of small reads being issued beyond the end of the object. 

CLAY (in Squid but not in Tentacle) is only transmitting ~50% of the amount of data between OSDs during the recovery, so this will be good if network bandwidth is the bottleneck. However, if CPU utilisation or drive IOPs is a bottleneck then CLAY will **not** be the correct choice, as this will lead to a further decrease in performance. This is due to a lot more read IOs to the backend drives.

We can see that when an OSD goes down, the recovery of data hits performance, particularly for write-heavy workloads. I did a comparison report of the two curves above compared to when all OSDs are up [here](https://github.com/Jakesquelch/cbt_results/blob/main/Blog/Jerasure_Vs_Clay_Full_comparison/comparitive_performance_report_251013_114008.pdf).

![alt text](images/1024kseq_read_all.png "1024k sequential write")

We can see a majority of the tests show that Jerasure with all OSDs up is the best for performance across the board.

</details>

---

## How to read response time curves

So going back to my example CBT test run and the question we started with: "Does using the CLAY erasure code plugin give better performance than using the default JErasure plugin?" 

I generated a performance report for a JErasure plugin EC pool, the results can be found [here](https://github.com/Jakesquelch/cbt_results/blob/main/Blog/24th_Sep_Jerasure_4%2B2_results/performance_report_250924_094912.pdf), go ahead and view the results if you wish to.

I then generated a performance report for the CLAY plugin [here](https://github.com/Jakesquelch/cbt_results/blob/main/Blog/13th_Oct_Clay_4%2B2%2B5_results/performance_report_251013_094658.pdf).  

Within the generated reports above you will see hockey stick curves plotted to show the performance of each configuration. 

## How do we read the curves generated?

![alt text](images/Example_Response_Curve.png "How to read graphs")

Here is an example of the `total_iodepth` value. As stated above we can find out the specified `total iodepths` for this test by checking the yaml file we previously used in this test, and it is also stated within the performance report under the “Configuration yaml” section. For the above example it is: 
```yaml
total_iodepth: [ 2, 4, 8, 12, 16, 24, 32, 64, 96, 128, 192, 288, 384 ] 
```

The vertical red lines (error bars) shows the amount of standard deviation/variance in the performance for that specific point in the curve. If the standard deviations are small it shows that performance is stable with that workload. As the response curve starts to curve upwards performance bceomes more variable and the standard deviation increases.

- For an FIO workload, CBT will start 1 instance of FIO per volume. 
- It's also to note that the graph produced by reports do not include the results during the "ramp" period.

The post processing tools will sum the IOPs to generate a total IOPs for the response curve and calculate an average latency over all the volumes. The IOPS vs latency is then plotted on the response curve for that point of the curve for that specific iodepth.

## What values to read from a response curve?

1. If you know how much I/O your application is generating then you can use the response curve to work out what latency you should expect
2. If you want to see the maximum amount of I/O that the storage controller can process look for the right most point on the curve and find the value on the X axis.
3. If you have a latency requirement such as all I/O must complete in under 2ms then you can find out the maximum I/Os the storage controller can do by finding the point on the curve at this latency.
4. Most of the time you don't know exactly how much I/O an application is going to generate, and want to ensure that if there are any peaks or bursts in the amount of I/O that this doesn't cause a big change in latency. Where the response curve is flat there will be little change in latency if the amount of I/O varies, where the response curve is bending upwards a fairly small variation in amount of I/O can have a big impact on latency. Choosing a point on the response curve just before it starts increasing too rapidly gives a good indication of the maximum amount of I/O you can do with stable performance.
5. Most users do not want to operate above around 70% of maximum throughput, as this provides some headroom for expansion and allows for sudden bursts in a workload so that high latency can be tolerated.

As mentioned in part 1 of the blog, the perfect response curve would be a flat horizontal line showing constant latency as the quantity of I/O increases until we reach the saturation point where the system can handle no more I/O. This is because it highlights that performance is consistent with less variance.

---

## In Conclusion

So that demonstrates the seamless experience of how you can generate a CBT performance benchmark run from start to finish, generating response curves and comparison reports along the way. If you are interested in understanding the analysis of my example Jerasure and CLAY run, why Jerasure performed better than CLAY, **Part 4** of the blog series will be coming soon. I'll go into a lot more detail discussing how writes and reads work, and the IO breakdown for Clay and Jerasure to provide more clarity on why CLAY performs worse.