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
};

export function FilterBar({ activeCategory }: FilterBarProps) {
  return (
    <nav aria-label="资讯分类" className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = filter.category === activeCategory;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            href={filter.category ? `/?category=${filter.category}` : "/"}
            key={filter.label}
          className={
              isActive
                ? "inline-flex min-h-11 items-center rounded-full bg-[var(--text)] px-4 text-sm font-semibold text-[var(--surface)]"
                : "inline-flex min-h-11 items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          }
        >
            {filter.label}
          </Link>
        );
      })}
    </nav>
  );
}
