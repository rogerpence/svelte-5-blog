---
title: C# data models for Excel using attributes and reflection
description: C# data models for Excel using attributes and reflection
date_created: '2025-06-05T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - excel
  - data-model
---
I spent a little time with Google Gemini exploring how to make better C# data models for Excel. This is the what I learned/did. 

The working code is here:

```
C:\Users\thumb\Documents\projects\cs\ExportExcelToSQLServer
```

Given a C# class like this, write a function that uses reflection to return a string list of the name of each property:

```
namespace Models
{
    public class LakeB2B
    {
        public int? Counter { get; set; }
        public string? Tag { get; set; }
        public string? Email { get; set; }
        public string? CompanyName { get; set; }
        public string? WebAddress { get; set; }
        public string? Prefix { get; set; }
        public string? ContactName { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? Title { get; set; }
        public string? Address { get; set; }
        public string? Address1 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public string? Country { get; set; }
        public string? PhoneNumber { get; set; }
        public string? EmployeesSize { get; set; }
        public string? RevenueSize { get; set; }
        public string? SicCodes { get; set; }
        public string? Industry { get; set; }
        public string? ApplicationType { get; set; }
    }
}
```

# Answer

Of course. Using reflection to inspect a class's members is a powerful feature in C#. Here is a function that accomplishes exactly what you've asked for, along with a complete, runnable example.

We'll create a generic method, which is the most common and flexible way to handle this.

### Method 1: The Generic LINQ Approach (Recommended)

This approach is clean, concise, and type-safe. It uses a generic type parameter `<T>` to represent the class you want to inspect.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection; // Important: Add this using statement for reflection

namespace Models
{
    // The class provided in the request
    public class LakeB2B
    {
        public int? Counter { get; set; }
        public string? Tag { get; set; }
        public string? Email { get; set; }
        public string? CompanyName { get; set; }
        public string? WebAddress { get; set; }
        public string? Prefix { get; set; }
        public string? ContactName { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? Title { get; set; }
        public string? Address { get; set; }
        public string? Address1 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public string? Country { get; set; }
        public string? PhoneNumber { get; set; }
        public string? EmployeesSize { get; set; }
        public string? RevenueSize { get; set; }
        public string? SicCodes { get; set; }
        public string? Industry { get; set; }
        public string? ApplicationType { get; set; }
    }
}

public class ReflectionExample
{
    /// <summary>
    /// Uses reflection to get the names of all public properties for a given type.
    /// </summary>
    /// <typeparam name="T">The type to inspect.</typeparam>
    /// <returns>A List of strings containing the property names.</returns>
    public static List<string> GetPropertyNames<T>()
    {
        // Get the type of the generic parameter
        Type type = typeof(T);

        // Get all public instance properties
        PropertyInfo[] properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);

        // Use LINQ to select the name of each property and return it as a list
        return properties.Select(p => p.Name).ToList();
    }

    public static void Main(string[] args)
    {
        // Call the function, passing LakeB2B as the type parameter
        List<string> propertyNames = GetPropertyNames<Models.LakeB2B>();

        Console.WriteLine("Properties of the LakeB2B class:");
        Console.WriteLine("---------------------------------");

        // Print each property name
        foreach (string name in propertyNames)
        {
            Console.WriteLine(name);
        }
    }
}
```

#### How It Works:

1.  **`using System.Reflection;`**: This namespace is required to access reflection-related types like `Type`, `PropertyInfo`, and `BindingFlags`.
2.  **`public static List<string> GetPropertyNames<T>()`**: We define a generic method. `T` will be the class we want to analyze (in this case, `LakeB2B`).
3.  **`typeof(T)`**: This gets the `Type` object that represents the class `T`. The `Type` object is the main entry point for reflection.
4.  **`.GetProperties(...)`**: This method returns an array of `PropertyInfo` objects, each representing one property of the type.
5.  **`BindingFlags.Public | BindingFlags.Instance`**: These flags are important. They tell `GetProperties` to return only the properties that are **public** and are **instance** members (not static). This is the most common use case.
6.  **`.Select(p => p.Name)`**: This is a LINQ extension method. It iterates through the `PropertyInfo` array and, for each property (`p`), it "selects" its `Name` property.
7.  **`.ToList()`**: This LINQ method converts the resulting collection of names into a `List<string>`.

### Method 2: Taking a `Type` Object as a Parameter

Sometimes, you might not know the type at compile time and will only have a `Type` object. This version of the function is useful in those scenarios.

```csharp
/// <summary>
/// Uses reflection to get the names of all public properties for a given Type object.
/// </summary>
/// <param name="type">The Type object to inspect.</param>
/// <returns>A List of strings containing the property names.</returns>
public static List<string> GetPropertyNames(Type type)
{
    if (type == null)
    {
        return new List<string>();
    }

    return type.GetProperties(BindingFlags.Public | BindingFlags.Instance)
               .Select(p => p.Name)
               .ToList();
}

// You would call it like this in your Main method:
List<string> propertyNames = GetPropertyNames(typeof(Models.LakeB2B));
```

This version is functionally identical but offers a different way to pass in the type you want to inspect. The generic version is often preferred for its compile-time type safety.

# Question/Directive

Write a C# similar to that that reads the data model with reflection and returns a map of each property name and its data type
# Answer

Excellent request! Building on the previous example, this is a very common and useful reflection task.

The goal is to get a "map" of property names to their corresponding data types. In C#, the ideal data structure for this is a **`Dictionary<string, Type>`**.

Here is a complete, runnable C# program that uses reflection to generate this map.

### Recommended: The Generic LINQ Approach

This is the most concise and idiomatic way to achieve this in modern C#. It uses the powerful `ToDictionary()` LINQ extension method.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection; // You MUST have this for reflection

namespace Models
{
    // The same data model class
    public class LakeB2B
    {
        public int? Counter { get; set; }
        public string? Tag { get; set; }
        public string? Email { get; set; }
        public string? CompanyName { get; set; }
        // ... (other properties from your example)
        public string? Industry { get; set; }
        public Guid RecordId { get; set; } // Added for type variety
    }
}

public class ReflectionDictionaryExample
{
    /// <summary>
    /// Uses reflection to create a map of property names to their data types.
    /// </summary>
    /// <typeparam name="T">The type to inspect.</typeparam>
    /// <returns>A Dictionary where the key is the property name (string) 
    /// and the value is the property's data type (Type).</returns>
    public static Dictionary<string, Type> GetPropertiesAndTypes<T>()
    {
        return typeof(T)
            .GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .ToDictionary(prop => prop.Name, prop => prop.PropertyType);
    }

    public static void Main(string[] args)
    {
        // Get the map for the LakeB2B class
        Dictionary<string, Type> propertyMap = GetPropertiesAndTypes<Models.LakeB2B>();

        Console.WriteLine("Property Map for LakeB2B class:");
        Console.WriteLine("---------------------------------");

        // Iterate through the dictionary and print each key-value pair
        foreach (KeyValuePair<string, Type> entry in propertyMap)
        {
            // entry.Value.Name gives a clean name like "String", "Int32", or "Guid"
            Console.WriteLine($"Property: {entry.Key,-15} | Type: {entry.Value.Name}");
        }
    }
}
```

#### How It Works:

1.  **`GetProperties(...)`**: Just like before, this gets an array of `PropertyInfo` objects for our class.
2.  **`.ToDictionary(...)`**: This is a LINQ extension method that converts a sequence into a dictionary. It requires two arguments (provided as lambda expressions):
    *   **`prop => prop.Name`**: This is the *key selector*. For each `PropertyInfo` object (`prop`) in the sequence, it uses its `Name` as the dictionary key.
    *   **`prop => prop.PropertyType`**: This is the *value selector*. For each `PropertyInfo` object, it uses its `PropertyType` (which is a `Type` object) as the dictionary value.

#### Sample Output:

```
Property Map for LakeB2B class:
---------------------------------
Property: Counter         | Type: Nullable`1
Property: Tag             | Type: String
Property: Email           | Type: String
Property: CompanyName     | Type: String
Property: Industry        | Type: String
Property: RecordId        | Type: Guid
```

### Alternative: The `foreach` Loop Approach

If you prefer a more explicit, step-by-step approach without LINQ, a `foreach` loop works perfectly well and can be easier to debug for beginners.

```csharp
public static Dictionary<string, Type> GetPropertiesAndTypesWithLoop<T>()
{
    // Create an empty dictionary to store the results
    var map = new Dictionary<string, Type>();

    // Get the type and its properties
    Type type = typeof(T);
    PropertyInfo[] properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);

    // Loop through each property
    foreach (PropertyInfo prop in properties)
    {
        // Add the property's name and type to the dictionary
        map.Add(prop.Name, prop.PropertyType);
    }

    return map;
}
```
This function produces the exact same result as the LINQ version.

### A Note on Nullable Types (like `int?`)

You may have noticed `Nullable`1` in the output for the `Counter` property. This is how the .NET runtime sees nullable value types.

*   `int?` is just C# syntactic sugar for `System.Nullable<int>`.
*   `Nullable'1` is the runtime's name for a generic type `Nullable<T>` with one type parameter (`T`).

When you get the `Type` object for a nullable property, you are getting the `Nullable<T>` type itself. You can check for this and get the underlying type if needed:

```csharp
Type propertyType = entry.Value; // e.g., the Type for Nullable<int>

// Check if it's a nullable type
Type underlyingType = Nullable.GetUnderlyingType(propertyType);

if (underlyingType != null)
{
    // It was nullable!
    Console.WriteLine($"The type is Nullable of {underlyingType.Name}");
}
else
{
    // It was a regular, non-nullable type
    Console.WriteLine($"The type is {propertyType.Name}");
}
```

# Question/Directive

I want to add an attribute to each property that provides the corresponding Excel column identifier and column name, like this: 

```
[ExcelInfo("C", "Email")] 
public string? Email { get; set; }

[ExcelInfo("D", "Company Name")]
```

Write the ExcelInfo attribute function and then modify the function that returns the map of property name and type to also return the column identifier and the column name
# Answer

Of course! This is a fantastic use case for custom attributes and reflection. It allows you to embed metadata directly into your data models.

Here is the complete solution, broken down into three parts:
1.  **The `ExcelInfoAttribute` class:** The custom attribute you will use to decorate your properties.
2.  **The `PropertyMetadata` record:** A simple data structure to hold the combined information for each property.
3.  **The updated reflection function:** The method that reads the properties and their attributes, returning the final map.

### Step 1: Define the `ExcelInfoAttribute`

First, you need to create the attribute itself. An attribute is a special kind of class that inherits from `System.Attribute`.

```csharp
using System;

/// <summary>
/// Specifies the Excel column details for a property.
/// </summary>
[AttributeUsage(AttributeTargets.Property, Inherited = false, AllowMultiple = false)]
public sealed class ExcelInfoAttribute : Attribute
{
    /// <summary>
    /// The Excel column identifier (e.g., "A", "B", "C").
    /// </summary>
    public string ColumnId { get; }

    /// <summary>
    /// The friendly name for the Excel column header.
    /// </summary>
    public string ColumnName { get; }

    /// <summary>
    /// Initializes a new instance of the ExcelInfoAttribute class.
    /// </summary>
    /// <param name="columnId">The Excel column identifier (e.g., "A", "B").</param>
    /// <param name="columnName">The friendly name for the column header.</param>
    public ExcelInfoAttribute(string columnId, string columnName)
    {
        ColumnId = columnId;
        ColumnName = columnName;
    }
}
```

**Key Points:**

*   `[AttributeUsage(AttributeTargets.Property)]`: This is crucial. It specifies that this attribute can only be applied to **properties**.
*   `Inherited = false, AllowMultiple = false`: These are good practices. They mean the attribute isn't inherited by subclasses and you can't apply it more than once to the same property.
*   The constructor takes the `columnId` and `columnName` and stores them in public, read-only properties, which our reflection code will access later.


### Step 2: Create a Data Structure for the Results

To return all the required data (property type, column ID, and column name), we need a container. A C# `record` is perfect for this as it's a lightweight, immutable data-transfer object.

```csharp
/// <summary>
/// Holds metadata extracted from a class property via reflection.
/// </summary>
/// <param name="DataType">The .NET type of the property.</param>
/// <param name="ColumnName">The friendly Excel column name from the ExcelInfo attribute.</param>
/// <param name="ColumnId">The Excel column identifier from the ExcelInfo attribute.</param>
public record PropertyMetadata(Type DataType, string? ColumnName, string? ColumnId);
```
*We use nullable strings (`string?`) because a property might not have the `ExcelInfo` attribute, in which case this data would be `null`.*


### Step 3: The Complete Reflection Function and Example

Now we can write the main function. It will inspect a class, look for the `ExcelInfoAttribute` on each property, and build a dictionary mapping the property name to its `PropertyMetadata`.

Here is the full, runnable code:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Models
{
    // The updated data model with attributes
    public class LakeB2B
    {
        // This property does NOT have the attribute, to show how it's handled.
        public int? Counter { get; set; }
        
        [ExcelInfo("B", "Unique Tag")]
        public string? Tag { get; set; }

        [ExcelInfo("C", "Email Address")]
        public string? Email { get; set; }

        [ExcelInfo("D", "Company Name")]
        public string? CompanyName { get; set; }
        
        [ExcelInfo("E", "Website")]
        public string? WebAddress { get; set; }
    }
}

public class AdvancedReflectionExample
{
    /// <summary>
    /// Uses reflection to create a map of property metadata, including custom attributes.
    /// </summary>
    /// <typeparam name="T">The type to inspect.</typeparam>
    /// <returns>A dictionary mapping the C# property name to its collected metadata.</returns>
    public static Dictionary<string, PropertyMetadata> GetPropertyMetadata<T>()
    {
        return typeof(T)
            .GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .ToDictionary(
                // The Key for the dictionary is the property's C# name (e.g., "CompanyName")
                prop => prop.Name,
                // The Value is a new PropertyMetadata object
                prop =>
                {
                    // Use reflection to find our custom attribute on the property
                    var excelAttr = prop.GetCustomAttribute<ExcelInfoAttribute>();

                    // Create the metadata object.
                    // If excelAttr is null, the null-conditional operator (?.) will result in null.
                    return new PropertyMetadata(
                        prop.PropertyType,
                        excelAttr?.ColumnName, 
                        excelAttr?.ColumnId   
                    );
                }
            );
    }

    public static void Main(string[] args)
    {
        var metadataMap = GetPropertyMetadata<Models.LakeB2B>();

        Console.WriteLine($"{"C# Property",-20} | {"Data Type",-12} | {"Excel Column",-15} | {"Excel Header",-20}");
        Console.WriteLine(new string('-', 80));

        foreach (var entry in metadataMap)
        {
            string propertyName = entry.Key;
            PropertyMetadata metadata = entry.Value;

            // Use the null-coalescing operator (??) to provide a default value for printing
            Console.WriteLine(
                $"{propertyName,-20} | {metadata.DataType.Name,-12} | {metadata.ColumnId ?? "N/A",-15} | {metadata.ColumnName ?? "N/A",-20}"
            );
        }
    }
}
```

#### How the Reflection Function Works:

1.  **`GetProperties(...)`**: Gets all public instance properties as `PropertyInfo` objects.
2.  **`.ToDictionary(...)`**: Converts this collection into a dictionary.
3.  **`prop => prop.Name`**: This lambda defines how to get the **key** for each dictionary entry (we use the property's C# name).
4.  **`prop => { ... }`**: This lambda defines how to create the **value** for each entry.
5.  **`prop.GetCustomAttribute<ExcelInfoAttribute>()`**: This is the core of the new logic. It inspects the current property (`prop`) and tries to find an attribute of type `ExcelInfoAttribute`. **It returns the attribute instance if found, or `null` if not.**
6.  **`new PropertyMetadata(...)`**: We create our metadata record.
7.  **`excelAttr?.ColumnName`**: The magic is the **null-conditional operator (`?.`)**. If `excelAttr` is not `null`, it accesses the `ColumnName` property. If `excelAttr` is `null` (because the attribute wasn't on the property), the expression evaluates to `null` without causing a `NullReferenceException`.

#### Expected Output:

```
C# Property          | Data Type    | Excel Column    | Excel Header
--------------------------------------------------------------------------------
Counter              | Nullable`1   | N/A             | N/A
Tag                  | String       | B               | Unique Tag
Email                | String       | C               | Email Address
CompanyName          | String       | D               | Company Name
WebAddress           | String       | E               | Website
```

# Question/Directive

Modify the PropertyMetaData record to be:  
public record PropertyMetadata(Type DataType, Boolean NullCapable, string? ColumnName, string? ColumnId);

where, for nullable properties, the DataType is the underlying data type, otherwise show the non-nullable data type and where NullCapable is true if the column is nullable

# Answer

Excellent. This is a great evolution of the previous task and requires a more sophisticated use of reflection to correctly handle C#'s nullability features.

The key challenge is that nullability works differently for *value types* (like `int`, `Guid`) and *reference types* (like `string`). We will need to handle both cases correctly.

Here is the complete solution.


### Step 1: Update the `PropertyMetadata` Record

First, we'll define the new `record` as you specified.

```csharp
/// <summary>
/// Holds metadata extracted from a class property via reflection.
/// </summary>
/// <param name="DataType">The underlying .NET type of the property (e.g., Int32, String).</param>
/// <param name="NullCapable">True if the property can hold a null value.</param>
/// <param name="ColumnName">The friendly Excel column name from the ExcelInfo attribute.</param>
/// <param name="ColumnId">The Excel column identifier from the ExcelInfo attribute.</param>
public record PropertyMetadata(Type DataType, bool NullCapable, string? ColumnName, string? ColumnId);
```


### Step 2: Update the Data Model for Demonstration

To properly test our function, let's update the `LakeB2B` class to include a variety of nullable and non-nullable types.

```csharp
// The attribute class remains the same as before
[AttributeUsage(AttributeTargets.Property)]
public sealed class ExcelInfoAttribute : Attribute
{
    public string ColumnId { get; }
    public string ColumnName { get; }
    public ExcelInfoAttribute(string columnId, string columnName)
    {
        ColumnId = columnId;
        ColumnName = columnName;
    }
}

namespace Models
{
    public class LakeB2B
    {
        // 1. Nullable value type
        [ExcelInfo("A", "Counter")]
        public int? Counter { get; set; }

        // 2. Nullable reference type
        [ExcelInfo("C", "Email Address")]
        public string? Email { get; set; }

        // 3. Non-nullable value type
        [ExcelInfo("F", "Record ID")]
        public Guid RecordId { get; set; }

        // 4. Non-nullable reference type (requires an initializer in a nullable context)
        [ExcelInfo("D", "Company Name")]
        public string CompanyName { get; set; } = string.Empty;
    }
}
```


### Step 3: The Updated Reflection Function

This is where the new logic lives. We will use two key reflection tools:
1.  **`Nullable.GetUnderlyingType()`**: For nullable *value types* (like `int?`).
2.  **`NullabilityInfoContext`**: For nullable *reference types* (like `string?`). This is the modern, correct way to check nullability information added by the C# compiler.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

public class UltimateReflectionExample
{
    /// <summary>
    /// Uses reflection to get detailed metadata for each property in a class,
    /// correctly identifying underlying types and nullability.
    /// </summary>
    /// <typeparam name="T">The type to inspect.</typeparam>
    /// <returns>A dictionary mapping property names to their full metadata.</returns>
    public static Dictionary<string, PropertyMetadata> GetPropertyMetadata<T>()
    {
        // This context is used to correctly interpret nullable reference types (e.g., string?)
        var nullabilityContext = new NullabilityInfoContext();

        return typeof(T)
            .GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .ToDictionary(
                prop => prop.Name,
                prop =>
                {
                    // --- Determine Data Type and Nullability ---

                    // Check for nullable value types (e.g., int?, Guid?)
                    Type underlyingType = Nullable.GetUnderlyingType(prop.PropertyType);
                    
                    // Use the NullabilityInfoContext for reference types (e.g., string)
                    var nullabilityInfo = nullabilityContext.Create(prop);

                    // Logic:
                    // 1. The final data type is the underlying type if it exists, otherwise the property type.
                    // 2. The property is null-capable if it's a Nullable<T> OR if the compiler's
                    //    nullability info marks it as nullable.
                    Type finalType = underlyingType ?? prop.PropertyType;
                    bool isNullable = (underlyingType != null) || (nullabilityInfo.ReadState == NullabilityState.Nullable);

                    // --- Get Custom Attribute Data ---
                    var excelAttr = prop.GetCustomAttribute<ExcelInfoAttribute>();

                    return new PropertyMetadata(
                        finalType,
                        isNullable,
                        excelAttr?.ColumnName,
                        excelAttr?.ColumnId
                    );
                }
            );
    }

    public static void Main(string[] args)
    {
        var metadataMap = GetPropertyMetadata<Models.LakeB2B>();

        Console.WriteLine($"{"C# Property",-15} | {"Data Type",-10} | {"Nullable?",-10} | {"Excel ID",-10} | {"Excel Header",-20}");
        Console.WriteLine(new string('-', 80));

        foreach (var entry in metadataMap)
        {
            string propertyName = entry.Key;
            PropertyMetadata metadata = entry.Value;

            Console.WriteLine(
                $"{propertyName,-15} | {metadata.DataType.Name,-10} | {metadata.NullCapable,-10} | {metadata.ColumnId ?? "N/A",-10} | {metadata.ColumnName ?? "N/A",-20}"
            );
        }
    }
}
```

### How the New Logic Works

Inside the `ToDictionary` lambda, for each property (`prop`):

1.  **`Nullable.GetUnderlyingType(prop.PropertyType)`**:
    *   If `prop` is `int?` (which is `Nullable<int>`), this returns `typeof(int)`.
    *   If `prop` is `string` or `int`, this returns `null`.

2.  **`new NullabilityInfoContext().Create(prop)`**:
    *   This creates a `NullabilityInfo` object that reads the special metadata the compiler emits for nullable reference types.
    *   `nullabilityInfo.ReadState` will be `NullabilityState.Nullable` for `string?` and `NullabilityState.NotNull` for `string`.

3.  **`Type finalType = underlyingType ?? prop.PropertyType;`**:
    *   The null-coalescing operator `??` provides a clean way to get the base type.
    *   For `int?`, `underlyingType` is `int`, so `finalType` becomes `int`.
    *   For `string` or `Guid`, `underlyingType` is `null`, so `finalType` becomes the original property type (`string` or `Guid`).

4.  **`bool isNullable = (underlyingType != null) || (nullabilityInfo.ReadState == NullabilityState.Nullable);`**:
    *   This boolean expression covers all cases:
        *   **For `int?`**: `underlyingType` is not null, so the expression is `true`. **Correct.**
        *   **For `Guid`**: `underlyingType` is null, and `ReadState` is `NotNull`. The expression is `false`. **Correct.**
        *   **For `string?`**: `underlyingType` is null, but `ReadState` is `Nullable`. The expression is `true`. **Correct.**
        *   **For `string`**: `underlyingType` is null, and `ReadState` is `NotNull`. The expression is `false`. **Correct.**

### Expected Output

The program will now produce this detailed and accurate output:

```
C# Property     | Data Type  | Nullable?  | Excel ID   | Excel Header
--------------------------------------------------------------------------------
Counter         | Int32      | True       | A          | Counter
Email           | String     | True       | C          | Email Address
RecordId        | Guid       | False      | F          | Record ID
CompanyName     | String     | False      | D          | Company Name
```

# Question/Directive

using C# 12 and ClosedXML, write a function that reads the column names in an Excel spread and returns a dictionary of column names and Excel data types:

# Answer

**Analyzing the Core Task**

I'm focusing now on the essence of the task: extracting column names from an Excel file using C# and ClosedXML.  I'm breaking down the objective, keeping the language and chosen library in mind. This is the first step toward crafting a precise solution.


**Mapping the Approach**

I've been mapping the approach. Focusing on the necessary ClosedXML methods, I will read the file and get the active worksheet.  I intend to iterate through the first row to collect the header names. I plan to use the `XLDataType` enum to identify the column data types based on the content of the cells below the headers.


**Implementing the Function**

I'm now implementing the function, focusing on handling file paths and sheet names. The goal is to make it robust, able to read from any valid Excel file using ClosedXML. I'm prioritizing error handling and ensuring the function can gracefully manage different file formats.


**Structuring the Logic**

I'm now structuring the logic of the `GetExcelColumnHeadersAndTypes` function. I'll open the workbook and get the appropriate worksheet, handling potential `null` values gracefully. I will iterate through the first row to capture the column names, and then, using ClosedXML, ascertain the Excel data type of the cells directly below the header. The code should be concise and well-commented.


**Crafting the Core Logic**

I'm now implementing the core logic of iterating through the header row and then examining the cell directly below each header to determine the column data type, using `XLDataType`. I'll handle potential exceptions and empty worksheets gracefully. I'm focusing on ensuring the code is readable and maintainable. I'll need to handle the case of an empty sheet, and gracefully return an empty dictionary.


**Defining the Core Structure**

I'm solidifying the logic, especially the crucial part of determining the data type for each column. The main function will take the file path and optional sheet name, open the workbook, and then iterate through the header row and the first data row below. I'm focusing on ClosedXML methods for sheet and cell access to make this function robust.


**Crafting the Implementation**

I'm now integrating the logic into the `GetExcelColumnHeadersAndTypes` function. I've considered handling the situation when the sheet is empty to gracefully return an empty dictionary. The function's aim is to parse the header row, determine the data type of the column below it, and populate the dictionary accordingly. I also aim to include a helper function to build a sample Excel file for the sake of demo code.


**Refining the Logic**

I'm now refining the implementation of the `GetExcelColumnHeadersAndTypes` function, incorporating comments for clarity. I've focused on graceful handling of different edge cases. I'll integrate the demo code, including file creation, in the `Main` method.  I'm also focusing on error handling with `try-catch` blocks and the appropriate NuGet package.


**Refining the Approach**

I'm now iterating through the steps, working to refine the logic for determining the data types. I'll need to account for empty cells and sheets, and ensure the code is clear. I'm focusing on ClosedXML's API to ensure the code is robust. The main method will also be adapted to demonstrate the code's functionality, including error handling.

# Question/Directive

modify GetExcelColumnHeadersAndTypes to also return the column address (ie, "A", "B", "AA", etc)

# Answer

Excellent. Modifying the function to include the column address is a very practical enhancement. We'll achieve this by changing the return value from a simple `XLDataType` to a more structured object that can hold both the data type and the column address. A C# `record` is perfect for this.

Here is the updated, complete solution.


### Step 1: Define a Record to Hold the Column Information

Instead of returning just a data type, we need a structure to hold the type *and* the address. A `record` is the ideal, modern C# way to create this lightweight data-transfer object.

```csharp
/// <summary>
/// Holds metadata about a specific column in an Excel sheet.
/// </summary>
/// <param name="DataType">The inferred data type of the column's data.</param>
/// <param name="Address">The column letter identifier (e.g., "A", "B", "AA").</param>
public record ExcelColumnInfo(XLDataType DataType, string Address);
```

### Step 2: The Modified C# Code

We'll update the `GetExcelColumnHeadersAndTypes` function (renaming it to `GetExcelColumnInfo` for clarity) to return a `Dictionary<string, ExcelColumnInfo>`. The logic to get the column address from a `ClosedXML` cell is straightforward.

```csharp
using ClosedXML.Excel;
using System.IO;

// --- New Record Definition ---
/// <summary>
/// Holds metadata about a specific column in an Excel sheet.
/// </summary>
/// <param name="DataType">The inferred data type of the column's data.</param>
/// <param name="Address">The column letter identifier (e.g., "A", "B", "AA").</param>
public record ExcelColumnInfo(XLDataType DataType, string Address);


// --- Main Program Logic (C# 12 Top-level statements) ---
Console.WriteLine("--- ClosedXML Column Info Reader ---");

string filePath = "SalesData.xlsx";

// 1. Create a sample file (same as before)
try
{
    CreateSampleExcelFile(filePath);
    Console.WriteLine($"Successfully created sample file: {filePath}");
}
catch (Exception ex)
{
    Console.WriteLine($"Error creating sample file: {ex.Message}");
    return;
}

// 2. Read the full column info from the file
try
{
    // Call the updated function
    Dictionary<string, ExcelColumnInfo> columnMap = GetExcelColumnInfo(filePath, "SalesData");

    Console.WriteLine("\nDiscovered Columns and Their Metadata:");
    Console.WriteLine(new string('-', 60));
    Console.WriteLine($"{"Column Name",-20} | {"Address",-10} | {"Inferred Data Type"}");
    Console.WriteLine(new string('-', 60));

    foreach (var entry in columnMap)
    {
        Console.WriteLine($"{entry.Key,-20} | {entry.Value.Address,-10} | {entry.Value.DataType}");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"\nAn error occurred while reading the Excel file: {ex.Message}");
}
finally
{
    // Clean up
    if (File.Exists(filePath))
    {
        File.Delete(filePath);
    }
}


/// <summary>
/// Reads the headers of an Excel sheet and returns a map of column names to their metadata,
/// including the column address and inferred data type.
/// </summary>
/// <param name="filePath">The full path to the Excel file.</param>
/// <param name="sheetName">The name of the worksheet to read. If null, the first sheet is used.</param>
/// <returns>A dictionary mapping column names to an ExcelColumnInfo object.</returns>
public static Dictionary<string, ExcelColumnInfo> GetExcelColumnInfo(string filePath, string? sheetName = null)
{
    if (!File.Exists(filePath))
    {
        throw new FileNotFoundException("The specified Excel file was not found.", filePath);
    }

    using var workbook = new XLWorkbook(filePath);

    var worksheet = string.IsNullOrEmpty(sheetName)
        ? workbook.Worksheets.FirstOrDefault()
        : workbook.Worksheet(sheetName);

    if (worksheet == null || worksheet.LastCellUsed() == null)
    {
        throw new InvalidOperationException("The worksheet is empty or could not be found.");
    }
    
    var headerRow = worksheet.FirstRowUsed();
    if (headerRow == null)
    {
        return []; // Return an empty dictionary
    }

    // The dictionary now stores our new record type.
    var columnMap = new Dictionary<string, ExcelColumnInfo>();

    foreach (var headerCell in headerRow.CellsUsed())
    {
        string columnName = headerCell.GetString();
        
        // *** GET THE COLUMN ADDRESS HERE ***
        // The Address property of a cell has a ColumnLetter property.
        string columnAddress = headerCell.Address.ColumnLetter;
        
        // Infer the data type from the cell below the header.
        var firstDataCell = headerCell.CellBelow();
        XLDataType columnType = firstDataCell.DataType;

        // Create the new info object and add it to the map.
        var info = new ExcelColumnInfo(columnType, columnAddress);
        columnMap.TryAdd(columnName, info);
    }

    return columnMap;
}

/// <summary>
/// Helper function to create a sample Excel file (unchanged).
/// </summary>
public static void CreateSampleExcelFile(string filePath)
{
    using var workbook = new XLWorkbook();
    var worksheet = workbook.Worksheets.Add("SalesData");
    worksheet.Cell("A1").Value = "OrderID";
    worksheet.Cell("B1").Value = "OrderDate";
    worksheet.Cell("C1").Value = "CustomerName";
    worksheet.Cell("D1").Value = "Quantity";
    worksheet.Cell("E1").Value = "IsShipped";
    worksheet.Cell("F1").Value = "Notes";
    worksheet.Cell("A2").Value = 1001;
    worksheet.Cell("B2").Value = new DateTime(2023, 10, 26);
    worksheet.Cell("C2").Value = "John Smith";
    worksheet.Cell("D2").Value = 5;
    worksheet.Cell("E2").Value = true;
    worksheet.Columns().AdjustToContents();
    workbook.SaveAs(filePath);
}
```

### Key Changes and How They Work

1.  **`public record ExcelColumnInfo(...)`**: We introduced this `record` to act as a clean data container for our results. It's more descriptive and type-safe than using a `Tuple`.

2.  **Function Signature Change**: The return type of the function was changed to `Dictionary<string, ExcelColumnInfo>` to reflect the new, richer data being returned. The function was also renamed to `GetExcelColumnInfo` to better describe its purpose.

3.  **Getting the Column Address**: The core of the new logic is this line:
    ```csharp
    string columnAddress = headerCell.Address.ColumnLetter;
    ```
    *   Every `IXLCell` object (like our `headerCell`) has an `Address` property.
    *   This `Address` property is an `IXLAddress` object, which contains detailed location information.
    *   The `ColumnLetter` property of the `IXLAddress` gives us exactly what we need: the string representation of the column ("A", "B", ..., "Z", "AA", etc.).

4.  **Populating the Dictionary**: Instead of adding the `XLDataType` directly, we now create an instance of our new `record` and add that to the dictionary:
    ```csharp
    var info = new ExcelColumnInfo(columnType, columnAddress);
    columnMap.TryAdd(columnName, info);
    ```

### Expected Output

The program's output will now include the column address, formatted nicely:

```
--- ClosedXML Column Info Reader ---
Successfully created sample file: SalesData.xlsx

Discovered Columns and Their Metadata:
------------------------------------------------------------
Column Name          | Address    | Inferred Data Type
------------------------------------------------------------
OrderID              | A          | Number
OrderDate            | B          | DateTime
CustomerName         | C          | Text
Quantity             | D          | Number
IsShipped            | E          | Boolean
Notes                | F          | Blank
```


## Question/Directive

Take the columnMap dictionary that GetExcelColumnInfo produced:  

```
Dictionary<string, ExcelColumnInfo> columnMap
```
and create a c# data model class that looks like this:

```
public class LakeB2B
{
    [ExcelInfo("A", "Counter")]
    public int? Counter { get; set; }

    [ExcelInfo("B", "Tag")]
    public string? Tag { get; set; }

    [ExcelInfo("C", "Email")] 
    public string? Email { get; set; }

    [ExcelInfo("D", "Company Name")]
    public string? CompanyName { get; set; }
```

## Answer 

This is a fantastic and highly practical request that combines everything we've built. We will write a C# code generator!

The process will be:
1.  Define a function that takes the `Dictionary<string, ExcelColumnInfo>` and generates the C# class as a string.
2.  Create helper methods to format Excel column names into valid C# property names and to map Excel data types to C# data types.
3.  Write the final string to a `.cs` file.

For maximum utility, the generated file will also include the `ExcelInfoAttribute` class definition, making it a self-contained, compilable file.


### The Complete C# Code Generation Program

Here is the full program. It uses the `GetExcelColumnInfo` function from our previous step and then calls a new `GenerateCSharpClassFile` function to complete the task.

```csharp
using ClosedXML.Excel;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

// --- Data Structures from Previous Steps ---

/// <summary>
/// Holds metadata about a specific column in an Excel sheet.
/// </summary>
public record ExcelColumnInfo(XLDataType DataType, string Address);

// --- Main Program Logic (C# 12 Top-level statements) ---

Console.WriteLine("--- C# Model Generator from Excel ---");

string excelFilePath = "SalesData.xlsx";
string outputModelPath = "LakeB2B.cs";

// 1. Create a sample Excel file to act as our source schema.
CreateSampleExcelFile(excelFilePath);
Console.WriteLine($"Step 1: Successfully created sample Excel file: {excelFilePath}");

// 2. Read the schema from the Excel file into our dictionary.
Dictionary<string, ExcelColumnInfo> columnMap = GetExcelColumnInfo(excelFilePath);
Console.WriteLine("Step 2: Successfully read column schema from Excel.");

// 3. Generate the C# class file from the schema.
try
{
    GenerateCSharpClassFile(columnMap, "LakeB2B", outputModelPath);
    Console.WriteLine($"Step 3: Success! Generated C# model file at: {Path.GetFullPath(outputModelPath)}");
    Console.WriteLine("\n--- Generated File Content ---");
    Console.WriteLine(File.ReadAllText(outputModelPath));
    Console.WriteLine("--------------------------");
}
catch (Exception ex)
{
    Console.WriteLine($"An error occurred during code generation: {ex.Message}");
}
finally
{
    // Clean up the created files.
    if (File.Exists(excelFilePath)) File.Delete(excelFilePath);
    if (File.Exists(outputModelPath)) File.Delete(outputModelPath);
}


//================================================================//
// THE NEW CODE GENERATION LOGIC
//================================================================//

/// <summary>
/// Generates a C# class file from a map of Excel column information.
/// </summary>
/// <param name="columnMap">The dictionary mapping column names to their metadata.</param>
/// <param name="className">The name for the generated C# class.</param>
/// <param name="outputFilePath">The path where the .cs file will be saved.</param>
public static void GenerateCSharpClassFile(Dictionary<string, ExcelColumnInfo> columnMap, string className, string outputFilePath)
{
    // StringBuilder is highly efficient for building strings piece by piece.
    var sb = new StringBuilder();

    // --- File Header ---
    sb.AppendLine("using System;");
    sb.AppendLine();
    sb.AppendLine("namespace Models");
    sb.AppendLine("{");

    // --- Attribute Definition (to make the file self-contained) ---
    sb.AppendLine("    /// <summary>");
    sb.AppendLine("    /// Specifies the Excel column details for a property.");
    sb.AppendLine("    /// </summary>");
    sb.AppendLine("    [AttributeUsage(AttributeTargets.Property)]");
    sb.AppendLine("    public sealed class ExcelInfoAttribute : Attribute");
    sb.AppendLine("    {");
    sb.AppendLine("        public string ColumnId { get; }");
    sb.AppendLine("        public string ColumnName { get; }");
    sb.AppendLine("        public ExcelInfoAttribute(string columnId, string columnName) { ColumnId = columnId; ColumnName = columnName; }");
    sb.AppendLine("    }");
    sb.AppendLine();

    // --- Class Definition ---
    sb.AppendLine($"    public class {className}");
    sb.AppendLine("    {");

    // --- Properties ---
    foreach (var entry in columnMap)
    {
        string excelColumnName = entry.Key;
        ExcelColumnInfo info = entry.Value;

        string propertyName = FormatToPropertyName(excelColumnName);
        string csharpType = MapExcelTypeToCSharpType(info.DataType);

        // [ExcelInfo("D", "Company Name")]
        sb.AppendLine($"        [ExcelInfo(\"{info.Address}\", \"{excelColumnName}\")]");
        // public string? CompanyName { get; set; }
        sb.AppendLine($"        public {csharpType} {propertyName} {{ get; set; }}");
        sb.AppendLine(); // Add a blank line for readability
    }

    // --- Closing Braces ---
    sb.AppendLine("    }");
    sb.AppendLine("}");

    // Write the final string to the specified file.
    File.WriteAllText(outputFilePath, sb.ToString());
}

/// <summary>
/// Formats an Excel column name into a valid C# property name.
/// (e.g., "Company Name" -> "CompanyName", "Order-ID" -> "OrderID").
/// </summary>
public static string FormatToPropertyName(string excelColumnName)
{
    if (string.IsNullOrWhiteSpace(excelColumnName))
        return "UnnamedProperty";

    // Remove invalid characters using a regular expression.
    // This keeps letters, numbers, and underscores.
    string sanitized = Regex.Replace(excelColumnName, @"[^a-zA-Z0-9_]", "");
    
    // Ensure the property name doesn't start with a number.
    if (char.IsDigit(sanitized[0]))
    {
        sanitized = "_" + sanitized;
    }
    
    return sanitized;
}

/// <summary>
/// Maps a ClosedXML XLDataType to a C# type string.
/// Note: All types are made nullable, as any cell in Excel can be empty.
/// </summary>
public static string MapExcelTypeToCSharpType(XLDataType excelType)
{
    // C# 8.0 switch expression provides a very clean syntax for this mapping.
    return excelType switch
    {
        XLDataType.Number   => "double?",  // double is the safest type for Excel numbers.
        XLDataType.DateTime => "DateTime?",
        XLDataType.Boolean  => "bool?",
        XLDataType.TimeSpan => "TimeSpan?",
        XLDataType.Text     => "string?",
        XLDataType.Blank    => "string?",  // Treat blank columns as string properties.
        _                   => "object?"   // Fallback for unknown types.
    };
}


//================================================================//
// HELPER FUNCTIONS FROM PREVIOUS STEPS (slightly modified)
//================================================================//
public static Dictionary<string, ExcelColumnInfo> GetExcelColumnInfo(string filePath, string? sheetName = null)
{
    using var workbook = new XLWorkbook(filePath);
    var worksheet = string.IsNullOrEmpty(sheetName) ? workbook.Worksheets.First() : workbook.Worksheet(sheetName);
    var headerRow = worksheet.FirstRowUsed();
    if (headerRow == null) return [];

    var columnMap = new Dictionary<string, ExcelColumnInfo>();
    foreach (var headerCell in headerRow.CellsUsed())
    {
        string columnName = headerCell.GetString();
        string columnAddress = headerCell.Address.ColumnLetter;
        XLDataType columnType = headerCell.CellBelow().DataType;
        var info = new ExcelColumnInfo(columnType, columnAddress);
        columnMap.TryAdd(columnName, info);
    }
    return columnMap;
}

public static void CreateSampleExcelFile(string filePath)
{
    using var workbook = new XLWorkbook();
    var worksheet = workbook.Worksheets.Add("SalesData");
    worksheet.Cell("A1").Value = "Order ID";
    worksheet.Cell("B1").Value = "Order Date";
    worksheet.Cell("C1").Value = "Customer Name";
    worksheet.Cell("D1").Value = "Is Shipped";
    worksheet.Cell("A2").Value = 1001;
    worksheet.Cell("B2").Value = new DateTime(2023, 10, 26);
    worksheet.Cell("C2").Value = "John Smith";
    worksheet.Cell("D2").Value = true;
    workbook.SaveAs(filePath);
}
```

### How the Magic Happens

1.  **`GenerateCSharpClassFile`**: This is the orchestrator. It uses a `StringBuilder` which is the correct tool for building strings in loops, as it avoids creating many intermediate, temporary string objects.
2.  **`FormatToPropertyName`**: This helper is crucial for ensuring the output is valid C#. It takes a string like `"Order ID"` and uses a Regular Expression (`Regex`) to strip out any character that isn't a letter, number, or underscore, resulting in `"OrderID"`. It also prefixes with an underscore if the name happens to start with a number.
3.  **`MapExcelTypeToCSharpType`**: This function is the "translator." It uses a modern C# 8 **switch expression** for a clean, readable way to map the `XLDataType` enum from ClosedXML to the appropriate nullable C# type string (e.g., `XLDataType.Number` becomes `"double?"`). We make all types nullable (`?`) because any cell in Excel can be empty, which translates naturally to `null` in C#.
4.  **String Building**: Inside the main loop, the code constructs the two lines for each property—the `[ExcelInfo(...)]` attribute and the `public type Name { get; set; }` declaration—and appends them to the `StringBuilder` with proper indentation.
5.  **File Output**: Finally, `File.WriteAllText()` takes the completed string from the `StringBuilder` and writes it to the `LakeB2B.cs` file.

### Final Generated File (`LakeB2B.cs`)

When you run the program, it will create a file named `LakeB2B.cs` with the following beautiful, clean, and ready-to-use content:

```csharp
using System;

namespace Models
{
    /// <summary>
    /// Specifies the Excel column details for a property.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class ExcelInfoAttribute : Attribute
    {
        public string ColumnId { get; }
        public string ColumnName { get; }
        public ExcelInfoAttribute(string columnId, string columnName) { ColumnId = columnId; ColumnName = columnName; }
    }

    public class LakeB2B
    {
        [ExcelInfo("A", "Order ID")]
        public double? OrderID { get; set; }

        [ExcelInfo("B", "Order Date")]
        public DateTime? OrderDate { get; set; }

        [ExcelInfo("C", "Customer Name")]
        public string? CustomerName { get; set; }

        [ExcelInfo("D", "Is Shipped")]
        public bool? IsShipped { get; set; }

    }
}
```

# Question/Directive

Create an SQL `Insert Into` statement from the `columnMap` value created with `GetExcelColumnInfo()`.

# Answer 

Absolutely. This is a very common requirement: taking a schema (in this case, from Excel columns) and generating a parameterized SQL `INSERT` statement. This is crucial for safely inserting data into a database.

We will create a function `GenerateSqlInsertStatement` that takes the `columnMap` and a table name, and then uses the logic from our previous step to generate valid parameter names.


### The Complete C# Program

This program includes the necessary helpers from our previous work to make it a fully runnable and testable example. The new core logic is in the `GenerateSqlInsertStatement` function.

```csharp
using ClosedXML.Excel;
using System.IO;
using System.Text.RegularExpressions;

// --- Data Structures & Helpers from Previous Steps ---

public record ExcelColumnInfo(XLDataType DataType, string Address);

// --- Main Program Logic (C# 12 Top-level statements) ---

Console.WriteLine("--- SQL INSERT Statement Generator ---");

string excelFilePath = "SalesDataForSql.xlsx";
string tableName = "LakeB2B";

// 1. Create a sample Excel file.
CreateSampleExcelFile(excelFilePath);
Console.WriteLine($"Step 1: Successfully created sample Excel file: {excelFilePath}");

// 2. Read the schema from the Excel file into our dictionary.
Dictionary<string, ExcelColumnInfo> columnMap = GetExcelColumnInfo(excelFilePath);
Console.WriteLine("Step 2: Successfully read column schema from Excel.");

// 3. Generate the SQL INSERT statement.
string insertQuery = GenerateSqlInsertStatement(tableName, columnMap);

Console.WriteLine($"\nStep 3: Generated SQL INSERT statement for table '{tableName}':");
Console.WriteLine("------------------------------------------------------------------");
Console.WriteLine(insertQuery);
Console.WriteLine("------------------------------------------------------------------");

// Clean up the created file.
if (File.Exists(excelFilePath))
{
    File.Delete(excelFilePath);
}


//================================================================//
// THE NEW SQL GENERATION FUNCTION
//================================================================//

/// <summary>
/// Generates a parameterized SQL INSERT statement from a map of column names.
/// </summary>
/// <param name="tableName">The name of the database table.</param>
/// <param name="columnMap">A dictionary where keys are the column names.</param>
/// <returns>A formatted, parameterized SQL INSERT statement string.</returns>
public static string GenerateSqlInsertStatement(string tableName, Dictionary<string, ExcelColumnInfo> columnMap)
{
    // Handle edge cases where the map is empty or null.
    if (columnMap == null || columnMap.Count == 0)
    {
        return $"-- No columns provided to generate INSERT statement for table '{tableName}'.";
    }

    // Use LINQ to create the two lists needed for the query.
    
    // 1. Create the list of column names, wrapped in square brackets
    //    e.g., "[Company Name]"
    var columnNames = columnMap.Keys.Select(name => $"[{name}]");
    
    // 2. Create the list of parameter names, formatted and prefixed with @
    //    e.g., "@CompanyName"
    var parameterNames = columnMap.Keys.Select(name => $"@{FormatToPropertyName(name)}");

    // Define the indentation for clean formatting.
    const string indent = "                    ";

    // Join the collections into comma-separated strings with proper newlines and indentation.
    string columnList = string.Join($",\n{indent}", columnNames);
    string parameterList = string.Join($",\n{indent}", parameterNames);

    // Use a C# verbatim interpolated string ($@) to build the final query.
    string insertQuery = $@"
                INSERT INTO [dbo].[{tableName}] (
                    {columnList}
                )
                VALUES (
                    {parameterList}
                )";

    return insertQuery;
}

/// <summary>
/// Formats a string into a valid C# property name, which is also a valid SQL parameter name (without the @).
/// (e.g., "Company Name" -> "CompanyName", "Order-ID" -> "OrderID").
/// </summary>
public static string FormatToPropertyName(string inputName)
{
    if (string.IsNullOrWhiteSpace(inputName))
        return "UnnamedParameter";

    // Removes any character that is not a letter, number, or underscore.
    string sanitized = Regex.Replace(inputName, @"[^a-zA-Z0-9_]", "");

    // Ensure it doesn't start with a number.
    if (char.IsDigit(sanitized[0]))
    {
        sanitized = "_" + sanitized;
    }

    return sanitized;
}


//================================================================//
// HELPER FUNCTIONS FROM PREVIOUS STEPS (Unchanged)
//================================================================//
public static Dictionary<string, ExcelColumnInfo> GetExcelColumnInfo(string filePath, string? sheetName = null)
{
    using var workbook = new XLWorkbook(filePath);
    var worksheet = string.IsNullOrEmpty(sheetName) ? workbook.Worksheets.First() : workbook.Worksheet(sheetName);
    var headerRow = worksheet.FirstRowUsed();
    if (headerRow == null) return [];

    var columnMap = new Dictionary<string, ExcelColumnInfo>();
    foreach (var headerCell in headerRow.CellsUsed())
    {
        string columnName = headerCell.GetString();
        string columnAddress = headerCell.Address.ColumnLetter;
        XLDataType columnType = headerCell.CellBelow().DataType;
        var info = new ExcelColumnInfo(columnType, columnAddress);
        columnMap.TryAdd(columnName, info);
    }
    return columnMap;
}

public static void CreateSampleExcelFile(string filePath)
{
    using var workbook = new XLWorkbook();
    var worksheet = workbook.Worksheets.Add("SalesData");
    worksheet.Cell("A1").Value = "Counter";
    worksheet.Cell("B1").Value = "Tag";
    worksheet.Cell("C1").Value = "Email";
    worksheet.Cell("D1").Value = "Company Name";
    worksheet.Cell("E1").Value = "Web Address";
    worksheet.Cell("A2").Value = 1;
    worksheet.Cell("B2").Value = "TagA";
    worksheet.Cell("C2").Value = "test@example.com";
    worksheet.Cell("D2").Value = "ACME Corp";
    worksheet.Cell("E2").Value = "acme.com";
    workbook.SaveAs(filePath);
}
```

### How It Works

1.  **Input**: The function takes the `tableName` and the `columnMap` dictionary. It only needs the `Keys` from the dictionary (the Excel column names).

2.  **LINQ `Select`**: The power of LINQ is used to transform the collection of column name strings into the two required lists:
    *   `columnMap.Keys.Select(name => $"[{name}]")`: This iterates through each column name (e.g., "Company Name") and wraps it in square brackets `[...]` to create a list of valid SQL column identifiers.
    *   `columnMap.Keys.Select(name => $"@{FormatToPropertyName(name)}")`: This iterates through each name, first sanitizes it using our existing `FormatToPropertyName` helper (e.g., "Company Name" becomes "CompanyName"), and then prepends an `@` to create a valid SQL parameter name (e.g., `@CompanyName`).

3.  **`string.Join`**: This method is used to assemble the lists into single strings. The separator `",\n                    "` is cleverly designed to place a comma, a newline, and the correct indentation *between* each item, ensuring perfect formatting.

4.  **Verbatim Interpolated String (`$@"..."`)**: This C# feature is the final piece. It allows us to create a multi-line string that preserves whitespace (the `@` part) and to embed our generated `columnList` and `parameterList` strings directly into the template (the `$` part).

### Expected Output

When you run this program, it will produce the following perfectly formatted and secure SQL `INSERT` statement:

```
--- SQL INSERT Statement Generator ---
Step 1: Successfully created sample Excel file: SalesDataForSql.xlsx
Step 2: Successfully read column schema from Excel.

Step 3: Generated SQL INSERT statement for table 'LakeB2B':
------------------------------------------------------------------

                INSERT INTO [dbo].[LakeB2B] (
                    [Counter],
                    [Tag],
                    [Email],
                    [Company Name],
                    [Web Address]
                )
                VALUES (
                    @Counter,
                    @Tag,
                    @Email,
                    @CompanyName,
                    @WebAddress
                )
------------------------------------------------------------------
```