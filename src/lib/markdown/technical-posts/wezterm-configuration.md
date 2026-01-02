---
title: WezTerm configuration
description: WezTerm configuration
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - utilities
---
I don't think I'll ever use it, but here is a WezTerm config for Windows:

```
local wezterm = require("wezterm")
local config = wezterm.config_builder()

config.font_size = 15
config.window_decorations = "RESIZE"

config.window_background_opacity = 0.7


config.default_prog = { 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe' }

return config
```