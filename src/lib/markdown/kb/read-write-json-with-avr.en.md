---
title: Read and Write Json with AVR for .NET
description: This article explains now to read and write JSON data with ASNA Visual RPG for .NET.
tags:
  - visual-rpg
date_published: '2024-01-09T20:59:40.000Z'
date_updated: '2024-01-10T05:29:39.000Z'
date_created: '2024-01-10T05:29:39.000Z'
pinned: false
---
Json is a data interchange format. It is especially popular for transmitting data between a browser client and a Web server, but is also often used for other things such configuration files ([Visual Studio Code](https://code.visualstudio.com/) and [Sublime Text](https://www.sublimetext.com/) for example) and even database storage ([such as MongoDB](https://www.mongodb.com/)). This article takes a look at reading and writing Json with ASNA Visual RPG (AVR).

Douglas Crockford surfaced Json in 2001. If you've never heard Crockford speak, go watch [Discovering JavaScript Object Notation with Douglas Crockford](https://www.youtube.com/watch?v=kc8BAR7SHJI) and [Douglas Crockford: The JSON Saga](https://www.youtube.com/watch?v=-C-JoyNuQJs). The videos are particularly interesting in how Crockford got Json to be taken seriously as a "standard." By the way, because Crockford pronounces Json as ‘Jason' (as in [Jason and the Argonauts](https://www.youtube.com/watch?v=__Z4f6rEWvM)) that's what I do. But if you prefer, you can also pronounce Json as ‘[jay-sawn'](https://www.youtube.com/watch?v=_NFkzw6oFtQ) (which sounds affected and highfalutin to me!).

‘Json' is is an acronym that stands for JavaScript Object Notation. Json can be thought of as a way to define data structures in JavaScript and this object notation is built into JavaScript natively. Json is very popular because, as opposed to XML, it requires no parsing in browser clients. Here is a very simple Json structure that defines two value pairs with, one with a `name` key and one with `group` key–the former with a value of  `Neil Young` and the later with a value of `Buffalo Springfield`.

```
{"name":"Neil Young", "group":"Buffalo Springfield"}
```
The [full Json spec](http://www.json.org/) explains all of the details, but Json's rules are pretty simple–especially if you know JavaScript. Json is essentially one or more key/value pairs (if you're familiar with Python dictionaries, Json will look very familiar). To use the example above in JavaScript, the following JavaScript:

<pre>
j =  &#123;"name":"Neil Young", "group":"Buffalo Springfield"&rbrace;;
</pre>

emits "Neil Young" to the console. Because there is effectively no parsing with Json, Json quickly replaced XML as Ajax's standard data format. As Json all but made XML obsolete with Ajax, AJAX lost its uppercase name and quit being an acronym for "Asynchronous JavaScript and XML" and simply became Ajax, the general name of a technique to push data between a client and a server. 

The Json below is a little more sophisticated–but even at that, it's still just key/value pairs. White space is insignificant to Json and following could also be written on one line or without indention.
```
{
  "CPU": "Intel",
  "Cores": 8,
  "Drives": [
    "DVD read/writer",
    "1TB Sata 7200",
    "250GB SSD"
  ],
  "Manufacturer": {
    "Name": "Bob's Drives",
    "Street": "331 Jefferson",
    "City": "Gas City",
    "State": "IN",
    "ZipCode": "78216"
  }
}
```
Figure 1. Json structure with simple value pairs and array and nested object value pairs.

## Using Json with .NET

While .NET has some Json-related code baked into it, .NET Frameworks's intrinsic Json-related classes pale in comparison to the [Json.NET open source project](http://www.newtonsoft.com/json). Json.NET is the most popular .NET package on nuget with nearly 35 million downloads. 35,000,000 million! Json.NET does more with Json than most mortals would ever care about, but its core features of reading and writing Json stand out (and probably provide the reason for most of those 35m downloads). This article takes a look at two ways to read and two ways to write Json with Json.NET.

First, you'll need to [download Json.NET](http://www.newtonsoft.com/json). After doing that, you'll need to set a reference to the one of the several .NET versions of the Newtonsoft.Json.DLL provided. Check your project's properties to ensure what version of .NET it's using and then set a reference to the corresponding Json.NET DLL (shown below). After that, you're ready to code.


![Showing the .NET Framework version needed](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/projectproperties-1.png)
Figure 2. AVR project properties showing .NET framework version in use.

This article shows two ways shown to write and read Json. The first write/read pair uses brute force to access the Json. These methods are procedural and potentially error prone, but are often appropriate for small, ad hoc Json work. Take care using this procedural style of Json processing. 

The second write/read pair is far more declarative (pushing the hard work needed to work with Json to Json .NET's object serialization/deserialization smarts). There is surprisingly little code for this second pair of techniques, but they require the existence of data classes. While this might seem annoying, a little setup with data classes paves the way for more obvious and direct coding.

All four of the following examples work with the Json shown in Figure 1.

## Write Json with JsonTextWriter

If you need to produce ad hoc Json and find yourself using the StringBuilder or string literals and string concatenation, that's an indication you need Json.NET's [JsonTextWriter](http://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_JsonTextWriter.htm) object. This solution is ideally suited for creating small chunks of Json. Building Json with a specialized Json writer ensures you'll end up with valid Json–if the code compiles the Json it produces will be valid (it might not be the correct Json, but it will be valid valid, syntax-checked Json). Compare this to string concatenation or StringBuilder append-driven techniques. With those techniques, it's easy to make silly Json syntax mistakes.

<pre>
DclFld sb Type(System.Text.StringBuilder) New()
    DclFld sw Type(System.IO.StringWriter) 

    sw = *New System.IO.StringWriter(sb) 
    BegUsing writer Type(NewtonSoft.Json.JsonTextWriter) Value(*New NewtonSoft.Json.JsonTextWriter(sw))
        writer.Formatting = NewtonSoft.Json.Formatting.Indented
        writer.WriteStartObject()
            writer.WritePropertyName("CPU")
            writer.WriteValue("Intel")
            writer.WritePropertyName("Cores")
            writer.WriteValue(8i)
            writer.WritePropertyName("Drives")
        
            writer.WriteStartArray()
                writer.WriteValue("DVD read/writer")
                writer.WriteValue("1TB Sata 7200")
                writer.WriteValue("250GB SSD")
            writer.WriteEndArray()
        
            writer.WritePropertyName("Manufacturer")
        
            writer.WriteStartObject()
                writer.WritePropertyName("Name")
                writer.WriteValue("Bob's Drives") 
                writer.WritePropertyName("Street")
                writer.WriteValue("331 Jefferson") 
                writer.WritePropertyName("City")
                writer.WriteValue("Gas City") 
                writer.WritePropertyName("State")
                writer.WriteValue("IN") 
                writer.WritePropertyName("ZipCode")
                writer.WriteValue(78216I) 
            writer.WriteEndObject()
        writer.WriteEndObject()
    EndUsing 

    System.IO.File.WriteAllText("c:\users\roger\documents\new-test.json", sb.ToString())
</pre>    

**Figure 3a. Writing Json with Json.NET's JsonTextWriter**

The quite nearly self-explanatory code above produces the Json shown in Figure 1. When using the `JsonTextWriter` you must be sure to pair methods that signal Json construct's start and end boundaries. Writing code like this is one of the very rare times when I use contra code indention conventions. In this code, the indention doesn't indicate nested logic, but rather nested data. You don't have to indent code like this, but when you're building a nested Json document, it helps keep things clear and start/ends matched.

In Figure 3a's code, the Json is built up in .NET's [System.Text.StringBuilder class](https://msdn.microsoft.com/en-us/library/system.text.stringbuilder(v=vs.100).aspx). Using the StringBuilder's ToString() method provides easy access to the Json this technique produces.

White space is insignificant to Json. For development/debugging work, it's good to set Json formatting to indented (see line 7 in Figure 3a). For production work you'll probably want to use:

```
writer.Formatting = NewtonSoft.Json.Formatting.None
```

## Read Json with Json.NET's JObject

Json.NET makes ad hoc reading of Json easy with its [JObject](http://www.newtonsoft.com/json/help/html/t_newtonsoft_json_linq_jobject.htm). This object makes a Json document look and feel like a specialized nested dictionary. The code below in Figure 3b shows how to use the JObject. It assumes a Json document is available in a string variable. This can be the result of a Web request or having read a text file containing a valid Json document. In line 12, Figure 3b fetching an entire Json document is made easy with .NET's File class's [ReadAllText()](https://msdn.microsoft.com/en-us/library/system.io.file.readalltext(v=vs.100).aspx) method.

JObject returns an object with LINQ-capable queries. AVR can't exploit all of LINQ's query capabilities, but it's easy to do basic Json reading and simple queries with Json.NET's JObject and AVR.

<pre>
DclFld Cores Type(*Integer4) 
DclFld CPU Type(*String) 
DclFld Drives Type(NewtonSoft.Json.Linq.JArray) 
DclFld Drive Type(*String) 
DclFld i Type(*Integer4) 
DclFld Json Type(*String) 
DclFld JsonObject Type(NewtonSoft.Json.Linq.JObject)
DclFld Street Type(*String) 
DclFld ZipCode Type(*Integer4) 

// Get raw Json.         
Json = System.IO.File.ReadAllText('c:\users\roger\documents\test.json') 
JsonObject = NewtonSoft.Json.Linq.JObject.Parse(Json) 

CPU = JsonObject['CPU'].ToString()
Cores = Convert.ToInt32(JsonObject['Cores']) 
Drives = JsonObject['Drives'] *As NewtonSoft.Json.Linq.JArray
CPU = Drives[0I].ToString() // Note coercion of 0 literal to long integer.

// Note you can't use ForEach with JArray--you gotta split em manually as above. 
For Index(i = 0) To(Drives.Count - 1)
        Drive = Drives[i].ToString() 
        Console.WriteLine(Drive)             
EndFor 

Street = JsonObject['Manufacturer']['Street'].ToString()
ZipCode = Convert.ToInt32(JsonObject['Manufacturer']['ZipCode'])
</pre>


Figure 3b. Reading Json with Json.NET's JObject

Data read with the JObject isn't strongly typed; it's up to you to cast it appropriately. For example, in line 16 in Figure 3a the `CPU` value is cast to a string and in the line 17 the `Cores` value is cast to a long integer.

If a key value is an array, line 19 shows how to cast a key value as an array. Once an array is cast, you can fetch a value out of it directly, as shown in line 21 or you can traverse the array with a For loop as shown in lines. Json.NET's JObject has some [sophisticated query capabilities](http://www.newtonsoft.com/json/help/html/t_newtonsoft_json_linq_jobject.htm) that are beyond the scope of this article.

Line 21 in Figure 3b contains an interesting little AVR feature (that is unrelated directly to reading Json). Take a look at the oddly-placed `I` in the array index below:

```
    CPU = Drives[0I].ToString() 
```    

A literal numeric value, with or without decimal places specified, is assumed to a System.Decimal. Without the `I` in the code above, a compiler error occurs because JObject's numeric array indices must be long integers. The `I` in the line above is what AVR calls a numeric literal, and it coerces the 0 literal specified to be an integer. In most cases, this is never an issue because the index specified would have been provided with a variable of type long integer. However, the ability to coerce a constant sometimes has value–as shown here. [Read more about all of AVR's literals here.](https://docs.asna.com/documentation/Help170/AVR/_HTML/Literals.htm)

### Using object serialization/deserialization to write and read Json

The previous methods of writing and reading Json are a little clumsy and ad hoc. While they certainly work, there is substantial error potential imposed by the two methods' lack of discipline and formality. For all but the simplest of Json tasks, they are very good ways to work with Json. Let's move on to a more disciplined and controllable way to work with Json: object serialization and deserialization.

These techniques are declarative and require substantially less code, but you do need [POCO objects](http://stackoverflow.com/questions/3392580/a-better-explanation-of-poco) (plain old CRL objects) for them to work. The two objects below in Figures 4a and 4b define .NET POCO objects that directly relate to the Json shown in Figure 1. Using classes like that imposes formality because the Json associated with these classes must match the given schema _exactly_.

There isn't anything too remarkable about these classes. They have public read/write properties and when the `DriveDefinition` class is instanced its constructor ensures the nest Manufacturer property gets set to a new instance of `PartManufacturer` class.

Classes needed for Json serialization/deserialization techniques:

```
BegClass DriveDefinition
    DclProp CPU Type(*String) Access(*Public) 
    DclProp Cores Type(*Integer4)  Access(*Public) 
    DclProp Drives Type(*String) Rank(1)  Access(*Public) 
    DclProp Manufacturer Type(PartManufacturer) Access(*Public)

    BegConstructor Access(*Public) 
        *This.Manufacturer = *New PartManufacturer()         
    EndConstructor
EndClass 
```
Figure 4a. A DriveDefinition class in AVR for .NET.

```
BegClass PartManufacturer
    DclProp Name Type(*String)  Access(*Public) 
    DclProp Street Type(*String)  Access(*Public) 
    DclProp City Type(*String)  Access(*Public) 
    DclProp State Type(*String)  Access(*Public) 
    DclProp ZipCode Type(*String)  Access(*Public) 
EndClass
```

Figure 4b. A PartManufacturer class in AVR for .NET.

## Write Json with object serialization

The code below in Figure 5a shows how to write the resulting Json from an instance of the `DriveDefinition` class. After creating a new instance of the class it's a simple matter of passing the class instance, and optionally the formatting option, to Json.NET's [`JsonConvert.SerializeObject()`](http://www.newtonsoft.com/json/help/html/Overload_Newtonsoft_Json_JsonConvert_SerializeObject.htm) method to get the corresponding Json (which, with this code would be the same as the Json in Figure 1).

<pre>
DclFld Drive Type(DriveDefinition) New() 
DclFld Json Type(*String) 

Drive.CPU = "Intel"
Drive.Cores = 8 
Drive.Drives = *New *String[] {"DVD read/writer", "1TB Sata 7200", "250GB SSD"}
Drive.Manufacturer.Name = "Bob's Drives"
Drive.Manufacturer.Street = "331 Jefferson"
Drive.Manufacturer.City = "Gas City"
Drive.Manufacturer.State = "IN"
Drive.Manufacturer.ZipCode = 78216

Json = NewtonSoft.Json.JsonConvert.SerializeObject(Drive, NewtonSoft.Json.Formatting.Indented) 
System.IO.File.WriteAllText("c:\users\roger\documents\new-test2.json", Json)
</pre>

**Figure 5a. Serializing a .NET object to Json.**

To test the Json created, this example uses `.NET's File.WriteAllText()` method to persist the Json to an ASCII file on disk.

If are you aren't fully familiar with AVR's array handling, a potentially jarring part of the Figure 5a may be line 6 where the Drives array is populated. See this article to read more about [AVR's ranked array shorthand](/en/kb/arrays-visual-rpg-ranked) for populating an array.

## Read Json with object deserialization

Reading Json with Json.NET's deserialization is very easy with its [`JsonConvert.Deserialize`](http://www.newtonsoft.com/json/help/html/Overload_Newtonsoft_Json_JsonConvert_DeserializeObject.htm) object–it only takes one line of code to transform a Json string into an instance of its corresponding .NET POCO class.

<pre>
DclFld Json Type(*String) 
DclFld d Type(DriveDefinition)
DclFld DriveManufacturerName Type(*String)

// Get raw Json.         
Json = System.IO.File.ReadAllText('c:\users\roger\documents\test.json') 
// Reconstitute object.
d = NewtonSoft.Json.JsonConvert.DeserializeObject(Json, *TypeOf(DriveDefinition)) *As DriveDefinition 
// Fetch desired properties through the DriveDefinition class instance returned.
DriveManufacturer = d.Manufacturer.Name
</pre>

**Figure 5b. Deserializing a .NET object to Json.**

Once deserialized, the typed `d` class instance properties are all easily available. Line 10 shows how to fetch the Manufacturer's `Name` property and all of the class instances other properties are also similarly available.

`Try/Catch` can (and should!) be used with the `Deserialize()` object to ensure the Json schema passed to the method correctly matches the specified object.

### Summary

With Json.NET, it's really easy to write and read Json with AVR. For all but the simplest cases, spend the extra time to create POCO classes to define your Json documents and use the `Serialize()` and `Deserialize()` methods. That extra time spent creating those classes pays off nicely by needing far less procedural code and providing far more error handling.

(One more Json (ok, Jason) -related thing: if you don't have the time or the desire to watch the entire 1963 version of Jason and the Argonauts, at least be sure to check out the [famous skeleton fight](https://www.youtube.com/watch?v=pF_Fi7x93PY). It's [Ray Harryhausen's](https://en.wikipedia.org/wiki/Ray_Harryhausen) stop animation at its best. That Jason, like JavaScript's Json, is pretty awesome!)