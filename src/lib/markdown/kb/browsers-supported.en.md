---
title: Browsers and mobile clients supported for ASNA products
description: Browsers and mobile clients supported for ASNA products.
tags:
  - mobile-rpg
  - monarch
  - synon-escape
  - visual-rpg
  - wings
date_published: '2024-01-09T12:29:30.000Z'
date_updated: '2024-01-09T18:44:45.000Z'
date_created: '2024-01-09T18:44:45.000Z'
pinned: false
---

Our general recommendation is to use the latest editions of:

*   Chrome
*   MS Edge
*   FireFox
*   Safari

Chrome and MS Edge are both based on the open-source Chromium engine. There are many other Chromium-based browsers (including Brave, Opera, and Vivaldi) and you may get a good user experience with these other Chromium-based browsers.

MS Internet Explorer went out of support in 2022 and we no longer test with it or recommend its use.

#### More details

For any platform, you’ll get the best results with browsers that support the latest HTML/CSS/JavaScript standards. These standards are updated very frequently so it’s very important to keep your developer and end-user browsers current.  We define current as: no more than 12 months old. We strongly recommend that you use current browsers. Not only are do they support the latest APIs but they are better protected against security issues. The automated update facilities of most browser families today make it easy to stay current.

Wings, Mobile RPG, Monarch, Synon Escape, and BTerm all use a great deal of JavaScript and CSS. We aren’t early adopters of any client-side technology, but do adopt features we deem very useful once a feature reaches critical mass. For example, JavaScript’s ES 6 specification added [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) (three years ago) which enable using modules. This enables more reliable and more easily tested JavaScript. When support for these modules fanned out [to the current release of all of the major browsers](https://caniuse.com/#search=javascript%20modules) we adopted these features.

#### Other platform notes

**Tablets**

Wings, Mobile RPG, Monarch, Synon Escape, and BTerm all have affinity for the native browsers on Apple (Safari), Android (Chrome), and Microsoft Surface (Edge). Other browsers may work on tablet devices but test thoroughly. As with desktop browsers, the older the tablet the more questionable its support is. It’s best to stick with current tablets and operating systems.

This desktop browser recommendation applies primarily to Wings, Mobile RPG, Monarch, Synon Escape, and BTerm.

**Smartphones**

ASNA Mobile RPG specifically targets tablets and smartphones. Its tablet requirements are listed in the paragraph above. Like our tablet support, Mobile RPG has affinity for the native browsers on Apple (Safari), Android (Chrome), and Microsoft Surface (Edge). Other smartphone browsers may work with Mobile RPG but test thoroughly. As with desktop browsers, the older the smartphone the more questionable its support is. It’s best to stick with  current smartphones and operating systems. Please note that we do not recommend using Wings, Monarch, Synon Escape, and BTerm with smartphones.

This smartphone browser recommendation applies primarily to Mobile RPG.

**ASNA Visual RPG**

Unlike Wings, Mobile RPG, Monarch, Synon Escape, and BTerm, ASNA doesn’t provide any CSS or JavaScript to use with ASNA Visual RPG (AVR). You write the CSS or JavaScript used with AVR apps, so you get to dictate the requirements. Having said that, as we’ve said above, you’ll have the most success with your AVR Web applications (and the modern technologies you’ll need) using current browsers.