import type { PriceData } from '../api'

interface Props {
  coin: PriceData
  delay?: number
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

const formatLarge = (n: number) => {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toLocaleString()}`
}

export default function PriceCard({ coin, delay = 0 }: Props) {
  const isPositive = coin.price_change_percentage_24h >= 0
  const changeSign = isPositive ? '+' : ''
  const changeColor = isPositive ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]'

  return (
    <div
      className="animate-fade-up opacity-0 group cursor-default"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Subtle top separator line */}
      <div className="h-px bg-[var(--color-border)] mb-8 transition-colors duration-300 group-hover:bg-[var(--color-muted)]" />

      <div className="flex items-start justify-between">
        {/* Left: name + symbol */}
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[var(--color-muted)]">
              {coin.symbol}
            </span>
            <span className="live-dot" />
          </div>
          <h2 className="text-sm font-medium text-[var(--color-secondary)] tracking-tight">
            {coin.name}
          </h2>
        </div>

        {/* Right: price + change */}
        <div className="text-right">
          <div className="animate-count text-2xl font-semibold tracking-tight text-[var(--color-white)] tabular-nums">
            {formatPrice(coin.current_price)}
          </div>
          <div className={`text-xs font-medium mt-1 tabular-nums ${changeColor}`}>
            {changeSign}{coin.price_change_percentage_24h.toFixed(2)}%
            <span className="text-[var(--color-muted)] ml-1 font-normal">24h</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-8 mt-6">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-1">Market Cap</div>
          <div className="text-sm font-medium text-[var(--color-secondary)] tabular-nums">{formatLarge(coin.market_cap)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-1">Volume 24h</div>
          <div className="text-sm font-medium text-[var(--color-secondary)] tabular-nums">{formatLarge(coin.total_volume)}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-1">Updated</div>
          <div className="text-[11px] text-[var(--color-muted)]">
            {new Date(coin.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  )
}
