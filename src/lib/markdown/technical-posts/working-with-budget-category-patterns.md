---
title: working-with-budget-category-patterns
description: working-with-budget-category-patterns
date_created: 2025-07-03T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - budget
---
Create and populate ExcludePatterns table

```sql
-- Create the table
CREATE TABLE [dbo].[ExcludePatterns] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Pattern] NVARCHAR(255) NOT NULL,
    [Description] NVARCHAR(500) NULL,
    [IsActive] BIT DEFAULT 1,
    [CreatedDate] DATETIME2 DEFAULT GETDATE()
);

-- Insert your patterns
INSERT INTO [dbo].[ExcludePatterns] ([Pattern], [Description]) VALUES
('ACH%', 'ACH transactions'),
('ACCTVERIFY%', 'Account verification'),
('ATM %', 'ATM transactions'),
('AUTOPAY%', 'Auto pay transactions'),
('Bill Paid%', 'Bill payment transactions'),
('CHECK #%', 'Check transactions'),
('DBT CRD%', 'Debit card transactions'),
('FROM CHECKING%', 'Checking account transfers'),
('DDA REGULAR%', 'DDA regular transactions'),
('MONEYLINK %', 'MoneyLink transactions'),
('FROM SAVINGS%', 'Savings account transfers'),
('ONLINE PMT%', 'Online payments'),
('INTERNET BILL PAYMENT%', 'Internet bill payments'),
('INTERNET CHECK%', 'Internet check payments'),
('INST XFER PAYPAL%', 'PayPal instant transfers'),
('PAYMENT AMALGAMATED%', 'Amalgamated payments'),
('PAYPAL TRANSFER', 'PayPal transfers'),
('%ASNA, INC. PPD%', 'ASNA payroll deposits'),
('PAYROLL ASNA%', 'ASNA payroll'),
('POS CRE%', 'POS credit transactions'),
('POS DEB%', 'POS debit transactions'),
('PRE AUTH%', 'Pre-authorized transactions'),
('TRM#%', 'Terminal transactions'),
('TRSF FROM%', 'Transfer from transactions'),
('USATAX%', 'Tax transactions'),
('WITHDRAWAL%', 'Withdrawal transactions'),
('ZELLE TRANSFER%', 'Zelle transfers'),
('ROGER MEDI%', 'Roger medical payments'),
('REGULAR%', 'Regular transactions');
```

Query to test 

```sql
SELECT DISTINCT 
    COALESCE([rpb].[description], [category].[description]) AS description,
    COALESCE([category].[rule], 'equals') AS [rule],
    COALESCE([category].[value], [rpb].[description]) AS value,
    COALESCE([category].[category], 'uncategorized') AS category
FROM rpbudget AS rpb
FULL OUTER JOIN categoryrules AS category 
   ON rpb.description = category.description
WHERE (
    NOT EXISTS (
        SELECT 1 FROM [dbo].[ExcludePatterns] ep
        WHERE ep.[IsActive] = 1 
        AND [rpb].[description] LIKE ep.[Pattern]
    )
    AND YEAR([rpb].[postdate]) = 2025
) OR [rpb].[description] IS NULL
ORDER BY description;  
```

Stored procedure 
```sql 
CREATE PROCEDURE [dbo].[GetBudgetCategoryDataWithExclusions]
    @Year INT = 2025
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT 
        COALESCE([rpb].[description], [category].[description]) AS description,
        COALESCE([category].[rule], 'equals') AS [rule],
        COALESCE([category].[value], [rpb].[description]) AS value,
        COALESCE([category].[category], 'uncategorized') AS category
    FROM rpbudget AS rpb
    FULL OUTER JOIN categoryrules AS category 
       ON rpb.description = category.description
    WHERE (
        NOT EXISTS (
            SELECT 1 FROM [dbo].[ExcludePatterns] ep
            WHERE ep.[IsActive] = 1 
            AND [rpb].[description] LIKE ep.[Pattern]
        )
        AND YEAR([rpb].[postdate]) = @Year
    ) OR [rpb].[description] IS NULL
    ORDER BY description;
END```


Great question! The `NOT EXISTS` clause is indeed amazing and powerful. Let me break it down step by step:

## What `NOT EXISTS` does:

The `NOT EXISTS` clause returns `TRUE` when the subquery returns **no rows**. It's like asking: "Show me records where this condition does NOT exist."

## Breaking down your WHERE clause:

```sql
WHERE (
    NOT EXISTS (
        SELECT 1 FROM [dbo].[ExcludePatterns] ep
        WHERE ep.[IsActive] = 1 
        AND [rpb].[description] LIKE ep.[Pattern]
    )
    AND YEAR([rpb].[postdate]) = 2025
) OR [rpb].[description] IS NULL
```

## Step-by-step explanation:

### 1. The subquery runs for each row in your main query:
```sql
SELECT 1 FROM [dbo].[ExcludePatterns] ep
WHERE ep.[IsActive] = 1 
AND [rpb].[description] LIKE ep.[Pattern]
```

For each `rpb.description` (like "WALMART PURCHASE"), this subquery:
- Looks at all active patterns in the ExcludePatterns table
- Checks if "WALMART PURCHASE" matches ANY of those patterns
- If it finds a match, it returns `1` (or any value - the actual value doesn't matter)
- If no match is found, it returns no rows

### 2. The `NOT EXISTS` evaluates the subquery result:
- If the subquery returns **any rows** → `NOT EXISTS` = `FALSE` → exclude this record
- If the subquery returns **no rows** → `NOT EXISTS` = `TRUE` → include this record

### 3. Visual example:

Let's say you have these patterns in your ExcludePatterns table:
- `ACH%`
- `ATM %`
- `PAYPAL%`

And your rpbudget has these descriptions:
- `"WALMART PURCHASE"` → Subquery finds no matching patterns → `NOT EXISTS` = `TRUE` → **INCLUDE**
- `"ACH DEPOSIT"` → Subquery finds `ACH%` pattern → `NOT EXISTS` = `FALSE` → **EXCLUDE**
- `"ATM WITHDRAWAL"` → Subquery finds `ATM %` pattern → `NOT EXISTS` = `FALSE` → **EXCLUDE**
- `"GROCERY STORE"` → Subquery finds no matching patterns → `NOT EXISTS` = `TRUE` → **INCLUDE**

## Why this is amazing:

1. **Dynamic**: Add/remove patterns without changing your query
2. **Efficient**: SQL Server can optimize this very well
3. **Readable**: The logic is clear - "exclude if it matches any forbidden pattern"
4. **Maintainable**: All your business rules are in one table

## The `OR [rpb].[description] IS NULL` part:

This preserves rows from your `FULL OUTER JOIN` where there's no matching `rpb` record (only category rules exist). Without this, you'd lose category-only records.

## Alternative way to think about it:

Your old approach was like:
```sql
WHERE description NOT LIKE 'ACH%' 
  AND description NOT LIKE 'ATM %' 
  AND description NOT LIKE 'PAYPAL%'
```

The `NOT EXISTS` approach is like:
```sql
WHERE description doesn't match any pattern in my forbidden list
```

It's essentially the same logic, but infinitely more flexible!

how is this, by selecting only 1 row, looking at all active patterns:  
SELECT 1 FROM [dbo].[ExcludePatterns] ep  
WHERE ep.[IsActive] = 1  
AND [rpb].[description] LIKE ep.[Pattern]

Great question! You're thinking about this correctly, but there's a key concept to understand about how `NOT EXISTS` works with subqueries.

## The subquery doesn't select "only 1 row" - it potentially checks ALL patterns!

Let me explain what actually happens:

### How the subquery executes:

```sql
SELECT 1 FROM [dbo].[ExcludePatterns] ep
WHERE ep.[IsActive] = 1 
AND [rpb].[description] LIKE ep.[Pattern]
```

This subquery:
1. **Scans through ALL active patterns** in the ExcludePatterns table
2. **For each pattern**, it checks if `[rpb].[description] LIKE ep.[Pattern]`
3. **As soon as it finds ONE match**, it returns `1` and stops looking
4. **If no patterns match**, it returns no rows

### Visual example:

Let's say your ExcludePatterns table has:
- `ACH%` (Active)
- `ATM %` (Active)
- `PAYPAL%` (Active)
- `OLD_PATTERN%` (Inactive)

And you're checking `[rpb].[description] = "ATM WITHDRAWAL"`:

```sql
-- The subquery effectively does this:
-- Check pattern 1: "ATM WITHDRAWAL" LIKE "ACH%" → FALSE
-- Check pattern 2: "ATM WITHDRAWAL" LIKE "ATM %" → TRUE! 
-- Found a match! Return 1 and stop checking
-- (Never checks PAYPAL% or OLD_PATTERN%)
```

### The `SELECT 1` part:

The `1` is arbitrary - it could be `SELECT 'found'` or `SELECT *` or `SELECT ep.Pattern`. The important thing is that **any result** means "a match was found."

```sql
-- These are all equivalent:
SELECT 1 FROM [dbo].[ExcludePatterns] ep WHERE...
SELECT 'MATCH' FROM [dbo].[ExcludePatterns] ep WHERE...
SELECT ep.Pattern FROM [dbo].[ExcludePatterns] ep WHERE...
```

### Why `NOT EXISTS` is efficient:

1. **Short-circuit evaluation**: Stops as soon as it finds one match
2. **No data transfer**: Only cares if rows exist, not what they contain
3. **Index friendly**: Can use indexes on the Pattern column

### Your old approach vs. NOT EXISTS:

**Old approach (your commented code):**
```sql
WHERE [description] NOT LIKE 'ACH%' 
  AND [description] NOT LIKE 'ATM %' 
  AND [description] NOT LIKE 'PAYPAL%'
```
- **Always checks all patterns** even after finding a match
- **Hardcoded** - must change code to add patterns

**NOT EXISTS approach:**
```sql
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[ExcludePatterns] ep
    WHERE ep.[IsActive] = 1 
    AND [rpb].[description] LIKE ep.[Pattern]
)
```
- **Stops checking** as soon as it finds a match
- **Dynamic** - add patterns to table without changing code
- **More efficient** for large pattern lists

So the subquery **does** look at all active patterns, but it's smart about it - it stops as soon as it finds a match!

```
CREATE TABLE [dbo].[source] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Description] NVARCHAR(255) NOT NULL,
	[Rule] NVARCHAR(60) NOT NULL,
	[Value] NVARCHAR(255) NOT NULL,
	[Category ]NVARCHAR(60) NOT NULL,
);

ALTER TABLE source
ADD CONSTRAINT UniqueDescription UNIQUE (Description);
```