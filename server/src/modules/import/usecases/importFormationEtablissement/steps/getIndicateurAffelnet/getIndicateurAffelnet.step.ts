import { inject } from "injecti";

import { rawDataRepository } from "../../../../repositories/rawData.repository";
import { AnneeDispositif } from "../../../getCfdRentrees/getCfdRentrees.usecase";

const findAttractiviteCapaciteHorsBTS = async ({
  mefstat,
  uai,
  rentreeScolaire,
}: {
  mefstat: string;
  uai: string;
  rentreeScolaire: string;
}) => {
  if (
    await rawDataRepository.findRawData({
      type: "lyceesACCE",
      filter: {
        secteur_public_prive: "PR",
        numero_uai: uai,
      },
    })
  ) {
    return [];
  }

  return rawDataRepository.findRawDatas({
    type: "attractivite_capacite",
    year: rentreeScolaire,
    filter: {
      "MEF STAT 11": mefstat,
      "Etablissement d'accueil": uai,
      "Statut Offre de formation": "ST",
      "Voeu de recensement O/N": "N",
    },
  });
};

export const [getIndicateursAffelnet] = inject(
  { findAttractiviteCapaciteHorsBTS },
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
      const lines = await deps.findAttractiviteCapaciteHorsBTS({
        mefstat: anneesDispositif[anneeDebut]?.mefstat ?? "",
        uai,
        rentreeScolaire,
      });

      if (lines.length === 0) {
        return { capacites: [], premiersVoeux: [] };
      }

      const {
        "Capacité carte scolaire": rawCapacite,
        "Demandes vœux 1": rawPremierVoeux,
      } = lines.reduce(
        (sum, line) => {
          sum["Capacité carte scolaire"] += parseInt(
            line["Capacité carte scolaire"]
          );
          sum["Demandes vœux 1"] += parseInt(line["Demandes vœux 1"]);
          return sum;
        },
        {
          "Capacité carte scolaire": 0,
          "Demandes vœux 1": 0,
        }
      );

      /**
       * On met ici rawCapacite < 500 puisque parfois, lorsque la capacité n'est pas disponible
       * elle est renseignée à un nombre arbitraire très élevé (900, 999, 1000, ...) dans le CSV
       * source.
       */
      const capacite =
        rawCapacite && rawCapacite >= 5 && rawCapacite <= 500
          ? rawCapacite
          : undefined;
      const premiersVoeux = rawPremierVoeux ? rawPremierVoeux : undefined;

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
