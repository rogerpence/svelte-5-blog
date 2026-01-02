---
title: Sending from node CLI
description: Sending from node CLI
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
ASNA SMTP email

SMTP AUTH settings for web apps/devices to send as no-reply@asna.com:

```
Server/smart host:    smtp.office365.com
Port: 587 (recommended) or port 25
TLS/StartTLS    Enabled
Username: no-reply@asnsa.com
Password: Wbitters82
```

`It is crazy-simple to send email from Node with the`node-mailer`NPM package.  In the example below the email body is pulled in from the`index-ro.html` file (which is a full HTML document with HTML, HEADER, and BODY tags.)

```
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: "no-reply@asna.com",
    pass: "Wbitters82",
  },
});

var mailOptions = {
  from: "no-reply@asna.com; ebowers@asna.com",
  to: "roger@asna.com",
  subject: "test",
  html: { path: "./index-rp.html" },
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
```

``
In this simple case, use this command line to send the email:

```
node send-email-js
```