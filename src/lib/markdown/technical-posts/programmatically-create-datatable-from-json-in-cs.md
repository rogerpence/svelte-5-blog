---
title: Programmatically create a DataGate from a Json document with CS
description: Programmatically create a DataGate from a Json document with CS
date_created: '2025-08-25T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - csharp
---
```json
[
    {
        "sqlColumn": "Email",
        "excelColumn": "Email",
        "dataType": "string"
    },
    {
        "sqlColumn": "CompanyName",
        "excelColumn": "CompanyName",
        "dataType": "string"
    },
    {
        "sqlColumn": "FirstName",
        "excelColumn": "First name",
        "dataType": "string"
    },
    {
        "sqlColumn": "LastName",
        "excelColumn": "Last name",
        "dataType": "string"
    },
    {
        "sqlColumn": "Title",
        "excelColumn": "Title",
        "dataType": "string"
    }
]
```

## Class to define the Json document

```c#
public class ColumnMapping
{
    public string SqlColumn { get; set; }
    public string ExcelColumn { get; set; }
    public string DataType { get; set; }
}
```

## Code

```c#
using System;
using System.Data;
using System.Text.Json;
using System.Collections.Generic;

public class JsonToDataTable
{
    public static DataTable CreateDataTableFromJson(string jsonArray)
    {
        // Deserialize the JSON array into a list of ColumnMapping objects
        List<ColumnMapping> columnMappings = JsonSerializer.Deserialize<List<ColumnMapping>>(jsonArray);

        DataTable dataTable = new DataTable();

        // Dynamically add columns based on the JSON data
        foreach (var mapping in columnMappings)
        {
            Type columnType;
            switch (mapping.DataType.ToLower())
            {
                case "string":
                    columnType = typeof(string);
                    break;
                case "int":
                case "integer":
                    columnType = typeof(int);
                    break;
                case "decimal":
                case "double":
                case "float":
                    columnType = typeof(decimal); // Using decimal for financial accuracy
                    break;
                case "datetime":
                    columnType = typeof(DateTime);
                    break;
                case "boolean":
                    columnType = typeof(bool);
                    break;
                // Add more cases as needed for other data types
                default:
                    columnType = typeof(string); // Default to string if type is unknown
                    break;
            }
            dataTable.Columns.Add(mapping.SqlColumn, columnType);
        }

        return dataTable;
    }

    public static void Main(string[] args)
    {
	    // Read Json file
    
        DataTable myTable = CreateDataTableFromJson(json);

        Console.WriteLine("DataTable created with columns:");
        foreach (DataColumn column in myTable.Columns)
        {
            Console.WriteLine($"- {column.ColumnName} ({column.DataType})");
        }
    }
}
```