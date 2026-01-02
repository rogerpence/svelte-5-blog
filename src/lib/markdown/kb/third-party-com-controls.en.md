---
title: AVR Classic and third-party controls
description: This article describes issues and conflicts with third-party controls and ASNA Visual RPG Classic.
tags:
  - visual-rpg
date_published: '2024-01-09T20:59:40.000Z'
date_updated: '2024-01-10T04:51:09.000Z'
date_created: '2024-01-10T04:51:09.000Z'
pinned: false
---
ASNA Visual RPG (AVR) Classic is a COM-based Visual RPG development environment. Version 1.0 was released in 1994. While many retired versions may still be in use, there are currently two versions versions supported by ASNA:

*   **AVR Classic 5.1**, introduced in 2018, used a newer version of the Microsoft C++ compiler to help ensure ongoing interoperability with later versions of Windows 8 and 10.
*   **AVR Classic 5.2**, introduced in 2023, was released because of the C++ with which AVR 5.1 was compiled reached end-of-life. 

AVR 5.1 and 5.2 are direct ports of AVR 4.x and don't introduce any new language features. They exist solely to provide support for Windows and 10/11.

> When it was originally released, AVR 5.0 supported versions of Windows earlier than Windows 10 and 11. Microsoft has since retired those Windows versions. AVR 5.1 and 5.2 are supported on Windows 10 and 11.

Although AVR 4.x doesn't support Windows 10/11, we know that some customers do use AVR 4.x on Windows 10/11. Our testing shows AVR 4.0 works only intermittently on these newer Windows platforms. We have seen an AVR 4.x program work fine on one Windows 10 box and fail on another.

#### From godsend to Achilles' Heel

Microsoft's Visual Basic 1.0 was first released in 1991. While VB was first dismissed as a "toy" language by many (and, indeed, that criticism may have been warranted because VB 1.0 didn't natively have any database support!) by the time VB 3.0 was released in 1993 the enterprise was starting to take Visual Basic seriously. One of the major reasons that VB was successful was because of its support for third-party controls. It didn't take long for an entire new cottage industry of control vendors, from big companies to mom and pop shops to appear.

> [Here is a great story](http://www.forestmoon.com/birthofvb/birthofvb.html) about how Bill Gates insisted that VB 1.0 not be released without support for third-party controls.

By the time AVR 4.0 was released, AVR supported nearly all third-party OCX and ActiveX controls originally intended for VB. Like VB programmers, AVR programmers quickly embraced third-party controls. Tabs, masked input, collapsible treeviews, and a zillion other cool features were implemented with custom controls. These controls added not only important features, but also added a professional polish to the user interface. If you were around back then you'll remember control vendor names such as Bcubed, Crescent, FarPoint, Larcom and Young, Mabry, Sheridan, Vantage Point. These vendors are all gone now.

Alas, while these third-party controls enabled great AVR applications in the 1990s and early 2000s, third-party controls are often the Achilles Heal of these COM applications today. ASNA invested heavily in AVR 5.x to ensure Windows 8/10 64-bit interoperability. However, virtually all third-party COM vendors have disappeared and those old COM control binaries used today are exactly the same binaries used back in the day with 16/32-bit Windows 95 and Windows XP. And while Microsoft certainly hasn't gone out of business, it has for all intents and purposes divested itself of the COM business. Which means that most of Microsoft's old COM controls are as troublesome as any obsolete third-party vendor's controls.

### COM control inconsistencies

There are some known, consistent trouble-maker COM controls for AVR. For example, we've not heard of anyone successfully using the Larcom and Young resizing control–and for many the FarPoint tab control is troublesome (especially with licensing). However, many controls offer inconsistent behavior. Support for many of them can vary from one Windows 10 PC to the next. What works on one PC may not work on another PC.

> Another issue we see every couple of months is a customer who has lost a third-party control license. In this case, while the control may indeed be working well on Windows 10, it won't work on a new PC without a license. With the vendors all gone, these licenses are virtually impossible to get.

Part of this problem may be that there isn't really such a thing as a standard Windows 10 PC. Since its introduction in 2015, Windows 10 has had [several major updates.](https://en.wikipedia.org/wiki/Windows_10_version_history) By saying that ["Windows 10 is the last version of Windows,"](https://www.windowscentral.com/windows-10-may-be-last-version-windows-microsoft-rethinks-operating-system) Microsoft was really saying, "You'll occasionally get what amounts to new Windows versions until hell freezes over through our recurring update process." (Windows 10 v2004, from May 2020, was a major Windows update.) Or maybe,¯\\ _(ツ)_ /¯, that isn't part of the problem! All we really know is that some COM controls exhibit inconsistent and unreliable behavior across seemingly similar Windows 10 PCs.

Another known recurring COM issue is inconsistent registration behavior. From the command line the registration utility may indicate the DLL or OCX was successfully registered, but then the control may not show as registered in ASNA Visual RPG. As with the other issues, we've seen this behavior on one PC and not another. 

> To see what Windows 10 version you're using, press "Windows key" + R and then type `winver` in the input field shown. A small dialog displays your Windows version.

These control issues also apply to the graph control that originally shipped with AVR Classic. The vendor who provided this control to us has been out of business for a very long time. The control is no longer supported in AVR Classic — it is known to cause intermittent issues on Windows 10 and 11. [See this page](/en/kb/third-party-com-controls) for more information about COM controls and AVR Classic.

The underlying issues with all of the old COM controls is that, unlike the AVR 5x family, they were all produced with compilers that substantially predate Windows 10 and 11. The 20+ year binaries those old 32-bit compilers produced have unpredictable fidelity with 64-bit Windows 10 and 11. 

#### Our advice to AVR Classic customers

*  The bottom line is that 20+ year-old COM controls are known to be highly unpredictable on Windows 10 and higher. When a third-party control misbehaves, that behavior is beyond our control and there isn't much we can do about it.

*   If you're using any version of AVR Class less than 5.1, start now to chart your course to upgrade to AVR 5.1 or 5.2. Tech support is not available for any version under 5.1. Upgrading involves recompiling your programs and redeploying a new runtime, but it doesn't require any code changes. A planned, methodical upgrade to AVR 5.1 does require effort, but not as much a panic-driven upgrade because AVR 4.x stopped working on a new Windows 10 version.
        
*   Take an inventory of every third-party control you use. If there are any you can remove, we suggest that. Also, be sure to keep track of your third-party control licenses. Make sure you understand how they are licensed and if the licenses will move successfully to new PCs.
    
*   Don't start using any additional third-party controls. Don't make your hole deeper than it already is.
    
*   Test AVR Classic deployments on new PCs and Windows upgrades very carefully.
    
*   Take a more active awareness of Windows updates, what versions of Windows 10 you have deployed, and carefully manage upgrades to major new Windows 10 versions. [This is a helpful article about Windows updates.](https://www.zdnet.com/article/faq-how-to-manage-windows-10-updates/)

*   And finally, in the longer term, it's important for AVR Classic customers to acknowledge that AVR Classic won't persist forever— due to external forces beyond our control. How COM's destiny plays out in the upcoming versions of Windows is unknown. Given this unknown, the demise of the ActiveX/OCX eco system, and COM programming talent being hard to find, we think it's prudent that you craft a plan to ultimately upgrade or replace your AVR Classic apps. 

The ASNA Services Team has experience in upgrading and replacing AVR Classic apps. Use the "Contact Us" link at the top of this page to ask us about how we can help you craft a long-term plan for your legacy AVR Classic apps. 

 

    
