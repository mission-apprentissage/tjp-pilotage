import { searchInArray } from "@/modules/utils/searchHelpers";
import { cleanNull } from "@/utils/noNull";

import { CAMPUS } from "./campusData";

export const searchCampusQuery = async ({ search }: { search: string }) => {
  const campuss = searchInArray(CAMPUS, search);

  return cleanNull(campuss.map((campus) => ({ value: campus, label: campus })));
};
