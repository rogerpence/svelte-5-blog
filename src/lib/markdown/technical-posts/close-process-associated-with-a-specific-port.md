---
title: Close process associated with a specific port
description: Close process associated with a specific port
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-09-30T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - powershell
---
These two command lines are a way to kill a process associated with a port

```
$processId = (Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -eq 5173 }).OwningProcess
```

```
Stop-Process -Id $processId -Force
```

Two ways to do that on one line:

```
Stop-Process -Id (Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -eq 5173 }).OwningProcess -Force
```

```
$processId = (Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -eq 5173 }).OwningProcess; Stop-Process -Id $processId -Force

```

Show the local port and process id:

```
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -eq 5173 } | Select-Object LocalPort, OwningProcess
```

Confirm it with netstat:

```
netstat -ano | findstr :5173
```