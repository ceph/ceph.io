---
title: "利用s3-test进行ceph的接口兼容性测试"
date: "2018-06-27"
author: "admin"
tags: 
  - "planet"
---

  
![s3](images/s3.jpg)  

## 前言

ceph的rgw能够提供一个兼容性的s3的接口，既然是兼容性，当然不可能是所有接口都会兼容，那么我们需要有一个工具来进行接口的验证以及测试，这个在其他测试工具里面有类似的posix接口验证工具，这类的工具就是跑测试用例，来输出通过或者不通过的列表

用此类的工具有个好的地方就是，能够对接口进行验证，来避免版本的更新带来的接口破坏  

## 安装

直接对官方的分支进行clone下来，总文件数不多，下载很快  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 s3]<span class="comment"># git clone https://github.com/ceph/s3-tests.git</span></span><br><span class="line">[root@lab101 s3]<span class="comment"># cd s3-tests/</span></span><br></pre></td></tr></tbody></table>

这个地方注意下有版本之分，测试的时候需要用对应版本，这里我们测试的jewel版本就切换到jewel的分支(关键步骤)

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 s3-tests]<span class="comment"># git branch -a</span></span><br><span class="line">[root@lab101 s3-tests]<span class="comment"># git checkout -b jewel remotes/origin/ceph-jewel</span></span><br><span class="line">[root@lab101 s3-tests]<span class="comment"># ./bootstrap</span></span><br></pre></td></tr></tbody></table>

进入到目录当中执行 ./bootstrap进行初始化相关的工作，这个是下载一些相关的库和软件包，并且创建了一个python的虚拟环境，如果从其他地方拷贝过来的代码最好是删除掉python虚拟环境，让程序自己去重新创建一套环境

执行完了以后就是创建测试配置文件test.conf

<table><tbody><tr><td class="code"><pre><span class="line">[DEFAULT]</span><br><span class="line"><span class="comment">## this section is just used as default for all the "s3 *"</span></span><br><span class="line"><span class="comment">## sections, you can place these variables also directly there</span></span><br><span class="line"></span><br><span class="line"><span class="comment">## replace with e.g. "localhost" to run against local software</span></span><br><span class="line"><span class="variable">host =</span> <span class="number">192.168</span>.<span class="number">19.101</span></span><br><span class="line"></span><br><span class="line"><span class="comment">## uncomment the port to use something other than 80</span></span><br><span class="line"><span class="variable">port =</span> <span class="number">7481</span></span><br><span class="line"></span><br><span class="line"><span class="comment">## say "no" to disable TLS</span></span><br><span class="line"><span class="variable">is_secure =</span> no</span><br><span class="line"></span><br><span class="line">[fixtures]</span><br><span class="line"><span class="comment">## all the buckets created will start with this prefix;</span></span><br><span class="line"><span class="comment">## {random} will be filled with random characters to pad</span></span><br><span class="line"><span class="comment">## the prefix to 30 characters long, and avoid collisions</span></span><br><span class="line">bucket <span class="variable">prefix =</span> cephtest-{random}-</span><br><span class="line"></span><br><span class="line">[s3 main]</span><br><span class="line"><span class="comment">## the tests assume two accounts are defined, "main" and "alt".</span></span><br><span class="line"></span><br><span class="line"><span class="comment">## user_id is a 64-character hexstring</span></span><br><span class="line"><span class="variable">user_id =</span> test1</span><br><span class="line"></span><br><span class="line"><span class="comment">## display name typically looks more like a unix login, "jdoe" etc</span></span><br><span class="line"><span class="variable">display_name =</span> test1</span><br><span class="line"></span><br><span class="line"><span class="comment">## replace these with your access keys</span></span><br><span class="line"><span class="variable">access_key =</span> test1</span><br><span class="line"><span class="variable">secret_key =</span> test1</span><br><span class="line"></span><br><span class="line"><span class="comment">## replace with key id obtained when secret is created, or delete if KMS not tested</span></span><br><span class="line"><span class="comment">#kms_keyid = 01234567-89ab-cdef-0123-456789abcdef</span></span><br><span class="line"></span><br><span class="line">[s3 alt]</span><br><span class="line"><span class="comment">## another user account, used for ACL-related tests</span></span><br><span class="line"><span class="variable">user_id =</span> test2</span><br><span class="line"><span class="variable">display_name =</span> test2</span><br><span class="line"><span class="comment">## the "alt" user needs to have email set, too</span></span><br><span class="line"><span class="variable">email =</span> test2@qq.com</span><br><span class="line"><span class="variable">access_key =</span> test2</span><br><span class="line"><span class="variable">secret_key =</span> test2</span><br></pre></td></tr></tbody></table>

上面的用户信息是需要提前创建好的，这个用集群内的机器radosgw-admin命令创建即可  

<table><tbody><tr><td class="code"><pre><span class="line">radosgw-admin user create --uid=<span class="built_in">test</span>01 --display-name=<span class="built_in">test</span>01 --access-key=<span class="built_in">test</span>01 --secret-key=<span class="built_in">test</span>01 --email=<span class="built_in">test</span>01@qq.com</span><br><span class="line">radosgw-admin user create --uid=<span class="built_in">test</span>02 --display-name=<span class="built_in">test</span>02 --access-key=<span class="built_in">test</span>02 --secret-key=<span class="built_in">test</span>02 --email=<span class="built_in">test</span>02@qq.com</span><br></pre></td></tr></tbody></table>

创建好了以后就可以开始测试了  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 s3-tests]<span class="comment"># S3TEST_CONF=test.conf ./virtualenv/bin/nosetests -a '!fails_on_rgw'</span></span><br><span class="line">..................................................SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS.....................................................................................................................SSSS.......................................................................................................................................SSSS.......................................................</span><br><span class="line">----------------------------------------------------------------------</span><br><span class="line">Ran <span class="number">408</span> tests <span class="keyword">in</span> <span class="number">122.087</span>s</span><br><span class="line"></span><br><span class="line">OK (SKIP=<span class="number">51</span>)</span><br></pre></td></tr></tbody></table>

正常测试完就应该是上面的ok的状态，也有可能某个版本的测试用例是写的支持，但是rgw也不一定就做好了，这个需要自己判断一下

## 总结

了解软件适配的接口，针对接口进行相关测试即可

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2018-06-27 |

Source: zphj1987@gmail ([利用s3-test进行ceph的接口兼容性测试](http://www.zphj1987.com/2018/06/27/use-s3-test-to-ceph-compatibility-tests/))
