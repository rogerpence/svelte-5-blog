---
title: How to upgrade ASNA DataGate WebPak
description: 'ASNA DataGate WebPak is the DataGate client for ASP.NET Web apps. This article explains how to upgrade ASNA DataGate WebPak on Microsoft IIS Servers. '
tags:
  - asp-net
  - datagate-ibm-i
date_published: '2023-12-28T18:10:35.000Z'
date_updated: '2023-12-28T18:10:35.000Z'
date_created: '2023-12-28T18:10:35.000Z'
pinned: false
---

The ASNA WebPak is the DataGate client for Windows Servers. It is to Windows servers what the Client Deployment binary is to Windows clients. The WebPak should be installed on any Web server on which you've deployed an AVR ASP.NET Website/Web services or Monarch migrations.

Installing WebPak is very simple; you just run the WebPak's executable to install it. Previously-created database names continue to work with a new WebPak install.

A Web server does not need, nor does it use, multiple versions of WebPak. Windows policies ensures that the highest installed version is always used at runtime-and installing a newer WebPak deletes the previously installed version.

## Be sure to install the correct WebPak version

The WebPak version must always the same, or lower, version than DataGate. However, a higher WebPak version doesn't work with a lower DataGate version. For example, WebPak 17 works with DataGate 17 and lower-but a WebPak 16 would not work with DataGate 17.

## End DataGate IBM i end user jobs first

Probably the hardest part about installing the WebPak is ensuring that no DataGate end-user jobs are active during the install. We strongly recommend that you ensure that all end-user jobs are ended before doing a WebPak install. DataGate IBM i end-user jobs are always named `DG8_NET`. [Read more here](/en/kb/understanding-end-user-jobs) about DataGate end user jobs. Do not end DG8\_NET jobs manually-rather have your users bring there applications down normally. Because of DataGate connection pooling, ASP.NET-related IBM i jobs don't end until the duration of your ASP.NET application's Session Timeout value. For example, let's say your session timeout value is 20 minutes (the default). The last ASP.NET-related DG8\_NET job ends 20 minutes after the last user ends their active app.

> Some ASNA DataGate customers use both ASP.NET Web apps and fat Windows clients. Both of these application types create DG8\_NET jobs. Make sure all  DG8\_NET jobs are gone before continuing with the install.

To keep ASP.NET end-users from sneaking a job in on you after you thought all the DG8\_NET jobs were ended, Consider using  [the technique discussed in this article](/en/kb/take-asp-net-offline)           to take your ASP.NET application offline while you're installing a new version of the WebPak.

When WRKACTJOB shows no DG8\_NET jobs, you're ready to install the WebPak.

## Installing a WebPak upgrade

Steps to install the WebPak:

1. Ensure that no DG8\_NET jobs are runnning.
2. Download the WebPack from
               [/en/support/downloads](/downloads/en/)
3. Installing the new WebPak on your Windows server as an administrator. (Right-click the WebPak executable you downloaded and click "Run as Administrator".)
4. Test your application with the fresh WebPak.