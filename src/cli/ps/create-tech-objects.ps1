bun ../create-markdown-objects-args.ts `
    -markdownObjectsInputPath              markdown\tech `
    -markdownObjectsOutputFilename         tech-markdown-objects.json `
    -markdownValidationErrorOutputFilename tech-validation-error.txt `
    -frontMatterType                       TechnicalNote

bun ../create-index-nav-objects-args.ts `
    -markdownObjectsInputFile           tech-markdown-objects.json `
    -indexObjectsOutputFilename         tech-index-objects.json `
    -navObjectsOutputFilename           tech-nav-objects.json 
