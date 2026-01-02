---
title: Get table schema
description: Get table schema
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - postgres
  - sql
  - schema
---
This SQL gets the schema for a Postgres table.

```
SELECT
    column_name,
    ordinal_position,
    column_default,
    is_identity,
    data_type,
    '' as dotnet_data_type,
    character_maximum_length,
    numeric_precision,
    data_dictionary.description as description
FROM
    information_schema.columns
LEFT JOIN data_dictionary
	ON "table" = table_name
	AND "column" = column_name
WHERE
	table_name = 'family_backup'
```

The `dotNetDataType` column is later populated with:

```
C:\Users\thumb\Documents\projects\asna\downloads\downloads-schema-report\get-schemas.js
```