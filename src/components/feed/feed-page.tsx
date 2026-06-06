import { FilterBar } from "@/components/feed/filter-bar";
import { FeedList } from "@/components/feed/feed-list";
import {
  getAihotCategoryLabel,
  parseAihotCategory,
  type AihotCategoryQueryValue,
} from "@/lib/aihot";
import { getStoredFeedPage } from "@/modules/aihot/feed";
import Link from "next/link";

type FeedPageContentProps = {
  basePath?: string;
  category?: AihotCategoryQueryValue;
  descriptionPrefix: string;
  emptyLabel: string;
  title: string;
};

export async function FeedPageContent({
  basePath = "/",
  category,
  descriptionPrefix,
  emptyLabel,
  title,
}: FeedPageContentProps) {
  const activeCategory = parseAihotCategory(category);
  const feedPage = await getStoredFeedPage(activeCategory);
  const posts = feedPage.items;
  const latestDate = posts[0]?.publishedAt.split(" ")[0] ?? "日期未知";
  const feedLabel = activeCategory
    ? getAihotCategoryLabel(activeCategory)
    : emptyLabel;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-5 overflow-hidden px-3 py-5 sm:px-6 lg:px-8">
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--accent-strong)]">
              {feedLabel}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-[var(--text)] sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              {descriptionPrefix}
              {feedLabel}流，来自 aihot.virxact.com，按北京时间倒序展示。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--subtle)] px-3 py-2">
              <div className="text-xs text-[var(--muted)]">最新日期</div>
              <div className="mt-1 font-semibold text-[var(--text)]">
                {latestDate}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--subtle)] px-3 py-2">
              <div className="text-xs text-[var(--muted)]">展示条目</div>
              <div className="mt-1 font-semibold text-[var(--text)]">
                {posts.length} 条
              </div>
            </div>
            <Link
              className="col-span-2 inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:col-span-1"
              href="/daily"
            >
              AI 日报
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)]">
        <FilterBar activeCategory={activeCategory} basePath={basePath} />
      </section>

      <FeedList
        category={activeCategory}
        initialItems={feedPage.items}
        initialNextCursor={feedPage.nextCursor}
      />
    </main>
  );
}
