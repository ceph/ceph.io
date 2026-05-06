---
title: "From Laminated Pages to Petabytes: Why I'm Joining the Ceph Foundation"
date: 2026-05-06
author: Emmanuel Ameh
tags:
  - ceph
  - community
---

Hello, Ceph Community\! I'm Emmanuel Ameh, and I'm thrilled to be joining as your new Technical Writer. My path into technical writing started during a university internship at a manufacturing plant, where I was handed a problem that, looking back, shaped how I think about documentation to this day. The first piece of documentation I wrote was a one-page troubleshooting guide. It was a simple list of common production-line issues and their fixes, taped to a workstation. But it worked. Operators stopped escalating the same problems, uptime held steady, and that single laminated page did the job of a dozen phone calls.

I think about that page a lot. It wasn't elegant. It wasn't comprehensive. It didn't win any awards. But it sat exactly where the people who needed it could find it, and it told them exactly what to do. That, to me, is what good documentation looks like, whether it's protecting a production line or a petabyte-scale storage cluster.

That experience taught me my core philosophy: good documentation isn't measured by how thorough it looks. It's measured by what it lets people *do*. A doc that keeps a cluster running is worth more than a hundred pages nobody reads.

That belief is what brings me to the Ceph community today. 

## My Approach: Test-Driven Documentation

My background is in enterprise software and developer advocacy, where I've focused on making complex systems feel approachable. I treat usability as seriously as technical accuracy. To me, a "perfectly correct" doc that a user can't follow is a broken feature.

I advocate for test-driven documentation. In practice, this means:

* **Validation:** Running every command and workflow in a clean environment to ensure it actually works. If a tutorial says "run this, and you'll see X," then somewhere, on a fresh install, I should be able to run it and see X. If I can't, neither can the reader.  
* **Friction Logging:** Identifying the exact moment a newcomer gets stuck and smoothing that path. The most valuable feedback I can get is "I gave up here, and this is why."  
* **Modular Architecture:** Organizing information so you find the "how-to" immediately, with the "why-it-works" just a click away. Operators in the middle of an incident shouldn't have to read three pages of theory to recover a degraded cluster.

This matters more for a project like Ceph than for most. When documentation fails for a CRUD app, someone files a support ticket. When documentation fails for a storage system, data is at stake.

## Why Ceph?

Ceph sits at an incredible intersection where small configuration decisions can have large operational consequences. Ceph is a deeply technical infrastructure that many people depend on. Research labs, cloud providers, hospitals, universities, and enterprises all run on Ceph, and most of their users have no idea. That's the kind of project I want to work on. Software that is so reliable it becomes invisible.

I'm also drawn to the Ceph project because it operates in the territory where documentation matters most. Distributed systems are hard. The mental model required to understand placement groups, CRUSH maps, and OSD recovery isn't something you absorb in an afternoon. The key difference between a confident operator and a terrified one is whether the documentation addressed their specific needs.

I'll be honest. Like any mature project, Ceph has a "gravity" of knowledge that can feel intimidating. My goal is to do the translation work: taking the nuanced engineering expertise living in maintainers' heads and shaping it into guidance that someone two time zones away can act on at 2 a.m. when an OSD is degraded.

## What I'm Focused On

In my first few months, I'll be doing more listening than writing. Specifically, I want to:

* **Work through the documentation issue backlog.** There are a significant number of open documentation issues, and many of them represent real friction that real users have already flagged. Steadily closing them out is one of the highest-leverage things I can do early on.  
* **Identify the "fall-off cliffs"** where readers commonly give up, get confused, or start guessing.  
* **Talk to contributors and operators** about what's missing, what's outdated, and what they wish existed.  
* **Build a roadmap** for documentation improvements that's transparent, prioritized, and grounded in real user needs.

You won't see me rewriting things for the sake of rewriting them. Where the docs already work well, I'll leave them alone. Where they don't, I'd rather fix the right problem slowly than the wrong one quickly.

## How You Can Help Me

Good documentation is a collaborative effort. To help me hit the ground running, I'm looking for three things from you:

1. **Share the "Why":** When reviewing a doc change, the reasoning behind a design decision is often more valuable than the decision itself. If you've ever explained a feature in a Slack thread or a mailing list reply, that explanation is gold to me.  
2. **Highlight the Friction:** Tell me where the docs let you down. If you had to dive into the source code because a section was confusing, that is where I need to spend my time. The same applies to sections you skip, doubt, or wish were present.  
3. **Give Blunt Feedback:** I'd much rather get a "this is wrong/missing context" review than a polite one. Push back on my drafts. The faster I learn what doesn't work, the faster the docs get better for everyone.

In return, here's what you can expect from me. I'll show my work. I'll explain my reasoning. I'll ask questions before making big changes. And I'll treat the docs the same way I'd want code I depend on to be treated: with care, with tests, and with a clear changelog.

## Let's Connect

I'm not just here to write; I'm here to learn this project deeply alongside you. Whether you're spinning up your first cluster or operating at petabyte scale, I want to make sure the documentation supports you. Great infrastructure only reaches its potential when people can actually use it. My job is to close that gap, and I'm looking forward to doing that with the Ceph community.

* **Find me on Slack/IRC:** `@eameh`  
* **Flag an issue:** Tag me in any documentation PRs or issues on GitHub.  
* **Send me your war stories:** If you've ever fought the docs and won, I want to know how you did it. 


I joined the Ceph Foundation because I believe that great infrastructure deserves great documentation, and that the second is what lets the first reach the people who need it. I'm looking forward to building that with you.  
