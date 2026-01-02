---
title: How to start, stop, and confirm DataGate on the IBM i
description: How to start, stop, and confirm that DataGate on the IBM i.
tags:
  - datagate-ibm-i
date_published: '2023-11-04T18:54:26.569Z'
date_updated: '2022-11-03T00:00:00.000Z'
date_created: '2022-06-22T00:00:00.000Z'
pinned: false
---

## Starting and stopping DataGate on the IBM i

To start DataGate:

`<DataGate Library>/STRDG8SVR`

When DataGate starts, a number of DataGate service jobs on the IBM i are started. See this article for an explanation of DataGate’s jobs.

To end DataGate:

`<DataGate Library>/ENDDG8SVR`

See this article for help identifying what your `<DataGate Library>` name is.

> It is always best to ensure that no DatGate end-user jobs are active before using `ENDDG8SRV` . See this article for identifying active DataGate end-user jobs.

## How to determine if a given DataGate instance is running

Using `WRKACTJOB` , look for `DG8SVC` jobs with the function `CMD-DG8_START` . There is one of these jobs for each active (running) instance of DataGate. You can clearly identify the library from which the job’s DataGate instance is running by looking at the job’s job log.

For example, if you have DataGate installed in the `DG8_140` library, if that instance is running its `DG8SVC` `CMD-DG8_START's` job log will show:

![Using WRKACTJOB to see that DataGate is running](https://nyc3.digitaloceanspaces.com/asna-assets/images/from-wp/datagate-dg8svc-job.png)

which indicates that the job is associated with the DataGate instance in the DG8\_140 library.



