---
title: "Ceph admin API init script"
date: "2014-01-08"
author: "shan"
tags: 
---

![](images/ceph-api-init.jpg "Ceph admin API init script")

Ceph admin API init script.

  

\`\`\`bash

# !/bin/sh

### BEGIN INIT INFO

# Provides: ceph-rest-api

# Required-Start: $network

# Required-Stop: $network

# Default-Start: 2 3 4 5

# Default-Stop: 0 1 6

# Short-Description: Ceph Rest API server

# Description: Frontend Ceph Rest API server

### END INIT INFO

# Author: Sébastien Han [sebastien.han@enovance.com](http://sebastien-han.fr/blog/2014/01/08/ceph-admin-api-init/m&%23x61;&%23x69;&%23x6c;&%23116;&%23111;&%2358;&%23x73;&%23x65;&%23x62;&%2397;&%23x73;&%23116;&%23105;&%23x65;&%23110;&%2346;&%23104;&%2397;&%23110;&%2364;&%23101;&%23110;&%23111;&%23118;&%23x61;&%23x6e;&%23x63;&%23x65;&%2346;&%23x63;&%23x6f;&%23x6d;)\>

# PATH should only include /usr/\* if it runs after the mountnfs.sh script

PATH=/sbin:/usr/sbin:/bin:/usr/bin DESC="Ceph Rest API" NAME=ceph-rest-api DAEMON=/usr/bin/ceph-rest-api DAEMON\_ARGS="--conf /etc/ceph/ceph.conf" PID\_DIR=/var/run/ceph PIDFILE=/var/run/ceph/$NAME.pid SCRIPTNAME=/etc/init.d/$NAME CEPH\_USER=root CEPH\_GROUP=root LOCK\_DIR=/var/lock/ceph

# Exit if the package is not installed

\[ -x $DAEMON \] || exit 0

. /lib/lsb/init-functions

mkdir -p ${PID\_DIR} mkdir -p ${LOCK\_DIR} chown ${CEPH\_USER} ${LOCK\_DIR}

do\_start() {

```
    start-stop-daemon --start --background --quiet --chuid ${CEPH_USER}:${CEPH_GROUP} --make-pidfile --pidfile $PIDFILE --startas $DAEMON --test > /dev/null \
            || return 1
    start-stop-daemon --start --background --quiet --chuid ${CEPH_USER}:${CEPH_GROUP} --make-pidfile --pidfile $PIDFILE --startas $DAEMON -- \
            $DAEMON_ARGS \
            || return 2
```

}

do\_stop() {

```
    start-stop-daemon --stop --quiet --retry=TERM/30/KILL/5 --pidfile $PIDFILE
    RETVAL="$?"
    rm -f $PIDFILE
    return "$RETVAL"
```

}

case "$1" in

```
start)
    log_daemon_msg "Starting $DESC" "$NAME"
    do_start
    case "$?" in
        0|1) log_end_msg 0 ;;
        2) log_end_msg 1 ;;
    esac
    ;;
```

stop)

```
    log_daemon_msg "Stopping $DESC" "$NAME"
    do_stop
    case "$?" in
            0|1) log_end_msg 0 ;;
            2) log_end_msg 1 ;;
    esac
    ;;
```

status)

```
   status_of_proc "$DAEMON" "$NAME" && exit 0 || exit $?
   ;;
```

restart|force-reload)

```
    log_daemon_msg "Restarting $DESC" "$NAME"
    do_stop
    case "$?" in
        0|1)
            do_start
            case "$?" in
                0) log_end_msg 0 ;;
                1) log_end_msg 1 ;; # Old process is still running
                *) log_end_msg 1 ;; # Failed to start
            esac
            ;;
            *)
        # Failed to stop
            log_end_msg 1
            ;;
        esac
    ;;
```

\*)

```
    echo "Usage: $SCRIPTNAME {start|stop|status|restart|force-reload}" >&2
    exit 3
    ;;
```

esac \`\`\`
