#!/usr/bin/env node
/**
 * Smart `next dev` launcher — always gives a working dev server,
 * NEVER kills an active dev server that's serving on another port.
 *
 * Behavior:
 *   - No lock file or stale (PID dead) → start on port 3000, clear stale lock
 *   - Lock exists AND PID alive → existing instance is real. Pick the next
 *     free port (lock.port + 1, 3001, 3002, ...), remove lock so Next 16's
 *     single-instance check passes, start new instance on that port.
 *
 * The old dev server keeps running on its port. The new one writes its own
 * lock. Bij volgende `npm run dev` is de wrapper alleen "lock-aware" voor
 * de meest recente instance — oude blijft draaien onaangetast.
 *
 * Wired via `package.json` scripts.dev. Plain `next dev` still available as
 * `npm run dev:plain`.
 */
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { readFileSync, existsSync, unlinkSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const lockPath = join(projectRoot, '.next', 'dev', 'lock')
const defaultPort = Number(process.env.PORT) || 3000

function isProcessAlive(pid) {
  if (!pid) return false
  try {
    process.kill(pid, 0)
    return true
  } catch (err) {
    return err.code === 'EPERM'
  }
}

async function isPortFree(port) {
  // Check both IPv4 and IPv6 separately — on Windows IPV6_V6ONLY defaults to
  // true, so a ::3000 listener doesn't block 0.0.0.0:3000 binding and vice
  // versa. Next.js listens on both stacks, so either one blocking means busy.
  function tryListen(host) {
    return new Promise((resolveFn) => {
      const tester = createServer()
        .once('error', () => resolveFn(false))
        .once('listening', () => {
          tester.close(() => resolveFn(true))
        })
        .listen(port, host)
    })
  }
  const ok4 = await tryListen('0.0.0.0')
  if (!ok4) return false
  const ok6 = await tryListen('::')
  return ok6
}

async function findFreePort(start, max = 50) {
  for (let p = start; p < start + max; p++) {
    if (await isPortFree(p)) return p
  }
  throw new Error(`No free port in ${start}..${start + max}`)
}

let targetPort = defaultPort

if (existsSync(lockPath)) {
  let lock = null
  try {
    lock = JSON.parse(readFileSync(lockPath, 'utf8'))
  } catch {
    console.log('[dev] could not parse lock file, treating as stale')
  }

  if (lock && isProcessAlive(lock.pid)) {
    const next = await findFreePort(Math.max(lock.port + 1, defaultPort + 1))
    console.log(
      `[dev] existing dev server alive on port ${lock.port} (PID ${lock.pid}), starting new on port ${next}`,
    )
    targetPort = next
  } else if (lock) {
    console.log(`[dev] stale lock (PID ${lock.pid} dead), clearing`)
  }

  try {
    unlinkSync(lockPath)
  } catch {
    // ignore — lock may have been removed by the dying process
  }
}

// If the chosen port is taken by something non-Next (no lock), find the next free one.
if (!(await isPortFree(targetPort))) {
  const fallback = await findFreePort(targetPort + 1)
  console.log(`[dev] port ${targetPort} held by non-Next process, using ${fallback}`)
  targetPort = fallback
}

// Parallel dev servers must NOT share `.next/dev/` — turbopack's persistence
// store panics on concurrent writes. Default port stays on `.next/` (so npm
// run build, lighthouse, etc. find a familiar dir); non-default ports get
// `.next-{port}/`. Picked up by next.config.ts via NEXT_DIST_DIR.
const env = { ...process.env, PORT: String(targetPort) }
if (targetPort !== defaultPort) {
  env.NEXT_DIST_DIR = `.next-${targetPort}`
  console.log(`[dev] using isolated dist-dir ${env.NEXT_DIST_DIR}`)
}

const child = spawn(
  'npx',
  ['next', 'dev', '--port', String(targetPort)],
  {
    stdio: 'inherit',
    cwd: projectRoot,
    env,
    shell: true,
  },
)

child.on('exit', (code) => {
  process.exit(code ?? 0)
})

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => child.kill(sig))
}
