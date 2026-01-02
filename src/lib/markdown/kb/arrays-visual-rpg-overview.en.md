---
title: Getting to Know Arrays in AVR for .NET
description: This article provides an overview of using arrays with Visual RPG.
tags:
  - visual-rpg
date_published: '2024-01-09T11:10:39.000Z'
date_updated: '2024-01-09T17:12:13.000Z'
date_created: '2024-01-09T17:12:13.000Z'
pinned: false
---

Arrays are one of the most frequently used data structures in computer programming. Arrays are quite different in AVR for .NET than they were in AVR Classic–but they are also vastly more powerful. This article takes a look at AVR for .NET’s arrays. This article is aimed at getting any programmer quickly up to speed with AVR’s arrays, but it should be especially helpful for programmers with an AVR Classic background. Please note that when this article references “AVR” it is speaking about AVR for .NET.

Here is a summary of the array topics this article covers:

*   AVR for .NET supports a statically-sized array (just like AVR classic did).
*   All arrays in AVR for .NET are zero based (unlike AVR Classic arrays).
*   AVR for .NET supports multi-dimensional arrays.
*   You don’t have to specify the number of elements in an array when you declare it (this is a “ranked” array—more on ranked arrays in a moment).
*   Arrays can be traversed with For/Each.
*   You can change the number of elements in an array at runtime.
*   Arrays can be passed, by reference, as arguments to subroutines and functions.
*   Arrays can be returned as a function result.

#### Using statically-sized arrays

The number of elements of a statically-sized array is hardcoded in your code and cannot be changed at runtime. For example:

```
DclArray arr Type(*String) Dim(4) 

arr[0] = "John"
arr[1] = "George"
arr[2] = "Ringo"
arr[3] = "Paul" 
``` 

This type of array is essentially what AVR Classic offered—however note that the first element is the zeroth element. _This is very important._ If you have experience with VB.NET, AVR fixed an annoying VB quirk with its array declarations. In VB.NET, the default behavior of Dim(4) results in an array with five elements—which is silly. I can’t think of another zero-based language that does that (C# and Java, for example, don’t  do that).

While AVR fixed one VB.NET array annoyance, another was persisted. Had this issue not been persisted, it would have probably caused AVR Classic coders some grief–but still, it’s odd. The Dim keyword implies that you are specifying the number of dimensions in the array. You aren’t, you are specifying the number of elements in as many dimensions as are declared. For example, Dim(4) declare a single-dimensioned array with four elements; Dim(3,3) (as shown below) declares two dimensional array where each dimension has three elements.

#### Multi-dimensional arrays

The code below creates a statically-sized multi-dimensional array:

```
DclArray arr Type( *Integer4 ) Dim( 3,3 ) 

arr[0,0] = 1 
arr[0,1] = 2
arr[0,2] = 3 

arr[1,0] = 5 
arr[1,1] = 6
arr[1,2] = 1
```

In this case, the use case might be that we need to model a Rubik’s cube for an online game. Each element in the matrix is assigned one of six colors. (This example shows filling only six of the available 27 elements). For a fun exercise, [take a look at some algorithms to solve Rubik’s cube.](http://en.wikipedia.org/wiki/Optimal_solutions_for_Rubik%27s_Cube)

#### Using dynamically-sized arrays

Let’s say that you need to get a list of files in the root of your C: drive. In this case, a variable number of files may be returned each time you request the list–depending on when files have been added or deleted. With statically-sized arrays, you need to guess the largest possible value—which can be quite wasteful. Dynamically-sized arrays are called “ranked” arrays. Before we look at ways to populate a ranked array, let’s take a look at one way you can use ranked arrays. The code below uses the GetFiles() method in .NET’s System.IO.Directory class to return the names of the files in the path specified. There are many other methods in the .NET Framework that return ranked arrays.

```
DclArray files Type(*String) Rank(1)

files = Directory.GetFiles( "c:\" )
ForEach f Type( *String ) Collection( files ) 
    Console.WriteLine( f )
EndFor
```

The GetFiles() method always returns an array with exactly the number of elements required. Note also how this code uses ForEach to traverse the array returned.

In this case, the DclArray operation declares the variable _files_ as an array of strings with a single dimension—but this declaration doesn’t assign any elements to the ranked array at compile time (formally, the ranked array has been declared but it has not yet been instanced). Ranked arrays are _always_ populated at runtime. In the case of ranked arrays, we need to declare the number of dimensions of the array. But we can’t use the Dim keyword because, for legacy reasons, that keyword is use for statically-sized arrays. Therefore, in this case you need to use the Rank keyword. Just like statically-sized arrays, ranked arrays can also be multi-dimensional. The code below declares a two-dimensional array of integers.

```
DclArray arr Type(*Integer4) Rank(2)
```

How many elements are in either of the two dimensions of _arr_? You can’t tell from looking at the single line of code above. The number of elements in any of a ranked array’s dimensions is unknown until runtime.

Let’s say that you want a single dimensional array of integers with four elements. The code below declares a single-dimensioned array of integers and then assigns four elements. The compiler doesn’t know how many elements are in _arr_–it gets instanced to four elements at runtime.

```
DclArray arr Type( *Integer4 ) Rank( 1 )
arr = *New *Integer[4]
```

Note the brackets in the second line above. When instancing a ranked array, these brackets must immediately follow the array’s data type (don’t use parenthesis here, they won’t work). The value inside the brackets must specify the number of array elements to create—if it is known at design time. (The brackets indicate “array” to .NET.) If the number of elements isn’t known until runtime, use a variable instead of hard coding the value (as shown below).

```
DclArray arr      Type(*Integer4) Rank(1)
DclFld   Elements Type(*Integer4) 

Element = 67
Arr = *New *Integer[ Elements ]
```

Ranked arrays also let you assign the number of elements and the element values all at once with the code shown below:

```
DclArray Beatles Type( *String ) Rank( 1 )

Beatles = *New *String[] { "John", "George", "Ringo", "Paul" }
```

In this case, note that the brackets following the data type are empty—the number of elements in the braces immediately following the data type are assigned to the array. Let’s assume that in another part of your code, you needed an array with _all_ of the members of the Beatles, not just the Fab Four. You could redefine the previously populated Beatles array with this code:

```
Beatles = *New *String[] { "John", "George", "Ringo", "Paul", "Stu", "Pete", "Billy" }
```

The code above assumes you’re willing to accept the late, great [Billy Preston](http://en.wikipedia.org/wiki/Billy_preston) (which I admit is a reach) as a member of the Beatles. AVR (as well as C#) doesn’t have a REDIM operation like VB does, but you could easily code one yourself if you need it (however, if you need to do that, you should maybe be looking at the numerous collection data types that .NET provides in the System.Collections namespace). (A minor footnote for advanced .NET programmers: recognize that the code above isn’t appending elements to the previously populated array, rather is its simply instancing a new array with seven elements. The original array with only the Fab Four in it gets reclaimed by the garbage collector.)

To iterate over the elements in a ranked array, you can either use the ForEach construct previously discussed or if you need the current index during the iteration use AVR’s For opcode as shown below:

```
DclFld i Type( *Integer4 )

For Index( i = 0 ) To( myArr.Length - 1 )           
    Console.WriteLine( myArr[i] )
EndFor
```

#### Passing arrays as arguments to functions or subroutines

Either Dimmed or Ranked arrays can be passed as arguments to either functions or subroutines. But do remember that because arrays in general in .NET are instances of a reference type, they are _always_ passed by reference. Therefore, changes made in the called routine are _always_ reflected in the caller. _Always. Because arrays are a reference type object, you can’t defeat this pass-by-reference behavior—so be careful and know what to expect when you pass arrays around._

Consider the following code:

```
BegSr PassArraysAsArgs Access( *Public )
    DclArray Beatles Type( *String ) Rank( 1 )

    Beatles2 = *New *String[] { "John", "George", "Ringo", "Paul" } 

    ChangeBeatle( Beatles )
    // Beatles[1] is now "GEORGE"
EndSr

BegSr ChangeBeatle
    DclSrParm Beatles Type( *String ) Rank( 1 )

    Beatles[1] = Beatles[1].ToUpper()
EndSr
```

Or

```
BegSr PassArraysAsArgs Access( *Public )
    DclArray Beatles Type( *String ) Dim( 4 ) 

    Beatles1[ 0 ] = "John"
    Beatles1[ 1 ] = "George"
    Beatles1[ 2 ] = "Ringo"
    Beatles1[ 3 ] = "Paul"

    ChangeBeatle( Beatles )
    // Beatles[1] is now "GEORGE"
EndSr

BegSr ChangeBeatle
    DclSrParm Beatles Type( *String ) Rank( 1 )

    Beatles[1] = Beatles[1].ToUpper()
EndSr
```

In either example, the value of the Beatles\[1\] element that was changed in the ChangeBeatle() subroutine is reflected in the routine that called ChangeBeatle(). Even though it was not declared as such, the dimmed array in the second example is passed as a ranked array. The only way to pass arrays as routine arguments is to pass them as ranked arrays.

#### Returning an array as a function result

Used ranked arrays to return an array as the result of a function, isn’t something you’ll do often, but it’s good to know how to do it. Note how the array returned in the GetBeatlesArray() function is declared as a dimmed array inside the routine–but also notice that the return value of the function is declared as a ranked array. The result array can be either a dimmed or ranked array, but it must be returned as, and received as, a ranked array.

```
BegSr TestGetBeatlesArray Access(*Public)
    DclArray Beatles Type(*String) Rank(1) 

    Beatles = GetBeatlesArray()

    ForEach Beatle Type(*String) Collection(Beatles) 
        Console.Writeline(Beatle)
    EndFor
EndSr

BegFunc GetBeatlesArray Access(*Public) Type(*String) Rank(1) 
    DclArray Beatles Type(*String) Dim(4) 

    Beatles[0] = "John"
    Beatles[1] = "George"
    Beatles[2] = "Ringo"
    Beatles[3] = "Paul" 

    LeaveSr Beatles
EndFunc
```

That’s probably enough about arrays for now. Spend some time with the array handling in AVR for .NET and don’t be afraid to break out of your dimmed array comfort zone. Once learned, ranked arrays provide a tremendous payout.
