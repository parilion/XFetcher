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

function requireEnv(env: NodeJS.ProcessEnv, key: string): string {
  const value = env[key];

  if (value === undefined || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function readAppEnv(env: NodeJS.ProcessEnv = process.env): AppEnv {
  const proxyPortValue = requireEnv(env, "PROXY_PORT");
  const proxyPort = Number(proxyPortValue);

  if (!Number.isInteger(proxyPort) || proxyPort <= 0) {
    throw new Error("Environment variable PROXY_PORT must be a positive integer");
  }

  return {
    databaseUrl: requireEnv(env, "DATABASE_URL"),
    redisUrl: requireEnv(env, "REDIS_URL"),
    sourceAdapter: requireEnv(env, "X_SOURCE_ADAPTER"),
    proxyScheme: requireEnv(env, "PROXY_SCHEME"),
    proxyHost: requireEnv(env, "PROXY_HOST"),
    proxyPort,
    proxyUsername: requireEnv(env, "PROXY_USERNAME"),
    proxyPassword: requireEnv(env, "PROXY_PASSWORD"),
  };
}
