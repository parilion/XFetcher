export type ProxyConfig = {
  scheme: string;
  host: string;
  port: number;
  username: string;
  password: string;
};

export function buildProxyUrl(config: ProxyConfig): string {
  return `${config.scheme}://${config.username}:${config.password}@${config.host}:${config.port}`;
}
