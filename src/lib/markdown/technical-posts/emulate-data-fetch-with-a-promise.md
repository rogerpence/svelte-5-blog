---
title: Emulate data fetch with a promise
description: Emulate data fetch with a promise
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - javascript
  - promise
  - fetch
---
```
// Simulate fetching live data with dummy data
async function fetchDummyData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const dummyData = [
                { id: 1, family_id: 132, release_date: '2024-08-04', product_id: 101 },
                { id: 2, family_id: 132, release_date: '2024-08-04', product_id: 102 },
                { id: 3, family_id: 139, release_date: '2024-05-09', product_id: 103 },
                { id: 4, family_id: 139, release_date: '2024-05-09', product_id: 104 }
            ];
            resolve(dummyData);
        }, 1000); // Simulate a 1-second delay
    });
}

// Example usage
fetchDummyData().then(data => {
    console.log('Fetched dummy data:', data);
});

// Or...
const data = await fetchDummyData()
```