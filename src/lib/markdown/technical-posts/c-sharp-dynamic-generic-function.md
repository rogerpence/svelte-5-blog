---
title: c-sharp-dynamic-generic-function
description: c-sharp-dynamic-generic-function
date_created: '2025-10-20T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - csharp
---

To dynamically provide the type for a generic function like `GenerateSqlInsertStatement<T>`, you need to use reflection because C# generics require the type parameter at compile time. With reflection, you can call the generic method and specify the type at runtime.


```cs
Type dynamicType = typeof(Models.LakeB2B); // or get this type dynamically
var method = typeof(SqlServerOps).GetMethod(nameof(GenerateSqlInsertStatement), BindingFlags.Public | BindingFlags.Static);
var genericMethod = method.MakeGenericMethod(dynamicType);
string insertQuery = (string)genericMethod.Invoke(null, new object[] { tableName });

```

**Explanation:**
- `typeof(Models.LakeB2B)`: Replace this with any logic to get your type at runtime.
- `GetMethod`: Gets the method info for `GenerateSqlInsertStatement`.
- `MakeGenericMethod`: Specifies the type parameter at runtime.
- `Invoke`: Calls the method, passing in the arguments.

This approach works for any type you determine at runtime.



I have a namespace named 'Models' and it has a class named LakeB2B in it (it also has several other model classes).

Given this string, 'lakeb2b' (named 'modelName'), how can I get the typeof Models.LakeB2B to be able to do this: Type dynamicType = typeof(Models.LakeB2B);


You can get the `Type` for a class in the `Models` namespace using the string name by:

1. Capitalizing the first letter (to match the class name).
2. Using `Type.GetType` with the fully qualified name, or searching the assembly if needed.

Here’s a robust way to do it:


```cs
string modelName = "lakeb2b"; // your input
string className = char.ToUpper(modelName[0]) + modelName.Substring(1); // "LakeB2B"
string fullTypeName = $"Models.{className}";

// Try to get the type directly (works if Models is in the same assembly and not in a nested namespace)
Type dynamicType = Type.GetType(fullTypeName);

// If null, search all loaded assemblies (handles most project structures)
if (dynamicType == null)
{
    dynamicType = AppDomain.CurrentDomain.GetAssemblies()
        .SelectMany(a => a.GetTypes())
        .FirstOrDefault(t => t.FullName == fullTypeName);
}

// Now you can use dynamicType
if (dynamicType == null)
{
    throw new InvalidOperationException($"Type '{fullTypeName}' not found.");
}

```

**Summary:**  
- This code converts `"lakeb2b"` to `"LakeB2B"`, builds the full type name, and searches for the type in all loaded assemblies.
- `dynamicType` will be the `Type` object for `Models.LakeB2B` if it exists.

You can now use `dynamicType` for reflection or to invoke generic methods dynamically as shown in the previous answer.