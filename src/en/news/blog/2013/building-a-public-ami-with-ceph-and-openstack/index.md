---
title: "Building a Public AMI with Ceph and OpenStack"
date: "2013-01-16"
author: "scuttlemonkey"
tags: 
  - "ami"
  - "aws"
  - "ec2"
  - "planet"
---

In an effort to show people how OpenStack and Ceph work together I decided it would be fun to build an Amazon Machine Image (AMI) for their Elastic Compute Cloud (EC2). This would give folks the ability to showcase the integration, end users a working example, and developers a potentially easy starting environment to build on. Of course, I’m not a devops expert, so many of the assumptions and init scripts will probably make the seasoned experts cringe and gnash their teeth. Just remember, patches welcome! ![:)](http://ceph.com/wp-includes/images/smilies/icon_smile.gif)

[![](images/ceph+openstack.png "ceph+openstack")](http://ceph.com/wp-content/uploads/2013/01/ceph+openstack.png)

For those who like to skip to the end of the story feel free to head over to Amazon and search for ‘**ceph-openstack**‘ in the public images or for AMI ID ‘**ami-2fbf3746**‘ and boot away with the following constraints:  

- m1.xlarge instance size
- create a new or use an existing ssh key
- make a relatively permissive security group (I just made it wide open for all ports)

All of the following details are contained (without explanation) in a text file in /home/ubuntu/. The rest of you can read through a bit of my hacky solutions to some of the challenges presented by EC2. Some of these issues were:

- Static hostname (ec2 doesn’t really play well by default but some of the service like rabbitMQ play nicer with a static hostname)
- Dynamic IP (Ceph MON doesn’t like to have the IP change)
- Clean OpenStack install (DevStack was great for this, but a few modifications had to be made)
- Pre-Built bootable Ceph volume (One of the key points of Ceph/OpenStack is the ability to boot from Ceph volume)

Each of these was handled by an init script that I created in /usr/local/ec2/ and added to rc.local. Now on to the meat!

### Making Your EC2 Hostname Static

While EC2 typically hands you a hostname based on one of a few criteria (looking something like domU- or ip-), I wanted a static hostname that I could control so that some of my services would play nice together. Thankfully Amazon provides a handy API that you can utilize to get certain pieces of information on-the-fly. I created a /usr/local/ec2/ec2-hostname.sh script that would update both /etc/hostname and /etc/hosts with the appropriate info. The finished script is as follows:

#!/bin/bash

# Grab FQDN from Amazon API
DOMAIN=\`/usr/bin/curl -s http://169.254.169.254/latest/meta-data/public-hostname\`

HOSTNAME='cephdemo'
IPV4=\`/usr/bin/curl -s http://169.254.169.254/latest/meta-data/public-ipv4\`

# Set the host name
hostname $HOSTNAME
echo $HOSTNAME > /etc/hostname

# Add fqdn to hosts file
cat< /etc/hosts
# This file is automatically genreated by ec2-hostname script
127.0.0.1 localhost
$IPV4 $DOMAIN $HOSTNAME

# The following lines are desirable for IPv6 capable hosts
::1 ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
ff02::3 ip6-allhosts
EOF

This should give us a hostname of ‘cephdemo’ that uses the IPv4 address and the public hostname (ex: ec2-23-20-118-120.compute-1.amazonaws.com) to resolve. This should give us a good basis to start installing the other services, starting with Ceph.

### Installing Ceph

Since this was to be a simple demo with everything running on a single machine, I chose to follow the [5 minute quickstart guide](http://ceph.com/docs/master/start/quick-start/) on Ceph.com. You should have everything there that you need. The only alteration for this demo box was the removal of the MDS in /etc/ceph/ceph.conf since we would not be installing any metadata servers.

### Making Ceph MON IP Dynamic

When you spin up monitors for your Ceph cluster they expect a static IP, so I had to do a few gymnastics to make sure that when you spin up a new AMI (with a new IP) it would start Ceph with a functional monmap. To do this we need to grab the current IP address and inject a replacement monmap into our Ceph cluster. Thankfully Ceph has a monmaptool that can help us do this. The resulting /usr/local/ec2/update\_mon\_ip.sh script looks like this:

#!/bin/bash

NEWIP=$(/sbin/ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}')
LATEST=$(/bin/cat /var/lib/ceph/mon/ceph-a/monmap/last\_committed)

/bin/sed -i "s/mon addr =.\*:/mon addr = $NEWIP:/" /etc/ceph/ceph.conf

mkdir -p /tmp/oldmonmap
cp /var/lib/ceph/mon/ceph-a/monmap/$LATEST /tmp/oldmonmap/

/usr/bin/monmaptool --rm a /tmp/oldmonmap/$LATEST
/usr/bin/monmaptool --add a $NEWIP:6789 /tmp/oldmonmap/$LATEST

service ceph stop
/usr/bin/ceph-mon -i a --inject-monmap /tmp/oldmonmap/$LATEST
service ceph start

/bin/rm -rf /tmp/oldmonmap

This updates /etc/ceph/ceph.conf so that clients will know how to access the monmap, removes the old mon.a and re-adds it with the new IP, injects the new monmap, and restarts Ceph. We should now have a running Ceph cluster any time we need to reboot.

### Install OpenStack

For the purposes of this demo I wanted a nice clean OpenStack that was installed and running any time a new instance was created. The [DevStack](http://devstack.org/) work from the [Rackspace Cloud Builder](http://www.rackspace.com/cloud/private/) guys is absolutely awesome for quick and dirty OpenStack installs. It isn’t designed to spin up a production environment, but it went a long way to getting me familiar and comfortable with OpenStack in very short order. The easiest way to grab the DevStack stuff is with git, so I went ahead and installed that:

#> sudo apt-get install git -y

Now we can clone into devstack:

#> cd ~/
#> git clone git://github.com/openstack-dev/devstack.git

There is just a bit of setup work before we run the magic install script, so we navigate into ~/devstack and create a localrc file which will contain the IP ranges, network info, and all of your service passwords. Eventually it should look something like this:

FLOATING\_RANGE=192.168.1.224/27
FIXED\_RANGE=10.0.0.0/24
FIXED\_NETWORK\_SIZE=256
FLAT\_INTERFACE=eth0
ADMIN\_PASSWORD=supersecret
MYSQL\_PASSWORD=iheartdatabases
RABBIT\_PASSWORD=flopsymopsy
SERVICE\_PASSWORD=iheartksl

The only other change was a slight tweak to the stack.sh install script for the purposes of our custom EC2 hostname work. I wanted it to use the fully qualified domain name (the ec2- public DNS) instead of just the IP. This way when we use the VNC capability from the web-based dashboard it will be able to resolve properly. So, edit ~/devstack/stack.sh, look for the following two lines, and substitute in the $(hostname –fqdn) bit:

NOVNCPROXY\_URL=${NOVNCPROXY\_URL:-"http://$(hostname --fqdn):6080/vnc\_auto.html"}
XVPVNCPROXY\_URL=${XVPVNCPROXY\_URL:-"http://$(hostname --fqdn):6081/console"}

Once that’s configured we’re ready to let DevStack do its magic. Just remember, it will not tolerate being run as root so I just run this as the default ubuntu user:

#> ./stack.sh

You should see tons of setup whiz past, but once that completes you should have a working install of OpenStack on the machine. Now we need to set it up to use Ceph.

### Configuring Ceph

Since this setup is based on the Folsom release of OpenStack and the Argonaut release of Ceph it’s a pretty straight forward setup. I decided to create dedicated RBD pools for both Cinder and Glance.

#> ceph osd pool create volumes 128
#> ceph osd pool create images 128

We also will need to the python-ceph client libraries

#> sudo apt-get install python-ceph

The next step is to set up pool permissions, create a couple of user accounts for cinder and glance, and create keyrings for each.

#> ceph auth get-or-create client.volumes mon 'allow r' osd 'allow rwx pool=volumes, allow rx pool=images'
#> ceph auth get-or-create client.images mon 'allow r' osd 'allow rwx pool=images'

#> sudo useradd glance
#> sudo useradd cinder

#> ceph auth get-or-create client.images | sudo tee /etc/ceph/ceph.client.images.keyring
#> sudo chown glance:glance /etc/ceph/ceph.client.images.keyring
#> ceph auth get-or-create client.volumes | sudo tee /etc/ceph/ceph.client.volumes.keyring
#> sudo chown cinder:cinder /etc/ceph/ceph.client.volumes.keyring

That should take care of Ceph auth for glance and cinder, the only thing left to do is make sure libvirt can talk to Ceph. Unfortunately libvirt handles auth via a secret key, so we have to do things a tad differently:

#> ceph auth get-key client.volumes | tee /home/ubuntu/client.volumes.key

#> cat > secret.xml <<EOF
	<secret ephemeral='no' private='no'>
	  <usage type='ceph'>
		<name>client.volumes secret</name>
	  </usage>
	</secret>
	EOF

#> sudo virsh secret-define --file secret.xml

uuid of secret is output here, should look something like: df92844f-410f-6411-771e-cb65223ecb2e

#> sudo virsh secret-set-value --secret {uuid of secret} --base64 $(cat client.volumes.key) && rm client.volumes.key secret.xml

And voila, we should have all of the auth pieces handled. Now we just need to tell OpenStack to use Ceph.

### Configuring OpenStack

In order for OpenStack to use Ceph we only need to change a couple lines in the required conf files. We’ll do this by editing the /etc/glance/glance-api.conf and /etc/cinder/cinder.conf files and perform the following changes:

edit the existing lines in glance-api.conf

#> sudo vi /etc/glance/glance-api.conf

default\_store=rbd
rbd\_store\_user=images
rbd\_store\_pool=images

add the following lines in cinder.conf

#> sudo vi /etc/cinder/cinder.conf

volume\_driver=cinder.volume.driver.RBDDriver
rbd\_pool=volumes

rbd\_user=volumes
rbd\_secret\_uuid=df92844f-410f-6411-771e-cb65223ecb2e

A restart OpenStack should be all that’s left. Unfortunately, DevStack doesn’t install services or anything permanent, instead choosing to run everything in a series of screen windows. They did, however, make a rejoin-stack script that will restart the screen sessions based on your install. So, restarting a devstack install should look something like this:

#> screen -dR
ctrl-a
:quit
#> cd ~/devstack
#> ./rejoin-stack.sh
ctrl-a
d

Welcome to your new Ceph-backed OpenStack install! The rest of the work was prepping a bootable volume, making backups of the conf files for future installs, and creating startup scripts to do all of this setup auto-magically when you create a new instance.

### Creating a Bootable Volume

In order to create a bootable volume by hand now that we’re connected to Ceph RBD I’ll need to spin up an instance and attach a blank volume. Unfortunately, with Folsom we’ll always need an image that is stored in Glance that is the same of any volume that we want to boot from. The way OpenStack stores all the metadata means you can’t “just” boot from volume, it needs the associated metadata, even though it doesn’t get anything from the image when it boots. This is changing, but for the versions I used in building this demo that’s still the case.

The steps for creating your bootable volume are as follows:

Log in to OpenStack Dashboard

http://ec2-107-22-25-74.compute-1.amazonaws.com (your public ec2 address)
username: admin
password: supersecret (set in localrc when we installed devstack)

For this example I spun up the included CirrOS image so I wouldn’t have to import a new volume, but anything can be used, be it an Ubuntu image or whatever your flavor du jour happens to be. Just remember that you’d have to include steps in the init script that follows to recreate the image from the glance CLI so that you could have the metadata you needed for your example volume.

Create volumes:

	"Project Tab" -> volumes
	Blank volume for bootable
	Blank volume to store image

Attach volumes

	“Project Tab” -> volumes
	“edit attachments”
	bootable volume on /dev/vdb
	image storage on /dev/vdc

SSH to new instance and become root

	(from ec2 box)
	#> ssh cirros@10.0.0.2
	pw: cubswin:)
	#> sudo su

mkfs on new volumes

	#> mkfs.ext3 -b 1024 /dev/vdb 1048576
	#> mkfs.ext3 -b 1024 /dev/vdc 1048576

Mount Volumes

	#> mkdir /tmp/stage
	#> mount /dev/vdb /tmp/stage

	#> mkdir /tmp/cirros
	#> mount /dev/vdc /tmp/cirros

Get and Mount CirrOS Img

	(from ec2 box)
	#> wget https://launchpad.net/cirros/trunk/0.3.0/+download/cirros-0.3.0-x86\_64-rootfs.img.gz
	#> scp cirros-0.3.0-x86\_64-rootfs.img.gz cirros@10.0.0.2:/home/cirros/

	(from cirros)
	#> mv /home/cirros/cirros-0.3.0-x86\_64-rootfs.img.gz /tmp/cirros/
	#> gunzip cirros-0.3.0-x86\_64-rootfs.img.gz
	#> mkdir /tmp/cirros/mnt
	#> mount /tmp/cirros/cirros-0.3.0-x86\_64-rootfs.img.gz /tmp/cirros/mnt

Copy Image to Volume

	#> cp -pr /tmp/cirros/mnt/\* /tmp/stage

Clean up

	#> umount /tmp/cirros/mnt
	#> sync
	#> umount /tmp/stage

	(from OpenStack dashboard)
	un-attach both volumes
	delete image storage volume

Terminate CirrOS image

We now have a bootable volume stored in Ceph. You should be able to look at the volume info, or do an ‘#> rbd ls -p volumes’ from the ec2 command line and see the name of your “golden” volume that we’ll use later in building our init script.

### Automating Startup

Now that we have everything set up and running, we just need to automate the process of startup. First we need to grab the current cinder and glance conf files, since they’ll get overwritten in the fresh install that we’ll install at startup:

#> mkdir /home/ubuntu/backup
#> cp /etc/glance/glance-api.conf /home/ubuntu/backup/glance-api.conf
#> cp /etc/cinder/cinder.conf /home/ubuntu/backup/cinder.conf

We should have everything here that we need to create a fresh, working copy of OpenStack and plug it back in to Ceph (the Ceph auth stuff wont get wiped out on a fresh OpenStack install). I created a /usr/local/ec2/restack.sh script to do this for me:

#!/bin/bash

#cleanup procs and restart rabbit
ps -eo pid,command | grep 'erl --' | grep -v grep | awk '{print $1}' | xargs kill -9
service rabbitmq-server restart

#Clean devstack
su ubuntu -c 'cd /home/ubuntu/devstack && ./stack.sh'

sleep 10

#Copy in Ceph-enabled confs
cp -f /home/ubuntu/backup/cinder.conf /etc/cinder/cinder.conf
cp -f /home/ubuntu/backup/glance-api.conf /etc/glance/glance-api.conf

#Restart OpenStack for changes
killall screen
su ubuntu -c 'cd /home/ubuntu/devstack && ./rejoin-stack.sh'
touch /home/ubuntu/restack.done

With our clean OpenStack install we’ll need to create a volume and copy in our “golden” volume so that our demo instance has a bootable volume to play with. I did this via a /usr/local/ec2/create\_volume.sh script but had to write in a wait to make sure the DevStack install was done first:

#!/bin/bash

while :
do
if  pgrep -f cinder-api > /dev/null; then
if \[ -f /home/ubuntu/restack.done \]; then
		export OS\_USERNAME=admin
		export OS\_PASSWORD=supersecret
		export OS\_TENANT\_NAME=admin
		export OS\_AUTH\_URL=http://localhost:5000/v2.0

		VOL\_NAME="volumes-$(openssl rand -hex 4)"
		/usr/local/bin/cinder create --display\_name $VOL\_NAME --display\_description "cirros bootable volume" 1
		VOL\_ID=\`/usr/local/bin/cinder list | /bin/grep $VOL\_NAME | head -1 | /bin/sed -e 's/^| //g;s/ |.\*$//g'\`
		/usr/bin/rbd cp -p volumes volume-7fd881f8-c834-4f79-9f92-c570e4995c58 volume-$VOL\_ID
		rm /home/ubuntu/restack.done
		break
fi
fi
sleep 10
done

All that’s left is to tell our system to run these four scripts on startup and publish the AMI. Now, one fatal flaw that immediately jumps out at me is: “if I restart my machine it’ll keep making new Ceph volumes without cleaning them up.” So, you’ll either need to delete them by hand (if you are hell-bent on restarting this box a bunch) or just destroy the machine and spin up a clean one from the AMI. Adding the scripts to startup was just a simple edit to rc.local as follows:

#> sudo chmod o+x /usr/local/ec2/\*
#> sudo vi /etc/rc.local

	/usr/local/ec2/ec2-hostname.sh
	/usr/local/ec2/update\_mon\_ip.sh
	/usr/local/ec2/restack.sh
	/usr/local/ec2/create\_volume.sh

From here I just created the AMI from the EC2 dashboard and made the permissions public. Feel free to poke around with Ceph and OpenStack and hit us up with any Ceph questions you might have via the [mailing list or IRC](http://ceph.com/resources/mailing-list-irc/). Happy Ceph-ing.

scuttlemonkey out

