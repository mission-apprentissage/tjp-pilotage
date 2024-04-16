import Boom from "@hapi/boom";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import { isDemandeCampagneEnCours } from "../../../utils/isDemandeCampagneEnCours";
import { isDemandeSelectable } from "../../../utils/isDemandeSelectable";
import { getDemandesSchema } from "./getDemandes.schema";

export interface Filters extends z.infer<typeof getDemandesSchema.querystring> {
  user: RequestUser;
}

export const getCampagneQuery = async (anneeCampagne: string) => {
  const campagne = await kdb
    .selectFrom("campagne")
    .selectAll()
    .where("annee", "=", anneeCampagne)
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.notFound(`Aucune campagne pour l'année ${anneeCampagne}`);
    });

  return campagne;
};

export const getDemandesQuery = async (
  { statut, search, user, offset = 0, limit = 20, order, orderBy }: Filters,
  anneeCampagne: string
) => {
  const cleanSearch =
    search?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ?? "";
  const search_array = cleanSearch.split(" ") ?? [];

  const demandes = await kdb
    .selectFrom("latestDemandeView as demande")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin(
      "departement",
      "departement.codeDepartement",
      "dataEtablissement.codeDepartement"
    )
    .leftJoin(
      "academie",
      "academie.codeAcademie",
      "dataEtablissement.codeAcademie"
    )
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "demande.codeDispositif"
    )
    .leftJoin("user", "user.id", "demande.createurId")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (anneeCampagne) return eb.on("campagne.annee", "=", anneeCampagne);
        return eb;
      })
    )
    .selectAll("demande")
    .select((eb) => [
      sql<string>`CONCAT(${eb.ref("user.firstname")}, ' ',${eb.ref(
        "user.lastname"
      )})`.as("userName"),
      "user.lastname as nomCreateur",
      "dataFormation.libelleFormation",
      "dataEtablissement.libelleEtablissement",
      "departement.libelleDepartement",
      "academie.libelleAcademie",
      "region.libelleRegion",
      "dispositif.libelleDispositif as libelleDispositif",
      sql<string>`count(*) over()`.as("count"),
      jsonObjectFrom(
        eb
          .selectFrom(["demande as demandeCompensee"])
          .whereRef("demandeCompensee.cfd", "=", "demande.compensationCfd")
          .whereRef("demandeCompensee.uai", "=", "demande.compensationUai")
          .whereRef(
            "demandeCompensee.codeDispositif",
            "=",
            "demande.compensationCodeDispositif"
          )
          .select(["demandeCompensee.numero", "demandeCompensee.typeDemande"])
          .limit(1)
      ).as("demandeCompensee"),
      eb
        .selectFrom("demande as demandeImportee")
        .select(["demandeImportee.numero"])
        .whereRef("demandeImportee.numeroHistorique", "=", "demande.numero")
        .where(isDemandeCampagneEnCours(eb, "demandeImportee"))
        .limit(1)
        .as("numeroDemandeImportee"),
    ])
    .$call((eb) => {
      if (statut) return eb.where("demande.statut", "=", statut);
      return eb;
    })
    .$call((eb) => {
      if (search)
        return eb.where((eb) =>
          eb.and(
            search_array.map((search_word) =>
              eb(
                sql`concat(
                  unaccent(${eb.ref("demande.numero")}),
                  ' ',
                  unaccent(${eb.ref("demande.cfd")}),
                  ' ',
                  unaccent(${eb.ref("dataFormation.libelleFormation")}),
                  ' ',
                  unaccent(${eb.ref("departement.libelleDepartement")}),
                  ' ',
                  unaccent(${eb.ref("dataEtablissement.libelleEtablissement")}),
                  ' ',
                  unaccent(${eb.ref("user.firstname")}),
                  ' ',
                  unaccent(${eb.ref("user.lastname")})
                )`,
                "ilike",
                `%${search_word
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")}%`
              )
            )
          )
        );
      return eb;
    })
    .$call((q) => {
      if (!orderBy || !order) return q;
      return q.orderBy(
        sql`${sql.ref(orderBy)}`,
        sql`${sql.raw(order)} NULLS LAST`
      );
    })
    .orderBy("updatedAt desc")
    .where(isDemandeSelectable({ user }))
    .offset(offset)
    .limit(limit)
    .execute();

  const campagnes = await kdb
    .selectFrom("campagne")
    .selectAll()
    .orderBy("annee desc")
    .execute();

  return {
    demandes: demandes.map((demande) =>
      cleanNull({
        ...demande,
        createdAt: demande.createdAt?.toISOString(),
        updatedAt: demande.updatedAt?.toISOString(),
        numeroCompensation: demande.demandeCompensee?.numero,
        typeCompensation: demande.demandeCompensee?.typeDemande ?? undefined,
      })
    ),
    count: parseInt(demandes[0]?.count) || 0,
    campagnes: campagnes.map(cleanNull),
  };
};
