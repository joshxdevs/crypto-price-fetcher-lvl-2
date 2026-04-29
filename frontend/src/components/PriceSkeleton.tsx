interface Props {
  rows?: number
}

export default function PriceSkeleton({ rows = 3 }: Props) {
  return (
    <div className="space-y-10">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-fade-in opacity-0" style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}>
          <div className="h-px bg-[var(--color-border)] mb-8" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="skeleton h-2.5 w-8 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
            <div className="text-right space-y-2">
              <div className="skeleton h-7 w-32 rounded ml-auto" />
              <div className="skeleton h-2.5 w-16 rounded ml-auto" />
            </div>
          </div>
          <div className="flex gap-8 mt-6">
            <div className="space-y-2">
              <div className="skeleton h-2 w-16 rounded" />
              <div className="skeleton h-3.5 w-20 rounded" />
            </div>
            <div className="space-y-2">
              <div className="skeleton h-2 w-16 rounded" />
              <div className="skeleton h-3.5 w-20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
