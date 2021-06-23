---
title: "Add Support of Curl_multi_wait for RadosGW on Debian Wheezy"
date: "2015-06-18"
author: "laurentbarbe"
tags: 
---

```
WARNING: libcurl doesn't support curl_multi_wait()
WARNING: cross zone / region transfer performance may be affected
```

If you have already been confronted to this error at startup of RadosGW, the problem is the version of libcurl used. To enable support of curl\_multi\_wait, you will need to compile radosgw with libcurl >= 7.28.0 : [http://curl.haxx.se/libcurl/c/curl\_multi\_wait.html](http://curl.haxx.se/libcurl/c/curl_multi_wait.html)

On debian wheezy, you can use ceph-extras repo which contains libcurl 7.29.0 to recompile ceph packages :

```
# apt-cache policy libcurl4-gnutls-dev
libcurl4-gnutls-dev:
  Installed: (none)
  Candidate: 7.26.0-1+wheezy13

# echo  deb http://ceph.com/packages/ceph-extras/debian wheezy main | tee /etc/apt/sources.list.d/ceph-extras.list
# apt-get update

# apt-cache policy libcurl4-gnutls-dev
libcurl4-gnutls-dev:
  Installed: (none)
  Candidate: 7.29.0-1~bpo70+1.ceph
```

Retrieve Ceph repo on Github (in this example, I use hammer version) :

```
# apt-get install git build-essential automake
# git clone --recursive https://github.com/ceph/ceph.git -b hammer
# cd ceph
```

Install dependencies and build packages (without libbabeltrace-ctf-dev libbabeltrace-dev, here we not need…)

```
# apt-get install autoconf automake autotools-dev libbz2-dev cryptsetup-bin debhelper default-jdk gdisk javahelper junit4 libaio-dev libatomic-ops-dev libblkid-dev libboost-dev libboost-program-options-dev libboost-system-dev libboost-thread-dev libcurl4-gnutls-dev libedit-dev libexpat1-dev libfcgi-dev libfuse-dev libgoogle-perftools-dev libkeyutils-dev libleveldb-dev libnss3-dev libsnappy-dev liblttng-ust-dev libtool libudev-dev libxml2-dev parted pkg-config python-nose python-virtualenv sdparm uuid-dev uuid-runtime xfslibs-dev xfsprogs xmlstarlet yasm zlib1g-dev

# dpkg-buildpackage -d
```

On RadosGW host, you will need to add “ceph-extras” repo (for libcurl) and install radosgw packages and dependencies :

```
# echo  deb http://ceph.com/packages/ceph-extras/debian wheezy main | tee /etc/apt/sources.list.d/ceph-extras.list
# apt-get update

# dpkg -i ceph-common_*.deb librbd1_*.deb python-cephfs_*.deb python-rbd_*.deb librados2_*.deb python-ceph_*.deb python-rados_*.deb radosgw_*.deb
```
