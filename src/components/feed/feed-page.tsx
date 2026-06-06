import { FilterBar } from "@/components/feed/filter-bar";
import { FeedList } from "@/components/feed/feed-list";
import {
  getAihotCategoryLabel,
  parseAihotCategory,
  type AihotCategoryQueryValue,
  type AihotFeedMode,
} from "@/lib/aihot";
import { getStoredFeedPage } from "@/modules/aihot/feed";
import Link from "next/link";

type FeedPageContentProps = {
  basePath?: string;
  category?: AihotCategoryQueryValue;
  descriptionPrefix: string;
  emptyLabel: string;
  mode?: AihotFeedMode;
  page?: string | string[];
  q?: string | string[];
  title: string;
};

function parseQuery(value?: string | string[]) {
  const rawQuery = Array.isArray(value) ? value[0] : value;

  return rawQuery?.trim() ?? "";
}

function parsePage(value?: string | string[]) {
  const rawPage = Array.isArray(value) ? value[0] : value;
  const page = Number(rawPage ?? "1");

  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function buildFeedHref(
  basePath: string,
  category: string | null,
  page: number,
  q: string,
) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  if (q) {
    params.set("q", q);
  }

  const query = params.toString();

  return query ? `${basePath}?${query}` : basePath;
}

function getPaginationPages(currentPage: number, totalPages: number) {
  const pages = new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]);

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
}

function FeedPagination({
  basePath,
  category,
  currentPage,
  q,
  totalPages,
}: {
  basePath: string;
  category: string | null;
  currentPage: number;
  q: string;
  totalPages: number;
}) {
  const pages = getPaginationPages(currentPage, totalPages);
  let previousPage = 0;

  return (
    <nav aria-label="分页" className="feed-pagination">
      {currentPage > 1 ? (
        <Link
          className="feed-pagination-btn"
          href={buildFeedHref(basePath, category, currentPage - 1, q)}
        >
          ‹ 上一页
        </Link>
      ) : (
        <span aria-disabled="true" className="feed-pagination-btn is-disabled">
          ‹ 上一页
        </span>
      )}

      <div className="feed-pagination-pages">
        {pages.map((pageNumber) => {
          const needsGap = previousPage > 0 && pageNumber - previousPage > 1;
          previousPage = pageNumber;

          return (
            <span className="contents" key={pageNumber}>
              {needsGap ? (
                <span aria-hidden="true" className="feed-pagination-gap">
                  ...
                </span>
              ) : null}
              {pageNumber === currentPage ? (
                <span
                  aria-current="page"
                  className="feed-pagination-num is-current"
                >
                  {pageNumber}
                </span>
              ) : (
                <Link
                  className="feed-pagination-num"
                  href={buildFeedHref(basePath, category, pageNumber, q)}
                >
                  {pageNumber}
                </Link>
              )}
            </span>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          className="feed-pagination-btn"
          href={buildFeedHref(basePath, category, currentPage + 1, q)}
        >
          下一页 ›
        </Link>
      ) : (
        <span aria-disabled="true" className="feed-pagination-btn is-disabled">
          下一页 ›
        </span>
      )}
    </nav>
  );
}

export async function FeedPageContent({
  basePath = "/",
  category,
  descriptionPrefix,
  emptyLabel,
  mode = "selected",
  page,
  q,
  title,
}: FeedPageContentProps) {
  const activeCategory = parseAihotCategory(category);
  const currentPage = parsePage(page);
  const query = parseQuery(q);
  const feedPage = await getStoredFeedPage(
    activeCategory,
    mode,
    currentPage,
    query,
  );
  const posts = feedPage.items;
  const latestDate = posts[0]?.publishedAt.split(" ")[0] ?? "日期未知";
  const feedLabel = activeCategory
    ? getAihotCategoryLabel(activeCategory)
    : emptyLabel;

  return (
    <main className="feed-page mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 px-3 py-4 sm:px-6 lg:px-8">
      <section className="feed-header-card">
        <div className="feed-header-row">
          <div className="min-w-0">
            <p className="feed-eyebrow">{feedLabel}</p>
            <h1 className="feed-title">
              {title}
            </h1>
            <p className="feed-subtitle">
              {descriptionPrefix}
              {feedLabel}流，来自 aihot.virxact.com，按北京时间倒序展示。
            </p>
          </div>
          <div className="feed-header-actions">
            <div className="feed-stat">
              <div className="feed-stat-label">最新日期</div>
              <div className="feed-stat-value">
                {latestDate}
              </div>
            </div>
            <div className="feed-stat">
              <div className="feed-stat-label">全部条目</div>
              <div className="feed-stat-value">
                {feedPage.totalCount} 条
              </div>
            </div>
            <Link
              className="feed-daily-link"
              href="/daily"
            >
              AI 日报
            </Link>
          </div>
        </div>

        <div className="feed-divider" />
        <FilterBar
          activeCategory={activeCategory}
          basePath={basePath}
          emptyLabel={emptyLabel}
          q={query}
        />
        <form action={basePath} className="feed-search-form" method="get">
          {activeCategory ? (
            <input name="category" type="hidden" value={activeCategory} />
          ) : null}
          <label className="sr-only" htmlFor="feed-search">
            搜索 AI 动态
          </label>
          <input
            className="feed-search-input"
            defaultValue={query}
            id="feed-search"
            name="q"
            placeholder="搜索标题、摘要或来源"
            type="search"
          />
          <button className="feed-search-submit" type="submit">
            搜索
          </button>
          {query ? (
            <Link
              className="feed-search-clear"
              href={buildFeedHref(basePath, activeCategory, 1, "")}
            >
              清除
            </Link>
          ) : null}
        </form>
      </section>

      <FeedList
        initialItems={feedPage.items}
        mode={mode}
      />
      <FeedPagination
        basePath={basePath}
        category={activeCategory}
        currentPage={feedPage.page}
        q={query}
        totalPages={feedPage.totalPages}
      />
    </main>
  );
}
