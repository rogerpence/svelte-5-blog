---
title: Using CliWrap to launch a PowerShell script
description: Using CliWrap to launch a PowerShell script
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - csharp
  - powershell
---
[CliWrap](https://github.com/Tyrrrz/CliWrap) is a very good Nuget package that launches Windows processes (with many very good features). Once you use CliWrap, you won't ever reach for `System.Diagnostics.Process` again.

### Launching a PowerShell script from C\#

In this example, the PowerShell script is executing a Python script (that uses Python's `env` virtual environment)

```c#
using CliWrap;
using CliWrap.Buffered;

...

string pythonScriptWithArgs = GetPythonScriptAndArgs()
string activatePythonEnv = @".\env\scripts\python.exe";
string combinedCommand = @$"{activatePythonEnv} {pythonScriptWithArgs}";
string stdOutText = "";
string stdErrorText = "";

try
{
	var pythonResult = await Cli.Wrap("pwsh.exe")
			.WithWorkingDirectory(this.librettoRootFolder)
			.WithArguments($"-NoProfile -ExecutionPolicy Bypass -Command \"{combinedCommand}\"")
			.WithValidation(CommandResultValidation.None)
			.ExecuteBufferedAsync();

	stdOutText = pythonResult.StandardOutput;
	stdErrorText = pythonResult.StandardError;
}
catch (Exception ex)
{
	string err = ex.Message;
	string err1 = ex.InnerException.Message;
}

List<string> msgs = new List<string>();
msgs = (stdErrorText.Trim().Length != 0) ?
	stdErrorText.Split(Environment.NewLine).ToList<string>() :
	stdOutText.Split(Environment.NewLine).ToList<string>();
```

Code notes:

-   `pwsh.exe` is the name of the PowerShell 7 executable (the older binary is `powershell.exe`).
-   The `combinedCommand` is passed along to PowerShell to execute.
-   The `withArguments` method provides the command line arguments PowerShell needs.
-   The `WithValidation(CommandResultValidation.None)` bypasses CliWrap's default exit code validation. Standard out and standard error are captured in the `stdOutText` and `stdErrorText` variables.
-   Unless something really screwy happens, disabling command result validation means the `try/catch` is probably moot--but I'm gonna leave it there.
-   The `msgs` string collection contains either the success or error messages. Depending on how you're using that messages, you may not need to convert that strings to a string list.
-   Use CliWrap's `ExecuteBufferedAsync` method if you want to capture standard output.
-   Because this use of CliWrap uses `await` be sure to put this code in an async function.

The `pythonScriptWithArgs` variable should provide the Python script name and any command line arguments it needs. For example, to call the Libretto, it might have this value:

```
librettox.py -t 'supabase\all-tables-schema.tpl.html' -s 'supabase\supabase-downloads-schemas.json' -o 'supabase'
```