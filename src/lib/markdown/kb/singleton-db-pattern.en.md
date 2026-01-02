---
title: How to limit IBM i jobs for ASP.NET apps with the singleton DB pattern
description: This article provides a potential way to identify orphan IBM i jobs as a result of Database connection leaks in ASP.NET Web applications.
tags:
  - asp-net
  - visual-rpg
date_published: '2024-01-09T13:28:43.000Z'
date_updated: '2024-01-09T20:25:19.000Z'
date_created: '2024-01-09T20:25:19.000Z'
pinned: false
---

A very important consideration for AVR for .NET ASP.NET websites is managing IBM i jobs. This article discusses how to ensure that an AVR for .NET website doesn’t create more IBM i jobs than necessary. This is very important. Without fully understanding the relationship between a DclDB object and its corresponding IBM i job, it’s easy to write a web app that creates _many_ unnecessary IBM i jobs.

> This article shows how to avoid unnecessary IBM i jobs by using the `singleton DB pattern.` Using that pattern, you establish a single IBM i job in the top-level parent page and then make that connection available to any class instances the parent page uses.

During any one user’s use of your AVR web app, there should only be one IBM i job in play for that user. You can easily test this during development. Start your web app in Visual Studio and use the IBM i’s `WRKUSRJOB` to see the IBM i jobs for the user specified in the DataGate database name. If you ever see more than one job while you are the single user of the web app, you’ve got an IBM i job leak that should be plugged!

This article assumes familiarity with DataGate connection pooling and the concept of orphan IBM i jobs. [See this article for more detail on those topics](/en/kb/datagate-connection-pooling) . [This article](/en/kb/use-sql-to-find-asp-net-orphan-jobs) also provides related help finding the cause of orphaned, or unnecessary, IBM i jobs.

Figure 1a below shows a simple code-behind for an ASPX page. This code-behind declares a database object named `DGDB1` and correctly connects and disconnects that database object before the page goes out of scope. The code-behind has one file named `File1` and it also instances a secondary class named `MyClass` (instanced as `myc` ). You don’t see the code-behind doing anything but opening and closing `File1` ; in the real world, there were be other chunks of code that do something with that file. This code-behind’s `Page_Load` is also a bit unrealistic. These abstractions are used to keep the code short.

> `Close *ALL` closes all files opened in the class where the `Close *All` is used; it doesn’t close files opened in other classes. Every class must issue its own `Close *All` .

```
BegClass Index Partial(*Yes) Access(*Public) +
                Extends(System.Web.UI.Page)

    DclDB DGDB1 DBName("*Public/Cypress")
    DclDiskFile  File1 DB(DGBD1)...

    BegSr Page_Load Access(*Private) Event(*This.Load)
        DclSrParm sender Type(*Object)
        DclSrParm e Type(System.EventArgs)

        DclFld myc Type(MyClass) New()

        Connect DGDB1
        Open File1 

        myc.DoWork()
    EndSr

    BegSr Page_Unload Access(*Private) Event(*This.Unload)
        DclSrParm sender Type(*Object)
        DclSrParm e Type(System.EventArgs)

        Close *All
        Disconnect DGDB1
    EndSr    
EndClass
```

Figure 1a. A code-behind fragment instancing and using a method in a secondary class.

The `MyClass` that Figure 1a uses is shown below in Figure 1b.

```
BegClass MyClass Access(*Public)

    DclDB DGDB2 DBName("*Public/Cypress")
    DclDiskFile File2 DB(DGDB2)...

    BegSr DoWork Access(*Public)
        Connect DGDB2
        Open File2

        // Do some work here... 

        Close *All
        Disconnect DGDB2
    EndSr

EndClass
```

Figure 1b. The secondary class used by Figure 1a.

The class in Figure 1b declares its own database object named DGDB2 and it connects DGDB2, open files, does work, closes files, and then disconnects DGDB2. While this follows ASNA best practices to avoid orphan IBM i jobs, it results in an unnecessary job. Why?

The code-behind has declared and connected one database connection, which results in an IBM i job, and the code in `MyClass` (Figure 1b) is doing the same thing. Each time you connect to a database object (a  `DclDB` object) an IBM i job is created (or pulled from a pooled job). Figure 1c below illustrates this.

![Diagram of one user and two jobs](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/singleton-db-pattern-01.png)

Figure 1c. An IBM i job diagram for the code in Figures 1a and 1b.

Checking `WRKUSRJOB` while the `DoWork` routine in the `MyClass` code is running would confirm two IBM i jobs running.

![Confirm jobs with WRKUSRJOB](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/singlepattern-twojobs.png)

Figure 1d. Using WRKUSRJOB to confirm that two jobs are associated with Figure 1a and 1b’s code.

It could be argued that this second job isn’t that big of a deal. With DataGate’s effective connection pooling, and with a small number of classes, that’s probably correct. While the scenario shown here does create an extra job, that job gets pooled–which makes it quickly available the next time the web app needs a job. However, for large AVR websites, you often have _many_ secondary classes with many jobs. It only takes a little effort to channel all secondary class database activity through the same job as the code-behind is using.

#### Avoid unnecessary jobs with the Singleton DB Pattern

Use the _Singleton DB Pattern_ to limit any one code-behind and _all_ of its secondary classes to using one IBM i job. Don’t let this somewhat highbrow name be offputting. Naming the solution to this multiple-job challenge simply provides a name for the solution–and provides a vocabulary we can use while discussing the issue ( [like all software patterns do](https://en.wikipedia.org/wiki/Software_design_pattern) ). Implementing the Singleton DB Pattern is less off-putting than its tuxedo-wearing name.

The enabler for the Singleton DB Pattern is .NET’s ability to pass an object by reference–in this case the database object. That is, the code-behind will pass, by reference, its database object to any secondary classes. These classes then will use that parent’s database connection (and its underlying IBM i job). Let’s take a closer look.

> AVR for .NET does default to passing parameters by value. However, in .NET (as with Java, JavaScript, and many other languages), reference type values (for example, those variables that reference a class instance) are passed by reference. This may seem a little confusing if you’re new to .NET. The value of a reference types is effectively a pointer in memory to referenced object. So when a reference type gets passed by value you are essentially passing the memory address of its referenced object. In this article’s case, the memory address of a database object is being passed around. [Read more about value types and reference types here.](https://docs.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/data-types/value-types-and-reference-types)

The revised code-behind that implements the Singleton DB Pattern is shown below in Figure 2a.

```
BegClass Index Partial(*Yes) Access(*Public) +
                Extends(System.Web.UI.Page)

    DclDB DGDB1 DBName("*Public/Cypress")
    DclDiskFile  File1 DB(DGBD1)...

    BegSr Page_Load Access(*Private) Event(*This.Load)
        DclSrParm sender Type(*Object)
        DclSrParm e Type(System.EventArgs)

        DclFld myc Type(MyClass) New(DGDB1)

        Connect DGDB1
        Open File1 

        myc.DoWork()
    EndSr

    BegSr Page_Unload Access(*Private) Event(*This.Unload)
        DclSrParm sender Type(*Object)
        DclSrParm e Type(System.EventArgs)

        Close *All
        Disconnect DGDB1
    EndSr

EndClass
```

Figure 2a. A code-behind fragment instancing and using a method in a secondary class.

This code in Figure 2a is nearly identical to the previous code-behind with one important change: It passes its `DGDB1` database connection to `MyClass's` constructor, `MyClass` , with this line of code.

```
DclFld myc Type(MyClass) New(DGDB1)
```

The revised code for MyClass is shown below in Figure 2b. There are a few more changes in this code. While they are minor changes, they cause a dramatic improvement in job management.

```
BegClass MyClass Access(*Public)

    DclDB DGDB2 DBName("*Public/Cypress")
    DclDiskFile File2 DB(DGDB2)...

    BegConstructor Access(*Public)
        DclSrParm DBDG1 Type(ASNA.VisualRPG.Runtime.Database)

        DGDB2 = DGDB1

        Connect DGDB2 
    EndConstructor 

    BegSr DoWork Access(*Public)
        Open File2

        // Do some work here... 

        Close *All
    EndSr

EndClass
```

Figure 2b. The secondary class used by Figure 1a.

In the code above in Figure 2b, you’ll notice that `MyClass's` constructor is now explicitly defined. It receives one parameter: an AVR database object. The real magic here is the next line:

```
DGDB2 = DGDB1
```

The constructor gets called before anything else occurs in `MyClass` ; this ensures that the very first thing that happens in `MyClass` is that its database object ( `DGDB2` ) is now referencing the database object passed in the constructor ( `DGDB1` ). This is effectively a runtime swap of the database object in `MyClass` . After this assignment, the `DGDB1` and `DBDG2` variables are referencing the exact same object in memory at runtime. (Note that at compile time, `DBDG2` itself is implicitly connected in `MyClass` to resolve any declared files.)

> Because the value of reference types is a memory address, `DGDB2 = DGDB1` is making both variables point to the class instance referenced by `DGDB1` .

You’ll also notice this line immediately after the database assignment:

```
Connect DGDB2
```

This ensures that if the code-behind didn’t connect `DGDB1` that it gets connected for `MyClass's` use. To further illustrate that `DGDB1` and `DGDB2` are now referencing the same database object in memory, this line could also be:

```
Connect DGDB1
```

Because at this point both variables are referencing the exact same object. Let that soak in. It is a critical point. It’s very important to do the connect _after_ the database assignment ( `DBDG2 = DBDG1` ). Otherwise, you’ll cause an orphan IBM i job.

> AVR for .NET doesn’t raise an error if `Connect` is issued against an already-connected database object. You can safely issue the `Connect` operation without regard for whether the database object is already connected.

You’ll also notice that there isn’t a

```
Disconnect DGDB2 
```

in `MyClass` . Remember that `MyClass` is effectively borrowing the code-behind’s database connection. The Singleton DB Pattern grants the secondary class permission to use that database connection, but secondary classes _do not_ have permission to disconnect database connections. That’s the parent’s job (in the case, the code behind in Figure 2a).

> The Singleton DB Pattern imposes a strict assumption that when object A passes a database connection to object B that object B will not make _any_ changes to the state of the database connection. It’s like loaning your car to a friend. She can use it, but under no circumstances can she change it! Don’t bring it back with scratched paint and Taco Cabana trash in it!

Secondary classes should always have a

```
Close *ALL
```

to close all files opened in the secondary class before the secondary class goes out of scope. There is a convention in .NET that says if a class has a `Close` method, that method should be called before that class goes out of scope. For this reason, you’ll often see a method like this in classes that implement the Singleton DB Pattern if the code doesn’t inherently close the files (as Figure 2b does).

```
BegSr Close Access(*Public) 
    Close *All 
EndSr    
```
> If a class (any class, not just those obeying the Singleton DB Pattern) has a `Close` method it is the programmer’s responsibility to call that method before the class goes out of scope.

Figure 2c below shows the code-behind and the secondary `MyClass` in action and how they both share the same IBM i job.

![Diagram of shared job](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/singleton-db-pattern-02.png)

Figure 2c. An IBM i job diagram for the code in Figures 2a and 2b.

If you were to use `WRKUSRJOB` while `MyClass` is doing some work, you would now see only one job, as shown below in Figure 2d.

![Using WRKUSRJOB to confirm only one job](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/singlepattern-onejob.png)

Figure 2d. Using `WRKUSRJOB` to confirm that only one job is associated with Figure 2a and 2b’s code.

#### Notes on the Singleton DB Pattern

*   The parent class should provide a DB object even if it doesn’t have any disk files or make any program calls. This DB object is for use assigning the top-level DB to its secondary classes.
    
*   Secondary classes should always have a constructor that accepts a database object as a parameter. This database object should always be assigned to the secondary class’s intrinsic database object.
    
*   Secondary classes should always connect their database objects after they’ve been assigned in the constructor. This ensures the assigned database is connected.
    
*   Secondary classes should _never_ disconnect a DB connection or change any other attribute of its state. That’s a job for the parent (or owner) of the database object. A secondary class is simply borrowing the connection. The parent class owning the DB object, again usually the page, needs to issue the disconnect. 
    
*   If a secondary class has a Close method, the parent class should always call that method before the secondary class goes out of scope.
    
*   If a secondary class itself needs to declare another secondary class, it simply repeats the pattern, passing a reference to its DB object to the other secondary class. You can pass the database object around as deep as necessary–just remember that none of those "borrowers" should ever disconnect the database object.
    
*   The Singleton DB Pattern works equally well with either Windows or browser-based ASP.NET applications.
    
*   While you could engineer a variation on the Singleton DB Pattern with a `Shared(*Yes)` database connection for Windows applications (although we discourage that), _under no circumstances_ should you attempt to use a `Shared(*Yes)` database object with ASP.NET web applications. Shared database connections in a web app result in one job for _all_ of the users of the web application. That is bad, bad, bad!
    

> As a general rule, it’s best to only use `Shared(*Yes)` in web apps for nothing but [pure functions](https://www.sitepoint.com/functional-programming-pure-functions/) or constants.

#### Summary

The Singleton DB Pattern is very effective in limiting IBM i jobs in complex AVR web apps. Use it as you’re building (or adding to) AVR web apps. Also be sure to check frequently during the development stage to ensure your app is always using only one IBM i job.