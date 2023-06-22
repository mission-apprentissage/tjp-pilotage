import { parse } from "csv-parse/sync";
import fs from "fs";

const overridesRef = fs.readFileSync(`${__dirname}/OVERRIDES.csv`, "utf-8");
const overridesData = parse(overridesRef, {
  columns: true,
  skip_empty_lines: true,
  delimiter: ";",
}) as { diplome: string; libelle: string; cfd?: string; rncp?: string }[];

export const overrides = overridesData.reduce(
  (acc, cur) => ({
    ...acc,
    [`${cur.diplome}_${cur.libelle}`]: { cfd: cur.cfd, rncp: cur.rncp },
  }),
  {} as Record<string, { cfd?: string; rncp?: string }>
);
