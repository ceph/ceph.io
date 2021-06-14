---
title: "First China Ceph Day – Beijing Ceph Day"
date: "2015-07-03"
author: "zhang.jian"
---

Ceph is becoming more and more popular in China. Intel and Redhat jointly held the Beijing Ceph Day in Intel RYC office on June 6th, 2015. It attracted ~200 developers, end users from 120+ companies. Ten technical sessions were delivered to share Ceph’s transformative power during the event, it also focused on current problems of Ceph and how can we grow the Ceph ecosystem in China.

**Keynote Speech**

Ziya Ma, General Manager of Intel Bigdata technology team (BDT) introduced Intel’s investments on Ceph. She started from the data bigbang to point out that the data needs are growing at a rate unsustainable with today’s infrastructure and labor costs, and thus we need a fundamental transformation in storage infrastructure to resolve the new challenges. As the most popular Openstack block backend, Ceph attracted more and more interests – e.g., Fujitsu delivered Ceph based storage products CD10K. Intel BDT’s investments on Ceph includes: Ceph performance analysis and tuning on different platforms, key features like Cache tiering, Erasure coding and Newstore development and optimization, toolkit development – COSBench, VSM and CeTune, and promoting Ceph based scale out storage solutions with China local customers. She announced the found of China Ceph user group, Chinese maillist, and the next Ceph Day to be held in Shanghai in October.

Ceph Community director Patrick McGarry from Redhat introduced the Ceph community updates and recent development status. He emphasized that Ceph community’s focus hasn’t change after Redhat’s acquisition of Inktank, and Ceph will provide better support for RHEL/Fedora/Centos. He encouraged developers to attend the first Ceph hackathon to be held in Hillsboro in August, which will focus on performance, RBD and RGW. In the development part, he introduced the CephFS improvements in Hammer release – 366 commits to MDS module, 20K lines of code changes, and we can expect that CephFS would be production ready next release.

**Ceph Development**

**NewStore**: Xiaoxi Chen from Intel introduced the design and implementation of NewStore, which is a new storage backend for Ceph target at the next Release. By de-couple the mapping from object name to actual storage path, NewStore is able to manage the data flexibly. Compared to FileStore, NewStore could saving the journal write for create, append and overwrite operations without losing the atomicity and consistency. This feature is not only helping improve performance but also cutting down the TCO for customer.  The initial performance data shared in the talk looks quite promising. Attendees are very interested with Newstore and looking forward trying it when it is ready.

**Cache Tiering Optimization:** Community active code contributor, Doctor Li Wang from Ubuntukylin introduced their Ceph optimization work on Tianhe-2 supercomputer platform, including CephFS inline data, RDB image offline recovery and Cache tiering optimization. Cache tiering is an important feature since Emperor, it is designed to improve the Ceph cluster’s performance by leveraging a small set of fast devices as cache. However, current evict algorithm is based on the latest access time, which is not very efficient in some scenario. Doctor Wang proposed a temperature based cache management algorithm that evicts objects based on its access time and frequency.  The user survey of Beijing Ceph Day showed Cache tiering was one of the two most interested and would like to try features (the other is Erasure coding), and it still needs more optimization for cache tiering to be production ready.

**Ceph-dokan Windows client:** Currently Ceph doesn’t has drivers that can be directly used for windows. Zhisheng Meng from Ucloud introduced Ceph-Dokan, which implements a Win32 FS API compatible windows client with the help of Cygwin and MinGw. The next step work is to support CephX, provide librados and librbd dll and get it merged to Ceph master.

**Ecosystem**

**Ceph and Containers:** Container technology is widely adopted in cloud computing environments. Independent opensource contributor Haomai Wang introduced Ceph and container integration work. He compared the pros and cons of VM+RBD and Container+RBD usage model. The latter mode has better performance in general, but needs more improvement on security. In kubernetes, different containers composed a POD and leverage file as storage, so it looks it is more suitable to use filesystem instead of RBD as containers backend. He also introduced CephFS latest improvements, CephFS deployment and development progress with Nova, Kubernetes integration.

**Ceph toolkit:** As the only female speaker, Chendi Xue from Intel presented a new ceph profiling and tuning tool called CeTune. It is designed to help system engineers to deploy and benchmark the Ceph cluster in a fast and easy way. CeTune is designed to benchmark Ceph RBD, Object and CephFS interface with fio and Cosbench and other pluggable workloads. It not only monitors system metrics like CPU utilization, memory usage, I/O statistics but also Ceph performance metrics like Ceph perf counter and LTTNG trace data. CeTune analyzes these data offline to reveal system and software stack bottlenecks. It also provides web based visualization of all the processed data to make analysis and tuning more easily.

**Ceph and Bigdata:** As the rising of IAAS, cloud storage is becoming more and more popular. However this introduced a new problem for big data analytics framework, like Map Reduce, which usually stores the data in specific distribute file system. This would require lots of data movement from IAAS storage to HDFS. Yuan Zhou from Intel introduced how to run Hadoop over Ceph RGW. He introduced the detail design of Hadoop over Ceph Object Storage, following the way of OpenStack Sahara doing on Swift with a new RGWFS driver and RGW proxy component. Some early benchmarking data with various solutions and different deployments were shared, including VM vs. container vs. bare-metal, HDFS vs. Swift.

**User Experience Sharing**

**Ceph and Openstack integration experience sharing:** Dexin Wu and Yuting Wu from awcloud shared their experiences on Ceph and Openstack integration. One key takeaway is although Hammer release brought significant performance improvement, it is still not able to fully utilize the capability of SSD devices. Besides, we still need more features like cluster level QoS, multi-geo disaster recovery. They shared one performance tuning example on how to improve the throughput of a 100 OSDs cluster from 2000 to 9000 IOPS through tuning Ceph parameters and redeployment.

**One Ceph, two ways of thinking:** Xiaoyi Zhang from Perfect world (Top internet gaming vendor in China) shared their feedbacks on Ceph as an end user and provided some optimization proposals. From perfect world’s point of view, Ceph has many advantage features like highly available, high reliability and highly durable, almost unlimited expend on capacity. He shared how they solved several problems to improve the recovery performance with tuning read\_ahead\_kb on the hard driver, how to reconfigure the ceph.conf and leverage B-cache to improve Ceph cluster stability and performance; and how to deploy multiple directory on a single PCI-E SSD as dedicated OSD storage spaces to improve Ceph all SSD performance.

**Ceph based products**

Hao Zhou from Sandisk introduced Ceph based all flash production – InfinishFlash and related optimization. InfiniFlash provided up to 512TB space in 3U chassis, with up to 780K IOPS and 7GB/s bandwidth. He introduced optimization efforts like the thread pool sharding, lock sequence and granularity optimization.

**Panel Discussion**

As the last session of Beijing Ceph Day, the panel discussion covered two topics: What do you think is current problem of Ceph and how can we accelerate the development of Ceph in China. Most concerns are about performance, management, documentation and localization. People provided many suggestions on how to grow the Ceph ecosystem in China, e.g., that the community need more contributions and sharing from users, developers, and partners. Developers can benefit from the real usage scenario or issues met from end users to make Ceph more stable and mature, while end user can become more familiar with Ceph through the engagement.

**Technical Slides**

All the slides can be downloaded from [http://www.slideshare.net/inktank\_ceph](http://www.slideshare.net/inktank_ceph) .

**Onsite pictures**

Registration

[![Beijing Ceph Day Registeration](images/1-300x199.jpg)](http://ceph.com/wp-content/uploads/2015/07/1.jpg)

Agenda

[![Beijing Ceph Day Agenda](images/2-e1435925591860-146x220.jpg)](http://ceph.com/wp-content/uploads/2015/07/2-e1435925591860.jpg)

Keynote Speech

[![Keynotes](images/3-300x199.jpg)](http://ceph.com/wp-content/uploads/2015/07/3.jpg)

Audience

[![Audience](images/4-300x199.jpg)](http://ceph.com/wp-content/uploads/2015/07/4.jpg)

 

**Media Coverage**

The Beijing Ceph Day was a great success, here are some media coverage reports:

[**http://www.csdn.net/article/2015-06-08/2824891**](http://www.csdn.net/article/2015-06-08/2824891)

[**http://code.csdn.net/news/2825020**](http://code.csdn.net/news/2825020)

[**http://www.csdn.net/article/2015-07-03/2825121**](http://www.csdn.net/article/2015-07-03/2825121)

**Beijing Ceph Day User Survey Results**

We run a Ceph survey during Beijing Ceph day. Our initial purpose is to get a general understanding of the Ceph deployment status in China and collect feedbacks & suggestions for our next step development and optimization work. We designed a 16 question questionnaire, including three open questions. We received 110 valid respondents during the event.  We would like to share with you the survey results.

Summary:

1. **Attendee Role**: Most customer are private cloud providers, followed by public cloud service providers.
2. **Cloud OS**: Openstack is still the dominate Cloud OS (59%).
3. **Other storage deployed**: 26% used commercial storage, HDFS is also very popular.
4. **Ceph deployment phase**: Most deployment phase is still very early, 46% of the Ceph deployment is still under QA and testing, while 30% already in production.
5. **Ceph cluster scale**: Most of the cluster scale is 10-50 nodes.
6. **Ceph interface used**: RBD is mostly used (50%), followed by object storage (23%), CephFS (16%), 6% used Native rados API.
7. **Ceph version**: The most popular Ceph version is Hammer (31%).
8. **Replication model**: 3x replica is most commonly used (49%).
9. **Next** **Features interested or would like to try**: Cache tiering (26%) and erasure coding (19%) is very attractive to customers. Followed by Full SSD optimization.
10. **Performance metrics most cared**: Stability is still No.1 concern (30%).
11. **Deployment tools**: Most people use Ceph-deploy (50%).
12. **Monitoring and Management**: 35% using calamari for monitoring and management while 33% used nothing.
13. **The Top three issues for Ceph**: (1) Performance, (2) Complexity, and (3) too many immature features.
14. **Suggestion to Ceph's development and optimization Open question:** (1) Documentation (2) Stability
15. **Major reason to choose Ceph:** (1) Unified Storage, (2) Acceptable Performance, (3) active community
16. **QoS requirement:** Diverse requirements.

[![image001](images/image001-300x180.png)](http://ceph.com/wp-content/uploads/2015/07/image001.png)

[![image002](images/image002-300x180.png)](http://ceph.com/wp-content/uploads/2015/07/image002.png)

[![image003](images/image003-300x180.png)](http://ceph.com/wp-content/uploads/2015/07/image003.png)

[![image004](images/image004-300x180.png)](http://ceph.com/wp-content/uploads/2015/07/image004.png)

[![image006](images/image006-300x180.png)](http://ceph.com/wp-content/uploads/2015/07/image006.png)

[![image005](images/image005-300x180.png)](http://ceph.com/wp-content/uploads/2015/07/image005.png)

[![image007](images/image007-300x167.png)](http://ceph.com/wp-content/uploads/2015/07/image007.png)

[![image008](images/image008-300x167.png)](http://ceph.com/wp-content/uploads/2015/07/image008.png)

[![image009](images/image009-300x167.png)](http://ceph.com/wp-content/uploads/2015/07/image009.png)

[![image010](images/image010-300x220.png)](http://ceph.com/wp-content/uploads/2015/07/image010.png)

[![image011](images/image011-300x220.png)](http://ceph.com/wp-content/uploads/2015/07/image011.png)

[![image012](images/image012-300x220.png)](http://ceph.com/wp-content/uploads/2015/07/image012.png)

[![image013](images/image013-300x180.png)](http://ceph.com/wp-content/uploads/2015/07/image013.png)

[![Q14](images/Q14-300x181.jpg)](http://ceph.com/wp-content/uploads/2015/07/Q14.jpg)

[![Q15](images/Q15-300x181.jpg)](http://ceph.com/wp-content/uploads/2015/07/Q15.jpg)

Q16: What's your QoS requirement in your environment?

[![Q16](images/Q16-300x40.jpg)](http://ceph.com/wp-content/uploads/2015/07/Q16.jpg)
