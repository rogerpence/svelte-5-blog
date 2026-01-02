---
title: budget-work1
description: budget-work1
date_created: '2025-05-23T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - personal
  - budget
---
The C# program here imports the Jefferson Bank downloaded spreadsheet into SQL Server into the `rp/rpbudget` table. It creates the table if necessary and always clears it before performing a new import. 

```
C:\Users\thumb\Documents\projects\cs\import-jeff-bank
```

Things to do:

- Import by month and year 
- Figure out how to categorize the rows by the `description` column (perhaps by startswith)

Get unique descriptions:

```
select distinct description from rpbudget where year(PostDate) = 2025
```