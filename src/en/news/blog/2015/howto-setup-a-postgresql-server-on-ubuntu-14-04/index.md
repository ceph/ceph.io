---
title: "HOWTO setup a postgresql server on Ubuntu 14.04"
date: "2015-07-21"
author: "loic"
tags: 
  - "ceph"
---

In the context of the [teuthology](http://github.com/ceph/teuthology) (the integration test framework for [Ceph](http://ceph.com/), there needs to be a [PostgreSQL](http://www.postgresql.org/) available, locally only, with a single user dedicated to **teuthology**. It can be setup from a new Ubuntu 14.04 install with:

    sudo apt-get -qq install -y postgresql postgresql-contrib 

    if ! sudo /etc/init.d/postgresql status ; then
        sudo mkdir -p /etc/postgresql
        sudo chown postgres /etc/postgresql
        sudo -u postgres pg\_createcluster 9.3 paddles
        sudo /etc/init.d/postgresql start
    fi
    if ! psql --command 'select 1' \\
          'postgresql://paddles:paddles@localhost/paddles' > /dev/null
    then
        sudo -u postgres psql \\
            -c "CREATE USER paddles with PASSWORD 'paddles';"
        sudo -u postgres createdb -O paddles paddles
    fi

If anyone knows of a simpler way to do the same thing, I’d be very interested to know about it.
