---
title: "RBD Ceph Backup"
date: "2017-04-03"
author: "admin"
tags: 
  - "planet"
---

# [](#Ceph-RBD-backup-script "Ceph RBD backup script")Ceph RBD backup script

Releasing the v0.1.1 of **ceph\_rbd\_bck.sh**. Here is a script I created in my spare time to create a backup solution for Ceph. I wrote this to provide an opensource solution to backing Ceph pools. I needed something to not only backup individual images in specified pools, but to also be able to set retention dates, and implement a synthetic full backup schedule. This is an extremely easy script intended help other people backup thier systems, or develop a more robust backup solution.

**See the full script over at github [Ceph Backup Script](https://github.com/magusnebula/ceph_backup_script/blob/ma
ster/ceph_rbd_backup.sh)**

## [](#Getting-started "Getting started")Getting started

First it should be noted that this script was created and tested on a machine running Centos 7.2. It may as is on other distros, or need minor tweaking to get working right. The machine you are running this on will need two basic things

- Admin access to your current Ceph Cluster
- A place to your backups (I recommend **NOT** on the cluster you are currently backing up)

This can be done from your admin node in Ceph using ceph-deploy

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div></pre></td><td class="code"><pre><div class="line">$ yum install ceph-deploy</div><div class="line">$ ceph-deploy install [BACKUP HOST]</div><div class="line">$ ceph-deploy admin [BACKUP HOST]</div></pre></td></tr></tbody></table>

To get started please create working directory for us to put our scripts and config files in. By default the config directory will be in **/opt/ceph\_backups/config**

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">mkdir -p /opt/ceph_backups/config</div></pre></td></tr></tbody></table>

## [](#Making-config-files "Making config files")Making config files

These config files are extremely simple and are for each individual pool. This will allow you to fine tune any pool to your liking and setup a staggered backup schedule. These should be placed in **/opt/ceph\_backups/config** and have the **‘.conf’** file extension. Each pool will require its own separate config file.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div><div class="line">6</div><div class="line">7</div><div class="line">8</div><div class="line">9</div><div class="line">10</div><div class="line">11</div><div class="line">12</div></pre></td><td class="code"><pre><div class="line"><span class="comment"># YMCA_pool.conf</span></div><div class="line"><span class="comment"># </span></div><div class="line"><span class="comment"># poolname - Name of pool to be backed up in Ceph</span></div><div class="line"><span class="comment"># fullday - day that the script should archive the last 7 days worth of backups</span></div><div class="line"><span class="comment">#           and create a new full/initial snapshot export. Note that this is numerical and </span></div><div class="line"><span class="comment">#           monday starts the week, monday=1 ... sunday= 7</span></div><div class="line"><span class="comment"># retention - how long backups should be kept before the archive is pruned off </span></div><div class="line"></div><div class="line">[PoolInfo]</div><div class="line">poolname = volumes-stg</div><div class="line">fullday = 5</div><div class="line">retention = 28</div></pre></td></tr></tbody></table>

## [](#Specific-Script-Notes "Specific Script Notes")Specific Script Notes

#### [](#Logging-Function "Logging Function")Logging Function

This is easy enough, by call ing **log** with a text string this will log it to a file. Note that cat’ing the file will produce color coded error tags, while opening it in vi will look off due to tput.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div></pre></td><td class="code"><pre><div class="line"><span class="built_in">log</span> <span class="string">"<span class="variable">$ERROR_MSG</span> Goodbye world"</span></div><div class="line">cat file.log</div><div class="line">...</div><div class="line">[ERROR] Goodbye world</div><div class="line">...</div></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div><div class="line">6</div><div class="line">7</div></pre></td><td class="code"><pre><div class="line"><span class="comment"># Formatting for log files</span></div><div class="line">    ERROR_MSG=$(<span class="built_in">echo</span> <span class="string">"[`tput setaf 1``tput bold`ERROR`tput sgr0`]"</span>)</div><div class="line">    WARNING_MSG=$(<span class="built_in">echo</span> <span class="string">"[`tput setaf 3``tput bold`WARNING`tput sgr0`]"</span>)</div><div class="line">    DEBUG_MSG=$(<span class="built_in">echo</span> <span class="string">"[`tput setaf 4``tput bold`DEBUG`tput sgr0`]"</span>)</div><div class="line">    INFO_MSG=$(<span class="built_in">echo</span> <span class="string">"[`tput setaf 7``tput bold`INFO`tput sgr0`]"</span>)</div><div class="line">    FATAL_MSG=$(<span class="built_in">echo</span> <span class="string">"[`tput setaf 1``tput bold`FATAL`tput sgr0`]"</span>)</div><div class="line">    CRITICAL_MSG=$(<span class="built_in">echo</span> <span class="string">"[`tput setaf 1``tput bold`CRITICAL`tput sgr0`]"</span>)</div></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div></pre></td><td class="code"><pre><div class="line"><span class="comment"># Basic Loging Function</span></div><div class="line"><span class="keyword">function</span> <span class="function"><span class="title">log</span></span> () {</div><div class="line">            <span class="built_in">echo</span> <span class="string">"<span class="variable">$1</span>"</span> &gt;&gt; <span class="variable">$LOG_FILE</span></div><div class="line">}</div></pre></td></tr></tbody></table>

#### [](#Archiveing-Function "Archiveing Function")Archiveing Function

This finds everything less than 7 days old (_mtime -6_), excluding tar.gz files, in the backup folder for the specific image.  
If the archive exsits, remove all the old files and purge all snapshots. This will trigger a new full and initial snapshot to be created.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div><div class="line">6</div><div class="line">7</div><div class="line">8</div><div class="line">9</div><div class="line">10</div><div class="line">11</div></pre></td><td class="code"><pre><div class="line"><span class="keyword">function</span> <span class="function"><span class="title">archive</span></span>() {</div><div class="line">    tar cvf - $(find <span class="variable">$IMAGE_DIR</span>/* -mtime -6 -type f ( ! -iname <span class="string">"*<span class="variable">$COMPRESSED_BACKUP_SUFFIX</span>"</span> )) | </div><div class="line">          gzip -9c &gt; <span class="variable">${IMAGE_DIR}</span>/<span class="variable">${LOCAL_IMAGE}</span>_<span class="variable">${LASTWEEK}</span>_to_<span class="variable">${TODAY}</span><span class="variable">${COMPRESSED_BACKUP_SUFFIX}</span></div><div class="line"></div><div class="line">    <span class="keyword">if</span> [[ <span class="_">-f</span> <span class="variable">${IMAGE_DIR}</span>/<span class="variable">${LOCAL_IMAGE}</span>_<span class="variable">${LASTWEEK}</span>_to_<span class="variable">${TODAY}</span><span class="variable">${COMPRESSED_BACKUP_SUFFIX}</span> ]]; <span class="keyword">then</span></div><div class="line">            rm <span class="_">-f</span> $(find <span class="variable">$IMAGE_DIR</span>/* -mtime -6 -type f ( ! -iname <span class="string">"*<span class="variable">${COMPRESSED_BACKUP_SUFFIX}</span>"</span> ))</div><div class="line">            rbd snap purge <span class="variable">$POOL</span>/<span class="variable">$LOCAL_IMAGE</span></div><div class="line">    <span class="keyword">else</span></div><div class="line">            <span class="built_in">log</span> <span class="string">"<span class="variable">$ERROR_MSG</span> File not created"</span></div><div class="line">    <span class="keyword">fi</span></div><div class="line">}</div></pre></td></tr></tbody></table>

#### [](#Retention-Function "Retention Function")Retention Function

This finds everything older than a given varible “**\[retention\_time\]**“ (_mtime +\[retention\_time\]_) in the backup folder for the specific image and deletes it. This is very simple and is just here to delete old archive files. **Note: I will add in eventually a safeguard to ensure that only compressed archives get the axe.**

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div></pre></td><td class="code"><pre><div class="line"><span class="comment"># Usage: retention [bck_directory] [retention_time]</span></div><div class="line"><span class="keyword">function</span> <span class="function"><span class="title">retention</span></span>() {</div><div class="line">      find <span class="variable">$1</span>/* -mtime +<span class="variable">$2</span> | xargs rm</div><div class="line">}</div></pre></td></tr></tbody></table>

Source: Stephen McElroy ([RBD Ceph Backup](http://obsidiancreeper.com/2017/04/03/Updated-Ceph-Backup/))
