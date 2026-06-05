const AIHOT_BASE_URL = "https://aihot.virxact.com";
const AIHOT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 xfetcher/0.1.0";

export const AIHOT_CATEGORY_LABELS = {
  "ai-models": "模型发布/更新",
  "ai-products": "产品发布/更新",
  industry: "行业动态",
  paper: "论文研究",
  tip: "技巧与观点",
} as const;

export type AihotCategory = keyof typeof AIHOT_CATEGORY_LABELS;
export type AihotCategoryQueryValue =
  | string
  | string[]
  | undefined;

export type AihotItemRaw = {
  id: string;
  title: string | null;
  title_en: string | null;
  url: string;
  source: string;
  publishedAt: string | null;
  summary: string | null;
  category: AihotCategory | null;
};

export type AihotItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string | null;
  summary: string;
  category: AihotCategory | null;
  categoryLabel: string;
};

export type AihotItemsResponse = {
  count: number;
  hasNext: boolean;
  nextCursor: string | null;
  items: AihotItemRaw[];
};

export type AihotDailyItem = {
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
};

export type AihotDailySection = {
  label: string;
  items: AihotDailyItem[];
};

export type AihotDaily = {
  date: string;
  generatedAt: string;
  windowStart: string;
  windowEnd: string;
  lead: {
    title: string;
    leadParagraph: string;
  } | null;
  sections: AihotDailySection[];
  flashes: Array<{
    title: string;
    sourceName: string;
    sourceUrl: string;
    publishedAt: string | null;
  }>;
};

type FetchItemsOptions = {
  category?: AihotCategory;
  cursor?: string;
  mode?: "selected" | "all";
  q?: string;
  take?: number;
};

export function getAihotCategoryLabel(category: AihotCategory | null): string {
  if (!category) {
    return "未分类";
  }

  return AIHOT_CATEGORY_LABELS[category];
}

export function parseAihotCategory(
  value: AihotCategoryQueryValue,
): AihotCategory | null {
  const category = Array.isArray(value) ? value[0] : value;

  if (!category) {
    return null;
  }

  return category in AIHOT_CATEGORY_LABELS
    ? (category as AihotCategory)
    : null;
}

export function normalizeAihotItem(item: AihotItemRaw): AihotItem {
  return {
    id: item.id,
    title: item.title?.trim() || item.title_en?.trim() || "未命名资讯",
    url: item.url,
    source: item.source,
    publishedAt: item.publishedAt,
    summary: item.summary?.trim() || "暂无摘要，点击原文查看详情。",
    category: item.category,
    categoryLabel: getAihotCategoryLabel(item.category),
  };
}

export function buildAihotItemsUrl(options: FetchItemsOptions = {}): URL {
  const url = new URL("/api/public/items", AIHOT_BASE_URL);
  url.searchParams.set("mode", options.mode ?? "selected");
  url.searchParams.set("take", String(options.take ?? 30));

  if (options.category) {
    url.searchParams.set("category", options.category);
  }

  if (options.cursor) {
    url.searchParams.set("cursor", options.cursor);
  }

  if (options.q?.trim()) {
    url.searchParams.set("q", options.q.trim());
  }

  return url;
}

export async function fetchAihotItems(
  options: FetchItemsOptions = {},
): Promise<AihotItem[]> {
  const data = await fetchAihotItemsPage(options);

  return data.items.map(normalizeAihotItem);
}

export async function fetchAihotItemsPage(
  options: FetchItemsOptions = {},
): Promise<AihotItemsResponse> {
  const response = await fetch(buildAihotItemsUrl(options), {
    headers: {
      "User-Agent": AIHOT_USER_AGENT,
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`AI HOT items request failed: ${response.status}`);
  }

  return (await response.json()) as AihotItemsResponse;
}

export async function fetchAihotDaily(): Promise<AihotDaily> {
  const response = await fetch(`${AIHOT_BASE_URL}/api/public/daily`, {
    headers: {
      "User-Agent": AIHOT_USER_AGENT,
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`AI HOT daily request failed: ${response.status}`);
  }

  return (await response.json()) as AihotDaily;
}

export function formatBeijingTime(value: string | null): string {
  if (!value) {
    return "时间未知";
  }

  const parts = new Intl.DateTimeFormat("zh-CN", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "numeric",
    timeZone: "Asia/Shanghai",
  }).formatToParts(new Date(value));
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${getPart("month")}月${getPart("day")}日 ${getPart("hour")}:${getPart("minute")}`;
}

export function formatBeijingDate(value: string | null): string {
  if (!value) {
    return "日期未知";
  }

  const parts = new Intl.DateTimeFormat("zh-CN", {
    day: "numeric",
    month: "numeric",
    timeZone: "Asia/Shanghai",
  }).formatToParts(new Date(value));
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${getPart("month")}月${getPart("day")}日`;
}

export function formatBeijingClock(value: string | null): string {
  if (!value) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}
