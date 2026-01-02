---
title: ASNA Security Update FAQ
description: 'This is an important security notification regarding a vulnerability discovered in two ASNA Windows Services: ASNA Assist and ASNA Registrar. We have resolved this vulnerability with updated versions of all supported ASNA products.'
tags:
  - datagate-ibm-i
  - mobile-rpg
  - wings
  - datagate
  - visual-rpg
  - announcement
date_published: '2025-07-01T23:31:20.000Z'
date_updated: '2025-07-01T23:31:20.000Z'
date_created: '2025-07-01T23:31:20.000Z'
pinned: false
---

<script>
    import ContactUs from '$components/all-locales/all-pages/ContactUs.svelte';
</script>


This is an _IMPORTANT SECURITY UPDATE_. Action is required to avoid an ASNA Windows Services vulnerability.

This is an important security notification regarding a vulnerability discovered in two ASNA Windows Services: ASNA Assist and ASNA Registrar. We have resolved this vulnerability with updated versions of all supported ASNA products.


## Action required

New product versions are available for download today. We strongly recommend avoiding any chance of threat by upgrading the affected products as soon as possible.

[Download updated products here](https://www.asna.com/downloads/en). 

[Read about product requirements here](https://www.asna.com/en/support/product-requirements).

## ASNA Vulnerability FAQ

**_What is the vulnerability?_**

The issue is related to .NET remoting, which we’ve used for years for backwards compatibility with some of our older products. This vulnerability was published by [www.cve.org](https://www.cve.org/) as CVE-2025-43713 and [its CVE record is available here](https://www.cve.org/CVERecord?id=CVE-2025-43713).

**_How quickly should I address this issue?_**

**_Immediately_**. While this vulnerability has existed for some time without reported exploitation, its existence is now confirmed. Under specific conditions, it could allow unauthorized access to a Windows machine. We strongly recommend you upgrade the ASNA products you use as soon as you can.

**_How was this vulnerability discovered?_**

The ASNA Assist and ASNA Registrar services have been in use for years and have never had a reported breach. However, the issue was recently reported after a customer’s deep security audit revealed the vulnerability. 
What, exactly, is the threat? 

The vulnerability exists only on the network where Windows machines are running the affected ASNA Assist or ASNA Registrar services.
The threat is present only when these vulnerable services are running and an untrusted user has Windows network access (e.g., via a malicious intruder or a disgruntled employee).

**_What products are affected?_**

This vulnerability affects only our Windows-based products. DataGate for IBM i is not affected. Our Visual RPG (for .NET and Classic), Wings, Mobile RPG, and DataGate for SQL Server are affected by this vulnerability and need to be updated. 

**_How do I address this issue?_**

We've resolved this vulnerability with refreshed versions of all supported products. These new versions are available for download today. We strongly recommend that you avoid any chance of threat by upgrading the affected products as soon as possible.

**_I am using a retired version of one of your products, how does this affect me?_**

You’ll need to upgrade to a supported product version protected from vulnerability. Patches will not be provided for older retired products.

**_Do I need to recompile my projects?_**

You do not need to recompile using generally available products. With retired Visual RPG for .NET projects you probably won't need to recompile. If you are upgrading from an long-retired product (AVR 4.x or AVR 5.0, for example), you may need to recompile your projects before using a newer deployment. 

**_Are there any short-term workarounds?_**

For some fat-client Windows applications, you can temporarily limit exposure. This involves enabling the ASNA Assist and ASNA Registrar services only for brief periods (e.g., to install a license key with the ASNA Registration Assistant) and then immediately disabling the services again.

ASP.NET Web applications, Web services, and Visual RPG rely more consistently on these ASNA services, making this workaround unsuitable or impractical for those environments.

This work-around is not a permanent solution and still carries risk. We strongly recommend avoiding any chance of threat by upgrading the affected products.


<div style="height: 30px;border-bottom: 1px solid gray;">&nbsp;</div>
<div style="height: 30px;">&nbsp;</div>
 

If you have any questions, please <ContactUs formTitle="Ask us a question about the July 2025 security update" 
               formSource="sent from /en/kb/security-update"            formText="click this link" 
               formStyle="link"/> or email us at support@asna.com. You can 
also call us in the US at 800-984-4847 or in Europe at +34 902 365 787.

ASNA acknowledges and thanks Jonas Vestberg of Reversec Labs for his assistance reporting and resolving this issue.
