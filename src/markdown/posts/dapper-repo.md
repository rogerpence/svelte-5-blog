---
title: "A simple Dapper repository"
description: "A simple Dapper repository. This was created originally for the ASNA  C# version of the Downloads repository."
tags:
    - 'c#'
    - 'sql'
date_added: 2023-04-16T05:01:18
date_updated: 2023-04-16T05:01:18
date_published: 
pinned: false
---

In all the following methods if the `commandType` argument is `CommandType.Text` then the `sql` argument is SQL. If the `commandType` argument is `CommandType.StoredProcedure` then the `sql` argument is a stored procedure name. The default in all methods is `CommandType.Text`.

## Repository primitives

### Select one or more rows

Select without query arguments:
```
Task<IEnumerable<T>> Query<T>(string sql, CommandType commandType = CommandType.Text);
```
Example: 
```
string sql = $"""
SELECT * FROM [tag] ORDER BY [name]
""";

var tags = await _repo.Query<Tag>(sql);
```

Select with query arguments:
```
Task<IEnumerable<T>> Query<T, U>(string sql, U parameters, CommandType commandType = CommandType.Text);
```
Example:

```
int minId = 120;

string sql = $"""
SELECT * FROM [tag] WHERE id < @minId ORDER BY [name]
""";

var tags = await _repo.Query<Tag, object>(sql, new {minId = minId});
```

### Select a single row

Select without query arguments:
```
Task<T> QuerySingle<T>(string sql, CommandType commandType = CommandType.Text);
```
Example:
```
string sql = $"""
SELECT * FROM [tag] WHERE [id] = 2021;
""";

var tags = await _repo.QuerySingle<Tag>(sql);
```

Select with query arguments:
```
Task<T> QuerySingle<T, U>(string Sql, U parameters, CommandType commandType = CommandType.Text);
```
Example:
```
int id = 2021;

string sql = $"""
SELECT * FROM [tag] WHERE [id] = @id;
""";

var tags = await _repo.QuerySingle<Tag, object>(sql, new {id = id});
```


### Execute a scalar query
Perform without query arguments:
```
Task<T> ExecScalar<T>(string sql, CommandType commandType = CommandType.Text);
```
Example:
```
string sql = $"""
SELECT [id] FROM tag WHERE [name] = 'python'
""";

var id = await this.ExecScalar<int>(sql);
```
Perform with query arguments:
```
Task<T> ExecScalar<T, U>(string sql, U parameters, CommandType commandType = CommandType.Text);
```
Example: 
```
int tagName = 'python';

string sql = $"""
SELECT [id] FROM tag WHERE [name] = @tagName
""";
``
var id = await this.ExecScalar<int, object>(sql, new { tagName = tagName });
```

### Execute non-query commands

Perform without query arguments:
```
Task Exec<T>(string sql, CommandType commandType = CommandType.Text);
```
Example:
```
string sql = $"""
DELETE FROM [tag] WHERE [id] = 2021;
""";

var tags = await _repo.Exec<Tag>(sql);
```

Perform with query arguments;
```
Task Exec<T, U>(string sql, U parameters, CommandType commandType = CommandType.Text);
```
Example:
```
int id = 2021;

string sql = $"""
DELETE FROM [tag] WHERE [id] = @id;
""";

var tags = await _repo.Exec<Tag, object>(sql, new {id = id});
```

## App-specific helpers

### Update or insert a row
```
Task<T> Upsert<T>(T model);
```
If the `Id` column is zero then an insert is attempted, otherwise an update is attempted.

Example:
```
Snippet snippet = new {title = "My Snippet"...};

Snippet result =  await _repo.Upsert<Snippet>(snippet);

int newId = result.Id;
```
The `Upsert` method derives a stored procedure name driven by the incoming class name. If the incoming class name is `Snippet` then the stored procedure called is named `rp_snippet_upsert`.  

The inserted or updated row is returned. For insert operations you can interrogate the row returned for its new id. `Upsert` methods use the `QuerySingle` primitive method described above.

The `Upsert` stored procedure is generated with the `sql-server-generator` utility. The stored procedures it generates are aware of what the table's unique id column is (that is, the column name 'id' isn't assumed to be the table's id column).

A generated `upsert` stored procedure is shown below:

```
CREATE OR ALTER PROC [dbo].[rp_snippetUpsert] 
    @id int = NULL, 
    @folderid int, 
    @title nvarchar(100), 
    @summarymarkdown nvarchar(256), 
    @summaryhtml nvarchar(256), 
    @bodymarkdown nvarchar(MAX), 
    @bodyhtml nvarchar(MAX), 
    @dateadded datetime, 
    @dateupdated datetime = NULL
AS 
    SET NOCOUNT ON 
    SET XACT_ABORT ON 
    
    BEGIN TRAN
        IF @Id > 0 
        BEGIN
            SET @dateupdated = GETDATE()                 
            UPDATE [dbo].[snippet]
            SET    [folderid] = @folderid, [title] = @title, [summarymarkdown] = @summarymarkdown, [summaryhtml] = @summaryhtml, [bodymarkdown] = @bodymarkdown, [bodyhtml] = @bodyhtml, [dateupdated] = @dateupdated
            WHERE  [id] = @id
            
            SELECT [id], [folderid], [title], [summarymarkdown], [summaryhtml], [bodymarkdown], [bodyhtml], [dateadded], [dateupdated]
            FROM   [dbo].[snippet]
            WHERE  [id] = @id            
        END ELSE 
        BEGIN
            SET @dateadded = GETDATE()        
            INSERT INTO [dbo].snippet ( [folderid], [title], [summarymarkdown], [summaryhtml], [bodymarkdown], [bodyhtml], [dateadded] )
            VALUES ( @folderid, @title, @summarymarkdown, @summaryhtml, @bodymarkdown, @bodyhtml, @dateadded )
        
            SELECT [id], [folderid], [title], [summarymarkdown], [summaryhtml], [bodymarkdown], [bodyhtml], [dateadded], [dateupdated]
            FROM   [dbo].[snippet]
            WHERE  [id] = SCOPE_IDENTITY()
        END
    COMMIT
GO
```

### Delete a row
```
Task Delete<T>(T model);
```
The `Delete` method deletes the incoming model's corresponding row;

Example:

```
Snippet model; // where model has, at least, its id column populated.

await this.Exec<T, T>($"rp_{className}Delete", model, CommandType.StoredProcedure);
```
The `Upsert` stored procedure is generated with the `sql-server-generator` utility.

A generated `Delete` stored procedure is shown below:
```
CREATE OR ALTER PROC [dbo].[rp_snippetDelete] 
    @id int = NULL, 
    @folderid int, 
    @title nvarchar(100), 
    @summarymarkdown nvarchar(256), 
    @summaryhtml nvarchar(256), 
    @bodymarkdown nvarchar(MAX), 
    @bodyhtml nvarchar(MAX), 
    @dateadded datetime, 
    @dateupdated datetime = NULL
AS 
    SET NOCOUNT ON 
    SET XACT_ABORT ON 
    
    BEGIN TRAN
        DELETE
        FROM   [dbo].[snippet]
        WHERE  [id] = @id
    COMMIT
GO    
```
