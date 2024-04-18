import Boom from "@hapi/boom";
import { sql } from "kysely";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import { isDemandeExpeCampagneEnCours } from "../../../utils/isDemandeCampagneEnCours";
import { isDemandeExpeSelectable } from "../../../utils/isDemandeSelectable";
import { getDemandesExpeSchema } from "./getDemandesExpe.schema";

export interface Filters
  extends z.infer<typeof getDemandesExpeSchema.querystring> {
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

export const getDemandesExpeQuery = async (
  { statut, search, user, offset = 0, limit = 20, order, orderBy }: Filters,
  anneeCampagne: string
) => {
  const cleanSearch =
    search?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ?? "";
  const search_array = cleanSearch.split(" ") ?? [];

  const demandesExpe = await kdb
    .selectFrom("latestDemandeExpeView as demandeExpe")
    .leftJoin("dataFormation", "dataFormation.cfd", "demandeExpe.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demandeExpe.uai")
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
      "demandeExpe.codeDispositif"
    )
    .leftJoin("user", "user.id", "demandeExpe.createurId")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demandeExpe.campagneId").$call((eb) => {
        if (anneeCampagne) return eb.on("campagne.annee", "=", anneeCampagne);
        return eb;
      })
    )
    .selectAll("demandeExpe")
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
      eb
        .selectFrom("demandeExpe as demandeImportee")
        .select(["demandeImportee.numero"])
        .whereRef("demandeImportee.numeroHistorique", "=", "demandeExpe.numero")
        .where(isDemandeExpeCampagneEnCours(eb, "demandeImportee"))
        .limit(1)
        .as("numeroDemandeImportee"),
    ])
    .$call((eb) => {
      if (statut) return eb.where("demandeExpe.statut", "=", statut);
      return eb;
    })
    .$call((eb) => {
      if (search)
        return eb.where((eb) =>
          eb.and(
            search_array.map((search_word) =>
              eb(
                sql`concat(
                  unaccent(${eb.ref("demandeExpe.numero")}),
                  ' ',
                  unaccent(${eb.ref("demandeExpe.cfd")}),
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
    .where(isDemandeExpeSelectable({ user }))
    .offset(offset)
    .limit(limit)
    .execute();

  const campagnes = await kdb
    .selectFrom("campagne")
    .selectAll()
    .orderBy("annee desc")
    .execute();

  return {
    demandes: demandesExpe.map((demandeExpe) =>
      cleanNull({
        ...demandeExpe,
        createdAt: demandeExpe.createdAt?.toISOString(),
        updatedAt: demandeExpe.updatedAt?.toISOString(),
      })
    ),
    count: parseInt(demandesExpe[0]?.count) || 0,
    campagnes: campagnes.map(cleanNull),
  };
};
