type PostCardProps = {
  categoryLabel?: string;
  clock?: string;
  dateLabel?: string;
  publishedAt?: string;
  source?: string;
  summary: string;
  title: string;
  url?: string;
};

export function PostCard({
  categoryLabel,
  clock,
  dateLabel,
  publishedAt,
  source,
  summary,
  title,
  url,
}: PostCardProps) {
  const titleContent = (
    <h2 className="text-[17px] font-semibold leading-snug text-[var(--text)]">
      {title}
    </h2>
  );

  return (
    <div className="grid min-w-0 grid-cols-1 sm:grid-cols-[44px_18px_minmax(0,1fr)] sm:gap-3">
      <div className="hidden pt-5 text-right font-mono text-xs text-[var(--muted)] sm:block">
        {clock ?? "--:--"}
      </div>
      <div className="relative hidden justify-center sm:flex">
        <span className="absolute bottom-0 top-0 w-px bg-[var(--timeline)]" />
        <span className="relative mt-6 size-2.5 rounded-full border-2 border-[var(--surface)] bg-[var(--accent)] shadow-[0_0_0_3px_var(--accent-soft)]" />
      </div>
      <article className="mb-3 min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
          {clock ? <span className="font-mono sm:hidden">{clock}</span> : null}
          {source ? <span className="font-medium">{source}</span> : null}
          {publishedAt ? <span>{publishedAt}</span> : null}
          {dateLabel ? <span>{dateLabel}</span> : null}
        </div>
        {url ? (
          <a
            className="break-words outline-none transition-colors hover:text-[var(--accent-strong)] focus-visible:text-[var(--accent-strong)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            href={url}
            rel="noreferrer"
            target="_blank"
          >
            {titleContent}
          </a>
        ) : (
          titleContent
        )}
        <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-[var(--text-secondary)]">
          {summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categoryLabel ? (
            <span className="rounded-full border border-[var(--tag-border)] bg-[var(--tag-bg)] px-2.5 py-1 text-xs font-medium text-[var(--tag-text)]">
              {categoryLabel}
            </span>
          ) : null}
          <span className="rounded-full border border-[var(--selected-border)] bg-[var(--selected-bg)] px-2.5 py-1 text-xs font-medium text-[var(--selected-text)]">
            精选
          </span>
        </div>
      </article>
    </div>
  );
}
