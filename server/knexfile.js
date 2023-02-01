export default {
  development: {
    client: "pg",
    connection: process.env.PILOTAGE_POSTGRES_URI,
  },
  recette: {
    client: "pg",
    connection: process.env.PILOTAGE_POSTGRES_URI,
  },
  production: {
    client: "pg",
    connection: process.env.PILOTAGE_POSTGRES_URI,
  },
};
