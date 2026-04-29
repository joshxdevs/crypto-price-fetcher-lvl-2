import type { HealthData } from '../api'

interface Props {
  health: HealthData | null
  loading: boolean
}

export default function StatusBar({ health, loading }: Props) {
  const isOk = health?.status === 'ok'

  return (
    <div className="animate-fade-in opacity-0 delay-1 flex items-center gap-2" style={{ animationFillMode: 'forwards' }}>
      {loading ? (
        <div className="skeleton h-2 w-20 rounded" />
      ) : (
        <>
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: isOk ? 'var(--color-green)' : 'var(--color-red)' }}
          />
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
            {isOk ? `API Online · v${health?.version}` : 'API Offline'}
          </span>
          {health && (
            <>
              <span className="text-[var(--color-border)]">·</span>
              <span className="text-[10px] text-[var(--color-muted)]">{health.uptime} uptime</span>
            </>
          )}
        </>
      )}
    </div>
  )
}
