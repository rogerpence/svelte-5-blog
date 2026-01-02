---
title: Printing to PDF with ASNA Visual RPG for .NET and Amyuni
description: How to use the Amyuni PDF Converter to print to PDF in ASNA Visual RPG applications.
tags:
  - visual-rpg
date_published: '2015-12-14T00:00:00.000Z'
date_updated: '2015-12-14T00:00:00.000Z'
date_created: '2015-12-14T00:00:00.000Z'
pinned: false
---
<script>
import Image from "$components/text-decorators/Image.svelte";
import Callout from "$components/text-decorators/Callout.svelte"


import { page } from '$app/stores';

const locale = ($page.url.pathname.startsWith('/downloads')) ? 
     $page.pathname.url.slice(-2) : 
     $page.url.pathname.slice(1,3);
</script>


> This article was published in 2014. It may not now reflect the best way to use the Amyuni driver with AVR. 

<Callout
    icon="fa-sharp fa-solid fa-circle-exclamation"
    font_size="1.2rem"
    font_style="italic"
>
Microsoft now provides a native PDF print driver and you may no longer need the Amyuni driver. See this article <a href="https://www.asna.com/{locale}/kb/print-to-pdf-windows">for more information.</a>

</Callout>

Distributing reports as PDF files is a very common practice in the enterprise. ASNA’s DataGate print files are designed to print to one of your installed Windows printers. Printing to PDF with AVR is therefore a pretty simple task of using a PDF print driver and then printing to that virtual printer. These drivers redirect print file output to a PDF file.

For use with fat client Windows programs, you may get by with low-end, or even free, PDF print drivers. There are many of these available. However, in every case, these low-end drivers are single-threaded and not for use in the multi-threaded world of IIS. Alas, then, these drivers do not work with AVR ASP.NET Web apps. A hallmark of low-end PDF drivers is their inability to easily specify unique file names for multiple concurrent users. For most enterprise use, we recommend you try to avoid the very low-end (sometimes free) PDF drivers.

For years, our go-to recommendation has been the ActivePDF driver. We have a lot of customers using ActivePDF and while its while quality and reliability are good, tech support is spotty. ActivePDF’s single instance server license list price is $1050 and that is competitive. However, we’ve heard from a few customers that ActivePDF, in certain production environments, can cost a lot more than that.

We’ve also heard of users slogging through the arduous process (at least the last time I tried) of trying to make the Adobe PDF server product work and we occasionally hear from users who swear that one of the single-threaded drivers is working for them in Web apps. We’ve tried over the last several years to find an alternative to ActivePDF but it has been the kingpin PDF driver for us for a long time. It’s edge has been its multi-theading capabilities.

The other day, a longtime friend of ASNA’s, Forrest Forbus (that’s right, figured out how to make the Amyuni PDF Converter Application Server Edition (that I’ll mercifully call the Amyuni PDF driver for the rest of this article) work with his AVR for .NET ASP.NET Web application. Forrest very graciously offered to share his code with me. (Forrest’s generosity reminded me of my mother. She always thought it was a sin for anyone to keep a recipe a secret. Why keep all the good stuff to yourself!. My mother would certainly approve of Forrest’s natural inclination to share his code.) The code provided here is a refactored version of Forrest’s code that echoes his exact approach. Even I refactored Forrest’s code to be a little more general purpose, make no mistake, most of the good ideas and good code you see were lifted directly from Forrest’s work. Thank you, Forrest.

## The Amyuni PDF Converter Application Server Edition

The specific Amyuni used here is its [PDF Converter Application Server Edition](https://www.amyuni.com/en/server-products/pdf-converter-application-server-edition/learn-more) . Licensing varies, so check with Amyuni to be sure, but for a Web app on a single IP address the driver is $1038 (as of 14 Dec 2015). Normally a developer license is required for $529, but the folks at Amyuni will generously waive that fee for the first developer seat for ASNA customers. Annual maintenance runs about $240. The Amyuni tech support and sales teams were superb to work with getting this all figured out.

Print drivers are inherently COM-based, so the Amyuni PDF driver is also COM-based. However, .NET graciously consumes COM objects and that a you’re using a COM component is all but transparent. While Amyuni will have a .NET-based wrapper available for its PDF driver next year, Forrest’s work renders that mostly a moot point.

## Get the code

Our approach to printing to PDF with the Amyuni PDF printer driver is to provide a wrapper AVR for .NET class library. That project, with annotated code and a zip file download, is available by clicking the blue button immediately below. Don’t forget you’ll need to get at least a trial copy of the [Amyuni PDF Convert Application Server Edition](https://www.amyuni.com/en/server-products/pdf-converter-application-server-edition/learn-more), too.

[Get the AVR for .NET Amyuni PDF class library here](https://github.com/ASNA/ASNA.AmyuniPDF)

We also have an AVR for .NET ASP.NET PDF example that shows how to use the class library. That project, with annotated code and a zip file download, is available by clicking the blue button immediately below.

[Get the AVR for .NET ASP.NET PDF example app here](https://github.com/ASNA/AVR-ASP.NET-Amyuni)
