// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";

import logger from "@/services/logger";

import { anonymizeUsersQuery, countUsersToAnonymizeQuery } from "./anonymizeUsers.dep";

export const [anonymizeUsers, anonymizeUsersFactory] = inject(
  {
    anonymizeUsersQuery,
    countUsersToAnonymizeQuery,
  },
  (deps) => async () => {
    const { count: nbOfUsers } = await deps.countUsersToAnonymizeQuery();
    logger.info(`Nombre d'utilisateurs à anonymizer : ${nbOfUsers}`);
    await deps.anonymizeUsersQuery();
  }
);
