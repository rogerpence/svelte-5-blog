---
title: Email design system
description: Email design system
date_created: '2025-07-19T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - email
  - email-builder
---
```
padding: 0 35px 8px 35px; mso-padding-alt: 0 0 8px 0;"
```

DynamicObject - this types eData

```
interface DynamicObject {
	[key: string]: any;
}
```

Wrapper

This provides the top-level HTML table for an email. All other email components are within this wrapper.

```
interface Props {
	children: any;
	backgroundColor?: string;
}
```

MsoTable

This provides the parent table for email components. It's never used directly in an email; rather it provides the consistent table that all (most?--fix this) need.

```
interface Props {
	children: any;
	backgroundColor?: string;
}
```

Paragraph

```
interface Props {
	eData: DynamicObject;
	contentKey: string;
	align?: string;
	fontSize?: number;
	lineHeight?: number;
	color?: string;
	backgroundColor?: string;
	padding?: string;
	paddingMso?: string;
}
```

Image

```
interface Props {
	eData: DynamicObject;
	urlKey: string;
	altKey: string;
	widthKey: string;
	captionKey?: string;
	align?: string;
	fontSize?: number;
	color?: string;
	lineHeight?: number;
	backgroundColor?: string;
	padding?: string;
	paddingMso?: string;
}
```




Core elements
- BulletList
- Button
- CallOut 
* Divider
- Image
* Paragraph
- Spacer
	- ImageUrl
	- Caption
- TwoColumn