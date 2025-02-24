import { sql } from "kysely";
import { jsonArrayFrom, jsonBuildObject, jsonObjectFrom } from "kysely/helpers/postgres";

import { getKbdClient } from "@/db/db";
import { castDemandeStatutWithoutSupprimee } from "@/modules/utils/castDemandeStatut";
import { castTypeDemande } from "@/modules/utils/castTypeDemande";
import { cleanNull } from "@/utils/noNull";

export const getIntentionWithMetadata = async (id: string) => {
  const demande = await getKbdClient()
    .selectFrom("demandeIntentionView as intention")
    .selectAll("intention")
    .select((eb) => [
      jsonBuildObject({
        etablissement: jsonObjectFrom(
          eb
            .selectFrom("dataEtablissement")
            .selectAll("dataEtablissement")
            .whereRef("dataEtablissement.uai", "=", "intention.uai")
            .limit(1)
        ),
        formation: jsonObjectFrom(
          eb
            .selectFrom("dataFormation")
            .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
            .select((ebDataFormation) => [
              sql<string>`CONCAT(${ebDataFormation.ref("dataFormation.libelleFormation")},
            ' (',${ebDataFormation.ref("niveauDiplome.libelleNiveauDiplome")},')',
            ' (',${ebDataFormation.ref("dataFormation.cfd")},')')`.as("libelleFormation"),
              sql<boolean>`${ebDataFormation("dataFormation.codeNiveauDiplome", "in", ["381", "481", "581"])}`.as(
                "isFCIL"
              ),
            ])
            .select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("dispositif")
                  .select(["libelleDispositif", "codeDispositif"])
                  .leftJoin("rawData", (join) =>
                    join
                      .onRef(sql`"data"->>'DISPOSITIF_FORMATION'`, "=", "dispositif.codeDispositif")
                      .on("rawData.type", "=", "nMef")
                  )
                  .whereRef(sql`"data"->>'FORMATION_DIPLOME'`, "=", "dataFormation.cfd")
                  .distinctOn("codeDispositif")
              ).as("dispositifs")
            )
            .whereRef("dataFormation.cfd", "=", "intention.cfd")
            .limit(1)
        ),
      }).as("metadata"),
    ])
    .where("intention.id", "=", id)
    .executeTakeFirstOrThrow()
    .then(cleanNull);

  const codeDispositif =
    demande?.codeDispositif &&
    demande.metadata.formation?.dispositifs.find((item) => item.codeDispositif === demande?.codeDispositif)
      ?.codeDispositif;

  return (
    demande &&
    cleanNull({
      ...demande,
      metadata: cleanNull({
        ...demande.metadata,
        formation: cleanNull(demande.metadata.formation),
        etablissement: cleanNull(demande.metadata.etablissement),
      }),
      statut: castDemandeStatutWithoutSupprimee(demande.statut),
      typeDemande: castTypeDemande(demande.typeDemande),
      createdAt: demande.createdAt?.toISOString(),
      codeDispositif,
    })
  );
};
