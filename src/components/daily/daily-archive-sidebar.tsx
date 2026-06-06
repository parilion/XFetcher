"use client";

import type { AihotDailyArchiveItem } from "@/lib/aihot";
import Link from "next/link";
import { useState } from "react";

type DailyArchiveSidebarProps = {
  archiveCount: number;
  currentDate: string;
  items: AihotDailyArchiveItem[];
  latestDate: string;
};

type MonthGroup = {
  count: number;
  items: AihotDailyArchiveItem[];
  key: string;
  label: string;
};

function getDailyHref(date: string, latestDate: string) {
  return date === latestDate ? "/daily" : `/daily/${date}`;
}

function groupArchiveByMonth(items: AihotDailyArchiveItem[]): MonthGroup[] {
  const monthMap = new Map<string, AihotDailyArchiveItem[]>();

  for (const item of items) {
    const monthKey = item.date.slice(0, 7);
    monthMap.set(monthKey, [...(monthMap.get(monthKey) ?? []), item]);
  }

  return Array.from(monthMap.entries()).map(([monthKey, monthItems]) => ({
    count: monthItems.length,
    items: monthItems,
    key: monthKey,
    label: `${monthKey.slice(0, 4)} 年 ${Number(monthKey.slice(5, 7))} 月`,
  }));
}

export function DailyArchiveSidebar({
  archiveCount,
  currentDate,
  items,
  latestDate,
}: DailyArchiveSidebarProps) {
  const monthGroups = groupArchiveByMonth(items);
  const currentMonthKey = currentDate.slice(0, 7);
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(
    () => new Set([currentMonthKey]),
  );

  function toggleMonth(monthKey: string) {
    setExpandedMonths((current) => {
      const next = new Set(current);

      if (next.has(monthKey)) {
        next.delete(monthKey);
      } else {
        next.add(monthKey);
      }

      return next;
    });
  }

  return (
    <aside className="hidden h-screen overflow-hidden border-r border-[var(--border)] px-6 py-8 lg:block">
      <Link
        className="block rounded-md border border-[var(--accent)] bg-[var(--surface)] px-5 py-4 transition-colors hover:bg-[var(--selected-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        href="/daily"
      >
        <div className="text-sm font-bold text-[var(--accent-strong)]">
          最新一期
        </div>
        <div className="mt-3 font-mono text-xs text-[var(--accent-strong)]">
          {latestDate}
        </div>
      </Link>

      <div className="mt-8 grid gap-4">
        {monthGroups.map((group) => {
          const isExpanded = expandedMonths.has(group.key);

          return (
            <section
              className="border-b border-[var(--border)] pb-4 last:border-b-0"
              key={group.key}
            >
              <button
                aria-expanded={isExpanded}
                className="mb-3 flex w-full items-center justify-between text-left text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                onClick={() => toggleMonth(group.key)}
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="font-mono text-xs text-[var(--muted)]">
                    {isExpanded ? "⌄" : "›"}
                  </span>
                  {group.label}
                </span>
                <span className="font-mono text-xs text-[var(--muted)]">
                  {group.count}
                </span>
              </button>

              {isExpanded ? (
                <div className="grid gap-1">
                  {group.items.map((item) => {
                    const isCurrent = item.date === currentDate;

                    return (
                      <Link
                        aria-current={isCurrent ? "page" : undefined}
                        className={
                          isCurrent
                            ? "grid grid-cols-[34px_minmax(0,1fr)] gap-3 rounded bg-[var(--selected-bg)] px-3 py-2 text-[var(--accent-strong)]"
                            : "grid grid-cols-[34px_minmax(0,1fr)] gap-3 rounded px-3 py-2 text-[var(--muted)] transition-colors hover:bg-[var(--nav-hover)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        }
                        href={getDailyHref(item.date, latestDate)}
                        key={item.date}
                      >
                        <span className="font-mono text-xs">
                          {Number(item.date.slice(8, 10))} 日
                        </span>
                        <span className="truncate text-xs leading-5">
                          {item.leadTitle}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <a
        className="mt-2 inline-flex text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--accent-strong)]"
        href="https://aihot.virxact.com/daily"
        rel="noreferrer"
        target="_blank"
      >
        全部日报 →
      </a>
    </aside>
  );
}
