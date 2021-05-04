---
title: "Ansible AWS S3 core module now supports Ceph RGW S3"
date: "2016-06-20"
author: "admin"
tags: 
  - "planet"
---

![](images/20160621-ansible-s3-ceph.png "Ansible - S3 - Ceph")

The [Ansible](https://www.ansible.com/ "Ansible") [AWS S3 core module](http://docs.ansible.com/ansible/s3_module.html "Amazon S3 core module") now supports [Ceph](http://ceph.com/ "Ceph") [RGW S3](http://docs.ceph.com/docs/master/radosgw/ "Ceph Object Gateway"). The patch was upstream today and it will be included in Ansible 2.2

This post will introduce the new RGW S3 support in Ansible together with the required bits to run Ansible playbooks handling S3 use cases in [Ceph Jewel](http://ceph.com/releases/v10-2-2-jewel-released/ "Ceph Jewel").

**The Ansible project**

Ansible is a simple IT automation engine that automates cloud [provisioning](https://en.wikipedia.org/wiki/Provisioning "Provisioning"), [configuration management](https://en.wikipedia.org/wiki/Configuration_management "Configuration management"), [application deployment](https://www.ansible.com/application-deployment "Application deployment") and intra-service [orchestration](https://en.wikipedia.org/wiki/Orchestration_(computing) "Orchestration") among many other IT needs.

Ansible works by connecting to nodes ([SSH](https://en.wikipedia.org/wiki/Secure_Shell "Secure Shell")/[WinRM](https://msdn.microsoft.com/en-us/library/aa384426(v=vs.85).aspx "Windows Remote Management")) and pushing out small programs, called 'Ansible modules' to them. These programs are written to be resource models of the desired state of the system. Ansible then executes these modules and removes them when finished.

![](images/20160621-ansible-architecture.png "Ansible architecture")

Ansible uses playbooks to orchestrate the infrastructure with very detailed control. Those playbooks define configuration policies and orchestration workflows. They are a [YAML](http://yaml.org/ "YAML") definition of automation tasks that describe how a particular piece of automation should be done.

Playbooks are modeled as a collection of plays, each of which defines a set of tasks to be executed on a group of remote hosts. A play also defines the environment where the tasks will be executed.

![](images/20160621-ansible-playbook.png "Ansible Playbook")

Ansible modules ensure indempotence so it is possible running the same tasks over and over without affecting the final result.

**Using the Ansible AWS S3 core module with Ceph**

The Ceph RGW S3 support is part of the [Amazon S3 core module in Ansible](http://docs.ansible.com/ansible/s3_module.html "Amazon S3 core module"). The AWS S3 core module allows the user to manage S3 buckets and the objects within them. It includes support for creating and deleting both objects and buckets, retrieving objects as files or strings and generating download links.

The patch leverages the AWS S3 use cases without any restriction or limitation with regions, URLs, etc.

To enable the RGW S3 flavour in the S3 core module you set the 'rgw' boolean option to 'true' and the 's3\_url' string option to the RGW S3 server.

**

controller:~$ ansible rgw.test.node -m s3 -a 
"mode=list bucket=my-bucket s3\_url=http://rgw.test.server:8000 rgw=true"

**

The 's3\_url' option is mandatory in the RGW S3 flavour.

**Testing the RGW S3 core module flavour via Playbook**

This [Playbook example](/blog/content/ansible-ceph/playbook-test-rgw-s3-core-module.yml.txt "Playbook example") tests the RGW S3 flavour in a simple three boxes network ('controller', 'rgw.test.node' and 'rgw.test.server')

The 'controller' host is the box running the Ansible engine.

The 'rgw.test.node' is the host connecting to the Ceph RGW server and running the S3 use cases.

The 'rgw.test.server' is the Ceph RGW S3 server.

Running the testing Playbook...

**controller:~$ ansible-playbook playbook-test-rgw-s3-core-module.yml

PLAY \[all\] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*

TASK \[setup\] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
ok: \[rgw.test.node\]

TASK \[create test\_file test-file.txt\] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
changed: \[rgw.test.node\]

TASK \[put s3\_bucket\_items my-test-object-1\] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
changed: \[rgw.test.node\] => (item=my-test-object-1.txt)
changed: \[rgw.test.node\] => (item=my-test-object-2.txt)

TASK \[get s3\_bucket\_items\] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
ok: \[rgw.test.node\]

TASK \[download s3\_bucket\_items\] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
changed: \[rgw.test.node\] => (item=my-test-object-1.txt)
changed: \[rgw.test.node\] => (item=my-test-object-2.txt)

TASK \[remove s3\_bucket\_and\_content\] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
changed: \[rgw.test.node\]

PLAY RECAP \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
rgw.test.node              : ok=6    changed=4    unreachable=0    failed=0** 

As expected, the Playbook runs the 'create', 'upload', 'list', 'download' and 'remove' S3 use cases for buckets and objects. Adding the '-v' switch will show a more verbose output.

**Wrap-up**

All examples, modules and playbooks related to RGW S3 were tested on the new [Ceph Jewel release](http://ceph.com/releases/v10-2-2-jewel-released/ "Ceph Jewel").

Beyond of the RGW S3 support in the AWS S3 core module you could be interested in Ansible Playbooks to set up and configure Ceph clusters automatically. You can find those Playbooks in [ceph/ceph-ansible](https://github.com/ceph/ceph-ansible "Ansible playbooks for Ceph") with general support for Monitors, OSDs, MDSs and RGW.

The primary documentation for Ansible is available [here](http://docs.ansible.com/ "Ansible documentation"). I found the [Ansible whitepapers](https://www.ansible.com/whitepapers "Ansible whitepapers") a great resource too.

**Acknowledgments**

My work in [Ansible](https://www.ansible.com/ "Ansible") is sponsored by [Outscale](http://www.outscale.com "Outscale") and has been made possible by [Igalia](http://www.igalia.com "Igalia") and the invaluable help of the [Ansible community](https://www.ansible.com/community "Ansible community"). Thank you all!

![](images/20160621-igalia-ansible-outscale.png "Igalia - Ansible - Outscale")

**Related posts**

- [The Ceph RGW storage driver goes upstream in Libcloud](/blog/2016/05/17/the-ceph-rgw-storage-driver-goes-upstream-in-libcloud.html "The Ceph RGW storage driver goes upstream in Libcloud")
- [The Outscale OSU driver goes upstream in Libcloud](/blog/2016/04/11/the-outscale-osu-driver-goes-upstream-in-libcloud.html "The Outscale OSU driver goes upstream in Libcloud")
- [AWS Signature Version 4 goes upstream in Ceph](/blog/2016/03/01/aws-signature-version-4-goes-upstream-in-ceph.html "AWS Signature Version 4 goes upstream in Ceph")
- [Ceph, a free unified distributed storage system](/blog/2016/02/26/ceph-a-free-unified-distributed-storage-system.html "Ceph, a free unified distributed storage system")
- [On S3, endpoints, regions, signatures and Boto 3](/blog/2016/02/01/on-s3-endpoints-regions-signatures-and-boto-3.html "On S3, endpoints, regions, signatures and Boto 3")

Source: Javier Munoz ([Ansible AWS S3 core module now supports Ceph RGW S3](http://javiermunhoz.com/blog/2016/06/21/ansible-aws-s3-core-module-now-supports-ceph-rgw-s3.html))
