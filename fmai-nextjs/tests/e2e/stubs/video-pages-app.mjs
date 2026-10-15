// Stand-in for app.future-marketing.ai/api/internal/video-pages/*, so the e2e never touches the real app.
// Answers `view` for any studio-lumen-<12 chars> slug, 204 for event and dropoff, and logs every call on GET /__log.
import http from 'node:http'

const PORT = 3999
const SECRET = 'test-secret'
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*-[a-z2-9]{12}$/
const log = []

const readBody = (req) =>
  new Promise((resolve) => {
    let s = ''
    req.on('data', (c) => (s += c))
    req.on('end', () => {
      try {
        resolve(JSON.parse(s || 'null'))
      } catch {
        resolve(null)
      }
    })
  })

http
  .createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', `http://localhost:${PORT}`)
    if (req.method === 'GET' && url.pathname === '/__log') {
      res.writeHead(200, { 'content-type': 'application/json' })
      return res.end(JSON.stringify(log))
    }
    const m = url.pathname.match(/^\/api\/internal\/video-pages\/(view|event|dropoff)$/)
    if (req.method !== 'POST' || !m) {
      res.writeHead(404)
      return res.end()
    }
    if (req.headers['x-video-pages-secret'] !== SECRET) {
      res.writeHead(401)
      return res.end()
    }
    const body = await readBody(req)
    const slug = typeof body?.slug === 'string' ? body.slug : null
    log.push({ t: Date.now(), path: m[1], slug, body })
    if (m[1] === 'view') {
      if (!slug || !slug.startsWith('studio-lumen-') || !SLUG_RE.test(slug)) {
        res.writeHead(404)
        return res.end()
      }
      res.writeHead(200, { 'content-type': 'application/json' })
      return res.end(
        JSON.stringify({
          page: { firstName: 'Eva', agencyName: 'Studio Lumen', email: 'eva@studio-lumen.example', bookingStart: null },
        }),
      )
    }
    res.writeHead(204)
    res.end()
  })
  .listen(PORT, () => console.log(`video-pages stub on ${PORT}`))
