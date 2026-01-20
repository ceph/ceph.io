---
title: "New in Mimic: centralized configuration management"
date: "2018-06-14"
author: "sage"
---

One of the key new features in Ceph Mimic is the ability to manage the cluster
configuration--which traditionally resides in ceph.conf--centrally.  Starting
in Mimic, cluster configuration is stored not only in ceph.conf, but also in
the monitors' internal databases. This makes it possible to manage and
distribute that configuration information to all daemons and clients in the
system.

Historically, operators who wanted to make a change to the configuration would
have had to edit the ceph.conf files manually, distribute them to the right
nodes, and ensure that the right daemons had been restarted. Most large-scale
users relied on external tools like Ansible, Puppet, or Salt to do this, but
the solution always varied, and there was always a disconnect between what the
config management service thought the configuration should be and what
configuration the running daemon is using (has its local ceph.conf updated? 
has the daemon been restarted?  has the operator injected a configuration
change via the command line?).

This new feature, this central configuration, is designed to bridge this gap.
It provides a robust view into what the configuration should be (and whether the
running configuration matches), and obviates the need for external tools to manage
ceph.conf configuration files.  Most importantly, it provides a simplified
configuration experience out of the box.

Note that the new capability is designed to interoperate with the traditional
way of managing configurations via ceph.conf, so anyone upgrading to Mimic need
not make any changes at all if that is their preference. However, we expect
that the advantages of the new mode of operation will make migration to it
attractive if not irresistible.

## The basics

The monitors jointly manage a configuration database.  The database has the
same semantic structure as a ceph.conf file:

- There are option names (e.g., _osd scrub load threshold_) and values.
- A setting can be associated with a "global" group, and type group that
  applies to all entities of a given type (e.g., "osd" or "mds"), or a specific
  daemon (e.g., "osd.123").

The _ceph config dump_ command outputs the equivalent of the cluster-wide
ceph.conf in table format.

When a daemon or client starts up, it looks for a ceph.conf file as it always
has done. In most cases, a small ceph.conf is still necessary in order to
identify who the monitors are. For example, a typical minimal ceph.conf file
might be:

```
mon host = mon-a.foo.com, mon-b.foo.com, mon-c.foo.com
```

or better yet

```
mon host = ceph-mons.foo.com
```

where _ceph-mons_ is a DNS entry with multiple A records (one for each
monitor). This allows the number and identities of monitors to change over time
without requiring the modification of any configuration files. More
importantly, the configuration file on each is usually static over the lifetime
of the cluster, which simplifies deployment and management.

You can put any other settings you like in ceph.conf as well.  The overall
priority order that Ceph uses to set options is:

1. Compiled-in default values
2. Cluster configuration database (the new thing!)
3. Local ceph.conf file
4. Runtime override (via "ceph daemon <daemon> config set ..." or "ceph tell <daemon> injectargs ...")

## Command line interface

Typing _ceph config -h_ will summarize the set of commands available:

```
$ ceph config -h
[...]
config assimilate-conf                          Assimilate options from a conf, and return a 
                                                 new, minimal conf file
config dump                                     Show all configuration option(s)
config get <who> {<key>}                        Show configuration option(s) for an entity
config help <key>                               Describe a configuration option
config log {<int>}                              Show recent history of config changes
config reset <int>                              Revert configuration to previous state
config rm <who> <name>                          Clear a configuration option for one or more 
                                                 entities
config set <who> <name> <value>                 Set a configuration option for one or more 
                                                entities
config show <who> {<key>}                       Show running configuration
config show-with-defaults <who>                 Show running configuration (including compiled-
                                                 in defaults)
```

A good place to start is simply dumping the cluster configuration:

```
$ ceph config dump
WHO    MASK LEVEL    OPTION                         VALUE RO 
global      advanced mon_pg_warn_min_per_osd        3                                                               
global      advanced osd_pool_default_min_size      1                                                               
global      advanced osd_pool_default_size          1                                                               
  mon       advanced mon_allow_pool_delete          true                                                            
...
```

We can set an option in the following way:

```
$ ceph config set osd debug_ms 1
$ ceph config dump
WHO    MASK LEVEL    OPTION                         VALUE RO 
global      advanced mon_pg_warn_min_per_osd        3                                                               
global      advanced osd_pool_default_min_size      1                                                               
global      advanced osd_pool_default_size          1                                                               
  mon       advanced mon_allow_pool_delete          true                                                            
...
  osd       advanced debug_ms                       1
...
```

Note that this and nothing more is all that is necessary to make the change:
any daemons or clients in the system to which this option applies will be
notified of the configuration change immediately. There is no need to restart
any daemons, and no use of the awkward _ceph tell ... injectargs ..._ command. 

In the above dump output, the MASK field is a secondary restriction on which
daemons or clients the option applies to, and can match either a CRUSH location
(for example, "rack:foo") or an OSD class (for example, "ssd" vs "hdd"). For
example, we could set a higher debug level that applies only to OSDs that are
backed by SSDs (and that are reported by the _ceph osd crush tree_ command):

```
$ ceph config set osd/class:ssd debug_ms 2
$ ceph config dump
WHO    MASK      LEVEL    OPTION    VALUE RO 
...
  osd            advanced debug_ms  1
  osd  class:ssd advanced debug_ms  2
...
```

Instead of dumping the entire config database, you can inspect the config for a
individual daemon in the system. For example:

```
$ ceph config set osd.0 debug_osd 10
$ ceph config get osd.0
WHO    MASK      LEVEL    OPTION                    VALUE       RO 
osd    class:ssd advanced debug_ms                  2/2            
osd.0            advanced debug_osd                 10/10
global           advanced mon_pg_warn_min_per_osd   3              
...
```

This output tells you which options and values apply the daemon, as well as
where the option is coming from (is it set globally, is it set for this daemon
specifically, etc.).

Naturally, a config entry can also be cleared:

```
$ ceph config rm osd/class:ssd debug_ms
$ ceph config get osd.0
WHO    MASK LEVEL    OPTION                    VALUE       RO 
osd         advanced debug_ms                  1/1            
global      advanced mon_pg_warn_min_per_osd   3              
...
```

## Enforced configuration schema

One of the advantages of the new approach is that configuration values are
validated and checked when they are set. The configuration schema (which
options exist and which values are legal) is compiled into the system and
is globally known. If you try to set something that doesn't make sense, you'll
get an informative error message and you will not affect the existing configuration.
For example:

```
$ ceph config set osd.10 debug_osd very_high
Error EINVAL: error parsing value: value must take the form N or N/M, where N and M are integers
$ ceph config set osd.10 bluestore_compression_mode 1
Error EINVAL: error parsing value: '1' is not one of the permitted values: none, passive, aggressive, force
```

The schema for a particular option can be queried with a help command:

```
$ ceph config help bluestore_compression_mode
bluestore_compression_mode - Default policy for using compression when pool does not specify
  (std::string, advanced)
  Default: none
  Possible values:  none passive aggressive force
  Can update at runtime: true

'none' means never use compression.  'passive' means use compression when clients hint that data
is compressible.  'aggressive' means use compression unless clients hint that data is not
compressible.  This option is used when the per-pool property for the compression mode is not
present.
```

You'll notice that that _advanced_ is on the second line. All options are
divided into three categories: basic, advanced, and dev. The dev options are
meant for development and testing, and are generally not intended ever to be
modified by a user. The advanced options are unsurprisingly meant only for
advanced users. There are relatively few basic options because... well, in
general, we aim not to require much in the way of configuration in order to make
Ceph work.

Some numeric options include a minimum and maximum value, and will accept
suffixes like K (kilo) or M (mega) for large values:

```
$ ceph config set mon mon_data_size_warn 100G
$ ceph config get mon.a
WHO    MASK LEVEL    OPTION                         VALUE        RO 
mon         advanced mon_data_size_warn             107374182400    
...
```

Note that whether 'K' means 1000 or 1024 depends on the configuration option in
question: some are based on SI units (base-10) and some on IEC units (base-2,
like KiB and GiB).

## Running configuration

Because configuration can come from many places (defaults, cluster config,
local ceph.conf, operator override) there is a _show_ command that returns the
active configuration options as reported by any daemon in the system. For
example:

```
$ ceph daemon mgr.x config set debug_mgr 10  # manual override of config option
$ ceph config set mgr.x ms_type simple       # set an option normally
$ ceph config show mgr.x
NAME       VALUE       SOURCE   OVERRIDES  IGNORES 
debug_mgr  10/10       override mon[20/20]         
debug_mon  20/20       mon                         
debug_ms   1/1         file                        
ms_type    async+posix default             mon     
...
```

The NAME and VALUE columns tell you which options and values are currently in
effect. SOURCE tells you where the value came from: "override" came from our
_ceph daemon_ command above, "mon" came from the cluster configuration
database, and "file" came from a local ceph.conf file. In the case of an
override source, the OVERRIDES column tells you what the value would have been
(and from where it would have been drawn); in this case _debug\_mgr_ would have
been set to 20/20 by the mon if we hadn't issued that _ceph daemon ..._
command.

The IGNORES column indicates where an option has been set to a new value while 
the daemon is still using an old value. This is true for many options that
can take effect only when the daemon is restarted, such as _ms\_type_ (which
controls which message passing implementation is used). You can also see that
this is a read-only value from the RO column in _config get_ command results:

```
$ ceph config get mgr.x
WHO    MASK LEVEL     OPTION     VALUE   RO 
mgr         advanced  debug_mgr  20/20   *  
mgr         advanced  ms_type    simple  *  
```

You'll also notice that the help result for _ms\_type_ tells us the same thing:

```
$ ceph config help ms_type
...
  Default: async+posix
  Can update at runtime: false
```

## Configuration change history

One of the key advantages of using an external configuration management
framework is that those tools usually store the declarative system
configuration in a source control tool like Git. This provides a history of
changes to the system so that if something goes wrong changes can be undone.

Ceph's new configuration management provides a simple version of that
capability. Every configuration change in the system is recorded and easily
viewable:

```
$ ceph config log
--- 15 --- 2018-06-13 15:02:46.176060 ---
- mgr.x/ms_type = simple
+ mgr.x/ms_type = async
--- 14 --- 2018-06-13 14:52:51.877714 ---
+ mgr.x/ms_type = simple
--- 13 --- 2018-06-13 14:45:33.988326 ---
+ mon/mon_data_size_warn = 107374182400
...
```

The output is meant to be familiar to anyone familiar with _diff_ output, where
"+" lines indicate a new configuration entry and "-" lines indicate a removed
or replaced entry (and its prior value).

The configuration of the system can be reverted to a previous state by using
the numeric identifier preceding each change record. For example, to undo our
changes to _ms\_type_,

```
$ ceph config reset 13
$ ceph config log
--- 16 --- 2018-06-13 15:05:10.960659 --- reset to 13 ---
- mgr.x/ms_type = async
--- 15 --- 2018-06-13 15:02:46.176060 ---
- mgr.x/ms_type = simple
+ mgr.x/ms_type = async
--- 14 --- 2018-06-13 14:52:51.877714 ---
+ mgr.x/ms_type = simple
--- 13 --- 2018-06-13 14:45:33.988326 ---
+ mon/mon_data_size_warn = 107374182400
...
```
(The net effect of resetting to 13 is that the ms\_type entry is removed, even
though it had two intermediate values since then.) Because the _reset_ command
is a configuration change like any other, it can be undone with another reset
command.

## Migrating from old configuration files

Any existing cluster is likely to have various settings in the ceph.conf files
stored on each node of the system. We also provide a command that makes it easy
to import these files into the configuration database.

One challenge is that not all options are suitable to be stored in the central
config database. The _mon\_host_ option is a good example: it's used to
bootstrap a connection to the cluster before any additional configuration
options are fetched. For this reason, the import command takes both the
existing config file as input and generates a (hopefully shorter) config file
for output that contains any options that could not be assimilated. For
example:

```
$ cat ceph.conf
[global]
mon host = foo.ceph.com
[osd.1]
debug_osd = 0/0
[mds.a]
mds invalid option = this option does not exist

$ ceph config assimilate-conf -i ceph.conf -o ceph.conf.new
[global]
        mon_host = foo.ceph.com

[mds.a]
        mds_invalid_option = this option does not exist

$ ceph config get osd.1
WHO    MASK LEVEL    OPTION                         VALUE       RO 
osd.1       advanced debug_osd                      0/0            
...
```

In this simple example, only the _debug\_osd_ option for osd.1 was imported.
_mon\_host_ was left behind (it's needed for bootstrapping) and
_mds\_invalid\_option_ was left behind (it was not a recognized option).

For a cluster that's making a transition to a cluster-managed config, the basic
process is to run an assimilate command (like the one above) on each host,
which will  incorporate settings into the cluster's configuration database and
leave behind only the bootstrap-related options on each host. For example:

```
$ cd /etc/ceph
$ ceph config assimilate-conf -i ceph.conf -o ceph.conf.new
$ cat ceph.conf.new   # make sure it looks okay!
$ mv ceph.conf.new ceph.conf
```

This will work in the majority of cases. But if you're assimilating a
configuration file that changes any settings mentioned in the input (which
means that two distinct hosts exist and that each has config files that set the
same option to different values), the end result will depend on the order in
which the files are assimilated.

## Next steps

Looking forward, the next step is to surface all of these configuration options
into the new management dashboard. There is a in-flight pull request that adds
this functionality that will provide this for the upcoming Nautilus release.
