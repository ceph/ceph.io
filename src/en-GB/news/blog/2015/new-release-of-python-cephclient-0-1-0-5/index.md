---
title: "New release of python-cephclient: 0.1.0.5"
date: "2015-03-11"
author: "dmsimard"
tags: 
  - "ceph"
  - "planet"
---

I’ve just drafted a new release of [python-cephclient](https://github.com/dmsimard/python-cephclient) on [PyPi](https://pypi.python.org/pypi/python-cephclient/0.1.0.5): v0.1.0.5.

After learning about the [ceph-rest-api](https://dmsimard.com/tag/ceph-rest-api.html) I just _had_ to do something fun with it.

In fact, it’s going to become very handy for me as I might start to develop with it for things like nagios monitoring scripts.

The changelog:

dmsimard:

- Add missing dependency on the requests library
- Some PEP8 and code standardization cleanup
- Add root “PUT” methods
- Add mon “PUT” methods
- Add mds “PUT” methods
- Add auth “PUT” methods

Donald Talton:

- Add osd “PUT” methods

Please try it out and let me know if you have any feedback !

Pull requests are welcome :)
