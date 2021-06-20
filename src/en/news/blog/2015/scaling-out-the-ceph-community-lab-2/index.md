---
title: "Scaling out the Ceph community lab"
date: "2015-08-01"
author: "loic"
tags: 
  - "ceph"
---

[Ceph](http://ceph.com/) [integration tests](https://github.com/ceph/teuthology/) are vital and expensive. Contrary to unit tests that can be run on a laptop, they require multiple machines to deploy an actual Ceph cluster. As the community of Ceph developers expands, the [community lab](http://ceph.github.io/sepia/) needs to expand.

### The current development workflow and its challenges

When a developer contributes to Ceph, it goes like this:

- The Developer submits a [pull request](https://github.com/ceph/ceph/pulls)
- After the Reviewer is satisfied with the pull request, it is scheduled for integration testing (by adding the **needs-qa** label)
- A Tester merges the pull request in an integration branch, together with other pull requests that **needs-qa** and set a label informing (s)he did so (for instance if Kefu Chai did it, he would set the **wip-kefu-testing** label)
- The Tester waits for the [packages to be built](http://ceph.com/gitbuilder.cgi) for the integration branch
- The Tester schedules a suite of [integration tests](https://github.com/ceph/ceph-qa-suite/tree/master/suites) in the community lab
- When the suite finishes, the Tester analyzes the integration tests results, finds the pull request responsible for a failure (which can be challenging when there are more than a handfull of pull requests in the integration branch)
- For each failure the Tester adds a comment to the faulty pull request with a link to the integration test logs, kindly asking the developer to address the issue
- When the integration tests are clean, the Tester merges the pull requests

As the number of contributors to Ceph increases, running the integration tests and analyzing their results becomes the bottleneck, because:

- getting the integration tests results usually takes a few days
- only people with access to the community lab can run integration tests
- analyzing test results is time consuming

Increasing the number of machines in the community lab would run integration tests faster. But acquiring hardware, hosting it and monitoring it not only takes months, it also require significant system administration work. The community of Ceph developers is growing faster than what the community lab. And to make things even more complicated, as Ceph evolves the number of integration tests increases and require even more resources.

When a developer frequently contributes to Ceph, (s)he is granted access to the VPN that allows her/him to schedule integration tests. For instance Abhishek Lekshmanan and Nathan Cutler who routinely run and analyze integration tests for backports now have access to the community lab and can do that on their own. But the process to get access to the VPN takes weeks and the learning curve to use it properly is significant.

Although it is mostly invisible to the community lab user, the system administration workload to keep it running is significant. Dan Mick, Zack Cerza and others fix problems on a daily basis. As the size of the community lab grows, this workload increases and requires skills that are difficult to acquire.

### Simplifying the workflow with public OpenStack clouds

As of July 2015, it became possible to [run integration tests on public OpenStack clouds](http://dachary.org/?p=3828). More importantly, it takes less than one hour for a new developer to register and schedule an integration test. This new facility can be leveraged to simplify the workflow as follows:

- The Developer submits a [pull request](https://github.com/ceph/ceph/pulls)
- The Developer is required to attach a successfull run of integration tests demonstrating the feature or the bug fix
- After the Reviewer is satisfied with the pull request, it is merged.

There is no need for a **Tester** because the Developer now has the ability to run integration tests and interpret the results.

The interpretation of the test results is simpler because there is only one pull request for a run. The Developer can compare her/his run to a recent run from the community lab to verify the unmodified code passes. (S)He also can debug a failed test in **interactive mode**.

Contrary to the community lab, the test cluster has a short life span and requires no system administration skills. It is created in the cloud, on demand, and can be destroyed as soon as the results have been analyzed.

The learning curve to schedule and interpret integration tests is reduced. The Developer needs to know about the **teuthology-openstack** command and how to interpret a test failure. But (s)he does not need the other teuthology-\* commands nor does (s)he have to get access to the VPN of the community lab.
