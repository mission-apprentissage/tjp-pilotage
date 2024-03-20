import { kdb } from "../../../../db/db";

export const deleteDemandeQuery = async (id: string) => {
  await kdb
    .updateTable("demande")
    .set({ statut: "deleted" })
    .set({ dateModification: new Date() })
    .where("id", "=", id)
    .execute();
};
