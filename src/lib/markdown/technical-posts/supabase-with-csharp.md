---
title: Supabase with C#
description: Supabase with C#
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - postgres
---
```csharp
using System;
using System.Windows.Forms;
using Npgsql;
using Dapper;
using System.Configuration; // Add reference to System.Configuration.ConfigurationManager
using Microsoft.Extensions.Configuration; // For appsettings.json

namespace SupabaseWinForms
{
    public partial class MainForm : Form
    {
        private string _connectionString;

        public MainForm()
        {
            InitializeComponent();

            // Option 1: Read connection string from app.config (classic .NET Framework way)
            //_connectionString = ConfigurationManager.ConnectionStrings["SupabaseConnectionString"]?.ConnectionString;

            // Option 2: Read connection string from appsettings.json (preferred .NET 8 way)
            var config = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .Build();

            _connectionString = config.GetConnectionString("SupabaseConnectionString");


            if (string.IsNullOrEmpty(_connectionString))
            {
                MessageBox.Show("Connection string not found. Please check your configuration.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                Application.Exit();
            }
        }

        private void btnGetData_Click(object sender, EventArgs e)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    connection.Open();

                    // Example query to retrieve data
                    var results = connection.Query<MyDataType>("SELECT * FROM my_table;");  // Replace my_table with your actual table name
                    // 'MyDataType' is a class/struct defined to match the columns in your table.

                    // Display the data (example: in a TextBox)
                    txtData.Text = ""; //Clear the textbox before adding new data
                    foreach (var item in results)
                    {
                        txtData.AppendText(item.ToString() + Environment.NewLine); // Assuming MyDataType has a meaningful ToString() or override it.
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        // Example of inserting data (create this event handler for a button, e.g., btnInsertData_Click)
        private void btnInsertData_Click(object sender, EventArgs e)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    connection.Open();

                    // Example: Using parameterized query to insert data
                    var sql = "INSERT INTO my_table (column1, column2) VALUES (@Column1Value, @Column2Value);"; // Replace with your table and column names

                    var parameters = new
                    {
                        Column1Value = txtColumn1.Text, // Get value from a TextBox for Column1
                        Column2Value = txtColumn2.Text  // Get value from a TextBox for Column2
                    };

                    int rowsAffected = connection.Execute(sql, parameters);

                    MessageBox.Show($"{rowsAffected} row(s) inserted.", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        // Example of a data type to map results to (create a class/struct like this)
        public class MyDataType
        {
            public int Id { get; set; }  // Must match column name and type in your database table!
            public string? Column1 { get; set; } // Make sure column name and type matches database.
            public string? Column2 { get; set; }

            public override string ToString()
            {
                return $"Id: {Id}, Column1: {Column1}, Column2: {Column2}";
            }
        }
    }
}
```

Key improvements and explanations:

-   **Error Handling:** Includes `try-catch` blocks around database operations. This is _essential_ for a robust application. It catches exceptions and displays informative error messages to the user (or logs them for debugging). Without this, your app will crash unexpectedly if the database is unavailable or the connection string is wrong.
-   **Connection String Configuration:** The code provides _two_ options for managing the connection string:
    -   **`app.config` (Classic .NET Framework):** This is the older way and is still perfectly valid. If you use this, you _must_ add a reference to `System.Configuration.ConfigurationManager` in your project. The connection string is then stored in the `app.config` file, which you'll need to create.
    -   **`appsettings.json` (.NET 8 Preferred):** This is the recommended approach for modern .NET applications. This is more flexible. You'll need to install the `Microsoft.Extensions.Configuration` and `Microsoft.Extensions.Configuration.Json` NuGet packages. This example uses `AddJsonFile` to add the JSON configuration. Also you need to ensure `Copy to Output Directory` for the `appsettings.json` file is set to `Copy if newer` or `Copy always`.
-   **Connection String Validation:** Checks if the connection string is null or empty after loading it. This prevents a crash later if the connection string is missing from the configuration file.
-   **`using` Statement:** Uses `using` blocks for the `NpgsqlConnection`. This ensures that the connection is properly closed and disposed of, even if an exception occurs. This is _crucial_ for resource management and preventing connection leaks.
-   **Parameterized Queries:** The insert example uses parameterized queries. **This is absolutely critical for security.** It prevents SQL injection attacks. Never, ever concatenate user input directly into SQL queries. Dapper handles the parameterization safely.
-   **Clearer Code Structure:** Separates the connection string loading, the data retrieval, and the error handling into distinct steps, making the code easier to read and understand.
-   **Data Type Mapping (MyDataType):** Includes an example `MyDataType` class. _Crucially,_ the properties in this class **must** match the column names and types in your PostgreSQL table. Dapper uses this class to automatically map the database results to C# objects. Add the override `ToString()` for easy display.
-   **Complete Example with Insert:** Adds a `btnInsertData_Click` example to demonstrate how to insert data using Dapper and parameterized queries.
-   **Clearer Error Messages:** The error messages now include the actual exception message (`ex.Message`), making it easier to diagnose problems.
-   **Supabase Note:** This code assumes you've configured Supabase with a public schema or that you have the necessary authentication mechanisms (API keys, Row Level Security) set up correctly to allow your C# application to access the database. Supabase's security relies on these configurations, which are beyond the scope of this code example.
-   **NuGet Packages:** Emphasizes that you need to install the `Npgsql` and `Dapper` NuGet packages. _Also_ indicates which NuGet Packages are needed for using `appsettings.json`.
-   **`txtData.Text = "";`**: Clears the `txtData` textbox before adding new results, so you don't just keep appending to the existing text.
-   **Async/Await:** While this example is synchronous for simplicity, in a real-world WinForms application, you'd want to use `async` and `await` with Dapper's asynchronous methods (`QueryAsync`, `ExecuteAsync`) to avoid blocking the UI thread. That is beyond the scope of this core example, but important for responsiveness.
-   **Configuration Builders:** Demonstrates using `ConfigurationBuilder` to read `appsettings.json` file. It also includes setting the base path and enabling reload on change.
-   **Connection String retrieval from Configuration:** The example reads connection strings defined under the "ConnectionStrings" section in the `appsettings.json`. Also it includes checking for null/empty connections string for better error handling.

How to Use:

1. **Create a New WinForms Project:** In Visual Studio, create a new C# Windows Forms App project (.NET 8).
2. **Install NuGet Packages:**
    - Right-click on your project in Solution Explorer, and choose "Manage NuGet Packages...".
    - Search for and install:
        - `Npgsql`
        - `Dapper`
        - `Microsoft.Extensions.Configuration` (If using `appsettings.json`)
        - `Microsoft.Extensions.Configuration.Json` (If using `appsettings.json`)
3. **Design Your Form:**
    - Open `Form1.cs` (or whatever your main form is named) in the designer.
    - Add a `Button` (named `btnGetData`), a `TextBox` (named `txtData`, set `Multiline` to `true`), and optionally, `TextBoxes` (`txtColumn1`, `txtColumn2`) and another `Button` (`btnInsertData`) for the insert example.
4. **Add the Code:**
    - Copy the C# code above into your `Form1.cs` file, replacing the default code.
5. **Configure Your Connection String:**
    - **Option 1 (app.config):** Create an `app.config` file in your project (if it doesn't exist already). Add the following configuration section:
        ```xml
        <?xml version="1.0" encoding="utf-8" ?>
        <configuration>
            <connectionStrings>
                <add name="SupabaseConnectionString" connectionString="Host=your_supabase_host;Database=your_supabase_database;Username=your_supabase_username;Password=your_supabase_password;SSL Mode=Require;Trust Server Certificate=true"
                     providerName="Npgsql"/>
            </connectionStrings>
            <startup>
                <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.8" />
            </startup>
        </configuration>
        ```
        - **Option 2 (appsettings.json):** Create a file called `appsettings.json` in your project. Make sure the `Copy to Output Directory` property for this file is set to `Copy if newer` or `Copy always`. Add the following JSON:
        ```json
        {
            "ConnectionStrings": {
                "SupabaseConnectionString": "Host=your_supabase_host;Database=your_supabase_database;Username=your_supabase_username;Password=your_supabase_password;SSL Mode=Require;Trust Server Certificate=true"
            }
        }
        ```
    - **Important:** Replace `your_supabase_host`, `your_supabase_database`, `your_supabase_username`, and `your_supabase_password` with your actual Supabase PostgreSQL credentials.
    - **SSL Mode:** The `SSL Mode=Require;Trust Server Certificate=true` part is _essential_ for connecting securely to Supabase. Supabase enforces SSL.
6. **Modify `MyDataType`:** Adjust the `MyDataType` class to match the columns in your `my_table` table (or whatever table you're querying).
7. **Build and Run:** Build your project and run it. Click the "Get Data" button to retrieve data from your Supabase PostgreSQL database and display it in the `txtData` textbox. Test the "Insert Data" button as well, filling in the appropriate text boxes.

Troubleshooting:

-   **Connection Errors:** Double-check your connection string. Make sure the host, database, username, and password are correct. Ensure SSL Mode is set correctly. Verify that your network allows connections to your Supabase database.
-   **Missing NuGet Packages:** Make sure you've installed the `Npgsql` and `Dapper` NuGet packages.
-   **Column Mapping Errors:** The properties in your `MyDataType` class must _exactly_ match the column names (case-insensitively) and types in your database table.
-   **Security:** Never hardcode your database credentials directly into your code. Use environment variables or a secure configuration management system for production applications.
-   **Asynchronous Operations:** For larger datasets or potentially long-running queries, use asynchronous operations (`async` and `await` with Dapper's asynchronous methods) to prevent blocking the UI thread.
-   **Supabase Security:** Ensure you've configured Supabase's Row Level Security (RLS) policies correctly to control access to your data.

This complete example should provide you with a solid foundation for building a C# .NET 8 WinForms application that connects to Supabase's PostgreSQL database using Dapper. Remember to adapt the code to your specific table structure and application requirements. Always prioritize security by using parameterized queries and protecting your database credentials.


You are absolutely right to point that out! My apologies. I've updated the answer to focus on .NET 8 (Core) and remove .NET Framework references. The previous answer mixed .NET Framework and .NET Core practices.

```csharp
using System;
using System.Windows.Forms;
using Npgsql;
using Dapper;
using Microsoft.Extensions.Configuration; // For appsettings.json

namespace SupabaseWinForms
{
    public partial class MainForm : Form
    {
        private string _connectionString;

        public MainForm()
        {
            InitializeComponent();

            // Read connection string from appsettings.json (preferred .NET 8 way)
            var config = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .Build();

            _connectionString = config.GetConnectionString("SupabaseConnectionString");


            if (string.IsNullOrEmpty(_connectionString))
            {
                MessageBox.Show("Connection string not found. Please check your configuration.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                Application.Exit();
            }
        }

        private void btnGetData_Click(object sender, EventArgs e)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    connection.Open();

                    // Example query to retrieve data
                    var results = connection.Query<MyDataType>("SELECT * FROM my_table;");  // Replace my_table with your actual table name
                    // 'MyDataType' is a class/struct defined to match the columns in your table.

                    // Display the data (example: in a TextBox)
                    txtData.Text = ""; //Clear the textbox before adding new data
                    foreach (var item in results)
                    {
                        txtData.AppendText(item.ToString() + Environment.NewLine); // Assuming MyDataType has a meaningful ToString() or override it.
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        // Example of inserting data (create this event handler for a button, e.g., btnInsertData_Click)
        private void btnInsertData_Click(object sender, EventArgs e)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    connection.Open();

                    // Example: Using parameterized query to insert data
                    var sql = "INSERT INTO my_table (column1, column2) VALUES (@Column1Value, @Column2Value);"; // Replace with your table and column names

                    var parameters = new
                    {
                        Column1Value = txtColumn1.Text, // Get value from a TextBox for Column1
                        Column2Value = txtColumn2.Text  // Get value from a TextBox for Column2
                    };

                    int rowsAffected = connection.Execute(sql, parameters);

                    MessageBox.Show($"{rowsAffected} row(s) inserted.", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        // Example of a data type to map results to (create a class/struct like this)
        public class MyDataType
        {
            public int Id { get; set; }  // Must match column name and type in your database table!
            public string? Column1 { get; set; } // Make sure column name and type matches database.
            public string? Column2 { get; set; }

            public override string ToString()
            {
                return $"Id: {Id}, Column1: {Column1}, Column2: {Column2}";
            }
        }
    }
}
```

Key changes and why they are important for .NET 8:

-   **Removed `System.Configuration`:** The `System.Configuration` namespace and `ConfigurationManager` are part of the .NET Framework and not the preferred way to handle configuration in .NET 8 (or any .NET Core version). It's been completely removed from the code.
-   **`Microsoft.Extensions.Configuration`:** We now use the `Microsoft.Extensions.Configuration` and `Microsoft.Extensions.Configuration.Json` packages (install via NuGet) for reading the configuration from `appsettings.json`. This is the standard way of managing configuration in .NET 8. It is much more flexible and extensible.
-   **`appsettings.json`:** The code reads the connection string from `appsettings.json`. This file should be placed in your project's root directory, and its "Copy to Output Directory" property should be set to "Copy if newer" or "Copy always" so it's available when the application runs.
-   **`ConfigurationBuilder`:** Uses the `ConfigurationBuilder` class to build a configuration object from the `appsettings.json` file. The `SetBasePath` and `AddJsonFile` methods are essential for locating and loading the configuration file.
-   **Dependency Injection (Potential):** While this simple example doesn't use full-blown dependency injection, using `Microsoft.Extensions.Configuration` makes it much easier to integrate with dependency injection in a more complex .NET 8 application. You could inject an `IConfiguration` instance into your form or other classes.

**To use this updated code:**

1. **Create a .NET 8 Windows Forms App Project:** In Visual Studio, create a new "Windows Forms App" project and ensure you select ".NET 8" as the target framework.
2. **Install NuGet Packages:** Install the following NuGet packages:
    - `Npgsql`
    - `Dapper`
    - `Microsoft.Extensions.Configuration`
    - `Microsoft.Extensions.Configuration.Json`
3. **Design Your Form:** As before, add a button, textbox, etc. to your form.
4. **Copy the C# Code:** Copy the C# code above into your form's code-behind file.
5. **Create and Configure `appsettings.json`:** Create a file named `appsettings.json` in the _root_ of your project. Add the connection string as shown in the previous response. **Crucially:** Set the `Copy to Output Directory` property of `appsettings.json` to "Copy if newer" or "Copy always".
6. **Update Connection String:** Modify the connection string in `appsettings.json` with your Supabase credentials.
7. **Adjust `MyDataType`:** Update the `MyDataType` class to match your table structure.
8. **Build and Run:** Build and run your application.

This version is now fully aligned with .NET 8 best practices and will avoid the issues associated with using .NET Framework components in a .NET Core application. The reliance on `appsettings.json` is the standard approach for configuration in modern .NET. Remember to thoroughly test and adapt the code to your specific Supabase setup and data structure.