import { onMounted, ref } from 'vue'

export type Reachability = 'checking' | 'online' | 'offline'

const CACHE_KEY = 'repo-pushed-at'

function repoPath(url: string) {
  return new URL(url).pathname.replace(/^\/|\/$/g, '')
}

function readCache(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function saveToCache(repo: string, pushedAt: string) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...readCache(), [repo]: pushedAt }))
  } catch {}
}

async function fetchPushedAt(repo: string): Promise<string | null> {
  const cached = readCache()[repo]
  if (cached) return cached
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!response.ok) return null
    const data: { pushed_at?: string } = await response.json()
    if (!data.pushed_at) return null
    saveToCache(repo, data.pushed_at)
    return data.pushed_at
  } catch {
    return null
  }
}

async function isReachable(url: string) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: controller.signal })
    return true
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

export function useProjectStatus(repo: string, demo?: string) {
  const pushedAt = ref<Date | null>(null)
  const reachability = ref<Reachability>('checking')

  onMounted(async () => {
    const [pushed, reachable] = await Promise.all([
      fetchPushedAt(repoPath(repo)),
      demo ? isReachable(demo) : Promise.resolve(false),
    ])
    pushedAt.value = pushed ? new Date(pushed) : null
    reachability.value = reachable ? 'online' : 'offline'
  })

  return { pushedAt, reachability }
}
