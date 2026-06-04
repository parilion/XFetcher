import { describe, expect, it } from "vitest";
import { buildProxyUrl } from "../../src/modules/crawler/proxy-provider";
import { ProxySessionManager } from "../../src/modules/crawler/proxy-session-manager";
import { MockSourceAdapter } from "../../src/modules/crawler/source-adapters/mock";

describe("buildProxyUrl", () => {
  it("builds authenticated proxy url", () => {
    expect(
      buildProxyUrl({
        scheme: "http",
        host: "542cd09n.pr.thordata.net",
        port: 9999,
        username: "td-customer-demo",
        password: "secret",
      }),
    ).toBe("http://td-customer-demo:secret@542cd09n.pr.thordata.net:9999");
  });

  it("percent-encodes special characters in credentials", () => {
    expect(
      buildProxyUrl({
        scheme: "http",
        host: "proxy.example.com",
        port: 8080,
        username: "user@demo",
        password: "p:a/s#word",
      }),
    ).toBe("http://user%40demo:p%3Aa%2Fs%23word@proxy.example.com:8080");
  });

  it("builds unauthenticated proxy url", () => {
    expect(
      buildProxyUrl({
        scheme: "http",
        host: "proxy.example.com",
        port: 8080,
      }),
    ).toBe("http://proxy.example.com:8080");
  });
});

describe("ProxySessionManager", () => {
  it("returns undefined when no proxy config is set", () => {
    expect(new ProxySessionManager().getProxyUrl()).toBeUndefined();
  });

  it("returns the built proxy url for the current session", () => {
    expect(
      new ProxySessionManager({
        proxyConfig: {
          scheme: "http",
          host: "proxy.example.com",
          port: 8080,
          username: "user",
          password: "secret",
        },
        sessionKey: "sticky-session-1",
      }).getProxyUrl(),
    ).toBe("http://user:secret@proxy.example.com:8080");
  });
});

describe("MockSourceAdapter", () => {
  it("returns a mock post shaped like a fetched original post", async () => {
    const adapter = new MockSourceAdapter();

    await expect(
      adapter.fetchOriginalPosts({
        accountHandle: "openai",
        proxyUrl: "http://proxy.example.com:8080",
      }),
    ).resolves.toEqual([
      {
        externalPostId: "openai-001",
        originalText: "Latest update from openai",
        originalLanguage: "en",
        postedAt: "2026-06-04T12:00:00.000Z",
        sourceType: "mock",
        rawPayload: {
          accountHandle: "openai",
          proxyUrl: "http://proxy.example.com:8080",
        },
      },
    ]);
  });
});
