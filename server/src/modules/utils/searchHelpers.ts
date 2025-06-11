export const getNormalizedSearch = (search?: string): string =>
  search?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ?? "";

export const getNormalizedSearchArray = (search?: string): Array<string> =>
  getNormalizedSearch(search).split(" ") ?? [];

export const searchInArray = (array: Array<string>, search: string): Array<string> => {
  const formatSearch = getNormalizedSearch(search).toLowerCase();

  return array.filter((value) => getNormalizedSearch(value).toLowerCase().includes(formatSearch));
};
