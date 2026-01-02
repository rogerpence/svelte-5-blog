---
title: Update Family table
description: Update Family table
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sql
  - downloads
---
This SQL is saved as `update-last-release-date.sql`. It should be run after posting a new release set. This SQL updates the `release_date` in the `Family` table. This column drives the ability of the

```
WITH
added_row_number AS (
	SELECT *, ROW_NUMBER() OVER
	(
		PARTITION BY family_name
		ORDER BY family_name ASC, release_date DESC
	)
	AS row_number
	FROM ReleaseSet
),
last_release_date AS (
	SELECT release_date, family_name
	FROM added_row_number
	WHERE row_number = 1
)

UPDATE Family SET family.release_date =
(
    SELECT release_date
	FROM last_release_date
	WHERE Family.name = last_release_date.family_name
)
```