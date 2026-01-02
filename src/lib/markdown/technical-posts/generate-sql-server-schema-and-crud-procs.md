---
title: Generate SQL Server table schema in Json and CRUD stored procs
description: Generate SQL Server table schema in Json and CRUD stored procs
date_created: '2025-05-31T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sql-server
  - schema
  - crud
---
The C# program at this folder can:

- Create Json schema files for SQL Server tables and views (generally for use with Libretto)
- Create CRUD stored products for SQL Server tables
- Create C# data models

```
C:\Users\thumb\Documents\projects\cs\sql-server-generator
```

## Generate JSON schema for the tables in a SQL Server database

```
create-json-data-models -d rp
```

where `-d` is the database name.  

The Json schema files are created in the Libretto `schemas\sql-server-schemas\[database name]` folder.

## Generate SQL Server CRUD stored procs for tables in a SQL Server database

```
create-crud-procs -d rp
```

where `-d` is the database name. 

The CRUD procs are created and copied to the clipboard. They are not written out as files. 

## Create CS data models for a the tables in a SQL Server database

```
create-cs-data-models -d asna-version-policy -n DataModels
```

where `-d` is the database name and `-n` is the namespace name.

C# models are created here where the last folder is the database name:

```
C:\Users\thumb\AppData\Roaming\DapperModels\rp
```