import { sql } from "kysely";
import {
  jsonArrayFrom,
  jsonBuildObject,
  jsonObjectFrom,
} from "kysely/helpers/postgres";

import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";

export const findDemandes = async ({
  status,
  offset = 0,
  limit = 20,
  orderBy = { order: "asc", column: "createdBy" },
}: {
  status?: "draft" | "submitted";
  offset?: number;
  limit: number;
  orderBy?: { order: "asc" | "desc"; column: string };
}) => {
  const demandes = await kdb
    .selectFrom("demande")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("dispositif", "dispositif.codeDispositif", "demande.dispositifId")
    .selectAll("demande")
    .select("dataFormation.libelle as libelleDiplome")
    .select("dataEtablissement.libelle as libelleEtablissement")
    .select("dispositif.libelleDispositif as libelleDispositif")
    .select(sql<string>`count(*) over()`.as("count"))
    .select((eb) =>
      sql<boolean>`${eb.exists((eb) =>
        eb
          .selectFrom(["demande", "demande as demandeCompensee"])
          .where("demandeCompensee.typeDemande", "in", [
            "augmentation_compensation",
            "ouverture_compensation",
          ])
          .whereRef("demandeCompensee.cfd", "=", "demande.compensationCfd")
          .whereRef("demandeCompensee.uai", "=", "demande.compensationUai")
          .whereRef(
            "demandeCompensee.dispositifId",
            "=",
            "demande.compensationDispositifId"
          )
          .selectAll()
      )}`.as("estCompensee")
    )
    .select((eb) => [
      jsonBuildObject({
        etablissementCompensation: jsonObjectFrom(
          eb
            .selectFrom("dataEtablissement")
            .select(["dataEtablissement.libelle", "dataEtablissement.commune"])
            .whereRef("dataEtablissement.uai", "=", "demande.compensationUai")
            .limit(1)
        ),
        formationCompensation: jsonObjectFrom(
          eb
            .selectFrom("dataFormation")
            .select("libelle")
            .select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("dispositif")
                  .select([
                    "dispositif.libelleDispositif",
                    "dispositif.codeDispositif",
                  ])
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
                  .distinctOn("dispositif.codeDispositif")
              ).as("dispositifs")
            )
            .whereRef("dataFormation.cfd", "=", "demande.compensationCfd")
            .limit(1)
        ),
      }).as("metadata"),
    ])
    .$call((eb) => {
      if (status) return eb.where("demande.status", "=", status);
      return eb;
    })
    .$call((q) => {
      if (!orderBy) return q;
      return q.orderBy(
        sql.ref(orderBy.column),
        sql`${sql.raw(orderBy.order)} NULLS LAST`
      );
    })
    .offset(offset)
    .limit(limit)
    .execute();

  return {
    demandes: demandes.map((demande) =>
      cleanNull({
        ...demande,
        createdAt: demande.createdAt?.toISOString(),
      })
    ),
    count: parseInt(demandes[0]?.count) || 0,
  };
};
