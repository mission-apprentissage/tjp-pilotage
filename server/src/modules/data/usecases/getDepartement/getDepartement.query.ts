import * as Boom from "@hapi/boom";
import { sql } from "kysely";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";

import { getKbdClient } from "@/db/db";
import { effectifAnnee } from "@/modules/data/utils/effectifAnnee";
import { isInPerimetreIJDepartement } from "@/modules/data/utils/isInPerimetreIJ";
import { isScolaireIndicateurRegionSortie } from "@/modules/data/utils/isScolaire";
import { notAnneeCommuneIndicateurRegionSortie } from "@/modules/data/utils/notAnneeCommune";
import { selectTauxDevenirFavorableAgg } from "@/modules/data/utils/tauxDevenirFavorable";
import { selectTauxInsertion6moisAgg } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "@/modules/data/utils/tauxPoursuite";
import { selectTauxRemplissageAgg } from "@/modules/data/utils/tauxRemplissage";
import { cleanNull } from "@/utils/noNull";

export const getDepartementStats = async ({
  codeDepartement,
  codeNiveauDiplome,
  rentreeScolaire = CURRENT_RENTREE,
  millesimeSortie = CURRENT_IJ_MILLESIME,
}: {
  codeDepartement: string;
  codeNiveauDiplome?: string[];
  rentreeScolaire?: string;
  millesimeSortie?: string;
}) => {
  const informationsDepartement = await getKbdClient()
    .selectFrom("departement")
    .where("codeDepartement", "=", codeDepartement)
    .select(["codeRegion", "libelleDepartement"])
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.badRequest(`Code département invalide : ${codeDepartement}`);
    });

  const statsSortie = await getKbdClient()
    .selectFrom("indicateurRegionSortie")
    .innerJoin("formationScolaireView as formationView", "formationView.cfd", "indicateurRegionSortie.cfd")
    .innerJoin("departement", "indicateurRegionSortie.codeRegion", "departement.codeRegion")
    .where("departement.codeDepartement", "=", codeDepartement)
    .where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    .where(isScolaireIndicateurRegionSortie)
    .where(notAnneeCommuneIndicateurRegionSortie)
    .$call((q) => {
      if (!codeNiveauDiplome?.length) return q;
      return q.where("formationView.codeNiveauDiplome", "in", codeNiveauDiplome);
    })
    .select([
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
      selectTauxDevenirFavorableAgg("indicateurRegionSortie").as("tauxDevenirFavorable"),
    ])
    .executeTakeFirst();

  const baseStatsEntree = getKbdClient()
    .selectFrom("formationScolaireView as formationView")
    .innerJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
    .innerJoin("formationEtablissement", "formationEtablissement.cfd", "formationView.cfd")
    .innerJoin("indicateurEntree", (join) =>
      join
        .onRef("indicateurEntree.formationEtablissementId", "=", "formationEtablissement.id")
        .on("rentreeScolaire", "=", rentreeScolaire)
    )
    .innerJoin("etablissement", "etablissement.uai", "formationEtablissement.uai")
    .innerJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .innerJoin("departement", (join) => join.onRef("departement.codeDepartement", "=", "etablissement.codeDepartement"))
    .where(isInPerimetreIJDepartement)
    .where("departement.codeDepartement", "=", codeDepartement)
    .where((w) => {
      if (!codeNiveauDiplome?.length) {
        return w.val(true);
      }

      return w("formationView.codeNiveauDiplome", "in", codeNiveauDiplome);
    });

  const effectifTotal = await baseStatsEntree
    .select((eb) => [
      eb.ref("departement.codeDepartement").as("codeDepartement"),
      eb.ref("formationView.codeNiveauDiplome").as("codeNiveauDiplome"),
      sql<number>`sum(coalesce((effectifs->>0)::integer,0)) + sum(coalesce((effectifs->>1)::integer,0)) + sum(coalesce((effectifs->>2)::integer,0))`.as(
        "effectifTotal"
      ),
    ])
    .groupBy(["departement.codeDepartement", "formationView.codeNiveauDiplome"])
    .executeTakeFirst()
    .then(cleanNull);

  const statsEntree = await baseStatsEntree
    .where("formationView.cfd", "not in", (eb) => eb.selectFrom("familleMetier").select("cfdFamille"))
    .select((eb) => [
      eb.ref("departement.codeRegion").as("codeRegion"),
      eb.ref("departement.codeDepartement").as("codeDepartement"),
      eb.ref("departement.libelleDepartement").as("libelleDepartement"),
      eb.ref("formationView.codeNiveauDiplome").as("codeNiveauDiplome"),
      eb.ref("libelleNiveauDiplome").as("libelleNiveauDiplome"),
      sql<number>`COUNT(distinct CONCAT("formationEtablissement"."cfd", "formationEtablissement"."codeDispositif"))`.as(
        "nbFormations"
      ),
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})
      `.as("effectifEntree"),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
    ])
    .groupBy([
      "departement.codeRegion",
      "departement.codeDepartement",
      "departement.libelleDepartement",
      "niveauDiplome.libelleNiveauDiplome",
      "formationView.codeNiveauDiplome",
    ])
    .executeTakeFirst()
    .then(cleanNull);

  return {
    ...informationsDepartement,
    ...statsEntree,
    ...statsSortie,
    ...effectifTotal,
  };
};
