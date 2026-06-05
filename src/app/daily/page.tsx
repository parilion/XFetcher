import { AppShell } from "@/components/app-shell";
import { fetchAihotDaily } from "@/lib/aihot";
import Link from "next/link";

export default async function DailyPage() {
  const daily = await fetchAihotDaily();

  return (
    <AppShell activePath="/daily">
      <main className="mx-auto min-h-screen w-full max-w-4xl overflow-hidden px-3 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6">
          <Link
            className="text-sm font-semibold text-[var(--accent-strong)] underline-offset-4 hover:underline"
            href="/"
          >
            返回精选
          </Link>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--accent-strong)]">
                AI HOT 日报 · {daily.date}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-normal text-[var(--text)] sm:text-4xl">
                今日汇总
              </h1>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--subtle)] px-3 py-2 text-sm">
              <div className="text-xs text-[var(--muted)]">版块</div>
              <div className="mt-1 font-semibold text-[var(--text)]">
                {daily.sections.length} 个
              </div>
            </div>
          </div>
          {daily.lead ? (
            <section className="mt-5 rounded-xl border border-[var(--selected-border)] bg-[var(--selected-bg)] p-4">
              <h2 className="text-lg font-semibold text-[var(--text)]">
                {daily.lead.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                {daily.lead.leadParagraph}
              </p>
            </section>
          ) : null}
        </header>

        <div className="grid gap-5 pb-10">
          {daily.sections.map((section) => (
            <section
              className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]"
              key={section.label}
            >
              <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-3">
                <h2 className="text-xl font-bold text-[var(--text)]">
                  {section.label}
                </h2>
                <span className="rounded-full border border-[var(--border)] bg-[var(--subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">
                  {section.items.length} 条
                </span>
              </div>
              <div className="grid gap-3">
                {section.items.map((item) => (
                  <article
                    className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4"
                    key={`${section.label}-${item.sourceUrl}-${item.title}`}
                  >
                    <div className="mb-2 break-words text-xs font-medium text-[var(--muted)]">
                      {item.sourceName}
                    </div>
                    <a
                      className="break-words text-[17px] font-semibold leading-snug text-[var(--text)] outline-none transition-colors hover:text-[var(--accent-strong)] focus-visible:text-[var(--accent-strong)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      href={item.sourceUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {item.title}
                    </a>
                    <p className="mt-3 break-words text-sm leading-6 text-[var(--text-secondary)]">
                      {item.summary}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
