---
title: "New in Mimic: iostat plugin"
date: "2018-06-29"
author: "lenz"
---

(this is a guest post by [Mohamad Gebai](https://github.com/mogeb) from SUSE, who developed the iostat plugin)

The Mimic release of Ceph has brought with it a small yet useful feature for monitoring the activity on a Ceph cluster: the `iostat` command, which comes as a form of a [Ceph manager plugin](http://docs.ceph.com/docs/mimic/mgr/plugins/). The `iostat` module is enabled by default on newly deployed clusters, but remains disabled on clusters coming from older versions via upgrades. To enable the `iostat` plugin, run:

$ ceph mgr module enable iostat

The plugin is quite easy to use, simply invoke it from the command line as follows. Let's take a look at the output of the `iostat` command:

$ ceph iostat
+-----------+----------+-----------+-----------+------------+------------+
|      Read |    Write |     Total | Read IOPS | Write IOPS | Total IOPS |
+-----------+----------+-----------+-----------+------------+------------+
| 157 MiB/s | 20 MiB/s | 177 MiB/s |        39 |         10 |         49 |
| 157 MiB/s | 20 MiB/s | 177 MiB/s |        39 |         10 |         49 |
| 157 MiB/s | 20 MiB/s | 177 MiB/s |        39 |         10 |         49 |
| 325 MiB/s | 51 MiB/s | 376 MiB/s |        81 |         25 |        106 |
| 325 MiB/s | 51 MiB/s | 376 MiB/s |        81 |         25 |        106 |
| 325 MiB/s | 51 MiB/s | 376 MiB/s |        81 |         25 |        107 |
| 325 MiB/s | 51 MiB/s | 376 MiB/s |        81 |         25 |        107 |
| 325 MiB/s | 51 MiB/s | 376 MiB/s |        81 |         25 |        106 |
| 478 MiB/s | 83 MiB/s | 562 MiB/s |       119 |         41 |        161 |
| 478 MiB/s | 83 MiB/s | 562 MiB/s |       119 |         41 |        161 |
| 321 MiB/s | 62 MiB/s | 384 MiB/s |        80 |         31 |        111 |
| 321 MiB/s | 62 MiB/s | 384 MiB/s |        80 |         31 |        111 |
| 467 MiB/s | 93 MiB/s | 561 MiB/s |       116 |         46 |        163 |
| 467 MiB/s | 93 MiB/s | 561 MiB/s |       116 |         46 |        163 |
| 300 MiB/s | 62 MiB/s | 362 MiB/s |        75 |         31 |        106 |

Here's a short recording of the output:

[![](images/KVqTMm35o0geMG93ht4XjUWUK.png)](https://asciinema.org/a/KVqTMm35o0geMG93ht4XjUWUK)

The results of this command are the same ones you would expect to see in `ceph -s`. You can optionally pass the `period` argument to configure the rate at which the statistics are printed. The default is a period of 1 second.

Note that the following section is more for educational purposes.

Something jumps out by looking at the output of `iostat`: the same numbers are repeated between 2 and 4 times, which might mean that the statistics aren't updated as regularly as they are printed by the iostat command. This is the right assumption. The OSDs combine their statistics as they serve requests, and send them periodically to the manager. The manager keeps these statistics in memory until its next tick, where they are compiled, aggergated, and used to update the cluster-wide statistics. This means that if you want to get more accurate statistics out of `iostat`, you would need to increase both the OSDs to mgr updates frequency, and the mgr tick frequency. The former is controlled by the `mgr_stats_period` option (default of 5 seconds), and the latter is controlled by `mgr_tick_period` (default of 2 seconds).

After setting the following options in `ceph.conf` (and restarting the nodes):

\[mgr\]
mgr stats period = 1
mgr tick period = 1

We get the following output for `iostat`:

$ ceph iostat
+-------+----------+----------+-----------+------------+------------+
|  Read |    Write |    Total | Read IOPS | Write IOPS | Total IOPS |
+-------+----------+----------+-----------+------------+------------+
| 0 B/s | 42 MiB/s | 42 MiB/s |         0 |         21 |         21 |
| 0 B/s | 52 MiB/s | 52 MiB/s |         0 |         26 |         26 |
| 0 B/s | 50 MiB/s | 50 MiB/s |         0 |         25 |         25 |
| 0 B/s | 54 MiB/s | 54 MiB/s |         0 |         27 |         27 |
| 0 B/s | 55 MiB/s | 55 MiB/s |         0 |         27 |         27 |
| 0 B/s | 72 MiB/s | 72 MiB/s |         0 |         36 |         36 |
| 0 B/s | 76 MiB/s | 76 MiB/s |         0 |         38 |         38 |
| 0 B/s | 76 MiB/s | 76 MiB/s |         0 |         38 |         38 |
| 0 B/s | 85 MiB/s | 85 MiB/s |         0 |         42 |         42 |
| 0 B/s | 87 MiB/s | 87 MiB/s |         0 |         43 |         43 |

The `iostat` command now prints more up to date statistics. However, you probably don't want to increase these rates. Updating the statistics and forcing a tick on the manager add overhead, and they might cause undesired side-effects such as a higher CPU usage. Moreover, these statistics aren't meant to be used in a high performance computing context, but are more to give a general overview of the cluster's activity. If you want to avoid duplicate lines in the `iostat` output, the easier and safer option would be to increase the rate at which it prints the cluster statistics:

$ ceph iostat -p 5

Which will print IO statistics every 5 seconds.
