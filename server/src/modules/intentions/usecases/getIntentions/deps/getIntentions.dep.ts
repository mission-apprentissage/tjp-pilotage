import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { castDemandeStatutWithoutSupprimee } from "../../../../utils/castDemandeStatut";
import { isIntentionCampagneEnCours } from "../../../../utils/isDemandeCampagneEnCours";
import {
  isIntentionBrouillonVisible,
  isIntentionSelectable,
} from "../../../../utils/isDemandeSelectable";
import { getNormalizedSearchArray } from "../../../../utils/normalizeSearch";
import { Filters } from "./getFilters.dep";

export const getIntentions = async (
  {
    statut,
    suivies,
    search,
    user,
    offset = 0,
    limit = 20,
    order,
    orderBy,
    codeAcademie,
    codeNiveauDiplome,
  }: Filters,
  anneeCampagne: string,
  shouldFetchOnlyIntention: boolean
) => {
  const search_array = getNormalizedSearchArray(search);

  const intentions = await kdb
    .selectFrom("latestDemandeIntentionView as intention")
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
    .leftJoin("suivi", (join) =>
      join
        .onRef("suivi.intentionNumero", "=", "intention.numero")
        .on("userId", "=", user.id)
    )
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "intention.campagneId").$call((eb) => {
        if (anneeCampagne) return eb.on("campagne.annee", "=", anneeCampagne);
        return eb;
      })
    )
    .selectAll("intention")
    .select((eb) => [
      "suivi.id as suiviId",
      sql<string>`CONCAT(${eb.ref("user.firstname")}, ' ',${eb.ref(
        "user.lastname"
      )})`.as("userName"),
      "dataFormation.libelleFormation",
      "dataEtablissement.libelleEtablissement",
      "departement.libelleDepartement",
      "departement.codeDepartement",
      "academie.libelleAcademie",
      "region.libelleRegion",
      "dispositif.libelleDispositif as libelleDispositif",
      sql<string>`count(*) over()`.as("count"),
      eb
        .selectFrom(({ selectFrom }) =>
          selectFrom("intention as intentionImportee")
            .select(["numero", "statut", "numeroHistorique"])
            .whereRef(
              "intentionImportee.numeroHistorique",
              "=",
              "intention.numero"
            )
            .where(isIntentionCampagneEnCours(eb, "intentionImportee"))
            .limit(1)
            .orderBy("updatedAt desc")
            .as("allIntentionImportee")
        )
        .select("allIntentionImportee.numero")
        .where(
          "allIntentionImportee.statut",
          "<>",
          DemandeStatutEnum["supprimée"]
        )
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
    .$call((q) => {
      if (suivies)
        return q.innerJoin("suivi as suiviUtilisateur", (join) =>
          join
            .onRef("suiviUtilisateur.intentionNumero", "=", "intention.numero")
            .on("suiviUtilisateur.userId", "=", user.id)
        );
      return q;
    })
    .$call((q) => {
      if (shouldFetchOnlyIntention)
        return q.where("intention.isIntention", "=", true);
      return q;
    })
    .$call((eb) => {
      if (codeAcademie) {
        return eb.where("academie.codeAcademie", "in", codeAcademie);
      }

      return eb;
    })
    .$call((eb) => {
      if (codeNiveauDiplome) {
        return eb.where(
          "dataFormation.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
      }

      return eb;
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
