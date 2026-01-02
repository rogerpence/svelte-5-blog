---
title: Create JSON schemas of DataGate files
description: Create JSON schemas of DataGate files
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - datagate
---
This utility generates a Json file schema for one or all DataGate files in a library.

> [!info]
> There is a similar uility named general-sql-server-json-models that genreates similar Json for SQL Server tables. That is utility is currently located here: "C:\Users\thumb\Documents\projects\from-delray\rputilities\general-sql-server-json-models". It's not yet been compiled on envoy.

> [!note]
> This utility uses the ArgyBargy at https://github.com/rogerpence/ArgyBargy. Don't use the other ArgyBargy's you may find floating around in the old backups.

This utility grew out of some very old for a very old fat client version of Libretto. Some of its code is pretty complex owing to DataGate's sophisticated use of XML (especially `GetFileDescription.vr`). The XML the DataGate client creates is used parsed and converted to Json. This code could be simplified but it works so leave it alone!

Command line:

```
Generate DataGate file schemas for a library

Flag                  ShortHand  Required  Description
--------------------  ---------  --------  ---------------------------------------------
--databasename           -d        True    DateGate Database Name
--library                -l        True    Library name
--outputpath             -o        False   Output path (appended to output path selected--see below)
--physicalsonly          -po       False   Process physical files only (default is false)
--help                   -h                Show this help
```

For example, given this DataGate file:

```
Database Name.: dg-local-db
Library.......: examples
File..........: CMastNew
Format........: RCMmaster
Key field(s)..:
Type..........: physical
Base file.....:
Description...: Customer master
Record length.: 151

Field name        Data type                    Description
----------------------------------------------------------------------------
CMCustNo          Type(*Packed) Len(9,0)       Cutomer Number
CMName            Type(*Char) Len(40)          Customer Name
CMAddr1           Type(*Char) Len(35)          Address Line 1
CMCity            Type(*Char) Len(30)          City
CMState           Type(*Char) Len(2)           State
CMCntry           Type(*Char) Len(2)           Country Code
CMPostCode        Type(*Char) Len(10)          Postal Code (zip)
CMActive          Type(*Char) Len(1)           Active = 1, else 0
CMFax             Type(*Packed) Len(10,0)      Fax Number
CMPhone           Type(*Char) Len(20)          Main Phone
----------------------------------------------------------------------------
```

This JSON is created:

```
{
  "dbname": "dg-local-db",
  "library": "examples",
  "file": "CMastNew",
  "format": "RCMmaster",
  "description": "Customer master",
  "type": "physical",
  "recordlength": "151",
  "keylength": "0",
  "basefile": "",
  "duplicatekeys": "allowed",
  "sqlserveruniqueindex": "",
  "alias": "cmastnew",
  "keyfieldslist": "",
  "allfieldslist": "cmcustno, cmname, cmaddr1, cmcity, cmstate, cmcntry, cmpostcode, cmactive, cmfax, cmphone",
  "fields": [
    {
      "name": "CMCustNo",
      "description": "Cutomer Number",
      "alias": "cmcustno",
      "fulltype": "Type(*Packed) Len(9,0)",
      "type": "*Packed",
      "length": "9",
      "decimals": "0",
      "systemtype": "System.Decimal",
      "iskey": false,
      "keyposition": -1,
      "allownull": false,
      "sqlservertype": "decimal(9,0)",
      "sqlservernull": "NOT NULL",
      "sqlserverprimarykey": ""
    },
    {
      "name": "CMName",
      "description": "Customer Name",
      "alias": "cmname",
      "fulltype": "Type(*Char) Len(40)",
      "type": "*Char",
      "length": "40",
      "decimals": "",
      "systemtype": "System.String",
      "iskey": false,
      "keyposition": -1,
      "allownull": false,
      "sqlservertype": "varchar(40)",
      "sqlservernull": "NOT NULL",
      "sqlserverprimarykey": ""
    },
    ... other fields hidden for publication purposes.
  ]
}
```

Using that Json schema with Libretto, you could use this template:

```
C:\Users\thumb\Documents\projects\rp-utilities\librettox\template_work\templates\datagate\create_sql_table.tpl.sql
```

to produce this SQL. This enables easy creation of corresponding SQL Server tables for DataGate files.
This SQL is

```
USE [PUT SQL DATABASE NAME HERE]

DROP TABLE IF EXISTS CMastNew

CREATE TABLE CMastNew (
	[id] [int] IDENTITY(1,1) NOT NULL,
    [CMCustNo] decimal(9,0) NOT NULL,
    [CMName] varchar(40) NOT NULL,
    [CMAddr1] varchar(35) NOT NULL,
    [CMCity] varchar(30) NOT NULL,
    [CMState] varchar(2) NOT NULL,
    [CMCntry] varchar(2) NOT NULL,
    [CMPostCode] varchar(10) NOT NULL,
    [CMActive] varchar(1) NOT NULL,
    [CMFax] decimal(10,0) NOT NULL,
    [CMPhone] varchar(20) NOT NULL,

);
```

For this task, you'd generally use GenDGJsonSchema's `-po` flag to create Json schemas for physical files only (but, you wouldn't have to).