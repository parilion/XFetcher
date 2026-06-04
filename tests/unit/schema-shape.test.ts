import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const schema = readFileSync("prisma/schema.prisma", "utf8");
const dbModule = readFileSync("src/lib/db.ts", "utf8");

describe("prisma schema", () => {
  it("contains core models, relations, constraints, and indexes", () => {
    expect(schema).toContain("model SourceAccount");
    expect(schema).toContain("model AccountGroup");
    expect(schema).toContain("model RawPost");
    expect(schema).toContain("@@unique([sourceAccountId, externalPostId])");
    expect(schema).toContain(
      'group       AccountGroup   @relation(fields: [groupId], references: [id], onDelete: Restrict)',
    );
    expect(schema).toContain(
      'sourceAccount    SourceAccount    @relation(fields: [sourceAccountId], references: [id], onDelete: Cascade)',
    );
    expect(schema).toContain(
      'rawPost          RawPost  @relation(fields: [rawPostId], references: [id], onDelete: Cascade)',
    );
    expect(schema).toContain("@@index([groupId])");
    expect(schema).toContain("@@index([sourceAccountId])");
  });

  it("validates with prisma", () => {
    const output = execSync("npx prisma validate --schema prisma/schema.prisma", {
      cwd: process.cwd(),
      env: {
        ...process.env,
        DATABASE_URL:
          "postgresql://postgres:postgres@127.0.0.1:5432/xfetcher?schema=public",
      },
      encoding: "utf8",
    });

    expect(output).toContain("The schema at prisma");
    expect(output).toContain("schema.prisma is valid");
  });
});

describe("db client module", () => {
  it("uses a global declaration instead of unknown casting", () => {
    expect(dbModule).toContain("declare global");
    expect(dbModule).toContain("var prisma: PrismaClient | undefined;");
    expect(dbModule).not.toContain("as unknown as");
  });
});
