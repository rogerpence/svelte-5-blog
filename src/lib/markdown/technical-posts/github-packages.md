---
title: What are github packages
description: What are github packages
date_updated: '2025-12-14T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - github
---
**GitHub Packages** is a software package hosting service that allows you to host your software packages privately or publicly and use them as dependencies in your projects. It is essentially GitHub’s version of package registries like `npm` (for JavaScript) or `Maven Central` (for Java), but integrated directly into your GitHub repository and workflow.

Here is a detailed breakdown of what it is and how it works:

### 1. What does it do?
It provides a place to store and manage the "artifacts" (compiled code, libraries, or containers) that your code produces. Instead of publishing your library to a third-party site like npmjs.com or NuGet.org, you can publish it directly to GitHub. This allows you to keep your code, issues, and packages all in one place.

### 2. Supported Package Types
GitHub Packages supports several popular package managers and formats:
*   **Containers:** Docker and OCI images (via the Container Registry `ghcr.io`)
*   **JavaScript:** npm
*   **Java:** Apache Maven and Gradle
*   **Rank:** RubyGems
*   **.NET:** NuGet

### 3. Key Features & Benefits
*   **Integrated with GitHub Actions:** This is one of the biggest advantages. You can build a CI/CD pipeline that automatically tests your code and, if successful, publishes the package to GitHub Packages without needing external credentials for other services.
*   **Unified Permissions:** It uses the same permissions as your repository. If a developer has "Read" access to your private repository, they can automatically download the private packages associated with it.
*   **Public and Private Hosting:**
    *   **Public:** You can host open-source packages for free that anyone can use.
    *   **Private:** You can host proprietary internal packages that only your team or organization can access.

### 4. The Container Registry vs. Docker Registry
You may see references to two different container services.
*   **Container Registry (`ghcr.io`):** This is the newer, recommended service. It allows for granular permissions (packages can belong to an organization rather than just a specific repository) and supports anonymous pulls for public images.
*   **Docker Registry (`docker.pkg.github.com`):** This is the legacy service where packages were strictly tied to a specific repository.

### 5. Pricing
*   **Public Packages:** Free.
*   **Private Packages:** Free up to a certain limit of storage and data transfer depending on your GitHub plan (e.g., Free, Pro, Team). After you hit the limit, it is pay-as-you-go.

### Summary
If you are developing a library or a Docker image, GitHub Packages lets you "publish" that product right next to the source code that built it, making it easier to manage versions and permissions for your team.