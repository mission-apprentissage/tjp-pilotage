import { rawDataRepository } from "../../../repositories/rawData.repository";
import { CfdRentrees } from "../../getCfdRentrees/getCfdRentrees.usecase";
export const getIndicateursAffelnetFactory =
  ({ findRawData = rawDataRepository.findRawData }) =>
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
    const {
      "Capacité  carte scolaire": rawCapacite,
      "Demandes vœux 1": rawPremierVoeux,
    } =
      (await findRawData({
        type: "attractivite_capacite",
        filter: {
          "MEF STAT 11": dispositifRentrees.annees[anneeDebut].mefstat,
          "Etablissement d'accueil": dispositifRentrees.uai,
        },
      })) ?? {};

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
  };
