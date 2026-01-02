---
title: PC Setup
description: PC Setup
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - utilities
---
## Terminal

-   Install Nerdfont (currently using Anonymous Pro )
-   PowerShell 7 Terminal settings

![[windows-terminal-powershell-config.png|500]]

## PowerShell

## Git---

description:
date_created: 2025-01-05 12:00
date_updated: 2025-01-05 12:00
date_published:
tags:



General setup https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup
SSH https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

```powershell
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com

Get-Service -Name ssh-agent | Set-Service -StartupType Manual
Start-Service ssh-agent
```

## Resilio

[[Resilio folder syncing]]

## PowerShell

-   Install PowerShell 7
-   Make it the default profile in Terminal

```
Invoke-Expression (&starship init powershell)

function get-pwd {
    (pwd).path | Set-Clipboard
}

function Invoke-PowerShell {
    powershell -nologo
    Invoke-PowerShell
}

function start-live-server {
    # --open=/public
    live-server --port=5386
}

function runc {
    pnpm run postcss:watch
}

function rund {
    pnpm run dev
}

function runb {
    pnpm run build
}
```

# Open a new MS Terminal tab at the current location.

## Starship

-   Have a Nerdfont and PowerShell already configured
-   Install Starship
-   Add `.config` folder to `c:\users\[user]`
-   Add `starship.toml` to `.config` folder

## Tweaks

Christ Titus WinUtil

```
irm "https://christitus.com/win" | iex
```

It's "Advanced Tweaks" removes the Gallery from the Explorer and restores the Win 20 context menu.