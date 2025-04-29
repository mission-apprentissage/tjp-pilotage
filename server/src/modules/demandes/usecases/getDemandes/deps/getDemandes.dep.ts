import { sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import type { DemandeStatutTypeWithoutSupprimee} from 'shared/enum/demandeStatutEnum';
import {DemandeStatutEnum} from 'shared/enum/demandeStatutEnum';
import type {TypeDemandeType} from 'shared/enum/demandeTypeEnum';
import { MAX_LIMIT } from "shared/utils/maxLimit";

import { getKbdClient } from "@/db/db";
import type { Filters } from "@/modules/demandes/usecases/getDemandes/getDemandes.usecase";
import { isAvisVisible } from "@/modules/utils/isAvisVisible";
import { isDemandeCampagneEnCours } from "@/modules/utils/isDemandeCampagneEnCours";
import { isDemandeBrouillonVisible, isDemandeSelectable } from "@/modules/utils/isDemandeSelectable";
import { getNormalizedSearchArray } from "@/modules/utils/normalizeSearch";
import { cleanNull } from "@/utils/noNull";


export const getDemandesQuery = async (
  {
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
  }: Filters,
) => {
  const search_array = getNormalizedSearchArray(search);

  const demandes = await getKbdClient()
    .selectFrom("latestDemandeView as demande")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .leftJoin("academie", "academie.codeAcademie", "dataEtablissement.codeAcademie")
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin("dispositif", "dispositif.codeDispositif", "demande.codeDispositif")
    .leftJoin(
      (join) =>
        join
          .selectFrom("changementStatut")
          .select(["changementStatut.demandeNumero", "changementStatut.statut", "changementStatut.commentaire"])
          .distinctOn(["changementStatut.demandeNumero"])
          .orderBy("changementStatut.demandeNumero", "desc")
          .orderBy("changementStatut.updatedAt", "desc")
          .as("changementStatut"),
      (join) =>
        join
          .onRef("changementStatut.demandeNumero", "=", "demande.numero")
          .onRef("changementStatut.statut", "=", "demande.statut")
    )
    .leftJoin("user", "user.id", "demande.createdBy")
    .leftJoin("suivi", (join) =>
      join.onRef("suivi.demandeNumero", "=", "demande.numero").on("userId", "=", user.id)
    )
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (campagne) return eb.on("campagne.annee", "=", campagne);
        return eb;
      })
    )
    .leftJoin("demandeAccessLog", (join) =>
      join
        .onRef("demandeAccessLog.demandeNumero", "=", "demande.numero")
        .onRef("demandeAccessLog.updatedAt", ">", "demande.updatedAt")
        .on("demandeAccessLog.userId", "=", user.id)
    )
    .selectAll("demande")
    .select((eb) => [
      "suivi.id as suiviId",
      "dataFormation.libelleFormation",
      "dataEtablissement.libelleEtablissement",
      "departement.libelleDepartement",
      "departement.codeDepartement",
      "academie.libelleAcademie",
      "region.libelleRegion",
      "dispositif.libelleDispositif",
      "changementStatut.commentaire as lastChangementStatutCommentaire",
      sql<string>`CONCAT(${eb.ref("user.firstname")}, ' ',${eb.ref("user.lastname")})`.as("userName"),
      eb.or([
        eb("demandeAccessLog.id", "is not", null),
        eb("demande.updatedBy", "=", user.id),
      ]).as("alreadyAccessed"),
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
      jsonArrayFrom(
        eb
          .selectFrom("avis")
          .whereRef("avis.demandeNumero", "=", "demande.numero")
          .select(({ ref }) => [
            ref("avis.id").as("id"),
            ref("avis.statutAvis").as("statut"),
            ref("avis.commentaire").as("commentaire"),
            ref("avis.typeAvis").as("type"),
            ref("avis.userFonction").as("fonction"),
          ])
          .where(isAvisVisible({ user }))
      ).as("avis"),
      eb
        .selectFrom("correction")
        .whereRef("correction.demandeNumero", "=", "demande.numero")
        .select("correction.id")
        .limit(1)
        .as("correction")
    ])
    .$narrowType<{
      statut: DemandeStatutTypeWithoutSupprimee,
      typeDemande: TypeDemandeType
    }>()
    .$call((eb) => {
      if (statut) {
        if (statut === "suivies")
          return eb.innerJoin("suivi as suiviUtilisateur", (join) =>
            join
              .onRef("suiviUtilisateur.demandeNumero", "=", "demande.numero")
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
      if (codeAcademie) {
        return eb.where("academie.codeAcademie", "in", codeAcademie);
      }
      return eb;
    })
    .$call((eb) => {
      if (codeNiveauDiplome) {
        return eb.where("dataFormation.codeNiveauDiplome", "in", codeNiveauDiplome);
      }
      return eb;
    })
    .orderBy("updatedAt desc")
    .where(isDemandeSelectable({ user }))
    .where(isDemandeBrouillonVisible({ user }))
    .offset(offset)
    .limit(limit)
    .execute();

  return {
    demandes: demandes.map((demande) =>
      cleanNull({
        ...demande,
        avis: demande.avis.filter((c) => c).map((avis) => avis),
        createdAt: demande.createdAt?.toISOString(),
        updatedAt: demande.updatedAt?.toISOString(),
        alreadyAccessed: !!(demande.alreadyAccessed ?? true),
        isOldDemande: demande.isOldDemande ?? false,
      })
    ),
    count: parseInt(demandes[0]?.count) || 0,
  };
};
