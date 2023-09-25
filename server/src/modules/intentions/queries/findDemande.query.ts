import {
  jsonArrayFrom,
  jsonBuildObject,
  jsonObjectFrom,
} from "kysely/helpers/postgres";

import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";
import { RequestUser } from "../../core/model/User";
import { isDemandeSelectable } from "./utils/isDemandeSelectable.query";

export const findDemande = async ({
  id,
  user,
}: {
  id: string;
  user: Pick<RequestUser, "id" | "role" | "codeRegion">;
}) => {
  const demande = await kdb
    .selectFrom("demande")
    .selectAll()
    .select((eb) => [
      jsonBuildObject({
        etablissement: jsonObjectFrom(
          eb
            .selectFrom("dataEtablissement")
            .selectAll("dataEtablissement")
            .whereRef("dataEtablissement.uai", "=", "demande.uai")
            .limit(1)
        ),
        formation: jsonObjectFrom(
          eb
            .selectFrom("dataFormation")
            .select("libelle")
            .select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("dispositif")
                  .select(["libelleDispositif", "codeDispositif"])
                  .whereRef(
                    "codeNiveauDiplome",
                    "=",
                    "dataFormation.codeNiveauDiplome"
                  )
                  .distinctOn("codeDispositif")
              ).as("dispositifs")
            )
            .whereRef("dataFormation.cfd", "=", "demande.cfd")
            .limit(1)
        ),
      }).as("metadata"),
    ])
    .where(isDemandeSelectable({ user }))
    .where("id", "=", id)
    .orderBy("createdAt", "asc")
    .limit(1)
    .executeTakeFirst();

  const dispositifId =
    demande?.dispositifId &&
    demande.metadata.formation?.dispositifs.find(
      (item) => item.codeDispositif === demande?.dispositifId
    )?.codeDispositif;

  return (
    demande &&
    cleanNull({
      ...demande,
      metadata: cleanNull({
        ...demande.metadata,
        formation: cleanNull(demande.metadata.formation),
        etablissement: cleanNull(demande.metadata.etablissement),
      }),
      createdAt: demande.createdAt?.toISOString(),
      dispositifId,
    })
  );
};
