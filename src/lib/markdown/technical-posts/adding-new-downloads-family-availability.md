---
title: Adding a new family availability code to ASNA downloads
description: Adding a new family availability code to ASNA downloads
date_created: 2025-07-02T00:00:00.000Z
date_updated: 2025-12-30
date_published:
pinned: false
tags:
  - asna
  - downloads
---

## Step 1. Add a new row to the `family_availability` table.

<a href="supabase-credentials">test internal link</a>

[aasdfasdfasdfsupabase-credentials](supabase-credentials)

[[supabase-credentials|test link]]

<img src="image-32.png" width="700"/>


![[image-32.png|700]]

## Step 2. Update the `family` table 

Update the family to change in the `family` table to reflect this new availability in the `availability_status` column.

## Step 3.  Update the `get_product_downloads_json` function in Postgres

This line in the Postgres function scopes the products listed on the downloads page with family availability ids. Add the new family to the list.

```
WHERE CAST(f.availability_id as int) IN (6,7,8,9) AND 
```

The full function is shown below.

```sql
BEGIN
    RETURN QUERY

WITH download_list AS (
    SELECT f.name as name, 
           CAST(f.availability_id as int) as availability_status,
           f.download_page_order as download_page_order,
           f.sort_order as sort_order, 
           COALESCE(f.visual_studio_version,'') as vs_version,
           false as is_com,
           f.release_date as release_date,
           f.download_page_section_heading as download_section_heading,
           rs.family_name as family_name, 
           rs.product_name as product_name, 
           rs.trademark_name as product_trademark_name,
           rs.product_sort_order as product_sort_order, 
           rs.version as product_version, 
           rs.binary_filename as binary_filename,
           COALESCE(rs.readme_filename, '') as readme_filename,
           GetS3Key(rs.family_name, rs.binary_filename) as s3key,
           CONCAT(f.release_date,'-',family_name_crusher(f.name), '/', GetFileName(rs.readme_filename)) as s3_readme_key,
           CleanToken(f.name) as family_key, 
      	   CleanToken(rs.product_name) as product_key,
           CleanToken(rs.product_name) as unique_product_key       

    FROM family as f

    INNER JOIN release_set_normalized AS rs 
        ON to_iso_date(rs.release_date) = f.release_date AND rs.family_id = f.id

	-- use Family Availability to scope the products shown on the downloads page.
    WHERE CAST(f.availability_id as int) IN (6,7,8,9) AND 
          f.release_date IS NOT NULL AND 
          rs.binary_filename <> ''

    -- ORDER BY f.availability_id DESC, f.download_page_order, f.sort_order, rs.product_sort_order
    ORDER BY f.download_page_order, f.sort_order, rs.product_sort_order
)

    SELECT  dl.name,
            dl.availability_status,  
            dl.sort_order, 
            dl.download_page_order, 
            dl.product_sort_order,
            dl.family_key, 
            dl.product_key,          
            dl.unique_product_key,
            dl.vs_version, 
            dl.is_com,
            dl.release_date, 
            dl.download_section_heading,
            dl.family_name, 
            dl.product_name,
            dl.product_trademark_name, 
            dl.product_version, 
            dl.s3key,
            dl.s3_readme_key

    FROM download_list AS dl
    
    ORDER BY dl.download_page_order, dl.sort_order, dl.product_sort_order;
END;
```

## Step 4. Update `downloads/[[slug]]/prepareProductsJson.js`
This JavaScript file creates Json objects for each family availability status. Add the new status in ~ lines 14-17 

![[image-34.png|500]]

and at the end of the file add these lines for the new status you are adding

```
const superseded_products = products.filter((product) => product.availability_status == SUPERSEDED_STATUS);
const superseded_products_grouped = groupBy(superseded_products, 'name');
export const superseded_product_names = Object.keys(superseded_products_grouped);
```

## Step 5. Update Project Ocho's `general-xlate.js` file

This Json file provides a bunch of potentially translated texts. It has `[family]_title` and `[family]_text` keys that govern the text that gets displayed in the yellow areas shown below of the downloads page. 

![[image-33.png|700]]

Add corresponding entries for the new availability status. Watch your ending commas when you're updating that Json. It's fiddly! 

```
ga_title: 'Generally available products',
retired_title: 'Retired products &mdash; suppport is not available for these products',
beta_title: 'Beta products &mdash; not for production use!',
superseded_title: 'Superseded products &mdash; replaced by a higher point version',

ga_text:
	'These products are generally available and supported. These products feature the latest updates, enhancements, and fixes.',
retired_text:
	'These products are retired and tech support is not available. We strongly recommend you upgrade to a generally available version. <a href="/{locale}/support/product-requirements">Please see this link for more information.</a>',
beta_text:
	'These products are in beta testing and not for use in production enviroments. Tech support is available, but not for issues in a production environment.<br><br>No warrantly is implied or expressed for beta products. You use them at your own risk. By downloading beta products you acknowledge the risk of using them. <a href="/downloads/{locale}">Go to generally available downloads.</a><br><br><a href="/en">Read about our beta program.</a>',
superseded_text:
	'These products have been superseded with a point release (eg, 17.0 replaced by 17.1). They are supported but deprecated and we recommend updating to the higher point release as soon as possible.',
```

## Step 6. Update `downloads/[[slug]]/+page/.svelte` 

At ~ line 253 or so, there are loops rendering data for each family availability type.  

```
{#if superseded_product_names}
<h2 class="mt-3">{@html getXlateText(xlate, locale, 'downloads', 'superseded_title')}</h2>
<p class="mt-3">{@html getXlateText(xlate, locale, 'downloads', 'superseded_text')}</p>
<div>
	{#each superseded_product_names as family}
		<ProductDownloadListing
			on:click={() => (showModal = true)}
			on:focus={putProductInfoOnForm}
			on:mouseover={putProductInfoOnForm}
			familyName={family}
			{assets_url_prefix}
		/>
	{/each}
</div>
{/if}
```

## Step 7. Refresh the `products.json` file.

This file provides the list of products for the downloads page.  Bob's your uncle.