---
title: windows-10-esu
description: windows-10-esu
date_created: '2025-09-17T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - windows10
---
[ESU details](https://www.microsoft.com/en-US/windows/end-of-support)
## What is the Extended Update Security program

The [Extended Security Update (ESU) program](https://learn.microsoft.com/en-us/lifecycle/faq/extended-security-updates) is a last resort option for customers who need to run certain legacy Microsoft products past the end of support. They are not intended as a long-term solution, but rather as a temporary bridge to stay secure while one migrates to a newer, supported platform. 

It includes Critical and/or Important security updates up to three years after the product's end-of-support date. ESUs do _not_ include new features, customer-requested non-security updates, or design change requests.

In the past, ESU has been available only for large enterprise customers. With Windows 10, for the first time ever, Microsoft offers ESU to Windows 10 for individual consumers. Enterprise ESU plans cover three years, the Windows 10 ESU plan is for one year only. For consumer users, the Windows 10 ESU appears in the Windows Update panel:

![|629x389](https://asna-assets.nyc3.digitaloceanspaces.com/asna-com/kb/windows-10-esu-enroll.png)

As we try to make sense out of Microsoft's ambiguous Windows 10 consumer ESU program, remember that there is only one ESU program--a part of which now available for Windows 10 consumer users. 
## How does Microsoft define an "individual" or "consumer" user

I cannot find any a definitive MS document that defines "individual" or "consumer" user. However, searching the topic I got this definition with [Chat GPT](https://chatgpt.com/c/68cc3a15-45a4-8332-bcf7-4d74c487210c) 

> Microsoft uses “individual”, “personal use”, “consumer”, “any individual using a Windows 10 device … not managed by an organization …” etc, to indicate how it distinguishes between consumers/individuals vs. businesses/organizations.
## MS ESU timeline

[October 2024](https://blogs.windows.com/windowsexperience/2024/10/31/how-to-prepare-for-windows-10-end-of-support-by-moving-to-windows-11-today/)
This was the first we heard of an ESU for Windows 10. It didn't contain any details beyond what you see here.
![](https://asna-assets.nyc3.digitaloceanspaces.com/assets/articles/esu-october-2024.png)

[June 2025](https://blogs.windows.com/windowsexperience/2025/06/24/stay-secure-with-windows-11-copilot-pcs-and-windows-365-before-support-ends-for-windows-10/)
In June 2025, MS finally shared more details on ESU for Windows 10

![](https://asna-assets.nyc3.digitaloceanspaces.com/assets/articles/esu-june-2025.png)

[September 2025](https://learn.microsoft.com/en-us/windows/whats-new/extended-security-updates)
In September, they reiterated the June 2025, but (for me at least) with confusing phrasing.
![|501x86](https://asna-assets.nyc3.digitaloceanspaces.com/assets/articles/esu-september-2025.png)

When I first read the September 2025 announcement I misread "that provides individuals and organizations of all sizes," I thought that phrase introduced a major change in the policy. I read it as the $30 ESU offer now applies to individuals and organizations of all sizes; that's not what it means. This text is simply echoing the text from the October 2024 announcement. 
## There are four types of MS volume pricing plans

A business subscribe to one of these four MS volume pricing programs to acquire the three-year, $61 (the first year) ESU. The fourth program is probably the only one that could apply, and be affordable, to our customers. 

All of these plans are not available directly from Microsoft, you must purchase one of these plans through a qualified MS partner. I scoured the Web trying to get a thumbnail price on the Open options, with no good results. 

* EA (Enterprise Agreement)
	* https://www.microsoft.com/licensing/docs/view/Enterprise-Agreement-EA-EAS-SCE
	* 500 users and/or devices
* CSP (Cloud Solution Provider)
	* https://partner.microsoft.com/en-be/partnership/cloud-solution-provider
	* 1m annually, advanced or premier support plan starting at $15k per year)
* MPSA
	* 250 or more users/devices
* Open, Open Value, and Open Value Subscription
	* 5 or more desktop PCs
	* https://www.microsoft.com/en-us/licensing/licensing-programs/open-license
	* file:///C:/Users/thumb/Downloads/Open_Programs_Overview.pdf

It is very clear that MS intends for the "consumer" $30 ESU to be to used by private-used PCs, not those being used commercially. 

It's my opinion that we should not continue to support Windows 10 after October 14th. We have told customers that's what we're going to do since January--it will not take any customer by surprise. 

I know that large corporate customers may continue to use Windows 10 through a corporate volume. Those customers aren't in our customer domain. I do realize that CVS or SWBC has the potential to be in that group, but the odds of this affecting those relations is beyond very small. And, if it does, then we make exceptions. 

I don't think the expense, effort, and grief of continuing to support Windows 10 just isn't worth it for us. 

* It's too costly and troublesome to keep Windows 10 for testing 
	* That said, MS Defender is supported through 2028 so maybe it wouldn't be so bad to keep a Windows 10 box available for testing.
	* Most malware vectors are with downloads, attachments, and links and there won't be any of that on the Windows 10 box
* If we do support Win 10, will support it for three years?  If we do support it, I think it should be for one year. 
* The likelihood of one of our customers and being enrolled in an MS Volume Pricing Plan is nearly zero.

FWIW, regardless of our decision to support Windows 10, I think customer engagement with Win 10 will be nearly zero, as it was with the security vulnerability. 
 
9 months