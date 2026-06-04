import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("prisma schema", () => {
  it("contains source account model", () => {
    const schema = readFileSync("prisma/schema.prisma", "utf8");
    expect(schema).toContain("model SourceAccount");
    expect(schema).toContain("model AccountGroup");
    expect(schema).toContain("model RawPost");
  });
});
