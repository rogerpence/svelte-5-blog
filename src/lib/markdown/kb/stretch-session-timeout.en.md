---
title: How to stretch ASP.NET session timeout
description: This article shows how to stretch ASP.NET session timeout. This technique is good for Wings and Monarch to limit aborted session length.
tags:
  - asp-net
  - datagate-ibm-i
  - mobile-rpg
  - monarch
  - wings
date_published: '2024-01-09T00:43:06.000Z'
date_updated: '2024-01-09T06:47:21.000Z'
date_created: '2024-01-09T06:47:21.000Z'
pinned: false
---


Most AVR-driven ASP.NET Websites use the Session object to save the state of some variables. For example, a customer number may be stashed in a Session variable like this:

    Session['custom-number'] = 673
    

when the user requests a page (the same page or another page), that value is available for your logic to fetch and do something with. For example, let's assume the user clicks a button to take the app to a new page and that page's logic needs the current customer number. That number could be fetched in the code-behind like this:

```
CustNo =  Int32.Parse(Session['customer-number']) 
```

(As an aside, session variables must also be converted to a specific type before assigning them to a typed variable)

### How long is that customer number available?

That customer number is available for as long as the Session object is active. Session life is dictated by the ASP.NET Session timeout value. Each time a postback occurs the timeout clock starts anew. The default timeout value is 20 minutes, or [you can explicitly set it to a given value in the web.config file.](https://msdn.microsoft.com/en-us/library/h6bb9cz9(VS.71).aspx) For example, this web.config setting sets session timeout to 60 minutes:

```
<sessionState timeout="60"/>
```

The `timeout` value must be provided in minutes. As long as the user causes a postback to the server within the timeout value, the session is persisted and therefore the customer number in the session variable is persisted. Assuming a default 20-minute session timeout, if the user leaves a page idle for an 18-minute coffee break, the value is persisted and the app continues normally. However, if the user leaves a page idle during a 22-minute coffee break, the next time the user attempts a postback (by clicking an app button or some other interaction with the app) the customer number is no longer available (which most likely manifests itself with the notorious "Object reference not set to an instance of an object" error message and the app stops working.

In some cases, session timeout more than 20 minutes long is desirable. Consider an app in use on a shop room floor. An engineer may be going back and forth between the assembly line and the app many times during the day. In that case, the customer must persist for more than 20 minutes. I've heard of 8 or even 12-hour session timeouts to avoid timeout issues in a case like this.

The problem with very long session timeouts is that the session timeout also often dictates when application "clean up" operations are performed. This is especially true with an application modernized with ASNA Wings, ASNA Monarch, or a custom mobile app written with ASNA Mobile RPG. In those cases, the associated IBM i job will not end until the session ends. Beyond those examples, though, you may have clean-up processes of your own triggered by `Session_End` event handler (as defined in the `global.asax` file).

The important thing to remember is that the user session doesn't end on the server until the session timeout value has expired. Any server-side operations based on session timeout occurring don't occur when the browser closes, but rather when the session times out. The server has no knowledge of the user simply closing the browser. That client-side action imposes no control on session time-out. As a general rule, once the user is done with the app (ie, when the user closes the browser), you want your clean-up operations to perform as soon as possible.

### Stretching session timeout

An alternative to a hard-coded session timeout is stretching the session. There isn't a session-stretching mechanism built into .NET, but it's pretty easy to roll your own—and it requires no JavaScript. Using this technique, a user's session won't ever timeout under regular activity. However, after the user closes the browser or the browser tab in use, that user's session expires in three minutes.

**Step 1.** The key to this technique is using the much maligned HTML `iFrame` tag. If your app uses master pages, add this code to the master pages' markup under the body `tag` (if you aren't using master pages, you'll need to add this code to _every_ page's markup):

```
<iframe src="<%=Page.ResolveClientUrl("~/StretchSession.aspx")%>"width="0" height="0" style="display:none;">
```
   
The `iframe` tag has an inline style tag with `display:none`. Without this style, the `iframe` displays an odd little mark on the page.

**Step 2.** In the `web.config`, set the session timeout to three minutes:

```
      <system.web>
        <sessionState timeout="3"/>
        <compilation debug="true" targetFramework="4.5"/>
      </system.web>
```      

The timeout value you're setting here controls how quickly the session times out of the server when the user closes the browser. As long as the user has the app running in a browser, its session will be stretched indefinitely. Depending on your on your needs, you may make this value greater than three minutes, but, as will soon be discussed, don't set it for much less than three minutes. 

**Step 3.** In the root of the app, create a page called `StretchSession.aspx`, being sure to _not_ specify a master page for this page. This page will never be seen by users. In the markup for the `SesssionStretch.aspx` page, add these three lines to its `head` tag:

```
<head runat="server">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0"> 
    <meta http-equiv="refresh" content="55;url='StretchSession.aspx'"/> 
</head>
```    

These three `meta` tags are the key to this technique, with the `meta http-equiv="refresh"` doing the most interesting thing. This line reloads `StretchSession.aspx` automatically every 55 seconds or so (this meta tag is how this technique avoids JavaScript). When this page refreshes, a postback doesn't occur because the page is loaded within the `iframe` in the master page (or the current page if you aren't using master pages). The reload of this page 55 seconds restarts the session timeout clock. Recall that the session timeout is configured for three minutes. The difference between the 55-second refresh and the three minutes is to ensure that a little network latency doesn't cause problems.

A first pass at this technique had the meta refresh tag load a simple HTML file on the theory that sending _any_ request back to the server would refresh the session timeout. However, a quick bit of testing showed an ASPX page was required to stretch the session (even though the page has no code). I am guessing, but the ASPX page is probably required to ensure the ASP.NET pipeline is invoked when the `StretchSession` page is sent.

Once you get your app running, fire up your favorite Web browser developer tools. You'll see that the meta tag submits your StretchSession page submitted every 55 seconds or so, with no flicker or other artifacts of the page being submitted—but that page submission causes the session to get stretched ("refreshed" might be a better word).