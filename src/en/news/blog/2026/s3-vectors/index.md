---
title: "Closer Than You Think: Adding Nearest Neighbor Search to Ceph"
date: 2025-03-25
author: Kyle Bader
image: "images/vector-squid.png"
tags:
  - rgw
  - s3
  - ai
  - vectors
  - ann
  - ivf-pq
---

We have been paying close attention to vector search since early 2024. The
proliferation of RAG pipelines, semantic code search, and embedding-based
recommendation systems made it clear that vector storage was going to become a
first-class infrastructure concern, and that the object store was a natural
candidate to take it on. We spent the better part of last year researching the
landscape: evaluating ANN index structures and libraries, thinking through how
vector operations would map onto RGW's request pipeline, and wrestling with the
API design question — invent something from scratch, or wait for a standard to
emerge?

Then AWS announced [S3 Vectors](https://aws.amazon.com/s3/features/vectors/),
and the picture snapped into focus. A well-considered API, anchored to the S3
model Ceph already implements, with enough ecosystem weight behind it to drive
real client adoption. We got to work.

## The API

S3 Vectors introduces a small set of new resource types on top of the familiar
S3 model.

A **Vector Bucket** is a new bucket type that accepts only `s3vectors:*`
operations — `GetObject`, `PutObject`, `ListObjectsV2`, and the rest of the
standard S3 API are not permitted. Vector buckets support SSE-S3 and SSE-KMS,
and are controlled through the same IAM intersection of identity-based and
resource-based policies that Ceph already implements for conventional buckets.

Inside a vector bucket, an **Index** is an ANN index bound at creation time to
a distance metric (`cosine` or `euclidean`) and a vector dimension count.
Indexes are LanceDB tables under the covers — more on that below.

**Vectors** are dense `float32` arrays stored alongside string metadata tags,
with up to 10 key-value pairs and 40 KB of metadata per vector.
**QueryVectors** performs a top-K ANN search against an index, with optional
metadata predicate filtering evaluated in tandem with the search — candidates
are checked against the filter as they are retrieved, so only matching vectors
are counted toward the top-K result set. Queries with filters may return fewer
than K results when very few vectors satisfy the predicate.

The full set of policy actions:

| Resource | Actions |
|---|---|
| Account | `s3vectors:ListVectorBuckets` |
| VectorBucket | `CreateVectorBucket`, `GetVectorBucket`, `DeleteVectorBucket`, `ListIndexes`, `PutVectorBucketPolicy`, `GetVectorBucketPolicy`, `DeleteVectorBucketPolicy` |
| Index | `CreateIndex`, `GetIndex`, `DeleteIndex`, `QueryVectors`, `PutVectors`, `GetVectors`, `ListVectors`, `DeleteVectors` |

Internally, a vector bucket maps to a LanceDB dataset directory persisted
through the RGW Storage Abstraction Layer, so the data lands in RADOS with
whatever replication or erasure coding the cluster is configured for. The
on-disk structure looks like this:

```
s3://my-bucket/           ← Vector Bucket
├── embeddings/           ← Index 'embeddings'
│   ├── data/             ← Lance column data files
│   ├── indices/          ← IVF-PQ index files
│   ├── _latest.manifest  ← Points to current version
│   └── schema.arrow      ← Index schema
└── thumbnails/           ← Index 'thumbnails'
    └── ...
```

## Why This Belongs in Ceph

The case for building vector search into the object store rather than pointing
users at a dedicated vector database is simple: cost, simplicity, and
co-location.

Cost first. A moderately sized RAG corpus can easily contain tens of millions
of vectors. At 1,536 dimensions (OpenAI's `text-embedding-3-small` output),
each vector is 6 KB of raw `float32` data, putting 100M vectors at roughly
600 GB before indexing overhead. Running that in the memory-oriented tier of a
dedicated vector database is expensive. Running it on Ceph's erasure-coded
storage is not. Our target space amplification is ≤1:3 — raw vector data to
total on-disk footprint including IVF-PQ index structures.

Simplicity: if you already run Ceph, enabling vector search requires no new
daemons, no new hardware, and no new operational surface area. The capability
lives inside the RGW request pipeline.

Co-location: organizations using Ceph as a document store or model artifact
repository often want their embeddings in the same cluster as the source
objects. Keeping them together eliminates a class of data movement and
consistency problems that arise when the two systems diverge.

## The Library: LanceDB via C Binding

We evaluated three candidate ANN libraries.

[FAISS](https://github.com/facebookresearch/faiss) is optimized for in-memory
operation and GPU acceleration. Neither aligns with how Ceph gateway nodes are
typically configured. Ruled out early.

[DiskANN](https://github.com/microsoft/DiskANN) is technically well-suited —
disk-native, SSD-optimized, supports `L2` and cosine distance, MIT licensed,
written in C++. The problem is that DiskANN provides only the algorithm. There
is no built-in storage format, I/O layer, or query engine, which means
substantial additional integration work to reach the same feature set as a
embedded retrieval library for multimodal AI.

[LanceDB](https://github.com/lancedb/lancedb) is a full-stack library built
on the [Lance columnar format](https://lance.org), designed from
the ground up for fast random-access disk I/O. It uses IVF-PQ indexes, supports
both distance metrics, includes hybrid ANN + scalar predicate search, and
provides a clean API whose dataset/table/index model maps directly onto S3
Vectors' bucket/index/vector abstractions. Apache 2.0 licensed.

LanceDB is written in Rust. Ceph is C++. Bridging them required a C binding
layer that did not previously exist. As part of this project we spearheaded the
development of [lancedb/lancedb-c](https://github.com/lancedb/lancedb-c), a C
API for LanceDB that is being contributed back to the LanceDB community.
The bindings expose the functions RGW needs — `lancedb_table_create`,
`lancedb_table_merge_insert`, `lancedb_table_query`, `lancedb_table_index_stats`,
and others — as a stable C API that Ceph links against via FFI. The binding
repository also includes a working S3 Vectors simulator useful for local
development without a full Ceph cluster, and a test dataset of 693 embeddings
of Ceph source code at 1,024 dimensions, with function name, class name, and
line number metadata.

LanceDB accelerates K-means clustering during index generation using AVX2 SIMD,
confirmed for Euclidean (L2) distance. Cosine acceleration is worth benchmarking
on target hardware. Index generation could also be GPU-accelerated via PyTorch
(`accelerator='cuda'`) in `create_index`, though Ceph gateway nodes do not
typically have accelerators. If we want to go this route, we may need to look
into using cuVS directly, since this appears to only apply to the Python
lancedb libraries.

## Writes: merge_insert and Background Optimization

`PutVectors` accepts batches of up to 500 vectors or 20 MB, whichever is
smaller, with a rate limitted number of calls per index per second. In AWS
the limit is 5, but this is something we will expose as a configuration knob.

Under the hood we map PutVectors to LanceDB's `merge_insert` — an atomic
upsert that checks for the existence of each vector by key and inserts or
updates in a single operation. The alternative, separate read-then-write
logic, introduces race conditions under concurrent writes.

After a `merge_insert`, new vectors are immediately searchable through a
combined scan. In parallel, a background `optimize()` call can rebuild the
IVF-PQ index without blocking concurrent writes or queries. We use LanceDB's
built-in `index_stats()` API to track the ratio of indexed to unindexed rows
and trigger a rebuild when the fraction of unindexed vectors exceeds a
configurable threshold. This replaced an earlier approach that maintained
external JSON counters with file locking. Letting LanceDB's own manifest stats
do that work is simpler and more accurate.

## Queries: IVF-PQ and the nprobes Tradeoff

IVF-PQ partitions the vector space into cells (IVF) and compresses vectors
using product quantization (PQ). At query time, `nprobes` controls how many
IVF cells are examined. Higher values improve recall; lower values reduce
latency. Our target query latency range is 100–800 ms, and `nprobes` is the
primary tuning lever. The `QueryVectors` operation returns up to 30 nearest
neighbors per call.

## Metadata Filtering

S3 Vectors supports per-vector metadata tags — up to 10 key-value pairs —
with a distinction between filterable and non-filterable metadata. Deciding
how to implement filtering efficiently was probably the most involved design
discussion we had.

The core problem is that within a single index, different vectors can have
different metadata keys. LanceDB supports efficient filtering through typed
scalar columns with `btree`, `bitmap`, or `label_list` indexes, but those
columns have to exist at table creation time. Flattening every possible
metadata key into a dedicated column produces an unbounded schema — impractical,
and the AWS API provides no mechanism to define one at index creation time.

We plan to apply our own JSON based filtering that aligns with the vectors API.
This will require us to over-fetch by inflating the top-K request size, to
retrieve a larger candidate pool from the ANN index before applying the filter,
returning the top-K survivors. For highly selective filters, we could also tune
`nprobes` to reduce the likelihood of returning fewer than K results when only
a small fraction of vectors match the predicate.

The reason we default to post-filtering rather than pre-filtering is SDK
compatibility. Post-filtering requires no schema knowledge upfront, works
against the metadata JSON column that any client including the AWS SDK will
produce, and delivers the same semantics AWS describes — filtering in tandem
with candidate retrieval, with the caveat that fewer than K results may be
returned for highly selective predicates.

For callers who need stronger correctness or performance guarantees, the
optional `filterableMetadataKeys` extension on `CreateIndex` defines typed
scalar columns upfront. When those columns are present we can use LanceDB's
pre-filtering instead, narrowing the candidate set before the vector search
runs rather than after. Pre-filtering is generally more efficient for
selective filters and eliminates the "fewer than K results" edge case entirely.
This will be a Ceph extension — the AWS SDKs has no field for it — but it is
opt-in, not required.

The result is a tiered approach: compatible behavior by default for any client
including the AWS SDKs, with a more precise and efficient path available through
the extension for callers who know their filter schema upfront.

## AWS SDK Compatibility

The post-filtering approach resolves any compatibility concerns.

`PutVectors`, `GetVectors`, `DeleteVectors`, `ListVectors`, `CreateIndex`, and
unfiltered `QueryVectors` all map directly to the AWS API surface without
divergence.

`QueryVectors` with a filter predicate will work correctly via post-filtering
even without `scalarSchema` — the results are accurate, derived from scanning a
broader candidate set rather than using a scalar index. The performance
difference is workload-dependent: for highly selective filters (where few
vectors match) the overhead is minimal; for low-selectivity filters the
oversampling multiplier can be tuned.

The one remaining translation layer is filter expression syntax. AWS defines
filter expressions as a JSON structure against its filterable/non-filterable
metadata model; LanceDB operates on SQL WHERE clauses. We will parse the S3
Vectors JSON filter syntax and convert it to the appropriate LanceDB predicate
internally — this is an implementation detail, not a compatibility constraint.
From the perspective of any client using the AWS SDK, filtered `QueryVectors`
calls work correctly without modification.

## Current Status

Two open pull requests against `ceph/ceph`:

**[ceph/ceph#66066](https://github.com/ceph/ceph/pull/66066)** is the main
integration PR tracking 34 tasks. Vector bucket CRUD, IAM auth/policy, index
management, `PutVectors`, `GetVectors`, `DeleteVectors`, `ListVectors`, and
`QueryVectors` are implemented. Vector Bucket Policy APIs and per-index
VectorBucket attributes — for caching schema and distance metric between calls
rather than reconstructing them from the table on every request — are in
progress.

Beyond these we need to work on finalizing the plumbing to the radosgw storage
abstraction layer, implement post-filtering for `QueryVectors`, and add policy
actions and server-side encryption support.

## Scope

S3 Vectors in Ceph is not a replacement for a dedicated vector database. If
the workload requires single-digit millisecond latency, rich full-text plus
vector hybrid search, or a complex query DSL, a dedicated system is still the
right answer. S3 Vectors targets workloads where the requirement is
cost-effective storage of large numbers of vectors with sub-second ANN search
and simple metadata filtering — in a cluster that already runs Ceph, and doubly
so if the data the embeddings have been extracted from already exists in Ceph
object storage.

## Get Involved

The pull requests above are the best place to engage. We are also in `#rgw-devel`
on the [Ceph Slack](https://ceph.io/en/community/connect/). Patches welcome.
