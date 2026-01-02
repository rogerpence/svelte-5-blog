---
title: Split the DataGate family from its parent family to create a separate DataGate release set
description: Split the DataGate family from its parent family to create a separate DataGate release set
date_created: '2025-06-03T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - asna
  - downloads
---
This PowerShell script splits the DG-related markdown change files and puts them in their own separate release set folder. The DG-related markdown files are removed from the parent family.

Run this after downloading the markdown change files for the parent family--before creating the HTML files.  This operation is listed as "Split the DG family from parent family" in the Downloads Task Runner.

```
C:\Users\thumb\Documents\projects\asna\downloads\release-notes\scripts\split-dg-release-notes-changes.ps1
```
## Example

Before running this script:

```    
2025-06-04-nancy-beta
	avr-setup 16.0.92.0.md
	browser terminal 16.0.92.0.md
	dcs-setup 16.0.91.0.md
	dg400 16.0.40.0.md
	dgmonitor 16.0.67.0.md
	dgstudio 16.0.106.0.md
	dss-setup 16.0.91.0.md
	mobilerpg-setup 10.0.96.0.md
	monarch nomad 16.0.90.0.md
	monarch-setup 10.0.93.0.md
	wings-setup 10.0.97.0.md
```

Run the script:

```
split-dg-release-note-changes -family_path 2025-06-04-nancy-beta
```

After running this script: 

```
2025-06-04-nancy-beta
	avr-setup 16.0.92.0.md
	browser terminal 16.0.92.0.md
	mobilerpg-setup 10.0.96.0.md
	monarch nomad 16.0.90.0.md
	monarch-setup 10.0.93.0.md
	wings-setup 10.0.97.0.md
2025-06-04-datagate16-beta
	dcs-setup 16.0.91.0.md
	dg400 16.0.40.0.md
	dgmonitor 16.0.67.0.md
	dgstudio 16.0.106.0.md
	dss-setup 16.0.91.0.md        			
```

A warning is shown if DataGate for the IBM is missing from the original markdown changes. If it is, and you're creating a beta release set, you generally want to find the the last DataGate for IBM i beta release and include it here.