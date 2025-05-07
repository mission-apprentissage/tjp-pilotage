import type { FilePathManager } from "./filePathManager";

export const ovhFilePathManagerFactory = (): FilePathManager => {
  return {
    getLegacyIntentionFilePath: (id: string, filename: string = "") => {
      return `intentions/${id}/${filename}`;
    },
    getDemandeFilePath: (id: string, filename: string = "") => {
      return `demandes/${id}/${filename}`;
    },
    getFranceTravailIndicateurTensionDepartementStatsFilePath: () => {
      return "files/tension_rome_departement.csv";
    },
    getFranceTravailIndicateurTensionRegionStatsFilePath: () => {
      return "files/tension_rome_region.csv";
    },
    getFranceTravailIndicateurTensionStatsFilePath: () => {
      return "files/tension_rome.csv";
    },
  };
};

export const ovhFilePathManager = ovhFilePathManagerFactory();
