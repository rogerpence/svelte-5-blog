---
title: Gemini-produced code to use Goto APIs to register an attendee
description: Gemini-produced code to use Goto APIs to register an attendee
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
  - landing-page
---
##### Gemini-produced code:

I lost the prompt for this (but it wouldn't be hard to reproduce). This code is NOT tested.

```typescript
// src/routes/api/auth/refresh/+server.js

import { json } from "@sveltejs/kit";
import { env } from "$env/dynamic/private"; // For accessing environment variables securely

export async function POST({ request }) {
    // For this example, let's assume it comes from the request body:
    let refreshToken;
    try {
        const body = await request.json();
        refreshToken = body.refreshToken;
    } catch (e) {
        return json(
            {
                error: "Invalid request body. Expecting JSON with refreshToken.",
            },
            { status: 400 }
        );
    }

    if (!refreshToken) {
        return json(
            { error: "Missing refresh token in request body." },
            { status: 400 }
        );
    }

    // Retrieve client ID and secret securely from environment variables
    const clientId = env.LOGMEIN_CLIENT_ID;
    const clientSecret = env.LOGMEIN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error(
            "Missing LOGMEIN_CLIENT_ID or LOGMEIN_CLIENT_SECRET environment variables."
        );
        return json({ error: "Server configuration error." }, { status: 500 });
    }

    // --- 2. Prepare the Request ---

    // Construct the Basic Auth string: base64(clientId:clientSecret)
    // btoa is globally available in Node.js >= 16 and modern browsers/workers
    const base64Credentials = btoa(`${clientId}:${clientSecret}`);

    const tokenUrl = "https://authentication.logmeininc.com/oauth/token";

    // Prepare the form-urlencoded body
    const bodyParams = new URLSearchParams();
    bodyParams.append("grant_type", "refresh_token");
    bodyParams.append("refresh_token", refreshToken);

    // --- 3. Make the Fetch Request ---

    try {
        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                // Replicates: --header 'Content-Type: application/x-www-form-urlencoded'
                "Content-Type": "application/x-www-form-urlencoded",
                // Replicates: --header 'Authorization: Basic $($base64String)'
                Authorization: `Basic ${base64Credentials}`,
            },
            // Replicates: -d 'grant_type=refresh_token&refresh_token=$($refreshToken)'
            // URLSearchParams.toString() correctly formats it for x-www-form-urlencoded
            body: bodyParams.toString(),
        });

        // --- 4. Handle the Response ---

        if (!response.ok) {
            // Log the error details from the LogMeIn API for debugging
            const errorBody = await response.text();
            console.error(
                `LogMeIn API Error (${response.status}): ${errorBody}`
            );
            return json(
                { error: "Failed to refresh token", details: errorBody },
                { status: response.status } // Forward the status code
            );
        }

        // Assuming the response is JSON containing the new access_token, etc.
        const tokenData = await response.json();

        // TODO: Securely store the new access_token (and possibly new refresh_token if provided)
        // e.g., update the HttpOnly cookie, server-side session, database entry etc.

        // Return the relevant data (or just a success status) to your SvelteKit frontend/caller
        // Be careful not to expose sensitive data like the refresh token unless necessary
        return json({
            access_token: tokenData.access_token,
            token_type: tokenData.token_type,
            expires_in: tokenData.expires_in,
            scope: tokenData.scope,
            principal: tokenData.principal,
            loa: tokenData.loa,
        });
    } catch (error) {
        console.error("Network or fetch error during token refresh:", error);
        return json(
            { error: "Internal Server Error during token refresh" },
            { status: 500 }
        );
    }
}
```