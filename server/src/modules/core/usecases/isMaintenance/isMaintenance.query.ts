import { kdb } from "../../../../db/db";

export const isMaintenanceQuery = async () =>
  await kdb
    .selectFrom("maintenance")
    .selectAll()
    .executeTakeFirst()
    .then((maintenance) => {
      return {
        isMaintenance: maintenance?.isMaintenance || false,
      };
    });
