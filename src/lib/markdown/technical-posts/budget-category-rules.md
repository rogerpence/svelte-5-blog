---
title: Budget CategoryRules SQL Server table
description: Budget CategoryRules SQL Server table
date_created: '2025-05-26T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - budget
---
```sql
CREATE TABLE [dbo].[categoryrules](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[description] [varchar](150) NULL,
	[rule] [varchar](50) NULL,
	[value] [varchar](500) NULL,
	[category] [varchar](150) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, 
       ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, 
       OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
```

```sql
CREATE UNIQUE INDEX description
ON categoryrules (description);
```

```
INSERT INTO categoryrules ([description], [rule], [value], [category])
       VALUES('Bill Miller Bar-B-Q', 'startswith', 'bill miller', 'fast food') 
```