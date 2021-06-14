---
title: "Recovering data from a RBD image"
date: "2017-08-22"
author: "admin"
tags: 
  - "planet"
---

![Drawing](images/Ceph_Logo_Standard_RGB_120411_fa.png)

## [](#Recovering-data-from-a-RBD-image "Recovering data from a RBD image")Recovering data from a RBD image

First lets go ahead and make a snap of our image, then lets export it to local disk.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div></pre></td><td class="code"><pre><div class="line">root&gt; rbd snap create volumes/openstackRBD_disk@recovery.snap</div><div class="line">root&gt; rbd <span class="built_in">export</span> volumes/openstackRBD_disk@recovery.snap /tmp/recovery.img</div></pre></td></tr></tbody></table>

Next, we need to run `fdisk -l` on our exported image to find 2 important things.

1. Sector size `Units = sectors of 1 * 512 = 512 bytes`
2. List of Partitions, and their respective starting sectors `./recovery.img1 * 2048`

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div><div class="line">6</div><div class="line">7</div><div class="line">8</div><div class="line">9</div><div class="line">10</div><div class="line">11</div><div class="line">12</div><div class="line">13</div></pre></td><td class="code"><pre><div class="line">root&gt; fdisk <span class="_">-l</span> /tmp/recovery.img</div><div class="line"></div><div class="line">Disk ./recovery.img: 42.9 GB, 42949672960 bytes, 83886080 sectors</div><div class="line">Units = sectors of 1 * 512 = 512 bytes</div><div class="line">Sector size (logical/physical): 512 bytes / 512 bytes</div><div class="line">I/O size (minimum/optimal): 512 bytes / 512 bytes</div><div class="line">Disk label <span class="built_in">type</span>: dos</div><div class="line">Disk identifier: 0x000248cc</div><div class="line"></div><div class="line">         Device Boot      Start         End      Blocks   Id  System</div><div class="line">./recovery.img1   *        2048     1026047      512000   83  Linux</div><div class="line">./recovery.img2         1026048     5220351     2097152   82  Linux swap / Solaris</div><div class="line">./recovery.img3         5220352    20971519     7875584   83  Linux</div></pre></td></tr></tbody></table>

After that we will calculate our offset for each partition we need to mount up.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">recovery.img3: 5220352 * 512 = 2672820224</div></pre></td></tr></tbody></table>

Next, we will take that offset number and use it to mount our image to a loop device.  
_For those who don’t know, a loop device basically lets you mount a file that acts as a block-based device._

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">root&gt; losetup -o 2672820224 /dev/loop0 recovery.img</div></pre></td></tr></tbody></table>

If you need to `fsck` the disk, let do that now.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">root&gt; fsck -fv /dev/loop0</div></pre></td></tr></tbody></table>

Finally, mount it up somewhere and write to it as normal!

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div></pre></td><td class="code"><pre><div class="line">root&gt; mount /dev/loop1 /mnt/recovery/</div><div class="line">root&gt; ls</div><div class="line">bin boot dev etc <span class="built_in">export</span> home lib lib64 mnt sys tmp usr var</div><div class="line">root&gt;</div></pre></td></tr></tbody></table>

Now once you’re done making any repairs or changes, feel free to unmount the image and reimport it back into your pool. _Remember if your original image is there and you plan on replacing it with this new image, you must delete it and all of its snaps._

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div></pre></td><td class="code"><pre><div class="line">root&gt; unmount /mnt/recovery/</div><div class="line">root&gt; rbd rm volumes/openstackRBD_disk</div><div class="line">root&gt; rbd import recovery.img volumes/openstackRBD_disk</div></pre></td></tr></tbody></table>

And thats it! If you have any questions, or just want to give thanks, feel free to email me at magusnebula@gmail.com.

Source: Stephen McElroy ([Recovering data from a RBD image](http://obsidiancreeper.com/2017/08/22/Recovering-data-from-a-RBD-image/))
