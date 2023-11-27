import { inject } from "injecti";

import { rawDataRepository } from "../../../../repositories/rawData.repository";
import { AnneeDispositif } from "../../../getCfdRentrees/getCfdRentrees.usecase";

const findAttractiviteCapaciteBTS = async ({
  mefstat,
  uai,
  rentreeScolaire,
}: {
  mefstat: string;
  uai: string;
  rentreeScolaire: string;
}) =>
  rawDataRepository.findRawDatas({
    type: "attractivite_capacite_BTS",
    year: rentreeScolaire,
    filter: {
      "MEFSTAT11 rectifié": mefstat,
      UAI: uai,
      STATUT: "Scolaire",
    },
    limit: 2,
  });

export const [getIndicateursParcoursSup] = inject(
  {
    findAttractiviteCapaciteBTS,
  },
  (deps) =>
    async ({
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
      const lines = await deps.findAttractiviteCapaciteBTS({
        mefstat: anneesDispositif[anneeDebut].mefstat,
        uai,
        rentreeScolaire,
      });
      if (lines.length !== 1) return { capacites: [], premiersVoeux: [] };

      const {
        CAPACITEPSUP: rawCapacite,
        NB_VOEUX_CONFIRMES: rawPremiersVoeux,
      } = lines[0];

      const capacite =
        rawCapacite && rawCapacite !== "0" && rawCapacite !== "999"
          ? parseInt(rawCapacite)
          : undefined;
      const premiersVoeux = rawPremiersVoeux
        ? parseInt(rawPremiersVoeux)
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
