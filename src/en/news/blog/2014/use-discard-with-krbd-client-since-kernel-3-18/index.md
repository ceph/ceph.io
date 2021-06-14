---
title: "Use Trim/discard With Rbd Kernel Client (Since Kernel 3.18)"
date: "2014-12-18"
author: "laurentbarbe"
tags: 
---

Realtime :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line">mount -o discard /dev/rbd0 /mnt/myrbd
</span></code></pre></td></tr></tbody></table>

Using batch :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line">fstrim /mnt/myrbd
</span></code></pre></td></tr></tbody></table>

## Test

The empty FS :

```
$ rbd create rbd/myrbd --size=20480
$ mkfs.xfs /dev/rbd0
$ rbd diff rbd/myrbd | awk '{ SUM += $2 } END { print SUM/1024/1024 " MB" }'
14.4062 MB
```

With a big file… :

```
$ mount /dev/rbd0 /mnt/myrbd
$ dd if=/dev/zero of=/mnt/myrbd/testfile bs=1M count=1024
$ rbd diff rbd/myrbd | awk '{ SUM += $2 } END { print SUM/1024/1024 " MB" }'
1038.41 MB
```

When the big file has been removed (with file system not mount with “discard”) :

```
$ rm /mnt/myrbd/testfile
$ rbd diff rbd/myrbd | awk '{ SUM += $2 } END { print SUM/1024/1024 " MB" }'
1038.41 MB
```

Launch FS trim :

```
$ fstrim /mnt/myrbd
$ rbd diff rbd/myrbd | awk '{ SUM += $2 } END { print SUM/1024/1024 " MB" }'
10.6406 MB
```

## Benchmark discard option

Without “discard” :

```
$ mount /dev/rbd0 /mnt/rbd0

$ mkdir testdir; cd testdir
$ dd if=/dev/zero of=mainfile bs=1M count=200
$ split -b 4048 -a 7 mainfile; sync               # 4k file / ~51k files
$ cd ..
$ time rm -rf testdir; time sync
real    0m2.780s
user    0m0.096s
sys     0m2.632s

real    0m0.130s
user    0m0.004s
sys     0m0.016s

# total: < 3s
```

With “discard” :

```
$ mount -o discard /dev/rbd1 /mnt/rbd1

$ mkdir testdir; cd testdir
$ dd if=/dev/zero of=mainfile bs=1M count=200
$ split -b 4048 -a 7 mainfile; sync               # 4k file / ~51k files
$ cd ..
$ time rm -rf testdir; time sync
real    1m51.471s
user    0m0.104s
sys     0m2.084s

real    0m47.262s
user    0m0.000s
sys     0m0.008s

# total: ~1m56
```

This is on 2 osd without ssd journal…

In the case of intensive use of the file system, with many small file, it may be more advantageous to use fstrim, for example once a day.

(Ceph osd support trim for block device since 0.46)
