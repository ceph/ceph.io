---
title: "Ceph using Monitor key/value store"
date: "2015-05-04"
author: "shan"
tags: 
  - "planet"
---

![](images/ceph-monitors-kv-store.jpg "Ceph using Monitor key value store")

Ceph monitors make use of leveldb to store cluster maps, users and keys. Since the store is present, Ceph developers thought about exposing this through the monitors interface. So monitors have a built-in capability that allows you to store blobs of data in a key/value fashion. This feature has been around for quite some time now (something like 2 years), but haven't got any particular attention since then. I even noticed that I never blogged about it :).

  

Using it is fairly straightforward.

Insert a key:

`bash $ sudo ceph config-key put foo bar value stored`

List keys:

\`\`\`bash $ sudo ceph config-key list \[

```
"foo"]
```

\`\`\`

Retrieve a key:

\`\`\`bash $ sudo ceph config-key get foo -o foo key 'foo' exists

$ cat foo bar \`\`\`

Check if a key exists:

`bash $ sudo ceph config-key exists foo key 'foo' exists`

  

> This store can potentially be used along with configuration management systems. For example, if you use Puppet, instead of using exported resources you could use the monitor store. We have a similar use case on [ceph-docker](https://github.com/ceph/ceph-docker) where we want to store the `ceph.conf` file. Basically when we bootstrap a new OSD container, it will ask the monitors (using an IP address passed through environment variable) and retrieve the configuration file. This is just one example. As always, hope this article was useful and it will give you ideas.
