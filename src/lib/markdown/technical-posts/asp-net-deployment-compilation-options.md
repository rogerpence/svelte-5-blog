---
title: ASP.NET WebForms deployment compilation options
description: ASP.NET WebForms deployment compilation options
date_created: '2025-07-08T00:00:00.000Z'
date_updated: '2025-09-30T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - webforms
  - asp-net
---
Question: my asp.net webforms asp.net .net framework app works when deployed with "precompile during publishing" disabled. When I enable that feature, the site does not work

This is a classic and often frustrating issue. When an ASP.NET Web Forms application works perfectly fine with a standard "copy all files" deployment but fails when "Precompile during publishing" is enabled, it's a strong indicator that you have a **latent bug or a structural problem in your project that only the strictness of the precompiler can expose.**

Let's break down what precompilation does and why it causes these failures.

### The Fundamental Difference: What Precompilation Does

*   **Without Precompilation:** You deploy your `.aspx`, `.ascx`, `.cs`, and `.vb` files to the server. The first time a page is requested, the ASP.NET runtime compiles it *just-in-time* (JIT) into a temporary assembly in the `C:\Windows\Microsoft.NET\Framework...\Temporary ASP.NET Files` folder. This is flexible and forgiving.

*   **With Precompilation:** Before deployment, a tool called `aspnet_compiler.exe` runs. It compiles **everything**—all your pages (`.aspx`), user controls (`.ascx`), and code-behind files—into a set of DLLs that are placed in the `bin` folder. The original source code and markup files (except for static content) are **not deployed**.

The precompiler is much stricter than the runtime JIT compiler. It has to resolve every dependency and type reference across the entire application at once, which reveals problems that might otherwise go unnoticed.


### Top 5 Reasons for Precompilation Failures

Here are the most common causes, from most likely to least likely.

#### 1. Mismatched `Inherits` and `CodeBehind`/`CodeFile` Attributes

This is the #1 cause for Web Forms. Every `.aspx` page has a directive at the top.

```aspx
<%@ Page Language="C#" AutoEventWireup="true" CodeFile="MyPage.aspx.cs" Inherits="MyProject.MyPage" %>
```

*   **`Inherits="MyProject.MyPage"`**: This tells the compiled framework which class to instantiate for this page. The value must be the **fully qualified class name** (Namespace + Class Name).
*   **`CodeFile="MyPage.aspx.cs"`**: This is used by Visual Studio and the JIT compiler to find the source code file for dynamic compilation. **The precompiler relies more heavily on the `Inherits` attribute.**

**How it fails:**
*   You renamed a class in the `.cs` file but forgot to update the `Inherits` attribute in the `.aspx` file.
*   You changed a namespace but didn't update the `Inherits` attribute.
*   You copied a page and its code-behind but only updated the class name in one place.

Without precompilation, Visual Studio can often resolve this ambiguity. The precompiler cannot; it sees a mismatch and fails.

#### 2. Dynamic Loading of Controls or Assemblies (`LoadControl`)

If your code dynamically loads user controls (`.ascx` files) using `Page.LoadControl("path/to/mycontrol.ascx")`, this will fail with precompilation.

**Why?** The file `path/to/mycontrol.ascx` **does not exist on the server** after precompilation. It has been compiled into a class inside one of the `bin` folder DLLs.

**Solution:** You must load the control by its **type** instead of its path.

```csharp
// ---- BAD: Fails with precompilation ----
Control myControl = Page.LoadControl("~/Controls/MyControl.ascx");
this.PlaceHolder1.Controls.Add(myControl);

// ---- GOOD: Works with precompilation ----
// You might need to add a @Register directive to your page or web.config
// to make the type known, or just reference the compiled assembly.
Control myControl = Page.LoadControl(typeof(MyProject.Controls.MyControl), null);
this.PlaceHolder1.Controls.Add(myControl);
```

The same logic applies to any code that uses reflection to load assemblies or types by a hardcoded file name or path.

#### 3. Precompilation Merging Options and Naming Conflicts

In the publish settings, you have advanced options for precompilation, especially "Merge all outputs into a single assembly."

*   **Without Merging:** The precompiler creates many small assemblies with generated names like `App_Web_mypage.aspx.cdcab7d2.dll`.
*   **With Merging:** The precompiler combines all these small DLLs into one (or a few) larger, explicitly named DLLs.

**How it fails:**
*   **`GetType()` Ambiguity:** If your code uses `Type.GetType("MyProject.MyClass")`, it might fail because it can't determine which of the many `App_Web_*.dll` assemblies contains that type.
*   **Merging Conflicts:** If you have two classes with the same name in different namespaces that end up being merged, it can cause compilation errors.
*   **Public vs. Internal:** A class that was `internal` might have been accessible to another class within the same project. After merging, if they end up in different generated assemblies, this can break. Changing the class to `public` often fixes this.

#### 4. Circular Dependencies

Your project might have circular dependencies that the standard build process tolerates but the precompiler does not.
For example:
*   User Control A (`ControlA.ascx`) has a reference to User Control B.
*   User Control B (`ControlB.ascx`) has a reference back to User Control A.

The `aspnet_compiler.exe` tool may fail to resolve this circular reference and throw an error.

#### 5. Environment-Specific `web.config` Issues

Sometimes a setting in your `Web.Release.config` transform is incorrect. When you run locally, you use `Web.Debug.config`, but the publish process applies the release transform.

A common issue is the `<compilation>` element. A bad transform could remove or incorrectly modify this section, which is critical for the application to run. Make sure that after the transform, your production `web.config` has `debug="false"` but is otherwise complete.

```xml
<!-- In your deployed web.config, ensure this is set correctly -->
<system.web>
  <compilation debug="false" targetFramework="4.7.2" />
  <!-- ... other settings ... -->
</system.web>
```


### How to Troubleshoot This

1.  **Get the Real Error Message.** "The site does not work" isn't enough. You need the actual exception.
    *   In your production `web.config`, temporarily set `<customErrors mode="Off" />`.
    *   Browse to the site. You should now see the detailed "Yellow Screen of Death" with a stack trace. This will often point you directly to the problematic page, control, or line of code.
    *   Check the Windows Event Viewer on the server under **Windows Logs > Application**. ASP.NET logs serious startup failures there.

2.  **Run the Precompiler Locally.** You can simulate the exact publish process on your developer machine.
    *   Open the **Developer Command Prompt for Visual Studio** (it has all the environment paths set up).
    *   Navigate to your project's root directory.
    *   Run the `aspnet_compiler.exe` command.

    ```shell
    // Basic precompilation command
    // -p: path to the source application
    // -v: virtual path (usually just "/")
    // target_directory: where to put the compiled output
    aspnet_compiler -p . -v / c:\temp\PrecompiledSite
    ```
    This will run the compiler with its default settings. If it fails, it will give you a specific compilation error message that you won't see in Visual Studio's "Build Output" window.

3.  **Experiment with Precompilation Settings.** In the Visual Studio Publish Profile settings (`Settings > File Publish Options`):
    *   Uncheck **"Allow this precompiled site to be updatable."** This performs the strictest compilation and is most likely to reveal errors. The `.aspx` and `.ascx` files will be replaced with tiny "marker" files. This mode is most likely to fail if you are using `LoadControl` with a path.
    *   Try toggling the **"Merge all outputs into a single assembly"** option. If it works with merging disabled but fails with it enabled, you likely have a `GetType()` or type-resolution problem.