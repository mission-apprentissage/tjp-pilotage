import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { MAX_LIMIT } from "shared/utils/maxLimit";

import { getKbdClient } from "@/db/db";
import type {Filters} from '@/modules/demandes/usecases/getDemandes/getDemandes.usecase';
import { castDemandeStatutWithoutSupprimee } from "@/modules/utils/castDemandeStatut";
import {castTypeDemande} from '@/modules/utils/castTypeDemande';
import { isDemandeCampagneEnCours } from "@/modules/utils/isDemandeCampagneEnCours";
import { isDemandeSelectable } from "@/modules/utils/isDemandeSelectable";
import { getNormalizedSearchArray } from "@/modules/utils/normalizeSearch";
import { cleanNull } from "@/utils/noNull";

export const getDemandesQuery = async ({
  campagne,
  statut,
  codeAcademie,
  codeNiveauDiplome,
  user,
  search,
  offset = 0,
  limit = MAX_LIMIT,
  order,
  orderBy,
}: Filters) => {
  const search_array = getNormalizedSearchArray(search);

  const demandes = await getKbdClient()
    .selectFrom("latestDemandeIntentionView as demande")
    .innerJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .leftJoin("academie", "academie.codeAcademie", "dataEtablissement.codeAcademie")
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin("dispositif", "dispositif.codeDispositif", "demande.codeDispositif")
    .leftJoin("user", "user.id", "demande.createdBy")
    .leftJoin("suivi", (join) => join.onRef("suivi.intentionNumero", "=", "demande.numero").on("userId", "=", user.id))
    .innerJoin("campagne", "demande.campagneId", "campagne.id")
    .leftJoin("intentionAccessLog", (join) =>
      join
        .onRef("intentionAccessLog.intentionNumero", "=", "demande.numero")
        .onRef("intentionAccessLog.updatedAt", ">", "demande.updatedAt")
        .on("intentionAccessLog.userId", "=", user.id)
    )
    .selectAll("demande")
    .select((eb) => [
      "demande.isIntention",
      "suivi.id as suiviId",
      sql<string>`CONCAT(
        ${eb.ref("user.firstname")},
        ' ',
        ${eb.ref("user.lastname")}
      )`.as("userName"),
      sql<boolean>`(
        "intentionAccessLog"."id" is not null
         OR "demande"."updatedBy" = ${user.id}
      )`.as("alreadyAccessed"),
      "dataFormation.libelleFormation",
      "dataEtablissement.libelleEtablissement",
      "departement.codeDepartement",
      "departement.libelleDepartement",
      "academie.libelleAcademie",
      "region.libelleRegion",
      "dispositif.libelleDispositif",
      sql<string>`count(*) over()`.as("count"),
      eb
        .selectFrom((eb) =>
          eb
            .selectFrom("demande as demandeImportee")
            .select(["numero", "statut", "numeroHistorique"])
            .whereRef("demandeImportee.numeroHistorique", "=", "demande.numero")
            .where(isDemandeCampagneEnCours(eb, "demandeImportee"))
            .limit(1)
            .orderBy("updatedAt desc")
            .as("allDemandeImportee")
        )
        .select("allDemandeImportee.numero")
        .where("allDemandeImportee.statut", "<>", DemandeStatutEnum["supprimée"])
        .as("numeroDemandeImportee"),
      jsonObjectFrom(
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "demande.createdBy")
          .select((eb) => [
            sql<string>`CONCAT(${eb.ref("user.firstname")}, ' ',${eb.ref("user.lastname")})`.as("fullname"),
            "user.id",
            "user.role",
          ])
          .where("demande.createdBy", "is not", null)
      ).as("createdBy"),
      jsonObjectFrom(
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "demande.updatedBy")
          .select((eb) => [
            sql<string>`CONCAT(${eb.ref("user.firstname")}, ' ',${eb.ref("user.lastname")})`.as("fullname"),
            "user.id",
            "user.role",
          ])
          .where("demande.updatedBy", "is not", null)
      ).as("updatedBy"),
      eb
        .selectFrom("correction")
        .whereRef("correction.intentionNumero", "=", "demande.numero")
        .select("correction.id")
        .limit(1)
        .as("correction"),
    ])
    .$call((eb) => {
      if (statut) {
        if (statut === "suivies")
          return eb.innerJoin("suivi as suiviUtilisateur", (join) =>
            join
              .onRef("suiviUtilisateur.intentionNumero", "=", "demande.numero")
              .on("suiviUtilisateur.userId", "=", user.id)
          );
        return eb.where("demande.statut", "=", statut);
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
                  unaccent(${eb.ref("demande.numero")}),
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
      return q.orderBy(sql`${sql.ref(orderBy)}`, sql`${sql.raw(order)} NULLS LAST`);
    })
    .$call((eb) => {
      if (codeAcademie) return eb.where("academie.codeAcademie", "in", codeAcademie);
      return eb;
    })
    .$call((eb) => {
      if (codeNiveauDiplome) return eb.where("dataFormation.codeNiveauDiplome", "in", codeNiveauDiplome);
      return eb;
    })
    .where("campagne.annee", "=", campagne)
    .orderBy("updatedAt desc")
    .where(isDemandeSelectable({ user }))
    .offset(offset)
    .limit(limit)
    .execute();

  return {
    demandes: demandes.map((demande) =>
      cleanNull({
        ...demande,
        statut: castDemandeStatutWithoutSupprimee(demande.statut),
        typeDemande: castTypeDemande(demande.typeDemande),
        createdAt: demande.createdAt?.toISOString(),
        updatedAt: demande.updatedAt?.toISOString(),
        alreadyAccessed: demande.alreadyAccessed ?? true,
      })
    ),
    count: parseInt(demandes[0]?.count) || 0,
  };
};
