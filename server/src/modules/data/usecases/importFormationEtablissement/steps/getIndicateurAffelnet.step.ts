import { inject } from "injecti";

import { rawDataRepository } from "../../../repositories/rawData.repository";
import { CfdRentrees } from "../../getCfdRentrees/getCfdRentrees.usecase";

export const [getIndicateursAffelnet] = inject(
  { findRawDatas: rawDataRepository.findRawDatas },
  (deps) =>
    async ({
      dispositifRentrees,
      anneeDebut,
    }: {
      dispositifRentrees: CfdRentrees;
      anneeDebut: number;
    }): Promise<{
      capacites: (number | null)[];
      premiersVoeux: (number | null)[];
    }> => {
      const lines = await deps.findRawDatas({
        type: "attractivite_capacite",
        filter: {
          "MEF STAT 11": dispositifRentrees.annees[anneeDebut].mefstat,
          "Etablissement d'accueil": dispositifRentrees.uai,
          "Statut  Offre de formation": "ST",
          "Voeu de recensement  O/N": "N",
        },
        limit: 2,
      });
      if (lines.length !== 1) return { capacites: [], premiersVoeux: [] };

      const {
        "Capacité  carte scolaire": rawCapacite,
        "Demandes vœux 1": rawPremierVoeux,
      } = lines[0];

      const capacite =
        rawCapacite && rawCapacite !== "0" && rawCapacite !== "999"
          ? parseInt(rawCapacite)
          : undefined;
      const premiersVoeux = rawPremierVoeux
        ? parseInt(rawPremierVoeux)
        : undefined;

      return {
        capacites:
          anneeDebut === 0 ? [capacite ?? null] : [null, capacite ?? null],
        premiersVoeux:
          anneeDebut === 0
            ? [premiersVoeux ?? null]
            : [null, premiersVoeux ?? null],
      };
    }
);
