// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";

import logger from "@/services/logger";

import { anonymiseUsersQuery, countUsersToAnonymiseQuery } from "./anonymiseUsers.dep";

export const [anonymiseUsers, anonymiseUsersFactory] = inject(
  {
    anonymiseUsersQuery: anonymiseUsersQuery,
    countUsersToAnonymiseQuery: countUsersToAnonymiseQuery,
  },
  (deps) => async () => {
    const { count: nbOfUsers } = await deps.countUsersToAnonymiseQuery();
    logger.info(`Nombre d'utilisateurs à anonymiser : ${nbOfUsers}`);
    await deps.anonymiseUsersQuery();
  }
);
