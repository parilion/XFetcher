import { describe, expect, it } from "vitest";
import { normalizeHandle } from "../../src/modules/accounts/service";

describe("accounts api primitives", () => {
  it("normalizes account handles before persistence", () => {
    expect(normalizeHandle("@openai")).toBe("openai");
  });
});
