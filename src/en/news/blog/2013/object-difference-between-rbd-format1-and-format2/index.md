---
title: "Object Difference Between RBD Format1 and Format2"
date: "2013-09-10"
author: "syndicated"
tags: 
  - "planet"
---

Lets take a look how rbd object are store on rados and the difference between format 1 and format 2.

# Format 1

```
$ rbd create myrbd --size=10 
$ rados ls -p rbd      
myrbd.rbd
rbd_directory

$ rbd map myrbd
$ dd if=/dev/zero of=/dev/rbd/rbd/myrbd
$ rados ls -p rbd
myrbd.rbd
rb.0.1286.74b0dc51.000000000000
rb.0.1286.74b0dc51.000000000001
rb.0.1286.74b0dc51.000000000002
rbd_directory
```

1. _$image\_name_.rbd : Contain the id of the image ( rb.0.1286.74b0dc51 )
2. _$rbd\_id_._$fragment_ : Raw data image
3. rbd\_directory : Rbd image list for the current pool

# Format 2

```
$ rbd create myrbd --size=10 --image-format=2
$   rados ls -p rbd      
rbd_directory
rbd_header.134a74b0dc51
rbd_id.myrbd

$ rbd map myrbd
$ dd if=/dev/zero of=/dev/rbd/rbd/myrbd
$ rados ls -p rbd
rbd_data.134a74b0dc51.0000000000000000
rbd_data.134a74b0dc51.0000000000000001
rbd_data.134a74b0dc51.0000000000000002
rbd_directory
rbd_header.134a74b0dc51
rbd_id.myrbd
```

1. rbd\_data._$rbd\_id_._$fragment_ : Raw data image
2. rbd\_directory : Rbd image list for the current pool
3. rbd\_header._$rbd\_id_ : Metadata about the image
4. rbd\_id._$image\_name_ : Contain the id of the image ( 134a74b0dc51 )
