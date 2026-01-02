---
title: How to confirm DataGate for IBM i's IP port assignment
description: 'How to confirm the IP port assigned to DataGate for IBM i. '
tags:
  - datagate-ibm-i
  - ibm-i
date_published: '2023-12-29T10:54:25.000Z'
date_updated: '2023-12-29T17:17:31.000Z'
date_created: '2023-12-29T17:17:31.000Z'
pinned: false
---

When you install ASNA DataGate for IBM i, you select a TCP/IP port through which DataGate connects on your IBM i. The default value for this port is 5042, but you can use any available port on your IBM i. Knowing how to check which port is in use is an important part of troubleshooting DataGate.

This article confirms that DataGate is using the correct TCP/IP port.           [See this article for how to identify DataGate for IBM i's configured TCP/IP port.](/en/kb/test-ip-address-and-port-for-datagate)

## Determine what port Datagate is using on your IBM i

To see what port is assigned to your DataGate instance, use the IBM i command

`
               WRKSRVTBLE
          `

to show your IBM i's Service Table Entries.

The list is presented alphabetically with lower-case services listed first. The DataGate entry is in mixed case and is at or near the end of the list. Scrolling down to the DataGate entry shows the TCP/IP port to which it's assigned.

![Work with service table entries](https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/wrksvrtble.png)

Figure 1. Showing DataGate's WRKSRVTBLE entry.

The figure above shows that the DataGate port is 5150. (The default is 5042. On ASNA R&D boxes we often have several instances of DataGate installed and running. Our convention is to assign the port in the format 5xxy where xx is the major version of DataGate and y is the minor version of DataGate)

The default name for the DataGate Service Table Entry is "DataGate           *xxy*           " where           *xx*           is the major version of DataGate and           *y*           is the minor version of DataGate.

Note: if for any reason you need to manually modify the DataGate Service Table entry, be sure that the protocol is entered as           *'tcp'*           with lower case.

## Confirm DataGate Service Table Entry name

To confirm DataGate's Service Table Entry name, use

```
DSPDTAARA <DataGateLibrary>/TCPSERVICE 
```
[See this article to determine your DataGate instance's library name.](/en/kb/get-datagate-library-name)

## View TCP/IP port activity

To see the DataGate port activity, use the IBM i command

```
NETSTAT
```
![Netstat menu](https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/netstat-2.png)

Then take option 3, "Work with IPv4 Connection Status."

Then,

- Press F14 to display port numbers
- Press F11 to display users
- Press F13 to select column sort and sort by "Local Port"
- Press F15 to select a port range. Tab down to Local Port range and enter 5000 as the lower value and 6000 as the upper value. This range assumes you're using the convention of assigning DataGate ports in the 5000 to 5999 range. If you're using another convention, select your range appropriately.

DataGate ports are the ones for user           `
               DG8VSCPRF
          `           .

This results in the display shown below:

![Netstat results](https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/netstat-1.png)

Figure 2. Showing DataGate TCP/IP port activity with NETSTAT

This display shows port 5150 activity. You can also see that, on this box, there is a second instance of DataGate running on port 5160. Using our R&D conventions, this quickly tells us that both DataGate 15.0 and DataGate 16.0 are both running on this IBM i.