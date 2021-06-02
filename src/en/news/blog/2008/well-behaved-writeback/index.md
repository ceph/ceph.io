---
title: "Well-behaved writeback"
date: "2008-04-08"
author: "sage"
tags: 
---

We reached an exciting milestone for the Ceph kernel client this week: file data writeback is working, and well-behaved.  In particular, the speed of a tar file extraction is limited primarily by MDS latency for file creation.  File data is written asynchronously to OSDs in nice big I/Os (based on the striping parameters… 4 MB objects by default).  File capabilities are released to the MDS only after all dirty data is written, and intervening operations (e.g. a file stat by another client) will properly pause other clients with the file open in order to return a correct result.

One of the nice side effects here is that some write operations can be performed safely without MDS interaction.  In the case of a tar extraction, the utimes() call that sets file mtime and ctime simply updates the client’s local values since it still holds an exclusive capability for those inode fields; once data is flushed out to OSDs, the capabilities are released to the MDS along with the correct size, mtime, and atime values.

In any case, the kernel client is pretty stable and usable now!

