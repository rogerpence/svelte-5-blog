---
title: Docker file tutorial
description: Docker file tutorial
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - containers
---
**What is a Dockerfile?**

A Dockerfile is a text document that contains all the commands a user could call on the command line to assemble a Docker **image**. Images are like blueprints or templates for creating Docker containers. Dockerfiles automate the process of image creation, making it repeatable, versionable, and easy to share.

Think of it this way:

-   **Dockerfile:** The recipe to bake a cake.
-   **Docker Image:** The actual cake, ready to be sliced.
-   **Docker Container:** A slice of the cake being served (a running instance of the image).

**Prerequisites:**

-   Docker Engine installed (includes the `docker build` command).

**The `Dockerfile` (File Name)**

By convention, this file is simply named `Dockerfile` (with a capital 'D' and no extension) and resides in the root directory of your project or the specific component it builds.

**Structure of a Dockerfile:**

A Dockerfile consists of a series of **instructions** followed by arguments. Each instruction creates a new layer in the Docker image.

```dockerfile
INSTRUCTION argument
INSTRUCTION argument argument
...
```

**Primary Instructions in a Dockerfile:**

Here are some of the most fundamental and commonly used instructions:

1.  **`FROM <image>:<tag>` (Required):**

    -   This **must** be the first instruction in a Dockerfile (except for optional `ARG`s).
    -   Specifies the base image to build upon. Your image inherits all the layers from this base image.
    -   Examples: `FROM ubuntu:22.04`, `FROM python:3.11-slim`, `FROM node:18-alpine`. Choose a base image that has the core tools you need (like an operating system or a language runtime).

2.  **`WORKDIR /path/to/workdir`:**

    -   Sets the working directory for subsequent instructions like `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, `ADD`.
    -   If the directory doesn't exist, it will be created.
    -   It's good practice to set a `WORKDIR` early on.
    -   Example: `WORKDIR /app`

3.  **`COPY <src> <dest>`:**

    -   Copies files or directories from your **build context** (usually the directory containing the Dockerfile) into the image's filesystem at the specified `<dest>` path.
    -   `<src>` path is relative to the build context.
    -   Example: `COPY . .` (copies everything from the build context into the current `WORKDIR` inside the image), `COPY requirements.txt .`

4.  **`RUN <command>`:**

    -   Executes commands in a new layer **during the image build process**.
    -   Typically used to install software packages, update the OS, compile code, or set up the environment.
    -   Each `RUN` instruction creates a new image layer. It's often good practice to chain related commands using `&&` to reduce the number of layers.
    -   Example: `RUN apt-get update && apt-get install -y curl`
    -   Example: `RUN pip install -r requirements.txt`

5.  **`EXPOSE <port>/<protocol>`:**

    -   Informs Docker that the container will listen on the specified network ports at runtime.
    -   This instruction does **not** actually publish the port to the host machine. It serves as documentation and allows for easier linking between containers. Publishing is done using the `-p` flag with `docker run` or the `ports` section in Docker Compose.
    -   Example: `EXPOSE 80`, `EXPOSE 5432/tcp`

6.  **`CMD ["executable", "param1", "param2"]` (Exec Form - Preferred)** or `CMD command param1 param2` (Shell Form):\*\*

    -   Provides defaults for an executing container. There can only be **one** `CMD` instruction in a Dockerfile. If you list more than one `CMD`, only the last one will take effect.
    -   The primary purpose of `CMD` is to provide the default command to run when a container starts from the image.
    -   If the user specifies arguments to `docker run`, they will override the default specified in `CMD`.
    -   Example (Exec form): `CMD ["python", "app.py"]`
    -   Example (Shell form): `CMD python app.py`

7.  **`ENTRYPOINT ["executable", "param1", "param2"]` (Exec Form - Preferred)** or `ENTRYPOINT command param1 param2` (Shell Form):\*\*
    -   Configures a container that will run as an executable.
    -   It's similar to `CMD`, but commands passed to `docker run` are appended as arguments to the `ENTRYPOINT` executable, rather than overriding it entirely.
    -   Often used in combination with `CMD` to specify default arguments that can be overridden.
    -   Example: `ENTRYPOINT ["/usr/sbin/nginx", "-g", "daemon off;"]`

**Simple Example: A Basic Python Flask App**

Let's create an image for a simple web application.

1.  Create a directory for your project, e.g., `my_docker_app`.
2.  Inside `my_docker_app`, create a simple Python file named `app.py`:

    ```python
    from flask import Flask
    import os

    app = Flask(__name__)

    @app.route('/')
    def hello():
        return f"Hello from inside a Docker container!"

    if __name__ == "__main__":
        # Listen on all available interfaces within the container
        app.run(host='0.0.0.0', port=5000)
    ```

3.  Create a `requirements.txt` file in the same directory:
    ```txt
    Flask==2.3.3 # Use a specific version if desired
    ```
4.  Create a file named `Dockerfile` (no extension) in the same directory:

    ```dockerfile
    # Start with the official Python 3.11 slim base image
    FROM python:3.11-slim

    # Set the working directory inside the container
    WORKDIR /app

    # Copy the requirements file into the working directory
    COPY requirements.txt .

    # Install the Python dependencies specified in requirements.txt
    # --no-cache-dir reduces image size slightly
    # --upgrade pip ensures we have a recent pip version
    RUN pip install --no-cache-dir --upgrade pip && \
        pip install --no-cache-dir -r requirements.txt

    # Copy the rest of the application code (app.py in this case)
    # into the working directory
    COPY . .

    # Inform Docker that the container listens on port 5000
    EXPOSE 5000

    # Define the default command to run when the container starts
    # Use the exec form for CMD
    CMD ["python", "app.py"]
    ```

**Building the Docker Image:**

1.  Open your terminal and navigate to the directory containing your `Dockerfile` and source code (`my_docker_app`).
2.  Run the build command:
    ```bash
    # -t gives the image a name (tag) in the format name:tag
    # . tells Docker to use the current directory as the build context
    docker build -t my-python-app:latest .
    ```
    You'll see Docker executing each step from your Dockerfile.

**Running a Container from the Image:**

1.  Once the build is complete, run a container:
    ```bash
    # -d runs the container in detached mode (background)
    # -p maps port 8080 on your host to port 5000 inside the container
    # --name gives the running container a specific name (optional)
    # my-python-app:latest is the image we just built
    docker run -d -p 8080:5000 --name my-running-app my-python-app:latest
    ```
2.  Verify it's running: Open your web browser and go to `http://localhost:8080`. You should see "Hello from inside a Docker container!".
3.  Check logs: `docker logs my-running-app`
4.  Stop and remove the container:
    ```bash
    docker stop my-running-app
    docker rm my-running-app
    ```

That's the essence of creating a Dockerfile! It allows you to define a consistent, portable environment for your application by packaging it and its dependencies into a reusable image.