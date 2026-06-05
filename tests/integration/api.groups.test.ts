import { describe, expect, it } from "vitest";
import { GET } from "../../src/app/api/groups/route";

describe("groups api", () => {
  it("returns an empty group list before CRUD is implemented", async () => {
    const response = await GET();

    await expect(response.json()).resolves.toEqual({
      items: [],
    });
  });
});
