import { sql } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { getKbdClient } from "@/db/db";
import {
  isDemandeBrouillonVisible,
  isDemandeSelectable,
} from "@/modules/utils/isDemandeSelectable";
import { getNormalizedSearchArray } from "@/modules/utils/searchHelpers";
import { cleanNull } from "@/utils/noNull";

import type { Filters } from "./countDemandes.usecase";

export const countDemandesQuery = async ({
  user,
  campagne,
  search,
  codeAcademie,
  codeDepartement,
  commune,
  uai,
  codeNiveauDiplome,
  codeNsf,
  cfd,
  nomCmq,
  filiereCmq
}: Filters) => {
  const search_array = getNormalizedSearchArray(search);
  const countDemandes = getKbdClient()
    .selectFrom("latestDemandeView as demande")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .leftJoin("academie", "academie.codeAcademie", "dataEtablissement.codeAcademie")
    .leftJoin("user", "user.id", "demande.createdBy")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
    .leftJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
    .innerJoin("campagne", "campagne.id", "demande.campagneId")
    .leftJoin("suivi", (join) =>
      join.onRef("suivi.demandeNumero", "=", "demande.numero").on("suivi.userId", "=", user.id)
    )
    .select((eb) => sql<number>`count(${eb.ref("demande.numero")})`.as("total"))
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demande.statut")} = ${DemandeStatutEnum["proposition"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["proposition"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demande.statut")} = ${DemandeStatutEnum["projet de demande"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["projet de demande"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demande.statut")} = ${DemandeStatutEnum["demande validée"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["demande validée"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demande.statut")} = ${DemandeStatutEnum["refusée"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["refusée"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demande.statut")} = ${DemandeStatutEnum["brouillon"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["brouillon"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demande.statut")} = ${DemandeStatutEnum["dossier complet"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["dossier complet"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demande.statut")} = ${DemandeStatutEnum["dossier incomplet"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["dossier incomplet"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("demande.statut")} = ${DemandeStatutEnum["prêt pour le vote"]}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as(DemandeStatutEnum["prêt pour le vote"])
    )
    .select((eb) =>
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("suivi.userId")} = ${user.id}
          THEN 1
          ELSE 0
          END
        ),
        0
      )`.as("suivies")
    )
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
                  unaccent(${eb.ref("dataFormation.cfd")}),
                  ' ',
                  unaccent(${eb.ref("dataEtablissement.libelleEtablissement")}),
                  ' ',
                  unaccent(${eb.ref("dataEtablissement.uai")}),
                  ' ',
                  unaccent(${eb.ref("nsf.libelleNsf")}),
                  ' ',
                  unaccent(${eb.ref("demande.nomCmq")}),
                  ' ',
                  unaccent(${eb.ref("demande.filiereCmq")}),
                  ' ',
                  unaccent(${eb.ref("demande.inspecteurReferent")})
                )`,
                "ilike",
                `%${search_word}%`
              )
            )
          )
        );
      return eb;
    })
    .$call((eb) => {
      if (codeAcademie) return eb.where("academie.codeAcademie", "in", codeAcademie);
      return eb;
    })
    .$call((eb) => {
      if (codeDepartement) return eb.where("departement.codeDepartement", "in", codeDepartement);
      return eb;
    })
    .$call((eb) => {
      if (commune) return eb.where("dataEtablissement.commune", "in", commune);
      return eb;
    })
    .$call((eb) => {
      if (uai) return eb.where("dataEtablissement.uai", "in", uai);
      return eb;
    })
    .$call((eb) => {
      if (codeNiveauDiplome) return eb.where("dataFormation.codeNiveauDiplome", "in", codeNiveauDiplome);
      return eb;
    })
    .$call((eb) => {
      if (codeNsf) return eb.where("dataFormation.codeNsf", "in", codeNsf);
      return eb;
    })
    .$call((eb) => {
      if (cfd) return eb.where("dataFormation.cfd", "in", cfd);
      return eb;
    })
    .$call((eb) => {
      if (nomCmq) return eb.where("demande.nomCmq", "in", nomCmq);
      return eb;
    })
    .$call((eb) => {
      if (filiereCmq) return eb.where("demande.filiereCmq", "in", filiereCmq);
      return eb;
    })
    .$call((eb) => {
      if (campagne) return eb.where("campagne.annee", "=", campagne);
      return eb;
    })
    .where(isDemandeSelectable({ user }))
    .where(isDemandeBrouillonVisible({ user }))
    .executeTakeFirstOrThrow()
    .then(cleanNull);

  return countDemandes;
};
