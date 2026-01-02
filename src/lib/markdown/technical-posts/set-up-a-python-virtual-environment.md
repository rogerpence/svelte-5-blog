---
title: Set up a Python virtual environment
description: Set up a Python virtual environment
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - python
---
This uses Python's built-in virtual environment, venv

[https://docs.python.org/3/library/venv.html](https://docs.python.org/3/library/venv.html)

Create a project directory

```json
mkdir my_project
```

Change to that project directory

```json
cd my_project
```

Create a virtual environment on Windows

```json
python -m venv env
```

Active the environment in my_project

```json
env\scripts\activate
```

([environment name]) should show on command line

To deactivate a VM

```json
deactivate
```

To save local dependencies:

```powershell
pip freeze > requirements.txt
```

To restore dependencies in a virtual environment:

First, start the environment

```powershell
env\scripts\activate
```

Then restore local dependencies:

```powershell
pip install -r requirements.txt
```