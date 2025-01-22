import { getKbdClient } from "@/db/db";

export const getCampagneById = async (id: string) => {
  return getKbdClient()
    .selectFrom("campagne")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
};
