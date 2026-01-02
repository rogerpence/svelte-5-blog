---
title: A better way to dispose objects
description: This article explains to use ASNA Visual RPG's BegUsing operation to implicitly dispose objects.
tags:
  - visual-rpg
date_published: '2025-11-22T00:00:00.000Z'
date_updated: '2025-11-22T00:00:00.000Z'
date_created: '2025-11-22T00:00:00.000Z'
pinned: false
---

An often-overlooked feature of ASNA Visual RPG (AVR) is its `BegUsing` operation. This operation allows for a more streamlined use of objects that provide a `Dispose` method that must be called before the object instance goes out of scope.

An object needs a `Dispose` method when it needs to release resources (generally COM or other external resources). While you may need to provide a `Dispose` method in objects you create, it's not likely. `Dispose` is necessary only when the object acquires and needs to release unmanaged resources. 

While custom objects needing `Dispose` are rare, many .NET Framework intrinsic objects provide a `Dispose` method. For example, .NET Frameworks's `StreamWriter` and its new `ZipArchive` object (that lets you programmatically zip and unzip files with .NET Framework), both provide a `Dispose` method that must be called before the object instance goes out of scope. Not calling `Dispose` on objects that need it can lead to out-of-memory  and other unpredictable errors.

## AVR's BegUsing operation

Before AVR got `BegUsing`, this is how you would have used the `StreamWriter` object to effectively dispose it:

```
DclFld writer Type(System.IO.StreamWriter)         

Try
    writer =  File.CreateText("c:\users\roger\newfile1.txt")
    writer.WriteLine('Neil')
    writer.WriteLine('Young')
Finally 
    If writer &lt;&gt; *Nothing
        writer.Dispose() 
    EndIf 
EndTry 
```

`BegUsing` streamlines the code needed to perform the Dispose. Note how `BegUsing` dispatches the need for manually calling `Dispose`.

```
Try
    BegUsing writer Type(StreamWriter) +
                    Value(File.CreateText('c:\users\roger\newfile2.txt')) 
        writer.WriteLine('Neil')
        writer.WriteLine('Young')          
    EndUsing
Catch ex Type(System.Exception)
    // do something with the exception here.
EndTry 
```

You won't need `BegUsing` often, but when you do it's quite handy. Also, its presence makes it easier to translate C# examples to AVR.

> `BegUsing` is intended only for objects that provide a `Dispose` method (and therefore implement the iDisposable interface). Don't try to use it with AVR objects like disk files or DataGate DB connections that need a `Close` or `Disconnect` method. Continue to close those objects with their `Close` or `Disconnect` methods as you have been.