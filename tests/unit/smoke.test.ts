import { describe, expect, it } from "vitest";

describe("project scaffold", () => {
  it("defines the app name", async () => {
    const pkg = await import("../../package.json");
    expect(pkg.name).toBe("xfetcher");
  });
});
