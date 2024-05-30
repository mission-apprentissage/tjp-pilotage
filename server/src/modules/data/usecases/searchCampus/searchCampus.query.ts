import { cleanNull } from "../../../../utils/noNull";
import { searchInArray } from "../../../utils/searchHelpers";
import { CAMPUS } from "./campusData";

export const searchCampusQuery = async ({ search }: { search: string }) => {
  const campuss = searchInArray(CAMPUS, search);

  return cleanNull(campuss.map((campus) => ({ value: campus, label: campus })));
};
