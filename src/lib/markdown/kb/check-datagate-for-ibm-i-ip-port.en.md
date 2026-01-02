---
title: How to see DataGate for IBM i's TCP/IP port configuration
description: This article shows to identify DataGate for the IBM i’s configured TCP/IP port. Use it to confirm that DataGate is using the correct TCP/IP port.
tags:
  - datagate-ibm-i
date_published: '2024-01-08T22:54:28.000Z'
date_updated: '2024-01-09T04:54:52.000Z'
date_created: '2024-01-09T04:54:52.000Z'
pinned: false
---

This article shows to identify DataGate for the IBM i’s configured TCP/IP port. Use it to confirm that DataGate is using the correct TCP/IP port.

The value in the `TCPSERVICE` data area must match _exactly_, including case, the service entry value (as viewed with WRKSRVTBLE). If you change or delete a service table entry,  you must specify the name with its correct casing and the ‘tcp’ protocol must be in lower case.

**Step 1.** Determine the library in which your DataGate instance was installed. See this article for help determining your DataGate library name.

**Step 2.** Display the value of the `TCPSERVICE` data area in your DataGate library with

`DSPDTAARA /TCPSERVICE`

![Using the TCPSERVICE data area to see the DataGate service entry name](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/tcp-port-01.png)

In the figure above, the DataGate library name is DG8_160 and its service table entry name is DataGate160.

**Step 3.** Find the DataGate service table entry. Use the

```
WRKSRVTBLE 
```

command to display all service table entries. Find your DataGate service table entry in the list presented. It is probably near the bottom of the list because by default DataGate service table names start with an upper-case letter.

![Using WRKSRVTBLE to find the DataGate service table entry](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/tcp-port-02.png)

In the example above you can see the DataGate160 service table entry and that it defines port 5160 as your DataGate instance’s port. Each DataGate installation has its own TCP/IP uniquely defined by this service table entry.

Note: this screenshot came from one of ASNA’s test IBM i machines. It has many instances of DataGate installed on it. Most production machines will have only one or two DataGate instances installed.

