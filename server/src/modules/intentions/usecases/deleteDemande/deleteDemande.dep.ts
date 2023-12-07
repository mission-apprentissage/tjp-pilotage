import { kdb } from "../../../../db/db";

export const deleteDemandeQuery = async (id: string) => {
  await kdb
    .updateTable("demande")
    .set({ status: "deleted" })
    .set({ updatedAt: new Date() })
    .where("id", "=", id)
    .execute();
};
