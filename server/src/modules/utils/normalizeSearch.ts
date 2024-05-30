export const getNormalizedSearch = (search?: string): string =>
  search?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ?? "";

export const getNormalizedSearchArray = (search?: string): Array<string> =>
  getNormalizedSearch(search).split(" ") ?? [];
