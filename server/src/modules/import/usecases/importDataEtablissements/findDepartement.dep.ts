import { getKbdClient } from "@/db/db";

export const findDepartement = async ({ codeDepartement }: { codeDepartement: string }) => {
  return getKbdClient()
    .selectFrom("departement")
    .selectAll("departement")
    .where("codeDepartement", "=", codeDepartement)
    .executeTakeFirst();
};
