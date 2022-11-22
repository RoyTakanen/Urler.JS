# tiny.tf

Url shortening service with focus on blazing fast speeds. Deployed as a CloudFlare worker.

## How it is so fast?

- Shortened id is saved after the respone to Workers KV (uses: `event.waitUntil()`)
- Id is retrieved from CF-Ray header.

Check out this cool (and pretty useless) diagram about the service functionality!
![](https://kroki.io/seqdiag/svg/eNqdkMFKw0AURff9iktXCk39AJNsaiqiUElbNyLyknlNgmmmvpkSpfTfncGorRWp7gbeuXcO1_CzqqjApgdEUYSRMNmqKUBouIUptVhuWGGe3njAYZno1rAAQRyj1fLk3vc1ZVwjQv92Mp3hrMv1H85doGMcj5XonI3Ru4nkxQrlFlcXWLiD_2gheonROEjpFSWTYtlrCoPgxyZhu5bGFb3TH6IeP_D8xn45xlBkKSPDO_T13eN0NkmT4WptTyo1gJupnks9wAZLtuQj2J7ud4Vh8NnV6_Yds83Lf8x6mbhVw0rFf9Mt2Ov-4nW4iDM6fr4O3r4BloO2GA==)
## Config

Example:

```toml
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
