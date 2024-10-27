// @ts-nocheck -- TODO
import { CURRENT_IJ_MILLESIME } from "shared";

import { getKbdClient } from "@/db/db";
import { isScolaireIndicateurRegionSortie } from "@/modules/data/utils/isScolaire";
import { notAnneeCommune } from "@/modules/data/utils/notAnneeCommune";
import { selectTauxInsertion6moisAgg } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "@/modules/data/utils/tauxPoursuite";

const getStatsSortieBase = ({
  codeRegion,
  codeNiveauDiplome,
  millesimeSortie = CURRENT_IJ_MILLESIME,
}: {
  codeRegion?: string | string[];
  millesimeSortie?: string;
  codeNiveauDiplome?: string[];
}) => {
  const statsSortie = getKbdClient()
    .selectFrom("indicateurRegionSortie")
    // @ts-expect-error
    .innerJoin("formationScolaireView as formationView", "formationView.cfd", "indicateurRegionSortie.cfd")
    // @ts-expect-error
    .where((w) => {
      if (!codeRegion) return w.val(true);
      if (Array.isArray(codeRegion)) return w("indicateurRegionSortie.codeRegion", "in", codeRegion);
      return w("indicateurRegionSortie.codeRegion", "=", codeRegion);
    })
    .$call((q) => {
      if (!codeNiveauDiplome?.length) return q;
      return q.where("formationView.codeNiveauDiplome", "in", codeNiveauDiplome);
    })
    .where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    .where(isScolaireIndicateurRegionSortie)
    .where(notAnneeCommune)
    .select([
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
    ]);

  return statsSortie;
};

export const getStatsSortieParNiveauDiplomeQuery = async ({
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

export const getStatsSortieParRegionsEtNiveauDiplomeQuery = async ({
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
    .select(["indicateurRegionSortie.codeRegion", "formationView.codeNiveauDiplome"])
    .groupBy(["indicateurRegionSortie.codeRegion", "formationView.codeNiveauDiplome"])
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
    {} as Record<string, Record<string, { tauxInsertion: number; tauxPoursuite: number }>>
  );
};

export const getStatsSortieParRegionsQuery = async ({
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

export const getStatsSortieQuery = async ({
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
  }).executeTakeFirstOrThrow();

  return statsSortie;
};
