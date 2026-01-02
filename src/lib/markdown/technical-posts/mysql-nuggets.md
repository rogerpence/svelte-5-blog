---
title: mysql-nuggets
description: mysql-nuggets
date_created: '2025-07-07T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - mysql
---
```
select email_address, product, DATE_FORMAT(date_requested, '%Y-%m-%d') AS iso_date from downloads
where email_address like '%blattenb%'
order by iso_date, product
```