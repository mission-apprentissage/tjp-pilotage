import fs from "fs";

import { kdb } from "../../../../db/db";
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

export const findAllRegions = (filter?: string) =>
  kdb
    .selectFrom("region")
    .where((eb) =>
      eb.and([eb("region.codeRegion", "not in", ["00", "99", "06"])])
    )
    .$call((q) => {
      if (!filter) {
        return q;
      }

      return q.where("codeRegion", "ilike", `%${filter}%`);
    })
    .select(["codeRegion"])
    .orderBy("codeRegion", "asc")
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
