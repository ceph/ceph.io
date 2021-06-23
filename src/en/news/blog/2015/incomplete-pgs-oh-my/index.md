---
title: "Incomplete PGs -- OH MY!"
date: "2015-03-05"
author: "linuxkidd"
tags: 
  - "incomplete-pg"
  - "pg-recovery"
  - "recovery"
---

I recently had the opportunity to work on a Firefly cluster (0.80.8) in which power outages caused a failure of two OSDs. As with lots of things in technology, that's not the whole story. The manner in which the power outages and OSD failures occurred put the cluster into a state with 5 placement groups (PGs) into an incomplete state. Before I got involved, the failed OSDs had been ejected from the cluster and new OSDs re-deployed in their place.

The good news is that one of the 'failed' OSDs was still readable for the most part and this allowed us to use a new tool to recover the PG contents.

**WARNING: THIS IS A RISKY PROCESS!** Do not attempt this on a production cluster without engaging Red Hat Ceph support. You could cause irreversible data loss in your cluster. ol.LKmainlist>li { padding-top: 5px; } ol.LKmainlist>li:first-line { font-weight: bold; } .LKwarning { padding-left: 30px; }

1. Download the 'ceph-test' package:
    - If running Dumpling, at this time, the tool required for this process is not available on, nor expected to be backported to Ceph Dumpling. Attempting to use the Firefly or Giant releases of the 'ceph-test' package on a Dumpling OSD will almost certainly produce an OSD that cannot function in a Dumpling cluster.
    - If running Firefly (0.80.8 or earlier), please use the Ceph Giant 'ceph-test' package:
        
        - DEB Distros: [http://ceph.com/debian-giant/pool/main/c/ceph/](http://ceph.com/debian-giant/pool/main/c/ceph/ "Ceph Giant Debian repository")
        - RPM Distros: [http://ceph.com/rpm-giant/](http://ceph.com/rpm-giant/ "Ceph Giant RPM repository")
        
        **_NOTE:_** A pull request has been submitted to backport all tools introduced in Giant back to Firefly. As of this writing, there is no ETA on their availability within a Firefly release, but you should try the 'ceph-test' package of 0.80.9 and later releases of Firefly before moving to the Giant release.
    - If running Giant or newer, please use the 'ceph-test' package for your specific Ceph release.
2. Install the newly downloaded packages:
    - DEB Distros: `# dpkg -i ceph-test*.deb`
    - RPM Distros: `# rpm -ivh ceph-test*.rpm`
3. Mount the old OSD disk: `# mkdir /mnt/old # mount /dev/sdX1 /mnt/old`
4. Determine the PGs that you need: `# ceph health detail | grep incomplete` _Sample:_
    
    \# ceph health detail | grep incomplete
    pg 6.399 is incomplete, acting \[18,19,9\]
    pg 3.16f is incomplete, acting \[20,8,21\]
    pg 3.c2 is incomplete, acting \[30,25,4\]
    pg 6.84 is incomplete, acting \[28,21,8\]
    pg 3.6a is incomplete, acting \[30,27,8\]
    
5. See if the incomplete PGs are on the old OSD: `# ls -ld /mnt/old/current/<pg.id>_head` _Sample:_ `# ls -ld /mnt/old/current/6.399_head drwxr-xr-x 2 root root 6 Feb 6 17:22 /mnt/old/current/6.399_head`
6. Determine the size of the PG contents on disk: `# du -sh /mnt/old/current/<pg.id>_head` _Sample:_ `# du -sh /mnt/old/current/6.399_head 115M /mnt/old/current/6.399_head`
7. Confirm you have enough space on your intended export path: `# df -h ./` _Sample:_ `# df -h ./ Filesystem Size Used Avail Use% Mounted on /dev/sde4 60G 9.7G 47G 18% /`
8. Export the PG in question: `# ceph_objectstore_tool --op export --pgid <pg.id> --data-path /mnt/old --journal-path /mnt/old/journal --file <pg.id>.export`
    
    **_NOTE_**: If you get a stack trace similar to the below, you likely have a corrupt journal. You can overcome this issue by adding the '--skip-journal-replay' option, but note that any data in journal which hadn't been flushed to the backing filestore will be missing from the export. This beats loosing the entire contents of the PG in most cases. In the cluster I was working on, the OSD journal was indeed corrupt, thus in my sample command below, I did use the '--skip-journal-replay' option.
    
    _Sample crash for Journal corruption:_
    
    os/FileJournal.cc: In function 'void FileJournal::wrap\_read\_bl(off64\_t, int64\_t, ceph::bufferlist\*, off64\_t\*)' thread 7f219004a780 time 2015-02-26 19:06:41.087861
    os/FileJournal.cc: 1638: FAILED assert(0)
    ceph version 0.87.1 (283c2e7cfa2457799f534744d7d549f83ea1335e)
    1: (ceph::\_\_ceph\_assert\_fail(char const\*, char const\*, int, char const\*)+0x7f) \[0xae272f\]
    2: (FileJournal::wrap\_read\_bl(long, long, ceph::buffer::list\*, long\*)+0x2aa) \[0x9b12ca\]
    3: (FileJournal::do\_read\_entry(long, long\*, ceph::buffer::list\*, unsigned long\*, std::ostream\*, FileJournal::entry\_header\_t\*)+0x2f0) \[0x9bb6b0\]
    4: (FileJournal::read\_entry(ceph::buffer::list&, unsigned long&, bool\*)+0x29e) \[0x9bc25e\]
    5: (FileJournal::open(unsigned long)+0x6b5) \[0x9b9d95\]
    6: (JournalingObjectStore::journal\_replay(unsigned long)+0x139) \[0x930729\]
    7: (FileStore::mount()+0x31d7) \[0x905c97\]
    8: (main()+0x1774) \[0x61c7f4\]
    9: (\_\_libc\_start\_main()+0xed) \[0x7f218cd2876d\]
    10: ceph\_objectstore\_tool() \[0x624b09\]
    
    _Sample PG export:_ `# ceph_objectstore_tool --op export --pgid 6.399 --data-path /mnt/old --journal-path /mnt/old/journal --skip-journal-replay --file 6.399.export Exporting 6.399 Read b9183399/rb.0.599b0.7b1f49e.000000000cf3/head//6 Read c76e7399/rb.0.599b0.7b1f49e.000000000bd5/head//6 Read 3a00a399/rb.0.599b9.9537f2e.000000000480/head//6 Read 18c9c399/rb.0.599b9.9537f2e.0000000018fb/head//6 Read eb51799/rb.0.599b9.9537f2e.000000001c75/head//6 Read 84cc2799/rb.0.599b9.9537f2e.000000000682/head//6 Read 95235799/rb.0.599b0.7b1f49e.000000001b83/head//6 Read 7b826799/rb.0.599b9.9537f2e.000000002076/head//6 Read a6549799/rb.0.599b9.9537f2e.000000000ec1/head//6 Read 3566d799/rb.0.599b0.7b1f49e.000000001cec/head//6 Read 93ced799/rb.0.599b6.664d4c7e.0000000007f2/head//6 Read 9bb2e799/rb.0.599b9.9537f2e.0000000014d8/head//6 Read 8ddd0b99/rb.0.599b9.9537f2e.00000001b801/head//6 Read 13c72b99/rb.0.599b0.7b1f49e.0000000009dc/head//6 Read 372d2b99/rb.0.599b0.7b1f49e.00000000102e/head//6 Read beb3b99/rb.0.599b9.9537f2e.0000000016ee/head//6 Read 6ba1ab99/rb.0.599b6.664d4c7e.000000005602/head//6 Read df5afb99/rb.0.599b0.7b1f49e.00000000087d/head//6 Read a32f0f99/rb.0.599b9.9537f2e.0000000003e4/head//6 Read 6f52f99/rb.0.599b6.664d4c7e.00000001c003/head//6 Read a11b3f99/rb.0.599b9.9537f2e.0000000005a5/head//6 Read e2154f99/rb.0.599b0.7b1f49e.0000000009bb/head//6 Read a7946f99/rb.0.599b6.664d4c7e.000000000f80/head//6 Read 69638f99/rb.0.599b9.9537f2e.00000001f3ff/head//6 Read 80159f99/rb.0.599b0.7b1f49e.000000001c31/head//6 Read 30b1af99/rb.0.599b6.664d4c7e.000000001365/head//6 Read 919fbf99/rb.0.599b9.9537f2e.000000001266/head//6 Read a1fcf99/rb.0.599b0.7b1f49e.00000000115a/head//6 Read d5bbff99/rb.0.599b0.7b1f49e.00000000082b/head//6 Export successful`
9. Set the 'noout' flag: `# ceph osd set noout`
10. If you previously attempted a linux file copy (cp, rsync, etc) of the PG contents, the PG contents must be removed from it's acting OSDs.
    
    **_NOTE_**: I, along with many others I'm sure.. tried this route and failed. I've attempted both 'cp -r src/current/6.399\_head dest/current/6.399\_head' and.. thinking the failure was due to lack of xattrs, I even used 'rsync -aXP src/current/6.399\_head/ dest/current/6.399\_head/'. The bare files in the PG folder structure are only part of what's required for operation of the data within the cluster. There are other bits of metadata that are not captured by linux file copy tools, thus making the data on-disk unusable. The data copied with linux file copy tools will result in OSD process crashes on the next start-up.
    1. Confirm which OSDs are acting for the PG in question (from output at step 4): _Sample output:_`pg 6.399 is incomplete, acting [18,19,9]` This indicates OSDs 18, 19 and 9 are acting to store that PG 6.399 (the OSD id's are inside the \[\]'s).
    2. Determine the host which stores the OSD: `# ceph osd find ##` _Sample:_ `# ceph osd find 18 { "osd": 18, "ip": "192.168.22.5:6801\/3806", "crush_location": { "host": "osdnode2", "root": "default"}}`
    3. SSH to the host (by hostname or IP address provided by 'ceph osd find'). `# ssh <hostname or IP addr>`
    4. Stop the OSD process:
        - Upstart: `# stop ceph-osd id=##`
        - Sysvinit: `# service ceph stop osd.##`
    5. Move the contents of the PG out of the way: `# mkdir # mv /var/lib/ceph/osd/ceph-##/current/<pg.id>_head` _Sample:_`# mkdir /root/backup # mv /var/lib/ceph/osd/ceph-18/current/6.399_head /root/backup`
    6. Start the OSD
        - Upstart: `# start ceph-osd id=##`
        - Sysvinit: `# service ceph start osd.##`
    7. Repeat steps 10.b through 10.f for the other acting OSDs (in the above example, osds 19 and 9).
11. Stop the OSD process where you're importing the PG:
    - Upstart: `# stop ceph-osd id=##`
    - Sysvinit: `# service ceph stop osd.##`

## \-=- WARNING -=- WARNING -=- WARNING -=- WARNING -=- WARNING -=-

Risk of irreversible cluster data loss from here on. You should strongly consider contacting Red Hat Ceph support prior to proceeding, especially on a production cluster!

The **highly recommended** way of minimizing the risk is by deploying a NEW OSD and setting it's weight to 0 (ceph osd crush reweight osd.# 0) to prevent data movement toward the new OSD, then importing the PG into that new, 0 weighted, OSD. Once the process is complete, you can remove that new OSD from the cluster. This NEW temporary OSD could be deployed to a spare partition, or even to a directory on an existing OSD drive.

_Sample temp OSD creation on existing OSD drive:_ `# mkdir /var/lib/ceph/osd/ceph-0/tmposd/ # ceph-disk prepare /var/lib/ceph/osd/ceph-0/tmposd/ # ceph-disk activate /var/lib/ceph/osd/ceph-0/tmposd/ # ceph osd crush reweight osd.$(cat /var/lib/ceph/osd/ceph-0/tmposd/whoami) 0` To get the OSD id of the new temporary OSD: `cat /var/lib/ceph/osd/ceph-0/tmposd/whoami`

## \-=- WARNING -=- WARNING -=- WARNING -=- WARNING -=- WARNING -=-

16. Import the PG in question **_NOTE:_** The import need \*NOT\* be done on one of the OSDs to which the PG maps. The data will backfill to the proper location upon OSD process start-up.
    
    `# ceph_objectstore_tool --op import --data-path /var/lib/ceph/osd/ceph-## --journal-path /var/lib/ceph/osd/ceph-##/journal --file <pg.id>.export`
    
    _Sample PG import:_ `# ceph_objectstore_tool --op import --data-path /var/lib/ceph/osd/ceph-22 --journal-path /var/lib/ceph/osd/ceph-22/journal --file 6.399.export Importing pgid 6.399 Write b9183399/rb.0.599b0.7b1f49e.000000000cf3/head//6 Write c76e7399/rb.0.599b0.7b1f49e.000000000bd5/head//6 Write 3a00a399/rb.0.599b9.9537f2e.000000000480/head//6 Write 18c9c399/rb.0.599b9.9537f2e.0000000018fb/head//6 Write eb51799/rb.0.599b9.9537f2e.000000001c75/head//6 Write 84cc2799/rb.0.599b9.9537f2e.000000000682/head//6 Write 95235799/rb.0.599b0.7b1f49e.000000001b83/head//6 Write 7b826799/rb.0.599b9.9537f2e.000000002076/head//6 Write a6549799/rb.0.599b9.9537f2e.000000000ec1/head//6 Write 3566d799/rb.0.599b0.7b1f49e.000000001cec/head//6 Write 93ced799/rb.0.599b6.664d4c7e.0000000007f2/head//6 Write 9bb2e799/rb.0.599b9.9537f2e.0000000014d8/head//6 Write 8ddd0b99/rb.0.599b9.9537f2e.00000001b801/head//6 Write 13c72b99/rb.0.599b0.7b1f49e.0000000009dc/head//6 Write 372d2b99/rb.0.599b0.7b1f49e.00000000102e/head//6 Write beb3b99/rb.0.599b9.9537f2e.0000000016ee/head//6 Write 6ba1ab99/rb.0.599b6.664d4c7e.000000005602/head//6 Write df5afb99/rb.0.599b0.7b1f49e.00000000087d/head//6 Write a32f0f99/rb.0.599b9.9537f2e.0000000003e4/head//6 Write 6f52f99/rb.0.599b6.664d4c7e.00000001c003/head//6 Write a11b3f99/rb.0.599b9.9537f2e.0000000005a5/head//6 Write e2154f99/rb.0.599b0.7b1f49e.0000000009bb/head//6 Write a7946f99/rb.0.599b6.664d4c7e.000000000f80/head//6 Write 69638f99/rb.0.599b9.9537f2e.00000001f3ff/head//6 Write 80159f99/rb.0.599b0.7b1f49e.000000001c31/head//6 Write 30b1af99/rb.0.599b6.664d4c7e.000000001365/head//6 Write 919fbf99/rb.0.599b9.9537f2e.000000001266/head//6 Write a1fcf99/rb.0.599b0.7b1f49e.00000000115a/head//6 Write d5bbff99/rb.0.599b0.7b1f49e.00000000082b/head//6 Import successful`
17. Start the OSD process:
    - Upstart: `# start ceph-osd id=##`
    - Sysvinit: `# service ceph start osd.##`
18. Monitor the cluster for the PG to disappear from the 'incomplete' count and show up in 'backfilling' and then 'active+clean' counts: `watch -n 1 ceph -s` Press Ctrl-C to exit the 'watch' session
19. Repeat for each additional PG id that needs to be recovered.
20. Remove your temporary OSD (if used -- HIGHLY RECOMMENDED, See Warning section above)
    1. Stop the OSD process
        - Upstart: `# stop ceph-osd id=##`
        - Sysvinit: `# service ceph stop osd.##`
    2. Remove the OSD from Crush, OSD and Auth areas of Ceph:`# ceph osd crush remove osd.## # ceph osd rm osd.## # ceph auth del osd.##`
    3. Remove the contents of the OSD so that it will not be remounted / activated on reboot: `rm -rf /var/lib/ceph/osd/ceph-##/*` **Make sure you're deleting the right OSD directory!!!**
21. Once all recovery complete, remove the 'noout' flag: `ceph osd unset noout`
22. Once you're satisified with the state of the cluster, you can go back and delete all the PG directories from the backups you created. _Sample:_ `# ssh osdnode2 rm -f /root/backup/*`

If all went well, then your cluster is now back to 100% active+clean / HEALTH\_OK state. Note that you may still have inconsistent or stale data stored inside the PG. This is because the state of the data on the OSD that failed is a bit unknown, especially if you had to use the '--skip-journal-replay' option on the export. For RBD data, the client which utilizes the RBD should run a filesystem check against the RBD.

I cannot stress enough that this process is very dangerous on a production cluster and really should be performed only with help from Red Hat Ceph support.
