---
title: Find and kill a Windows process with taskkill
description: Find and kill a Windows process with taskkill
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - windows
---
Find the process using port 5173

```
netstat -ano|findstr "PID :5173"
```

If found it shows the process number--in this case 18264. It may show more than one entry. Take the PID from the PID with where State = LISTENING.

![[Pasted image 20231108212021.png]]

To kill the process using port 5173, use task kill with that process's PID:

```
taskill /pid 18264 /f
```

![[Pasted image 20231108212216.png]]