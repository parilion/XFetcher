import type { ProxyConfig } from "./proxy-provider";
import { buildProxyUrl } from "./proxy-provider";

export type ProxySession = {
  proxyConfig: ProxyConfig;
  sessionKey: string;
};

export class ProxySessionManager {
  constructor(private readonly session?: ProxySession) {}

  getProxyUrl(): string | undefined {
    if (!this.session) {
      return undefined;
    }

    return buildProxyUrl(this.session.proxyConfig);
  }

  getSessionKey(): string | undefined {
    return this.session?.sessionKey;
  }
}
