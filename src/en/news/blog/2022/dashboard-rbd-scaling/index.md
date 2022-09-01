---
title: "Dashboard scability of RBD images"
date: "2022-09-01"
author: "Pere Diaz Bou"
image: "images/background.jpg"
tags:
  - "mgr"
  - scalability
  - "python"
  - "rbd"
  - "dashboard"
---

## Overview

Management of RBD images in the Dashboard module has been challenging due to its low performant
behaviour with a high enough number of images. With enough images tables would see long loading
times which might seem infinite rendering them unusable.

After introducing server side pagination with RBD images we've been able to see a clear and expected
**reduction of around 99%** in latency.

With around 50 images and upwards managing RBD images was a hassle. In the following videos,
2048 images were created to display the differences between versions.

Loading 2048 images **before** adding pagination:

<iframe
    width="640"
    height="480"
    src="https://www.youtube.com/embed/5eCVxtJ6IfY"
    frameborder="0"
    allow="autoplay; encrypted-media"
    allowfullscreen
>
</iframe>

&nbsp;

Loading 2048 images **after** adding pagination:

<iframe
    width="640"
    height="480"
    src="https://www.youtube.com/embed/g7sQt7zlRo0"
    frameborder="0"
    allow="autoplay; encrypted-media"
    allowfullscreen
>
</iframe>

&nbsp;

## Tradeoffs

Introducing pagination didn't come without tradeoffs. After running some experiments we noticed that
retrieving all data of an image could take a considerable amount of time ranging from 10ms-30ms,
meaning that gathering all images to later paginate is virtually impossible. Luckily, we can gather all of the
references to images in a short amount of time, for example, 2048 references were retrieved in 10ms.

**Sorting and searching images is now limited to image names, pools and namespaces** because of the
limitations of these references, but the management of RBD images is now available to use at greater
scale.

## Future plans

RBD images is not the only affected table to scalability issues. OSDs, services, alerts, hosts and
inventory are targets for future optimizations which should include pagination, but due to the fact
of varying APIs for each of those components, major refactoring is needed in order to fit each case.
