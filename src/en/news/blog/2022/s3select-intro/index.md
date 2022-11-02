---
title: "s3 select - introduction"
date: "2022-11-02"
author: "gsalomon"
---

![s3select illustration](images/s3select-into.png)

## What is ceph/s3select?
On July 2020, the s3select was introduced to [CEPH upstream](https://github.com/ceph/s3select), an open-source package.

The s3select is another S3 request, that enables the client to push down an SQL statement(according to AWS spec) into CEPH storage.

## Why do we need that? What is it good for?
To answer that, It needs to elaborate a bit on the push-down paradigm.

The push-down paradigm is about moving(“pushing”) the operation close to the data.

It's contrary to what is commonly done, i.e. moving the data to the “place” of operation.

In a big-data ecosystem, it makes a big difference. 

In order to execute 
```SQL
select sum( x + y) from s3object where a + b > c
```

It needs to fetch the entire object to the client side, and only then execute the operation with some analytic application,

With push-down(s3-select) the entire operation is executed on the server side and only the result is returned to the client side.

It should be noted that pushing down operations, close to data is not an easy “thing” to do, the storage is usually fragmented, and broken into random pieces.

It makes it difficult to execute single-query on top of many random pieces, moreover, the type of these objects could be binary, in some cases.

## What is s3select capable of?
CEPH S3 select is an SQL-like engine, its properties can be reviewed [here](https://docs.ceph.com/en/latest/radosgw/s3select/#).

The s3select features do not turn the s3 storage into a database, but they improve greatly the efficiency of SQL processing.

The s3select property is embedded into the GetObject module which makes it highly efficient for the push-down operation.

Upon an SQL query being push-down, the object is fetched (the same as with the GetObject request), and each fragment of the object is processed by the s3select module.

Since the s3select is embedded into the S3 system, there are no redundant copies of bytes, the object is processed immediately, and the results send back to the client.

Moreover, the s3select system is capable to process the following object types CSV, JSON, and Parquet.

The same engine is processing these different object types.

## Why s3 storage? 
The s3-storage is reliable, efficient, cheap, and already contains [trillions of objects](https://www.zdnet.com/article/aws-s3-storage-now-holds-over-100-trillion-objects/), It contains many CSV, JSON, and Parquet objects, and these objects contain a huge amount of data to analyze.

An ETL may convert these objects into Parquet and then run queries on these converted objects.

But it comes with an expensive price, getting all of these objects.

The s3select engine that resides on s3-storage can do these jobs for many use cases, saving time and resources.

These semi-structured data reside on S3 storage as “cold” data and as mentioned in huge numbers, with s3select this “locked” data can be accessed efficiently. 

## Parquet vs CSV and JSON
Upon processing CSV or JSON objects, the whole object must be scanned, there is no way to fetch only the relevant columns and rows.

With the Parquet object, it's different, the engine analyzes the query, and fetches only the relevant columns, using the s3-range-request and the apache-parquet-reader.

In that way, it reduces the IOPS on the server side.

And finally … 

The s3select Repo is growing, we keep adding new features, and planning new ones.

We will be happy to hear your comments and ideas.

