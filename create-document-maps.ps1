push-location

set-location src/lib/cli

bun create-markdown-map.ts
if ($LASTEXITCODE -ne 0){
    write-host "create-markdown-map.ts failed with exit code: $LASTEXITCODE"
    Pop-Location
    exit 1
}

bun create-index-map.ts
if ($LASTEXITCODE -ne 0){
    write-host "create-index-map.ts failed with exit code: $LASTEXITCODE"
    Pop-Location
    exit 1
}

bun create-tag-map.ts
if ($LASTEXITCODE -ne 0){
    write-host "create-tag-map.ts failed with exit code: $LASTEXITCODE"
    Pop-Location
    exit 1
}

Pop-Location
