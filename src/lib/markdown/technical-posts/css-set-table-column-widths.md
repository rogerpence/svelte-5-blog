---
title: CSS set table column widths
description: CSS set table column widths
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
```
table {
    width: 100%;
    border-collapse: collapse;
}

table td:nth-child(1) {
    width: 12rem;
}
table td:nth-child(2) {
    /* width: 8%; */
}
table td:nth-child(3) {
    /* width: 8%; */
}
table td:nth-child(4) {
    width: 10%;
}
table td:nth-child(5) {
    width: 10%;
}
table td:nth-child(6) {
    /* width: 10%; */
}
table td:nth-child(7) {
    /* width: 10%; */
}
table td:nth-child(8) {
    width: 18rem;
}
```