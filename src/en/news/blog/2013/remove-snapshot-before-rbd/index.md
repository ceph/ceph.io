---
title: "Remove Snapshot Before Rbd"
date: "2013-07-30"
author: "syndicated"
tags: 
  - "planet"
---

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
<span class="line-number">10</span>
<span class="line-number">11</span>
<span class="line-number">12</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd rm rbd/myrbd
</span><span class="line">2013-07-30 14:10:13.341184 7f9e11922760 -1 librbd: image has snapshots - not removing
</span><span class="line">Removing image: 0% complete...failed.
</span><span class="line">rbd: image has snapshots - these must be deleted with 'rbd snap purge' before the image can be removed.
</span><span class="line">$ rbd snap ls rbd/myrbd
</span><span class="line">SNAPID NAME       SIZE 
</span><span class="line">    10 snap1 102400 KB 
</span><span class="line">    12 snap2 102400 KB 
</span><span class="line">$ rbd snap purge rbd/myrbd
</span><span class="line">Removing all snapshots: 100% complete...done.
</span><span class="line">$ rbd rm rbd/myrbd
</span><span class="line">Removing image: 100% complete...done.</span></code></pre></td></tr></tbody></table>
