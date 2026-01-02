---
title: javascxript-tagged-functions
description: javascxript-tagged-functions
date_created: '2025-05-29T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - javascript
---
```ts
function customFormatter(strings, ...values) {
    // console.log("Literal strings:", strings);

    strings.forEach((str, index) => {
        console.log(`String ${index}:`, str);
    });

    console.log("strings", strings);
    console.log("raw", strings.raw);
    console.log("Interpolated values:", values);
}

const item = "Book";
const price = 25;

customFormatter`Item: ${item}, Price: $${price}.`;
```

The code above produces this output: 

```ts
String 0: Item:
String 1: , Price: $
String 2: .
strings [ "Item: ", ", Price: $", ".", raw: [ "Item: ", ", Price: $", "." ] ]
raw [ "Item: ", ", Price: $", "." ]
Interpolated values: [ "Book", 25 ]
```

You can do anything you want with the string components and raw values. You'd probably use the `raw` property of the `strings` argument which is a an array of the string components.