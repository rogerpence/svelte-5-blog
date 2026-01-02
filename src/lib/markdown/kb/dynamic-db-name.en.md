---
title: Change an app's DB name at runtime without recompiling
description: This article provides a way to change your ASNA Web or Windows application’s runtime database name without recompiling or redeploying the application.
tags:
  - dot-net-framework
  - visual-rpg
date_published: '2024-01-09T20:59:40.000Z'
date_updated: '2024-01-10T03:38:27.000Z'
date_created: '2024-01-10T03:38:27.000Z'
pinned: false
---
I’ve seen some crazy code lately that enables the ability to change an application’s database name at runtime. Much of the code I’ve seen makes this way harder than it needs to be. This article provides a simple way to be able to dynamically change your Web or Windows application’s runtime database name without recompiling or redeploying the application.

Note that while this article is database name-specific, the same concept can be applied to any application value that you need to be able to change easily at runtime.

### ASP.NET example

Let’s say you have two database names available:

*   A database name for the ASNA Win/Server desktop database for a development named “\*Public/DG NET Local.”
*   A database name for DataGate for IBM i for production named “\*Local/Cypress.”

You’d like to develop with the local database but when pushed to production you’d like to use the IBM i database name–without needing to recompile the application.

#### Specifying database names in the `web.config` file

In your ASP.NET web app’s `web.config` file add the three `appSettings` key-value pairs shown below.

*   The `dev` key provides the local database’s database name.
*   The `prod` key provides the production database’s name.
*   The `activeDBName` provides the runtime database name. It is currently set to `dev`.

At runtime, first the `activeDBName` key-value is looked up, and then its value is used to read the database name of the specified environment. This database name overrides the AVR database object database name at runtime.

#### The ASP.NET code-behind

To hook up the code, add a reference to `System.Configuration` and add a `using` statement for it.

```
Using System.Configuration

BegClass views_TestDBConnection Partial(*Yes) Access(*Public) Extends(System.Web.UI.Page)

    // This is the compile-time database name.
    DclDB DGDB DBName("*Public/DG8_160x") 

    DclDiskFile Customer +
            Type(*Input) + 
            Org(*Indexed) + 
            Prefix(Customer_) + 
            File("examples/cmastnewl2") +
            DB(DGDB) +
            ImpOpen(*No)  

    BegSr Page_Load Access(*Private) Event(*This.Load)
        DclSrParm sender Type(*Object)
        DclSrParm e Type(System.EventArgs)

        DclFld ActiveDBKey Type(*String) 

        ActiveDBKey = ConfigurationManager.AppSettings['activeDBName']

        // Override runtime database name.
        DGDB.DBName = ConfigurationManager.AppSettings[activeDBKey]

        Connect DGDB 

        If (NOT Page.IsPostBack)
            //
            // Called the first time that the page is loaded.
            //
        Else
            //
            // Called subsequent times that the page is displayed.
            //
        EndIf
    EndSr

    BegSr Page_Unload Access(*Private) Event(*This.Unload)
        DclSrParm sender Type(*Object)
        DclSrParm e Type(System.EventArgs)

        Disconnect DGDB 
    EndSr

EndClass
```

In the page’s `Load` event-handling code, this code:

```
DclFld ActiveDBKey Type(*String) 

ActiveDBKey = ConfigurationManager.AppSettings['activeDBName']
DGDB.DBName = ConfigurationManager.AppSettings[activeDBKey]

Connect DGDB 
```

Looks up the active database name key and uses that value to read the corresponding database name from the `web.config` file. That name is then assigned to the AVR database object before it is connected.

## Windows example

The Windows version to add dynamic database names is very similar.

## Specifying database names in the `app.config` file

From the Solution Explorer, use Add New Item to add an “Application Configuration File”, as shown below. Change the default file name to `app.config` (`app1.config` will not work) and click the ‘Add’ button.

![ALT NEEDED](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/web-config-add-new-item.png)

Add the `appSettings` `dev`, `prod`, and `activeDBName` keys just as we did for the Web example.

## The Windows code-behind

To hook up the code, add a reference to `System.Configuration` and add a `using` statement for it.

```
Using System.Configuration

BegClass Form1 Extends(System.Windows.Forms.Form) Access(*Public) Partial(*Yes)

    /region Default Constructor

    BegConstructor Access(*Public)
        //
        // Required for Windows Form Designer support
        //
        InitializeComponent()

        //
        // TODO: Add any constructor code after InitializeComponent call
        //
    EndConstructor

    /endregion

    // This is the compile-time database name.
    DclDB DGDB DBName("*Public/DG8_160x") 

    DclDiskFile Customer +
            Type(*Input) + 
            Org(*Indexed) + 
            Prefix(Customer_) + 
            File("examples/cmastnewl2") +
            DB(DGDB) +
            ImpOpen(*No)  

    BegSr Form1_Load Access(*Private) Event(*this.Load)
        DclSrParm sender *Object
        DclSrParm e System.EventArgs

        DclFld ActiveDBKey Type(*String) 

        ActiveDBKey = ConfigurationManager.AppSettings['activeDBName']

        // Override runtime database name.
        DGDB.DBName = ConfigurationManager.AppSettings[ActiveDBKey]

        Connect DGDB 
    EndSr

    BegSr Form1_FormClosing Access(*Private) Event(*This.FormClosing)
        DclSrParm sender Type(*Object)
        DclSrParm e Type(System.Windows.Forms.FormClosingEventArgs)

        // Occurs when form is closing.    
        // Put form "housecleaning" code here (ie close files).

        Disconnect DGDB 
    EndSr

EndClass
```
In the form’s `Load` event-handling code, this code:

```
DclFld ActiveDBKey Type(*String) 

ActiveDBKey = ConfigurationManager.AppSettings['activeDBName']
DGDB.DBName = ConfigurationManager.AppSettings[activeDBKey]

Connect DGDB 
```

Looks up the active database name key and uses that value to read the corresponding database name from the `app.config` file. That name is then assigned to the AVR database object before it is connected.

## Windows caveat

When a Windows app is compiled that has an `app.config` file, that file is copied to the target `bin` folder as `<ProjectName>.exe.config.` Runtime changes to `appSettings` values need to be made to this file, not the `app.config` file.

For example, if your project name is `DynamicDB` and it is compiled as a debug release, after compiling the project there will be a `DynamicDB.exe.config` file in the project’s `bin\debug` folder. Be sure to deploy this file in the same folder where you put the EXE. Changes made to this file will apply without recompiling the app.

## Summary

You aren’t limited to two database names with this technique, you can specify as many database names as needed (for example, you specify `dev`, a `test`, a `production` and an `altproduction` databases. After the app is deployed you can change what database name the app uses by changing the value of the `activeDBName` key. No redeployment of the application is necessary. The change will be applied with a fresh request of the app.

While this article is database name-specific, the same concept can be applied to any application value that you want to be able to change easily at runtime.
