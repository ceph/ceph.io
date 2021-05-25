---
title: "Get OMAP Key/value Size"
date: "2015-06-25"
author: "admin"
tags: 
  - "planet"
---

List the total size of all keys for each object on a pool.

```
object        size_keys(kB)  size_values(kB)  total(kB)  nr_keys  nr_values
meta.log.44   0              1                1          0        10
data_log.78   0              56419            56419      0        406841
meta.log.36   0              1                1          0        10
data_log.71   0              56758            56758      0        409426
data_log.111  0              56519            56519      0        405909
...
```

This is based on the command `rados listomapvals`.

```
pool='.rgw.buckets.index'
list=`rados -p $pool ls`

(
echo "object size_keys(kB) size_values(kB) total(kB) nr_keys nr_values"
for obj in $list; do
echo -en "$obj ";
rados -p $pool listomapvals $obj | awk '
/^key: (.* bytes)/ { sizekey+= substr($2, 2, length($2)); nbkeys++ }
/^value: (.* bytes)/ { sizevalue+= substr($2, 2, length($2)); nbvalues++ }
END { printf("%i %i %i %i %in", sizekey/1024, sizevalue/1024, (sizekey+sizevalue)/1024, nbkey, nbvalues) }
'
done
)
```

The method is not really optimal, so it may take some time. But it helps to have an idea.

You can add `| column -t` at the end of the command line for better display :

```
object                    size_keys(kB)  size_values(kB)  total(kB)  nr_keys  nr_values
.dir.default.1970130.1.250   8863          75592           84455      0        538692
.dir.default.1977514.4.161   6             55              61         0        405
.dir.default.1977550.10.98   12            83              95         0        692
.dir.default.1977550.5.83    47            434             482        0        3074
.dir.default.1977550.11.34   0             1               2          0        15
.dir.default.1970130.1.69    9147          78077           87224      0        556235
.dir.default.1977550.8.116   0             0               0          0        3
.dir.default.1977550.3.49    0             4               5          0        36
.dir.default.1930743.19.0    0             0               0          0        0
.dir.default.1985483.1.40    204           1868            2073       0        13261
.dir.default.1977514.7.77    0             8               9          0        66
.dir.default.1977514.2.74    0             8               9          0        66
.dir.default.1977550.8.113   0             1               2          0        15
.dir.default.1977550.4.121   7             40              47         0        351
.dir.default.1977514.8.122   0             0               0          0        6
.dir.default.1985483.2.148   578           5423            6001       0        38583
...
```

[http://ceph.com/docs/master/man/8/rados/#pool-specific-commands](http://ceph.com/docs/master/man/8/rados/#pool-specific-commands)

Source: Laurent Barbe ([Get OMAP Key/value Size](http://cephnotes.ksperis.com/blog/2015/06/25/get-omap-key-slash-value-size/))
