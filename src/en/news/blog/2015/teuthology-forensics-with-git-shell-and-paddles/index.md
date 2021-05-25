---
title: "teuthology forensics with git, shell and paddles"
date: "2015-10-07"
author: "admin"
tags: 
  - "planet"
---

When a [teuthology](http://github.com/ceph/teuthology) integration test for [Ceph](http://ceph.com/) fails, the results are analyzed to find the source of the problem. For instance the [upgrade suite: pool\_create failed with error -4 EINTR](http://tracker.ceph.com/issues/13279) issue was reported early October 2015, with multiple integration job failures.  
The first step is to [look into the teuthology log](http://tracker.ceph.com/projects/ceph-releases/wiki/HOWTO_forensic_analysis_of_integration_and_upgrade_tests#Deeper-analysis) which revealed that pools could not be created.

failed: error rados\_pool\_create(test-rados-api-vpm049-15238-1) 
  failed with error -4"

The **4** stands for **EINTR**. The [paddles](https://github.com/ceph/paddles) database is used by teuthology to store test results and can be queried via HTTP. For instance:

curl --silent http://paddles.front.sepia.ceph.com/runs/ |
  jq '.\[\] | 
      select(.name | contains("upgrade:firefly-hammer-x")) | 
      select(.branch == "infernalis") | 
      select(.status | contains("finished")) 
      | .name' | 
  while read run ; do eval run=$run ; 
    curl --silent http://paddles.front.sepia.ceph.com/runs/$run/jobs/ | 
      jq '.\[\] | "http://paddles.front.sepia.ceph.com/runs/(.name)/jobs/(.job\_id)/"' ; 
  done | 
  while read url ; do eval url=$url ; 
    curl --silent $url | 
      jq 'if((.description != null) and 
             (.description | contains("parallel")) and 
             (.success == true)) then "'$url'" else null end' ; 
  done | grep -v null

shows which successful jobs the **upgrade:firefly-hammer-x** suites run against the **infernalis** branch (the first [jq](https://stedolan.github.io/jq/) expression) were involved in a **parallel** test (that is the name of a subdirectory of the suite). This was not sufficient to figure out the root cause of the problem because:

- it only provides access to the last 100 runs
- it does allow to grep the teuthology log file for a string

With the teuthology logs in the **/a** directory (it’s actually a 100TB CephFS mount half full), the following shell snippet can be used to find the upgrade tests that failed with the **error -4** message in the logs.

for run in \*2015-{07,08,09,10}\*upgrade\* ; do for job in $run/\* ; do 
  test -d $job || continue ; 
  config=$job/config.yaml ;   test -f $config || continue ; 
  summary=$job/summary.yaml ; test -f $summary || continue ; 
  if shyaml get-value branch < $config | grep -q hammer && 
     shyaml get-value success < $summary | grep -qi false && 
     grep -q 'error -4' $job/teuthology.log  ; then
       echo $job ;
   fi ; 
done ; done

It looks for all upgrade runs, back to July 2015. [shyaml](https://pypi.python.org/pypi/shyaml) is used to query the **branch** from the job configuration and only keep those targeting hammer. If the job failed (according to the **success** value found in the summary file), the error is looked up in the teuthology.log file. The first failed job is found early september:

teuthology-2015-09-11\_17:18:07-upgrade:firefly-x-hammer-distro-basic-vps/1051109

It happened on a regular basis after that date but was only reported early October. The commits merged in the hammer branch around that time are displayed with:

git log --merges --since 2015-09-01 --until 2015-09-11 --format='%H' ceph/hammer | 
while read sha1 ; do 
  echo ; git log --format='\*\* %aD "%s":https://github.com/ceph/ceph/commit/%H' ${sha1}^1..${sha1} ; 
done | perl -p -e 'print "\* "PR $1":https://github.com/ceph/ceph/pull/$1n" if(/Merge pull request #(d+)/)'

It can be copy pasted in [redmine issue](http://tracker.ceph.com/issues/13279#note-12). It turns out that [a pull request merged September 6th](http://tracker.ceph.com/issues/13279#note-17) was responsible for the failure.

Source: Dachary ([teuthology forensics with git, shell and paddles](http://dachary.org/?p=3912))
