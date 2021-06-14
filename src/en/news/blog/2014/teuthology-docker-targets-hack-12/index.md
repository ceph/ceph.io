---
title: "Teuthology docker targets hack (1/3)"
date: "2014-10-29"
author: "loic"
tags: 
  - "ceph"
---

[teuthology](https://github.com/ceph/teuthology/) runs [jobs](https://github.com/ceph/ceph-qa-suite) testing the [Ceph](http://ceph.com/) integration on **targets** that can either be virtual machines or bare metal. The [container hack](https://github.com/dachary/teuthology/blob/wip-container/teuthology/containers.py) adds support for docker containers as a replacement.

...
Running task exec...
Executing custom commands...
Running commands on role mon.a host container002
running sudo 'TESTDIR=/home/ubuntu/cephtest' bash '-c' '/bin/true'
running docker exec container002 bash /tmp/tmp/tmptJ7hxa
Duration was 0.088931 seconds
...

  
A worker with this hack listens on the **container** tube:

$ mkdir /tmp/a /tmp/logs
$ ./virtualenv/bin/teuthology-worker \\
  -l /tmp/logs --archive-dir /tmp/a \\
  --tube container

A noop job

machine\_type: container
os\_type: ubuntu
os\_version: "14.04"
roles:
- - mon.a
  - osd.0
- - osd.1
  - client.0
tasks:
- exec:
    mon.a:
      - /bin/true

is scheduled via the **container** tube

./virtualenv/bin/teuthology-schedule --name foo \\
  --worker container --owner loic@dachary.org \\
  noop.yaml
Job scheduled with name foo and ID 29
2014-10-29 14:28:28,415.415 WARNING:teuthology.report:No results\_server \\
  set in /home/loic/.teuthology.yaml; cannot report results

The implementation relies on the [docker 1.3](https://docs.docker.com/#release-notes) [docker exec](https://docs.docker.com/reference/commandline/cli/#exec) command. It is used as a replacement for ssh connections.

...
2014-10-29 13:48:34,996.996 INFO:teuthology.lockstatus:lockstatus::get\_status uri = http://localhost:8080/nodes/container002/
2014-10-29 13:48:35,009.009 INFO:teuthology.containers:sleeper\_running  140380434393616
2014-10-29 13:48:35,032.032 INFO:teuthology.containers:running 'docker' 'run' '--rm=true' '--volume' '/tmp:/tmp/tmp' '--name' 'container002' 'ceph-ubuntu-14.04' 'bash' '-c' 'echo running ; sleep 1000000'
2014-10-29 13:48:36,132.132 INFO:teuthology.containers:run\_sleeper: running

2014-10-29 13:48:36,133.133 INFO:teuthology.containers:sleeper\_running  140380434393616
2014-10-29 13:48:36,133.133 INFO:teuthology.containers:start: container container002 started
2014-10-29 13:48:36,133.133 INFO:teuthology.lockstatus:lockstatus::get\_status uri = http://localhost:8080/nodes/container001/
2014-10-29 13:48:36,149.149 INFO:teuthology.containers:sleeper\_running  140380258955216
2014-10-29 13:48:36,169.169 INFO:teuthology.containers:running 'docker' 'run' '--rm=true' '--volume' '/tmp:/tmp/tmp' '--name' 'container001' 'ceph-ubuntu-14.04' 'bash' '-c' 'echo running ; sleep 1000000'
2014-10-29 13:48:37,244.244 INFO:teuthology.containers:run\_sleeper: running

2014-10-29 13:48:37,244.244 INFO:teuthology.containers:sleeper\_running  140380258955216
2014-10-29 13:48:37,245.245 INFO:teuthology.containers:start: container container001 started
2014-10-29 13:48:37,245.245 INFO:teuthology.task.internal:roles: - \['mon.a', 'osd.0'\]
2014-10-29 13:48:37,245.245 INFO:teuthology.task.internal:roles: - \['osd.1', 'client.0'\]
2014-10-29 13:48:37,245.245 INFO:teuthology.run\_tasks:Running task internal.push\_inventory...
2014-10-29 13:48:37,245.245 INFO:teuthology.run\_tasks:Running task internal.serialize\_remote\_roles...
2014-10-29 13:48:37,247.247 INFO:teuthology.run\_tasks:Running task internal.check\_conflict...
...
2014-10-29 13:48:40,033.033 INFO:teuthology.containers:running rmdir '--' '/home/ubuntu/cephtest'
2014-10-29 13:48:40,034.034 INFO:teuthology.containers:running docker exec container002 bash /tmp/tmp/tmpxaD5xX
2014-10-29 13:48:40,145.145 INFO:teuthology.containers:completed \['docker', 'exec', u'container001', 'bash', '/tmp/tmp/tmpqhYczm'\] on container001:
2014-10-29 13:48:40,145.145 INFO:teuthology.containers:completed \['docker', 'exec', u'container002', 'bash', '/tmp/tmp/tmpxaD5xX'\] on container002:
2014-10-29 13:48:40,147.147 INFO:teuthology.run:Summary data:
{duration: 0.0005440711975097656, failure\_reason: need more than 0 values to unpack,
  owner: loic@dachary.org, status: fail, success: false}

2014-10-29 13:48:40,148.148 WARNING:teuthology.report:No results\_server set in /home/loic/.teuthology.yaml; cannot report results
2014-10-29 13:48:40,149.149 INFO:teuthology.run:FAIL 

The containers were added to the [paddles](https://github.com/ceph/paddles) database, using the new [is\_container](https://github.com/dachary/paddles/commit/f044c968dde9e421985cd6818ecd5d0c9a348051) field.

for id in 1 2 3 ; do
 sqlite3 dev.db "insert into nodes (id,name,machine\_type,is\_container,is\_vm,locked,up) values ($id, 'container00$id', 'container', 1, 0, 0, 1);"
done

They were not pre-provisionned because they are created on demand. Since docker provides a repository of images, [downburst](https://github.com/ceph/downburst) is not used.
