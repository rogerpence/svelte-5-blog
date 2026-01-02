---
title: Mongo notes from early stages of ASNA.com
description: Mongo notes from early stages of ASNA.com
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - asna-svelte
  - sveltekit
---
> [!info]
> This is from very early in Project Ocho's life--which was originally called Vulture (because it was gonna eat the dead remains of the WordPress site). I gave up on using Mongo a data store very shortly after the site was launched. I'm leaving this notes here if I ever have the bad fortune to want to try to use Mongo again.

Vulture's database is a Mongo Atlas DB. This is a NoSQL DB.
The Mongo Atlas database instance credentials are:

```
rogerpence
7EvxzPxIxwT5M35J
```

```
database: vulture
collection: downloads
connection string: mongodb+srv://rogerpence:7EvxzPxIxwT5M35J@cluster0.rqhvs2d.mongodb.net/?retryWrites=true&w=majority
```

## Project Vulture - ASNA.com V

-   [Project overview](https://cloud.mongodb.com/v2/65285598556eb9192d49c85d#/overview) From Project Overview browse collections
-   [Databases](https://cloud.mongodb.com/v2/65285598556eb9192d49c85d#/clusters) Click "Connect" button next to Cluster0" then click "Drivers" to see connection string details. The account name and credentials are above.
-   [Work with database users](https://cloud.mongodb.com/v2/65285598556eb9192d49c85d#/security/database/users)
-   Use [Mongo Compass](https://www.mongodb.com/try/download/shell) to view and work with databases and collections

## Serializing a Mongo collection

The Mongo `_id` property is a nested object in the collection and can cause problems serialization for Svelte.

The canonical solution to this problem is to iterate over the collection to substitute the `ToString()` value of `_id` in the result:

```
const urlList = await collection.find().toArray();

const serializedUrls = urlList.map((item) =>
	JSON.parse(
		JSON.stringify(item, (key, value) => (key === '_id' ? value.toString(value) : value))
	)
);

return serializedUrls
```

[This article](https://www.okupter.com/blog/sveltekit-cannot-stringify-arbitrary-non-pojos-error) says to use `serializedUrls` which is a much cleaner to fix the issue.

It first offers this function:

```
const serializeNonPOJOs = (value) => {
	return JSON.parse(JSON.stringify(value));
};
```

I'm not sure if the solution above screws up data types in the Json doc, as it unconditionally stringifies every property (the `map` solution farther above does not do).

but then goes on to explain that this is less verbose:

```
serializedUrls = structuredClone(urlList)
```

but using `structuredClone` returns an empty `_id` property.

## Example

Given this two object Mongo collection:

![[Pasted image 20231015120801.png]]

and using this query to fetch it:

```
const data = await testCollection.find().toArray();
```

This is the raw data returned. Note the `_id` property is an object.

```
[
  {
    _id: new ObjectId("652c19bac046c5d0785e73e8"),
    name: 'Spaceman',
    age: 70
  },
  {
    _id: new ObjectId("652c1b6dc046c5d0785e73ec"),
    name: 'Niko',
    age: 65
  }
]
```

The embedded `_id` object property causes this error which, when you look closely, references the `_id` property:

```
Error: Data returned from `load` while rendering / is not serializable: Cannot stringify arbitrary non-POJOs (data.downloads[0]._id)
```

Modifying the collection with `structuredClone`

```
const fixedData = structuredClone(data)
```

returns:

```
[
  { _id: {}, name: 'Spaceman', age: 70 },
  { _id: {}, name: 'Niko', age: 65 }
]
```

note that the `_id` property is an empty object, This data returns correctly but fetching the `_id` property returns `[object Object]`

Modifying the collection with `serializeNonPOJOs(data)`

```
const fixedData = serializeNonPOJOs(data)
```

returns:

```
[
  { _id: '652c19bac046c5d0785e73e8', name: 'Spaceman', age: 70 },
  { _id: '652c1b6dc046c5d0785e73ec', name: 'Niko', age: 65 }
]
```

which includes the correct string value for the `_id` property.

For most use cases, use the `serializeNonPOJOs` function. However, if you do need to directly manipulate a Mongo collection value the serialization method using the `Map` function is good to know about.