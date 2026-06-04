import { describe, expect, it } from "vitest";
import { buildProxyUrl } from "../../src/modules/crawler/proxy-provider";

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
});
