---
title: Use yield to read SQL Server
description: Use yield to read SQL Server
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - csharp
---
```
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;

using System.Dynamic;

using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Npgsql;

namespace sql_query_to_csv
{
    public class DBSqlServer
    {
        public static IEnumerable<dynamic> GetDataFromSql(string connectionString, string sqlQuery)
        {
            // --- Resource Acquisition and Setup ---
            // This part can have try...catch for errors occurring *before* iteration starts

            SqlConnection connection = null; // Declare outside try for finally access if needed (though using handles it)
            SqlCommand command = null;
            SqlDataReader reader = null;

            try
            {
                connection = new SqlConnection(connectionString);
                connection.Open();

                command = new SqlCommand(sqlQuery, connection);
                // Use CommandBehavior.CloseConnection to ensure connection closes when reader is disposed
                reader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);

                // IMPORTANT: Return the result of the iterator method.
                // The 'using' statements ensure disposal happens *after* iteration completes or errors out.
                return ReadData(reader);
            }
            catch (SqlException ex)
            {
                // Log setup errors
                Console.WriteLine($"SQL Exception during setup in GetDataFromSql: {ex.Message} (Query: {sqlQuery})");
                // Clean up resources manually ONLY IF an error occurred BEFORE the reader was successfully passed to the iterator.
                // The 'using' pattern usually handles this, but explicit cleanup in catch might be needed depending on where error happened.
                // However, CommandBehavior.CloseConnection and the structure below make manual cleanup here less critical.
                reader?.Dispose(); // If reader was created before error
                command?.Dispose(); // If command was created before error
                connection?.Dispose(); // If connection was opened before error
                throw; // Re-throw for handling higher up
            }
            catch (Exception ex)
            {
                // Log generic setup errors
                Console.WriteLine($"Generic Exception during setup in GetDataFromSql: {ex.Message}");
                reader?.Dispose();
                command?.Dispose();
                connection?.Dispose();
                throw; // Re-throw
            }
            // NOTE: We don't need using blocks here anymore because CommandBehavior.CloseConnection
            // links the reader's lifetime to the connection's lifetime, and the iterator
            // implicitly controls the reader's lifetime. When the iterator finishes or errors,
            // the reader gets disposed, which in turn closes the connection.
        }

        // --- Private Helper Iterator Method ---
        // This method handles the actual reading and yielding.
        // It does NOT have its own try...catch around the yield itself.
        private static IEnumerable<dynamic> ReadData(SqlDataReader reader)
        {
            // Use 'using' for the reader passed in. This ensures it's disposed
            // when iteration completes or an exception occurs *during* iteration.
            using (reader)
            {
                // Check if there are rows before attempting to read column names
                if (!reader.HasRows)
                {
                    yield break; // Nothing to return, exit the iterator block cleanly
                }

                // Get column names once
                var columnNames = new List<string>(reader.FieldCount);
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    columnNames.Add(reader.GetName(i).Replace(" ", string.Empty));
                }

                // --- Iteration and Yielding ---
                // Exceptions thrown inside this loop (e.g., network error during read)
                // will propagate to the consumer's foreach loop. The 'using (reader)'
                // block ensures the reader (and thus connection via CommandBehavior)
                // is disposed correctly even in that case.
                while (reader.Read())
                {
                    dynamic obj = new ExpandoObject();
                    var dict = (IDictionary<string, object>)obj;

                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        string columnName = columnNames[i];
                        object value = reader.IsDBNull(i) ? null : reader.GetValue(i);
                        dict[columnName] = value;
                    }

                    yield return obj;
                }
            } // reader (and implicitly connection) is disposed here automatically.
        }
    }
}

```