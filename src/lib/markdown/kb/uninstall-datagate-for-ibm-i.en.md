---
title: How to uninstall DataGate for the IBM i
description: This article explains how to uninstall one or all instances of ASNA DataGate for IBM i. Please read it carefully before starting the uninstall process.
tags:
  - datagate-ibm-i
  - ibm-i
date_published: '2024-01-08T21:34:25.000Z'
date_updated: '2024-01-09T03:39:28.000Z'
date_created: '2024-01-09T03:39:28.000Z'
pinned: false
---

This article explains how to uninstall one or all instances of ASNA DataGate for IBM i. Please read it carefully before starting the uninstall process.

## Important considerations

* If you are running multiple instances or versions of DataGate and want to uninstall a single DataGate instance, do not delete or rename the ASNA_DG8 library or the DG8SVCPRF user profile. These are required for all installed instances of DataGate. Deleting these objects will render all installations of DataGate on the machine inoperable .

* If you are running multiple instances or versions of DataGate, we strongly recommend that you ensure that there are no active jobs for any of these instances/versions before removing a DataGate instance. It’s easy to confuse which version of DataGate has active jobs, and by ensuring no DataGate users are active helps avoid uninstall issues.

* Do not attempt to remove a DataGate instance before all of its end-user jobs have ended. This is explained in detail below.

## To uninstall a DataGate instance you will need these four values:

**[DG Subsystem]** – the subsystem into which DataGate is installed . By default, DataGate installs into the QINTER subsystem. If the DataGate instance you want to uninstall is running, you can confirm’s its subsystem by using WRKACTJOB to display the Job Status Attributes on a DataGate end-user DG8_NET job (the subsystem is shown at the bottom of the display). [See this article for finding DataGate end-user jobs.](/en/kb/datagate-for-ibm-i-end-user-jobs) If the DataGate instance you want to uninstall is not running, you’ll need to check with your System Administrator for DataGate’s subsystem name.

**[DG Library]** – the name of the target DataGate library to uninstall . By default this name is DG8_`xxy` where `xx` is the major version and `y` is the minor version of DataGate. For example, the default DataGate library for DataGate 16.0 is DG8_160 . If you don’t know the name of your DataGate instance’s library, see this article .

**[DG Service Table Entry]** – the name of the Service Table Entry for **[DG Library]**. [Use this article to determine DataGate service table entry name](/en/kb/check-datagate-for-ibm-i-ip-port).

**[DG TCP/IP port]** – the TCP/IP port that uses. Use the same article from above to determine what TCP/IP port DataGate uses.

## Remove the DataGate instance

With the four values from above available, you’re ready to uninstall DataGate.

**Step 1.** End DataGate on the IBM i. Before you start the uninstall, it is very important that you are sure that no user jobs are running and that DataGate is stopped before you attempt to uninstall DataGate. See this article for how to end DataGate on the IBM i.

**Step 2.** Remove DataGate job queue entries. Use RMVJOBQE to remove DataGate and DG8_SVC job queue entries from your **[DG 
Library]**.

![Remove DataGate's job queue entries](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/tn5250_JPge9QCTAK.png)

In the figures above, the respective job queue entries are removed from the DG8_160 library that was installed in the QINTER subsystem.

**Step 3.** Delete job queues. Use DLTJOBQ to remove DataGate and DG8_SVC job queues from your **[DG Library]**.

![Delete DataGate's job queues](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/tn5250_LqPSN7TFDt.png)


**Step 4. Remove DataGate's service table entry.**

Use the RMVSRVTBLE command to delete DataGate’s service table entry. As explained above, this article shows how to determine DataGate’s service table entry and its TCP/IP port.

![Remove DataGate's service table entry](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/tn5250_OnWKCy8lBs.png)

Both the Service and Protocol parameters are case-sensitive. Enter these values carefully.

**Step 5. Delete DataGate's library.**

Use the DLTLIB command to delete DataGate's library.

![Delete DataGate's library](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/tn5250_vX3KPmPwpu.png)

The DataGate instance is now uninstalled.

**Step 6. If you are removing DataGate to get a clean uninstall for a reinstall.**

After being sure that there are no users of any instance of DataGate, remove the DG8SVCPRF user profile.

```
DLTUSRPRF USRPRF(DG8SVCPRF)
```
Reinstalling DataGate will add the DG8SVCPRF user profile back (and ensure all of its authorities are correct) for all DataGate instances.

**Step 7. If you were removing DataGate to get a clean uninstall for a reinstall.**

You can [reinstall DataGate now.](https://docs.asna.com/documentation/Help160/DG400/_HTML/Installation.htm)

## To remove all instances of DataGate entirely

Before continuing, ensure that there are no DataGate end-users active.

**Step 1. Remove all instances of DataGate using the per-instance instructions above (stopping at Step 5).**

**Step 2. Remove the DG8SVCPRF user profile.**

```
DLTUSRPRF USRPRF(DG8SVCPRF)
```
**Step 3. Delete the ASNA\_DG8 library.**

```
DLTLIB ASNA_DG8
```
DataGate is now completely removed from your system.
