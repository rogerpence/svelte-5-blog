---
title: An introduction to regular expressions with ASNA Visual RPG
description: This is part 1 of 2 about using regular expressions with ASNA Visual RPG
tags:
  - visual-rpg
date_published: '2024-01-09T13:28:43.000Z'
date_updated: '2024-01-09T20:52:33.000Z'
date_created: '2024-01-09T20:52:33.000Z'
pinned: false
---


Regular expressions (regex) provide a pattern matching scheme you can use to search and manipulate strings. Although regex has been around for almost 50 years, it is often either completely ignored or relegated to the “will learn later” pile by many programmers. Regex is indeed borderline witchcraft that at first glance looks like it was culled from the script of [Plan 9 from Outer Space](https://www.youtube.com/watch?v=Ln7WF78PolA). (It wasn’t!).

There is an old programming adage that goes: “One time I had a problem so I tried to solve it with regular expressions. Now I have two problems.” If you’re not careful, that old saying sums up regex well. If you get in a hurry or try to over-complicate things, regex will get you in more trouble than cheating on your taxes. But with a little effort and practice, knowing how and when to use a regular expression to solve a problem will make your code better, easier to read (really!), and easier to maintain (also really!).

So put your tray tables in their upright and locked positions and let’s take regular expressions for a spin in ASNA Visual RPG.

### What are regular expressions?

Regular expressions are a way to search, replace, and manipulate string values. Regular expression syntax provides a succinct grammar for identifying parts of a string. This concise grammar can be a bit overwhelming at first, but with a little effort it’s not as bad at is initially seems—especially for basic regular expressions. And, remember, the trade-off for a regular expression’s awkwardness is that it’s doing what would otherwise lots of logic and conditional testing.

Regular expressions can be used directly in at least four places with AVR for .NET:

1.  In AVR language to work with your own strings
2.  In the Visual Studio’s editor to perform search and replace
3.  With the regular expression validator for ASP.NET
4.  In JavaScript for browser-based development

Regular expressions are generally a cross-platform facility, however there are two families of regular expression engines: PCRE (Perl Compatible Regular Expressions) and Posix (Portable Operating System Interface). .NET’s regex engine is a PCRE derivative, as are PHP, PERL, and JavaScript regex engines. While there are some minor differences across different implementations, generally any PCRE-based regex tutorial or online regex testing site will work with AVR and .NET.

Throughout this article, you’ll see several “Try this pattern online” buttons. Those buttons link to specific exercises on the excellent [Regular Expression online playground](https://regex101.com). It provides a superb way to experiment with regular expressions. There are a couple of examples below that iterate over a regex result and those don’t work well in the online tester. To test them, copy and paste the code in an AVR project. Other online references include:

[MS Regex quick reference](https://msdn.microsoft.com/en-us/library/az24scfc%28v=vs.110%29.aspx)

[.NET Framework Regular expressions](https://msdn.microsoft.com/en-us/library/hs600312%28v=vs.110%29.aspx)

### A simple regex match

The .NET namespace [System.Text.RegularExpressions](https://msdn.microsoft.com/en-us/library/system.text.regularexpressions%28v=vs.110%29.aspx) provides a variety of classes to perform regex work in AVR. This article uses several of those classes. All of the following code assumes

```
Using Sytem.Text.RegularExpressions
```

is at the top of your class. Regular expressions attempt a match at an input string against a given regex pattern. Let’s assume that we have two variables declared:

```
DclFld Source Type(*String)
DclFld Re Type(*String) 
```

`Source` is to contain the searched string and `Re` is to contain the regular expression. Let’s start with something very simple using the [`Regex class's Match() method`](https://msdn.microsoft.com/en-us/library/twcw2f1c%28v=vs.110%29.aspx). (Don’t get confused, this `Match()` method returns an instance of the [`Match`](https://msdn.microsoft.com/en-us/library/system.text.regularexpressions.match%28v=vs.110%29.aspx) class.)

```
DclFld m Type(Match) 
```

With the necessary declarations, here is a very simple regex example:

```
Source = 'Hello, World'
Re = 'll'

m = Regex.Match(Source, Re)
If m.Success
    // Occurrence found.
Else
    // Occurrence not found.
EndIf
```

[Try this pattern online](https://regex101.com/r/tN7gQ4/2) 

The example above looks for a match in the `Source` field to the `Re` field. Checking the value of the `Match` class the `Match()` method returned reports the success of the match. In this case, `Hello, World` contains `ll` so `m.Success` is true.

In addition to its `Success` property, the `Match` object that `Match()` returns the additional information about the match including the starting location of the match, its length, and its value. If you don’t need the `Match` instance, you can use this shorthand for the `Match()` method:

```
If (Regex.Match(Source, Re).Success)
    // Occurrence found.
Else 
    // Occurrence not found.
EndIf
```

As currently written, this match is case-sensitive. Using an optional third argument to the `Match()` method removes the match case-sensitivity (you’ll later see another way to impose case insenstivity on regular expressions).

```
Source = 'Hello, World'
Re = 'LL'

m = Regex.Match(Source, Re, RegexOptions.IgnoreCase)
```

The match above succeeds because the `RegexOptions.IgnoreCase` argument was provided. In subsequent `Match()` method examples, the code to execute when the match succeeds is omitted.

### Some basic Regex special characters

Mastering regular expressions requires you to master a lot of arcane special-case patterns. At first, this gobbledy-goop is indeed overwhelming. But, one bite at a time, it starts to make sense. This next example introduces some regex special characters. These are characters, that unless escaped, have special meaning to regular expressions. Let’s start with regex _anchors_. Although [this page](https://msdn.microsoft.com/en-us/library/az24scfc%28v=vs.110%29.aspx#atomic_zerowidth_assertions) shows eight of them, the first two, `^` and `$`, are all you need to know for now. `^` anchors a match at the beginning of a string, and `$` matches a search at the end of the string. An example or two explains anchors best.

```
Source = 'Hello, World'
Re = '^ll'
m = Regex.Match(Source, Re)
```

The match above fails because it looks for `ll` at the beginning of the string.

```
Source = 'Hello, World'
Re = '^He'
m = Regex.Match(Source, Re)
```

The match above succeeds because it looks for `He` at the beginning of the string.

```
Source = 'Hello, World'
Re = 'll$'
m = Regex.Match(Source, Re)
```

The match above fails because it looks for `ll` at the end of the string.

```
Source = 'Hello, World'
Re = 'orld$'
m = Regex.Match(Source, Re)
```

The match above succeeds because it looks for `orld` at the end of the string.

To search a string for one of the special case anchor characters, use the `\` escape character.

```
Source = 'x = 6^2'
Re = '\^'
m = Regex.Match(Source, Re)
```

The match above succeeds because the `\` escape character changes what would have otherwise been the `^` anchor character to an absolute character to match. See if you can determine what this match is doing:

```
Source = '^I love wolverines'
Re = '^\^'
m = Regex.Match(Source, Re)
```

[Try this pattern online](https://regex101.com/r/pG1vT5/1) 

The match above succeeds because it looks for a string that starts with `^`. Crazy, huh. Comprehending regular expressions takes a little practice. Don’t get discouraged. What if you need to search for `\`? escape the escaper!

```
Source = '\\mycomputer\document'
Re = '^\\\\'
m = Regex.Match(Source, Re)
```

The match above succeeds by looking for a string that beings with two `\` characters, by escaping the escape character.

To make regular expressions easier to use you might be inclined to use a little white space to make the regex pattern a little more readable:

```
Source = '^I love wolverines'
Re = '^ \^'
m = Regex.Match(Source, Re)
```

However, that just broke the match. Now, the regex is looking for a string that starts with a space and then a `^` character. A single space is just that–a search for a single space. You have to be as careful with white space as you are with any other character in your regular expressions. Two other regex special character are `(` and `)`. The are used to group expressions. Although we’ll later see how grouping expressions can lead to some very sophisticated matching, for now, let’s use grouping just to improve regex readability.

```
Source = '^I love wolverines'
Re = '^(\^)'
m = Regex.Match(Source, Re)
```

Grouping the second `\^` pattern makes this regular expression a little easier to read. You can almost think of parentheses as adding punctuation to regular expressions. This article series uses regex grouping for readability quite often. To search for the absolute `(` or `)` characters, escape them with a backslash character (`\`).

```
Source = '(I can''t get no) Satisfaction'
Re = '\)'
m = Regex.Match(Source, Re)
```

The match above succeeds in finding the closing `)` by escaping it. Note the repeating single quote marks in the match above. It could have also been written as:

```
Source = "(I can't get no) Satisfaction"
Re = '\)'
m = Regex.Match(Source, Re)
```

That single quote/double quote issue is an  AVR issue, not a regular expression issue.

### That’s all for now

In the next installment we’ll take a look at regular expression character classes and qualifiers.
