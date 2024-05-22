import Boom from "@hapi/boom";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import { castDemandeStatutWithoutSupprimee } from "../../../utils/castDemandeStatut";
import { isIntentionCampagneEnCours } from "../../../utils/isDemandeCampagneEnCours";
import {
  isIntentionBrouillonVisible,
  isIntentionSelectable,
} from "../../../utils/isDemandeSelectable";
import { getNormalizedSearchArray } from "../../../utils/normalizeSearch";
import { getIntentionsSchema } from "./getIntentions.schema";

export interface Filters
  extends z.infer<typeof getIntentionsSchema.querystring> {
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

export const getIntentionsQuery = async (
  { statut, search, user, offset = 0, limit = 20, order, orderBy }: Filters,
  anneeCampagne: string
) => {
  const search_array = getNormalizedSearchArray(search);

  const intentions = await kdb
    .selectFrom("latestIntentionView as intention")
    .leftJoin("dataFormation", "dataFormation.cfd", "intention.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "intention.uai")
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
      "intention.codeDispositif"
    )
    .leftJoin("user", "user.id", "intention.createdBy")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "intention.campagneId").$call((eb) => {
        if (anneeCampagne) return eb.on("campagne.annee", "=", anneeCampagne);
        return eb;
      })
    )
    .selectAll("intention")
    .select((eb) => [
      sql<string>`CONCAT(${eb.ref("user.firstname")}, ' ',${eb.ref(
        "user.lastname"
      )})`.as("userName"),
      "dataFormation.libelleFormation",
      "dataEtablissement.libelleEtablissement",
      "departement.libelleDepartement",
      "academie.libelleAcademie",
      "region.libelleRegion",
      "dispositif.libelleDispositif as libelleDispositif",
      sql<string>`count(*) over()`.as("count"),
      eb
        .selectFrom("intention as demandeImportee")
        .select(["demandeImportee.numero"])
        .whereRef("demandeImportee.numeroHistorique", "=", "intention.numero")
        .where(isIntentionCampagneEnCours(eb, "demandeImportee"))
        .limit(1)
        .as("numeroDemandeImportee"),
      jsonObjectFrom(
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "intention.createdBy")
          .select((eb) => [
            sql<string>`CONCAT(${eb.ref("user.firstname")}, ' ',${eb.ref(
              "user.lastname"
            )})`.as("fullname"),
            "user.id",
            "user.role",
          ])
          .where("intention.createdBy", "is not", null)
      ).as("createdBy"),
      jsonObjectFrom(
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "intention.updatedBy")
          .select((eb) => [
            sql<string>`CONCAT(${eb.ref("user.firstname")}, ' ',${eb.ref(
              "user.lastname"
            )})`.as("fullname"),
            "user.id",
            "user.role",
          ])
          .where("intention.updatedBy", "is not", null)
      ).as("updatedBy"),
    ])
    .$call((eb) => {
      if (statut) return eb.where("intention.statut", "=", statut);
      return eb;
    })
    .$call((eb) => {
      if (search)
        return eb.where((eb) =>
          eb.and(
            search_array.map((search_word) =>
              eb(
                sql`concat(
                  unaccent(${eb.ref("intention.numero")}),
                  ' ',
                  unaccent(${eb.ref("intention.cfd")}),
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
                `%${search_word}%`
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
    .where(isIntentionSelectable({ user }))
    .where(isIntentionBrouillonVisible({ user }))
    .offset(offset)
    .limit(limit)
    .execute();

  const campagnes = await kdb
    .selectFrom("campagne")
    .selectAll()
    .orderBy("annee desc")
    .execute();

  return {
    intentions: intentions.map((intention) =>
      cleanNull({
        ...intention,
        statut: castDemandeStatutWithoutSupprimee(intention.statut),
        createdAt: intention.createdAt?.toISOString(),
        updatedAt: intention.updatedAt?.toISOString(),
      })
    ),
    count: parseInt(intentions[0]?.count) || 0,
    campagnes: campagnes.map(cleanNull),
  };
};
