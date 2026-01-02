---
title: get podman running
description: get podman running
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - postgres
  - containers
---
## Get podman running

Helpful YouTube video
https://www.youtube.com/watch?v=sqJLvXzLgA8

```
Set-VMProcessor -VMName <VMName> -ExposeVirtualizationExtensions $true
```

Create a named volume with Podman

```
podman volume create postgres_data
```

On Windows, containers won't run with bind mounted folders because of permissions:
Using a named volume resolves this issue. because the postgres user inside the container will have the necessary permissions to chmod the data directory within the Podman-managed volume. Your data will still be persistent across container restarts, it just won't be directly visible under your Windows user folders. See [[podman named volumes]] for more info.
Using the named value, this starts the Postgres container

```
podman run --rm -d -p 5432:5432 -v postgres_data:/var/lib/postgresql/data --name postgresdb -e POSTGRES_PASSWORD=roger postgres
```

add this at the end to persist logging info

```
-c logging_collector=on
```

Start psql command line

```
podman exec -it -u postgres postgresdb psql
```

Stop and remove containers

```
podman stop postgresdb
podman rm postgresdb
```

Show all containers

```
podman ps -a
```


use `exit` command then `\q` to quit.

## composer file

This isn't tested but converts the Run command to a composer file.

```
version: '3.8' # Specify Compose file version (use 3.8 or newer for best features)

services:
  postgresdb: # This is the service name
    image: postgres:latest # Specifies the image to use (
    container_name: postgresdb
    ports:
      - "5432:5432" # Maps host port 5432 to container port 5432 (maps to -p)
    volumes:
      - postgres_data:/var/lib/postgresql/data # Mounts the named volume (maps to -v)
    environment:
      POSTGRES_PASSWORD: roger # Sets environment variables (maps to -e)

volumes:
  postgres_data: # Defines the named volume used in the service
    driver: local # Specifies the volume driver (optional, 'local' is the default)
```

```
podman compose -f compose-file-name.yaml
```

## To connect

```
host: localhost
database: postgres
user: postgres
password: roger
port: 5432
```