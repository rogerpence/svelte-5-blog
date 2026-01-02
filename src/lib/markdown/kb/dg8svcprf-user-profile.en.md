---
title: What is the IBM i user profile DG8SVCPRF used for?
description: 'The DG8SVCPRF user profile is used by ASNA DataGate''s DG8SVC service job to start new DataGate end-user jobs. '
tags:
  - datagate-ibm-i
date_published: '2024-01-05T12:35:56.000Z'
date_updated: '2024-01-05T18:40:06.000Z'
date_created: '2024-01-05T18:40:06.000Z'
pinned: false
---

## Question

What is the IBM i DG8SVCPRF used for?

## Answer

When an application requests a DataGate job on the IBM i, the ASNA DG8SVC initiates that job through an ASNA DG8\_START job. DG8\_START jobs run under the DG8SVCPRF user profile. Once DG8\_START gets user credentials from the DataGate client, it adopts authority of the incoming user profile and then submits a DG8\_NET job for the application. DG8\_START then fades back into the background awaiting a another application request. Note that prior to DataGate 16.x, DG8\_START jobs were spun up on demand; with DataGate 16.x three (by default) DG8\_START jobs persist. (See            [this article](/en/kb/understanding-datagate-for-ibm-i-service-jobs)            for details on DataGate IBM i jobs).

The DG8SVCPRF user profile is created during DataGate installation (if it doesn't already exist). If the DataGate service job has trouble starting a job, a one-page report outlining the possible cause of the problem will be generated for the user DG8SVCPRF and printed to the assigned printer. This report will not print unless the Output Queue associated with this printer automatically prints the generated reports. Otherwise, to view the list of reports that have not printed for this user, enter the following command:

```
WRKSPLF SELECT(DG8SVCPRF)
```
Anytime you have issues with ASNA DataGate, taking a look at DG8SVCPRF's spool file is a good place to start.