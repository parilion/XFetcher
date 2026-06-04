import type { ProxyConfig } from "./proxy-provider";
import { buildProxyUrl } from "./proxy-provider";

export class ProxySessionManager {
  constructor(private readonly proxyConfig?: ProxyConfig) {}

  getProxyUrl(): string | undefined {
    if (!this.proxyConfig) {
      return undefined;
    }

    return buildProxyUrl(this.proxyConfig);
  }
}
