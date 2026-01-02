---
title: Using FTP to send and receive IBM i source members
description: This article shows how to use Windows' FTP to upload and download IBM i source members from and to your PC.
tags:
  - ibm-i
date_published: '2024-01-08T23:31:20.000Z'
date_updated: '2024-01-09T06:33:07.000Z'
date_created: '2024-01-09T06:33:07.000Z'
pinned: false
---

Occasionally you might need to send or receive a source member from/to your Windows PC and the IBM i. Assuming your IBM i has FTP enabled, it's a snap to perform this task with Windows' built-in FTP client.

> To further explore FTP on Windows, see the [list of Windows FTP commands](http://www.nsftools.com/tips/MSFTP.htm) .

To start FTP on Windows, open a DOS command line and type `FTP` and press enter. Use the following commands to receive or a send a member from and to the IBM i.

Use these FTP commands to retrieve an IBM i source member to a PC file:

```
ftp
open  (Enter user ID and password as prompted)   
quote site namefmt 0
ascii
get library/file.member pcfilename      
```    

The `quote site namefmt 0` command enables the `library/file.member` naming for the ftp `get` and `put` commands. See MC Press's detailed explanation of `namefmt` for more details (I'm pretty sure it was written by [IBM midrange guru Joe Hertvik](http://joehertvik.com/) ). The `ascii` command ensures you're receiving or sending ASCII data.

Use these FTP commands to send a PC file to an IBM i source member:

```
ftp 
open  
(Enter user ID and password as prompted)
quote site namefmt 0
ascii
put pcfilename library/file.member
```    

When you use FTP to send a new member to the IBM i, its source type and description won't be set. Use PDM or the CHGPFM command to change those.

## A bonus FTP tip

Here's an interesting FTP tip that is perhaps more revealing than it is useful. Assuming you have the proper authority to the IBM i object, you can use FTP to submit commands to the IBM i. For example, if you wanted to use FTP to also set the source type and description for a member, you could call CHGPFM like this:

```
    ftp 
    open  (Enter user ID and password as prompted)
    quote rcmd chgpfm file(rpglesrc/mylib) mbr(mymbr) srctype(RPG) > description('My source member')
```
There are two take-aways here:

1.  **FTP, in the right hands, can be pretty cool.** I've hacked together a nice little workflow for myself that enables me to edit code on my PC, and quickly and easily get it to and from the IBM i with FTP (Some things never change! I've been doing variations of this since 1991!). Enterprising programmers could easily build some handy batch files to automate this kind of FTP work.
2.  **FTP, in the wrong hands, can wreak untold havoc!** Keep your objects locked down with appropriate authorities and, if you're going to use FTP with Windows and your IBM i, consider adding [an FTP exit program to your IBM i](http://www-01.ibm.com/support/docview.wss?uid=nas8N1018050) for extra protection against FTP gone wild!

