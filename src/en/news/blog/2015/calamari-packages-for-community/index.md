---
title: "Calamari Packages for Community"
date: "2015-07-13"
author: "syndicated"
tags: 
  - "planet"
---

![Ceph Calamari Packages for Community](images/ceph-calamari-packages-for-community.png "Ceph Calamari Packages for Community")

Recently I have been playing around Ceph calamari, which is a management and monitoring system for Ceph storage cluster. It provides a beautiful Dashboard User Interface that makes Ceph cluster monitoring amazingly simple and handy.

# History

- Calamari was developed by InkTank and was provided as a product offering under InkTank Ceph Enterprise (ICE) to their enterprise customers.
- Later when RedHat acquired InkTank , [Calamari](https://github.com/ceph/calamari) was open sourced by RedHat.

# Present

Unlike Ceph where Ceph community (mostly RedHat’s Ceph engineering team) provides and maintains Ceph packages for various platforms, the community version of Calamari at present comes in Source code (no packages , sorry)

To deploy Calamari in your environment you need to build it from source into direct installable packages (RPM , DEB). However building calamari packages is a daunting task of following [Official Documentation](http://ceph.com/calamari/docs/development/building_packages.html) and be ready for extra troubleshooting.

# Package as a Service ;-)

![Ceph Calamari Packages for Community](images/ceph-calamari-packages-repo.png "Ceph Calamari Packages for Community")

I have been testing calamari on various platforms and have gone through the hard time of compiling them for CentOS and Ubuntu distributions. These are Linux packages that you can use to install Calamari in your environment.

Get the packages from [My GitHub Repository](https://github.com/ksingh7/ceph-calamari-packages)

# Contribute

- Would **Appreciate your contribution back**, if you already have compiled packages of Calamari ( other versions , distributions) lying somewhere in your workstation. Be kind and push them [here](https://github.com/ksingh7/ceph-calamari-packages).
    
- If you are planning to compile from the latest source ( new version ) Great … you are awesome , please do it and then share them [here](https://github.com/ksingh7/ceph-calamari-packages).
    

> **Liked it, Leave a Comment below ;-)**
