interface Props {
  rows?: number
}

export default function NewsSkeleton({ rows = 6 }: Props) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="animate-fade-in opacity-0 py-5"
          style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'forwards' }}
        >
          <div className="h-px bg-[var(--color-border)] mb-5" />
          <div className="flex justify-between gap-6">
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="flex gap-3 mt-3">
                <div className="skeleton h-2 w-16 rounded" />
                <div className="skeleton h-2 w-10 rounded" />
              </div>
            </div>
            <div className="skeleton h-3 w-3 rounded shrink-0 mt-1" />
          </div>
        </div>
      ))}
    </div>
  )
}
