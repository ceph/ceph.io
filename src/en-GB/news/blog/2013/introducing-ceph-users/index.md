---
title: "Introducing ceph-users"
date: "2013-02-08"
author: "rturk"
tags: 
  - "planet"
---

### Hi!

It’s me again, your friendly Ceph community manager. Lately I’ve gone off the deep end collecting data about activity and participation from our mailing lists, IRC channel, and git repository. I think they’re interesting and I’d like to start regularly sharing what I see. Today I’m going to focus on some interesting trends from the mailing list.

Before getting into all that, though, I’m going to make like Fight Club and skip to the conclusion: it’s time to create a mailing list for users and operators that will compliment ceph-devel.

### Our New ceph-users List

You may have noticed that things are busier in ceph-devel lately, and the metrics confirm: there are more people, more topics, and more discussion. Some of this new activity can be attributed to our growing core developer team, but most of it is something we haven’t seen until recently: people need help with configuration, deployment, tuning, and administration.

In short, the community has become active enough to need a dedicated venue for user/operator discussion. While ceph-devel is still the right place to discuss the development of Ceph, those who use Ceph have a dedicated list of their own.

Here are all the vitals for our new list, ceph-users. If you are a user of Ceph (or want to help those who are), I encourage you to subscribe! Information for the other lists (ceph-devel and ceph-commit) can always be found at our [List and IRC](http://ceph.com/resources/mailing-list-irc/) page.  

| List | Address | Resources |  |
| --- | --- | --- | --- |
| ceph-users | [ceph-users@ceph.com](mailto:ceph-users@ceph.com) | [listinfo](http://lists.ceph.com/listinfo.cgi/ceph-users-ceph.com/) | [archives](http://lists.ceph.com/pipermail/ceph-users-ceph.com/) | [subscribe](mailto:ceph-users-join@lists.ceph.com) |

### Ceph-devel has become a busy place

Ahhh, stats.

I don’t know whether other community managers share my zany enthusiasm, but I love metrics. I love gathering them, analyzing them, and validating them. I simply must collect them all. When particularly interesting data is plotted, I find the results aesthetically pleasing. Metrics calm me when I’m agitated and motivate me when I’m discouraged. I would marry them if it were legal. We’re very happy together.

Gathering metrics in a consistent way require three different kinds of tech: tech to import raw data into a database, tech to transform raw data into usable data, and tech to present that data so it means something to us crude, organic life forms. For data import, I use a variety of tools: [cvsanaly](https://github.com/MetricsGrimoire/CVSAnalY), [mlstats](https://github.com/MetricsGrimoire/MailingListStats/), [superseriousstats](https://github.com/tommyrot/superseriousstats), and a few odd Perl scripts. For transformation, I use [Talend Open Studio](http://www.talend.com/products/data-integration), which does a great job of large-scale data movement and processing. For real-time visualization, I’m using [Chartio](http://chartio.com) because it’s easy and beautiful…although these charts were built in something that allows more thorough pixel-twiddling.

![Messages](images/messages.png "messages.png")

As you can see, the number of new messages each month has more than doubled since April of 2012. The average number of messages per day has increased from 7 to 18 – almost three times as many. And ceph-devel has just completed its busiest month ever.

![Participants](images/participants.png "participants.png")

The number of weekly participants has also been rising lately, which is good! In fact, the mailing list has seen messages from 604 different people, up from 348 in April 2012.

![Threads](images/threads.png "threads.png")

This chart shows how many threads were “in play” each day, averaged across the entire month. No surprises here: we’ve got a similar trend. People aren’t just communicating more frequently than before, they’re communicating about more topics.

![Aggregate](images/aggregate.png "aggregate.png")

And, just for fun, this chart shows the all-time aggregate for messages and participants. If all good charts go up and to the right, aggregates are the best because they always do! There are, however, certain trends that become especially meaningful when viewed in aggregate. This chart clearly shows the accelerating rates of membership and participation.

I’m currently in the process of wiring together metrics for the new list. In a month or so, I’ll be back with a full report.

Yours truly,  
Ross

