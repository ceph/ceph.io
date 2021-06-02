---
title: "Recursive accounting"
date: "2008-06-16"
author: "sage"
tags: 
---

This is somewhat old news, but the recursive accounting changes have been merged into both the ‘unstable’ and ‘master’ branches, and the feature is [documented in the wiki](http://ceph.newdream.net/wiki/Recursive_accounting).

I’m extremely curious what people think of this feature (useful? confusing?).  It takes liberties with two common behaviors of directories: first, with the “rbytes” mount option, the directory size is suddenly related to the directory’s _recursive_ contents, and may appear very large.  Second, doing “cat dir” will dump the directory’s full stats instead of returning -EISDIR (Is a directory).  I’m hoping the latter behavior change is harmless, given that until relatively recently reading a directory dumped the encoded directory contents to your terminal…

