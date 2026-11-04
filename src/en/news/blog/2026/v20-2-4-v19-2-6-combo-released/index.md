---
title: "[CVE] [URGENT] Squid v19.2.6 and Tentacle v20.2.4 released"
date: "2026-08-19"
author: "Patrick Donnelly"
tags:
  - "release"
  - "tentacle"
  - "squid"
---

The Ceph project has released Tentacle 20.2.4 and Squid 19.2.6 hotfixes for four CVEs across several components.

This is the sixth backport release in the Squid series.
This is the fourth backport release in the Tentacle series.

We strongly recommend that all Ceph operators upgrade to one of these releases as soon as possible.


Release Date
------------

August 19, 2026


Critical Upgrade Steps
----------------------

The fix for [CVE-2025-30156](https://docs.ceph.com/en/latest/security/CVE-2025-30156) introduces a new CephX key type, aes256k. This is the first time Ceph has introduced a new key type for CephX credentials. Therefore, a new procedure exists for upgrading and rotating Ceph daemon keys as part of this CVE. Before upgrading a Ceph cluster, the operator should familiarize themselves with [the procedure to upgrade CephX keys](https://docs.ceph.com/en/latest/rados/configuration/auth-config-ref/index.html#upgrading-and-rotating-cephx-keys).

These steps are for package-based deployments of Ceph. In other sections, the document also includes new information about key rotation procedures, monitor authentication controls, and emergency recovery procedures.

Deployments using cephadm will automate the process except for client keys. You may notice that Cephadm spends more time than normal on the upgrade after updating all daemon images. This is due to a new process rotating the OSD and MDS keys. Please be patient. There are plans to improve this in the future.

Deployments using Rook will also automate rotation of some client keys with some exclusions. Look to the Rook project’s announcement for more details.

Client and kernel upgrades are recommended to support aes256k. Note that upstream Linux kernel client support began in kernel 7.0 and has been backported to CentOS Stream 9 and 10. Check with your distribution vendor for backported key support before rotating client keys used by the kernel.

As part of upgrading a Ceph cluster, six new health warnings and errors will be generated. This is normal. As part of the process to upgrade/rotate entity keys, you will address the warnings and errors as you go. These are documented beginning [here](https://docs.ceph.com/en/latest/rados/operations/health-checks/index.html#auth-insecure-keys-creatable).

The [CephX documentation](https://docs.ceph.com/en/latest/architecture/index.html#high-availability-authentication) has been brought up to date and vetted for accuracy.

Regarding the fix for [CVE-2026-54330](https://docs.ceph.com/en/latest/security/CVE-2026-54330), RGW will now reject Sigv4 requests with `host` and `x-amz-` headers not included in the signed subset. Unfortunately, the REST client used in multisite was generating such improperly signed requests.

If you are running multisite, you must set the `rgw_sigv4_insecure` option to true before you begin to upgrade. After all clusters are upgraded, set the option to `false` again.

Regarding the fix for [CVE-2026-50152](https://docs.ceph.com/en/latest/security/CVE-2026-50152), formal guidance on rotating all secrets stored in the Monitor config-key store will be forthcoming. In the meantime, operators of cephadm-managed clusters are strongly encouraged to use the established process to [rotate the cephadm SSH key](https://docs.ceph.com/en/latest/cephadm/host-management/#ssh-configuration).

Rotating other secrets is advised but the process is not yet established. Operators should assess their cluster's potential exposure to determine if immediate Monitor config-key secret rotation is required for their environment.


CVE Fixes
---------

* [CVE-2025-30156](https://docs.ceph.com/en/latest/security/CVE-2025-30156) is an authentication bypass in CephX caused by misuse of AES-CBC.

* [CVE-2026-39944](https://docs.ceph.com/en/latest/security/CVE-2026-39944) shares the unauthenticated-encryption root cause of CVE-2025-30156, but applies it to RGW's STS session tokens resulting in improper verification of a cryptographic signature.

* [CVE-2026-50152](https://docs.ceph.com/en/latest/security/CVE-2026-50152) is an improper authorization flaw in the Ceph Monitor subscription handler.

* [CVE-2026-54330](https://docs.ceph.com/en/latest/security/CVE-2026-54330) is a flaw in RGW not properly verifying its SigV4 cryptographic signatures in RGW's SigV4 verifier.


Other Media
-----------

A [Cephalocon 2025 talk](https://cephalocon2025.sched.com/event/27f2O/rotating-heads-and-cephx-keys-patrick-donnelly-ibm-yehuda-sadeh-weinraub-ubiquiti) covers some of the details surrounding the new CephX key upgrade process.
