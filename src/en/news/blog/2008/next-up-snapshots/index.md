---
title: "Next up: snapshots!"
date: "2008-07-11"
author: "sage"
tags: 
  - "planet"
---

One of the last intrusive additions I have planned is a flexible snapshot mechanism.  I haven’t been able to figure out how to map writeable snapshots onto the current object and metadata storage model, unfortunately, so it’ll be read-only snapshots for now.  Ceph snapshots will be significantly more flexible than what you find with WAFL or ZFS, though.  The goal is to get behavior like:

$ cd any/random/directory
$ ls .snapshot
$ mkdir .snapshot/foo      # create a snapshot
$ ls .snapshot
foo
$ cd a/deeper/dir
$ ls .snapshot
foo
$ mkdir .snapshot/bar      # create another one
$ ls .snapshot
foo    bar
$

That is, users can create snapshots, from a standard shell, for any subtree of the directory hierarchy.  (In contrast, most proprietary vendors’ snapshots are for entire volumes only, while ZFS can only snapshot predefined subvolumes.)  And snapshots will be visible via a hidden .snapshot (or similar) directory from any directory.  Something similarly convenient (rmdir?) will be used to delete snapshots from the command line. The naming will be a bit more complicated than in the above example to avoid name collisions, but that is the basic idea.

