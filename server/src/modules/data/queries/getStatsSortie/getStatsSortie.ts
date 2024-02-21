import { CURRENT_IJ_MILLESIME } from "shared";

import { kdb } from "../../../../db/db";
import { notAnneeCommune } from "../../utils/notAnneeCommune";
import { notHistoriqueIndicateurRegionSortie } from "../../utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "../../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../../utils/tauxPoursuite";

const getStatsSortieBase = ({
  codeRegion,
  codeDepartement,
  codeNiveauDiplome,
  millesimeSortie = CURRENT_IJ_MILLESIME,
}: {
  codeRegion?: string | string[];
  codeDepartement?: string | string[];
  millesimeSortie?: string;
  codeNiveauDiplome?: string[];
}) => {
  const statsSortie = kdb
    .selectFrom("indicateurRegionSortie")
    .innerJoin(
      "formationScolaireView as formationView",
      "formationView.cfd",
      "indicateurRegionSortie.cfd"
    )
    .where((w) => {
      if (!codeRegion) return w.val(true);
      if (Array.isArray(codeRegion))
        return w("indicateurRegionSortie.codeRegion", "in", codeRegion);
      return w("indicateurRegionSortie.codeRegion", "=", codeRegion);
    })
    .$call((q) => {
      if (!codeDepartement?.length) return q;
      if (Array.isArray(codeDepartement))
        return q
          .innerJoin(
            "departement",
            "departement.codeRegion",
            "indicateurRegionSortie.codeRegion"
          )
          .where("departement.codeDepartement", "in", codeDepartement);
      return q
        .innerJoin(
          "departement",
          "departement.codeRegion",
          "indicateurRegionSortie.codeRegion"
        )
        .where("departement.codeDepartement", "=", codeDepartement);
    })
    .$call((q) => {
      if (!codeNiveauDiplome?.length) return q;
      return q.where(
        "formationView.codeNiveauDiplome",
        "in",
        codeNiveauDiplome
      );
    })
    .where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    .where(notAnneeCommune)
    .where(notHistoriqueIndicateurRegionSortie)
    .select([
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
    ]);

  return statsSortie;
};

export const getStatsSortieParNiveauDiplome = async ({
  codeRegion,
  codeNiveauDiplome,
  millesimeSortie = CURRENT_IJ_MILLESIME,
}: {
  codeRegion?: string[];
  millesimeSortie?: string;
  codeNiveauDiplome?: string[];
}) => {
  const statsSortie = await getStatsSortieBase({
    codeRegion,
    codeNiveauDiplome,
    millesimeSortie,
  })
    .select(["formationView.codeNiveauDiplome"])
    .groupBy("formationView.codeNiveauDiplome")
    .execute();

  return statsSortie.reduce(
    (acc, cur) => {
      acc[cur.codeNiveauDiplome] = {
        tauxInsertion: cur.tauxInsertion,
        tauxPoursuite: cur.tauxPoursuite,
      };
      return acc;
    },
    {} as Record<string, { tauxInsertion: number; tauxPoursuite: number }>
  );
};

export const getStatsSortieParRegionsEtNiveauDiplome = async ({
  codeRegion,
  codeNiveauDiplome,
  millesimeSortie = CURRENT_IJ_MILLESIME,
}: {
  codeRegion?: string | string[];
  codeNiveauDiplome?: string[];
  millesimeSortie?: string;
}) => {
  const statsSortie = await getStatsSortieBase({
    codeRegion,
    codeNiveauDiplome,
    millesimeSortie,
  })
    .select([
      "indicateurRegionSortie.codeRegion",
      "formationView.codeNiveauDiplome",
    ])
    .groupBy([
      "indicateurRegionSortie.codeRegion",
      "formationView.codeNiveauDiplome",
    ])
    .execute();

  return statsSortie.reduce(
    (acc, cur) => {
      acc[cur.codeRegion] = acc[cur.codeRegion] || {};
      acc[cur.codeRegion][cur.codeNiveauDiplome] = {
        tauxInsertion: cur.tauxInsertion,
        tauxPoursuite: cur.tauxPoursuite,
      };
      return acc;
    },
    {} as Record<
      string,
      Record<string, { tauxInsertion: number; tauxPoursuite: number }>
    >
  );
};

export const getStatsSortieParRegions = async ({
  codeRegion,
  codeDepartement,
  codeNiveauDiplome,
  millesimeSortie = CURRENT_IJ_MILLESIME,
}: {
  codeRegion?: string | string[];
  codeDepartement?: string | string[];
  codeNiveauDiplome?: string[];
  millesimeSortie?: string;
}) => {
  const statsSortie = await getStatsSortieBase({
    codeRegion,
    codeDepartement,
    codeNiveauDiplome,
    millesimeSortie,
  })
    .select(["indicateurRegionSortie.codeRegion"])
    .groupBy(["indicateurRegionSortie.codeRegion"])
    .execute();

  return statsSortie.reduce(
    (acc, cur) => {
      acc[cur.codeRegion] = {
        tauxInsertion: cur.tauxInsertion,
        tauxPoursuite: cur.tauxPoursuite,
      };
      return acc;
    },
    {} as Record<string, { tauxInsertion: number; tauxPoursuite: number }>
  );
};

export const getStatsSortie = async ({
  codeRegion,
  codeDepartement,
  codeNiveauDiplome,
  millesimeSortie = CURRENT_IJ_MILLESIME,
}: {
  codeRegion?: string | string[];
  codeDepartement?: string | string[];
  codeNiveauDiplome?: string[];
  millesimeSortie?: string;
}) => {
  const statsSortie = await getStatsSortieBase({
    codeRegion,
    codeDepartement,
    codeNiveauDiplome,
    millesimeSortie,
  }).executeTakeFirstOrThrow();

  return statsSortie;
};
