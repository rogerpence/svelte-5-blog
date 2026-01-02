---
title: Using stored procedures with mssql and Node
description: Using stored procedures with mssql and Node
date_created: '2025-07-05T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - mssql
---
This code is here: 

```
C:\Users\thumb\Documents\projects\svelte\sql-server
```

A fully-typed example

```
pnpm add -D @types/mssql
```

Typed example code: 

```ts
import { MSSqlConnect } from "./MSSqlConnect";
import { sqlConfig } from "./mssql-config"; // Assuming you have a config file for SQL Server configuration
import { IResult, RequestError } from "mssql";

const ms: MSSqlConnect = new MSSqlConnect(sqlConfig);
console.log("Starting connection...");

await ms.connectPool();
const request = ms.pool.request();

const id: number = 0;
const description: string = "ColleenD";
const rule: string = "equals";
const value: string = "Roger";
const category: string = "test";

// Add input parameter for the year
request.input("id", ms.sql.Int, id);
request.input("description", ms.sql.NVarChar, description);
request.input("rule", ms.sql.NVarChar, rule);
request.input("value", ms.sql.NVarChar, value);
request.input("category", ms.sql.NVarChar, category);

try {
    // Execute the stored procedure instead of a raw query
    const result: IResult<any> = await request.execute("dbo.source_upsert");
    console.log(JSON.stringify(result, null, 4));
} catch (error: unknown) {
    const sqlError = error as RequestError;
    if (
        sqlError.originalError &&
        "info" in sqlError.originalError &&
        (sqlError.originalError as any).info?.message
            ?.toLowerCase()
            .includes("unique key constraint")
    ) {
        console.error(`Row with Description = ${description} already exists`);
    } else {
        console.error(sqlError.message || "Unknown error occurred");
    }
}

await ms.closePool().catch((err) => {
    console.error("Error closing MSSqlConnect pool:", err);
});
```

In this case, full object returned from a successful request is:

On update: 

```ts
{
    "recordsets": [
        [
            {
                "id": 685,
                "description": "ColleenD",
                "rule": "equals",
                "value": "Roger",
                "category": "test",
                "ActionStatus": "INSERTED"
            }
        ]
    ],
    "recordset": [
        {
            "id": 685,
            "description": "ColleenD",
            "rule": "equals",
            "value": "Roger",
            "category": "test",
            "ActionStatus": "INSERTED"
        }
    ],
    "output": {},
    "rowsAffected": [],
    "returnValue": 0
}
```

On insert:

```ts
{
    "recordsets": [
        [
            {
                "id": 686,
                "description": "ColleenD",
                "rule": "equals",
                "value": "Roger",
                "category": "test",
                "ActionStatus": "INSERTED"
            }
        ]
    ],
    "recordset": [
        {
            "id": 686,
            "description": "ColleenD",
            "rule": "equals",
            "value": "Roger",
            "category": "test",
            "ActionStatus": "INSERTED"
        }
    ],
    "output": {},
    "rowsAffected": [],
    "returnValue": 0
}
```

On error: 

```ts
{
    "code": "EREQUEST",
    "originalError": {
        "info": {
            "name": "ERROR",
            "handlerName": "onErrorMessage",
            "number": 2627,
            "state": 1,
            "class": 14,
            "message": "Violation of UNIQUE KEY constraint 'UniqueDescription'. Cannot insert duplicate key in object 'dbo.source'. The duplicate key value is (ColleenD).",
            "serverName": "DESKTOP-FT1088C",
            "procName": "dbo.source_upsert",
            "lineNumber": 64
        }
    },
    "name": "RequestError",
    "number": 2627,
    "lineNumber": 64,
    "state": 1,
    "class": 14,
    "serverName": "DESKTOP-FT1088C",
    "procName": "dbo.source_upsert",
    "precedingErrors": []
}
```

The code as a function for the back end:

```ts
import { MSSqlConnect } from "./MSSqlConnect";
import { sqlConfig } from "./mssql-config"; // Assuming you have a config file for SQL Server configuration
import { IResult, RequestError } from "mssql";

interface SourceUpsertParams {
    id: number;
    description: string;
    rule: string;
    value: string;
    category: string;
}

interface SourceUpsertResult {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
}

export async function upsertSource(
    params: SourceUpsertParams
): Promise<SourceUpsertResult> {
    const ms: MSSqlConnect = new MSSqlConnect(sqlConfig);

    try {
        await ms.connectPool();
        const request = ms.pool.request();

        // Add input parameters
        request.input("id", ms.sql.Int, params.id);
        request.input("description", ms.sql.NVarChar, params.description);
        request.input("rule", ms.sql.NVarChar, params.rule);
        request.input("value", ms.sql.NVarChar, params.value);
        request.input("category", ms.sql.NVarChar, params.category);

        // Execute the stored procedure
        const result: IResult<any> = await request.execute("dbo.source_upsert");

        return {
            success: true,
            message: "Source record upserted successfully",
            data: result.recordset,
        };
    } catch (error: unknown) {
        const sqlError = error as RequestError;

        if (
            sqlError.originalError &&
            "info" in sqlError.originalError &&
            (sqlError.originalError as any).info?.message
                ?.toLowerCase()
                .includes("unique key constraint")
        ) {
            return {
                success: false,
                message: `Row with Description = ${params.description} already exists`,
                error: "DUPLICATE_KEY",
            };
        } else {
            return {
                success: false,
                message: "Failed to upsert source record",
                error: sqlError.message || "Unknown error occurred",
            };
        }
    } finally {
        await ms.closePool().catch((err) => {
            console.error("Error closing MSSqlConnect pool:", err);
        });
    }
}

// Example usage (can be removed in production)
async function testUpsertSource() {
    const params: SourceUpsertParams = {
        id: 0,
        description: "ColleenD",
        rule: "equals",
        value: "Roger",
        category: "test",
    };

    const result = await upsertSource(params);

    if (result.success) {
        console.log("Success:", result.message);
        console.log("Data:", result.data);
    } else {
        console.error("Error:", result.message);
        console.error("Details:", result.error);
    }
}

// Uncomment to test the function
await testUpsertSource();
```