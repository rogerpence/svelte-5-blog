---
title: Getting to know AVR's memory file
description: A look at Visual RPG's memory file and how it works with the .NET Framework's System.Data.DataTable works.
tags:
  - visual-rpg
date_published: '2024-01-09T13:28:43.000Z'
date_updated: '2024-01-09T21:14:30.000Z'
date_created: '2024-01-09T21:14:30.000Z'
pinned: false
---

AVR for .NET's memory file is an RPG programming interface over .NET's `System.Data.DataSet`. Under the covers, what really lurks in a memory file is .NET's `System.Data.DataSet`. The memory file surfaces this `DataSet` with its dataset property. The `DataSet` is the central nervous system of the memory file. To understand the memory file you need to understand the `DataSet`. When you write to and read from a memory file, the memory file's `DataSet` property is where all that writing and reading is really taking place.

A `DataSet` is an in-memory cache of data retrieved from a data source. The `DataSet` is a parent object that consists of one more `DataTable` objects. For most purposes, especially when using a memory file, you'll only have one table per dataset. Each `DataTable` object consists of `DataColumn` and `DataRow` objects.

![Memory file structure](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/memory-file.png)

Figure 1. The DataSet and its inner members.

## The memory file

AVR's memory file is an in-memory file generally used as a temporary data store. Rows are "written" (in quotations because rows are written to memory, not disk) to memory files, usually to later be bound to a .NET user interface element.

> Beware that a memory file stores its contents in memory, never on disk. Be mindful of how many rows you write to a memory file. While it is surprising how many rows .NET can sustain in memory, don't get carried away. Not only would lots of rows tax memory, but they would also offer a larger payload across the network. No user wants to to wait on 5,000 rows being rendered in the browser!

Let's take a look at two ways to declare a memory file:

Create a memory file that duplicates all of the fields in a given file:

```
DclMemoryFile MemFile +
    DBDesc("*Public/DG Net Local") +
    FileDesc("Examples/CMastNewL1") +
    RnmFmt(MemFileR)
```    

The memory file above contains all of the columns in the `Examples/CMastNewL1` file. Memory files are using used along with a corresponding `DclDiskFile` of the same data file, so it's usually necessary to rename the memory file's format.

Create a program-described memory file:

```
DclMemoryFile MemFile ImpOpen(*Yes) 
    DclRecordFormat Customers 
    DclRecordFld    Customer_CMCustNo  Type(*Packed) Len(9,0)
    DclRecordFld    Customer_CMName    Type(*Char) Len(40)      
```    

The memory file above creates a memory file with two fields. Program-described memory files are useful when you don't need every column in a file. A program-described memory file's format name is explicitly provided with the required `DclRecordFormat` operation code.

The discussion applies to either way of defining a memory file.

## Populating a memory file

The code below writes up to 16 rows to a memory file, after each read of a record from the `Customer` file.

```
DclDB DGDB DBName("*Public/DG Net Local") 
            
DclDiskFile Customer +
        Type(*Input) + 
        Org(*Indexed) + 
        Prefix(Customer_) + 
        File("examples/cmastnewl2") +
        DB(DGDB) +
        ImpOpen(*No)  

DclMemoryFile MemFile ImpOpen(*Yes) 
    DclRecordFormat Customers 
    DclRecordFld    Customer_CMCustNo  Type(*Packed) Len(9,0)
    DclRecordFld    Customer_CMName    Type(*Char) Len(40)     

    ...
    
    Do FromVal(1) ToVal(16)
        Read Customer 
        If Customer.IsEof()            
            Leave
        EndIf
    
        Write MemFile      
    EndDo                   
```    

The result of the code above is that the `DataSet` property's `DataTable` property is populated with the rows read from the `Customer` file. Direct access to the memory file's `DataSet` is available with this code:

```
DclFld ds Type(System.Data.DataSet)
ds = MemFile.DataSet
```    

Recall that the `DataSet` can have more than one `DataTable` (although used with AVR it rarely, if ever, does). These `DataTables` are available through the `DataSet's` `Tables` collection. The code below fetches the zeroth (the only) `DataTable` in the `DataSet`.

```
DclFld dt Type(System.Data.DataTable)
dt = MemFile.DataSet.Tables[0]
```    

#### DataColumns and DataRows

Each `DataTable` comprises a collection of `DataColumn` objects. These `DataColumns` define the file's layout (i.e., its field names, their types, and their values). The contents of each `DataTable` are stored in a collection of `DataRows`.

First, get the table reference. With it, you're ready to work with the table's rows and columns:

```
dt = MemFile.DataSet.Tables[0]
```
    

Iterate the `DataTable's` `DataColumns` with:

```
ForEach Col Type(DataColumn) Collection(dt.Columns) 
    // Col now contains a reference to a column in the table
EndFor
```    

Iterate the `DataTable's` `DataRows` with:

```
ForEach Row Type(DataRow) Collection(dt.Rows) 
    // Row contains a reference to a row in the table
EndFor 
```    

Putting all that together, the code beloww loads 16 rows into the memory file and then shows each field value in each `DataRow`, fetching the values out by field name:

```
DclDB DGDB DBName("*Public/DG Net Local") 
        
DclDiskFile Customer +
        Type(*Input) + 
        Org(*Indexed) + 
        File("examples/cmastnewl2") +
        DB(DGDB) +
        ImpOpen(*No)  

DclMemoryFile MemFile +
    DBDesc("*Public/DG Net Local") +
    FileDesc("Examples/CMastNewL1") +
    RnmFmt(MemFileR)

BegSr Run Access(*Public) 
    DclFld FieldNameList Type(StringCollection) 

    Connect DGDB 
    Open Customer 

    WriteRowsToMemoryFile()
    FieldNameList = GetFieldNameList()
    ShowFieldValues(FieldNameList) 

    Close *All
    Disconnect DGDB 
EndSr

BegSr WriteRowsToMemoryFile
    Do FromVal(1) ToVal(16)
        Read Customer 
        If Customer.IsEof()            
            Leave
        EndIf

        Write MemFile      
    EndDo 
EndSr 

BegFunc GetFieldNameList Type(StringCollection) 
    DclFld dt Type(DataTable) 
    DclFld FieldNameList Type(StringCollection) New()

    dt = MemFile.DataSet.Tables[0]

    // Iterate each column adding its field name to the collection.
    ForEach Col Type(DataColumn) Collection(dt.Columns) 
        FieldNameList.Add(col.ColumnName.ToString()) 
    EndFor        
    LeaveSr FieldNameList 
EndFunc 

BegSr ShowFieldValues
    DclSrParm FieldNameList Type(StringCollection) 

    DclFld dt Type(DataTable) 

    dt = MemFile.DataSet.Tables[0]

    // Iterate each data row. 
    ForEach dr Type(DataRow) Collection(dt.Rows) 
        // Show the value for each field in the row.
        ForEach FieldName Type(*String) Collection(FieldNameList)
            Console.WriteLine(dr[FieldName].ToString())  
            // Note that field values are also assignable. 
            // Assuming 'FieldName is a string type, you could do this.
            // dr[FieldName] = 'xyz'
        EndFor 
    EndFor 
EndSr 
```    

## Summary

While the `DataSet` is looked down on by purists, there is a lot AVR can do with it. Spend some time seeing what it can do for you.

