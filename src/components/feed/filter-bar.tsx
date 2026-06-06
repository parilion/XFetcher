import type { AihotCategory } from "@/lib/aihot";
import Link from "next/link";

const FILTERS: Array<{
  category: AihotCategory | null;
  label: string;
}> = [
  { category: null, label: "精选" },
  { category: "ai-models", label: "模型" },
  { category: "ai-products", label: "产品" },
  { category: "industry", label: "行业" },
  { category: "paper", label: "论文" },
  { category: "tip", label: "观点" },
];

type FilterBarProps = {
  activeCategory: AihotCategory | null;
  basePath?: string;
  emptyLabel?: string;
  q?: string;
};

export function FilterBar({
  activeCategory,
  basePath = "/",
  emptyLabel = "精选",
  q,
}: FilterBarProps) {
  return (
    <nav aria-label="资讯分类" className="feed-toolbar">
      {FILTERS.map((filter) => {
        const isActive = filter.category === activeCategory;
        const label = filter.category ? filter.label : emptyLabel;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            href={
              (() => {
                const params = new URLSearchParams();

                if (filter.category) {
                  params.set("category", filter.category);
                }

                if (q) {
                  params.set("q", q);
                }

                const query = params.toString();

                return query ? `${basePath}?${query}` : basePath;
              })()
            }
            key={label}
            className={
              isActive
                ? "feed-page-chip is-active"
                : "feed-page-chip"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
