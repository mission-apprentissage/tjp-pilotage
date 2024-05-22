import { ENV } from "shared";
import { EnvEnum } from "shared/enum/envEnum";

export interface PublicConfig {
  sentry_dsn: string;
  sentry_enabled: boolean;
  baseUrl: string;
  host: string;
  env: ENV;
  plausible: {
    domain: string;
  };
}

function getConfig(): PublicConfig {
  console.log({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL });

  const url = new URL(process.env.NEXT_PUBLIC_BASE_URL!);

  return {
    sentry_dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
    sentry_enabled: getEnv() !== EnvEnum.dev,
    env: getEnv(),
    host: url.hostname,
    baseUrl: url.toString(),
    plausible: {
      domain: url.hostname,
    },
  };
}

function getEnv(): ENV {
  return ENV.parse(process.env.NEXT_PUBLIC_ENV);
}

export const publicConfig: PublicConfig = getConfig();
