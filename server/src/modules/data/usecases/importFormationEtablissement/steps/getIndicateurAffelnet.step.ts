import { rawDataRepository } from "../../../repositories/rawData.repository";
import { CfdRentrees } from "../../getCfdRentrees/getCfdRentrees.usecase";
export const getIndicateursAffelnetFactory =
  () =>
  async ({
    isSpecialite,
    dispositifRentrees,
  }: {
    isSpecialite: boolean;
    dispositifRentrees: CfdRentrees;
  }): Promise<{ capacite?: number }> => {
    if (isSpecialite) {
      if (!dispositifRentrees.annees[1]) {
        console.log(dispositifRentrees);
      }
      const affelnet1ere = await rawDataRepository.findRawData({
        type: "affelnet1PROspe",
        filter: {
          "Etablissement d'accueil": dispositifRentrees.uai,
          "Libellé du MEF national de rattachement":
            dispositifRentrees.annees[1].libelle,
          "Statut Offre de formation": "ST",
        },
      });

      const rawCapacite = affelnet1ere?.["Capacité carte scolaire"];
      return {
        capacite: parseInt(rawCapacite) || undefined,
      };
    }

    const affelnet2nde = await rawDataRepository.findRawData({
      type: "affelnet2nde",
      filter: {
        ID_ETAB: dispositifRentrees.uai,
        CO_MEFSTAT: dispositifRentrees.annees[0].mefstat,
        CO_STA: "ST",
      },
    });

    const rawCapacite = affelnet2nde?.VAL_CARSCO;
    const capacite = rawCapacite === "999" ? "" : rawCapacite;
    return {
      capacite: parseInt(capacite) || undefined,
    };
  };
