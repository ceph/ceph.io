---
title: "Importing an existing Ceph RBD image into Glance"
date: "2017-02-17"
author: "admin"
tags: 
  - "planet"
---

The normal process of uploading an image into Glance is straightforward: you use `glance image-create` or `openstack image create`, or the Horizon dashboard. Whichever process you choose, you select a local file, which you upload into the Glance image store.

This process can be unpleasantly time-consuming when your Glance service is backed with Ceph RBD, for a practical reason. When using the `rbd` image store, you're expected to use `raw` images, which have interesting characteristics.

## Raw images and sparse files

Most people will take an existing vendor cloud image, which is typically available in the `qcow2` format, and convert it using the `qemu-img` utility, like so:

$ wget -O ubuntu-xenial.qcow2 
  https://cloud-images.ubuntu.com/xenial/current/xenial-server-cloudimg-amd64-disk1.img
$ qemu-img convert -p -f qcow2 -O raw ubuntu-xenial.qcow2 ubuntu-xenial.raw

On face value, the result looks innocuous enough:

$ qemu-img info ubuntu-xenial.qcow2 
image: ubuntu-xenial.qcow2
file format: qcow2
virtual size: 2.2G (2361393152 bytes)
disk size: 308M
cluster\_size: 65536
Format specific information:
    compat: 0.10
    refcount bits: 16

$ qemu-img info ubuntu-xenial.raw
image: ubuntu-xenial.raw
file format: raw
virtual size: 2.2G (2361393152 bytes)
disk size: 1000M

As you can see, in both cases the virtual image size differs starkly from the actual file size. In `qcow2`, this is due to the copy-on-write nature of the file format and zlib compression; for the `raw` image, we're dealing with a sparse file:

$ ls -lh ubuntu-xenial.qcow2
-rw-rw-r-- 1 florian florian 308M Feb 17 10:05 ubuntu-xenial.qcow2
$ du -h  ubuntu-xenial.qcow2
308M    ubuntu-xenial.qcow2
$ ls -lh info ubuntu-xenial.raw
-rw-r--r-- 1 florian florian 2.2G Feb 17 10:16 ubuntu-xenial.raw
$ du -h  ubuntu-xenial.raw
1000M   ubuntu-xenial.raw

So, while the `qcow2` file's physical and logical sizes match, the `raw` file looks much larger in terms of filesystem metadata, as opposed to its actual storage utilization. That's because in a sparse file, "holes" (essentially, sequences of null bytes) aren't actually written to the filesystem. Instead, the filesystems just records the position and length of each "hole", and when we read from the "holes" in the file, the read would just return null bytes again.

The trouble with sparse files is that RESTful web services, like Glance, don't know too much about them. So, if we were to import that raw file with `openstack image-create --file my_cloud_image.raw`, the command line client would upload null bytes with happy abandon, which would greatly lengthen the process.

## Importing images into RBD with `qemu-img convert`

Luckily for us, `qemu-img` also allows us to upload _directly_ into RBD. All you need to do is make sure the image goes into the correct pool, and is reasonably named. Glance names uploaded images by there image ID, which is a universally unique identifier (UUID), so let's follow Glance's precedent.

export IMAGE\_ID\=\`uuidgen\`
export POOL\="glance-images"  \# replace with your Glance pool name

qemu-img convert 
  -f qcow2 -O raw 
  my\_cloud\_image.raw 
  rbd:$POOL/$IMAGE\_ID

## Creating the clone baseline snapshot

Glance expects a snapshot named `snap` to exist on any image that is subsequently cloned by Cinder or Nova, so let's create that as well:

rbd snap create rbd:$POOL/$IMAGE\_ID@snap
rbd snap protect rbd:$POOL/$IMAGE\_ID@snap

## Making Glance aware of the image

Finally, we can let Glance know about this image. Now, there's a catch to this: this trick _only_ works with the Glance v1 API, and thus you _must_ use the `glance` client to do it. Your Glance is v2 only? Sorry. Insist on using the `openstack` client? Out of luck.

What's special about this invocation of the `glance` client are simply the pre-populated `location` and `id` fields. The `location` is composed of the following segments:

- the fixed string `rbd://`,
- your Ceph cluster UUID (you get this from `ceph fsid`),
- a forward slash (`/`),
- the name of your image (which you previously created with `uuidgen`),
- another forward slash (`/`, not `@` as you might expect),
- and finally, the name of your snapshot (`snap`).

Other than that, the `glance` client invocation is pretty straightforward for a v1 API call:

CLUSTER\_ID\=\`ceph fsid\`
glance --os-image-api-version 1 
  image-create 
  --disk-format raw 
  --id $IMAGE\_ID 
  --location rbd://$CLUSTER\_ID/$IMAGE\_ID/snap

Of course, you might add other options, like `--private` or `--protected` or `--name`, but the above options are the bare minimum.

## And that's it!

Now you can happily fire up VMs, or clone your image into a volume and fire a VM up from that.

Source: Hastexo ([Importing an existing Ceph RBD image into Glance](https://www.hastexo.com/resources/hints-and-kinks/importing-rbd-into-glance/))
