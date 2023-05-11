import { inject } from "injecti";

import { IndicateurEtablissement } from "../../../entities/IndicateurEtablissement";
import { R } from "../../../services/inserJeunesApi/formatUaiData";
import { dependencies } from "../dependencies.di";

const toIndicateurEtablissement = ({
  deppEtablissement,
  uai,
  millesime,
}: {
  deppEtablissement: R;
  millesime: string;
  uai: string;
}): IndicateurEtablissement | undefined => {
  if (!deppEtablissement) return;
  return {
    UAI: uai,
    millesime,
    valeurAjoutee: deppEtablissement.ensemble?.valeur_ajoutee_6_mois,
  };
};

export const [importIndicateurEtablissement] = inject(
  {
    getUaiData: dependencies.getUaiData,
    upsertIndicateurEtablissement: dependencies.upsertIndicateurEtablissement,
  },
  (deps) =>
    async ({ uai, millesime }: { uai: string; millesime: string }) => {
      const ijData = await deps.getUaiData({ uai, millesime });
      const indicateur = toIndicateurEtablissement({
        deppEtablissement: ijData,
        millesime,
        uai,
      });
      if (!indicateur) return;
      await deps.upsertIndicateurEtablissement(indicateur);
    }
);
