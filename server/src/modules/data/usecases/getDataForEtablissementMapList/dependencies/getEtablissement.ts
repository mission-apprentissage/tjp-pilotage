import { sql } from "kysely";
import { z } from "zod";

import { kdb } from "../../../../../db/db";
import { effectifAnnee } from "../../../utils/effectifAnnee";
import { selectTauxInsertion6mois } from "../../../utils/tauxInsertion6mois";
import { selectTauxPoursuite } from "../../../utils/tauxPoursuite";
import { getDataForEtablissementMapListSchema } from "../getDataForEtablissementMapList.schema";

export interface Filters
  extends z.infer<typeof getDataForEtablissementMapListSchema.params> {
  cfd?: string[];
}

export const getEtablissement = async ({ uai, cfd }: Filters) =>
  await kdb
    .selectFrom("etablissement")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.uai",
      "etablissement.uai"
    )
    .leftJoin(
      "dataFormation",
      "dataFormation.cfd",
      "formationEtablissement.cfd"
    )
    .leftJoin(
      "indicateurEntree",
      "indicateurEntree.formationEtablissementId",
      "formationEtablissement.id"
    )
    .leftJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "formationEtablissement.codeDispositif"
    )
    .leftJoin(
      "indicateurSortie",
      "indicateurSortie.formationEtablissementId",
      "formationEtablissement.id"
    )
    .innerJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .innerJoin(
      "academie",
      "academie.codeAcademie",
      "etablissement.codeAcademie"
    )
    .distinct()
    .select((sb) => [
      "dataFormation.libelleFormation",
      sql<string[]>`array_agg(distinct ${sb.ref(
        "formationEtablissement.voie"
      )})`.as("voies"),
      sql<string[]>`array_agg(distinct ${sb.ref(
        "dispositif.libelleDispositif"
      )})`.as("libellesDispositifs"),
      "etablissement.uai",
      "etablissement.codeDepartement",
      "etablissement.commune",
      "etablissement.longitude",
      "etablissement.latitude",
      "etablissement.secteur",
      sql<string>`trim(split_part(split_part(split_part(split_part(${sb.ref(
        "etablissement.libelleEtablissement"
      )},' - Lycée',1),' -Lycée',1),',',1),' : ',1))`.as(
        "libelleEtablissement"
      ),
      "region.libelleRegion",
      "academie.libelleAcademie",
      selectTauxPoursuite("indicateurSortie").as("tauxPoursuite"),
      selectTauxInsertion6mois("indicateurSortie").as("tauxInsertion"),
      effectifAnnee({ alias: "indicateurEntree" }).as("effectif"),
    ])
    .where("etablissement.uai", "=", uai)
    .$call((q) => {
      if (cfd !== undefined && cfd.length > 0) {
        return q.where("formationEtablissement.cfd", "in", cfd);
      }
      return q;
    })
    .groupBy([
      "dataFormation.libelleFormation",
      "etablissement.uai",
      "etablissement.codeDepartement",
      "etablissement.commune",
      "etablissement.longitude",
      "etablissement.latitude",
      "etablissement.secteur",
      "etablissement.libelleEtablissement",
      "region.libelleRegion",
      "academie.libelleAcademie",
      "indicateurSortie.effectifSortie",
      "indicateurSortie.nbSortants",
      "indicateurSortie.nbPoursuiteEtudes",
      "indicateurSortie.nbInsertion6mois",
      "indicateurEntree.effectifs",
      "indicateurEntree.anneeDebut",
    ])
    .executeTakeFirst();
