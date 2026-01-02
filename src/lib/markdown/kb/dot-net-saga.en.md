---
title: 'The .NET Saga: From .NET Framework to .NET'
description: This article explains Microsoft .NET versus .NET Framework.
tags:
  - dot-net
  - dot-net-framework
date_published: '2024-01-09T12:29:30.000Z'
date_updated: '2024-01-09T18:46:53.000Z'
date_created: '2024-01-09T18:46:53.000Z'
pinned: false
---

In early 2002, Microsoft officially released .NET Framework 1.0 to the world. This was a big bet from Microsoft that aimed to replace the aging and ailing COM development model. .NET Framework was part:

*   a competitive response to Java
*   an amalgam of various languages and integrated developer tools
*   an attempt to make it much easier to create enterprise Websites and Web services

At its launch in 2002, Bill Gates described it as "the first fully integrated development environment for building XML Web services and next-generation Internet applications." As with everything else Microsoft did back then, .NET Framework ran only on the Windows platform.

.NET Framework compilers don’t generate processor-specific instructions, rather they generate a source language-independent byte code binary called Microsoft Intermediate Language (MSIL). At runtime, the .NET Framework Common Language Runtime translates the byte code to machine instructions to execute the .NET Framework binaries (as shown below in Figure 1a). The .NET Framework runtime model was very similar to the Java runtime model.

## A new programming model

![.NET Framework 1.0 MSIL and CLR](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/dot-net-1-fw.png)

Figure 1a. .NET Framework 1.0 MSIL and CLR

.NET Framework also provided a full-featured stack of application development components. Its original stack is shown below in Figure 1b, which identified Windows forms, ASP.NET Web development, and ADO.NET database access as its major components:

![The original .NET Framework stack](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/dot-net-1-0-components.png)

Figure 1b. The original .NET Framework stack.

.NET Framework also included Visual Studio for .NET, which provided a full-featured and comprehensive integrated development environment. Visual Studio provided, in one package, user interface designers, debuggers, language services that provided design-time code information (Intellisense), and database access deployment tools (among a host of other bits and bobs). A notable feature of Visual Studio was that it could support third-party add-ins and extensions. This opened the door for third parties to add languages and productivity plugs to Visual Studio.

Microsoft was especially proud that at the .NET Framework 1.0 announcement there were 20 or so languages available for .NET, most provided by third-parties. Although many of these languages were academic exercises, ASNA Visual RPG and MicroFocus COBOL (both there at the beginning), were proof that the enterprise was represented with real-world languages. Having multiple development languages gave .NET a big nudge over the Java ecosystem, which also let you use any language you wanted, as long as it was Java.

ASNA is a charter member of the Visual Studio Integration Partner program. We’ve worked very hard to ensure that our .NET Framework products work in a seamless, natural way with Visual Studio. .NET Core and .NET Framework coexist well together on the same PC.

## Open source, the cloud, and cross platform

The .NET Framework was an audacious, comprehensive step forward. It has served us very well in the 20 years since it was introduced. Since its introduction, it’s been through at least ten major revisions. Alas, time marches on. As the market needs shift, new technologies arise to meet new challenges.

In 2012, Microsoft signaled a huge strategic shift by [announcing that it released ASP.NET MVC (and a few other Web-related technologies, including Razor pages) as open-source products](https://weblogs.asp.net/scottgu/asp-net-mvc-web-api-razor-and-open-source). This marked the first time ever that developers outside of Microsoft could not just see Microsoft source code, but also submit patches and code contributions to these open-source products.

Then, in 2014, Microsoft announced the creation of the [.NET Foundation](https://dotnetfoundation.org/), an independent organization for the development and collaboration of open-source technologies for .NET. ASP.NET, Entity Framework. WebApi, [Nuget](https://www.nuget.org/), and even C# and VB compilers were open sourced through the .NET Foundation.

The new .NET
------------

Later in 2014, also through the .NET Foundation, Microsoft announced .NET Core 1.0, the follow-on to .NET Framework. .NET Core, out of the gate, supported Windows, Linux, and the Mac. It is a group of languages, runtimes, and libraries that coalesced .NET Framework, the [Mono Project](https://www.mono-project.com/) (an open-source version of .NET for Linux), and [Xamarin](https://dotnet.microsoft.com/en-us/apps/xamarin) (an open-source Android/iOS mobile platform) into a single, cohesive cross-platform solution that enables building applications for:

*   Web
*   Mobile
*   Desktop
*   Microservices
*   Gaming
*   Machine learning
*   Cloud
*   Internet of Things

For nearly six years, Microsoft doggedly pushed .NET Core through three versions to provide the stability, cross-platform tooling, and features it needed to make the deliverable live up to the vision and dream. In the fall of 2020, .NET Core 3.1 was the break-out release that proved that Microsoft’s dreams with the new .NET Core were approaching reality and quite nearly for the enterprise.

Figure 2 below shows a highly abstracted view of the .NET Core stack. From an architectural level, .NET Core is generally very much like .NET Framework (compare Figure2 to Figure 1b). It has a top-level stack of "enablers," its own .NET Core Base Class Library, and its own Common Language Runtime. At a high level, the .NET Core architecture was similar to that of the .NET Framework. A substantial difference between the two stacks is that the .NET Framework targets specifically, and works only on, Windows; out of the gate the new .NET Core stack worked on Windows, Linux, and macOS (Mac) operating systems but would also later add Android, iOS, tvOS, and watchOS support to the mix.

![An abstracted view of the multi-platform .NET Core stack.](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/dot-core-stack.png)

Figure 2. An abstracted view of the multi-platform .NET Core stack.

Another way .NET Core is different from .NET Framework, and one of reasons Figure 2 is abstracted, is that .NET Core is substantially more compartmentalized than .NET Framework. Where .NET Framework is (mostly) a monolith that includes code for nearly _everything_ it might ever need to do, .NET Core is more à la cart. That is, many of its components aren’t included in the initial package but can be added as needed through [Nuget](https://www.nuget.org/). [See this article](https://learn.microsoft.com/en-us/nuget/what-is-nuget) for Nuget details. For example, the [Microsoft.Data.SqlClient](https://www.nuget.org/packages/Microsoft.Data.SqlClient) Nuget package provides enhanced features and capabilities over the original `System.Data.SqlClient.` Distributing this new client through Nuget enables Microsoft to make improvements to that driver, and make those improvements available to users, independent of the release cadence .NET Core itself.

> Although .NET Core targets multiple operating systems, .NET Core does offer some Windows-specific features. For example, .NET supports Windows Forms, but only on Windows.

In addition to all of .NET Core’s new features, it’s also notable for what it did not bring forward. Initially WPF (Windows Presentation Foundation, an alternative to Windows forms), WCF (Windows Communication Foundation), and ASP.NET WebForms were not supported by .NET Core. WPF was added to .NET with .NET Core 3.0 and recently WFC was given a new lease on life (with some architectural changes) with the [CoreWCF](https://devblogs.microsoft.com/dotnet/corewcf-v1-released/) project. Alas, ASP.NET WebForms received no such reprieve and is not (and by all accounts) will not be a part of .NET Core. (More on what this means to WebForms developers in a moment.)

Microsoft’s shifts to open source had many cynics and naysayers. However, in 2023 Microsoft is [second in the list of worldwide companies making open-source contributions](https://opensourceindex.io/). Microsoft has three times more active open-source contributors that IBM. It is very clear that Microsoft is very serious about its cross-platform, open-source initiatives.

> In an interview with the Chicago Sun-Times in June, 2001, Microsoft’s then CEO, Steve Ballmer said "Linux is a cancer that attaches itself in an intellectual property sense to everything it touches." Now, 20 years later Microsoft is clearly very serious about the importance of open source and Linux compatibility.
> 
> What changed? It’s hard to say for sure what changed. But, 20 years ago Microsoft’s primary revenue streams were Windows and Office Products. Today, those products are still important, but its cloud initiatives have grown to be a third of company’s revenues (and growing dramatically) and its Xbox-related gaming are also growing nicely. So, maybe Microsoft perceives these things as good hedge/replacement balance sheet line items. Also, while Ballmer did advocate heavily for the cloud, during his tenure Microsoft’s stock price fell 32%. After Ballmer left the new CEO, Satya Nadella, immediately started dramatically reforming Microsoft and [growing its stock value 600%](https://www.cnbc.com/2021/06/24/microsoft-closes-above-2-trillion-market-cap-for-the-first-time.html) while doing so.

No Framework left behind
------------------------

Despite being all-in on .NET Core, Microsoft knows that the .NET Framework has millions of worldwide users. With the first release of .NET Core 1.0, Microsoft pledged then, and continues to pledge, that .NET Framework 4.8 remains very much a supported platform. It receives bug/security fixes and will continue to be distributed with future releases of Windows. The statement of support isn’t just altruistic, Windows itself has a substantial .NET Framework dependence. [The short, clear promise from Microsoft](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-framework) is: As long as it is installed on a supported version of Windows, .NET Framework 4.8 will be supported.

For current ASNA customers using our .NET Framework-based products, there is a clear take-away: All versions of the .NET Framework under version 4.6.1 are deprecated and no longer supported. All ASNA customers using our .NET Framework-based products should set a course to upgrade to .NET Framework 4.7x or 4.8x as soon as possible.

What’s in a name?
-----------------

When planning the release of what had been planned to be .NET Core 4.0, Microsoft determined it was brewing itself a big naming problem. Being firmly committed to supporting .NET Framework 4.8, Microsoft was concerned that customers would find both a ".NET Framework 4.8" and a ".NET Core 4.0" confusing. Two things were done to try to resolve that confusion:

1.  Microsoft skipped version 4.0 of .NET Core and went from 3.1 directly to 5.0.
2.  Perceiving that the word "Core" was also troublesome, Microsoft dropped the word "Core" from the naming.

These changes made .NET 5.0 the follow-on to .NET Core 3.1. The marketing wizards who thought that ".NET Framework 4.8" and a ".NET Core 4.0" would be confusing, also thought that having ".NET Framework 4.0" and a ".NET 5" would be crystal clear. The issue that they ignored was that for 20 years the names ".NET Framework" and ".NET" were used interchangeably to refer to the only .NET available, .NET Framework. This leaves us today with one .NET version with a qualifying name (.NET Framework) and one without (.NET). From this point forward, whenever you hear or read ".NET" you need to carefully consider the context to ensure you know which .NET platform that ".NET" references.

> [Scott Hanselman](https://youtu.be/bEfBfBQq7EE?t=49) on .NET naming: "It’s not the best name, but it’s the name we have." By the way, this video referenced by Hanselman provides a concise, clear definition of .NET.

An example of this naming fiasco that hits ASNA very close to home is the formal, registered name of our .NET Framework-based RPG compiler: ASNA Visual RPG for .NET: Visual RPG targets .NET Framework exclusively, not what is now formally known as .NET. We have hundreds of references to "Visual RPG for .NET" on our website! (We originally wanted to name our product "ASNA Visual RPG .NET" but Microsoft insisted on us injecting the "for." Its argument was that its customers would be confused by a "Visual Basic .NET" and a "Visual RPG .NET.") We aren’t formally changing ASNA Visual RPG for .NET’s name (just as Microsoft appears to not be changing Visual Basic for .NET’s name), but we are calling "ASNA Visual RPG for .NET Framework" in several places on the Website. For future content, we’ll try to always append "Framework" to avoid any confusion.

Figure 3 below shows a .NET family timeline. It skips showing .NET Core 3.0. .NET Core 3.0 was a notable improvement over .NET Core 2.0 but a mere three months after releasing it Microsoft released .NET 3.1. .NET 3.1 is generally considered the version where .NET Core got real–where it was something well beyond an extended R&D exercise.

![A Microsoft .NET family timeline](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/microsoft-net-family-timeline.png)

Figure 3. A Microsoft .NET family timeline

Figure 3 reveals another subtle problem with the .NET naming. The introduction of .NET Core 1.0 represents a _major_ shift from the .NET Framework–it was a ground-up new product over .NET Framework. A casual observer could easily look at Figure 3 and assume that the introduction of .NET 5 (missing "Core" in its moniker) also represents a major shift from what it replaced. That isn’t the case. .NET 5 is to .NET Core 3.1 what .NET Core 3.1 is to .NET 3.0 Core–the incremental progression from one version to the next. When you see .NET 5, keep in mind that it is effectively .NET Core 4.0 with a streamlined name.

.NET has a [fixed, annual release schedule](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core). In the late fall of each year, a refreshed version of .NET is released. Even years are Long Term Service (LTS) versions (supported for 36 months) and odd years are Standard Term Support (STS) versions (supported for 18 months). There is an important, subtle implication here: another of .NET’s "features" is that Microsoft pushes you harder to keep things upgraded.

What does this mean for ASNA?
-----------------------------

ASNA started migrating IBM i RPG applications to .NET Framework in 2005. We have tons of experience with that and a full migration and analytic suite that automates more than 95% of the migration. Migrations have become a large part of our business model and our first move into the new .NET arena is with our Monarch and Synon Escape products. After many hard months of work, today both products target .NET 6 and 7.

As for ASNA Visual RPG, Wings, and Mobile RPG, all of which target the .NET Framework, we remain committed to these products. We will continue to update them to keep them current with the latest versions of Visual Studio. Given Microsoft’s strong commitment to persisting the .NET Framework well into the future, these products have a long future ahead of them.