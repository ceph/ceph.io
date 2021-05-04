---
title: "POSIX file system test suite"
date: "2009-01-20"
author: "sage"
tags: 
  - "planet"
---

The unstable client (with all of the async metadata changes) is passing the full POSIX file system test suite again (modulo the question of whether chmod -1,-1 should be a no-op or update ctime).  We’re also surviving long dbench runs.  Progress!  I hope to push this all into the master branch after a bit more testing, do some benchmarking, and then do a new release.

I was happy to discover that the test suite has a real home now:

[http://www.ntfs-3g.org/pjd-fstest.html](http://www.ntfs-3g.org/pjd-fstest.html)

