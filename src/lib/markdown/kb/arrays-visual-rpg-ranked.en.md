---
title: 'AVR for .NET arrays: dynamically-sized arrays'
description: 'This article explains how to used ranked (aka dynamic) arrays in Visual RPG. '
tags:
  - visual-rpg
date_published: '2024-01-09T11:10:39.000Z'
date_updated: '2024-01-09T17:47:19.000Z'
date_created: '2024-01-09T17:47:19.000Z'
pinned: false
---

AVR for .NET offers two types of arrays:

*   **Dimmed array**. An array whose number of elements are known when it’s declared (ie, at compile time). Part 1 of this series covered the basics of dimmed arrays. If you’re familiar with AVR Classic’s arrays you’ll find AVR for .NET’s dimmed arrays to be very similar.
*   **Ranked array**. An array whose number of elements are not known when it’s declared (ie, the number of elements in ranked arrays are set at runtime–and may change at runtime).

AVR Classic offered only dimmed arrays (arrays of fixed size). This constraint often caused arrays in AVR Classic to be declared much larger than necessary. For example, consider needing to populate an array with the names of files in a folder. In some cases, there may be just a few files in that folder; in other cases there may be hundreds. To be safe in AVR Classic, you’d need to declare the array with enough elements to hold the maximum number of files you’d expect the folder to contain. Not only was this nearly always very wasteful, guessing too low would cause the program to fail. AVR for .NET’s dynamically-sized arrays, its ranked arrays, allow for that array of file names to be correctly sized every time.

#### Declaring variably-sized arrays

To declare an array of a known number of elements at design-time use the`Dim()` keyword;  to declare an array with a dynamic number of elements at design-time use the `Rank` keyword. to specify the number of dimensions. The `Dim()` and `Rank()` keywords are mutually exclusive—use one or the other.

The code below declares a single dimension array with 10 elements:

```
DclArray MyFiles Type(*String) Dim(10)    
```
This array can only contain ten elements, no more, no less.

The code below declares an array of a single dimension with an unknown number of elements:

```
DclArray MyFiles Type( *String ) Rank( 1 )
```

This array can contain any number of elements and its number of elements may change multiple times during runtime. Although the number of elements in a ranked array can vary at runtime, the number of dimensions is fixed with the number of dimensions specified with the `Rank()` keyword. That ranked arrays use `Rank` and not `Dim` to specify the number of dimensions is a little confusing. However, AVR Classic’s long history of using `Dim` to specify fixed-size arrays required that dynamic arrays dimensions be specified with a different keyword.

To summarize: Ranked arrays are declared with a specify number of dimensions using the `Rank` keyword. A ranked array’s number of elements is determined at runtime and may change during the course of the program.

Using a breakpoint right after the ranked array declaration below shows that at runtime, immediately after the declaration, the array has no elements and its value is `*Nothing.`

![how a ranked array looks in Visual Studio immediately after its declaration](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/dynamic-arrays-01.png)  

Figure 1 shows how a ranked array looks in Visual Studio immediately after its declaration.

Ranked arrays are often used to store a varying size list of array elements as returned from a function. Many functions in the .NET Framework return dynamically-sized arrays (and we’ll soon see how you can write your own functions to return a dynamically-sized array). Let’s revisit the need to fetch a list of file names from a folder. Here’s a good way to do that in AVR for .NET:

```
DclArray MyFiles Type( *String ) Rank( 1 )

MyFiles = System.IO.Directory.GetFiles("c:\pdfs")
```

![A ranked array populated with file names in a given folder](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/dynamic-arrays-02.png)  
Figure 2. A ranked array populated with file names in a given folder.

Regardless of the number of files in the `c:\pdfs` folder MyFiles will always have one element for each file in the folder each time `GetFiles()` is called.

#### Explicitly populating a ranked array

To explicitly populate a ranked array, you need to create a new instance of the array. For example, let’s use a variable named `MemberCount` to determine, at runtime, how many elements the `Members` array should have. To do this, you’d use this code:

```
DclFld MemberCount Type(*Integer4) 
DclArray Members Type(*String) Rank(1) 

MemberCount = 4
Members = *New *String[MemberCount]   
```
![After creating a new instance of the Members array it has four elements](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/dynamic-arrays-03.png)  
Figure 3. After creating a new instance of the Members array it has four elements.

After creating the Members array, you can now assign the four elements’ values.

Note that `MemberCount` is wrapped in brackets \[\] immediately after the array type. Parentheses _will not work_ in this case. The line below will not compile:

```
Members = *New *String(MemberCount)
```

This is yet another good reason to always use brackets to indicate array subscripts. There are some places where AVR for .NET will accept either parentheses or brackets—it is better to always use brackets to indicate array subscripts.

#### A ranked array subtly

A subtle ranked array rule is at play here: a ranked array’s size is immutable–once a number of elements is assigned to it, it can’t be changed. However, you can re-instance the array to a number of elements as many times as necessary. For example, consider the following code:

```
DclArray MyFiles Type( *String ) Rank( 1 )

MyFiles = System.IO.Directory.GetFiles("c:\pdfs")
// Do something here with the file names returned. 

MyFiles = System.IO.Directory.GetFiles("c:\docs")
// Do something here with the file names returned.
```

Each time `GetFiles()` is called, the array it returns is instanced to the correct size and a reference to that new instance is assigned to `MyFiles.`

Dimmed arrays, by contrast, must always have the number of elements with which the dimmed array was declared.

#### Ranked array shorthand

When declaring ranked arrays, there is a shorthand available that instances and populates a ranked array with a single line of code. For example, this code:

```
DclArray Members Type(*String) Rank(1)

Members = *New *String[] {"John", "George", "Ringo", "Paul"}
```

first declares a ranked array of type `*String`. The second line then implicitly instances a four-element array with the values specified in braces. The number of values specified in the braces determines how many elements will be in the array.

The code above is semantically identical to doing this:

```
DclArray Members Type(*String) Rank(1)

Members = *New *String[4]

Members[0] = "John"
Members[1] = "George"
Members[3] = "Ringo"
Members[4] = "Paul"
```

#### Creating a function that returns a ranked array

You’ll usually want to bury the details of how a ranked array gets populated in a function. For example, consider how clean this code is:

```
DclArray MyFiles Type( *String ) Rank( 1 )

MyFiles = System.IO.Directory.GetFiles("c:\pdfs")
```
The code doesn’t care how the array of file names was populated. Here is a function that hides the logic of getting the names of the Beatles:

```
BegFunc GetBeatlesNames Type(*String) Rank(1)   
    DclArray Members Type(*String) Rank(1)

    Members = *New *String[] {"John", "George", "Ringo", "Paul"}

    LeaveSr Members
EndFunc
``` 

To return a ranked array from a function, specify the function’s type with the Type() keyword and then specify the number of dimensions of an array of that type. Note that you never specify the number of elements to return; you only specify the array’s dimensions. Calling the `GetBeatlesNames()` function is pretty predictable:

```
DclArray Members Type(*String) Rank(1)

Members = GetBeatlesNames()
``` 

#### The Chicken or the Egg

A ranked array conundrum awaits you if you want to populate a ranked array by reading a variable number of records in a file. The problem is, you can’t instance the ranked array until you’ve read the variable number of records because you wouldn’t know how many elements the ranked array should be instanced with. Ranked arrays aren’t like collections, you can’t just dynamically add elements to them; you must first instance the ranked array to the correct number of elements.

A way to resolve this conundrum is to read as many records as required and save the values from each in a collection. Then, convert that collection to an array as the function’s return value. This version of the `GetBeatlesNames()` function is shown below:

```
BegFunc GetBeatlesNames Type(*String) Rank(1)   
    DclArray Members Type(*String) Rank(1)

    DclFld BeatlesCollection Type(System.Collections.Generic.List(*Of *String)) New()

    SetLL Beatles Key(*Start) 
    Read Members
    DoUntil (Members.IsEof)
        BeatlesCollection.Add(Name) 
        Read Members
    EndDo 

    Members = BeatlesCollection.ToArray()

    LeaveSr Members
EndFunc
``` 

In this case, a member is added `BeatlesCollection` each time a record is read. After populating the `BeatlesCollection`, its `ToArray()` method assigns the correspond array to `Members`.  Why not just return the collection? In many cases you might, but there are also many cases where it is leaner and cleaner to return a simple array.

