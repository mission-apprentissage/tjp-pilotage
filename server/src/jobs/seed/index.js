import { logger } from "../../common/logger.js";
import { createUser } from "../../common/components/usersComponent.js";

const createUsers = async ({ adminEmail }) => {
  await createUser(
    { email: adminEmail, password: "Secret!Password1" },
    {
      nom: "Admin",
      prenom: "test",
      permissions: { isAdmin: true },
    }
  );
  logger.info(`User ${adminEmail} with password 'Secret!Password1' and admin is successfully created `);
};

export const seed = async ({ adminEmail }) => {
  await createUsers({ adminEmail });
  logger.info(`Seed tjp-pilotage created`);
};
