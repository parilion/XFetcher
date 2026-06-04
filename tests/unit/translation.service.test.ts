import { describe, expect, it } from "vitest";
import { shouldTranslate } from "../../src/modules/translation/service";

describe("shouldTranslate", () => {
  it("returns true for english posts", () => {
    expect(shouldTranslate("en")).toBe(true);
  });
});
