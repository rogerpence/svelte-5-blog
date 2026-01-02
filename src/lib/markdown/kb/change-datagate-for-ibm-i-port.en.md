---
title: Change DataGate for IBM i's TCP/IP port
description: How to change the TCP/IP port that DataGate for IBM i uses
tags:
  - datagate-ibm-i
  - ibm-i
date_published: '2023-11-14T00:00:00.000Z'
date_updated: '2023-11-14T00:00:00.000Z'
date_created: '2023-11-14T00:00:00.000Z'
pinned: false
---

This article explains how to change the TCP/IP port that DataGate uses.

Why would you ever want to change the TCP/IP port? In normal circumstances, you’d generally not ever need to do this. However, if you're installing a second DataGate instance, you may want to change the existing existing TCP/IP port so that the second instance can use that port number. 

## To change the TCP/IP port that DataGate uses:

1. Ensure no DateGate user jobs are active and then end DataGate with 
    ```
    <DataGate library name>/ENDDG8SRV
    ```
2. Delete the Service Table Entry for your old version of DataGate:

	* Type `WRKSRVTBLE` on the IBM i command line and press Enter.

	* Scroll to bottom of the list.

	* The DataGate entry is usually listed as `DataGatexxy` where `xx` = main version number and `y` = minor version number.

	* Use option 5 to display the DataGate entry.

	* Write down the Service and Port values shown (or take a screen shot of it). You’ll use the port value in Step 5.

	* Press enter to return to the Service Table Entries list and use Option 4 to remove this Service Table Entry.

3. Create a new Service Table Entry for your new DataGate instance with the ADDSRVTBLE command using these values:

    * `Service` = Use the Service value as determined in Step 4 (use exactly the same case as determined in Step 4).
     
    * `Port` = Port value used by old instance (as determined in Step 3)
    
    * `Protocol` = "tcp" where lowercase is very important!
    
    * `Description` = DataGate xxy (where xx = the major DG  version number and y = the minor version number)

3. Restart your new DataGate instance:

    ```
    <new DG Library name>/STRDG8SRV
    ```
    
> Your DataGate Database Names must also be changed to match the port number in the Service Table entry. 

