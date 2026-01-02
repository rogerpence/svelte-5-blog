---
title: Charting a course for upgrading AVR for .NET
description: This article describes a strategy for upgrading ASNA Visual RPG for .NET.
tags:
  - visual-rpg
date_published: '2024-01-09T20:59:40.000Z'
date_updated: '2024-01-10T04:48:48.000Z'
date_created: '2024-01-10T04:48:48.000Z'
pinned: false
---
Editor’s note: This article originally described version-specific upgrade instructions. It has been updated to reflect a general purpose upgrade strategy.

## Question

My company uses an older version of ASNA Visual RPG and WebPak. What is the path to upgrade to the latest versions of this software–and what issues should we expect?

## Answer

ASNA supports the current version of a given product and one version back. As of April 2023, the current version of AVR for .NET is 17.x and it requires Visual Studio 2022. Anytime you’re using a retired version we strongly recommend upgrading to a supported version. "Supports" means that the product is tested on its supported platforms and gets updates and fixes. When an ASNA product is retired it is no longer tested and no longer receives any updates. See the the current [ASNA Product Requirements](/en/support/product-requirements) for product support details.

> This guide applies to any version of AVR for .NET from AVR for .NET 12.x and up. If you have a version of AVR for .NET Microsoft older than 12.x, these instructions will probably apply, but updating products that old often require additional remediation to upgrade. This especially true or AVR for .NET 7.x (which was introduced in 2003!);

Don’t be put off by the amount of text provided here. Upgrading is actually a pretty simple process. Some customers, though, may need more details than others. If you are very familiar with ASNA products, you can skip ahead to the “On with the upgrade” subhead.

> If you have any questions about upgrading any ASNA product, give us a call before you start! We’ll be happy to help you fully understand the process and answer your questions.

## Upgrade costs

In many cases upgrades for AVR for .NET products are included as a part of your ASNA maintenance plan. Please check with your ASNA sales representative to see if you qualify for a free upgrade.

## Downloading products to install

The ASNA products you need to perform an AVR for .NET upgrade are all [available for download here](/downloads/en). (Don’t forget to read the release notes, if available, for product downloads.)

## AVR runtime frameworks

AVR for .NET produces binary .NET assemblies (executables). These client executables are supported at runtime by one of two ASNA deployment packages:

*   For AVR for .NET ASP.NET Web applications, ASNA DataGate WebPak provides AVR for .NET Web application runtime support. WebPak must be installed on any Web server on which you want to run AVR for .NET binaries for ASP.NET apps. See this article [for more detail on installing WebPak on your server.](/en/kb/upgrade-asna-datagate-webpak).

*   For Windows fat clients, ASNA AVR for .NET Windows Deployment provides AVR for .NET fat client runtime support. Windows Deployment must be installed on any PC on which you want to run AVR for .NET fat client binaries.

> Do not install the AVR for .NET Windows Deployment on a developer PC. The AVR for .NET install includes the development runtime.

Generally, you don’t need to recompile and redeploy your AVR-compiled binaries when you upgrade the runtime. Older client binaries can be run under new runtimes. That said, again, the older your binaries, the more likely you are to encounter issues. It’s also true that older clients work with newer DataGate server versions. For example, an AVR for .NET 15.x-produced binary connects successfully to DataGate for IBM i 17.x.

Developers can install only one version of AVR for .NET on their PC. f you need to have your older AVR for .NET developer environment available, consider setting up a virtual machine with your older software on it for that purpose.

> We recommend keeping your production executable versions within three versions of your WebPak/Windows Deployment version.

## Before you do anything else, backup all of your older Visual RPG projects!

Before you attempt any upgrade, make sure you have a good backup of your existing Visual RPG projects. Opening an older version AVR project with a newer version of AVR performs an implicit one-way conversion of the project to the newer version. This conversion can’t be undone. If you need to roll the upgrade back, you’ll want to have this backup available. Remember, too, that source control isn’t backup! It’s very important to have a good, byte-for-byte project backup in the rare case where you might need to roll an upgrade back.

## Read our release notes

Most ASNA product downloads have release notes! Please read these carefully for each product you need before attempting to install anything. Release notes provide product requirements and other helpful details.

## Confirm IBM i and/or SQL Server compatibilities

Use the [ASNA Product Requirements](/en/support/product-requirements) to ensure that your IBM i OS version and DataGate for IBM i version are compatible with your upgrade. For example, the Product Requirements page shows that AVR for .NET 16.x requires DataGate 16.x and that DataGate 16.x requires IBM i V7R3 or higher. If you need to upgrade DataGate for IBM i, we recommend you do that before you do anything else. [DataGate installation instructions are available here.](https://docs.asna.com/documentation/Help160/DG400/_HTML/Installation.htm)

[See this link](/en/kb/get-datagate-library-name) for how to determine what version of DataGate for IBM i you are currently using. If you need to upgrade DataGate for SQL Server, we recommend you do that before you do anything else. [Installation instructions are available here.](https://docs.asna.com/documentation/Help160/DSS/_HTML/dssInstallMain.htm)

[See this link](/en/kb/determine-product-version-numbers) for how to determine what version of DataGate for SQL Server you are currently using. DataGate for IBM i and DataGate for SQL Server are both backwards compatible with WebPak/Windows Deployment versions. For example, DataGate for IBM i 16.x is compatible with WebPak 14.x.

## Testing is very important

The last item on the upgrade list (presented below) is to test your applications thoroughly after having installed your upgrade. We strongly recommend that before installing any upgrades on a production server, you first install things on a test server or test PC and test all applications thoroughly there before attempting the upgrade on a production box. Nearly all upgrades go quite smoothly, but Murphy lurks!

### On with the upgrade

Enough back story! Let’s get on with the upgrade.

## For developer PCs

*   Acquire the version of Visual Studio your new version of AVR requires ([see the Product Requirements page for this info](/en/support/product-requirements). Microsoft used to offer a free Visual Studio "shell" into which AVR could be installed. Microsoft has since discontinued these shells effective with Visual Studio 2019 . It also used to be that AVR could be installed into the Visual Studio Community Edition. That is also no longer the case–Microsoft changed how the Community Edition supports third-party products (perhaps to limit the unlicensed use of the Community Edition in the enterprise). For AVR for .NET 16.0 and higher you need [a commercial version of Visual Studio Professional or Enterprise](https://visualstudio.microsoft.com/vs/compare/).

> Unlike AVR for .NET, you can have multiple versions of Visual Studio on a single PC. However, unless you have a compelling need to keep your old version of Visual Studio, we recommend you uninstall it before installing a newer version of Visual Studio.

*   After installing the new Visual Studio, using “Programs and Features” in the Windows Control Panel, remove your older version AVR for .NET. Then do a full install of the newer version of AVR for .NET.
*   Watch for .NET Framework version changes. Visual Studio will offer to upgrade a project to a newer version of the .NET Framework. AVR for .NET 16.x requires .NET Framework 4.7 or 4.8.

## For Windows servers (for web applications)

*   Uninstall install the new version of ASNA DataGate WebPak that corresponds to the version of AVR you’ve installed.
*   To be able to maintain ASNA DataGate database names on the server or end-user PCs, download and install the ASNA DataGate Monitor from our downloads page. [Read move about the DataGate Monitor](/en/kb/datagate-monitor).

## For end-user Windows PCs

*   Uninstall your current version of Windows Deployment and then install the newer ASNA Windows Deployment.

## Product licensing

*   After installation, you will need new product licenses. Please send your license requests to codes@asna.com.

## Test, Test, Test

As mentioned previously, we strongly recommend performing your upgrade on a test server or PC and testing your apps thoroughly there before installing the upgrade on a production box. After the upgrade is installed on your production machine(s), test your applications in the production environment to ensure that all is well.
