import { describe, expect, it } from "vitest";
import { normalizeHandle } from "../../src/modules/accounts/service";

describe("normalizeHandle", () => {
  it("removes @ prefix and trims spaces", () => {
    expect(normalizeHandle("  @OpenAI  ")).toBe("OpenAI");
  });
});
