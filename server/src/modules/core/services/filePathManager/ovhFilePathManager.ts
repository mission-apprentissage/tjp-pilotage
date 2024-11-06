import { FilePathManager } from "./filePathManager";

export const ovhFilePathManagerFactory = (): FilePathManager => {
  return {
    getIntentionFilePath: (id: string, filename: string = "") => {
      return `intentions/${id}/${filename}`;
    },
    getFranceTravailIndicateurTensionDepartementStatsFilePath: () => {
      return "files/tension_departement_rome.csv";
    },
    getFranceTravailIndicateurTensionRegionStatsFilePath: () => {
      return "files/tension_region_rome.csv";
    },
  };
};

export const ovhFilePathManager = ovhFilePathManagerFactory();
