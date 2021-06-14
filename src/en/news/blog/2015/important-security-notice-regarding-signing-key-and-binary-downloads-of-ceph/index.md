---
title: "Important security notice regarding signing key and binary downloads of Ceph"
date: "2015-09-17"
author: "sage"
---

Last week, Red Hat investigated an intrusion on the sites of both the Ceph community project (ceph.com) and Inktank (download.inktank.com), which were hosted on a computer system outside of Red Hat infrastructure.

Ceph.com provided Ceph community versions downloads signed with a Ceph signing key  (id 7EBFDD5D17ED316D).  Download.inktank.com provided releases of the Red Hat Ceph product for Ubuntu and CentOS operating systems signed with an Inktank signing key (id 5438C7019DCEEEAD). While the investigation into the intrusion is ongoing, our initial focus was on the integrity of the software and distribution channel for both sites.

To date, our investigation has not discovered any compromised code or binaries available for download on these sites. However, we cannot fully rule out the possibility that some compromised code or binaries were available for download at some point in the past. Further, we can no longer trust the integrity of the Ceph signing key, and therefore have created a new signing key (id E84AC2C0460F3994) for verifying downloads.  This new key is [committed to the ceph.git repository](https://github.com/ceph/ceph/blob/master/keys/release.asc) and is also available from [https://git.ceph.com/release.asc](https://git.ceph.com/release.asc).  All future release git tags will be signed with this new key.

This intrusion did not affect other Ceph sites such as download.ceph.com (which contained some Ceph downloads) or git.ceph.com (which mirrors various source repositories), and is not known to have affected any other Ceph community infrastructure.  There is no evidence that build systems or the Ceph github source repository were compromised.

New hosts for [ceph.com](https://ceph.com) and [download.ceph.com](http://download.ceph.com) have been created and the sites have been rebuilt.  All content available on download.ceph.com has been verified, and all ceph.com URLs for package locations now redirect there.  There is still some content missing from download.ceph.com that will appear later today: source tarballs will be regenerated from git, and older release packages are being resigned with the new release key.

The download.inktank.com host has been retired and affected Red Hat customers have been notified, further information is available at [https://securityblog.redhat.com/2015/09/17/](https://securityblog.redhat.com/2015/09/17/).

Users of Ceph packages should take action as a precautionary measure to download the newly-signed versions.  Please see the instructions below.

The Ceph community would like to thank Kai Fabian for initially alerting us to this issue.

* * *

The following steps should be performed on all nodes with Ceph software installed.

**Replace APT keys (Debian, Ubuntu)**

sudo apt-key del 17ED316D
curl https://git.ceph.com/release.asc | sudo apt-key add -
sudo apt-get update

**Replace RPM keys (Fedora, CentOS, SUSE, etc.)**

sudo rpm -e --allmatches gpg-pubkey-17ed316d-4fb96ee8
sudo rpm --import 'https://git.ceph.com/release.asc'

**Reinstalling packages (Fedora, CentOS, SUSE, etc.)**

sudo yum clean metadata
sudo yum reinstall -y $(repoquery --disablerepo=\* --enablerepo=ceph --queryformat='%{NAME}' list '\*')
