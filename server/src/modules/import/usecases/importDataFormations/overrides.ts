import fs from "node:fs";

import { parse } from "csv-parse/sync";

import { getStaticFilePath } from "@/utils/getStaticFilePath";

const overridesRef = fs.readFileSync(
  getStaticFilePath(`./import/usecases/importDataFormations/OVERRIDES.csv`),
  "utf-8"
);
const overridesData = parse(overridesRef, {
  columns: true,
  skip_empty_lines: true,
  delimiter: ";",
}) as {
  Diplôme: string;
  Libellé: string;
  "Code RNCP"?: string;
  "Code diplôme"?: string;
  "Commission professionnelle consultative"?: string;
  Secteur?: string;
  "Sous-secteur"?: string;
}[];

export const overrides = overridesData.reduce(
  (acc, cur) => ({
    ...acc,
    [`${cur.Diplôme}_${cur.Libellé}`]: cur,
  }),
  {} as Record<string, (typeof overridesData)[number]>
);
