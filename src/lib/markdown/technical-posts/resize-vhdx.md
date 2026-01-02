---
title: Resize VHDX
description: Resize VHDX
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - windows
---
https://www.nakivo.com/blog/increase-disk-size-hyper-v-complete-guide/
Before you can start the process of expanding a Hyper-V disk, you should note the following:

-   If your VM is running, shut it down. As you know, some settings cannot be modified when the VM is in the running or saved state.
-   The VM should not have any snapshots. After modifying virtual hard disks, the associated snapshots might become invalid.
-   In Hyper-V, you cannot expand disks belonging to a differencing disk chain. Such virtual hard disks have child virtual hard disks associated with them, and any attempt to edit them might result in data loss. Using Hyper-V functionality, you can increase the disk size of only dynamically expanding or fixed virtual hard disks.

If everything is fine, you are ready to start expanding the disks. As mentioned above, this process includes two main steps:

1.  Expand the virtual hard disk using the Edit Virtual Hard Disk Wizard.
2.  Extend the volume size through launching the Disk Management utility inside the VM.

Below, I am going to break down each step separately to avoid confusion.

## Step 1: How to expand Hyper-V VM’s hard disk

The first step of the process is conducted in the following way:

1.  Open Hyper-V Manager. Right-click the VM and select **Settings**.![Opening Hyper-V Manager (Increase Disk Size in Hyper-V)](https://www.nakivo.com/blog/wp-content/uploads/2019/07/Opening-Hyper-V-Manager-Increase-Disk-Size-in-Hyper-V.webp)
2.  Select **Hard Drive** in the Hardware pane and click This action will automatically launch the Edit Virtual Hard Disk wizard.![Virtual Hard Drive (Increase Disk Size in Hyper-V)](https://www.nakivo.com/blog/wp-content/uploads/2019/07/Virtual-Hard-Drive-Increase-Disk-Size-in-Hyper-V.webp)
3.  This action automatically launches the Edit Virtual Hard Disk wizard. Click **Next** to skip the Locate Disk step.![Locate Virtual Hard Disk (Increase Disk Size in Hyper-V)](https://www.nakivo.com/blog/wp-content/uploads/2019/07/Locate-Virtual-Hard-Disk-Increase-Disk-Size-in-Hyper-V.webp)
4.  In the Choose Action step, select **Expand** to expand the storage capacity of the virtual hard disk. Click **Next**.![Choose Action (Increase Disk Size in Hyper-V)](https://www.nakivo.com/blog/wp-content/uploads/2019/07/Choose-Action-Increase-Disk-Size-in-Hyper-V.webp)
5.  In the Configure Disk step, you can specify by how much you wish to expand the disk.![Configure Disk (Increase Disk Size in Hyper-V)](https://www.nakivo.com/blog/wp-content/uploads/2019/07/Configure-Disk-Increase-Disk-Size-in-Hyper-V.webp)
6.  The next step is to look through the changes you are about to implement. Click **Finish** to complete the action and close the wizard.![Summary (Increase Disk Size in Hyper-V)](https://www.nakivo.com/blog/wp-content/uploads/2019/07/Summary-Increase-Disk-Size-in-Hyper-V.webp)
7.  To verify that you have succeeded in expanding the capacity of the virtual hard disk, right-click the VM, select **Settings,** find **Hard Drive,** and press the **Inspect** button. This way, you can get access to the virtual hard disk properties and check whether the maximum disk size has actually increased.![Inspect Disk (Increase Disk Size in Hyper-V)](https://www.nakivo.com/blog/wp-content/uploads/2019/07/Inspect-Disk-Increase-Disk-Size-in-Hyper-V.webp)

## Step 2: How to extend the volume inside the VM

The next step is to extend the volume that resides on the virtual hard disk. This operation is performed in the following way:

8.  Right-click the VM and select **Connect.** Start the virtual machine and log in.![Connecting to the VM (Increase Disk Size in Hyper-V)](https://www.nakivo.com/blog/wp-content/uploads/2019/07/Connecting-to-the-VM-Increase-Disk-Size-in-Hyper-V.webp)
9.  Enter DISKMGMT.MSC in the search bar to open the Disk Management Utility on your VM. Disk Management demonstrates the existing volumes and the amount of unallocated space we would use to extend the C: drive.![Disk Management Utility (Increase Disk Size in Hyper-V)](https://www.nakivo.com/blog/wp-content/uploads/2019/07/Disk-Management-Utility-Increase-Disk-Size-in-Hyper-V.webp)
10. Right-click the C: drive and select **Extend Volume.** This action launches the Extend Volume wizard.![Extend Volume (Increase Disk Size in Hyper-V)](https://www.nakivo.com/blog/wp-content/uploads/2019/07/Extend-Volume-Increase-Disk-Size-in-Hyper-V.webp)
11. Select the available amount of space by which you want to extend the volume. Click **Next.**![Extend Volume Wizard (Increase Disk Size in Hyper-V)](https://www.nakivo.com/blog/wp-content/uploads/2019/07/Extend-Volume-Wizard-Increase-Disk-Size-in-Hyper-V.webp)
12. Check that you have selected the correct settings. Then, click **Finish** to close the wizard.![Completing the Wizard (Increase Disk Size in Hyper-V)](https://www.nakivo.com/blog/wp-content/uploads/2019/07/Completing-the-Wizard-Increase-Disk-Size-in-Hyper-V.webp)
13. As you can see from the screenshot below, the size of the C: drive has successfully increased after extending the volume.![Extended Drive Volume (Increase Disk Size in Hyper-V)](https://www.nakivo.com/blog/wp-content/uploads/2019/07/Extended-Drive-Volume-Increase-Disk-Size-in-Hyper-V.webp)