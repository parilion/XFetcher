import { NextRequest, NextResponse } from "next/server";
import {
  formatBeijingClock,
  formatBeijingTime,
  getAihotCategoryLabel,
  parseAihotCategory,
  parseAihotFeedMode,
} from "@/lib/aihot";
import { db } from "@/lib/db";
import { listStoredAihotItems } from "@/modules/aihot/store";

export async function GET(request: NextRequest) {
  const category = parseAihotCategory(
    request.nextUrl.searchParams.get("category") ?? undefined,
  );
  const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;
  const mode = parseAihotFeedMode(request.nextUrl.searchParams.get("mode"));
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const q = request.nextUrl.searchParams.get("q") ?? undefined;
  const result = await listStoredAihotItems({
    category: category ?? undefined,
    cursor,
    db,
    mode,
    page,
    q,
    take: 30,
  });

  return NextResponse.json({
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
  });
}
