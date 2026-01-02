---
title: How to refresh the GoTo API authorization code
description: How to refresh the GoTo API authorization code
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-06T00:00:00.000Z'
date_published: null
pinned: true
tags:
  - asna-com
  - goto-webinar
---
## How to refresh the GoTo API authorization code

You need five values to get a GoTo access key:

1. Client ID
2. Secret
3. The base 64 value of [client id]:[secret]
4. The redirect URI
5. The API authorization code

## Step 1. Create an OAuth client

https://developer.logmeininc.com/clients

This provides the Client ID and the secret. Use the site provided to calculate #3, the base 64 value.

Check these two checkboxes to create a client for GotoWebinar
![[image-41.png|412x293]]

The URI is https://asna.com

> These instructions come from this link: https://developer.goto.com/guides/Authentication/03_HOW_accessToken

After creating the client, save in the Client ID and Secrets below.

<mark style="background: #ADCCFFA6;">1. Client ID</mark>

```
338a0da6-9332-41ac-baf0-8b826eb5f3b4
```

<mark style="background: #ADCCFFA6;">2. Secret </mark>

```
kYIVNFVVIoeiFbdTP2VQvhUp
```

<mark style="background: #ADCCFFA6;">3. URL</mark>

```
https://asna.com
```
## 2. Obtain the one-time authorization code

Provide
- Client ID
- Secret
on this form at `http://localhost:5173/first-time-token`:

> [!info]
> Leave the Base64 and Authorization code values empty. The Base64 is calculated for you (as you paste the two values in) and you get the Authorization code with step.

![[image-45.png|678x463]]


> [!info]
> The "auth code request URL is on the clipboard--now use Bruno" is misleading. Keep reading.

Click the `Create GotoUrl to get auth code` button. It creates a URL and puts it on the clipboard.  Paste that URL in your browser and press enter. That takes you to ASNA and shows a 'code' search parameter.

![[image-46.png|746x246]]

Carefully copy that `code` value into the authorization code.  All four values of the form are now filled in. You can also paste into the value below just for safe keeping.

Authorization code:

```
eyJraWQiOiI2MjAiLCJhbGciOiJSUzUxMiJ9.eyJzYyI6ImNvbGxhYjogaWRlbnRpdHk6c2NpbS5tZSIsInN1YiI6IjIwMDAwMDAwMDAwMDMxMzIyOSIsImF1ZCI6ImVlNDJkZWVhLWM4YjQtNDZhOC1iNTIzLTE3ZDI1NDNiZjQ2ZCIsIm9nbiI6InB3ZCIsImxzIjoiZDNjMjU5YWYtNjMxYi00Nzc3LWE0MWQtMDg5OWI0MjFjYjkzIiwidHlwIjoiYyIsImxldmVsT2ZBc3N1cmFuY2UiOjIsImV4cCI6MTc2MDAzNjkxMSwiaWF0IjoxNzYwMDM2MzExLCJ1cmkiOiJodHRwczovL2FzbmEuY29tIiwianRpIjoiYzlhOWE1N2EtNjYwZC00YTExLTk4ODktZTEyZTM5NjIzMjFjIn0.UTy0qK4DghqfRdnycSYM9sqZODHCk_kKOhwjH2sGcdYbwsdvFjEuzuenC8ABv9mbfBF7m0vLWZpjXeH2Cy8Xpwe6xrGzJljDiupPeYsDIZpwkVEignbvpN2nEOKQvPMPzhJwf3BioFK3Dz9nfwCmZbQx1K13KYlZfe2yexQWb1_sjVW-P0dzyLdlQWwDleoVUCkoiUjALuS3oUgonbkUmDdZomywzhD-pLkEufwKF-3_iT2UXCemhSBelLm-SJDk3LFku7iWh4FtnF_RoaSPpW2t5eK7n_NZSzYHh40mDWi8LwGVQtFDTeqd95cWI-SWGgMTCA1nxMpNgbWXWD7CCQ
```

With the four values shown, now open Bruno and use this request:

![[image-50.png|700]]

replacing the `authorizationCode` and `base64` with the corresponding values from this screen:

![[image-45.png|678x463]]

Run the Bruno request. It provides a new `access token` and a new `refresh token`.

Refresh the .env file with new:

- `client id`
- `Goto secret`
- `access token`
- `refresh token`
values


Then open this form. it fetches the new values from the `.env` file.  Click the `Refresh tokens` button to be sure things are working. 


![[image-52.png|700]]

Refresh the .env file with these values
- `client id`
- `Goto secret`
- `access token`
- `refresh token`

Also replace these four `.env` values at Vercel and then redeploy the app.