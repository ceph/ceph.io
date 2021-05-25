---
title: "Re-schedule failed teuthology jobs"
date: "2015-03-03"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

The [Ceph](http://ceph.com/) [integration tests](http://dachary.org/?p=3575) may fail because of environmental problems (network not available, packages not built, etc.). If six jobs failed out of seventy, these failed test can be re-run instead of re-scheduling the whole suite. It can be done using the \*\*–filter\*\* option of [teuthology-suite](https://github.com/ceph/teuthology/blob/4023eb974afd049602cbc48b0a85b2caa6eaaac1/teuthology/suite.py#L483) with a comma separated list of the job description that failed.  
The job description can either be copy/pasted from [the web interface](http://pulpito.ceph.com/loic-2015-03-03_12:46:38-rgw-firefly-backports---basic-multi/) or extracted from the [paddles](https://github.com/ceph/paddles) json output with:

$ run=loic-2015-03-03\_12:46:38-rgw-firefly-backports---basic-multi
$ paddles=http://paddles.front.sepia.ceph.com
$ eval filter=$(curl --silent $paddles/runs/$run/jobs/?status=fail |
  jq '.\[\].description' | \\
  while read description ; do echo -n $description, ; done | \\
  sed -e 's/,$//')

Where the **paddles** URL outputs a json description of each job of the form:

\[
  {
    "os\_type": "ubuntu",
    "nuke\_on\_error": true,
    "status": "pass",
    "failure\_reason": null,
    "success": true,
...
    "description": "rgw/multifs/{clusters/fixed-2.yaml}"
  },
  {
    "os\_type": "ubuntu",
...

The **jobs/?status=fail** part of the URL selects the jobs with **"success":false**. The [jq](http://stedolan.github.io/jq/) expression displays the description field (**.\[\].description**), one by line. These lines are aggregated into a comma separated list (**while read description ; do echo -n $description, ; done**) and the trailing comma is stripped (**sed -e 's/,$//'**). The filter variable is set to the resulting line and evaled to get rid of the quotes (**eval filter=$(..)**).  
The command used to schedule the entire suite can be re-used by adding the **\--filter="$filter"** argument and will only run the failed jobs.

$ ./virtualenv/bin/teuthology-suite --filter="$filter" \\
  --priority 101 --suite rgw --suite-branch firefly \\
  --machine-type plana,burnupi,mira \\
  --distro ubuntu --email loic@dachary.org \\
  --owner loic@dachary.org  \\
  --ceph firefly-backports
...
Suite rgw in suites/rgw scheduled 6 jobs.
Suite rgw in suites/rgw -- 56 jobs were filtered out.
