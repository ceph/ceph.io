---
title: "Ceph Installation :: Part-2"
date: "2013-12-05"
author: "syndicated"
tags: 
  - "ceph"
  - "planet"
---

##   

## CEPH Storage Cluster[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "CEPH Storage Cluster")

### [](https://draft.blogger.com/blogger.g?blogID=6067449713794600812)Installing Ceph Deploy ( ceph-mon1 )[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "Installing Ceph Deploy ( ceph-mon1 )")

- Update your repository and install ceph-deploy on ceph-mon1 node

\[ceph@ceph-mon1 ~\]$ sudo yum update && sudo yum install ceph-deploy  
Loaded plugins: downloadonly, fastestmirror, security  
Loading mirror speeds from cached hostfile  
 \* base: ftp.funet.fi  
 \* epel: www.nic.funet.fi  
 \* extras: ftp.funet.fi  
 \* updates: mirror.academica.fi  
Setting up Update Process  
No Packages marked for Update  
Loaded plugins: downloadonly, fastestmirror, security  
Loading mirror speeds from cached hostfile  
 \* base: ftp.funet.fi  
 \* epel: www.nic.funet.fi  
 \* extras: ftp.funet.fi  
 \* updates: mirror.academica.fi  
Setting up Install Process  
Resolving Dependencies  
\--> Running transaction check  
\---> Package ceph-deploy.noarch 0:1.2.7-0 will be installed  
\--> Finished Dependency Resolution  
  
Dependencies Resolved  
  
\===============================================================================================================================================  
 Package                             Arch                           Version                          Repository                           Size  
\===============================================================================================================================================  
Installing:  
 ceph-deploy                         noarch                         1.2.7-0                          ceph-noarch                         176 k  
  
Transaction Summary  
\===============================================================================================================================================  
Install       1 Package(s)  
  
Total download size: 176 k  
Installed size: 553 k  
Is this ok \[y/N\]: y  
Downloading Packages:  
ceph-deploy-1.2.7-0.noarch.rpm                           75% \[===================================            \]  64 kB/s | 133 kB     00:00 ETA   
 Running rpm\_check\_debug  
Running Transaction Test  
Transaction Test Succeeded  
Running Transaction  
Warning: RPMDB altered outside of yum.  
  Installing : ceph-deploy-1.2.7-0.noarch \[############################################################################################# \] 1/1  
Verifying  : ceph-deploy-1.2.7-0.noarch                                                                                                  1/1   
Installed:  
  ceph-deploy.noarch 0:1.2.7-0                                                                                                                   
Complete!  
root@ceph-mon1 /\]# ce      rpm -qa | grep -i ceph  
ceph-release-1-0.el6.noarch  
ceph-deploy-1.2.7-0.noarch  
\[root@ceph-mon1 /\]# 

### [](https://draft.blogger.com/blogger.g?blogID=6067449713794600812)Creating Ceph Cluster[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "Creating Ceph Cluster")

- As a first exercise, create a Ceph Storage Cluster with one Ceph Monitor and two Ceph OSD nodes. Post this will expand it by adding two more Ceph Monitors.

- **Tip : The ceph-deploy utility will output files to the current directory. Ensure you are in /etc/ceph directory when executing ceph-deploy.**

- **Important Do not call ceph-deploy with sudo or run it as root if you are logged in as a different user, because it will not issue sudo commands needed on the remote host.**

- **Create the cluster using ceph-deploy , Check the output of ceph-deploy with ls and cat in the current directory. You should see a Ceph configuration file, a keyring, and a log file for the new cluster.**

 \[root@ceph-mon1 ceph\]# ceph-deploy new ceph-mon1  
\[ \[1mceph\_deploy.cli \[0m\]\[ \[1;37mINFO \[0m  \] Invoked (1.2.7): /usr/bin/ceph-deploy new ceph-mon1  
\[ \[1mceph\_deploy.new \[0m\]\[ \[1;34mDEBUG \[0m \] Creating new cluster named ceph  
\[ \[1mceph\_deploy.new \[0m\]\[ \[1;34mDEBUG \[0m \] Resolving host ceph-mon1  
\[ \[1mceph\_deploy.new \[0m\]\[ \[1;34mDEBUG \[0m \] Monitor ceph-mon1 at 192.168.1.38  
\[ \[1mceph\_deploy.new \[0m\]\[ \[1;34mDEBUG \[0m \] Monitor initial members are \['ceph-mon1'\]  
\[ \[1mceph\_deploy.new \[0m\]\[ \[1;34mDEBUG \[0m \] Monitor addrs are \['192.168.1.38'\]  
\[ \[1mceph\_deploy.new \[0m\]\[ \[1;34mDEBUG \[0m \] Creating a random mon key...  
\[ \[1mceph\_deploy.new \[0m\]\[ \[1;34mDEBUG \[0m \] Writing initial config to ceph.conf...  
\[ \[1mceph\_deploy.new \[0m\]\[ \[1;34mDEBUG \[0m \] Writing monitor keyring to ceph.mon.keyring...  
 \[root@ceph-mon1 ceph\]# ll  
\-rw-r--r-- 1 root root 189 Oct 25 13:06 ceph.conf  
\-rw-r--r-- 1 root root 785 Oct 25 13:06 ceph.log  
\-rw-r--r-- 1 root root  73 Oct 25 13:06 ceph.mon.keyring  
\[root@ceph-mon1 ceph\]# 

- **Install Ceph on ceph-mon1 node** Dont panic if you see errors due to wget , centos does not understand wget and throws some errors that can be ignored , but finally it install ceph on your node and shows the installed version.

\[root@ceph-mon1 ceph\]# ceph-deploy install ceph-mon1  
\[ \[1mceph\_deploy.cli \[0m\]\[ \[1;37mINFO \[0m  \] Invoked (1.2.7): /usr/bin/ceph-deploy install ceph-mon1  
\[ \[1mceph\_deploy.install \[0m\]\[ \[1;34mDEBUG \[0m \] Installing stable version dumpling on cluster ceph hosts ceph-mon1  
\[ \[1mceph\_deploy.install \[0m\]\[ \[1;34mDEBUG \[0m \] Detecting platform for host ceph-mon1 ...  
\[ \[1mceph\_deploy.sudo\_pushy \[0m\]\[ \[1;34mDEBUG \[0m \] will use a local connection without sudo  
\[ \[1mceph\_deploy.lsb \[0m\]\[ \[1;33mWARNIN \[0m\] lsb\_release was not found - inferring OS details  
\[ \[1mceph\_deploy.install \[0m\]\[ \[1;37mINFO \[0m  \] Distro info: CentOS 6.4 Final  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] installing ceph on ceph-mon1  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] adding EPEL repository  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: wget http://dl.fedoraproject.org/pub/epel/6/x86\_64/epel-release-6-8.noarch.rpm  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \] Traceback (most recent call last):  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]   File "/usr/lib/python2.6/site-packages/ceph\_deploy/hosts/centos/install.py", line 77, in install\_epel  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]   File "/usr/lib/python2.6/site-packages/ceph\_deploy/util/decorators.py", line 10, in inner  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]     def inner(\*args, \*\*kwargs):  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]   File "/usr/lib/python2.6/site-packages/ceph\_deploy/util/wrappers.py", line 6, in remote\_call  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]     This allows us to only remote-execute the actual calls, not whole functions.  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]   File "/usr/lib64/python2.6/subprocess.py", line 500, in check\_call  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]     retcode = call(\*popenargs, \*\*kwargs)  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]   File "/usr/lib64/python2.6/subprocess.py", line 478, in call  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]     p = Popen(\*popenargs, \*\*kwargs)  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]   File "/usr/lib64/python2.6/subprocess.py", line 642, in \_\_init\_\_  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]     errread, errwrite)  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]   File "/usr/lib64/python2.6/subprocess.py", line 1234, in \_execute\_child  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]     raise child\_exception  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: rpm -Uvh --replacepkgs epel-release-6\*.rpm  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \] Traceback (most recent call last):  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]   File "/usr/lib/python2.6/site-packages/ceph\_deploy/util/pkg\_managers.py", line 69, in rpm  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]   File "/usr/lib/python2.6/site-packages/ceph\_deploy/util/decorators.py", line 10, in inner  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]     def inner(\*args, \*\*kwargs):  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]   File "/usr/lib/python2.6/site-packages/ceph\_deploy/util/wrappers.py", line 6, in remote\_call  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]     This allows us to only remote-execute the actual calls, not whole functions.  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]   File "/usr/lib64/python2.6/subprocess.py", line 505, in check\_call  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]     raise CalledProcessError(retcode, cmd)  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: su -c 'rpm --import "https://ceph.com/git/?p=ceph.git;a=blob\_plain;f=keys/release.asc"'  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: rpm -Uvh --replacepkgs http://ceph.com/rpm-dumpling/el6/noarch/ceph-release-1-0.el6.noarch.rpm  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] Retrieving http://ceph.com/rpm-dumpling/el6/noarch/ceph-release-1-0.el6.noarch.rpm  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] Preparing...                ##################################################  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] ceph-release                ##################################################  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: yum -y -q install ceph  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: ceph --version  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] ceph version 0.67.4 (ad85b8bfafea6232d64cb7ba76a8b6e8252fa0c7)  
 \]0;root@ceph-mon1:/etc/ceph \[root@ceph-mon1 ceph\]# 

- **Adding node ceph-mon1 as our first monitor node**

 \[root@ceph-mon1 ceph\]# ceph-deploy mon  create ceph-mon1  
\[ \[1mceph\_deploy.cli \[0m\]\[ \[1;37mINFO \[0m  \] Invoked (1.2.7): /usr/bin/ceph-deploy mon create ceph-mon1  
\[ \[1mceph\_deploy.mon \[0m\]\[ \[1;34mDEBUG \[0m \] Deploying mon, cluster ceph hosts ceph-mon1  
\[ \[1mceph\_deploy.mon \[0m\]\[ \[1;34mDEBUG \[0m \] detecting platform for host ceph-mon1 ...  
\[ \[1mceph\_deploy.sudo\_pushy \[0m\]\[ \[1;34mDEBUG \[0m \] will use a local connection without sudo  
\[ \[1mceph\_deploy.lsb \[0m\]\[ \[1;33mWARNIN \[0m\] lsb\_release was not found - inferring OS details  
\[ \[1mceph\_deploy.mon \[0m\]\[ \[1;37mINFO \[0m  \] distro info: CentOS 6.4 Final  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \] determining if provided host has same hostname in remote  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \] deploying mon to ceph-mon1  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \] remote hostname: ceph-mon1  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] write cluster configuration to /etc/ceph/{cluster}.conf  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \] Traceback (most recent call last):  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]   File "/usr/lib/python2.6/site-packages/ceph\_deploy/util/decorators.py", line 10, in inner  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]     def inner(\*args, \*\*kwargs):  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]   File "/usr/lib/python2.6/site-packages/ceph\_deploy/conf.py", line 12, in write\_conf  
\[ \[1mceph-mon1 \[0m\]\[ \[1;31mERROR \[0m \]     line = self.fp.readline()  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \] checking for done path: /var/lib/ceph/mon/ceph-ceph-mon1/done  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \] done path does not exist: /var/lib/ceph/mon/ceph-ceph-mon1/done  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] creating keyring file: /var/lib/ceph/tmp/ceph-ceph-mon1.mon.keyring  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] create the monitor keyring file  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: ceph-mon --cluster ceph --mkfs -i ceph-mon1 --keyring /var/lib/ceph/tmp/ceph-ceph-mon1.mon.keyring  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] ceph-mon: mon.noname-a 192.168.1.38:6789/0 is local, renaming to mon.ceph-mon1  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] ceph-mon: set fsid to 91ad085b-81ad-43db-9aa0-f3895a53613e  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] ceph-mon: created monfs at /var/lib/ceph/mon/ceph-ceph-mon1 for mon.ceph-mon1  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] unlinking keyring file /var/lib/ceph/tmp/ceph-ceph-mon1.mon.keyring  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] create a done file to avoid re-doing the mon deployment  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] create the init path if it does not exist  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] locating \`service\` executable...  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] found \`service\` executable: /sbin/service  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: /sbin/service ceph -c /etc/ceph/ceph.conf start mon.ceph-mon1  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \] === mon.ceph-mon1 ===   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \] Starting Ceph mon.ceph-mon1 on ceph-mon1...  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \] Starting ceph-create-keys on ceph-mon1...  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: ceph --admin-daemon /var/run/ceph/ceph-mon.ceph-mon1.asok mon\_status  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \] status for monitor: mon.ceph-mon1  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \] {  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]   "election\_epoch": 2,   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]   "extra\_probe\_peers": \[\],   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]   "monmap": {  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]     "created": "0.000000",   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]     "epoch": 1,   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]     "fsid": "91ad085b-81ad-43db-9aa0-f3895a53613e",   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]     "modified": "0.000000",   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]     "mons": \[  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]       {  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]         "addr": "192.168.1.38:6789/0",   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]         "name": "ceph-mon1",   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]         "rank": 0  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]       }  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]     \]  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]   },   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]   "name": "ceph-mon1",   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]   "outside\_quorum": \[\],   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]   "quorum": \[  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]     0  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]   \],   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]   "rank": 0,   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]   "state": "leader",   
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \]   "sync\_provider": \[\]  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \] }  
\[ \[1mceph-mon1 \[0m\]\[ \[1;34mDEBUG \[0m \] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] monitor: mon.ceph-mon1 is running  
\[ \[1mceph-mon1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: ceph --admin-daemon /var/run/ceph/ceph-mon.ceph-mon1.asok mon\_status

- **This would generate (cluster\_name).mon.keyring and (cluster\_name).client.admin.keyring files in current directory**

\[root@ceph-mon1 ceph\]# ll  
total 28  
\-rw------- 1 root root    64 Oct 25 16:32 ceph.client.admin.keyring  
\-rw-r--r-- 1 root root   189 Oct 25 16:25 ceph.conf  
\-rw-r--r-- 1 root root 10937 Oct 25 16:32 ceph.log  
\-rw-r--r-- 1 root root    73 Oct 25 16:25 ceph.mon.keyring  
\-rwxr-xr-x 1 root root    92 Oct  4 14:39  rbdmap 

- **You can now check your cluster status , but you will see health Errors that will be resolved later by adding monitor and osd.**

\[root@ceph-mon1 ceph\]# ceph status  
  cluster 91ad085b-81ad-43db-9aa0-f3895a53613e  
   health HEALTH\_ERR 192 pgs stuck inactive; 192 pgs stuck unclean; no osds  
   monmap e1: 1 mons at {ceph-mon1=192.168.1.38:6789/0}, election epoch 2, quorum 0 ceph-mon1  
   osdmap e1: 0 osds: 0 up, 0 in  
    pgmap v2: 192 pgs: 192 creating; 0 bytes data, 0 KB used, 0 KB / 0 KB avail  
   mdsmap e1: 0/0/1 up  
 \[root@ceph-mon1 ceph\]# 

- **Gather keys Once you have gathered keys, your local directory should have the following keyrings:**
    - {cluster-name}.client.admin.keyring
    - {cluster-name}.bootstrap-osd.keyring
    - {cluster-name}.bootstrap-mds.keyring

 \[root@ceph-mon1 ceph\]# ceph-d e ploy gatherkeys ceph-mon1  
\[ \[1mceph\_deploy.cli \[0m\]\[ \[1;37mINFO \[0m  \] Invoked (1.2.7): /usr/bin/ceph-deploy gatherkeys ceph-mon1  
\[ \[1mceph\_deploy.gatherkeys \[0m\]\[ \[1;34mDEBUG \[0m \] Have ceph.client.admin.keyring  
\[ \[1mceph\_deploy.gatherkeys \[0m\]\[ \[1;34mDEBUG \[0m \] Have ceph.mon.keyring  
\[ \[1mceph\_deploy.gatherkeys \[0m\]\[ \[1;34mDEBUG \[0m \] Checking ceph-mon1 for /var/lib/ceph/bootstrap-osd/ceph.keyring  
\[ \[1mceph\_deploy.sudo\_pushy \[0m\]\[ \[1;34mDEBUG \[0m \] will use a local connection without sudo  
\[ \[1mceph\_deploy.gatherkeys \[0m\]\[ \[1;34mDEBUG \[0m \] Got ceph.bootstrap-osd.keyring key from ceph-mon1. 
\[ \[1mceph\_deploy.gatherkeys \[0m\]\[ \[1;34mDEBUG \[0m \] Checking ceph-mon1 for /var/lib/ceph/bootstrap-mds/ceph.keyring  
\[ \[1mceph\_deploy.sudo\_pushy \[0m\]\[ \[1;34mDEBUG \[0m \] will use a local connection without sudo  
\[ \[1mceph\_deploy.gatherkeys \[0m\]\[ \[1;34mDEBUG \[0m \] Got ceph.bootstrap-mds.keyring key from ceph-mon1. 
  
\[root@ceph-mon1 ceph\]# ll  
total 36  
\-rw-r--r-- 1 root root    72 Oct 25 16:33 ceph.bootstrap-mds.keyring  
\-rw-r--r-- 1 root root    72 Oct 25 16:33 ceph.bootstrap-osd.keyring  
\-rw------- 1 root root    64 Oct 25 16:32 ceph.client.admin.keyring  
\-rw-r--r-- 1 root root   189 Oct 25 16:25 ceph.conf  
\-rw-r--r-- 1 root root 11867 Oct 25 16:33 ceph.log  
\-rw-r--r-- 1 root root    73 Oct 25 16:25 ceph.mon.keyring  
\-rwxr-xr-x 1 root root    92 Oct  4 14:39  rbdmap   
\[root@ceph-mon1 ceph\]# 

- **Modify ceph configuration file /etc/ceph/ceph.conf , add the below entries**

\[global\]   
auth\_service\_required = cephx  
auth\_client\_required = cephx  
auth\_cluster\_required = cephx  
  
\[mon.ceph-mon1\]  
mon\_addr = 192.168.1.38:6789  
host = ceph-mon1  
  
\[osd\]  
filestore\_xattr\_use\_omap = true  
osd\_data = /var/lib/ceph/osd/$cluster-$id  
osd\_journal\_size = 1024  

- **Restart the ceph service on the server and check that your monitor is restarting well. Note : updating ceph.conf file does not require ceph service bounce back , we are here just testing if monitor services are OK**

\[root@ceph-mon1 ceph\]# service ceph restart  
\=== mon.ceph-mon1 ===   
\=== mon.ceph-mon1 ===   
Stopping Ceph mon.ceph-mon1 on ceph-mon1...kill 27965...done  
\=== mon.ceph-mon1 ===   
Starting Ceph mon.ceph-mon1 on ceph-mon1...  
Starting ceph-create-keys on ceph-mon1...  
\=== mon.ceph-mon1 ===   
\=== mon.ceph-mon1 ===   
Stopping Ceph mon.ceph-mon1 on ceph-mon1...kill 28439...done  
\=== mon.ceph-mon1 ===   
Starting Ceph mon.ceph-mon1 on ceph-mon1...  
Starting ceph-create-keys on ceph-mon1...  
\[root@ceph-mon1 ceph\]#   
\[root@ceph-mon1 ceph\]# service ceph status  
\=== mon.ceph-mon1 ===   
mon.ceph-mon1: running {"version":"0.67.4"}  
\=== mon.ceph-mon1 ===   
mon.ceph-mon1: running {"version":"0.67.4"}  
 \[root@ceph-mon1 ceph\]# 

### [](https://draft.blogger.com/blogger.g?blogID=6067449713794600812)Preparing OSD node ( ceph-node1 & ceph-node2 )[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "Preparing OSD node ( ceph-node1   ceph-node2 )")

- **Use ceph-deploy node ( ceph-mon1 ) to list available disk on ceph-node1 that will be used as OSD**

\[root@ceph-mon1 ceph\]# ceph-d e ploy disk list ceph-node1  
\[ \[1mceph\_deploy.cli \[0m\]\[ \[1;37mINFO \[0m  \] Invoked (1.2.7): /usr/bin/ceph-deploy disk list ceph-node1  
\[ \[1mceph\_deploy.sudo\_pushy \[0m\]\[ \[1;34mDEBUG \[0m \] will use a remote connection without sudo  
\[ \[1mceph\_deploy.lsb \[0m\]\[ \[1;33mWARNIN \[0m\] lsb\_release was not found - inferring OS details  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;37mINFO \[0m  \] Distro info: CentOS 6.4 Final  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;34mDEBUG \[0m \] Listing disks on ceph-node1...  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: ceph-disk list  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] /dev/vda :  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \]  /dev/vda1 swap, swap  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \]  /dev/vda2 other, ext4, mounted on /  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] /dev/vdb other, ext3  
\[root@ceph-mon1 ceph\]# 

- **To zap a disk (delete its partition table) in preparation for use with Ceph, execute the following . This will delete all data.**

\[root@ceph-mon1 ceph\]# ceph-deploy disk zap ceph-node1:vdb  
\[ \[1mceph\_deploy.cli \[0m\]\[ \[1;37mINFO \[0m  \] Invoked (1.2.7): /usr/bin/ceph-deploy disk zap ceph-node1:vdb  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;34mDEBUG \[0m \] zapping /dev/vdb on ceph-node1  
\[ \[1mceph-node1 \[0m\]\[ \[1;34mDEBUG \[0m \] detect platform information from remote host  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;37mINFO \[0m  \] Distro info: CentOS 6.4 Final  
\[ \[1mceph-node1 \[0m\]\[ \[1;34mDEBUG \[0m \] zeroing last few blocks of device  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: sgdisk --zap-all --clear --mbrtogpt -- /dev/vdb  
\[ \[1mceph-node1 \[0m\]\[ \[1;34mDEBUG \[0m \] Creating new GPT entries.  
\[ \[1mceph-node1 \[0m\]\[ \[1;34mDEBUG \[0m \] GPT data structures destroyed! You may now partition the disk using fdisk or  
\[ \[1mceph-node1 \[0m\]\[ \[1;34mDEBUG \[0m \] other utilities.  
\[ \[1mceph-node1 \[0m\]\[ \[1;34mDEBUG \[0m \] The operation has completed successfully.  
 \[root@ceph-mon1 ceph\]# 

- **Prepare the OSDs and deploy them to the OSD node**

\[root@ceph-mon1 ceph\]# ceph-deploy osd prepare ceph-node1:vdb  
\[ \[1mceph\_deploy.cli \[0m\]\[ \[1;37mINFO \[0m  \] Invoked (1.2.7): /usr/bin/ceph-deploy osd prepare ceph-node1:vdb  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;34mDEBUG \[0m \] Preparing cluster ceph disks ceph-node1:/dev/vdb:  
\[ \[1mceph\_deploy.sudo\_pushy \[0m\]\[ \[1;34mDEBUG \[0m \] will use a remote connection without sudo  
\[ \[1mceph\_deploy.lsb \[0m\]\[ \[1;33mWARNIN \[0m\] lsb\_release was not found - inferring OS details  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;37mINFO \[0m  \] Distro info: CentOS 6.4 Final  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;34mDEBUG \[0m \] Deploying osd to ceph-node1  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] write cluster configuration to /etc/ceph/{cluster}.conf  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] keyring file does not exist, creating one at: /var/lib/ceph/bootstrap-osd/ceph.keyring  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] create mon keyring file  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: udevadm trigger --subsystem-match=block --action=add  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;34mDEBUG \[0m \] Preparing host ceph-node1 disk /dev/vdb journal None activate False  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: ceph-disk-prepare --fs-type xfs --cluster ceph -- /dev/vdb  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] The operation has completed successfully.  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] The operation has completed successfully.  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] meta-data=/dev/vdb1              isize=2048   agcount=4, agsize=28770239 blks  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \]          =                       sectsz=512   attr=2, projid32bit=0  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] data     =                       bsize=4096   blocks=115080955, imaxpct=25  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \]          =                       sunit=0      swidth=0 blks  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] naming   =version 2              bsize=4096   ascii-ci=0  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] log      =internal log           bsize=4096   blocks=56191, version=2  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \]          =                       sectsz=512   sunit=0 blks, lazy-count=1  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] realtime =none                   extsz=4096   blocks=0, rtextents=0  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] The operation has completed successfully.  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] INFO:ceph-disk:Will colocate journal with data on /dev/vdb  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;34mDEBUG \[0m \] Host ceph-node1 is now ready for osd use.  
 \[root@ceph-mon1 ceph\]# 

- **Once you prepare an OSD you may activate it. The activate command will cause your OSD to come up and be placed in the cluster. The activate command uses the path to the partition created when running the prepare command.**

\[root@ceph-mon1 ceph\]# ceph-de ploy osd activate ceph-node1: vdb1  
\[ \[1mceph\_deploy.cli \[0m\]\[ \[1;37mINFO \[0m  \] Invoked (1.2.7): /usr/bin/ceph-deploy osd activate ceph-node1:vdb  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;34mDEBUG \[0m \] Activating cluster ceph disks ceph-node1:/dev/vdb:  
\[ \[1mceph\_deploy.sudo\_pushy \[0m\]\[ \[1;34mDEBUG \[0m \] will use a remote connection without sudo  
\[ \[1mceph\_deploy.lsb \[0m\]\[ \[1;33mWARNIN \[0m\] lsb\_release was not found - inferring OS details  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;37mINFO \[0m  \] Distro info: CentOS 6.4 Final  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;34mDEBUG \[0m \] activating host ceph-node1 disk /dev/vdb  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;34mDEBUG \[0m \] will use init type: sysvinit  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: ceph-disk-activate --mark-init sysvinit --mount /dev/vdb  

- **During this step if you encounter error like below , then start troubleshooting**

  

\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] 2013-10-25 20:46:47.433307 7f6adc1d9700  0 -- :/1010803 >> 192.168.1.38:6789/0 pipe(0x7f6acc003d40 sd=10 :0 s=1 pgs=0 cs=0 l=1 c=0x7f6acc003270).fault  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] 2013-10-25 20:46:50.433780 7f6ad43f9700  0 -- :/1010803 >> 192.168.1.38:6789/0 pipe(0x7f6acc00b860 sd=10 :0 s=1 pgs=0 cs=0 l=1 c=0x7f6acc005090).fault  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] 2013-10-25 20:46:53.378985 7f6add314700  0 monclient(hunting): authenticate timed out after 300  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] 2013-10-25 20:46:53.379057 7f6add314700  0 librados: client.bootstrap-osd authentication error (110) Connection timed out  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] Error connecting to cluster: Error  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] ERROR:ceph-disk:Failed to activate  
\[root@ceph-mon1 ceph\]# 

- On ceph-mon1 , cd /etc/ceph
- scp ceph.c lient.admin.keyring ceph-node1:/etc/ceph
- scp /var/lib/ceph/bootstrap-osd/ceph.keyring ceph-node1:/var/lib/ceph/bootstrap-osd
- check firewall between nodes
- Again try to activate your OSD , it should work

\[root@ceph-mon1 ceph\]# ceph-deploy osd prepare ceph-node1:/dev/vdb1  
\[ \[1mceph\_deploy.cli \[0m\]\[ \[1;37mINFO \[0m  \] Invoked (1.2.7): /usr/bin/ceph-deploy osd activate ceph-node1:/dev/vdb1  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;34mDEBUG \[0m \] Activating cluster ceph disks ceph-node1:/dev/vdb1:  
\[ \[1mceph\_deploy.sudo\_pushy \[0m\]\[ \[1;34mDEBUG \[0m \] will use a remote connection without sudo  
\[ \[1mceph\_deploy.lsb \[0m\]\[ \[1;33mWARNIN \[0m\] lsb\_release was not found - inferring OS details  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;37mINFO \[0m  \] Distro info: CentOS 6.4 Final  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;34mDEBUG \[0m \] activating host ceph-node1 disk /dev/vdb1  
\[ \[1mceph\_deploy.osd \[0m\]\[ \[1;34mDEBUG \[0m \] will use init type: sysvinit  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: ceph-disk-activate --mark-init sysvinit --mount /dev/vdb1  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] === osd.0 ===   
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] Starting Ceph osd.0 on ceph-node1...  
\[ \[1mceph-node1 \[0m\]\[ \[1;37mINFO \[0m  \] starting osd.0 at :/0 osd\_data /var/lib/ceph/osd/ceph-0 /var/lib/ceph/osd/ceph-0/journal  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] got latest monmap  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] 2013-10-25 21:50:53.768569 7fc6aff527a0 -1 journal FileJournal::\_open: disabling aio for non-block journal.  Use journal\_force\_aio to force use of aio anyway  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] 2013-10-25 21:50:54.268147 7fc6aff527a0 -1 journal FileJournal::\_open: disabling aio for non-block journal.  Use journal\_force\_aio to force use of aio anyway  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] 2013-10-25 21:50:54.269488 7fc6aff527a0 -1 filestore(/var/lib/ceph/tmp/mnt.DBPdBc) could not find 23c2fcde/osd\_superblock/0//-1 in index: (2) No such file or directory  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] 2013-10-25 21:50:54.611784 7fc6aff527a0 -1 created object store /var/lib/ceph/tmp/mnt.DBPdBc journal /var/lib/ceph/tmp/mnt.DBPdBc/journal for osd.0 fsid 0ff473d9-0670-42a3-89ff-81bbfb2e676a  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] 2013-10-25 21:50:54.611876 7fc6aff527a0 -1 auth: error reading file: /var/lib/ceph/tmp/mnt.DBPdBc/keyring: can't open /var/lib/ceph/tmp/mnt.DBPdBc/keyring: (2) No such file or directory  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] 2013-10-25 21:50:54.612049 7fc6aff527a0 -1 created new key in keyring /var/lib/ceph/tmp/mnt.DBPdBc/keyring  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] added key for osd.0  
\[ \[1mceph-node1 \[0m\]\[ \[1;31mERROR \[0m \] create-or-move updating item name 'osd.0' weight 0.43 at location {host=ceph-node1,root=default} to crush map  
 \[root@ceph-mon1 ceph\]#   
\[root@ceph-mon1 ceph\]# ceph status  
  cluster 0ff473d9-0670-42a3-89ff-81bbfb2e676a  
   health HEALTH\_WARN 192 pgs degraded; 192 pgs stuck unclean  
   monmap e1: 1 mons at {ceph-mon1=192.168.1.38:6789/0}, election epoch 2, quorum 0 ceph-mon1  
   osdmap e5: 1 osds: 1 up, 1 in  
    pgmap v8: 192 pgs: 192 active+degraded; 0 bytes data, 1057 MB used, 438 GB / 439 GB avail  
   mdsmap e1: 0/0/1 up  
 \[root@ceph-mon1 ceph\]# 

  

- **Similarly add 3 more OSD on ceph-node1 , after successful addition of OSD your ceph status will look like**

\[root@ceph-mon1 ceph\]#  ceph status  
  cluster 0ff473d9-0670-42a3-89ff-81bbfb2e676a  
   health HEALTH\_WARN 192 pgs stuck unclean  
   monmap e1: 1 mons at {ceph-mon1=192.168.1.38:6789/0}, election epoch 1, quorum 0 ceph-mon1  
   osdmap e63: 4 osds: 4 up, 4 in  
    pgmap v112: 192 pgs: 192 active+remapped; 0 bytes data, 2188 MB used, 1755 GB / 1757 GB avail  
   mdsmap e1: 0/0/1 up  
 \[root@ceph-mon1 ceph\]# 

- **Once you have added 4 OSD on ceph-node1 , repeat these steps and add 4 OSD on ceph-node2 , before OSD make you install ceph packages on ceph-node2**
- After these steps you cluster should have 8 OSD running and cluster health must be OK , PGmap=ACTIVE+CLEAN

\[root@ceph-mon1 ceph\]# ceph status  
  cluster 0ff473d9-0670-42a3-89ff-81bbfb2e676a  
   health HEALTH\_OK  
   monmap e1: 1 mons at {ceph-mon1=192.168.1.38:6789/0}, election epoch 1, quorum 0 ceph-mon1  
   osdmap e87: 8 osds: 8 up, 8 in  
    pgmap v224: 192 pgs: 192 active+clean; 0 bytes data, 2363 MB used, 3509 GB / 3512 GB avail  
   mdsmap e1: 0/0/1 up  
\[root@ceph-mon1 ceph\]# 

### [](https://draft.blogger.com/blogger.g?blogID=6067449713794600812)Scaling the cluster by adding monitors ( ceph-mon2 & ceph-mon3 )[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "Scaling the cluster by adding monitors ( ceph-mon2   ceph-mon3 )")

- **Create monitors on the ceph-mon2 and ceph-mon3 , before creating monitors make sure you install ceph packages on ceph-mon2 & ceph-mon3**

\[root@ceph-mon1 ceph\]# ceph-deploy mon create ceph-mon2                          
\[ \[1mceph\_deploy.cli \[0m\]\[ \[1;37mINFO \[0m  \] Invoked (1.2.7): /usr/bin/ceph-deploy mon create ceph-mon2  
\[ \[1mceph\_deploy.mon \[0m\]\[ \[1;34mDEBUG \[0m \] Deploying mon, cluster ceph hosts ceph-mon2  
\[ \[1mceph\_deploy.mon \[0m\]\[ \[1;34mDEBUG \[0m \] detecting platform for host ceph-mon2 ...  
\[ \[1mceph\_deploy.sudo\_pushy \[0m\]\[ \[1;34mDEBUG \[0m \] will use a remote connection without sudo  
\[ \[1mceph\_deploy.lsb \[0m\]\[ \[1;33mWARNIN \[0m\] lsb\_release was not found - inferring OS details  
\[ \[1mceph\_deploy.mon \[0m\]\[ \[1;37mINFO \[0m  \] distro info: CentOS 6.4 Final  
\[ \[1mceph-mon2 \[0m\]\[ \[1;34mDEBUG \[0m \] determining if provided host has same hostname in remote  
\[ \[1mceph-mon2 \[0m\]\[ \[1;34mDEBUG \[0m \] deploying mon to ceph-mon2  
\[ \[1mceph-mon2 \[0m\]\[ \[1;34mDEBUG \[0m \] remote hostname: ceph-mon2  
\[ \[1mceph-mon2 \[0m\]\[ \[1;37mINFO \[0m  \] write cluster configuration to /etc/ceph/{cluster}.conf  
\[ \[1mceph-mon2 \[0m\]\[ \[1;34mDEBUG \[0m \] checking for done path: /var/lib/ceph/mon/ceph-ceph-mon2/done  
\[ \[1mceph-mon2 \[0m\]\[ \[1;37mINFO \[0m  \] create a done file to avoid re-doing the mon deployment  
\[ \[1mceph-mon2 \[0m\]\[ \[1;37mINFO \[0m  \] create the init path if it does not exist  
\[ \[1mceph-mon2 \[0m\]\[ \[1;37mINFO \[0m  \] locating \`service\` executable...  
\[ \[1mceph-mon2 \[0m\]\[ \[1;37mINFO \[0m  \] found \`service\` executable: /sbin/service  
\[ \[1mceph-mon2 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: /sbin/service ceph -c /etc/ceph/ceph.conf start mon.ceph-mon2  
\[ \[1mceph-mon2 \[0m\]\[ \[1;34mDEBUG \[0m \] === mon.ceph-mon2 ===   
\[ \[1mceph-mon2 \[0m\]\[ \[1;34mDEBUG \[0m \] Starting Ceph mon.ceph-mon2 on ceph-mon2...  
\[ \[1mceph-mon2 \[0m\]\[ \[1;34mDEBUG \[0m \] failed: 'ulimit -n 32768;  /usr/bin/ceph-mon -i ceph-mon2 --pid-file /var/run/ceph/mon.ceph-mon2.pid -c /etc/ceph/ceph.conf '  
\[ \[1mceph-mon2 \[0m\]\[ \[1;34mDEBUG \[0m \] Starting ceph-create-keys on ceph-mon2...  
\[ \[1mceph-mon2 \[0m\]\[ \[1;33mWARNIN \[0m\] No data was received after 7 seconds, disconnecting...  
\[ \[1mceph-mon2 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: ceph --admin-daemon /var/run/ceph/ceph-mon.ceph-mon2.asok mon\_status  
\[ \[1mceph-mon2 \[0m\]\[ \[1;31mERROR \[0m \] admin\_socket: exception getting command descriptions: \[Errno 2\] No such file or directory  
\[ \[1mceph-mon2 \[0m\]\[ \[1;33mWARNIN \[0m\] monitor: mon.ceph-mon2, might not be running yet  
\[ \[1mceph-mon2 \[0m\]\[ \[1;37mINFO \[0m  \] Running command: ceph --admin-daemon /var/run/ceph/ceph-mon.ceph-mon2.asok mon\_status  
\[ \[1mceph-mon2 \[0m\]\[ \[1;31mERROR \[0m \] admin\_socket: exception getting command descriptions: \[Errno 2\] No such file or directory  
\[ \[1mceph-mon2 \[0m\]\[ \[1;33mWARNIN \[0m\] ceph-mon2 is not defined in \`mon initial members\`  
\[ \[1mceph-mon2 \[0m\]\[ \[1;33mWARNIN \[0m\] monitor ceph-mon2 does not exist in monmap  
\[ \[1mceph-mon2 \[0m\]\[ \[1;33mWARNIN \[0m\] neither \`public\_addr\` nor \`public\_network\` keys are defined for monitors  
\[ \[1mceph-mon2 \[0m\]\[ \[1;33mWARNIN \[0m\] monitors may not be able to form quorum  
\[root@ceph-mon1 ceph\]# 

- You might encounter some warnings or errors that need to be fixed
- check monitor logs from ceph-mon1 , /var/lib/ceph directory
- You might need to manually add monitor in cluster

\#### Manually login on monitor node and execute commands like below   
ceph mon add ceph-mon2 192.168.1.33:6789  
ceph-mon -i ceph-mon2 --public-addr 192.168.1.33:6789  
service ceph status  
service ceph restart  
ps -ef | grep ceph  

- In case ceph service is not showing as running in service ceph status command , however ps -ef | grep ceph , shows monitor running , kill the process manually and restart ceph services , monitor now should start working

\# service ceph status  
\# ps -ef | grep ceph  
\# kill -9 6554  
  
\### Finally you would see your ceph cluster is healthy with all the OSD and monitors UP and Running  
  
\[root@ceph-mon1 ~\]# ceph status  
  cluster 0ff473d9-0670-42a3-89ff-81bbfb2e676a  
   health HEALTH\_OK  
   monmap e3: 3 mons at {ceph-mon1=192.168.1.38:6789/0,ceph-mon2=192.168.1.33:6789/0,ceph-mon3=192.168.1.31:6789/0}, election epoch 10, quorum 0,1,2 ceph-mon1,ceph-mon2,ceph-mon3  
   osdmap e97: 8 osds: 8 up, 8 in  
    pgmap v246: 192 pgs: 192 active+clean; 0 bytes data, 2352 MB used, 3509 GB / 3512 GB avail  
   mdsmap e1: 0/0/1 up  
\[root@ceph-mon1 ~\]#  
  

  

#### Please Follow [Ceph Installation :: Part-3](http://karan-mj.blogspot.fi/2013/12/ceph-installation-part-3.html) for next step in installation

  

  

![](http://feeds.feedburner.com/~r/CephStorageNextBigThing/~4/AlBBkb1xJ2Q)
