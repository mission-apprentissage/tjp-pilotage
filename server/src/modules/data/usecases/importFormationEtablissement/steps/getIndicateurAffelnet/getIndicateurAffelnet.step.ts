import { inject } from "injecti";

import { rawDataRepository } from "../../../../repositories/rawData.repository";
import { AnneeDispositif } from "../../../getCfdRentrees/getCfdRentrees.usecase";

const findAttractiviteCapacite = async ({
  mefstat,
  uai,
  rentreeScolaire,
}: {
  mefstat: string;
  uai: string;
  rentreeScolaire: string;
}) => {
  return rawDataRepository.findRawDatas({
    type: "attractivite_capacite",
    year: rentreeScolaire,
    filter: {
      "MEF STAT 11": mefstat,
      "Etablissement d'accueil": uai,
      "Statut  Offre de formation": "ST",
      "Voeu de recensement  O/N": "N",
    },
    limit: 2,
  });
};

export const [getIndicateursAffelnet] = inject(
  { findAttractiviteCapacite },
  (deps) =>
    async ({
      //dispositifRentrees,
      anneesDispositif,
      uai,
      anneeDebut,
      rentreeScolaire,
    }: {
      anneesDispositif: Record<string, AnneeDispositif>;
      uai: string;
      anneeDebut: number;
      rentreeScolaire: string;
    }): Promise<{
      capacites: (number | null)[];
      premiersVoeux: (number | null)[];
    }> => {
      const lines = await deps.findAttractiviteCapacite({
        mefstat: anneesDispositif[anneeDebut].mefstat,
        uai,
        rentreeScolaire,
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
