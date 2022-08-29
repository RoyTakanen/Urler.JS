// Find fast and accurate way to detect url
const isValidURL = url => { return url.startsWith('http') }

export const getShortUrl = async event => {
    const request = event.request
    const requestUrl = new URL(request.url)

    const id = requestUrl.pathname.replace('/', '')
    const realUrl = await TINY_TF.get(id)

    if (realUrl)
        return Response.redirect(realUrl, 301)

    return Response.redirect(requestUrl.protocol + '//' + requestUrl.hostname, 307)
}

export const createShortUrl = async event => {
    const requestStartTime = Date.now()
    const request = event.request
    const requestUrl = new URL(request.url)

    const content = await request.json()
    const realUrl = content.url
    const headers = { 'Content-type': 'application/json' }

    if (realUrl.length > 2000)
        return new Response(JSON.stringify({ "error": "url too large (exceeds 2000 char limit)" }), { headers, status: 413 })

    // Might work https://github.com/validatorjs/validator.js
    if (!isValidURL(realUrl))
        return new Response(JSON.stringify({ "error": "not a valid url" }), { headers, status: 400 })

    // Find more unique way (this method might lead to collisions) and pregenerate id:s
    const id = request.headers.get('CF-ray').substring(6, 12)
    const metadata = {
        "created": +new Date(),
        "ip": request.headers.get("CF-Connecting-IP"),
        "gentime": Date.now() - requestStartTime, // This 0 because time flows only in async functions
        "country": request.headers.get("CF-IPCountry")
    }

    const body = JSON.stringify({
        "id": id,
        "domain": requestUrl.hostname
    })

    if (!content.test)
        event.waitUntil(
            TINY_TF.put(id, realUrl, { metadata })
        )

    return new Response(body, { headers })
}