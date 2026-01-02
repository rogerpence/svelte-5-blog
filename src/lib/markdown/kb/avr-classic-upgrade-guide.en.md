---
title: AVR Classic upgrade guide
description: This article discusses upgrade strategies for ASNA Visual RPG Classic (our COM product).
tags:
  - visual-rpg
date_published: '2024-01-09T12:29:30.000Z'
date_updated: '2024-01-09T18:37:41.000Z'
date_created: '2024-01-09T18:37:41.000Z'
pinned: false
---

<script>
    import Callout from '$components/text-decorators/Callout.svelte'
</script>

AVR Classic is ASNA’s original RPG compiler for Windows. Its core codebase is nearly thirty years old. Windows 7 (supported October 22, 2009 through January 14, 2020) introduced many internal changes over Windows XP that didn’t play well with AVR 4.x.

In 2012, we spent a lot of time moving our AVR 4.x code from a very old C++ compiler to the (then) latest MS C++ compiler. Recompiling AVR 4.x with this much newer compiler added stability and compatibility with Windows 7. We released this recompiled AVR Classic version as AVR 5.0. This was a lateral upgrade and beyond support for Windows 7/8, it didn’t add any new features to AVR Classic.

> Microsoft retired Windows 7 on January 14, 2020 and Windows 8 on January 10, 2023. Neither is supported for use with any version of ASNA Visual RPG.

We’ve upgraded AVR 5.0 twice since its introduction. AVR 5.1 was introduced in 2018 and AVR 5.2 was released in 2023. AVR Classic 5.0 is retired and AVR Classic 5.1 and 5.2 are the two currently supported versions at the time of this article’s publication (October 2023). AVR 5.1/5.2 both support Windows 10/11. Like AVR 5.0, 5.1 and 5.2 are both lateral upgrades; they don’t add new programming features but both work with newer versions of Windows.

If you are using a version of AVR Classic below 5.1, we strongly recommend that you upgrade to either AVR 5.1 or 5.2.

> What does "retired" mean? Retired means the product no longer receives updates or changes and that tech support is no longer available. Should you have a problem with a retired version AVR, you’ll need to upgrade to get it resolved. However, keys are available for retired versions of ASNA Visual RPG.

 
<Callout icon="fa-solid fa-circle-exclamation">
ASNA Visual RPG 4.x is known to have many unpredictable issues with Windows 10 and 11. AVR 5.1 and 5.2 are both compiled with more modern C++ compilers to resolve these issues. We don't recommend trying to use anything lower than AVR 5.1 with Windows 10/11.
</Callout>

### Check your DataGate version

Before upgrading your AVR instance, be sure to check your DataGate version. AVR 5.1 and 5.2 both require either DataGate 16 or 17. If you’re using a lower version of DataGate, you _must_ upgrade it before upgrading to AVR. 5.1/5.2.

If you do need to upgrade DataGate, we recommend you upgrade it before upgrading AVR Classic. Any version of AVR Classic (up to 5.2) connects successfully DataGate 16 or 17. With DataGate upgraded and working with your version of AVR, you’re ready to upgrade AVR itself. See this article for details on [upgrading DataGate for IBM i](/en/kb/installing-a-second-instance-of-datagate-for-ibm-i).

### Upgrading to AVR Classic 5.1 or 5.2

Generally, the effort required to upgrade a lower version of AVR Classic to AVR Classic 5.1 /5.2 is to open the older AVR project in AVR 5.1/5.2 and recompile. The older project is implicitly upgraded for you. Before opening an older project, be sure to make a copy of the old AVR project. The implicit conversion is one-way and you can’t convert a 5.1 or 5.2 back to a lower version of AVR. While nothing usually goes wrong with the implicit upgrade, Murphy lurks and it’s good to be able to start over if you need to. If you’re upgrading from AVR 5.0, it’s not likely that you’ll need to change any code (except for the third-party control caution mentioned below). If you are upgrading from AVR 4.x, you may need to remediate some code.

After compiling but before redeploying your upgraded apps, be sure to test them thoroughly. This is especially true with places in the apps that use third-party controls (see the section below for more on third-party controls).

> You can only have one AVR Classic version on a PC at a time. Using multiple virtual machines is the best way to work with multiple environments.

### Redeploy the new deployment package and your apps

After recompiling your projects with AVR 5.1/5.2, then you need to redeploy them to your clients. Each client must also be upgraded to the corresponding AVR 5.1/5.2 deployment package.

### Beware third-party controls

That said, there is a dark side to an AVR 4.x to AVR 5.1/5.2 upgrade: third-party controls. Although we’ve refreshed AVR 5.1/5.2 to work with Windows 10 and 11, virtually all third-party COM and ActiveX controls have long since been discontinued and/or deprecated. These controls may or may not work on Windows 10/11–and even more frustrating, sometimes they work on some Windows 10/11 PCs but don’t work on others. Beyond troublesome interoperability with Windows 10/11 watch for licensing issues. If you’ve lost the license for a third-party control, it’s not likely that you can get a replacement. The FarPoint tab control and the Larcom and Young resizing control are both examples of controls that are notoriously unfriendly to Windows 8/10.

This third-party control warning also applies to the chart control that originally shipped with AVR Classic. ASNA licensed that control for redistribution in the early 90s and the vendor has long since gone out of business. Most customers report that it appears to work with Windows 10/11, but your mileage may vary. The old chart control is available for AVR 5.1/5.2 but it is no longer supported.

### AVR Classic Web applications — any version

AVR Classic Web apps require VB Script, and VB Script is no longer supported by any modern browser. Even the lowly, and long-retired IE 11, runs VB Script only in "legacy document mode." As of October 2023, Microsoft no longer includes VB Script in Windows.

VB Script is very susceptible to many browser exploits and hackers. Its use today is [strongly discouraged by Microsoft.](https://www.zdnet.com/article/microsoft-were-disabling-vbscript-in-windows-7-8-to-block-attackers/) There isn’t any upgrade path available for AVR Classic applications. If you’re one of the few shops still running AVR Classic websites, we strongly recommend that you rewrite them. While there aren’t automation tools, depending on how your AVR Classic Web application code was written you may be able to salvage some code with cut and paste.