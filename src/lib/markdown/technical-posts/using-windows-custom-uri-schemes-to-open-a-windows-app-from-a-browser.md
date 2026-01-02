---
title: Using Windows Custom URI Schemes to open a Windows app from a browser
description: Using Windows Custom URI Schemes to open a Windows app from a browser
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - windows
---
Windows' **Custom URI Schemes** (also known as custom protocol handlers) is a way to allow a web browser (or any other application) to launch a specific Windows executable, potentially passing it some data.

**How it Works:**

1.  **Registration:** Your Windows executable (or its installer) needs to register a custom URI scheme in the Windows Registry. For example, you could register `myapp://`.
2.  **Invocation:** In your browser, you create a link like `<a href="myapp://some/data?param=value">Launch My App</a>`.
3.  **Browser Handling:** When a user clicks this link, the browser sees the `myapp://` scheme. It doesn't know how to handle it directly.
4.  **OS Lookup:** The browser asks Windows, "Hey, do you know how to handle `myapp://`?"
5.  **Execution:** Windows checks its registry, finds the registration for `myapp://`, and sees that it points to `C:\Path\To\YourApp.exe`. Windows then launches `YourApp.exe`, passing the full URI (`myapp://some/data?param=value`) as a command-line argument.
6.  **Application Logic:** Your `YourApp.exe` then needs to be programmed to parse this command-line argument to understand what action to take or what data to process.


Here's a step-by-step guide:

**Step 1: Create or Identify Your Executable**

Let's assume you have an executable, say `C:\MyTools\MyLauncher.exe`. This application should be designed to accept command-line arguments.

For example, a simple C# console app that just shows its arguments:

```csharp
// MyLauncher.cs
using System;
using System.Windows.Forms; // For MessageBox

public class MyLauncher
{
    public static void Main(string[] args)
    {
        if (args.Length > 0)
        {
            MessageBox.Show("Launched with URI: " + args[0], "MyLauncher");
            // Here you would parse args[0] (the full URI)
            // e.g., if URI is myapp://open?file=C:\doc.txt
            // you'd extract "C:\doc.txt" and open it.
        }
        else
        {
            MessageBox.Show("Launched directly (no URI).", "MyLauncher");
        }
    }
}
```

Compile this into `MyLauncher.exe`.

**Step 2: Register the Custom URI Scheme in the Registry**

You need to create specific registry keys. You can do this manually with `regedit` (requires admin rights) or by creating a `.reg` file and importing it (also requires admin rights).

Let's say your custom scheme is `mycoolapp://`.

Create a `.reg` file (e.g., `register_mycoolapp.reg`) with the following content. **Make sure to replace `C:\\MyTools\\MyLauncher.exe` with the actual, correctly-escaped path to your executable.**

```reg
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\mycoolapp]
@="URL:MyCoolApp Protocol"
"URL Protocol"=""

[HKEY_CLASSES_ROOT\mycoolapp\shell]

[HKEY_CLASSES_ROOT\mycoolapp\shell\open]

[HKEY_CLASSES_ROOT\mycoolapp\shell\open\command]
@="\"C:\\MyTools\\MyLauncher.exe\" \"%1\""
```

**Explanation of the .reg file:**

-   `[HKEY_CLASSES_ROOT\mycoolapp]`: Defines the root key for your custom scheme.
-   `@="URL:MyCoolApp Protocol"`: A descriptive name for the protocol.
-   `"URL Protocol"=""`: An empty string value that identifies this key as a custom protocol handler.
-   `[HKEY_CLASSES_ROOT\mycoolapp\shell\open\command]`: Specifies the command to execute when the protocol is invoked.
-   `@="\"C:\\MyTools\\MyLauncher.exe\" \"%1\""`:
    -   `"C:\\MyTools\\MyLauncher.exe"`: The full path to your executable. Note the double backslashes for escaping in `.reg` files. The path itself is enclosed in quotes to handle spaces.
    -   `\"%1\"`: This is crucial. Windows will replace `%1` with the full URI that was clicked (e.g., `mycoolapp://some/info?value=test`). The quotes around `%1` ensure that the entire URI, even if it contains spaces (though typically not recommended in URIs), is passed as a single argument.

**To import the .reg file:**

1.  Save the content above into a file named `register_mycoolapp.reg`.
2.  Double-click the file.
3.  Approve the User Account Control (UAC) prompt and confirm you want to add the information to the registry.

**Step 3: Create an HTML Link to Trigger the Protocol**

Create a simple HTML file (e.g., `launcher.html`):

```html
<!DOCTYPE html>
<html>
    <head>
        <title>App Launcher</title>
    </head>
    <body>
        <h1>Launch My Windows App</h1>
        <p>
            <a href="mycoolapp://HelloFromBrowser?user=Alice&action=view">
                Launch MyCoolApp with Data
            </a>
        </p>
        <p>
            <a href="mycoolapp://justlaunch"> Launch MyCoolApp (Simple) </a>
        </p>

        <script>
            function launchWithJS() {
                window.location.href = "mycoolapp://LaunchedViaJavaScript";
            }
        </script>
        <button onclick="launchWithJS()">Launch via JavaScript</button>
    </body>
</html>
```

**Step 4: Test It**

1.  Ensure `MyLauncher.exe` is in `C:\MyTools\`.
2.  Import the `.reg` file.
3.  Open `launcher.html` in your web browser (Edge, Chrome, Firefox, etc.).
4.  Click one of the links or the button.

The first time you click such a link, your browser will likely show a security prompt asking for permission to open the external application (MyCoolApp Protocol or MyLauncher.exe). Allow it.

Your `MyLauncher.exe` should then run, and if you used the C# example, a MessageBox will appear showing the full URI that was passed as an argument.

**Step 5: Your Application Parses the Argument**

Your `MyLauncher.exe` receives `mycoolapp://HelloFromBrowser?user=Alice&action=view` as `args[0]`. It needs to:

1.  Verify that the argument starts with `mycoolapp://`.
2.  Parse the rest of the string (e.g., path, query parameters) to decide what to do. Libraries for URI parsing can be helpful here.


**Security Considerations (Very Important!):**

1.  **User Consent:** Browsers will (and should) prompt the user for permission before launching an external application via a custom URI scheme. This is a crucial security feature.
2.  **Input Sanitization:** The URI (`%1`) passed to your application can be crafted by _any website_. Your application **must** treat this input as potentially malicious. Sanitize and validate it thoroughly before using it to open files, execute commands, or make system changes. Do not trust it blindly.
3.  **No Silent Execution:** You cannot typically bypass the browser's confirmation dialog for security reasons.
4.  **Installation Required:** The custom URI scheme must be registered on the user's system _before_ the links will work. If it's not registered, the browser will report an error (e.g., "Address was not understood" or "Unknown protocol").
5.  **Limited Scope:** This is for launching an already installed application. It's not for distributing or installing software (though the launched application could _then_ trigger an update or further downloads if designed to do so).

This method provides a powerful way to integrate web experiences with local desktop applications on Windows.