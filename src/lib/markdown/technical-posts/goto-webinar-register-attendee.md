---
title: GoTo Webinar Register Attendee
description: GoTo Webinar Register Attendee
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - gotowebinar
---
[[GoTo Webinar refresh API access]]

These are rp@asna.com keys.

Organizer key

```
200000000000313229
```

Webinar key (get from GoTo Webinar dashboard)

```
5372803598377463127
```

```
https://api.getgo.com/G2W/rest/v2/organizers/{organizerKey}/webinars/{webinarKey}/registrants
```

```
https://api.getgo.com/G2W/rest/v2/organizers/200000000000313229/webinars/5372803598377463127/registrants
```

![[image-10.png]]

The Authorization/Bearer above is the renewed access code.

![[image-13.png]]

The data needs to be sent as Json!

![[image-11.png]]

![[image-12.png]]

```
{
  "registrantKey": 3426482200061586524,
  "joinUrl": "https://global.gotowebinar.com/join/5372803598377463127/729896629",
  "status": "APPROVED",
  "asset": true
}
```