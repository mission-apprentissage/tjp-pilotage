// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import logger from "@/services/logger";
import { inject } from "@/utils/inject";

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
