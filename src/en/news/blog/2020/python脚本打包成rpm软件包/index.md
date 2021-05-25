---
title: "python脚本打包成rpm软件包"
date: "2020-04-03"
author: "admin"
tags: 
  - "planet"
---

## 前言

软件最终都会有交付的形式，有的是用tar包，有个是以目录，有的是封成一个文件包，从大多数使用场景来说，直接打包成软件包的方式是最简单，也是最不容易出错的，路径可以在包里面写死了

## 实践

关于打包的资料网上很多，而封包的方式也很多有spec文件方式，有fpm打包方式，本篇记录的是通过setup.py的方式打包的，因为最近出了小工具，所以进行了相关的尝试，这里记录一下

首先创建一个setup.py文件，写上一些基础内容

```bash
[root@test redmine]# cat setup.py 
# coding:utf-8
#from distutils.core import setup
from setuptools import setup, find_packages

setup(
        name='issue-check',
        version='2020-0403-1419',
        description='This redmine issue-check', 
        author='zphj1987',  
        author_email='zphj1987@gmail.com',
        license='MIT',
        url='https://github.com/zphj1987/issue-check.git',
        py_modules=['issue-check','issue-check-pretty'],
        data_files=[('/opt/issue-check/',['issue.conf.sample']),('/opt/issue-check/',['README.md'])]
)
```

上面的就是把当前目录的issue-check.py和issue-check-pretty.py打包进rpm，把issue.conf.sample打包到/opt/issue-check/这个路径下面

通过data\_files可以进行安装路径的控制，而上面的py\_modules则不在这里进行控制了，需要增加一个配置文件setup.cfg

```bash
[install]
install-lib=/opt/issue-check
```

修改以后，安装路径就指定到/opt/issue-check下面了，如果不做控制，就会默认安装到python的执行目录里面去，上面的这些简单的控制以后就可以开始封包的命令了

```bash
python setup.py bdist_rpm
```

执行完了后在当前目录的dist目录下面就会生成相关的rpm包和源码的rpm包，这个实际上也是调用了spec，然后进行的相关打包工作，只是在这个之上再封装了一层

## 暂时未解决的问题

默认这样的打包方式会生成egg相关的文件，并且打包过程中会编译pyc，pyo等文件，暂时还没找到方法简单的去把这些文件给去掉，不过也不会太大的影响

## 总结

如果是做py的软件包，建议还是能够封包后再输出

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2020-04-03 |

Source: zphj1987@gmail ([python脚本打包成rpm软件包](https://zphj1987.com/2020/04/03/build-python-rpm/))
