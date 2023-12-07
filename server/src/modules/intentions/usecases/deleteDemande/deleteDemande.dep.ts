import { kdb } from "../../../../db/db";

export const deleteDemandeQuery = async (id: string) => {
  await kdb
    .updateTable("demande")
    .set({ status: "deleted" })
    .where("id", "=", id)
    .execute();
};
