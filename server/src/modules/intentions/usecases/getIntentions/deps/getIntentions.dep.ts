import { sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { castDemandeStatutWithoutSupprimee } from "../../../../utils/castDemandeStatut";
import { isAvisVisible } from "../../../../utils/isAvisVisible";
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
    search,
    user,
    offset = 0,
    limit = 20,
    order,
    orderBy,
    codeAcademie,
    codeNiveauDiplome,
    campagne,
  }: Filters,
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
    .leftJoin(
      (join) =>
        join
          .selectFrom("changementStatut")
          .select([
            "changementStatut.intentionNumero",
            "changementStatut.statut",
            "changementStatut.commentaire",
          ])
          .distinctOn(["changementStatut.intentionNumero"])
          .orderBy("changementStatut.intentionNumero", "desc")
          .orderBy("changementStatut.updatedAt", "desc")
          .as("changementStatut"),
      (join) =>
        join
          .onRef("changementStatut.intentionNumero", "=", "intention.numero")
          .onRef("changementStatut.statut", "=", "intention.statut")
    )
    .leftJoin("user", "user.id", "intention.createdBy")
    .leftJoin("suivi", (join) =>
      join
        .onRef("suivi.intentionNumero", "=", "intention.numero")
        .on("userId", "=", user.id)
    )
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "intention.campagneId").$call((eb) => {
        if (campagne) return eb.on("campagne.annee", "=", campagne);
        return eb;
      })
    )
    .leftJoin("intentionAccessLog", (join) =>
      join
        .onRef("intentionAccessLog.intentionNumero", "=", "intention.numero")
        .onRef("intentionAccessLog.updatedAt", ">", "intention.updatedAt")
        .on("intentionAccessLog.userId", "=", user.id)
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
      sql<boolean>`(
        "intentionAccessLog"."id" is not null
         or "intention"."updatedBy" = ${user.id}
      )`.as("alreadyAccessed"),
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
      jsonArrayFrom(
        eb
          .selectFrom("avis")
          .whereRef("avis.intentionNumero", "=", "intention.numero")
          .select(({ ref }) => [
            ref("avis.id").as("id"),
            ref("avis.statutAvis").as("statut"),
            ref("avis.commentaire").as("commentaire"),
            ref("avis.typeAvis").as("type"),
            ref("avis.userFonction").as("fonction"),
          ])
          .where(isAvisVisible({ user }))
      ).as("avis"),
      "changementStatut.commentaire as lastChangementStatutCommentaire",
    ])
    .select((eb) =>
      eb
        .selectFrom("correction")
        .whereRef("correction.intentionNumero", "=", "intention.numero")
        .select("correction.id")
        .limit(1)
        .as("correction")
    )
    .$call((eb) => {
      if (statut) {
        if (statut === "suivies")
          return eb.innerJoin("suivi as suiviUtilisateur", (join) =>
            join
              .onRef(
                "suiviUtilisateur.intentionNumero",
                "=",
                "intention.numero"
              )
              .on("suiviUtilisateur.userId", "=", user.id)
          );
        return eb.where("intention.statut", "=", statut);
      }
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
                  unaccent(${eb.ref("dataFormation.libelleFormation")}),
                  ' ',
                  unaccent(${eb.ref("dataEtablissement.libelleEtablissement")})
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
        avis: intention.avis.filter((c) => c).map((avis) => avis),
        statut: castDemandeStatutWithoutSupprimee(intention.statut),
        createdAt: intention.createdAt?.toISOString(),
        updatedAt: intention.updatedAt?.toISOString(),
        alreadyAccessed: intention.alreadyAccessed ?? true,
      })
    ),
    count: parseInt(intentions[0]?.count) || 0,
    campagnes: campagnes.map(cleanNull),
  };
};
