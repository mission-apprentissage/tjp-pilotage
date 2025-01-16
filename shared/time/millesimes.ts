export const MILLESIMES_IJ = ["2019_2020", "2020_2021", "2021_2022", "2022_2023"];

export const MILLESIMES_IJ_REG = ["2019_2020", "2020_2021", "2021_2022", "2022_2023"];

export const MILLESIMES_IJ_ETAB = ["2020_2021", "2021_2022", "2022_2023"];

export const RENTREES_SCOLAIRES = ["2020", "2021", "2022", "2023", "2024"];

export const getMillesimeFromCampagne = (campagne: string) => {
  const rentreeScolaire = parseInt(campagne);
  return `${rentreeScolaire - 3}_${rentreeScolaire - 2}`;
};
