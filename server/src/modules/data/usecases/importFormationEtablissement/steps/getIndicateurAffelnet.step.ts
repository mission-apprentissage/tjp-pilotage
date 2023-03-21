import { rawDataRepository } from "../../../repositories/rawData.repository";
export const getIndicateursAffelnetFactory =
  () =>
  async ({
    isSpecialite,
    uai,
    mefstat11FirstYear,
    libelleDebut,
  }: {
    isSpecialite: boolean;
    uai: string;
    mefstat11FirstYear: string;
    libelleDebut: string;
  }): Promise<{ capacite?: number }> => {
    if (isSpecialite) {
      const affelnet1ere = await rawDataRepository.findRawData({
        type: "affelnet1PROspe",
        filter: {
          "Etablissement d'accueil": uai,
          "Libellé du MEF national de rattachement": libelleDebut,
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
        ID_ETAB: uai,
        CO_MEFSTAT: mefstat11FirstYear,
        CO_STA: "ST",
      },
    });

    const rawCapacite = affelnet2nde?.VAL_CARSCO;
    const capacite = rawCapacite === "999" ? "" : rawCapacite;
    return {
      capacite: parseInt(capacite) || undefined,
    };
  };
