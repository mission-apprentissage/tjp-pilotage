import { getKbdClient } from "@/db/db";

export const isMaintenanceQuery = async () =>
  await getKbdClient()
    .selectFrom("maintenance")
    .selectAll()
    .executeTakeFirst()
    .then((maintenance) => {
      return {
        isMaintenance: maintenance?.isMaintenance || false,
      };
    });
