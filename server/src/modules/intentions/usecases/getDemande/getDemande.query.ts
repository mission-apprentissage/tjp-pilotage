import { sql } from "kysely";
import {
  jsonArrayFrom,
  jsonBuildObject,
  jsonObjectFrom,
} from "kysely/helpers/postgres";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import {
  isDemandeNotDeleted,
  isDemandeSelectable,
} from "../../../utils/isDemandeSelectable";
import { getDemandeSchema } from "./getDemande.schema";

export interface Filters extends z.infer<typeof getDemandeSchema.params> {
  user: RequestUser;
}

export const findDemande = async ({ numero, user }: Filters) => {
  const demande = await kdb
    .selectFrom("latestDemandeView as demande")
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
            .leftJoin(
              "niveauDiplome",
              "niveauDiplome.codeNiveauDiplome",
              "dataFormation.codeNiveauDiplome"
            )
            .select((ebDataFormation) => [
              sql<string>`CONCAT(${ebDataFormation.ref(
                "dataFormation.libelleFormation"
              )},
              ' (',${ebDataFormation.ref(
                "niveauDiplome.libelleNiveauDiplome"
              )},')',
              ' (',${ebDataFormation.ref("dataFormation.cfd")},')')`.as(
                "libelleFormation"
              ),
              sql<boolean>`${ebDataFormation(
                "dataFormation.codeNiveauDiplome",
                "in",
                ["381", "481", "581"]
              )}`.as("isFCIL"),
            ])
            .select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("dispositif")
                  .select(["libelleDispositif", "codeDispositif"])
                  .leftJoin("rawData", (join) =>
                    join
                      .onRef(
                        sql`"data"->>'DISPOSITIF_FORMATION'`,
                        "=",
                        "dispositif.codeDispositif"
                      )
                      .on("rawData.type", "=", "nMef")
                  )
                  .whereRef(
                    sql`"data"->>'FORMATION_DIPLOME'`,
                    "=",
                    "dataFormation.cfd"
                  )
                  .distinctOn("codeDispositif")
              ).as("dispositifs")
            )
            .whereRef("dataFormation.cfd", "=", "demande.cfd")
            .limit(1)
        ),
        etablissementCompensation: jsonObjectFrom(
          eb
            .selectFrom("dataEtablissement")
            .selectAll("dataEtablissement")
            .whereRef("dataEtablissement.uai", "=", "demande.compensationUai")
            .limit(1)
        ),
        formationCompensation: jsonObjectFrom(
          eb
            .selectFrom("dataFormation")
            .leftJoin(
              "niveauDiplome",
              "niveauDiplome.codeNiveauDiplome",
              "dataFormation.codeNiveauDiplome"
            )
            .select((ebDataFormation) => [
              sql<string>`CONCAT(${ebDataFormation.ref(
                "dataFormation.libelleFormation"
              )},
              ' (',${ebDataFormation.ref(
                "niveauDiplome.libelleNiveauDiplome"
              )},')',
              ' (',${ebDataFormation.ref("dataFormation.cfd")},')')`.as(
                "libelleFormation"
              ),
              sql<boolean>`${ebDataFormation(
                "dataFormation.codeNiveauDiplome",
                "in",
                ["381", "481", "581"]
              )}`.as("isFCIL"),
            ])
            .select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("dispositif")
                  .select(["libelleDispositif", "codeDispositif"])
                  .leftJoin("rawData", (join) =>
                    join
                      .onRef(
                        sql`"data"->>'DISPOSITIF_FORMATION'`,
                        "=",
                        "dispositif.codeDispositif"
                      )
                      .on("rawData.type", "=", "nMef")
                  )
                  .whereRef(
                    sql`"data"->>'FORMATION_DIPLOME'`,
                    "=",
                    "dataFormation.cfd"
                  )
                  .distinctOn("codeDispositif")
              ).as("dispositifs")
            )
            .whereRef("dataFormation.cfd", "=", "demande.compensationCfd")
            .limit(1)
        ),
      }).as("metadata"),
    ])
    .where(isDemandeNotDeleted)
    .where(isDemandeSelectable({ user }))
    .where("demande.numero", "=", numero)
    .orderBy("dateCreation", "asc")
    .limit(1)
    .executeTakeFirst();

  const codeDispositif =
    demande?.codeDispositif &&
    demande.metadata.formation?.dispositifs.find(
      (item) => item.codeDispositif === demande?.codeDispositif
    )?.codeDispositif;

  return (
    demande &&
    cleanNull({
      ...demande,
      metadata: cleanNull({
        ...demande.metadata,
        formation: cleanNull(demande.metadata.formation),
        etablissement: cleanNull(demande.metadata.etablissement),
        formationCompensation: cleanNull(
          demande.metadata.formationCompensation
        ),
        etablissementCompensation: cleanNull(
          demande.metadata.etablissementCompensation
        ),
      }),
      dateCreation: demande.dateCreation?.toISOString(),
      codeDispositif,
    })
  );
};
