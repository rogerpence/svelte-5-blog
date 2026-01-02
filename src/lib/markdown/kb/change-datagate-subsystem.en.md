---
title: How to put ASNA DataGate for IBM i in its own subsystem
description: "This article how to create a dedicated subssystem for an existing existing DataGate on an IBM\_i installation."
tags:
  - datagate-ibm-i
date_published: '2024-03-19T12:35:56.000Z'
date_updated: '2024-03-19T19:03:23.000Z'
date_created: '2024-03-19T19:03:23.000Z'
pinned: false
---

This article shows how to create a dedicated subsystem for an existing DataGate for IBM i installation. 

> This is not an end-user task and doing it incorrectly can at the least disable DataGate and at the worst disable your IBM i. 

> Before attempting to do this on your IBM i please perform a system backup of your current configuration and familiarize yourself with each command. If you're not familiar with changing your IBM i configuration please coordinate with your System Administrator. We strongly recommend doing this on a dedicated system with no other current users. It may also be helpful to consult your system's documentation for more information regarding subsystems and job performance. 

## Step 1. End DataGate on your IBM i

Before you perform this step make sure there are no [end-user DataGate jobs](/en/kb/datagate-for-ibm-i-end-user-jobs) running on your IBM i.

```
<DataGate_Library>/ENDDG8SVR
```
## Step 2. Create a new subsystem description

The following command uses parameters values that most closely match the attributes of the `QINTER` subsystem. You may want to use other parameters to suit the application. Here, the new subsystem description has been named `ASNADG` and has been placed in the installation library:

```
CRTSBSD SBSD(<DataGate/Library>/ASNADG) + 
    POOLS((1 \*BASE) (2 \*INTERACT)) + 
    TEXT('ASNA Datagate subsystem')
```    

In this article, `<DataGate/Library>` refers to the library into which DataGate is installed and the new subsystem name is `ASNADG`. Change that to the subsystem name you want. See [this article to determine what library DataGate is installed in on your system](/en/kb/get-datagate-library-name).

## Step 3. Remove the default DataGate job queue entries from `QINTER`

```
RMVJOBQE SBSD(QINTER) JOBQ(<DataGate_Library>/DG8_SVC)
```

and 

```
RMVJOBQE SBSD(QINTER) JOBQ(<DataGate_Library>/DATAGATE) 
```
   
## Step 4. Create job queue entries in the new subsystem description

```
ADDJOBQE SBSD(<DataGate_Library>/ASNADG) +
    JOBQ(<DataGate_Library>/DG8_SVC) +
    MAXACT(*NOMAX) SEQNBR(11)
```

and 

```
ADDJOBQE SBSD(<DataGate_Library>/ASNADG) + 
    JOBQ(<DataGate_Library>/DATAGATE) +
    MAXACT(*NOMAX) SEQNBR(12) 
```    

## Step 5. Create a \*CLS object

Once again, parameters like those found in the `QINTER` subsystem are used here. The class is given the same name as the subsystem description and is placed in the same library:

```
CRTCLS CLS(<DataGate_Library>/ASNADG) RUNPTY(20)
```
## Step 6. Create a new routing entry

Create a routing entry in the new subsystem and attach the class created in the previous step (with the CLS parameter). The command parameters here also resemble `QINTER's` configuration:

```
ADDRTGE SBSD(<DataGate_Library>/ASNADG) +
    SEQNBR(9999) +
    CMPVAL(*ANY) +
    PGM(QSYS/QCMD) +
    CLS(*SBSD) +
    MAXACT(*NOMAX) +
    POOLID(2)
```

## Step 7. Start the subsystem

You may also want to add this command to `QSTRUP` or whatever script that runs at IBM i startup (its IPL). After this has been executed, the ASNADG subsystem should show up in a `WRKACTJOB` display (with no jobs):

```
STRSBS SBSD(<DataGate_Library>/ASNADG)
```    
    
## Step 8. Start DataGate for IBM i 

```
<DataGate\_Library>STRDG8SVR
```

If the [usual DataGate server jobs](/en/kb/understanding-datagate-for-ibm-i-service-jobs) don't show up in a `WRKACTJOB` display there is a problem with the configuration. There will likely be a job log for the failed `SBMJOB` command used to start the DataGate server. `WRKSPLF DG8SVCPRF` usually indicates what the problem is.

