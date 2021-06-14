---
title: "Building Ceph Debian GNU/Linux packages"
date: "2015-01-01"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

The following script explains how to create Debian GNU/Linux packages for [Ceph](http://dachary.org/http;//ceph.com/) from a [clone of the sources](https://github.com/ceph/ceph.git).

releasedir=/tmp/release
rm -fr releasedir
mkdir -p $releasedir
#
# remove all files not under git so they are not
# included in the distribution.
#
git clean -dxf
#
# git describe provides a version that is
# a) human readable
# b) is unique for each commit
# c) compares higher than any previous commit
# d) contains the short hash of the commit
#
vers=\`git describe --match "v\*" | sed s/^v//\`
#
# creating the distribution tarbal requires some configure
# options (otherwise parts of the source tree will be left out).
#
./autogen.sh
./configure --with-rocksdb --with-ocf --with-rest-bench \\
    --with-nss --with-debug --enable-cephfs-java \\
    --with-lttng --with-babeltrace
#
# use distdir= to set the name of the top level directory of the
# tarbal to match the desired version
#
make distdir=ceph-$vers dist
#
# rename the tarbal to match debian conventions and extract it
#
mv ceph-$vers.tar.gz $releasedir/ceph\_$vers.orig.tar.gz
tar -C $releasedir zxf ceph\_$vers.orig.tar.gz
#
# copy the debian directory over and remove -dbg packages
# because they are large and take time to build
#
cp -a debian $releasedir/ceph-$vers/debian
cd $releasedir
perl -ni -e 'print if(!(/^Package: .\*-dbg$/../^$/))' ceph-$vers/debian/control
perl -pi -e 's/--dbg-package.\*//' ceph-$vers/debian/rules
#
# always set the debian version to 1 which is ok because the debian
# directory is included in the sources and the upstream version will
# change each time it is modified.
#
dvers="$vers-1"
#
# update the changelog to match the desired version
#
cd ceph-$vers
chvers=\`head -1 debian/changelog | perl -ne 's/.\*\\(//; s/\\).\*//; print'\`
if \[ "$chvers" != "$dvers" \]; then
   DEBEMAIL="contact@ceph.com" dch -b -v "$dvers" "new version"
fi
#
# create the packages
# a) with ccache to speed things up when building repeatedly
# b) do not sign the packages
# c) use half of the available processors
#
PATH=/usr/lib/ccache:$PATH dpkg-buildpackage -j$(($(nproc) / 2)) -uc -us

  
The release directory contains the source and binary packages.

ceph\_0.90-670-g4712b2b-1\_amd64.changes
ceph\_0.90-670-g4712b2b-1\_amd64.deb
ceph\_0.90-670-g4712b2b-1.diff.gz
ceph\_0.90-670-g4712b2b-1.dsc
ceph\_0.90-670-g4712b2b.orig.tar.gz
ceph-common\_0.90-670-g4712b2b-1\_amd64.deb
ceph-fs-common\_0.90-670-g4712b2b-1\_amd64.deb
ceph-fuse\_0.90-670-g4712b2b-1\_amd64.deb
ceph-mds\_0.90-670-g4712b2b-1\_amd64.deb
ceph-resource-agents\_0.90-670-g4712b2b-1\_amd64.deb
ceph-test\_0.90-670-g4712b2b-1\_amd64.deb
libcephfs1\_0.90-670-g4712b2b-1\_amd64.deb
libcephfs-dev\_0.90-670-g4712b2b-1\_amd64.deb
libcephfs-java\_0.90-670-g4712b2b-1\_all.deb
libcephfs-jni\_0.90-670-g4712b2b-1\_amd64.deb
librados2\_0.90-670-g4712b2b-1\_amd64.deb
librados-dev\_0.90-670-g4712b2b-1\_amd64.deb
libradosstriper1\_0.90-670-g4712b2b-1\_amd64.deb
libradosstriper-dev\_0.90-670-g4712b2b-1\_amd64.deb
librbd1\_0.90-670-g4712b2b-1\_amd64.deb
librbd-dev\_0.90-670-g4712b2b-1\_amd64.deb
python-ceph\_0.90-670-g4712b2b-1\_amd64.deb
radosgw\_0.90-670-g4712b2b-1\_amd64.deb
rbd-fuse\_0.90-670-g4712b2b-1\_amd64.deb
rest-bench\_0.90-670-g4712b2b-1\_amd64.deb

The first time around, using 12 2.1Ghz processors:

- disk space: ~200MB
- time: ~20 minutes

The second time around (i.e. ccache retrieves the results of the previous compilation)

- disk space: ~200MB
- time: ~10 minutes

Building after **ccache -C** and with the **\-dbg** packages:

- disk space: ~840MB
- time: ~25 minutes

About 5 minutes is spent on [compressing the 2GB of he ceph-test-dbg package](http://tracker.ceph.com/issues/10443).
