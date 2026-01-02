---
title: SQL Server full text search
description: SQL Server full text search
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sql-server
  - db
---
## see if full text search is installed

SELECT SERVERPROPERTY('IsFullTextInstalled') AS [Full Text Search Installed];

## SQL to see which databases have full text search enabled.

SELECT name as [DBName], is_fulltext_enabled FROM sys.databases

## Enable full text search

EXEC sp_fulltext_database 'enable'

SELECT SERVERPROPERTY('IsFullTextInstalled') AS [Full Text Search Installed];

## The database needs a full-text catalog.

This catalog is in the database's `Storage/Full Text` Catalogs node.

To create one, right click on `Storage/Full Text` and select "New Full-Text Catalog." You can name it anything you like; I use "full-text-search-catalog."

## Any table you want to full-text search needs a full-text index