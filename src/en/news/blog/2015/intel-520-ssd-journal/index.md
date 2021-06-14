---
title: "Intel 520 SSD Journal"
date: "2015-05-19"
author: "laurentbarbe"
tags: 
---

A quick check of my Intel 520 SSD that running since 2 years on a small cluster.

```
smartctl -a /dev/sda
=== START OF INFORMATION SECTION ===
Model Family:     Intel 520 Series SSDs
Device Model:     INTEL SSDSC2CW060A3
Serial Number:    CVCV305200NB060AGN
LU WWN Device Id: 5 001517 8f36af9db
Firmware Version: 400i
User Capacity:    60 022 480 896 bytes [60,0 GB]
Sector Size:      512 bytes logical/physical

ID# ATTRIBUTE_NAME          FLAG     VALUE WORST THRESH TYPE      UPDATED  WHEN_FAILED RAW_VALUE
  5 Reallocated_Sector_Ct   0x0032   100   100   000    Old_age   Always       - 0
  9 Power_On_Hours_and_Msec 0x0032   000   000   000    Old_age   Always       - 910315h+05m+29.420s
 12 Power_Cycle_Count       0x0032   100   100   000    Old_age   Always       - 13
170 Available_Reservd_Space 0x0033   100   100   010    Pre-fail  Always       - 0
171 Program_Fail_Count      0x0032   100   100   000    Old_age   Always       - 0
172 Erase_Fail_Count        0x0032   100   100   000    Old_age   Always       - 0
174 Unexpect_Power_Loss_Ct  0x0032   100   100   000    Old_age   Always       - 13
184 End-to-End_Error        0x0033   100   100   090    Pre-fail  Always       - 0
187 Uncorrectable_Error_Cnt 0x000f   117   117   050    Pre-fail  Always       - 153797776
192 Power-Off_Retract_Count 0x0032   100   100   000    Old_age   Always       - 13
225 Host_Writes_32MiB       0x0032   100   100   000    Old_age   Always       - 1367528
226 Workld_Media_Wear_Indic 0x0032   100   100   000    Old_age   Always       - 65535
227 Workld_Host_Reads_Perc  0x0032   100   100   000    Old_age   Always       - 3
228 Workload_Minutes        0x0032   100   100   000    Old_age   Always       - 65535
232 Available_Reservd_Space 0x0033   100   100   010    Pre-fail  Always       - 0
233 Media_Wearout_Indicator 0x0032   093   093   000    Old_age   Always       - 0
241 Host_Writes_32MiB       0x0032   100   100   000    Old_age   Always       - 1367528
242 Host_Reads_32MiB        0x0032   100   100   000    Old_age   Always       - 56808
249 NAND_Writes_1GiB        0x0013   100   100   000    Pre-fail  Always       - 33624
```

## 9 – Power on hours count

Cluster started since 2 years.

## 170 Available\_Reservd\_Space

100%

## 174 – Unexpected power loss

13 => Due to power loss on cluster. Everything has always well restarted. :)

## 187 – Uncorrectable error count

? Limit Ok

## 233 Media Wearout Indicator

093 => progressively decrease, I do not know if it’s completely reliable, but it is usually a good indicator.

## 241 – Host Writes 32MiB

1367528 => 42 Tb written by host This correspond to 60 GB per days for 3 osd. This seems normal.

## 249 – NAND Writes 1GiB

33624 => 33 Tb written on Nand write amplification = 0.79 That is pretty good.

The drive is a 60.0 GB. This make each LBA written about 560 times.

For clusters with a little more load, Intel DC S3700 models remains my favorite, but in my case the Intel 520 do very well their job.
