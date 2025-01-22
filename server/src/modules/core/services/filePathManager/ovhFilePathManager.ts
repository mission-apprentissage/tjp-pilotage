import type { FilePathManager } from "./filePathManager";

export const ovhFilePathManagerFactory = (): FilePathManager => {
  return {
    getIntentionFilePath: (id: string, filename: string = "") => {
      return `intentions/${id}/${filename}`;
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
    getIJRegionDataFilePath: () => {
      return "files/ij_region_data.csv";
    },
    getIJUaiDataFilePath: () => {
      return "files/ij_uai_data.csv";
    },
  };
};

export const ovhFilePathManager = ovhFilePathManagerFactory();
