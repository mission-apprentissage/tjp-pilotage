// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";
import type { AnneeDispositif } from "@/modules/import/usecases/getCfdRentrees/getCfdRentrees.usecase";
import { inject } from "@/utils/inject";

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
    type: "BTS_attractivite_capacite",
    year: rentreeScolaire,
    filter: {
      MEFSTAT11: mefstat,
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
        mefstat: anneesDispositif[anneeDebut]?.mefstat ?? "",
        uai,
        rentreeScolaire,
      });

      if (lines.length == 0) return { capacites: [], premiersVoeux: [] };

      const numbers: {
        capacite: number | undefined;
        premiersVoeux: number | undefined;
      } = {
        capacite: undefined,
        premiersVoeux: undefined,
      };

      lines.forEach((line) => {
        const rawCapacite = line.CAPACITEPSUP;
        const rawPremiersVoeux = line.NB_VOEUX_CONFIRMES;
        // Parfois la capacité est indiquée à 0 ou 999 pour signifier quelle est manquante
        if (rawCapacite && rawCapacite !== "0" && rawCapacite !== "999") {
          if (!numbers.capacite) numbers.capacite = 0;
          numbers.capacite += parseInt(rawCapacite);
        }

        if (rawPremiersVoeux) {
          if (!numbers.premiersVoeux) numbers.premiersVoeux = 0;
          numbers.premiersVoeux += parseInt(rawPremiersVoeux);
        }
      });

      return {
        capacites: anneeDebut === 0 ? [numbers.capacite ?? null] : [null, numbers.capacite ?? null],
        premiersVoeux: anneeDebut === 0 ? [numbers.premiersVoeux ?? null] : [null, numbers.premiersVoeux ?? null],
      };
    }
);
