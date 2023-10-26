import { kdb } from "../../../../db/db";
import { notHistoriqueIndicateurRegionSortie } from "../../queries/utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "../../queries/utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../../queries/utils/tauxPoursuite";

export const getRegionStats = async ({
  codeRegion,
  codeAcademie,
  codeDepartement,
  codeDiplome,
  millesimeSortie = "2020_2021",
}: {
  codeRegion?: string;
  codeAcademie?: string;
  codeDepartement?: string;
  codeDiplome?: string[];
  millesimeSortie?: string;
}) => {
  const statsSortie = await kdb
    .selectFrom("indicateurRegionSortie")
    .innerJoin(
      "formation",
      "formation.codeFormationDiplome",
      "indicateurRegionSortie.cfd"
    )

    .where((w) => {
      if (!codeRegion) return w.val(true);
      return w("indicateurRegionSortie.codeRegion", "=", codeRegion);
    })
    .$call((q) => {
      if (!codeDepartement && !codeAcademie) {
        return q;
      }
      return q
        .innerJoin(
          "departement",
          "departement.codeRegion",
          "indicateurRegionSortie.codeRegion"
        )
        .where((w) => {
          if (!codeAcademie) return w.val(true);
          return w("departement.codeAcademie", "=", codeAcademie);
        })
        .where((w) => {
          if (!codeDepartement) return w.val(true);
          return w("departement.codeDepartement", "=", codeDepartement);
        });
    })

    .$call((q) => {
      if (!codeDiplome?.length) return q;
      return q.where("formation.codeNiveauDiplome", "in", codeDiplome);
    })
    .where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    .where(notHistoriqueIndicateurRegionSortie)
    .select([
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
    ])
    .executeTakeFirstOrThrow();

  return statsSortie;
};
