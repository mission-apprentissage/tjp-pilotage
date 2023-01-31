export default {
  development: {
    client: "pg",
    connection: process.env.PILOTAGE_POSTGRES_URI,
  },
};
