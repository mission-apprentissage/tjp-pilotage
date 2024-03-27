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
      "formationEtablissement.UAI",
      "etablissement.UAI"
    )
    .leftJoin(
      "indicateurEntree",
      "indicateurEntree.formationEtablissementId",
      "formationEtablissement.id"
    )
    .leftJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "formationEtablissement.dispositifId"
    )
    .leftJoin(
      "indicateurSortie",
      "indicateurSortie.formationEtablissementId",
      "formationEtablissement.id"
    )
    .distinct()
    .select((sb) => [
      sql<string[]>`array_agg(distinct ${sb.ref(
        "formationEtablissement.voie"
      )})`.as("voies"),
      sql<string[]>`array_agg(distinct ${sb.ref(
        "dispositif.libelleDispositif"
      )})`.as("libellesDispositifs"),
      "etablissement.UAI",
      "etablissement.codeDepartement",
      "etablissement.commune",
      "etablissement.longitude",
      "etablissement.latitude",
      "etablissement.secteur",
      "etablissement.libelleEtablissement",
      selectTauxPoursuite("indicateurSortie").as("tauxPoursuite"),
      selectTauxInsertion6mois("indicateurSortie").as("tauxInsertion"),
      effectifAnnee({ alias: "indicateurEntree" }).as("effectif"),
    ])
    .where("etablissement.UAI", "=", uai)
    .$call((q) => {
      if (cfd !== undefined && cfd.length > 0) {
        return q.where("formationEtablissement.cfd", "in", cfd);
      }
      return q;
    })
    .groupBy([
      "etablissement.UAI",
      "etablissement.codeDepartement",
      "etablissement.commune",
      "etablissement.longitude",
      "etablissement.latitude",
      "etablissement.secteur",
      "etablissement.libelleEtablissement",
      "indicateurSortie.effectifSortie",
      "indicateurSortie.nbSortants",
      "indicateurSortie.nbPoursuiteEtudes",
      "indicateurSortie.nbInsertion6mois",
      "indicateurEntree.effectifs",
      "indicateurEntree.anneeDebut",
    ])
    .executeTakeFirst();
