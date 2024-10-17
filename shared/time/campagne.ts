import { CURRENT_RENTREE } from "./CURRENT_RENTREE";

export const getCampagneFromRentreeScolaire = (rentreeScolaire?: string) => {
  return "" + (parseInt(rentreeScolaire ?? CURRENT_RENTREE) + 1);
};
