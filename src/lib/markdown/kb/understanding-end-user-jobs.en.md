---
title: Understanding DataGate for IBM i end-user jobs
description: 'This article explains what DataGate for IBM i end-user jobs are and how to work with them. '
tags:
  - datagate-ibm-i
date_published: '2024-01-05T12:35:56.000Z'
date_updated: '2024-01-05T19:26:34.000Z'
date_created: '2024-01-05T19:26:34.000Z'
pinned: false
---

<script>
    import Image from '$components/text-decorators/Image.svelte'
</script>

DataGate for IBM i end-user jobs are the jobs that do end-user work. They are created and used by ASNA product-related end user jobs. [See this article for how to find DataGate for IBM i end-user jobs.](/en/kb/datagate-for-ibm-i-end-user-jobs)

It is strongly recommended that you not end the DataGate service on the IBM i (ENDDG8SVR) until all end-user jobs are ended-either normally or manually. Ending DataGate with active user jobs leaves object locks and other artifacts danglng that make it challenging to restart DataGate. To end all end-user jobs, you need ot know how to identify end-user jobs. This article explains how to do that.

When a user connects to the IBM i, a corresponding job is created on the IBM i. These jobs can be found with WRKACTJOB or WRKSBSJOB and are listed as DG8\_NET jobs (you can see one at the end of the WRKACTJOB display below).

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/work-fat-web-job-1.png" alt="Using WRKACTJOB to find DataGate end-user jobs" width="600" alignment="center" caption="Figure 1."/>

Figure 1. Using WRKACTJOB to find DataGate end-user jobs

DataGate end-user jobs are are the DG8\_NET jobs. Going back in time, prior to DataGate 7.x, these jobs were named DG8\_43.

To see more about the job, enter a "5" to work with the job then enter a "10" to see its job log. For a fat-Windows client you see the following information:

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/fat-job-log.png" alt="A DataGate fat Windows client job log" width="600" alignment="center" caption="Figure 2a."/>

Note that the name of the DataGate library is the first thing shown. In this case, this DataGate instance is in library DG8\_150.

Other useful information in the job log for a fat client apps are:

**JOBNAME**             - to full job name of the corresponding DataGate service job

**CLUSER**           (client user) - the user signed into Windows

**CLTEXT**            - Information about the associated AVR program's process. This shows the Windows machine name (RP-WIN10GIT, the task manager process number (15200), the Windows user again (roger), and the name of the executable. If the AVR program is a Windows fat client the executable will end in "EXE." In this example, an AVR program named DFU.exe is running. If the AVR program is a Web app, rather than showing an EXE, the program will be listed like this [/LM/W3SVC/xxxxx] which indicates the AVR app is running under IIS (Windows' Web server).           [See this article for more on process identification under IIS.](https://docs.microsoft.com/en-us/previous-versions/iis/6.0-sdk/ms524308%28v=vs.90%29)

If you were to look at the Windows Task manager you'd see an entry like this for the executable associated with the job shown in Figure 2a. Note the process ID is 15200, which corresponds to the process ID in Figure 2a.

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/fat-task-mgr.png" alt="The corresponding Windows Task list entry for the job shown in Figure 2a." width="600" alignment="center" caption="Figure 2b."/>

Similar information is shown for Web applications in the IBM i job log. However, the value of CLTEXT is a little different.

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/web-job-log-1.png" alt="A DataGate Web application Windows client job log" width="600" alignment="center" caption="Figure 3a."/>

For Web applications, CLTEXT doesn't show the executable name, but rather lists the IIS metabase path for the executable (which is associated with either an IIS Web site or virtual directory.

The CLTEXT shows that the client is associated with Windows process 13196. If you look at the Task Manager on the Windows PC where the Web app is running, you'd see this corresponding Windows task listed as shown below in Figure 3b.

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/web-task-mgr-1.png" alt="The corresponding Windows Task list entry for the job shown in Figure 3a." width="600" alignment="center" caption="Figure 3b."/>

## Lifetime for a DataGate IBM i job

For fat-Windows clients, the IBM i job will end when the corresponding Windows executable ends. For fat clients, there is one job per Windows executable instance. That is, if a user opens two instances of a Visual RPG fat client app on her PC, each instance has its own job on the IBM i. All fat client jobs originating from the same Windows client count as one seat against DataGate per-seat-based licensing. That is, any one user can have as many executables running from her PC and they all count as one license.

For Web applications, which use connection pooling, the job ends when it has been inactive for the time specified by ASP.NET's Session Timeout value.           [Read more about connection pooling and IBM i jobs.](/en/kb/datagate-connection-pooling)            Most Web apps today are against a WebPak site license which allows unlimited jobs. But some customers still have per-seat DataGate licenses for DataGate WebPak. With per-seat WebPak licensing, all activity initiated from a user's browser count as one seat against DataGate per-seat-based licensing. That is, any single browser instance can run multiple instances of an AVR/Wings Web app(s) from different browser tabs and those all count as one license.
