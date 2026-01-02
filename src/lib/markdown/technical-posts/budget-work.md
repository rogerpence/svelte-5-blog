---
title: Personal budget work for Roger and Colleen. import Jefferson Bank data.
description: Personal budget work for Roger and Colleen. import Jefferson Bank data.
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - personal
  - budget
---
## To import Jeffersson bank credit card data

### Download latest data
* Log into Jefferson Bank 
* Go to Services/Card Management
* Click "View Transactions"
* Set filter for all of 2024 and 2025
* Download as `C:\Users\thumb\Documents\projects\personal\AccountHistory.xls`
* Open that file with Excel and save as `C:\Users\thumb\Documents\projects\personal\AccountHistory.xlsx`
* Import `AccountHistory.xlsx` into SQL Server
	* Open this C# program in VS: `C:\Users\thumb\Documents\projects\cs\import-jeff-bank\import-jeff-bank.sln` and run it
	* That program clears the `rpBudget` table in the `rp` database and then imports the latest data


I have an excel spreadsheet with the following columns:

-   AccountNumber
-   Post Date
-   Year
-   Month
-   Check
-   Description
-   Debit
-   Credit
-   Status
-   Balance
-   Classification

I want to create a pivot table that include only values from year 2024 and shows the Classification value in the A column and the summarized debit values by Classification for each for each month 1 - 12 in columns B through M. In the last row put the total of each column

Okay, here's how to create that PivotTable in Excel:

**Steps:**

1.  **Select Your Data:**

    -   Click anywhere inside your data table (e.g., cell A1).
    -   Press `Ctrl + A` (or `Cmd + A` on Mac) to select the entire data range.

2.  **Insert PivotTable:**

    -   Go to the **Insert** tab on the Excel ribbon.
    -   Click **PivotTable**.
    -   In the "Create PivotTable" dialog box:
        -   Ensure the "Table/Range" correctly shows your selected data.
        -   Choose where you want to place the PivotTable: "New Worksheet" (recommended) or "Existing Worksheet" (and then specify a location).
        -   Click **OK**.

3.  **Configure the PivotTable Fields:**
    A "PivotTable Fields" pane will appear on the right side of your screen. Drag and drop the fields into the appropriate areas at the bottom of this pane:

    -   **Filters:**
        -   Drag the **Year** field into the "Filters" area.
    -   **Rows:**
        -   Drag the **Classification** field into the "Rows" area.
    -   **Columns:**
        -   Drag the **Month** field into the "Columns" area.
    -   **Values:**
        -   Drag the **Debit** field into the "Values" area. It should automatically default to "Sum of Debit". If it shows "Count of Debit" or something else, click on it, select "Value Field Settings...", and choose "Sum". Click "OK".

4.  **Filter for the Year 2024:**

    -   At the top of your new PivotTable (usually in cell A1 or B1 of the sheet where the PivotTable is located), you'll see the "Year" filter.
    -   Click the dropdown arrow next to "(All)".
    -   Check the box next to **2024** (and uncheck any others if necessary).
    -   Click **OK**.

5.  **Check Grand Totals:**
    -   By default, PivotTables usually show Grand Totals for both rows and columns.
    -   The "last row" with the total of each column is the "Grand Total" row for the columns. This should appear automatically.
    -   If it's not showing, click anywhere inside your PivotTable, go to the **PivotTable Analyze** (or **Design**) tab on the ribbon:
        -   **Design Tab:** Click **Grand Totals** in the "Layout" group and select **On for Columns Only** or **On for Rows and Columns**. (You specifically want the column totals, which appear as the last row).

**Result:**

-   **Column A** will display your unique `Classification` values.
-   **Columns B through M** (or however many months have data for 2024) will display the `Month` numbers (1, 2, 3,... 12).
-   The cells within the table will show the sum of `Debit` amounts for each `Classification` and `Month`.
-   The **last row** of the PivotTable (labeled "Grand Total") will show the sum of debits for each month column.

**Optional Refinements:**

-   **Formatting Numbers:** Select the debit values in the PivotTable, right-click, choose "Number Format...", and select "Currency" or "Accounting" as desired.
-   **Column Header Names:** If the month headers show "Sum of Debit - 1", "Sum of Debit - 2", etc., you can simply type over them in the PivotTable to rename them to "1", "2", "Jan", "Feb", etc. (though using numbers 1-12 as per your request is fine).
-   **If Months Sort Alphabetically (e.g., if they were "Jan", "Feb"):** If your `Month` column in the source data contained text names and they sort alphabetically in the PivotTable (April, August, December...), you'd ideally have a numeric month column (1-12) in your source data to use for sorting, or create a custom sort list. Since you mentioned "month 1-12", this shouldn't be an issue.

That's it! You'll have your desired PivotTable. Remember to refresh the PivotTable (right-click on it > Refresh) if your source data changes.