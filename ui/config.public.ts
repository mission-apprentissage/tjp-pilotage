export interface PublicConfig {
  crisp: {
    token: string;
  };
  host: string;
  baseUrl: string;
  apiEndpoint: string;
  env: "local" |  "qualification" | "diffusion" | "preproduction" | "production" | "recette1" | "recette2" | "productionij";
  version: string;
  productMeta: {
    brandName: "orion";
    productName: string;
    repoName: string;
  };
}

function getProductionIJPublicConfig(): PublicConfig {
  const host = "orion.inserjeunes.beta.gouv.fr";

  return {
    crisp: {
      token: "cf473a68-afeb-4611-9d38-55ff6144b9b8",
    },
    host,
    baseUrl: `https://${host}`,
    env: "production",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getRecette1PublicConfig(): PublicConfig {
  const host = "recette-1.orion.inserjeunes.incubateur.net";

  return {
    crisp: {
      token: "no-token",
    },
    host,
    baseUrl: `https://${host}`,
    env: "recette1",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getRecette2PublicConfig(): PublicConfig {
  const host = "recette-2.orion.inserjeunes.incubateur.net";

  return {
    crisp: {
      token: "no-token",
    },
    host,
    baseUrl: `https://${host}`,
    env: "recette2",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getPreProductionPublicConfig(): PublicConfig {
  const host = "pp.orion.education.gouv.fr";

  return {
    crisp: {
      token: "no-token",
    },
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
    crisp: {
      token: "no-token",
    },
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
    crisp: {
      token: "no-token",
    },
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
    crisp: {
      token: "no-token",
    },
    host,
    baseUrl: `https://${host}`,
    env: "qualification",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getLocalPublicConfig(): PublicConfig {
  const host = "localhost";
  return {
    crisp: {
      token: "no-token",
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
  case "qualification":
  case "diffusion":
  case "preproduction":
  case "production":
  case "local":
  case "recette1":
  case "recette2":
  case "productionij":
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
  case "recette1":
    return getRecette1PublicConfig();
  case "recette2":
    return getRecette2PublicConfig();
  case "productionij":
    return getProductionIJPublicConfig();
  }
}

export const isProduction = getEnv() === "production";

export const publicConfig: PublicConfig = getPublicConfig();
