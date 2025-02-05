import { CURRENT_ANNEE_CAMPAGNE } from "./CURRENT_ANNEE_CAMPAGNE";
import { FIRST_ANNEE_CAMPAGNE } from "./FIRST_ANNEE_CAMPAGNE";

export function rentreeScolaireCampagnes(
  premiereAnneeCampagne = FIRST_ANNEE_CAMPAGNE,
  derniereAnneeCampagne= CURRENT_ANNEE_CAMPAGNE) {

  const startYear = parseInt(premiereAnneeCampagne) + 1;
  const endYear = parseInt(derniereAnneeCampagne) + 1;

  return Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => (startYear + i).toString()
  );
}
