---
title: "Improving Ceph python scripts tests"
date: "2015-05-07"
author: "loic"
tags: 
  - "ceph"
---

The [Ceph](http://ceph.com/) [command line](https://git.ceph.com/?p=ceph.git;a=blob;f=src/ceph.in;hb=hammer) and [ceph-disk](https://git.ceph.com/?p=ceph.git;a=blob;f=src/ceph-disk;hb=hammer) helper are python scripts for which there are integration tests ([ceph-disk.sh](https://git.ceph.com/?p=ceph.git;a=blob;f=src/test/ceph-disk.sh;hb=hammer) and [test.sh](https://git.ceph.com/?p=ceph.git;a=blob;f=qa/workunits/cephtool/test.sh;hb=hammer)). It would be useful to add unit tests and [pep8](http://pep8.readthedocs.org/en/latest/intro.html) checks.  
It can be done by creating a python module instead of an isolated file (see for instance [ceph-detect-init](https://github.com/ceph/ceph/tree/master/src/ceph-detect-init)) with a [tox.ini](https://pypi.python.org/pypi/tox/) file including pep8, python2 and python3 test environments.  
Since Ceph relies on [autotools](https://en.wikipedia.org/wiki/GNU_build_system), the [setup.py](https://pypi.python.org/pypi/setuptools) can be used with **\-local** targets. For instance:

all-local::
        python setup.py build
clean-local::
	python setup.py clean
install-data-local::
	python setup.py install --root=$(DESTDIR) --install-layout=deb

Note the double **:** meaning it appends to an existing rule instead of overriding it. The **–root=$(DESTDIR)** will install the module files in the appropriate directory when building packages.  
**tox** uses [pip](https://pypi.python.org/pypi/pip) to fetch dependencies required to run tests from [PyPI](https://pypi.python.org/), but tests sometime run without network access. The depedencies can be collected by [wheel](https://pypi.python.org/pypi/wheel) with something like:

pip wheel -r requirements.txt

It will create a **wheelhouse** directory which can later be used with

pip install --no-index --use-wheel --find-links=wheelhouse \\
  -r requirements.txt

### virtualenv, pip and wheel

The pip version must be greater or equal to 6.1 otherwise it may fail to properly install packages from the wheelhouse directory. When running on CentOS 7 the pip version available by default when creating a virtualenv is pip 1.4.1 and it needs to be upgraded with **pip install –upgrade ‘pip >= 6.1′ distribute**. If this is run using a wheelhouse directory, it must have been prepared with something like **pip wheel -r requirements.txt ‘pip >= 6.1′** because the requirements of a module do not usually require a specific pip or distribute instance.

### build depends and virtualenv

Making sure the required packages are installed to build Ceph and run tests relies on the build requirements from the package (debian/control or ceph.spec). The build dependencies for python modules are listed in **test-requirements.txt** files and it would be error prone to duplicate that list in the package build requires. It would also be difficult to match the dependencies requirements on older systems. The build requirements can be limited to include virtualenv. When running the tests, a virtualenv is created and the dependencies installed in it using the **test-requirements.txt** list. Since pull dependencies from the net while running tests is frowned upon (or impossible when there is no network access), they need to be collected at the same time the packages from build requirements are installed. It can be something similar to

apt-get build-dep ceph
pip wheel -r test-requirements.txt

### publishing to PyPI

The module can be registered to PyPI using

python setup.py register

and published when a new version is available with

python setup.py sdist upload --sign

### packaging and development

Although using wheel is useful in the context of packaging, it does not matter in a development environment and it is more convenient to get the packages directly from PyPI instead of preloading them with pip wheel. The **tox.ini** file can be set with:

\[testenv\]
deps =
  {env:NO\_INDEX:}
  --use-wheel
  --find-links={toxinidir}/wheelhouse
  -r{toxinidir}/requirements.txt
  -r{toxinidir}/test-requirements.txt

Which will use the python modules from the wheelhouse directory if it’s available or get them from PyPI if not. tox can be run from a **run-tox.sh** script such as:

virtualenv make-check
. make-check/bin/activate
pip install --upgrade 'pip >= 6.1'
pip install --no-index --use-wheel --find-links=wheelhouse 'tox >=1.9'
if test -d wheelhouse ; then
    export NO\_INDEX=--no-index
fi
tox

The **run-tox.sh** is only necessary when an older tox version is unable to intepret the [{env:NO\_INDEX:}](http://tox.readthedocs.org/en/latest/config.html#environment-variable-substitutions-with-default-values) expression.

### using a module from sources

A module from the sources can be used by installing it in development / editable mode like so:

DIR=test-ceph-disk
virtualenv virtualenv-$DIR
. virtualenv-$DIR/bin/activate
(
    if test -d ceph-detect-init/wheelhouse ; then
        wheelhouse="--no-index --use-wheel --find-links=ceph-detect-init/wheelhouse"
    fi
    pip install $wheelhouse --editable ceph-detect-init
)

The **activate** command will add to the environment variables (PATH and PYTHONPATH) and the rest of the test script will find the python module files and console scripts before the one installed on the host operating system. If a wheelhouse directory is found, packages will be pulled from it which ensures the test script can be run with no network access.

### integration tests

When integration tests run, they require an environment and resources that are not conveniently expressed as build requirements and exceed what can be expected from a continuous integration machine. They should be implemented in a separate directory (for instance integration) and be given a separate tox environment such as:

\[testenv:integration\]
basepython = python2
setenv = VIRTUAL\_ENV={envdir}
deps = -r{toxinidir}/requirements.txt
  -r{toxinidir}/test-requirements.txt
commands = {envbindir}/py.test -v integration/test\_main.py

This test will create a docker image for each platform and run the **ceph-detect-init** script in each of them to verify it returns the expected value.
