---
title: "How to verify that an encrypted OSD is really encrypted?"
date: "2020-03-28"
author: "admin"
tags: 
  - "planet"
---

Source: https://github.com/SUSE/doc-ses/issues/218  
  
Since decrypting the data on an encrypted OSD disk requires knowledge of the corresponding dm-crypt secret key, OSD encryption provides protection for cases when a disk drive that was used as an OSD is decommissioned, lost, or stolen.  
  
Scenario: You have deployed some OSDs that are supposedly encrypted, but don't know how to verify that.  
  
First, run `ceph-volume lvm list` on the machine where the OSDs are running. The output might look something like this:  
  

\# ceph-volume lvm list  
  
\====== osd.3 =======  
  
  \[block\]       /dev/ceph-d9f09cf7-a2a4-4ddc-b5ab-b1fa4096f713/osd-data-71f62502-4c85-4944-9860-312241d41bb7  
  
      block device              /dev/ceph-d9f09cf7-a2a4-4ddc-b5ab-b1fa4096f713/osd-data-71f62502-4c85-4944-9860-312241d41bb7  
      block uuid                m5F10p-tUeo-6ZGP-UjxJ-X3cd-Ec5B-dNGXvG  
      cephx lockbox secret        
      cluster fsid              413d9116-e4f6-4211-a53b-89aa219f1cf2  
      cluster name              ceph  
      crush device class        None  
      encrypted                 0  
      osd fsid                  f8596bf7-000f-4186-9378-170b782359dc  
      osd id                    3  
      type                      block  
      vdo                       0  
      devices                   /dev/vdb  
  
\====== osd.7 =======  
  
  \[block\]       /dev/ceph-38914e8d-f512-44a7-bbee-3c20a684753d/osd-data-0f385f9e-ce5c-45b9-917d-7f8c08537987  
  
      block device              /dev/ceph-38914e8d-f512-44a7-bbee-3c20a684753d/osd-data-0f385f9e-ce5c-45b9-917d-7f8c08537987  
      block uuid                1y3qcS-ZG01-Y7Z1-B3Kv-PLr6-jbm6-8B79g6  
      cephx lockbox secret        
      cluster fsid              413d9116-e4f6-4211-a53b-89aa219f1cf2  
      cluster name              ceph  
      crush device class        None  
      encrypted                 0  
      osd fsid                  0f9a8002-4c81-4f5f-93a6-255252cac2c4  
      osd id                    7  
      type                      block  
      vdo                       0  
      devices                   /dev/vdc  

  
Note the line that says encrypted 0 - this means the OSD is not encrypted. Here are the possible values:  
  

      encrypted                 0  <- not encrypted  
      encrypted                 1  <- encrypted  

If you get the following error, it means the node where you are running the command does not have any OSDs on it:

\# ceph-volume lvm list  
No valid Ceph lvm devices found  

Now, imagine that, in your case, `ceph-volume lvm list` shows encrypted 1 for a given OSD, so you know ceph-volume thinks that OSD is encrypted. How to gain more confidence that it really is encrypted? Ceph OSD encryption-at-rest relies on the Linux kernel's dm-crypt subsystem and the Linux Unified Key Setup ("LUKS"). When creating an encrypted OSD, ceph-volume creates an encrypted logical volume and saves the corresponding dm-crypt secret key in the Ceph Monitor data store. When the OSD is to be started, ceph-volume ensures the device is mounted, retrieves the dm-crypt secret key from the Ceph Monitors, and decrypts the underlying device. This creates a new device, containing the unencrypted data, and this is the device the Ceph OSD daemon is started on. Since the OSD itself does not know whether the underlying logical volume is encrypted or not, there is no ceph osd command that will return this information. But it is possible to query LUKS for it, as follows. First, get the device of the OSD logical volume you are interested in. This can be obtained from the ceph-volume lvm list output:

block device              /dev/ceph-d9f09cf7-a2a4-4ddc-b5ab-b1fa4096f713/osd-data-71f62502-4c85-4944-9860-312241d41bb7  

Then, dump the LUKS header from that device:

\# cryptsetup luksDump OSD\_BLOCK\_DEVICE  

Here is what the output looks like when the OSD is NOT encrypted:

Device /dev/ceph-38914e8d-f512-44a7-bbee-3c20a684753d/osd-data-0f385f9e-ce5c-45b9-917d-7f8c08537987 is not a valid LUKS device.  

And when it IS encrypted:

master:~ # cryptsetup luksDump /dev/ceph-1ce61157-81be-427d-83ad-7337f05d8514/osd-data-89230c92-3ace-4685-97ff-6fa059cef63a  
LUKS header information for /dev/ceph-1ce61157-81be-427d-83ad-7337f05d8514/osd-data-89230c92-3ace-4685-97ff-6fa059cef63a  
  
Version:        1  
Cipher name:    aes  
Cipher mode:    xts-plain64  
Hash spec:      sha256  
Payload offset: 4096  
MK bits:        256  
MK digest:      e9 41 85 f1 1b a3 54 e2 48 6a dc c2 50 26 a5 3b 79 b0 f2 2e   
MK salt:        4c 8c 9d 1f 72 1a 88 6c 06 88 04 72 81 7b e4 bb   
                b1 70 e1 c2 7c c5 3b 30 6d f7 c8 9c 7c ca 22 7d   
MK iterations:  118940  
UUID:           7675f03b-58e3-47f2-85fc-3bafcf1e589f  
  
Key Slot 0: ENABLED  
        Iterations:             1906500  
        Salt:                   8f 1f 7f f4 eb 30 5a 22 a5 b4 14 07 cc da dc 48   
                                b5 e9 87 ef 3b 9b 24 72 59 ea 1a 0a ec 61 e6 42   
        Key material offset:    8  
        AF stripes:             4000  
Key Slot 1: DISABLED  
Key Slot 2: DISABLED  
Key Slot 3: DISABLED  
Key Slot 4: DISABLED  
Key Slot 5: DISABLED  
Key Slot 6: DISABLED  
Key Slot 7: DISABLED  

Source: Nathan Cutler ([How to verify that an encrypted OSD is really encrypted?](http://smithfarm-thebrain.blogspot.com/2020/03/how-to-verify-that-encrypted-osd-is.html))
