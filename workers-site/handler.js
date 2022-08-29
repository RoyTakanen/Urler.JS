import { Router } from 'itty-router'
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

import { getShortUrl, createShortUrl } from './handlers/shorturl'
import { getStats } from './handlers/statistics'

const router = Router()

export const handleEvent = async event => {
    const requestUrl = new URL(event.request.url)

    // Create admin panel later (and maybe users)
    if (requestUrl.pathname === '/stats') {
        return await getStats(event)
    } else if (requestUrl.pathname.length >= 2 && event.request.method === 'GET') {
        return await getShortUrl(event)
    } else if (event.request.method === 'POST') {
        return await createShortUrl(event)
    } else {
        return await getAssetFromKV(event)
    }
}