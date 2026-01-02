---
title: Using Open Query File with ASNA Visual RPG
description: Open Query File is an older IBM i feature that provides some SQL-like operations to RPG's record level access. This aricle shows how to use Open Query File with ASNA Visual RPG.
tags:
  - datagate-ibm-i
  - visual-rpg
date_published: '2023-12-28T18:20:19.000Z'
date_updated: '2023-12-28T18:20:19.000Z'
date_created: '2023-12-28T18:20:19.000Z'
pinned: false
---

[<i class="fa-brands fa-github"></i> See this project on GitHub](https://github.com/ASNA/AVR-Open-Query-File)

Finding records where a field contains a given value is an awkward thing to do with RPG's record-level access. In either green-screen RPG or ASNA Visual RPG (AVR), the ugly solution is simple, loop over every record in the file checking each field as you go. This works, but have something nearby to keep you occupied while you wait.

Intermediate to advanced coders may turn to embedded SQL with green-screen RPG or use ADO.NET with AVR. This is a good solution, but requires troublesome setup and configuration for the .NET managed data provider-and SQL knowledge.

## The Open Query File alternative

However, a good alternative does lurk in the form of AVR's support of Open Query File. The IBM i's Open Query File (OQF) is a rich and deep set of features. On the IBM i side of things you can do lots with OQF. However, IBM i programmers have pretty much relegated OQF to the sidelines with the advent of IBM i's superior SQL-based options. AVR provides support for a subset of OQF facilities which generally encompass OQF's QRYSLT and KEYFLD keywords. Don't expect to be able to do with AVR all that you can do with ILE RPG using OQF, but even with limited power, using OQF with AVR can provide some excellent results. As always, test, test, test. If you do something cool with IBM i's OQF and AVR, please let us know. Read more about IBM i's           [Open Query File here](https://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_72/cl/opnqryf.htm)           .

Open Query File is pretty smart and does a good job brute-forcing its way through files, even when queries are specified that don't have a corresponding previously-created access path. That said, test your queries carefully. Throw a sloppy enough query at OQF and you might make smoke come out of your IBM i.

DataGate does support OQF on DataGate for Windows (AKA the local ASNA database) and DataGate for SQL Server but results limited to simple select values.

> Note that DataGate does not support updating Open Query Files.

## Get to it!

This simple example shows how to extract records from a file searching the customer name for a given string anywhere in the customer name. The input is an indexed logical file keyed on customer name and customer number. A code narrative follows the code below.

> The use of                `
>                     qsystrntbl
>                `                is unique to DataGate on the IBM i and does not work with DataGate for SQL Server or DataGate for Windows and Servers.

```
BegClass Test

    DclDB pgmDB DBName( "*Public/Cypress" )

    DclDiskFile  Cust +
        Type( *Input) +
        Org( *Indexed) +
        Prefix( Cust_) +
        File( "Examples/CMastNewL1") +
        DB( pgmDB) +
        ImpOpen( *No )


    BegSr Run Access(*Public)        
        DclFld QueryMask  Type(*String) 
        DclFld QueryValue Type(*String) 
        DclFld Query      Type(*String) 

        Connect pgmDB 

        Cust.QryKeyFlds = "CMCustNo *ASCEND"
        QueryValue = "CANADA"
        
        QueryMask = "%XLATE(CMNAME qsystrntbl) *CT '{0}'"
        Query = String.Format(QueryMask, QueryValue)         

        Cust.QrySelect = Query

        Open Cust 

        Read Cust 
        DoWhile NOT Cust.IsEof
            Console.WriteLine(Cust_CMName)
            Read Cust 
        EndDo 

        Close *All
        Disconnect pgmDB         
    EndSr
EndClass
```
**Lines 1 - 9.**

Declare the database object and the disk file. The           `
               ImpOpen(*No)
          `           requires the file must be explicitly opened in the code. This is an OQF requirement.

**Line 18.**

Specify the fields to include in the query output and optionally their sorting sequence by assigning them to the           `
               Cust
          `           file's QryKeyFields property.

**Line 19.**

The           `
               QueryValue
          `           field is the query value that, although hard coded here, would normally be provided by the end user at runtime. In this case, we're looking for all customer names that contain 'AND SONS'.

**Lines 21 - 22.**

The           `
               QueryMask
          `           field provides the base value to be passed as AVR's OQF's QrySelect value. The           `
               String
          `           class's static           `
               Format
          `           method interpolates the           `
               QueryValue
          `           with the           `
               QueryMask
          `           field. This results in the           `
               Query
          `           field having the value:

```
%XLATE(CMNAME qsystrntbl) *CT 'AND SONS'
```
This query is using some IBM i Open Query File magic that I learned way back in my formative years. Break it into three pieces to understand it:

1. `
                    %XLATE(CMNAME qsystrntbl)
               `
               passes the
               `
                    CMNAME
               `
               field to the
               `
                    %XLATE
               `
               function which uses the qsystrntbl IBM i translation table to return the uppercase value of the CMNAME field. See Example #2
               [near the bottom of this page for more on
                    `
                         %XLATE
                    `
                    and
                    `
                         qsystrntbl
                    `
                    .](https://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_72/cl/opnqryf.htm)
2. `
                    *CT
               `
               is Open Query File's
               `
                    Contains
               `
               operator. It looks for the occurrence of the query value anywhere in the
               `
                    CMNAME
               `
               field value.
3. `
                    'AND SONS'
               `
               is the query value. Because Step 1's converted the
               `
                    CMNames
               `
               value to uppercase using the
               `
                    ToUpper()
               `
               method during the string interpolation ensures the query is case insensitive.

Unlike SQL, you can use fields from the input file in the query even if they aren't specified in the           `
               QryKeyFlds
          `           property.

**Line 24.**

Assign the resolved           `
               Query
          `           field to the           `
               Cust
          `           file's           `
               QrySelect
          `           property.

**Line 26.**

OQF is in play because the           `
               Cust
          `           file's           `
               QryKeyFlds
          `           and           `
               QrySelect
          `           properties have values. When OQF is in play, opening           `
               Cust
          `           doesn't open the underlying physical or logical file, but rather opens the result set returned by the query. The query occurs, on the server side, immediately after opening the file.

The rest of the code is pretty obvious. Loop over the result set and do something with it. Remember that the only fields available are those specified by the           `
               QryKeyFlds
          `           value.

## Rounding out your programming kitbag

This isn't a technique you'll use everywhere, but it's the kind of technique that when you do need it you'll be very glad it's in your AVR programming kit bag.