---
title: 'AVR for .NET arrays: methods and properties'
description: This article explains the many methods and properties that you can use with Visual RPG and its arrays
tags:
  - visual-rpg
date_published: '2024-01-09T11:54:01.000Z'
date_updated: '2024-01-09T17:54:27.000Z'
date_created: '2024-01-09T17:54:27.000Z'
pinned: false
---

Under the covers, arrays in AVR are instances of .NET’s [System.Array class.](https://msdn.microsoft.com/en-us/library/system.array(v=vs.110).aspx) As such, there are a bevy of methods you can use to work with arrays. There are also a few properties that are handy. [Click here](https://msdn.microsoft.com/en-us/library/system.array_members(v=vs.90).aspx) to read details about all the methods and properties arrays provide. Here is a quick overview of the most-used methods and properties:

#### Array methods

*   **Clear**– Sets a range of elements in the array to zero, false or null
*   **Copy** – Copies elements from one array to another
*   **CopyTo** – Copies all the elements of a one-dimensional array to another one-dimensional array
*   **GetUpperBounds** – Get the upper bound of a given dimension of an array
*   **GetLowerBounds** – Get the lower bound of a given dimension of an array
*   **IndexOf** – Returns the index of the first occurrence of a value in a one-dimensional array
*   **Sort** -Sort the elements in a one-dimensional array

#### Array properties

*   **Length** – Get the number of elements in an array. For multi-dimensional arrays, this returns the total number of elements (ie, a 3×3 array has a Length of 9).
*   **Rank** – Get the number of dimensions in an array.

#### Traversing an array

You can see array methods in action when you investigate the ways AVR for .NET lets you traverse an array. There are at least four ways to do this.

Consider this array declaration:

```
DclArray MyArr Type(*Integer4) Rank(1)
DclFld   x     Type(*Integer4)

MyArr = *New *integer4[] {24, 30, 36, 42}
```    

You could traverse this array with a `Do` loop using a hard-coded upper bound:

```
Do FromVal(0) ToVal(3) Index(x) 
    MsgBox MyArr[x] 
EndDo
```       

You could also traverse this array with a `Do` loop using a soft-coded upper bound this way:

```
Do FromVal(0) ToVal(MyArr.Length - 1) Index(x) 
    MsgBox MyArr[x] 
EndDo
```  

With the above method, note that if `MyArr` were a multi-dimensional array, the loop would traverse over all elements of all dimensions.

You could traverse this array with a `Do` loop using a soft-coded upper bound:

```
Do FromVal(0) ToVal(MyArr.GetUpperBound(0)) Index(x) 
    MsgBox MyArr[x] 
EndDo
```  

With the above method, the argument you pass to `GetUpperBound` specifies which dimension to traverse.

And, you could also use `For/Each` to traverse the array:

```
ForEach x Collection(MyArr)
    MsgBox x 
EndFor
```                 

The `For/Each` method is handy, but it does not explicitly provide access to the current index of the element fetched.

In Part 4, we’ll take a look at passing arrays as arguments.