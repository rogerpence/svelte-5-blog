---
title: Working with numeric dates in AVR for .NET
description: This article shows how to use numeric values and date data types with ASNA Visual RPG
tags:
  - asp-net
  - visual-rpg
date_published: '2024-01-08T23:31:20.000Z'
date_updated: '2024-01-09T05:32:37.000Z'
date_created: '2024-01-09T05:32:37.000Z'
pinned: false
---

Working with dates is something many RPG programs do extensively. In the old days of AVR Classic, we used to have to use lots of data structures and other special-case code to format dates, convert dates. It was also quite challenging to do date arithmetic and perform other sophisticated date manipulations. AVR for .NET’s `Date`, `Time`, and `*TimeStamp` help resolve all of these issues. However, many shops still store dates (and times) as numeric values in their database. This seems to preclude using some of .NET’s really great date handling and manipulation. This article changes that and shows how to integrate your numeric date and time values with .NET’s great date and time handling.

## Quick look
Date and time values stored as numeric values in your database are challenging to format, convert, and perform date and time arithmetic functions against. A way to resolve this issue is to convert your date and time fields to true date and time data types in your datebase. That way .NET’s superb date/time formatting and functionality is always for those fields. Alas, converting your database may be quite painful and time-consuming. 

This article presents an alternative: when you read a date or time value from your database, convert it to a true date/time value in the AVR for .NET program. Having done this, all of .NET Framework’s date/time goodness is now available to you. If you change that value and need to write it back to your database, convert that date/time value back to numeric before performing the database write. This article explains how to do this. 

## Date formatting numeric date values

In may older applications, dates are stored as numeric values, usually in the format `yyyy-mm-dd` or `mm-dd-yyyy` (in the US). To quickly format a numeric date value, use the custom numeric formatting .NET offers with its `ToString(`) method, where ‘#’ is a digit placeholder (which emits a given digit) and ‘0’ is a zero placeholder (which zero-suppresses a given digit).

```
DclFld MyDate Type(*Zoned) Len(8,0)
DclFld FormattedDate Type(*String)

MyDate = 6021959

FormattedDate = MyDate('00/00/0000')
// Results in 06/02/1959
```

If you don’t want the leading zero in months and days use (where the # characters suppresses leading zeros) and would rather use dash separators:

```
FormattedDate = MyDate('#0-#0-0000')
// Results in '6-2-1959'
```

There isn’t anything really date-aware about this formatting, you simply providing a mask used to format the string output. If the numeric stored in month/day/year format custom numeric formatting would do exactly what you ask. For example, the code below:

```
DclFld MyDate Type(*Zoned) Len(8,0)
DclFld FormattedDate Type(*String)

MyDate = 6021959

FormattedDate = MyDate('0000/00/00')
// Results in 0602/19/59
```

outputs a numeric value with the given format string. Numeric formatting is otherwise not really date-aware. Specifiy your formatting characters ) carefully.

You can also use custom numeric formatting for other purposes. For example to format a social security number stored as numeric:

```
DclFld SSN Type(*Zoned) Len(7,0)
DclFld FormattedSSN Type(*String)

SSN = 987-12-3455

FormattedSSN = MyDate('000-00-0000')
// Results in '987-12-3455'
```

While this quick formatting trick does work for simple formatting, it falls down quickly for more complex tasks. For example, if you have dates stored as numeric values, you often want to do other date things with them such as date arithmetic or format in a value that isn’t natural to the way they are stored. For example, give the numeric value 06021959, you couldn’t easily format it as an ISO date value (yyyy-mm-dd) with custom numeric format. For better date formatting and functionality,you need to be able to quickly convert numeric values to date data types.

## Convert numeric values to date data types

Rather than use custom numeric formatting at all, especially with dates, consider converting the numeric values to a true date data type. This provides infinitely more date formatting options and also makes otherwise complex operations exceedingly simple–such as date arithmetic and date conversion. I am not suggesting that you change the way the numeric date is stored in your database (but that would be nice!), but rather in your program, as soon as a numeric date has been read, convert it to a true date data type (and then, if you need to write a new date value back to your database convert the date data type back to numeric–more on this in a moment).

First, though, a quick primer on AVR for .NET date (and time) data types. AVR for .NET has three date/time-related data types:

* \*Date
* \*Time
* \*TimeStamp

All three of these date/time values in AVR for .NET are instanced as .NET’s `System.DateTime` data type . In AVR, the *Date data type uses the date portion of the `System.DateTime` structure and the *Time data type uses the time portion of the `System.DataTime` structure. The `*TimeStamp` data type uses both. The following conversion technique leverages the `System.DateTime's ParseExact()` method. Once a numeric value is converted to a `System.DateTime` value, its other properties and methods are available for you to use.

The code below in Figure 1 is simple inline code to convert an eight-digit numeric value into a date data type:

```
DclFld NumericDate Type(*Zoned) Len(8,0)
DclFld NewDate Type(*Date) 
DclFld Provider Type(CultureInfo) 

provider = CultureInfo.InvariantCulture
NumericDate = 06021959
NewDate = DateTime.ParseExact(NumericDate.ToString('00000000'), 'MMddyyyy', Provider)
```
<small class="html-md-figure-caption">Figure 1. Convert an eight-digit numeric value to a date.</small>


The instance of the CultureInfo (which needs `Using System.Globalization` at the top of your code) ensures the conversion obeys culture-specific formatting rules.

An important thing to remember with this technique is that the numeric date must be in the format specified (in this case, that means the first two positions must be the month, the second two must be the day, and the next four must be the year). It’s OK for the leading zero to be absent, the `ToString('00000000')` ensures it’s present when needed.

>The upper-case M‘s in the ‘MMddyyyy’ aren’t as arbitrary as they first seem. .NET date formatting is quite rigorous and also applies to times as well as dates. Upper-case ‘MM’ means two-digit months while lower-case ‘mm’ means two-digit minutes. To help keep this straight think of months being larger than minutes, and the upper-case M being larger than the lower-case m. You’ll see .NET’s date formatting strings in a different and powerful context later in this article.

If the numeric date has a value that can’t be converted to a date with the format provided, `DateParse` raises a `System.FormatException` error. This includes zero values–which some shops use to indicate a date hasn’t yet been specified in their application (ie, if a product has not yet shipped it might have a zero numeric date). To help a little with these issues, the `ConvertNumericDateToDate` shown in Figure 2 below buttons things up a little.

```
BegFunc ConvertNumericDateToDate Type(*Date) Access(*Public)
     DclSrParm NumericDate Type(*Zoned) Len(8,0)
    DclSrParm DateFormat Type(*String) 

    DclFld NewDate Type(*Date) 
    DclFld provider Type(CultureInfo) 

    If NumericDate = 0 
        LeaveSr NewDate
    EndIf 

    provider = CultureInfo.InvariantCulture

    Try 
        NewDate = DateTime.ParseExact(NumericDate.ToString('00000000'), DateFormat, provider)
    Catch e Type(Exception) 
        // Eat the exception.         
    EndTry 

    LeaveSr NewDate            
EndFunc
```
<small class="html-md-figure-caption">Figure 2. ConvertNumericDateToDate function</small>

This function returns the default date value, `01-01-0001`, if a zero date value is passed to it or if a conversion exception occurs. This may not be the behavior your app needs when a conversion exception occurs; if that’s the case, change the `ConvertNumericDateToDate` as needed.

Remember, too, to change any logic you have assuming that a zero date numeric value indicates a no- date-available condition to look for the date value `01-01-0001`. It’s easy to check for this `System.DateTime` includes a `MinValue` property for exactly this purpose. For example, assume your converted numeric date is in a date data type field named `ShippedDate`:

```
If ShippedDate = DateTime.MinValue 
    // ShippedDate hasn't yet been set.
    // Do something meaningful.
EndIf
With ConvertNumericDateToDate() available, it’s easy to convert various numeric formats. For example,

DclFld NewDate Type(*Date)

// Convert numeric value in the format MMddyyyy  
NewDate = ConvertNumericDateToDate(06021959,'MMddyyy')

// Convert numeric value in the format yyyyMMdd
NewDate = ConvertNumericDateToDate(19590602,'yyyyMMdd')
```

## Formatting the date data type

The .NET Framework's ability to formatting a `System.DateTime` is quite comprehensive. Let’s start by first getting a date data type:

```
DclFld NewDate Type(*Date)

// Convert numeric value in the format MMddyyyy  
NewDate = ConvertNumericDateToDate(06021959,'MMddyyy')
```

With this date data type available (which remember under the covers is an instance of `System.DataTime`) you can use built-in shorthand formatting methods to produce formatted data strings:

```
NewDate.ToShortDateString() returns 6-2-1959
NewDate.ToLongDateString() returns Tuesday, June 2, 1959
```

or you can use custom date formatting strings to produce custom formatted strings. Some examples include:

```
NewDate.ToString('MM/dd/yyyy') returns '06/02/1959'
NewDate.ToString('M/d/yyyy') returns '6-2-1959'
NewDate.ToString('yyyy-MM-dd') returns '1959-06-02'
NewDate.ToString('yyyy-MMM-dd') returns '1959-Mar-02'
NewDate.ToString('dddd, MMMM, d, yyyy') returns 'Tuesday, June 2, 1959'
```

Make a special note of this formatting possibility:

```
NewDate.ToString('MMddyyyy') returns '06021959'
```

We’ll cover in a moment what it is especially good for. Can you guess?

As you can see, once you have a numeric value converted to a date data type, you can literally format it anyway you want to. Study the custom date formatting options available. There is lots you can do there–and there are similar formatting strings for times as well.

## Using System.DataTime methods

Beyond formatting possibilities, the `System.DataTime` also offers a plethora of methods and properties.

* DayOfWeek
* DayOfYear
* AddMinutes()
* AddMonths()
* DaysInMonth()
* IsLeapYear()
 
In short, you can do quite nearly anything you want to do to a date or time value when that value is available as a `System.DataTime` object. Frustratingly, though, getting the ISO 8601 week number of given date is disappointingly absent from .NET’s `System.DateTime`. This is perhaps the most significant shortcoming of `System.DateTime`. The ISO 8601 week number, and many other more esoteric features, are available in the free Noda Time open source library. If you have advanced date and time needs, check it out.

## Convert a date data type back to numeric

Having converted your numeric date (and time) fields into date data type fields to work with them, you’ll need a way to convert that underlying `System.DateTime` value back to numeric for database updates. This is very easy to do with the function shown below in Figure 3:

```
BegFunc ConvertDateToNumericDate Type(*Integer4) Access(*Public) 
    DclSrParm DateField Type(System.DateTime) 
    DclSrParm DateFormat Type(*String) 

    LeaveSr DateField.ToString(DateFormat) 
EndFunc
```
<small class="html-md-figure-caption">Figure 3. ConvertDateToNumericDate function</small>

You can use any valid `System.DateTime` formatting string as the DateFormat value. As you can see, there isn’t much to this function and you can also use the `ToString()` directly inline in your code. Either way, there is an interesting AVR for .NET idiom at play here. Consider the following code:

```
DclFld NumericDate Type(*Zoned) Len(8,0)
DclFld ConvertedDate Type(*Date)

NumericDate = 06021959

ConvertedDate = ConvertNumericDateToDate(NumericDate, 'MMddyyyy')

// Do whatever you need to ConvertedDate here. 

// Update NumericDate so that its value reflects the ConvertedDate value.

NumericDate = ConvertedDate.ToString('MMddyyyy')
// Now NumericDate can be written back to your database.
```

The last line is where something unusual to .NET occurs. .NET is usually very type-specific. Generally, if you try to assign one type to a different type, you get an error. Here, though, AVR for .NET successfully assigns a string (the result of the `ToString()` operation) directly to a numeric field (which could be any of Zoned, Packed, or *Integer4). In VB.NET and C#, assigning a string to a numeric won’t even compile; you’re told the compiler can’t implicitly convert type `string` to `int.`

Why doesn’t AVR for .NET throw an error with this assignment? Unlike AVR for .NET will, when it can, implicitly coerce a source data type into its target data type (effectively adopting the behavior of RPG’s MOVE operation code). AVR’s implicit type coercion really bugs some C# coders. They will often write this:

```
NumericDate = ConvertedDate.ToString('MMddyyyy')
```

as

```
NumericDate = Convert.ToInt32(ConvertedDate.ToString('MMddyyyy'))
```

That explicit conversion of a string to an numeric works just fine–it just isn’t necessary with AVR.

## Summary

It’s easy, and quite useful, to convert numeric date values into true date data types in your AVR for .NET applications. And, it’s easy to convert those date data types back to numeric values if you need to. Don’t blindly stop at using custom numeric formatting to display your numeric dates. Push yourself a little with the techniques in this article. They will help directly as you work with dates and the general .NET Framework concepts applied will help round out your general .NET knowledge.