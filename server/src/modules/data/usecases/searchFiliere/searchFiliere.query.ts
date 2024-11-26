import { searchInArray } from "@/modules/utils/searchHelpers";
import { cleanNull } from "@/utils/noNull";

import { FILIERES_CMQ } from "./filiereCmqData";

export const searchFiliereQuery = async ({ search }: { search: string }) => {
  const filieres = searchInArray(FILIERES_CMQ, search);

  return cleanNull(filieres.map((filiere) => ({ value: filiere, label: filiere })));
};
