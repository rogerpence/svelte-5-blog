---
title: How to calculate date/time differences in Visual RPG for .NET
description: This article shows how to calculate date/time differences in Visual RPG for .NET.
tags:
  - visual-rpg
date_published: '2024-01-08T23:31:20.000Z'
date_updated: '2024-01-09T06:26:24.000Z'
date_created: '2024-01-09T06:26:24.000Z'
pinned: false
---

Back in the halcyon days of RPG II/III, calculating differences between two dates or times was enormously complex and took tons of code (does anyone else remember Paul Conte's multi-part "Ultimate Date Routines" series in NEWS/400 magazine?). Well, that was then and this is now.

.NET offers superb date calculation capabilities. Let's take a brief look at how to use them. Let's say you wanted to know how long it's been since the Beatles' US debut on Ed Sullivan's stage on February 9th, 1964 and the last time they played together live on that blustery rooftop in London (with the late, great Billy Preston on the organ) on January 30th, 1969.

Here is the nearly self-explanatory code to calculate date durations in ASNA Visual RPG:

```
    DclFld From Type(DateTime) 
    DclFld To Type(DateTime) 
    DclFld ts Type(TimeSpan) 
    
    From = *New DateTime(1964, 2, 9)
    To = *New DateTime(1969, 1, 30)
    
    ts = To.Subtract(From) 
    
    DclFld Difference Type(*Packed) Len(12,2) 
    
    Console.WriteLine('Duration between the Beatles'' first live US performance')
    Console.WriteLine('and their last live performance in London')
    Console.WriteLine('')
    
    Difference = ts.TotalDays / (365.25 / 12)         
    Console.WriteLine('Decimal months :' + Difference.ToString('#,###.00'))
    
    Console.WriteLine('Decimal days :' + ts.TotalDays.ToString('#,###.00'))
    Console.WriteLine('Decimal hours :' + ts.TotalHours.ToString('#,###.00')) 
    Console.WriteLine('Decimal minutes :' + ts.TotalMinutes.ToString('#,###.00'))
    Console.WriteLine('Decimal seconds :' + ts.TotalSeconds.
    ToString('#,###.00'))
```    

![Showing date/time differences in action](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/datediff-2.png)

  
Figure 1. Program output  

Crazy, huh? The magic is in the [System.TimeSpan structure](https://docs.microsoft.com/en-us/dotnet/api/system.timespan?view=netframework-4.7.1) , which represents a time interval. As you can see, TimeSpan is capable of rendering differences in several units.

The example above shows just the tip of the iceberg for what you can do with dates and times in AVR for .NET. Study the TimeSpan structure for more of its capabilities.