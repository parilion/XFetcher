import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

describe("tooling configuration", () => {
  it("ignores generated and local-only directories in git", () => {
    const gitignore = readFileSync(".gitignore", "utf8");

    expect(gitignore).toContain(".next/");
    expect(gitignore).toContain("node_modules/");
    expect(gitignore).toContain("test-results/");
    expect(gitignore).toContain(".vscode/");
  });

  it("keeps playwright e2e specs out of vitest collection", async () => {
    expect(existsSync("vitest.config.ts")).toBe(true);

    const configModule = await import("../../vitest.config");
    const config = configModule.default;
    const testConfig = config.test;

    expect(testConfig.exclude).toEqual(
      expect.arrayContaining([
        "tests/e2e/**",
        ".next/**",
        "node_modules/**",
      ]),
    );
  });
});
