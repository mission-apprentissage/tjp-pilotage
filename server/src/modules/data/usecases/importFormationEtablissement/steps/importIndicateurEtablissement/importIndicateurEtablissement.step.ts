import { inject } from "injecti";
import { Insertable } from "kysely";

import { DB } from "../../../../../../db/schema";
import { R } from "../../../../services/inserJeunesApi/formatUaiData";
import { getUaiData } from "./getUaiData.dep";
import { upsertIndicateurEtablissement } from "./upsertIndicateurEtablissement.dep";

const toIndicateurEtablissement = ({
  deppEtablissement,
  uai,
  millesime,
}: {
  deppEtablissement?: R;
  millesime: string;
  uai: string;
}): Insertable<DB["indicateurEtablissement"]> | undefined => {
  if (!deppEtablissement) return;
  return {
    UAI: uai,
    millesime,
    valeurAjoutee: deppEtablissement.ensemble?.valeur_ajoutee_6_mois,
  };
};

export const [importIndicateurEtablissement] = inject(
  {
    getUaiData,
    upsertIndicateurEtablissement,
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
