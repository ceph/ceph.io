---
title: "Many Arms Make Light Work: An AI Skill for the Ceph Contribution Loop"
date: "2026-11-04"
author: "Anthony D'Atri"
categories: "community"
image: "images/titlepage.png"
tags:
  - "ceph"
  - "community"
  - "ai"
  - "backports"
---


## Many arms

The Ceph community is wonderfully varied. Yes, there are kernel
developers and RADOS engineers, but there are also admins running
petabytes in production, documentation writers, QA folks who live in
teuthology, dashboard designers, packagers, students, and people who
first showed up to ask why their PGs were stuck and stayed to help the
next person. They work at hyperscalers, universities, research labs,
startups, and small shops with one cluster and a lot of heart. They
span every time zone and many languages.

That diversity is our strength. A bug report from an admin who has
seen a failure at scale, a doc fix from someone who just tripped over a
confusing paragraph, a test from someone who reads code for fun: each
comes from a perspective that a room of like-minded developers would
miss. A storage system that serves everyone is best shaped by everyone.

Then you try to contribute, and the process can be daunting.


## The loop is long

A change to Ceph is not just a patch. It is a loop:

1. **The tracker.** Find or file the issue on tracker.ceph.com, make sure nobody else is already on it, and move it through statuses whose rules differ from project to project.
2. **The pull request.** Branch from `main`, commit with a `Signed-off-by` line and a `Fixes:` link to the tracker, prefix the title with the component, and fill out the PR template's checklist.
3. **The checks and the bots.** Get CI green. Learn which Jenkins trigger phrase reruns which job, when the config-change bot wants a `/config check ok`, why Read the Docs failed, and what the Backport Audit is complaining about.
4. **The merge.** Respond to review, rebase, rebase again to fix the 451 unrelated commits you dragged in, wait. When the PR merges, the Redmine Upkeep Bot moves the tracker issue to Pending Backport and opens one backport issue per release.
5. **The backports.** Do it all again, once for each stable branch.

None of these steps is unreasonable on its own. Each exists for a good
reason, usually a painful one. Together they are a lot to hold in your
head, and the knowledge is scattered across several documents, PR
templates, bot comments, and the memories of a few release managers.


## Backports are byzantine

Backports deserve their own section, because they scare away even
experienced contributors.
[Submitting Patches to Ceph - Backports](https://github.com/ceph/ceph/blob/main/SubmittingPatches-backports.rst)
lays out the full process. For every fix that needs to reach a stable
release, someone has to:

* Wait for the main PR to merge and for the bot to create backport issues, one per release named in the parent issue's Backport field.
* For each release, create a branch named `wip-<backport issue>-<release>` from that release's branch.
* `git cherry-pick -x` each commit, keeping the original author.
* Resolve any conflicts, and list every file touched by hand in a `Conflicts:` block in the commit message.
* Open a PR against the release branch, with the release as both base and milestone, the release name as the title prefix, and a body that links the backport issue, the main PR, and the parent issue.
* Set the backport issue to Fix Under Review with the new PR's number, so the Backport Audit can match them up.
* Repeat for `umbrella`, `tentacle`, and `squid`.

Get one of those wrong and the audit fails, the bot doesn't close the
issue, or a release manager has to chase you down. Some of the traps
are subtle:

* A cherry-pick with no conflicts can still drag in unrelated lines, most often in `PendingReleaseNotes`.
* A doc change that builds cleanly on `main` can break the docs build on an older branch, because a `:ref:` target it links to doesn't exist there.
* Redmine quietly refuses a status change that a project's workflow doesn't allow. It answers with success and leaves the old status in place.

So backports get put off, and fixes wait on `main` while the people who
need them run a stable release.

`src/script/ceph-backport.sh` automates part of this, and it has long
been the recommended tool. It did not run on macOS, though, and macOS
is on a great many contributors' desks, especially those who aren't
full-time Ceph developers. The script needs bash 4 and GNU `getopt`.
macOS ships bash 3.2 and BSD `getopt`, so the script died with a
cryptic `declare: -A: invalid option` before it could say what was
wrong. My PR
[ceph-backport.sh: run on macOS as well as Linux](https://github.com/ceph/ceph/pull/71168),
merged in August, adds a guard that re-executes the script under a
newer bash when one is installed, finds GNU `getopt`, and otherwise
tells you to `brew install bash gnu-getopt`. It's a small fix, but it
turned *works if your laptop looks like the maintainers'* into *works
on the laptop you have*.

That fixed one tool. The loop was still long.


## A skill for the whole loop

AI coding agents such as Claude Code can now load *skills*. A skill is
a folder holding a `SKILL.md` of instructions, some reference notes,
and scripts. The agent reads the skill when a task calls for it, and
follows its procedures instead of improvising. I wrote one for the Ceph
contribution loop, called `inkwell`.

It includes three small Python scripts that need nothing beyond the
standard library:

* `tracker.py` works tracker.ceph.com through the Redmine API. It shows an issue with its relations, allowed statuses, and notes; scrapes every open issue of a type, for triage; finds the issues tied to a PR and a parent's backport issues; and updates the status, notes, PR ID, and Backport fields, reading each back afterward.
* `prs.py` reports a PR's draft state, labels, and failing checks, and lists other open PRs that touch the same files. It also posts the config-change and Backport Audit bot commands and the Jenkins trigger phrases.
* `backport.py` simulates a cherry-pick onto each stable branch before anything is pushed. Then, for each backport issue, it creates the worktree and `wip-` branch, runs `cherry-pick -x`, writes the PR body, opens the PR, and updates the tracker.

The reference notes capture the rules that cost rework when you learn
them the hard way:

* **Check for toe-stepping first.** Before writing anything, look at the issue's assignee, status, linked PR, latest notes, and any open PR that touches the same lines. If the issue is someone else's, ask them first.
* **Verify on `main`, not from memory.** Before calling an issue done or moot, grep a freshly fetched `main` and cite the file and line, the merged PR, or the docs URL.
* **A clean cherry-pick means the same line counts as `main`.** `backport.py check` compares them, and confirms that every `:ref:`, `:confval:`, and `:doc:` target in the change exists on each branch.
* **Main PRs open as drafts, backports open ready.**

Most important, every write is public and carries a person's name:
tracker notes and statuses, pushes, PRs, PR comments, and bot
commands. So the skill tells the AI agent using it to show you the
exact text of each one, ask for your explicit permission to proceed,
and read the write back afterward. The agent handles the mechanics.
The contributor owns every word.


## A real one: the cluster network

Here is one from late October 2026, start to finish.

[Issue 58687](https://tracker.ceph.com/issues/58687) was filed in
February 2023, from a question Dan van der Ster asked in Slack about
the diagram in the
[Network Configuration Reference](https://docs.ceph.com/en/latest/rados/configuration/network-config-ref/):
*don't Monitors and MDSes also use the cluster network to reach OSDs?*
The issue picked up a note or two, then sat idle for more than three
and a half years, apart from being refiled from RGW to RADOS in
September 2026.

It came up in a triage pass over the open Documentation issues. The
batch verdict was that the diagram is right, with evidence:
`cluster_network` is an OSD-only option in
`src/common/options/global.yaml.in`, and only `ceph-osd` picks a
cluster address. A closer look before closing the issue found that the
caption under the diagram was wrong: it said the cluster network
offloads heartbeat traffic, but OSDs send heartbeats over both
networks. So the issue became a fix instead of a close.

The fix was 13 added lines and 3 removed lines in one file. It corrected
the caption and added a paragraph on which daemons use the cluster
network, on heartbeats needing to succeed on both networks, and on OSDs
flapping when the cluster network fails while the public network still
works. It went up as a draft,
[doc/rados: explain which daemons use the cluster network](https://github.com/ceph/ceph/pull/73213),
with this note on the issue:

```
Draft fix: https://github.com/ceph/ceph/pull/73213

The diagram is correct that only OSDs use the cluster network. Its
caption said the cluster network offloads heartbeat traffic, but OSDs
send heartbeats over both networks, so the PR corrects the caption and
adds a paragraph on which daemons use the cluster network, heartbeats
on both networks, and flapping when the cluster network fails.
```

The backport check shows which stable branches the change picks onto
cleanly:

```
$ python3 -I scripts/backport.py check 73213 umbrella tentacle squid
#73213 doc/rados: explain which daemons use the cluster network | MERGED | 1 commit(s)
original: doc/rados/configuration/network-config-ref.rst +13/-3
umbrella: clean, same line counts
tentacle: clean, same line counts
squid: CONFLICT at bd449702833 doc/rados: explain which daemons use the cluster network: doc/rados/configuration/network-config-ref.rst
```

The page on `squid` had diverged, so the Backport field named only
`umbrella` and `tentacle`. The PR merged at 10:21 PM EDT on October 30.
At 10:23 PM the Upkeep Bot created backport issues
[82400](https://tracker.ceph.com/issues/82400) and
[82401](https://tracker.ceph.com/issues/82401). At 10:25 PM, four
minutes after the merge, both backport PRs were open and ready for
review:
[umbrella](https://github.com/ceph/ceph/pull/73319) and
[tentacle](https://github.com/ceph/ceph/pull/73320). Each has the
expected branch name, base, milestone, and title, and a body that
begins:

```
backport tracker: https://tracker.ceph.com/issues/82400

---

backport of https://github.com/ceph/ceph/pull/73213
parent tracker: https://tracker.ceph.com/issues/58687
```

Each backport issue is in Fix Under Review with its PR number, so the
Backport Audit and the Upkeep Bot can do their jobs. Like every write
the skill makes, those went out under my name and on my go. None of it
needed me to remember a branch naming scheme.


## Everyone can contribute

This is the part I care about most. The mechanics of the loop have
always acted as a filter, and it filters for the wrong thing. It
selects for people who already know Git workflows, Redmine statuses,
and the lore of a dozen bots. I have a math degree, and it doesn't
help with any of that. It does not select for people who know where
the docs mislead, which setting bites admins at 3 AM, or what a
confusing error message actually means.

With the mechanics handled, the bar to contributing becomes what it
should be: something worth contributing, and the judgment to get it
right.

* An **admin** who finds that a doc page's advice is wrong for large clusters can fix the page without first becoming a Git expert.
* A **documentation writer** can carry a fix all the way to every stable release, instead of stopping at `main` and hoping someone else does the backports.
* A **user** who filed an issue can follow it through, and see the fix land in the release they run.
* A **developer** who would rather spend time on innovation than on paperwork can do exactly that.

A community gets strength from its diversity only when each of those
voices can actually land a change. Tools that lower the barrier widen
the circle.


## Focus on the work that matters

Handling the mechanics frees people for the parts no tool can do:
designing features, chasing hard bugs, reviewing carefully, and writing
docs that teach. Innovation comes from attention, and attention spent
on branch names and tracker fields is attention not spent on Ceph.

It also changes what's possible for component leads. A backlog of old
tracker issues is daunting because each one needs research before
anyone can decide what to do with it. The skill's triage procedure
scrapes a tracker's open issues and gives each one a verdict with
evidence: already done on `main`, about something since removed, a
duplicate, still valid and small, still valid and larger, owned by
someone active, or in need of a developer's input. The lead then
decides one issue at a time, with the evidence in front of them.

I've been doing this with the Documentation tracker, which had 215 open
issues. So far 75 have been decided: 60 closed as already done,
duplicates, or moot, and 15 more with fixes open or merged. In October
I opened 34 PRs against `main` and 47 backport PRs. I could not have
done that by hand in the hours I have, and as some of you know, I
already rarely sleep.


## Get the skill

The skill is licensed under Apache 2.0. It needs Python 3, Git, a
`ceph/ceph` clone with your fork as `origin`, the GitHub CLI
authenticated to github.com, and a tracker.ceph.com API key for tracker
writes. It follows the open skill format, so it works with agents that
read `SKILL.md` skills. I use it with Claude Code.

You can find it at **TODO: public link**. Please try it, break it, and
send fixes. Like Ceph itself, it gets better with more hands.


## Many hands

Ceph takes its name from the cephalopods, and our releases are named
for them too. They do remarkable things with many arms working at once.
Our community works the same way: the more people who can reach in and
help, the stronger Ceph becomes. Let's make it easy for every one of us
to contribute.
