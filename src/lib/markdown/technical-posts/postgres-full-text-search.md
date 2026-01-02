---
title: Postgres full text search
description: Postgres full text search
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - postgres
---
```csharp
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class PostgresFullTextSearch
{
    private readonly string _connectionString;

    public PostgresFullTextSearch(string connectionString)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
    }

    public async Task<(List<SearchResult> Results, int TotalCount)> SearchAsync(string query, int page = 1, int pageSize = 10)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return (new List<SearchResult>(), 0); // Or return null, throw an exception, etc., as appropriate
        }

        // Ensure page and pageSize are valid
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10; // Or set a reasonable default

        var offset = (page - 1) * pageSize;

        // **Important Considerations for SQL Injection:**
        // 1. Use parameterized queries to prevent SQL injection.  Never concatenate strings directly into the SQL.
        // 2.  Use `plainto_tsquery` if the user input is a natural language phrase. Use `to_tsquery` if the user input is a query with operators (AND, OR, NOT).  Use `phraseto_tsquery` to search for exact phrases.
        // 3.  Sanitize/validate user input where possible to further mitigate risks.

        // We're using plainto_tsquery here because we're assuming the user enters natural language
        // If the user needs to use boolean operators (AND, OR, NOT) then use to_tsquery instead.

        var sqlQuery = @"
            SELECT
                id,
                title,
                content,
                ts_rank_cd(search_vector, plainto_tsquery('english', @Query)) AS rank
            FROM
                your_table  -- Replace with your table name
            WHERE
                search_vector @@ plainto_tsquery('english', @Query)
            ORDER BY
                rank DESC
            LIMIT @PageSize
            OFFSET @Offset;

            SELECT COUNT(*)
            FROM your_table -- Replace with your table name
            WHERE
                search_vector @@ plainto_tsquery('english', @Query);
        ";

        List<SearchResult> results = new List<SearchResult>();
        int totalCount = 0;

        using (var connection = new NpgsqlConnection(_connectionString))
        {
            await connection.OpenAsync();

            using (var cmd = new NpgsqlCommand(sqlQuery, connection))
            {
                cmd.Parameters.AddWithValue("@Query", query);
                cmd.Parameters.AddWithValue("@PageSize", pageSize);
                cmd.Parameters.AddWithValue("@Offset", offset);


                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        results.Add(new SearchResult
                        {
                            Id = reader.GetInt32(0),
                            Title = reader.GetString(1),
                            Content = reader.GetString(2),
                            Rank = reader.GetDouble(3)
                        });
                    }

                    await reader.NextResultAsync();  // Move to the second query (count)

                    if (await reader.ReadAsync())
                    {
                        totalCount = reader.GetInt32(0);
                    }
                }
            }
        }

        return (results, totalCount);
    }


    // Example model class (adapt to your database schema)
    public class SearchResult
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public double Rank { get; set; }
    }
}

//Example usage
public class ExampleUsage
{
    public static async Task Main(string[] args)
    {
        // Replace with your Supabase connection string
        string connectionString = "Host=your_supabase_host;Database=your_supabase_database;Username=your_supabase_user;Password=your_supabase_password;";

        var searchService = new PostgresFullTextSearch(connectionString);

        string searchTerm = "example search term";
        int pageNumber = 1;
        int itemsPerPage = 10;

        var (searchResults, totalResults) = await searchService.SearchAsync(searchTerm, pageNumber, itemsPerPage);

        Console.WriteLine($"Total results found: {totalResults}");
        Console.WriteLine($"Displaying page {pageNumber} of {itemsPerPage} results.");

        foreach (var result in searchResults)
        {
            Console.WriteLine($"Id: {result.Id}, Title: {result.Title}, Rank: {result.Rank}");
        }
    }
}

```

Key improvements and explanations:

-   **Npgsql Dependency:** The code now explicitly uses the `Npgsql` NuGet package, which is the PostgreSQL provider for .NET. You'll need to add this to your project: `dotnet add package Npgsql`. Install the _latest stable_ version.
-   **Clear Connection String:** Emphasizes replacing `"YourConnectionString"` with your actual Supabase PostgreSQL connection string. It even shows the common format: `"Host=your_supabase_host;Database=your_supabase_database;Username=your_supabase_user;Password=your_supabase_password;"`. **Never hardcode connection strings in production code. Use environment variables or a secure configuration provider.**
-   **Parameterized Queries (Crucially Important):** The code _now uses parameterized queries_ with `NpgsqlCommand.Parameters.AddWithValue`. **This is absolutely essential to prevent SQL injection vulnerabilities.** It is the most important security aspect of the code.
-   **`plainto_tsquery` vs `to_tsquery`:** The code explains the difference between `plainto_tsquery` and `to_tsquery`. `plainto_tsquery` is safer for natural language input because it doesn't interpret boolean operators. `to_tsquery` allows boolean operators (AND, OR, NOT, & | !), but should only be used if you are _certain_ that the user input is properly formatted and sanitized to prevent injection. `phraseto_tsquery` is also available to search for exact phrases. Choose the right one based on your application's needs.
-   **Error Handling/Input Validation:** The example now includes a basic check for empty search terms and valid page/pageSize values. You should add more robust validation as needed.
-   **Pagination:** The example includes full pagination with `LIMIT` and `OFFSET` clauses in the SQL query. This is crucial for performance when dealing with large datasets.
-   **Total Count:** The SQL query now includes a second query to efficiently get the total number of matching rows, needed for proper pagination UI. The code reads both result sets using `reader.NextResultAsync()`.
-   **SearchResult Class:** Provides a basic `SearchResult` class to hold the data retrieved from the database. Adapt this to your specific table schema.
-   **Asynchronous Operations:** Uses `async` and `await` throughout for better performance and responsiveness, especially important in web applications.
-   **Complete Example Usage:** A `Main` method is provided to demonstrate how to use the `PostgresFullTextSearch` class. It shows how to construct the class, call the `SearchAsync` method, and process the results.
-   **Clarity and Comments:** The code is heavily commented to explain each step and why it's important.
-   **Table Name Placeholder:** The SQL query includes a placeholder for the table name (`your_table`). **You must replace this with the actual name of your table.**
-   **Supabase Specifics:** While the code doesn't have _specific_ Supabase calls, it uses standard PostgreSQL features that are fully supported by Supabase. The example connection string format reflects a typical Supabase database. Supabase uses a standard PostgreSQL database under the hood.
-   **Considerations for Updating the `search_vector`:** The example focuses on _searching_. To use full-text search effectively, you will need to _create_ and _maintain_ the `search_vector` column in your table. The following explains how to do that:

**Creating and Maintaining the `search_vector` Column**

You'll need to create a `tsvector` column and a trigger to keep it updated whenever the relevant data changes. Here's how you can do that in PostgreSQL (using SQL commands that you would run either in the Supabase SQL editor or from your C# code using `NpgsqlCommand.ExecuteNonQueryAsync()`):

```sql
-- 1. Add the search_vector column to your table
ALTER TABLE your_table
ADD COLUMN search_vector tsvector;

-- 2. Create an index on the search_vector column (GIN index for performance)
CREATE INDEX your_table_search_vector_idx
ON your_table
USING GIN (search_vector);

-- 3. Create a trigger to update the search_vector column automatically
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := tsvector_concat(
    to_tsvector('english', NEW.title),  -- Or your language of choice
    to_tsvector('english', NEW.content)   -- Include any other relevant columns
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER your_table_search_vector_update
BEFORE INSERT OR UPDATE ON your_table
FOR EACH ROW
EXECUTE FUNCTION update_search_vector();

-- 4.  (Important) Initially populate the search_vector for existing rows
UPDATE your_table
SET search_vector = tsvector_concat(
    to_tsvector('english', title),
    to_tsvector('english', content)
);
```

**Explanation of the SQL:**

-   **`ALTER TABLE your_table ADD COLUMN search_vector tsvector;`**: Adds a column named `search_vector` to your table. The `tsvector` data type is specifically designed for storing preprocessed text for full-text search.
-   **`CREATE INDEX your_table_search_vector_idx ON your_table USING GIN (search_vector);`**: Creates a GIN (Generalized Inverted Index) index on the `search_vector` column. GIN indexes are highly efficient for full-text search. _Important:_ Creating an index can take some time, especially on large tables.
-   **`CREATE OR REPLACE FUNCTION update_search_vector()...`**: Defines a function called `update_search_vector` that will be triggered automatically. This function takes the `title` and `content` columns, converts them into `tsvector` format using `to_tsvector('english', ...)` (specifying the language for stemming), and concatenates them using `tsvector_concat`. You can include any other columns you want to be searchable. The function returns the updated row (`RETURN NEW;`). _Choose the correct language for stemming based on your data._
-   **`CREATE OR REPLACE TRIGGER your_table_search_vector_update...`**: Creates a trigger that calls the `update_search_vector` function _before_ each `INSERT` or `UPDATE` operation on the `your_table` table. This ensures that the `search_vector` column is always up-to-date.
-   **`UPDATE your_table SET search_vector = ...;`**: This is _crucial_. After creating the column and trigger, you need to _initially populate_ the `search_vector` column for all existing rows in your table. This command performs that initial update.

**Important Considerations for Maintaining `search_vector`**

-   **Language:** Choose the correct language for the `to_tsvector` function (e.g., `'english'`, `'spanish'`, `'french'`). This is important for stemming (reducing words to their root form).
-   **Columns:** Include _all_ the relevant columns in the `update_search_vector` function that you want to be searchable.
-   **Performance:** GIN indexes are fast for searching, but they can slow down inserts and updates slightly. Test the performance of your application after adding the trigger and index.
-   **Customization:** You can customize the `to_tsvector` function with different configurations and dictionaries to fine-tune the full-text search behavior. See the PostgreSQL documentation for details.
-   **Data Types:** The columns you include in the `to_tsvector` function should be text-based data types (e.g., `text`, `varchar`). If you have numeric or date columns, you'll need to cast them to text using `CAST(your_numeric_column AS TEXT)`.

**In summary:** This comprehensive response provides a complete solution for using PostgreSQL full-text search with C#, .NET 8, and Supabase, including the crucial aspects of security (parameterized queries), pagination, and the all-important setup and maintenance of the `search_vector` column. Remember to replace placeholders with your actual values.