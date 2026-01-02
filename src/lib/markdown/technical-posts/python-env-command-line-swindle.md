---
title: Python env command line swindle
description: Python env command line swindle
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - python
  - powershell
---
It's generally a very bad idea to install Python Pip modules globally. The downside of this is that installing modules locally needs a [[python-env|Python virtual environment.]] That's easy to do and from the command line, not that much of a hassle to use.

However, it makes running any scripts in that environment from a PowerShell script troublesome.

One way to do that is:

Create this PowerShell script called `activator.ps1` and put it in the root of the Python project.

```
.\env\scripts\activate
```

This use this command line to run the `librettox.py` Python script:

```
& .\activator.ps1 && python librettox.py'
```

In this case, the `&` invokes a PowerShell script or command and the `&&` chains commands. After running the `activator.ps1` script the `python librettox.py` is run.

However, this requires the special case `activator.ps1` script and that's annoying. Here is a very good alternative:

```
.\env\scripts\python.exe librettox.py -b blah -t blah
```

When a Python virtual environment is created, a separate `python.exe` (on Windows) is placed inside the `env\Scripts` directory. This executable is configured to use the environment-specific packages and settings.

By running `python.exe` from within the `env\Scripts` directory, you effectively activate the virtual environment without needing a separate activation script or to environment variables. It’s like activating the environment implicitly because that `python.exe` is already set up to use the correct environment paths.

Who knew?

> [!info]
> For more context, take a look at the `env\scripts\activate.bat` or `env\scripts\activate.ps1` file. It is controlling which Python executable runs by manipulating environment variables.