---
title: Using the Wings/Mobile RPG spool file viewer
description: ASNA Wings and Mobile RPG includes a very handy spool file viewer. It lets you view, delete, or download spool files as PDFs.
tags:
  - mobile-rpg
  - wings
date_published: '2024-01-11T11:57:34.000Z'
date_updated: '2024-01-11T21:08:16.000Z'
date_created: '2024-01-11T21:08:16.000Z'
pinned: false
---
ASNA WingsRPG and Mobile RPG includes a very handy spool file viewer. It lets you view, delete, or download spool files as PDFs.

This video provides an overview of the ASNA Wings/Mobile RPG Spool File Viewer. The article that follows the video explains how to install the Spool File Viewer.

![Pressing F4 invokes the Spool File Viewer](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/firefox_yklyV1YRlT.png)

Pressing F4 invokes the Spool File Viewer

![A list of spool files](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/firefox_CjPQJ29qPZ.png)

A list of spool files

![the contents of a single spool file](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/firefox_2rHazrpzVr.png)

Showing the contents of a single spool file.

## To install the Spool File Viewer library on your IBM i

**Step 1. Download the Spool File Viewer**

Download The Spool File Viewer from [our downloads page](/downloads/en). Gee version that corresponds to your version of Wings or Mobile RPG. 

**Step 2. Unzip the downloaded file to the folder of your choice.**

For this article, that was unzipped to the

<pre>
c:\users\roger\downloads\spool_file_viewer_1.0.42.1
</pre>

folder.

**Step 3. Open a DOS command box on your PC**

Open a DOS command box and change its current directory to the folder where you unzipped the downloaded file. This directory should have a directory named `AsnaSplf10` and three files:

*   Readme.txt
*   Copyright.txt
*   SPLF10SAVF

The `AsnaSplf10` directory gets added to any Wings/Mobile RPG project with which you want to use the Spool File Viewer. The `SPLF10SAVF` is a savefile that provides a small IBM i library that needs to be installed on your IBM i. More information on both of these follows.

**Step 4. Create a target savefile on the IBM i**

    CRTSAVF QGPL/ASNASPLF 
    

**Step 5. Upload the savefile**

From the DOS box you opened in Step 3, issue these commands

*   Type `ftp <server name> or <ip address>` and press enter.
*   Enter user name and password when prompted
*   Type `binary` and press enter
*   Type `put splf10savf qgpl/asnasplf` and press enter
*   Type `bye` and press enter

These steps populate the save file you created in step 4.

**Step 6. Restore the library the save file provided**

```
RSTLIB SAVLIB(SPLF10LIB) DEV(*SAV) SAVF(QGPL/ASNASPLF) RSTLIB(ASNASPLF10)
```

This puts the `ASNASPLF10` library on your IBM i. It has four objects:

*   A `LISTSPLF` \*PGM object and \*CMD object
*   A `VIEWSPLF` \*PGM object and \*CMD object

You’ll use the `LISTSPLF` CMD object to launch the spool file list view. Although you’re not likely to use it directly, the `VIEWSPLF` command object launches a single spool file viewer. These commands launch the respective program object.

It is strongly recommended that you always use the commands to launch the spool file lister and spool file viewer. Using these command interfaces protects your code against any changes that may occur in the two program objects.

> The ASNASPLF10 library must be in the library list.

The ASNA `LISTSPLF` command:

![The ASNA LISTSPLF command](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/tn5250_CTUtJaGIGe.png)

The ASNA `VIEWSPLF` command:

![The ASNA i VIEWSPLF command](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/tn5250_whYU1NBlUk.png)

These screen images are shown here to display each command parameter. However, remember that these commands cannot be run from a green-screen. They depend on ASNA Wings or Mobile RPG for their display output–they will not work from the command line.

## A very important step!

With the ASNASPLF10 library installed, it is very important that you change the LISTSPLF and VIEWSPLF commands to reference your DataGate library. To do so, use the CHGCMD as shown below: 

```
CHGCMD CMD(ASNASPLF10/LISTSPLF) CURLIB(your DataGate library) 
```
and 

```
CHGCMD CMD(ASNASPLF10/VIEWSPLF) CURLIB(your DataGate library)
```

where `your DataGate library` is the name of your DataGate library. If you’re not sure of what your DataGate library name is, [see this article for help.](/en/kb/get-datagate-library-name) Anytime you change your DataGate library, you’ll need to use CHGCMD as shown here for the LISTSPLF and VIEWSPLF commands to ensure they are referencing the correct DataGate library.

## To use the spool file viewer in your ASNA Wings or Mobile Project.

**Step 1.** Add the `AsnaSplf10` folder (provided in the Spool File Viewer download) and its contents to the root of your Wings or Mobile RPG project. This provides the browser-based display files necessary for listing and viewing spool files. 

**Step 2**. Modify your RPG program to launch the spool file lister. To launch the Spool File Viewer you need to use the `LISTSPLF` command in the ASNASPLF10 library. RPG can’t issue commands directly, but that’s easy to do through RPG’s Command Exec interface. To do this first delete two variables:

*   A character field named SPOOLF with the qualified LISTSPLF command
*   A 15,5 packed value named SPOOLFLEN to provide the length of SPOOLF

Shown with fixed-RPG D specs, this code is:

```
D SPOOLF          S             19A   INZ('ASNASPLF10/LISTSPLF')  
D SPOOLFLEN       S             15P 5                             

...
```    

Use this RPG code to issue the LISTSPLF command through RPG’s Command Exec interface:

```
C                   EVAL      SPOOLFLEN = %LEN(SPOOLF)    
C                   CALL      'QCMDEXC'                      
C                   PARM                    SPOOLF           
C                   PARM                    SPOOLFLEN        
```    

The code above is typically launched as a result of a function key being pressed. By default the spool viewer shows spool files for the current user. However, don’t forget that the ASNASPLF10 library must be in the library list.
