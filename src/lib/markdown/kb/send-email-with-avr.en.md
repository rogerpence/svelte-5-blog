---
title: How to send email with ASNA Visual RPG
description: This article shows how to use ASNA Visual RPG with the .NET Framework to send emails.
tags:
  - visual-rpg
date_published: '2024-01-11T11:57:34.000Z'
date_updated: '2024-01-11T20:08:44.000Z'
date_created: '2024-01-11T20:08:44.000Z'
pinned: false
---

[The full source for this article is available here.](https://github.com/ASNA/send-email-with-avr)

It is very easy to send email with ASNA Visual RPG. The core enablers are baked into the .NET Framework in these two namespaces:

*   System.Net.Mail.SmtpClient
*   System.Net.Mail.MailMessage

> The [documentation](https://learn.microsoft.com/en-us/dotnet/api/system.net.mail.smtpclient?view=netframework-4.8.1) for the `System.Net.Mail.SmtpClient` class says that because this class "doesn’t support many modern protocols" it is deprecated and that you should use the [Nuget MailKit](https://github.com/jstedfast/MailKit) package to send emails. However, the `System.Net.Mail.SmtpClient` has worked fine for me for a long time with the SMTP services I use. It appears to be obsolete only when used with Xamarin. [Read more about this issue here](https://stackoverflow.com/questions/43517434/is-system-net-mail-smtpclient-obsolete-in-4-7#:~:text=It%20is%20not%20obsolete%20in,obsolete%20in%20Mono%20and%20Xamarin.).

The code is [at this GitHub repo](https://github.com/ASNA/send-email-with-avr/tree/main) and provides everything you need to be sending emails quickly. You can also read [the fully annotated code here.](https://asna.github.io/send-email-with-avr/master-index.html)

SMTP configuration
------------------

The project needs an `App.config` file that provides your SMTP server configuration details. An `App.config.sample` file is included to use as a base for your tailored `App.config` file.

It needs:

*   The name or IP address or your SMTP server
*   The SMTP port (which is almost always 587)
*   The SMTP user
*   The SMTP user password
*   The email "from" address

The `App.config.sample` file:

```
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <appSettings>
    <add key="smtp-server" value="SMTP IP address or name/>
    <add key="smtp-port"  value="587"/>
      <!--
      Port 465 is deprecated and most SMTP servers require using
      port 587 to send eamil with TLS.
      -->
    <add key="smtp-user" value="smtp user"/>
    <add key="smtp-password" value="smtp password"/>
    <add key="from-address" value="email from address"/>

  </appSettings>  
</configuration>
```

Copy the `App.config.sample` file to `App.config` and fill in your SMTP provider details.

> This project was compiled with AVR 15x. This project be opened and used with higher versions of AVR. You can’t open this project with an earlier version of AVR, but if you copy and pasted the code as-in to older versions I am pretty sure it works at least down to AVR 12.x.

Send an email
-------------

This repo provides a reusable `Emailer` class that you can use to send emails through an SMTP server with ASNA Visual RPG. The project code on GitHub includes a more detailed example, but the short version of sending email with the `Emailer` class looks like this:

```
DclFld em Type(Emailer) New()

em.ToAdd(rp@asna.com)
em.Subject "This is the email subject"
em.Body = "This is the email body"

em.Send()
```

The `Emailer` class has been used successfully with several email providers including [Office 365](https://incisivesupport.com/support/index.php?/Knowledgebase/Article/View/send-email-microsoft365), [GMail](https://kinsta.com/blog/gmail-smtp-server/), and [Zoho](https://www.zoho.com/mail/help/zoho-smtp.html). If you use two-factor authentication with your SMTP provider, check its documentation. Generally, with two-factor authentication you’ll need to generate a special-case password.
