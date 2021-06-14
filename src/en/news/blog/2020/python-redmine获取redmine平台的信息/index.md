---
title: "python-redmine获取redmine平台的信息"
date: "2020-04-03"
author: "admin"
tags: 
  - "planet"
---

## 前言

最近做redmine的bug平台的分析，统计一些需要用到的数据，这里把相关调用的地方记录下来以备后用

## 相关的获取接口

```bash
#! /usr/bin/python
# -*- coding:UTF-8 -*-

from redminelib import Redmine
redmine = Redmine('redmin的地址',username='用户名',password='密码',requests={'timeout': 5 })
issues = redmine.issue.filter(project_id='项目id',status_id='open',offset=0,limit=100)

# 遍历bug单
for issue in issues:
    #获取当前BUG编号
    print issue.id
    #获取bug单标题
    print issue.subject
    #获取bug单的提单人
    print issue.author
    #获取issue创建时间
    print issue.created_on
    #获取更新时间
    print issue.updated_on
    #遍历追加评论（BUG流转过程）
    myissue=redmine.issue.get(issue.id, include=['children', 'journals', 'watchers'])
    for journal in myissue.journals:
        #获取评论人
        print journal.user.name
        #获取评论时间
        print journal.created_on
```

因为默认的时间是UTC时间，我们转换成本地时间

```bash
def utc2local(utc_dtm):
    local_tm = datetime.fromtimestamp( 0 )
    utc_tm = datetime.utcfromtimestamp( 0 )
    offset = local_tm - utc_tm
    return utc_dtm + offset

local_issue_tm = utc2local(issue.created_on)
```

这样可以把时间转换成当前的时区的时间  
想格式化也行

```bash
issue_create_time=local_issue_tm.strftime("%Y-%m-%d %H:%M:%S")
```

## 超过100条的问题的处理

```bash
issues = redmine.issue.filter(project_id='项目id',status_id='open',offset=0,limit=100)
issues = redmine.issue.filter(project_id='项目id',status_id='open',offset=100,limit=100)
```

这个是因为redmine内部把单个最大请求数限制死了是100个，因此可以通过偏移量来获取即可，有几百个bug就写几条就行了，也不会太多

## 总结

上面的就是获取一些信息的接口，获取以后可以到出为csv或者excel，然后做更多的数据处理，这里就不做过多的记录

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2020-04-03 |

Source: zphj1987@gmail ([python-redmine获取redmine平台的信息](https://zphj1987.com/2020/04/03/python-redmine-get-redmine-data/))
