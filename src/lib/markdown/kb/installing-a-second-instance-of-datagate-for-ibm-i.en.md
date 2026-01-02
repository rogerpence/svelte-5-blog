---
title: Installing a second instance of DataGate for the IBM i
description: How to install a second instance of DataGate for the IBM i. This article also suggests a good strategy for upgrading DataGate for the IBM i.
tags:
  - datagate-ibm-i
date_published: '2023-11-07T18:54:26.569Z'
date_updated: '2022-06-22T00:00:00.000Z'
date_created: '2022-06-22T00:00:00.000Z'
pinned: false
---

> Please read these instructions completely to ensure a successful co-existing install of ASNA DataGate for IBM i. If you have any questions, please contact us at info@asna.com  before you start your installation.
> 
> It is very important to end all existing versions of DataGate that are running before installing a new instance. Starting with DataGate 16.x, the installation procedure ends all existing instances of DataGate and starts the one you just installed. [See this article for how to end DataGate]

*   During installation, be sure to vary these configuration values:    

    * **Service table entry name** . Be sure to provide service table entry name that is not currently in use. Use WRKSRVTBLE to see your current server table entries. By default, DataGate’s installation creates a service table name "DataGate400". However, you might want to consider using the naming it "DataGateXXN" where `XX` is the major version and `N` is the minor version number–so that you would use the name `DataGate160` for DataGate 16.0.

    * **TCP/IP port** . Each DataGate instance needs its own TCP/IP port. See the more detailed note on the TCP/IP port below.

    * **Target library name**. By default, DataGate’s installation uses the name `DG8/_XXN` using the major/minor numbering mentioned above. For example, DataGate 16.0’s default library is `DG8_160` .          
*   During installation, you are asked if you want to clear the DataGate cache library. Be sure to reply "N" to this question if other instances of DataGate are running. **Replying "Y" will disrupt your running DataGate instance.**
* DataGate Database Names reference DataGate’s TCP/IP address. During testing of your instance of DataGate, create a Database Name that points to the new instance of DataGate. Later, when you switch the new version of DataGate over to production, you’ll need to either change the production Database Name’s TCP/IP port or change the service table entries that reference the TCP/IP port that your new DataGate instance uses.
    
*   It is OK to install another DataGate instance into the same subsystem as the currently-running DataGate instance. By default, this subsystem is QINTER.
    
*   Remember to change references to DataGate in your IBM i IPL startup program, when you’re ready switch the new version of DataGate over to production.
    

