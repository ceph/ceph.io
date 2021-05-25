---
title: "OpenStack Havana flush token manually"
date: "2013-09-06"
author: "shan"
tags: 
  - "planet"
---

It has always been a huge pain to manage token in MySQL espacially with PKI token since they are larger than UUID token. Almost a year ago I wrote [an article to purge token via a script](http://www.sebastien-han.fr/blog/2012/12/12/cleanup-keystone-tokens/). So finally, we have an easy option to purge all expired token.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo keystone-manage token_flush
</span></code></pre></td></tr></tbody></table>

Script to execute periodically:

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c">#!/bin/bash</span>
</span><span class="line">
</span><span class="line"><span class="c"># Purpose of the script</span>
</span><span class="line"><span class="c"># Everytime a service wants to be do 'something' it has to retrieve an autentication token</span>
</span><span class="line"><span class="c"># Nova/Glance/Cinder services are manage by Pacemaker and monitor functions (from the RA) ask for a token every 10 sec</span>
</span><span class="line"><span class="c"># There is no cleanup procedure nor periodical task running to delete expire token</span>
</span><span class="line">
</span><span class="line">logger -t keystone-cleaner <span class="s2">"Starting token cleanup"</span>
</span><span class="line">keystone-manage token_flush
</span><span class="line">logger -t keystone-cleaner <span class="s2">"Ending token cleanup"</span>
</span><span class="line">
</span><span class="line"><span class="nb">exit </span>0
</span></code></pre></td></tr></tbody></table>

For those of you who are curious this is what the command does:

```
DELETE FROM token WHERE token.expires < %s' (datetime.datetime(2013, 11, 19, 15, 20, 26, 115332),)
```

Where `2013, 11, 19, 15, 20, 26, 115332` are your current date and time.

  

> Hope it helps!
