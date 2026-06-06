"use client";

import { useEffect, useState, useTransition } from "react";
import { PostCard } from "@/components/feed/post-card";
import type { AihotCategory } from "@/lib/aihot";
import type { FeedListItem } from "@/modules/aihot/feed";

type FeedListProps = {
  category: AihotCategory | null;
  initialItems: FeedListItem[];
  initialNextCursor: string | null;
};

type FeedResponse = {
  items: FeedListItem[];
  nextCursor: string | null;
};

export function FeedList({
  category,
  initialItems,
  initialNextCursor,
}: FeedListProps) {
  const [items, setItems] = useState(initialItems);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(initialItems);
    setNextCursor(initialNextCursor);
    setError("");
  }, [category, initialItems, initialNextCursor]);

  function loadMore() {
    if (!nextCursor || isPending) {
      return;
    }

    startTransition(async () => {
      setError("");
      const params = new URLSearchParams({
        cursor: nextCursor,
      });

      if (category) {
        params.set("category", category);
      }

      const response = await fetch(`/api/feed?${params.toString()}`);

      if (!response.ok) {
        setError("加载失败，请稍后重试。");
        return;
      }

      const data = (await response.json()) as FeedResponse;
      setItems((current) => [...current, ...data.items]);
      setNextCursor(data.nextCursor);
    });
  }

  return (
    <section aria-label="AI 资讯时间线" className="min-w-0 pb-10">
      {items.map((post) => (
        <PostCard
          categoryLabel={post.categoryLabel}
          clock={post.clock}
          key={post.id}
          publishedAt={post.publishedAt}
          source={post.source}
          summary={post.summary}
          title={post.title}
          url={post.url}
        />
      ))}
      <div className="mt-4 flex justify-center">
        {nextCursor ? (
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)] disabled:cursor-wait disabled:opacity-60"
            disabled={isPending}
            onClick={loadMore}
            type="button"
          >
            {isPending ? "加载中..." : "加载更多"}
          </button>
        ) : (
          <span className="text-sm text-[var(--muted)]">已经到底了</span>
        )}
      </div>
      {error ? (
        <p className="mt-3 text-center text-sm text-red-600">{error}</p>
      ) : null}
    </section>
  );
}
