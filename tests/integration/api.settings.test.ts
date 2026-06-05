import { describe, expect, it } from "vitest";
import { GET } from "../../src/app/api/settings/route";

describe("settings api", () => {
  it("returns the default admin settings payload", async () => {
    const response = await GET();

    await expect(response.json()).resolves.toEqual({
      fetchInterval: 300,
      concurrency: 3,
      translationEnabled: true,
    });
  });
});
