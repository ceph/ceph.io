---
title: "Erasure Coding in Ceph"
date: "2014-04-08"
author: "syndicated"
tags: 
  - "ceph"
---

##   

## Erasure Coding : All you have to know 

  

  
  

[![](images/Erasure-code.png)](http://karan-mj.blogspot.fi/2014/04/erasure-coding-in-ceph.html)

  
  
If there is data , there would be failure and there will also be administrators like us to recover this data and Erasure Coding is our shield.  
  

Storage systems have technologies for data protection and recovery in event of failure. There are two three main methods of data protection :-

  

1) Replication

2) RAID 

Hey wait a minute , here comes the _LEGEN_ ( wait for it ... ) _DARY : Legendary_ number 3

  
3) Erasure Coding

  

First of all Erasure Coding is not now , it was born before RAID and Replication methods but it was not in practical use. Raid is now in its concluding years. Raid method of data protection was built years and years back when it was difficult to find a HDD with capacity of 1 GB . In the period of last 30 years drive capacity has been increased 4000 folds. With this appreciation drive consistency and durability is still a problem. Raid was not supposed to give you data protection for a exabyte level storage array , its simply not designed for Future. We need a data protection method which is highly adaptive and ready for future needs. Back to basics Erasure Codes is the answer.

  

Erasure coding (EC) is a method of data protection in which data is broken into fragments , encoded and then storage in a distributed manner. Ceph , due to its distributed nature , makes use of EC beautifully.

  

Erasure coding makes use of a mathematical equation to achieve data protection. The entire concept revolves around the following equation.

_**n = k + m**  where ,_ 

_**k**  =  The number of chunks original data divided into._

_**m** \=  The extra codes added to original data chunks to provide data protection. For ease of understanding you can considered it as reliability level._

_**n**  =  The total number of chunks created after erasure coding process._

  

In continuation to erasure coding equation , there are couple of more terms which are :- 

  

_**Recovery :** To perform recovery operation we would require any **k** chunks out of **n** chunks and thus can tolerate failure of any **m** chunks_

_Reliability_ _**Level :** We can tolerate failure upto any **m** chunks._

_**Encoding Rate (r) : r = k / n , where r < 1**_  
_**Storage Required : 1 / r**_

  

  

## Example 1 : (3,5) Erasure Code for any data file would look like

## n = 5 , k = 3 and m = 2  ( m = n - k )

## Erasure coding equation  5 = 3 + 2 

So  2  coded chunks will be added to 3 data chunks to form 5 total chunks that will be stored distributedly in ceph cluster. In an event of failure , to construct the original file , we need any 3 chunks out of these 5 chunks to recover it. Hence in this example we can manage loss of any 2 chunks.

  

Encoding rate (r) = 3 / 5 = 0.6 < 1  
Storage Required = 1 / 0.6 = 1.6 times of original file.  
  
If the original file size is 1GB then to store this file in a ceph cluster erasure coded (3,5) pool , you would need 1.6GB of storage space.  
  
  

## Example 2 : (10,6) Erasure Code for any data file would look like

## n = 16 , k = 10 , m = 6 

Encoding rate (r) = 10 / 16 = 0.6 < 1

Storage Required = 1 / 0.6 = 1.6 times of original file.

  

This erasure code can sustain failure of any 6 chunks out of 16 chunks , in an event of failure for recovery we would need any 10 chunks out of 16 chunks.

  
  

## Erasure Codes Step - by - Step

  

## Step 1 : Understanding EC profile

  

When you look at EC profile , you would come across few options that defines EC pattern for that profile.  
  
**k**   ===> As explained earlier , its the number of chunks data will be divided into and each chunk will     be stored on a separate OSD. The equivalent command line parameter for this is   
**erasure-code-k=<Number\_of\_data\_chunks>**  
Default value = 2  
  
**m**  ===> The number of extra codes (chunks) added to data chunks to provide reliability. This is also   the number of OSD that can go down without losing data. Also know as reliability level. The equivalent command line parameter for this is   
**erasure-code-m=<Number\_of\_coding\_chunks>**  
Default value = 1  
  
**plugin**  ===> This is the library facilitation erasure coding in Ceph. The plugin is used to compute the  coding chunks and recover missing chunks. The current implementation uses _jerasure_ but the upcoming version might use _GF-complete_ as its twice as faster as  _jerasure._The equivalent command line parameter for this is   
**erasure-code-plugin=<plugin\_name>**  
Default value = 1  
  
**directory** \===> The directory name from where EC plugin library will loaded from. In most of the cases this parameter is automatically added once you define plugin name .The equivalent command line parameter for this is   
**erasure-code-directory=<directory\_path>**  
Default value = /usr/lib64/ceph/erasure-code  
**ruleset-failure-domain** \===> Defines the failure domain , you should set it as OSD to get better reliability for your data.  
Default value = host  
  
  
  

## Step 2 : Generating a EC profile

  

\# ceph osd erasure-code-profile set EC-temp-pool

\# ceph osd erasure-code-profile ls  
EC-temp-pool  
profile1  
#

\# ceph osd erasure-code-profile get EC-temp-pool  
directory=/usr/lib64/ceph/erasure-code  
k=2  
m=1  
plugin=jerasure  
technique=reed\_sol\_van  
#

  

## Step 3 : Customizing your EC profile

  

We can use sub command set , to change existing profile , however we might need to user --force to change a profile. This can be a dangerous.

  

In this example we will change value of k=4

  

  

\# ceph osd erasure-code-profile set EC-temp-pool ruleset-failure-domain=osd k=4 m=2  
Error EPERM: will not override erasure code profile EC-temp-pool

\# ceph osd erasure-code-profile set EC-temp-pool ruleset-failure-domain=osd k=4 m=2 --force

\# ceph osd erasure-code-profile get EC-temp-pool  
directory=/usr/lib64/ceph/erasure-code  
k=4  
m=2  
plugin=jerasure  
ruleset-failure-domain=osd  
technique=reed\_sol\_van  
#

  
Similarly you can change other parameter based on your needs.  
  
  

## Step 4 : Creating a EC Ceph Pool based on your profile

  

_Ceph osd pool create <Pool\_name> <pg\_num> <pgp\_num> erasure <EC\_profile\_name>_  
  
  

\# ceph osd pool create ECtemppool 128 128 erasure EC-temp-pool  
pool 'ECtemppool' created  
#

\# rados lspools  
data  
metadata  
rbd  
ECtemppool  
#

\# ceph osd dump | grep -i erasure  
pool 22 'ECtemppool' erasure size 6 min\_size 2 crush\_ruleset 1 object\_hash rjenkins pg\_num 128 pgp\_num 128 last\_change 2034 owner 0 flags hashpspool stripe\_width 4096  
#

  
  
Step 5 : Writing your EC pool  
  

- Create a temporary file

  

\# echo "Erasure Coding is \*\*\*\*\*\*\* Awesome" > testfile  
#  
\# cat testfile  
Erasure Coding is \*\*\*\*\*\*\* Awesome  
#

- List your pool for objects , since you have created a new pool , there would be no objects inside it. Put the test file to your EC pool.

\# rados -p ECtemppool ls  
#  
\# rados -p ECtemppool put object.1 testfile  
#  
\# rados -p ECtemppool ls  
object.1  
#

- Check PG map for your pool , you would get to know on how many OSD this _object.1_ has been placed.
- If you analyze carefully , you can find that the object.1 has been placed in 6 different OSD , this is due to our erasure code profile where we have mentioned k=4 and m=2 , so total chunks are 6 which will be placed on all different OSD

\# ceph osd map ECtemppool object.1  
osdmap e2067 pool 'ECtemppool' (22) object 'object.1' -> pg 22.f560f2ec (22.2ec) -> up (\[144,39,55,15,123,65\], p144) acting (\[144,39,55,15,123,65\], p144)  
#

  
Now you are a reliable erasure coded pool that can sustain failure of  two OSD simultaneously.  
  
  

## Erasure Codes are 100% Authentic :-

  

Upto this point you have a erasure coded pool (4,2) , meaning it can sustain simultaneously 2 OSD failure.  
  
From the above output these are the 6 OSD on which the file "testfile" has been spread = \[144,39,55,15,123,65\]  
  
  
Test 1 : Intentionally Breaking OSD to test EC reliability  
  

- Breaking 1st OSD ( osd.65 )

  

\# service ceph status osd.65  
\=== osd.65 ===  
osd.65: running {"version":"0.79-125-gcf69bdb"}  
#  
#  
\# service ceph stop osd.65  
\=== osd.65 ===  
Stopping Ceph osd.65 on storage0106-ib...kill 3505...done  
#  
\# service ceph status osd.65  
\=== osd.65 ===  
osd.65: not running.  
#

  

- Since osd.65 is down , it would be missing from following output , rather you would find some garbage entry " 2147483647 "

  

\# ceph osd map ECtemppool object.1  
osdmap e2069 pool 'ECtemppool' (22) object 'object.1' -> pg 22.f560f2ec (22.2ec) -> up (\[144,39,55,15,123,2147483647\], p144) acting (\[144,39,55,15,123,2147483647\], p144)  
#

- Breaking 2nd OSD ( osd.123 )

#  
\# service ceph status osd.123  
\=== osd.123 ===  
osd.123: running {"version":"0.79-125-gcf69bdb"}  
#  
\# service ceph stop  osd.123  
\=== osd.123 ===  
Stopping Ceph osd.123 on storage0114-ib...kill 5327...done  
#  
\# service ceph status  osd.123  
\=== osd.123 ===  
osd.123: not running.  
#

- Now the second osd.123 is down , it would be missing from following output , like osd.65 but here comes the **MAGIC**
- **Erasure codings are intelligent , it know when you lose data or coding chunks of a file. As soon as chunks are lost , it immediately create exactly same on to new OSD. In this example you can see , OSD.65 and OSD.123 went down , so ceph intelligently recovers the failed chunk on to OSD.85 ( which is a new OSD )**

\# ceph osd map ECtemppool object.1  
osdmap e2104 pool 'ECtemppool' (22) object 'object.1' -> pg 22.f560f2ec (22.2ec) -> up (\[144,39,55,15,2147483647,85\], p144) acting (\[144,39,55,15,2147483647,85\], p144)  
#

  
  

## Summary :

Erasure coding is a beautiful piece of reliable solution and works amazingly well, it intelligently manages the failed chunks and tries to recover them wherever possible without any administrative intervention. This makes ceph MORE and MORE reliable , amazingly cost effective. EC feature in ceph has been recently added starting 0.78 release , we can definitely expect more stable and performance centric version of EC in Ceph Firefly 0.80. Stay tuned.  
  

![](http://feeds.feedburner.com/~r/CephStorageNextBigThing/~4/1FgoFibAMmo)
