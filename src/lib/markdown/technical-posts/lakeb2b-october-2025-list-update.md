---
title: lakeb2b-october-2025-list-update
description: lakeb2b-october-2025-list-update
date_created: '2025-10-20T00:00:00.000Z'
date_updated: '2025-11-19T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - lakeb2b
---
## Rows without emails from original list

There are 3500 rows in the Prospects (AKA Original) table that haven't been sent any emails. 

```
-- This SQL counts the rows in the original LakeB2B list that haven't yet been sent emails. 
SELECT
    count(*)
FROM
    comparo AS B
LEFT JOIN
    original AS A ON B.email = A.email
WHERE
    A.email IS NULL AND b.country = 'USA' and b.tag is not null;
```
There are two tables in the `lakeb2b` db:

- original - the complete, original lakeb2b table
- comparo - the complete, updated lakeb2b table

> [!info]
> The comparo table has a region column that the original table did not have. That column has been added to the original table -- but its values are all empty. I added it so I could use the same import facility. 


This query selects rows in Original not present in Comparo

```
SELECT
    *
FROM
    original AS B
LEFT JOIN
    comparo AS A ON B.email = A.email
WHERE
    A.email IS NULL AND b.country = 'USA';
```

But this is better query because it is easier to read and clearly signals "I am filtering data," whereas a JOIN signals "I am combining data." Also, the LEFT JOIN query returns all columns from _both_ tables. The query below returns only rows in `original` that don't exist in `comparo`

```
SELECT * 
FROM [dbo].[original] AS o
WHERE NOT EXISTS (
    SELECT 1 
    FROM [dbo].[comparo] AS c 
    WHERE c.Email = o.Email
) AND o.Country = 'USA'
```



```sql
WITH RowsToUpdate AS (
    SELECT TOP 1000 comparo.email 
    FROM comparo
    LEFT JOIN original ON comparo.email = original.email
    WHERE
        original.email IS NULL
        AND comparo.country = 'USA'
        AND comparo.tag IS NULL
    ORDER BY comparo.email -- Ensure deterministic selection of TOP 1000
)
UPDATE comparo
SET comparo.tag = 'lakeb2b-2025-11-13' 
FROM comparo
INNER JOIN RowsToUpdate AS RTU ON comparo.email = RTU.email
```

The query above selects 1000 rows in comparo where country = 'USA' and tag is NULL, that do not exist in orginal and sets their tag column with the new tag value.

1. **Defines a Common Table Expression (CTE) named RowsToUpdate:**
    
    - This CTE selects the TOP 1000 **email addresses** from the comparo table.        
    - It filters these email addresses based on several conditions:        
        - LEFT JOIN original ON comparo.email = original.email: It joins comparo with original using the email column.            
        - WHERE original.email IS NULL: This is the crucial condition indicating that the email address from comparo **does not exist** in the original table. In other words, these are emails found in comparo but not in original. 
        - AND comparo.country = 'USA': Further filters to only include records where the country in comparo is 'USA'.
        - AND comparo.tag IS NULL: Further filters to only include records where the tag column in comparo is currently NULL.
    - ORDER BY comparo.email: Ensures that if there are more than 1000 matching rows, the specific 1000 chosen by TOP are consistently the ones with the lowest (alphabetically) email addresses.
        
2. **Updates the comparo table:**    
    - It takes the comparo table and performs an INNER JOIN with the RowsToUpdate CTE.        
    - The join condition is ON comparo.email = RTU.email, meaning it matches rows in comparo where the email address is one of the 1000 selected in the CTE.        
    - For all these matched comparo rows, it sets the comparo.tag column to the specific string value 'lakeb2b-2025-11-13'.
        
**In simpler terms, this query identifies the top 1000 records from the comparo table (ordered by email) that meet these criteria:**
- They have an email address that does not exist in the original table.    
- Their country is 'USA'.    
- Their tag column is currently NULL.
    
**And then, for those specific 1000 records, it updates their tag column to 'lakeb2b-2025-11-13'.**