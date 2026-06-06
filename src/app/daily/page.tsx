import { AppShell } from "@/components/app-shell";
import {
  fetchAihotDaily,
  fetchAihotDailyArchive,
  type AihotDailySection,
} from "@/lib/aihot";

const SECTION_EN_LABELS: Record<string, string> = {
  "模型发布/更新": "MODEL RELEASES",
  "产品发布/更新": "PRODUCT",
  行业动态: "INDUSTRY",
  论文研究: "RESEARCH",
  技巧与观点: "INSIGHTS",
};

function formatDailyDate(date: string) {
  const parsed = new Date(`${date}T00:00:00+08:00`);

  return new Intl.DateTimeFormat("zh-CN", {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  }).format(parsed);
}

function getSectionEnglishLabel(section: AihotDailySection) {
  return SECTION_EN_LABELS[section.label] ?? "AI HOT";
}

export default async function DailyPage() {
  const [daily, archive] = await Promise.all([
    fetchAihotDaily(),
    fetchAihotDailyArchive(8),
  ]);
  const storyCount = daily.sections.reduce(
    (total, section) => total + section.items.length,
    0,
  );

  return (
    <AppShell activePath="/daily">
      <main className="min-h-screen bg-[var(--daily-bg)]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden border-r border-[var(--border)] px-6 py-8 lg:block">
            <div className="rounded-md border border-[var(--accent)] bg-[var(--surface)] px-5 py-4">
              <div className="text-sm font-bold text-[var(--accent-strong)]">
                最新一期
              </div>
              <div className="mt-3 font-mono text-xs text-[var(--accent-strong)]">
                {daily.date}
              </div>
            </div>

            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between text-sm font-semibold text-[var(--text)]">
                <span>{daily.date.slice(0, 4)} 年 {Number(daily.date.slice(5, 7))} 月</span>
                <span className="font-mono text-xs text-[var(--muted)]">
                  {archive.count}
                </span>
              </div>
              <div className="grid gap-1">
                {archive.items.map((item) => {
                  const isCurrent = item.date === daily.date;

                  return (
                    <div
                      className={
                        isCurrent
                          ? "grid grid-cols-[34px_minmax(0,1fr)] gap-3 rounded bg-[var(--selected-bg)] px-3 py-2 text-[var(--accent-strong)]"
                          : "grid grid-cols-[34px_minmax(0,1fr)] gap-3 rounded px-3 py-2 text-[var(--muted)]"
                      }
                      key={item.date}
                    >
                      <span className="font-mono text-xs">
                        {Number(item.date.slice(8, 10))} 日
                      </span>
                      <span className="truncate text-xs leading-5">
                        {item.leadTitle}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </aside>

          <article className="min-w-0 px-5 py-10 sm:px-10 lg:px-16">
            <header className="mx-auto max-w-4xl pt-4 sm:pt-10">
              <div className="flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--daily-meta)]">
                <span className="h-px w-9 bg-[var(--accent)]" />
                <span>VOL.{daily.date.replaceAll("-", ".")}</span>
                <span>·</span>
                <span>{storyCount} STORIES</span>
                <span>·</span>
                <span>AI HOT DAILY</span>
              </div>

              <h1 className="mt-10 text-center font-serif text-6xl font-bold tracking-normal text-[var(--text)] sm:text-8xl lg:text-9xl">
                AI <span className="text-[var(--accent-strong)]">HOT</span>{" "}
                日报
              </h1>

              <div className="mt-8 grid items-center gap-4 text-center text-sm text-[var(--text-secondary)] md:grid-cols-[1fr_auto_1fr]">
                <span>{formatDailyDate(daily.date)}</span>
                <span className="hidden h-px bg-[var(--border)] md:block" />
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--daily-meta)]">
                  Daily · 每日八时
                </span>
              </div>
            </header>

            <div className="mx-auto mt-20 grid max-w-4xl gap-20 pb-20">
              {daily.sections.map((section, index) => (
                <section key={section.label}>
                  <div className="mb-8 grid items-end gap-3 sm:grid-cols-[70px_minmax(0,1fr)_auto]">
                    <div className="font-mono text-5xl font-bold text-[var(--accent-strong)]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-4">
                        <h2 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">
                          {section.label}
                        </h2>
                        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--daily-meta)]">
                          {getSectionEnglishLabel(section)}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-[var(--accent-strong)]">
                      {section.items.length} 篇
                    </span>
                  </div>

                  <div className="grid gap-4">
                    {section.items.map((item) => (
                      <article
                        className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-5 shadow-[var(--shadow-card)] sm:px-7"
                        key={`${section.label}-${item.sourceUrl}-${item.title}`}
                      >
                        <h3>
                          <a
                            className="text-lg font-bold leading-snug text-[var(--text)] outline-none transition-colors hover:text-[var(--accent-strong)] focus-visible:text-[var(--accent-strong)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:text-xl"
                            href={item.sourceUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {item.title}
                          </a>
                        </h3>
                        <div className="mt-3 font-mono text-[11px] text-[var(--daily-meta)]">
                          {item.sourceName}
                        </div>
                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--text-secondary)]">
                          {item.summary}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </main>
    </AppShell>
  );
}
