---
title: A simple date picker for AVR for .NET ASP.NET websites
description: This article shows how to use HTML's intrinsic date picker in an ASP.NET web app.
tags:
  - asp-net
  - visual-rpg
date_published: '2024-01-08T23:31:20.000Z'
date_updated: '2024-01-09T05:32:37.000Z'
date_created: '2024-01-09T05:32:37.000Z'
pinned: false
---

In the early days of Web development, we had to scrounge around to find solutions to what seemed like the most basic of things. Date input, for example, was a challenging thing to handle manually. To solve the challenge, we often turned to UI libraries. The jQueryUI library offered a date picker component that many used.

Back in the day, this library solved lots of Web development issues. It also provided tabs, menus, and dialogs. Today, though, most of the reasons that we used jQueryUI and its sibling, jQuery have been resolved by HTML and CSS becoming so much more capable.

For example, HTML acquired a native date picker many years ago. This date picker is very simple to use and offers nearly all of the functionality that the jQueryUI date picker had. Using the native HTML date picker with AVR for .NET and ASP.NET is very easy, but not immediately obvious.

Consider the following code that provides an ASP.NET TextBox control:

```
<asp:textbox runat="server"></asp:textbox>
```

This produces a text box that accepts string input. This ASP.NET control translates to this HTML at runtime:

```
<input name="txtboxDate" type="text" id="txtboxDate">
```
Note how ASP.NET sneaked in the type="text" attribute.

All it takes to make the ASP.NET Textbox control gracefully prompt for a date is to add a special-case type attribute of Date to your ASPX markup:

```
<asp:textbox id="txtboxDate" type="date" runat="server"></asp:textbox>
```

You have to add the `type="Date"` attribute by hand in the ASPX page markup. By adding that attribute, at runtime the HTML produced changes slightly to include the Date attribute value:

```
<input id="txtboxDate" name="txtboxDate" type="date">
```

ASP.NET is smart enough to realize that you’ve specified a value for the text attribute and won’t overwrite it with the default Text value. This produces a date input element that looks like this:

![HTML intrinsic date picker](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/date-picker-collapsed.png)

When you click the calendar icon HMTL presents its intrinsic date picker:

![HTML datepicker expanded](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/date-picker-expanded.png)

The format of the date displayed is based on the locale of the user’s browser however the value sent to the server is always passed in the format YYYY-MM-DD. That value comes into your AVR for .NET WebForm code-behind as a string value.

## Assign a default starting date

Assign a default date value as a string in the format "YYYY-MM-DD." Assign the default value before the Web form is presented.

```
txtboxDate.Text = "1959-06-02"
```

## Converting the incoming date

Convert the incoming date to a DateTime field:

```
DclFld shippingDate Type(DateTime)
shippingDate = DateTime.ParseExact(textBoxShippingDate.Text, 
               "yyyy-MM-dd", 
               System.Globalization.CultureInfo.
               InvariantCulture)
```

or, to convert it to a numeric value in the format mm-dd-yyyy

```
DclFLd dateNumber type(*Packed) Len(8,0)
dateNumber = ShippingDate.ToString("MMddyyyy")
```

[See this article for more information on date conversion.](/en/kb/visual-rpg-numeric-dates)

## The one downside

The one downside to using HTML’s intrinsic date picker is that its display cosmetics are left to browser vendors and each browser displays the date picker differently. There are some 
[CSS tricks](https://www.tutorialspoint.com/Style-options-for-the-HTML5-Date-picker) you can use to try to style HTML’s date picker–but I’ve not found any CSS tricks very useful for the date picker.