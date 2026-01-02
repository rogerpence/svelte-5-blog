---
title: 'AVR for .NET arrays: using DclAliasGroup'
description: This article explains how to use DclAliasGroup to map record format fields to an array with Visual RPG.
tags:
  - visual-rpg
date_published: '2024-01-09T11:57:42.000Z'
date_updated: '2024-01-09T18:01:56.000Z'
date_created: '2024-01-09T18:01:56.000Z'
pinned: false
---

This final array article in this series is a specialized tip, but when needed it is very handy to have available.

In AVR Classic you could use data structures to overlay incoming values from a disk file record buffer into other values, structures, or arrays. Overlapping array techniques with packed and binary data is troublesome in .NET (because .NET doesn’t have the concept of field values being mapped contiguously in memory like AVR Classic and green-screen RPG do). The `DclAliasGroup` operation helps to remove the pain of mapping an incoming record buffer to an array.

For example, consider the following record format. It has twelve monthly account balance values in fields `CSSales01` through `CSSales12`. When this record is read, you want to implicitly map these 12 record format fields into an array.

```
----------------------------------------------------------------
    CSMasterL1 file layout.
----------------------------------------------------------------
    Database name... DG Net Local
    Library name.... Examples
    File name....... CSMasterL1
----------------------------------------------------------------
    CSCustNo    *Packed  Len(  9,  0) Customer Number
    CSYear      *Zoned   Len(  4,  0) Sales Year
    CSType      *Zoned   Len(  1,  0) 1 = sales 2 = returns
    CSSales01   *Packed  Len( 11,  2) Sales Month 01
    CSSales02   *Packed  Len( 11,  2) Sales Month 02
    CSSales03   *Packed  Len( 11,  2) Sales Month 03
    CSSales04   *Packed  Len( 11,  2) Sales Month 04
    CSSales05   *Packed  Len( 11,  2) Sales Month 05
    CSSales06   *Packed  Len( 11,  2) Sales Month 06
    CSSales07   *Packed  Len( 11,  2) Sales Month 07
    CSSales08   *Packed  Len( 11,  2) Sales Month 08
    CSSales09   *Packed  Len( 11,  2) Sales Month 09
    CSSales10   *Packed  Len( 11,  2) Sales Month 10
    CSSales11   *Packed  Len( 11,  2) Sales Month 11
    CSSales12   *Packed  Len( 11,  2) Sales Month 12
```

The array below is the target array into which we want to put each of the twelve monthly fields:

```
DclArray    MonthlyTotals  Type(*Packed) +
                            Len(11, 2)    +
                            Dim(12)
```

This line of AVR for .NET (defined in the code right after the `DclArray`) causes the automatic mapping of the fields into the array—implicitly each time a record is read:

```
    DclAliasGroup MonthlyTotals             +
                  Flds(SalesDtls_CSSales01) +
                  Fmt(SALESFORMAT)          +
                  Count(12)
``` 

With the target array and the `DclAliasGroup` declared, the twelve monthly balance fields are moved implicitly into the `MonthlyTotals` array after the record format is read. After a read operation, fields `CSSales01` through `CSSales12` values are in `MonthlyTotal's` elements 0 through 11, respectively.
