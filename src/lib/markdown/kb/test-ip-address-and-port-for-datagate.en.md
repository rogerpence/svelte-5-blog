---
title: How to test IP address and port for DataGate on the IBM i
description: How to use PowerShell's test-netconnection cmdlet to ensure that your IBM i IP address and port are open and available to DataGate for IBM i.
tags:
  - datagate-ibm-i
  - ibm-i
date_published: '2023-12-29T10:54:25.000Z'
date_updated: '2023-12-29T16:56:58.000Z'
date_created: '2023-12-29T16:56:58.000Z'
pinned: false
---

When you have trouble connecting with DataGate for IBM i (especially for new or upgraded installations) the first thing you check is the IP address and the TCP/IP port. This article shows a good way to do that.

DataGate for IBM i needs a TCP/IP port to work. By default, DataGate uses port 5042, but you can change that if you want to.  You can change it during DataGate's installation or you can           [change it after installation with these instructions](/en/kb/change-datagate-for-ibm-i-port)           .

Regardless of the port number that DataGate uses, it's important that the port is open and available to your clients. You can't test port access with the PING utility. You can test it with a Telnet client but that test is a little convoluted.

A better way to ensure that both your IP address and port is working for DataGate is to use PowerShell's           `
               test-netconnection
          `           cmdlet.           [PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/overview?view=powershell-7.3)           is easily one of the most overlooked Windows tools in the history of Windows. If can do all kinds of cool things and PowerShell scripts are vastly more powerful and less arcane that DOS batch files.

## Testing IP address and ports with PowerShell

To use this tip, you don't need to write any special PowerShell scripts or even know PowerShell. First, open Windows PowerShell console (the easiest way is by tapping the Windows key and type "powershell").

> The DOS command line console cannot execute PowerShell cmdlets. You must use the PowerShell console to run PowerShell cmdlets.

Then, from the PowerShell command line, enter this command:

```
test-netconnection -port pppp -computername nnnn
```
where           `
               pppp
          `           is the TCP IP port and           `
               nnnn
          `           is the IP address or computer name you want to check.           [Read more about
               `
                    test-netconnection
               `
               here](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/test-connection?view=powershell-7.3)           .

For example, this command

```
test-netconnection -port 5042 -computername cypress
```
checks that access to the computer named           `
               cypress
          `           on the network (an IBM i this case) through port 5042 is available.

If the           `
               test-netconnection
          `           cmdlet succeeds, it reports

```
ComputerName     : cypress
RemoteAddress    : 10.1.3.207
RemotePort       : 5042
InterfaceAlias   : ASNA VPN
SourceAddress    : 192.168.40.138
TcpTestSucceeded : True
```
If it fails, it reports:

```
WARNING: TCP connect to (10.1.3.207 : 5042) failed
```
If the test fails, DataGate won't connect.

To diagnose things further, first use the           `
               test-netconnection
          `           command without the           `
               -port
          `           argument to ensure the computer name or IP address is correct.

When you're sure the computer name or IP address is correct, when the test fails with the           `
               -port
          `           argument provided that almost always means either you are using the wrong port number (           [confirm the port number with these instructions](/en/kb/confirm-datagate-port) or the Windows firewall is blocking access to the port.