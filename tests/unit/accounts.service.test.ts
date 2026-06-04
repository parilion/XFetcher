import { describe, expect, it } from "vitest";
import { normalizeHandle } from "../../src/modules/accounts/service";

describe("normalizeHandle", () => {
  it("removes @ prefix, trims spaces, and lowercases the handle", () => {
    expect(normalizeHandle("  @OpenAI  ")).toBe("openai");
  });

  it("keeps an already normalized handle stable", () => {
    expect(normalizeHandle("openai")).toBe("openai");
  });

  it("normalizes input without an @ prefix", () => {
    expect(normalizeHandle("OpenAI")).toBe("openai");
  });

  it("returns an empty string for whitespace-only input", () => {
    expect(normalizeHandle("   ")).toBe("");
  });

  it("returns an empty string for a standalone @ input", () => {
    expect(normalizeHandle(" @ ")).toBe("");
  });
});
