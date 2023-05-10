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

export const importIndicateurEtablissementFactory =
  ({
    getUaiData = dependencies.getUaiData,
    upsertIndicateurEtablissement = dependencies.upsertIndicateurEtablissement,
  }) =>
  async ({ uai, millesime }: { uai: string; millesime: string }) => {
    const ijData = await getUaiData({ uai, millesime });
    const indicateur = toIndicateurEtablissement({
      deppEtablissement: ijData,
      millesime,
      uai,
    });
    if (!indicateur) return;
    await upsertIndicateurEtablissement(indicateur);
  };
