const API_URL = import.meta.env.VITE_API_URL || ''

export function trackEvent(estabelecimento_id, evento, extra = {}) {
  if (!estabelecimento_id || !evento) return
  fetch(`${API_URL}/api/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estabelecimento_id, evento, ...extra }),
  }).catch(() => {}) // fire and forget
}
