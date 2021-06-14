---
title: "Running make check on Ceph pull requests"
date: "2014-11-10"
author: "loic"
tags: 
  - "ceph"
---

Each [Ceph](http://ceph.com/) contribution is expected to successfully run **make check** and pass all the unit tests it contains. The developer runs **make check** locally before [submitting his changes](https://github.com/ceph/ceph/pulls) but the result may be influenced by the development environment. A [draft bot](http://dachary.org/wp-uploads/2014/11/cephbot.txt) is proposed to watch the list of pull requests on a github repository and run a script based on [github3.py](https://github.com/sigmavirus24/github3.py) each time a new patch is uploaded.

cephbot.py --user loic-bot --password XXXXX \\
   --owner ceph --repository ceph \\
   --script $HOME/makecheck/check.sh

If the script fails, it adds [a comment with the output of the run](https://github.com/ceph/ceph/pull/2888#issuecomment-62329912) to the pull request. Otherwise it [reports success](https://github.com/ceph/ceph/pull/2648#issuecomment-62351821) in the same way.  
  
The [draft bot](http://dachary.org/wp-uploads/2014/11/cephbot.txt) is a proof of concept based on the assumption that the github API is constantly changing and that the python library to interact with it will be obsolete because the maintainers will eventually give up. It relies on the smallest set of features to perform:

- list all pull requests
- get a pull request given its number
- get the owner and repository of the **head** of a given pull request
- add a comment to a pull request

The loop polls the pull requests every N seconds and runs a script after cloning the repository from which the proposed changes originates (the **head**). Here is the **check.sh** script used above:

#!/bin/bash -ex
trap "pastebinit -b http://paste.ubuntu.com/ output" EXIT
./autogen.sh >& output
./configure --disable-static --with-radosgw \\
  --with-debug CC="ccache gcc" CXX="ccache g++" \\
  CFLAGS="-Wall -g" CXXFLAGS="-Wall -g" >& output
make -j8 >& output
make check >& output
make clean >& output
trap "" EXIT
echo "make check"
git remote -v | head -1
git describe

The output is stored temporarily and uploaded to a pastebin when there is a failure, to [keep the message added to the pull request small](https://github.com/ceph/ceph/pull/2888#issuecomment-62329912).
