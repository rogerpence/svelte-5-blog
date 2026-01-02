---
title: Test PDF validity
description: Test PDF validity
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - pdf
---
```
    /// <summary>
    /// Performs a basic check on a file to see if it starts with "%PDF"
    /// and ends with "%%EOF\n". This is a rudimentary check and does not
    /// guarantee the PDF is fully valid or uncorrupted.
    /// </summary>
    /// <param name="filePath">The full path to the file to check.</param>
    /// <returns>True if the file starts and ends with the expected PDF markers, false otherwise.</returns>
    public static bool TestPdfFile(string filePath)
    {
        // Basic check: ensure file exists before trying to read
        if (!File.Exists(filePath))
        {
            Console.Error.WriteLine($"Error: File not found '{filePath}'");
            return false;
        }

        try
        {
            // Read the entire file content into a byte array.
            // Consider using FileStream for very large files to avoid memory issues,
            // reading only the beginning and end parts.
            byte[] pdfBytes = File.ReadAllBytes(filePath);

            // PDF requires at least the header (%PDF) and the end marker (%%EOF\n)
            // A minimal valid PDF is usually larger, but this check needs at least 10 bytes.
            if (pdfBytes.Length < 10) // 4 for header + 6 for footer
            {
                return false; // File too small to contain both markers
            }

            // Get the first 4 bytes for the header "%PDF"
            string pdfHeader = Encoding.ASCII.GetString(pdfBytes, 0, 4);

            // Get the last 6 bytes for the end marker "%%EOF\n"
            // Note: Some PDF writers might use "%%EOF " or just "%%EOF".
            // This check specifically looks for "%%EOF\n" as in the PowerShell script.
            string pdfEndMarker = Encoding.ASCII.GetString(pdfBytes, pdfBytes.Length - 6, 6);

            // Check if both markers match
            // Using Ordinal comparison is generally safer for fixed markers.
            return pdfHeader.Equals("%PDF", StringComparison.Ordinal) &&
                   pdfEndMarker.Equals("%%EOF\n", StringComparison.Ordinal);

        }
        catch (IOException ex)
        {
            // Handle potential I/O errors (e.g., file locked, permissions)
            Console.Error.WriteLine($"IO Error accessing file '{filePath}': {ex.Message}");
            return false;
        }
        catch (Exception ex) // Catch other potential exceptions
        {
            Console.Error.WriteLine($"Unexpected error processing file '{filePath}': {ex.Message}");
            return false;
        }
    }
```