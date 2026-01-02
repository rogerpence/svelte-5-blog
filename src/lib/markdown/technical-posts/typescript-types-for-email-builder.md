---
title: typescript-types-for-email-builder
description: typescript-types-for-email-builder
date_created: '2025-07-02T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - email-builder
  - email
---
```js
// Global configuration type
export interface GlobalConfig {
    brandColor: string;
    pageBackgroundColor: string;
    emailBackgroundColor: string;
    marginLeft: number;
    marginRight: number;
    fontSize: number;
    fontColor: string;
    lineHeight: number;
    pageTitle: string;
}

// Intro section type
export interface IntroSection {
    logoImageUrl: string;
    onlineUrl: string;
    locale: string;
    emailTarget: string;
    subhead: string;
    gotoHome: string;
    gotoOnlineVersion: string;
    issue: string;
    subject: string;
}

// Footer text type
export interface FooterText {
    asnaLogo: string;
    tagLine: string;
    info: string[];
    infoAll: string[];
}

// Action required bullets type
export interface ActionRequiredBullets {
    paragraph: string[];
    bullets: string[];
}

// Content section type
export interface ContentSection {
    introHeadline: string;
    introParagraphs: string[];
    actionRequiredSubhead: string;
    actionRequiredBullets: ActionRequiredBullets;
    readmoreSubhead: string;
    readmoreParagraph: string[];
    footerText: FooterText;
}

// Main email data type combining all sections
export interface EmailData {
    global: GlobalConfig;
    introSection: IntroSection;
    content: ContentSection;
}
```


```js
// Generic content section (reusable for different email types)
export interface GenericContentSection {
    [key: string]: string | string[] | BulletListData | FooterText;
}

// Union type for all content value types
export type ContentValue = string | string[] | BulletListData | FooterText;

// Type guard functions
export function isBulletListData(value: ContentValue): value is BulletListData {
    return typeof value === 'object' && 'paragraph' in value && 'bullets' in value;
}

export function isFooterText(value: ContentValue): value is FooterText {
    return typeof value === 'object' && 'type' in value && value.type === 'footerText';
}
```

```js
export interface Headline {
	text: string;
}

export interface Paragraph {
	paragraphs: string[];
}

export interface Subhead {
	text: string;
}

export interface BulletList  {
	paragraph: string[]
	list: string[]
} 

export interface CallOut {
	persona: 'caution' | 'remember' | 'idea';
	text: string;
}
	
```