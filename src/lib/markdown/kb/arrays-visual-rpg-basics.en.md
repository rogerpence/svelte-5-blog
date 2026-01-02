---
title: 'AVR for .NET arrays: the basics'
description: This article explains how to use arrays in ASNA Visual RPG. It looks at fixed-sized arrays. Both single- and multi-dimensional arrays are covered.
tags:
  - visual-rpg
date_published: '2024-01-09T11:10:39.000Z'
date_updated: '2024-01-09T17:36:05.000Z'
date_created: '2024-01-09T17:36:05.000Z'
pinned: false
---

Storing data in arrays is a key way to implement effective and efficient algorithms. This article series takes a look at the different ways you can use arrays in AVR for .NET.  This article explains AVR for .NET array basics.

AVR for .NET substantially ramps up array capabilities over what AVR Classic offered. Briefly, the changes include:

*   All arrays in AVR for .NET are zero based (ie, the first element is always the zeroth element)
*   Arrays can be declared globally in a class or locally to a function or subroutine
*   You don’t have to specify the number of elements in an array when you declare it
*   Arrays can be passed as arguments to subroutines and functions
*   Arrays can be returned as a function result
*   Single-dimensioned array contents can be specified when you declare the array
*   Arrays can be ragged
*   Arrays are objects and have methods and properties
*   Array contents can be traversed with the For/Each construct

All arrays in AVR for .NET are zero-based. The first element _always_ occupies the zeroth position. This is very much unlike arrays in AVR Classic; they are one-based.

#### Declaring fixed-sized arrays

The following declaration declares a four-element array of strings:

```
DclArray myArr Type(*String) Dim(4)
```

You would populate this array like this:

```
myArr[0] = "Neil"
myArr[1] = "Young"
myArr[2] = "Van"
myArr[3] = "Morrison"
```

Notice that the first element occupies the zeroth position. In AVR for .NET, you can use either parentheses () or brackets \[\] to indicate the array subscript. However, although either is allowed, the brackets are the preferred method (so as to more quickly denote an array subscript over a method call).

Except for being zero-based, declaring fixed-sized arrays in AVR for .NET provides arrays that are very similar to the arrays that AVR Classic offered. However, .NET also has a dynamically sized array (known as a `ranked array`). AVR for .NET’s ranked array is covered in part two of this series. You see, there another reason to always use brackets \[\] to indicate array subscripts.

#### AVR avoids VB.NET’s array mistake

AVR avoids the confusing mistake VB.NET made with declaring arrays. For example, the following line is a VB.NET array declaration:

```
Dim x(4) as Integer
```

This VB declaration creates an array with, not four, but five(!) array elements. In VB.NET, the subscript value provided declares the array’s upper bounds, not the number of elements in the array.

The corresponding code in AVR for .NET would be:

```
DclArray x Type(*Integer4) Dim(5)
```

In AVR for .NET (as in C#), array declarations declare the number of elements in the array, not the array’s upper bounds.

#### Declaring multi-dimensioned arrays of known size

To declare arrays of fixed size with multiple dimensions, you specify the dimensions in the `Dim()` keyword. For example, this code

```
DclArray MyArr Type(*Integer4) Dim(4, 2)
```

declares an array with four rows and two columns. Figure 3 shows how this array looks in the QuickWatch window.

![Visual Studio debugger showing a multi-dimensional fixed-size array](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/array-basics-01.png)  

Figure 1a. Visual Studio debugger showing a multi-dimensional fixed-size array.

Use this code to assign a value to row 2, column 1:

```
MyArr[2,1] = 77  
```

![Visual Studio debugger showing a value having been assigned to row 2, column 1](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/array-basics-02.png)

Figure 1b. Visual Studio debugger showing a value having been assigned to row 2, column 1.

You can have more than two dimensions, if you need. For example, to model a Rubik’s cube, you could use an array declared like this:

```
DclArray RubiksCube Type(*Integer4) Dim(3,3,3)
```

There is no practical limit to the number of array dimensions you can declare, but anything more than three dimensions should only be attempted by certified lunatics.

In Part 2, we’ll examine AVR for .NET’s dynamically-sized ranked arrays.