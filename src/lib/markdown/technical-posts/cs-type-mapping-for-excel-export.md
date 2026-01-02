---
title: Use reflection with C# to create a map-driven Excel export process
description: Use reflection with C# to create a map-driven Excel export process
date_created: '2025-06-05T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - excel
---
I have this C# code that fetches values from an Excel spreadsheet:

```
account.AccountNumber = GetCellValue<int>("AccountNumber", worksheet.Cell(row, "A"));
account.PostDate = GetCellValue<DateTime>("PostDate", worksheet.Cell(row, "B"));
account.Check = GetCellValue<string>("Check", worksheet.Cell(row, "C"));
```

I'd like to make the code more declarative and drive with a column map of some kind, perhaps Json, maybe like this:

```
[ 						
	{
	   name: AccountNumber,
	   type: "int",
	   column: "A"
	},
	{
	   name: PostDate,
	   type: "DateType",
	   column: "B"
	},
	{
	   name: Check,
	   type: "string",
	   column: "C"
	}
]
```

How can I translate the type from something like "int" to be able to make the call to the generic GetCellValue function?

## Answer 

Of course! This is an excellent goal. Moving to a declarative, data-driven approach makes your code much more flexible and maintainable.

The core of your question is: **"How do I use a `string` like `"int"` to call a generic method like `GetCellValue<int>()`?"**

You cannot do this directly at compile time, as the compiler needs to know the specific type `T` for the generic method. The solution is to use **Reflection** at runtime. Reflection allows you to inspect and invoke types and methods dynamically.

Here's a complete, step-by-step guide to achieve your goal.

### Step 1: Define the Configuration and C# Models

First, let's create the C# classes that will represent your JSON configuration and your target `Account` object.

**JSON Configuration (`columnMappings.json`)**

Your proposed JSON is great. Let's stick with standard JSON naming conventions (camelCase).

```json
[
  {
    "propertyName": "AccountNumber",
    "type": "int",
    "column": "A"
  },
  {
    "propertyName": "PostDate",
    "type": "DateTime",
    "column": "B"
  },
  {
    "propertyName": "Check",
    "type": "string",
    "column": "C"
  }
]
```

**C# Mapping Class**

This class will hold the deserialized data from the JSON file.

```csharp
public class ColumnMapping
{
    // The name of the property on your target C# object (e.g., Account)
    public string PropertyName { get; set; } = string.Empty;

    // The string representation of the C# type
    public string Type { get; set; } = string.Empty;

    // The Excel column letter
    public string Column { get; set; } = string.Empty;
}
```

**C# Target Object**

This is the `Account` class you are trying to populate.

```csharp
public class Account
{
    public int AccountNumber { get; set; }
    public DateTime PostDate { get; set; }
    public string? Check { get; set; }

    public override string ToString()
    {
        return $"Account: {AccountNumber}, Date: {PostDate:d}, Check: '{Check}'";
    }
}
```

### Step 2: Translate the Type String to a `System.Type`

The `Type.GetType()` method can work, but it often requires fully qualified names (e.g., `"System.Int32"` instead of `"int"`). A more robust and user-friendly approach is to create a simple dictionary that maps your friendly JSON type names to the actual `System.Type`.

```csharp
private static readonly Dictionary<string, Type> TypeMap = new(StringComparer.OrdinalIgnoreCase)
{
    { "int", typeof(int) },
    { "string", typeof(string) },
    { "datetime", typeof(DateTime) },
    { "decimal", typeof(decimal) },
    { "double", typeof(double) },
    { "bool", typeof(bool) }
    // Add any other types you need
};

public Type GetSystemType(string typeName)
{
    if (TypeMap.TryGetValue(typeName, out var type))
    {
        return type;
    }
    throw new ArgumentException($"The type '{typeName}' is not a supported type.");
}
```

This makes your JSON configuration much cleaner (`"int"` is nicer than `"System.Int32"`).

### Step 3: Use Reflection to Call the Generic Method

This is the key part. We will create a processor class that reads the mappings and populates the object row by row.

1.  Get the `MethodInfo` for your `GetCellValue<T>` method.
2.  Use `MethodInfo.MakeGenericMethod(type)` to create a specific, closed generic method (e.g., the equivalent of `GetCellValue<int>`).
3.  Use `MethodBase.Invoke()` to call that method and get the result.
4.  Use reflection again to find the corresponding property on the `Account` object and set its value.

Here's a full `ExcelMapper` class that brings it all together.

```csharp
using ClosedXML.Excel; // Assuming you use ClosedXML, as is common
using System.Reflection;
using System.Text.Json;

public class ExcelMapper
{
    // Assume you have your GetCellValue method in this class.
    // This is a mock implementation for demonstration.
    public T GetCellValue<T>(string propertyName, IXLCell cell)
    {
        // Your actual implementation would have robust error handling
        // and type conversion from the cell's value.
        try
        {
            return cell.GetValue<T>();
        }
        catch (Exception ex)
        {
            // A good place to add more context to the error
            throw new InvalidCastException(
                $"Failed to get value for property '{propertyName}' from cell {cell.Address}.", ex);
        }
    }

    // The type mapping dictionary from Step 2
    private static readonly Dictionary<string, Type> TypeMap = new(StringComparer.OrdinalIgnoreCase)
    {
        { "int", typeof(int) },
        { "string", typeof(string) },
        { "datetime", typeof(DateTime) },
        { "decimal", typeof(decimal) },
        { "double", typeof(double) },
        { "bool", typeof(bool) }
    };

    public Type GetSystemType(string typeName)
    {
        if (TypeMap.TryGetValue(typeName, out var type))
        {
            return type;
        }
        // Fallback for fully qualified names if you want
        var systemType = Type.GetType(typeName);
        if (systemType != null) return systemType;
        
        throw new ArgumentException($"The type '{typeName}' is not a supported or recognized type.");
    }

    // The main method that drives the mapping process
    public T MapRowToObject<T>(IXLWorksheet worksheet, int row, IEnumerable<ColumnMapping> mappings) where T : new()
    {
        var targetObject = new T();

        // Get the MethodInfo for our generic GetCellValue method.
        // We only need to do this once.
        MethodInfo? getCellValueMethod = typeof(ExcelMapper).GetMethod("GetCellValue");
        if (getCellValueMethod == null)
        {
            throw new InvalidOperationException("Could not find the 'GetCellValue' method via reflection.");
        }

        foreach (var mapping in mappings)
        {
            // 1. Get the target cell from the worksheet
            var cell = worksheet.Cell(row, mapping.Column);

            // 2. Translate the string type to a System.Type
            Type propertyType = GetSystemType(mapping.Type);

            // 3. Create the specific generic method (e.g., GetCellValue<int>)
            MethodInfo genericMethod = getCellValueMethod.MakeGenericMethod(propertyType);

            // 4. Invoke the method dynamically
            //    The first argument is the instance to call the method on ('this').
            //    The second is an array of arguments for the method.
            object? value = genericMethod.Invoke(this, new object[] { mapping.PropertyName, cell });

            // 5. Find the property on the target object and set its value
            PropertyInfo? propInfo = typeof(T).GetProperty(mapping.PropertyName);
            propInfo?.SetValue(targetObject, value);
        }

        return targetObject;
    }
}
```

### Step 4: Putting it all to use

Now, your main processing logic becomes much cleaner.

```csharp
public class Program
{
    public static void Main()
    {
        // --- Setup (Create a dummy Excel file for testing) ---
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Accounts");
        worksheet.Cell("A1").Value = "AccountNumber";
        worksheet.Cell("B1").Value = "PostDate";
        worksheet.Cell("C1").Value = "Check";

        worksheet.Cell("A2").Value = 12345;
        worksheet.Cell("B2").Value = new DateTime(2023, 10, 27);
        worksheet.Cell("C2").Value = "CHK-987";
        // --- End Setup ---

        // 1. Load the JSON mapping configuration
        string jsonConfig = File.ReadAllText("columnMappings.json");
        var mappings = JsonSerializer.Deserialize<List<ColumnMapping>>(jsonConfig)!;
        
        // 2. Create an instance of our mapper
        var mapper = new ExcelMapper();
        
        // 3. Process a row
        int rowToProcess = 2;
        Account account = mapper.MapRowToObject<Account>(worksheet, rowToProcess, mappings);
        
        // 4. Use the populated object
        Console.WriteLine(account); 
        // Expected Output: Account: 12345, Date: 10/27/2023, Check: 'CHK-987'
    }
}
```

### Summary of Benefits

*   **Declarative:** Your logic for mapping columns to properties is now declared in a simple JSON file, not hidden in C# code.
*   **Maintainable:** To add a new field, you just add an entry to the JSON file and a property to the `Account` class. You don't need to change the mapping code at all.
*   **Flexible:** You can easily have different mapping files for different Excel layouts without recompiling your application.
*   **Reusable:** The `ExcelMapper` class can be used to map data to *any* target object (`<T>`), not just `Account`.