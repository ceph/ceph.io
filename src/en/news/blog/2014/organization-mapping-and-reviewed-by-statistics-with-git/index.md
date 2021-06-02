---
title: "Organization mapping and Reviewed-by statistics with git"
date: "2014-01-10"
author: "loic"
tags: 
  - "ceph"
---

[shortlog](https://www.kernel.org/pub/software/scm/git/docs/git-shortlog.html) is convenient to print a leader board counting contributions. For instance to display the top ten commiters of [Ceph](http://ceph.com/) over the past year:

$ git shortlog --since='1 year' --no-merges -nes | nl | head -10
     1	  1890	Sage Weil <sage@inktank.com>
     2	   805	Danny Al-Gaaf <danny.al-gaaf@bisect.de>
     3	   491	Samuel Just <sam.just@inktank.com>
     4	   462	Yehuda Sadeh <yehuda@inktank.com>
     5	   443	John Wilkins <john.wilkins@inktank.com>
     6	   303	Greg Farnum <greg@inktank.com>
     7	   288	Dan Mick <dan.mick@inktank.com>
     8	   274	Loic Dachary <loic@dachary.org>
     9	   219	Yan, Zheng <zheng.z.yan@intel.com>
    10	   214	João Eduardo Luís <joao.luis@inktank.com>

To get the same output for reviewers over the past year, assuming the **Reviewed-by** is set consistently in the commit messages, the following can be used:

git log  --since='1 year' --pretty=%b | \\
 perl -n -e 'print "$\_\\n" if(s/^\\s\*Reviewed-by:\\s\*(.\*<.\*>)\\s\*$/\\1/)'  | \\
 git check-mailmap --stdin | \\
 sort | uniq -c | sort -rn | nl | head -10
     1	    652 Sage Weil <sage@inktank.com>
     2	    265 Greg Farnum <greg@inktank.com>
     3	    185 Samuel Just <sam.just@inktank.com>
     4	    106 Josh Durgin <josh.durgin@inktank.com>
     5	     95 João Eduardo Luís <joao.luis@inktank.com>
     6	     95 Dan Mick <dan.mick@inktank.com>
     7	     69 Yehuda Sadeh <yehuda@inktank.com>
     8	     46 David Zafman <david.zafman@inktank.com>
     9	     36 Loic Dachary <loic@dachary.org>
    10	     21 Gary Lowell <gary.lowell@inktank.com>

The body of the commit messages ( **–pretty=%b** ) is displayed for commits from the past year ( **–since=’1 year’** ). perl reads an does not print anything ( **\-n** ) unless it finds a **Reviewed-by:** string followed by what looks like First Last <mail@dot.com> ( **^\\s\*Reviewed-by:\\s\*(.\*<.\*>)\\s\*$** ). The authors found are remapped to fix typos ( **git check-mailmap –stdin** ).  
The authors can further be remapped into the organization to which they are affiliated using the [.organizationmap](https://github.com/ceph/ceph/blob/master/.organizationmap) file which has the same format as the **.mailmap** file, only remapping normalized author names to organization names with **git -c mailmap.file=.organizationmap check-mailmap –stdin**

git log  --since='1 year' --pretty=%b | \\
 perl -n -e 'print "$\_\\n" if(s/^\\s\*Reviewed-by:\\s\*(.\*<.\*>)\\s\*$/\\1/)'  | \\
 git check-mailmap --stdin | \\
 **git -c mailmap.file=.organizationmap check-mailmap --stdin** | \\
 sort | uniq -c | sort -rn | nl | head -10
     1	   1572 Inktank <contact@inktank.com>
     2	     39 Cloudwatt <libre.licensing@cloudwatt.com>
     3	      7 Intel <contact@intel.com>
     4	      4 University of California, Santa Cruz <contact@cs.ucsc.edu>
     5	      4 Roald van Loon Consultancy <roald@roaldvanloon.nl>
     6	      2 CERN <contact@cern.ch>
     7	      1 SUSE <contact@suse.com>
     8	      1 Mark Kirkwood <mark.kirkwood@catalyst.net.nz>
     9	      1 IWeb <contact@iweb.com>
    10	      1 Gaudenz Steinlin <gaudenz@debian.org>
