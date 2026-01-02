---
title: Preserving application state in ASP.NET
description: This article shows three ways to preserve application state in your Visual RPG ASP.NET web apps
tags:
  - asp-net
  - visual-rpg
date_published: '2024-01-08T23:31:20.000Z'
date_updated: '2024-01-09T05:32:37.000Z'
date_created: '2024-01-09T05:32:37.000Z'
pinned: false
---

Application state is the data that links the various parts of an application together. This data may be scalar values, binary values, or even open files that provide information to the application’s various Windows forms or display file record formats. One substantial difference between Web applications and desktop-bound fat Windows programs or green-screen RPG programs is how application state is managed.

With traditional desktop-bound Windows apps and RPG applications, application state is easy to manage–so easy that it’s usually taken for granted. Through a (usually very large) set of global variables, the program moves the user easily to other forms or record formats. ASP.NET Web applications impose a substantial constraint on this model. Application state isn’t implicitly persisted in an ASP.NET Web app. Open files don’t persist across pages, nor do application variables. You need to manage ASP.NET Web application manually.

IBM i RPG programmers are probably familiar with a job’s local data area. This is a free-format state persistence mechanism that, for all intents and purposes, stores key/values for use later. ASP.NET’s state persistence mechanisms are a little like the LDA. They each offer value pair storage of data that is loosely defined–that is, you can create and store key values on the fly. You don’t have to create a predefined formal container (like you do a physical file) to persist ASP.NET app state.

ASP.NET offers three primary state-saving mechanisms, each of which have a different scope:

*   **View state** (purple)- persists data state for a single page. Once the user moves off of that page, view state data for that page is discarded and started afresh for the new page. View state data is implemented as a hidden HTML element on the page. It "rides" with the page as is it posted back.
*   **Session state** (green) – persists data for a user’s session. By default, a session lasts 20 minutes. Anything put in the session state persists as long as the session is alive and is available to all pages of the Web app. This is per session so if a user starts two sessions on a single desktop (for example, opening a second one with an incognito browser instance), each of those sessions have their own distinct session data.
*   **Application state** (orange) – persists data for the entire application. Anything in application state is available to all users of the application.

![ASP.NET application state](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/asp-net-app-state.png)

Figure 1. View state, session state, and application state scope

[Read more these and other ASP.NET state management techniques.](https://learn.microsoft.com/en-us/previous-versions/aspnet/75x4ha6s(v=vs.100))

### View state

View state is enabled by default for all UI elements in ASP.NET–because their `EnableViewState`property defaults to `true`. When that property is `true`, the control’s state persists across page postbacks (the page posting back to itself) implicitly. For example, consider a page with a GridView. View state ensures that the grid data persists across postbacks. View state values are page-specific; values saved from one page are not available on other pages.

ASP.NET’s view state container is a key/value pair collection. In addition to controls using View state implicitly, you can also explicitly save page values to view state. For example:

```
    DclFld Customer Type(*Integer4) 
    
    CustomerNumber = 9800
    // Set the customer number to view state:
    ViewState['customerNumber'] = CustomerNumber
    ...
    // Get the customer out of view state:
    CustomerNumber = Convert.ToInt32(ViewState['customerNumber'])
    
    // AVR implicitly converts strings to numeric values, so you could also do this:
    CustomerNumber = ViewState['customerNumber'].ToString()
```    

View state values (like session and application state values) are stored as `System.Object` values and must be explicitly converted when you fetch values from view state. This code would fail

```
    CustomerNumber = ViewState['customernumber']
```    

with the error:

```
    Cannot convert System.Object to *Integer4
```    

> **Watch your case**. Keys are case-sensitive for view state, but not so for session and application state. Try to make it a point to keep all of your keys short and lower-case to avoid any case-incurred errors (and to avoid needing to remember the special case of which one is case-sensitive).

View state can store scalars and object values. ASP.NET implicitly serializes/deserializes these values for the get and set operations. For example:

Set and get an array in view state:

```
    DclArray rates Type(*Integer4) Rank(1) 
    
    rates = *New *Integer4[] {55, 56, 57}
    
    // Set the view state value
    ViewState['rates'] = rates
    
    // Get the view state value     
    rates = ViewState['rates'] *As *Integer4[]
```    

Set and get an object instance in view state:

```
    DclFld li Type(ListItem)
    
    li = *New ListItem('neil', 77)
    
    // Set the view state value
    ViewState['artist'] = li 
    
    // Get the view state value
    li = ViewState['artist'] *As ListItem 
```    

Just before a page is rendered, ASP.NET collects all of the current view state values and encodes them in a single string stored in a hidden HTML `input` tag with its `name` and `id` attributes both being `__VIEWSTATE`.
  
View state is a good thing but it’s also, at least potentially, a bad thing. It’s good in that it is an easy way to persist state and therefore it makes Web app creation easier. On the other hand, because view state is enabled by default _for every control_ if you aren’t careful view state can dramatically increase the size of the page you’re sending across the network. As you’re placing controls on your forms, carefully consider if you really need view state enabled for that control. If you think preserving view state isn’t necessary for a control, set the control’s `EnableViewState` property to `false` and test the app. If the app breaks, set the value back to `true`. In most cases your controls probably do need view state enabled.

![Disable view state](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/disable-view-state.png)

Figure 2. An ASP.NET control’s EnableViewState property

By default view state is encoded ([via a page’s EnableViewStateMac property](https://learn.microsoft.com/en-us/dotnet/api/system.web.ui.page.enableviewstatemac?view=netframework-4.8.1)) to ensure its value hasn’t been tampered with on the client. Despite this protection, it’s probably best to avoid using view state for sensitive data.

### Session state

There are several ways to persist session state:

*   **InProc mode**, which stores session state in memory on the Web server. This is the default and the one we’ll be discussing here.
    
*   **StateServer mode**, which stores session state in a separate process called the ASP.NET state service. This ensures that session state is preserved if the Web application is restarted and makes session state available to multiple Web servers in a Web farm.
    
*   **SQLServer mode** stores session state in a SQL Server database. This ensures that session state is preserved if the Web application is restarted and makes session state available to multiple Web servers in a Web farm.
    
*   **Custom mode**, which enables you to specify a custom storage provider.
    
*   **Off mode**, which disables session state.
    

[See this page](https://learn.microsoft.com/en-us/previous-versions/aspnet/ms178581(v=vs.100)) for details on configuring session state.

Regardless of the session state mode, setting and getting a session variable is similar to setting and getting a view state variable:

```
    DclFld Customer Type(*Intreger4) 
    
    CustomerNumber = 9800
    // Set the customer number to view state:
    SessionState['customerNumber'] = CustomerNumber
    ...
    // Get the customer out of view state:
    CustomerNumber = Convert.ToInt32(SessionState['customerNumber'])
    
    // AVR implicitly converts strings to numeric values, so you could also do this:
    CustomerNumber = SessionState['customerNumber'].ToString()
```    

The code above makes the `customerNumber` keyed session variable available to all pages of the Web application for the duration of the application’s session. Like view state variables, you can assign both scalars and object instances to session values.

### Application state

Application state is very much like session state, the primary difference is that application state is global to all users of the Web app. The syntax for setting and getting application state variables is just like that with view state and session state.

Setting and getting application variables works just like it does with view state and session variables:

```
    DclFld EmailAdmin Type(*String) 
    
    EmailAdmin = 'admin@asna.com'
    
    // Set the customer number to view state:
    Application['email-admin'] = EmailAdmin
    ...
    // Get the customer out of view state:
    EmailAdmin = Application['email-admin'].ToString()
 ```

It’s common to set application-wide variables in the `global.asax` file’s `ApplicationStart` event. For example, the code below stores the administrator’s email address to an `appSettings` value in the `web.config` file.

```    
    <appsettings>
        <add key="email-admin" value="admin@asna.com">
        ...
```        

The code below saves that email address in an application variable in `global.asax's` `Application_Start` event (which fires once when the app is started by the first user requesting a page):

```
    BegSr Application_Start
        DclSrParm sender Type(*Object)
        DclSrParm e Type(EventArgs)
    
            // Code that runs on application startup
        Application['email-admin'] = System.Configuration.ConfigurationManager.AppSettings["email-admin"]
    EndSr
```    

Later in the app, you would get that email address like this:

```    
    DclFld EmailAdmin Type(*String) 
    
    EmailAdmin = Application['email-admin'].ToString()
```    

### Considering sensitive data

View state data should never be considered secure–beware of putting highly sensitive information in view state.

Application state and Session state are generally secure–these values all live in memory on the server (when you are using InProc session state). That said, a clever hacker with access to your Web server could conceivably take memory dump snapshot and try to find sensitive data. That scenario isn’t likely (I’ve never heard of it happening in 20+ years of ASP.NET), but it could. At the very least, it’s a reminder to keep your Web server very secure.

There may also be Sarbanes Oxley-like rules that prohibit using view, session and application variables for sensitive data. Before saving any highly sensitive data with these mechanisms check with your security officer. You may need to consider persisting highly sensitive values to a secure data store like a file or table.

### Beware the "Object reference not set to an instance of an object" error!

An ASP.NET error that you’ll probably see a lot, especially in your early days of learning AVR and ASP.NET, is the dreaded "Object reference not set to an instance of an object" error.

![The yellow screen of death reporting a null object reference](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/object-not-instanced.png)

Figure 3. The yellow screen of death reporting a null object reference

That error is shown above as reported in ASP.NET’s so-called ‘yellow screen of death" runtime error. In this case the code is trying to fetch a session variable keyed as `'numberxx'`. Several different conditions can lead to this error, but fetching values from one of the three state persistence mechanisms is one of the major offenders. Take great care with your keys. They are easy to specify incorrectly and sometimes devilish to track down.

> A friendly hint: If you get the error above, ASNA Tech Support can’t be much help with it. It isn’t an AVR- or .NET-caused issue, it’s a problem with program logic (or poor typing!). You’ll need to get your debugging magnifying glass out and start digging! The error shown here is easy to find because the app is running under debug; but when the app is running in production you won’t get the line number or variable name info.

To avoid this error, you can first test to see if the key exists (this also works with view state and application state keys):

```
    If Session['numberxx'] = *Nothing
        CustomerNumber = Session['numberxx'].ToString()
    Else 
        CustomerNumber = 0
    EndIf 
```    

### Cleaning up after yourself

Session and application values use Web server memory. It’s prudent to keep these values in memory for only as long as they are needed. When they are no longer needed, delete them like this:

```
    Session.Remove('customernumber') 
    
    Application.Remove('email-admin')
```    

While that impact is usually negligible, if your application scales to many users the memory demands may be high. That said, the trouble you’re most likely to get into with session/application variables probably isn’t about server performance, it’s about being sloppy with them and frittering them about the application. Session and application variables are, for all intents and purposes, global variables. And what is the path to hell paved with? Global variables.