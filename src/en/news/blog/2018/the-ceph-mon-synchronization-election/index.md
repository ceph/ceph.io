---
title: "The Ceph MON synchronization (election)"
date: "2018-03-28"
author: "admin"
tags: 
  - "planet"
---

## The Ceph MON synchronization (election)

Here recently I had got asked a question about Ceph that I wasn’t entirely sure how to answer. It had to do with how the synchronization (election) process worked between monitors. I had an idea, but wasn’t quite sure. So here is a quick synopsis of what I found out.

### Ceph monitor needs to join the quorum

When a Ceph monitor needs to regain its status in the cluster, it goes through a pretty simple process. For this purpose, each monitor has a role to play. The roles are as follows:

- **Leader:** The leader is the first monitor to achieve the most recent version of the cluster map. And like all good leaders, this monitor will delegate sync duties to a **Provider**, as not to over burden himself.
- **Provider:** When it comes to the Cluster map olympics, this was the guy who got silver. He has the most recent version of the cluster map, he just wasn’t the first to achieve it. He will be delegated sync duties from the **Leader** and will then sync his cluster map with the …
- **Requester:** The monitor that wants to join the cool kids club. He no longer has the most recent info, and will make a request to the leader to to join. Before he can do that though the leader will want him to sync up with another monitor.

Lets see how this process would go in normal operation. _If this were from a movie, would it be from “The MONchurian Candidate”?_

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div><div class="line">6</div><div class="line">7</div><div class="line">8</div><div class="line">9</div><div class="line">10</div><div class="line">11</div><div class="line">12</div><div class="line">13</div><div class="line">14</div><div class="line">15</div><div class="line">16</div><div class="line">17</div><div class="line">18</div><div class="line">19</div></pre></td><td class="code"><pre><div class="line"># Ask to sync</div><div class="line">Requester: Hey Leader my cluster map is outta date,</div><div class="line">and I want back in to the quorum.</div><div class="line">Leader: Look man I really don't have time for this,</div><div class="line">talk to Provider Cephmon2 to get back up to speed.</div><div class="line"></div><div class="line"># Sync with provider</div><div class="line">Requester: Hey bro, the leader told me to talk to you</div><div class="line">about getting the current cluster map.</div><div class="line">Provider: No problem, I'll send these over to you in</div><div class="line">chances, just let me know you received them ok</div><div class="line">Requester: Cool man I got them all and I'm up to date.</div><div class="line"></div><div class="line"># Let the Leader know you're done</div><div class="line">Requester: Hey there Leader, my sync is done</div><div class="line">everything is good to go.</div><div class="line">Leader: It sure is, welcome to Quorum, bro.</div><div class="line"></div><div class="line">### END SCENE ###</div></pre></td></tr></tbody></table>

And thats it in a nutshell. As always, if this even helped out one admin, then it was well worth it. For a more complete and deep dive into this process check out [Ceph Monitor Config Reference](http://docs.ceph.com/docs/jewel/rados/configuration/mon-config-ref/). Thanks for reading and feel free to [contact me](magusnebula@gmail.com) if you have any questions!

Source: Stephen McElroy ([The Ceph MON synchronization (election)](http://obsidiancreeper.com/2018/03/28/The-Ceph-MON-synchronization-election/))
