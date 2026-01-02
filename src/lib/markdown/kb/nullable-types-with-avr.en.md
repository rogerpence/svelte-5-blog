---
title: Using nullable types with AVR for .NET FW
description: This article shows how, with a simple bit of prodding, to use them with ASNA Visual RPG for .NET Framework.
tags:
  - visual-rpg
date_published: '2024-01-11T11:57:34.000Z'
date_updated: '2024-01-11T19:11:03.000Z'
date_created: '2024-01-11T19:11:03.000Z'
pinned: false
---

[Nullable types](http://msdn.microsoft.com/en-us/library/1t3y8s4s.aspx) are data types that can contain a valid data type value _or_ be null. This article shows how, with a simple bit of prodding, to use them with ASNA Visual RPG for .NET Framework. 

**What are nullable types?**

Nullable types are special-case versions of .NET value types that represent either a valid value or null (`*Nothing` in AVR parlance). For example, a nullable Boolean variable would have one of three values: true, false, or null; a long integer would be either zero, a plus or minus value, or null; a date would be either a valid date value, the minimal date value (1/1/0001), or null. Nullable types are good for those times when a program needs to represent a value or the absence of a value. For example, consider an integer value, weight, which indicates the weight of a shipment. If weight is a numeric value, it represents the weight of the shipment; if it is null it means the shipment hasn’t yet been weighed. 

The need for nullables is usually driven by either a database requirement (eg, a nullable column in a table) or nullable third-party control properties (eg, Telerik and Infragistics use nullable types in a few places). Use nullable types where you need them, but don’t get carried away with nullable types. The overuse of nullable types makes your program overly complex. However, for those times with you really need a nullable type (as in the case of the third-party controls) knowing the simple coercion it takes to make AVR nullable-type friendly will come in handy. 

**Nullable types are special-case generic types**

Nullable work only with [value types](http://msdn.microsoft.com/en-us/library/s1ax56ch(v=vs.120).aspx) and "value type" means variables of a numeric type. The full list of AVR value types [is shown here.](http://devnet.asna.com/documentation/help_files/avr81/avr2005_web/avrconFrameworkDataTypesComparison.htm)  Reference types (class instances and the \*String data type, for example) are implicitly nullable by simply and directly assigning null to the variable. C# lets you define a nullable type by appending a question mark at the end of the type name (VB.NET uses of nullable types is similar to C#’s). For example, these three lines of C# declare a nullable long integer, a nullable DateTime, and a nullable Boolean.

```
    int? i;
    DateTime? d;
    Bool? b;
```

Alas, AVR doesn’t have the syntactical sugar to make declaring nullable types as concisely as C# does. The key to understanding AVR’s use of nullable types is to realize that under the covers, .NET, nullable types are implemented as a _generic type_ with a lightweight _immutable_ wrapper around it. There are a couple of five dollar words in that previous sentence. If you are familiar with them skip ahead to the _Nullable types with AVR section_. 

_Generic type:_ a generic type in the .NET Framework is one where a variable’s type is determined at compile time. AVR offers basic support for generics and you may be used to using them with the [System.Collections.Generic.List of (\*Of T)](http://msdn.microsoft.com/en-us/library/6sh2ey19(v=vs.110).aspx) (or its cousins in the System.Collections.Generic namespace). For example, this AVR declaration:

```
DclFld Customers Type(System.Generics.CollectionList(*Of Customer)) New()
```

declares a strongly typed list of the Customer class (a class you created). The type the Customers list contains, Customer, is determined at compile time. We’ll see in a moment how generic types relate to nullable types. 

_Immutable:_ [an immutable variable](http://en.wikipedia.org/wiki/Immutable_object) is a variable whose value doesn’t change during the life of the variable. Huh? A variable that can’t change sounds like a constant, doesn’t it? Well, yes. In this case, the confusion is driven partly by the oxymoronic phrase "immutable variable" and the pedantically correct, but misleading "whose value doesn’t change." In .NET (and in many other languages as well), string variables are immutable. Consider this example of an immutable variable in AVR (because strings are implicitly immutable):

```
DclFld s Type(*String)
s = "Neil Young"
```

You could probably win a cold beer with this bet: "I’ll betcha you can’t change the value of `s` as I’ve defined it in the two lines above." A colleague takes the bet and adds a third line:

```
DclFld s Type(*String)
s = "Neil Young"
s = "Frank Sampedro
```

and then uses the debugger to prove that she did indeed change the value of `s`. Or did she? Technically speaking, when she assigned "Frank Sampedro" to `s`, she didn’t cause the value of `s` to change, rather, she caused the old variable `s` to be destroyed and a new string variable `s` to be created with the new value (the garbage collector dispatches the space consumed by the previous value). Strictly speaking, she owes you a beer! (The notion of immutability is actually much more substantial than this silly example makes it seem. To read more about immutability and its implications, read about [function programming and how immutability is used to isolate program state](http://en.wikipedia.org/wiki/Functional_programming) or about .NET’s [new immutable collections](http://msdn.microsoft.com/en-us/library/dn385366(v=vs.110).aspx).)

When you do this in C#

```
int? i;
i = 55;
i = 65; 
```

it appears as though the third line changed the value of the nullable variable `i`. While logically that is what happened, under the covers what really happened is that the original `i` was destroyed and a new one, with the new value 65 was created. The C# compiler’s syntactical sugar for nullable types hides away this new object creation. Alas, AVR doesn’t have that sugar—but there is a simple work-around. The key to using nullable types in AVR is to understand that each assignment to a nullable variable really creates a new instance of that variable.

> The important thing to remember with AVR is that to assign a new value to a nullable type, you _always_ need to create a new instance of the nullable type.

**Nullable types with AVR** The following two lines declare a nullable long integer and then assign it a value of 8. 

```
DclFld x Type(System.Nullable(*Of *Integer4)) 
x = *New System.Nullable(*Of *Integer4)(8)
```

To assign the nullable `x` a different value, you need to instance it again. 

```
x = *New System.Nullable(*Of *Integer4)(16)
```

After executing the line above, `x's` value is now 16. It’s worth repeating: The important thing to remember with AVR is that to assign a new value to a nullable type, you _always_ need to create a new instance of the nullable type. **Nullable type considerations** Recall that nullable types always represent value types (which essentially means variables with numeric values). A nullable type changes a value type’s typical default value. For example, after this declaration:

```
DclFld y Type( *Integer4 ) 
```

`y` has a default value of zero. However, after this nullable integer declaration:

```
DclFld x Type(System.Nullable(*Of *Integer4))
```

`x` has a default value of null, or `*Nothing` in AVR parlance. All nullable types have a null default value. This imposes special considerations to avoid assignment errors. For example, the following code: 

```
DclFld x Type(System.Nullable(*Of *Integer4)) 
DclFld y Type(*Integer4) 

y = x
```

causes a “Cannot convert type ‘System.Nullable’ to type ‘\*Integer Len(4)” compile-time error. To avoid this problem, all nullable types provide a `Value` property. You should always use the `Value` property when assigning a nullable type. Alas, there is one other gotcha. For example, this code:

```
DclFld x Type(System.Nullable(*Of *Integer4)) 
DclFld y Type(*Integer4) 

y = x.value
```

causes a runtime error. Can you spot the problem? The default value of `x` is null, and you can’t assign null to an integer. This generates a “Nullable object must have a value” error. You can avoid this error by wrapping the assignment in a Try/Catch, but nullable types offer more concise protection for this error: 

```
DclFld x Type(System.Nullable(*Of *Integer4)) 
DclFld y Type(*Integer4) 

If (x.HasValue)
    y = x.value
EndIf
```

It’s usually always best to defensively wrap an assignment from a nullable type using the nullable’s type’s `HasValue()` property. Nullable types also offer one other assignment alternative: 

```
DclFld x Type(System.Nullable(*Of *Integer4)) 
DclFld y Type(*Integer4) 

y = x.GetValueOrDefault()
```

A nullable type’s `GetValueOrDefault()` method can be used to assign the value of the nullable type, or if it doesn’t have one, its underlying type’s default value. After the assignment above, `y` would be zero.  **Making AVR nullable assignments more palatable**  We’re close to exceeding our gulp factor for nullables, but let’s smooth out one last little wrinkle as best we can. The assignment of new nullables to change a nullable’s value is clumsy in AVR. C# and VB both do it quite gracefully. Using a `*TimeStamp` nullable (just to switch things up) with AVR, the assignment of a new date value has to look like this:

```
DclFld d Type(System.Nullable(*Of *TimeStamp)) 

d = *New System.Nullable(*Of *TimeStamp)(1977,05,25) 
...
...
d = *New System.Nullable(*Of *TimeStamp)(1959,06,02)
```

Where the values in the last set of parentheses (ie, the `(1977, 05, 25)` or the `(1959, 06 ,02)` are the values passed to the nullable’s underlying base type (in this case, a `DateTime` or `*TimeStamp` type). With a helper function, the assignment is done this way:

```
DclFld d Type(System.Nullable(*Of *TimeStamp)) 

d = NullableDateTime(*New DateTime(1977, 05, 25))
...
...
d = NullableDateTime(*New DateTime(1959, 06, 02))
```

This isn’t as clean as I wish it could be, but for my money it’s cleaner and a little more direct. Helper functions for Booleans, and DateTime, and long integers are provided below:

```
BegFunc NullableInteger Type(System.Nullable(*Of *Integer4))  
    DclSrParm NewValue Type(*Integer4) 

    LeaveSr *New System.Nullable(*Of *Integer4)(NewValue)
EndFunc 

BegFunc NullableBoolean Type(System.Nullable(*Of *Boolean)) 
    DclSrParm NewValue Type(*Boolean) 

    LeaveSr *New System.Nullable(*Of *Boolean)(NewValue)
EndFunc 

BegFunc NullableDateTime Type(System.Nullable(*Of System.DateTime))
    DclSrParm NewValue Type(System.DateTime)

    LeaveSr *New System.Nullable(*Of System.DateTime)(NewValue)
EndFunc
```
