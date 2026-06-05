import type { PrismaClient } from "@prisma/client";
import type { AihotCategory, AihotItemRaw } from "@/lib/aihot";

type AihotDb = Pick<PrismaClient, "aihotItem">;

export type SyncAihotItemsInput = {
  db: AihotDb;
  items: AihotItemRaw[];
};

export type SyncAihotItemsResult = {
  fetchedCount: number;
  insertedCount: number;
  updatedCount: number;
};

export type ListStoredAihotItemsInput = {
  category?: AihotCategory;
  cursor?: string;
  db: AihotDb;
  take?: number;
};

export type StoredAihotItem = {
  category: AihotCategory | null;
  id: string;
  publishedAt: Date | null;
  source: string;
  summary: string | null;
  title: string;
  titleEn: string | null;
  url: string;
};

type CursorPayload = {
  id: string;
  publishedAt: string | null;
};

function toDate(value: string | null): Date | null {
  return value ? new Date(value) : null;
}

function toDbPayload(item: AihotItemRaw) {
  return {
    category: item.category,
    publishedAt: toDate(item.publishedAt),
    rawPayload: item,
    source: item.source,
    summary: item.summary,
    title: item.title?.trim() || item.title_en?.trim() || "未命名资讯",
    titleEn: item.title_en,
    url: item.url,
  };
}

export function encodeAihotCursor(item: StoredAihotItem): string {
  const payload: CursorPayload = {
    id: item.id,
    publishedAt: item.publishedAt?.toISOString() ?? null,
  };

  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeAihotCursor(cursor?: string): CursorPayload | null {
  if (!cursor) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(cursor, "base64url").toString("utf8"),
    ) as CursorPayload;

    if (typeof payload.id !== "string") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function syncAihotItems({
  db,
  items,
}: SyncAihotItemsInput): Promise<SyncAihotItemsResult> {
  let insertedCount = 0;
  let updatedCount = 0;

  for (const item of items) {
    const existing = await db.aihotItem.findUnique({
      select: { id: true },
      where: { id: item.id },
    });
    const payload = toDbPayload(item);

    await db.aihotItem.upsert({
      create: {
        id: item.id,
        ...payload,
      },
      update: payload,
      where: { id: item.id },
    });

    if (existing) {
      updatedCount += 1;
    } else {
      insertedCount += 1;
    }
  }

  return {
    fetchedCount: items.length,
    insertedCount,
    updatedCount,
  };
}

export async function listStoredAihotItems({
  category,
  cursor,
  db,
  take = 30,
}: ListStoredAihotItemsInput): Promise<{
  items: StoredAihotItem[];
  nextCursor: string | null;
}> {
  const decodedCursor = decodeAihotCursor(cursor);
  const pageSize = Math.min(Math.max(take, 1), 50);
  const items = await db.aihotItem.findMany({
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: pageSize + 1,
    where: {
      ...(category ? { category } : {}),
      ...(decodedCursor?.publishedAt
        ? {
            OR: [
              { publishedAt: { lt: new Date(decodedCursor.publishedAt) } },
              {
                id: { lt: decodedCursor.id },
                publishedAt: new Date(decodedCursor.publishedAt),
              },
            ],
          }
        : {}),
    },
  });
  const pageItems = items.slice(0, pageSize);
  const nextItem = items[pageSize];

  return {
    items: pageItems as StoredAihotItem[],
    nextCursor: nextItem
      ? encodeAihotCursor(nextItem as StoredAihotItem)
      : null,
  };
}
