---
title: Windows native PDF drivers ease Web printing pain
description: This article shows how to use Windows' native PDF print driver as an alternative to commercial PDF drivers with ASP.NET Web apps.
tags:
  - ibm-i
date_published: '2017-11-15T00:00:00.000Z'
date_updated: '2017-11-15T00:00:00.000Z'
date_created: '2017-11-15T00:00:00.000Z'
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


[Download](https://github.com/ASNA/PrintFromWebWithMSPDFDriver/archive/master.zip)

[View Source](https://github.com/ASNA/PrintFromWebWithMSPDFDriver)

Printing to PDF with AVR Web apps has always been a royal hassle. Doing so required expensive, and challenging to configure, third-party print drivers; low-end print drivers don't work either because they are single-threaded or require registry access to assign a PDF file name at runtime. In the early days of Windows, registry access for such ad hoc tasks was easy but in these security-conscious times it's not an acceptable best practice (if, given your security policies, it can even be done at all).

Back in AVR's early days this issue was usually solved with the [Active PDF Server](https://apryse.com/brands/activepdf). As Active PDF licensing because less flexible (ie, more expensive!), some customers turned to the more competively-priced [Amyuni PDF converter](https://www.amyuni.com/en/desktop-editions/amyuni-pdf-converter/learn-more).

Several years ago Microsoft has finally come to the rescue by adding native PDF print drives to both Windows 10 and Windows Server 2016. The driver is also present in Windows 11 and the latest Windows Server products. This intrinsic Windows print driver eliminates the need for third-party drivers such as those available from ActivePDF and Amyuni commercial drivers.

<Callout
    icon="fa-sharp fa-solid fa-circle-exclamation"
    font_size="1.2rem"
    font_style="italic"
>
    See this article <a href="https://www.asna.com/{locale}/kb/print-to-pdf-windows">for using the Microsoft PDF driver</a> with a Windows application. This article also discusses how to enable the Microsoft PDF driver.
</Callout>


### On with the code

The class below in Figure 1a provides an example class to print a report to either a PDF file or a printer. If you compare this code to [other code we've provided to print with PDF](/en/kb/print-to-pdf?pdf), you'll appreciate how little friction is encountered printing to PDF with the Microsoft PDF driver.

Depending on how the `CustomerReport` class is instanced, printer output is directed to either a printer or a PDF file. Printing to a printer is usually not a good idea in a Web app. The printing would occur on a printer on the network, which is probably not where the user is--that's the appeal of printing to PDF. It allows the user to print the PDF local or save it for later use. The class allows printing to a printer primarily to show how a single class can easily do double, but related, duty.

See the embedded comments for details on this class. The code is pretty simple but if the regular expressions in the `CheckFileAndPathSeparators` subroutine causes your eyebrows to furrow, take at look [this article on regular expressions](/en/kb/regex-part1?regex).

Figure 1a. An example class to print simple report with AVR to PDF for a Web app.

```
Using System
Using System.Text.RegularExpressions
Using System.IO 

/*
    | This class shows how to print to Microsoft's native PDF
    | print driver (which produces a PDF file) or to a real printer.
    |
    | When printing to the MS native PDF driver, the printer name
    | must be:
    |      "Microsoft Print to PDF"
    |
    | Use MS Word to save a sample document with this driver to ensure
    | it is available. It should be present for Windows 10 or Windows 
    | Server 2016. It is not present, not is it available, for previous
    | Windows or Windows Server versions.
    */

BegClass CustomerReport Access(*Public)

    DclDB Name(pgmDB) DBName("*Public/DG NET Local")

    DclDiskFile Cust +
        Type(*Input) +
        Org(*Indexed) +
        Prefix(Cust_) +
        File("Examples/CMastNewL2") +
        DB(pgmDB) +
        ImpOpen(*No) 

    DclPrintFile MyPrint +
        DB (pgmDB) + 
        File ("Examples/CustList") + 
        ImpOpen (*No) 
    
    DclProp DocumentName Type (*String) 
    DclProp IsPdf Type (*Boolean) 
    DclProp OutputDirectory Type (*String) 
    DclProp OutputFileFullName Type(*String) Access(*Public) 
    DclProp PrinterName Type (*String) 
    DclProp VirtualPathToPdf Type(*String) Access(*Public) 

    BegSr OpenData Access (*Private) 
        Connect PgmDB
        Open Cust

        MyPrint.Printer = *This.PrinterName
        If (IsPdf) 
            MyPrint.PrintToFileName = *This.OutputFileFullName
        EndIf             
        Open MyPrint
    EndSr

    BegSr CloseData Access (*Private) 
        Close Cust
        Close MyPrint
        Disconnect PgmDB
    EndSr

    BegSr Print Access(*Public) 
        OpenData()
        WriteReportFormats()
        CloseData()
        // If printing to PDF, pause just a bit
        // to ensure the PDF file is closed before
        // returning.
        If (*This.IsPdf) 
            Sleep(5000)
        EndIf 
    EndSr

    BegSr WriteReportformats Access (*Private) 
        DclFld StartingfooterSize Type (*Integer4) 
        DclFld NeedHeader Type (*Boolean) 

        // There are 254 print units in an inch. 
        DclConst ONE_INCH Value(254)

        StartingfooterSize = MyPrint.FooterSize
        NeedHeader = *True

        DclFld Counter Type(*Integer4) 

        Read Cust
        DoWhile (NOT Cust.IsEof)
            Counter += 1
            CustomerName = Cust_CMName

            If (NeedHeader) 
                Write Heading
                NeedHeader = *False
            EndIf

            Write Detail
            
            // This results in a 1.25 inch footer. 
            If (MyPrint.FooterSize <= ONE_INCH * 1.25)
                Write Footer
                NeedHeader = *True
                StartingFooterSize = MyPrint.FooterSize
            Endif 

            // An arbitrary value to limit pages printed
            // for testing.
            If Counter = 75 
                Leave 
            EndIf

            Read Cust
        EndDo

        If (StartingfooterSize <> MyPrint.FooterSize) 
            Write Footer
        EndIf
    EndSr

    BegConstructor Access(*Public) 
        //
        // Constructor for printing to printer.
        //
        DclSrParm PrinterName Type(*String) 

        *This.PrinterName =	PrinterName
        *This.IsPdf = *False
    EndConstructor

    BegConstructor Access(*Public) 
        //
        // Constructor for printing to PDF.
        //
        DclSrParm WebRoot Type(*String) 
        DclSrParm OutputDirectory Type(*String) 
        DclSrParm DocumentName Type(*String)
        DclSrParm PrinterName Type(*String)
        
        DclConst ERROR_MESSAGE Value('There isn''t a [{0}] directory in the app root.') 

        *This.PrinterName = PrinterName
        
        CheckFileAndPathSeparators(OutputDirectory, DocumentName)

        // Throw exception if output directory provided doesn't exist.             
        If NOT Directory.Exists(WebRoot + *This.OutputDirectory )
            Throw *New System.ArgumentException(String.Format(ERROR_MESSAGE, +
                                                *This.OutputDirectory))
        EndIf

        // Create PDF file name. 
        *This.OutputFileFullName = String.Format('{0}{1}\{2}', +              
                                        WebRoot, +
                                        *This.OutputDirectory, +
                                        *This.DocumentName)
        
        // Create relative output file name for response.redirect.
        *This.VirtualPathToPdf = String.Format('/{0}/{1}', + 
                                        *This.OutputDirectory, +
                                        *This.DocumentName)
        *This.IsPdf = *True
    EndConstructor

    BegSr CheckFileAndPathSeparators
        DclSrParm OutputDirectory Type(*String) 
        DclSrParm DocumentName Type(*String) 

        DclConst BACK_SLASH Value('\') 
        DclConst FORWARD_SLASH Value('/')
        DclConst LEADING_BACK_SLASH Value('^\\')
        DclConst TRAILING_BACK_SLASH Value('\\$')

        // Don't assume the slashes or backslashes provided 
        // are correct! 
        // Remove leading backslash if present.
        *This.OutputDirectory = RegEx.Replace(OutputDirectory, + 
                                    LEADING_BACK_SLASH, String.Empty)
        // Remove trailing backslash if present.
        *This.OutputDirectory = RegEx.Replace(OutputDirectory, + 
                                    TRAILING_BACK_SLASH, String.Empty) 
        // Swap / slashes for \ slashes if present.
        *This.OutputDirectory = RegEx.Replace(OutputDirectory, + 
                                    FORWARD_SLASH, BACK_SLASH)
        // Remove leading backslash if present.
        *This.DocumentName = RegEx.Replace(DocumentName, +
                                LEADING_BACK_SLASH, String.Empty)
        // Remove trailing backslash if present.
        *This.DocumentName = RegEx.Replace(DocumentName, +
                                TRAILING_BACK_SLASH, String.Empty)
    EndSr
    
EndClass
```    

Figure 1a. An example class to print a report with AVR

Its code-behind is shown below in Figure 1b.

```
BegClass PrintFromWeb Partial(*Yes) Access(*Public) Extends(System.Web.UI.Page)
    //
    // Print to PDF.
    //
    BegSr Button1_Click Access(*Private) Event(*This.Button1.Click)
        DclSrParm sender Type(*Object)
        DclSrParm e Type(System.EventArgs)

        DclFld report Type(CustomerReport) 

        DclFld WebRoot Type(*String) 
        DclFld PDFFolder Type(*String) 
        DclFld PDFFileName Type(*String) 
        DclFld PrinterName Type(*String) 

        /*
            | When printing to the MS native PDF driver, the printer name
            | must be:
            |      "Microsoft Print to PDF"
            | Use MS Word to save a sample document with this driver to ensure
            | it is available. It should be present for Windows 10 or Windows 
            | Server 2016. It is not present, not is it available, for previous
            | Windows or Windows Server versions.
            */
        DclConst MS_PDF_DRIVER Value('Microsoft Print to PDF')

        WebRoot = Server.MapPath('\')
        // The PDFFolder is relative to the root.
        PDFFolder = 'pdf/files'
        PDFFileName = textboxPDFFileName.Text.Trim()
        PrinterName =  MS_PDF_DRIVER
        report = *New CustomerReport(WebRoot, PDFFolder, PDFFileName, PrinterName) 
        report.Print()                         

        Response.Redirect(report.VirtualPathToPDF)		
    EndSr	

    //
    // Print to printer.
    //
    BegSr Button2_Click Access(*Private) Event(*This.Button2.Click)
        DclSrParm sender Type(*Object)
        DclSrParm e Type(System.EventArgs)

        DclFld report Type(CustomerReport) 
        DclFld PrinterName Type(*String) 

        PrinterName = textboxPrinterName.Text.Trim() 
        report = *New CustomerReport(PrinterName)
        
        report.Print()                                		
    EndSr
EndClass
```    

Figure 1b. AVR code-behind using Figure 1a's class.
