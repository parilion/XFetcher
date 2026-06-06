import {
  formatBeijingClock,
  formatBeijingTime,
  getAihotCategoryLabel,
  type AihotCategory,
  type AihotFeedMode,
} from "@/lib/aihot";
import { db } from "@/lib/db";
import { listStoredAihotItems } from "./store";

export type FeedListItem = {
  category: AihotCategory | null;
  categoryLabel: string;
  clock: string;
  id: string;
  publishedAt: string;
  source: string;
  summary: string;
  title: string;
  url: string;
};

export type FeedPageData = {
  items: FeedListItem[];
  nextCursor: string | null;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export async function getStoredFeedPage(
  category: AihotCategory | null,
  mode: AihotFeedMode,
  page = 1,
  q?: string,
): Promise<FeedPageData> {
  const result = await listStoredAihotItems({
    category: category ?? undefined,
    db,
    mode,
    page,
    q,
    take: 30,
  });

  return {
    items: result.items.map((item) => ({
      category: item.category,
      categoryLabel: getAihotCategoryLabel(item.category),
      clock: formatBeijingClock(item.publishedAt?.toISOString() ?? null),
      id: item.id,
      publishedAt: formatBeijingTime(item.publishedAt?.toISOString() ?? null),
      source: item.source,
      summary: item.summary ?? "暂无摘要，点击原文查看详情。",
      title: item.title,
      url: item.url,
    })),
    nextCursor: result.nextCursor,
    page: result.page,
    pageSize: result.pageSize,
    totalCount: result.totalCount,
    totalPages: result.totalPages,
  };
}
