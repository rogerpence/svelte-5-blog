---
title: The DG8SVCPRF user profile and multiple DataGate with IBM i instances
description: This article explains considerations the DG8SVCPRF user profile when you have multiple instances of DataGate for IBM i installed.
tags:
  - datagate-ibm-i
date_published: '2024-01-09T13:28:43.000Z'
date_updated: '2024-01-09T21:14:30.000Z'
date_created: '1970-01-01T00:00:00.000Z'
pinned: false
---

The following information applies to all GA releases of DataGate for IBM i (DG) from v15 through the current (v17).

**When multiple DG instances are installed, can each instance have its own service *USRPRF (other than DG8SVCPRF)?**

No. `DG8SVCPRF` cannot be configured per-instance.  All instances of DG must share the same `*USRPRF` object, and it must be named `DG8SVCPRF`.

**When a second DG instance is installed, is DG8SVCPRF deleted and recreated?**

No. If `DG8SVCPRF` exists (whether or not any DG instance is already installed), it is used as the service `*USRPRF` for the new instance. If `DG8SVCPRF` does not exist, the installer creates it via the `CRTUSRPRF` command.  In either case, the installer ensures `DG8SVCPRF` is assigned certain required attributes (more info below).

**When a new DG instance is installed, is a new *JOBD created?**

Only if the installation library does not already contain a `*JOBD` object named `DG8SVCJOBD`, one is created there.  It is created via the `CRTDUPOBJ` command, which specifies the well-known system object `QDFTJOBD *JOBD`, residing in the `QGPL` library, as the `OBJ` source object parameter.  Whether or not the installer creates `DG8SVCJOBD`, it ensures the `*JOBD` has certain required attributes.  It invokes the `CHGJOBD` command, specifying the `JOBMSGQFL(*WRAP)` and `QLWMLTTHD(*NO)` parameters, and sends an `*ESCAPE` message if the command fails.  It also invokes the `CHGOBJOWN` command, specifying the `NEWOWN(QDFTOWN)` parameter, and sends an `*ESCAPE` message if the command fails.  

**When a second DG instance is installed, is its *JOBD always associated with DG8SVCPRF?**

Yes. The installer ensures the `DG8SVCJOBD *JOBD` in the installation library is associated with `DG8SVCPRF` via the CHGUSRPRF command.  Whether or not `DG8SVCPRF` is created, the installer ensures the `*USRPRF` has this and other required attributes (see below).

**What other attributes are assigned to DG8SVCPRF at installation time?**

The `CRTUSRPRF` command, if invoked by the installer (see above), is passed these parameters: 
* `PASSWORD(*NONE)` 
* `STATUS(*DISABLED)` 
* `USRCLS(*USER)`
* `INLMNU(*SIGNOFF)`

Even if the `DG8SVCPRF` is not created by the installer, the `CHGUSRPRF` command is always invoked on `DG8SVCPRF` with these parameters:

* `STATUS(*DISABLED)`
* `INLMNU(*SIGNOFF)` 
* `SPCAUT(*JOBCTL)` 
* `JOBD(&InstlLib/DG8SVCJOBD)` 

where `&InstlLib` is the target installation library.

**The DG8SVCPRF `Status` should always be `*DISABLED`**

The DG8SVCPRF profile's `Status` should always be disabled to eliminate the possibility of someone using it to sign into an interactive session on the IBM i. Disabled IBM i user profiles _can_ submit jobs.