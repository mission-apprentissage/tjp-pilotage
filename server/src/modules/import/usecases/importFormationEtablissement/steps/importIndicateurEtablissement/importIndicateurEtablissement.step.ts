import { inject } from "injecti";
import { Insertable } from "kysely";

import { DB } from "../../../../../../db/db";
import { IJUaiData } from "../../../../services/inserJeunesApi/formatUaiData";
import { getUaiData } from "./getUaiData.dep";
import { upsertIndicateurEtablissement } from "./upsertIndicateurEtablissement.dep";

const toIndicateurEtablissement = ({
  uaiData,
  uai,
  millesime,
}: {
  uaiData?: IJUaiData;
  millesime: string;
  uai: string;
}): Insertable<DB["indicateurEtablissement"]> | undefined => {
  if (!uaiData) return;
  return {
    uai: uai,
    millesime,
    valeurAjoutee: uaiData.ensemble?.valeur_ajoutee_6_mois,
  };
};

export const [importIndicateurEtablissement] = inject(
  {
    getUaiData,
    upsertIndicateurEtablissement,
  },
  (deps) =>
    async ({ uai, millesime }: { uai: string; millesime: string }) => {
      const ijUaiData = await deps.getUaiData({ uai, millesime });
      const indicateur = toIndicateurEtablissement({
        uaiData: ijUaiData,
        millesime,
        uai,
      });
      if (!indicateur) return;
      await deps.upsertIndicateurEtablissement(indicateur);
    }
);
