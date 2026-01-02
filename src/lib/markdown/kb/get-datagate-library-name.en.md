---
title: How to determine DataGate for IBM i's library and version info
description: 'How to confirm the library that your DataGate for IBM i instance uses. '
tags:
  - datagate-ibm-i
  - ibm-i
date_published: '2023-12-29T10:54:25.000Z'
date_updated: '2023-12-29T18:13:09.000Z'
date_created: '2023-12-29T18:13:09.000Z'
pinned: false
---

<script>
    import Image from '$components/text-decorators/Image.svelte'
</script>


## Question

How can I determine what version and build of ASNA DataGate for IBM i, and what its library name is, my system is using?

## Answer

ASNA DataGate for IBM i is an IBM i host service that serves IBM i data to ASNA clients such as ASNA Visual RPG, Wings, and Mobile RPG. These instructions show you what version(s) of DataGate are running on your system.

The data area named `reldate` in your DataGate for IBM i library shows the DataGate version and build number. 
If you installed DataGate to its default library, which is `DG8_xxx` (where `xxx` is your DataGate for IBM i version number) use this command to see the `reldate` data area:

`DSPDTAARA DG8_160/RELDATE`

This shows your DataGate for IBM version and number number (in the red box below) as shown in the figure below:

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/current-version.png" alt="DataGate version and build number shown in red box." alignment="center" caption="Figure 1."/>

If you don't know the DataGate library on your IBM i, then use the steps below to determine what version of DataGate is currently running on your system:

**Step 1.**           First, use WRKACTJOB and find the DG8SVC jobs. For each instance of DataGate for IBM i, there is one DB8SVC job where the Function column is "CMD-DG8SVC." Two of those jobs are shown in the screenshot below. This indicates there are two separate instances of DataGate running on this IBM i. In most installations, there is only one version of DataGate running. If you do see more than one DG8SVC job where the Function column is "CMD-DG8SVC" do steps 2 and 3 for each of those jobs.

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/dg8-cmd-dg8svc.png" alt="Show active DG IBM i jobs" width="600" alignment="center" caption="Figure 2a."/>

If you know what subsystem DataGate is running in, you can also use WRKSBSJOB to find the DG8SVC jobs. For example, if DataGate is running from QINTER, this command

`WRKSBSJOB QINTER`

lists only the jobs initiated from that subsystem.

**Step 2.** To show what library your DataGate for IBM i instance resides in, select a DG8SVC/CMD-DG8SVC job and use option 5 to work with that job. Then use option 10 to display its job log. This shows the library from which the DG8SVC job was launched (as shown below).  Note that if you have multiple instances of DataGate installed you may need to check more than one DG8SVC/CMD-DG8SVC job.

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/current-lib.png" alt="Show DataGate library name" width="600" alignment="start" caption="Figure 2b."/>

By default, a DataGate library is named DG8\_xxx where xxx = is the DataGate version number. However, some customers rename that library while installing DataGate so rather than assuming what the DataGate library is, it's better to use this Step 2 to know what it is for sure.

**Step 3.** Knowing DataGate's library name, display the DataGate version with

`DSPDTAARA [library]/RELDATE`

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/current-version.png" alt="Show DataGate library in RELDATE data area" width="600" alignment="center" caption="Fig 2c."/>

The contents of the `RELDATE` data area show the DataGate version number. In the screenshot above you can see that this version is DataGate 16.0.8.0. 

Bonus info: This data area shows the TCP/IP port to which DataGate is bound. The TCP/IP port is the first set of numbers after the subsystem (shown in the blue rectangle above). In this case, DataGate is bound to port 5160.