import { describe, expect, it, vi } from "vitest";
import { syncAihotItems } from "../../src/modules/aihot/store";
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
          publishedAt: new Date("2026-06-05T01:48:00.000Z"),
        }),
        update: expect.objectContaining({
          title: "A title",
        }),
      }),
    );
  });
});
