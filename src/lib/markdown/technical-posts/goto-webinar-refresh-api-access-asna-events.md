---
title: Node.js GoTo Webinar Registration Example
description: Node.js GoTo Webinar Registration Example
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - asna-com
  - goto-webinar
---
See also:

-   [Node example](https://rollout.com/integration-guides/go-to-webinar/sdk/step-by-step-guide-to-building-a-go-to-webinar-api-integration-in-js)
-

## The short story:

Initial setup: 
1. Get the top-level GoTo OAuth access token with this API: `https://authentication.logmeininc.com/oauth/authorize`
2. Get the access token with this API: `https://authentication.logmeininc.com/oauth/token`

> [!important]
> You can only get the access token once with the top-level OAuth code. 

See [[goto-create-oauth-client]] for the full details on the initial setup for using the GoTo APIs. 

At runtime: 
3. Refresh the access token with this API `https://authentication.logmeininc.com/oauth/token`

[Developer Portal](https://developer.goto.com/GoToWebinarV2)

My Sveltekit work is here:

```
C:\Users\thumb\Documents\projects\sveltekit\apis\src\routes\register-attendee
```

## How to programmatically register an attendee for a GoToWebinar

[Another example](https://rollout.com/integration-guides/go-to-webinar/sdk/step-by-step-guide-to-building-a-go-to-webinar-api-integration-in-csharp)

GotoWebinar Personal Access Token (created 23 Apr 2025)

asnaevents@asna.com

```
200000000000313229_v9Ap3v9dubwbIGMV2RnjhyH7dMlywdmQ
```

rp@asna.com

```
5121648670853925893_wib1hkFvfIbegzCbFsDIi4rTkH8V60Sr
```

GotoWebinar says the organizerKey is :

```
200000000000313229
```

webinar key is (for the first GoTo Webinar):

```
5372803598377463127
```

## How to get the API authorization code

You need five values to get a GoTo access key:

1. Client ID
2. Secret
3. The base 64 value of [client id]:[secret]
4. The redirect URI
5. The API authorization code

## Step 1. Create an OAuth client

https://developer.logmeininc.com/clients

This provides the Client ID and the secret. Use the site provided to calculate #3, the base 64 value.

The URI is https://asna.com

> These instructions come from this link: https://developer.goto.com/guides/Authentication/03_HOW_accessToken

Current client

<mark style="background: #ADCCFFA6;">1. Client ID</mark>

```
43e6ab89-b989-48f9-87ac-2d1388a22985
```

<mark style="background: #ADCCFFA6;">2. Secret </mark>

```
ejwoY1WMx6fkWQGISALfGKoK
```

<mark style="background: #ADCCFFA6;">3. Base 64 value of [client id]:[secret]</mark> [Base64Encode](https://www.base64encode.org/)

```
NDNlNmFiODktYjk4OS00OGY5LTg3YWMtMmQxMzg4YTIyOTg1OnhERzdGTzVGZ3pnZFRqMXRGZUFnUlV6ZQ==
```

<mark style="background: #ADCCFFA6;">4. URL</mark>

```
https://asna.com
```

A 5th value is needed. Keep reading.

Using a fresh client id (you can only do this one with given client id), use the template below to create a URL where `{clientID}` = client id from OAuth client and redirectUri = "https://asna.com"

```
https://authentication.logmeininc.com/oauth/authorize?client_id={clientID}&response_type=code&redirect_uri={redirectUri}
```

For this example, after substitutions the URL then look like this:

```
https://authentication.logmeininc.com/oauth/authorize?client_id=38f340bd-0b9c-4928-a2b2-d502cf180735&response_type=code&redirect_uri=https://asna.com
```

Submit that URL with a browser. It will show this screen:

![[Node.js GoTo Webinar Registration Example.png|200]]

Click "Allow" and you'll be returned to https://asna.com but the URL contains a `code` search param with a very large code:

```
https://asna.com.com/?code=iS0vynEEvRFA9i6kZ8gvNDnnOGE...
```

The value returned in with the `code` key is the API authorization code. This is the 5th value needed.

<mark style="background: #ADCCFFA6;">5. API authorization code</mark>

ASNAEvents auth code

```
eyJraWQiOiI2MjAiLCJhbGciOiJSUzUxMiJ9.eyJzYyI6ImNvbGxhYjoiLCJzdWIiOiIyMDAwMDAwMDAwMDAzMTMyMjkiLCJhdWQiOiI0M2U2YWI4OS1iOTg5LTQ4ZjktODdhYy0yZDEzODhhMjI5ODUiLCJvZ24iOiJwd2QiLCJscyI6Ijk2MDkzZWVjLWYyMzctNDc3Ni1hM2ZiLWJjNTEwYmM5YTY3OCIsInR5cCI6ImMiLCJleHAiOjE3NDY2NTI5NjYsImlhdCI6MTc0NjY1MjM2NiwidXJpIjoiaHR0cHM6Ly9hc25hLmNvbSIsImp0aSI6ImU4OTY0YTBhLWEwYTgtNGNjOS05ODVmLThiYWQ3NzYzZTA5OCJ9.FgVwjCv6o3njSNge_rXK4MXQw6DwiMrtmcPVTEqbcWGAcYh-wMC6SLPGD2_l6Vw7MDIqoO_DfQXWnKLyBdYE_zoF4W3omWMnsTJUwuoieNBrTH57mZU50gy8ieqHP_cPQBJX5p4M3IuFQdkx5-wySxkj4BI69KgqbyZVwRqnX7ViVe8reUikL8RB1NhDV0BVGHeXy4cr1s4GZDexOZkl1dFCj1Mp7tqB-d55fNa7JsQmruhWLuToXEKim_doQkTGG2BoV93i7PRSi0l1WT7jTEozjD6VUnqGo5e_iSpHSc8chtlNPjCcH9DHpjQR6A4VUzOLfhYcxxVI8cpTY6vlGg
```

## How to refresh the API access token

This needs be done before every API request to GoTo and needs the API access token. 

[There are instructions](https://developer.goto.com/guides/Authentication/03_HOW_accessToken/) to use the values from above to create the API access token. However, they are so convoluted they aren't much help. To get the API access token, it's much easier to use VS Code's Thunder Client (a Postman like HTTP client).

Use Thunder Client with these two screens to produce the API access token:


eyJraWQiOiI2MjAiLCJhbGciOiJSUzUxMiJ9.eyJzYyI6ImNvbGxhYjoiLCJzdWIiOiIyMDAwMDAwMDAwMDAzMTMyMjkiLCJhdWQiOiI0M2U2YWI4OS1iOTg5LTQ4ZjktODdhYy0yZDEzODhhMjI5ODUiLCJvZ24iOiJwd2QiLCJscyI6Ijc3YTBlYTMyLTdiOGMtNGE3ZS05NTRjLTg4YzA3ODM0NDZlZCIsInR5cCI6ImMiLCJleHAiOjE3NDc3Njc4NTgsImlhdCI6MTc0Nzc2NzI1OCwidXJpIjoiaHR0cHM6Ly9hc25hLmNvbSIsImp0aSI6ImI2MGZjZmJkLWUxMjYtNDhkNC05ZDY4LTkzYWIzMmNlOTYxMyIsImxvYSI6M30.UpoiRHT01rdM8SCk09w20jb52ALzV5hOjWleCz0ECYDXniAnfr54JrYR92IsvVQmahfK5_oGmQeMn67646N0NzlgPwt2mIzq53xpUcCmLWGSIuVoKKvRbSMVfH7pflC376cETLexRnn_gskUIcKSOB1xZPAj3gqWbWyWSV2xeqHlhRnySICK43Qju3CdKbQcO06qzF7MxzItFsn_N2SnON45FM-YIkIhm-Pvob7LzoTh24zOgV5d_9Un5zTFECM04BPzLiYp_12YSYBPptBO8GCRWszimCLlto0iSGT7e0MO3ltV-xg4_kxApK2PaS53SCUhmVPdWCsWMSBjrWZ-zw
![[image-3.png|774x301]]

![[image-4.png|774x301]]

That request produces a Json document that shows the access token and the new refresh token. The refresh token is important because access tokens expire in 60 minutes and need to be refreshed before attempting any GoTo API calls.

The access token should be refreshed every time a GoTo Webinar API call is made.

```
{
  "access_token": "eyJraWQiOiI2MjAiLCJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "collab:",
  "principal": "asnaevents@asna.com",
  "loa": 3
}
```

It's important to note about every 30 days the refresh token will also be replaced when calling this API. In that case, it returns both the current `access_token` and the new `refresh_token`. When the response includes the `refresh_token` it must replace the current `refresh_token` (that is currently stored in the `.env` file.)

```
{
  "access_token": "eyJraWQiOiI2MjAiLCJhbGc...",
  "token_type": "Bearer",
  "refresh_token": "eyJraWQiOiJvYXV0aHYyLmxt999..",
  "expires_in": 3600,
  "scope": "collab:",
  "principal": "asnaevents@asna.com",
  "loa": 3
}
```

![[image-5.png|780x591]]

ASNA Events access key

```
{
  "access_token": "eyJraWQiOiI2MjAiLCJhbGciOiJSUzUxMiJ9.eyJzYyI6ImNvbGxhYjoiLCJzdWIiOiIyMDAwMDAwMDAwMDAzMTMyMjkiLCJhdWQiOiI0M2U2YWI4OS1iOTg5LTQ4ZjktODdhYy0yZDEzODhhMjI5ODUiLCJvZ24iOiJwd2QiLCJscyI6Ijk2MDkzZWVjLWYyMzctNDc3Ni1hM2ZiLWJjNTEwYmM5YTY3OCIsInR5cCI6ImEiLCJleHAiOjE3NDY2NTYyNDIsImlhdCI6MTc0NjY1MjY0MiwianRpIjoiMjA0NTk1MWMtNDZiZi00MzI3LWJjMzItMTZjZWNiMTI2MWUxIn0.hUX6G06hEkyCqlFk_aNiT4RayuhhLKmtIJq1xkN43gVm8h1ZesxuRT1LTOFYyTrO9UgcHUKDCUBgjBYdxpKegJekHcbTKGQDW3FauGvAkLXovMt3jlPO7qVTAVUmqecgBNZ05EamS85dUm6G1XJyDOkIT3YLftZ-azW3USRvPIgbgrDxIsdEdDqt5PW1zdf5UGFQzd7QX3IERvA-g6QiODrAMxqxupdF9hJ0mHwfC4j5WLdE4w3gxPBvICrFwQJGoM_Y7qL4FezH-5U1l-VCSEe_oqqMLs6IR4sqA7TXsWSSVzbS_Vbt_O_APJFKzDj40Dflitab8FNBmiZoa5inrA",
  "token_type": "Bearer",
  "refresh_token": "eyJraWQiOiI2MjAiLCJhbGciOiJSUzUxMiJ9.eyJzYyI6ImNvbGxhYjoiLCJzdWIiOiIyMDAwMDAwMDAwMDAzMTMyMjkiLCJhdWQiOiI0M2U2YWI4OS1iOTg5LTQ4ZjktODdhYy0yZDEzODhhMjI5ODUiLCJvZ24iOiJwd2QiLCJ0eXAiOiJyIiwiZXhwIjoxNzQ5MjQ0NjQyLCJpYXQiOjE3NDY2NTI2NDIsImp0aSI6IjdiNjhmNDYwLTI5N2YtNGZmYS05YzU1LTY5MTgxOWFlYjk3OSJ9.ri5VKt4Zi9CVgns_wCGIxbsjFykQFyUcwF9khZmTo4psU0bH8CQslllb7fvtZBuw3usXC3Pkxh9Fq6jJQexPezpfhQ6uB9bmGFsnlqZG23C5hSoe6gj78S1Z8Vqyk98uXINZLH7JClDc7ruFEdjHEy5JY-agkAFuHUH0FWwyCfLfbDWLH1uGijn913JXd0fLgsIcnNDfosuqjcbbCFe74aGDTbdcCuANXQNSO01ozjULWJz0G0JLhPAw-_DU2FdgjD2iaDA4-cHvWMRM1VMAVnu6ZpO2XmCuPYvZ8k_RMTgAkRY-DXBhdp2_h4Q1234S57if4Q5kLe2kPtI-9WVpkQ",
  "expires_in": 3600,
  "scope": "collab:",
  "principal": "asnaevents@asna.com",
  "loa": 2
}
```

### Refreshing the access token

Access tokens have a 60 minute lifespan. For more detail on refresh tokens [see this document](https://developer.goto.com/guides/Authentication/05_HOW_refreshToken/).

Use the Thunder Client to refresh the token as shown below. Also see the Sveltekit code to refresh the token. The Sveltekit code need to be refactored into an API (maybe!).

> [!important] > [[Sveltekit route to refresh Goto API key]]

![[image-6.png|1153x439]]

![[image-7.png|1158x501]]

![[image-8.png|1158x478]]

## Other weirdo/miscellaneous notes below

1. I created a personal access token with my rp@asna.com login.
2. I created an OAuth client that produced this Client ID: 38f340bd-0b9c-4928-a2b2-d502cf180735
3. I followed these directions to get an access token: https://developer.goto.com/guides/Authentication/03_HOW_accessToken/ and did successfully get an access token and a refresh token. I can successful use the refresh token to get a refreshed access token.
4. I have a Webinar scheduled and its webinarKey is 5372803598377463127 https://dashboard.gotowebinar.com/webinar/5372803598377463127
5. I want to use this API https://api.getgo.com/G2W/rest/v2/organizers/[organizerKey]/webinars/[webinarKey]/registrants to programmatically add a registrant from our landing page(s).

Questions

1.  Where do I get the organizerKey for the Create Registrant API?
    1. The Create registrant API needs two parameters (both of which are int64): organizerKey and webinarKey. I think the webinarKey is the value at the end of a Webinar URL (from step 4 above).
2.  The Create Registrant API url has 'v2' in it but uses what appears to be a deprecated domain: api.getgo.com. Is the URL below the correct URL for the Create Registrant API?
    1. https://api.getgo.com/G2W/rest/v2/organizers/[organizerKey]/webinars/[webinarKey]/registrants

Here's a Node.js example using `axios` to register a participant for a GoTo Webinar using their V2 API.

Getting keys

![[Node.js GoTo Webinar Registration Example-20250423141731996.webp|500]]

**Assumptions:**

1.  You have Node.js and npm (or yarn) installed.
2.  You have already gone through the GoTo Developer OAuth 2.0 flow to obtain a valid **Access Token**. This example _does not_ cover the token acquisition process itself, which typically involves user authorization or using a refresh token.
3.  You know your **Organizer Key**. [[GoTo Webinar refresh API access#Get an organizer key|How to get an organizer key.]]
4.  You know the **Webinar Key** for the specific webinar you want to register someone for.

**Steps:**

1.  **Set up your project:**

    ```bash
    mkdir goto-webinar-register
    cd goto-webinar-register
    npm init -y
    npm install axios dotenv
    ```

2.  **Create a `.env` file:**
    Create a file named `.env` in the root of your project directory (`goto-webinar-register`). This file will securely store your credentials. **Never commit this file to Git.**

    ```dotenv
    GOTO_API_BASE_URL=https://api.getgo.com
    GOTO_ACCESS_TOKEN="YOUR_VALID_ACCESS_TOKEN_HERE" # Replace with your actual access token
    GOTO_ORGANIZER_KEY="YOUR_ORGANIZER_KEY_HERE"   # Replace with your organizer key (usually a number)
    GOTO_WEBINAR_KEY="YOUR_WEBINAR_KEY_HERE"     # Replace with the specific webinar key (usually a number)
    ```

    -   Replace the placeholder values with your actual credentials.

3.  **Create the Node.js script (e.g., `register.js`):**

    ```javascript
    // register.js
    require("dotenv").config(); // Load environment variables from .env file
    const axios = require("axios");

    // --- Configuration ---
    const API_BASE_URL = process.env.GOTO_API_BASE_URL;
    const ACCESS_TOKEN = process.env.GOTO_ACCESS_TOKEN;
    const ORGANIZER_KEY = process.env.GOTO_ORGANIZER_KEY;
    const WEBINAR_KEY = process.env.GOTO_WEBINAR_KEY;

    // --- Registrant Details ---
    const registrantInfo = {
        firstName: "John",
        lastName: "Doe",
        email: `john.doe.${Date.now()}@example.com`, // Using timestamp for uniqueness in testing
        // Add other optional fields as needed per GoTo API docs:
        // address: "123 Main St",
        // city: "Anytown",
        // state: "CA",
        // zipCode: "90210",
        // country: "USA",
        // phone: "555-123-4567",
        // industry: "Technology",
        // organization: "Example Corp",
        // jobTitle: "Developer",
        // purchasingTimeFrame: "Within a month",
        // roleInPurchaseProcess: "Decision maker",
        // noOfEmployees: "100-499",
        // questionsAndComments: "Looking forward to the webinar!",
        // source: "Website Signup Form" // Helps track where registrations come from
    };

    /**
     * Registers a participant for a GoTo Webinar.
     * @param {string} organizerKey - The organizer's key.
     * @param {string} webinarKey - The specific webinar's key.
     * @param {object} registrantData - An object containing registrant details (firstName, lastName, email required).
     * @param {string} accessToken - The valid OAuth 2.0 access token.
     * @returns {Promise<object>} - A promise that resolves with the API response data on success.
     */
    async function registerParticipant(
        organizerKey,
        webinarKey,
        registrantData,
        accessToken
    ) {
        if (!organizerKey || !webinarKey || !registrantData || !accessToken) {
            throw new Error(
                "Missing required parameters: organizerKey, webinarKey, registrantData, or accessToken."
            );
        }
        if (
            !registrantData.firstName ||
            !registrantData.lastName ||
            !registrantData.email
        ) {
            throw new Error(
                "Registrant data must include firstName, lastName, and email."
            );
        }

        const registrationUrl = `${API_BASE_URL}/G2W/rest/v2/organizers/${organizerKey}/webinars/${webinarKey}/registrants`;

        console.log(
            `Attempting registration for ${registrantData.email} to webinar ${webinarKey}...`
        );
        console.log(`POST URL: ${registrationUrl}`);
        console.log("Payload:", JSON.stringify(registrantData, null, 2)); // Log the data being sent

        try {
            const response = await axios.post(registrationUrl, registrantData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json", // Or 'application/vnd.citrix.g2wapi-v2.0+json' if specifically needed
                },
                // Optional: Set a timeout
                // timeout: 10000 // milliseconds
            });

            console.log("Registration successful!");
            return response.data; // The API response (usually contains registrantKey, joinUrl, etc.)
        } catch (error) {
            console.error("Registration failed:");
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Status:", error.response.status);
                console.error(
                    "Headers:",
                    JSON.stringify(error.response.headers, null, 2)
                );
                console.error(
                    "Data:",
                    JSON.stringify(error.response.data, null, 2)
                ); // Often contains specific API error details
                // Specific GoTo Error Check
                if (
                    error.response.data &&
                    error.response.data.errorCode === "AlreadyRegistered"
                ) {
                    console.warn(
                        `Email ${registrantData.email} is already registered for this webinar.`
                    );
                    // Decide how to handle this - maybe return a specific indicator or just log it.
                    // You might still want to throw an error or return null depending on your app logic.
                    // For this example, we'll re-throw but you could customize this.
                    throw new Error(
                        `Already registered: ${error.response.data.description}`
                    );
                }
                throw new Error(
                    `API Error ${error.response.status}: ${
                        error.response.data?.description || error.message
                    }`
                );
            } else if (error.request) {
                // The request was made but no response was received
                console.error("Request Error: No response received.");
                console.error(error.request);
                throw new Error(`Network Error: ${error.message}`);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error:", error.message);
                throw error; // Re-throw the original error
            }
        }
    }

    // --- Main Execution ---
    (async () => {
        if (!ACCESS_TOKEN || !ORGANIZER_KEY || !WEBINAR_KEY) {
            console.error(
                "ERROR: Missing required environment variables (GOTO_ACCESS_TOKEN, GOTO_ORGANIZER_KEY, GOTO_WEBINAR_KEY)."
            );
            console.error("Please ensure the .env file is correctly set up.");
            process.exit(1); // Exit with an error code
        }
        if (ACCESS_TOKEN === "YOUR_VALID_ACCESS_TOKEN_HERE") {
            console.warn(
                "WARNING: Using placeholder Access Token. Please update .env file."
            );
        }

        try {
            const registrationResult = await registerParticipant(
                ORGANIZER_KEY,
                WEBINAR_KEY,
                registrantInfo,
                ACCESS_TOKEN
            );

            console.log("\n--- Registration Result ---");
            console.log(JSON.stringify(registrationResult, null, 2));
            console.log(`\nSuccessfully registered ${registrantInfo.email}.`);
            console.log(`Registrant Key: ${registrationResult.registrantKey}`);
            console.log(`Join URL: ${registrationResult.joinUrl}`);
        } catch (error) {
            console.error(
                "\n--- An error occurred during the registration process ---"
            );
            // Error details are already logged within the registerParticipant function
            // console.error(error.message); // Optionally log the final error message again
            process.exit(1); // Exit with an error code
        }
    })();
    ```

4.  **Run the script:**
    ```bash
    node register.js
    ```

**Explanation:**

1.  **`dotenv`:** Loads the variables from your `.env` file into `process.env`.
2.  **`axios`:** Used to make the HTTP POST request.
3.  **Configuration:** Reads the necessary keys and base URL from environment variables.
4.  **`registrantInfo`:** An object holding the data for the new registrant. `firstName`, `lastName`, and `email` are mandatory. You can add more fields as supported by the GoTo Webinar API V2 documentation. Using `Date.now()` in the email helps ensure uniqueness when testing repeatedly.
5.  **`registerParticipant` function:**
    -   Takes the keys, registrant data, and access token as arguments.
    -   Constructs the correct API endpoint URL using template literals.
    -   Uses `axios.post` to send the request.
    -   The third argument to `axios.post` is the configuration object, including:
        -   `headers`: Sets the required `Authorization` (with `Bearer` prefix), `Content-Type`, and `Accept` headers.
    -   Includes robust `try...catch` error handling:
        -   It checks if the error has a `response` property (meaning the API server responded with an error status like 400, 401, 403, 409). It logs the status and the response data, which often contains GoTo-specific error codes (`errorCode`) and descriptions. It specifically checks for the `AlreadyRegistered` error code.
        -   It checks if the error has a `request` property but no `response` (network error, timeout).
        -   It handles other setup errors.
    -   Returns the `response.data` on success.
6.  **Main Execution Block:**
    -   An immediately-invoked async function `(async () => { ... })()` is used to allow `await`.
    -   It performs basic checks to ensure environment variables are loaded.
    -   Calls `registerParticipant` with the configuration and registrant data.
    -   Logs the successful response (which includes the unique `registrantKey` and the `joinUrl` for the participant) or logs the error caught by the `try...catch`.

Remember to consult the [official GoTo Developer API documentation](https://developer.goto.com/GoToWebinarV2) for the most up-to-date list of available registrant fields, error codes, and API behavior.

## Get an organizer key

Okay, getting the `organizerKey` is a fundamental step. Unlike the `webinarKey` (which changes per webinar) or the `registrantKey` (which changes per registrant), the `organizerKey` is generally static for a specific GoToWebinar user account that can host webinars.

Here are the primary ways to find your `organizerKey`:

1.  **During the OAuth 2.0 Access Token Response (Most Common for API Integration):**

    -   This is the **most reliable and intended method** when building an application.
    -   When you successfully exchange an `authorization_code` (obtained after the user grants permission) for an `access_token` using the `/oauth/v2/token` endpoint, the JSON response from GoTo **includes the `organizer_key`** along with the `access_token`, `refresh_token`, `account_key`, `email`, etc.
    -   **Example Response Payload (structure might vary slightly):**
        ```json
        {
            "access_token": "RcVd3a...EXAMPLE...3j7hqU",
            "token_type": "Bearer",
            "expires_in": 3600, // Usually 1 hour
            "refresh_token": "l1QPj...EXAMPLE...mKso4",
            "organizer_key": "1234567890123456789", // <-- THIS IS WHAT YOU NEED
            "account_key": "987654321",
            "account_type": "corporate",
            "firstName": "Jane",
            "lastName": "Doe",
            "email": "jane.doe@example.com",
            "platform": "GLOBAL", // Or G2M, G2W etc.
            "version": "2"
        }
        ```
    -   **Action:** When your application handles the OAuth callback and exchanges the code for a token, **parse this JSON response and securely store the `organizer_key`** (along with the access/refresh tokens) associated with that user's session or profile in your application.

2.  **GoTo Developer Center (developer.goto.com):**
    -   Log in to the [GoTo Developer Center](https://developer.goto.com/).
    -   Navigate to the "My Apps" section where you registered your API client (Client ID and Client Secret).
    -   While the Developer Center primarily manages your _API clients_, sometimes associated account details, including potentially the `organizerKey` of the _account that owns the API client_, might be visible somewhere in the account settings or profile section within the developer portal itself. _However, this is less direct and might not always be explicitly shown._ The primary method is the OAuth token response.

**Important Considerations:**

-   **User Context:** The `organizerKey` you receive is specific to the GoToWebinar user account **who authorized your application** during the OAuth flow. If multiple organizers from the same company use your application, each will have their own `organizerKey` obtained when they individually authorize the app.
-   **Permissions:** The user authenticating via OAuth _must_ be a user with organizer privileges on a GoToWebinar account to have a relevant `organizerKey`.
-   **Not the Same as Account Key:** Don't confuse the `organizerKey` with the `accountKey`. The `accountKey` usually refers to the overall GoTo administrative account, while the `organizerKey` refers to the specific licensed user who can create and manage webinars. You nearly always need the `organizerKey` for webinar-specific API calls.
-   **It's Numerical:** The `organizerKey` is typically a long string of numbers.

**In summary:** The standard and most reliable way to get the `organizerKey` for API use is by capturing it from the JSON response when obtaining an access token via the OAuth 2.0 flow.

## How to get a Webinar key

Okay, getting the `webinarKey` (sometimes referred to as the Webinar ID) is essential for targeting API calls to a specific webinar. Unlike the `organizerKey` (which identifies the user), the `webinarKey` identifies the event itself.

Here are the primary ways to get a `webinarKey`:

1.  **Using the GoTo Webinar API (Most Common for Applications):**

    -   This is the standard method when building integrations. You'll typically list the organizer's webinars and then extract the `webinarKey` from the results.
    -   **Endpoint:** `GET /G2W/rest/v2/organizers/{organizerKey}/webinars`
    -   **Process:**
        1.  You need a valid `accessToken` and the `organizerKey` of the user whose webinars you want to list.
        2.  Make an authenticated `GET` request to the endpoint above, replacing [organizerKey] with the actual key.
        3.  **Headers:** Include `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE` and `Accept: application/json`.
        4.  **Response:** The API will return a JSON array. Each object in the array represents a scheduled webinar and contains details about it. Crucially, each webinar object will have a `webinarKey` field (a string containing a large number).
        5.  **Filtering (Optional but Recommended):** The `/webinars` endpoint returns _all_ upcoming webinars by default. You can use query parameters to filter:
            -   `fromTime`: ISO 8601 format (e.g., `2023-10-27T00:00:00Z`) - Start date/time for the search range.
            -   `toTime`: ISO 8601 format (e.g., `2023-11-30T23:59:59Z`) - End date/time for the search range.
            -   Using these parameters allows you to fetch past webinars or webinars within a specific timeframe.
    -   **Example Response Snippet:**
        ```json
        [
            {
                "webinarKey": "9876543210987654321", // <-- THIS IS WHAT YOU NEED
                "subject": "Product Demo Q4",
                "description": "A detailed demo of our new features.",
                "organizerKey": "1234567890123456789",
                "times": [
                    {
                        "startTime": "2023-11-15T18:00:00Z",
                        "endTime": "2023-11-15T19:00:00Z"
                    }
                ],
                "timeZone": "America/New_York"
                // ... other webinar details
            },
            {
                "webinarKey": "555444333222111000", // Another webinar
                "subject": "Advanced Training Session"
                // ... details
            }
        ]
        ```
    -   **Action:** Your application needs to parse this JSON response. You might identify the correct webinar by its `subject` (title), `startTime`, or other criteria, and then extract its corresponding `webinarKey` for subsequent API calls (like registering participants).

2.  **Manually from the GoToWebinar Website URL:**
    -   If you just need the key for a one-off test or manual check, this is often the quickest way.
    -   **Process:**
        1.  Log in to your GoToWebinar account on the web.
        2.  Navigate to "My Webinars" (or similar section listing your scheduled events).
        3.  Click on the title of the specific webinar you're interested in to open its details/management page.
        4.  Look at the URL in your browser's address bar. It will typically contain the `webinarKey`.
        5.  **Example URL Structure:** `https://global.gotowebinar.com/manageWebinar.tmpl?webinar=**1234567890123456789**` (The exact URL structure might change slightly, but look for a long number associated with `webinar=` or `/webinars/`).
    -   **Caveat:** Relying on URL structure is less robust for applications, as website UIs can change. The API method is preferred for integrations.

**In summary:**

-   For **applications and integrations**, use the `GET /organizers/[organizerKey]/webinars` API endpoint to list webinars and extract the `webinarKey` from the JSON response.
-   For **quick manual checks**, log in to the GoToWebinar website, view the specific webinar's details page, and find the `webinarKey` in the browser's URL.