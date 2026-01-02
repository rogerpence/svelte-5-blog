---
title: JavaScript notes
description: JavaScript notes
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - javascript
---
This use of `map` creates a copy of the existing array, but overrides the `selected` property value. Overrides should come after the spread operator (ie, `...item`).

```js
data.familyListItems = data.familyListItems.map((item) => ({
    ...item,
    selected: item.value == value,
}));
```

These two functions are functionally equivalent. The second is probably the better, more idiomatic way to write modern JavaScript.

```
function setSelectedItem(listItems: ListItem[],  value: any) {
    for (const listItem of listItems) {
        listItem.selected = listItem.value == value;
    }
    return listItems
}
```

```
function setSelectedItem(listItems: ListItem[],  value: any) {
    return listItems.map((item) => ({
        ...item,
        selected: item.value == value
    }));
}
```

Also, note the potential peril of using JavaScript's _strict equality operator._

```
function setSelectedItem(listItems: ListItem[],  value: any) {
    return listItems.map((item) => ({
        ...item,
        selected: item.value === value
    }));
}
```

```
type AnyNumber = number | bigint;
```

## Find entries in arrays and objects

Use the Array object's `Includes` method to find elements in an array.

The code below expects `csny` to be an array.

```
const extra = bs.filter(field => !csny.includes(field));
```

Use JavaScript's `in` operator to find keys in an object.

The code below expects `csny` to be an object. The `in` operator is designed to check for property names in objects, not array elements. When used with arrays, it checks the index numbers, not the values.

```
const extra = bs.filter(field => !(field in csny));
```