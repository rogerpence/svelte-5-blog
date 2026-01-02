---
title: My Starship configuration file
description: My Starship configuration file
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - utilities
---
[Starship command line utility](https://starship.rs/)

[Starship ANSI colors](https://i.sstatic.net/KTSQa.png)


The `starship.toml` file location:

```
c:\users\thumb\documents\.config
```

My `starship.toml` config file:

```

#[git_branch]
#symbol = '🌱 '
#truncation_length = 4
#truncation_symbol = ''
##ignore_branches = ['master', 'main']


command_timeout = 500
# format = "$time$directory$git_branch$cmd_duration$character"
format = "$time$directory$git_branch$git_status$python$character"
[line_break]
disabled = true

[character]
# success_symbol is the right pointy shape.
# I don't where I got the right-pointing arrow symbol!
success_symbol= "[](fg:#DFFF00)"
#success_symbol = "[➜](bold green) "
error_symbol = "[✗](bold red) "

[cmd_duration]
min_time = 500
format = "took [$duration](bold yellow) "

[directory]
read_only = " "
truncation_length = 3
truncation_symbol = "~/"
style = "fg:yellow bg:blue"
format="[ $path ]($style)"


[git_branch]
#symbol = "  "
symbol = '🌱'
style = "fg:black bg:36"
format = "[$symbol$branch]($style)"

[time]
disabled = false
#format = '[ 🕙 $time ]($style) '
format = '[ $time ]($style)'
time_format = "%I:%M"
utc_time_offset = "+7"
style = "fg:black bg:69"

[git_commit]
disabled = true

[git_state]
disabled = true

[git_status]
disabled = false
modified = '!'
style="fg:black bg:green"
format='[$modified]($style)'

[package]
disabled = true

[python]
disabled=false
# symbol = '🐍 '
# symbol = ' env '
style="fg:black bg:#F5B041"
format='[$virtualenv]($style)'
```