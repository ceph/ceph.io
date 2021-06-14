---
title: "working with git submodules in Ceph"
date: "2014-03-21"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

The [gf-complete](http://jerasure.org/jerasure/gf-complete) and [jerasure](http://jerasure.org/jerasure/jerasure) libraries implement the [erasure code](http://en.wikipedia.org/wiki/Erasure_code) functions used in [Ceph](http://ceph.com/). They were copied in Ceph in 2013 because there were no reference repositories at the time. The copy was [removed from the Ceph repository](https://github.com/ceph/ceph/commit/5c34a0f01aa5d0ff6c3027cba1a5248699cf7e39) and [replaced by git submodules](https://github.com/ceph/ceph/commit/ddbb2f7b0ad825bba9a616ba4815b25f80ea525a) to decouple the release cycles.  
  
If a change needs to be made urgently (shortly before a Ceph release for instance), it may be inconvenient to wait for a pull request to be reviewed and merged. Copies of the repositories were created in the [ceph namespace](https://github.com/ceph/) for both [jerasure](https://github.com/ceph/jerasure) and [gf-complete](https://github.com/ceph/gf-complete).  
A stable branch was created for jerasure v2 and gf-complete v1. The git submodules point to these release branches as follows:

git submodule add -b v1 https://github.com/ceph/gf-complete.git src/erasure-code/jerasure/gf-complete
git submodule add -b v2 https://github.com/ceph/jerasure.git src/erasure-code/jerasure/jerasure

When checking out a branch with the new submodules, it is necessary to update them to clone and checkout the required branch.

git submodule update

To work with jerasure upstream, three remotes are defined : one for the upstream (**jimplank** read only), one for a fork of the upstream at a location suitable to issue a pull request (**loic** read-write), one for the mirror from the ceph (**ceph** read-write).

$ git remote add loic git@bitbucket.org:dachary/jerasure.git
$ git remote -vv
ceph	git@github.com:ceph/jerasure.git (fetch)
ceph	git@github.com:ceph/jerasure.git (push)
jimplank	http://jerasure.org/jerasure/jerasure.git (fetch)
jimplank	http://jerasure.org/jerasure/jerasure.git (push)
loic	git@bitbucket.org:dachary/jerasure.git (fetch)
loic	git@bitbucket.org:dachary/jerasure.git (push)

A local branch **wip-compilation-warnings** is created from the upstream master branch **jimplank/master**.

$ git checkout -b wip-compilation-warnings jimplank/master
Branch wip-compilation-warnings set up to track remote branch master from jimplank.
Switched to a new branch 'wip-compilation-warnings'
loic@fold:~/software/ceph/jerasure$ git branch -vv
\* wip-compilation-warnings 87f3010 \[jimplank/master\] remove unused variables

When the work is completed, it is pushed

git push loic wip-compilation-warnings

and a pull request is sent upstream. When merged into master, the commits are backported to the stable branch **v2**:

git checkout -b wip-compilation-warnings-v2 jimplank/v2
git cherry-pick -x da3b767
git push loic wip-compilation-warnings-v2

and a pull request is sent upstream.

The integration with Ceph can be tested localy by modifying the URL of the upstream from the ceph namespace to the location where the pull request is waiting to be reviewed:

diff --git a/.gitmodules b/.gitmodules
index b51c509..e22aaac 100644
--- a/.gitmodules
+++ b/.gitmodules
@@ -13,5 +13,5 @@
 	branch = v1
 \[submodule "src/erasure-code/jerasure/jerasure"\]
 	path = src/erasure-code/jerasure/jerasure
-	url = https://github.com/ceph/jerasure.git
+	url = git@bitbucket.org:dachary/jerasure.git
 	branch = v2

The submodule must be updated to take this modification into account and point to the branch including the latest change with:

git submodule sync
git submodule update --remote src/erasure-code/jerasure/jerasure

If the upstream acceptance takes time, the backport can be pushed to the Ceph namespace to be used immediately:

git checkout ceph/v2
git cherry-pick -x da3b767
git push ceph v2

And the the Ceph repository updated to point to the latest commit of the v2 branch with:

git submodule update --remote src/erasure-code/jerasure/jerasure
git add src/erasure-code/jerasure/jerasure
git commit -m 'sync latest upstream'
