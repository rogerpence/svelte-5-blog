---
title: Reveal your PC's inner-most secrets using the ASNA Inspector
description: This article explains how to use the ASNA Inspector reveal tons of details about your PC. The resulting output of the ASNA Inspector  is often very helpful to tech support to resolve issues with ASNA products.
tags:
  - utility
date_updated: '2024-06-24T00:00:00.000Z'
date_published: '2024-06-24T00:00:00.000Z'
date_created: '2024-06-24T00:00:00.000Z'
pinned: false
---

<script>
    import Image from '$components/text-decorators/Image.svelte';
</script>

Most of ASNA's PC-based installed a very handy diagnostic tool called the ASNA Inspector. The ASNA Inspector is free-standing EXE that collects and reports a variety of information about your PC. This information is contained, and viewed, in a single HTML file that it produces when you run it. For ASNA tech support often uses this HTML file to help us diagnose tech support issues. 

The ASNA Inspector is located at: 

```
C:\\Program Files\\Common Files\\ASNA Shared\\ASNA.Inspector.exe
```

To run it, find that EXE with Windows' File Explorer and run it. You will first be presented with a dialog that looks like an install dialog. 

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/images/asna-com/asna-inspector.webp" alt="The ASNA Inspector startup dialog" width="500" alignment="center" caption="Figure 1."/>

After pressing "Begin" you're prompted for a target directory into which the HTML file is written. Then click "Next" to start the report collection process. In a minute or so the report and you can click a button to display the HTML in your browser. 

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/images/asna-com/asna-inspector-output.webp" alt="The ASNA Inspector HTML output" width="500" alignment="center" caption="Figure 2."/>

The information that the ASNA Inspector HTML file reports includes: 

* System
  * Shows drive details and provides an overview of the Windows version installed.
* Programs
  * Shows detailed about the installed programs (mostly the applications listed in Add and Remove programs). This list omits those programs installed through the Microsoft Store.
* DotNet
  * Shows detail about the .NET Framework versions installed
* Visual Studio
  * Show Visual Studio versions installed and their respective workloads installed.
* GAC
  * Shows the ASNA-related binaries installed into the [.NET Framework Global Assembly Cache (GAC)](https://learn.microsoft.com/en-us/dotnet/framework/app-domains/gac)
* Licensing
  * If ASNA.Inspector.exe was run as an admin, this shows detail about the ASNA product licenses installed
* File System
  * Shows the places on your local file system where ASNA-related files are located, which are typically: 
    * C:\Program Files\ASNA
    * C:\Program Files\Common Files
    * C:\Program Files (x86)\ASNA
    * C:\Program Files (x86)\Common Files
* Services
  * Shows the installed ASNA Services (or potentially related services such as MSSQLSERVER) 
    * ASNA Assist
    * ASNA Registrar
    * DataGate Server

When you report an issue to tech support, we may ask you to run the ASNA Inspector and send us its HTML output. 
