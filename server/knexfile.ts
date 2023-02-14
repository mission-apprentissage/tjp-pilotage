const defaultConfig = {
  client: "pg",
  connection: process.env.PILOTAGE_POSTGRES_URI,
  migrations: { directory: "dist/migrations" },
};

export default {
  development: defaultConfig,
  recette: defaultConfig,
  production: defaultConfig,
};
