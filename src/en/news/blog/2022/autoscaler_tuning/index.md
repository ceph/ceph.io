---
title: "Everything you need to know about the PG Autoscaler before and after upgrading to Quincy"
date: "2022-06-08"
author: "Laura Flores and Kamoltat Sirivadhna"
tags:
  - "autoscaler"
  - "mgr"
  - "quincy"
  - "upgrade"
  - "tuning"
  - "troubleshooting"
  - "management"
  - "ceph"
  - "performance"
---

## Introduction

The pg\_autoscaler module, first introduced in the Nautilus (14.2.x) release, is an excellent way to automatically manage placement groups in your Ceph cluster. Based on expected pool usage, the pg\_autoscaler can make recommendations and adjust the number of placement groups in a cluster based on pool usage and tunings set by the user.

The autoscaler comes with a selection of tuning options, including the `--bulk` flag, `target_size_ratio`, `noautoscale`, `bias`, `pg_num`, `pg_num_max`, and `pg_num_min`. In preparation for the latest Quincy release, we put these tunings through release criteria testing and derived tuning recommendations and troubleshooting tips that users can reference as they upgrade to Quincy. In this blog post, we summarize initial challenges posed by the autoscaler, outline best tuning practices that came as a result of release criteria testing, and end with some autoscaler troubleshooting tips.

## Initial challenges and motivation for the --bulk flag

Before Quincy, some users who installed Ceph out-of-the-box experienced performance issues from the start. By default, the autoscaler would begin every pool with the minimum number of PGs, only to inflate that number after usage increased. This behavior primarily caused bad performance in large pools, which needed more PGs than the minimum number provided by the autoscaler.

This “bad-performance-out-of-the-box” experience led to Quincy’s introduction of the `--bulk` flag. Users can now specify the `--bulk` flag when creating pools that they know in advance will be large. By setting the `--bulk` flag on a pool, the autoscaler will assign a larger number of PGs from the get-go. This way, users no longer have to wait for the autoscaler to detect more usage before it allocates the appropriate number of PGs.

## Tuning Recommendations

### The --bulk flag should be used on large pools for optimal performance.
   
The `--bulk` flag can now be used to indicate that a pool will be large, and that it should start out with a large amount of PGs. Users can set the `--bulk` flag both when creating a new pool and on existing pools. Any pools created without the `--bulk` flag will keep the default behavior of starting with the minimum number of PGs.

To set the `--bulk` flag during pool creation, use `ceph osd pool create <pool-name> --bulk`. To set or unset the `--bulk` flag on an existing pool, use `ceph osd pool set <pool-name> bulk <true/false/1/0>`. To get the `--bulk` flag status on an existing pool, use `ceph osd pool get <pool-name> bulk`.

### Use the target\_size\_ratio setting if you expect a pool to consume more cluster capacity relative to other pools.
 
The target ratio of a pool can be specified using the `target_size_ratio` setting. This setting is especially helpful if you know a pool should have a certain ratio relative to other pools. The target ratio of each pool should be 0 by default, unless it is specified otherwise. The more target ratio you give a pool, the larger the PGs you are expecting the pool to have.

To check the target ratio for a pool, use `osd pool autoscale-status` and look under the `TARGET RATIO` column. The `target_size_ratio` can be set on an existing pool with `ceph osd pool set <pool_name> target_size_ratio <ratio>`. To set the `target_size_ratio` during pool creation, use `ceph osd pool create --target-size-ratio <ratio>`.

### Use the noautoscale flag to globally toggle the autoscaler for all pools.

The autoscaler can now be turned on and off globally for all pools with the `noautoscale` flag. By default, this flag is set to false, and the default `pg_autoscale` mode, which is `on`, remains the same for each pool.

If you want to turn the autoscaler on for every pool, use `ceph osd pool unset noautoscale`. If you want to turn the autoscaler off for every pool, use `ceph osd pool set noautoscale`. To get the current value of the noautoscale flag, use `ceph osd pool get noautoscale`.

### Use the bias value to help the autoscaler accurately adjust the number of PGs.
   
Bias is a multiplier used to manually adjust a pool’s PGs based on prior information about the expected number of PGs for that pool. By default, the bias value should be 1.0 unless otherwise specified. The more bias you give a pool, the larger the PGs you are expecting the pool to have.

To check the `bias` value on a pool, use `osd pool autoscale-status` and look under the `BIAS` column. To set the `bias` on an existing pool, use `ceph osd pool set <pool_name> pg_autoscale_bias <bias>`.

### If you know the usage ratio of a pool ahead of time, use the pg\_num option before pool creation.

When a cluster or pool is first created, only a small fraction of the cluster capacity is consumed. As a result, your system may underestimate the number of PGs a cluster or pool will need. If you know the usage ratio of your cluster or pool ahead of time, use the `pg_num` option before pool creation. This will help your cluster account for the appropriate amount of PGs in advance.

To check the `pg_num` value for a pool, use `ceph osd pool autoscale-status` and look under the `PG_NUM` column. To specify `pg_num` when creating a pool, use `ceph osd pool create <pool_name> <pg_num>`. To set the minimum number of pgs allowed in a pool, use `ceph osd pool set <pool-name> pg_num_min <pg_num>`. To set the maximum number of pgs allowed in a pool, use `ceph osd pool set <pool-name> pg_num_max <pg_num>`.

### Use the pg\_num\_max value to set the maximum number of PGs in a pool.
   
It is possible to specify the maximum number of PGs in a pool. This is useful in the creation of smaller pools such as .mgr, meta pools, or pools without the `--bulk` flag. 

To specify the maximum PG count at pool creation time, use the optional `--pg-num-max <num>` argument with the `ceph osd pool create` command. For after pool creation, use `ceph osd pool set <pool-name> pg_num_max <num>`.

### Use the pg\_num\_min value to set the minimum number of PGs in a pool.

Similarly, we can specify the minimum number of PGs in a pool. This is advantageous when we want a lower bound on the amount of parallelism the client will see when doing IO, even when a pool is mostly empty. This is useful in the creation of larger pools such as pools that are set with the `--bulk` flag.

To specify the minimum PG count at pool creation time, use the optional `--pg-num-min <num>` argument with the `ceph osd pool create` command. For after pool creation, use `ceph osd pool set <pool-name> pg_num_min <num>`.

## What to know before upgrading to Quincy

When upgrading from a version of Ceph *without* the autoscaler to a version of Ceph *with* it, the autoscaler will be available to use on each pool after the upgrade, and it will be `off` by default for all pools. However, if you upgrade from a version of Ceph *with* the autoscaler to a newer version that *also* contains the autoscaler, all pools will keep their original autoscaler settings from before the upgrade, be it `off`, `on`, or `warn`. 

To use the `--bulk` flag on a pool, users will need to upgrade to a version of Ceph >= 16.2.8.

Finally, it is important to enable logging for diagnosing any problems with pg\_autoscaler module. Like all manager modules, the pg\_autoscaler has a `log_level` option that specifies its Python logging level. We recommend that you use `warning` to capture information about the upgrade process. To get the current log level of the pg\_autoscaler module, use `ceph config get mgr mgr/pg_autoscaler/log_level`. To set the pg\_autoscaler log level to `warning`, use `ceph config set mgr mgr/pg-autoscaler/log_level warning`. Additional options are `info`, `debug`, `critical`, and `error`.

## Troubleshooting Tips

### What if the autoscaler is not scaling in the expected direction?

Check to see if the bulk values are configured correctly for each pool with `ceph osd pool autoscale-status`. If `BULK` is “false”, the autoscaler is starting out with the minimum number of PGs. If `BULK` is set to “true”, the autoscaler is starting out with a large number of PGs. If any of the bulk values you see in the status output are not as expected, you can change them with `ceph osd pool set <pool-name> bulk <true/false/1/0>`.

### Why is the autoscaler failing to scale or scaling with an incorrect value?

1. **Check if the autoscaler is on/off for the affected pool.**
           
   If the autoscaler is failing to scale on a pool, check that it is `on` for that pool. You can do so with `ceph osd pool autoscale-status`. Under the `AUTOSCALE` column, check to see if the mode is `on`.

   If you find that it is `off`, you can turn the autoscaler on for the affected pool with `osd pool set <pool-name> pg_autoscale_mode on`. If the autoscaler is `on` for the pool, but you’d prefer to have it `off`, you can turn it off with `osd pool set <pool-name> pg_autoscale_mode off`.

2. **Check for overlapping roots.**
       
   If the autoscaler mode is correct for each pool, the autoscaler might be failing to scale because of overlapping roots in your cluster. Check the manager log for this warning log: `pool <id> contains an overlapping root <id> … skipping scaling`. We recommend making the pool belong to only one root to get rid of the warning and ensure a successful scaling process.

3. **Check if the threshold value is affecting the scaling process.**

   Check to see if the `threshold` value is set to an appropriate value (3.0 by default). This value is the decisive factor in whether the scaling process will get executed or not. If the threshold is too large (> 5.0), it will take more utilization for the pool to trigger the autoscaling process. On the other hand, if the threshold is too low (< 2.0), the pool can be overly-sensitive to scaling.

   To adjust the threshold of a pool, use `ceph osd pool set threshold <value>`.

4. **Check if mon_target_pg_per_osd is set at an appropriate value.**

   The next tuning to check is `mon_target_pg_per_osd`, which is the target number of PGs per OSD. By default, this option should be set to 100. If you find that the number of PGs per OSD is not as expected, you can adjust the value by using the command `ceph config set global mon_target_pg_per_osd <value>`.

5. **Check that rate is set correctly.**

   Another tuning to check is the `rate` value, which is the replication size (replicated pools) or erasure code value (erasure coded pools) of a pool. This value determines how much raw storage capacity is consumed on that pool. Verify that it is set correctly based on your pool’s replica size or erasure code profile by using the command `osd pool autoscale-status`. Under the `RATE` column of that output, you can see how the rate is set for each pool. You can adjust the rate for an individual pool by using `ceph osd pool set <pool-name> size <value>`.

6. **Check that bias is set correctly.**

   As explained in [Tuning Recommendations](#use-the-bias-value-to-help-the-autoscaler-accurately-adjust-the-number-of-pgs.), the more bias you give a pool, the larger the PGs you are expecting the pool to have. Therefore, you should check if the `bias` is set to an appropriate value for the affected pool.

7. **Check that target_size_ratio is set correctly.**

   Similarly, the `target_size_ratio` is another tuning in which the more you give in a pool, the larger the PGs you are expecting the pool to have, therefore, you should make sure that the value is appropriate for the affected pool.

### How do I know what the autoscaler is doing?

From a high-level view, you can observe the autoscaler’s activity by using the command `ceph progress`. The output of this command shows which pool is currently scaling its PGs and by how much.

Additionally, you can derive how far you are from the PG target by executing `ceph osd pool autoscale-status` and looking under the `NEW PG_NUM` column for each pool.

For the most detailed view of the autoscaler, access the manager log and look for these INFO level log outputs:
  
   `Pool <pool_name> root_id <root_id> using <capacity> of space, bias <bias>`

   `pg target <pg_target> quantized to <pg_target_nearest_power_of_two> (current <current_pg>)`

   `effective_target_ratio <target_size_ratio> <total_target_ratio> <total_target_bytes> <capacity>`

### What level of logging should I use to check autoscaler activity?

An `error` log level in the Python logging is needed to check autoscaler activity. Refer back to [What to know before upgrading to Quincy](#what-to-know-before-upgrading-to-quincy) for information on checking and setting the autoscaler logging level.

## Conclusion

The pg\_autoscaler module, when tuned correctly, is a great way to have your Ceph cluster automatically manage its placement groups. We hope that these autoscaler tuning recommendations and troubleshooting tips will improve the out-of-the-box experience for all users as they upgrade to the latest version of Quincy. For more information, refer to the [Placement Groups](https://docs.ceph.com/en/latest/rados/operations/placement-groups/) documentation, which has more details about the autoscaler's behavior. We also encourage users who have upgraded to Quincy to contact the user mailing list <ceph-users@ceph.io> with any questions or feedback regarding the autoscaler.
