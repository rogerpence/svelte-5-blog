---
title: SQL for working with the lakeb2b prospects table in SQL Server
description: SQL for working with the lakeb2b prospects table in SQL Server
date_created: '2025-06-08T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - asna
  - lakeb2b
---
## Prepare list for Constant Contact

### Step 1. Assign distribution

Where tag = new tag needed

```
UPDATE TOP (2000) prospects
SET tag = 'lakeb2b-2025-10-23'
WHERE country = 'USA' AND tag = '' OR country = 'USA' AND tag IS NULL;
```

### Step 2. Copy new distribution to `constant-contact`

Clear `constant-contact`

```
delete from [constant-contact]
```

Add rows to `constant-contact`

where tag is the tag assigned in Step 1. 

```
INSERT INTO [constant-contact]
SELECT [Counter], [Tag], [Email], [CompanyName], [WebAddress], 
       [Prefix], [ContactName], [FirstName], [MiddleName], [LastName], 
	   [Title], [Address], [Address1], [City], [State], [ZipCode], 
	   [Country], [PhoneNumber], [EmployeesSize], [RevenueSize], 
	   [SicCodes], [Industry], [ApplicationType]
FROM prospects
WHERE tag = 'lakeb2b-2025-10-23';
```


### Step 3. Export constant-contact to CSV

Other potentially helpful queries 

## Update tag property for june12th.

```
UPDATE prospects
SET tag = j.tag
FROM "june-12" AS j
WHERE prospects.email = j.email;
```

## Adding the counter values for that updated tag: (did once for USA and once for Canada)

```
WITH NumberedProspects AS (
    SELECT
        id, -- Use the primary key for the most reliable join
        ROW_NUMBER() OVER (ORDER BY id) AS rn -- Or ORDER BY email
    FROM
        prospects
    WHERE
        tag = 'lakeb2b-2025-06-12-1000' and country = 'Canada'
)
UPDATE prospects
SET counter = np.rn
FROM NumberedProspects AS np
WHERE prospects.id = np.id;
```

## Show countries sent:

```
SELECT
    country,
    COUNT(*) AS prospect_count
FROM
    prospects
WHERE tag <> ''
GROUP BY
    country
ORDER BY
    prospect_count DESC; 
```

## Show countries by tag

```
SELECT
    country,
    COUNT(*) AS prospect_count
FROM
    prospects
WHERE tag = 'lakeb2b-2025-06-05-1000' OR tag = 'lakeb2b-2025-05-15'
--WHERE tag = 'lakeb2b-2025-06-12-1000'

GROUP BY
    country
ORDER BY
    prospect_count DESC; 
```

## Select a group of rows for emailing 

This SQL selects a given row of prospects for adding them to Constant Contact. 

Provide the number of rows, the new tag name, and the country. This SQL finds the next n rows and marks them with the tag provided. 

Test mailing list for distribution:

```
SELECT TOP (2000) * FROM prospects
WHERE country = 'USA' AND tag = '' OR country = 'USA' and AND tag IS NULL;
```

Confirm count not distributed:

```
SELECT COUNT(*) FROM prospects
WHERE country = 'USA' AND tag = '' OR country = 'USA' AND tag IS NULL;
```

Assign distribution:

```
UPDATE TOP (2000) prospects
SET tag = 'lakeb2b-2025-08-07'
WHERE country = 'USA' AND tag = '' OR country = 'USA' AND tag IS NULL;
```


Same SQL with a transaction and rows affected.

```
BEGIN TRANSACTION;

-- Your update statement
UPDATE TOP (1000) YourTable
SET tag = '2026-06-27'
WHERE country = 'USA' AND tag = '' OR country = 'USA' and AND tag IS NULL;

-- Check how many rows were affected
SELECT @@ROWCOUNT AS 'Rows Affected';

-- If you are happy with the result, uncomment and run COMMIT
-- COMMIT TRANSACTION;

-- If something is wrong, uncomment and run ROLLBACK
-- ROLLBACK TRANSACTION;
```

## Count rows for all tags

Show counts of all tags

```
select tag, count(tag) from prospects
group by tag
order by tag
```

Results shown with query above:

```
lakeb2b-2025-05-22	  50
lakeb2b-2025-06-05	 518
lakeb2b-2025-06-12	 601
lakeb2b-2025-06-26	2000
lakeb2b-2025-08-07	1092
------------------------
                    4261 
```

## Handy SQL 

```
select tag, count(tag) from prospects
where country = 'USA'
group by tag
order by tag
```

## Get a comma-separated list of column names

```
SELECT STRING_AGG(QUOTENAME(COLUMN_NAME), ', ') WITHIN GROUP (ORDER BY ORDINAL_POSITION) AS ColumnList
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'prospects';
```

SQL Server Management Studio shows squiglies with this query, but it works.

This query can be helpful when you need to `INSERT INTO` every column but the identify column (usually named `id`)

## Get a working copy of the current list to submit to Constant Contact

> [!danger]
> Don't forget to clear the `constant-contact` table before inserting new rows into it. If you 

Generally, you'll use the query below to select a given `tag` value from `prospects`

```
INSERT INTO [constant-contact]
SELECT [Counter], [Tag], [Email], [CompanyName], [WebAddress], 
       [Prefix], [ContactName], [FirstName], [MiddleName], [LastName], 
	   [Title], [Address], [Address1], [City], [State], [ZipCode], 
	   [Country], [PhoneNumber], [EmployeesSize], [RevenueSize], 
	   [SicCodes], [Industry], [ApplicationType]
FROM prospects
WHERE tag = 'lakeb2b-2025-10-09';
```

In the case of the 2025-10-09 mailling, I added 5000 contacts that previously had not received an email (therefore, these 5000 have a tag value of `lakeb2b-2025-10-09`)  and also included all those previously tagged as sent _except_ for the `lakeb2b-2025-08-07` mailing group. 

The intent with this 2025-10-09 mailing is to send the new email, with the new landing page, to everyone that has also been sent one email and to the 5000 selected on 2025-10-09. 

For this mailing, I used this query to populate the `constant-contact` table:

```
INSERT INTO [constant-contact]
SELECT [Counter], [Tag], [Email], [CompanyName], [WebAddress], 
       [Prefix], [ContactName], [FirstName], [MiddleName], [LastName], 
	   [Title], [Address], [Address1], [City], [State], [ZipCode], 
	   [Country], [PhoneNumber], [EmployeesSize], [RevenueSize], 
	   [SicCodes], [Industry], [ApplicationType]
FROM prospects
WHERE tag IS NOT NULL
  AND tag <> ''
  AND tag <> 'lakeb2b-2025-08-07';
```

## Create a new `constant-contact` table

```
CREATE TABLE [dbo].[constant-contact](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Counter] [int] NULL,
	[Tag] [nvarchar](200) NULL,
	[Email] [nvarchar](200) NULL,
	[CompanyName] [nvarchar](200) NULL,
	[WebAddress] [nvarchar](200) NULL,
	[Prefix] [nvarchar](200) NULL,
	[ContactName] [nvarchar](200) NULL,
	[FirstName] [nvarchar](200) NULL,
	[MiddleName] [nvarchar](200) NULL,
	[LastName] [nvarchar](200) NULL,
	[Title] [nvarchar](200) NULL,
	[Address] [nvarchar](200) NULL,
	[Address1] [nvarchar](200) NULL,
	[City] [nvarchar](200) NULL,
	[State] [nvarchar](200) NULL,
	[ZipCode] [nvarchar](200) NULL,
	[Country] [nvarchar](200) NULL,
	[PhoneNumber] [nvarchar](200) NULL,
	[EmployeesSize] [nvarchar](200) NULL,
	[RevenueSize] [nvarchar](200) NULL,
	[SicCodes] [nvarchar](200) NULL,
	[Industry] [nvarchar](200) NULL,
	[ApplicationType] [nvarchar](200) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
```

## Target table

This is an alternative to the full `constant-contact` table to use for Constant Contact list submission.

I don't think it matters much which you use. 
  
```sql
USE [lakeb2b]
GO

/****** Object:  Table [dbo].[june-12]    Script Date: 8/25/2025 2:07:46 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[cc-group](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Tag] [nvarchar](200) NULL,
	[Email] [nvarchar](200) NULL,
	[CompanyName] [nvarchar](200) NULL,
	[FirstName] [nvarchar](200) NULL,
	[LastName] [nvarchar](200) NULL,
	[Title] [nvarchar](200) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
```


## 2025-10-09 mailing

	16813

as of 2025-10-09,m 16,813 left not set. Note this includes only USA.

on 2025-10-09, this query 
```
select count(*) from prospects
where country = 'usa' and tag = '' or  
      country = 'usa' and tag is null 
```
shows 16,813 contacts remaining not yet sent.

lakeb2b-2025-05-22	46
lakeb2b-2025-06-05	390
lakeb2b-2025-06-12	601
lakeb2b-2025-06-26	2000
lakeb2b-2025-08-07	1092 (not sent)
lakeb2b-2025-10-09	5000
Total = 8037 rows sent 

when matched against unsubscribes, 7946 emails will be sent

![[image-49.png]]