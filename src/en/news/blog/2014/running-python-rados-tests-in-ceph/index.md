---
title: "Running python rados tests in Ceph"
date: "2014-09-20"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

When [Ceph](http://ceph.com/) is built from sources, **make check** will not run the [test\_rados.py](https://github.com/ceph/ceph/blob/giant/src/test/pybind/test_rados.py) tests.  
A minimal cluster is required and can be run from the **src** directory with:

CEPH\_NUM\_MON=1 CEPH\_NUM\_OSD=3 ./vstart.sh -d -n -X -l mon osd

The test can then be run with

$ PYTHONPATH=pybind nosetests -v
   test/pybind/test\_rados.py

and if only the **TestIoctx.test\_aio\_read** is of interest, it can be appended to the filename:

$ PYTHONPATH=pybind nosetests -v
   test/pybind/test\_rados.py:TestIoctx.test\_aio\_read
test\_rados.TestIoctx.test\_aio\_read ... ok

-------------------------------
Ran 1 test in 4.227s

OK
