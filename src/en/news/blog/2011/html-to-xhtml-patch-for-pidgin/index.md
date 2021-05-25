---
title: "HTML to XHTML patch for pidgin"
date: "2011-03-09"
author: "admin"
tags: 
  - "planet"
---

There are many ways to contribute to Free Software and the path depend both on the people running the project and on the habits of the contributor. This is the story of a trhee lines patch fixing an bug in the libpurple C library of pidgin. A few hours mostly dedicated to finding the proper context and making sure the resulting work met the quality standards of the project.  

### Looking for bugs

The desired contribution was to fix a bug reported recently or required for the next release. The path to find the list of active bugs from the [home page](http://pidgin.im/) is:

- [Development](http://developer.pidgin.im/)
- [View Tickets](http://developer.pidgin.im/report)
- [Active Bugs by Component](http://developer.pidgin.im/report/13)

It turns out that there are many components and many bugs. Reading the titles was not inspiring. Going to [Custom Query](http://developer.pidgin.im/query) and playing with filters on the IRC and libpurple components showed two candidates.

- [connecting to irc floods irc server](http://developer.pidgin.im/ticket/11089) and its duplicate [Excess Flood on reconnect](http://developer.pidgin.im/ticket/11726) is open and confirmed since 2.6.4. It is not targeted for release.
- [IM HTML->XHTML conversion chokes on font families with quotes](http://developer.pidgin.im/ticket/13413) has been reported and confirmed recently.

Going to the irc.freenode.net#pidgin IRC channel, it turned out that the last conributor to the [HTML -> XHTML](http://developer.pidgin.im/ticket/13413) ticket, darkrain42. Was present at the time:

(10:34:46 PM) dachary: darkrain: would you like me to give a shot at http://developer.pidgin.im/ticket/13413 ?
(12:13:02 AM) darkrain: dachary: Yes, if you're volunteering (re: #13413)
(12:16:08 AM) darkrain: Don't let that function scare you off too much ;)

After a quick look it also turned out that it was a bug that required less expertise to fix and more likely to be closed by a newcomer to the project.

### Finding and installing the development environment

A patch is best applied to the latest VCS version so that it can be integrated for the next release. The instructions from the [Using Pidgin Monotone](http://developer.pidgin.im/wiki/UsingPidginMonotone) page were successfully followed. It takes a few minutes to download and upgrade locally.  
**darkrain** hinted that the relevant code was left untouched since version 2.7.9 and could therefore be worked on from older sources without jeopardizing the integration for the next release. The monotone repository was temporarily left aside and the 2.7.9 sources extracted and compiled as follows, on a Debian GNU/Linux unstable:

$ apt-get source libpurple0
dpkg-source: info: extracting pidgin in pidgin-2.7.9
$ apt-get build-dep pidgin
$ cd pidgin-2.7.9 ; debuild -uc -us

There are a few tests in the pidgin-2.7.9/libpurple/tests directory. However, they were not run when trying

make check

which is the customary way to run tests in softwares using autotools, [GNU build system](http://en.wikipedia.org/wiki/GNU_build_system). it turns out that tests are deactivated if [check](http://sourceforge.net/projects/check) is not installed at configuration time. After installing it and rebuilding, make check compiled the tests but failed on core dump. Since the tests were not run by default, the odds of them being broken were not null and this was confirmed shortly afterward on IRC:

(09:41:49 AM) thundpressor: dachary: I believe there was one that was broken in 2.7.9
(09:41:58 AM) thundpressor: That or 2.7.8, I forget which
(09:42:26 AM) thundpressor: Oh, yeah, was in 2.7.9, fixed in 2.7.10

The 2.7.9 was abandonned and since there was no 2.7.10 stable package yet, the working environment was switched back to monotone and the tests ran ok:

$ bash autogen.sh
$ ./configure
$ make
$ cd libpurple
$ make check
100%: Checks: 88, Failures: 0, Errors: 0
PASS: check\_libpurple

### test and patch

Standing on solid grounds, a small test was added to libpurpule/test/test\_util.c which happened to contain a test case for the purple\_markup\_html\_to\_xhtml function:

	purple\_markup\_html\_to\_xhtml("<font face="'Times New Roman'">x</font>", &xhtml, &plaintext);
	assert\_string\_equal\_free("x", plaintext);
	assert\_string\_equal\_free("<span style='font-family: "Times New Roman";'>x</span>", xhtml);

The test failed, confirming the bug report. The [proposed patch](http://developer.pidgin.im/attachment/ticket/13413/13413.patch) is minimal and it comes with a test that shows it does the job. The sample tests files of [tidy](http://www.w3.org/People/Raggett/tidy/) were examined for inspiration on how to prevent that kind of problem instead of just this specific problem. But the purple\_markup\_html\_to\_xhtml does not seem to be developed with genericity in mind.  
After the test confirmed that the patch fixed the bug, it was reported in the [corresponding ticket](http://developer.pidgin.im/ticket/13413#comment:3).

### patch integration

There are a lot of patches waiting to be comited to the main repository. To give it a chance, it was announced on the irc.freenode.net#pidgin IRC channel.

(01:11:37 PM) dachary: KingAnt: thundpressor darkrain here is a minuscule patch for review http://developer.pidgin.im/ticket/13413#comment:3

and again a few hours later in PM to darkrain who said the day before that could be reached if needed in the context of this patch resolution.

(04:01:13 PM) dachary@jabber.org/Home: http://developer.pidgin.im/ticket/13413#comment:3 I would like your input on this 3 lines patch.
(04:02:16 PM) dachary@jabber.org/Home: If you think it needs work and must address the issue differently, I will look into it.

A few hours later, [a comment](http://developer.pidgin.im/ticket/13413#comment:4) from darkrain on the ticket system suggested to extend the patch to fix similar problems. A few hours work were necessary to come up with a suite of tests demonstrating most of the function behavior. Quotes and entities substitutions were handled for all ”font” attributes as well as the ”img” and ”a” elements which had similar problems. The next day darkrain [reviewed the patch](http://developer.pidgin.im/ticket/13413#comment:6) which led to the [final](http://developer.pidgin.im/attachment/ticket/13413/quotes.2.patch) candidate.

Source: Dachary ([HTML to XHTML patch for pidgin](https://blog.dachary.org/2011/03/09/bug-fix-for-pidgin/))
