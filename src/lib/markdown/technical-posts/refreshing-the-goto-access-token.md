---
title: goto-apis-used-day-to-day
description: goto-apis-used-day-to-day
date_created: '2025-05-19T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - goto-webinar
---
## The `access token`


The refresh-access-token route in this app:

```
C:\Users\thumb\Documents\projects\svelte\goto-apis
```

refreshes the Access token and, if necessary, the Refresh token.


[[goto-create-oauth-client|This document]] explains how to get the initial `access token` value. `access tokens` expire in 60 minutes, so they ethereal--and as a general practice always refreshed before you need to call a GoTo application API. 

A valid access token is required to make a successful API call for GoTo products. Access tokens have a lifespan of 60 minutes. Getting a new access token requires a new login and new token request, or - more easily - a request that contains a refresh token. Refresh tokens are good for longer periods.

To use a refresh token, you send an API token request with a grant type of refresh_token with the refresh token value from the original token request. 

A sample request is shown below in cURL format.

```
curl --request POST 'https://authentication.logmeininc.com/oauth/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Basic [Base64]' \
-d 'grant_type=refresh_token&refresh_token=[Refresh Token]'
```

The Authorization header value is the same as the one you used to obtain the original token, namely the string of `clientID:clientSecret` base64 encoded. The refresh token is the value received in the results body when you received the original access token.
## Response example

IMPORTANT: The access token value is truncated. It is a much larger value.

```text
{
  "access_token": "eyJraWQiOiJvYXV0aHYyLmxt666...",
  "expires_in": 3600,
  "scope": "users.v1.lines.read calls.v2.initiate",
  "principal": "asnaevents@asna.com",
 }
```

As you can see in the above example, there is no _refresh_token_ field in the response body. But, if a new refresh token has been issued because the old one has expired, the response payload will look as below:

```text

{
  "access_token": "eyJraWQiOiJvYXV0aHYyLmxt666...",
  "token_type": "Bearer",
  "refresh_token": "eyJraWQiOiJvYXV0aHYyLmxt999...",
  "expires_in": 3600,
  "scope": "users.v1.lines.read calls.v2.initiate",
  "principal": "mahar.singh@company.com"
}
```

## Response data

The following is sample output.

| Parameter     | Description                                                              |
| ------------- | ------------------------------------------------------------------------ |
| access_token  | OAuth access token                                                       |
| refresh_token | OAuth refresh token (Only present when replacing previous refresh token) |
| principal     | Who the token represents                                                 |
| scope         | The allowed scope(s) for the issued token, separated by a whitespace     |
| expires_in    | The number of seconds until the access token expires                     |

This access token can now be used to authorize API requests by setting it in the Authorization header with the following format:

```text
Authorization: Bearer {access_token}
```

### Example of use

**Event 1:** Generate an access token. The body of the response contains a new valid access token and a refresh token.

**Event 2:** At any time when you need access (within the next 30 days), send a `grant type=refresh token` request using the original `refresh token` to get a new `access token`. There will not be a refresh token included in the payload until Event 3.

**Event 3:** At some point within the next 30 days, the response body will contain a new refresh token, good for the next 30 days. Discard the original refresh token and store this new refresh token. Events 2 and 3 can be repeated.