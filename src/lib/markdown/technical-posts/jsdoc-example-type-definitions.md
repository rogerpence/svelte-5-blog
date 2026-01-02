---
title: JSDoc example type definitions
description: JSDoc example type definitions
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - jsdoc
---
This type

```js
/**
 * @typedef {Object} Product
 * @property {string} name - The name of the product.
 * @property {number} availability_status - Availability status of the product (0: unavailable, 1-6: available).
 * @property {number} sort_order - The sort order for the product.
 * @property {number} download_page_order - The order of appearance on the download page.
 * @property {number} product_sort_order - The order for product sorting.
 * @property {string} family_key - Key identifying the product family.
 * @property {string} product_key - Key identifying the product.
 * @property {string} unique_product_key - Unique key identifying the product.
 * @property {string} vs_version - Version of Visual Studio compatible with the product.
 * @property {boolean} is_com - Indicates if the product is COM-based.
 * @property {string} release_date - The product's release date in YYYY-MM-DD format.
 * @property {string} download_section_heading - Heading for the download section.
 * @property {string} family_name - The name of the product family.
 * @property {string} product_name - The name of the product.
 * @property {string} product_trademark_name - The product's trademarked name.
 * @property {string} product_version - The version of the product.
 * @property {string} s3key - S3 key for the product's download executable.
 * @property {string} s3_readme_key - S3 key for the product's README file.
 */
```

_src/routes/+page.server.js_

This page gets the products array and returns it and an 'age' property to the owning page. In this contrived example, the 'age' property is added to show how you can define a return object with multiple properties.

```js
// src/routes/+page.server.js

/**
 * @returns Promise<{ products: Product[], age: number }>
 */
export async function load({ fetch }) {
    const response = await fetch("/api/products"); // Fetches data server-side

    /**
     * @type {{ products: Product[] }}
     *
     */
    const products = await response.json();

    return {
        products,
        age: 71,
    };
}
```

_src/routes/+page.js_

In the owning page, after defining the `data` variable's type you can see that Intellisense shows the type info.

If you omit this type defintion, Intellisense seems to know a little about the `data` value's type, but not enough to provide intellisense in the page's output area.

There is indeed a redundancy with this. The object type needs to be defined in both the `+page.server.js` page and in the `+page.js`. This could be avoided with a `typedef`, and that may be warranted in some cases. But in many cases, the value passed from the server to the client is a one-off special case. In those cases where you know the data definition is used in several places use a `typedef`.

![[jsdoc-example-type-definitions.png|500]]

> [!info]
> The blank lines between the type definition and the variable is to be able to fit the Intellisense window between the two. You would usually put the type definition immediately above the variable like this:

```
 /**
  * @type {{ products: Product[], age: number }}
  */
 export let data
```

> [!info]
> Note the double braces `{{}}` in the type definition for the `data` variable. This defines that `data` is object.

## Using a `typedef`

JSDoc's `typedef` defines a reusable type. The `typedef` below defines a type definition for the `products/age` object.

```
/**
 * Represents the result of the load function
 * @typedef {Object} LoadResult
 * @property {Product[]} products - An array of Product objects
 * @property {number} age - The age value
 */
```

Or more concisely:

> [!tldr]
> I'm not sure about defining the `LoadResult` value twice. I need to check this.

```
/**
 * Represents the result of the load function
 * @typedef {Object} LoadResult
 * @property {{products: Product[], age: number}} LoadResult
 */
```