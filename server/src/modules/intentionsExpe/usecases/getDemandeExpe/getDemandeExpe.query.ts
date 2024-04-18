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
  isDemandeExpeNotDeleted,
  isDemandeExpeSelectable,
} from "../../../utils/isDemandeSelectable";
import { getDemandeExpeSchema } from "./getDemandeExpe.schema";

export interface Filters extends z.infer<typeof getDemandeExpeSchema.params> {
  user: RequestUser;
}

export const getDemandeExpeQuery = async ({ numero, user }: Filters) => {
  const demandeExpe = await kdb
    .selectFrom("latestDemandeExpeView as demandeExpe")
    .selectAll()
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom("campagne")
          .selectAll("campagne")
          .whereRef("campagne.id", "=", "demandeExpe.campagneId")
          .limit(1)
      ).as("campagne"),
      jsonBuildObject({
        etablissement: jsonObjectFrom(
          eb
            .selectFrom("dataEtablissement")
            .selectAll("dataEtablissement")
            .whereRef("dataEtablissement.uai", "=", "demandeExpe.uai")
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
            .whereRef("dataFormation.cfd", "=", "demandeExpe.cfd")
            .limit(1)
        ),
      }).as("metadata"),
    ])
    .where(isDemandeExpeNotDeleted)
    .where(isDemandeExpeSelectable({ user }))
    .where("demandeExpe.numero", "=", numero)
    .orderBy("createdAt", "asc")
    .limit(1)
    .executeTakeFirst();

  const codeDispositif =
    demandeExpe?.codeDispositif &&
    demandeExpe.metadata.formation?.dispositifs.find(
      (item) => item.codeDispositif === demandeExpe?.codeDispositif
    )?.codeDispositif;

  return (
    demandeExpe &&
    cleanNull({
      ...demandeExpe,
      metadata: cleanNull({
        ...demandeExpe.metadata,
        formation: cleanNull(demandeExpe.metadata.formation),
        etablissement: cleanNull(demandeExpe.metadata.etablissement),
      }),
      createdAt: demandeExpe.createdAt?.toISOString(),
      campagne: cleanNull({
        ...demandeExpe.campagne,
      }),
      codeDispositif,
    })
  );
};
