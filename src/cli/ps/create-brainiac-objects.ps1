bun ../create-markdown-objects-args.ts `
    -markdownObjectsInputPath              markdown\technical-posts `
    -markdownObjectsOutputFilename         brainiac-markdown-objects.json `
    -markdownValidationErrorOutputFilename markdow-validation-error.txt `
    -frontMatterType                       TechnicalNote

bun ../create-index-nav-objects-args.ts `
    -markdownObjectsInputFile           brainiac-markdown-objects.json `
    -indexObjectsOutputFilename         brainiac-index-objects.json `
    -navObjectsOutputFilename           brainiac-nav-objects.json 
