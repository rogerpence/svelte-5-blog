---
title: Insert a row into a table based on another row
description: Insert a row into a table based on another row
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sql
---
Create a new family row based on another.

In this example, family 155 is being copied as family 258

```
INSERT INTO family (
             id,
             created_at,
             name,
             description,
             visual_studio_version,
             availability_id,
             group_id,
             sort_order,
             download_page_section_heading,
             download_page_order,
             release_date)
SELECT 158,  <-- hardcode new family id
       created_at,
       name, <-- change
       description,
       visual_studio_version,
       availability_id,<-- change
       group_id,
       sort_order, <-- change
       download_page_section_heading, <-- change
       download_page_order, <-- change
       release_date
FROM
	family as f2
WHERE
	f2.id = 155
```

Change: id, name, page_section_heading, download_page_order, and sort_order (and possibility the availabilty_id

## What is the template_set table?

The template_set table was originally intended to provide the base list of a products that a family owns. The theory at the time is that this template set would be used to populate the first release_set for a new family.
However, it's generally easier to copy a release set from a similar family.