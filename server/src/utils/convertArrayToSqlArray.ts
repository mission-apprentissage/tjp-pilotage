export const convertArrayToSqlArray = (array: string[] | number[]): string =>
  `{${array.map((value) => JSON.stringify(value.toString())).join(", ")}}`;
