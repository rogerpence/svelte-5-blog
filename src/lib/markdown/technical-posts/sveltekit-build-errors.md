---
title: SvelteKit build errors
description: SvelteKit build errors
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
## Error: Not found: [path reference here]

![[Git.png]]

There may be other conditions, but in this case, there is a link to this route in the app which does not exist:

```
/pipeline-2023-3
```

The clue as to where this reference occurs is this line:

![[Pasted image 20231207133050.png]]
where the `(linked from /)` indicates the error is referenced by something in the root path.

This 404 error appears to be a "die now" error for the build process. That is, if the errant route reference exists in more than one place, the build dies on the first reference. After fixing that first reference, another builds shows the next errant occurrence.