import type { NewsArticle } from '../api'

interface Props {
  articles: NewsArticle[]
}

const timeAgo = (iso: string): string => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function NewsFeed({ articles }: Props) {
  return (
    <div className="space-y-0">
      {articles.map((article, i) => (
        <a
          key={article.id}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-fade-up opacity-0 block group py-5 transition-all duration-200"
          style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'forwards' }}
        >
          <div className="h-px bg-[var(--color-border)] mb-5 transition-colors duration-200 group-hover:bg-[var(--color-muted)]" />
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-[var(--color-primary)] leading-snug tracking-tight group-hover:text-[var(--color-white)] transition-colors duration-200 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed line-clamp-2">
                {article.body}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
                  {article.source}
                </span>
                <span className="text-[var(--color-border)]">·</span>
                <span className="text-[10px] text-[var(--color-muted)]">
                  {timeAgo(article.publishedAt)}
                </span>
                {article.categories && (
                  <>
                    <span className="text-[var(--color-border)]">·</span>
                    <span className="text-[10px] text-[var(--color-muted)] truncate max-w-[120px]">
                      {article.categories.split('|')[0]}
                    </span>
                  </>
                )}
              </div>
            </div>
            {/* Arrow */}
            <div className="shrink-0 text-[var(--color-border)] group-hover:text-[var(--color-muted)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
