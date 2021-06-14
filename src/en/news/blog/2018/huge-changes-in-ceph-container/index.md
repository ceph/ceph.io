---
title: "Huge changes in ceph-container"
date: "2018-03-18"
author: "admin"
tags: 
  - "planet"
---

![Title](images/ceph-container-huge-change.jpg)

A massive refactor done a week ago on [ceph-container](https://github.com/ceph/ceph-container). And yes, I’m saying ceph-container, not ceph-docker anymore. We don’t have anything against Docker, we believe it’s excellent and we use it extensively. However, having the ceph-docker name does not reflect the content of the repository. Docker is only the `Dockerfile`, the rest is either entrypoints or examples. In the end, we believe ceph-container is a better match for the repository name.

  

## [](#I-We-were-doing-it-wrong… "I. We were doing it wrong…")I. We were doing it wrong…

Hosting and building images from the Docker Hub made us do things wrong. The old structure we came up with was mostly to workaround the Docker Hub’s limitation which is basically:

> You can not quickly build more than one image from a single repository. We have multiple Linux distribution and Ceph releases to support. This was a show stopper for us.

To workaround this, we designed a branching strategy which primarily consisted of each branch as a specific version of the code (distribution and Ceph release), and so at the root of the repository, we had a `daemon` directory so Docker Hub would fetch all of that and build our images.

The master branch, the one containing all the distribution and Ceph releases had a bunch a symlinks everywhere making the whole structure hard to maintain, modify and this without impacting the rest. Moreover, we had sooo much code duplication, terrible.

But with that, we lost traceability of the code inside the images. Since the image name was always the same (the tag) and got overwritten for each new content on master (or stable branch). We only had a single version of a particular distribution and Ceph release. This made rollbacks pretty hard to achieve for anyone who removed the previous image…

  

## [](#II-New-structure-the-matriochka-approach "II. New structure: the matriochka approach")II. New structure: the matriochka approach

The new structure allows us to isolate each portion of the code, from distribution to Ceph release. One can maintain its distribution; this eases cont maintainer’s life. Importantly, symlinks and code duplication are no more. The code base has dropped too, 2,204 additions and 8,315 deletions.

For an in-depth description of this approach, please refer to the slides at the end of the blog post.

  

## [](#III-Make-make-make "III. Make make make!")III. Make make make!

Some would say “Old School,” I’d say, we don’t need to re-invent the wheel and clearly `make` has demonstrated to be robust. Our entire image build process relies on `make`.

So the `make` approach lets you do a bunch of things, see the list:

```
Usage: make [OPTIONS] ... <TARGETS>

TARGETS:

  Building:
    stage             Form staging dirs for all images. Dirs are reformed if they exist.
    build             Build all images. Staging dirs are reformed if they exist.
    build.parallel    Build default flavors in parallel.
    build.all         Build all buildable flavors with build.parallel
    push              Push release images to registry.
    push.parallel     Push release images to registy in parallel

  Clean:
    clean             Remove images and staging dirs for the current flavors.
    clean.nones       Remove all image artifacts tagged <none>.
    clean.all         Remove all images and all staging dirs. Implies "clean.nones".
                      Will only delete images in the specified REGISTRY for safety.
    clean.nuke        Same as "clean.all" but will not be limited to specified REGISTRY.
                      USE AT YOUR OWN RISK! This may remove non-project images.

  Testing:
    lint              Lint the source code.
    test.staging      Perform stageing integration test.

  Help:
    help              Print this help message.
    show.flavors      Show all flavor options to FLAVORS.
    flavors.modified  Show the flavors impacted by this branch's changes vs origin/master.
                      All buildable flavors are staged for this test.
                      The env var VS_BRANCH can be set to compare vs a different branch.

OPTIONS:

  FLAVORS - ceph-container images to operate on in the form
    <ceph rel>,<arch>,<os name>,<os version>,<base registry>,<base repo>,<base tag>
    and multiple forms may be separated by spaces.
      ceph rel - named ceph version (e.g., luminous, mimic)
      arch - architecture of Ceph packages used (e.g., x86_64, aarch64)
      os name - directory name for the os used by ceph-container (e.g., ubuntu)
      os version - directory name for the os version used by ceph-container (e.g., 16.04)
      base registry - registry to get base image from (e.g., "_" ~ x86_64, "arm64v8" ~ aarch64)
      base repo - The base image to use for the daemon-base container. generally this is
                  also the os name (e.g., ubuntu) but could be something like "alpine"
      base tag - Tagged version of the base os to use (e.g., ubuntu:"16.04", alpine:"3.6")
    e.g., FLAVORS_TO_BUILD="luminous,x86_64,ubuntu,16.04,_,ubuntu,16.04 
                            luminous,aarch64,ubuntu,16.04,arm64v8,alpine,3.6"

  REGISTRY - The name of the registry to tag images with and to push images to.
             Defaults to "ceph".
    e.g., REGISTRY="myreg" will tag images "myreg/daemon{,-base}" and push to "myreg".

  RELEASE - The release version to integrate in the tag. If omitted, set to the branch name.
```

  

## [](#IV-We-are-back-to-two-images "IV. We are back to two images")IV. We are back to two images

`daemon-base` is back! For a while we used to have `daemon` and `base`, then we dropped `base` to include everything in `daemon`. However, we recently started to work on [Rook](https://rook.io). Rook was having its own Ceph container image; they shouldn’t have to build a Ceph image, **we** should be providing one.

So now, we have two images:

- `daemon-base`, contains Ceph packages
- `daemon`, contains `daemon-base` plus ceph-container’s entrypoint / specific packages

So now Rook can build its Rook image but from `daemon-base` and then add their Rook binary on top of it. This is not only true for Rook but for any project that would like to use a Ceph container image.

  

## [](#V-Moving-away-from-automated-builds "V. Moving away from automated builds")V. Moving away from automated builds

We spent too much time workarounding Docker Hub’s limitation. This even caused us to go with our previous terrible approach. Now things are different. We are no longer using automated builds from the Docker Hub; we just use it as a registry to store our Ceph images. Each time a pull request is merged into Github, our CI runs a job that builds and push images to the Docker Hub. We also have a similar mechanism we stable releases, each time we tag a new release our CI runs triggers a job that builds that our stable container images.

Current images that can be found on this [Docker Hub page](https://hub.docker.com/r/ceph/daemon/tags/).

Later, we are planning on pushing our images on [Quay](http://quay.io), before we do I’d just like to find who’s using the Ceph organization or the Ceph username as I can’t create any of the two… Once this is solved, we will have a Ceph organization on Quay, and we will start pushing Ceph container images in it.

  

## [](#VI-Lightweight-baby-container-images "VI. Lightweight baby! (container images)")VI. Lightweight baby! (container images)

We now have smaller container images; we went from almost 1GB unzipped to 600MB. The build mechanism shrinks all the layers to a single one; this drastically reduces the size of the final container image. Compressed the images went from 320 MB to 231 MB. So this 100MB saved, which is nice. We could go further, but we decided it was too time-consuming and the value versus the risk is low.

  

These are just a couple of highlights, if you want to learn more, you should look into this presentation. So you will learn more about the new project structure, our templating mechanism, and more benefits.

  

> This is huge for ceph-container and I’m so proud of what we achieved. Big shout out to [Blaine Gardner](https://github.com/BlaineEXE) and [Erwan Velu](https://github.com/ErwanAliasr1) who did this refactoring work.

Source: Sebastian Han ([Huge changes in ceph-container](https://sebastien-han.fr/blog/2018/03/19/Huge-changes-in-ceph-container/))
