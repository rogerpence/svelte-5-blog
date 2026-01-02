---
title: Stop Chrome from blocking "insecure" ASNA EXE downlaods
description: All ASNA download exe files are signed, and have been for years, but a recent Google Chrome update now marks our exe downloads as insecure. Note that, Microsoft Edge (as of build 131.0.2903.112), allows ASNA exe downloads with its strictest security settings.
tags:
  - asna-web-site
date_published: '2025-01-05T00:00:00.000Z'
date_updated: '2025-01-05T00:00:00.000Z'
date_created: '2025-01-05T00:00:00.000Z'
pinned: false
---
<script>
import Image from "$components/text-decorators/Image.svelte";
import ContactUs from '$components/all-locales/all-pages/ContactUs.svelte';
import Callout from "$components/text-decorators/Callout.svelte"
</script>


All ASNA download `exe` files are signed, and have been for years, but a 
recent Google Chrome update, on some Windows PCs, now marks our `exe` downloads as insecure. Note that Microsoft Edge (as of build 131.0.2903.112), allows ASNA `exe` downloads with its strictest security settings. 

There isn't anything dangerous about our `exe` files; Chrome is erroneously reporting a false positive with its security test. Until we can convince Google otherwise, the workaround to download ASNA `exe` files with Google chrome is:

1. Click the link you were emailed to download the file. 

The file may download successfully, but if it doesn't, continue with: 

2. After getting the message that the file was "dangerous" press Ctrl+J to shown Chrome's download list. The `exe` you tried to download will be at the top of the list. Click the vertical ellipsis to the right of the file name.

<Image src="https://asna-assets.nyc3.digitaloceanspaces.com/images/chrome-download-fig-1.png"
alt="Figure 1a. Opening Chrome's custom flag settings"
width="100%" alignment="center" 
/>

3. Select "Download dangerous file" (again, this file isn't dangerous).

<Image src="https://asna-assets.nyc3.digitaloceanspaces.com/images/chrome-download-fig-2.png"
alt="Figure 1a. Opening Chrome's custom flag settings"
width="100%" alignment="center" 
/>

4. Click the "Download dangerous file" button. The file will download to your PC. For your piece of mind, you can scan the downloaded file with your virus checker. This is very easy to do with Microsoft Defender; right-click the file and select "Scan with Microsoft Defender."

<Image src="https://asna-assets.nyc3.digitaloceanspaces.com/images/chrome-download-fig-3.png"
alt="Figure 1a. Opening Chrome's custom flag settings"
width="100%" alignment="center" 
/>

Alternatively, use Microsoft Edge to download `exe` files from ANSA.com. Even with its security settings set to "strict" MS Edge successfully downloads the file. (MS Edge is installed by default on all Windows 10/11 PCs.)