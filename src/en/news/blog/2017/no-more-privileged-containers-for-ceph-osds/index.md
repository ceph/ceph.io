---
title: "No more privileged containers for Ceph OSDs"
date: "2017-02-20"
author: "admin"
tags: 
  - "planet"
---

![Title](images/ceph-container-no-more-privilege-mode.jpg)

I’m really sorry for being so quiet lately, I know I promised to release articles more regularly and I clearly failed… Many things are going on and where motivation is key to write articles, I’ve been having a hard time to find the right motivation to write :/

However, I am not giving up and I finally found the time to write a little bit on the things we improved in [ceph-docker](https://github.com/ceph/ceph-docker), our Ceph in container project.

## [](#I-Rationale "I. Rationale")I. Rationale

The containerizing Ceph project allows you to run all the Ceph daemons in containers. Ceph stateless daemons such as Rados Gateway, Metadata Server, RBD mirror are a better fit for containers than Monitors and OSDs. There don’t require persistent storage and are not tied to a specific component on the server (e.g: OSDs are tied to a physical disk). While running Ceph OSDs processes in containers, we support multiple scenarii:

- `osd_directory`: allows us to run multiple OSD processes within a single container, all the processes are managed by Forego (Foreman in Go). This scenario assumes that the OSD data directory was populated by the operator before running the container. So when running the container you simply expose a directory to it and it will start all the OSDs it can find. This mode will always collocate journal and OSD data on the same partition, moreover, the journal will always be a file on OSD data filesystem.
- `osd_directory_single`: is pretty much the same as `osd_directory`, the only difference is that we only run a single OSD process within the container. So when you run it, there is nothing to do, it just goes through `/var/lib/ceph/osd/` and searches for any OSD that are not running.
- `osd_disk_prepare`: needs a raw block device to create the OSD, this will run `ceph-disk` to do the partitions for ceph data and journal. Within this scenario, we can decide to enable dmcrypt (encrypted OSD data partition), bluestore and a dedicated device for the journal as well. `ceph-disk` will take care of creating partitions, filesystem, registering the new OSD, populating the OSD store.
- `osd_disk_activate`: comes right after `osd_disk_prepare`, this calls `ceph-disk` against the data partition, mounts it and start the OSD process.
- `osd_disks`: is a combination of both `osd_disk_prepare` and `osd_disk_activate` in a single call.

Where `osd_directory` does not require any privileges when running collocated journal and data on the same drive (the journal is a file on the ceph data filesystem, not a partition), the others require special permissions. It can be tricky what it comes to allowing the right permissions to that container since we need to allow multiple operations on block devices, this is why we decided to use the `--privileged=true` option when running our container. Using this parameter gives extended privileges to the container, it basically enables all the capabilities listed in [CAPABILITIES(7)](http://man7.org/linux/man-pages/man7/capabilities.7.html).

## [](#II-New-solution-more-security "II. New solution, more security")II. New solution, more security

As you can imagine, running privilege containers obviously have some security implications. If for whatever reasons the container gets compromised, it has a lot of permission and could possibly escalate through the host machine. Even if it does not it could do sufficient damage to that machine. So we should try to get rid of this mode if possible. This is why I spent some time analyzing which capabilities where precisely needed by our OSD container. As a result, it came out that we only need one: `CAP_SYS_ADMIN`, which is described as _perform a range of system administration operations_. To clarify that, we use it to allow mounting/unmounting/remounting filesystems within our container.

Another option that needs to be used when _docker running_ the container is `--device=`, which allows us to `read`, `write` and `mknodaccess` to a specific device. This is important for us as we need complete access to that device since we create partitions.

The `--device` option will appear multiple times, depending on which scenario you are using. It is always recommended to first prepare the container with `osd_disk_prepare` with the `--privileged=true` flag. Since the `prepare` container is ephemeral, this is definitely not an issue. Then, we activate the device with `osd_disk_activate`, this is where we need multiple devices, depending on which OSD scenario you are using you will need different devices:

### [](#II-1-OSD-with-collocated-journal "II.1. OSD with collocated journal")II.1. OSD with collocated journal

Assuming you are using `/dev/sda` as an OSD with a collocated journal, you should add:

- `--device=/dev/sda1`: this is the `ceph data` partition
- `--device=/dev/sda2`: this is the `ceph journal` partition
- `--device=/dev/disk/by-partuuid/<journal_uuid>`: this is the journal partition. You must use the `/dev/disk/by-partuuid/` path, this is how the journal is symlinked.

### [](#II-2-OSD-with-dedicated-journal-device "II.2. OSD with dedicated journal device")II.2. OSD with dedicated journal device

Assuming you are using `/dev/sda` as an OSD and `/dev/sdb` as a journal, you should add:

- `--device=/dev/sda1`: this is the `ceph data` partition
- `--device=/dev/sdb1`: this is the `ceph journal` partition
- `--device=/dev/disk/by-partuuid/<journal_uuid>`: this is the journal partition. You must use the `/dev/disk/by-partuuid/` path, this is how the journal is symlinked.

### [](#II-3-Encrypted-OSD-with-collocated-journal "II.3. Encrypted OSD with collocated journal")II.3. Encrypted OSD with collocated journal

Assuming you are using `/dev/sda` as an encrypted OSD, you should add:

- `--device=/dev/sda1`: this is the `ceph data` partition
- `--device=/dev/sda2`: this is the `ceph journal` partition
- `--device=/dev/sda3`: this is the `ceph lockbox` partition
- `--device=/dev/mapper/control`: access to the device mapper, needed by `cryptsetup`
- `--device=/dev/mapper/$(blkid -t TYPE=crypto_LUKS -o value -s PARTUUID /dev/sda1)`: device mapper path of the `ceph data` partition (using its partuuid)
- `--device=/dev/mapper/$(blkid -t TYPE=crypto_LUKS -o value -s PARTUUID /dev/sda2)`: device mapper path of the `ceph journal` partition (using its partuuid)
- `--device=/dev/disk/by-partuuid/$(blkid -t PARTLABEL="ceph lockbox" -o value -s PARTUUID /dev/sda3)`: device mapper path of the `ceph lockbox` partition (using its partuuid)

### [](#II-4-Encrypted-OSD-with-collocated-journal "II.4. Encrypted OSD with collocated journal")II.4. Encrypted OSD with collocated journal

Assuming you are using `/dev/sda` as an encrypted OSD and `/dev/sdb` as an encrypted journal, you should add:

- `--device=/dev/sda1`: this is the `ceph data` partition
- `--device=/dev/sdb1`: this is the `ceph journal` partition
- `--device=/dev/sda3`: this is the `ceph lockbox` partition
- `--device=/dev/mapper/control`: access to the device mapper, needed by `cryptsetup`
- `--device=/dev/mapper/$(blkid -t TYPE=crypto_LUKS -o value -s PARTUUID /dev/sda1)`: device mapper path of the `ceph data` partition (using its partuuid)
- `--device=/dev/mapper/$(blkid -t TYPE=crypto_LUKS -o value -s PARTUUID /dev/sdb1)`: device mapper path of the `ceph journal` partition (using its partuuid)
- `--device=/dev/disk/by-partuuid/$(blkid -t PARTLABEL="ceph lockbox" -o value -s PARTUUID /dev/sda3)`: device mapper path of the `ceph lockbox` partition (using its partuuid)

## [](#III-Activation-difficulties-and-hacks-for-encrypted-OSDs "III. Activation difficulties and hacks for encrypted OSDs")III. Activation difficulties and hacks for encrypted OSDs

It is easy to prepare the encrypted device as we use the `--privileged=true` flag, however, the activation is a bit tricky. When the encrypted OSD gets prepared, `ceph-disk` creates partitions and generates a private key that gets stored in the monitor KV store. Then `cryptsetup` uses this key to format the `ceph data` partition (encryption), then opens the encrypted partition, this results in a `dm` device being created. This ends with the osd population to eventually close the encrypted device. Once this happens the `dm` is not visible anymore. This is roughly how the preparation sequence works.

Now remember, because we want more security, we have to declare all the devices that will be consumed by the container. This is where it gets tricky… During the activation, `ceph-disk` opens the encrypted partition, this results in a `dm` being created, **however**, this `dm` was not declared during the `docker run` call. Thus `ceph-disk` tries to access it but it’s not available. It’s a bit of a chicken and an egg problem, how can we possibly declare a device that does not exist? We can not since Docker will also check for the existence of that device.

This trick resides in the startup script for the container. Containers are treated as daemons so managed as by systemd. The unit file is configured to trigger a script that runs the `docker run` command. This is a just a shell script that will behave differently depending on the OSD scenario being used. The service is configured to restart every 10 seconds upon failure. So we basically check in the shell startup script if the `dm` exists or not. If it does not we run we don’t add it to the sequence, the `docker run` will fail but `ceph-disk` will open the device for us. On the second attempt, the script detects that the `dm` exists and will then add it as a device, ultimately `ceph-disk` is happy and the OSD starts!

## [](#IV-Final-words "IV. Final words")IV. Final words

In order to get the security requirements we wanted we had to put a lot of engineering efforts into `ceph-ansible`, this means container images are not as self-sufficient as they used to be. This is why for now, I **strongly** recommend using `ceph-ansible` to deploy you containerized Ceph cluster on the Kraken release.

I’ve already opened bugs for `ceph-disk` and we will soon start tackling them.

**Note that this DMCRYPT scenario ONLY works with Docker version 1.12.5 and above.**

  

> All this new integration is part of both [ceph-ansible](https://github.com/ceph/ceph-ansible) and [ceph-docker](https://github.com/ceph/ceph-docker). The necessary changes were introduced in [PR](https://github.com/ceph/ceph-ansible/pull/1287) and [PR](https://github.com/ceph/ceph-docker/pull/486). I hope you will enjoy it as much as I do, this is a big step in the containerizing Ceph effort.

Source: Sebastian Han ([No more privileged containers for Ceph OSDs](https://sebastien-han.fr/blog/2017/02/20/No-more-priviledged-containers-for-Ceph-OSDs/))
