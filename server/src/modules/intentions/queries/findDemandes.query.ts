import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";
import { RequestUser } from "../../core/model/User";
import { isDemandeSelectable } from "./utils/isDemandeSelectable.query";

export const findDemandes = async ({
  status,
  user,
  offset = 0,
  limit = 20,
  orderBy = { order: "desc", column: "createdAt" },
}: {
  status?: "draft" | "submitted";
  user: Pick<RequestUser, "id" | "role" | "codeRegion">;
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
    .select((eb) => [
      "dataFormation.libelle as libelleDiplome",
      "dataEtablissement.libelle as libelleEtablissement",
      "dispositif.libelleDispositif as libelleDispositif",
      sql<string>`count(*) over()`.as("count"),
      jsonObjectFrom(
        eb
          .selectFrom(["demande as demandeCompensee"])
          .whereRef("demandeCompensee.cfd", "=", "demande.compensationCfd")
          .whereRef("demandeCompensee.uai", "=", "demande.compensationUai")
          .whereRef(
            "demandeCompensee.dispositifId",
            "=",
            "demande.compensationDispositifId"
          )
          .select(["demandeCompensee.id", "demandeCompensee.typeDemande"])
          .limit(1)
      ).as("demandeCompensee"),
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
    .where(isDemandeSelectable({ user }))
    .offset(offset)
    .limit(limit)
    .execute();

  return {
    demandes: demandes.map((demande) =>
      cleanNull({
        ...demande,
        createdAt: demande.createdAt?.toISOString(),
        idCompensation: demande.demandeCompensee?.id,
        typeCompensation: demande.demandeCompensee?.typeDemande ?? undefined,
      })
    ),
    count: parseInt(demandes[0]?.count) || 0,
  };
};
