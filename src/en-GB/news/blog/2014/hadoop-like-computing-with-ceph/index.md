---
title: "Hadoop like computing with Ceph"
date: "2014-01-30"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

Computation can be co-located on the machine where a [Ceph](http://ceph.com/) object resides and access it from the local disk instead of going through the network. Noah Watkins [explains it in great detail](http://ceph.com/rados/dynamic-object-interfaces-with-lua/) and it can be experimented with a [Hello World](https://github.com/ceph/ceph/tree/v0.72/examples/librados) example which calls the [hello](https://github.com/ceph/ceph/blob/v0.72/src/cls/hello/cls_hello.cc) plugin included in the [Emperor](http://ceph.com/releases/v0-68-released/) release.  
  
After [compiling Ceph from sources](http://dachary.org/?p=2680), run a test cluster in the source directory with

$ cd src
$ rm -fr dev out ;  mkdir -p dev
$ LC\_ALL=C MON=1 OSD=3 bash -x ./vstart.sh -d -n -X -l mon osd

Check that it works:

$ ./ceph -s
\*\*\* DEVELOPER MODE: setting PATH, PYTHONPATH and LD\_LIBRARY\_PATH \*\*\*
    cluster 091a6854-924b-405c-ac6e-7fe05baaeb63
     health HEALTH\_WARN too few pgs per osd (8 < min 10)
     monmap e1: 1 mons at {a=127.0.0.1:6789/0}, election epoch 2, quorum 0 a
     osdmap e9: 3 osds: 3 up, 3 in
      pgmap v49: 24 pgs, 3 pools, 0 bytes data, 0 objects
            463 GB used, 85400 MB / 547 GB avail
                  24 active+clean

Then go to the example directory and modify the makefile to point to the sources just compiled instead of relying on an installed version

$ cd ../examples/librados/
$ cat > Makefile
all: hello\_world.cc
        g++ -I../../src/include -g -c hello\_world.cc -o hello\_world.o
        libtool --mode=link g++ -L../../src -g hello\_world.o -lrados -o librados\_hello\_world
$ make

and run it with

$ cd ../../src
$ ../examples/librados/librados\_hello\_world --conf ceph.conf
we just set up a rados cluster object
we just parsed our config options
we just connected to the rados cluster
we just created a new pool named hello\_world\_pool
we just created an ioctx for our pool
we just wrote new object hello\_object, with contents
hello world!
we read our object hello\_object, and got back 0 bytes with contents
hello world!
we set the xattr 'version' on our object!
we overwrote our object hello\_object with contents
hello world!v2
we just failed a write because the xattr wasn't as specified
we overwrote our object hello\_object following an xattr test with contents
hello world!v3

The **hello world** example can then be adapted and tested locally. When ready, the plugin can be installed on each OSD of the the actual Ceph cluster at

/usr/lib/rados-classes/libcls\_hello.so
/usr/lib/rados-classes/libcls\_**myownplugin**.so

It will be loaded the next time the OSD is restarted and be ready to process data locally.
