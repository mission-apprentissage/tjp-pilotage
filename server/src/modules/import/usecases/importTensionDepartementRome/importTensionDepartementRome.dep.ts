import fs from "fs";
import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { notPerimetreIJDepartement } from "../../../data/utils/notPerimetreIJ";
import { FranceTravailStatsPerspectiveRecrutementValeurParPeriode } from "../../services/franceTravail/franceTravailResponse";

export const findAllRomeCodes = (filter?: string) =>
  kdb
    .selectFrom("rome")
    .select("codeRome")
    .$call((q) => {
      if (!filter) {
        return q;
      }

      return q.where("codeRome", "ilike", `%${filter}%`);
    })
    .orderBy("codeRome", "asc")
    .distinct()
    .execute();

export const findAllDepartements = (filter?: string) =>
  kdb
    .selectFrom("departement")
    .where(notPerimetreIJDepartement)
    .$call((q) => {
      if (!filter) {
        return q;
      }

      return q.where("codeDepartement", "ilike", `%${filter}%`);
    })
    .select(({ ref }) => [
      sql<string>`RIGHT(${ref("codeDepartement")}, 2)`.as("codeDepartement"),
    ])
    .orderBy("codeDepartement", "asc")
    .distinct()
    .execute();

export const createFranceTravailTensionFile = async (filepath: string) => {
  if (fs.existsSync(filepath)) {
    fs.truncateSync(filepath);
  } else {
    fs.writeFileSync(filepath, "");
  }
  const file = fs.createWriteStream(filepath);

  file.write(
    `datMaj;codeTypeTerritoire;codeTerritoire;libTerritoire;codeTypeActivite;codeActivite;libActivite;codeNomenclature;libNomenclature;codeTypePeriode;codePeriode;libPeriode;valeurPrincipaleNom\n`
  );

  return file;
};

export const appendFranceTravailTensionFile = async (
  filepath: string,
  data: FranceTravailStatsPerspectiveRecrutementValeurParPeriode[]
) => {
  const file = fs.createWriteStream(filepath, { flags: "a" });
  data.map((item) =>
    file.write(
      [
        item.datMaj,
        item.codeTypeTerritoire,
        item.codeTerritoire,
        item.libTerritoire,
        item.codeTypeActivite,
        item.codeActivite,
        item.libActivite,
        item.codeNomenclature,
        item.libNomenclature,
        item.codeTypePeriode,
        item.codePeriode,
        item.libPeriode,
        item.valeurPrincipaleNom,
      ].join(";") + "\n"
    )
  );
};

export const importFranceTravailDeps = {
  findAllRomeCodes,
  findAllDepartements,
  createFranceTravailTensionFile,
};
