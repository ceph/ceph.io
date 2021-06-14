---
title: "Get the Number of Placement Groups Per Osd"
date: "2015-02-23"
author: "laurentbarbe"
tags: 
---

Get the PG distribution per osd in command line :

```
pool :  0   1   2   3   | SUM 
------------------------------------------------
osd.10  6   6   6   84  | 102
osd.11  7   6   6   76  | 95
osd.12  4   4   3   56  | 67
osd.20  5   5   5   107 | 122
osd.13  3   3   3   73  | 82
osd.21  9   10  10  110 | 139
osd.14  3   3   3   85  | 94
osd.15  6   6   6   87  | 105
osd.22  6   6   5   87  | 104
osd.23  10  10  10  87  | 117
osd.16  7   7   7   102 | 123
osd.17  5   5   5   99  | 114
osd.18  4   4   4   103 | 115
osd.19  7   7   7   112 | 133
osd.0   5   5   5   72  | 87
osd.1   5   5   6   83  | 99
osd.2   3   3   3   74  | 83
osd.3   5   5   5   61  | 76
osd.4   3   3   4   76  | 86
osd.5   5   5   5   78  | 93
osd.6   3   2   2   78  | 85
osd.7   3   3   3   88  | 97
osd.8   9   9   9   91  | 118
osd.9   5   6   6   79  | 96
------------------------------------------------
SUM :   128 128 128 2048    |
```

The command :

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
<span class="line-number">13</span>
<span class="line-number">14</span>
<span class="line-number">15</span>
</pre></td><td class="code"><pre><code class="awk"><span class="line"><span class="nx">ceph</span> <span class="nx">pg</span> <span class="nx">dump</span> <span class="err">|</span> <span class="nx">awk</span> <span class="s1">'</span>
</span><span class="line"><span class="s1"> /^pg_stat/ { col=1; while($col!="up") {col++}; col++ }</span>
</span><span class="line"><span class="s1"> /^[0-9a-f]+\.[0-9a-f]+/ { match($0,/^[0-9a-f]+/); pool=substr($0, RSTART, RLENGTH); poollist[pool]=0;</span>
</span><span class="line"><span class="s1"> up=$col; i=0; RSTART=0; RLENGTH=0; delete osds; while(match(up,/[0-9]+/)&gt;0) { osds[++i]=substr(up,RSTART,RLENGTH); up = substr(up, RSTART+RLENGTH) }</span>
</span><span class="line"><span class="s1"> for(i in osds) {array[osds[i],pool]++; osdlist[osds[i]];}</span>
</span><span class="line"><span class="s1">}</span>
</span><span class="line"><span class="s1">END {</span>
</span><span class="line"><span class="s1"> printf("\n");</span>
</span><span class="line"><span class="s1"> printf("pool :\t"); for (i in poollist) printf("%s\t",i); printf("| SUM \n");</span>
</span><span class="line"><span class="s1"> for (i in poollist) printf("--------"); printf("----------------\n");</span>
</span><span class="line"><span class="s1"> for (i in osdlist) { printf("osd.%i\t", i); sum=0;</span>
</span><span class="line"><span class="s1"> for (j in poollist) { printf("%i\t", array[i,j]); sum+=array[i,j]; poollist[j]+=array[i,j] }; printf("| %i\n",sum) }</span>
</span><span class="line"><span class="s1"> for (i in poollist) printf("--------"); printf("----------------\n");</span>
</span><span class="line"><span class="s1"> printf("SUM :\t"); for (i in poollist) printf("%s\t",poollist[i]); printf("|\n");</span>
</span><span class="line"><span class="s1">}'</span>
</span></code></pre></td></tr></tbody></table>

Copy-paste should work directly. The sum at bottom of the table must match to (pg\_num x size).

You can find pg\_num recommandations here : [http://ceph.com/docs/master/rados/operations/placement-groups/](http://ceph.com/docs/master/rados/operations/placement-groups/)

Also, a pg\_num Calculator is avaible here : [http://ceph.com/pgcalc](http://ceph.com/pgcalc)

To view the number of pg per osd : [http://cephnotes.ksperis.com/blog/2015/02/23/get-the-number-of-placement-groups-per-osd/](http://cephnotes.ksperis.com/blog/2015/02/23/get-the-number-of-placement-groups-per-osd/)
