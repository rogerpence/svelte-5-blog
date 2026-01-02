---
title: SQL Server nuggets
description: SQL Server nuggets. Get columns as a list
date_updated: '2025-12-04T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sql
  - lakeb2b
---
The list-history is a table containing all email addresses that have been sent an email. 

There is a `tag` that denotes the campaign date (ie, 2025-06-22). On 9 October we sent out a campaign that went to ~5000 new email addresses and ~2500 email addresses that had already received an email. 

`list_history`  is a list of email addresses. There may be duplicate email rows.

This query shows the countries represented and the number of email addresses for that country

```
select country, count(country) as [emails] from list_history
group by country
order by country
```

This query shows the country and the number of email dupes for that country

```sql
with recipients as (
    select email, count(email) as [emails] from list_history
    group by email
) 

select * from recipients 
where emails > 1
```

Find and count all email addresses in `list_history` for each email address that occurs more than once.

```
WITH EmailCounts AS (
    SELECT 
        *,
        COUNT(*) OVER (PARTITION BY email) as EmailCount
    FROM list_history
)
SELECT *
FROM EmailCounts
WHERE EmailCount > 1
ORDER BY email;
```


## Get column names as a list

```
SELECT STRING_AGG(name, ', ') WITHIN GROUP (ORDER BY column_id)
FROM sys.columns
WHERE object_id = OBJECT_ID('original');
```

## Copying a table

The "best" way depends entirely on whether you need a **quick backup** (just data) or a **production-ready clone** (indexes, keys, and constraints included).

### Method 1: The Fastest Way (Data & Structure Only)
Use `SELECT INTO` if you just need a backup copy for testing or safety. This creates the new table automatically on the fly. The target table cannot exist! 

```sql
SELECT *
INTO MyTable_Backup
FROM MyTable;
```

*   **Pros:** Extremely fast.
*   **Cons:** It **DOES NOT** copy Primary Keys, Indexes, Foreign Keys, or Defaults. It only copies the column definitions and the data.


### Method 2: The "Exact Clone" Way (Includes Keys & Indexes)
If you need the new table to behave exactly like the old one (e.g., enforcing unique IDs, fast lookups), you cannot do this with a single query. You must use SQL Server Management Studio (SSMS):

1.  Right-click your table in **Object Explorer**.
2.  Select **Script Table as** > **CREATE To** > **New Query Editor Window**.
3.  Press **Ctrl+H** (Find & Replace):
    *   **Find:** `[OriginalTable]`
    *   **Replace:** `[NewTable]`
4.  **Execute** the script (this creates the empty table with all rules/indexes).
5.  **Run this query** to move the data:

```sql
-- Required if you have an Identity (auto-increment) column
SET IDENTITY_INSERT NewTable ON;

INSERT INTO NewTable (Column1, Column2, Column3)
SELECT Column1, Column2, Column3
FROM OriginalTable;

SET IDENTITY_INSERT NewTable OFF;
```

### Which one should you use?
*   **Just backing up before a risky update?** Use **Method 1**.
*   **Creating a staging table for an application?** Use **Method 2**.


--UPDATE list_history
--SET list_history.country = prospects.Country
--FROM list_history
--INNER JOIN prospects ON list_history.email = prospects.email;

select * from list_history where country is null


select country, count(country) as [emails] from list_history
group by country
order by country

with recipients as (
select email, count(email) as [emails] from list_history
group by email
) 

select * from recipients 
where emails > 1


select count(distinct email) from list_history


with recipients as (
select email, count(email) as [emails] from list_history
group by email
) 

select * from recipients 
where emails > 1


select count(distinct email) from list_history

WITH EmailCounts AS (
    SELECT 
        *,
        COUNT(*) OVER (PARTITION BY email) as EmailCount
    FROM list_history
)
SELECT *
FROM EmailCounts
WHERE EmailCount > 1
ORDER BY email;

select * from list_history where tag is null