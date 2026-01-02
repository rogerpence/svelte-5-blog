---
title: An intro to SQL PARTITION-BY
description: An intro to SQL PARTITION-BY (this specific SQL works on SQL Server but may work on other platforms)
date_updated: '2025-12-04T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sql
---
Here is a query using a **Common Table Expression (CTE)** and a **Window Function**. This is widely considered the most efficient and readable way to solve this problem in SQL Server.

It calculates the count of each email address "on the fly" and attaches that count to every row. You can then simply filter for rows where that count is greater than 1.

> [!info]
> Note the use of a Common Table Expression) below

```sql
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

The query above finds and count alls email addresses in `list_history` for each email address that occurs more than once.

### How it works:
1.  **`COUNT(*) OVER (PARTITION BY email)`**: This creates a new temporary column (`EmailCount`). It looks at the `email` column and counts how many times that specific email appears in the entire table, then assigns that number to the current row.
2.  **`WITH EmailCounts AS (...)`**: This wraps the logic in a temporary result set (the CTE) so we can filter by the new column we just created.
3.  **`WHERE EmailCount > 1`**: This filters the final result to show **only** the rows where the email appears more than once.

### Alternative Method (Using JOIN)
If you prefer standard grouping logic, you can use a CTE to find the duplicates first and then join back to the main table:

```sql
WITH Duplicates AS (
    SELECT email
    FROM list_history
    GROUP BY email
    HAVING COUNT(*) > 1
)
SELECT lh.*
FROM list_history lh
INNER JOIN Duplicates d ON lh.email = d.email
ORDER BY lh.email;
```