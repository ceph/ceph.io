---
title: "Understanding radosgw benchmarks"
date: "2015-11-18"
author: "admin"
tags: 
  - "planet"
---

We've noticed that there are a few common misconceptions around radosgw performance, and we're hoping that this post can clear up some of those.

radosgw is of course Ceph's RESTful object gateway. That means that you can use any client that speaks the Amazon S3 or OpenStack Swift protocol to interact with your Ceph cluster. Since RESTful object access is HTTP based, this also means you can combine radosgw with HTTP load balancers, reverse proxies and the like, which often comes in handy.

In general, as any RESTful object storage, you would generally store data in radosgw that you read and write in one chunk, and where bulk storage is more important than online availability (if you need data at your fingertips, you'd use RBD or CephFS or even straight-up RADOS instead, but those are for different use cases).

The performance implications of using radosgw (or any RESTful object storage, for that matter) usually apply to one of two different use cases:

- Either you want to store lots of data in bulk, and come back to it later. This, for example, is why in OpenStack backups of volumes and databases typically go to OpenStack Swift or radosgw speaking the Swift protocol.
    
- Or you want to store lots of relatively small data chunks really fast. Suppose you have a monitoring system storing data points in S3.
    

So either you want to write big chunks of data, in which case you're interested in throughput (typically measured in amount of data per unit time, such as MB/s). Or you want to write small chunks, then what's important is completed operations per unit time (typically measured in number of writes per second, which in the RESTful case would be HTTP PUTs per second).

Now with radosgw, you can measure this with a handy tool called rest-bench. Sadly rest-bench no longer builds with Ceph for Infernalis and later, because the Ceph developers now favor Intel's COSbench utility. But rest-bench from older Ceph releases will be around for a while and it's handy because unlike COSbench, it doesn't require Java.

So let's take a look. The general invocation for rest-bench is like this:

rest-bench -t $CONCURRENCY -b $SIZE 
  --seconds\=$SECS --api-host\=$RGW 
  --bucket\=$BUCKET 
  --access-key\=$KEY --secret\=$SECRET 
  --no-cleanup write

What does that mean?

- `$CONCURRENCY` is the number of concurrently running PUT operations. Basically, this is how many clients you want to simulate. The default is 16.
    
- `$SIZE` is the size of an individual object being written. The default here is 4MB.
    
- `$RGW` is of course your radosgw host including a port number.
    
- `$SECS` is the number of seconds to run the benchmark. The default is 60, but in order to get a quick idea of your radosgw performance, as little as 10 is often sufficient.
    
- `$BUCKET` is the scratch bucket where you're creating objects during the benchmark run.
    
- `$ACCESS_KEY` and `$SECRET` are the access and secret keys you created with `radosgw-admin user create`.
    
- `write` specifies a random write benchmark.
    
- `--no-cleanup` specifies that you don't want the bucket to be cleaned out after the benchmark run. It's normally fine to run several benchmarks in a row and only empty the benchmark bucket when done with all.
    

## Object size

First, we'll examine how object size affects radosgw throughput and latency.

So let's start out with a benchmark run that uses the default settings for concurrency and object sizes:

export RGW\=localhost:7480
export SECS\=10
export SIZE\=$((1<<22)) \# 4MB object size
export BUCKET\=bench
export CONCURRENCY\=16
export KEY\=your\_radosgw\_key
export SECRET\=your\_radosgw\_secret

rest-bench -t $CONCURRENCY -b $SIZE --seconds\=$SECS --api-host\=$RGW 
--bucket\=$BUCKET --access-key\=$KEY --secret\=$SECRET --no-cleanup write

host=localhost:7480
Maintaining 16 concurrent writes of 4194304 bytes for up to 10 seconds or 0 objects
\[...\]
Total time run:         10.312134
Total writes made:      399
Write size:             4194304
Bandwidth (MB/sec):     154.769 
\[...\]

So that means we achieved a bandwidth of just under 155 MB/s (which is near the max RADOS bandwidth this particular cluster is capable of; it's by no means a high-end system) and we managed 399 writes, or approx. 40 PUTs/s.

Let's see how going even bigger changes things:

$ export SIZE\=$((1<<26)) \# 64MB object size

$ rest-bench -t $CONCURRENCY -b $SIZE --seconds\=$SECS --api-host\=$RGW 
--bucket\=$BUCKET --access-key\=$KEY --secret\=$SECRET --no-cleanup write

host=localhost:7480
 Maintaining 16 concurrent writes of 67108864 bytes for up to 10 seconds or 0 objects
\[...\]
 Total time run:         13.959088
Total writes made:      35
Write size:             67108864
Bandwidth (MB/sec):     160.469

Perfectly logical. Our bandwidth doesn't change much, but of course the number of PUTs we get done per second decreases significantly, to a puny 3 PUTs/s. (Note: radosgw does break down objects into smaller chunks when it talks to RADOS. However, this doesn't change the fact that a client needs to haul a 64MB object across the network and through the radosgw HTTP server.)

Let's do the opposite now, and go for smaller objects. Suppose your application is using a typical object size of 32K.

export SIZE\=$((1<<15)) \# 32KB object size
rest-bench -t $CONCURRENCY -b $SIZE --seconds\=$SECS --api-host\=$RGW 
--bucket\=$BUCKET --access-key\=$KEY --secret\=$SECRET --no-cleanup write

host=localhost:7480
 Maintaining 16 concurrent writes of 32768 bytes for up to 10 seconds or 0 objects
\[...\]
 Total time run:         10.042325
Total writes made:      2965
Write size:             32768
Bandwidth (MB/sec):     9.227
\[...\]

Of course if we looked at our bandwidth alone, this would be an abysmal result. But your application is trying to write 32K chunks, and lots of them. And it's succeeding just fine; we're now near 300 PUTs/s.

Going even smaller, we'd expect PUTs/s to trend further up and nominal MB/s to go down. Let's try with 4K objects:

export SIZE\=$((1<<12)) \# 4KB object size
rest-bench -t $CONCURRENCY -b $SIZE --seconds\=$SECS --api-host\=$RGW 
--bucket\=$BUCKET --access-key\=$KEY --secret\=$SECRET --no-cleanup write

host=localhost:7480
 Maintaining 16 concurrent writes of 4096 bytes for up to 10 seconds or 0 objects
\[...\]
Total time run:         10.052134
Total writes made:      3249
Write size:             4096
Bandwidth (MB/sec):     1.263 
\[...\]

And sure enough, 325 PUTs/s.

So in summary, larger object sizes increase your write bandwidth to your radosgw cluster, while smaller objects enable a higher writes-per-second load.

## Concurrency

Another aspect that influences your radosgw performance is concurrency. Generally, the principle is simple: if you have multiple parallel applications that write to radosgw and that don't have to wait for each other, your aggregate throughput will be higher, and your writes-per-second will be higher as well. If you have a small number (in the worst case, a single one that is single-threaded) and you can only ever issue one PUT at a time, both throughput and writes-per-second will be lower in aggregate.

export RGW\=localhost:7480
export SECS\=10
export SIZE\=$((1<<22)) \# back to 4MB object size
export BUCKET\=bench
export CONCURRENCY\=16
export KEY\=<key>
export SECRET\=<secret>

$ rest-bench -t $CONCURRENCY -b $SIZE --seconds\=$SECS --api-host\=$RGW 
--bucket\=$BUCKET --access-key\=$KEY --secret\=$SECRET --no-cleanup write

host=localhost:7480
 Maintaining 16 concurrent writes of 4194304 bytes for up to 10 seconds or 0 objects
\[...\]
Total time run:         10.294444
Total writes made:      394
Write size:             4194304
Bandwidth (MB/sec):     153.092 
\[...\]

export CONCURRENCY\=1
rest-bench -t $CONCURRENCY -b $SIZE --seconds\=$SECS --api-host\=$RGW 
--bucket\=$BUCKET --access-key\=$KEY --secret\=$SECRET --no-cleanup write

host=localhost:7480
 Maintaining 1 concurrent writes of 4194304 bytes for up to 10 seconds or 0 objects
\[...\]
 Total time run:         10.090768
Total writes made:      147
Write size:             4194304
Bandwidth (MB/sec):     58.271

Logical, right? Rather than allowing 16 threads to interact with the cluster in parallel, we now have to wait for every single PUT to complete before we can issue the next. Pretty obvious to see both our writes-per-second and our aggregate bandwidth to drop by more than half.

The effect is even slightly less pronounced with smaller objects. Compare the two for 4KB objects:

export SIZE\=$((1<<12)) # 4KB object size
export CONCURRENCY=16
rest-bench \-t $CONCURRENCY \-b $SIZE \--seconds\=$SECS \--api-host\=$RGW 
\--bucket\=$BUCKET \--access-key\=$KEY \--secret\=$SECRET \--no-cleanup write

host=localhost:7480
 Maintaining 16 concurrent writes of 4096 bytes for up to 10 seconds or 0 objects
\[...\]
 Total time run:         10.053976
Total writes made:      3211
Write size:             4096
Bandwidth (MB/sec):     1.248 
\[...\]

export CONCURRENCY\=1 
rest-bench -t $CONCURRENCY -b $SIZE --seconds\=$SECS --api-host\=$RGW 
--bucket\=$BUCKET --access-key\=$KEY --secret\=$SECRET --no-cleanup write

host=localhost:7480
 Maintaining 1 concurrent writes of 4096 bytes for up to 10 seconds or 0 objects
\[...\]
 Total time run:         10.007962
Total writes made:      1632
Write size:             4096
Bandwidth (MB/sec):     0.637
\[...\]

Both writes-per-second and throughput drop by half.

## Conclusions

Note: If you've dealt with storage performance considerations before, some of these will be blindingly obvious. Apologies for that; it just shows that Ceph is generally a well-behaved system that does what you would normally expect.

- Larger objects have less overhead, and as such increase your throughput,
    
- Smaller objects increase writes-per-second at the expense of aggregate throughput, because they have more overhead,
    
- Serialization and contention (both of which mean reduced concurrency) reduce your data throughput and your writes-per-second.
    

What does this mean for your radosgw application?

- Concurrency is good. If your application can fire a bunch of RESTful objects at radosgw, which don't have to wait for each other, great.
    
- If you need to optimize for lots of PUTs per second, make sure that your application sends data in reasonably sized chunks. And again, make sure it is capable of doing so in parallel.
    

If you need to optimize for throughput instead, make sure that your application coalesces data into large objects. There is a big difference between sending one object of 10MB, and 10 objects of 1 MB.

Source: Hastexo ([Understanding radosgw benchmarks](https://www.hastexo.com/resources/hints-and-kinks/understanding-radosgw-benchmarks/))
