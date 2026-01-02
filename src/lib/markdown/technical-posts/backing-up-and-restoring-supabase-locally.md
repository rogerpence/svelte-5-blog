---
title: Backing up and restoring Supabase locally
description: Backing up and restoring Supabase locally
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - postgres
---
[[supabase credentials]]

The Postgres CLI utilities [[Supabase credentials]]:

-   pg_dump
-   pg_restore
-   psql
    are installed with DB Beaver here

```
C:\Users\thumb\AppData\Roaming\DBeaverData\drivers\clients\postgresql\win\17
```

## Backing up Supabase

DB Beaver

First, change to the DB path (from above) and then use this command line:

```
./pg_dump -h aws-0-us-west-1.pooler.supabase.com -p 6543 -d postgres -U postgres.nrtgiufboxlhbspclizl -f  "C:\Users\thumb\Documents\postgres-supbase\backup.dump"
```

> I haven't restored with this backup! I may need to use --disable-triggers for the restore.

I haven't yet figured out how to store the password for CLI use (I think there is a PGCONFIG file I can use)--so until that is figured out the command above prompts for the password (available here: [[Supabase credentials]]). I did create this file:

```
C:\Users\thumb\.pgpass
```

but it's not working.