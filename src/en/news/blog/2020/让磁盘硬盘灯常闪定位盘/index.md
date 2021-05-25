---
title: "让磁盘硬盘灯常闪定位盘"
date: "2020-03-24"
author: "admin"
tags: 
  - "planet"
---

通过dd来读取让硬盘灯闪来定位磁盘的位置

```bash
#!/bin/bash
hd=$1
for num in {1..5};do
        dd if="$hd" of="/dev/null" bs=4M count=1000 iflag=direct conv=noerror >/dev/null 2>&1
        sleep 1
done
```

写于: 2014年11月07日  
更新于: 2015年03月24日

Source: zphj1987@gmail ([让磁盘硬盘灯常闪定位盘](https://zphj1987.com/2020/03/24/%E8%AE%A9%E7%A3%81%E7%9B%98%E7%A1%AC%E7%9B%98%E7%81%AF%E5%B8%B8%E9%97%AA%E5%AE%9A%E4%BD%8D%E7%9B%98/))
