---
title: Connect C# to Postgres with Npgsql
description: Connect C# to Postgres with Npgsql
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - postgres
---
## Connect to Npgsql with C# without Dapper

```c#
using Npgsql;

const string PG_HOST = "aws-0-us-west-1.pooler.supabase.com";
const string PG_PORT = "6543";
const string PG_USER = "postgres.nrtgiufboxlhbspclizl";
const string PG_PASSWORD = "DkR0nLwYmxG2FHD0";
const string PG_DATABASE = "postgres";

// Connection string to your PostgreSQL database
var connString = $"Host={PG_HOST};Username={PG_USER};Password={PG_PASSWORD};Database={PG_DATABASE}";

await using var conn = new NpgsqlConnection(connString);
try
{
    // Open the connection
    await conn.OpenAsync();
    Console.WriteLine("Connected to the database successfully.");

    // Example query
    var query = "SELECT id, name FROM family ORDER BY name";

    await using (var cmd = new NpgsqlCommand(query, conn))
    {
        var reader = await cmd.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            // Retrieve the columns (id and name) from the result set
            int id = reader.GetInt32(0);  // First column: id
            string name = reader.GetString(1);  // Second column: name

            Console.WriteLine($"ID: {id}, Name: {name}");
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine($"An error occurred: {ex.Message}");
}
finally
{
    await conn.CloseAsync();
}
```