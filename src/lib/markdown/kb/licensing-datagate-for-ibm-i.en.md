---
title: Licensing DataGate for IBM i 16.x and up
description: 'Licensing DateGate for IBM i now requires the IBM i partition number. Here''s how to get the information needed to license ASNA DataGate for IBM i 16 and higher. '
tags:
  - datagate-ibm-i
  - ibm-i
date_published: '2024-01-04T14:59:52.000Z'
date_updated: '2024-01-04T23:33:06.000Z'
date_created: '2024-01-04T23:33:06.000Z'
pinned: false
---
<script>
    import Image from "$components/text-decorators/Image.svelte"
</script>

>This article applies to DataGate for IBM 16.0 and higher

ASNA DataGate for IBM i 16.x introduced a license registration change. Starting with 16.x, the license now includes the IBM i partition number (LPAR). While there isn't a direct way to see this value on your IBM i, there is an easy, indirect way.  These steps are all read-only and don't change anything on your IBM i. 

First, from the IBM i command line:

```
CALL QCMD
```
Then, from the QCMD panel:

```
CALL QSYS/QLZARCAPI
```
Which shows this display:

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/qlzarcapi-2.png" alt="Using IBM's qlzarcapi API" width="600" alignment="center" caption="Figure 1."/>

The Partition ID is in the`Partition Info->` area, about four or five lines down (shown in Figure 1 above in the red box).

We'll also need your IBM serial number. Get it with:

```
DSPSYSVAL QSRLNBR
```
and your IBM i model number. Get it with:

```
DSPSYSVAL QMODEL
```
## Getting your license

Contact us and provide us with:

- Company name
- DataGate version number
- IBM i model number
- IBM i serial number
- IBM i partition number (the red box in the image below)
- User Count

and we'll generate a license for you.

## Applying the license

A apply the license with this command:

`[Library]/register`

where  `[library]` is the name of your DataGate library.

That displays the screen below shown in Figure 2:

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/dg16-x-ibmi-register-1.png" alt="Applying a DataGate license on the IBM i" width="600" alignment="center" caption="Figure 2."/>

As an aside, notice the the red box above in the Registration Assistant panel shows the Partition ID. 

> A big thank you to Matt Marsh at The Walt Disney Company for bringing the QLZARCAPI API to our attention and a big thank you to Simon Hutchinson for writing about the API at his blog [RPGPGM.com.](https://www.rpgpgm.com/2017/03/system-partition-and-processor-pool.html)

