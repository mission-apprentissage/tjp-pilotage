
import { getKbdClient } from "@/db/db";

export const deleteFormationEtablissement = async ({ id }: {id: string }) => {
  await getKbdClient().deleteFrom("indicateurSortie").where("formationEtablissementId", "=", id).execute();

  return await getKbdClient()
    .deleteFrom("formationEtablissement")
    .where(eb => (
      eb("id", "=", id)
    ))
    .execute();
};
