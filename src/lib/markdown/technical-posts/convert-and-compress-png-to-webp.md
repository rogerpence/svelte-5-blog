---
title: Convert and compress png to webp
description: Convert and compress png to webp
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - utilities
  - web-dev
---
[Get the Google WebP CLi tools here](https://developers.google.com/speed/webp/download)
There are several utilities in this download. The [cwebp](https://developers.google.com/speed/webp/docs/cwebp) utility is the one that converts, compresses, and/or resizes `.png` or `.jpg` files to `.webp`.
The `-q` argument is quality. "25" is generally a good value to use for quality.

```
cwebp -q 25 enable-windows-pdf-driver.png -o enable-windows-pdf-driver.web
```

This command line also resizes the image to 550 px wide and the zero width ensures the aspect ratio is maintained.

```
cwebp -resize 550 0 -q 25 enable-windows-pdf-driver.png -o enable-windows-pdf-driver.webp
```

This is some PowerShell to create a utility to convert all images in a folder to WebP

```
$InputFolder = "C:\path\to\your\png\folder"  # Replace with your actual folder path

# Specify the output folder for the WEBP images. If it doesn't exist, it will be created.
$OutputFolder = "C:\path\to\your\webp\folder" # Replace with your actual output folder path

# Quality setting for cwebp (80 in your example)
$Quality = 80

# Path to the cwebp executable (you might need to adjust this)
$CwebpPath = "cwebp"  # Assumes cwebp is in your PATH environment variable.
                      # If not, provide the full path, e.g., "C:\WebP\cwebp.exe"


# Create the output folder if it doesn't exist
if (!(Test-Path -Path $OutputFolder)) {
    Write-Host "Creating output folder: $OutputFolder"
    New-Item -ItemType Directory -Path $OutputFolder | Out-Null
}

# Get all PNG files in the input folder
$PngFiles = Get-ChildItem -Path $InputFolder -Filter "*.png"

# Iterate through each PNG file and convert it to WEBP
foreach ($PngFile in $PngFiles) {

    # Construct the input and output file paths
    $InputFilePath = $PngFile.FullName
    $OutputFilePath = Join-Path -Path $OutputFolder -ChildPath ($PngFile.BaseName + ".webp")

    # Construct the cwebp command
    $Command = "$CwebpPath -q $Quality `"$InputFilePath`" -o `"$OutputFilePath`""
    # Use backticks to escape quotes inside the string

    # Execute the cwebp command
    Write-Host "Converting: $($PngFile.Name) to $($PngFile.BaseName).webp"
    try {
        Invoke-Expression $Command  # Executes the string as a command

        # Optional: Check the exit code for errors
        #$ExitCode = $LASTEXITCODE
        #if ($ExitCode -ne 0) {
        #    Write-Error "cwebp failed with exit code: $ExitCode"
        #}
    }
    catch {
        Write-Error "Error converting $($PngFile.Name): $($_.Exception.Message)"
    }
}

Write-Host "Conversion complete."
```