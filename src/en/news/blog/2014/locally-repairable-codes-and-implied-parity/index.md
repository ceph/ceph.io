---
title: "Locally repairable codes and implied parity"
date: "2014-06-09"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

When a [Ceph](http://ceph.com/) OSD is lost in an [erasure coded pool](http://ceph.com/docs/master/architecture/#reading-and-writing-encoded-chunks), it can be recovered using the others.

[![](images/lr-1.png "lr-1")](http://dachary.org/wp-uploads/2014/06/lr-1.png)

For instance if OSD **X3** was lost, OSDs **X1, X2**, **X4** to **X10** and **P1** to **P4** are retrieved by the primary OSD and the [erasure code plugin](https://github.com/ceph/ceph/blob/firefly/src/erasure-code/ErasureCodeInterface.h#L301) uses them to rebuild the content of X3.

[![](images/lr-2.png "lr-2")](http://dachary.org/wp-uploads/2014/06/lr-2.png)

[Locally repairable codes](http://anrg.usc.edu/~maheswaran/Xorbas.pdf) are designed to lower the bandwidth requirements when recovering from the loss of a single OSD. A local parity block is calculated for each five blocks : **S1** and **S2**. When the **X3** OSD is lost, instead of retrieving blocks from 13 OSDs, it is enough to retrieve **X1, X2, X4, X5** and **S1**, that is 5 OSDs.

![](images/lr.png "Locally Repairable Codes")

In some cases, local parity blocks can help recover from the loss of more blocks than any individual encoding function can. In the example above, let say five blocks are lost: **X1, X2, X3, X4** and **X8**. The block **X8** can be recovered from **X6, X7, X9, X10** and **S2**. Now that only four blocks are missing, the initial parity blocks are enough to recover. The combined effect of local parity blocks and the global parity blocks acts as if there was **implied** parity block.
