import { kdb } from "../../../../db/db";

export const deleteDemandeQuery = async (id: string) => {
  await kdb.deleteFrom("demande").where("id", "=", id).execute();
};
