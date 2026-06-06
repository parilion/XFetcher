type PostCardProps = {
  categoryLabel?: string;
  clock?: string;
  dateLabel?: string;
  publishedAt?: string;
  source?: string;
  summary: string;
  title: string;
  url?: string;
  variant?: "selected" | "all";
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
  variant = "selected",
}: PostCardProps) {
  const titleContent = (
    <h2 className="timeline-title">
      {title}
    </h2>
  );

  return (
    <div className={variant === "selected" ? "timeline-item timeline-item-selected" : "timeline-item"}>
      <div className="timeline-time">
        {clock ?? "--:--"}
      </div>
      <div aria-hidden="true" className="timeline-rail">
        <span className="timeline-dot" />
      </div>
      <article className="timeline-card">
        <div className="timeline-card-head">
          <div className="timeline-head-left">
            {source ? <span className="timeline-source">{source}</span> : null}
          </div>
          <div className="timeline-head-right">
            {variant === "selected" ? (
              <span className="timeline-score" title="精选">
                精
              </span>
            ) : null}
          </div>
        </div>
        <div className="timeline-mobile-meta">
          {clock ? <span>{clock}</span> : null}
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
        <p className="timeline-summary">
          {summary}
        </p>
        <div className="timeline-tags">
          {categoryLabel ? (
            <span className="tag tag-static">
              {categoryLabel}
            </span>
          ) : null}
          {variant === "selected" ? (
            <span className="tag tag-selected">
              精选
            </span>
          ) : null}
        </div>
      </article>
    </div>
  );
}
