import { useState, useEffect } from 'react'
import { api } from './api'
import type { PriceData, NewsArticle, HealthData } from './api'
import PriceCard from './components/PriceCard'
import PriceSkeleton from './components/PriceSkeleton'
import NewsFeed from './components/NewsFeed'
import NewsSkeleton from './components/NewsSkeleton'
import StatusBar from './components/StatusBar'

type Tab = 'prices' | 'news'

export default function App() {
  const [tab, setTab] = useState<Tab>('prices')

  // ── Prices ──────────────────────────────────────────────────────────────────
  const [prices, setPrices] = useState<PriceData[]>([])
  const [pricesLoading, setPricesLoading] = useState(true)
  const [pricesError, setPricesError] = useState<string | null>(null)

  // ── News ────────────────────────────────────────────────────────────────────
  const [news, setNews] = useState<NewsArticle[]>([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsError, setNewsError] = useState<string | null>(null)

  // ── Health ──────────────────────────────────────────────────────────────────
  const [health, setHealth] = useState<HealthData | null>(null)
  const [healthLoading, setHealthLoading] = useState(true)

  // ── Fetch prices ─────────────────────────────────────────────────────────────
  const fetchPrices = async () => {
    setPricesLoading(true)
    setPricesError(null)
    try {
      const [btc, eth, sol] = await Promise.all([
        api.price('btc'),
        api.price('eth'),
        api.price('sol'),
      ])
      setPrices([btc, eth, sol])
    } catch (e) {
      setPricesError(e instanceof Error ? e.message : 'Failed to load prices')
    } finally {
      setPricesLoading(false)
    }
  }

  // ── Fetch news ───────────────────────────────────────────────────────────────
  const fetchNews = async () => {
    setNewsLoading(true)
    setNewsError(null)
    try {
      const data = await api.news()
      setNews(data)
    } catch (e) {
      setNewsError(e instanceof Error ? e.message : 'Failed to load news')
    } finally {
      setNewsLoading(false)
    }
  }

  // ── Fetch health ─────────────────────────────────────────────────────────────
  const fetchHealth = async () => {
    try {
      const data = await api.health()
      setHealth(data)
    } catch {
      setHealth(null)
    } finally {
      setHealthLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    fetchNews()
    fetchHealth()

    // Auto-refresh prices every 60s
    const interval = setInterval(() => {
      fetchPrices()
      fetchHealth()
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <header className="border-b border-[var(--color-border)]">
        <div className="w-full px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
          <div className="animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
            <h1 className="text-sm font-semibold tracking-tight text-[var(--color-white)]">
              CryptoLens
            </h1>
            <p className="text-[10px] text-[var(--color-muted)] mt-0.5 tracking-wide">
              Real-time crypto prices &amp; news
            </p>
          </div>
          <StatusBar health={health} loading={healthLoading} />
        </div>
      </header>

      {/* ── Tab Bar ──────────────────────────────────────────────────────────── */}
      <div className="border-b border-[var(--color-border)]">
        <div className="w-full px-6 md:px-12 lg:px-20 flex gap-6">
          {(['prices', 'news'] as Tab[]).map((t) => (
            <button
              key={t}
              id={`tab-${t}`}
              onClick={() => setTab(t)}
              className={`
                relative py-4 text-xs uppercase tracking-widest font-medium transition-colors duration-200
                ${tab === t
                  ? 'text-[var(--color-white)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-secondary)]'
                }
              `}
            >
              {t}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-white)]" />
              )}
            </button>
          ))}
          <button
            id="btn-refresh"
            onClick={tab === 'prices' ? fetchPrices : fetchNews}
            className="ml-auto py-4 text-[10px] uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-secondary)] transition-colors duration-200 flex items-center gap-1.5"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-60">
              <path d="M1 5a4 4 0 1 0 1.2-2.8L1 5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M1 2v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className="w-full px-6 md:px-12 lg:px-20 py-12">

        {/* Prices Tab */}
        {tab === 'prices' && (
          <section id="section-prices">
            <div className="animate-fade-in opacity-0 mb-10" style={{ animationFillMode: 'forwards' }}>
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--color-white)] mt-1">
                Market Prices
              </h2>
            </div>

            {pricesLoading && <PriceSkeleton rows={3} />}

            {pricesError && !pricesLoading && (
              <div className="animate-fade-up opacity-0 text-center py-20" style={{ animationFillMode: 'forwards' }}>
                <p className="text-xs text-[var(--color-muted)] mb-4">{pricesError}</p>
                <button
                  onClick={fetchPrices}
                  className="text-[10px] uppercase tracking-widest text-[var(--color-secondary)] hover:text-[var(--color-white)] transition-colors"
                >
                  Try again
                </button>
              </div>
            )}

            {!pricesLoading && !pricesError && (
              <div className="space-y-10">
                {prices.map((coin, i) => (
                  <PriceCard key={coin.id} coin={coin} delay={i * 80} />
                ))}
              </div>
            )}

            {/* Last refreshed */}
            {!pricesLoading && !pricesError && (
              <p className="animate-fade-in opacity-0 text-[10px] text-[var(--color-muted)] mt-14 delay-5" style={{ animationFillMode: 'forwards' }}>
                Auto-refreshes every 60 seconds · Powered by CoinGecko
              </p>
            )}
          </section>
        )}

        {/* News Tab */}
        {tab === 'news' && (
          <section id="section-news">
            <div className="animate-fade-in opacity-0 mb-10" style={{ animationFillMode: 'forwards' }}>
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Latest</p>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--color-white)] mt-1">
                Crypto News
              </h2>
            </div>

            {newsLoading && <NewsSkeleton rows={6} />}

            {newsError && !newsLoading && (
              <div className="animate-fade-up opacity-0 text-center py-20" style={{ animationFillMode: 'forwards' }}>
                <p className="text-xs text-[var(--color-muted)] mb-4">{newsError}</p>
                <button
                  onClick={fetchNews}
                  className="text-[10px] uppercase tracking-widest text-[var(--color-secondary)] hover:text-[var(--color-white)] transition-colors"
                >
                  Try again
                </button>
              </div>
            )}

            {!newsLoading && !newsError && <NewsFeed articles={news} />}

            {!newsLoading && !newsError && (
              <p className="animate-fade-in opacity-0 text-[10px] text-[var(--color-muted)] mt-8 delay-5" style={{ animationFillMode: 'forwards' }}>
                Powered by CryptoCompare
              </p>
            )}
          </section>
        )}
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--color-border)] mt-20">
        <div className="w-full px-6 md:px-12 lg:px-20 py-8 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
            CryptoLens · v1.0.0
          </span>
          <span className="text-[10px] text-[var(--color-muted)]">
            {health?.environment ?? 'development'}
          </span>
        </div>
      </footer>
    </div>
  )
}
