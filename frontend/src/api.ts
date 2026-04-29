// ─── API Types ────────────────────────────────────────────────────────────────

export interface PriceData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  last_updated: string
}

export interface NewsArticle {
  id: string
  title: string
  body: string
  url: string
  source: string
  publishedAt: string
  imageUrl: string
  categories: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  count?: number
}

export interface HealthData {
  status: string
  service: string
  version: string
  environment: string
  timestamp: string
  uptime: string
}

// ─── Fetch Helpers ────────────────────────────────────────────────────────────

const BASE = '/api/v1'

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`)
  }
  const json: ApiResponse<T> = await res.json()
  return json.data
}

export const api = {
  price: (coin: 'btc' | 'eth' | 'sol') => apiFetch<PriceData>(`/price/${coin}`),
  news: () => apiFetch<NewsArticle[]>('/news'),
  health: () => apiFetch<HealthData>('/health'),
}
