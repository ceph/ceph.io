---
title: "Documentation for ceph-rest-api"
date: "2014-01-01"
author: "dmsimard"
tags: 
  - "ceph"
  - "planet"
---

I learned that there was a Ceph REST API and I [experimented](http://dmsimard.com/2013/12/21/experimenting-with-the-ceph-rest-api/) with it a bit.

I said the documentation was lacking and I take that back, I didn’t catch on that the API documentation was built into the application. I opened a pull request to make the documentation a bit more explicit about that: [https://github.com/ceph/ceph/pull/1026](https://github.com/ceph/ceph/pull/1026)

Here’s what the API documentation currently looks like:  

| Possible commands: | Method | Description |
| --- | --- | --- |
| auth/add?entity=entity(<string>)&caps={c  
aps(<string>) \[<string>...\]} | PUT | add auth info for <entity> from input file, or random key if no input given, and/or any caps specified in the command |
| auth/caps?entity=entity(<string>)&caps=c  
aps(<string>) \[<string>...\] | PUT | update caps for <name> from caps specified in the command |
| auth/del?entity=entity(<string>) | PUT | delete all caps for <name> |
| auth/export?entity={entity(<string>)} | GET | write keyring for requested entity, or master keyring if none given |
| auth/get?entity=entity(<string>) | GET | write keyring file with requested key |
| auth/get-key?entity=entity(<string>) | GET | display requested key |
| auth/get-or-create?entity=entity(<string  
\>)&caps={caps(<string>) \[<string>...\]} | PUT | add auth info for <entity> from input file, or random key if no input given, and/or any caps specified in the command |
| auth/get-or-create-key?entity=entity(<st  
ring>)&caps={caps(<string>)  
\[<string>...\]} | PUT | get, or add, key for <name> from system/caps pairs specified in the command. If key already exists, any given caps must match the existing caps for that key. |
| auth/import | PUT | auth import: read keyring file from -i <file> |
| auth/list | GET | list authentication state |
| auth/print-key?entity=entity(<string>) | GET | display requested key |
| auth/print\_key?entity=entity(<string>) | GET | display requested key |
| tell/<osdid-or-pgid>/bench?count={count(  
<int>)}&size={size(<int>)} | PUT | OSD benchmark: write <count> <size>-byte objects, (default 1G size 4MB). Results in log. |
| compact | PUT | cause compaction of monitor's leveldb storage |
| config-key/del?key=key(<string>) | PUT | delete <key> |
| config-key/exists?key=key(<string>) | GET | check for <key>'s existence |
| config-key/get?key=key(<string>) | GET | get <key> |
| config-key/list | GET | list keys |
| config-key/put?key=key(<string>)&val={va  
l(<string>)} | PUT | put <key>, value <val> |
| tell/<osdid-or- 
pgid>/cpu\_profiler?arg=arg(status|flush) | PUT | run cpu profiling on daemon |
| tell/<osdid-or-pgid>/debug/kick\_recovery  
\_wq?delay=delay(<int\[0-\]>) | PUT | set osd\_recovery\_delay\_start to <val> |
| tell/<osdid-or-pgid>/debug\_dump\_missing?  
filename=filename(<outfilename>) | GET | dump missing objects to a named file |
| df?detail={detail} | GET | show cluster free space stats |
| tell/<osdid-or- 
pgid>/dump\_pg\_recovery\_stats | GET | dump pg recovery statistics |
| tell/<osdid-or-pgid>/flush\_pg\_stats | PUT | flush pg stats |
| fsid | GET | show cluster FSID/UUID |
| health?detail={detail} | GET | show cluster health |
| tell/<osdid-or-pgid>/heap?heapcmd=heapcm  
d(dump|start\_profiler|stop\_profiler|rele  
ase|stats) | PUT | show heap usage info (available only if compiled with tcmalloc) |
| heap?heapcmd=heapcmd(dump|start\_profiler  
|stop\_profiler|release|stats) | PUT | show heap usage info (available only if compiled with tcmalloc) |
| tell/<osdid-or-pgid>/injectargs?injected  
\_args=injected\_args(<string>)  
\[<string>...\] | PUT | inject configuration arguments into running OSD |
| injectargs?injected\_args=injected\_args(<  
string>) \[<string>...\] | PUT | inject config arguments into monitor |
| tell/<osdid-or-pgid>/list\_missing?offset  
\={offset(<string>)} | GET | list missing objects on this pg, perhaps starting at an offset given in JSON |
| tell/<osdid-or-pgid>/list\_missing?offset  
\={offset(<string>)} | PUT | list missing objects on this pg, perhaps starting at an offset given in JSON |
| log?logtext=logtext(<string>)  
\[<string>...\] | PUT | log supplied text to the monitor log |
| tell/<osdid-or- 
pgid>/mark\_unfound\_lost?mulcmd=revert | PUT | mark all unfound objects in this pg as lost, either removing or reverting to a prior version if one is available |
| tell/<osdid-or-pgid>/mark\_unfound\_lost/r  
evert?mulcmd=revert | PUT | mark all unfound objects in this pg as lost, either removing or reverting to a prior version if one is available |
| mds/add\_data\_pool?pool=pool(<string>) | PUT | add data pool <pool> |
| mds/cluster\_down | PUT | take MDS cluster down |
| mds/cluster\_up | PUT | bring MDS cluster up |
| mds/compat/rm\_compat?feature=feature(<in  
t\[0-\]>) | PUT | remove compatible feature |
| mds/compat/rm\_incompat?feature=feature(<  
int\[0-\]>) | PUT | remove incompatible feature |
| mds/compat/show | GET | show mds compatibility settings |
| mds/deactivate?who=who(<string>) | PUT | stop mds |
| mds/dump?epoch={epoch(<int\[0-\]>)} | GET | dump info, optionally from epoch |
| mds/fail?who=who(<string>) | PUT | force mds to status failed |
| mds/getmap?epoch={epoch(<int\[0-\]>)} | GET | get MDS map, optionally from epoch |
| mds/newfs?metadata=metadata(<int\[0-\]>)&d  
ata=data(<int\[0-\]>)&sure={--yes-i  
\-really-mean-it} | PUT | make new filesystom using pools <metadata> and <data> |
| mds/remove\_data\_pool?pool=pool(<string>) | PUT | remove data pool <pool> |
| mds/rm?gid=gid(<int\[0-\]>)&who=who(<name  
(type.id)>) | PUT | remove nonactive mds |
| mds/rmfailed?who=who(<int\[0-\]>) | PUT | remove failed mds |
| mds/set?key=allow\_new\_snaps&sure={sure(<  
string>)} | Unknown | set <key> |
| mds/set\_max\_mds?maxmds=maxmds(<int\[0-\]>) | PUT | set max MDS index |
| mds/set\_state?gid=gid(<int\[0-\]>)&state=s  
tate(<int\[0-20\]>) | PUT | set mds state of <gid> to <numeric-state> |
| mds/setmap?epoch=epoch(<int\[0-\]>) | PUT | set mds map; must supply correct epoch number |
| mds/stat | GET | show MDS status |
| mds/stop?who=who(<string>) | PUT | stop mds |
| mds/tell?who=who(<string>)&args=args(<st  
ring>) \[<string>...\] | PUT | send command to particular mds |
| mds/unset?key=allow\_new\_snaps&sure={sure  
(<string>)} | Unknown | unset <key> |
| mon/add?name=name(<string>)&addr=addr(<I  
Paddr\[:port\]>) | PUT | add new monitor named <name> at <addr> |
| mon/dump?epoch={epoch(<int\[0-\]>)} | GET | dump formatted monmap (optionally from epoch) |
| mon/getmap?epoch={epoch(<int\[0-\]>)} | GET | get monmap |
| mon/remove?name=name(<string>) | PUT | remove monitor named <name> |
| mon/stat | GET | summarize monitor status |
| mon\_status | GET | report status of monitors |
| osd/blacklist?blacklistop=blacklistop(ad  
d|rm)&addr=addr(<EntityAddr>)&expire={ex  
pire(<float\[0.0-\]>)} | PUT | add (optionally until <expire> seconds from now) or remove <addr> from blacklist |
| osd/blacklist/ls | GET | show blacklisted clients |
| osd/create?uuid={uuid(<uuid>)} | PUT | create new osd (with optional UUID) |
| osd/crush/add?id=id(<osdname (id|osd.id)  
\>)&weight=weight(<float\[0.0-\]>)&args=arg  
s(<string(goodchars \[A-Za-z0-9-\_.=\])>)  
\[<string(goodchars \[A-Za-z0-9-\_.=\])>...\] | PUT | add or update crushmap position and weight for <name> with <weight> and location <args> |
| osd/crush/add- 
bucket?name=name(<string(goodchars  
\[A-Za-z0-9-\_.\])>)&type=type(<string>) | PUT | add no-parent (probably root) crush bucket <name> of type <type> |
| osd/crush/create-or-move?id=id(<osdname  
(id|osd.id)>)&weight=weight(<float\[0.0-\]  
\>)&args=args(<string(goodchars  
\[A-Za-z0-9-\_.=\])>) \[<string(goodchars  
\[A-Za-z0-9-\_.=\])>...\] | PUT | create entry or move existing entry for <name> <weight> at/to location <args> |
| osd/crush/dump | GET | dump crush map |
| osd/crush/link?name=name(<string>)&args=  
args(<string(goodchars  
\[A-Za-z0-9-\_.=\])>) \[<string(goodchars  
\[A-Za-z0-9-\_.=\])>...\] | PUT | link existing entry for <name> under location <args> |
| osd/crush/move?name=name(<string(goodcha  
rs \[A-Za-z0-9-\_.\])>)&args=args(<string(g  
oodchars \[A-Za-z0-9-\_.=\])>)  
\[<string(goodchars \[A-Za-z0-9-\_.=\])>...\] | PUT | move existing entry for <name> to location <args> |
| osd/crush/remove?name=name(<string(goodc  
hars \[A-Za-z0-9-\_.\])>)&ancestor={ancesto  
r(<string(goodchars \[A-Za-z0-9-\_.\])>)} | PUT | remove <name> from crush map (everywhere, or just at <ancestor> |
| osd/crush/reweight?name=name(<string(goo  
dchars \[A-Za-z0-9-\_.\])>)&weight=weight(<  
float\[0.0-\]>) | PUT | change <name>'s weight to <weight> in crush map |
| osd/crush/rm?name=name(<string(goodchars  
\[A-Za-z0-9-\_.\])>)&ancestor={ancestor(<st  
ring(goodchars \[A-Za-z0-9-\_.\])>)} | PUT | remove <name> from crush map (everywhere, or just at <ancestor> |
| osd/crush/rule/create- 
simple?name=name(<string(goodchars \[A-Za  
\-z0-9-\_.\])>)&root=root(<string(goodchars  
\[A-Za-z0-9-\_.\])>)&type=type(<string(good  
chars \[A-Za-z0-9-\_.\])>) | PUT | create crush rule <name> in <root> of type <type> |
| osd/crush/rule/dump | GET | dump crush rules |
| osd/crush/rule/list | GET | list crush rules |
| osd/crush/rule/ls | GET | list crush rules |
| osd/crush/rule/rm?name=name(<string(good  
chars \[A-Za-z0-9-\_.\])>) | PUT | remove crush rule <name> |
| osd/crush/set | PUT | set crush map from input file |
| osd/crush/set?id=id(<osdname (id|osd.id)  
\>)&weight=weight(<float\[0.0-\]>)&args=arg  
s(<string(goodchars \[A-Za-z0-9-\_.=\])>)  
\[<string(goodchars \[A-Za-z0-9-\_.=\])>...\] | PUT | update crushmap position and weight for <name> to <weight> with location <args> |
| osd/crush/tunables?profile=profile(legac  
y|argonaut|bobtail|optimal|default) | PUT | set crush tunables values to <profile> |
| osd/crush/unlink?name=name(<string(goodc  
hars \[A-Za-z0-9-\_.\])>)&ancestor={ancesto  
r(<string(goodchars \[A-Za-z0-9-\_.\])>)} | PUT | unlink <name> from crush map (everywhere, or just at <ancestor> |
| osd/deep-scrub?who=who(<string>) | PUT | initiate deep scrub on osd <who> |
| osd/down?ids=ids(<string>) \[<string>...\] | PUT | set osd(s) <id> \[<id>...\] down |
| osd/dump?epoch={epoch(<int\[0-\]>)} | GET | print summary of OSD map |
| osd/find?id=id(<int\[0-\]>) | GET | find osd <id> in the CRUSH map and show its location |
| osd/getcrushmap?epoch={epoch(<int\[0-\]>)} | GET | get CRUSH map |
| osd/getmap?epoch={epoch(<int\[0-\]>)} | GET | get OSD map |
| osd/getmaxosd | GET | show largest OSD id |
| osd/in?ids=ids(<string>) \[<string>...\] | PUT | set osd(s) <id> \[<id>...\] in |
| osd/lost?id=id(<int\[0-\]>)&sure={--yes-i  
\-really-mean-it} | PUT | mark osd as permanently lost. THIS DESTROYS DATA IF NO MORE REPLICAS EXIST, BE CAREFUL |
| osd/ls?epoch={epoch(<int\[0-\]>)} | GET | show all OSD ids |
| osd/lspools?auid={auid(<int>)} | GET | list pools |
| osd/map?pool=pool(<poolname>)&object=obj  
ect(<objectname>) | GET | find pg for <object> in <pool> |
| osd/out?ids=ids(<string>) \[<string>...\] | PUT | set osd(s) <id> \[<id>...\] out |
| osd/pause | PUT | pause osd |
| osd/perf | GET | print dump of OSD perf summary stats |
| osd/pool/create?pool=pool(<poolname>)&pg  
\_num=pg\_num(<int\[0-\]>)&pgp\_num={pgp\_num(  
<int\[0-\]>)}&properties={properties(<stri  
ng(goodchars \[A-Za-z0-9-\_.=\])>)  
\[<string(goodchars  
\[A-Za-z0-9-\_.=\])>...\]} | PUT | create pool |
| osd/pool/delete?pool=pool(<poolname>)&po  
ol2={pool2(<poolname>)}&sure={--yes-i  
\-really-really-mean-it} | PUT | delete pool |
| osd/pool/get?pool=pool(<poolname>)&var=v  
ar(size|min\_size|crash\_replay\_interval|p  
g\_num|pgp\_num|crush\_ruleset) | GET | get pool parameter <var> |
| osd/pool/mksnap?pool=pool(<poolname>)&sn  
ap=snap(<string>) | PUT | make snapshot <snap> in <pool> |
| osd/pool/rename?srcpool=srcpool(<poolnam  
e>)&destpool=destpool(<poolname>) | PUT | rename <srcpool> to <destpool> |
| osd/pool/rmsnap?pool=pool(<poolname>)&sn  
ap=snap(<string>) | PUT | remove snapshot <snap> from <pool> |
| osd/pool/set?pool=pool(<poolname>)&var=v  
ar(size|min\_size|crash\_replay\_interval|p  
g\_num|pgp\_num|crush\_ruleset|hashpspool)&  
val=val(<int>) | PUT | set pool parameter <var> to <val> |
| osd/pool/set-quota?pool=pool(<poolname>)  
&field=field(max\_objects|max\_bytes)&val=  
val(<string>) | PUT | set object or byte limit on pool |
| osd/pool/stats?name={name(<string>)} | GET | obtain stats from all pools, or from specified pool |
| osd/repair?who=who(<string>) | PUT | initiate repair on osd <who> |
| osd/reweight?id=id(<int\[0-\]>)&weight=wei  
ght(<float\[0.0-1.0\]>) | PUT | reweight osd to 0.0 < <weight> < 1.0 |
| osd/reweight-by- 
utilization?oload={oload(<int\[100-\]>)} | PUT | reweight OSDs by utilization \[overload-percentage-for-consideration, default 120\] |
| osd/rm?ids=ids(<string>) \[<string>...\] | PUT | remove osd(s) <id> \[<id>...\] in |
| osd/scrub?who=who(<string>) | PUT | initiate scrub on osd <who> |
| osd/set?key=key(pause|noup|nodown|noout|  
noin|nobackfill|norecover|noscrub  
|nodeep-scrub) | PUT | set <key> |
| osd/setcrushmap | PUT | set crush map from input file |
| osd/setmaxosd?newmax=newmax(<int\[0-\]>) | PUT | set new maximum osd value |
| osd/stat | GET | print summary of OSD map |
| osd/thrash?num\_epochs=num\_epochs(<int\[0- 
\]>) | PUT | thrash OSDs for <num\_epochs> |
| osd/tier/add?pool=pool(<poolname>)&tierp  
ool=tierpool(<poolname>) | PUT | add the tier <tierpool> to base pool <pool> |
| osd/tier/cache-mode?pool=pool(<poolname>  
)&mode=mode(none|writeback|invalidate+fo  
rward|readonly) | PUT | specify the caching mode for cache tier <pool> |
| osd/tier/remove?pool=pool(<poolname>)&ti  
erpool=tierpool(<poolname>) | PUT | remove the tier <tierpool> from base pool <pool> |
| osd/tier/remove- 
overlay?pool=pool(<poolname>) | PUT | remove the overlay pool for base pool <pool> |
| osd/tier/set-overlay?pool=pool(<poolname  
\>)&overlaypool=overlaypool(<poolname>) | PUT | set the overlay pool for base pool <pool> to be <overlaypool> |
| osd/tree?epoch={epoch(<int\[0-\]>)} | GET | print OSD tree |
| osd/unpause | PUT | unpause osd |
| osd/unset?key=key(pause|noup|nodown|noou  
t|noin|nobackfill|norecover|noscrub  
|nodeep-scrub) | PUT | unset <key> |
| pg/debug?debugop=debugop(unfound\_objects  
\_exist|degraded\_pgs\_exist) | GET | show debug info about pgs |
| pg/deep-scrub?pgid=pgid(<pgid>) | PUT | start deep-scrub on <pgid> |
| pg/dump?dumpcontents={dumpcontents(all|s  
ummary|sum|delta|pools|osds|pgs|pgs\_brie  
f) \[all|summary|sum|delta|pools|osds|pgs  
|pgs\_brief...\]} | GET | show human-readable versions of pg map (only 'all' valid with plain) |
| pg/dump\_json?dumpcontents={dumpcontents(  
all|summary|sum|pools|osds|pgs)  
\[all|summary|sum|pools|osds|pgs...\]} | GET | show human-readable version of pg map in json only |
| pg/dump\_pools\_json | GET | show pg pools info in json only |
| pg/dump\_stuck?stuckops={stuckops(inactiv  
e|unclean|stale) \[inactive|unclean|stale  
...\]}&threshold={threshold(<int>)} | GET | show information about stuck pgs |
| pg/force\_create\_pg?pgid=pgid(<pgid>) | PUT | force creation of pg <pgid> |
| pg/getmap | GET | get binary pg map to -o/stdout |
| pg/map?pgid=pgid(<pgid>) | GET | show mapping of pg to osds |
| pg/repair?pgid=pgid(<pgid>) | PUT | start repair on <pgid> |
| pg/scrub?pgid=pgid(<pgid>) | PUT | start scrub on <pgid> |
| pg/send\_pg\_creates | PUT | trigger pg creates to be issued |
| pg/set\_full\_ratio?ratio=ratio(<float\[0.0  
\-1.0\]>) | PUT | set ratio at which pgs are considered full |
| pg/set\_nearfull\_ratio?ratio=ratio(<float  
\[0.0-1.0\]>) | PUT | set ratio at which pgs are considered nearly full |
| pg/stat | GET | show placement group status. |
| tell/<osdid-or-pgid>/query | GET | show details of a specific pg |
| tell/<osdid-or-pgid>/query | GET | show details of a specific pg |
| quorum?quorumcmd=quorumcmd(enter|exit) | PUT | enter or exit quorum |
| quorum\_status | GET | report status of monitor quorum |
| report?tags={tags(<string>)  
\[<string>...\]} | GET | report full status of cluster, optional title tag strings |
| tell/<osdid-or- 
pgid>/reset\_pg\_recovery\_stats | PUT | reset pg recovery statistics |
| scrub | PUT | scrub the monitor stores |
| status | GET | show cluster status |
| sync/force?validate1={--yes-i-really- 
mean-it}&validate2={--i-know-what-i-am- 
doing} | PUT | force sync of and clear monitor store |
| tell?target=target(<name  
(type.id)>)&args=args(<string>)  
\[<string>...\] | PUT | send a command to a specific daemon |
| tell/<osdid-or-pgid>/version | GET | report version of OSD |

Enjoy !
