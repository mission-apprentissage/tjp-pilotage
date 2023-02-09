const defaultConfig = {
  client: "pg",
  connection: process.env.PILOTAGE_POSTGRES_URI,
};

export default {
  development: defaultConfig,
  recette: defaultConfig,
  production: defaultConfig,
};
