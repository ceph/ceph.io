---
title: "OpenStack Glance: import images and convert them directly in Ceph"
date: "2014-11-11"
author: "shan"
tags: 
---

![](images/glance-convert-in-ceph.jpg "OpenStack Glance: import images and convert them directly in Ceph")

Ceph, to work in optimal circumstances requires the usage of RAW images. However, it is painful to upload RAW images in Glance because it takes a while. Let see how we can make our life easier.

  

First let's upload our image, for the purpose of this example I used a tiny CirrOS image:

\`\`\`bash $ sudo rbd -p imajeez --image-format 2 import cirros-0.3.0-x86-64-disk.img.1 $(uuidgen)

$ sudo rbd -p imajeez info 33fc77e2-df0e-4f71-a966-b8df2b245f42 rbd image '33fc77e2-df0e-4f71-a966-b8df2b245f42': size 9532 kB in 3 objects order 22 (4096 kB objects) block\_name\_prefix: rbd\_data.331574b0dc51 format: 2 features: layering \`\`\`

Now this is where it becomes interesting! The good thing here is that we can trigger the conversion directly from Ceph and this using the `qemu-img` tool. Simply call a conversion and generate a new name based on a new UUID.

`bash $ sudo qemu-img convert -O raw rbd:imajeez/33fc77e2-df0e-4f71-a966-b8df2b245f42 rbd:imajeez/$(uuidgen)`

We now have two images in our pool:

`bash $ sudo rbd -p imajeez ls 33fc77e2-df0e-4f71-a966-b8df2b245f42 4f460d8c-2af3-4041-a28d-12c3631a305f`

And the image has a RAW format:

`bash $ sudo qemu-img info rbd:imajeez/4f460d8c-2af3-4041-a28d-12c3631a305f image: rbd:imajeez/4f460d8c-2af3-4041-a28d-12c3631a305f file format: raw virtual size: 39M (41126400 bytes) disk size: unavailable cluster_size: 4194304`

We can now delete our original QCOW2 image:

`bash $ sudo rbd -p imajeez rm 33fc77e2-df0e-4f71-a966-b8df2b245f42`

In order for this image to be compliant with Glance, we need to snapshot and protect it:

\`\`\`bash $ sudo rbd --pool imajeez snap create --snap snap 4f460d8c-2af3-4041-a28d-12c3631a305f $ rbd --pool imajeez snap protect --image 4f460d8c-2af3-4041-a28d-12c3631a305f --snap snap

$ sudo rbd -p imajeez snap ls 4f460d8c-2af3-4041-a28d-12c3631a305f SNAPID NAME SIZE

```
 4 snap 40162 kB
```

\`\`\`

Eventually add this image into Glance, note that using the `--location` flag will not upload anything since we directly register the location in Ceph.

`bash $ glance image-create --id 4f460d8c-2af3-4041-a28d-12c3631a305f --name CirrosImport --store rbd --disk-format raw --container-format bare --location rbd://$(sudo ceph fsid)/imajeez/4f460d8c-2af3-4041-a28d-12c3631a305f/snap +------------------+--------------------------------------+ | Property | Value | +------------------+--------------------------------------+ | checksum | None | | container_format | bare | | created_at | 2014-11-10T17:00:02 | | deleted | False | | deleted_at | None | | disk_format | raw | | id | 4f460d8c-2af3-4041-a28d-12c3631a305f | | is_public | False | | min_disk | 0 | | min_ram | 0 | | name | CirrosImport | | owner | 2f314f86ca9048ac828baedb5e8e4e2a | | protected | False | | size | 41126400 | | status | active | | updated_at | 2014-11-10T17:00:02 | | virtual_size | None | +------------------+--------------------------------------+`

  

> This procedure will probably be reproduced as soon as the Glance conversion blueprint gets implemented. As always, it's easier with Ceph since we don't need to store the image in a temporary location, convert it and then upload it. This is unfortunately the problem with backend such as Swift.
