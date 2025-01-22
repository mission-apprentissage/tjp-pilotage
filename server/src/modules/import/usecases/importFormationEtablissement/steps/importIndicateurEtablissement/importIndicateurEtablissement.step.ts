// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import type { IJDataWithValeurAjoutee } from "@/modules/import/services/inserJeunesApi/formatUaiData";

import { getUaiData } from "./getUaiData.dep";
import { upsertIndicateurEtablissement } from "./upsertIndicateurEtablissement.dep";

const toIndicateurEtablissement = ({
  uaiData,
  uai,
  millesime,
}: {
  uaiData: IJDataWithValeurAjoutee;
  millesime: string;
  uai: string;
}): Insertable<DB["indicateurEtablissement"]> => {
  return {
    uai: uai,
    millesime,
    valeurAjoutee: uaiData.valeur_ajoutee_6_mois,
  };
};

export const [importIndicateurEtablissement] = inject(
  {
    getUaiData,
    upsertIndicateurEtablissement,
  },
  (deps) =>
    async ({ uai, millesime }: { uai: string; millesime: string }) => {
      const ijUaiData = await deps.getUaiData({ uai, millesime, voie: "ensemble" });

      if(ijUaiData?.valeur_ajoutee_6_mois) {
        console.dir(ijUaiData, { depth: Infinity });
      }

      if(ijUaiData) {
        const indicateur = toIndicateurEtablissement({
          uaiData: ijUaiData as IJDataWithValeurAjoutee,
          millesime,
          uai,
        });
        await deps.upsertIndicateurEtablissement(indicateur);
      }
    }
);
