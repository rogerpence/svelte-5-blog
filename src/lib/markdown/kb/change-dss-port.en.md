---
title: How to change DataGate for SQL Server's TCP/IP port
description: This article explains how to change the TCP/IP port that DataGate for SQL Server.
tags:
  - datagate-sql-server
date_published: '2024-12-10T00:00:00.000Z'
date_updated: '2024-12-10T00:00:00.000Z'
date_created: '2024-12-10T00:00:00.000Z'
pinned: false
---

<script>
    import Image from "$components/text-decorators/Image.svelte";
    import Callout from "$components/text-decorators/Callout.svelte"
</script>

This article explains how to change the TCP/IP port that DataGate for SQL Server (DSS). By default, DSS uses port 5042. That port number is defined in the registry and to change the port number you need to change that key's value.

> Interesting minutiae: the port number 5042 isn't arbitrary. It was assigned by the Internet Assigned Numbers Authority to ASNA as DataGate's formal port number a very long time ago! [Search this link for 5042.](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.txt )


<Callout
image="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/icon-images/exclamation-point.png"
font_size="1.2rem"
font_style="italic">
Danger ahead! Incorrect changes to your PC's registry can render your PC unusable. A PC administrator familiar with changing the registry should make these changes. 
</Callout> 


### Step 1. 

Ensure all users are logged out and stop the DG Service on the server. The quick way is by with the "A" tray icon.  Right-click and select "Stop the Service" as shown below in Figure 1.

<Image src="https://asna-assets.nyc3.digitaloceanspaces.com/newsletter/stop-datagate-service.png"
alt="Stopping the DataGate service"
width="200" alignment="left" hide_caption={false}
caption="Figure 1."
caption_class="small-image-component-caption"
></Image>

Alternatively, you can use Windows's services panel to end the DataGate as shown below in Figure 2a.

<Image src="https://asna-assets.nyc3.digitaloceanspaces.com/newsletter/services-panel-dss.png"
alt="Stopping the DataGate services with the Services panel"
width="550" alignment="left" hide_caption={false}
caption="Figure 2a."
caption_class="small-image-component-caption"
></Image>

### Step 2.

Open the Windows Registry Editor, a.k.a. regedit.exe.  Navigate to the DG Service key. The "17" in the key name could be different, depending on the installed version of DSS.  

The full key name is:

```
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\DataGate Server 17
```

The DataGate registry key is shown below in Figure 2b.

<Image src="https://asna-assets.nyc3.digitaloceanspaces.com/newsletter/regedit-dss.png"
alt="Finding the DSS port key in the registry"
width="550" alignment="left" hide_caption={false}
caption="Figure 2b."
caption_class="small-image-component-caption"
></Image>

### Step 3. 

In the right-hand pane, find and double-click the value name "TCP/IP Port". The "Edit DWORD" dialog should appear. Set the "Base" radio button to "Decimal" and change the"Value data" input to your desired port number (as shown below in Figure 3).

<Image src="https://asna-assets.nyc3.digitaloceanspaces.com/newsletter/change-registry-dss.png"
alt="Changing the DSS port value"
width="300" alignment="left" hide_caption={false}
caption="Figure 3."
caption_class="small-image-component-caption"
></Image>

Click "OK" and close the Registry Editor.

### Step 4.

Restart the service using either the DataGate dialog as shown below in Figure 4 or use the services panel shown in Figure 2b. 

<Image src="https://asna-assets.nyc3.digitaloceanspaces.com/newsletter/start-datagate-service.png"
alt="Starting the DataGate service"
width="200" alignment="left" hide_caption={false}
caption="Figure 4."
caption_class="small-image-component-caption"
></Image>

DataGate for SQL Server's port is now changed and its ready to use. Be sure to put this changed port number in your DataGate Database names.

<!-- 

<Image src="https://asna-assets.nyc3.digitaloceanspaces.com/newsletter/test-netconnection-dss.png"
alt="Using PowerShell's test-netconnection cmdlet to check a port's status"
width="600" alignment="left" hide_caption={false}
caption="Figure 1."
caption_class="small-image-component-caption"
></Image> 

-->
