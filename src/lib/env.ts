export type AppEnv = {
  databaseUrl: string;
  redisUrl: string;
  sourceAdapter: string;
  proxyScheme: string;
  proxyHost: string;
  proxyPort: number;
  proxyUsername: string;
  proxyPassword: string;
};

export function readAppEnv(env: NodeJS.ProcessEnv = process.env): AppEnv {
  return {
    databaseUrl: env.DATABASE_URL ?? "",
    redisUrl: env.REDIS_URL ?? "",
    sourceAdapter: env.X_SOURCE_ADAPTER ?? "mock",
    proxyScheme: env.PROXY_SCHEME ?? "http",
    proxyHost: env.PROXY_HOST ?? "",
    proxyPort: Number(env.PROXY_PORT ?? 0),
    proxyUsername: env.PROXY_USERNAME ?? "",
    proxyPassword: env.PROXY_PASSWORD ?? "",
  };
}
