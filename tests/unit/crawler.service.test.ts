import { describe, expect, it } from "vitest";
import { countInsertedPosts } from "../../src/modules/crawler/service";

describe("countInsertedPosts", () => {
  it("counts only newly inserted posts", () => {
    expect(countInsertedPosts([true, false, true])).toBe(2);
  });
});
