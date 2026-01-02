---
title: How to use the 'mssql' NPM package to connect to SQL Server from Node and configure node_user.
description: How to use the 'mssql' NPM package to connect to SQL Server from Node and configure node_user.
date_created: '2025-05-23T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - node
  - sql-server
---
Node and SQL Server don't get along well with Windows authentication. I had to set my SQL Server instance to use by Windows Authentication and SQL Server login to make it work. For this purpose, this account was created in SQL Server:

User: `node_user`
Password: `P@sswOrdTest123`

> [!warning]
> `node_user` currently has access only to the 'rp' database.

Add permission to execute stored procedures to user `node_user`:

```
GRANT EXECUTE ON SCHEMA ::dbo TO [node_user];
```

## Example script using `mssql` with SQL Server.  

This example is in `C:\Users\thumb\Documents\projects\typescript\node-sql-server\ts.ts`

```ts
import sql from "mssql"; // Changed from require to import

const sqlConfig = {
    server: "localhost", // If your SQL Server is listening on a non-default port, specify it here.
    // For default instance, port is usually not needed if it's 1433.
    // If you have a NAMED INSTANCE, it would be 'localhost\\INSTANCENAME'
    port: 1433, // Explicitly specify port if it's not the default or if 'localhost' alone isn't resolving.
    database: "rp",
    user: "node_user", // The SQL login name you created
    password: "P@sswOrdTest123", // The password you set for node_user
    options: {
        encrypt: false, // For development. For production, set to true.
        trustServerCertificate: false, // For development with encrypt:false or self-signed certs with encrypt:true.
        // For production with a valid cert, set to false.
        enableArithAbort: true, // Recommended for SQL Server
    },
    connectionTimeout: 30000, // milliseconds
    // requestTimeout: 30000, // Optional: timeout for individual requests
};

(async () => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(sqlConfig);
        const result = await sql.query`select top 3 * from rpbudget`;
        console.dir(result);
        await sql.close();
    } catch (err) {
        console.log(JSON.stringify(err, null, 2));
    }
})();
```

This one doesn't used a tagged template literal function: 

```ts
import sql from "mssql"; // Changed from require to import

const sqlConfig = {
    server: "localhost", // If your SQL Server is listening on a non-default port, specify it here.
    // For default instance, port is usually not needed if it's 1433.
    // If you have a NAMED INSTANCE, it would be 'localhost\\INSTANCENAME'
    port: 1433, // Explicitly specify port if it's not the default or if 'localhost' alone isn't resolving.
    database: "rp",
    user: "node_user", // The SQL login name you created
    password: "P@sswOrdTest123", // The password you set for node_user
    options: {
        encrypt: false, // For development. For production, set to true.
        trustServerCertificate: false, // For development with encrypt:false or self-signed certs with encrypt:true.
        // For production with a valid cert, set to false.
        enableArithAbort: true, // Recommended for SQL Server
    },
    connectionTimeout: 30000, // milliseconds
    // requestTimeout: 30000, // Optional: timeout for individual requests
};

(async () => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(sqlConfig);
        const request = new sql.Request();

        const result = await request.query(
            "select * from rpbudget WHERE Year(PostDate) = 2025 AND Month(PostDate) = 5 AND Day(PostDate) In (14,15)"
        );

        for (const row of result.recordset) {
            console.log(
                `Classification: ${row.Classification}, PostDate: ${row.PostDate}, Debit: ${row.Debit}`
            );
        }
        await sql.close(); // Close the connection after the query
    } catch (err) {
        console.log(JSON.stringify(err, null, 2));
    }
})();
```

Here are some SQL examples that Gemini provided. 

```javascript
import sql from "mssql";

const sqlConfig = {
    server: "localhost", // Or "DESKTOP-FT1088C"
    port: 1433,
    database: "rp",
    user: "node_user",
    password: "THE_PASSWORD_THAT_WORKED_IN_SSMS", // Use your actual password
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
    },
    connectionTimeout: 30000,
};

// Helper function to connect, query, and close
async function connectAndQuery(queryFunction) {
    try {
        await sql.connect(sqlConfig);
        console.log("Connected for query execution.");
        await queryFunction();
    } catch (err) {
        console.error("Error during database operation:", err);
    } finally {
        if (sql.connected) {
            await sql.close();
            console.log("Connection closed.");
        }
    }
}

// --- Example 1: Your Original Query (Tagged Template Literal) ---
async function example1_templateLiteralSimple() {
    console.log("\n--- Example 1: Template Literal Simple ---");
    try {
        const result = await sql.query`SELECT TOP 3 * FROM rpbudget`;
        console.log("Result (recordset):");
        console.dir(result.recordset); // result.recordset is an array of row objects
        console.log(`Rows affected: ${result.rowsAffected[0]}`); // For SELECT, often shows row count or -1
    } catch (err) {
        console.error("Query Error:", err);
    }
}

// --- Example 2: Template Literal with Parameters (Safe against SQL Injection) ---
async function example2_templateLiteralWithParams(budgetNameFilter) {
    console.log("\n--- Example 2: Template Literal with Parameters ---");
    try {
        // The `mssql` library handles sanitizing the ${budgetNameFilter} value
        const result = await sql.query`SELECT * FROM rpbudget WHERE BudgetName LIKE ${'%' + budgetNameFilter + '%'}`;
        console.log(`Budgets matching '%${budgetNameFilter}%':`);
        console.dir(result.recordset);
    } catch (err)
        console.error("Query Error:", err);
    }
}

// --- Example 3: Using Request Object for Queries with Parameters ---
// This is more verbose but offers more control and is very clear for complex queries.
async function example3_requestObjectWithParams(budgetID) {
    console.log("\n--- Example 3: Request Object with Parameters ---");
    try {
        const request = new sql.Request(); // Or sql.request() if you want to reuse a request object from the pool
        request.input('TargetBudgetID', sql.Int, budgetID); // Define input parameter with type

        const result = await request.query('SELECT * FROM rpbudget WHERE BudgetID = @TargetBudgetID');
        // Note: If you use sql.request() from a connected pool, it's often `await sql.request().input(...).query(...)`

        console.log(`Budget with ID ${budgetID}:`);
        console.dir(result.recordset);
    } catch (err) {
        console.error("Query Error:", err);
    }
}

// --- Example 4: Executing an INSERT statement and getting rows affected ---
async function example4_insertData(budgetName, amount) {
    console.log("\n--- Example 4: INSERT Data ---");
    try {
        const request = new sql.Request();
        request.input('BudgetName', sql.NVarChar(100), budgetName); // Specify length for VarChar/NVarChar
        request.input('Amount', sql.Decimal(18, 2), amount);     // Specify precision and scale for Decimal

        // Assuming your rpbudget table has BudgetName and Amount columns
        // And BudgetID is perhaps an IDENTITY column (auto-incrementing)
        const result = await request.query('INSERT INTO rpbudget (BudgetName, Amount) VALUES (@BudgetName, @Amount)');

        console.log(`INSERT successful. Rows affected: ${result.rowsAffected[0]}`);
        // To get the ID of the newly inserted row (if BudgetID is IDENTITY):
        // const resultWithId = await request.query('INSERT INTO rpbudget (BudgetName, Amount) VALUES (@BudgetName, @Amount); SELECT SCOPE_IDENTITY() AS NewBudgetID;');
        // console.log("New Budget ID:", resultWithId.recordset[0].NewBudgetID);

    } catch (err) {
        console.error("Query Error:", err);
    }
}

// --- Example 5: Executing an UPDATE statement ---
async function example5_updateData(budgetID, newAmount) {
    console.log("\n--- Example 5: UPDATE Data ---");
    try {
        const result = await sql.query`UPDATE rpbudget SET Amount = ${newAmount} WHERE BudgetID = ${budgetID}`;
        console.log(`UPDATE successful for BudgetID ${budgetID}. Rows affected: ${result.rowsAffected[0]}`);
        if (result.rowsAffected[0] === 0) {
            console.log("Warning: No rows were updated. Check if BudgetID exists.");
        }
    } catch (err) {
        console.error("Query Error:", err);
    }
}

// --- Example 6: Executing a DELETE statement ---
async function example6_deleteData(budgetID) {
    console.log("\n--- Example 6: DELETE Data ---");
    try {
        const request = new sql.Request();
        request.input('BudgetIDToDelete', sql.Int, budgetID);
        const result = await request.query('DELETE FROM rpbudget WHERE BudgetID = @BudgetIDToDelete');
        console.log(`DELETE successful for BudgetID ${budgetID}. Rows affected: ${result.rowsAffected[0]}`);
         if (result.rowsAffected[0] === 0) {
            console.log("Warning: No rows were deleted. Check if BudgetID exists.");
        }
    } catch (err) {
        console.error("Query Error:", err);
    }
}

// --- Example 7: Calling a Stored Procedure ---
// Assume you have a stored procedure like:
// CREATE PROCEDURE sp_GetBudgetByID
//     @ProcBudgetID INT
// AS
// BEGIN
//     SELECT * FROM rpbudget WHERE BudgetID = @ProcBudgetID;
// END
async function example7_callStoredProcedure(budgetID) {
    console.log("\n--- Example 7: Call Stored Procedure ---");
    try {
        const request = new sql.Request();
        request.input('ProcBudgetID', sql.Int, budgetID);

        const result = await request.execute('sp_GetBudgetByID'); // Use .execute for SPs
        console.log(`Result from sp_GetBudgetByID for ID ${budgetID}:`);
        console.dir(result.recordset); // Stored procedures can return recordsets
        // result.output contains output parameters
        // result.returnValue contains the SP's return value
    } catch (err) {
        console.error("Query Error:", err);
    }
}

// --- Example 8: Stored Procedure with Output Parameters ---
// Assume you have a stored procedure like:
// CREATE PROCEDURE sp_GetBudgetCountAndMaxAmount
//     @MaxAmount DECIMAL(18,2) OUTPUT,
//     @BudgetCount INT OUTPUT
// AS
// BEGIN
//     SELECT @BudgetCount = COUNT(*), @MaxAmount = MAX(Amount) FROM rpbudget;
// END
async function example8_callStoredProcedureWithOutput() {
    console.log("\n--- Example 8: Call Stored Procedure with Output Parameters ---");
    try {
        const request = new sql.Request();
        request.output('MaxAmount', sql.Decimal(18, 2)); // Define output parameter
        request.output('BudgetCount', sql.Int);

        const result = await request.execute('sp_GetBudgetCountAndMaxAmount');
        console.log("Stored Procedure Output:");
        console.log(`Max Amount: ${result.output.MaxAmount}`);
        console.log(`Budget Count: ${result.output.BudgetCount}`);
    } catch (err) {
        console.error("Query Error:", err);
    }
}


// --- Example 9: Transactions ---
async function example9_transactions() {
    console.log("\n--- Example 9: Transactions ---");
    const transaction = new sql.Transaction(/* optional pool */); // Create a new transaction
    try {
        await transaction.begin(); // Begin transaction
        console.log("Transaction started.");

        // First operation
        const budgetName1 = 'Transaction Item 1';
        const amount1 = 100.50;
        // Using transaction.request() to create requests bound to this transaction
        await transaction.request()
            .input('BudgetName', sql.NVarChar, budgetName1)
            .input('Amount', sql.Decimal(18,2), amount1)
            .query('INSERT INTO rpbudget (BudgetName, Amount) VALUES (@BudgetName, @Amount)');
        console.log(`Inserted '${budgetName1}'`);

        // Second operation
        const budgetName2 = 'Transaction Item 2';
        const amount2 = 75.25;
        await transaction.request()
            .input('BudgetName', sql.NVarChar, budgetName2)
            .input('Amount', sql.Decimal(18,2), amount2)
            .query('INSERT INTO rpbudget (BudgetName, Amount) VALUES (@BudgetName, @Amount)');
        console.log(`Inserted '${budgetName2}'`);

        // If an error occurs below, it will be caught and rolled back
        // For example, simulate an error:
        // if (true) throw new Error("Simulated error during transaction!");

        await transaction.commit(); // Commit transaction if all operations succeed
        console.log("Transaction committed successfully.");

    } catch (err) {
        console.error("Transaction Error:", err.message);
        if (transaction.connected) { // Check if transaction was actually started
            try {
                await transaction.rollback();
                console.log("Transaction rolled back.");
            } catch (rollbackErr) {
                console.error("Error rolling back transaction:", rollbackErr);
            }
        }
    }
}


// --- Main execution function ---
async function main() {
    // You'll need a table named 'rpbudget' with at least BudgetID (INT, PK, IDENTITY), BudgetName (NVARCHAR), Amount (DECIMAL)
    // For testing, you might want to create it and insert some sample data first.
    // E.g., CREATE TABLE rpbudget (BudgetID INT PRIMARY KEY IDENTITY(1,1), BudgetName NVARCHAR(100), Amount DECIMAL(18,2));
    // INSERT INTO rpbudget (BudgetName, Amount) VALUES ('Groceries', 150.00), ('Utilities', 85.50), ('Entertainment', 50.00);

    await connectAndQuery(example1_templateLiteralSimple);
    await connectAndQuery(async () => await example2_templateLiteralWithParams('Util')); // Pass a filter
    await connectAndQuery(async () => await example3_requestObjectWithParams(1)); // Assuming BudgetID 1 exists
    await connectAndQuery(async () => await example4_insertData('New Test Budget', 99.99));
    await connectAndQuery(async () => await example5_updateData(1, 200.75)); // Update BudgetID 1 if it exists
    await connectAndQuery(async () => await example6_deleteData(2));       // Delete BudgetID 2 if it exists

    // For SP examples, you'll need to create the stored procedures in your 'rp' database first.
    // await connectAndQuery(async () => await example7_callStoredProcedure(1));
    // await connectAndQuery(example8_callStoredProcedureWithOutput);
    // await connectAndQuery(example9_transactions);

    console.log("\nAll examples finished.");
}

main().catch(err => console.error("Unhandled error in main:", err));
```

**Key Concepts from Examples:**

1.  **Tagged Template Literals (`sql.query\`...\`)**:
    *   Concise for simple queries.
    *   Use `${variable}` to embed parameters. The `mssql` library correctly parameterizes these to prevent SQL injection.
    *   Good for `SELECT`, `UPDATE`, `DELETE` where the structure is fixed.

2.  **`Request` Object (`new sql.Request()` or `sql.request()`):**
    *   More verbose but offers fine-grained control.
    *   **`request.input('paramName', sql.DataType, value)`**: Crucial for defining input parameters.
        *   `sql.DataType` examples: `sql.Int`, `sql.NVarChar(length)`, `sql.VarChar(length)`, `sql.Decimal(precision, scale)`, `sql.DateTime`, `sql.Bit`, etc.
        *   **Always use parameterized queries (via template literals or `request.input()`) to prevent SQL injection vulnerabilities.**
    *   **`request.query('SQL STRING')`**: Executes a query with defined inputs.
    *   **`request.execute('StoredProcedureName')`**: Executes a stored procedure.
    *   **`request.output('paramName', sql.DataType, [value])`**: Defines output parameters for stored procedures.

3.  **Result Object (`result`):**
    *   `result.recordset`: An array of objects, where each object represents a row (for `SELECT` queries or SPs that return rows).
    *   `result.recordsets`: An array of recordsets (if your query or SP returns multiple result sets). `result.recordset` is a shorthand for `result.recordsets[0]`.
    *   `result.rowsAffected`: An array indicating the number of rows affected by `INSERT`, `UPDATE`, `DELETE` statements (or DDL). Usually, you look at `result.rowsAffected[0]`.
    *   `result.output`: An object containing output parameter values from a stored procedure.
    *   `result.returnValue`: The integer return value from a stored procedure (often used for status codes).

4.  **Transactions (`sql.Transaction`):**
    *   Use for a sequence of operations that must all succeed or all fail together (atomicity).
    *   `transaction.begin()`
    *   Use `transaction.request()` to create requests associated with that transaction.
    *   `transaction.commit()`
    *   `transaction.rollback()` (essential in `catch` blocks).

5.  **Error Handling:**
    *   Always wrap `await` calls in `try...catch` blocks to handle potential database errors.

6.  **Connection Management:**
    *   `sql.connect(config)`: Establishes a connection (actually, it sets up a connection pool by default).
    *   `sql.close()`: Closes the connection pool. It's good practice to do this when your application is shutting down or after a batch of operations if you're not keeping it alive. The `connectAndQuery` helper handles this for each example run.

Remember to adapt table names, column names, and stored procedure names to match your actual database schema. Create the sample table and stored procedures if you want to run all examples.


## Connection pooling 

The `mssql` package has connection pooling enabled by default. When you call `await sql.connect(sqlConfig)`, you are not just creating a single connection; you are initializing a **connection pool** based on that configuration. Subsequent calls to `sql.request()` or `sql.query\`...\` (when using the global `sql` object after a connect) will draw connections from this pool.

**How It Works by Default:**

1.  **`await sql.connect(sqlConfig)`:**
    *   This creates a global connection pool instance associated with the provided `sqlConfig`.
    *   It doesn't necessarily open all connections in the pool immediately; connections are typically opened as needed up to the configured maximum.
    *   If you call `sql.connect()` again with the *same* config, it usually returns the existing pool. If you call it with a *different* config, it will create a new, separate pool for that config.

2.  **`sql.request()` or `sql.query\`...\`:**
    *   When you execute a query using the global `sql` object (e.g., `const request = sql.request();` or `await sql.query\`...\`), it implicitly tries to get a connection from the global pool that was initialized by the last `sql.connect()`.
    *   The connection is used for the query and then automatically returned to the pool when the query is done (or if an error occurs).

3.  **`await sql.close()`:**
    *   This closes all connections in the global pool and releases resources. You typically do this when your application is shutting down.

**Example of Default (Implicit) Pooling:**

```javascript
import sql from "mssql";

const sqlConfig = {
    server: "localhost",
    port: 1433,
    database: "rp",
    user: "node_user",
    password: "YOUR_PASSWORD",
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
    },
    connectionTimeout: 30000,
    // --- POOL CONFIGURATION (optional, showing defaults) ---
    pool: {
        max: 10, // Maximum number of connections in the pool
        min: 0,  // Minimum number of connections to keep open
        idleTimeoutMillis: 30000 // How long a connection can be idle before being closed
    }
};

async function main() {
    try {
        // 1. Initialize the global connection pool
        console.log("Connecting and initializing connection pool...");
        await sql.connect(sqlConfig);
        console.log("Global connection pool initialized.");

        // 2. Execute multiple queries. Each will use a connection from the pool.
        const query1 = async () => {
            const result = await sql.query`SELECT @@SPID AS ConnectionID, 'Query 1' AS QueryName`;
            console.log(`Query 1 executed on Connection ID: ${result.recordset[0].ConnectionID}`);
            return result;
        };

        const query2 = async () => {
            const result = await sql.query`SELECT @@SPID AS ConnectionID, 'Query 2' AS QueryName`;
            console.log(`Query 2 executed on Connection ID: ${result.recordset[0].ConnectionID}`);
            return result;
        };

        const query3 = async (id) => {
            const request = sql.request(); // Get a request object (uses pooled connection)
            request.input('BudgetID', sql.Int, id);
            const result = await request.query`SELECT @@SPID AS ConnectionID, * FROM rpbudget WHERE BudgetID = @BudgetID`;
            console.log(`Query 3 (ID: ${id}) executed on Connection ID: ${result.recordset[0]?.ConnectionID || 'N/A (no rows)'}`);
            return result;
        };

        // Execute queries concurrently (they might use different connections from the pool)
        await Promise.all([
            query1(),
            query2(),
            query3(1), // Assuming BudgetID 1 exists
            query3(2)  // Assuming BudgetID 2 exists
        ]);

        console.log("All queries completed.");

    } catch (err) {
        console.error("Error during database operations:", err);
    } finally {
        // 3. Close the global connection pool when done
        if (sql.connected) {
            console.log("Closing global connection pool...");
            await sql.close();
            console.log("Global connection pool closed.");
        }
    }
}

main();
```
In the example above, `query1`, `query2`, and the two `query3` calls might run on different actual SQL Server connections, all managed by the pool. You'll see different `@@SPID` values if they do.

**Explicit Connection Pool Management (`sql.ConnectionPool`):**

If you need more control, want to manage multiple distinct pools, or prefer a more explicit style, you can create and manage `ConnectionPool` objects directly.

```javascript
import sql from "mssql";

const sqlConfig1 = { /* ... your config ... */ };
// const sqlConfig2 = { /* ... another config for a different server/db ... */ };

async function mainWithExplicitPool() {
    // Create a new ConnectionPool instance
    const pool = new sql.ConnectionPool(sqlConfig1);
    let poolConnect; // To store the promise returned by pool.connect()

    try {
        console.log("Explicitly connecting pool...");
        poolConnect = pool.connect(); // Returns a promise
        await poolConnect; // Wait for the pool to connect
        console.log("Explicit pool connected.");

        // To execute queries, get a request object from THIS pool
        const requestFromPool = pool.request();
        const result1 = await requestFromPool.query`SELECT @@SPID AS ConnectionID, 'Query A' AS QueryName`;
        console.log(`Query A executed on Connection ID: ${result1.recordset[0].ConnectionID}`);

        // Another query using the same pool
        const result2 = await pool.request().query`SELECT @@SPID AS ConnectionID, 'Query B' AS QueryName`;
        console.log(`Query B executed on Connection ID: ${result2.recordset[0].ConnectionID}`);

        // For transactions with an explicit pool:
        const transaction = new sql.Transaction(pool); // Pass the pool to the transaction
        await transaction.begin();
        await transaction.request().query`INSERT INTO rpbudget (BudgetName, Amount) VALUES ('Pool Test', 1.00)`;
        await transaction.commit();
        console.log("Transaction on explicit pool committed.");


    } catch (err) {
        console.error("Error with explicit pool:", err);
    } finally {
        if (pool && pool.connected) { // Check if the pool object exists and is connected
            console.log("Closing explicit pool...");
            await pool.close(); // Close this specific pool
            console.log("Explicit pool closed.");
        } else if (poolConnect) {
            // If connect() was called but might not have completed before an error
            poolConnect.then(() => pool.close()).catch(e => console.error("Error closing pool after failed connect", e));
        }
    }
}

// mainWithExplicitPool();
```

**Configuring Pool Options:**

You can customize the pool behavior by adding a `pool` object to your `sqlConfig`:

```javascript
const sqlConfig = {
    user: '...',
    password: '...',
    server: 'localhost',
    database: '...',
    options: { /* ... */ },
    pool: {
        max: 10, // Default: 10 - Max number of connections in the pool
        min: 0,  // Default: 0 - Min number of connections to keep alive
        idleTimeoutMillis: 30000, // Default: 30000 - How long a connection can be idle before being potentially closed (down to min)
        acquireTimeoutMillis: 30000, // Default: undefined (no timeout) - How long to wait for a connection to become available from the pool
        // Other options like:
        // createTimeoutMillis: 30000, // How long to wait for a new connection to be created
        // destroyTimeoutMillis: 5000,  // How long to wait for a connection to be destroyed
        // reapIntervalMillis: 1000,   // How often to check for idle connections to reap
        // ... and more, often derived from the 'tarn.js' pooling library which mssql uses.
    }
};
```

**When to use Global vs. Explicit Pools:**

*   **Global `sql.connect()` / `sql.query`:** Simpler for applications that only need to connect to one database with one configuration. It's convenient and handles pooling behind the scenes.
*   **Explicit `new sql.ConnectionPool()`:**
    *   When you need to connect to multiple different SQL Server instances or databases with different configurations simultaneously.
    *   When you want more explicit control over the lifecycle of a specific pool (e.g., in a class or module that manages its own database resources).
    *   If you are writing library code that should not interfere with a global pool potentially used by the main application.

For most typical applications connecting to a single database, the default global pooling mechanism is sufficient and easy to use. Just remember to call `sql.connect()` once at application startup and `sql.close()` at shutdown.
```