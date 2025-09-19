export function assetUrl(path: string): string {
  const base = (import.meta as any).env?.BASE_URL || '/'
  const baseClean = String(base).replace(/\/$/, '')
  const p = String(path).replace(/^\//, '')
  return `${baseClean}/${p}`
}

