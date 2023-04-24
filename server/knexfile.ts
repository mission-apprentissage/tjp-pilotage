const defaultConfig = {
  client: "pg",
  connection: {
    connectionString: process.env.PILOTAGE_POSTGRES_URI,
    ssl: process.env.PILOTAGE_POSTGRES_CA
      ? { rejectUnauthorized: false, ca: process.env.PILOTAGE_POSTGRES_CA }
      : undefined,
  },
  migrations: { directory: "dist/migrations" },
};

export default {
  development: defaultConfig,
  recette: defaultConfig,
  production: defaultConfig,
};
