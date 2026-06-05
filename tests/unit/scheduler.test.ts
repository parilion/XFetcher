import { describe, expect, it } from "vitest";
import { readAppEnv } from "../../src/lib/env";
import { buildWindowLabel } from "../../src/lib/time";
import { createSchedulerWindow } from "../../src/modules/crawler/scheduler";

describe("scheduler basics", () => {
  it("builds label for 3-hour window", () => {
    expect(buildWindowLabel(3)).toBe("最近 3 小时");
  });

  it("creates scheduler window structure", () => {
    expect(createSchedulerWindow(3)).toEqual({
      hours: 3,
      label: "最近 3 小时",
    });
  });

  it("parses required app env values", () => {
    expect(
      readAppEnv({
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/xfetcher",
        REDIS_URL: "redis://localhost:6379",
        X_SOURCE_ADAPTER: "mock",
        PROXY_SCHEME: "http",
        PROXY_HOST: "proxy.example.test",
        PROXY_PORT: "9999",
        PROXY_USERNAME: "demo-user",
        PROXY_PASSWORD: "demo-password",
      }),
    ).toEqual({
      databaseUrl: "postgresql://postgres:postgres@localhost:5432/xfetcher",
      redisUrl: "redis://localhost:6379",
      sourceAdapter: "mock",
      proxyScheme: "http",
      proxyHost: "proxy.example.test",
      proxyPort: 9999,
      proxyUsername: "demo-user",
      proxyPassword: "demo-password",
    });
  });

  it("throws when required env value is missing", () => {
    expect(() =>
      readAppEnv({
        REDIS_URL: "redis://localhost:6379",
        X_SOURCE_ADAPTER: "mock",
        PROXY_SCHEME: "http",
        PROXY_HOST: "proxy.example.test",
        PROXY_PORT: "9999",
        PROXY_USERNAME: "demo-user",
        PROXY_PASSWORD: "demo-password",
      }),
    ).toThrow("Missing required environment variable: DATABASE_URL");
  });

  it("throws when hours are not positive", () => {
    expect(() => buildWindowLabel(0)).toThrow("hours must be a positive number");
  });
});
