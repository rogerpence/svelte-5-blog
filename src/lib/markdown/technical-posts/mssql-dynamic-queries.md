---
title: ways to create dynamic queries for mssql - SQL Server with TypeScript.
description: ways to create dynamic queries for mssql - SQL Server with TypeScript.
date_created: '2025-05-30T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - typescript
  - sql-server
  - mssql
---
You're right, while parameterized queries are *essential* for security (preventing SQL injection), simply replacing values with placeholders might not feel like a huge leap in "flexibility" if you're still manually crafting the entire SQL string.

The key to flexibility with parameterized queries is to **dynamically build the SQL string itself based on conditions, and then use parameters for the *values* within that dynamically built string.**

Let's break down how you can make your `select` function more flexible:

**1. Parameterize the Current Query (Security First!)**

Even before adding flexibility, let's parameterize what you have. This is non-negotiable for security.

```typescript
import * as mssql from 'mssql';

// Assume 'ms' is your initialized mssql object with a pool
// For example:
// const ms = {
//     pool: await new mssql.ConnectionPool(config).connect()
// };

async function selectWithParams(year: number, month: number, days: number[]) {
    if (!ms.pool.connected) {
        console.error("Database not connected");
        return;
    }
    try {
        const request = ms.pool.request();

        // For the IN clause, we need to generate placeholders
        const dayPlaceholders = days.map((_, index) => `@day${index}`).join(','); // @day0,@day1

        const query = `
            SELECT Classification, PostDate, Debit
            FROM rpbudget
            WHERE Year(PostDate) = @year
              AND Month(PostDate) = @month
              AND Day(PostDate) IN (${dayPlaceholders})
        `;

        request.input('year', mssql.Int, year);
        request.input('month', mssql.Int, month);
        days.forEach((day, index) => {
            request.input(`day${index}`, mssql.Int, day);
        });

        console.log("Executing Query:", query); // For debugging
        console.log("Parameters:", { year, month, days }); // For debugging

        const result = await request.query(query);

        if (result.recordset.length > 0) {
            console.log("Results:");
            for (const row of result.recordset) {
                console.log(
                    `Classification: ${row.Classification}, PostDate: ${new Date(row.PostDate).toLocaleDateString()}, Debit: ${row.Debit}`
                );
            }
        } else {
            console.log("No records found for the given criteria.");
        }
        return result.recordset;
    } catch (err) {
        console.error("SQL error", err);
        throw err; // Re-throw or handle appropriately
    }
}

// Example Usage:
async function main() {
    // Mock mssql pool for standalone example
    global.ms = {
        pool: {
            connected: true,
            request: () => {
                const inputs: Record<string, any> = {};
                return {
                    input: (name: string, type: any, value: any) => { inputs[name] = value; return this; },
                    query: async (sql: string) => {
                        console.log("Mock Query:", sql);
                        console.log("Mock Inputs:", inputs);
                        // Simulate finding some data if inputs match typical values
                        if (inputs['year'] === 2025 && inputs['month'] === 5 && inputs['day0'] === 14) {
                            return {
                                recordset: [
                                    { Classification: 'Revenue', PostDate: new Date(2025, 4, 14), Debit: 0, Credit: 100 },
                                    { Classification: 'Expense', PostDate: new Date(2025, 4, 15), Debit: 50, Credit: 0 }
                                ],
                                rowsAffected: [2]
                            };
                        }
                        return { recordset: [], rowsAffected: [0] };
                    }
                };
            }
        } as any // Type assertion for mock
    };

    await selectWithParams(2025, 5, [14, 15]);
    await selectWithParams(2024, 1, [1, 2, 3]);
}

main().catch(console.error);
```

**2. Building SQL Dynamically (More Flexibility)**

Now, let's make the query construction more dynamic. You might want to:
*   Select different columns.
*   Query different tables (be careful with this for security if table names come from user input).
*   Have optional filter conditions.
*   Change sorting.

```typescript
import * as mssql from 'mssql';

// Assume 'ms' is your initialized mssql object with a pool

interface QueryOptions {
    tableName: string;
    columns?: string[]; // e.g., ['Classification', 'PostDate', 'Debit']
    filters?: {
        year?: number;
        month?: number;
        days?: number[];
        classification?: string;
        // Add more potential filter fields
    };
    orderBy?: { column: string; direction: 'ASC' | 'DESC' };
    limit?: number;
}

async function flexibleSelect(options: QueryOptions) {
    if (!ms.pool.connected) {
        console.error("Database not connected");
        return;
    }
    try {
        const request = ms.pool.request();
        let query = `SELECT `;

        // Columns
        if (options.columns && options.columns.length > 0) {
            // IMPORTANT: Sanitize column names if they ever come from user input.
            // For now, we assume they are developer-defined and safe.
            query += options.columns.join(', ');
        } else {
            query += '*'; // Default to all columns
        }

        // Table
        // IMPORTANT: Table names from user input are a HUGE security risk if not whitelisted.
        // For this example, assume it's controlled by the developer.
        query += ` FROM ${options.tableName}`;

        // Filters (WHERE clause)
        const conditions: string[] = [];
        if (options.filters) {
            if (options.filters.year !== undefined) {
                conditions.push(`Year(PostDate) = @year`);
                request.input('year', mssql.Int, options.filters.year);
            }
            if (options.filters.month !== undefined) {
                conditions.push(`Month(PostDate) = @month`);
                request.input('month', mssql.Int, options.filters.month);
            }
            if (options.filters.days && options.filters.days.length > 0) {
                const dayPlaceholders = options.filters.days.map((_, index) => `@day${index}`).join(',');
                conditions.push(`Day(PostDate) IN (${dayPlaceholders})`);
                options.filters.days.forEach((day, index) => {
                    request.input(`day${index}`, mssql.Int, day);
                });
            }
            if (options.filters.classification) {
                conditions.push(`Classification = @classification`);
                request.input('classification', mssql.NVarChar, options.filters.classification);
            }
            // Add more filter conditions here
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        // Order By
        if (options.orderBy) {
            // Sanitize column name for ORDER BY if it can come from user input
            query += ` ORDER BY ${options.orderBy.column} ${options.orderBy.direction}`;
        }

        // Limit (TOP clause in SQL Server)
        if (options.limit !== undefined) {
            // Note: SQL Server uses TOP, not LIMIT.
            // We need to inject it after SELECT
            if (query.toLowerCase().startsWith("select *")) {
                query = `SELECT TOP (@limit) *` + query.substring("select *".length);
            } else if (query.toLowerCase().startsWith("select ")) {
                 query = `SELECT TOP (@limit) ` + query.substring("select ".length);
            }
            request.input('limit', mssql.Int, options.limit);
        }


        console.log("Executing Query:", query);
        const paramsForLog: any = {};
        (request as any).parameters.forEach((v: any, k: string) => paramsForLog[k] = v.value); // Accessing internal parameters for logging
        console.log("Parameters:", paramsForLog);


        const result = await request.query(query);

        if (result.recordset.length > 0) {
            console.log("Results:");
            result.recordset.forEach(row => console.log(row));
        } else {
            console.log("No records found for the given criteria.");
        }
        return result.recordset;

    } catch (err) {
        console.error("SQL error", err);
        throw err;
    }
}

// Example Usage for flexibleSelect:
async function mainFlexible() {
    // Mock mssql pool for standalone example (same as above)
    global.ms = {
        pool: {
            connected: true,
            request: () => {
                const inputs: Record<string, any> = {};
                let currentSql = "";
                return {
                    input: (name: string, type: any, value: any) => { inputs[name] = value; return this; },
                    query: async (sql: string) => {
                        currentSql = sql;
                        console.log("Mock Query:", currentSql);
                        console.log("Mock Inputs:", inputs);
                        // Simulate some data based on query
                        if (currentSql.includes("rpbudget") && inputs['year'] === 2025) {
                             return {
                                recordset: [
                                    { Classification: 'Revenue', PostDate: new Date(2025, 4, 14), Debit: 0, Credit: 100 },
                                    { Classification: 'Expense', PostDate: new Date(2025, 4, 15), Debit: 50, Credit: 0 }
                                ],
                                rowsAffected: [2]
                            };
                        }
                        if (currentSql.includes("Users") && inputs['classification'] === 'Admin') {
                            return {
                                recordset: [ { UserID: 1, UserName: 'Alice', Classification: 'Admin' } ],
                                rowsAffected: [1]
                            }
                        }
                        return { recordset: [], rowsAffected: [0] };
                    },
                    get parameters() { // Mock for logging parameters
                        const paramMap = new Map();
                        Object.entries(inputs).forEach(([key, value]) => paramMap.set(key, { value }));
                        return paramMap;
                    }
                };
            }
        } as any // Type assertion for mock
    };

    console.log("\n--- Flexible Select Example 1 ---");
    await flexibleSelect({
        tableName: 'rpbudget',
        columns: ['Classification', 'PostDate', 'Debit'],
        filters: {
            year: 2025,
            month: 5,
            days: [14, 15]
        },
        orderBy: { column: 'PostDate', direction: 'DESC' },
        limit: 10
    });

    console.log("\n--- Flexible Select Example 2 (different table/filters) ---");
    await flexibleSelect({
        tableName: 'Users', // Fictional table
        columns: ['UserID', 'UserName', 'Classification'],
        filters: {
            classification: 'Admin'
        }
    });

    console.log("\n--- Flexible Select Example 3 (no filters, all columns) ---");
    await flexibleSelect({
        tableName: 'rpbudget',
        limit: 5
    });
}

mainFlexible().catch(console.error);
```

**Key aspects of the "flexibleSelect" function:**

1.  **`QueryOptions` Interface:** Defines the structure for passing various query modifications.
2.  **Dynamic Column Selection:** Allows specifying which columns to retrieve.
3.  **Dynamic Table Selection:** Allows specifying the table. **CRITICAL SECURITY NOTE:** If `tableName` can ever be influenced by external user input, you *must* implement a whitelist of allowed table names to prevent SQL injection. Never directly concatenate user input into table names without strict validation.
4.  **Conditional `WHERE` Clauses:** Filters are only added if provided in the `options`.
5.  **Parameterization is Still Used:** All *values* in the `WHERE` clause are parameterized using `request.input()`.
6.  **Dynamic `ORDER BY` and `TOP` (LIMIT):** Added based on options. Again, be cautious with `orderBy.column` if it comes from user input (whitelist valid column names).
7.  **`TOP` Clause for SQL Server:** SQL Server uses `TOP N` instead of `LIMIT N`. The logic for inserting `TOP` is a bit naive here and might need refinement for more complex SELECT statements, but it demonstrates the idea.

**3. Using a Query Builder (e.g., Knex.js)**

For even more complex scenarios or if you want to abstract away SQL syntax further, a query builder like Knex.js is an excellent choice. Knex can generate SQL for various databases (including SQL Server) and handles parameterization automatically.

```typescript
import knex from 'knex'; // npm install knex mssql

// Initialize Knex (typically done once)
// const db = knex({
//   client: 'mssql',
//   connection: {
//     server: 'your_server.database.windows.net',
//     user: 'your_username',
//     password: 'your_password',
//     database: 'your_database',
//     options: {
//       encrypt: true // For Azure SQL or if your server requires it
//     }
//   }
// });

// Mock Knex for example
const db = knex({ client: 'mssql', connection: {} }); // Won't actually connect
const originalQueryBuilderToSQL = db.queryBuilder().toSQL;
db.queryBuilder().toSQL = function() { // Intercept toSQL for logging
    const result = originalQueryBuilderToSQL.call(this);
    console.log("Knex SQL:", result.sql);
    console.log("Knex Bindings:", result.bindings);
    // Simulate a result for demonstration
    if (result.sql.includes("rpbudget") && result.bindings.includes(2025)) {
        return {
            sql: result.sql,
            bindings: result.bindings,
            // Simulate that Knex would execute this and return data
            mockExecute: async () => [
                { Classification: 'Revenue', PostDate: new Date(2025, 4, 14), Debit: 0, Credit: 100 },
                { Classification: 'Expense', PostDate: new Date(2025, 4, 15), Debit: 50, Credit: 0 }
            ]
        };
    }
     if (result.sql.includes("Users") && result.bindings.includes('Admin')) {
        return {
            sql: result.sql,
            bindings: result.bindings,
            mockExecute: async () => [ { UserID: 1, UserName: 'Alice', Classification: 'Admin' } ]
        };
    }
    return { ...result, mockExecute: async () => [] };
};


interface KnexQueryOptions {
    tableName: string;
    columns?: string[];
    filters?: {
        year?: number;
        month?: number;
        days?: number[];
        classification?: string;
    };
    orderBy?: { column: string; direction: 'asc' | 'desc' }; // Knex uses lowercase
    limit?: number;
}

async function selectWithKnex(options: KnexQueryOptions) {
    let query = db(options.tableName); // Start with the table

    if (options.columns && options.columns.length > 0) {
        query = query.select(options.columns);
    } else {
        query = query.select('*');
    }

    if (options.filters) {
        if (options.filters.year !== undefined) {
            query = query.whereRaw('Year(PostDate) = ?', [options.filters.year]);
        }
        if (options.filters.month !== undefined) {
            query = query.whereRaw('Month(PostDate) = ?', [options.filters.month]);
        }
        if (options.filters.days && options.filters.days.length > 0) {
            query = query.whereIn(db.raw('Day(PostDate)'), options.filters.days);
        }
        if (options.filters.classification) {
            query = query.where('Classification', options.filters.classification);
        }
    }

    if (options.orderBy) {
        query = query.orderBy(options.orderBy.column, options.orderBy.direction);
    }

    if (options.limit !== undefined) {
        query = query.limit(options.limit);
    }

    // To see the generated SQL and bindings:
    const sqlQuery = query.toSQL().toNative ? query.toSQL().toNative() : query.toSQL();
    // console.log("Knex SQL:", sqlQuery.sql);
    // console.log("Knex Bindings:", sqlQuery.bindings);

    try {
        // const results = await query; // This executes the query
        const simulatedQueryResult = (query as any).toSQL(); // Using our mock
        const results = await simulatedQueryResult.mockExecute();

        if (results.length > 0) {
            console.log("Knex Results:");
            results.forEach(row => console.log(row));
        } else {
            console.log("No records found via Knex for the given criteria.");
        }
        return results;
    } catch (err) {
        console.error("Knex SQL error", err);
        throw err;
    }
}

// Example Usage for Knex:
async function mainKnex() {
    console.log("\n--- Knex Select Example 1 ---");
    await selectWithKnex({
        tableName: 'rpbudget',
        columns: ['Classification', 'PostDate', 'Debit'],
        filters: {
            year: 2025,
            month: 5,
            days: [14, 15]
        },
        orderBy: { column: 'PostDate', direction: 'desc' },
        limit: 10
    });

    console.log("\n--- Knex Select Example 2 (different table/filters) ---");
    await selectWithKnex({
        tableName: 'Users', // Fictional table
        columns: ['UserID', 'UserName', 'Classification'],
        filters: {
            classification: 'Admin'
        }
    });
}

mainKnex().catch(console.error);
```

**Choosing the Right Approach:**

*   **Parameterized Queries (like `selectWithParams`):** Absolutely essential for security. Use this as your baseline.
*   **Dynamic SQL Building (like `flexibleSelect`):** Good for when you need to construct different queries based on application logic, but want to keep dependencies minimal and have fine-grained control over the SQL. Parameterize all user-provided *values*. Be extremely careful with dynamic table/column names.
*   **Query Builders (like Knex.js):** Excellent for complex queries, improving code readability, reducing raw SQL, and easier database migrations if you ever switch DBs. They handle parameterization under the hood. This is often the preferred method for larger applications.

Remember, **always prioritize security**. Parameterize inputs to prevent SQL injection, and if you're dynamically building parts of the query structure (like table or column names) from potentially unsafe sources, use strict whitelisting.