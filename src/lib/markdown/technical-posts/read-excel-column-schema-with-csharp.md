---
title: read-excel-column-schema-with-csharp
description: read-excel-column-schema-with-csharp
date_created: '2025-10-20T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - excel
  - csharp
---
```cs
using ClosedXML.Excel;
using System;
using System.Linq;

public class SpreadsheetReader
{
    public static void ReadSpreadsheetColumns(string spreadsheetName)
    {
        try
        {
            using (var workbook = new XLWorkbook(spreadsheetName))
            {
                // Assuming you want to read the first worksheet
                var worksheet = workbook.Worksheet(1); 

                // Get the used range to iterate through columns that have data
                var usedRange = worksheet.RangeUsed();

                Console.WriteLine($"Reading spreadsheet: {spreadsheetName}");
                Console.WriteLine("-------------------------------------");

                // Iterate through columns in the used range
                foreach (var column in usedRange.ColumnsUsed())
                {
                    // Get the column number
                    int columnNumber = column.ColumnNumber();

                    // Get the header cell value (assuming the first row is the header)
                    // If your spreadsheet doesn't have a header, you might want to use a different way to name columns.
                    string columnName = worksheet.Cell(1, columnNumber).GetValue<string>();

                    // Get a cell from this column to inspect its data type.
                    // We'll pick the first cell with a value after the header, if it exists.
                    var firstDataCell = column.CellsUsed(c => c.Address.RowNumber != 1).FirstOrDefault();

                    string excelDataType = "N/A";
                    if (firstDataCell != null)
                    {
                        // ClosedXML provides the DataType property which maps to Excel's data types
                        excelDataType = firstDataCell.DataType.ToString();
                    }

                    Console.WriteLine($"Column Name: {columnName}, Excel Data Type: {excelDataType}");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
        }
    }

    public static void Main(string[] args)
    {
        // Replace "YourSpreadsheet.xlsx" with the actual path to your spreadsheet file
        string spreadsheetName = "YourSpreadsheet.xlsx"; 

        // Create a dummy spreadsheet for testing if you don't have one
        CreateDummySpreadsheet(spreadsheetName);

        ReadSpreadsheetColumns(spreadsheetName);
    }

    private static void CreateDummySpreadsheet(string filename)
    {
        using (var workbook = new XLWorkbook())
        {
            var worksheet = workbook.Worksheet("Sheet1");

            // Add headers
            worksheet.Cell("A1").Value = "Name";
            worksheet.Cell("B1").Value = "Age";
            worksheet.Cell("C1").Value = "Date Joined";
            worksheet.Cell("D1").Value = "Is Active";
            worksheet.Cell("E1").Value = "Salary";
            worksheet.Cell("F1").Value = ""; // An empty column

            // Add data
            worksheet.Cell("A2").Value = "Alice";
            worksheet.Cell("B2").Value = 30;
            worksheet.Cell("C2").Value = new DateTime(2020, 1, 15);
            worksheet.Cell("D2").Value = true;
            worksheet.Cell("E2").Value = 50000.50;

            worksheet.Cell("A3").Value = "Bob";
            worksheet.Cell("B3").Value = 25;
            worksheet.Cell("C3").Value = new DateTime(2021, 5, 20);
            worksheet.Cell("D3").Value = false;
            worksheet.Cell("E3").Value = 45000;

            workbook.SaveAs(filename);
            Console.WriteLine($"Dummy spreadsheet '{filename}' created for testing.");
        }
    }
}
```