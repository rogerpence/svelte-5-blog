---
title: LakeB2B Constant Contact Import
description: Helpful SQL
date_created: '2025-08-24T00:00:00.000Z'
date_updated: '2025-11-19T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - lakeb2b
---
* The `prospects` and `original` table are the same data except for the `tag` column. The `original's` `tag` column is populated. In `prospects` it is empty. 





## Target table
  
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






```
select ApplicationType, count(ApplicationType) from prospects 
group by ApplicationType
order by ApplicationType
```



## Handy SQL 

```
select tag, count(tag) from prospects
where country = 'USA'
group by tag
order by tag
```