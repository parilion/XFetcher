import { describe, expect, it, vi } from "vitest";
import {
  listStoredAihotItems,
  syncAihotItems,
} from "../../src/modules/aihot/store";
import type { AihotItemRaw } from "../../src/lib/aihot";

const item = (id: string, url = `https://example.com/${id}`): AihotItemRaw => ({
  category: "ai-products",
  id,
  publishedAt: "2026-06-05T01:48:00.000Z",
  source: "Example",
  summary: "A summary",
  title: "A title",
  title_en: null,
  url,
});

describe("syncAihotItems", () => {
  it("upserts upstream items by id and reports inserted versus updated rows", async () => {
    const upsert = vi
      .fn()
      .mockResolvedValueOnce({ firstSeenAt: new Date("2026-06-05T00:00:00Z") })
      .mockResolvedValueOnce({ firstSeenAt: new Date("2026-06-04T00:00:00Z") });
    const findUnique = vi
      .fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: "old" });
    const db = {
      aihotItem: {
        findUnique,
        upsert,
      },
    };

    const result = await syncAihotItems({
      db,
      items: [item("new"), item("old")],
      mode: "selected",
    });

    expect(result).toEqual({
      fetchedCount: 2,
      insertedCount: 1,
      updatedCount: 1,
    });
    expect(findUnique).toHaveBeenCalledWith({
      select: { id: true },
      where: { id: "new" },
    });
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "new" },
        create: expect.objectContaining({
          id: "new",
          isSelected: true,
          publishedAt: new Date("2026-06-05T01:48:00.000Z"),
        }),
        update: expect.objectContaining({
          isSelected: true,
          title: "A title",
        }),
      }),
    );
  });

  it("stores all-mode items without forcing the selected flag", async () => {
    const upsert = vi.fn().mockResolvedValue({});
    const findUnique = vi.fn().mockResolvedValue(null);
    const db = {
      aihotItem: {
        findUnique,
        upsert,
      },
    };

    await syncAihotItems({
      db,
      items: [item("all-only")],
      mode: "all",
    });

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          id: "all-only",
        }),
        update: expect.objectContaining({}),
      }),
    );
    expect(upsert.mock.calls[0][0].create).not.toHaveProperty("isSelected");
    expect(upsert.mock.calls[0][0].update).not.toHaveProperty("isSelected");
  });

  it("filters stored pages by feed mode", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const count = vi.fn().mockResolvedValue(0);
    const db = {
      aihotItem: {
        count,
        findMany,
      },
    };

    await listStoredAihotItems({
      db,
      mode: "all",
    });
    await listStoredAihotItems({
      db,
      mode: "selected",
    });

    expect(findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: {},
      }),
    );
    expect(count).toHaveBeenNthCalledWith(1, {
      where: {},
    });
    expect(findMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: expect.objectContaining({ isSelected: true }),
      }),
    );
    expect(count).toHaveBeenNthCalledWith(2, {
      where: { isSelected: true },
    });
  });
});
