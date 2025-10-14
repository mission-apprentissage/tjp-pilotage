export interface PublicConfig {
  host: string;
  baseUrl: string;
  apiEndpoint: string;
  env: "local" |  "qualification" | "diffusion" | "preproduction" | "production";
  version: string;
  productMeta: {
    brandName: "orion";
    productName: string;
    repoName: string;
  };
}

function getPreProductionPublicConfig(): PublicConfig {
  const host = "pp.orion.education.gouv.fr";

  return {
    host,
    baseUrl: `https://${host}`,
    env: "preproduction",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getDiffusionPublicConfig(): PublicConfig {
  const host = "qp.orion.education.gouv.fr";

  return {
    host,
    baseUrl: `https://${host}`,
    env: "diffusion",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getQualificationPublicConfig(): PublicConfig {
  const host = "qa.orion.education.gouv.fr";

  return {
    host,
    baseUrl: `https://${host}`,
    env: "qualification",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getProductionPublicConfig(): PublicConfig {
  const host = "orion.education.gouv.fr";

  return {
    host,
    baseUrl: `https://${host}`,
    env: "production",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getLocalPublicConfig(): PublicConfig {
  const host = "localhost";
  return {
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
  case "qualification":
  case "diffusion":
  case "preproduction":
  case "production":
  case "local":
    return env;
  default:
    throw new Error(`Invalid NEXT_PUBLIC_ENV env-vars ${env}`);
  }
}

function getPublicConfig(): PublicConfig {
  switch (getEnv()) {
  case "qualification":
    return getQualificationPublicConfig();
  case "diffusion":
    return getDiffusionPublicConfig();
  case "preproduction":
    return getPreProductionPublicConfig();
  case "production":
    return getProductionPublicConfig();
  case "local":
    return getLocalPublicConfig();
  }
}

export const isProduction = getEnv() === "production";

export const publicConfig: PublicConfig = getPublicConfig();
