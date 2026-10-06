// Serves dist/ with the headers from netlify.toml, to check the Content-Security-Policy locally:
//   pnpm build && node scripts/serve-dist-with-headers.mjs  → http://localhost:4179
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const dist = join(root, 'dist')
const toml = readFileSync(join(root, 'netlify.toml'), 'utf8')
const block = toml.split('[[headers]]')[1] ?? ''
const headers = Object.fromEntries([...block.matchAll(/^\s+([A-Za-z-]+) = "(.*)"$/gm)].map((match) => [match[1], match[2]]))
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.csv': 'text/csv', '.png': 'image/png' }
const port = Number(process.env.PORT ?? 4179)

createServer((request, response) => {
  const path = normalize(decodeURIComponent(new URL(request.url, 'http://x').pathname)).replace(/^([/\\])+/, '')
  let file = join(dist, path)
  if (!file.startsWith(dist) || !existsSync(file) || statSync(file).isDirectory()) file = join(dist, 'index.html')
  response.writeHead(200, { ...headers, 'Content-Type': types[extname(file)] ?? 'application/octet-stream' })
  response.end(readFileSync(file))
}).listen(port, () => console.log(`dist with Netlify headers: http://localhost:${port}`))
