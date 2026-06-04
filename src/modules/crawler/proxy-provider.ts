export type ProxyConfig = {
  scheme: string;
  host: string;
  port: number;
  username?: string;
  password?: string;
};

export function buildProxyUrl(config: ProxyConfig): string {
  const credentials =
    config.username !== undefined && config.password !== undefined
      ? `${encodeURIComponent(config.username)}:${encodeURIComponent(config.password)}@`
      : "";

  return `${config.scheme}://${credentials}${config.host}:${config.port}`;
}
