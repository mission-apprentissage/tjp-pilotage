import { stopPostresDb } from "./integration-tests-setup";

const teardown = async () => {
  try {
    console.log("Suppresion de l'instance Postgres");
    await stopPostresDb();
  } catch {
    console.log("Failed to stop Postgres Docker testcontainer");
  }
};

export default teardown;
