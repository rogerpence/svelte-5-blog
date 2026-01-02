---
title: A CRUD repository for MSSQL for JavaScript/TypeScript
description: A CRUD repository for MSSQL for JavaScript/TypeScript
date_created: '2025-05-31T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sql-server
  - repository
  - mssql
---
Types used

```ts
import { z } from "zod";

export const categoryRulesSchema = z.object({
    // public int id { get; set; }
    // C# 'int' is a non-nullable integer.
    id: z.number().int().nullable(),

    // public string? description { get; set; }
    // C# 'string?' means the string can be null.
    // In Zod, .nullable() means the value can be the type or null.
    // If the key itself might be missing (undefined), you'd use .optional() or .nullish().
    // Assuming if the property exists, it's either a string or null:
    description: z.string().nullable(),

    // public string? rule { get; set; }
    rule: z.string().nullable(),

    // public string? value { get; set; }
    value: z.string().nullable(),

    // public string? category { get; set; }
    category: z.string().nullable(),
});

// If you want to infer a TypeScript type from this schema:
export type CategoryRules = z.infer<typeof categoryRulesSchema>;

```

## Using the `upsert` operation

```ts
async function upsertCategoryRule(model: CategoryRules) {
    const request = ms.pool.request();
    request.input("id", ms.sql.Int, model.id);
    request.input("description", ms.sql.NVarChar, model.description);
    request.input("rule", ms.sql.NVarChar, model.rule);
    request.input("value", ms.sql.NVarChar, model.value);
    request.input("category", ms.sql.NVarChar, model.category);

    const result = await request.execute("dbo.rp_categoryrulesUpsert");

    console.log(result);

    return result.rowsAffected[0];
}

let categoryRulesMode: CategoryRules = {
    id: 37,
    description: "Ruby's Taps and Tails",
    rule: "includes",
    value: "Taps and Tails",
    category: "fast food",
};

const count = await upsertCategoryRule(model).catch((err) => {
    console.error("Error executing select query:", err);
    return 0;
});
```







The `result` from calling an `upsert` procedure with `mssql` when a record is updated is: 

```json
{
  recordsets: [
    [
      [Object ...], columns: [Object ...], toTable: [Function: value]
    ]
  ],
  recordset: [
    {
      id: 37,
      description: "Ruby's Taps and Tails",
      rule: "includes",
      value: "xxxxxxxx",
      category: "fast food",
      ActionStatus: "UPDATED",
    }, columns: {
      id: [Object ...],
      description: [Object ...],
      rule: [Object ...],
      value: [Object ...],
      category: [Object ...],
      ActionStatus: [Object ...],
    }, toTable: [Function: value]
  ],
  output: {},
  rowsAffected: [],
  returnValue: 0,
}```

The `result` from calling an `upsert` procedure with `mssql` when a record is updated is: 

```json
{
  recordsets: [
    [
      [Object ...], columns: [Object ...], toTable: [Function: value]
    ]
  ],
  recordset: [
    {
      id: 38,
      description: "Millers Brewz",
      rule: "includes",
      value: "xxxxxxxx",
      category: "fast food",
      ActionStatus: "INSERTED",
    }, columns: {
      id: [Object ...],
      description: [Object ...],
      rule: [Object ...],
      value: [Object ...],
      category: [Object ...],
      ActionStatus: [Object ...],
    }, toTable: [Function: value]
  ],
  output: {},
  rowsAffected: [],
  returnValue: 0,
}
```


Gemini cleaned up my Upsert stored proc and added returning whether a row was added or updated and used a transaction. 

Okay, you can modify your stored procedure to return this information by adding an `ActionStatus` column to your result set and ensuring you correctly capture and return the ID.

Here's the modified stored procedure:

```sql
CREATE OR ALTER PROC [dbo].[rp_categoryrulesUpsert]
    @id INT = NULL,
    @description VARCHAR(150),
    @rule VARCHAR(50),
    @value VARCHAR(500),
    @category VARCHAR(150)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @ActionStatus VARCHAR(10);
    DECLARE @OutputId INT;

    BEGIN TRY
        BEGIN TRAN;

        IF @id IS NOT NULL AND @id > 0 -- Check for a valid, positive ID indicating an update attempt
        BEGIN
            -- Attempt to update
            UPDATE [dbo].[categoryrules]
            SET    [description] = @description,
                   [rule] = @rule,
                   [value] = @value,
                   [category] = @category
            WHERE  [id] = @id;

            IF @@ROWCOUNT > 0 -- Check if any row was actually updated
            BEGIN
                SET @ActionStatus = 'UPDATED';
                SET @OutputId = @id;

                SELECT
                    cr.[id],
                    cr.[description],
                    cr.[rule],
                    cr.[value],
                    cr.[category],
                    @ActionStatus AS ActionStatus
                FROM
                    [dbo].[categoryrules] cr
                WHERE
                    cr.[id] = @OutputId;
            END
            ELSE
            BEGIN
                -- No row found with the given @id to update.
                SET @ActionStatus = 'NOT_FOUND';
                SET @OutputId = @id; -- The ID that was attempted

                SELECT
                    @OutputId AS id,
                    CAST(NULL AS VARCHAR(150)) AS description,
                    CAST(NULL AS VARCHAR(50)) AS [rule], -- Changed 'AS rule' to 'AS [rule]'
                    CAST(NULL AS VARCHAR(500)) AS value,
                    CAST(NULL AS VARCHAR(150)) AS category,
                    @ActionStatus AS ActionStatus;
            END
        END
        ELSE
        BEGIN
            -- Insert new row
            INSERT INTO [dbo].[categoryrules] ([description], [rule], [value], [category])
            VALUES (@description, @rule, @value, @category);

            SET @OutputId = SCOPE_IDENTITY(); -- Get the newly inserted ID
            SET @ActionStatus = 'INSERTED';

            SELECT
                cr.[id],
                cr.[description],
                cr.[rule],
                cr.[value],
                cr.[category],
                @ActionStatus AS ActionStatus
            FROM
                [dbo].[categoryrules] cr
            WHERE
                cr.[id] = @OutputId;
        END

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        THROW;
    END CATCH;
END
GO




-- Example Usage:

-- 1. Insert a new rule (assuming ID 1, 2, 3 don't exist or you want a new one)
EXEC [dbo].[rp_categoryrulesUpsert]
    @id = NULL, -- Or 0, or -1, or simply omit if default NULL is desired for insert
    @description = 'New Rule Description',
    @rule = 'NEW_RULE',
    @value = 'Value for new rule',
    @category = 'General';
GO

-- Get the ID from the previous insert (e.g., assume it was 100)
DECLARE @InsertedId INT = 100; -- Replace with actual ID if known from app logic

-- 2. Update the previously inserted rule
EXEC [dbo].[rp_categoryrulesUpsert]
    @id = @InsertedId, -- Provide the ID of the row to update
    @description = 'Updated Rule Description',
    @rule = 'UPDATED_RULE_CODE',
    @value = 'New value after update',
    @category = 'Specifics';
GO

-- 3. Attempt to update a non-existent rule
EXEC [dbo].[rp_categoryrulesUpsert]
    @id = 9999, -- Assuming this ID does not exist
    @description = 'Non-existent Rule Update',
    @rule = 'NON_EXIST',
    @value = 'WontBeSaved',
    @category = 'Test';
GO
```

**Key Changes and Explanations:**

1.  **`@ActionStatus VARCHAR(10)`**: A variable to store whether an 'INSERTED', 'UPDATED', or 'NOT_FOUND' action occurred.
2.  **`@OutputId INT`**: A variable to store the ID that was either inserted or updated.
3.  **`IF @id IS NOT NULL AND @id > 0`**:
    *   This condition is used to determine if the operation is an update. If `@id` is provided and is a positive integer, it's treated as an update attempt.
    *   Your original `IF @Id > 0` would implicitly treat `NULL` as not greater than 0, leading to the `ELSE` (insert) block. Making it `IS NOT NULL AND @id > 0` is more explicit.
4.  **Update Path (`IF @id IS NOT NULL AND @id > 0`)**:
    *   The `UPDATE` statement is executed.
    *   **`IF @@ROWCOUNT > 0`**: This is crucial. `@@ROWCOUNT` returns the number of rows affected by the last statement. If it's greater than 0, the update was successful.
        *   `@ActionStatus` is set to `'UPDATED'`.
        *   `@OutputId` is set to the input `@id`.
        *   The `SELECT` statement then retrieves the updated row and includes the `ActionStatus`.
    *   **`ELSE` (for `@@ROWCOUNT = 0`)**: If `@@ROWCOUNT` is 0 after an update attempt with a specific `@id`, it means no row with that `id` was found.
        *   `@ActionStatus` is set to `'NOT_FOUND'`.
        *   `@OutputId` is set to the `@id` that was attempted.
        *   A specific `SELECT` statement is used to return a single row with the `id` and `ActionStatus` of `'NOT_FOUND'`, and `NULL`s for other data columns to maintain a consistent result set structure.
5.  **Insert Path (`ELSE`)**:
    *   The `INSERT` statement is executed.
    *   `SET @OutputId = SCOPE_IDENTITY();`: `SCOPE_IDENTITY()` reliably gets the ID of the row inserted within the current scope and batch.
    *   `@ActionStatus` is set to `'INSERTED'`.
    *   The `SELECT` statement retrieves the newly inserted row along with the `ActionStatus`.
6.  **`TRY...CATCH` Block**:
    *   Added for robust error handling. If any error occurs within the `TRY` block, execution jumps to the `CATCH` block.
    *   `IF @@TRANCOUNT > 0 ROLLBACK TRAN;`: If a transaction is active and an error occurs, it's rolled back to maintain data integrity.
    *   `THROW;`: Re-throws the original error so the calling application can be aware of it.
7.  **Consistent `SELECT` Statement**:
    *   Each logical path (`UPDATED`, `INSERTED`, `NOT_FOUND`) now returns a result set with the same columns: `id`, `description`, `rule`, `value`, `category`, and the new `ActionStatus`. This makes it easier for the client application to process the result.

Now, when you execute this stored procedure, the result set will always include the `ActionStatus` column, telling you exactly what happened, and the `id` column will contain the relevant ID.

This is a template 

```sql 
USE [YourDatabaseName]
GO

/****** Object:  StoredProcedure [dbo].[TableName_Upsert] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[TableName_Upsert]
    @id INT = NULL,
    -- Add your table-specific parameters here
    @column1 VARCHAR(150),
    @column2 VARCHAR(50),
    @column3 VARCHAR(500),
    @column4 VARCHAR(150)
    -- Add more parameters as needed
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @ActionStatus VARCHAR(10);
    DECLARE @OutputId INT;

    BEGIN TRY
        BEGIN TRAN;

        IF @id IS NOT NULL AND @id > 0 -- Check for a valid, positive ID indicating an update attempt
        BEGIN
            -- Attempt to update
            UPDATE [dbo].[YourTableName]
            SET    [column1] = @column1,
                   [column2] = @column2,
                   [column3] = @column3,
                   [column4] = @column4
                   -- Add more columns as needed
            WHERE  [id] = @id;

            IF @@ROWCOUNT > 0 -- Check if any row was actually updated
            BEGIN
                SET @ActionStatus = 'UPDATED';
                SET @OutputId = @id;

                SELECT
                    t.[id],
                    t.[column1],
                    t.[column2],
                    t.[column3],
                    t.[column4],
                    -- Add more columns as needed
                    @ActionStatus AS ActionStatus
                FROM
                    [dbo].[YourTableName] t
                WHERE
                    t.[id] = @OutputId;
            END
            ELSE
            BEGIN
                -- No row found with the given @id to update.
                SET @ActionStatus = 'NOT_FOUND';
                SET @OutputId = @id; -- The ID that was attempted

                SELECT
                    @OutputId AS id,
                    CAST(NULL AS VARCHAR(150)) AS column1,
                    CAST(NULL AS VARCHAR(50)) AS column2,
                    CAST(NULL AS VARCHAR(500)) AS column3,
                    CAST(NULL AS VARCHAR(150)) AS column4,
                    -- Add more columns as needed with appropriate CAST types
                    @ActionStatus AS ActionStatus;
            END
        END
        ELSE
        BEGIN
            -- Insert new row
            INSERT INTO [dbo].[YourTableName] ([column1], [column2], [column3], [column4])
            VALUES (@column1, @column2, @column3, @column4);

            SET @OutputId = SCOPE_IDENTITY(); -- Get the newly inserted ID
            SET @ActionStatus = 'INSERTED';

            SELECT
                t.[id],
                t.[column1],
                t.[column2],
                t.[column3],
                t.[column4],
                -- Add more columns as needed
                @ActionStatus AS ActionStatus
            FROM
                [dbo].[YourTableName] t
            WHERE
                t.[id] = @OutputId;
        END

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        THROW;
    END CATCH;
END
GO
```