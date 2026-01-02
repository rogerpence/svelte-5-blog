---
title: The Json doc for the GenericArticle component used with react-email
description: The Json doc for the GenericArticle component used with react-email
date_created: '2025-06-26T00:00:00.000Z'
date_updated: '2025-09-30T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - react-email
---
Each newsletter article is 

```
"articles": [
	[
		{ "heading": "Nullable types in Visual RPG" },
		{
			"paragraph": [
				"Starting...",
				"Attending this...."
			]
		},
		{
			"bulletList": {
				"introText": "What does Papa...",
				"bulletListItems": [
					"<strong>DataGate n</strong>: comprises...",
					"<strong>Coyote</strong>: comprises Visual RPG 5.2 .COM products",
					"<strong>Badger</strong>: comprises Visual RPG 5.1 .COM products"
				]
			}
		},
		{
			"image": {
				"type": "image",
				"url": "https://nyc3.digitalocea...",
				"width": "100%",
				"height": "auto",
				"alt": "",
				"caption": "This is a nullable type caption"
			}
		},
		{
			"callout": {
				"text": "ASNA support for Windows 10 ends on October 14th, 2025",
				"imageUrl": "https://asna-assets.nyc3.digitaloceanspaces.com/newsletter/exclamation-point.png"
			}
		}
	]
]        
```