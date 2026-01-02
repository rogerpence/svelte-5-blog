---
title: 'AVR for .NET arrays: arrays as arguments'
description: This article explains how to use arrays as arguments to methods with Visual RPG.
tags:
  - visual-rpg
date_published: '2024-01-09T11:57:42.000Z'
date_updated: '2024-01-09T17:58:44.000Z'
date_created: '2024-01-09T17:58:44.000Z'
pinned: false
---

You can easily pass an AVR for .NET array, as an argument, to subroutines and functions. To do so, the `DclSrParm` that receives the array must be declared as a ranked array (remember, rank means number of dimensions). However the array that you pass may have been declared, as either a ranked or dimmed array, the distinction is that regardless of how the array is declared, when passed to a subroutine or function, the array will be seen as a ranked array.

In the example that follows, `MyRoutine` passes the ranked array `MyArr` to a routine `Test1`.

```
DclArray MyArr Type(*Integer4) Rank(1)

MyArr = *New *integer4[] { 24, 30, 36, 42 }

Test1(MyArr)

...

BegSr Test1
    DclSrParm InArr Type(*Integer4) Rank(1) 
    .         
    .         
    Test1 has the contents of MyRoutine's array available
    to it here--as the InArr array.
    .         
    .         
EndSr
```   

or with a dimmed array:

```
DclArray MyArr Type(*Integer4) Dim(4)

MyArry[0] = 24
MyArry[1] = 30
MyArry[2] = 36
MyArry[3] = 42

Test1(MyArr)

...

BegSr Test1
    DclSrParm InArr Type(*Integer4) Rank(1) 
    .         
    .         
    Test1 has the contents of MyRoutine's array available
    to it here--as the InArr array.
    .         
    .         
EndSr
``` 

Note that `Test1` won’t explicitly know how many elements are in the `InArr` array. If `Test1` needs to traverse the `InArr,` it needs to use either the `For/Each`, the array’s `GetUpperBound()` method, or the array’s `Length` property. Don’t ever assume the array bounds in called routines–always use softcoded techniques for determining the upper bounds of the passed array.

It’s also important to note that you use `DclSrParm` to declare array arguments to functions and subroutines, but you must also include the `Rank()` keyword to indicate that parameter is an array.

#### Arrays are reference types

Because arrays are reference types they are implicitly passed by reference. Thus, any changes made in the called routine are reflected in the caller. This is illustrated in the code below. The zeroth element of `MyArr` is 24 below the call to `Test1`; after the call to `Test1` its value is 189.

```
DclArray MyArr Type(*Integer4) Rank(1)

MyArr = *New *integer4[] { 24, 30, 36, 42 }

// MyArr[0] is now 24.

Test1(MyArr) 
// After the call, MyArr[0] is 189. 

BegSr Test1
    DclSrParm InArr Type(*Integer4) Rank(1) 
    .         
    .         
    InArr[0] = 189
    .         
EndSr
```   

In .NET, by default, arguments are passed by value. So, the above behavior is probably not the behavior a beginning AVR for .NET programmer expects. (In AVR Classic, changes to arguments passed by value were not seen by the caller). However, when .NET reference types are passed by value, they have pass-by-reference semantics when values are changed. The notion of reference types being passed by value is a concept that will raise its pointy head time and time again in AVR for .NET. Get very familiar with it! Read more about [value and reference types](https://msdn.microsoft.com/en-us/library/t63sy5hs.aspx) here.

#### Redimension arrays

You cannot explicitly redimension arrays in AVR for .NET. The `ReDim` operation is specific to VB. It is not a .NET operation and therefore also not available to AVR or C#. However, the fact that arrays are reference types can be exploited to implement your own array redimensioning. Pay close attention to the code that follows—it has a few subtleties.

```
BegSr MyRoutine     
    DclArray MyArr Type(*Integer4) Rank(1)

    MyArr = *New *integer4[] { 24, 30, 36, 42 }
    // MyArr has four elements.

    MyArr = ReDimMyArr(MyArr, 8) 
    // Now MyArr has eight elements. 
EndSr

BegFunc ReDimMyArr Type(*Integer4) Rank(1) 
    DclSrParm InArr  Type(*Integer4) Rank(1) 
    DclSrParm ElementCount Type(*Integer4)

    DclArray MyArr Type(*Integer4) Rank(1)

    MyArr = *New *Integer4[ElementCount]        
    Array.Copy(InArr, MyArr, InArr.Length)

    LeaveSr MyArr
EndFunc
```

Because `MyArr` was passed by value to `ReDimMyArr()` the returned reference to a new array (with the number of elements provided) is assigned to `MyArr` in `MyRoutine.` This effectively reassigns a new array to the `MyArr` in `MyRoutine.` This technique wouldn’t work if `MyArr` was passed to `ReDimMyArr()` by reference.

In Part 5, we’ll take a look at the convert record format data into an array.

