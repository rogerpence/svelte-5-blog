---
title: Understanding AVR for .NET data types
description: This article explains how Visual RPG for .NET Framework data types work and how they relate to .NET Framework, C#, and VB data types.
tags:
  - visual-rpg
date_published: '2024-01-15T11:22:47.000Z'
date_updated: '2024-01-15T17:24:30.000Z'
date_created: '2024-01-15T17:24:30.000Z'
pinned: false
---

ASNA Visual RPG for .NET data types
-----------------------------------

.NET lays out very specific rules for what a language must implement to be able to generate verifiable .NET assemblies (binaries). One of the rules is that a .NET language must implement the full complement, and only the full complement, of .NET Framework data types. This consistency is important to ensure appropriate interoperability between .NET applications written with multiple .NET languages.

For example, imagine a class written in AVR needing to instance and use a class written in C#. Both languages must be able to correctly exchange data types. Without being able to do so, there would be no language-to-language interoperability in .NET.

The chart below shows corresponding data types for AVR, the .NET Framework, C#, and VB.NET.

## Reference types
<div class="table-container">

|AVR for .NET|.NET Framework|C#|VB.NET|
|--- |--- |--- |--- |
|*String|System.String|string|String|
|*Char|System.String|N/A|N/A|

</div>

## Value/structure types 

<div class="table-container">

|AVR for .NET|.NET Framework|C#|VB.NET|
|--- |--- |--- |--- |
|*Date|System.DateTime|datetime|DateTime|
|*Time|System.DateTime|datetime|DateTime|
|*TimeStamp|System.DateTime|datetime|DateTime|

</div>

## Value types

<div class="table-container">

|AVR for .NET|.NET Framework|C#|VB.NET|
|--- |--- |--- |--- |
|*Boolean|System.Boolean|bool|Boolean|
|*Indicator|System.Char|N/A|N/A|
|*Binary|System.Decimal|N/A|N/A|
|*Decimal|System.Decimal|decimal|Decimal|
|*Packed|System.Decimal|decimal|Decimal|
|*Zoned|System.Decimal|decimal|Decimal|
|*Float4|System.Float32|System.Float32|System.Float32|
|*Float8|System.Float64|System.Float64|System.Float64|
|*Byte|System.Byte|byte|Byte|
|*Integer2|System.Int16|short|Short|
|*Integer4|System.Int32|int|Int|
|*Integer8|System.Int64|long|Lon|
|*OneChar|System.Char|char|Char|

</div>

> Note that AVR specifies its integer types with the number of bytes and .NET does so with the number of bits. Therefore AVR’s `*Integer4` type corresponds to the .NET Framework’s `System.Int32` type.

## Declaring variables

You can use either the AVR data type or the .NET Framework’s data type when declaring a variable in AVR. For example:

```
DclFld s1 Type(*String) 
```

or

```
DclFld s1 Type(System.String) 
```   

do exactly the same thing.

## A note about \*Char

Green-screen RPG as well as ASNA Visual RPG Classic (the COM version of AVR) both implement a fixed-length string called a \*Char. AVR for .NET implements that type as well as shown below:

```
DclFld CustomerName Type(*Char) Len(40)

CustomerName = 'Neil Young'
```    

At a glance, you might think that CustomerName’s value is ‘Neil Young’, but no, its value is that plus 30 trailing blanks. Any time a variable is a \*Char in AVR for .NET, AVR will right-pad with blanks as necessary to ensure it is the correct length. Note from the chart above that AVR for .NET’s \*Char type resolves to a .NET Framework System.String. This value would be passed to C# or VB as a System.String _with its trailing blanks_.

### What is a \*OneChar?

AVR for .NET’s \*OneChar is a potentially confusing and data type. Don’t confuse it with the far more frequently used \*Char data type. Confusingly, a \*OneChar is not a string or a character, and, adding to the confusion, it is implemented in the .NET Framework as a System.Char (further contributing to confusing it with a \*Char). The value of System.Char is a 16-numeric value. For example, these two declarations seem to both be containing a value of `c`.

```
    DclFld cChar Type(*OneChar) Inz('c') 
    DclFld cString Type(*String) Inz('c')
```    

They aren’t: The `cChar’s` value is u0063 and `cString’s` value is ‘c’. In many cases, a single \*OneChar value does represent a single Unicode character; but (says the MS docs).

> A character that is encoded as a base character, surrogate pair, and/or combining character sequence is represented by multiple Char objects. For this reason, a Char structure in a String object is not necessarily equivalent to a single Unicode character.

What’s it all mean? Not much. For nearly everything you do, you can ignore the \*OneChar data type and live happily ever after. That said, it’s worth knowing that when a .NET API references a `char` that doesn’t mean an RPG’s programmer’s version of a \*Char, but it means a single, 16-bit Unicode value which is a System.Char or in AVR, a \*OneChar. You may encounter this issue with some of the .NET Framework’s System.String methods that use `char` arguments or you might see the data type used with third-party custom controls. If .NET-based

> Remember this: When a .NET API references a `char` data type that doesn’t mean an RPG’s programmers version of a \*Char, but it means a single, 16-bit Unicode value. Read more about [the .NET Framework’s System.Char.](https://docs.microsoft.com/en-us/dotnet/api/system.char?view=netframework-4.5)

### \*Form data type

AVR for .NET also implements a \*Form data type than resolves to a System.Windows.Forms.Form data type. Rarely in your AVR for .NET code will you know or care about \*Form. However, coders coming to AVR for .NET from AVR Classic may appreciate understating the relationship between what they used to know as a \*Form object and .NET’s System.Windows.Forms.Form.

