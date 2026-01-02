---
title: Understanding DataGate for IBM i service jobs
description: How to identify the IBM i jobs that DataGate for IBM i creates and uses
tags:
  - datagate-ibm-i
date_published: '2023-11-14T19:43:42.548Z'
date_updated: '2023-11-14T19:43:42.548Z'
date_created: '2023-11-14T19:43:42.548Z'
pinned: false
---
  
This article applies to DataGate for IBM i 7.x and up.

## DataGate's service jobs

Once DataGate for IBM i is installed and running, there will be several DataGate jobs running in an IBM i subsystem. The default subsystem is QINTER but that can be overridden during DataGate installation (see this article [for more information on creating a DataGate-specific IBM i subsystem]()

The jobs listed in Figure 1 are the default jobs that run when DataGate for IBM i starts. These jobs handle all the necessary requests from DataGate clients. These jobs are defined by the JOBQE (Job Queue Entries) created during DataGate for IBM i installation:

### DataGate 15.x and lower

|Identifier|Subsystem/Job|User|Type|Function|
|--- |--- |--- |--- |--- |
|A|DG8SVC|D8SVCPRF|BCH|CMD-DG8SVC|
|B|DG8SVC|D8SVCPRF|BCH|CMD-DG8_START|
|C|DG8SVC|D8SVCPRF|BCH|CMD-DG8_START|
|D|DG8SVC|D8SVCPRF|BCH|CMD-DG8_START|

The B-D jobs (CMD-DG8\_START) handle new incoming DataGate connections. Once the request has been fulfilled and the user job has been created (See "various jobs..." section below), the CMD-DG8\_START job will end and a new one will be created in its place. These events will be logged in the job log for the DG8SVC jobs and/or spool file for the DataGate service profile (DG8SVCPRF).

### DataGate 16.x and above

|Identifier|Subsystem/Job|User|Type|Function|
|--- |--- |--- |--- |--- |
|A|DG8SVC|D8SVCPRF|BCH|CMD-DG8SVC|
|X|DG8SVC|D8SVCPRF|BCH|CMD-DG8_START|
|Y|DG8SVC|D8SVCPRF|BCH|CMD-DG8_START|
|Z|DG8SVC|D8SVCPRF|BCH|CMD-DG8_START|

In DataGate 16.x and above, the X-Z Jobs have a similar function to the B-D Jobs of the previous versions but new IBM i system APIs allow us to reuse these X-Z jobs for new connections. So they do not end until DG8SVC ends, for a moderate boost in efficiency. Also their job logs show a message for each new DG8\_NET job they start.

## D8SVC jobs where function is CMD-DG8SVC**

For any given instance of DataGate, there is one one DG8SVC job with the function CMD-DG8SVC. This job is always present when its instance of DataGate is running. For shops running a single instance of DataGate, you'll see one of these jobs active when your DataGate instance is running. When multiple instances of DataGate are installed, you'll see one of these jobs for each DataGate instance that is running. This job's job log clearly identifies the DataGate library (and therefore, the DataGate instance) with which it is associated. If you want to know what versions of DataGate are running, a look at the job logs for these jobs

## DataGate DG8\_START jobs**

Each time DataGate needs to authenticate a user it uses an instance of a DG8\_START job (shown below). Prior to DataGate 16.x, DG8\_START were "transient" jobs, in that they only lived long enough to authenticate and submit a DataGate end-user job (a DG8\_NET job). To avoid the need to spin up DG8\_START jobs on demand, starting with DataGate 16.x there will be a steady three DG8\_START at the ready. These three jobs use zero CPU as they are hanging out awaiting the need to authenticate a user. There are three of them available to handle "bursts" of new authentications (ie, when multiple users need concurrent authentication). 

|Subsystem/Job|User|Type|Function|
|--- |--- |--- |--- |
|DG8_START|D8SVCPRF|BCI|PGM-DATAGATE|
|DG8_START|D8SVCPRF|BCI|PGM-DATAGATE|
|DG8_START|D8SVCPRF|BCI|PGM-DATAGATE|

ort of. Before v16 they were "transient" jobs, in that they only lived long enough to authenticate and submit the dg8\_net job. Then dg8\_ svc would create the new dg8\_net jobs as needed

## Additional DataGate service jobs for Wings, Mobile RPG and Browser Terminal (BTerm)

|Subsystem/Job|User|Type|Function|
|--- |--- |--- |--- |
|DG8SVC|D8SVCPRF|BCH|CMD-DG8SVC|

|Subsystem/Job|User|Type|Function|
|--- |--- |--- |--- |
|ASNAREG|DG8SVCPRF|BCH|PGM-REGISTER|
|DGTNTRLY|DG8SVCPRF|BCI|PGM-DGTNTRLY|

ASNAREG is the license manager for Wings, Mobile RPG, and Browser Terminal jobs. DGTNTRLY is a TCP/IP helper job for Wings, Mobile RPG, and Browser Terminal jobs.

## DataGate end-user jobs

After a successful user connection is established on the IBM i with DataGate two more jobs appear:

|Subsystem/Job|User|Type|Function|
|--- |--- |--- |--- |
|DG8LICNET|DG8SVCPRF|BCH|CMD-DGLICMGR|
|DG8_NET|[DG user]|BCH|CMD-DATAGATE|

The first job to be executed will be DG8LICNET, the DataGate for IBM i License Manager. This verifies DataGate licensing. After the DataGate for IBM License Manager Job is established, it remains active until the DataGate/400 Server is shut down. Note, as shown in the DataGate service jobs section, ASNAREG verifies licensing for Wings, Mobile RPG, and Browser Terminal.

With licensing confirmed a DG8\_NET user job is created. DG8\_NET user jobs come and go as user applications connect and disconnect to DataGate. The status and CPU percentage vary per job. The user profile (shown as \[DG user\] above) for a user job will be the user name associated with the DataGate Database Name on the DataGate client PC (for fat clients) or server (for Web apps).