export interface PublicConfig {
  sentry: {
    dsn: string;
    enabled: boolean;
  };
  host: string;
  baseUrl: string;
  apiEndpoint: string;
  env: "local" | "recette" | "recette2" | "production";
  version: string;
  productMeta: {
    brandName: "orion";
    productName: string;
    repoName: string;
  };
}

function getProductionPublicConfig(): PublicConfig {
  const host = "orion.inserjeunes.beta.gouv.fr";

  return {
    sentry: {
      dsn: "", // TODO
      enabled: true,
    },
    host,
    baseUrl: `https://${host}`,
    env: "production",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getRecettePublicConfig(): PublicConfig {
  const host = "recette-1.orion.inserjeunes.incubateur.net";

  return {
    sentry: {
      dsn: "", // TODO
      enabled: true,
    },
    host,
    baseUrl: `https://${host}`,
    env: "recette",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getRecette2PublicConfig(): PublicConfig {
  const host = "recette-2.orion.inserjeunes.incubateur.net";

  return {
    sentry: {
      dsn: "", // TODO
      enabled: true,
    },
    host,
    baseUrl: `https://${host}`,
    env: "recette",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getLocalPublicConfig(): PublicConfig {
  const host = "localhost";
  return {
    sentry: {
      dsn: "", // TODO
      enabled: false,
    },
    host,
    baseUrl: `http://${host}:3000`,
    env: "local",
    apiEndpoint: `http://${host}:${process.env.NEXT_PUBLIC_API_PORT ?? 5000}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getVersion(): string {
  const version = process.env.NEXT_PUBLIC_VERSION;

  if (!version) {
    throw new Error("missing NEXT_PUBLIC_VERSION env-vars");
  }

  return version;
}

function getProductMeta(): PublicConfig["productMeta"] {
  const productName = process.env.NEXT_PUBLIC_PRODUCT_NAME;

  if (!productName) {
    throw new Error("missing NEXT_PUBLIC_PRODUCT_NAME env-vars");
  }

  const repoName = process.env.NEXT_PUBLIC_PRODUCT_REPO;

  if (!repoName) {
    throw new Error("missing NEXT_PUBLIC_PRODUCT_REPO env-vars");
  }

  return { productName, repoName, brandName: "orion" };
}

function getEnv(): PublicConfig["env"] {
  const env = process.env.NEXT_PUBLIC_ENV;
  switch (env) {
    case "production":
    case "recette":
    case "recette2":
    case "local":
      return env;
    default:
      throw new Error(`Invalid NEXT_PUBLIC_ENV env-vars ${env}`);
  }
}

function getPublicConfig(): PublicConfig {
  switch (getEnv()) {
    case "production":
      return getProductionPublicConfig();
    case "recette":
      return getRecettePublicConfig();
    case "recette2":
      return getRecette2PublicConfig();
    case "local":
      return getLocalPublicConfig();
  }
}

export const isProduction = getEnv() === "production";

export const publicConfig: PublicConfig = getPublicConfig();
