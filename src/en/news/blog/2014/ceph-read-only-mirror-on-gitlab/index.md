---
title: "Ceph read-only mirror on gitlab"
date: "2014-11-29"
author: "loic"
tags: 
  - "ceph"
---

The [gitlab-mirrors](https://github.com/samrocketman/gitlab-mirrors) scripts are [installed](https://github.com/samrocketman/gitlab-mirrors#three-easy-steps) to setup a [a read-only Ceph mirror](http://workbench.dachary.org/ceph/ceph/), updated hourly. It is used for permalinks such as [src/osd/ClassHandler.cc#L170](http://workbench.dachary.org/ceph/ceph/blob/master/src/osd/ClassHandler.cc#L170).  
  
The [gitlab-mirrors](https://github.com/samrocketman/gitlab-mirrors) config.sh is as follows:

#Environment file

#
# gitlab-mirrors settings
#

#The user git-mirrors will run as.
system\_user="gitmirror"
#The home directory path of the $system\_user
user\_home="/home/${system\_user}"
#The repository directory where gitlab-mirrors will contain copies of mirrored
#repositories before pushing them to gitlab.
repo\_dir="${user\_home}/repositories"
#colorize output of add\_mirror.sh, update\_mirror.sh, and git-mirrors.sh
#commands.
enable\_colors=true
#These are additional options which should be passed to git-svn.  On the command
#line type "git help svn"
git\_svn\_additional\_options="-s"
#Force gitlab-mirrors to not create the gitlab remote so a remote URL must be
#provided. (superceded by no\_remote\_set)
no\_create\_set=false
#Force gitlab-mirrors to only allow local remotes only.
no\_remote\_set=false
#Enable force fetching and pushing.  Will overwrite references if upstream
#forced pushed.  Applies to git projects only.
force\_update=false
#This option is for pruning mirrors.  If a branch is deleted upstream then that
#change will propagate into your GitLab mirror.  Aplies to git projects only.
prune\_mirrors=false

#
# Gitlab settings
#

#This is the Gitlab group where all project mirrors will be grouped.
gitlab\_namespace="Ceph"
#This is the base web url of your Gitlab server.
gitlab\_url="http://workbench.dachary.org"
#Special user you created in Gitlab whose only purpose is to update mirror sites
#and admin the $gitlab\_namespace group.
gitlab\_user="gitmirror"
#Generate a token for your $gitlab\_user and set it here.
gitlab\_user\_token\_secret="$(head -n1 "${user\_home}/private\_token" 2> /dev/null || echo "")"
#Verify signed SSL certificates?
ssl\_verify=false
#Push to GitLab over http?  Otherwise will push projects via SSH.
http\_remote=false

#
# Gitlab new project default settings.  If a project needs to be created by
# gitlab-mirrors then it will assign the following values as defaults.
#

#values must be true or false
issues\_enabled=false
wall\_enabled=false
wiki\_enabled=false
snippets\_enabled=false
merge\_requests\_enabled=true
public=true

It is configured for mirrors to be accessible to unauthenticated users by default **public=true** and disables SSL verification because the gitlab does not have https anyway : **ssl\_verify=false**.  
Although [the three easy steps](https://github.com/samrocketman/gitlab-mirrors#three-easy-steps) contain many sub steps, they can be followed to completion without problems.  
For fine control over what is mirrored (release branches, tags and pull requests from github), the following can be used instead:

#!/bin/bash
git fetch --force origin +refs/heads/\*:refs/heads/\* +refs/tags/\*:refs/tags/\* +refs/pull/\*:refs/pull/\*
git for-each-ref 'refs/pull/\*/head' | cut -f2 | xargs --no-run-if-empty --max-args 1 git update-ref -d
git push --prune --force gitlab $(for branch in dumpling emperor firefly giant next master ; do echo +refs/heads/$branch:refs/heads/$branch ; done) +refs/pull/\*:refs/heads/pull/\*
git prune

The **merge** ref exists if the head of the pull request **refs/pull/XXX/head** can successfully be merged. They are removed to keep only one ref per pull request. All pull request refs are mapped under the **refs/head** so that they are noticed by [GitLab CI](http://dachary.org/?p=3409). If they were kept under **refs/pull**, they would not be.  
It is run hourly with:

$ cat ~/crontab
@hourly ( date ; /home/gitmirror/mirror.sh ) > /home/gitmirror/cron.log 2>&1
