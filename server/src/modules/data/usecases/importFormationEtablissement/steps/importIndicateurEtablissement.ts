import { IndicateurEtablissement } from "../../../entities/IndicateurEtablissement";
import { R } from "../../../services/inserJeunesApi/formatUaiData";
import { dependencies } from "../dependencies.di";
import { MILLESIMES } from "../domain/millesimes";

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

export const importIndicateurEtablissementFactory =
  ({
    getUaiData = dependencies.getUaiData,
    upsertIndicateurEtablissement = dependencies.upsertIndicateurEtablissement,
  }) =>
  async ({ uai }: { uai: string }) => {
    for (const millesime of MILLESIMES) {
      const ijData = await getUaiData({ uai, millesime });
      const indicateur = toIndicateurEtablissement({
        deppEtablissement: ijData,
        millesime,
        uai,
      });
      if (!indicateur) continue;
      await upsertIndicateurEtablissement(indicateur);
    }
  };
