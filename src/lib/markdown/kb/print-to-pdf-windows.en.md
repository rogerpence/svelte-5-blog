---
title: Print to PDF with Visual RPG and Windows
description: This articles shows how to use the Microsoft Print to PDF driver with ASNA Visual RPG and a Windows application.
tags:
  - printing
  - visual-rpg
date_updated: '2025-02-04T23:44:26.000Z'
date_published: '2025-02-04T23:47:00.000Z'
date_created: '2025-02-04T23:44:26.000Z'
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

[View Source](https://github.com/ASNA/print-to-pdf-windows)

[Download](https://github.com/ASNA/print-to-pdf-windows/archive/refs/heads/main.zip)


<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/newsletter/enable-windows-pdf-driver.png"
alt="Enable the Microsoft PDF print driver as a Windows feature"
width="350px" alignment="float-right" hide_caption=false
/>

Until Windows 10 and Windows Server 2016 came along, you needed to use a third-party PDF driver to print to PDF with Web applications. There are free PDF drivers available, but these low-end drivers aren't multi-threaded and they don't work with Web applications.

Even for Windows apps, the low-end drivers are a hassle. If they allow you to specify the PDF file name, that task usually requires a registry hack&mdash;and that hack is iffy with Windows 11 increased levels of registration security.

Alas, for several years now Microsoft has packaged a PDF print driver with both Windows and Windows Servers. The driver is a Windows feature and needs to be installed with the "Windows features" dialog (available through Windows "Add or remove programs" dialog). Make sure it is enabled before continuing. This intrinsic Windows print driver eliminates the need for third-party drivers such as those available from ActivePDF and Amyuni commercial drivers.


<Callout
    icon="fa-sharp fa-solid fa-circle-exclamation"
    font_size="1.2rem"
    font_style="italic"
>
    See this article <a href="https://www.asna.com/{locale}/kb/windows-native-pdf-driver">for using the Microsoft PDF driver</a> with a Web application.
</Callout>


## Isolating print code

This example includes a class that prints an ASNA Print File to either a physical printer or the "Microsoft Print to PDF" print driver in a Windows application. 

There are special considerations for using the MS PDF driver with a 
Web application. [See this ariticle for using the MS PDF driver 
with an AVR web app.](https://www.asna.com/en/kb/windows-native-pdf-driver)

I like to isolate printer code in a class for each print file. In this example, the 
`CustomerReport` does that. You don't have to use a class to use the techniques 
shown in this example. You can copy code from the class and copy it inline 
into your code. That said, one of these days you'll be very grateful then if you 
take the time to separate this code initially! 
 
Use the `CustomerReport` constructor that requires two arguments to print to a physical 
printer or use the constructor that requires three arguements to print
to a PDF file. 
                                                                                          
To print to a physical printer:

```
DclFld cr Type(CustomerReport) 	
DclFld PrinterName Type(*String) 
DclFld UsePrintSetup Type(*Boolean) 

PrinterName = "HP LaserJet 1020 (redirected 2)"
UsePrintSetup = *True 

// If UsePrintSetup is *True then printer setup is shown.
cr = *NEW CustomerReport(PrinterName, UsePrintSetUp) 
cr.Print()

Try 
    cr.Print()
    MsgBox String.Format("File printed") 
Catch Type(Exception) Name(ex)
    MsgBox String.Format("ERROR :" + ex.Message) 
EndTry 
```   

To print to a PDF file with the MS native PDF print driver:

```
DclFld cr Type(CustomerReport) 	
DclFld PrinterName Type(*String) 

cr = *NEW CustomerReport(PrinterName) 

DclFld PrinterName Type(*String) 
DclFld PDFOutputFolder Type(*String) 
DclFld PDFFileName Type(*String) 

PrinterName = "Microsoft Print to PDF"
PDFOutputFolder = "C:\\Users\\thumb\\Documents\\projects\\avr\\pdf-files"

// Existing PDF files are overwritten! 
PDFFileName = "test.pdf"

DclFld cr Type(CustomerReport) 	
		
cr = *NEW CustomerReport(PrinterName, PDFOutputFolder, PDFFileName) 
Try 
    cr.Print()
    MsgBox String.Format("File {0} created in {1}", PDFFileName, +
        PDFOutputFolder) 
Catch Type(Exception) Name(ex)
    MsgBox String.Format("ERROR :" + ex.Message) 
EndTry 
```   

<a href="https://github.com/ASNA/print-to-pdf-windows/blob/main/CustomerReport.vr">Click here to see the code for the CustomerReport class.</a>

<p></p>

When printing to the MS native PDF driver, the printer name
must be:

```
Microsoft Print to PDF
```

If you have trouble with this code, use MS Word to save a sample document 
the MS PDF driver to ensure the driver is available. That will help confirm the driver is working.

You cannot show the printer setup in a Web app. The entire printer configuration must specified programmatically for Web apps. 