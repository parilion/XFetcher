import { describe, expect, it } from "vitest";
import {
  buildAihotItemsUrl,
  formatBeijingClock,
  formatBeijingDate,
  formatBeijingTime,
  getAihotCategoryLabel,
  parseAihotCategory,
  normalizeAihotItem,
} from "../../src/lib/aihot";

describe("aihot helpers", () => {
  it("builds selected items url with query parameters", () => {
    const url = buildAihotItemsUrl({
      category: "ai-products",
      mode: "selected",
      q: "OpenAI",
      take: 20,
    });

    expect(url.toString()).toBe(
      "https://aihot.virxact.com/api/public/items?mode=selected&take=20&category=ai-products&q=OpenAI",
    );
  });

  it("normalizes nullable upstream fields for feed rendering", () => {
    expect(
      normalizeAihotItem({
        id: "cmq",
        title: "",
        title_en: "Fallback title",
        url: "https://example.com",
        source: "Example",
        publishedAt: null,
        summary: null,
        category: null,
      }),
    ).toEqual({
      id: "cmq",
      title: "Fallback title",
      url: "https://example.com",
      source: "Example",
      publishedAt: null,
      summary: "暂无摘要，点击原文查看详情。",
      category: null,
      categoryLabel: "未分类",
    });
  });

  it("maps category slugs to Chinese labels", () => {
    expect(getAihotCategoryLabel("ai-models")).toBe("模型发布/更新");
    expect(getAihotCategoryLabel(null)).toBe("未分类");
  });

  it("parses category query values safely", () => {
    expect(parseAihotCategory("ai-products")).toBe("ai-products");
    expect(parseAihotCategory(["paper"])).toBe("paper");
    expect(parseAihotCategory("unknown")).toBeNull();
    expect(parseAihotCategory(undefined)).toBeNull();
  });

  it("formats upstream UTC timestamps as Beijing time", () => {
    expect(formatBeijingTime("2026-06-05T01:48:00.000Z")).toBe(
      "6月5日 09:48",
    );
    expect(formatBeijingDate("2026-06-05T01:48:00.000Z")).toBe("6月5日");
    expect(formatBeijingClock("2026-06-05T01:48:00.000Z")).toBe("09:48");
  });
});
