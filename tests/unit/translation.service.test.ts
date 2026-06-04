import { describe, expect, it } from "vitest";
import { buildTranslationJob } from "../../src/modules/translation/queue";
import { shouldTranslate } from "../../src/modules/translation/service";

describe("shouldTranslate", () => {
  it("returns true for english posts", () => {
    expect(shouldTranslate("en")).toBe(true);
  });

  it("returns false for the base chinese language code", () => {
    expect(shouldTranslate("zh")).toBe(false);
  });

  it("returns false for chinese language variants", () => {
    expect(shouldTranslate("zh-CN")).toBe(false);
    expect(shouldTranslate("zh-Hans")).toBe(false);
    expect(shouldTranslate("zh-TW")).toBe(false);
    expect(shouldTranslate("  zh-CN  ")).toBe(false);
  });

  it("returns true for an empty language code", () => {
    expect(shouldTranslate("")).toBe(true);
    expect(shouldTranslate("   ")).toBe(true);
  });
});

describe("buildTranslationJob", () => {
  it("builds a translation job with the raw post id", () => {
    expect(buildTranslationJob("raw-post-123")).toEqual({
      rawPostId: "raw-post-123",
    });
  });

  it("throws for an empty or whitespace-only raw post id", () => {
    expect(() => buildTranslationJob("")).toThrow("rawPostId is required");
    expect(() => buildTranslationJob("   ")).toThrow("rawPostId is required");
  });
});
