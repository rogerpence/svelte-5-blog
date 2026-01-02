---
title: Using Generic Dictionaries With AVR
description: This article shows how to use .NET Framework's generic collections with ASNA Visual RPG for .NET Framework.
tags:
  - visual-rpg
date_published: '2024-01-11T11:57:34.000Z'
date_updated: '2024-01-11T20:02:36.000Z'
date_created: '2024-01-11T20:02:36.000Z'
pinned: false
---
.NET has had generic data types since .NET 2.0. However, many AVR coders aren’t aware of these powerful data structures and how much time they can save. In this article we’ll take a look at using generic dictionaries in AVR for .NET. Old school RPG programmers will recognize [dictionaries](http://en.wikipedia.org/wiki/Dictionary_%28data_structure%29) as the distant cousin of green-screen RPG’s alternating tables–except much better!

Before we dig into generic data types, let’s review the [Hashtable](http://msdn.microsoft.com/en-us/library/aahzb21x%28v=vs.100%29) from the System.Collections namespace. Prior to .NET acquiring generic data structures, the Hashtable was the primary go-to data structure to use for implementing a dictionary. The Hashtable provides two “columns,” a key and a corresponding value. These values are not strongly typed–they are \*Object type values. Thus, you can use any data type as a key and any data type as a value. While at first this sounds handy, this loose typing causes some extra work and some potential problems at runtime. If you come to AVR for .NET from AVR Classic, the Hashtable is similar to AVR Classic’s collections.

Line 4, in Figure 1a below, shows some of the friction this loose typing causes. In this case we’re accumulating an integer value and associating it with the string value “1994.” While it seems like it should be as easy as assigning a zero to that key value, it’s not. In AVR, a literal zero is actually a System.Decimal type–not the integer type it appears to be. It’s necessary to use the cumbersome casting of the literal zero to get an integer zero associated with the “1994″ key. The general frustration of casting in .NET is usually familiar to most AVR coders.

The casting friction continues in Figure 1b’s line 6, where once again the current value associated with “1994″ must be cast to an integer before it can be incremented. Another problem with the loose typing of the System.Collections.Hashtable is that you can assign any type to the key or the value at anytime. It’s up to the programmer to ensure she’s assigning correct data types to the Hashtable. If a mistake is made, the compiler won’t catch it but you’ll get a nasty error at runtime.

```
DclFld ht Type( System.Collections.HashTable ) New()
DclFld i  Type( *Integer4 ) 

ht.Add( "1994", ( 0 *As *Integer4 ) ) 

ht[ "1994" ] = ( ht.Item[ "1994" ] *As *Integer4 ) + 12

i = ht[ "1994" ] *As *Integer4
```

Figure 1b below shows how a [System.Collections.Generic.Dictionary](http://msdn.microsoft.com/en-us/library/xfhwa508%28v=vs.80%29) eliminates the casting friction. When this Dictionary is declared, you must explicitly declare its key and value types. The declaration of generic types in AVR uses [the VB-like Of syntax](http://msdn.microsoft.com/en-us/library/w256ka79%28v=vs.80%29.aspx) (as opposed to the angle bracket style of C#). Read this declaration as saying, “Declare a dictionary with string key and a corresponding integer value.” Strings are usually used as key types, but you may have good reasons to use other types for keys as well. You can also use any type for the value “column,” in this case I used an integer.

```
DclFld d  Type( Dictionary( *Of String, *Integer4 ) )  New()
DclFld i  Type( *Integer4 ) 

d.Add( "1994", 0 ) 

d[ "1994" ] = d.Item[ "1994" ] + 12

i = d[ "1994" ]
```

### A bigger example

This console application example below in Figure 2 shows the System.Collections.Generic.Dictionary in a slightly broader context. In this case you can see how a key value can be conditionally added using the ContainsKey() method.

There are many generic collections in the [System.Collections.Generic](http://msdn.microsoft.com/en-us/library/0sbxh9x2%28v=vs.80%29) namespace. That namespace provides the [KeyValuePair](http://msdn.microsoft.com/en-us/library/8e2wb99w%28v=vs.80%29.aspx) class which can be used for traversal of most of the generic collections. You can see the KeyValuePair type in action in the For/Each loop in lines 33-35 of Figure 2 below.

```
Using System
Using System.Collections
Using System.Collections.Generic
Using System.Text

BegClass Program

    BegSr Main Shared(*Yes) Access(*Public) Attributes(System.STAThread())
        DclSrParm args Type(*String) Rank(1)

        DclFld Totals  Type( Dictionary( *Of String, *Integer4 ) )  New()
        DclFld kv      Type( KeyValuePair( *Of *String, *Integer4 ) )

            If ( NOT Totals.ContainsKey( "1994" ) )
            Totals.Add( "1994", 0 )
        EndIf

        Totals[ "1994" ] = Totals[ "1994" ] + 34
        Totals[ "1994" ] = Totals[ "1994" ] + 12
        Totals[ "1994" ] = Totals[ "1994" ] +  4

            If ( NOT Totals.ContainsKey( "2012" ) )
            Totals.Add( "2012", 0 )
        EndIf

        Totals[ "2012" ] = Totals[ "2012" ] +  34
        Totals[ "2012" ] = Totals[ "2012" ] +  12
        Totals[ "2012" ] = Totals[ "2012" ] + 104

        Console.WriteLine( "1994 = " + Totals[ "1994" ].ToString() )  
        Console.WriteLine( "2012 = " + Totals[ "2012" ].ToString() ) 

        ForEach kv Collection( Totals ) 
            Console.WriteLine( kv.Key + " = " + kv.Value.ToString() ) 
        EndFor 

        Console.WriteLine( "Press any key to continue..." )
        Console.ReadKey()
    EndSr

EndClass
```

Generic collections are a very powerful addition to your AVR kitbag. Explore them when you get time. They will save you some time and make your code safer and easier to read.
