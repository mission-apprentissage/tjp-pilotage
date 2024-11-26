import { getNormalizedSearch } from "./normalizeSearch";

export const searchInArray = (array: Array<string>, search: string): Array<string> => {
  const formatSearch = getNormalizedSearch(search).toLowerCase();

  return array.filter((value) => getNormalizedSearch(value).toLowerCase().includes(formatSearch));
};
