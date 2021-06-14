---
title: "Sorting Ceph backport branches"
date: "2015-07-29"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

When there are many [backports](http://ceph.com/) in flight, they are more likely to overlap and conflict with each other. When a conflict can be trivially resolved because it comes from the context of a hunk, it’s often enough to just swap the two commits to avoid the conflict entirely. For instance let say a commit on

void foo() { }
void bar() {}

adds an argument to the **foo** function:

void foo(int a) { }
void bar() {}

and the second commit adds an argument to the **bar** function:

void foo(int a) { }
void bar(bool b) {}

If the second commit is backported before the first, it will conflict because it will find that the context of the **bar** function has the **foo** function without an argument.

When there are dozens of backport branches, they can be sorted so that the first to merge is the one that cherry picks the oldest ancestor in the master branch. In other words given the example above, a cherry-pick of the first commit be merged before the second commit because it is older in the commit history.

Sorting the branches also gracefully handles interdependent backports. For instance let say the first branch contains a few backported commits and a second branch contains a backported commit that can’t be applied unless the first branch is merged. Since it is required for each Ceph branch proposed for backports to pass **make check**, the most commonly used strategy is to include all the commits from the first branch in the second branch. This second branch is not intended to be merged and the title is usually prefixed with DNM (Do Not Merge). When the first branch is merged, the second is rebased against the target and the redundant commits disapear from the second branch.

Here is a three lines shell script that implements the sorting:

#
# Make a file with the hash of all commits found in master
# but discard those that already are in the hammer release.
#
git log --no-merges \\
  --pretty='%H' ceph/hammer..ceph/master \\
  > /tmp/master-commits
#
# Match each pull request with the commit from which it was
# cherry-picked. Just use the first commit: we expect the other to be
# immediate ancestors. If that's not the case we don't know how to
# use that information so we just ignore it.
#
for pr in $PRS ; do
  git log -1 --pretty=%b ceph/pull/$pr/merge^1..ceph/pull/$pr/merge^2 | \\
   perl -ne 'print "$1 '$pr'\\n" if(/cherry picked from commit (\\w+)/)'
done > /tmp/pr-and-first-commit
#
# For each pull request, grep the cherry-picked commit and display its
# line number. Sort the result in reverse order to get the pull
# request sorted in the same way the cherry-picked commits are found
# in the master history.
#
SORTED\_PRS=$(while read commit pr ; do
  grep --line-number $commit < /tmp/master-commits | \\
  sed -e "s/\\$/ $pr/" ; done  < /tmp/pr-and-first-commit | \\
  sort -rn | \\
  perl -p -e 's/.\* (.\*)\\n/$1 /')
