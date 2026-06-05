import { describe, expect, it } from "vitest";
import { buildWindowLabel } from "../../src/lib/time";

describe("buildWindowLabel", () => {
  it("builds label for 3-hour window", () => {
    expect(buildWindowLabel(3)).toBe("最近 3 小时");
  });
});
