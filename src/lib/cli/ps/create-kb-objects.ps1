bun  ../create-markdown-objects-args.ts `
    -markdownObjectsInputPath              markdown\kb `
    -markdownObjectsOutputFilename         kb-markdown-objects.json `
    -markdownValidationErrorOutputFilename markdow-validation-error.txt `
    -frontMatterType                       TechnicalNote

bun ../create-index-nav-objects-args.ts `
    -markdownObjectsInputFile           kb-markdown-objects.json `
    -indexObjectsOutputFilename         kb-index-objects.json `
    -navObjectsOutputFilename           kb-nav-objects.json 
