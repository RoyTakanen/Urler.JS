export const getStats = async event => {
    const request = event.request
    const requestUrl = new URL(request.url)

    // Average time ideas and info:
    // - Benchmark here the shortening with 10 requests and save to cache
    // - Time seems to progress only when await is called

    // Handle cursor (problem with over 1000 shortened links)
    const links = await TINY_TF.list()
    const linkCount = links.keys.length

    const countries = links.keys
        .map(shorten => shorten.metadata?.country)

    // Cache data
    const body = JSON.stringify({
        "linkCount": linkCount,
        "countries": countries
    })
    const headers = { 'Content-type': 'application/json' }
    return new Response(body, { headers })
}