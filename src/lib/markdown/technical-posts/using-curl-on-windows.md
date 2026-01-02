---
title: Using Curl on Windows
description: Using Curl on Windows
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - windows
  - utilities
---
```
curl -v --location 'https://api.getgo.com/G2W/rest/v2/organizers/200000000000313229/webinars/5372803598377463127/registrants?resendConfirmation=true' --header 'Content-Type: application/json' --header 'Authorization: Bearer eyJraWQiOiI2MjAiLCJhbGciOiJSUzUxMiJ9.eyJzYyI6ImNvbGxhYjoiLCJzdWIiOiI1MTIxNjQ4NjcwODUzOTI1ODkzIiwiYXVkIjoiZDc5YWNkYmEtYjVhZS00MDIwLWFlMDMtYTNmMDViMDZlZDNhIiwib2duIjoicGsiLCJ0eXAiOiJhIiwiZXhwIjoxNzQ2NjU5MTE4LCJpYXQiOjE3NDY2NTU1MTgsImp0aSI6IjY5ZjliODMwLTQ4YWYtNDUyYy04ZTA1LWE0OTRiNDIxNWY5OSJ9.J_pooXiQAuvTUzYQKWBsc4XbDd_IxwAzLSmQtDYcY4DvwT37xa2slyz-E0J8LKkwrout0e7EftE0v7SMl_bnyz1OXJRadbh5ijSx1dhTWLqlTaR2G4NkgzbRZVhmT48WPnXAXOgL-Vooxxv5JjDI3LaFY_melGBOexy2F6qizTPfEi_uON3SUlgT8LML0CjKrT21FQJMcQEKp6PQTlMaBsbjE7xXYeYrnSI59Qx_Vn4yUJi5w0AZIzVhoNWHt8AYUU6MOmb5fLW36low2PqN3XsZvEaARo7Q27wxjhq5LPdJcmmeeQTO3cmnlA6LirbT-4Rs1qXj7Xjzodl7oWtr4w' --data-raw '{    "firstName": "Test User",    "lastName": "API case",    "email": "roger.pence@gmail.com",    "country": "United States",    "organization": "GoTo"}'
```

The verbose (-v) flag generates detailed info on the request.

```
* Host api.getgo.com:443 was resolved.
* IPv6: (none)
* IPv4: 54.188.255.113, 44.235.156.16, 34.213.175.160
*   Trying 54.188.255.113:443...
* schannel: disabled automatic use of client certificate
* ALPN: curl offers http/1.1
* ALPN: server accepted http/1.1
* Connected to api.getgo.com (54.188.255.113) port 443
* using HTTP/1.x
> POST /G2W/rest/v2/organizers/200000000000313229/webinars/5372803598377463127/registrants?resendConfirmation=true HTTP/1.1
> Host: api.getgo.com
> User-Agent: curl/8.11.1
> Accept: */*
> Content-Type: application/json
> Authorization: Bearer eyJraWQiOiI2MjAiLCJhbGciOiJSUzUxMiJ9.eyJzYyI6ImNvbGxhYjoiLCJzdWIiOiI1MTIxNjQ4NjcwODUzOTI1ODkzIiwiYXVkIjoiZDc5YWNkYmEtYjVhZS00MDIwLWFlMDMtYTNmMDViMDZlZDNhIiwib2duIjoicGsiLCJ0eXAiOiJhIiwiZXhwIjoxNzQ2NjU5MTE4LCJpYXQiOjE3NDY2NTU1MTgsImp0aSI6IjY5ZjliODMwLTQ4YWYtNDUyYy04ZTA1LWE0OTRiNDIxNWY5OSJ9.J_pooXiQAuvTUzYQKWBsc4XbDd_IxwAzLSmQtDYcY4DvwT37xa2slyz-E0J8LKkwrout0e7EftE0v7SMl_bnyz1OXJRadbh5ijSx1dhTWLqlTaR2G4NkgzbRZVhmT48WPnXAXOgL-Vooxxv5JjDI3LaFY_melGBOexy2F6qizTPfEi_uON3SUlgT8LML0CjKrT21FQJMcQEKp6PQTlMaBsbjE7xXYeYrnSI59Qx_Vn4yUJi5w0AZIzVhoNWHt8AYUU6MOmb5fLW36low2PqN3XsZvEaARo7Q27wxjhq5LPdJcmmeeQTO3cmnlA6LirbT-4Rs1qXj7Xjzodl7oWtr4w
> Content-Length: 152
>
* upload completely sent off: 152 bytes
< HTTP/1.1 201 Created
< Server: nginx
< Date: Wed, 07 May 2025 22:18:49 GMT
< Content-Type: application/hal+json;charset=UTF-8
< Content-Length: 148
< Connection: keep-alive
< x-amzn-Remapped-date: Wed, 07 May 2025 22:18:49 GMT
< x-amzn-RequestId: 9acf8eea-8a4e-47fc-8836-7c96f5df061f
< x-envoy-upstream-service-time: 327
< x-amzn-Remapped-connection: keep-alive
< x-amz-apigw-id: KN9bgGZePHcF50A=
< X-Amzn-Trace-Id: Root=1-681bdc49-5747c42d10e730bb6fdf8249;Parent=51d05aeef9da6be2;Sampled=0;Lineage=1:738723aa:0
< X-Cache: Miss from cloudfront
< Via: 1.1 49b94a8674d6e86a841d6523f7dbaf14.cloudfront.net (CloudFront)
< X-Amz-Cf-Pop: HIO50-C1
< X-Amz-Cf-Id: DgwJojhaSoqjwOYyf7FuMKR9MNKEF1vRv5fNyu2Rl6yr8mowz3gsmQ==
< Strict-Transport-Security: max-age=15768000
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Headers: origin, x-requested-with, authorization, accept, content-type
< Access-Control-Max-Age: 3628800
< Access-Control-Allow-Methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT
<
{"registrantKey":3689531560913815895,"joinUrl":"https://global.gotowebinar.com/join/5372803598377463127/180717636","status":"APPROVED","asset":true}* Connection #0 to host api.getgo.com left intact
```