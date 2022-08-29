# tiny.tf

Url shortening service with focus on blazing fast speeds. Deployed as a CloudFlare worker.

## How it is so fast?

- Shortened id is saved after the respone to Workers KV (uses: `event.waitUntil()`)
- Id is retrieved from [uuid.rocks](https://uuid.rocks) (switching soon to pregenerated id)

## Config

Example:

```json
account_id = "<YOUR_ACCOUNT_ID>"
name = "tinytf"
type = "webpack"
workers_dev = true
site = { bucket = "./public" }
compatibility_date = "2022-02-06"
kv_namespaces = [ 
	{ binding = "TINY_TF", id = "YOUR_URL_DEV_SHORTENING_KV_NAMESPACE", preview_id = "YOUR_URL_DEV_SHORTENING_KV_NAMESPACE_PREVIEW" }
]

[env.production]
zone_id = "<YOUR_URL_SHORTENING_DOMAIN_ZONE>"
kv_namespaces = [ 
	{ binding = "TINY_TF", id = "<YOUR_URL_PRODUCTION_SHORTENING_KV_NAMESPACE>", preview_id = "<YOUR_URL_PRODUCTION_SHORTENING_KV_NAMESPACE_PREVIEW>" }
]

route = "*<YOUR_SHORTENING_DOMAIN>/*"
```

## Develop on a local machine

```bash
wrangler dev
```

## Deploy to production

```bash
wrangler publish --env production
```