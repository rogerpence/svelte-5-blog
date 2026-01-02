---
title: Using regular expression character classes and quantifiers
description: This is part 2 of 2 about using regular expressions with ASNA Visual RPG
tags:
  - visual-rpg
date_published: '2024-01-09T13:28:43.000Z'
date_updated: '2024-01-09T20:58:37.000Z'
date_created: '2024-01-09T20:58:37.000Z'
pinned: false
---


[Part 1 of this series](/en/kb/regex-part1) introduced you to using regular expressions with ASNA Visual RPG (AVR). This article digs into more detail on how to define specific character searches,

## Regex character classes and quantifiers

Regex character classes provide a way to match any one of a set of characters. Let’s first consider user-defined character classes. First, though, a simple match for ‘get’.

The search below searches the Source string for ‘get’.

```
    Source = "(I can't get no) Satisfaction"
    Re = 'get'
    m = Regex.Match(Source, Re)
    DoWhile m.Success
        Console.WriteLine(m.Index.ToString() + ':' + m.Value)
        m = m.NextMatch() 
    EndDo 
```

It reports finding one occurrence that starts at position 8. Take a look at what appears to be the nearly identical match below. Notice its regular expression is surrounded with brackets.

```
Source = "(I can't get no) Satisfaction"
Re = '[get]'
m = Regex.Match(Source, Re)
DoWhile m.Success
    Console.WriteLine(m.Index.ToString() + ':' + m.Value)
    m = m.NextMatch() 
EndDo 
```

The brackets tell the regex engine that this is a character class match that matches any occurrence of `g`, `e`, or `t`–in any order. A character class is an implicit OR statement. This one is specifying any `g`, any `e`, and any `t`. This pattern reports six matches and their values at positions 6, 8, 9, 10, 18, and 24. To negate a character class, start the character class with an `^` symbol. For example, this match:

```
Source = "(I can't get no) Satisfaction"
Re = '[^aeiou]'
m = Regex.Match(Source, Re)
DoWhile m.Success
    Console.WriteLine(m.Index.ToString() + ':' + m.Value)
    m = m.NextMatch() 
EndDo 
```

Reports the value and position of each character that isn’t a vowel. Note the overloaded use of `^`. When `^` starts a character set inside brackets it negates them; otherwise it anchors the search at the beginning of the string. You can also specify ranges with character classes. For example, the match below:

```
Source = "(I can't get no) Satisfaction"
Re = '[a-m]'
m = Regex.Match(Source, Re)
DoWhile m.Success
    Console.WriteLine(m.Index.ToString() + ':' + m.Value)
    m = m.NextMatch() 
EndDo 
```
Reports the position and value of any character within the inclusive range of characters from `a` through `m`.

There are also several built-in character classes. Four that you’ll use frequently are:

|Class|Description|
|--- |--- |
|`\s`|matches any white-space character (ie, space, tab, linefeed, etc)|
|`\S`|matches any non-white-space character|
|`\d`|matches any decimal digit (ie, 0 through 9)|
|`\D`|matches any character except a decimal digit|
|`.|matches any single character except a new line (\n)|


Be sure to watch your case-sensitivity with regex special characters. Here are several frequently-used regex quantifiers (but there are several more):

|Quantifier|Description|
|--- |--- |
|`*`|matches the previous element zero or more times|
|`+`|matches the previous element one or more times|
|`?`|matches the previous element zero or one time|
|`{n}`|matches the previous element exactly n times|
|`{n}`|matches the previous element at least n times|
|`{n, m}`|matches the previous element at least n times but no more than m times|



Let’s take a look at some examples that put regex classes and quantifiers to work.

## US Social Security number

First, we’ll consider a US social security number, which is always in the format `nnn-nn-nnnn` , where n is a single digit.

```
Source = '345-15-4978'
Re = '\d'
m = Regex.Match(Source, Re) 
```

This produces a match because `Source` contains a digit. That pattern isn’t specific enough, let’s try something better.

```
Source = '345-15-4978'
Re = '\d\d\d-\d\d-\d\d\d\d'
m = Regex.Match(Source, Re) 
```

This match works. It looks for three digits, a dash, two digits, a dash, and then four digits. It’s a little verbose, to tighten it up further the pattern could also be (and probably should be) written like this:

```
Source = '345-15-4978'
Re = '\d{3}-\d{2}-\d{4}'
m = Regex.Match(Source, Re) 
```

That seems like it might be the best pattern for the job, doesn’t it? However, consider the match below. Does it return success?

```
Source = 'Neil 345-15-4978 Young'
Re = '\d{3}-\d{2}-\d{4}'
m = Regex.Match(Source, Re) 
```

Be careful. This returns success because the pattern is in the string. The best pattern for a US social security number is probably:

```
Source = '345-15-4978'
Re = '^\d{3}-\d{2}-\d{4}$'
m = Regex.Match(Source, Re) 
```

In this case, we’ve added the `^` character and `$` character to anchor the search at the beginning and ending of the input string. This forces the search pattern to be the entire value being matched. In many (perhaps most) cases, it’s necessary to add the `^` and `$` anchors for the most reliable results. This example is a reliable pattern with which to test a US social security number, however, we can improve it by grouping its major patterns.

```
Source = '345-15-4978'
Re = '^(\d{3})-(\d{2})-(\d{4})$'
m = Regex.Match(Source, Re)
```

Adding the groups above doesn’t change the pattern functionally, but improves its human comprehension.

[Try this pattern online](https://regex101.com/r/dW1lG7/1) 

## Using regular expressions with URLs

URLs are great playgrounds for regular expressions. Alas, attempting to use URLs with regular expressions reveals what you’ve probably been thinking all along: “This regex stuff is cool, but I’m betting it can get you in big trouble.” That’s true. It’s possible to get carried away, very carried away, with regular expressions. [This page shows at least 12 regular expressions](https://mathiasbynens.be/demo/url-regex) to parse a URL. One of them is 1,347 characters long!

Let’s be clear about regular expression usage. If, after learning basic regex syntax, using a regular expression makes the problem harder to solve than an old-timey brute force method, you’re doing something wrong. The qualifier “after learning basic regex syntax” is important. Without a little study and effort, regex won’t make anything easier. But with basic regex skills under your belt, the declarative, concise nature of regular expressions is usually a much better approach than pretzel logic full of `substring()` and `indexOf()`. Give regex a chance–but don’t go off the deep end!

With the sermon over, let’s see what parsing a _simple_ URL can teach us. The next several examples will only show the `Source` and `Re` for clarity. What follows below is intended to explain regular expressions and not intended to be the definitive way to define a URL with a regex (I don’t think there is one!). Consider the example below. Does it match?

```
Source = 'https://www.asna.com'
Re = '^http'
```

It does. But how could we provide a pattern that matches URLs that start with either `http` or `https`?

```
Source = 'https://www.asna.com'
Re = '^https?' 
```

The `s?` added to the pattern above makes the pattern specify the string start with `http` followed by an optional `s`. In this case, we’re using the `?` quantifier to specify zero or one time. Let’s add the slashes and the colon to make the first part of our regex include the full protocol specification:

```
Source = 'https://www.asna.com'
Re = '^https?://' 
```

The pattern above successfully matches the full protocol, but forward classes are one of regular expressions’ cross platform weaknesses. Some implementations of regex (Javascript and PHP, for example) don’t like unescaped forward slashes. I’d generally write the regex above like the one shown below:

```
Source = 'https://www.asna.com'
Re = '^https?:\/\/' 
```

This makes the pattern start to look a little goofy, but if you write AVR _and_ JavaScript committing to escaping regex forward slashes will keep you out of trouble. Let’s add one more bit of clarity to our pattern:

```
Source = 'https://www.asna.com'
Re = '(^https?:\/\/)' 
```

This doesn’t change the pattern for the regex engine, but adding the parentheses contributes to readability and, as we’ll find, makes it possible later to easily identify and capture the enclosed match. Let’s take the subdomain, which is optional. Does the following pattern work?

```
Source = 'https://www.asna.com'
Re = '(^https?:\/\/)www?' 
```

Nope. At first glance, it looks like it might, but this illustrates the specificity demanded by regex. The pattern above doesn’t look for an optional `www` but rather checks to see if the domain is `ww` or `www`. In this case, we need to group the match:

```
Source = 'https://www.asna.com'
Re = '(^https?:\/\/)(www)?' 
```

The question mark is a quantifier that promises to match zero or one of the previous elements. The parentheses around `www` define it as the previous element. There is one more thing to do for the domain name. Let’s fully group it.

```
Source = 'https://www.asna.com'
Re = '(^https?:\/\/)((www)?)' 
```

As before, when we grouped the protocol, these parentheses don’t change the search pattern but help provide readability. They make more clear the fact that the `?` applies just to the `(www`). And, again, they are going to later let the domain name be easily extracted. Now we need to add the dot between the subdomain name and the domain name. Does the pattern below do that? (Hint: What does the regex dot (or a period) character class specify?)

```
Source = 'https://www.asna.com'
Re = '(^https?:\/\/)((www)?).' 
```

Alas, the pattern above doesn’t look for a dot, but rather \*any\* character. To look for a literal dot, we need to escape it (and we’ll also group it), as shown below:

```
Source = 'https://www.asna.com'
Re = '(^https?:\/\/)((www)?)(\.)' 
```

Now we need to add the domain name, which can contain numbers, letters, dashes, and be between 2 and 63 characters long. To tackle this one we’ll create our own character class.

```
Source = 'https://www.asna.com'
Re = '(^https?:\/\/)((www)?)(\.)[\da-z\.-]'
```

Our character class, the last group in brackets, specifies:


|Regex|Description|
|--- |--- |
|`\d`|Any Digit|
|`a-z`|Any lower-case character|
|`–`|A dash|

This character class works but doesn’t apply length constraints nor is it grouped. The example below does that:

```
Source = 'https://www.asna.com'
Re = '(^https?:\/\/)((www)?)(\.)([\da-z\.-]{2,63})'
```

The pattern above adds the `{n, m}` qualifier to allow domain name lengths of 2 through 63 characters. It also groups the domain name with parentheses. We’re almost done. Let’s add the dot to come after the domain name and before the top-level domain name (just like we did for the dot separating the subdomain and domain names).

```
Source = 'https://www.asna.com'
Re = '(^https?:\/\/)((www)?)(\.)([\da-z\.-]{2,62})(\.)'
```

With the dot added, we only need add the pattern for the top-level domain name. I found varying rules on the Internet as to the maximum length of a top-level domain name–but apparently, the longest in existence is 24 characters, so we’ll use that constraint.

```
Source = 'https://www.asna.com'
Re = '(^https?:\/\/)((www)?)(\.)([\da-z\.-]{2,62})(\.)([a-z]{2,24})$'
```

The top-level domain is defined by the \[a-z\]{2,24} pattern–which looks for a two to 24 length string with the letters `a` through `z` in it. This pattern is grouped with parentheses and then the end-of-string anchor `$` is added to ensure there aren’t any spurious trailing characters.

[Try this pattern online](https://regex101.com/r/lG9yL7/3)

